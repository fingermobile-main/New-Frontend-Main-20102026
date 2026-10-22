import React, { useState } from 'react';
interface CommunityHeaderProps {
  communityName?: string;
  memberCount?: number;
  description?: string;
  avatar?: string;
  isJoined?: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
}

const CommunityHeader: React.FC<CommunityHeaderProps> = ({
  communityName = 'Community',
  memberCount = 0,
  description = '',
  avatar,
  isJoined = false,
  onJoin,
  onLeave
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'members' | 'events' | 'discussions' | 'analytics'>('posts');
  const [isPinned, setIsPinned] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="bg-white border-b border-slate-300">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 relative">
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="-mt-16 pb-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-xl bg-white p-1 shadow-lg">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={communityName}
                    className="w-full h-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-5xl font-bold text-white">
                    {communityName.charAt(0)}
                  </div>
                )}
              </div>

              {/* Online Indicator */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <span className="text-white text-xs">●</span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 pt-16">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">{communityName}</h1>
                  <p className="text-slate-700 mt-1 flex items-center gap-2 font-medium">
                    <span className="text-emerald-600 font-bold">●</span>
                    {memberCount.toLocaleString()} members online
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  {isJoined ? (
                    <>
                      <button
                        type="button"
                        onClick={onLeave}
                        className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors font-bold"
                      >
                        Leave
                      </button>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowDropdown(!showDropdown)}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') setShowDropdown(false);
                          }}
                          className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition-colors font-bold"
                          aria-label="More community options"
                          aria-haspopup="true"
                          aria-expanded={showDropdown}
                        >
                          ⋯
                        </button>

                        {showDropdown && (
                          <div
                            className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-slate-300 py-2 z-10"
                            role="menu"
                            aria-orientation="vertical"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setNotificationsEnabled(!notificationsEnabled);
                                setShowDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-slate-50 text-sm font-semibold text-slate-800 flex items-center justify-between"
                              role="menuitem"
                            >
                              <span>🔔 Notifications</span>
                              <span className="text-xs text-slate-500">{notificationsEnabled ? 'On' : 'Off'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsPinned(!isPinned);
                                setShowDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-slate-50 text-sm font-semibold text-slate-800 flex items-center justify-between"
                              role="menuitem"
                            >
                              <span>📌 Pin to Sidebar</span>
                              {isPinned && <span className="text-xs text-blue-600 font-bold">Pinned</span>}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                alert(`Reporting community ${communityName}`);
                                setShowDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left hover:bg-red-50 text-sm font-semibold text-red-700"
                              role="menuitem"
                            >
                              🚩 Report Community
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={onJoin}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-bold shadow-sm"
                    >
                      Join Community
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              {description && (
                <p className="text-slate-700 mt-3 max-w-3xl font-medium">{description}</p>
              )}

              {/* Tags */}
              <div className="flex items-center gap-2 mt-3">
                <span className="px-3 py-1 bg-purple-100 text-purple-950 border border-purple-400 font-bold rounded-full text-sm">
                  #technology
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-950 border border-blue-400 font-bold rounded-full text-sm">
                  #community
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-950 border border-green-400 font-bold rounded-full text-sm">
                  #learning
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-t border-slate-300">
          {[
            { id: 'posts', label: '📝 Posts' },
            { id: 'members', label: '👥 Members' },
            { id: 'events', label: '📅 Events' },
            { id: 'discussions', label: '💬 Discussions' },
            { id: 'analytics', label: '📊 Analytics' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-3 font-bold text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-purple-600 text-purple-700'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityHeader;
