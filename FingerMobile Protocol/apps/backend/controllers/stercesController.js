/**
 * STERCS (Strategic Tactical Enterprise Resource Control SYSTEM™️©️®️)
 * PRO-MPTS (Protocol and Manipulation System ™️©️®️)
 *
 * Implements the Tripartite Security Code System and Guardian Protection features
 */

const {
  authenticateSTERCS,
  triggerEmergencyKillSwitch,
  freezePlatform,
  rebootPlatform,
  getGuardianStatus,
  sendGuardianAlert,
  logSecurityEvent
} = require('../middleware/guardianProtection');

const crypto = require('crypto');
const nodemailer = require('nodemailer'); // For sending PIN codes via email
const logger = require('../utils/logger');

// Pin code storage (in production, use Redis or database)
const activePinCodes = new Map();
const sessionTokens = new Map();

// Generate a secure random PIN code
const generatePinCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit PIN
};

// Generate a secure session token
const generateSessionToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Email transporter configuration (using environment variables)
const getTransporter = () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && typeof nodemailer.createTransport === 'function') {
    try {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
    } catch {
      return null;
    }
  }
  return null;
};

// Send PIN code to email
const sendPinCode = async (email, pinCode, purpose) => {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      // If email credentials are not configured, log for testing purposes
      console.log('PIN CODE for ' + email + ' (' + purpose + '): ' + pinCode);
      return true;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'FingerMobile Guardian System - ' + purpose + ' PIN Code',
      text: 'Your Guardian System ' + purpose + ' PIN Code is: ' + pinCode + '\n\nThis code expires in 10 minutes.'
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending PIN code:', error);
    logger.error('Error sending PIN code:', error);
    return false;
  }
};

// Step 1: Request First PIN Code
exports.requestFirstPin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for requesting first PIN code.'
      });
    }

    // Check if email is in authorized list
    const authorizedEmails = [
      'fingermobileprotocol@gmail.com',
      'obinnambah100@gmail.com'
    ];

    if (!authorizedEmails.includes(email)) {
      await logSecurityEvent('STERCS_UNAUTHORIZED_ACCESS', 'Unauthorized PIN request from: ' + email, 'high', req);
      return res.status(403).json({
        success: false,
        message: 'Email is not authorized for STERCS access.'
      });
    }

    // Generate and store first PIN
    const firstPin = generatePinCode();
    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes

    activePinCodes.set(firstPin, {
      email,
      purpose: 'first_pin',
      timestamp: Date.now(),
      expiration: expirationTime,
      validated: false
    });

    // Send first PIN to the requesting email
    const pinSent = await sendPinCode(email, firstPin, 'First Validation');

    if (!pinSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send PIN code. Please try again.'
      });
    }

    // After successful first PIN validation, send second PIN to backup emails
    setTimeout(async () => {
      if (activePinCodes.has(firstPin) && activePinCodes.get(firstPin).validated) {
        const backupEmails = [
          'gracelinkbustech@gmail.com',
          'obinnambah100@fingermobileprotocol.com'
        ];

        for (const backupEmail of backupEmails) {
          const backupPin = generatePinCode();
          activePinCodes.set(backupPin, {
            email: backupEmail,
            purpose: 'backup_validation',
            timestamp: Date.now(),
            expiration: Date.now() + 10 * 60 * 1000,
            validated: false
          });

          await sendPinCode(backupEmail, backupPin, 'Backup Validation');
        }
      }
    }, 100); // Small delay to ensure first PIN is processed

    await logSecurityEvent('STERCS_FIRST_PIN_REQUESTED', 'First PIN code requested for: ' + email, 'info', req);

    res.status(200).json({
      success: true,
      message: 'First PIN code sent to your email. Check your inbox.',
      email: email
    });
  } catch (error) {
    logger.error('Error requesting first PIN:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during PIN request.'
    });
  }
};

// Step 2: Validate First PIN and Issue Session Token
exports.validateFirstPin = async (req, res) => {
  try {
    const { pinCode, email } = req.body;

    if (!pinCode || !email) {
      return res.status(400).json({
        success: false,
        message: 'PIN code and email are required for validation.'
      });
    }

    // Check if PIN exists and is valid
    if (!activePinCodes.has(pinCode)) {
      await logSecurityEvent('STERCS_INVALID_PIN', 'Invalid PIN code attempted: ' + pinCode, 'high', req);
      return res.status(400).json({
        success: false,
        message: 'Invalid PIN code.'
      });
    }

    const pinInfo = activePinCodes.get(pinCode);

    // Check if PIN is expired
    if (Date.now() > pinInfo.expiration) {
      activePinCodes.delete(pinCode);
      return res.status(400).json({
        success: false,
        message: 'PIN code has expired. Please request a new one.'
      });
    }

    // Check if PIN matches the email
    if (pinInfo.email !== email) {
      await logSecurityEvent('STERCS_EMAIL_MISMATCH', 'Email mismatch for PIN: ' + pinCode, 'high', req);
      return res.status(400).json({
        success: false,
        message: 'Email does not match the PIN code.'
      });
    }

    // Validate the PIN
    pinInfo.validated = true;

    // Generate session token for this validation
    const sessionToken = generateSessionToken();
    sessionTokens.set(sessionToken, {
      email: pinInfo.email,
      validated: true,
      timestamp: Date.now(),
      expiration: Date.now() + 30 * 60 * 1000 // 30 minutes
    });

    await logSecurityEvent('STERCS_FIRST_PIN_VALIDATED', 'First PIN validated for: ' + email, 'info', req);

    res.status(200).json({
      success: true,
      message: 'First PIN validated successfully. Session token generated.',
      sessionToken,
      backupValidationRequired: true
    });
  } catch (error) {
    logger.error('Error validating first PIN:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during PIN validation.'
    });
  }
};

