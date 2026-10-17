import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import identityService from '../services/identityService';
import { TrashIcon, UserCircleIcon, LinkIcon } from '../icons';

const ProfileEnhancement: React.FC = () => {
  const { showToast, user, member } = useAppContext();
  const [headline, setHeadline] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [certInput, setCertInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadCurrent = async () => {
      setIsLoading(true);
      try {
        const profile = await identityService.getProfile(user?.id || member?.id);
        if (profile) {
          if (profile.bio) setHeadline(profile.bio);
          if (profile.website) setPortfolioUrl(profile.website);
          if (Array.isArray(profile.interests)) {
            setSkills(profile.interests);
          }
        }
      } catch (err) {
        // continue
      } finally {
        setIsLoading(false);
      }
    };
    loadCurrent();
  }, [user, member]);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills(prev => [...prev, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill));
  };

  const addCert = () => {
    if (certInput.trim() && !certifications.includes(certInput.trim())) {
      setCertifications(prev => [...prev, certInput.trim()]);
      setCertInput('');
    }
  };

  const removeCert = (cert: string) => {
    setCertifications(prev => prev.filter(c => c !== cert));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await identityService.enhanceProfile({
        userId: user?.id || member?.id,
        headline,
        portfolioUrl,
        skills,
        certifications
      });
      showToast('Profile enhanced and published successfully!', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to enhance profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white">
            <UserCircleIcon className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Enhancement</h1>
            <p className="text-sm text-gray-500">
              Showcase verified credentials, skills, portfolio links, and cryptographic endorsements.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            Loading profile information...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Professional Headline & Bio</h2>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Smart Contract Auditor | NYSC Fellow"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Portfolio / Website Link</label>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
                  <span className="px-3 bg-gray-50 text-slate-700 border-r border-gray-300 text-sm">
                    <LinkIcon className="h-4 w-4" />
                  </span>
                  <input
                    type="url"
                    placeholder="https://yourportfolio.com"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full px-3 py-2 text-sm focus:outline-none text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Skills & Competencies</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add skill (e.g. Solidity, Python, Data Architecture)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-950 border border-blue-400 rounded-full text-xs font-medium   font-black"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-blue-900 text-sm leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {skills.length === 0 && (
                  <p className="text-xs text-slate-700">No skills added yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Certifications & Honors</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. AWS Certified Solutions Architect, Certified Solidity Developer"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCert();
                    }
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={addCert}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                >
                  Add
                </button>
              </div>

              <div className="space-y-2 pt-2">
                {certifications.map((cert) => (
                  <div key={cert} className="flex items-center justify-between p-3 bg-gray-50 border border-slate-300 rounded-lg text-xs font-medium text-gray-800">
                    <span>{cert}</span>
                    <button
                      type="button"
                      onClick={() => removeCert(cert)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-sm transition disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save & Publish Enhancements'}
              </button>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  );
};

export default ProfileEnhancement;
