import React from 'react';
import { useAppContext } from "../contexts/AppContext";
import { playAudio } from '../utils/audioPlayer';
import apiService, { ApiService } from '../services/apiService';
import { VoiceLine } from '../types';
import { useNavigate } from "react-router-dom";
import { GroupContext } from '../contexts/GroupContext';
import PageHeader from '../components/PageHeader';


const CreateGroupPage: React.FC = () => {
  const { showToast } = useAppContext();
  const groupContext = React.useContext(GroupContext);
  const handleCreateGroup = groupContext?.handleCreateGroup;
  const navigate = useNavigate();

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [logoUrl, setLogoUrl] = React.useState<string | undefined>(undefined);
  const [bannerUrl, setBannerUrl] = React.useState<string | undefined>(undefined);
  const [rules, setRules] = React.useState("");
  const [canPost, setCanPost] = React.useState(true);
  const [canInvite, setCanInvite] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [voiceLines, setVoiceLines] = React.useState<VoiceLine[]>([]);

  React.useEffect(() => {
    const fetchVoiceLines = async () => {
      try {
        // Mock voice lines fetch - ApiService.voices not implemented
        setVoiceLines([]);
      } catch (error) {
        console.error("Failed to fetch voice lines:", error);
      }
    };
    fetchVoiceLines();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setIsLoading(true);
    try {
      await handleCreateGroup?.(name, description);
      navigate("/groups");
    } catch (error) {
      console.error("Failed to create group:", error);
      showToast("Failed to create group. Please try again.", "error");
    } finally {
      setIsLoading(false);
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
          className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md space-y-6"
        >
          <div>
            <h3 className="font-bold text-base sm:text-lg border-b pb-2 mb-4">
              1. Branding
            </h3>
            <label className="block text-sm font-medium">Group Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
              required
            />
            <label className="block text-sm font-medium mt-4">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full mt-1 p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <h3 className="font-bold text-base sm:text-lg border-b pb-2 mb-4">
              2. Rules & Permissions
            </h3>
            <label className="block text-sm font-medium">Community Rules</label>
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              rows={4}
              className="w-full mt-1 p-2 border rounded-md"
              placeholder="1. Be kind and respectful..."
            />
            <div className="flex gap-4 mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={canPost}
                  onChange={(e) => setCanPost(e.target.checked)}
                  className="mr-2 h-4 w-4"
                />{" "}
                Members can post
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={canInvite}
                  onChange={(e) => setCanInvite(e.target.checked)}
                  className="mr-2 h-4 w-4"
                />{" "}
                Members can invite
              </label>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-semibold text-center text-gray-600 mb-2">
              Member Limit: 500 (Fixed)
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-semibold bg-brand-blue text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? "Creating Group..." : "Create Group"}
            </button>
            <button
              type="button"
              onClick={() => {
                if (voiceLines.length > 0) {
                  const randomIndex = Math.floor(
                    Math.random() * voiceLines.length,
                  );
                  playAudio(voiceLines[randomIndex].audioUrl);
                } else {
                  showToast("No voice lines available.", "info");
                }
              }}
              className="w-full mt-2 py-3 font-semibold bg-green-500 text-white rounded-lg hover:bg-green-600"
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
