/**
 * FingerMobile Protocol™ - Profile Charter Routes
 * Implements GET /api/v1/profiles/:profile_id with relationship awareness
 * Document: Member Users Profile Page Wall Charter Development 15102026.md
 */

const express = require('express');
const router = express.Router();
const profileCharterController = require('../controllers/profileCharterController');
const { optionalAuthenticate, authenticate } = require('../middleware/authenticate');

// GET /api/v1/profiles/:profile_id
router.get('/:profile_id', optionalAuthenticate, (req, res) => {
  return profileCharterController.getProfile(req, res);
});

// POST /api/v1/profiles/:profile_id/friend-request
router.post('/:profile_id/friend-request', optionalAuthenticate, (req, res) => {
  return profileCharterController.handleFriendRequest(req, res);
});

// POST /api/v1/profiles/:profile_id/block
router.post('/:profile_id/block', optionalAuthenticate, (req, res) => {
  return profileCharterController.handleBlock(req, res);
});

// POST /api/v1/profiles/:profile_id/pin-handshake
router.post('/:profile_id/pin-handshake', optionalAuthenticate, (req, res) => {
  return profileCharterController.verifyPinHandshake(req, res);
});

// POST /api/v1/profiles/:profile_id/recommendations/:rec_id/dismiss
router.post('/:profile_id/recommendations/:rec_id/dismiss', optionalAuthenticate, (req, res) => {
  return profileCharterController.dismissRecommendation(req, res);
});

// PUT /api/v1/profiles/:profile_id/pinned-details
router.put('/:profile_id/pinned-details', optionalAuthenticate, (req, res) => {
  return profileCharterController.updatePinnedDetails(req, res);
});

// GET /api/v1/profiles/:profile_id/scheduled-media
router.get('/:profile_id/scheduled-media', optionalAuthenticate, (req, res) => {
  return profileCharterController.getScheduledMedia(req, res);
});

// POST /api/v1/profiles/:profile_id/scheduled-media
router.post('/:profile_id/scheduled-media', optionalAuthenticate, (req, res) => {
  return profileCharterController.addScheduledMedia(req, res);
});

// DELETE /api/v1/profiles/:profile_id/scheduled-media/batch-delete
router.delete('/:profile_id/scheduled-media/batch-delete', optionalAuthenticate, (req, res) => {
  return profileCharterController.batchDeleteScheduledMedia(req, res);
});

// GET /api/v1/profiles/:profile_id/reels
router.get('/:profile_id/reels', optionalAuthenticate, (req, res) => {
  return profileCharterController.getReels(req, res);
});

// POST /api/v1/profiles/:profile_id/reels
router.post('/:profile_id/reels', optionalAuthenticate, (req, res) => {
  return profileCharterController.createReel(req, res);
});

// GET /api/v1/profiles/:profile_id/about-categories
router.get('/:profile_id/about-categories', optionalAuthenticate, (req, res) => {
  return profileCharterController.getAboutCategories(req, res);
});

// PUT /api/v1/profiles/:profile_id/about-category/:category_key
router.put('/:profile_id/about-category/:category_key', optionalAuthenticate, (req, res) => {
  return profileCharterController.updateAboutCategory(req, res);
});

// GET /api/v1/profiles/:profile_id/friend-requests/pending
router.get('/:profile_id/friend-requests/pending', optionalAuthenticate, (req, res) => {
  return profileCharterController.getPendingFriendRequests(req, res);
});

// POST /api/v1/profiles/:profile_id/friend-requests/:request_id/accept
router.post('/:profile_id/friend-requests/:request_id/accept', optionalAuthenticate, (req, res) => {
  return profileCharterController.acceptFriendRequest(req, res);
});

// POST /api/v1/profiles/:profile_id/friend-requests/:request_id/decline
router.post('/:profile_id/friend-requests/:request_id/decline', optionalAuthenticate, (req, res) => {
  return profileCharterController.declineFriendRequest(req, res);
});

// GET /api/v1/profiles/:profile_id/profile-views-7d
router.get('/:profile_id/profile-views-7d', optionalAuthenticate, (req, res) => {
  return profileCharterController.getProfileViews7d(req, res);
});

// PUT /api/v1/profiles/:profile_id
router.put('/:profile_id', optionalAuthenticate, (req, res) => {
  return profileCharterController.updateProfile(req, res);
});

// PUT /api/v1/profiles/:profile_id/cover
router.put('/:profile_id/cover', optionalAuthenticate, (req, res) => {
  return profileCharterController.updateCoverPhoto(req, res);
});

// GET /api/v1/profiles/:profile_id/friends
router.get('/:profile_id/friends', optionalAuthenticate, (req, res) => {
  return profileCharterController.getFriends(req, res);
});

// GET /api/v1/profiles/:profile_id/recommendations
router.get('/:profile_id/recommendations', optionalAuthenticate, (req, res) => {
  return profileCharterController.getRecommendations(req, res);
});

// GET /api/v1/profiles/:profile_id/wall
router.get('/:profile_id/wall', optionalAuthenticate, (req, res) => {
  return profileCharterController.getWallPosts(req, res);
});

// POST /api/v1/profiles/:profile_id/wall
router.post('/:profile_id/wall', optionalAuthenticate, (req, res) => {
  return profileCharterController.createWallPost(req, res);
});

// POST /api/v1/profiles/:profile_id/wall/:post_id/like
router.post('/:profile_id/wall/:post_id/like', optionalAuthenticate, (req, res) => {
  return profileCharterController.likeWallPost(req, res);
});

// POST /api/v1/profiles/:profile_id/wall/:post_id/tip
router.post('/:profile_id/wall/:post_id/tip', optionalAuthenticate, (req, res) => {
  return profileCharterController.tipWallPost(req, res);
});

// POST /api/v1/profiles/:profile_id/wall/:post_id/share
router.post('/:profile_id/wall/:post_id/share', optionalAuthenticate, (req, res) => {
  return profileCharterController.shareWallPost(req, res);
});

module.exports = router;
