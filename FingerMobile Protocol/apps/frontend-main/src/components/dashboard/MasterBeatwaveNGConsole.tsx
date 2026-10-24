import React from 'react';
import MediaCatalogManagementConsole, { MediaEntityDefinition } from './MediaCatalogManagementConsole';
import SoundRiverMasterConsole from './SoundRiverMasterConsole';
import SoundOceanMasterConsole from './SoundOceanMasterConsole';
import { Waves, Diamond, Database } from 'lucide-react';

const BEATWAVE_ENTITIES: MediaEntityDefinition[] = [
  {
    key: 'tracks',
    label: 'Tracks',
    risks: true,
    warnings: true,
    summaryFields: ['genre', 'artist_id', 'album_id', 'duration', 'plays'],
    fields: [
      { key: 'title', label: 'Track title', required: true },
      { key: 'artist_id', label: 'Artist ID', type: 'number' },
      { key: 'album_id', label: 'Album ID', type: 'number' },
      { key: 'genre', label: 'Genre' },
      { key: 'duration', label: 'Duration (seconds)', type: 'number' },
      {
        key: 'url',
        label: 'Upload audio track',
        type: 'file',
        required: true,
        uploadField: 'media',
        uploadResponseKey: 'media_url',
        accept: 'audio/mpeg,audio/flac,audio/wav,audio/ogg,audio/aac,.mp3,.flac,.wav,.ogg,.aac,.m4a',
        hint: 'Upload an MP3, FLAC, WAV, OGG, or AAC file (up to 150 MB). URL is auto-populated after upload.',
      },
      {
        key: 'cover_art',
        label: 'Upload cover art',
        type: 'file',
        uploadField: 'thumbnail',
        uploadResponseKey: 'thumbnail_url',
        accept: 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp',
        hint: 'Upload a JPEG, PNG, or WebP cover art image.',
      },
      { key: 'year', label: 'Release year', type: 'number' },
      { key: 'track_number', label: 'Track number', type: 'number' },
      { key: 'writer', label: 'Writer' },
      { key: 'producer', label: 'Producer' },
      { key: 'bpm', label: 'BPM', type: 'number' },
      { key: 'musical_key', label: 'Musical key' },
      { key: 'explicit', label: 'Explicit content', type: 'boolean' },
      { key: 'admin_notes', label: 'Management notes', type: 'textarea' },
    ],
  },
  {
    key: 'artists',
    label: 'Artists',
    risks: true,
    warnings: true,
    summaryFields: ['verified', 'followers', 'bio'],
    fields: [
      { key: 'name', label: 'Artist name', required: true },
      { key: 'bio', label: 'Biography', type: 'textarea' },
      {
        key: 'cover_art',
        label: 'Upload artist image',
        type: 'file',
        uploadField: 'thumbnail',
        uploadResponseKey: 'thumbnail_url',
        accept: 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp',
        hint: 'Upload an artist profile photo.',
      },
      { key: 'verified', label: 'Verified artist', type: 'boolean' },
      { key: 'social_links', label: 'Social links (JSON object)', type: 'json' },
      { key: 'admin_notes', label: 'Management notes', type: 'textarea' },
    ],
  },
  {
    key: 'albums',
    label: 'Albums',
    risks: true,
    warnings: true,
    summaryFields: ['artist_id', 'year', 'genre', 'total_tracks'],
    fields: [
      { key: 'title', label: 'Album title', required: true },
      { key: 'artist_id', label: 'Artist ID', type: 'number' },
      { key: 'year', label: 'Release year', type: 'number' },
      {
        key: 'cover_art',
        label: 'Upload album cover art',
        type: 'file',
        uploadField: 'thumbnail',
        uploadResponseKey: 'thumbnail_url',
        accept: 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp',
        hint: 'Upload album artwork (JPEG, PNG, or WebP).',
      },
      { key: 'genre', label: 'Genre' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'admin_notes', label: 'Management notes', type: 'textarea' },
    ],
  },
  {
    key: 'playlists',
    label: 'Playlists',
    risks: true,
    warnings: true,
    summaryFields: ['owner_id', 'is_public', 'is_collaborative', 'total_tracks'],
    fields: [
      { key: 'title', label: 'Playlist title', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'owner_id', label: 'Owner ID', type: 'number' },
      {
        key: 'cover_art',
        label: 'Upload playlist cover art',
        type: 'file',
        uploadField: 'thumbnail',
        uploadResponseKey: 'thumbnail_url',
        accept: 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp',
        hint: 'Upload a playlist cover image.',
      },
      { key: 'is_public', label: 'Public playlist', type: 'boolean' },
      { key: 'is_collaborative', label: 'Collaborative playlist', type: 'boolean' },
      { key: 'admin_notes', label: 'Management notes', type: 'textarea' },
    ],
  },
  {
    key: 'genres',
    label: 'Genres',
    summaryFields: ['slug', 'parent_genre_id', 'track_count'],
    fields: [
      { key: 'name', label: 'Genre name', required: true },
      { key: 'slug', label: 'Unique slug', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      {
        key: 'icon_url',
        label: 'Upload genre icon',
        type: 'file',
        uploadField: 'thumbnail',
        uploadResponseKey: 'thumbnail_url',
        accept: 'image/jpeg,image/png,image/webp,image/svg+xml,.jpg,.jpeg,.png,.webp,.svg',
        hint: 'Upload a genre icon (SVG, PNG, or WebP recommended).',
      },
      { key: 'parent_genre_id', label: 'Parent genre ID', type: 'number' },
      { key: 'admin_notes', label: 'Management notes', type: 'textarea' },
    ],
  },
  {
    key: 'audio_novels',
    label: 'AudioNovels',
    risks: true,
    warnings: true,
    summaryFields: ['author', 'genre', 'source_type', 'ttl_days', 'expires_at'],
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'author', label: 'Author', required: true },
      { key: 'synopsis', label: 'Synopsis', type: 'textarea' },
      { key: 'narrator_voice', label: 'Narrator voice' },
      {
        key: 'cover_art',
        label: 'Upload cover art',
        type: 'file',
        uploadField: 'thumbnail',
        uploadResponseKey: 'thumbnail_url',
        accept: 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp',
        hint: 'Upload AudioNovel cover art.',
      },
      { key: 'duration_minutes', label: 'Duration (1–30 minutes)', type: 'number' },
      { key: 'genre', label: 'Genre' },
      {
        key: 'audio_url',
        label: 'Upload audio file',
        type: 'file',
        uploadField: 'media',
        uploadResponseKey: 'media_url',
        accept: 'audio/mpeg,audio/flac,audio/wav,audio/ogg,.mp3,.flac,.wav,.ogg',
        hint: 'Upload the audio novel file (MP3, FLAC, WAV, or OGG).',
      },
      { key: 'ai_prompt_used', label: 'AI prompt used', type: 'textarea' },
      {
        key: 'source_type',
        label: 'Source type',
        type: 'select',
        options: [
          { value: 'ai_prompt', label: 'AI prompt' },
          { value: 'text_upload', label: 'Text upload' },
          { value: 'audio_upload', label: 'Audio upload' },
          { value: 'live_recording', label: 'Live recording' },
        ],
      },
      { key: 'source_file_name', label: 'Original file name' },
      { key: 'source_file_size_mb', label: 'Source file size (MB)', type: 'number' },
      { key: 'source_file_type', label: 'Source file media type' },
      { key: 'manuscript_text', label: 'Manuscript text', type: 'textarea' },
      { key: 'ttl_days', label: 'Expiry (3, 7, or 30 days)', type: 'number' },
      { key: 'expires_at', label: 'Explicit expiry', type: 'datetime-local' },
      { key: 'admin_notes', label: 'Management notes', type: 'textarea' },
    ],
  },
  {
    key: 'podcasts',
    label: 'Podcasts',
    risks: true,
    warnings: true,
    summaryFields: ['host', 'guest', 'genre', 'episode_number', 'ttl_days'],
    fields: [
      { key: 'title', label: 'Episode title', required: true },
      { key: 'host', label: 'Host', required: true },
      { key: 'guest', label: 'Guest' },
      { key: 'description', label: 'Description', type: 'textarea' },
      {
        key: 'cover_art',
        label: 'Upload cover art',
        type: 'file',
        uploadField: 'thumbnail',
        uploadResponseKey: 'thumbnail_url',
        accept: 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp',
        hint: 'Upload podcast episode cover art.',
      },
      { key: 'duration_minutes', label: 'Duration (1–30 minutes)', type: 'number' },
      { key: 'genre', label: 'Genre' },
      { key: 'episode_number', label: 'Episode number', type: 'number' },
      {
        key: 'audio_url',
        label: 'Upload podcast audio',
        type: 'file',
        uploadField: 'media',
        uploadResponseKey: 'media_url',
        accept: 'audio/mpeg,audio/flac,audio/wav,audio/ogg,.mp3,.flac,.wav,.ogg',
        hint: 'Upload the podcast audio file (MP3, FLAC, WAV, or OGG).',
      },
      { key: 'tags', label: 'Tags (JSON array)', type: 'json' },
      { key: 'source_file_name', label: 'Original file name' },
      { key: 'source_file_size_mb', label: 'Source file size (MB)', type: 'number' },
      { key: 'source_file_type', label: 'Source file media type' },
      {
        key: 'source_type',
        label: 'Source type',
        type: 'select',
        options: [
          { value: 'ai_prompt', label: 'AI prompt' },
          { value: 'text_upload', label: 'Text upload' },
          { value: 'audio_upload', label: 'Audio upload' },
          { value: 'live_recording', label: 'Live recording' },
        ],
      },
      { key: 'ttl_days', label: 'Expiry (3, 7, or 30 days)', type: 'number' },
      { key: 'expires_at', label: 'Explicit expiry', type: 'datetime-local' },
      { key: 'admin_notes', label: 'Management notes', type: 'textarea' },
    ],
  },
];

