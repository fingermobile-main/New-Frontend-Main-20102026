const { randomUUID } = require('crypto');
const db = require('../db');
const logger = require('../utils/logger');

const COMMON_FIELDS = ['admin_notes'];
const COMMON_COLUMNS = [
  'id',
  'moderation_status',
  'risk_flag',
  'warning_count',
  'archived_at',
  'admin_notes',
  'created_by',
  'updated_by',
  'created_at',
  'updated_at'
];

const ECOSYSTEMS = {
  dancia: {
    videos: {
      table: 'dancia_videos',
      required: ['title', 'stream_url'],
      fields: [
        'title', 'description', 'genre', 'stream_url', 'thumbnail_url',
        'duration_seconds', 'resolution', 'iarc_rating', 'creator',
        'regional_category', 'source_type', 'ttl_days', 'expires_at'
      ],
      columns: [...COMMON_COLUMNS, 'is_active', 'views', 'likes', 'status_before_hold'],
      types: {
        duration_seconds: 'positiveInteger',
        ttl_days: 'ttl',
        expires_at: 'date',
        source_type: { enum: ['live_broadcast', 'temporal_drop', 'studio_vod', 'community_upload'] }
      },
      supportsRisk: true,
      supportsWarnings: true,
      supportsPublication: true,
      publicationMediaField: 'stream_url',
      visibility: 'moderation_status = \'active\' AND is_active = TRUE'
    },
    channels: {
      table: 'dancia_channels',
      required: ['name', 'stream_url'],
      fields: ['name', 'description', 'stream_url'],
      columns: [...COMMON_COLUMNS, 'is_active', 'status_before_hold'],
      types: {},
      supportsRisk: false,
      supportsWarnings: false,
      supportsPublication: true,
      publicationMediaField: 'stream_url',
      visibility: 'moderation_status = \'active\' AND is_active = TRUE'
    },
    programs: {
      table: 'dancia_programs',
      required: ['channel_id', 'title'],
      fields: ['channel_id', 'title', 'description', 'genre', 'thumbnail_url', 'duration_seconds'],
      columns: [...COMMON_COLUMNS, 'status_before_hold'],
      types: { duration_seconds: 'positiveInteger' },
      supportsRisk: false,
      supportsWarnings: false,
      supportsPublication: true,
      visibility: 'moderation_status = \'active\''
    },
    schedules: {
      table: 'dancia_schedules',
      required: ['program_id', 'start_time', 'end_time'],
      fields: ['program_id', 'start_time', 'end_time', 'is_live'],
      columns: [...COMMON_COLUMNS, 'status_before_hold'],
      types: { start_time: 'date', end_time: 'date', is_live: 'boolean' },
      supportsRisk: false,
      supportsWarnings: false,
      supportsPublication: true,
      visibility: 'moderation_status = \'active\''
    },
    plans: {
      table: 'dancia_subscription_plans',
      required: ['name'],
      fields: ['name', 'description', 'price', 'currency', 'billing_interval', 'features'],
      columns: [...COMMON_COLUMNS, 'is_active', 'status_before_hold'],
      types: {
        price: 'nonNegativeNumber',
        currency: { pattern: /^[A-Z]{3}$/ },
        billing_interval: { enum: ['monthly', 'quarterly', 'yearly', 'one_time'] },
        features: 'stringArray'
      },
      supportsRisk: false,
      supportsWarnings: false,
      supportsPublication: true,
      visibility: 'moderation_status = \'active\' AND is_active = TRUE'
    }
  },
  beatwave: {
    tracks: {
      table: 'beatwave_tracks',
      required: ['title', 'url'],
      fields: [
        'title', 'artist_id', 'album_id', 'author_id', 'duration', 'url',
        'cover_art', 'genre', 'year', 'track_number', 'writer', 'producer',
        'bpm', 'musical_key', 'explicit'
      ],
      columns: [...COMMON_COLUMNS, 'plays', 'likes', 'dislikes', 'download_count', 'is_published', 'status_before_hold'],
      types: {
        artist_id: 'positiveInteger',
        album_id: 'positiveInteger',
        author_id: 'positiveInteger',
        duration: 'positiveInteger',
        year: 'year',
        track_number: 'positiveInteger',
        bpm: 'positiveInteger',
        explicit: 'boolean'
      },
      supportsRisk: true,
      supportsWarnings: true,
      supportsPublication: true,
      publicationMediaField: 'url',
      visibility: 'moderation_status = \'active\' AND is_published = TRUE'
    },
    artists: {
      table: 'beatwave_artists',
      required: ['name'],
      fields: ['name', 'bio', 'cover_art', 'verified', 'social_links'],
      columns: [...COMMON_COLUMNS, 'followers', 'status_before_hold'],
      types: { verified: 'boolean', social_links: 'object' },
      supportsRisk: true,
      supportsWarnings: true,
      supportsPublication: true,
      visibility: 'moderation_status = \'active\''
    },
    albums: {
      table: 'beatwave_albums',
      required: ['title'],
      fields: ['title', 'artist_id', 'year', 'cover_art', 'genre', 'description'],
      columns: [...COMMON_COLUMNS, 'total_tracks', 'duration', 'status_before_hold'],
      types: { artist_id: 'positiveInteger', year: 'year' },
      supportsRisk: true,
      supportsWarnings: true,
      supportsPublication: true,
      visibility: 'moderation_status = \'active\''
    },
    playlists: {
      table: 'beatwave_playlists',
      required: ['title'],
      fields: ['title', 'description', 'owner_id', 'cover_art', 'is_public', 'is_collaborative'],
      columns: [...COMMON_COLUMNS, 'follower_count', 'total_tracks', 'total_duration', 'status_before_hold'],
      types: { owner_id: 'positiveInteger', is_public: 'boolean', is_collaborative: 'boolean' },
      supportsRisk: true,
      supportsWarnings: true,
      supportsPublication: true,
      visibility: 'moderation_status = \'active\' AND is_public = TRUE'
    },
    genres: {
      table: 'beatwave_genres',
      required: ['name', 'slug'],
      fields: ['name', 'slug', 'description', 'icon_url', 'parent_genre_id'],
      columns: [...COMMON_COLUMNS, 'track_count', 'status_before_hold'],
      types: { parent_genre_id: 'positiveInteger' },
      supportsRisk: false,
      supportsWarnings: false,
      supportsPublication: true,
      visibility: 'moderation_status = \'active\''
    },
    audio_novels: {
      table: 'beatwave_audio_novels',
      required: ['title', 'author'],
      fields: [
        'title', 'author', 'synopsis', 'narrator_voice', 'cover_art',
        'duration_minutes', 'genre', 'audio_url', 'source_type',
        'source_file_name', 'source_file_size_mb', 'source_file_type',
        'ai_prompt_used', 'manuscript_text', 'ttl_days', 'expires_at'
      ],
      columns: [...COMMON_COLUMNS, 'status_before_hold'],
      types: {
        duration_minutes: 'audioDuration',
        source_file_size_mb: 'nonNegativeNumber',
        ttl_days: 'ttl',
        expires_at: 'date',
        source_type: { enum: ['ai_prompt', 'text_upload', 'audio_upload', 'live_recording'] }
      },
      supportsRisk: true,
      supportsWarnings: true,
      supportsPublication: true,
      publicationMediaField: 'audio_url',
      visibility: 'moderation_status = \'active\''
    },
    podcasts: {
      table: 'beatwave_podcasts',
      required: ['title', 'host'],
      fields: [
        'title', 'host', 'guest', 'description', 'cover_art',
        'duration_minutes', 'genre', 'episode_number', 'audio_url',
        'tags', 'source_type', 'source_file_name', 'source_file_size_mb',
        'source_file_type', 'ttl_days', 'expires_at'
      ],
      columns: [...COMMON_COLUMNS, 'status_before_hold'],
      types: {
        duration_minutes: 'audioDuration',
        episode_number: 'positiveInteger',
        source_file_size_mb: 'nonNegativeNumber',
        ttl_days: 'ttl',
        expires_at: 'date',
        tags: 'stringArray',
        source_type: { enum: ['ai_prompt', 'text_upload', 'audio_upload', 'live_recording'] }
      },
      supportsRisk: true,
      supportsWarnings: true,
      supportsPublication: true,
      publicationMediaField: 'audio_url',
      visibility: 'moderation_status = \'active\''
    }
  }
};

