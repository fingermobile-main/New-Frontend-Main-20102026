import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, MessageSquare, Star, Share2, Tag, Bookmark,
  Download, Eye, Clock, X, Check, Lock, AlertCircle,
  Gift, Key, Heart, Zap, Crown, Users, Globe
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type PermissionLevel = 'everyone' | 'connections' | 'matches' | 'none';
type VisibilityLevel = 'public' | 'connections' | 'matches' | 'private' | 'unlisted';
type DurationOption = 'permanent' | '24h' | '7d' | '30d' | 'custom';
type MembershipCategory =
  | 'Genuine Match'
  | 'Validate Match'
  | 'Empathetic Match'
  | 'Sincere Match'
  | 'Hopeful Match';

export interface LushPrivacySettings {
  // 8 Core Dimensions
  allowReviews: PermissionLevel;
  allowComments: PermissionLevel;
  allowSharing: PermissionLevel;
  allowTagging: PermissionLevel;
  allowSaving: PermissionLevel;
  allowDownload: PermissionLevel;
  visibility: VisibilityLevel;
  durationType: DurationOption;
  customExpiresAt?: string;
  // Lush-Specific Gates
  pinExchangeRequired: boolean;
  giftRequiredToView: boolean;
  membershipCategoryGate: MembershipCategory[];
  commitButtonUnlockedOnly: boolean;
  radiatePlusOnly: boolean;
  // Demographic Targeting
  genderTarget: 'all' | 'male' | 'female' | 'non_binary';
  ageRangeMin: number;
  ageRangeMax: number;
  autoDelete: boolean;
}

interface LushPrivacyControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: string;
  contentId: string;
  contentTitle?: string;
  initialSettings?: Partial<LushPrivacySettings>;
  onSaveSuccess?: (settings: LushPrivacySettings) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT SETTINGS (Lush-safe defaults — connections-gated)
// ─────────────────────────────────────────────────────────────────────────────
export const DEFAULT_SETTINGS: LushPrivacySettings = {
  allowReviews: 'connections',
  allowComments: 'connections',
  allowSharing: 'connections',
  allowTagging: 'matches',
  allowSaving: 'connections',
  allowDownload: 'none',
  visibility: 'connections',
  durationType: 'permanent',
  customExpiresAt: '',
  pinExchangeRequired: false,
  giftRequiredToView: false,
  membershipCategoryGate: [],
  commitButtonUnlockedOnly: false,
  radiatePlusOnly: false,
  genderTarget: 'all',
  ageRangeMin: 18,
  ageRangeMax: 99,
  autoDelete: false,
};

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const PermissionSelect: React.FC<{
  value: PermissionLevel;
  onChange: (v: PermissionLevel) => void;
  options?: PermissionLevel[];
}> = ({ value, onChange, options = ['everyone', 'connections', 'matches', 'none'] }) => (
  <div className="lush-privacy-tabs">
    {options.map((opt) => (
      <button
        key={opt}
        className={`lush-tab ${value === opt ? 'active' : ''}`}
        onClick={() => onChange(opt)}
        type="button"
        aria-pressed={value === opt}
      >
        {opt === 'everyone' && '🌍 Everyone'}
        {opt === 'connections' && '🤝 Connections'}
        {opt === 'matches' && '💕 Matches'}
        {opt === 'none' && '🔒 None'}
      </button>
    ))}
  </div>
);

