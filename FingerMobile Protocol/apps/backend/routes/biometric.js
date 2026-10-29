/* eslint-disable no-unused-vars */
const express = require('express');
const biometric = require('../controllers/biometricController.js');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

// WebAuthn Passkey Options (for Registration and Login)
router.post('/auth-options', biometric.getBiometricOptions);
router.post('/register-options', biometric.getBiometricOptions);
router.post('/biometric-options', biometric.getBiometricOptions);
router.get('/options', biometric.getBiometricOptions);

// WebAuthn Verification & Token Assertion (Sign-In & Verification)
router.post('/auth-verify', biometric.verifyBiometricAuth);
router.post('/biometric-verify', biometric.verifyBiometricAuth);
router.post('/verify', biometric.verifyBiometricAuth);

// Hardware Credential Registration
router.post('/register-verify', biometric.verifyBiometricRegistration);
router.post('/register', biometric.verifyBiometricRegistration);

// Face Login & Liveness Endpoints
router.post('/identify-1toN', biometric.identify1toN);
router.post('/verify-1to1', biometric.verify1to1);
router.post('/enroll', biometric.enrollFace);
router.post('/authenticate', biometric.verifyBiometricAuth);

// Credential Lifecycle & Status
router.delete('/remove', biometric.removeBiometric);
router.get('/status', biometric.getStatus);

module.exports = router;
