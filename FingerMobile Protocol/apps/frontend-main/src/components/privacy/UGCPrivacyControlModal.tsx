import React, { useState, useEffect } from 'react';
import {
  Shield, MessageSquare, Star, Share2, Tag, Bookmark, Download, Eye, Clock, X, Check, Lock, AlertCircle
} from 'lucide-react';

export interface UGCPrivacySettings {
  allowReviews: 'everyone' | 'followers' | 'none';
  allowComments: 'everyone' | 'followers' | 'none';
  allowSharing: 'everyone' | 'followers' | 'none';
  allowTagging: 'everyone' | 'followers' | 'none';
  allowSaving: 'everyone' | 'followers' | 'none';
  allowDownload: 'everyone' | 'followers' | 'none';
  visibility: 'public' | 'followers_only' | 'private' | 'unlisted';
  durationType: 'permanent' | '24h' | '7d' | '30d' | 'custom';
  customExpiresAt?: string;
}

interface UGCPrivacyControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: string;
  contentId: string;
  initialSettings?: Partial<UGCPrivacySettings>;
  onSaveSuccess?: (settings: UGCPrivacySettings) => void;
}

export const UGCPrivacyControlModal: React.FC<UGCPrivacyControlModalProps> = ({
  isOpen,
  onClose,
  contentType,
  contentId,
  initialSettings,
  onSaveSuccess
}) => {
  const [settings, setSettings] = useState<UGCPrivacySettings>({
    allowReviews: initialSettings?.allowReviews || 'everyone',
    allowComments: initialSettings?.allowComments || 'everyone',
    allowSharing: initialSettings?.allowSharing || 'everyone',
    allowTagging: initialSettings?.allowTagging || 'everyone',
    allowSaving: initialSettings?.allowSaving || 'everyone',
    allowDownload: initialSettings?.allowDownload || 'everyone',
    visibility: initialSettings?.visibility || 'public',
    durationType: initialSettings?.durationType || 'permanent',
    customExpiresAt: initialSettings?.customExpiresAt || ''
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen && contentType && contentId) {
      fetchCurrentSettings();
    }
  }, [isOpen, contentType, contentId]);

  const fetchCurrentSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/ugc/${encodeURIComponent(contentType)}/${encodeURIComponent(contentId)}/visibility`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSettings({
            allowReviews: json.data.allowReviews || 'everyone',
            allowComments: json.data.allowComments || 'everyone',
            allowSharing: json.data.allowSharing || 'everyone',
            allowTagging: json.data.allowTagging || 'everyone',
            allowSaving: json.data.allowSaving || 'everyone',
            allowDownload: json.data.allowDownload || 'everyone',
            visibility: json.data.visibility || 'public',
            durationType: json.data.durationType || 'permanent',
            customExpiresAt: json.data.expiresAt || ''
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch UGC privacy settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setStatusMessage(null);

      const payload = {
        allow_reviews: settings.allowReviews,
        allow_comments: settings.allowComments,
        allow_sharing: settings.allowSharing,
        allow_tagging: settings.allowTagging,
        allow_saving: settings.allowSaving,
        allow_download: settings.allowDownload,
        visibility: settings.visibility,
        duration_type: settings.durationType,
        expires_at: settings.durationType === 'custom' ? settings.customExpiresAt : null
      };

      const res = await fetch(`/api/ugc/${encodeURIComponent(contentType)}/${encodeURIComponent(contentId)}/privacy`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setStatusMessage({ type: 'success', text: 'Privacy controls updated successfully' });
        if (onSaveSuccess) onSaveSuccess(settings);
        setTimeout(() => onClose(), 1200);
      } else {
        setStatusMessage({ type: 'error', text: json.message || 'Failed to save settings' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Network error saving privacy controls' });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const renderOptionGroup = (
    label: string,
    icon: React.ReactNode,
    value: 'everyone' | 'followers' | 'none',
    onChange: (val: 'everyone' | 'followers' | 'none') => void
  ) => (
    <div style={{ marginBottom: '16px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <span style={{ color: '#6366f1' }}>{icon}</span>
        <span style={{ color: '#f3f4f6', fontWeight: 600, fontSize: '14px' }}>{label}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {[
          { key: 'everyone', text: 'Everyone' },
          { key: 'followers', text: 'Followers' },
          { key: 'none', text: 'Disabled' }
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key as any)}
            style={{
              padding: '8px 10px',
              borderRadius: '8px',
              border: value === opt.key ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.1)',
              background: value === opt.key ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              color: value === opt.key ? '#818cf8' : '#9ca3af',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #111827 0%, #1f2937 100%)',
        width: '100%',
        maxWidth: '540px',
        maxHeight: '90vh',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '10px', borderRadius: '12px' }}>
              <Shield size={22} color="#818cf8" />
            </div>
            <div>
              <h3 style={{ margin: 0, color: '#f9fafb', fontSize: '18px', fontWeight: 700 }}>UGC Privacy Controls</h3>
              <p style={{ margin: '2px 0 0', color: '#9ca3af', fontSize: '12px' }}>Configure who can interact with your {contentType}</p>
            </div>
          </div>
          <button aria-label="Close" type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {statusMessage && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: statusMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              color: statusMessage.type === 'success' ? '#34d399' : '#f87171'
            }}>
              {statusMessage.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
              {statusMessage.text}
            </div>
          )}

          {/* Overall Visibility */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f3f4f6', fontWeight: 600, fontSize: '14px', marginBottom: '10px' }}>
              <Eye size={16} color="#818cf8" /> Content Visibility
            </label>
            <select
              value={settings.visibility}
              onChange={(e) => setSettings({ ...settings, visibility: e.target.value as any })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f9fafb',
                fontSize: '14px',
                outline: 'none'
              }}
            >
              <option value="public" style={{ background: '#1f2937' }}>🌍 Public (Everyone can view)</option>
              <option value="followers_only" style={{ background: '#1f2937' }}>👥 Followers Only</option>
              <option value="private" style={{ background: '#1f2937' }}>🔒 Private (Only Me)</option>
              <option value="unlisted" style={{ background: '#1f2937' }}>🔗 Unlisted (Only via direct link)</option>
            </select>
          </div>

          {/* Action Permissions Grid */}
          {renderOptionGroup('ReviewController (Reviews & Ratings)', <Star size={16} />, settings.allowReviews, (val) => setSettings({ ...settings, allowReviews: val }))}
          {renderOptionGroup('CommentsController (Comments & Replies)', <MessageSquare size={16} />, settings.allowComments, (val) => setSettings({ ...settings, allowComments: val }))}
          {renderOptionGroup('ShareController (Sharing & Links)', <Share2 size={16} />, settings.allowSharing, (val) => setSettings({ ...settings, allowSharing: val }))}
          {renderOptionGroup('TagController (Member Tagging)', <Tag size={16} />, settings.allowTagging, (val) => setSettings({ ...settings, allowTagging: val }))}
          {renderOptionGroup('SaveController (Saving & Bookmarks)', <Bookmark size={16} />, settings.allowSaving, (val) => setSettings({ ...settings, allowSaving: val }))}
          {renderOptionGroup('DownloadController (Media Downloads)', <Download size={16} />, settings.allowDownload, (val) => setSettings({ ...settings, allowDownload: val }))}

          {/* DurationController */}
          <div style={{ marginTop: '20px', background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Clock size={16} color="#818cf8" />
              <span style={{ color: '#f3f4f6', fontWeight: 600, fontSize: '14px' }}>DurationController (Availability Expiration)</span>
            </div>
            <select
              value={settings.durationType}
              onChange={(e) => setSettings({ ...settings, durationType: e.target.value as any })}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#f9fafb',
                fontSize: '13px',
                outline: 'none',
                marginBottom: settings.durationType === 'custom' ? '12px' : '0'
              }}
            >
              <option value="permanent" style={{ background: '#1f2937' }}>♾️ Permanent Availability</option>
              <option value="24h" style={{ background: '#1f2937' }}>⏱️ 24 Hours</option>
              <option value="7d" style={{ background: '#1f2937' }}>📅 7 Days</option>
              <option value="30d" style={{ background: '#1f2937' }}>🗓️ 30 Days</option>
              <option value="custom" style={{ background: '#1f2937' }}>⚙️ Custom Expiration Date</option>
            </select>

            {settings.durationType === 'custom' && (
              <input
                type="datetime-local"
                value={settings.customExpiresAt ? new Date(settings.customExpiresAt).toISOString().slice(0, 16) : ''}
                onChange={(e) => setSettings({ ...settings, customExpiresAt: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#f9fafb',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'flex-end', gap: '12px', background: 'rgba(0, 0, 0, 0.2)' }}>
          <button
            onClick={onClose}
            disabled={saving}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#9ca3af',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: '10px 22px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              border: 'none',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}
          >
            {saving ? 'Saving...' : 'Save Privacy Controls'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UGCPrivacyControlModal;
