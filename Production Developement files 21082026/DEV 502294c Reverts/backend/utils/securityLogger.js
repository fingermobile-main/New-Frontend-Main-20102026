const { identityDb } = require("../db");

/**
 * Log a security event to the database
 * @param {Object} eventData - The security event data
 * @param {string} eventData.memberId - ID of the member associated with the event
 * @param {string} eventData.eventType - Type of security event
 * @param {string} eventData.ipAddress - IP address of the request
 * @param {string} eventData.memberAgent - Member agent string
 * @param {boolean} eventData.success - Whether the operation was successful
 * @param {string} eventData.severity - Severity level (LOW, MEDIUM, HIGH, CRITICAL)
 * @param {string} eventData.description - Description of the event
 * @param {string} eventData.sourceModule - Module where the event occurred
 * @param {Object} eventData.details - Additional details about the event
 */
async function logSecurityEvent({
  memberId,
  eventType,
  ipAddress,
  memberAgent,
  success,
  severity,
  description,
  sourceModule,
  details
}) {
  try {
    await identityDb.query(
      `INSERT INTO security_events 
       (member_id, event_type, ip_address, member_agent, success, severity, description, source_module, details) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        memberId,
        eventType,
        ipAddress,
        memberAgent,
        success,
        severity,
        description,
        sourceModule,
        details
      ],
    );
  } catch (error) {
    console.error("Failed to log security event:", error);
  }
}

/**
 * Log authentication attempt
 */
async function logAuthenticationAttempt(
  memberId,
  membername,
  ipAddress,
  success,
  failureReason,
  memberAgent,
) {
  await logSecurityEvent({
    memberId: memberId,
    eventType: "authentication_attempt",
    ipAddress: ipAddress,
    memberAgentmembermberAgent,
    success: success,
    severity: success ? "LOW" : "HIGH",
    description: `Authentication ${success ? "successful" : "failed"} for member '${membername}'`,
    sourceModule: "AuthenticationSystem",
    details: {
      membername: membername,
      success: success,
      failure_reason: failureReason
    }
  });
}

/**
 * Log session creation
 */
async function logSessionCreation(memberId, sessionId, ipAddress, memberAgent) {
  // In a real implementation, we would hash the sessionId for security
  await logSecurityEvent({
    memberId: memberId,
    eventType: "session_created",
    ipAddress: ipAddress,
    memberAgentmembermberAgent,
    success: true,
    severity: "LOW",
    description: `New session created for member ${memberId}`,
    sourceModule: "SessionManager",
    details: {
      member_id: memberId,
      session_id: sessionId.substring(0, 16) + "...", // Truncate for security
      ip_address: ipAddress,
      member_agentmembermberAgent
    }
  });
}

/**
 * Log session termination
 */
async function logSessionTermination(memberId, sessionId, reason) {
  await logSecurityEvent({
    memberId: memberId,
    eventType: "session_terminated",
    ipAddress: null,
    memberAgent: null,
    success: true,
    severity: reason === "timeout" ? "MEDIUM" : "LOW",
    description: `Session terminated for member ${memberId}`,
    sourceModule: "SessionManager",
    details: {
      member_id: memberId,
      session_id: sessionId.substring(0, 16) + "...", // Truncate for security
      reason: reason
    }
  });
}

/**
 * Log 2FA event
 */
async function log2FAEvent(memberId, eventType, success, method) {
  const severity = success ? "LOW" : "HIGH";
  const description = `2FA ${eventType} ${success ? "successful" : "failed"} for member ${memberId}`;

  await logSecurityEvent({
    memberId: memberId,
    eventType: `2fa_${eventType}`,
    ipAddress: null,
    memberAgent: null,
    success: success,
    severity: severity,
    description: description,
    sourceModule: "TwoFactorAuthSystem",
    details: {
      member_id: memberId,
      method: method,
      success: success
    }
  });
}

/**
 * Log security setting change
 */
async function logSecuritySettingChange(
  memberId,
  settingName,
  oldValue,
  newValue,
) {
  await logSecurityEvent({
    memberId: memberId,
    eventType: "security_setting_changed",
    ipAddress: null,
    memberAgent: null,
    success: true,
    severity: "MEDIUM",
    description: `Security setting '${settingName}' changed for member ${memberId}`,
    sourceModule: "SecuritySettingsManager",
    details: {
      member_id: memberId,
      setting_name: settingName,
      old_value: oldValue,
      new_value: newValue
    }
  });
}

module.exports = {
  logSecurityEvent,
  logAuthenticationAttempt,
  logSessionCreation,
  logSessionTermination,
  log2FAEvent,
  logSecuritySettingChange
};
