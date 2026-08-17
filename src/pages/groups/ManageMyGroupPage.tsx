import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';

import { useAppContext } from '../../contexts/AppContext';
import { GroupContext } from '../../contexts/GroupContext';
import { useAuth } from '../../contexts/AuthContext';
import PageHeader from '../../components/PageHeader';
import { Group } from '../../types';

const ManageMyGroupPage = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { member } = useAuth();
    const { showToast } = useAppContext();
    const groupContext = useContext(GroupContext);
    const groups = groupContext?.groups ?? [];
    const handleUpdateGroup = groupContext?.handleUpdateGroup ?? (async (_groupId: string, _updates: unknown) => {});
    
    const group = groups.find((g: Group) => g.id === groupId) as Group;
    
    const [name, setName] = useState<string>(group?.name || '');
    const [rules, setRules] = useState<string>(group?.rules || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!group || group.owner.id !== member?.id) {
            navigate('/groups');
        }
    }, [group, member, navigate]);

    if (!group || group.owner.id !== member?.id) {
        return null;
    }

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            await handleUpdateGroup(group.id, { name, rules });
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
                title={`Manage: ${group.name}`}
                description="Update your group settings."
            />
            <div className="p-6 lg:p-8">
                <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
                     <div>
                        <label htmlFor="groupName" className="block text-sm font-medium">Group Name</label>
                        <input id="groupName" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2 border rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="groupRules" className="block text-sm font-medium">Group Rules</label>
                        <textarea id="groupRules" value={rules} onChange={e => setRules(e.target.value)} rows={5} className="w-full mt-1 p-2 border rounded-md" />
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