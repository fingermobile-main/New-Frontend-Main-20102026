const request = require('supertest');
const app = require('../app');

async function verifyCluster1() {
  console.log('--- Verifying Cluster 1 Endpoints ---');

  const endpoints = [
    { method: 'get', path: '/api/storefront', desc: 'Storefronts List' },
    { method: 'get', path: '/api/storefront/products', desc: 'Storefront Products' },
    { method: 'get', path: '/api/storefront/orders', desc: 'Storefront Orders' },
    { method: 'get', path: '/api/storefront/tracking', desc: 'Storefront Tracking' },
    { method: 'get', path: '/api/marketplace/unified-products', desc: 'Unified Marketplace Products' },
    { method: 'get', path: '/api/marketplace/unified-analytics', desc: 'Unified Analytics' },
    { method: 'get', path: '/api/marketplace/tracking', desc: 'Marketplace Tracking' },
    { method: 'get', path: '/api/paylinks', desc: 'Paylinks List' },
    { method: 'get', path: '/api/subscriptions', desc: 'Subscriptions List' },
    { method: 'get', path: '/api/revenue', desc: 'Monetization Revenue Overview' }
  ];

  let passed = 0;
  for (const ep of endpoints) {
    try {
      const res = await request(app)[ep.method](ep.path);
      if (res.status === 200) {
        console.log(`✅ [${res.status}] ${ep.desc} (${ep.path})`);
        passed++;
      } else {
        console.error(`❌ [${res.status}] ${ep.desc} (${ep.path}) - Body:`, res.body || res.text);
      }
    } catch (err) {
      console.error(`❌ Error requesting ${ep.path}:`, err.message);
    }
  }

  console.log(`\nResults: ${passed}/${endpoints.length} endpoints operational.`);
  if (passed === endpoints.length) {
    console.log('🎉 All Cluster 1 endpoints are 100% operational against live PostgreSQL!');
    process.exit(0);
  } else {
    process.exit(1);
  }
}

verifyCluster1();
