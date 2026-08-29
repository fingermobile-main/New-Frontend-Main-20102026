/**
 * FingerMobile Platform - API Endpoint Test Script
 * Tests Priority 2 endpoints from IMMEDIATE_ACTION_PLAN.md
 */

const axios = require('axios');

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3003/api';

// Test credentials (from setup-test-user.js) - ⚠️ SECURITY: Use environment variables in production
const TEST_USER = {
  email: process.env.TEST_EMAIL || 'test@fingermobile.com',
  password: process.env.TEST_PASSWORD || 'TestPass123!'
};

let authToken = '';
let testPageId = '';
let testContentId = '';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function login() {
  try {
    log('\n📝 Step 1: Authenticating test user...', 'cyan');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password
    });
    
    // Fix: API returns session_token, not accessToken
    authToken = response.data.session_token || response.data.accessToken;
    
    if (!authToken) {
      log('❌ No authentication token received', 'red');
      log(`   Response: ${JSON.stringify(response.data, null, 2)}`, 'yellow');
      return false;
    }
    
    log('✅ Authentication successful', 'green');
    log(`   Token: ${authToken.substring(0, 20)}...`, 'blue');
    return true;
  } catch (error) {
    log('❌ Authentication failed', 'red');
    log(`   Error: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

async function createPage() {
  try {
    log('\n📄 Step 2: Creating B2B landing page...', 'cyan');
    const response = await axios.post(`${BASE_URL}/pages`, {
      page_name: 'Tech Consulting Services',
      slug: 'tech-consulting-demo-' + Date.now(), // Unique slug to avoid conflicts
      category: 'Professional Services',
      description: 'Expert technology consulting for startups',
      is_published: true
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Fix: Extract ID from response.data.data.id (nested structure)
    testPageId = response.data.data?.id || response.data.id;
    
    if (!testPageId) {
      log('❌ Failed to extract page ID from response', 'red');
      log(`   Response: ${JSON.stringify(response.data, null, 2)}`, 'yellow');
      return false;
    }
    
    log('✅ Page created successfully', 'green');
    log(`   Page ID: ${testPageId}`, 'blue');
    log(`   Slug: ${response.data.data?.slug || response.data.slug}`, 'blue');
    return true;
  } catch (error) {
    log('❌ Page creation failed', 'red');
    log(`   Error: ${error.response?.data?.message || error.message}`, 'red');
    if (error.response?.status === 409) {
      log('   Note: Page with this slug may already exist', 'yellow');
    }
    return false;
  }
}

async function trackVisitor() {
  try {
    log('\n👁️  Step 3: Tracking page visitor...', 'cyan');
    const response = await axios.post(`${BASE_URL}/pages/${testPageId}/track-visitor`, {
      action_taken: 'contact',
      dwell_time_seconds: 45
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    log('✅ Visitor tracked successfully', 'green');
    log(`   Action: ${response.data.action_taken || 'contact'}`, 'blue');
    return true;
  } catch (error) {
    log('❌ Visitor tracking failed', 'red');
    log(`   Error: ${error.response?.data?.message || error.message}`, 'red');
    if (error.response?.status === 404) {
      log('   Note: Check if page ID is valid', 'yellow');
    }
    return false;
  }
}

async function createContent() {
  try {
    log('\n📝 Step 4: Creating content post...', 'cyan');
    const response = await axios.post(`${BASE_URL}/content`, {
      page_id: testPageId, // Associate content with the created page
      title: '5 Tips for Startup Success',
      body: 'Here are my top recommendations for early-stage startups looking to scale effectively...',
      tags: ['startup', 'consulting', 'technology'],
      visibility: 'public',
      content_type: 'post'
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    // Fix: Extract ID from nested response
    testContentId = response.data.data?.id || response.data.id;
    
    if (!testContentId) {
      log('❌ Failed to extract content ID from response', 'red');
      log(`   Response: ${JSON.stringify(response.data, null, 2)}`, 'yellow');
      return false;
    }
    
    log('✅ Content created successfully', 'green');
    log(`   Content ID: ${testContentId}`, 'blue');
    log(`   Title: ${response.data.data?.title || response.data.title}`, 'blue');
    return true;
  } catch (error) {
    log('❌ Content creation failed', 'red');
    log(`   Error: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

async function engageWithContent() {
  try {
    log('\n❤️  Step 5: Engaging with content (like)...', 'cyan');
    const response = await axios.post(`${BASE_URL}/engagement`, {
      content_id: testContentId,
      engagement_type: 'like'
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    log('✅ Engagement recorded successfully', 'green');
    log(`   Type: ${response.data.engagement_type}`, 'blue');
    return true;
  } catch (error) {
    log('❌ Engagement failed', 'red');
    log(`   Error: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

async function getPageStats() {
  try {
    log('\n📊 Step 6: Retrieving page statistics...', 'cyan');
    const response = await axios.get(`${BASE_URL}/pages/${testPageId}/stats`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    log('✅ Page statistics retrieved', 'green');
    log(`   Views: ${response.data.view_count}`, 'blue');
    log(`   Leads: ${response.data.lead_count}`, 'blue');
    return true;
  } catch (error) {
    log('❌ Failed to retrieve stats', 'red');
    log(`   Error: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

async function runAllTests() {
  log('\n========================================', 'cyan');
  log('FingerMobile API Integration Tests', 'cyan');
  log('========================================\n', 'cyan');
  
  const results = {
    passed: 0,
    failed: 0,
    total: 6
  };
  
  // Run tests sequentially
  if (await login()) results.passed++; else results.failed++;
  if (await createPage()) results.passed++; else results.failed++;
  if (await trackVisitor()) results.passed++; else results.failed++;
  if (await createContent()) results.passed++; else results.failed++;
  if (await engageWithContent()) results.passed++; else results.failed++;
  if (await getPageStats()) results.passed++; else results.failed++;
  
  // Summary
  log('\n========================================', 'cyan');
  log('Test Results Summary', 'cyan');
  log('========================================', 'cyan');
  log(`Total Tests: ${results.total}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`, 
      results.failed === 0 ? 'green' : 'yellow');
  log('========================================\n', 'cyan');
  
  if (results.failed === 0) {
    log('🎉 All API endpoints working correctly!', 'green');
    process.exit(0);
  } else {
    log('⚠️  Some endpoints need attention', 'yellow');
    process.exit(1);
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  log(`\n❌ Unhandled rejection: ${error.message}`, 'red');
  process.exit(1);
});

// Run tests
runAllTests();
