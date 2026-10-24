const express = require('express');
const MasterDashboardController = require('../controllers/MasterDashboardController');
const MediaEcosystemManagementController = require('../controllers/MediaEcosystemManagementController');
const PlatformDomainManagementController = require('../controllers/PlatformDomainManagementController');
const requireMasterDashboardAccess = require('../middleware/requireMasterDashboardAccess');
const consoleUpload = require('../middleware/consoleUpload');

const router = express.Router();

// Require ROOT access (Stercs or SuperAdmin)
const requireRootAccess = requireMasterDashboardAccess;

// Overview & KPI Routes
router.get('/overview', requireRootAccess, MasterDashboardController.getOverview);

// Workspaces
router.get('/workspaces', requireRootAccess, MasterDashboardController.getWorkspaces);

// Content
router.get('/content/top', requireRootAccess, MasterDashboardController.getTopContent);

// System Health
router.get('/health', requireRootAccess, MasterDashboardController.getSystemHealth);

// Spend Caps Metrics
router.get('/spend-caps', requireRootAccess, MasterDashboardController.getSpendCapsMetrics);

// Account Inactivity Metrics
router.get('/account-inactivity', requireRootAccess, MasterDashboardController.getAccountInactivityMetrics);

// AI Bridge Prompt Engine Endpoint
router.post('/ai-bridge', requireRootAccess, MasterDashboardController.aiBridgeExecute);

// Dynamic Screens Catalog & SDUI CDC
router.get('/screens', requireRootAccess, MasterDashboardController.getScreensCatalog);
router.post('/screens', requireRootAccess, MasterDashboardController.publishScreen);
router.put('/screens/:slug', requireRootAccess, MasterDashboardController.updateScreen);
router.patch('/screens/:slug/status', requireRootAccess, MasterDashboardController.updateScreenStatus);
router.delete('/screens/:slug', requireRootAccess, MasterDashboardController.deleteScreen);

// Database-backed media ecosystems (archive preserves data and audit history)
// IMPORTANT: /ecosystems/upload must be declared BEFORE /:ecosystem/:entity so Express does not
// treat the literal string 'upload' as an ecosystem parameter.
router.post('/ecosystems/upload', requireRootAccess, consoleUpload.fields([
  { name: 'media', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
  { name: 'document', maxCount: 1 },
]), (req, res) => {
  try {
    const files = req.files || {};
    const result = {};
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    if (files.media && files.media[0]) {
      const f = files.media[0];
      const subDir = f.mimetype.startsWith('audio/') ? 'audio' : f.mimetype.startsWith('video/') ? 'media' : 'images';
      result.media_url = `${baseUrl}/uploads/${subDir}/${f.filename}`;
      result.media_filename = f.originalname;
      result.media_size_bytes = f.size;
      result.media_mimetype = f.mimetype;
    }
    if (files.thumbnail && files.thumbnail[0]) {
      const f = files.thumbnail[0];
      result.thumbnail_url = `${baseUrl}/uploads/images/${f.filename}`;
    }
    if (files.document && files.document[0]) {
      const f = files.document[0];
      result.document_url = `${baseUrl}/uploads/documents/${f.filename}`;
      result.document_filename = f.originalname;
    }

    if (Object.keys(result).length === 0) {
      return res.status(400).json({ success: false, message: 'No files received. Send at least one of: media, thumbnail, document.' });
    }

    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message || 'Upload failed.' });
  }
});

router.get('/ecosystems/:ecosystem/summary', requireRootAccess, MediaEcosystemManagementController.getEcosystemSummary);
router.patch('/ecosystems/:ecosystem/automation', requireRootAccess, MediaEcosystemManagementController.updateAutomation);
router.get('/ecosystems/:ecosystem/:entity', requireRootAccess, MediaEcosystemManagementController.listEntities);
router.get('/ecosystems/:ecosystem/:entity/:id/audit', requireRootAccess, MediaEcosystemManagementController.getEntityAudit);
router.post('/ecosystems/:ecosystem/:entity', requireRootAccess, MediaEcosystemManagementController.createEntity);
router.put('/ecosystems/:ecosystem/:entity/:id', requireRootAccess, MediaEcosystemManagementController.updateEntity);
router.patch('/ecosystems/:ecosystem/:entity/:id/lifecycle', requireRootAccess, MediaEcosystemManagementController.transitionEntity);
router.delete('/ecosystems/:ecosystem/:entity/:id', requireRootAccess, MediaEcosystemManagementController.archiveEntity);


// Database-backed management for community, media, discovery, and creator domains.
router.get('/domains', requireRootAccess, PlatformDomainManagementController.getDefinitions);
router.get('/domains/:domainKey/:entityKey', requireRootAccess, PlatformDomainManagementController.listRecords);
router.get('/domains/:domainKey/:entityKey/:id/audit', requireRootAccess, PlatformDomainManagementController.getAudit);
router.get('/domains/:domainKey/:entityKey/automation', requireRootAccess, PlatformDomainManagementController.getAutomation);
router.put('/domains/:domainKey/:entityKey/automation', requireRootAccess, PlatformDomainManagementController.updateAutomation);
router.post('/domains/:domainKey/:entityKey', requireRootAccess, PlatformDomainManagementController.createRecord);
router.put('/domains/:domainKey/:entityKey/:id', requireRootAccess, PlatformDomainManagementController.updateRecord);
router.patch('/domains/:domainKey/:entityKey/:id/lifecycle', requireRootAccess, PlatformDomainManagementController.transitionRecord);
router.delete('/domains/:domainKey/:entityKey/:id', requireRootAccess, (req, res, next) => {
  req.body = { ...req.body, status: 'archived', reason: req.body?.reason || 'Archived from Master Dashboard' };
  next();
}, PlatformDomainManagementController.transitionRecord);

// STERCS Policies
router.get('/policies', MasterDashboardController.getPolicies);
router.put('/policies/:code', requireRootAccess, MasterDashboardController.updatePolicy);

// Console Management Framework & Governance (35 Consoles + WORM Cryptographic Audit)
router.get('/consoles', MasterDashboardController.getConsolesCatalog);
router.get('/governance/overview', MasterDashboardController.getGovernanceOverview);
router.post('/governance/killswitch', requireRootAccess, MasterDashboardController.triggerKillswitch);
router.post('/governance/verify-chain', MasterDashboardController.verifyAuditChain);
router.get('/telemetry/charts', MasterDashboardController.getTelemetryCharts);
router.get('/gaps-assessment', MasterDashboardController.getGapsAssessment);

// PostgreSQL Database Management & Table Administration
router.get('/database/tables', MasterDashboardController.getDatabaseTables);

// Docker Container Management & Telemetry
router.get('/docker/containers', MasterDashboardController.getDockerContainers);

// Tribut Member Uploads & Pin Management
router.get('/media/tribut-uploads', MasterDashboardController.getTributUploads);
router.patch('/media/tribut-uploads/:id/pin', MasterDashboardController.toggleTributPinStatus);
router.delete('/media/tribut-uploads/batch', MasterDashboardController.batchDeleteTributUploads);

module.exports = router;
