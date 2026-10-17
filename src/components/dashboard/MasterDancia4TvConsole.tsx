import React from 'react';
import MediaCatalogManagementConsole, { MediaEntityDefinition } from './MediaCatalogManagementConsole';

const DANCIA_ENTITIES: MediaEntityDefinition[] = [
  {
    key: 'videos',
    label: 'Video catalog',
    risks: true,
    warnings: true,
    summaryFields: ['genre', 'creator', 'regional_category', 'resolution', 'source_type'],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'creator', label: 'Creator / studio' },
      { key: 'regional_category', label: 'Regional category' },
      { key: 'genre', label: 'Genre' },
      {
        key: 'source_type',
        label: 'Source type',
        type: 'select',
        hint: 'Temporal broadcasts and drops receive expiry archival.',
        options: [
          { value: 'live_broadcast', label: 'Live broadcast' },
          { value: 'temporal_drop', label: 'Temporal drop' },
          { value: 'studio_vod', label: 'Studio VOD' },
          { value: 'community_upload', label: 'Community upload' },
        ],
      },
      { key: 'stream_url', label: 'Media URL', required: true },
      { key: 'thumbnail_url', label: 'Thumbnail URL' },
      { key: 'duration_seconds', label: 'Duration (seconds)', type: 'number' },
      { key: 'resolution', label: 'Resolution' },
      { key: 'iarc_rating', label: 'Content rating' },
      { key: 'ttl_days', label: 'Expiry (days)', type: 'number', hint: 'Optional: 3, 7, or 30 days; auto-archived after expiry.' },
      { key: 'expires_at', label: 'Explicit expiry', type: 'datetime-local' },
      { key: 'admin_notes', label: 'Management notes', type: 'textarea' },
    ],
  },
  {
    key: 'channels',
    label: 'Channels',
    summaryFields: ['description', 'stream_url'],
    fields: [
      { key: 'name', label: 'Channel name', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'stream_url', label: 'Stream URL', required: true },
      { key: 'admin_notes', label: 'Management notes', type: 'textarea' },
    ],
  },
  {
    key: 'programs',
    label: 'Programs',
    summaryFields: ['channel_id', 'genre', 'duration_seconds'],
    fields: [
      { key: 'channel_id', label: 'Channel ID', required: true },
      { key: 'title', label: 'Program title', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'genre', label: 'Genre' },
      { key: 'thumbnail_url', label: 'Thumbnail URL' },
      { key: 'duration_seconds', label: 'Duration (seconds)', type: 'number' },
      { key: 'admin_notes', label: 'Management notes', type: 'textarea' },
    ],
  },
  {
    key: 'schedules',
    label: 'Schedules',
    summaryFields: ['program_id', 'start_time', 'end_time', 'is_live'],
    fields: [
      { key: 'program_id', label: 'Program ID', required: true },
      { key: 'start_time', label: 'Start time', type: 'datetime-local', required: true },
      { key: 'end_time', label: 'End time', type: 'datetime-local', required: true },
      { key: 'is_live', label: 'Live schedule', type: 'boolean' },
      { key: 'admin_notes', label: 'Management notes', type: 'textarea' },
    ],
  },
  {
    key: 'plans',
    label: 'Subscription plans',
    summaryFields: ['price', 'currency', 'billing_interval'],
    fields: [
      { key: 'name', label: 'Plan name', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'price', label: 'Price', type: 'number', required: true },
      { key: 'currency', label: 'Currency code', hint: 'Three-letter ISO currency code.' },
      {
        key: 'billing_interval',
        label: 'Billing interval',
        type: 'select',
        options: [
          { value: 'monthly', label: 'Monthly' },
          { value: 'quarterly', label: 'Quarterly' },
          { value: 'yearly', label: 'Yearly' },
          { value: 'one_time', label: 'One-time' },
        ],
      },
      { key: 'features', label: 'Features (JSON array)', type: 'json' },
      { key: 'admin_notes', label: 'Management notes', type: 'textarea' },
    ],
  },
];

export const MasterDancia4TvConsole: React.FC = () => (
  <MediaCatalogManagementConsole
    ecosystem="dancia"
    title="Dancia-4Tv Ecosystem Management"
    description="Manage persisted video, channel, program, schedule, and subscription-plan catalogs with audited lifecycle and moderation controls."
    entities={DANCIA_ENTITIES}
  />
);

export default MasterDancia4TvConsole;
