/**
 * Unit Tests for Beatwave Controller
 * Complete testing suite for BeatwaveNG endpoints
 * FingerMobile Protocol™
 */

jest.mock('../../db', () => {
  const queryFn = jest.fn();
  return {
    query: queryFn,
    pool: { query: queryFn },
    contentDb: { query: queryFn }
  };
});

const request = require('supertest');
const express = require('express');
const { pool } = require('../../db');
const beatwaveController = require('../../controllers/beatwaveController');

const app = express();
app.use(express.json());

// Mock authentication middleware
app.use((req, res, next) => {
  req.user = { id: 1, username: 'testuser' };
  next();
});

// Routes definition
app.get('/api/beatwave/tracks', (req, res) => beatwaveController.getTracks(req, res));
app.get('/api/beatwave/tracks/trending', (req, res) => beatwaveController.getTrending(req, res));
app.get('/api/beatwave/tracks/:id', (req, res) => beatwaveController.getTrackById(req, res));
app.post('/api/beatwave/tracks', (req, res) => beatwaveController.createTrack(req, res));
app.post('/api/beatwave/tracks/:id/play', (req, res) => beatwaveController.playTrack(req, res));

app.get('/api/beatwave/playlists', (req, res) => beatwaveController.getPlaylists(req, res));
app.get('/api/beatwave/playlists/:id', (req, res) => beatwaveController.getPlaylistById(req, res));
app.post('/api/beatwave/playlists', (req, res) => beatwaveController.createPlaylist(req, res));
app.post('/api/beatwave/playlists/:id/tracks', (req, res) => beatwaveController.addTrackToPlaylist(req, res));
app.delete('/api/beatwave/playlists/:id/tracks/:trackId', (req, res) => beatwaveController.removeTrackFromPlaylist(req, res));

app.get('/api/beatwave/artists', (req, res) => beatwaveController.getArtists(req, res));
app.get('/api/beatwave/artists/:id', (req, res) => beatwaveController.getArtistById(req, res));
app.get('/api/beatwave/genres', (req, res) => beatwaveController.getGenres(req, res));

app.get('/api/beatwave/favorites', (req, res) => beatwaveController.getFavorites(req, res));
app.post('/api/beatwave/favorites/:trackId', (req, res) => beatwaveController.addFavorite(req, res));
app.delete('/api/beatwave/favorites/:trackId', (req, res) => beatwaveController.removeFavorite(req, res));

app.get('/api/beatwave/history', (req, res) => beatwaveController.getPlaybackHistory(req, res));
app.delete('/api/beatwave/history', (req, res) => beatwaveController.clearPlaybackHistory(req, res));

describe('Beatwave Controller Unit Tests', () => {
  beforeEach(() => {
    pool.query.mockReset();
    pool.query.mockResolvedValue({ rows: [] });
  });

  describe('GET /api/beatwave/tracks', () => {
    it('should return music tracks', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [
          { id: 1, title: 'Track 1', genre: 'Afrobeats', duration: 200, audioUrl: 'http://example.com/1.mp3', artistName: 'Artist 1' },
          { id: 2, title: 'Track 2', genre: 'Pop', duration: 180, audioUrl: 'http://example.com/2.mp3', artistName: 'Artist 2' }
        ]
      });

      const response = await request(app).get('/api/beatwave/tracks?genre=Afrobeats');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
    });
  });

  describe('GET /api/beatwave/tracks/:id', () => {
    it('should return track by ID', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, title: 'Track 1', artistName: 'Artist 1', audioUrl: 'http://example.com/1.mp3' }]
      });

      const response = await request(app).get('/api/beatwave/tracks/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Track 1');
    });

    it('should return 404 if track not found', async () => {
      pool.query.mockResolvedValueOnce({ rows: [] });

      const response = await request(app).get('/api/beatwave/tracks/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/beatwave/tracks', () => {
    it('should create a new track', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 10, title: 'New Track', url: 'http://example.com/new.mp3', genre: 'Pop' }]
      });

      const response = await request(app)
        .post('/api/beatwave/tracks')
        .send({ title: 'New Track', url: 'http://example.com/new.mp3', genre: 'Pop' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('New Track');
    });

    it('should return 400 if title or url missing', async () => {
      const response = await request(app)
        .post('/api/beatwave/tracks')
        .send({ genre: 'Pop' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/beatwave/tracks/:id/play', () => {
    it('should increment plays count and record history', async () => {
      pool.query.mockResolvedValue({ rows: [{ plays: 10 }] });

      const response = await request(app).post('/api/beatwave/tracks/1/play');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.plays).toBe(10);
    });
  });

  describe('Playlists Endpoints', () => {
    it('should get public playlists', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, title: 'Summer Hits', followerCount: 50, ownerName: 'user1' }]
      });

      const response = await request(app).get('/api/beatwave/playlists');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });

    it('should create a new playlist', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 2, title: 'My Favorites', is_public: true, owner_id: 1 }]
      });

      const response = await request(app)
        .post('/api/beatwave/playlists')
        .send({ title: 'My Favorites', description: 'Cool tracks' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('My Favorites');
    });

    it('should add track to playlist', async () => {
      pool.query.mockResolvedValue({ rows: [{ next_pos: 1 }] });

      const response = await request(app)
        .post('/api/beatwave/playlists/1/tracks')
        .send({ trackId: 5 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Track added to playlist');
    });
  });

  describe('Artists Endpoints', () => {
    it('should get list of artists', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ id: 1, name: 'Burna Boy', followers: 100000, verified: true }]
      });

      const response = await request(app).get('/api/beatwave/artists');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data[0].name).toBe('Burna Boy');
    });

    it('should get artist details with tracks', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, name: 'Burna Boy', bio: 'Afrobeats superstar' }] })
                .mockResolvedValueOnce({ rows: [{ id: 1, title: 'Last Last', plays: 50000 }] });

      const response = await request(app).get('/api/beatwave/artists/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Burna Boy');
      expect(response.body.data.tracks.length).toBe(1);
    });
  });

  describe('Favorites & Playback History', () => {
    it('should get user favorites', async () => {
      pool.query.mockResolvedValueOnce({ rows: [{ id: 1, title: 'Fav Track' }] });

      const response = await request(app).get('/api/beatwave/favorites');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });

    it('should add track to favorites', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).post('/api/beatwave/favorites/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Track added to favorites');
    });

    it('should get playback history', async () => {
      pool.query.mockResolvedValueOnce({
        rows: [{ history_id: 10, playedAt: '2026-09-28T20:00:00Z', title: 'Recent Track' }]
      });

      const response = await request(app).get('/api/beatwave/history');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(1);
    });

    it('should clear playback history', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/api/beatwave/history');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Playback history cleared');
    });
  });
});
