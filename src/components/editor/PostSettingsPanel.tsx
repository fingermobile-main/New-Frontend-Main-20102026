/*
 * FingerMobile Protocol™ - Post Settings & Distribution Configuration Panel
 * Configures Category, Target Demographics, Comment Privileges, and Timed Scheduling.
 */

import React from 'react';
import {
  Shield,
  Users,
  MessageSquare,
  Calendar,
  Clock,
  CheckSquare,
  Square,
  Globe,
  Lock,
  UserCheck
} from 'lucide-react';

export interface PostSettingsState {
  isDefaultPreference: boolean;
  postCategory: 'private_group' | 'public_group' | 'only_me' | 'special_acquaintances';
  audienceGender: 'everyone' | 'male' | 'female';
  audienceAgeBracket: '24-34' | '34-45' | '45+' | 'everyone';
  whoCanComment: 'everyone' | 'followers' | 'following' | 'tagged_only';
  isScheduled: boolean;
  scheduleTime: string; // HH:MM AM/PM
  scheduleDay: string;  // 1-31
  scheduleMonth: string; // Jan - Dec
}

interface PostSettingsPanelProps {
  settings: PostSettingsState;
  onChange: (updated: PostSettingsState) => void;
  className?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));

export const defaultPostSettings: PostSettingsState = {
  isDefaultPreference: false,
  postCategory: 'public_group',
  audienceGender: 'everyone',
  audienceAgeBracket: 'everyone',
  whoCanComment: 'everyone',
  isScheduled: false,
  scheduleTime: '06:00 PM',
  scheduleDay: String(new Date().getDate()),
  scheduleMonth: MONTHS[new Date().getMonth()]
};

export type PostSettings = PostSettingsState;
export const DEFAULT_POST_SETTINGS = defaultPostSettings;

export const PostSettingsPanel: React.FC<PostSettingsPanelProps> = ({
  settings,
  onChange,
  className = ''
}) => {
  const update = (partial: Partial<PostSettingsState>) => {
    onChange({ ...settings, ...partial });
  };

  return (
    <div className={`space-y-6 bg-slate-50 dark:bg-slate-950/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs ${className}`}>
      {/* Set Below as Default checkbox */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => update({ isDefaultPreference: !settings.isDefaultPreference })}
            className="text-orange-500 hover:text-orange-600 transition"
          >
            {settings.isDefaultPreference ? (
              <CheckSquare className="w-4 h-4 fill-orange-500 text-white" />
            ) : (
              <Square className="w-4 h-4" />
            )}
          </button>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Set Below as Default Preferences (Yes/No)
          </span>
        </div>
        <span className="text-[10px] text-slate-500 italic">Saved to Member Profile</span>
      </div>

      {/* Blogs Post Category Selection */}
      <div>
        <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-orange-500" />
          <span>Blogs Post Category:</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { id: 'private_group', label: 'a. Private Group only', icon: Lock },
            { id: 'public_group', label: 'b. Public Group only', icon: Globe },
            { id: 'only_me', label: 'c. Only Me', icon: Lock },
            { id: 'special_acquaintances', label: 'd. Special Acquaintances only', icon: UserCheck }
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = settings.postCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => update({ postCategory: cat.id as any })}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition text-left ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-orange-500' : 'text-slate-400'}`} />
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Post Audience Selection */}
      <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
        <label className="block font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-indigo-500" />
          <span>1. Post Audience Selection:</span>
        </label>

        {/* a. Gender Selection */}
        <div>
          <span className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            a. Gender Demographics:
          </span>
          <div className="flex gap-2">
            {[
              { id: 'everyone', label: 'Everyone' },
              { id: 'male', label: 'Male' },
              { id: 'female', label: 'Female' }
            ].map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => update({ audienceGender: g.id as any })}
                className={`px-3 py-1.5 rounded-lg border font-medium transition ${
                  settings.audienceGender === g.id
                    ? 'border-indigo-500 bg-indigo-500 text-white shadow-sm'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* b. Age Bracket Selection */}
        <div>
          <span className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
            b. Age Bracket Cohort:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: '24-34', label: 'i. 24 - 34 years' },
              { id: '34-45', label: 'ii. 34 - 45 years' },
              { id: '45+', label: 'iii. 45 years+' },
              { id: 'everyone', label: 'iv. Everyone' }
            ].map(age => (
              <button
                key={age.id}
                type="button"
                onClick={() => update({ audienceAgeBracket: age.id as any })}
                className={`p-2 rounded-lg border text-center transition ${
                  settings.audienceAgeBracket === age.id
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                {age.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Who Can Comment */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
        <label className="block font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
          <span>2. Who Can Comment:</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'everyone', label: 'a. Everyone' },
            { id: 'followers', label: 'b. Followers' },
            { id: 'following', label: 'c. Following' },
            { id: 'tagged_only', label: 'd. Tagged Only' }
          ].map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => update({ whoCanComment: c.id as any })}
              className={`p-2 rounded-lg border text-center transition ${
                settings.whoCanComment === c.id
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-slate-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Schedule Post */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>3. Schedule Post:</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.isScheduled}
              onChange={(e) => update({ isScheduled: e.target.checked })}
              className="accent-orange-500 rounded text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            />
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Enable Scheduled Publishing
            </span>
          </label>
        </div>

        {settings.isScheduled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-300 dark:border-amber-800/50">
            {/* a. Time */}
            <div>
              <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> a. Time:
              </span>
              <input
                type="text"
                value={settings.scheduleTime}
                onChange={(e) => update({ scheduleTime: e.target.value })}
                placeholder="e.g. 06:30 PM"
                className="w-full px-2.5 py-1.5 text-xs border rounded-lg dark:bg-slate-800 dark:text-white text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
            </div>

            {/* b. Day */}
            <div>
              <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                b. Day:
              </span>
              <select
                value={settings.scheduleDay}
                onChange={(e) => update({ scheduleDay: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border rounded-lg dark:bg-slate-800 dark:text-white text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
              >
                {DAYS.map(d => (
                  <option key={d} value={d}>Day {d}</option>
                ))}
              </select>
            </div>

            {/* c. Month */}
            <div>
              <span className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
                c. Month:
              </span>
              <select
                value={settings.scheduleMonth}
                onChange={(e) => update({ scheduleMonth: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs border rounded-lg dark:bg-slate-800 dark:text-white text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
              >
                {MONTHS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostSettingsPanel;
