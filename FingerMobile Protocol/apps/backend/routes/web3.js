const express = require('express');
const router = express.Router();
const web3Controller = require('../controllers/web3Controller');
const { authenticate } = require('../middleware/authenticate');

// Optional auth wrapper
const optionalAuth = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    return authenticate(req, res, (err) => {
      // Allow proceeding even if token is absent/invalid for anonymous signature verification
      next();
    });
  }
  next();
};

/**
 * GET /api/web3/nonce
 * Retrieve a cryptographic challenge nonce for MetaMask signing
 */
router.get('/nonce', web3Controller.getNonce);

/**
 * POST /api/web3/verify
 * Cryptographically verify an EIP-1193 personal_sign signature and bind wallet
 */
router.post('/verify', optionalAuth, web3Controller.verifySignature);

/**
 * GET /api/web3/wallets
 * List authenticated Web3 wallets for active session
 */
router.get('/wallets', optionalAuth, web3Controller.getWallets);

/**
 * DELETE /api/web3/wallets/:address
 * Unlink a connected Web3 wallet
 */
router.delete('/wallets/:address', optionalAuth, web3Controller.unlinkWallet);

module.exports = router;

