const db = require('../db');
const logger = require('../utils/logger');

const EXPIRABLE_MEDIA = {
  dancia: [{ entity: 'videos', table: 'dancia_videos', activeColumn: true }],
  beatwave: [
    { entity: 'audio_novels', table: 'beatwave_audio_novels', activeColumn: false },
    { entity: 'podcasts', table: 'beatwave_podcasts', activeColumn: false }
  ]
};

async function runExpirySweep() {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const settings = await client.query(
      'SELECT ecosystem FROM media_management_settings WHERE auto_archive_expired = TRUE'
    );
    const enabledEcosystems = new Set(settings.rows.map(row => row.ecosystem));
    const archivedByEcosystem = {};

    for (const [ecosystem, entities] of Object.entries(EXPIRABLE_MEDIA)) {
      if (!enabledEcosystems.has(ecosystem)) continue;
      archivedByEcosystem[ecosystem] = {};
      for (const { entity, table, activeColumn } of entities) {
        const deactivate = activeColumn ? ', is_active = FALSE' : '';
        const result = await client.query(`
          WITH candidates AS (
            SELECT *
            FROM ${table}
            WHERE expires_at <= NOW()
              AND archived_at IS NULL
              AND moderation_status NOT IN ('frozen', 'blocked', 'suspended', 'archived')
            FOR UPDATE SKIP LOCKED
          ),
          expired AS (
            UPDATE ${table} AS media
            SET status_before_hold = candidates.moderation_status,
                moderation_status = 'archived',
                archived_at = NOW(),
                archived_by = 'system:ttl',
                updated_by = 'system:ttl',
                updated_at = NOW()${deactivate}
            FROM candidates
            WHERE media.id = candidates.id
            RETURNING media.*
          )
          INSERT INTO media_management_audit
            (ecosystem, entity_type, entity_id, action, actor_id, previous_state, new_state)
          SELECT
            $1,
            $2,
            expired.id::text,
            'TTL_ARCHIVE',
            'system:ttl',
            to_jsonb(candidates),
            to_jsonb(expired)
          FROM expired
          JOIN candidates ON candidates.id = expired.id
        `, [ecosystem, entity]);
        archivedByEcosystem[ecosystem][entity] = result.rowCount;
      }
    }
    await client.query('COMMIT');
    return archivedByEcosystem;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

function startScheduler(intervalMs = 60_000) {
  let sweepRunning = false;
  const sweep = async () => {
    if (sweepRunning) return;
    sweepRunning = true;
    try {
      const counts = await runExpirySweep();
      const changedCount = Object.values(counts)
        .flatMap(entities => Object.values(entities))
        .reduce((total, count) => total + count, 0);
      if (changedCount) logger.info('Expired media catalog records archived', counts);
    } catch (error) {
      logger.error('Media expiry archival sweep failed', error);
    } finally {
      sweepRunning = false;
    }
  };

  void sweep();
  const timer = setInterval(() => void sweep(), intervalMs);
  timer.unref();
  return timer;
}

module.exports = { runExpirySweep, startScheduler };
