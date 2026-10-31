const express = require('express');
const p2pMatching = require('../controllers/p2p-matchingController.js');

const router = express.Router();

router.get('/member-profiles', (req, res) => p2pMatching.getAllMemberProfiles(req, res));
router.get('/member-profiles/:id', (req, res) => p2pMatching.getMemberProfile(req, res));
router.post('/member-profiles', (req, res) => p2pMatching.saveMemberProfile(req, res));
router.post('/find-matches', (req, res) => p2pMatching.findMatch(req, res));
router.post('/matches', (req, res) => p2pMatching.create(req, res));
router.get('/matches/:memberId', (req, res) => p2pMatching.getById(req, res));
router.put('/matches/:matchId', (req, res) => p2pMatching.update(req, res));
router.get('/fic-subscriptions/:memberId', (req, res) => p2pMatching.getById(req, res));
router.post('/fic-subscriptions', (req, res) => p2pMatching.create(req, res));
router.post('/procurement-documents', (req, res) => p2pMatching.create(req, res));
router.get('/procurement-documents', (req, res) => p2pMatching.getAll(req, res));
router.post('/three-way-matching', (req, res) => p2pMatching.create(req, res));
router.get('/three-way-matches', (req, res) => p2pMatching.getAll(req, res));
router.post('/ai-insights', (req, res) => p2pMatching.create(req, res));
router.get('/analytics-reports', (req, res) => p2pMatching.getAll(req, res));
router.post('/supply-demand-policies', (req, res) => p2pMatching.create(req, res));
router.get('/profile-analysis/:analyzedmemberId', (req, res) => p2pMatching.getById(req, res));
router.post('/marketing-matches', (req, res) => p2pMatching.create(req, res));
router.get('/sentinel-logs', (req, res) => p2pMatching.getAll(req, res));

module.exports = router;
