const express = require('express');
const router = express.Router();
const controller = require('../controllers/beatwaveController');
const { authenticate } = require('../middleware/authenticate');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const db = require('../db');

// Optional auth helper: attaches user if token is present, does not fail if unauthenticated
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id || decoded.userId;
      const userResult = await (db.identityDb || db).query(
        'SELECT id, username, email, role, is_active FROM users WHERE id = $1 AND is_active = true',
        [userId]
      );
      if (userResult.rows.length > 0) {
        req.user = userResult.rows[0];
        req.member = userResult.rows[0];
      }
    }
  } catch {
    // Continue as guest
  }
  next();
};

// Discovery & Public Endpoints
router.get('/audio-novels', optionalAuth, controller.getAudioNovels);
router.post('/audio-novels', authenticate, controller.createAudioNovel);
router.get('/podcasts', optionalAuth, controller.getPodcasts);
router.post('/podcasts', authenticate, controller.createPodcast);
router.get('/tracks', controller.getTracks);
router.get('/tracks/trending', controller.getTrending);
router.get('/tracks/:id', controller.getTrackById);
router.post('/tracks', authenticate, controller.createTrack);
router.post('/tracks/:id/play', optionalAuth, controller.playTrack);

router.get('/playlists', controller.getPlaylists);
router.get('/playlists/:id', controller.getPlaylistById);
router.post('/playlists', authenticate, controller.createPlaylist);
router.post('/playlists/:id/tracks', authenticate, controller.addTrackToPlaylist);
router.delete('/playlists/:id/tracks/:trackId', authenticate, controller.removeTrackFromPlaylist);

router.get('/artists', controller.getArtists);
router.get('/artists/:id', controller.getArtistById);
router.get('/genres', controller.getGenres);

// User Favorites & Interactions (Authenticated)
router.get('/favorites', authenticate, controller.getFavorites);
router.post('/favorites/:trackId', authenticate, controller.addFavorite);
router.delete('/favorites/:trackId', authenticate, controller.removeFavorite);

const consoleUpload = require('../middleware/consoleUpload');

// =========================================================================
// 🌊 SOUNDRIVER ROUTES (Free / Open Stream, 320kbps, Uploads, Podcasts, Aggregator)
// =========================================================================
router.get('/soundriver/telemetry', controller.getSoundRiverTelemetry);
router.get('/soundriver/tracks', controller.getSoundRiverTracks);
router.post('/soundriver/upload', consoleUpload.single('audio'), controller.uploadSoundRiverTrack);
router.put('/soundriver/tracks/:id', controller.updateSoundRiverTrack);
router.delete('/soundriver/tracks/:id', controller.deleteSoundRiverTrack);
router.get('/soundriver/podcasts', controller.getSoundRiverPodcasts);
router.post('/soundriver/podcasts', consoleUpload.single('audio'), controller.uploadSoundRiverPodcast);
router.get('/soundriver/aggregator', controller.getSoundRiverAggregator);
router.post('/soundriver/aggregator/sync', controller.syncSoundRiverAggregator);
router.get('/soundriver/colabo', controller.getColaboPlaylists);
router.post('/soundriver/colabo', controller.createColaboPlaylist);

// =========================================================================
// 💎 SOUNDOCEAN ROUTES (Studio Master 24-bit/192kHz FLAC, Stem Vault, Web3 FIC, MySub)
// =========================================================================
router.get('/soundocean/telemetry', controller.getSoundOceanTelemetry);
router.get('/soundocean/masters', controller.getSoundOceanMasters);
router.post('/soundocean/upload-master', consoleUpload.fields([
  { name: 'masterAudio', maxCount: 1 },
  { name: 'stemArchive', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), controller.uploadSoundOceanMaster);
router.put('/soundocean/masters/:id', controller.updateSoundOceanMaster);
router.delete('/soundocean/masters/:id', controller.deleteSoundOceanMaster);
router.get('/soundocean/stems/:id', controller.getSoundOceanStems);
router.get('/soundocean/fic-royalties', controller.getSoundOceanFicRoyalties);
router.post('/soundocean/fic-royalties/distribute', controller.distributeSoundOceanRoyalties);
router.get('/soundocean/mysub/crews', controller.getSoundOceanMySubCrews);
router.post('/soundocean/mysub/crews', controller.createSoundOceanMySubCrew);

// Playback History (Authenticated)
router.get('/history', authenticate, controller.getPlaybackHistory);
router.get('/playback-history', authenticate, controller.getPlaybackHistory);
router.delete('/history', authenticate, controller.clearPlaybackHistory);
router.delete('/playback-history', authenticate, controller.clearPlaybackHistory);

module.exports = router;

