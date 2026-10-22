import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';

import { useAppContext } from '../../contexts/AppContext';
import { GroupContext } from '../../contexts/GroupContext';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/PageHeader';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';
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
    <div className="flex-1 bg-slate-50 min-h-screen">
      <PageHeader
        title={`Manage: ${currentGroup.name}`}
        description="Update your sovereign group parameters, charter rules, and membership criteria."
      />
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <PlatformOwnershipCard />

        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-300 space-y-6">
          <div>
            <label htmlFor="groupName" className="block text-sm font-bold text-slate-900 mb-1">Group Name</label>
            <input id="groupName" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2.5 border rounded-xl text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400 text-sm" />
          </div>
          <div>
            <label htmlFor="groupRules" className="block text-sm font-bold text-slate-900 mb-1">Group Rules & Charter</label>
            <textarea id="groupRules" value={rules} onChange={e => setRules(e.target.value)} rows={5} className="w-full p-2.5 border rounded-xl text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400 text-sm" />
          </div>
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button onClick={handleSaveChanges} disabled={isSaving} className="px-6 py-2.5 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-colors disabled:bg-slate-400 cursor-pointer text-sm">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageMyGroupPage;
