#!/usr/bin/env node

/**
 * Phase 2 - Week 1 Day 2 End-to-End Test Suite
 * Tests visitor tracking, conversion funnel, and analytics
 */

const BASE_URL = 'http://localhost:3003';
let authToken = '';
let pageId = '';

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Test 1: Authenticate
async function testAuthentication() {
    log('\n📝 Test 1: Authenticating...', colors.cyan);
    
    try {
        const response = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: process.env.TEST_EMAIL || 'test@fingermobile.com',
                password: process.env.TEST_PASSWORD || 'TestPass123!' // ⚠️ SECURITY: Use env var in production
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Authentication failed');
        }

        // Use session_token instead of token
        authToken = data.session_token;
        log('✅ Authentication successful', colors.green);
        log(`   Session Token: ${authToken.substring(0, 20)}...`, colors.blue);
        return true;
    } catch (error) {
        log(`❌ Authentication failed: ${error.message}`, colors.red);
        return false;
    }
}

// Test 2: Create a test page
async function testCreatePage() {
    log('\n📄 Test 2: Creating test page...', colors.cyan);
    
    try {
        const response = await fetch(`${BASE_URL}/api/pages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                page_name: 'E2E Test Page',
                slug: `e2e-test-${Date.now()}`,
                category: 'Technology',
                description: 'Test page for visitor tracking E2E tests',
                is_published: true
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Page creation failed');
        }

        pageId = data.data.id;
        log('✅ Page created successfully', colors.green);
        log(`   Page ID: ${pageId}`, colors.blue);
        log(`   Slug: ${data.data.slug}`, colors.blue);
        return true;
    } catch (error) {
        log(`❌ Page creation failed: ${error.message}`, colors.red);
        return false;
    }
}

// Test 3: Track page visitor
async function testTrackVisitor() {
    log('\n👁️  Test 3: Tracking page visitor...', colors.cyan);
    
    try {
        const response = await fetch(`${BASE_URL}/api/pages/${pageId}/track-visitor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                action_taken: 'view',
                referrer: 'https://google.com',
                user_agent: 'Mozilla/5.0 (Test Browser)',
                screen_width: 1920,
                screen_height: 1080
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Visitor tracking failed');
        }

        log('✅ Visitor tracked successfully', colors.green);
        return true;
    } catch (error) {
        log(`❌ Visitor tracking failed: ${error.message}`, colors.red);
        return false;
    }
}

// Test 4: Update dwell time
async function testUpdateDwellTime() {
    log('\n⏱️  Test 4: Updating dwell time...', colors.cyan);
    
    try {
        const response = await fetch(`${BASE_URL}/api/pages/${pageId}/update-dwell-time`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                dwell_time_seconds: 45,
                scroll_depth: 75
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Dwell time update failed');
        }

        log('✅ Dwell time updated successfully', colors.green);
        log(`   Dwell time: 45s, Scroll depth: 75%`, colors.blue);
        return true;
    } catch (error) {
        log(`❌ Dwell time update failed: ${error.message}`, colors.red);
        return false;
    }
}

// Test 5: Track CTA click
async function testTrackCTAClick() {
    log('\n🖱️  Test 5: Tracking CTA click...', colors.cyan);
    
    try {
        // First create a CTA button
        const ctaResponse = await fetch(`${BASE_URL}/api/pages/cta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                page_id: pageId,
                button_text: 'Get Started',
                button_type: 'primary',
                action_type: 'link',
                action_value: 'https://example.com/start'
            })
        });

        const ctaData = await ctaResponse.json();
        
        if (!ctaResponse.ok) {
            throw new Error(ctaData.error || 'CTA creation failed');
        }

        const ctaId = ctaData.data.id;
        log(`   CTA button created (ID: ${ctaId})`, colors.blue);

        // Track the click
        const response = await fetch(`${BASE_URL}/api/pages/${pageId}/track-cta-click`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                cta_id: ctaId,
                cta_type: 'link',
                cta_text: 'Get Started'
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'CTA click tracking failed');
        }

        log('✅ CTA click tracked successfully', colors.green);
        return true;
    } catch (error) {
        log(`❌ CTA click tracking failed: ${error.message}`, colors.red);
        return false;
    }
}

// Test 6: Track conversion
async function testTrackConversion() {
    log('\n💰 Test 6: Tracking conversion...', colors.cyan);
    
    try {
        const response = await fetch(`${BASE_URL}/api/pages/${pageId}/track-conversion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                conversion_type: 'cta_click',
                conversion_value: 0,
                scroll_depth: 75,
                dwell_time_seconds: 45
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Conversion tracking failed');
        }

        log('✅ Conversion tracked successfully', colors.green);
        log(`   Conversation ID: ${data.conversation_id}`, colors.blue);
        return true;
    } catch (error) {
        log(`❌ Conversion tracking failed: ${error.message}`, colors.red);
        return false;
    }
}