// Step 3: Validate Backup PIN Codes
exports.validateBackupPins = async (req, res) => {
  try {
    const { pinCodes, emails } = req.body; // Array of backup PIN codes and corresponding emails

    if (!pinCodes || !emails || !Array.isArray(pinCodes) || !Array.isArray(emails)) {
      return res.status(400).json({
        success: false,
        message: 'Backup PIN codes and emails arrays are required.'
      });
    }

    if (pinCodes.length !== emails.length) {
      return res.status(400).json({
        success: false,
        message: 'PIN codes and emails arrays must have the same length.'
      });
    }

    // Validate each backup PIN
    for (let i = 0; i < pinCodes.length; i++) {
      const pinCode = pinCodes[i];
      const email = emails[i];

      if (!activePinCodes.has(pinCode)) {
        await logSecurityEvent('STERCS_BACKUP_INVALID_PIN', 'Invalid backup PIN: ' + pinCode, 'high', req);
        return res.status(400).json({
          success: false,
          message: 'Invalid backup PIN code: ' + pinCode
        });
      }

      const pinInfo = activePinCodes.get(pinCode);

      // Check if PIN is expired
      if (Date.now() > pinInfo.expiration) {
        activePinCodes.delete(pinCode);
        return res.status(400).json({
          success: false,
          message: 'Backup PIN code ' + (i + 1) + ' has expired.'
        });
      }

      // Check if PIN matches the email
      if (pinInfo.email !== email) {
        await logSecurityEvent('STERCS_BACKUP_EMAIL_MISMATCH', 'Backup email mismatch for PIN: ' + pinCode, 'high', req);
        return res.status(400).json({
          success: false,
          message: 'Email does not match backup PIN code ' + (i + 1) + '.'
        });
      }

      // Validate the backup PIN
      pinInfo.validated = true;
    }

    await logSecurityEvent('STERCS_BACKUP_PINS_VALIDATED', 'Backup PINs validated successfully', 'info', req);

    res.status(200).json({
      success: true,
      message: 'Backup PIN codes validated successfully. Proceed to Super Admin Dashboard.',
      superAdminAccessGranted: true
    });
  } catch (error) {
    logger.error('Error validating backup PINs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during backup PIN validation.'
    });
  }
};

// Step 4: Trigger MFA and Biometric Verification
exports.triggerMfaAndBiometric = async (req, res) => {
  try {
    // In a real implementation, this would trigger MFA to the phone number
    // and initiate facial biometric verification
    // For now, we'll simulate this with a verification token

    const phoneNumber = '+2348088855752'; // Obinna's phone number
    const biometricToken = generateSessionToken();

    // In real implementation, this would send an SMS/MFA code to the phone
    console.log('MFA code sent to: ' + phoneNumber);
    console.log('Biometric verification initiated for: MBAH ISRAEL OBINNA');

    await logSecurityEvent('STERCS_MFA_TRIGGERED', 'MFA and biometric verification initiated', 'info', req);

    res.status(200).json({
      success: true,
      message: 'MFA sent to phone and biometric verification initiated.',
      phoneNumber,
      biometricToken,
      biometricChallenge: 'Facial recognition challenge prepared'
    });
  } catch (error) {
    logger.error('Error triggering MFA and biometric:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during MFA/biometric process.'
    });
  }
};