const RISK_FLAGS = new Set(['green', 'yellow', 'orange', 'red']);
const LIFECYCLE_ACTIONS = new Set(['publish', 'freeze', 'block', 'suspend', 'restore', 'archive', 'flag', 'warn']);

function getActorId(req) {
  const actorId = req.user?.id || req.user?.userId || req.user?.sub || req.member?.id || req.member?.userId;
  return actorId == null ? null : String(actorId);
}

function getEntityConfig(ecosystem, entity) {
  const config = ECOSYSTEMS[ecosystem]?.[entity];
  if (!config) {
    const error = new Error('Unknown media ecosystem or entity type');
    error.statusCode = 404;
    throw error;
  }
  return config;
}

function validateFieldValue(field, value, type) {
  if (value === null || value === undefined) return null;
  if (type === undefined && typeof value !== 'string') return `${field} must be a string`;
  const numericValue = typeof value === 'number' || (typeof value === 'string' && value.trim() !== '');
  if (typeof type === 'object' && type.enum && !type.enum.includes(value)) {
    return `${field} has an unsupported value`;
  }
  if (typeof type === 'object' && type.pattern && (typeof value !== 'string' || !type.pattern.test(value))) {
    return `${field} has an invalid format`;
  }
  if (type === 'boolean' && typeof value !== 'boolean') return `${field} must be a boolean`;
  if (type === 'object' && (typeof value !== 'object' || Array.isArray(value))) return `${field} must be a JSON object`;
  if (type === 'stringArray' && (!Array.isArray(value) || value.some(item => typeof item !== 'string'))) {
    return `${field} must be an array of strings`;
  }
  if (type === 'positiveInteger' && (!numericValue || !Number.isInteger(Number(value)) || Number(value) <= 0)) {
    return `${field} must be a positive integer`;
  }
  if (type === 'nonNegativeNumber' && (!numericValue || !Number.isFinite(Number(value)) || Number(value) < 0)) {
    return `${field} must be a non-negative number`;
  }
  if (type === 'year' && (!numericValue || !Number.isInteger(Number(value)) || Number(value) < 1800 || Number(value) > 2200)) {
    return `${field} must be a year between 1800 and 2200`;
  }
  if (type === 'audioDuration' && (!numericValue || !Number.isInteger(Number(value)) || Number(value) < 1 || Number(value) > 30)) {
    return `${field} must be between 1 and 30 minutes`;
  }
  if (type === 'ttl' && (!numericValue || ![3, 7, 30].includes(Number(value)))) {
    return `${field} must be 3, 7, or 30 days`;
  }
  if (type === 'date' && (typeof value !== 'string' || Number.isNaN(Date.parse(value)))) return `${field} must be a valid date`;
  if (typeof value === 'string' && value.length > 20000) return `${field} exceeds the maximum length`;
  return null;
}

