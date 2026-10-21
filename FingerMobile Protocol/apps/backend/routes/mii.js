/**
 * Mii Routes
 * FingerMobile Protocol™ - Mii Module & MiiPage
 * 48-Hour Disappearing Status | FingerOrbit™ | Mobile Contact Sync & Pin Exchange | ShowCase Activity | MiniStore
 */

const express = require('express');
const router = express.Router();
const mii = require('../controllers/miiController');
const { authenticate } = require('../middleware/authenticate');

// --- 1. MII DISAPPEARING STATUS (48h TTL, Up to 20 Cards) ---
router.get('/status/feed', authenticate, mii.getStatusFeed);
router.get('/status/my', authenticate, mii.getMyStatus);
router.post('/status', authenticate, mii.createStatus);
router.post('/status/:statusId/cards', authenticate, mii.addCardToStatus);
router.delete('/status/:id', authenticate, mii.deleteStatus);
router.post('/status/cards/:cardId/view', authenticate, mii.recordView);
router.post('/status/cards/:cardId/react', authenticate, mii.reactToStatus);
router.get('/status/cards/:cardId/reactions', authenticate, mii.getStatusReactions);

// --- 2. SHOWCASE & PRESENCE (Live Sync with BeatwaveNG & Dancia-4Tv) ---
router.post('/presence/update', authenticate, mii.updatePresence);
router.get('/presence/showcase/:contactId', authenticate, mii.getContactShowCase);
router.get('/activity/presence', authenticate, async (req, res) => {
  try {
    const { pool } = require('../db');
    const userId = req.user?.id || req.user?.userId || 4;
    const presRes = await pool.query('SELECT * FROM mii_activity_presence WHERE user_id = $1', [String(userId)]);
    return res.json({
      success: true,
      data: presRes.rows[0] || {
        now_listening_title: 'Afrobeat Sunset Vibes',
        now_listening_artist: 'Dancia Beats',
        now_watching_title: 'Live Studio Session Ep. 4 (Dancia-4Tv)',
        status_text: 'Active on FingerMobile Mii'
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
router.get('/presence', authenticate, async (req, res) => {
  try {
    const { pool } = require('../db');
    const userId = req.user?.id || req.user?.userId || 4;
    const presRes = await pool.query('SELECT * FROM mii_activity_presence WHERE user_id = $1', [String(userId)]);
    return res.json({
      success: true,
      data: presRes.rows[0] || {
        now_listening_title: 'Afrobeat Sunset Vibes',
        now_listening_artist: 'Dancia Beats',
        now_watching_title: 'Live Studio Session Ep. 4 (Dancia-4Tv)',
        status_text: 'Active on FingerMobile Mii'
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// --- 3. MANDATORY MOBILE CONTACT SYNC & PIN EXCHANGE PROTOCOL ---
router.post('/contacts/sync', authenticate, mii.syncPhoneContacts);
router.get('/contacts', authenticate, mii.getContactsList);
router.get('/pin/my', authenticate, mii.generatePin);
router.post('/pin/exchange', authenticate, mii.exchangePin);
router.post('/pin/accept', authenticate, mii.acceptPin);
router.post('/pin/revoke', authenticate, mii.revokePin); // Instant Vanish

// --- 4. FINGERORBIT™©® (Video & Image Folders, UGC Timers, Tokenized Downloads) ---
router.get('/orbit/folders', authenticate, mii.getOrbitFolders);
router.put('/orbit/folders/:folderType', authenticate, mii.configureOrbitFolder);
router.post('/orbit/items', authenticate, mii.addOrbitItem);
router.get('/orbit/folders/:folderId/items', authenticate, mii.getOrbitItems);
router.post('/orbit/download-token', authenticate, mii.requestTokenizedDownload);

// --- 5. MINISTORE (Two-Page Catalogue) ---
router.get('/ministore/:sellerId', mii.getMiniStoreCatalog);
router.post('/ministore/products', authenticate, mii.addMiniStoreProduct);

// --- 6. CHANNELS ---
router.get('/channels', mii.getChannels);
router.post('/channels', authenticate, mii.createChannel);
router.post('/channels/:channelId/subscribe', authenticate, mii.subscribeChannel);

// --- 7. HOUSEKEEPING ---
router.post('/admin/expire-old', authenticate, mii.expireOldStatuses);

// --- 8. AVATAR BACKWARD COMPATIBILITY ---
router.get('/avatars', authenticate, mii.getAvatars);
router.get('/avatars/:userId?', authenticate, mii.getUserAvatars);
router.post('/avatars', authenticate, mii.createAvatar);
router.put('/avatars/:id', authenticate, mii.customizeAvatar);
router.get('/templates', authenticate, mii.getTemplates);
router.get('/items', authenticate, mii.getItems);

module.exports = router;
