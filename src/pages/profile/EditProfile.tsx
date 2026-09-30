import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { useAppContext } from '../../contexts/AppContext';
import { updateMemberProfile } from '../../services/api';
import type { Member } from '../../types'; // Import Member type to access location type

interface MemberData {
  name: string;
  membername: string;
  email: string;
  bio: string;
  website?: string;
  location?: { // Use the same location type as in Member interface
    country: string;
    region?: string;
    city?: string;
  };
  avatarUrl: string | null;
  // Add other member fields as needed
}

const EditProfile: React.FC = () => {
  const { member, setMember, showToast } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<MemberData>({
    name: '',
    membername: '',
    email: '',
    bio: '',
    website: '',
    location: { country: '', city: '' }, // Initialize with the proper structure
    avatarUrl: null
  });

  const [avatar, setAvatar] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        membername: member.membername || '',
        email: member.email || '',
        bio: member.bio || '',
        website: '', // Removed reference to member.website since it doesn't exist
        location: member.location || { country: '', city: '' }, // Use the location from member
        avatarUrl: member.avatarUrl || null
      });
      setAvatar(member.avatarUrl || null);
    }
  }, [member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle nested location field separately
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          country: prev.location?.country || '',
          region: prev.location?.region || '',
          city: prev.location?.city || '',
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      showToast('Failed to upload avatar', 'error');
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      showToast('Name is required', 'error');
      return false;
    }
    if (!formData.membername.trim()) {
      showToast('Username is required', 'error');
      return false;
    }
    if (!formData.email.trim()) {
      showToast('Email is required', 'error');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('Please enter a valid email address', 'error');
      return false;
    }
    if (!(formData.location?.country || '').trim()) {
      showToast('Country is required', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!member) {
      showToast('No member logged in', 'error');
      return;
    }

    setLoading(true);
    try {
      const updatedMember = await updateMemberProfile({
        ...member,
        ...formData,
        avatarUrl: avatar || undefined
      }) as Member;

      if (setMember) {
        setMember(updatedMember);
      }

      showToast('Profile updated successfully!', 'success');
      navigate('/profile');
    } catch {
      showToast('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Update your personal information and profile details
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-gray-500">
                    {formData.name.charAt(0)}
                  </span>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={isUploading}
                aria-label="Upload profile picture"
              />
            </div>
            {isUploading && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Uploading...</p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your full name" />
            </div>

            <div>
              <label htmlFor="membername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input
                type="text"
                id="membername"
                name="membername"
                value={formData.membername}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your username" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your email address" />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Tell us about yourself"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label htmlFor="location.country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
              <input
                type="text"
                id="location.country"
                name="location.country"
                value={formData.location?.country || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your country" />
            </div>

            <div>
              <label htmlFor="location.city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
              <input
                type="text"
                id="location.city"
                name="location.city"
                value={formData.location?.city || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter your city" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
