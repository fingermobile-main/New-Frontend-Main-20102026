const db = require('../db');
const logger = require('../utils/logger');
const { DOMAINS } = require('../controllers/PlatformDomainManagementController');

let scheduler = null;
let cycleRunning = false;

const applyExpirySettings = async (client, domainKey, entityKey, resource) => {
  const { rows: settings } = await client.query(
    `SELECT enabled FROM platform_domain_automation_settings
     WHERE domain_key = $1 AND entity_key = $2`,
    [domainKey, entityKey]
  );
  if (!settings[0]?.enabled) return 0;

  await client.query('BEGIN');
  try {
    const expired = await client.query(
      `SELECT r.* FROM ${resource.table} r
       WHERE r.${resource.automation.expiryColumn} IS NOT NULL
         AND r.${resource.automation.expiryColumn} <= NOW()
         AND NOT EXISTS (
           SELECT 1 FROM platform_domain_management_state s
           WHERE s.domain_key = $1
             AND s.entity_key = $2
             AND s.record_id = r.id::text
             AND s.lifecycle_status = 'archived'
         )
       ORDER BY r.${resource.automation.expiryColumn} ASC
       LIMIT 100
       FOR UPDATE OF r SKIP LOCKED`,
      [domainKey, entityKey]
    );
    for (const before of expired.rows) {
      const columns = Object.keys(resource.lifecycle.columns);
      const values = [];
      const assignments = [];
      for (const column of columns) {
        const value = resource.lifecycle.columns[column].archived;
        if (value === undefined) continue;
        values.push(value);
        assignments.push(`${column} = $${values.length}`);
      }
      if (resource.fields.some(item => item.name === 'updated_at')) assignments.push('updated_at = NOW()');
      values.push(before.id);
      const { rows } = await client.query(
        `UPDATE ${resource.table} SET ${assignments.join(', ')} WHERE id = $${values.length} RETURNING *`,
        values
      );
      const priorStatus = Object.fromEntries(columns.map(column => [column, before[column]]));
      await client.query(
        `INSERT INTO platform_domain_management_state
          (domain_key, entity_key, record_id, lifecycle_status, prior_status, archived_at, updated_at)
         VALUES ($1, $2, $3, 'archived', $4::jsonb, NOW(), NOW())
         ON CONFLICT (domain_key, entity_key, record_id)
         DO UPDATE SET lifecycle_status = 'archived', prior_status = EXCLUDED.prior_status,
           archived_at = NOW(), updated_at = NOW()`,
        [domainKey, entityKey, String(before.id), JSON.stringify(priorStatus)]
      );
      await client.query(
        `INSERT INTO platform_domain_management_audit
          (domain_key, entity_key, record_id, action, reason, before_snapshot, after_snapshot)
         VALUES ($1, $2, $3, 'automatic_archive', 'Expiry automation', $4::jsonb, $5::jsonb)`,
        [domainKey, entityKey, String(before.id), JSON.stringify(before), JSON.stringify(rows[0])]
      );
    }
    await client.query('COMMIT');
    return expired.rowCount;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
};

const runExpiryCycle = async () => {
  if (cycleRunning) return 0;
  cycleRunning = true;
  const client = await db.pool.connect();
  let archivedCount = 0;
  try {
    for (const [domainKey, domain] of Object.entries(DOMAINS)) {
      for (const [entityKey, resource] of Object.entries(domain.entities)) {
        if (!resource.automation) continue;
        archivedCount += await applyExpirySettings(client, domainKey, entityKey, resource);
      }
    }
    return archivedCount;
  } catch (error) {
    logger.error('Platform domain expiry automation failed', error);
    throw error;
  } finally {
    client.release();
    cycleRunning = false;
  }
};

const startScheduler = () => {
  if (scheduler) return;
  scheduler = setInterval(() => {
    void runExpiryCycle().catch(error => logger.error('Platform domain expiry cycle failed', error));
  }, 60 * 1000);
  scheduler.unref?.();
};

const stopScheduler = () => {
  if (!scheduler) return;
  clearInterval(scheduler);
  scheduler = null;
};

module.exports = { runExpiryCycle, startScheduler, stopScheduler };
