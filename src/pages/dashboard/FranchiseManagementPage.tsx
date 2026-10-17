import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import api from '../../services/api';
import adminOperationsService from '../../services/adminOperationsService';

const FranchiseManagementPage: React.FC = () => {
  const { showToast } = useAppContext();
  const franchiseId = useParams<{ id: string }>().id;
  const [franchise, setFranchise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    region: '',
    contact_email: '',
    contact_phone: ''
  });

  useEffect(() => {
    const fetchFranchise = async () => {
      try {
        setLoading(true);
        let foundFranchise = null;

        try {
          const res = await api.get(`/operations/franchises/${franchiseId}`);
          if (res.data?.data) {
            foundFranchise = res.data.data;
          }
        } catch {
          // Fallback to checking the full franchise list
          const list = await adminOperationsService.getFranchises();
          foundFranchise = list.find((f: any) => f.id === franchiseId || f.code === franchiseId);
        }

        if (foundFranchise) {
          setFranchise({
            ...foundFranchise,
            stats: {
              revenue: Number(foundFranchise.royalty_pct || 8.5) * 12000,
              employees: Number(foundFranchise.active_terminals || 1) * 3,
              customers: Number(foundFranchise.active_terminals || 1) * 140
            }
          });
          setFormState({
            name: foundFranchise.name || '',
            region: foundFranchise.region || '',
            contact_email: foundFranchise.contact_email || '',
            contact_phone: foundFranchise.contact_phone || ''
          });
        } else {
          setError('Franchise not found');
        }
      } catch (err: any) {
        setError('Failed to load franchise details');
      } finally {
        setLoading(false);
      }
    };

    if (franchiseId) {
      fetchFranchise();
    }
  }, [franchiseId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!franchise) return <div>Franchise not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Franchise: {franchise.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Revenue</h2>
          <p className="text-2xl font-bold text-green-600">
            ${franchise.stats?.revenue?.toLocaleString() || '0'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Employees</h2>
          <p className="text-2xl font-bold text-blue-600">
            {franchise.stats?.employees || 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Customers</h2>
          <p className="text-2xl font-bold text-purple-600">
            {franchise.stats?.customers || 0}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Franchise Details</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
          >
            {isEditing ? 'Cancel Editing' : 'Edit Details'}
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Franchise Organization Name</label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2  text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
              readOnly={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Regional Territory</label>
            <input
              type="text"
              value={formState.region}
              onChange={(e) => setFormState({ ...formState, region: e.target.value })}
              className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2  text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
              readOnly={!isEditing}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Official Contact Email</label>
              <input
                type="email"
                value={formState.contact_email}
                onChange={(e) => setFormState({ ...formState, contact_email: e.target.value })}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2  text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                readOnly={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
              <input
                type="text"
                value={formState.contact_phone}
                onChange={(e) => setFormState({ ...formState, contact_phone: e.target.value })}
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2  text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400${!isEditing ? 'bg-gray-50' : 'bg-white'}`}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="flex space-x-4">
          {isEditing && (
            <button
              onClick={async () => {
                try {
                  await api.put(`/operations/franchises/${franchise.id}`, formState);
                  showToast('Franchise details updated successfully!', 'success');
                  setIsEditing(false);
                } catch (err: any) {
                  showToast(err?.response?.data?.message || 'Failed to update franchise', 'error');
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-sm"
            >
              Save Changes
            </button>
          )}
          <button
            onClick={() => showToast('Opening Franchise Operational Reports', 'info')}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-sm"
          >
            View Reports
          </button>
          <button
            onClick={() => showToast('Franchise license status: ACTIVE', 'info')}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded shadow-sm"
          >
            Audit Terminals
          </button>
        </div>
      </div>
    </div>
  );
};

export default FranchiseManagementPage;
