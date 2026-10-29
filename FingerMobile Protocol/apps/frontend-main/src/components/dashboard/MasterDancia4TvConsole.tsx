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
      {
        key: 'genre',
        label: 'Platform Genre & Category',
        type: 'select',
        required: true,
        hint: 'Select the curated platform genre or show category using the dropdown.',
        options: [
          { value: 'Music Videos', label: 'Music Videos (Flagship)' },
          { value: 'Live Concerts & Festivals', label: 'Live Concerts & Festivals' },
          { value: 'Dance Battles & Choreography', label: 'Dance Battles & Choreography' },
          { value: 'Documentary & Culture', label: 'Documentary & Culture' },
          { value: 'Creative Studio & Behind The Scenes', label: 'Creative Studio & Behind The Scenes' },
          { value: 'Film & Short Cinema', label: 'Film & Short Cinema' },
          { value: 'Comedy & Skits', label: 'Comedy & Skits' },
          { value: 'News & Interviews', label: 'News & Interviews' },
          { value: 'Masterclasses & Tutorials', label: 'Masterclasses & Tutorials' },
          { value: 'Temporal Drops & Premiere Specials', label: 'Temporal Drops & Premiere Specials' },
        ],
      },
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
      {
        key: 'stream_url',
        label: 'Upload video file',
        type: 'file',
        required: true,
        uploadField: 'media',
        uploadResponseKey: 'media_url',
        accept: 'video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov',
        hint: 'Upload an MP4, WebM, or MOV file (up to 150 MB). URL is auto-populated after upload.',
      },
      {
        key: 'thumbnail_url',
        label: 'Upload Video Poster / Thumbnail (Cover Art / Broadcast Artwork)',
        type: 'file',
        uploadField: 'thumbnail',
        uploadResponseKey: 'thumbnail_url',
        accept: 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp',
        hint: 'Upload official poster cover, broadcast banner, or video thumbnail (JPEG, PNG, WebP). URL is auto-populated after upload.',
      },
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
      {
        key: 'genre',
        label: 'Platform Genre & Category',
        type: 'select',
        required: true,
        hint: 'Select the curated platform genre or show category using the dropdown.',
        options: [
          { value: 'Music Videos', label: 'Music Videos (Flagship)' },
          { value: 'Live Concerts & Festivals', label: 'Live Concerts & Festivals' },
          { value: 'Dance Battles & Choreography', label: 'Dance Battles & Choreography' },
          { value: 'Documentary & Culture', label: 'Documentary & Culture' },
          { value: 'Creative Studio & Behind The Scenes', label: 'Creative Studio & Behind The Scenes' },
          { value: 'Film & Short Cinema', label: 'Film & Short Cinema' },
          { value: 'Comedy & Skits', label: 'Comedy & Skits' },
          { value: 'News & Interviews', label: 'News & Interviews' },
          { value: 'Masterclasses & Tutorials', label: 'Masterclasses & Tutorials' },
          { value: 'Temporal Drops & Premiere Specials', label: 'Temporal Drops & Premiere Specials' },
        ],
      },
      {
        key: 'thumbnail_url',
        label: 'Upload program thumbnail',
        type: 'file',
        uploadField: 'thumbnail',
        uploadResponseKey: 'thumbnail_url',
        accept: 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp',
        hint: 'Upload a thumbnail image for this program.',
      },
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
    description="Upload and manage video content, channels, programs, schedules, and subscription plans. Videos are uploaded as multipart/form-data directly to the backend and published live instantly."
    entities={DANCIA_ENTITIES}
  />
);

export default MasterDancia4TvConsole;
