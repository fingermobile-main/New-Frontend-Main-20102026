const express = require('express');
const memberprofiles = require('../controllers/memberprofilesController.js');
const { authenticate, optionalAuthenticate } = require('../middleware/authenticate');
const router = express.Router();

// Synchronize profile across web/mobile client and PostgreSQL ledger
router.post('/sync', authenticate, memberprofiles.syncProfile);
router.post('/:id/sync', authenticate, memberprofiles.syncProfile);
router.get('/sync', authenticate, memberprofiles.getSyncStatus);
router.get('/:id/sync', authenticate, memberprofiles.getSyncStatus);

// Profile by user ID
router.get('/:id', optionalAuthenticate, memberprofiles.getById);
router.post('/', authenticate, memberprofiles.create);
router.put('/:id', authenticate, memberprofiles.update);
router.delete('/:id', authenticate, memberprofiles.delete);

// Follow / Unfollow
router.post('/:userId/follow', authenticate, memberprofiles.follow);
router.delete('/:userId/unfollow', authenticate, memberprofiles.unfollow);
router.get('/:userId/followers', optionalAuthenticate, memberprofiles.getFollowers);
router.get('/:userId/following', optionalAuthenticate, memberprofiles.getFollowing);

// Account Settings, Privacy Controls, Security Settings
router.get('/:id/account-settings', authenticate, memberprofiles.getAccountSettings);
router.put('/:id/account-settings', authenticate, memberprofiles.updateAccountSettings);
router.get('/:id/privacy-controls', authenticate, memberprofiles.getPrivacyControls);
router.put('/:id/privacy-controls', authenticate, memberprofiles.updatePrivacyControls);
router.put('/:id/privacy-controls/:contentType', authenticate, memberprofiles.updatePrivacyControls);
router.get('/:id/security-settings', authenticate, memberprofiles.getSecuritySettings);
router.put('/:id/security-settings', authenticate, memberprofiles.updateSecuritySettings);
router.get('/:id/login-history', authenticate, memberprofiles.getLoginHistory);

module.exports = router;
