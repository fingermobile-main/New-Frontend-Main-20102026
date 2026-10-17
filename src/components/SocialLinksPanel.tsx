import React, { useState } from 'react';
import {
  LinkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  isVerified: boolean;
  createdAt: string;
}

const SocialLinksPanel: React.FC = () => {
  const [links, setLinks] = useState<SocialLink[]>([
    {
      id: '1',
      platform: 'Instagram',
      url: 'https://instagram.com/sarahj',
      isVerified: true,
      createdAt: '2026-09-15'
    },
    {
      id: '2',
      platform: 'Twitter',
      url: 'https://twitter.com/sarahj',
      isVerified: true,
      createdAt: '2026-09-20'
    },
    {
      id: '3',
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/sarahj',
      isVerified: false,
      createdAt: '2026-09-25'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({ platform: '', url: '' });
  const [editLink, setEditLink] = useState({ platform: '', url: '' });

  const platforms = [
    'Instagram', 'Twitter', 'Facebook', 'LinkedIn',
    'TikTok', 'YouTube', 'Snapchat', 'Pinterest',
    'Discord', 'Telegram', 'Website', 'Other'
  ];

  const handleAddLink = () => {
    if (newLink.platform && newLink.url) {
      const newSocialLink: SocialLink = {
        id: Date.now().toString(),
        platform: newLink.platform,
        url: newLink.url,
        isVerified: false,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setLinks([...links, newSocialLink]);
      setNewLink({ platform: '', url: '' });
      setShowAddForm(false);
    }
  };

  const handleUpdateLink = () => {
    if (editingId && editLink.platform && editLink.url) {
      setLinks(links.map(link =>
        link.id === editingId
          ? { ...link, platform: editLink.platform, url: editLink.url }
          : link
      ));
      setEditingId(null);
      setEditLink({ platform: '', url: '' });
    }
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const startEditing = (link: SocialLink) => {
    setEditingId(link.id);
    setEditLink({ platform: link.platform, url: link.url });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditLink({ platform: '', url: '' });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Social Links</h2>
            <p className="mt-1 text-sm text-gray-500">Connect your social media accounts</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Link
          </button>
        </div>

        {/* Add Link Form */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-slate-300">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Add New Social Link</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
                  Platform
                </label>
                <select
                  id="platform"
                  value={newLink.platform}
                  onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2"
                >
                  <option value="">Select platform</option>
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={newLink.url}
                  onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                  placeholder="https://example.com/username"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={handleAddLink}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Link
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Links List */}
        <div className="space-y-4">
          {links.map((link) => (
            <div
              key={link.id}
              className={`p-4 rounded-lg border ${
                link.isVerified
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              {editingId === link.id ? (
                // Edit form
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`edit-platform-${link.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Platform
                      </label>
                      <select
                        id={`edit-platform-${link.id}`}
                        value={editLink.platform}
                        onChange={(e) => setEditLink({ ...editLink, platform: e.target.value })}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2"
                      >
                        <option value="">Select platform</option>
                        {platforms.map(platform => (
                          <option key={platform} value={platform}>{platform}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor={`edit-url-${link.id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        URL
                      </label>
                      <input
                        type="url"
                        id={`edit-url-${link.id}`}
                        value={editLink.url}
                        onChange={(e) => setEditLink({ ...editLink, url: e.target.value })}
                        placeholder="https://example.com/username"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-blue focus:ring-brand-blue sm:text-sm text-slate-900 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleUpdateLink}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                    >
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display mode
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                      <LinkIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <h3 className="text-sm font-medium text-gray-900">{link.platform}</h3>
                        {link.isVerified && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-950 border border-green-400 font-bold">
                            Verified
                          </span>
                        )}
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand-blue hover:text-blue-700 truncate max-w-xs block"
                      >
                        {link.url}
                      </a>
                      <p className="text-xs text-gray-500 mt-1">Added {link.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(link)}
                      className="inline-flex items-center p-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-full hover:bg-gray-100"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="inline-flex items-center p-1.5 text-sm font-medium text-red-700 hover:text-red-900 rounded-full hover:bg-red-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {links.length === 0 && (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                <LinkIcon className="h-6 w-6 text-slate-700" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No social links</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get discovered on your other social platforms.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add your first link
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-300">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Verification Tips</h3>
          <ul className="text-sm text-gray-500 space-y-1">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Add a link to your Lush Pressies profile on your social media bio
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Share a post mentioning @LushPressies to help with verification
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">•</span>
              Verified links appear with a checkmark and higher trust score
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SocialLinksPanel;
