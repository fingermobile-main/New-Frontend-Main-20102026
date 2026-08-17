import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import apiService, { ApiService } from '../../services/apiService';
import { MOCK_PLATFORM_ROLES } from '../../constants';



const RoleManagementPage: React.FC = () => {
    const { showToast } = useAppContext();
    const [roles, setRoles] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoading(true);
                // Using mock data for now
                setRoles(MOCK_PLATFORM_ROLES as any);
            } catch (err) {
                setError('Failed to fetch roles.');
                console.error('Error fetching roles:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading roles...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Role Management</h1>
                 <button className="px-4 py-2 text-sm font-semibold bg-brand-blue text-white rounded-full">
                    + Create New Role
                </button>
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-sm">Role Title</th>
                            <th className="p-4 font-semibold text-sm">Responsibility</th>
                            <th className="p-4 font-semibold text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => (
                            <tr key={role.id} className="border-b last:border-b-0 hover:bg-gray-50">
                                <td className="p-4 font-semibold">{role.title}</td>
                                <td className="p-4 text-sm text-gray-600">{role.responsibility}</td>
                                <td className="p-4 text-sm text-right">
                                    <button className="text-blue-600 hover:underline font-medium">Edit Permissions</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RoleManagementPage;
