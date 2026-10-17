import React, { useRef, useState } from 'react';
import { useProfile } from '../contexts/ProfileContext';

const AIAvatarGenerator: React.FC = () => {
  const profile = useProfile();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedAvatars, setGeneratedAvatars] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationPrompt, setGenerationPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAvatars = async () => {
    if (!selectedImage && !generationPrompt) {
      setError('Please upload an image or enter a text prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // In a real app, this would call an AI avatar generation API
      // For demonstration purposes, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulated generated avatars
      const simulatedAvatars = [
        'https://placehold.co/200x200/FFD700/000000?text=Avatar+1',
        'https://placehold.co/200x200/87CEEB/000000?text=Avatar+2',
        'https://placehold.co/200x200/DDA0DD/000000?text=Avatar+3',
        'https://placehold.co/200x200/98FB98/000000?text=Avatar+4'
      ];

      setGeneratedAvatars(simulatedAvatars);
    } catch (err) {
      setError('Failed to generate avatars. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectAvatar = async (avatarUrl: string) => {
    if (profile.profile) {
      try {
        await profile.updateAvatar(avatarUrl);
        alert('Avatar updated successfully!');
      } catch (err) {
        setError('Failed to update avatar. Please try again.');
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">AI Avatar Generator</h1>

      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Your Perfect Avatar</h2>
        <p className="text-gray-600 mb-4">
          Generate unique avatars using AI technology. Either upload a photo for AI transformation or describe
          the avatar you want to create with text.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <div className="mb-4">
              <label htmlFor="avatarPrompt" className="block text-gray-700 mb-2">Describe your ideal avatar:</label>
              <textarea
                id="avatarPrompt"
                value={generationPrompt}
                onChange={(e) => setGenerationPrompt(e.target.value)}
                placeholder="Example: A professional avatar with a smile, wearing glasses, in a business suit..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                rows={4}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="avatarUpload" className="block text-gray-700 mb-2">Or upload an image to transform:</label>
              <input
                id="avatarUpload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="hidden text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md"
              >
                {selectedImage ? 'Change Image' : 'Select Image'}
              </button>

              {selectedImage && (
                <div className="mt-4 flex justify-center">
                  <img
                    src={selectedImage}
                    alt="Selected for transformation"
                    className="max-h-40 rounded-md border border-gray-300"
                  />
                </div>
              )}
            </div>

            <button
              onClick={generateAvatars}
              disabled={isGenerating}
              className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                isGenerating
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isGenerating ? 'Generating Avatars...' : 'Generate Avatars'}
            </button>
          </div>

          <div className="md:w-1/2">
            <div className="bg-white p-4 rounded-lg border border-slate-300 h-full">
              <h3 className="text-lg font-medium text-gray-800 mb-2">Preview</h3>
              {selectedImage ? (
                <div className="flex justify-center">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="max-h-48 rounded-md border border-gray-300"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 bg-gray-100 rounded-md border-2 border-dashed border-gray-300">
                  <span className="text-gray-500">Image preview</span>
                </div>
              )}

              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-700 mb-2">Text Prompt Preview</h4>
                <p className="text-sm text-gray-600 italic min-h-16 p-2 bg-gray-50 rounded">
                  {generationPrompt || 'Enter a description to see a preview here...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-100 text-red-950 border border-red-400 font-bold rounded-md">
          {error}
        </div>
      )}

      {generatedAvatars.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Generated Avatars</h2>
          <p className="text-gray-600 mb-4">Click on any avatar to set it as your profile picture</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {generatedAvatars.map((avatar, index) => (
              <div key={index} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => selectAvatar(avatar)}
                  className="w-32 h-32 rounded-full border-4 border-transparent hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Select avatar ${index + 1}`}
                >
                  <img
                    src={avatar}
                    alt={`Generated avatar ${index + 1}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                </button>
                <button
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => selectAvatar(avatar)}
                >
                  Select as Avatar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-6 rounded-lg border border-slate-300">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">About AI Avatar Generation</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>AI avatars are generated using advanced neural networks</li>
          <li>All images are processed securely and never stored permanently</li>
          <li>You retain full rights to any avatars you create</li>
          <li>Generated avatars can be customized further with our editor tools</li>
          <li>Comes with a disclosure that the avatar is AI-generated (as required)</li>
        </ul>
      </div>
    </div>
  );
};

export default AIAvatarGenerator;
