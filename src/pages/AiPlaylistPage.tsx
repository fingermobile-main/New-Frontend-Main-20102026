import React from 'react';
import { useAppContext } from "../contexts/AppContext";
import { useAI } from '../contexts/AIContext';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { logError } from '../utils/errorLogger';
import { MusicalNoteIcon } from '../icons';
import MainLayout from '../components/layout/MainLayout';

const AiPlaylistPage: React.FC = () => {
  const { showToast, ficBalance } = useAppContext();
  const { generatePlaylist, isLoading, error } = useAI();
  const [prompt, setPrompt] = React.useState<string>("");
  const [playlist, setPlaylist] = React.useState<string[]>([]);
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const generatedPlaylist = await generatePlaylist(prompt);
      setPlaylist(generatedPlaylist);
    } catch (err) {
      logError(err, { context: "AiPlaylistPage - Generate Playlist" });
      showToast("Failed to generate playlist. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <MainLayout pageTitle="AI Playlist Generator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-xl">
              <MusicalNoteIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                AI Playlist Generator
              </h1>
              <p className="text-gray-600 mt-1">
                Create custom playlists using artificial intelligence
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">
                Create Your Perfect Playlist
              </h2>
              <p className="text-gray-600 mb-6">
                Describe the mood, activity, or genre you want for your playlist and
                our AI will generate a custom playlist for you.
              </p>

              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Upbeat workout music' or 'Relaxing evening jazz'"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isGenerating}
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isGenerating ? "Generating..." : "Generate"}
                </button>
              </div>

              {error && <div className="text-red-500 mb-4">{error}</div>}
            </div>

            {isLoading && (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            )}

            {playlist.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold mb-4">Your Generated Playlist</h3>
                <div className="space-y-3">
                  {playlist.map((song, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full mr-4">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{song}</p>
                      </div>
                      <button className="text-gray-400 hover:text-blue-600" aria-label="Button"><svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700">
                    Save Playlist
                  </button>
                  <button
                    onClick={() => setPlaylist([])}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Generate Another
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MusicalNoteIcon className="h-5 w-5 text-purple-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-purple-700 hover:to-indigo-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">AI Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-indigo-50 transition-colors flex items-center">
                  <MusicalNoteIcon className="h-5 w-5 text-purple-600 mr-3" />
                  Generate Playlist
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-indigo-50 transition-colors flex items-center">
                  Create Mix
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-purple-50 hover:to-indigo-50 transition-colors flex items-center">
                  Mood Analysis
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">AI Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Be descriptive with your requests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Specify genre and mood</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Include activity context</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AiPlaylistPage;