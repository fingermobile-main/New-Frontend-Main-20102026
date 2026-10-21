const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const logger = require('../utils/logger');

const execAsync = promisify(exec);

class BackupService {
  constructor() {
    this.backupDir = process.env.BACKUP_DIR || path.join(__dirname, '../backups');
    this.maxBackupAge = parseInt(process.env.BACKUP_RETENTION_DAYS) || 30; // days

    // Ensure backup directory exists
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      logger.info(`✅ Backup directory created: ${this.backupDir}`);
    }
  }

  /**
   * Create PostgreSQL database backup
   */
  async createDatabaseBackup(databaseName = 'fingermobile') {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupDir, `${databaseName}_${timestamp}.sql`);

      const dbUrl = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${databaseName}`;

      logger.info(`🔄 Starting database backup: ${backupFile}`);

      const command = `pg_dump "${dbUrl}" -f "${backupFile}" --format=plain --no-owner --no-acl`;

      await execAsync(command);

      // Verify backup was created
      if (fs.existsSync(backupFile)) {
        const stats = fs.statSync(backupFile);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

        logger.info(`✅ Database backup completed: ${backupFile} (${sizeMB} MB)`);

        // Compress backup
        await this.compressBackup(backupFile);

        return {
          success: true,
          backupFile: backupFile + '.gz',
          size: sizeMB,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error('Backup file not created');
      }
    } catch (error) {
      logger.error('❌ Database backup failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Compress backup file using gzip
   */
  async compressBackup(backupFile) {
    try {
      const compressedFile = backupFile + '.gz';

      const command = `gzip "${backupFile}"`;
      await execAsync(command);

      logger.info(`✅ Backup compressed: ${compressedFile}`);

      return compressedFile;
    } catch (error) {
      logger.error('⚠️ Backup compression failed:', error.message);
      // Don't fail the backup if compression fails
      return backupFile;
    }
  }

  /**
   * Restore database from backup
   */
  async restoreDatabase(backupFilePath, databaseName = 'fingermobile') {
    try {
      logger.info(`🔄 Starting database restore from: ${backupFilePath}`);

      // Check if file is compressed
      let decompressedFile = backupFilePath;
      if (backupFilePath.endsWith('.gz')) {
        decompressedFile = backupFilePath.replace('.gz', '');
        const command = `gunzip -k "${backupFilePath}"`;
        await execAsync(command);
        logger.info(`✅ Backup decompressed: ${decompressedFile}`);
      }

      const dbUrl = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${databaseName}`;

      // Drop and recreate database
      logger.info('⚠️ Dropping existing database...');
      await execAsync(`psql "${dbUrl}" -c "DROP DATABASE IF EXISTS ${databaseName};"`);
      await execAsync(`psql "${dbUrl}" -c "CREATE DATABASE ${databaseName};"`);

      // Restore from backup
      const restoreCommand = `psql "${dbUrl}" -f "${decompressedFile}"`;
      await execAsync(restoreCommand);

      logger.info(`✅ Database restored successfully from: ${backupFilePath}`);

      return {
        success: true,
        message: 'Database restored successfully',
        backupFile: backupFilePath
      };
    } catch (error) {
      logger.error('❌ Database restore failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * List available backups
   */
  listBackups() {
    try {
      const files = fs.readdirSync(this.backupDir)
        .filter(file => file.endsWith('.sql.gz') || file.endsWith('.sql'))
        .map(file => {
          const filePath = path.join(this.backupDir, file);
          const stats = fs.statSync(filePath);

          return {
            filename: file,
            path: filePath,
            size: (stats.size / (1024 * 1024)).toFixed(2) + ' MB',
            createdAt: stats.birthtime.toISOString()
          };
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return {
        success: true,
        backups: files,
        count: files.length
      };
    } catch (error) {
      logger.error('❌ List backups failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Delete old backups based on retention policy
   */
  async cleanupOldBackups() {
    try {
      logger.info(`🧹 Starting backup cleanup (retention: ${this.maxBackupAge} days)`);

      const now = Date.now();
      const maxAge = this.maxBackupAge * 24 * 60 * 60 * 1000; // Convert to milliseconds

      const files = fs.readdirSync(this.backupDir);
      let deletedCount = 0;

      for (const file of files) {
        if (file.endsWith('.sql.gz') || file.endsWith('.sql')) {
          const filePath = path.join(this.backupDir, file);
          const stats = fs.statSync(filePath);
          const age = now - stats.birthtime.getTime();

          if (age > maxAge) {
            fs.unlinkSync(filePath);
            logger.info(`🗑️ Deleted old backup: ${file}`);
            deletedCount++;
          }
        }
      }

      logger.info(`✅ Cleanup completed: ${deletedCount} backups deleted`);

      return {
        success: true,
        deletedCount
      };
    } catch (error) {
      logger.error('❌ Backup cleanup failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Schedule automatic backups
   */
  scheduleAutomaticBackups() {
    // Daily backup at 2 AM
    const dailyBackup = setInterval(async () => {
      const hour = new Date().getHours();
      if (hour === 2) {
        logger.info('🕐 Running scheduled daily backup...');
        await this.createDatabaseBackup();
      }
    }, 60 * 60 * 1000); // Check every hour

    // Weekly cleanup on Sundays
    const weeklyCleanup = setInterval(async () => {
      const day = new Date().getDay();
      if (day === 0) { // Sunday
        logger.info('🕐 Running scheduled weekly cleanup...');
        await this.cleanupOldBackups();
      }
    }, 24 * 60 * 60 * 1000); // Check daily

    logger.info('✅ Automatic backup scheduling enabled');

    return { dailyBackup, weeklyCleanup };
  }

  /**
   * Get backup statistics
   */
  getBackupStats() {
    try {
      const backups = this.listBackups();

      if (!backups.success) {
        return backups;
      }

      const totalSize = backups.backups.reduce((sum, backup) => {
        return sum + parseFloat(backup.size);
      }, 0);

      return {
        success: true,
        totalBackups: backups.count,
        totalSize: totalSize.toFixed(2) + ' MB',
        oldestBackup: backups.backups[backups.backups.length - 1]?.createdAt,
        newestBackup: backups.backups[0]?.createdAt
      };
    } catch (error) {
      logger.error('❌ Get backup stats failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new BackupService();
