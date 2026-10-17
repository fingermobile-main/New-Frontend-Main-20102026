import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';

import { useAppContext } from '../../contexts/AppContext';
import { GroupContext } from '../../contexts/GroupContext';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/PageHeader';
import { Group } from '../../types';
import groupsService from '../../services/groupsService';

const ManageMyGroupPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { member } = useAuth();
  const { showToast } = useAppContext();
  const groupContext = useContext(GroupContext);
  const groups = groupContext?.groups ?? [];
  const handleUpdateGroup = groupContext?.handleUpdateGroup ?? (async (_groupId: string, _updates: unknown) => {});

  const [currentGroup, setCurrentGroup] = useState<any>(groups.find((g: Group) => g.id === groupId) || null);
  const [loading, setLoading] = useState(!currentGroup);
  const [name, setName] = useState<string>('');
  const [rules, setRules] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (currentGroup) {
      setName(currentGroup.name || '');
      setRules(currentGroup.rules || currentGroup.description || '');
      setLoading(false);
      return;
    }

    if (groupId) {
      groupsService.getGroupById(groupId).then((res) => {
        if (mounted && res.group) {
          setCurrentGroup(res.group);
          setName(res.group.name || '');
          setRules((res.group as any).rules || res.group.description || '');
        }
      }).catch(err => {
        console.warn('Failed to fetch group in ManageMyGroupPage:', err);
      }).finally(() => {
        if (mounted) setLoading(false);
      });
    }

    return () => { mounted = false; };
  }, [groupId, currentGroup]);

  if (loading) {
    return <div className="p-8 text-center">Loading group settings...</div>;
  }

  if (!currentGroup) {
    return <PageHeader title="Group Not Found" description="The requested group could not be found." />;
  }

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await handleUpdateGroup(currentGroup.id, { name, rules });
      showToast('Changes saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save changes', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <PageHeader
        title={`Manage: ${currentGroup.name}`}
        description="Update your group settings."
      />
      <div className="p-6 lg:p-8">
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium">Group Name</label>
            <input id="groupName" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2 border rounded-md text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
          </div>
          <div>
            <label htmlFor="groupRules" className="block text-sm font-medium">Group Rules</label>
            <textarea id="groupRules" value={rules} onChange={e => setRules(e.target.value)} rows={5} className="w-full mt-1 p-2 border rounded-md text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={handleSaveChanges} disabled={isSaving} className="px-6 py-2 font-semibold bg-brand-blue text-white rounded-full disabled:bg-gray-400">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageMyGroupPage;
