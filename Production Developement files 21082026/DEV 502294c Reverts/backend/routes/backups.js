const express = require('express');
const logger = require('../utils/logger');
const router = express.Router();
const BackupService = require('../services/BackupService');

// POST /api/backups/create - Create database backup (admin only)
router.post('/create', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    // TODO: Verify admin role
    // if (!req.user?.isAdmin) {
    //   return res.status(403).json({ success: false, error: 'Admin access required' });
    // }
    
    const result = await BackupService.createDatabaseBackup();
    
    res.json(result);
  } catch (error) {
    logger.error('❌ Create backup failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to create backup'
    });
  }
});

// GET /api/backups/list - List available backups (admin only)
router.get('/list', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    // TODO: Verify admin role
    // if (!req.user?.isAdmin) {
    //   return res.status(403).json({ success: false, error: 'Admin access required' });
    // }
    
    const result = BackupService.listBackups();
    
    res.json(result);
  } catch (error) {
    logger.error('❌ List backups failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to list backups'
    });
  }
});

// POST /api/backups/restore - Restore from backup (admin only, DANGEROUS)
router.post('/restore', async (req, res) => {
  try {
    const userId = req.user?.id;
    const { backupFile } = req.body;
    
    // TODO: Verify admin role
    // if (!req.user?.isAdmin) {
    //   return res.status(403).json({ success: false, error: 'Admin access required' });
    // }
    
    if (!backupFile) {
      return res.status(400).json({
        success: false, error: 'Backup file path required'
      });
    }
    
    logger.info(`⚠️ WARNING: User ${userId} initiating database restore from ${backupFile}`);
    
    const result = await BackupService.restoreDatabase(backupFile);
    
    res.json(result);
  } catch (error) {
    logger.error('❌ Restore backup failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to restore backup'
    });
  }
});

// DELETE /api/backups/cleanup - Clean up old backups (admin only)
router.delete('/cleanup', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    // TODO: Verify admin role
    // if (!req.user?.isAdmin) {
    //   return res.status(403).json({ success: false, error: 'Admin access required' });
    // }
    
    const result = await BackupService.cleanupOldBackups();
    
    res.json(result);
  } catch (error) {
    logger.error('❌ Cleanup backups failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to cleanup backups'
    });
  }
});

// GET /api/backups/stats - Get backup statistics (admin only)
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    // TODO: Verify admin role
    // if (!req.user?.isAdmin) {
    //   return res.status(403).json({ success: false, error: 'Admin access required' });
    // }
    
    const result = BackupService.getBackupStats();
    
    res.json(result);
  } catch (error) {
    logger.error('❌ Get backup stats failed:', error.message);
    res.status(500).json({
      success: false, error: 'Failed to get backup statistics'
    });
  }
});

module.exports = router;
