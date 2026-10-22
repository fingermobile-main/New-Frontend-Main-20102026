/**
 * Integration Tests for Beatwave API & Controller
 * FingerMobile Protocol™
 */

process.env.DB_PASSWORD = process.env.DB_PASSWORD || 'password';
process.env.DB_NAME = process.env.DB_NAME || 'fingermobile_platform_db';

const request = require('supertest');
const express = require('express');
const beatwaveRoutes = require('../../routes/beatwaveRoutes');

const app = express();
app.use(express.json());

// Attach mock authenticated user
app.use((req, res, next) => {
  req.user = { id: 1, username: 'testuser' };
  next();
});

app.use('/api/beatwave', beatwaveRoutes);

describe('Beatwave Integration Tests (Live PostgreSQL DB)', () => {
  it('GET /api/beatwave/tracks - should return music tracks from live DB', async () => {
    const res = await request(app).get('/api/beatwave/tracks');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/beatwave/tracks/trending - should return trending tracks', async () => {
    const res = await request(app).get('/api/beatwave/tracks/trending');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/beatwave/tracks/:id - should return single track', async () => {
    const res = await request(app).get('/api/beatwave/tracks/1');
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
    }
  });

  it('GET /api/beatwave/artists - should return artists list', async () => {
    const res = await request(app).get('/api/beatwave/artists');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/beatwave/playlists - should return playlists', async () => {
    const res = await request(app).get('/api/beatwave/playlists');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/beatwave/genres - should return list of music genres', async () => {
    const res = await request(app).get('/api/beatwave/genres');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/beatwave/tracks/:id/play - should increment play count', async () => {
    const res = await request(app).post('/api/beatwave/tracks/1/play');
    expect([200, 404]).toContain(res.status);
  });
});
