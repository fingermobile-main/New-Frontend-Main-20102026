import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';
import { XIcon } from '../../components/icons';
import { hallmarkService, HallmarkApplication } from '../../services/hallmarkService';
import { Hallmark, Member } from '../../types';
import { useAppContext } from '../../contexts/AppContext';

const ManageMyHallmarkPage: React.FC = () => {
  const { member, showToast, startSession, joinSession, leaveSession, activeSession, openModal } = useAppContext();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberRole, setMemberRole] = useState<string>('');
  const [showAddMemberForm, setShowAddMemberForm] = useState<boolean>(false);
  const [newMemberEmail, setNewMemberEmail] = useState<string>('');
  const [hallmarks, setHallmarks] = useState<Hallmark[]>([]);
  const [selectedHallmarkId, setSelectedHallmarkId] = useState<string>('');
  const [sessionTitle, setSessionTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHallmarks = async () => {
      try {
        const fetchedHallmarks = await hallmarkService.getAllHallmarks();
        setHallmarks(fetchedHallmarks);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch hallmarks');
        setLoading(false);
        console.error('Fetch error:', err);
      }
    };

    fetchHallmarks();
  }, []);

  useEffect(() => {
    if (!member) {
      navigate('/hallmark');
    }
  }, [member, navigate]);

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSaveChanges = async () => {
    if (!selectedHallmarkId) return;

    try {
      const hallmarkToUpdate = hallmarks.find(h => h.id === selectedHallmarkId);
      if (!hallmarkToUpdate) return;

      const updatedHallmark: Hallmark = {
        ...hallmarkToUpdate,
        name: name || hallmarkToUpdate.name,
        description: description || hallmarkToUpdate.description,
        tags: tags.length > 0 ? tags : hallmarkToUpdate.tags || [],
        // Preserve other properties
      };

      await hallmarkService.updateHallmark(hallmarkToUpdate.id, updatedHallmark);
      toast.success('Hallmark updated successfully');
    } catch (err) {
      setError('Failed to update hallmark');
      toast.error('Failed to update hallmark');
      console.error('Update error:', err);
    }
  };

  const handleAddMember = async () => {
    if (!selectedHallmarkId || !newMemberEmail) return;

    try {
      await hallmarkService.addMember(selectedHallmarkId, newMemberEmail);
      toast.success('Member invited successfully');
      setNewMemberEmail('');
    } catch (err) {
      setError('Failed to invite member');
      toast.error('Failed to invite member');
      console.error('Invite error:', err);
    }
  };

  const handleUpdateMemberRole = async () => {
    if (!selectedHallmarkId || !editingMember || !memberRole) return;

    try {
      await hallmarkService.updateMemberRole(selectedHallmarkId, editingMember.id, memberRole);
      toast.success('Member role updated successfully');
      setEditingMember(null);
    } catch (err) {
      setError('Failed to update member role');
      toast.error('Failed to update member role');
      console.error('Update role error:', err);
    }
  };

  const handleStartSession = async () => {
    if (!selectedHallmarkId || !sessionTitle.trim()) {
      showToast('Please enter a title for your live session.', 'warning');
      return;
    }

    try {
      const pin = await startSession(selectedHallmarkId, 'Hallmark', sessionTitle);

      const handleJoinAsHost = () => {
        if (activeSession) {
          joinSession(activeSession.id);
          openModal('voiceFeed');
        }
      };

      openModal('sessionPin', { pin, title: sessionTitle, onJoin: handleJoinAsHost });
    } catch (error) {
      console.error('Failed to start session:', error);
      showToast('Could not start the live session. Please try again later.', 'error');
    }
  };

  const handleEndSession = () => {
    if (window.confirm('Are you sure you want to end this live session for everyone?')) {
      leaveSession();
    }
  };

  // Find the selected hallmark
  const selectedHallmark = hallmarks.find(h => h.id === selectedHallmarkId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manage My Hallmark</h1>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Select Hallmark</h2>

              <select
                value={selectedHallmarkId}
                onChange={(e) => setSelectedHallmarkId(e.target.value)}
                className="w-full p-2 border rounded mb-4 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a hallmark</option>
                {hallmarks.map((hallmark) => (
                  <option key={hallmark.id} value={hallmark.id}>
                    {hallmark.name}
                  </option>
                ))}
              </select>

              {selectedHallmark && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={name || selectedHallmark.name || ''}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={description || selectedHallmark.description || ''}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <div className="flex mt-1">
                      <input
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        placeholder="Add a tag"
                        className="flex-1 border border-gray-300 rounded-l-md p-2 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                      />
                      <button
                        onClick={handleAddTag}
                        className="bg-blue-500 text-white px-4 rounded-r-md"
                      >
                        Add
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {tags && tags.length > 0 ? tags.map((tag, index) => (
                        <div key={index} className="bg-blue-100 text-blue-950 border border-blue-400 font-bold px-3 py-1 rounded-full flex items-center font-black">
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(index)}
                            className="ml-2 text-blue-800 hover:text-blue-900"
                          >
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )) : (selectedHallmark.tags || []).map((tag: string, index: number) => (
                        <div key={index} className="bg-blue-100 text-blue-950 border border-blue-400 font-bold px-3 py-1 rounded-full flex items-center font-black">
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(index)}
                            className="ml-2 text-blue-800 hover:text-blue-900"
                          >
                            <XIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveChanges}
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Members</h2>
                <button
                  onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add Member
                </button>
              </div>

              {showAddMemberForm && (
                <div className="mb-4 p-4 border rounded">
                  <h3 className="font-medium mb-2">Add New Member</h3>
                  <div className="flex">
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder="Enter member email"
                      className="flex-1 border border-gray-300 rounded-l-md p-2 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                    />
                    <button
                      onClick={handleAddMember}
                      className="bg-blue-500 text-white px-4 rounded-r-md"
                    >
                      Invite
                    </button>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(selectedHallmark?.members || []).filter((m: Member | string): m is Member => typeof m !== 'string').map((member: Member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img className="h-10 w-10 rounded-full" src={member.avatar || 'https://via.placeholder.com/40x40'} alt={member.name}  />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.role}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditingMember(member);
                              setMemberRole(member.role || '');
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                          >
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {editingMember && (
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Edit Member Role</h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Current Role</label>
                  <p className="mt-1 text-sm text-gray-900">{editingMember.role}</p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">New Role</label>
                  <select
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="member">Member</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleUpdateMemberRole}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                  >
                    Update Role
                  </button>
                  <button
                    onClick={() => setEditingMember(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageMyHallmarkPage;
