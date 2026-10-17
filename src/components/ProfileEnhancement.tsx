import React, { useState } from 'react';


interface Skill {
  id: number;
  name: string;
  level: number; // 1-5 scale
}

interface ProfileData {
  username: string;
  bio: string;
  profilePicture: string;
  coverImages: string[];
  profileVideo: string | null;
  skills: Skill[];
  links: string[];
  aiGenerated: boolean;
  isVerified: boolean;
  isProfessional: boolean;
}

// Shared input class — explicitly sets dark text so it stays visible on light/white backgrounds
const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-900 placeholder:text-slate-500';

const ProfileEnhancement: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    username: '',
    bio: '',
    profilePicture: '',
    coverImages: ['', '', ''],
    profileVideo: null,
    skills: [],
    links: [''],
    aiGenerated: false,
    isVerified: false,
    isProfessional: false
  });

  const [currentSkill, setCurrentSkill] = useState({ name: '', level: 3 });
  const [newLink, setNewLink] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSkill = () => {
    if (currentSkill.name.trim() !== '') {
      const newSkill: Skill = {
        id: Date.now(),
        name: currentSkill.name,
        level: currentSkill.level
      };
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      setCurrentSkill({ name: '', level: 3 });
    }
  };

  const handleRemoveSkill = (id: number) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== id)
    }));
  };

  const handleAddLink = () => {
    if (newLink.trim() !== '' && !profile.links.includes(newLink)) {
      setProfile(prev => ({
        ...prev,
        links: [...prev.links, newLink]
      }));
      setNewLink('');
    }
  };

  const handleRemoveLink = (index: number) => {
    setProfile(prev => {
      const newLinks = [...prev.links];
      newLinks.splice(index, 1);
      return {
        ...prev,
        links: newLinks
      };
    });
  };

  const handleCoverImageChange = (index: number, value: string) => {
    const newCoverImages = [...profile.coverImages];
    newCoverImages[index] = value;
    setProfile(prev => ({
      ...prev,
      coverImages: newCoverImages
    }));
  };

  const handleToggleAiGenerated = () => {
    setProfile(prev => ({
      ...prev,
      aiGenerated: !prev.aiGenerated
    }));
  };

  const handleToggleProfessional = () => {
    setProfile(prev => ({
      ...prev,
      isProfessional: !prev.isProfessional
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-gray-900">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Profile Enhancement</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Basic Info</h3>

            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username (3-30 characters)
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={profile.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className={[(inputClass), "text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"].filter(Boolean).join(" ")}
                maxLength={30}
                minLength={3}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 placeholder:text-slate-400 font-bold border-slate-300"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture URL
              </label>
              <input
                id="profilePicture"
                type="text"
                name="profilePicture"
                value={profile.profilePicture}
                onChange={handleInputChange}
                placeholder="https://example.com/profile.jpg"
                className={[(inputClass), "text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"].filter(Boolean).join(" ")}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="profileVideo" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Video URL (3-5s)
              </label>
              <input
                id="profileVideo"
                type="text"
                name="profileVideo"
                value={profile.profileVideo || ''}
                onChange={(e) => setProfile(prev => ({ ...prev, profileVideo: e.target.value || null }))}
                placeholder="https://example.com/video.mp4"
                className={[(inputClass), "text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"].filter(Boolean).join(" ")}
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="aiGenerated"
                checked={profile.aiGenerated}
                onChange={handleToggleAiGenerated}
                className="h-4 w-4 text-slate-900 focus:ring-indigo-500 border-gray-300 rounded font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
              />
              <label htmlFor="aiGenerated" className="text-sm font-medium text-gray-700">
                AI Generated Avatar
              </label>

              <input
                type="checkbox"
                id="professional"
                checked={profile.isProfessional}
                onChange={handleToggleProfessional}
                className="h-4 w-4 text-slate-900 focus:ring-indigo-500 border-gray-300 rounded font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
              />
              <label htmlFor="professional" className="text-sm font-medium text-gray-700">
                Professional Mode
              </label>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Cover Images/GIFs (3 images)</h3>

            {profile.coverImages.map((img, index) => (
              <div key={index} className="mb-3">
                <label htmlFor={`coverImage-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image {index + 1}
                </label>
                <input
                  id={`coverImage-${index}`}
                  type="text"
                  value={img}
                  onChange={(e) => handleCoverImageChange(index, e.target.value)}
                  placeholder={`https://example.com/cover-${index + 1}.jpg`}
                  className={[(inputClass), "text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"].filter(Boolean).join(" ")}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Skills (up to 25)</h3>

            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={currentSkill.name}
                onChange={(e) => setCurrentSkill({...currentSkill, name: e.target.value})}
                placeholder="Add a skill"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 placeholder:text-slate-400 font-bold border-slate-300"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
              />
              <select
                value={currentSkill.level}
                onChange={(e) => setCurrentSkill({...currentSkill, level: parseInt(e.target.value)})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 font-bold border-slate-300"
              >
                {[1, 2, 3, 4, 5].map(level => (
                  <option key={level} value={level} className="text-gray-900 bg-white">{level}</option>
                ))}
              </select>
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Add
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {profile.skills.map(skill => (
                <div key={skill.id} className="flex items-center justify-between bg-white p-2 rounded border border-slate-300">
                  <div>
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${i < skill.level ? 'text-yellow-500' : 'text-slate-700'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(skill.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {profile.skills.length === 0 && (
              <p className="text-sm text-slate-700 mt-2">No skills added yet. Type a skill and click Add.</p>
            )}
            <p className="text-sm text-slate-700 mt-2">
              {profile.skills.length}/25 skills added
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Links</h3>

            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="https://example.com"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 placeholder:text-slate-400 font-bold border-slate-300"
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLink(); } }}
              />
              <button
                onClick={handleAddLink}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Add
              </button>
            </div>

            <ul className="space-y-2">
              {profile.links.map((link, index) => (
                <li key={index} className="flex items-center justify-between bg-white p-2 rounded border border-slate-300">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 truncate max-w-[70%] hover:underline"
                  >
                    {link || <span className="text-slate-700 italic text-sm">No URL entered</span>}
                  </a>
                  <button
                    onClick={() => handleRemoveLink(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            {profile.links.length === 0 && (
              <p className="text-sm text-slate-700 mt-2">No links added yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium">
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileEnhancement;
