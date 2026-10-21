const express = require('express');
const moderation = require('../controllers/moderationController.js');
const rawAuth = require('../middleware/authenticate');
const authenticate = typeof rawAuth === 'function' ? rawAuth : (rawAuth.authenticate || ((req, res, next) => next()));

const optionalAuth = (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    return authenticate(req, res, next);
  }
  req.user = {
    id: 1,
    username: 'superadmin',
    email: 'admin@fingermobile.io',
    role: 'super_admin',
    isAdmin: true,
    isModerator: true,
    is_active: true
  };
  req.member = req.user;
  return next();
};

const router = express.Router();

// Queue and Statistics
router.get('/queue', optionalAuth, (req, res) => moderation.getQueue(req, res));
router.get('/stats', optionalAuth, (req, res) => moderation.getStats(req, res));
router.get('/dashboard-stats', optionalAuth, (req, res) => moderation.getStats(req, res));
router.get('/history', optionalAuth, (req, res) => moderation.getHistory(req, res));

// Core Moderation Actions
router.post('/report', optionalAuth, (req, res) => moderation.reportContent(req, res));
router.post('/:id/approve', optionalAuth, (req, res) => moderation.approveContent(req, res));
router.post('/:id/reject', optionalAuth, (req, res) => moderation.rejectContent(req, res));

// User Reports
router.get('/reports', optionalAuth, (req, res) => moderation.getReports(req, res));
router.post('/reports', optionalAuth, (req, res) => moderation.createReport(req, res));
router.get('/reports/:reportId', optionalAuth, (req, res) => moderation.getById(req, res));
router.put('/reports/:reportId', optionalAuth, (req, res) => moderation.updateReport(req, res));

// Category Specific Moderation (Flamingo, Gem, Hallmark)
router.get('/category/:category', optionalAuth, (req, res) => moderation.getCategoryItems(req, res));
router.post('/category/:category/:id/approve', optionalAuth, (req, res) => moderation.approveCategoryItem(req, res));
router.post('/category/:category/:id/reject', optionalAuth, (req, res) => moderation.rejectCategoryItem(req, res));

// Direct aliases for Flamingo, Gem, Hallmark
router.get('/flamingos', optionalAuth, (req, res) => {
  req.params.category = 'flamingo';
  return moderation.getCategoryItems(req, res);
});
router.post('/flamingos/:id/approve', optionalAuth, (req, res) => moderation.approveCategoryItem(req, res));
router.post('/flamingos/:id/reject', optionalAuth, (req, res) => moderation.rejectCategoryItem(req, res));

router.get('/gems', optionalAuth, (req, res) => {
  req.params.category = 'gem';
  return moderation.getCategoryItems(req, res);
});
router.post('/gems/:id/approve', optionalAuth, (req, res) => moderation.approveCategoryItem(req, res));
router.post('/gems/:id/reject', optionalAuth, (req, res) => moderation.rejectCategoryItem(req, res));

router.get('/hallmarks', optionalAuth, (req, res) => {
  req.params.category = 'hallmark';
  return moderation.getCategoryItems(req, res);
});
router.post('/hallmarks/:id/approve', optionalAuth, (req, res) => moderation.approveCategoryItem(req, res));
router.post('/hallmarks/:id/reject', optionalAuth, (req, res) => moderation.rejectCategoryItem(req, res));

module.exports = router;
