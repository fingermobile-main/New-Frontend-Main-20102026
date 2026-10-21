const request = require('supertest');
const app = require('../app');
const db = require('../db');

async function verifyCluster3() {
  console.log('--- Verifying Cluster 3 Endpoints (Media, Streaming, Audio & Video Editing) ---');

  // Ensure active live stream exists for testing
  const streamRes = await db.query('SELECT id FROM live_streams LIMIT 1');
  const streamId = streamRes.rows[0]?.id || '4a20b720-3ce4-42b7-84bc-87729f270111';

  const tests = [
    // 1. Live Streaming Endpoints
    { method: 'get', path: '/api/live-stream/active', desc: 'Active Live Streams' },
    { method: 'get', path: '/api/live-stream/can-go-live', desc: 'Can Go Live Check' },
    {
      method: 'post',
      path: '/api/live-stream',
      desc: 'Create Live Stream Room',
      body: { title: 'Cluster 3 Live Test Stream', category: 'Music', user_id: '4' }
    },
    { method: 'get', path: `/api/live-stream/${streamId}`, desc: 'Get Stream Details by ID' },

    // 2. Dancia4TV Endpoints
    { method: 'get', path: '/api/dancia/videos', desc: 'Dancia Video Catalog' },
    { method: 'get', path: '/api/dancia/channels', desc: 'Dancia TV Channels' },
    { method: 'get', path: '/api/dancia/trending', desc: 'Dancia Trending Shows' },
    { method: 'get', path: '/api/dancia/schedule', desc: 'Dancia Program Schedule' },

    // 3. Beatwave Audio & Music Endpoints
    { method: 'get', path: '/api/beatwave/tracks', desc: 'Beatwave Audio Tracks' },
    { method: 'get', path: '/api/beatwave/playlists', desc: 'Beatwave Playlists' },
    { method: 'get', path: '/api/beatwave/genres', desc: 'Beatwave Music Genres' },

    // 4. FingerShorts Reel & Short Video Endpoints
    { method: 'get', path: '/api/fingershorts/for-you', desc: 'FingerShorts For You Feed' },
    { method: 'get', path: '/api/fingershorts/trending', desc: 'FingerShorts Trending Feed' },
    { method: 'get', path: '/api/fingershorts/sounds', desc: 'FingerShorts Audio Library' },

    // 5. Stercs Video Studio & Canvas Engine Endpoints
    { method: 'get', path: '/api/stercs/projects', desc: 'Stercs User Projects' },
    {
      method: 'post',
      path: '/api/stercs/projects',
      desc: 'Create Stercs Studio Project',
      body: { name: 'Cluster 3 Test Cut', description: 'Multi-layer WebCodecs Video Project' }
    },
    { method: 'get', path: '/api/stercs/themes', desc: 'Stercs Visual Themes' },
    { method: 'get', path: '/api/stercs/media-library', desc: 'Stercs Media Asset Library' },
    { method: 'get', path: '/api/stercs/stats', desc: 'Stercs Engine Stats & Pipeline' },

    // 6. Video Translation Pipeline Endpoints
    { method: 'get', path: '/api/video-translation/my-videos', desc: 'Translated Videos Queue' },
    { method: 'get', path: '/api/video-translation/languages', desc: 'Supported Translation Languages' },
    { method: 'get', path: '/api/video-translation/quota', desc: 'Video Translation Quota' },

    // 7. Photo Credits & Stock Media Endpoints
    { method: 'get', path: '/api/photocredits', desc: 'Photo Credits Gallery' },
    {
      method: 'post',
      path: '/api/photocredits',
      desc: 'Submit New Photo Credit Asset',
      body: {
        title: 'Cluster 3 Test Asset',
        photographer_name: 'Antigravity Studio',
        license_type: 'royalty_free',
        price: 0.00
      }
    }
  ];

  let passed = 0;
  for (const t of tests) {
    try {
      let req = request(app)[t.method](t.path);
      if (t.body) {
        req = req.send(t.body);
      }
      const res = await req;
      if (res.status === 200 || res.status === 201) {
        console.log(`✅ [${res.status}] ${t.desc} (${t.path})`);
        passed++;
      } else {
        console.error(`❌ [${res.status}] ${t.desc} (${t.path}) - Body:`, res.body || res.text);
      }
    } catch (err) {
      console.error(`❌ Error requesting ${t.path}:`, err.message);
    }
  }

  console.log(`\nResults: ${passed}/${tests.length} endpoints operational.`);
  if (passed === tests.length) {
    console.log('🎉 All Cluster 3 endpoints are 100% operational against live PostgreSQL!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

verifyCluster3().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