function validatePayload(config, body, { partial = false } = {}) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Request body must be a JSON object';
  const allowedFields = new Set([...config.fields, ...COMMON_FIELDS]);
  const unknownFields = Object.keys(body).filter(field => !allowedFields.has(field));
  if (unknownFields.length) return `Unsupported fields: ${unknownFields.join(', ')}`;

  if (!partial) {
    const missing = config.required.filter(field => body[field] === undefined || body[field] === null || body[field] === '');
    if (missing.length) return `Required fields: ${missing.join(', ')}`;
  }
  for (const [field, value] of Object.entries(body)) {
    const validationError = validateFieldValue(field, value, config.types[field]);
    if (validationError) return validationError;
    if (COMMON_FIELDS.includes(field) && typeof value !== 'string') return `${field} must be a string`;
  }
  return null;
}

async function withTransaction(operation) {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const result = await operation(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function recordAudit(client, { ecosystem, entity, id, action, actorId, previousState, newState }) {
  await client.query(`
    INSERT INTO media_management_audit
      (ecosystem, entity_type, entity_id, action, actor_id, previous_state, new_state)
    VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb)
  `, [
    ecosystem,
    entity,
    String(id),
    action,
    actorId,
    previousState == null ? null : JSON.stringify(previousState),
    newState == null ? null : JSON.stringify(newState)
  ]);
}

function getEntityId(id) {
  if (typeof id !== 'string' || !id || id.length > 100) {
    const error = new Error('Invalid entity ID');
    error.statusCode = 400;
    throw error;
  }
  return id;
}

function applyExpiryDefaults(ecosystem, entity, body) {
  if (!['videos', 'audio_novels', 'podcasts'].includes(entity)) return body;
  const temporalDanciaVideo = ecosystem === 'dancia' &&
    ['live_broadcast', 'temporal_drop'].includes(body.source_type);
  const ttl = body.ttl_days ?? (ecosystem === 'dancia' ? (temporalDanciaVideo ? 3 : null) : 30);
  if (body.expires_at === undefined && ttl !== null && (ecosystem === 'beatwave' || temporalDanciaVideo)) {
    body.ttl_days = ttl;
    body.expires_at = new Date(Date.now() + Number(ttl) * 86400000).toISOString();
  }
  return body;
}

exports.getEcosystemSummary = async (req, res) => {
  const { ecosystem } = req.params;
  if (!ECOSYSTEMS[ecosystem]) return res.status(404).json({ success: false, message: 'Unknown media ecosystem' });
  try {
    const [entityCounts, automation] = await Promise.all([
      Promise.all(Object.entries(ECOSYSTEMS[ecosystem]).map(async ([entity, config]) => {
        const result = await db.query(`
        SELECT moderation_status, COUNT(*)::integer AS count
        FROM ${config.table}
        GROUP BY moderation_status
      `);
        return [entity, result.rows.reduce((counts, row) => {
          counts[row.moderation_status] = row.count;
          return counts;
        }, {})];
      })),
      db.query(
        'SELECT auto_archive_expired FROM media_management_settings WHERE ecosystem = $1',
        [ecosystem]
      )
    ]);
    return res.json({
      success: true,
      data: {
        ecosystem,
        entities: Object.fromEntries(entityCounts),
        automation: { autoArchiveExpired: automation.rows[0]?.auto_archive_expired === true }
      }
    });
  } catch (error) {
    logger.error(`Failed to load ${ecosystem} media summary`, error);
    return res.status(500).json({ success: false, message: 'Unable to load media ecosystem summary' });
  }
};

exports.updateAutomation = async (req, res) => {
  const { ecosystem } = req.params;
  const { autoArchiveExpired } = req.body || {};
  if (!ECOSYSTEMS[ecosystem]) return res.status(404).json({ success: false, message: 'Unknown media ecosystem' });
  if (typeof autoArchiveExpired !== 'boolean') {
    return res.status(400).json({ success: false, message: 'autoArchiveExpired must be a boolean' });
  }
  const actorId = getActorId(req);
  try {
    const result = await withTransaction(async client => {
      const previous = await client.query(
        'SELECT * FROM media_management_settings WHERE ecosystem = $1 FOR UPDATE',
        [ecosystem]
      );
      const updated = await client.query(`
        UPDATE media_management_settings
        SET auto_archive_expired = $2, updated_by = $3, updated_at = NOW()
        WHERE ecosystem = $1
        RETURNING *
      `, [ecosystem, autoArchiveExpired, actorId]);
      if (!updated.rows.length) {
        const error = new Error('Media automation settings are not initialized');
        error.statusCode = 500;
        throw error;
      }
      await recordAudit(client, {
        ecosystem,
        entity: 'automation',
        id: ecosystem,
        action: 'SETTING_UPDATE',
        actorId,
        previousState: previous.rows[0] || null,
        newState: updated.rows[0]
      });
      return updated.rows[0];
    });
    return res.json({ success: true, data: { autoArchiveExpired: result.auto_archive_expired } });
  } catch (error) {
    logger.error(`Failed to update ${ecosystem} media automation`, error);
    return res.status(500).json({ success: false, message: 'Unable to update media automation settings' });
  }
};

exports.listEntities = async (req, res) => {
  const { ecosystem, entity } = req.params;
  let config;
  try {
    config = getEntityConfig(ecosystem, entity);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
  const includeArchived = req.query.includeArchived === 'true';
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 100, 1), 250);
  const offset = Math.max(Number.parseInt(req.query.offset, 10) || 0, 0);
  const searchFields = config.fields.filter(field => ['title', 'name', 'author', 'host', 'genre', 'slug'].includes(field));
  const params = [];
  let where = includeArchived ? '' : 'WHERE archived_at IS NULL';
  if (search && searchFields.length) {
    const searchFilter = searchFields.map(field => {
      params.push(`%${search}%`);
      return `${field} ILIKE $${params.length}`;
    }).join(' OR ');
    where += `${where ? ' AND' : 'WHERE'} (${searchFilter})`;
  }
  params.push(limit, offset);
  try {
    const result = await db.query(`
      SELECT *
      FROM ${config.table}
      ${where}
      ORDER BY updated_at DESC, id DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}
    `, params);
    return res.json({ success: true, data: result.rows, limit, offset });
  } catch (error) {
    logger.error(`Failed to list ${ecosystem} ${entity}`, error);
    return res.status(500).json({ success: false, message: `Unable to load ${entity}` });
  }
};

exports.createEntity = async (req, res) => {
  const { ecosystem, entity } = req.params;
  let config;
  try {
    config = getEntityConfig(ecosystem, entity);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
  const validationError = validatePayload(config, req.body);
  if (validationError) return res.status(400).json({ success: false, message: validationError });
  const actorId = getActorId(req);
  const body = applyExpiryDefaults(ecosystem, entity, { ...req.body });

  try {
    const entityRecord = await withTransaction(async client => {
      const id = body.id || (['videos', 'channels', 'programs', 'schedules', 'plans', 'audio_novels', 'podcasts'].includes(entity) ? randomUUID() : undefined);
      delete body.id;
      const fields = Object.keys(body);
      const columns = [...fields, 'moderation_status', 'created_by', 'updated_by'];
      const values = [
        ...fields.map(field => ['object', 'stringArray'].includes(config.types[field]) ? JSON.stringify(body[field]) : body[field]),
        'draft',
        actorId,
        actorId
      ];
      if (id !== undefined) {
        columns.unshift('id');
        values.unshift(id);
      }
      const placeholders = values.map((_, index) => `$${index + 1}`);
      const result = await client.query(`
        INSERT INTO ${config.table} (${columns.join(', ')})
        VALUES (${placeholders.join(', ')})
        RETURNING *
      `, values);
      const created = result.rows[0];
      await recordAudit(client, { ecosystem, entity, id: created.id, action: 'CREATE', actorId, previousState: null, newState: created });
      return created;
    });
    return res.status(201).json({ success: true, data: entityRecord });
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ success: false, message: 'An entity with the same unique identifier already exists' });
    if (error.code === '23503' || error.code === '23514' || error.code === '22P02') {
      return res.status(400).json({ success: false, message: 'The supplied data does not satisfy a catalog relationship or constraint' });
    }
    logger.error(`Failed to create ${ecosystem} ${entity}`, error);
    return res.status(500).json({ success: false, message: `Unable to create ${entity}` });
  }
};

