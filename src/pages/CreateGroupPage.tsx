import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import { useAppContext } from '../contexts/AppContext';
import { useGroup } from '../contexts/GroupContext';
import { playAudio } from '../utils/audioPlayer';

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
    <div className="flex-1 bg-gray-50 min-h-screen">
      <PageHeader
        title="Create a Group"
        description="Build a community for free, limited to 500 members."
      />

      <div className="p-4 sm:p-6 lg:p-8">
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md space-y-6"
        >
          {/* Section 1: Branding */}
          <fieldset className="space-y-4">
            <legend className="w-full font-bold text-base sm:text-lg border-b pb-2 mb-4 text-gray-900">
              1. Branding
            </legend>

            <div>
              <label htmlFor="group-name" className="block text-sm font-medium text-gray-700">
                Group Name
              </label>
              <input
                id="group-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="e.g. Web Developers United"
                required
              />
            </div>

            <div>
              <label htmlFor="group-description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="group-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full mt-1 p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="What is this group about?"
                required
              />
            </div>
          </fieldset>

          {/* Section 2: Rules & Permissions */}
          <fieldset className="space-y-4">
            <legend className="w-full font-bold text-base sm:text-lg border-b pb-2 mb-4 text-gray-900">
              2. Rules & Permissions
            </legend>

            <div>
              <label htmlFor="group-rules" className="block text-sm font-medium text-gray-700">
                Community Rules
              </label>
              <textarea
                id="group-rules"
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                rows={4}
                className="w-full mt-1 p-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="1. Be kind and respectful&#10;2. No spam or self-promotion..."
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canPost}
                  onChange={(e) => setCanPost(e.target.checked)}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Members can post
              </label>

              <label className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={canInvite}
                  onChange={(e) => setCanInvite(e.target.checked)}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Members can invite
              </label>
            </div>
          </fieldset>

          {/* Actions Section */}
          <div className="border-t pt-4 space-y-3">
            <p className="text-sm font-semibold text-center text-gray-500">
              Member Limit: 500 (Fixed)
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Group...' : 'Create Group'}
            </button>

            <button
              type="button"
              onClick={handlePlayVoiceLine}
              disabled={isLoading}
              className="w-full py-3 font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              Play Random Voice Line
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupPage;
