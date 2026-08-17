export const aiGovernanceConfig = {version: "1.0.0",
  defaultPolicyId: "code_generation",
  policies: {
  code_generation: {
  id: "code_generation",
  name: "Code Generation Policy",
  description:
        "Controls AI-driven code changes with privacy and audit guarantees.",
  allowedActions: ["code_generation", "explain_code", "refactor_safe"],
  bannedActions: ["exfiltrate_data", "disable_security_controls"],
  requireExplicitConsent: true,
  dataHandling: {
  piiRedaction: true,
  allowSensitiveCategories: ["non-personal"],
  redactionPatterns: [
          // emails
          new RegExp(
            String.raw`([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)`,
  ),
  // phone numbers (simple patterns)
          new RegExp(
            String.raw`(\+?\d{1,3}[\s-]?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4})`,
          ),
          // wallet addresses (generic hex strings)
          new RegExp(String.raw`(0x[a-fA-F0-9]{40})`)
        ]
      },
audit: {logEvents: true,
  retentionDays: 90,
  destination: ",
  mcp://governance/events"
      }
    }
  }
};
export default aiGovernanceConfig;