const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  premium?: boolean;
}> = ({ checked, onChange, id, label, sublabel, icon, premium }) => (
  <label htmlFor={id} className="lush-toggle-row">
    <div className="lush-toggle-icon">{icon}</div>
    <div className="lush-toggle-text">
      <span className="lush-toggle-label">
        {label}
        {premium && <span className="lush-badge-premium">✦ Premium</span>}
      </span>
      {sublabel && <span className="lush-toggle-sublabel">{sublabel}</span>}
    </div>
    <div className="lush-toggle-switch" onClick={() => onChange(!checked)}>
      <input type="checkbox" id={id} checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className={`lush-slider ${checked ? 'on' : 'off'}`} />
    </div>
  </label>
);

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; subtitle?: string }> = ({
  icon, title, subtitle
}) => (
  <div className="lush-section-header">
    <div className="lush-section-icon">{icon}</div>
    <div>
      <h3 className="lush-section-title">{title}</h3>
      {subtitle && <p className="lush-section-subtitle">{subtitle}</p>}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN MODAL
// ─────────────────────────────────────────────────────────────────────────────

export const LushPrivacyControlModal: React.FC<LushPrivacyControlModalProps> = ({
  isOpen,
  onClose,
  contentType,
  contentId,
  contentTitle = 'your content',
  initialSettings,
  onSaveSuccess,
}) => {
  const [settings, setSettings] = useState<LushPrivacySettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings,
  });
  const [activeTab, setActiveTab] = useState<'core' | 'gates' | 'audience' | 'duration'>('core');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const set = useCallback(
    <K extends keyof LushPrivacySettings>(key: K, val: LushPrivacySettings[K]) =>
      setSettings((prev) => ({ ...prev, [key]: val })),
    []
  );

  // Fetch existing settings on open
  useEffect(() => {
    if (!isOpen || !contentType || !contentId) return;
    setLoading(true);
    setStatus(null);
    fetch(`/api/lushpressies/privacy/settings/${encodeURIComponent(contentType)}/${encodeURIComponent(contentId)}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) {
          const d = json.data;
          setSettings({
            allowReviews: d.allow_reviews || 'connections',
            allowComments: d.allow_comments || 'connections',
            allowSharing: d.allow_sharing || 'connections',
            allowTagging: d.allow_tagging || 'matches',
            allowSaving: d.allow_saving || 'connections',
            allowDownload: d.allow_download || 'none',
            visibility: d.visibility || 'connections',
            durationType: d.duration_type || 'permanent',
            customExpiresAt: d.expires_at || '',
            pinExchangeRequired: d.pin_exchange_required || false,
            giftRequiredToView: d.gift_required_to_view || false,
            membershipCategoryGate: d.membership_category_gate || [],
            commitButtonUnlockedOnly: d.commit_button_unlocked_only || false,
            radiatePlusOnly: d.radiate_plus_only || false,
            genderTarget: d.gender_target || 'all',
            ageRangeMin: d.age_range_min || 18,
            ageRangeMax: d.age_range_max || 99,
            autoDelete: d.auto_delete || false,
          });
        }
      })
      .catch(() => {}) // keep defaults
      .finally(() => setLoading(false));
  }, [isOpen, contentType, contentId]);

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const payload = {
        allowReviews: settings.allowReviews,
        allowComments: settings.allowComments,
        allowSharing: settings.allowSharing,
        allowTagging: settings.allowTagging,
        allowSaving: settings.allowSaving,
        allowDownload: settings.allowDownload,
        visibility: settings.visibility,
        durationType: settings.durationType,
        expiresAt: settings.durationType === 'custom' ? settings.customExpiresAt : null,
        pinExchangeRequired: settings.pinExchangeRequired,
        giftRequiredToView: settings.giftRequiredToView,
        membershipCategoryGate: settings.membershipCategoryGate.length > 0
          ? settings.membershipCategoryGate
          : null,
        commitButtonUnlockedOnly: settings.commitButtonUnlockedOnly,
        radiatePlusOnly: settings.radiatePlusOnly,
        genderTarget: settings.genderTarget,
        ageRangeMin: settings.ageRangeMin,
        ageRangeMax: settings.ageRangeMax,
        autoDelete: settings.autoDelete,
      };

      const res = await fetch(
        `/api/lushpressies/privacy/settings/${encodeURIComponent(contentType)}/${encodeURIComponent(contentId)}`,
        { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }
      );
      const json = await res.json();
      if (res.ok && json.success) {
        setStatus({ type: 'success', text: '✦ Privacy controls saved for ' + contentTitle });
        onSaveSuccess?.(settings);
        setTimeout(() => onClose(), 1400);
      } else {
        setStatus({ type: 'error', text: json.message || 'Failed to save settings' });
      }
    } catch {
      setStatus({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const toggleMembershipCategory = (cat: MembershipCategory) => {
    setSettings((prev) => ({
      ...prev,
      membershipCategoryGate: prev.membershipCategoryGate.includes(cat)
        ? prev.membershipCategoryGate.filter((c) => c !== cat)
        : [...prev.membershipCategoryGate, cat],
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* ── Styles ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap');

        .lush-overlay {
          position: fixed; inset: 0; z-index: 9000;
          background: rgba(8, 4, 18, 0.82);
          backdrop-filter: blur(12px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
          animation: lushFadeIn 0.2s ease;
        }
        @keyframes lushFadeIn { from { opacity: 0 } to { opacity: 1 } }

        .lush-modal {
          background: linear-gradient(155deg, #0f0520 0%, #1a0635 50%, #0d1a3a 100%);
          border: 1px solid rgba(183, 110, 232, 0.35);
          border-radius: 24px;
          width: 100%; max-width: 620px;
          max-height: 90vh;
          display: flex; flex-direction: column;
          overflow: hidden;
          box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(140, 60, 220, 0.15);
          animation: lushSlideUp 0.3s cubic-bezier(0.16,1,0.3,1);
          font-family: 'Inter', sans-serif;
        }
        @keyframes lushSlideUp { from { transform: translateY(40px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }

        /* ── Header ── */
        .lush-header {
          padding: 1.5rem 1.75rem 0;
          background: linear-gradient(180deg, rgba(183, 110, 232, 0.12) 0%, transparent 100%);
          border-bottom: 1px solid rgba(183, 110, 232, 0.15);
          padding-bottom: 1rem;
        }
        .lush-header-top {
          display: flex; align-items: flex-start; justify-content: space-between;
        }
        .lush-brand {
          display: flex; align-items: center; gap: 0.625rem;
        }
        .lush-brand-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #c850c0, #ff6b6b, #ffcc02);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.125rem; box-shadow: 0 4px 16px rgba(200, 80, 192, 0.5);
        }
        .lush-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem; font-style: italic; color: #e8c8ff;
          letter-spacing: 0.02em;
        }
        .lush-close-btn {
          width: 32px; height: 32px; border-radius: 50%;
          border: 1px solid rgba(183,110,232,0.3);
          background: rgba(255,255,255,0.05);
          color: #b0a8cc; cursor: pointer; display: flex;
          align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .lush-close-btn:hover { background: rgba(200,80,192,0.2); color: white; border-color: rgba(200,80,192,0.6); }
        .lush-modal-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.45rem; font-weight: 600; color: #f0e6ff;
          margin: 0.5rem 0 0.25rem;
        }
        .lush-modal-subtitle {
          font-size: 0.8rem; color: rgba(183,110,232,0.75);
          margin: 0;
        }

        /* ── Tab Nav ── */
        .lush-tab-nav {
          display: flex; gap: 0; padding: 0.875rem 1.75rem 0;
          overflow-x: auto; scrollbar-width: none;
        }
        .lush-tab-nav::-webkit-scrollbar { display: none; }
        .lush-nav-tab {
          padding: 0.5rem 1rem; border: none; cursor: pointer;
          font-size: 0.78rem; font-weight: 500; white-space: nowrap;
          border-radius: 8px 8px 0 0;
          background: transparent; color: rgba(183,110,232,0.6);
          border-bottom: 2px solid transparent;
          transition: all 0.2s;
        }
        .lush-nav-tab.active {
          color: #e8c8ff; border-bottom-color: #c850c0;
          background: rgba(200, 80, 192, 0.08);
        }
        .lush-nav-tab:hover:not(.active) { color: #c8a8ee; }

        /* ── Body / Scroll ── */
        .lush-body {
          flex: 1; overflow-y: auto; padding: 1.25rem 1.75rem;
          scrollbar-width: thin; scrollbar-color: rgba(183,110,232,0.3) transparent;
        }
        .lush-body::-webkit-scrollbar { width: 4px; }
        .lush-body::-webkit-scrollbar-thumb { background: rgba(183,110,232,0.3); border-radius: 4px; }

        /* ── Section ── */
        .lush-section { margin-bottom: 1.5rem; }
        .lush-section-header {
          display: flex; align-items: center; gap: 0.75rem;
          margin-bottom: 0.875rem;
        }
        .lush-section-icon {
          width: 34px; height: 34px; border-radius: 10px;
          background: rgba(200, 80, 192, 0.15);
          display: flex; align-items: center; justify-content: center;
          color: #c850c0; flex-shrink: 0;
        }
        .lush-section-title {
          font-size: 0.9rem; font-weight: 600; color: #e0d0ff;
          margin: 0;
        }
        .lush-section-subtitle {
          font-size: 0.72rem; color: rgba(183,110,232,0.65);
          margin: 0.1rem 0 0;
        }

        /* ── Permission Tabs ── */
        .lush-privacy-tabs {
          display: flex; gap: 6px; flex-wrap: wrap;
        }
        .lush-tab {
          padding: 0.375rem 0.75rem; border-radius: 20px;
          border: 1px solid rgba(183,110,232,0.25);
          background: rgba(255,255,255,0.04); color: rgba(183,110,232,0.7);
          font-size: 0.73rem; font-weight: 500; cursor: pointer;
          transition: all 0.15s;
        }
        .lush-tab:hover { border-color: rgba(200,80,192,0.5); color: #c8a8ee; }
        .lush-tab.active {
          background: linear-gradient(135deg, rgba(200,80,192,0.3), rgba(100,60,200,0.3));
          border-color: rgba(200,80,192,0.7); color: #f0e6ff;
          box-shadow: 0 0 12px rgba(200,80,192,0.25);
        }

        /* ── Toggle ── */
        .lush-toggle-row {
          display: flex; align-items: center; gap: 0.75rem;
          padding: 0.75rem 0.875rem; border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(183,110,232,0.1);
          margin-bottom: 0.5rem; cursor: pointer;
          transition: background 0.15s;
        }
        .lush-toggle-row:hover { background: rgba(200,80,192,0.06); }
        .lush-toggle-icon {
          width: 30px; height: 30px; border-radius: 8px;
          background: rgba(200,80,192,0.12); display: flex;
          align-items: center; justify-content: center; flex-shrink: 0;
          color: #c850c0;
        }
        .lush-toggle-text { flex: 1; min-width: 0; }
        .lush-toggle-label {
          font-size: 0.82rem; font-weight: 500; color: #d8c8f0;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .lush-toggle-sublabel {
          display: block; font-size: 0.71rem; color: rgba(183,110,232,0.55);
          margin-top: 0.1rem;
        }
        .lush-badge-premium {
          font-size: 0.65rem; background: linear-gradient(135deg, #ffcc02, #ff6b6b);
          color: #1a0635; padding: 0.1rem 0.4rem; border-radius: 6px; font-weight: 600;
        }
        .lush-toggle-switch { flex-shrink: 0; position: relative; }
        .lush-toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
        .lush-slider {
          display: block; width: 40px; height: 22px; border-radius: 11px;
          transition: all 0.25s; position: relative; cursor: pointer;
        }
        .lush-slider.off { background: rgba(255,255,255,0.12); }
        .lush-slider.on { background: linear-gradient(135deg, #c850c0, #7c3aed); box-shadow: 0 0 10px rgba(200,80,192,0.5); }
        .lush-slider::after {
          content: ''; position: absolute;
          top: 3px; width: 16px; height: 16px; border-radius: 50%;
          background: white; transition: left 0.25s;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .lush-slider.off::after { left: 3px; }
        .lush-slider.on::after { left: 21px; }

        /* ── Permission Row ── */
        .lush-permission-row {
          margin-bottom: 1rem;
        }
        .lush-permission-label {
          display: flex; align-items: center; gap: 0.5rem;
          font-size: 0.8rem; font-weight: 500; color: #c8b8e8;
          margin-bottom: 0.5rem;
        }

        /* ── Visibility Grid ── */
        .lush-vis-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        }
        .lush-vis-card {
          padding: 0.75rem; border-radius: 12px;
          border: 1px solid rgba(183,110,232,0.18);
          background: rgba(255,255,255,0.03); cursor: pointer;
          transition: all 0.15s; text-align: center;
        }
        .lush-vis-card:hover { border-color: rgba(200,80,192,0.45); }
        .lush-vis-card.active {
          border-color: rgba(200,80,192,0.7);
          background: linear-gradient(135deg, rgba(200,80,192,0.15), rgba(100,60,200,0.12));
          box-shadow: 0 0 16px rgba(200,80,192,0.2);
        }
        .lush-vis-emoji { font-size: 1.25rem; display: block; margin-bottom: 0.25rem; }
        .lush-vis-name { font-size: 0.75rem; font-weight: 600; color: #d8c8f0; }
        .lush-vis-desc { font-size: 0.67rem; color: rgba(183,110,232,0.55); margin-top: 0.15rem; }

        /* ── Duration Pills ── */
        .lush-duration-pills {
          display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;
        }
        .lush-duration-pill {
          padding: 0.375rem 0.875rem; border-radius: 20px; cursor: pointer;
          border: 1px solid rgba(183,110,232,0.25);
          background: rgba(255,255,255,0.04); color: rgba(183,110,232,0.7);
          font-size: 0.75rem; font-weight: 500; transition: all 0.15s;
        }
        .lush-duration-pill.active {
          background: linear-gradient(135deg, rgba(200,80,192,0.3), rgba(100,60,200,0.3));
          border-color: rgba(200,80,192,0.7); color: #f0e6ff;
        }

        /* ── Age Slider ── */
        .lush-age-row {
          display: flex; align-items: center; gap: 0.75rem;
          margin-top: 0.75rem;
        }
        .lush-age-label { font-size: 0.75rem; color: #c8b8e8; min-width: 28px; text-align: center; }
        .lush-range {
          flex: 1; -webkit-appearance: none;
          height: 4px; border-radius: 2px;
          background: linear-gradient(90deg, rgba(200,80,192,0.6), rgba(100,60,200,0.6));
          outline: none;
        }
        .lush-range::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px;
          border-radius: 50%; background: linear-gradient(135deg, #c850c0, #7c3aed);
          cursor: pointer; box-shadow: 0 0 8px rgba(200,80,192,0.6);
        }

        /* ── Category Pills ── */
        .lush-category-grid { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .lush-category-pill {
          padding: 0.35rem 0.75rem; border-radius: 16px; cursor: pointer;
          border: 1px solid rgba(183,110,232,0.22);
          background: rgba(255,255,255,0.04); color: rgba(183,110,232,0.65);
          font-size: 0.72rem; transition: all 0.15s;
        }
        .lush-category-pill.selected {
          background: linear-gradient(135deg, rgba(200,80,192,0.25), rgba(100,60,200,0.25));
          border-color: rgba(200,80,192,0.65); color: #f0e6ff;
        }

        /* ── Divider ── */
        .lush-divider {
          height: 1px; background: linear-gradient(90deg, transparent, rgba(183,110,232,0.2), transparent);
          margin: 1.25rem 0;
        }

        /* ── Custom date input ── */
        .lush-date-input {
          width: 100%; padding: 0.625rem 0.875rem; border-radius: 10px;
          border: 1px solid rgba(183,110,232,0.3); background: rgba(255,255,255,0.05);
          color: #d8c8f0; font-size: 0.82rem; outline: none;
          transition: border-color 0.2s;
        }
        .lush-date-input:focus { border-color: rgba(200,80,192,0.7); }
        .lush-date-input::-webkit-calendar-picker-indicator { filter: invert(0.7); }

        /* ── Status Bar ── */
        .lush-status {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.625rem 0.875rem; border-radius: 10px;
          font-size: 0.78rem; font-weight: 500; margin-bottom: 0.875rem;
        }
        .lush-status.success { background: rgba(34,197,94,0.12); color: #4ade80; border: 1px solid rgba(34,197,94,0.25); }
        .lush-status.error { background: rgba(239,68,68,0.12); color: #f87171; border: 1px solid rgba(239,68,68,0.25); }

        /* ── Footer ── */
        .lush-footer {
          padding: 1rem 1.75rem 1.25rem;
          border-top: 1px solid rgba(183,110,232,0.15);
          display: flex; align-items: center; justify-content: space-between;
          gap: 0.75rem;
        }
        .lush-footer-hint { font-size: 0.7rem; color: rgba(183,110,232,0.45); }
        .lush-footer-actions { display: flex; gap: 0.625rem; }
        .lush-btn {
          padding: 0.625rem 1.25rem; border-radius: 12px;
          font-size: 0.82rem; font-weight: 600; cursor: pointer;
          border: none; transition: all 0.2s;
        }
        .lush-btn-cancel {
          background: rgba(255,255,255,0.07); color: #b0a8cc;
          border: 1px solid rgba(183,110,232,0.2);
        }
        .lush-btn-cancel:hover { background: rgba(255,255,255,0.12); }
        .lush-btn-save {
          background: linear-gradient(135deg, #c850c0, #7c3aed);
          color: white; box-shadow: 0 4px 20px rgba(200,80,192,0.4);
          min-width: 110px; display: flex; align-items: center; justify-content: center; gap: 0.4rem;
        }
        .lush-btn-save:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(200,80,192,0.55); }
        .lush-btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Loading ── */
        .lush-spinner {
          width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
          animation: lushSpin 0.7s linear infinite;
        }
        @keyframes lushSpin { to { transform: rotate(360deg); } }

        /* ── Loading overlay ── */
        .lush-loading-overlay {
          position: absolute; inset: 0; display: flex;
          align-items: center; justify-content: center;
          background: rgba(15, 5, 32, 0.7); border-radius: 24px; z-index: 10;
        }
      `}</style>

      <div className="lush-overlay" role="dialog" aria-modal="true" aria-label="Lush Pressies Privacy Controls">
        <div className="lush-modal" style={{ position: 'relative' }}>

          {loading && (
            <div className="lush-loading-overlay">
              <div className="lush-spinner" style={{ width: 28, height: 28, borderWidth: 3 }} />
            </div>
          )}

          {/* ── HEADER ── */}
          <div className="lush-header">
            <div className="lush-header-top">
              <div className="lush-brand">
                <div className="lush-brand-icon">🌸</div>
                <span className="lush-brand-name">Lush Pressies</span>
              </div>
              <button className="lush-close-btn" onClick={onClose} aria-label="Close">
                <X size={14} />
              </button>
            </div>
            <h2 className="lush-modal-title">Privacy & Access Controls</h2>
            <p className="lush-modal-subtitle">
              Manage who sees, interacts with, and downloads <em>{contentTitle}</em>
            </p>
          </div>

          {/* ── TAB NAV ── */}
          <div className="lush-tab-nav" role="tablist">
            {(['core', 'gates', 'audience', 'duration'] as const).map((tab) => (
              <button
                key={tab}
                className={`lush-nav-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
              >
                {tab === 'core' && '🛡️ Core Permissions'}
                {tab === 'gates' && '🔑 Lush Gates'}
                {tab === 'audience' && '👥 Audience'}
                {tab === 'duration' && '⏱️ Duration'}
              </button>
            ))}
          </div>

          {/* ── BODY ── */}
          <div className="lush-body" role="tabpanel">

            {status && (
              <div className={`lush-status ${status.type}`}>
                {status.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                {status.text}
              </div>
            )}

            {/* ════════════ TAB: CORE PERMISSIONS ════════════ */}
            {activeTab === 'core' && (
              <>
                {/* Visibility */}
                <div className="lush-section">
                  <SectionHeader
                    icon={<Eye size={16} />}
                    title="Content Visibility"
                    subtitle="Who can discover and view this content"
                  />
                  <div className="lush-vis-grid">
                    {([
                      { val: 'public', emoji: '🌍', name: 'Public', desc: 'Everyone on Lush' },
                      { val: 'connections', emoji: '🤝', name: 'Connections', desc: 'Accepted connections only' },
                      { val: 'matches', emoji: '💕', name: 'Matches', desc: 'Mutual likes only' },
                      { val: 'private', emoji: '🔒', name: 'Private', desc: 'Only you' },
                      { val: 'unlisted', emoji: '🔗', name: 'Unlisted', desc: 'Direct link access' },
                    ] as { val: VisibilityLevel; emoji: string; name: string; desc: string }[]).map(({ val, emoji, name, desc }) => (
                      <div
                        key={val}
                        className={`lush-vis-card ${settings.visibility === val ? 'active' : ''}`}
                        onClick={() => set('visibility', val)}
                        role="radio"
                        aria-checked={settings.visibility === val}
                      >
                        <span className="lush-vis-emoji">{emoji}</span>
                        <div className="lush-vis-name">{name}</div>
                        <div className="lush-vis-desc">{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lush-divider" />

                {/* 6 Permission Rows */}
                {([
                  { key: 'allowReviews' as const, icon: <Star size={14} />, label: 'Reviews' },
                  { key: 'allowComments' as const, icon: <MessageSquare size={14} />, label: 'Comments' },
                  { key: 'allowSharing' as const, icon: <Share2 size={14} />, label: 'Sharing' },
                  { key: 'allowTagging' as const, icon: <Tag size={14} />, label: 'Tagging' },
                  { key: 'allowSaving' as const, icon: <Bookmark size={14} />, label: 'Saving' },
                  { key: 'allowDownload' as const, icon: <Download size={14} />, label: 'Downloads' },
                ]).map(({ key, icon, label }) => (
                  <div key={key} className="lush-permission-row">
                    <div className="lush-permission-label">{icon} {label}</div>
                    <PermissionSelect
                      value={settings[key] as PermissionLevel}
                      onChange={(v) => set(key, v)}
                    />
                  </div>
                ))}
              </>
            )}

            {/* ════════════ TAB: LUSH GATES ════════════ */}
            {activeTab === 'gates' && (
              <>
                <div className="lush-section">
                  <SectionHeader
                    icon={<Shield size={16} />}
                    title="Lush Pressies Exclusive Gates"
                    subtitle="Layer powerful access restrictions unique to Lush Pressies"
                  />

                  <Toggle
                    id="gate-pin"
                    checked={settings.pinExchangeRequired}
                    onChange={(v) => set('pinExchangeRequired', v)}
                    icon={<Key size={14} />}
                    label="PIN Exchange Required"
                    sublabel="Viewer must have completed 8-digit PIN exchange with you"
                  />

                  <Toggle
                    id="gate-gift"
                    checked={settings.giftRequiredToView}
                    onChange={(v) => set('giftRequiredToView', v)}
                    icon={<Gift size={14} />}
                    label="Gift Required to View"
                    sublabel="Viewer must have sent you a marketplace gift first"
                  />

                  <Toggle
                    id="gate-commit"
                    checked={settings.commitButtonUnlockedOnly}
                    onChange={(v) => set('commitButtonUnlockedOnly', v)}
                    icon={<Heart size={14} />}
                    label="Commit Button Unlocked Only"
                    sublabel="Only visible after 5 months of connection history"
                    premium
                  />

                  <Toggle
                    id="gate-radiate"
                    checked={settings.radiatePlusOnly}
                    onChange={(v) => set('radiatePlusOnly', v)}
                    icon={<Zap size={14} />}
                    label="Radiate++ Members Only"
                    sublabel="Requires an active Radiate++ premium boost session"
                    premium
                  />
                </div>

                <div className="lush-divider" />

                <div className="lush-section">
                  <SectionHeader
                    icon={<Crown size={16} />}
                    title="Membership Category Gate"
                    subtitle="Restrict to specific Lush Pressies membership tiers"
                  />
                  <div className="lush-category-grid">
                    {(['Genuine Match', 'Validate Match', 'Empathetic Match', 'Sincere Match', 'Hopeful Match'] as MembershipCategory[]).map((cat) => (
                      <button
                        key={cat}
                        className={`lush-category-pill ${settings.membershipCategoryGate.includes(cat) ? 'selected' : ''}`}
                        onClick={() => toggleMembershipCategory(cat)}
                        type="button"
                      >
                        {settings.membershipCategoryGate.includes(cat) ? '✦ ' : ''}{cat}
                      </button>
                    ))}
                  </div>
                  <p style={{ fontSize: '0.68rem', color: 'rgba(183,110,232,0.45)', marginTop: '0.625rem' }}>
                    Leave empty to allow all membership categories.
                  </p>
                </div>
              </>
            )}

            {/* ════════════ TAB: AUDIENCE ════════════ */}
            {activeTab === 'audience' && (
              <>
                <div className="lush-section">
                  <SectionHeader
                    icon={<Users size={16} />}
                    title="Gender Targeting"
                    subtitle="Limit visibility to a specific gender identity"
                  />
                  <div className="lush-privacy-tabs">
                    {(['all', 'male', 'female', 'non_binary'] as const).map((g) => (
                      <button
                        key={g}
                        className={`lush-tab ${settings.genderTarget === g ? 'active' : ''}`}
                        onClick={() => set('genderTarget', g)}
                        type="button"
                      >
                        {g === 'all' && '🌈 All Genders'}
                        {g === 'male' && '♂ Male'}
                        {g === 'female' && '♀ Female'}
                        {g === 'non_binary' && '⚧ Non-Binary'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lush-divider" />

                <div className="lush-section">
                  <SectionHeader
                    icon={<Globe size={16} />}
                    title="Age Range"
                    subtitle={`Visible to ages ${settings.ageRangeMin}–${settings.ageRangeMax}`}
                  />
                  <div className="lush-age-row">
                    <span className="lush-age-label">{settings.ageRangeMin}</span>
                    <input
                      type="range" className="lush-range"
                      min={18} max={settings.ageRangeMax - 1}
                      value={settings.ageRangeMin}
                      onChange={(e) => set('ageRangeMin', parseInt(e.target.value, 10))}
                      aria-label="Minimum age"
                    />
                    <input
                      type="range" className="lush-range"
                      min={settings.ageRangeMin + 1} max={99}
                      value={settings.ageRangeMax}
                      onChange={(e) => set('ageRangeMax', parseInt(e.target.value, 10))}
                      aria-label="Maximum age"
                    />
                    <span className="lush-age-label">{settings.ageRangeMax}</span>
                  </div>
                </div>
              </>
            )}

            {/* ════════════ TAB: DURATION ════════════ */}
            {activeTab === 'duration' && (
              <>
                <div className="lush-section">
                  <SectionHeader
                    icon={<Clock size={16} />}
                    title="Content Lifespan"
                    subtitle="Set how long this content remains visible"
                  />
                  <div className="lush-duration-pills">
                    {([
                      { val: 'permanent', label: '♾️ Permanent' },
                      { val: '24h', label: '⏰ 24 Hours' },
                      { val: '7d', label: '📅 7 Days' },
                      { val: '30d', label: '🗓 30 Days' },
                      { val: 'custom', label: '✏️ Custom' },
                    ] as { val: DurationOption; label: string }[]).map(({ val, label }) => (
                      <button
                        key={val}
                        className={`lush-duration-pill ${settings.durationType === val ? 'active' : ''}`}
                        onClick={() => set('durationType', val)}
                        type="button"
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {settings.durationType === 'custom' && (
                    <input
                      type="datetime-local"
                      className="lush-date-input"
                      value={settings.customExpiresAt || ''}
                      onChange={(e) => set('customExpiresAt', e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      aria-label="Custom expiry date and time"
                    />
                  )}
                </div>

                <div className="lush-divider" />

                <Toggle
                  id="auto-delete"
                  checked={settings.autoDelete}
                  onChange={(v) => set('autoDelete', v)}
                  icon={<Lock size={14} />}
                  label="Auto-Delete on Expiry"
                  sublabel="Permanently removes content when the duration ends (cannot be undone)"
                />
              </>
            )}
          </div>

          {/* ── FOOTER ── */}
          <div className="lush-footer">
            <span className="lush-footer-hint">
              {contentType} · {contentId.slice(0, 8)}…
            </span>
            <div className="lush-footer-actions">
              <button className="lush-btn lush-btn-cancel" onClick={onClose} type="button">
                Cancel
              </button>
              <button
                className="lush-btn lush-btn-save"
                onClick={handleSave}
                disabled={saving}
                type="button"
              >
                {saving ? (
                  <><div className="lush-spinner" /> Saving…</>
                ) : (
                  <><Check size={14} /> Save Settings</>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default LushPrivacyControlModal;
