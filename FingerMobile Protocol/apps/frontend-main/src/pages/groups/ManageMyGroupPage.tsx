import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';

import { useAppContext } from '../../contexts/AppContext';
import { GroupContext } from '../../contexts/GroupContext';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/PageHeader';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';
import { Group } from '../../types';
import groupsService from '../../services/groupsService';
import { Users, Save, ArrowLeft, Compass, MessageSquare } from 'lucide-react';

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
    <div className="flex-1 bg-slate-50 min-h-screen w-full max-w-full overflow-x-hidden pb-28 md:pb-12 text-slate-900">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-3 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/groups/${currentGroup.id}`)}
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 shadow-sm flex items-center justify-center active:scale-95 transition-all cursor-pointer"
            aria-label="Back to Group"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Manage: {currentGroup.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 font-medium">
              Update sovereign group parameters, charter rules, and membership criteria.
            </p>
          </div>
        </div>

        <PlatformOwnershipCard />

        <div className="max-w-3xl mx-auto bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border border-slate-300 space-y-6">
          <div>
            <label htmlFor="groupName" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Group Name
            </label>
            <input
              id="groupName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full min-h-[44px] px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-slate-900 font-bold text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
            />
          </div>

          <div>
            <label htmlFor="groupRules" className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Group Rules & Charter
            </label>
            <textarea
              id="groupRules"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              rows={5}
              className="w-full min-h-[120px] px-3.5 py-2.5 border-2 border-slate-300 rounded-xl text-slate-900 font-bold text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 font-black text-xs uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all disabled:bg-slate-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Sovereign Mobile Navigation Quick Dock */}
      <div
        data-testid="manage-group-mobile-dock"
        className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden"
      >
        <button
          type="button"
          onClick={() => navigate(`/groups/${currentGroup.id}`)}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-blue-400 active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Back</span>
        </button>
        <button
          type="button"
          onClick={handleSaveChanges}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-emerald-400 active:scale-95 transition-transform"
        >
          <Save className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Save</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/groups')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white active:scale-95 transition-transform"
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Groups</span>
        </button>
        <button
          type="button"
          onClick={() => navigate('/communities')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white active:scale-95 transition-transform"
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Guilds</span>
        </button>
      </div>
    </div>
  );
};

export default ManageMyGroupPage;