exports.updateEntity = async (req, res) => {
  const { ecosystem, entity } = req.params;
  let config;
  let id;
  try {
    config = getEntityConfig(ecosystem, entity);
    id = getEntityId(req.params.id);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
  const validationError = validatePayload(config, req.body, { partial: true });
  if (validationError) return res.status(400).json({ success: false, message: validationError });
  if (!Object.keys(req.body || {}).length) return res.status(400).json({ success: false, message: 'Provide at least one supported field to update' });
  const actorId = getActorId(req);

  try {
    const updated = await withTransaction(async client => {
      const current = await client.query(`SELECT * FROM ${config.table} WHERE id = $1 FOR UPDATE`, [id]);
      if (!current.rows.length) return null;
      const previousState = current.rows[0];
      if (previousState.archived_at || ['frozen', 'blocked', 'suspended'].includes(previousState.moderation_status)) {
        const error = new Error('Held records must be restored before editing');
        error.statusCode = 409;
        throw error;
      }
      const updateBody = { ...req.body };
      if (updateBody.expires_at === undefined) {
        const sourceType = updateBody.source_type || previousState.source_type;
        const isTemporalDancia = ecosystem === 'dancia' &&
          ['live_broadcast', 'temporal_drop'].includes(sourceType);
        if (
          ecosystem === 'beatwave' &&
          updateBody.ttl_days !== undefined
        ) {
          updateBody.expires_at = new Date(Date.now() + Number(updateBody.ttl_days) * 86400000).toISOString();
        } else if (
          ecosystem === 'dancia' &&
          (updateBody.ttl_days !== undefined || updateBody.source_type !== undefined)
        ) {
          if (isTemporalDancia) {
            updateBody.ttl_days = updateBody.ttl_days ?? previousState.ttl_days ?? 3;
            updateBody.expires_at = new Date(Date.now() + Number(updateBody.ttl_days) * 86400000).toISOString();
          } else if (['live_broadcast', 'temporal_drop'].includes(previousState.source_type)) {
            updateBody.ttl_days = null;
            updateBody.expires_at = null;
          }
        }
      }
      const fields = Object.keys(updateBody);
      const values = fields.map(field => (
        ['object', 'stringArray'].includes(config.types[field])
          ? JSON.stringify(updateBody[field])
          : updateBody[field]
      ));
      const assignments = fields.map((field, index) => `${field} = $${index + 1}`);
      values.push(actorId, id);
      assignments.push(`updated_by = $${values.length - 1}`, 'updated_at = NOW()');
      const result = await client.query(`
        UPDATE ${config.table}
        SET ${assignments.join(', ')}
        WHERE id = $${values.length}
        RETURNING *
      `, values);
      const nextState = result.rows[0];
      await recordAudit(client, { ecosystem, entity, id, action: 'UPDATE', actorId, previousState, newState: nextState });
      return nextState;
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Catalog entity not found' });
    return res.json({ success: true, data: updated });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    if (error.code === '23503' || error.code === '23514' || error.code === '22P02') {
      return res.status(400).json({ success: false, message: 'The supplied data does not satisfy a catalog relationship or constraint' });
    }
    logger.error(`Failed to update ${ecosystem} ${entity}`, error);
    return res.status(500).json({ success: false, message: `Unable to update ${entity}` });
  }
};

exports.transitionEntity = async (req, res) => {
  const { ecosystem, entity } = req.params;
  let config;
  let id;
  try {
    config = getEntityConfig(ecosystem, entity);
    id = getEntityId(req.params.id);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
  const { action, risk_flag: riskFlag, reason } = req.body || {};
  if (!LIFECYCLE_ACTIONS.has(action)) return res.status(400).json({ success: false, message: 'Unsupported lifecycle action' });
  if (action === 'flag' && (!config.supportsRisk || !RISK_FLAGS.has(riskFlag))) {
    return res.status(400).json({ success: false, message: 'A valid risk flag is required for this entity' });
  }
  if (action === 'warn' && (!config.supportsWarnings || typeof reason !== 'string' || !reason.trim())) {
    return res.status(400).json({ success: false, message: 'A warning reason is required for this entity' });
  }
  const actorId = getActorId(req);

  try {
    const updated = await withTransaction(async client => {
      const current = await client.query(`SELECT * FROM ${config.table} WHERE id = $1 FOR UPDATE`, [id]);
      if (!current.rows.length) return null;
      const previousState = current.rows[0];
      if (
        ['frozen', 'blocked', 'suspended', 'archived'].includes(previousState.moderation_status) &&
        !['restore', 'flag', 'warn', 'archive'].includes(action)
      ) {
        const error = new Error('Held records must be restored before changing lifecycle state');
        error.statusCode = 409;
        throw error;
      }
      if (previousState.archived_at && action !== 'restore') {
        const error = new Error('Archived records must be restored before further changes');
        error.statusCode = 409;
        throw error;
      }
      if (action === 'archive' && previousState.archived_at) {
        const error = new Error('Catalog record is already archived');
        error.statusCode = 409;
        throw error;
      }
      if (action === 'restore' && !['frozen', 'blocked', 'suspended', 'archived'].includes(previousState.moderation_status)) {
        const error = new Error('Only frozen, blocked, suspended, or archived records can be restored');
        error.statusCode = 409;
        throw error;
      }

      const values = [];
      const assignments = [];
      const assign = (column, value) => {
        values.push(value);
        assignments.push(`${column} = $${values.length}`);
      };
      if (action === 'publish') {
        if (!config.supportsPublication) {
          const error = new Error('Publication is not supported for this entity');
          error.statusCode = 400;
          throw error;
        }
        if (config.publicationMediaField && !String(previousState[config.publicationMediaField] || '').trim()) {
          const error = new Error('A persistent media URL is required before publishing this record');
          error.statusCode = 409;
          throw error;
        }
        assign('moderation_status', 'active');
        if (config.columns.includes('is_active')) assign('is_active', true);
        if (config.columns.includes('is_published')) assign('is_published', true);
      } else if (['freeze', 'block', 'suspend'].includes(action)) {
        if (previousState.moderation_status !== action) assign('status_before_hold', previousState.moderation_status);
        assign('moderation_status', action === 'freeze' ? 'frozen' : action);
        if (config.columns.includes('is_active')) assign('is_active', false);
        if (config.columns.includes('is_published')) assign('is_published', false);
      } else if (action === 'restore') {
        assign('moderation_status', previousState.status_before_hold || 'draft');
        assign('status_before_hold', null);
        assign('archived_at', null);
        assign('archived_by', null);
        if (previousState.expires_at && new Date(previousState.expires_at).getTime() <= Date.now()) {
          const restoredExpiry = previousState.ttl_days
            ? new Date(Date.now() + Number(previousState.ttl_days) * 86400000).toISOString()
            : null;
          assign('expires_at', restoredExpiry);
        }
        const restoredActive = (previousState.status_before_hold || 'draft') === 'active';
        if (config.columns.includes('is_active')) assign('is_active', restoredActive);
        if (config.columns.includes('is_published')) assign('is_published', restoredActive);
      } else if (action === 'archive') {
        assign('status_before_hold', previousState.moderation_status);
        assign('moderation_status', 'archived');
        assign('archived_at', new Date().toISOString());
        assign('archived_by', actorId);
        if (config.columns.includes('is_active')) assign('is_active', false);
        if (config.columns.includes('is_published')) assign('is_published', false);
      } else if (action === 'flag') {
        assign('risk_flag', riskFlag);
      } else if (action === 'warn') {
        assign('warning_count', Number(previousState.warning_count || 0) + 1);
        assign('risk_flag', Number(previousState.warning_count || 0) + 1 >= 3 ? 'red' : Number(previousState.warning_count || 0) + 1 >= 2 ? 'orange' : 'yellow');
        assign('admin_notes', reason.trim());
      }
      assign('updated_by', actorId);
      assignments.push('updated_at = NOW()');
      values.push(id);
      const result = await client.query(`
        UPDATE ${config.table}
        SET ${assignments.join(', ')}
        WHERE id = $${values.length}
        RETURNING *
      `, values);
      const nextState = result.rows[0];
      await recordAudit(client, { ecosystem, entity, id, action: action.toUpperCase(), actorId, previousState, newState: nextState });
      return nextState;
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Catalog entity not found' });
    return res.json({ success: true, data: updated });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    logger.error(`Failed to ${action} ${ecosystem} ${entity}`, error);
    return res.status(500).json({ success: false, message: `Unable to ${action} catalog entity` });
  }
};

exports.archiveEntity = async (req, res) => {
  req.body = { action: 'archive' };
  return exports.transitionEntity(req, res);
};

exports.getEntityAudit = async (req, res) => {
  const { ecosystem, entity } = req.params;
  let id;
  try {
    getEntityConfig(ecosystem, entity);
    id = getEntityId(req.params.id);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
  try {
    const result = await db.query(`
      SELECT id, action, actor_id, previous_state, new_state, created_at
      FROM media_management_audit
      WHERE ecosystem = $1 AND entity_type = $2 AND entity_id = $3
      ORDER BY created_at DESC, id DESC
      LIMIT 250
    `, [ecosystem, entity, id]);
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    logger.error(`Failed to load audit history for ${ecosystem} ${entity}`, error);
    return res.status(500).json({ success: false, message: 'Unable to load catalog audit history' });
  }
};

exports.ENTITY_CONFIG = ECOSYSTEMS;
