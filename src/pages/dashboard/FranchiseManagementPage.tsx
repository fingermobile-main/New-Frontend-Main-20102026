import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import type { Franchise } from '../../types';
import AnimatedAvatar from '../../components/AnimatedAvatar';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const FranchiseManagementPage: React.FC = () => {
  const { franchises } = useAppContext();
  const franchiseId = useParams<{ id: string }>().id;
  const [franchise, setFranchise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFranchise = async () => {
      try {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockFranchise = {
          id: franchiseId,
          name: 'Sample Franchise',
          location: 'Sample Location',
          owner: 'Sample Owner',
          stats: {
            revenue: 100000,
            employees: 15,
            customers: 500
          }
        };
        setFranchise(mockFranchise);
      } catch (err) {
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
        <h2 className="text-xl font-semibold mb-4">Franchise Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              defaultValue={franchise.name || ''}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              readOnly />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              defaultValue={franchise.location || ''}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              readOnly />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Owner</label>
            <input
              type="text"
              defaultValue={franchise.owner || ''}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              readOnly />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="flex space-x-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Edit Details
          </button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            View Reports
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Close Franchise
          </button>
        </div>
      </div>
    </div>
  );
};

export default FranchiseManagementPage;