// Step 5: Execute Kill Switch Actions
exports.executeKillSwitchAction = async (req, res) => {
  try {
    const { action, reason, validatedBy } = req.body;

    if (!action || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Action and reason are required for kill switch execution.'
      });
    }

    // Validate that the request is coming from an authorized source
    // This would normally check session tokens and validations completed
    const authorized = req.user && req.user.role === 'superadmin';

    if (!authorized) {
      await logSecurityEvent('STERCS_KILL_SWITCH_UNAUTHORIZED', 'Unauthorized kill switch attempt: ' + action, 'critical', req);
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to execute kill switch actions.'
      });
    }

    let result;

    switch (action.toLowerCase()) {
    case 'reboot':
      result = await rebootPlatform(reason, validatedBy, req);
      break;
    case 'freeze':
      result = await freezePlatform(reason, validatedBy, req);
      break;
    case 'emergency_kill':
      result = await triggerEmergencyKillSwitch(reason, validatedBy, req);
      break;
    case 'countdown_start':
      // Start a 25-hour countdown
      // In a real implementation, this would set a timer that executes an action after 25 hours
      result = {
        success: true,
        message: '25-hour countdown initiated. Action will execute if not cancelled.',
        countdownId: generateSessionToken(),
        endTime: new Date(Date.now() + 25 * 60 * 60 * 1000) // 25 hours from now
      };
      break;
    case 'cancel_all':
      // Cancel all pending actions
      result = {
        success: true,
        message: 'All pending actions cancelled successfully.'
      };
      break;
    default:
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Valid actions: reboot, freeze, emergency_kill, countdown_start, cancel_all'
      });
    }

    await logSecurityEvent('STERCS_' + action.toUpperCase(), 'Kill switch action executed: ' + action, 'critical', req);

    res.status(200).json(result);
  } catch (error) {
    logger.error('Error executing kill switch action:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during kill switch execution.'
    });
  }
};

// Get Guardian Status
exports.getGuardianStatus = async (req, res) => {
  try {
    const status = await getGuardianStatus();
    res.status(200).json({
      success: true,
      status
    });
  } catch (error) {
    logger.error('Error getting guardian status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error retrieving guardian status.'
    });
  }
};

// Emergency Kill Switch Activation
exports.activateEmergencyKillSwitch = async (req, res) => {
  try {
    const { reason } = req.body;
    const triggeredBy = req.user ? req.user.email : 'System';

    // Allow this endpoint to be called even during emergency situations
    const result = await triggerEmergencyKillSwitch(
      reason || 'Emergency kill switch activated from dashboard',
      triggeredBy,
      req
    );

    res.status(200).json(result);
  } catch (error) {
    logger.error('Error activating emergency kill switch:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error activating emergency kill switch.'
    });
  }
};

// Countdown Timer Management
exports.manageCountdownTimer = async (req, res) => {
  try {
    const { action, countdownId } = req.body;

    switch (action) {
    case 'start': {
      // Start a new countdown
      const countdownEndTime = new Date(Date.now() + 25 * 60 * 60 * 1000); // 25 hours
      // In a real implementation, this would set up a scheduled job
      console.log('Countdown timer started, will execute at: ' + countdownEndTime);

      res.status(200).json({
        success: true,
        message: '25-hour countdown timer started',
        countdownId: generateSessionToken(),
        endTime: countdownEndTime
      });
      break;
    }

    case 'cancel':
      // Cancel the countdown
      console.log('Countdown timer cancelled: ' + countdownId);

      res.status(200).json({
        success: true,
        message: 'Countdown timer cancelled successfully'
      });
      break;

    default:
      res.status(400).json({
        success: false,
        message: 'Invalid action. Valid actions: start, cancel'
      });
    }
  } catch (error) {
    logger.error('Error managing countdown timer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error managing countdown timer.'
    });
  }
};

// Option 2: Secondary Authorization
exports.secondaryAuthorization = async (req, res) => {
  try {
    const { authorizedPerson, _action, firstPin } = req.body; // Using underscore prefix to indicate unused variable

    // Validate first PIN
    if (!firstPin || !activePinCodes.has(firstPin) || !activePinCodes.get(firstPin).validated) {
      return res.status(400).json({
        success: false,
        message: 'Valid first PIN is required for secondary authorization.'
      });
    }

    // Check if the authorized person is in the approved list
    const approvedPersons = [
      { name: 'MRS. EUNICE MBAH', phone: '08033924846', email: 'philipatiks@yahoo.com' },
      { name: 'MSS: MERCY KULEM', phone: '07035821077', email: 'mercykulem11@gmail.com' }
    ];

    const personExists = approvedPersons.some(person =>
      person.name === authorizedPerson.name ||
      person.phone === authorizedPerson.phone ||
      person.email === authorizedPerson.email
    );

    if (!personExists) {
      await logSecurityEvent('STERCS_SECONDARY_UNAUTHORIZED', 'Unauthorized secondary activation attempt: ' + JSON.stringify(authorizedPerson), 'high', req);
      return res.status(403).json({
        success: false,
        message: 'Person not authorized for secondary STERCS activation.'
      });
    }

    await logSecurityEvent('STERCS_SECONDARY_AUTHORIZED', 'Secondary authorization granted to: ' + authorizedPerson.name, 'info', req);

    res.status(200).json({
      success: true,
      message: 'Secondary authorization granted. Can proceed with STERCS actions.',
      authorized: true
    });
  } catch (error) {
    logger.error('Error in secondary authorization:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during secondary authorization.'
    });
  }
};
