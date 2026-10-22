const express = require('express');
const router = express.Router();
const controller = require('../controllers/userManagementController.js');
const rawAuth = require('../middleware/authenticate');
const authenticate = typeof rawAuth === 'function' ? rawAuth : (rawAuth.authenticate || ((req, res, next) => next()));

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authenticate(req, res, next);
  }
  return next();
};

const adminController = require('../controllers/adminController.js');

router.get('/', optionalAuth, (req, res) => adminController.getUsers(req, res));
router.get('/list', optionalAuth, (req, res) => adminController.getUsers(req, res));
router.get('/profile', optionalAuth, controller.getProfile);
router.get('/profile/:userId', optionalAuth, controller.getProfile);
router.put('/profile', optionalAuth, controller.updateProfile);
router.post('/profile', optionalAuth, controller.updateProfile);
router.post('/profile/enhancement', optionalAuth, controller.enhanceProfile);
router.post('/profile/enhance', optionalAuth, controller.enhanceProfile);
router.put('/settings', optionalAuth, controller.updateSettings);
router.get('/:id/ces', controller.getCES);

module.exports = router;
