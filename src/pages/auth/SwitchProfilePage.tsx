import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { SubProfile } from '../../types';
import { CheckCircle, PlusCircle, ArrowLeft, ArrowRight, ShieldCheck, Briefcase, User, Sparkles } from 'lucide-react';

const DEFAULT_SUB_PROFILES: SubProfile[] = [
  {
    id: 'profile-personal',
    memberId: 'user-default',
    name: 'Personal Account',
    type: 'personal',
    isDefault: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    blockedContentIds: [],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'profile-creator',
    memberId: 'user-default',
    name: 'Creator Studio',
    type: 'creator',
    isDefault: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    blockedContentIds: [],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'profile-enterprise',
    memberId: 'user-default',
    name: 'Merchant & Paylinks',
    type: 'business',
    isDefault: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    blockedContentIds: [],
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80'
  }
];

const SwitchProfilePage: React.FC = () => {
  const { profileId } = useParams<{ profileId?: string }>();
  const navigate = useNavigate();
  const { member, showToast } = useAppContext();

  const [profiles, setProfiles] = useState<SubProfile[]>(DEFAULT_SUB_PROFILES);
  const [activeId, setActiveId] = useState<string>(() => {
    return localStorage.getItem('active_subprofile_id') || 'profile-personal';
  });
  const [isSwitching, setIsSwitching] = useState<string | null>(null);

  useEffect(() => {
    // If member has subProfiles in context, blend them with defaults
    if (member && Array.isArray((member as any).subProfiles) && (member as any).subProfiles.length > 0) {
      setProfiles((member as any).subProfiles);
    }
  }, [member]);

  useEffect(() => {
    if (profileId) {
      handleSwitchProfile(profileId, false);
    }
  }, [profileId]);

  const handleSwitchProfile = (id: string, redirect = true) => {
    const target = profiles.find(p => p.id === id);
    if (!target) {
      showToast('Profile ID not found', 'error');
      return;
    }

    setIsSwitching(id);
    setTimeout(() => {
      setActiveId(id);
      localStorage.setItem('active_subprofile_id', id);
      localStorage.setItem('active_subprofile', JSON.stringify(target));
      setIsSwitching(null);
      showToast(`Switched active profile to ${target.name}`, 'success');

      if (redirect) {
        navigate('/profile');
      }
    }, 400);
  };

  const getProfileIcon = (type?: string) => {
    switch (type) {
    case 'creator':
      return <Sparkles className="w-5 h-5 text-amber-500" />;
    case 'business':
      return <Briefcase className="w-5 h-5 text-indigo-500" />;
    default:
      return <User className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Multi-Profile Identity Engine
            </span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">
            Switch Identity Profile
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Seamlessly toggle between your Personal, Creator, and Enterprise personas without signing out.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3 mb-8">
          {profiles.map((profile) => {
            const isActive = activeId === profile.id;
            const switchingThis = isSwitching === profile.id;

            return (
              <div
                key={profile.id}
                onClick={() => handleSwitchProfile(profile.id, true)}
                className={`relative rounded-2xl p-6 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-800 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <img
                        src={profile.avatarUrl || 'https://via.placeholder.com/150'}
                        alt={profile.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-slate-800 rounded-full shadow">
                        {getProfileIcon(profile.type)}
                      </div>
                    </div>
                    {isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-emerald-950/60 dark:text-emerald-300 font-black">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Active
                      </span>
                    ) : (
                      <span className="text-xs uppercase font-medium text-slate-700 tracking-wider">
                        {profile.type || 'Sub-profile'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {profile.name}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    ID: {profile.id}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                    {isActive ? 'Current Session' : switchingThis ? 'Switching...' : 'Click to Activate'}
                  </span>
                  <ArrowRight className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700'}`} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center bg-white/50 dark:bg-slate-800/30">
          <div className="mx-auto w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mb-3 border text-indigo-950 border-indigo-400 font-black">
            <PlusCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Need a specialized persona?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            You can create dedicated profiles for official brand representations, agency partnerships, or creator collectives.
          </p>
          <button
            onClick={() => {
              showToast('Sub-profile provisioning wizard initiated', 'info');
              navigate('/official-verification');
            }}
            className="mt-4 inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-700 shadow-sm text-xs font-semibold rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none"
          >
            Create New Brand Sub-Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwitchProfilePage;
