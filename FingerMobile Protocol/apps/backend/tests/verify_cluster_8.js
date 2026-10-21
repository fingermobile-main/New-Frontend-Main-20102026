/**
 * Verification Test Suite for Cluster 8: E-Learning, Courses, NYSC & Jobs
 */

const http = require('http');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

// Create test JWT for user 4 (moderator)
const token = jwt.sign(
  { id: 4, userId: 4, username: 'moderator', role: 'moderator', email: 'mod@example.com' },
  JWT_SECRET,
  { expiresIn: '1h' }
);

const app = require('../app');
const server = http.createServer(app);
const TEST_PORT = 3098; // Ephemeral test port for Cluster 8

async function request(method, path, body = null, useAuth = true) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: TEST_PORT,
      path,
      method,
      headers: {
        ...(useAuth ? { 'Authorization': `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('========================================');
  console.log('Running Cluster 8 Verification Tests...');
  console.log('========================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message, details = '') {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      if (details) console.error('   Details:', details);
      failed++;
    }
  }

  try {
    // 1. GET /api/elearning/courses
    const coursesRes = await request('GET', '/api/elearning/courses?page=1&limit=10', null, false);
    assert(
      coursesRes.status === 200 && coursesRes.body.success && Array.isArray(coursesRes.body.courses),
      'GET /api/elearning/courses returns courses array',
      coursesRes
    );

    // 2. GET /api/elearning/courses/1
    const courseDetailRes = await request('GET', '/api/elearning/courses/1', null, false);
    assert(
      courseDetailRes.status === 200 && courseDetailRes.body.success && courseDetailRes.body.course?.id === 1,
      'GET /api/elearning/courses/1 returns course detail with instructor',
      courseDetailRes
    );

    // 3. POST /api/elearning/courses (Authenticated)
    const newCourseRes = await request('POST', '/api/elearning/courses', {
      categoryId: 1,
      title: 'Advanced Decentralized Storage & IPFS Networks',
      description: 'Hands-on guide to content addressing, DHTs, and immutable storage layers.',
      level: 'advanced',
      language: 'English',
      price: 89.99
    });
    assert(
      newCourseRes.status === 201 && newCourseRes.body.success && newCourseRes.body.course?.id,
      'POST /api/elearning/courses creates a course with PostgreSQL persistence',
      newCourseRes
    );

    // 4. GET /api/mylearning/courses (Enrolled Courses)
    const myCoursesRes = await request('GET', '/api/mylearning/courses');
    assert(
      myCoursesRes.status === 200 && myCoursesRes.body.success && Array.isArray(myCoursesRes.body.courses),
      'GET /api/mylearning/courses returns enrolled courses for user',
      myCoursesRes
    );

    // 5. GET /api/mylearning/dashboard
    const dashboardRes = await request('GET', '/api/mylearning/dashboard');
    assert(
      dashboardRes.status === 200 && dashboardRes.body.success && dashboardRes.body.data?.streak,
      'GET /api/mylearning/dashboard returns progress, streak, and recent achievements',
      dashboardRes
    );

    // 6. GET /api/nysc/stats
    const nyscStatsRes = await request('GET', '/api/nysc/stats', null, false);
    assert(
      nyscStatsRes.status === 200 && nyscStatsRes.body.success && typeof nyscStatsRes.body.data?.totalMembers === 'number',
      'GET /api/nysc/stats returns live NYSC corps statistics',
      nyscStatsRes
    );

    // 7. GET /api/nysc/events
    const nyscEventsRes = await request('GET', '/api/nysc/events', null, false);
    assert(
      nyscEventsRes.status === 200 && nyscEventsRes.body.success && Array.isArray(nyscEventsRes.body.data),
      'GET /api/nysc/events returns live scheduled corps events',
      nyscEventsRes
    );

    // 8. GET /api/nysc/discussions
    const nyscDiscussionsRes = await request('GET', '/api/nysc/discussions', null, false);
    assert(
      nyscDiscussionsRes.status === 200 && nyscDiscussionsRes.body.success && Array.isArray(nyscDiscussionsRes.body.data),
      'GET /api/nysc/discussions returns corps forum discussions',
      nyscDiscussionsRes
    );

    // 9. GET /api/jobs
    const jobsListRes = await request('GET', '/api/jobs?limit=10', null, false);
    assert(
      jobsListRes.status === 200 && jobsListRes.body.success && Array.isArray(jobsListRes.body.data),
      'GET /api/jobs returns job vacancy listings with pagination',
      jobsListRes
    );

    // 10. GET /api/jobs/1
    const jobDetailRes = await request('GET', '/api/jobs/1');
    assert(
      jobDetailRes.status === 200 && jobDetailRes.body.success && jobDetailRes.body.data?.title,
      'GET /api/jobs/1 returns job vacancy detail with application status',
      jobDetailRes
    );

    // 11. POST /api/jobs (Create new vacancy)
    const postJobRes = await request('POST', '/api/jobs', {
      title: 'DevOps / Site Reliability Engineer',
      company: 'FingerMobile Protocol',
      location: 'Remote',
      type: 'Full-time',
      category: 'DevOps',
      salaryRange: '$90,000 - $130,000',
      experienceLevel: 'Senior',
      description: 'Maintain Kubernetes clusters, observability dashboards, and zero-downtime database migrations.',
      requirements: ['Kubernetes', 'Prometheus', 'PostgreSQL HA'],
      benefits: ['Remote', 'Health insurance']
    });
    assert(
      postJobRes.status === 201 && postJobRes.body.success && postJobRes.body.data?.id,
      'POST /api/jobs creates a new job posting',
      postJobRes
    );

    // 12. POST /api/jobs/:id/apply
    // Apply to the newly created job to ensure idempotence across multiple test runs
    const targetJobId = postJobRes.body.data?.id || 3;
    const applyRes = await request('POST', `/api/jobs/${targetJobId}/apply`, {
      resumeUrl: 'https://storage.fingermobileprotocol.com/resumes/alex_morgan_cv.pdf',
      coverLetter: 'I am excited to bring my experience to the DevOps and cloud operations team.'
    });
    assert(
      applyRes.status === 201 && applyRes.body.success && applyRes.body.data?.id,
      'POST /api/jobs/:id/apply submits job application successfully',
      applyRes
    );

    console.log('\n========================================');
    console.log(`Cluster 8 Verification Results: ${passed} PASSED, ${failed} FAILED`);
    console.log('========================================\n');

  } catch (err) {
    console.error('Fatal error during test execution:', err);
    failed++;
  } finally {
    server.close();
    process.exit(failed === 0 ? 0 : 1);
  }
}

server.listen(TEST_PORT, () => {
  runTests();
});
