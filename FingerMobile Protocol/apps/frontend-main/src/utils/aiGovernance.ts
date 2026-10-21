import React, {} from 'react';
import type {
  AIGovernanceConfig
} from '../types';
import defaultConfig from '../config/aiGovernance';

interface AIGovernanceDecision {allowed: boolean;
  reason?: string;
  policyId?: string;
  sanitizedPayload?: Record<string,
  unknown>;
}

export interface AIGovernanceEvent {id: string; type: string;
  action: string;
  policyId: string;
  timestamp: string;
  actor?: string; details: Record<string,
  unknown>;
}

function compileRedaction(patterns?: string[]): RegExp[] {
  if (!patterns || patterns.length === 0) return [];
  return patterns.map((p) => {
    try {
      return new RegExp(p, 'gi');
    } catch {
      return new RegExp('^$', 'g');
    }
  });
}

function redactString(input: string, rules: RegExp[],
): {output: string; redacted: boolean } {
  let redacted = false;
  let output = input;
  for (const rx of rules) {
    const before = output;
    output = output.replace(rx, '[REDACTED]');
    if (!redacted && before !== output) redacted = true;
  }
  return { output, redacted };
}

export async function logGovernanceEvent(event: AIGovernanceEvent, cfg: AIGovernanceConfig = defaultConfig,
): Promise<void> {
  const dest = cfg?.policies?.[event.policyId]?.audit?.destination;
  const shouldLog = cfg?.policies?.[event.policyId]?.audit?.logEvents;
  if (!shouldLog) return;
  try {
    // Basic console audit for local dev; extend with real endpoint if needed
    // console.info('[AI Governance Event]', event);
    if (dest && dest.startsWith('http')) {
      await fetch(dest, {method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      }).catch(() => undefined);
    }
  } catch {
    // swallow logging errors
  }
}

export function enforceAction(action: string, payload: Record<string, unknown>,
  opts?: {
    config?: AIGovernanceConfig;
    consents?: Record<string, boolean>;
    actor?: string;
  },
): AIGovernanceDecision {
  const cfg = opts?.config ?? defaultConfig;
  const policyId = cfg.defaultPolicyId;
  const policy = cfg.policies[policyId];

  const eventBase: Omit<AIGovernanceEvent, 'id'> = {type: 'policy_check',
    action,
    policyId,
    timestamp: new Date().toISOString(), actor: opts?.actor,
    details: {}
  };

  // Check banned actions
  if (policy?.bannedActions?.includes(action)) {
    const decision: AIGovernanceDecision = {allowed: false, reason: 'Action is banned by policy',
      policyId
    };
    void logGovernanceEvent(
      {id: cryptoRandomId(),
        ...eventBase, type: 'action_block', details: { reason: decision.reason } },
      cfg,
    );
    return decision;
  }

  // Check allowed actions
  if (policy && !policy.allowedActions.includes(action)) {
    const decision: AIGovernanceDecision = {allowed: false, reason: 'Action not permitted by policy',
      policyId
    };
    void logGovernanceEvent(
      {id: cryptoRandomId(),
        ...eventBase, type: 'action_block', details: { reason: decision.reason } },
      cfg,
    );
    return decision;
  }

  // Consent check
  const needConsent = !!policy?.requireExplicitConsent;
  const hasConsent = opts?.consents?.[policyId] === true;
  if (needConsent && !hasConsent) {
    const decision: AIGovernanceDecision = {allowed: false, reason: 'Explicit consent required',
      policyId
    };
    void logGovernanceEvent(
      {id: cryptoRandomId(),
        ...eventBase, type: 'consent', details: { granted: false } },
      cfg,
    );
    return decision;
  }

  // Redaction
  const patterns = policy?.dataHandling?.redactionPatterns ?? [];
  const rxRules = compileRedaction(patterns);
  let redactionApplied = false;

  // Only redact string fields in payload
  const sanitizedPayload = Object.fromEntries(
    Object.entries(payload).map(([k, v]) => {
      if (typeof v === 'string' && rxRules.length) {
        const { output, redacted } = redactString(v, rxRules);
        if (redacted) redactionApplied = true;
        return [k, output];
      }
      return [k, v];
    }),
  );

  if (redactionApplied) {
    void logGovernanceEvent(
      {id: cryptoRandomId(),
        ...eventBase, type: 'redaction', details: { fields: Object.keys(payload) } },
      cfg,
    );
  }

  const decision: AIGovernanceDecision = {allowed: true,
    policyId,
    sanitizedPayload
  };

  void logGovernanceEvent(
    {id: cryptoRandomId(),
      ...eventBase, type: 'action_allow', details: { redactionApplied } },
    cfg,
  );
  return decision;
}

function cryptoRandomId(): string {
  try {
    const bytes = new Uint8Array(12);
    (
      globalThis.crypto ||
      (typeof window !== 'undefined' ? window.crypto : undefined)
    )?.getRandomValues?.(bytes);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

