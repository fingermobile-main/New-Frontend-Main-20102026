import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { identityService, UserProfileData } from '../../services/identityService';
import { useAppContext } from '../../contexts/AppContext';
import {
  User,
  Mail,
  MapPin,
  Globe,
  Briefcase,
  Award,
  Save,
  Camera,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { member, showToast } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [profile, setProfile] = useState<UserProfileData>({
    name: '',
    username: '',
    email: '',
    bio: '',
    headline: '',
    avatarUrl: '',
    website: '',
    location: '',
    skills: [],
    certifications: []
  });

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    loadProfile();
  }, [member]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const targetId = member?.id || (member as any)?.user_id;
      const res = await identityService.getProfile(targetId);
      if (res && (res.name || res.email || res.username)) {
        setProfile({
          ...res,
          name: res.name || member?.name || '',
          email: res.email || member?.email || '',
          username: res.username || (member as any)?.username || (member as any)?.handle || '',
          bio: res.bio || member?.bio || '',
          headline: res.headline || '',
          avatarUrl: res.avatarUrl || res.avatar || member?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          website: res.website || '',
          location: typeof res.location === 'object' && res.location ? JSON.stringify(res.location) : (res.location || ''),
          skills: Array.isArray(res.skills) ? res.skills : ['Digital Identity', 'Fintech', 'Micro-investing'],
          certifications: Array.isArray(res.certifications) ? res.certifications : []
        });
      } else {
        // Fallback to local member context
        setProfile({
          name: member?.name || '',
          email: member?.email || '',
          username: (member as any)?.username || (member as any)?.handle || '',
          bio: member?.bio || '',
          headline: 'Community Contributor & Digital Member',
          avatarUrl: member?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          skills: ['Digital Identity', 'Protocol Communication'],
          certifications: []
        });
      }
    } catch {
      if (member) {
        setProfile(prev => ({
          ...prev,
          name: member.name || '',
          email: member.email || '',
          avatarUrl: member.avatarUrl || prev.avatarUrl
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && (e as React.KeyboardEvent).key !== 'Enter') return;
    e.preventDefault();
    if (!newSkill.trim()) return;

    if (!profile.skills?.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: (prev.skills || []).filter((s: string) => s !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const targetId = member?.id || (member as any)?.user_id;
      const res = await identityService.updateProfile({
        name: profile.name,
        bio: profile.bio,
        headline: profile.headline,
        website: profile.website,
        location: profile.location,
        avatarUrl: profile.avatarUrl,
        skills: profile.skills,
        certifications: profile.certifications
      }, targetId);

      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Profile successfully updated and synchronized.' });
        showToast('Profile updated successfully!', 'success');
      } else {
        throw new Error(res.message || 'Failed to update profile');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || 'Failed to update profile';
      setStatusMessage({ type: 'error', text: msg });
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-400">Loading identity profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Dashboard
          </button>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            PostgreSQL Verified Profile
          </span>
        </div>

        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{statusMessage.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hero Profile Header */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <img
                  src={profile.avatarUrl || 'https://via.placeholder.com/150'}
                  alt={profile.name || 'User Avatar'}
                  className="w-28 h-28 rounded-full object-cover border-4 border-slate-100 dark:border-slate-700 shadow"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newUrl = prompt('Enter image avatar URL:', profile.avatarUrl || '');
                    if (newUrl) setProfile(prev => ({ ...prev, avatarUrl: newUrl }));
                  }}
                  className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md transition-colors"
                  title="Change avatar photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {profile.name || 'Member Profile'}
                </h1>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  @{profile.username || 'finger_member'}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {profile.headline || 'Digital Identity & Protocol Member'}
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/20 shadow-sm transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>

          {/* Core Identity Details */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              General Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name || ''}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    name="email"
                    value={profile.email || ''}
                    onChange={handleChange}
                    required
                    placeholder="jane@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Professional Headline
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    name="headline"
                    value={profile.headline || ''}
                    onChange={handleChange}
                    placeholder="e.g. Senior Smart Contract Architect"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Website / Portfolio
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="url"
                    name="website"
                    value={profile.website || ''}
                    onChange={handleChange}
                    placeholder="https://myportfolio.io"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  name="location"
                  value={typeof profile.location === 'string' ? profile.location : ''}
                  onChange={handleChange}
                  placeholder="e.g. Lagos, Nigeria or Global Remote"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Bio & Identity Narrative
              </label>
              <textarea
                name="bio"
                rows={4}
                value={profile.bio || ''}
                onChange={handleChange}
                placeholder="Share your background, achievements, and protocol focus..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
              />
            </div>
          </div>

          {/* Skills and Expertise */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Verified Skills & Endorsements
            </h2>

            <div className="flex flex-wrap gap-2 mb-3">
              {(profile.skills || []).map((skill: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Add a new skill (press Enter)"
                className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-medium text-xs text-slate-800 dark:text-slate-200 transition-colors"
              >
                Add Skill
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
