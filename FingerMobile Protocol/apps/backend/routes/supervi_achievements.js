const express = require('express');
const supervi_achievements = require('../controllers/supervi_achievementsController.js');
const router = express.Router();

router.get('/health', (req, res) => supervi_achievements.getAchievements(req, res));
router.get('/', (req, res) => supervi_achievements.getAchievements(req, res));
router.get('/stats', (req, res) => supervi_achievements.getStats(req, res));
router.post('/check', (req, res) => supervi_achievements.checkAndAward(req, res));
router.get('/user/:userId', (req, res) => {
  req.params.userId = req.params.userId || req.params.memberId;
  return supervi_achievements.getUserAchievements(req, res);
});
router.get('/members/:memberId', (req, res) => {
  req.params.userId = req.params.memberId;
  return supervi_achievements.getUserAchievements(req, res);
});
router.get('/:id', (req, res) => supervi_achievements.getById(req, res));
router.post('/', (req, res) => supervi_achievements.create(req, res));
router.put('/:id', (req, res) => supervi_achievements.update(req, res));
router.delete('/:id', (req, res) => supervi_achievements.delete(req, res));

module.exports = router;
