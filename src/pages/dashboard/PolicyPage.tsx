import React from 'react';

import { useAppContext } from '../../contexts/AppContext';
import type { MemberPolicy } from '../../types';
import PolicyEditorModal from '../../components/PolicyEditorModal';

const PolicyPage: React.FC = () => {
    const { policies, handleSavePolicy, handlePublishPolicy } = useAppContext();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingPolicy, setEditingPolicy] = React.useState<any | null>(null);

    const openCreateModal = () => {
        setEditingPolicy(null);
        setIsModalOpen(true);
    };

    const openEditModal = (policy: MemberPolicy) => {
        setEditingPolicy(policy);
        setIsModalOpen(true);
    };

    return (
        <div>
            {isModalOpen && (
                <PolicyEditorModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    policyType={editingPolicy?.type || 'general'}
                    currentPolicy={editingPolicy?.content || ''}
                    onSave={(content) => handleSavePolicy?.({ ...editingPolicy, content })}
                />
            )}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Policy Management</h1>
                <button
                    onClick={openCreateModal}
                    className="px-4 py-2 text-sm font-semibold bg-brand-blue text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                >
                    Create New Policy
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-sm">Title</th>
                            <th className="p-4 font-semibold text-sm">Version</th>
                            <th className="p-4 font-semibold text-sm">Status</th>
                            <th className="p-4 font-semibold text-sm">Last Updated</th>
                            <th className="p-4 font-semibold text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(policies || []).map((policy: MemberPolicy) => (
                            <tr key={policy.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                                <td className="p-4 font-semibold">{policy.title}</td>
                                <td className="p-4 text-sm">{policy.version}</td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${policy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {policy.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm">{policy.lastUpdated}</td>
                                <td className="p-4 text-sm text-right space-x-2">
                                    <button onClick={() => openEditModal(policy)} className="text-blue-600 hover:underline font-medium">Edit</button>
                                    {policy.status === 'expired' && (
                                        <button onClick={() => handlePublishPolicy?.(policy.id)} className="text-green-600 hover:underline font-medium">Renew</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PolicyPage;
