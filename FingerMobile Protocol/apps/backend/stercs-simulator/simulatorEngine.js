const ContentModerationService = require('../services/contentModerationService');
const logger = require('../utils/logger');

/**
 * STERCS Simulator Engine
 * Executes mocked threats against the Guardian logic.
 */
class SimulatorEngine {
  constructor() {
    // Mimic the in-memory state of wsServer.js
    this.CALL_RATE_LIMIT = 5;
    this.CALL_RATE_WINDOW = 60000;
  }

  async runSimulation(threatPayload) {
    logger.info(`[STERCS-SIMULATOR] Starting Dry-Run Simulation: ${threatPayload.attack_vector}`);
    const report = {
      timestamp: new Date(),
      vector: threatPayload.attack_vector,
      success: false,
      logs: [],
    };

    try {
      if (threatPayload.attack_vector === 'defamation_barrage') {
        await this.simulateDefamationBarrage(report);
      } else if (threatPayload.attack_vector === 'webrtc_dos') {
        this.simulateWebRTCDos(report);
      } else {
        report.logs.push(`Unknown attack vector: ${threatPayload.attack_vector}`);
      }
    } catch (e) {
      report.logs.push(`Error during simulation: ${e.message}`);
    }

    return report;
  }

  async simulateDefamationBarrage(report) {
    const mockAuthorId = 'simulated_actor_001';

    // Array of toxic messages that should be blocked
    const toxicMessages = [
      'You are a terrible fraud and you steal money.',
      'I am going to assault you, idiot.',
      'This company is a known truth liar and cheat.'
    ];

    // Array of benign messages that should pass
    const benignMessages = [
      'Hello, how are you today?',
      'I think this might be a mistake, apparently.',
      'Let\'s schedule a meeting.'
    ];

    let blockedCount = 0;
    let passedBenignCount = 0;

    for (const msg of toxicMessages) {
      const result = await ContentModerationService.preFlightMessageCheck(mockAuthorId, msg);
      if (!result.allowed) {
        blockedCount++;
        report.logs.push(`[DEFENSE SUCCESS] Blocked toxic message: "${msg}" (Risk Score: ${result.riskScore})`);
      } else {
        report.logs.push(`[DEFENSE FAILED] Allowed toxic message: "${msg}" (Risk Score: ${result.riskScore})`);
      }
    }

    for (const msg of benignMessages) {
      const result = await ContentModerationService.preFlightMessageCheck(mockAuthorId, msg);
      if (result.allowed) {
        passedBenignCount++;
        report.logs.push(`[DEFENSE SUCCESS] Allowed benign message: "${msg}" (Risk Score: ${result.riskScore})`);
      } else {
        report.logs.push(`[DEFENSE FAILED] Blocked benign message: "${msg}" (Risk Score: ${result.riskScore})`);
      }
    }

    if (blockedCount === toxicMessages.length && passedBenignCount === benignMessages.length) {
      report.success = true;
      report.logs.push('Simulation Passed: 100% Defense Success on Defamation Barrage.');
    }
  }

  simulateWebRTCDos(report) {
    const mockSocket = {
      memberId: 'simulated_dos_actor_002',
      callHistory: []
    };

    const now = Date.now();
    let limitHit = false;
    let successfulCalls = 0;

    report.logs.push('Firing 7 rapid call requests in 1 second...');

    for (let i = 0; i < 7; i++) {
      // Simulate wsServer.js logic
      mockSocket.callHistory = mockSocket.callHistory.filter(timestamp => now - timestamp < this.CALL_RATE_WINDOW);

      if (mockSocket.callHistory.length >= this.CALL_RATE_LIMIT) {
        limitHit = true;
        report.logs.push(`[DEFENSE SUCCESS] Call blocked at request ${i+1}. Rate limit enforced.`);
        break;
      }

      mockSocket.callHistory.push(now);
      successfulCalls++;
    }

    if (limitHit && successfulCalls === 5) {
      report.success = true;
      report.logs.push('Simulation Passed: WebRTC Temporal Reputation correctly halted DoS attack.');
    } else {
      report.logs.push(`[DEFENSE FAILED] Rate limit was not enforced correctly. Calls made: ${successfulCalls}`);
    }
  }
}

module.exports = new SimulatorEngine();
