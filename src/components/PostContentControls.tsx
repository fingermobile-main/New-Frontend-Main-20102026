import React, { useState, useMemo } from 'react';
import { ShieldCheckIcon, EyeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

interface CensorshipOptions {
  tags: string[];
  visualEffect: 'NONE' | 'BLUR' | 'CENSOR_BAR' | 'INTERSTITIAL';
  interactionRule: 'NONE' | 'CLICK_TO_REVEAL' | '15_SEC_TIMER' | 'VIEW_ONCE';
}

export interface LushPrivacySettings {
  visibility: 'public' | 'connections' | 'matches' | 'private' | 'unlisted';
  durationType: 'permanent' | '24h' | '7d' | '30d' | 'custom';
  expiresAt?: string | null;
  pinExchangeRequired: boolean;
  giftRequiredToView: boolean;
  membershipCategoryGate: string[];
  commitButtonUnlockedOnly: boolean;
  radiatePlusOnly: boolean;
  genderTarget: string;
  ageRangeMin: number;
  ageRangeMax: number;
  allowedLocations?: Record<string, any>;
  allowedUserIds?: string[] | null;
  autoDelete: boolean;
}

export interface PostContentControlsProps {
  censorshipOptions: CensorshipOptions;
  onCensorshipChange: (opts: CensorshipOptions) => void;
  privacySettings: LushPrivacySettings;
  onPrivacyChange: (settings: LushPrivacySettings) => void;
  contentType?: string;
  contentId?: string;
}

const VISIBILITY_LABELS: Record<string, string> = {
  public: '🌍 Public',
  connections: '🤝 Connections',
  matches: '💕 Matches',
  private: '🔒 Private',
  unlisted: '🔗 Unlisted',
};

const EFFECT_LABELS: Record<string, string | null> = {
  NONE: null,
  BLUR: '🌫 Blur',
  CENSOR_BAR: '▬ Censor bars',
  INTERSTITIAL: '⚠️ Warning overlay',
};

const RULE_LABELS: Record<string, string | null> = {
  NONE: null,
  CLICK_TO_REVEAL: '👆 Click-to-reveal',
  '15_SEC_TIMER': '⏱ 15-sec timer',
  VIEW_ONCE: '👁 View-once',
};

function usePrivacyTokens(s: LushPrivacySettings): string[] {
  return useMemo(() => {
    const tokens: string[] = [];
    tokens.push(VISIBILITY_LABELS[s.visibility] ?? s.visibility);
    if (s.durationType !== 'permanent') {
      const dur: Record<string, string> = {
        '24h': '⏰ 24h', '7d': '📅 7d', '30d': '🗓 30d', custom: '✏️ Custom',
      };
      tokens.push(dur[s.durationType] ?? s.durationType);
    }
    const gates: string[] = [];
    if (s.pinExchangeRequired) gates.push('PIN');
    if (s.giftRequiredToView) gates.push('Gift');
    if (s.commitButtonUnlockedOnly) gates.push('Commit');
    if (s.radiatePlusOnly) gates.push('Radiate++');
    if (gates.length) tokens.push(`🔑 ${gates.join(' · ')}`);
    if (s.membershipCategoryGate.length > 0)
      tokens.push(`👑 ${s.membershipCategoryGate.length} tier(s)`);
    return tokens;
  }, [s]);
}

function useCensorshipTokens(c: CensorshipOptions): string[] {
  return useMemo(() => {
    const tokens: string[] = [];
    if (c.tags.length > 0)
      tokens.push(`🏷 ${c.tags.slice(0, 2).join(', ')}${c.tags.length > 2 ? ` +${c.tags.length - 2}` : ''}`);
    const eff = EFFECT_LABELS[c.visualEffect];
    if (eff) tokens.push(eff);
    const rule = RULE_LABELS[c.interactionRule];
    if (rule) tokens.push(rule);
    return tokens;
  }, [c]);
}

function countActivePrivacy(s: LushPrivacySettings): number {
  let n = 0;
  if (s.visibility !== 'connections') n++;
  if (s.durationType !== 'permanent') n++;
  if (s.pinExchangeRequired) n++;
  if (s.giftRequiredToView) n++;
  if (s.commitButtonUnlockedOnly) n++;
  if (s.radiatePlusOnly) n++;
  if (s.membershipCategoryGate.length > 0) n++;
  if (s.genderTarget !== 'all') n++;
  if (s.ageRangeMin !== 18 || s.ageRangeMax !== 99) n++;
  if (s.autoDelete) n++;
  return n;
}

export const PostContentControls: React.FC<PostContentControlsProps> = ({
  censorshipOptions,
  onCensorshipChange,
  privacySettings,
  onPrivacyChange,
  contentType = 'post',
  contentId = '',
}) => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  const privacyTokens = usePrivacyTokens(privacySettings);
  const censorshipTokens = useCensorshipTokens(censorshipOptions);

  const privacyCount = countActivePrivacy(privacySettings);
  const censorCount =
    censorshipOptions.tags.length +
    (censorshipOptions.visualEffect !== 'NONE' ? 1 : 0) +
    (censorshipOptions.interactionRule !== 'NONE' ? 1 : 0);
  const totalActive = privacyCount + censorCount;

  return (
    <div className="w-full">
      {/* Toolbar row */}
      <div className="flex flex-wrap items-center gap-0">
        {/* CensorshipSelector placeholder */}
        <div
          className="p-2"
          title="Content warnings, visual effects & interaction rules"
        >
          <div className="px-3 py-1.5 text-xs font-medium bg-gray-100 rounded-md text-gray-700">
            Censorship
          </div>
        </div>

        <div className="w-px h-7 bg-gray-300 mx-2" aria-hidden="true" />

        {/* Privacy trigger */}
        <button
          type="button"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
            privacyCount > 0
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setIsPrivacyModalOpen(true)}
          title="Who can access this content — visibility, gates, audience & duration"
        >
          <ShieldCheckIcon className="w-4 h-4" />
          <span>Privacy & Access</span>
          {privacyCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-white bg-emerald-600 rounded-full">
              {privacyCount}
            </span>
          )}
        </button>
      </div>

      {/* Combined read-only summary strip */}
      {totalActive > 0 && (
        <div className="mt-1.5 border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
          <button
            type="button"
            className="w-full flex items-center justify-between gap-2 p-2 text-left text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsSummaryExpanded(v => !v)}
          >
            <div className="flex items-center gap-1.5">
              <EyeIcon className="w-4 h-4" />
              <span>
                {totalActive} active restriction{totalActive !== 1 ? 's' : ''}
                <span className="text-gray-500 ml-1">
                  {privacyCount > 0 && ` · ${privacyCount} access`}
                  {censorCount > 0 && ` · ${censorCount} presentation`}
                </span>
              </span>
            </div>
            <svg
              className={`w-4 h-4 transition-transform ${isSummaryExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isSummaryExpanded && (
            <div className="p-2.5 space-y-2 border-t border-gray-300">
              {/* Access (privacy) tokens */}
              {privacyTokens.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    <LockClosedIcon className="w-3 h-3" />
                    Access Control
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {privacyTokens.map((t, i) => (
                      <span key={i} className="inline-block px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold rounded border border-emerald-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Presentation (censorship) tokens */}
              {censorshipTokens.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    <EyeIcon className="w-3 h-3" />
                    Content Presentation
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {censorshipTokens.map((t, i) => (
                      <span key={i} className="inline-block px-2 py-0.5 text-xs font-medium bg-rose-100 text-rose-800 rounded border border-rose-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Privacy Modal */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Privacy & Access Settings</h3>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="text-slate-700 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                <select
                  value={privacySettings.visibility}
                  onChange={(e) => onPrivacyChange({...privacySettings, visibility: e.target.value as any})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2"
                >
                  <option value="public">🌍 Public</option>
                  <option value="connections">🤝 Connections</option>
                  <option value="matches">💕 Matches</option>
                  <option value="private">🔒 Private</option>
                  <option value="unlisted">🔗 Unlisted</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pinExchangeRequired"
                  checked={privacySettings.pinExchangeRequired}
                  onChange={(e) => onPrivacyChange({...privacySettings, pinExchangeRequired: e.target.checked})}
                  className="h-4 w-4 text-slate-900 focus:ring-indigo-500 border-gray-300 rounded font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                />
                <label htmlFor="pinExchangeRequired" className="ml-2 block text-sm text-gray-900">
                  Require PIN exchange to view
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="giftRequiredToView"
                  checked={privacySettings.giftRequiredToView}
                  onChange={(e) => onPrivacyChange({...privacySettings, giftRequiredToView: e.target.checked})}
                  className="h-4 w-4 text-slate-900 focus:ring-indigo-500 border-gray-300 rounded font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                />
                <label htmlFor="giftRequiredToView" className="ml-2 block text-sm text-gray-900">
                  Require gift to view
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsPrivacyModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostContentControls;