export const MasterBeatwaveNGConsole: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<'river' | 'ocean' | 'catalog'>('river');

  return (
    <div className="space-y-6">
      {/* Ecosystem Tab Bar */}
      <div className="bg-white border-b border-slate-300 p-4 rounded-2xl shadow-sm flex flex-wrap gap-3">
        <button
          onClick={() => setActiveTab('river')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${
            activeTab === 'river'
              ? 'bg-cyan-900 text-white border-cyan-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
          }`}
        >
          <Waves className={`w-4 h-4 ${activeTab === 'river' ? 'text-cyan-300' : 'text-cyan-700'}`} />
          🌊 SoundRiver Master Management
        </button>

        <button
          onClick={() => setActiveTab('ocean')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${
            activeTab === 'ocean'
              ? 'bg-indigo-950 text-white border-indigo-950 shadow-md'
              : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
          }`}
        >
          <Diamond className={`w-4 h-4 ${activeTab === 'ocean' ? 'text-indigo-300' : 'text-indigo-700'}`} />
          💎 SoundOcean Sovereign Vault
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${
            activeTab === 'catalog'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
          }`}
        >
          <Database className={`w-4 h-4 ${activeTab === 'catalog' ? 'text-slate-300' : 'text-slate-700'}`} />
          Standard Relational Catalog
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'river' && <SoundRiverMasterConsole />}
      {activeTab === 'ocean' && <SoundOceanMasterConsole />}
      {activeTab === 'catalog' && (
        <MediaCatalogManagementConsole
          ecosystem="beatwave"
          title="BeatwaveNG Ecosystem Management"
          description="Upload audio tracks, cover art, and media files directly. Multipart upload to backend, persists to PostgreSQL-linked storage, goes live instantly on Publish."
          entities={BEATWAVE_ENTITIES}
        />
      )}
    </div>
  );
};

export default MasterBeatwaveNGConsole;