// Test 7: Get analytics overview
async function testGetAnalytics() {
    log('\n📊 Test 7: Retrieving analytics overview...', colors.cyan);
    
    try {
        const response = await fetch(`${BASE_URL}/api/pages/${pageId}/analytics/overview`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Analytics retrieval failed');
        }

        log('✅ Analytics retrieved successfully', colors.green);
        log(`   Total visits: ${data.data.overview.total_visits}`, colors.blue);
        log(`   Unique visitors: ${data.data.overview.unique_visitors}`, colors.blue);
        log(`   CTA clicks: ${data.data.overview.total_cta_clicks}`, colors.blue);
        log(`   Conversions: ${data.data.overview.conversions}`, colors.blue);
        log(`   CTA buttons: ${data.data.cta_performance.length}`, colors.blue);
        return true;
    } catch (error) {
        log(`❌ Analytics retrieval failed: ${error.message}`, colors.red);
        return false;
    }
}

// Test 8: Get visitor timeline
async function testGetTimeline() {
    log('\n📈 Test 8: Retrieving visitor timeline...', colors.cyan);
    
    try {
        const response = await fetch(`${BASE_URL}/api/pages/${pageId}/analytics/visitors/timeline?days=7`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Timeline retrieval failed');
        }

        log('✅ Timeline retrieved successfully', colors.green);
        log(`   Period: ${data.period}`, colors.blue);
        log(`   Data points: ${data.data.length}`, colors.blue);
        return true;
    } catch (error) {
        log(`❌ Timeline retrieval failed: ${error.message}`, colors.red);
        return false;
    }
}

// Test 9: Get device breakdown
async function testGetDevices() {
    log('\n📱 Test 9: Retrieving device breakdown...', colors.cyan);
    
    try {
        const response = await fetch(`${BASE_URL}/api/pages/${pageId}/analytics/devices`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Device data retrieval failed');
        }

        log('✅ Device breakdown retrieved successfully', colors.green);
        log(`   Total visitors: ${data.total_visitors}`, colors.blue);
        log(`   Device types: ${data.data.length}`, colors.blue);
        return true;
    } catch (error) {
        log(`❌ Device data retrieval failed: ${error.message}`, colors.red);
        return false;
    }
}

// Main test runner
async function runTests() {
    log('\n========================================', colors.cyan);
    log('Phase 2 - Visitor Tracking E2E Tests', colors.cyan);
    log('========================================\n', colors.cyan);

    const tests = [
        { name: 'Authentication', fn: testAuthentication },
        { name: 'Create Page', fn: testCreatePage },
        { name: 'Track Visitor', fn: testTrackVisitor },
        { name: 'Update Dwell Time', fn: testUpdateDwellTime },
        { name: 'Track CTA Click', fn: testTrackCTAClick },
        { name: 'Track Conversion', fn: testTrackConversion },
        { name: 'Get Analytics', fn: testGetAnalytics },
        { name: 'Get Timeline', fn: testGetTimeline },
        { name: 'Get Devices', fn: testGetDevices }
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        const result = await test.fn();
        if (result) {
            passed++;
        } else {
            failed++;
        }
        await sleep(500); // Small delay between tests
    }

    // Summary
    log('\n========================================', colors.cyan);
    log('Test Results Summary', colors.cyan);
    log('========================================', colors.cyan);
    log(`Total Tests: ${tests.length}`, colors.reset);
    log(`Passed: ${passed}`, colors.green);
    log(`Failed: ${failed}`, failed > 0 ? colors.red : colors.green);
    log(`Success Rate: ${((passed / tests.length) * 100).toFixed(1)}%`, colors.cyan);
    log('========================================\n', colors.cyan);

    if (failed === 0) {
        log('🎉 All tests passed! Visitor tracking system is fully operational.', colors.green);
    } else {
        log(`⚠️  ${failed} test(s) failed. Please review errors above.`, colors.red);
    }

    process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
    log(`\n❌ Fatal error: ${error.message}`, colors.red);
    console.error(error);
    process.exit(1);
});
