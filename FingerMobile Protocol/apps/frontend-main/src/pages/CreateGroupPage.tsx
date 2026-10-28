import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import { useAppContext } from '../contexts/AppContext';
import { useGroup } from '../contexts/GroupContext';
import { playAudio } from '../utils/audioPlayer';
import { Users, PlusCircle, Compass, MessageSquare, Volume2, ArrowLeft } from 'lucide-react';

// eslint-disable-next-line no-unused-vars
interface VoiceLine {
  id: string;
  audioUrl: string;
  label?: string;
}

const CreateGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { handleCreateGroup } = useGroup();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');
  const [canPost, setCanPost] = useState(true);
  const [canInvite, setCanInvite] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [voiceLines, setVoiceLines] = useState<any[]>([]); // Replace VoiceLine with any temporarily

  useEffect(() => {
    let isMounted = true;

    const fetchVoiceLines = async () => {
      try {
        // Mock voice lines fetch - replace with real service call when available
        if (isMounted) {
          setVoiceLines([]);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch voice lines:', error);
      }
    };

    fetchVoiceLines();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setIsLoading(true);
    try {
      if (handleCreateGroup) {
        await handleCreateGroup(name, description);
      }
      showToast('Group created successfully!', 'success');
      navigate('/groups');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to create group:', error);
      showToast('Failed to create group. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayVoiceLine = () => {
    if (voiceLines.length > 0) {
      const randomIndex = Math.floor(Math.random() * voiceLines.length);
      playAudio(voiceLines[randomIndex].audioUrl);
    } else {
      showToast('No voice lines available.', 'info');
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen w-full max-w-full overflow-x-hidden pb-28 md:pb-12 text-slate-900">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-3 sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/groups')}
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm flex items-center justify-center active:scale-95 transition-all"
            aria-label="Back to Groups"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Create Sovereign Group</h1>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">Build a community guild for free, supporting up to 500 members.</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-300 shadow-sm space-y-6"
        >
          {/* Section 1: Branding */}
          <fieldset className="space-y-4">
            <legend className="w-full font-black text-base sm:text-lg border-b border-slate-200 pb-2 mb-4 text-slate-900">
              1. Guild Branding & Identity
            </legend>

            <div>
              <label htmlFor="group-name" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Group Name
              </label>
              <input
                id="group-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-slate-900 font-bold text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Web Developers United"
                required
              />
            </div>

            <div>
              <label htmlFor="group-description" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                id="group-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full min-h-[88px] px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-slate-900 font-bold text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="What is this group about?"
                required
              />
            </div>
          </fieldset>

          {/* Section 2: Rules & Permissions */}
          <fieldset className="space-y-4">
            <legend className="w-full font-black text-base sm:text-lg border-b border-slate-200 pb-2 mb-4 text-slate-900">
              2. Governance & Community Rules
            </legend>

            <div>
              <label htmlFor="group-rules" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                Community Rules
              </label>
              <textarea
                id="group-rules"
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                rows={3}
                className="w-full min-h-[88px] px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-slate-900 font-bold text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="1. Be kind and respectful&#10;2. No spam or self-promotion..."
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center min-h-[44px] text-xs font-bold text-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={canPost}
                  onChange={(e) => setCanPost(e.target.checked)}
                  className="mr-2.5 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Members can post
              </label>

              <label className="flex items-center min-h-[44px] text-xs font-bold text-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={canInvite}
                  onChange={(e) => setCanInvite(e.target.checked)}
                  className="mr-2.5 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Members can invite
              </label>
            </div>
          </fieldset>

          {/* Actions Section */}
          <div className="border-t border-slate-200 pt-4 space-y-3">
            <p className="text-xs font-black text-center text-slate-700 uppercase tracking-wider">
              Member Limit: 500 (Protocol Fixed)
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[44px] py-3 font-black text-xs uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-sm disabled:bg-slate-300 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              {isLoading ? 'Creating Group...' : 'Create Group'}
            </button>

            <button
              type="button"
              onClick={handlePlayVoiceLine}
              disabled={isLoading}
              className="w-full min-h-[44px] py-3 font-black text-xs uppercase tracking-wider bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-300 rounded-xl transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-slate-600" />
              Sample Voice Salutation
            </button>
          </div>
        </form>
      </div>

      {/* Floating Sovereign Mobile Navigation Quick Dock */}
      <div
        data-testid="create-group-mobile-dock"
        className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden"
      >
        <button
          type="button"
          onClick={() => navigate('/groups')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-blue-400 active:scale-95 transition-transform"
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Groups</span>
        </button>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white active:scale-95 transition-transform"
        >
          <PlusCircle className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Form</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/communities')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white active:scale-95 transition-transform"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Guilds</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/forum')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white active:scale-95 transition-transform"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Forum</span>
        </button>
      </div>
    </div>
  );
};

export default CreateGroupPage;
