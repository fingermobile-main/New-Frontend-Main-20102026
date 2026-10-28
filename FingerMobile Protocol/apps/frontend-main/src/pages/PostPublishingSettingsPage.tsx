import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { usePostPublishing } from '../contexts/PostPublishingContext';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import ErrorBoundary from '../components/ErrorBoundary';

const PostPublishingSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetSettings, applyAIRecommendations, saveSettings } = usePostPublishing();
  const { showToast } = useAppContext();
  const { member } = useAuth();
  const [isApplyingSuggestions, setIsApplyingSuggestions] = useState(false);
  const [collaboratorUsername, setCollaboratorUsername] = useState('');

  const handleInviteCollaborator = () => {
    if (!collaboratorUsername.trim()) {
      showToast('Please enter a collaborator username', 'error');
      return;
    }
    showToast(`Collaboration invitation sent to ${collaboratorUsername.trim()}`, 'success');
    setCollaboratorUsername('');
  };

  const handleApplyAiSuggestions = async () => {
    setIsApplyingSuggestions(true);
    await applyAIRecommendations('', member?.id || 'demo-member');
    setIsApplyingSuggestions(false);
    showToast('AI recommendations applied!', 'success');
  };

  const handleSaveDefault = async () => {
    const success = await saveSettings('default');
    if (success) {
      showToast('Default settings saved!', 'success');
    } else {
      showToast('Failed to save default settings', 'error');
    }
  };

  return (
    <MainLayout pageTitle="Intelligent Post Publishing Settings">
      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 pb-28 md:pb-12 max-w-full overflow-x-hidden text-slate-900">
        <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-300 pb-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Intelligent Post Publishing Settings</h1>
              <p className="text-sm font-medium text-slate-700 mt-1">
                Configure algorithmic distribution, audience targeting tiers, monetization models, and broadcasting channels.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSaveDefault}
                className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Save as Default
              </button>
              <button
                onClick={resetSettings}
                className="px-5 py-2.5 bg-slate-800 text-white font-bold text-sm rounded-xl hover:bg-slate-700 transition-colors shadow-sm"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Privacy & Audience */}
            <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-6">
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-200 pb-3">Privacy & Audience</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">Post Category</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'privateGroup', label: 'Private Group only' },
                      { id: 'publicGroup', label: 'Public Group only' },
                      { id: 'followers', label: 'Followers only' },
                      { id: 'everyone', label: 'Everyone' }
                    ].map(option => (
                      <div key={option.id} className="flex items-center">
                        <input
                          id={`privacy-${option.id}`}
                          name="privacy"
                          type="radio"
                          checked={settings.privacy === option.id}
                          onChange={() => updateSettings({ privacy: option.id as any })}
                          className="h-4 w-4 text-slate-900 border-slate-300 focus:ring-blue-500 font-bold border rounded bg-white focus:ring-2 placeholder:text-slate-400"
                        />
                        <label htmlFor={`privacy-${option.id}`} className="ml-3 block text-sm font-bold text-slate-800 cursor-pointer">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-3 border-t border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">Audience Targeting</h3>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">Gender</label>
                    <select
                      value={settings.audience.gender}
                      onChange={(e) => updateSettings({
                        audience: { ...settings.audience, gender: e.target.value as any }
                      })}
                      className="mt-1 block w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl shadow-sm"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="everyone">Everyone</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">Age Bracket</label>
                    <select
                      value={settings.audience.ageBracket}
                      onChange={(e) => updateSettings({
                        audience: { ...settings.audience, ageBracket: e.target.value as any }
                      })}
                      className="mt-1 block w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl shadow-sm"
                    >
                      <option value="24-34">24-34 years</option>
                      <option value="34-45">34-45 years</option>
                      <option value="45+">45 years+</option>
                      <option value="everyone">Everyone</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">Who Can Comment</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'everyone', label: 'Everyone' },
                      { id: 'followers', label: 'Followers' },
                      { id: 'none', label: 'None' }
                    ].map(option => (
                      <div key={option.id} className="flex items-center">
                        <input
                          id={`comment-${option.id}`}
                          name="commentPermissions"
                          type="radio"
                          checked={settings.comments === option.id}
                          onChange={() => updateSettings({ comments: option.id as any })}
                          className="h-4 w-4 text-slate-900 border-slate-300 focus:ring-blue-500 font-bold border rounded bg-white focus:ring-2 placeholder:text-slate-400"
                        />
                        <label htmlFor={`comment-${option.id}`} className="ml-3 block text-sm font-bold text-slate-800 cursor-pointer">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Scheduling, Monetization & Collaboration */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
                <h2 className="text-xl font-black text-slate-900 border-b border-slate-200 pb-3">Scheduling & Distribution</h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="schedule-enabled"
                      name="scheduleEnabled"
                      type="checkbox"
                      checked={!!settings.schedule.time}
                      onChange={(e) => updateSettings({
                        schedule: { ...settings.schedule, time: e.target.checked ? '12:00' : '' }
                      })}
                      className="h-4 w-4 text-slate-900 border-slate-300 rounded focus:ring-blue-500 font-bold border bg-white focus:ring-2 placeholder:text-slate-400"
                    />
                    <label htmlFor="schedule-enabled" className="ml-3 block text-sm font-bold text-slate-800 cursor-pointer">
                      Schedule Post Dispatch
                    </label>
                  </div>

                  {!!settings.schedule.time && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">Time</label>
                        <input
                          type="time"
                          value={settings.schedule.time}
                          onChange={(e) => updateSettings({
                            schedule: { ...settings.schedule, time: e.target.value }
                          })}
                          className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">Day</label>
                        <input
                          type="text"
                          value={settings.schedule.day}
                          onChange={(e) => updateSettings({
                            schedule: { ...settings.schedule, day: e.target.value }
                          })}
                          placeholder="e.g. Monday"
                          className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center">
                      <input
                        id="share-to-mi"
                        name="shareToMi"
                        type="checkbox"
                        checked={Boolean(settings.shareToMi)}
                        onChange={(e) => updateSettings({ shareToMi: e.target.checked })}
                        className="h-4 w-4 text-slate-900 border-slate-300 rounded focus:ring-blue-500 font-bold border bg-white focus:ring-2 placeholder:text-slate-400"
                      />
                      <label htmlFor="share-to-mi" className="ml-3 block text-sm font-bold text-slate-800 cursor-pointer">
                        Share to Mii©®™ (Disappearing Encounters)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
                <h2 className="text-xl font-black text-slate-900 border-b border-slate-200 pb-3">Creator Monetization</h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="monetization-enabled"
                      name="monetizationEnabled"
                      type="checkbox"
                      checked={settings.monetization.enabled}
                      onChange={(e) => updateSettings({
                        monetization: { ...settings.monetization, enabled: e.target.checked }
                      })}
                      className="h-4 w-4 text-slate-900 border-slate-300 rounded focus:ring-blue-500 font-bold border bg-white focus:ring-2 placeholder:text-slate-400"
                    />
                    <label htmlFor="monetization-enabled" className="ml-3 block text-sm font-bold text-slate-800 cursor-pointer">
                      Earn From this UGC (Paylink / Pay-Per-View)
                    </label>
                  </div>

                  {settings.monetization.enabled && (
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                        Monetization Model
                      </label>
                      <select
                        value={settings.monetization.model}
                        onChange={(e) => updateSettings({
                          monetization: { ...settings.monetization, model: e.target.value as any }
                        })}
                        className="block w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="subscription">Subscription-based access (Gems / FIC)</option>
                        <option value="payPerView">Pay-per-view unlock</option>
                        <option value="oneTime">One-time asset purchase</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
                <h2 className="text-xl font-black text-slate-900 border-b border-slate-200 pb-3">Collaboration</h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="collaboration-enabled"
                      name="collaborationEnabled"
                      type="checkbox"
                      checked={settings.collaboration.enabled}
                      onChange={(e) => updateSettings({
                        collaboration: { ...settings.collaboration, enabled: e.target.checked }
                      })}
                      className="h-4 w-4 text-slate-900 border-slate-300 rounded focus:ring-blue-500 font-bold border bg-white focus:ring-2 placeholder:text-slate-400"
                    />
                    <label htmlFor="collaboration-enabled" className="ml-3 block text-sm font-bold text-slate-800 cursor-pointer">
                      Invite Collaborator
                    </label>
                  </div>

                  {settings.collaboration.enabled && (
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                        Add Collaborator Username
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={collaboratorUsername}
                          onChange={(e) => setCollaboratorUsername(e.target.value)}
                          className="block flex-1 px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                          placeholder="@Name for Pin Share"
                        />
                        <button
                          type="button"
                          onClick={handleInviteCollaborator}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm"
                        >
                          Invite
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Broadcast, Boosting & AI Assistance */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
                <h2 className="text-xl font-black text-slate-900 border-b border-slate-200 pb-3">Broadcast Channels</h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="broadcast-enabled"
                      name="broadcastEnabled"
                      type="checkbox"
                      checked={settings.broadcast.enabled}
                      onChange={(e) => updateSettings({
                        broadcast: { ...settings.broadcast, enabled: e.target.checked }
                      })}
                      className="h-4 w-4 text-slate-900 border-slate-300 rounded focus:ring-blue-500 font-bold border bg-white focus:ring-2 placeholder:text-slate-400"
                    />
                    <label htmlFor="broadcast-enabled" className="ml-3 block text-sm font-bold text-slate-800 cursor-pointer">
                      Enable Multi-Channel Broadcast
                    </label>
                  </div>

                  {settings.broadcast.enabled && (
                    <div className="space-y-2 pt-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">Broadcast Scope</h3>
                      <div className="space-y-2">
                        {[
                          { id: 'everyone', label: 'Everyone (Global Stream)' },
                          { id: 'followers', label: 'Followers Only' },
                          { id: 'subscribers', label: 'Subscribers Only' }
                        ].map(option => (
                          <div key={option.id} className="flex items-center">
                            <input
                              id={`broadcast-${option.id}`}
                              name="broadcastAudience"
                              type="radio"
                              checked={settings.broadcast.audience === option.id}
                              onChange={() => updateSettings({
                                broadcast: { ...settings.broadcast, audience: option.id as any }
                              })}
                              className="h-4 w-4 text-slate-900 border-slate-300 focus:ring-blue-500 font-bold border rounded bg-white focus:ring-2 placeholder:text-slate-400"
                            />
                            <label htmlFor={`broadcast-${option.id}`} className="ml-3 block text-sm font-bold text-slate-800 cursor-pointer">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
                <h2 className="text-xl font-black text-slate-900 border-b border-slate-200 pb-3">Boosting & Advertising</h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="boost-enabled"
                      name="boostEnabled"
                      type="checkbox"
                      checked={settings.boosting.enabled}
                      onChange={(e) => updateSettings({
                        boosting: { ...settings.boosting, enabled: e.target.checked }
                      })}
                      className="h-4 w-4 text-slate-900 border-slate-300 rounded focus:ring-blue-500 font-bold border bg-white focus:ring-2 placeholder:text-slate-400"
                    />
                    <label htmlFor="boost-enabled" className="ml-3 block text-sm font-bold text-slate-800 cursor-pointer">
                      Boost Post into Discovery Feed
                    </label>
                  </div>

                  {settings.boosting.enabled && (
                    <div className="space-y-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">Boost Type</label>
                        <select
                          value={settings.boosting.type}
                          onChange={(e) => updateSettings({
                            boosting: { ...settings.boosting, type: e.target.value as any }
                          })}
                          className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="daily">Daily Boost (Recurring)</option>
                          <option value="oneTime">One-time Boost</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">Boost Budget (FIC)</label>
                        <input
                          type="number"
                          value={settings.boosting.amount}
                          onChange={(e) => updateSettings({
                            boosting: { ...settings.boosting, amount: Number(e.target.value) }
                          })}
                          className="w-full px-3 py-2 text-sm font-bold text-slate-900 bg-white border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 space-y-4">
                <h2 className="text-xl font-black text-slate-900 border-b border-slate-200 pb-3">AI Discovery Assistance</h2>

                <div className="space-y-4">
                  <button
                    onClick={handleApplyAiSuggestions}
                    disabled={isApplyingSuggestions}
                    className="w-full flex justify-center items-center px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
                  >
                    {isApplyingSuggestions ? 'Applying AI Suggestions...' : 'Apply AI Optimization Suggestions'}
                  </button>

                  <p className="text-xs font-medium text-slate-700 leading-relaxed">
                    Guardian AI analyzes your content tags and predicts optimal audience demographics, timing, and engagement scores for maximum creator reach.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 md:hidden">
          <div className="flex items-center justify-around gap-2 max-w-md mx-auto">
            <button
              type="button"
              onClick={handleSaveDefault}
              className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-all"
            >
              <span className="text-base font-black">💾</span>
              <span>Save</span>
            </button>
            <button
              type="button"
              onClick={handleApplyAiSuggestions}
              disabled={isApplyingSuggestions}
              className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-800 transition-all disabled:opacity-40"
            >
              <span className="text-base font-black">✨</span>
              <span>AI Optimize</span>
            </button>
            <button
              type="button"
              onClick={resetSettings}
              className="flex flex-col items-center justify-center min-w-[64px] min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-all"
            >
              <span className="text-base font-black">↺</span>
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const SafePostPublishingSettingsPage: React.FC = () => (
  <ErrorBoundary fallback={<div className="min-h-screen flex items-center justify-center p-6 text-slate-700 font-bold">Post publishing settings temporarily unavailable</div>}>
    <PostPublishingSettingsPage />
  </ErrorBoundary>
);

export default SafePostPublishingSettingsPage;
