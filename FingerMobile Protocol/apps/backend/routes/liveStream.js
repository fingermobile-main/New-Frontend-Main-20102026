/**
 * LiveStream Routes - FingerMobile Protocol™
 * Real-Time Broadcasting, WebRTC Conference Rooms, Platform Events & Platform Gems Monetization
 * Date: October 2026
 */

const express = require('express');
const router = express.Router();
const LiveStreamController = require('../controllers/LiveStreamController');

// Tier and Capability Discovery
router.get('/tiers', LiveStreamController.getBroadcastTiers);
router.get('/can-go-live', LiveStreamController.canGoLive);
router.get('/active', LiveStreamController.getActiveStreams);
router.get('/scheduled', LiveStreamController.getScheduledBroadcasts);

// Scheduling & Stream Lifecycle (Linked to Platform Events)
router.post('/', LiveStreamController.createLiveStream);
router.post('/schedule', LiveStreamController.scheduleLiveBroadcast);
router.post('/upgrade-tier', LiveStreamController.upgradeStudioTier);

// Specific Stream Routes
router.get('/:streamId', LiveStreamController.getLiveStream);
router.post('/:streamId/start', LiveStreamController.startLiveStream);
router.post('/:streamId/end', LiveStreamController.endLiveStream);
router.post('/:streamId/heartbeat', LiveStreamController.updateViewerHeartbeat);
router.post('/:streamId/tip', LiveStreamController.sendLiveTip);

// Join Requests (Enforcing Capacity: 20-50 Free, 2k Pro, 200k Master)
router.post('/:streamId/join-request', LiveStreamController.requestJoinLive);

// Gifting, Coupons, Gift Cards & Merchandise (Linked to Platform Gems & Tier Governance)
router.post('/:streamId/item-action', LiveStreamController.executeItemAction);

module.exports = router;
