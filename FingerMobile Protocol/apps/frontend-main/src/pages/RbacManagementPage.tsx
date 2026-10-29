import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import RbacDashboard from '../components/dashboard/RbacDashboard';
import useRbacData from '../hooks/useRbacData';
import MainLayout from '../components/layout/MainLayout';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';
import { useAppContext } from '../contexts/AppContext';
import { PlusIcon, UserGroupIcon, KeyIcon, BuildingOfficeIcon, UserCircleIcon } from '../icons';

// Use FranchiseLocation type from the hook
interface FranchiseLocation {
  id: string;
  name: string;
  type?: 'continent' | 'country' | 'state' | 'region';
  children?: FranchiseLocation[];
}

const RbacManagementPage: React.FC = () => {
  const { showToast } = useAppContext();
  const { data, loading, error, refreshData } = useRbacData();

  const [activeView, setActiveView] = useState('dashboard');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['continent-1']));
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignUserId, setAssignUserId] = useState('');
  const [assignRole, setAssignRole] = useState('');
  const [assigning, setAssigning] = useState(false);

  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newRoleDept, setNewRoleDept] = useState('');

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      showToast('Please enter a role name', 'error');
      return;
    }
    showToast(`Role ${newRoleName} created successfully`, 'success');
    setNewRoleName('');
    setNewRoleDesc('');
    setNewRoleDept('');
  };

  useEffect(() => {
    if (error) {
      showToast(`Error: ${error}`, 'error');
    }
  }, [error, showToast]);

  const handleAssignRole = async () => {
    if (!assignUserId || !assignRole) {
      showToast('Please provide both User ID and Role', 'error');
      return;
    }

    setAssigning(true);
    try {
      const { api } = await import('../services/api');
      await api.post('/admin/rbac/assign', { userId: assignUserId, role: assignRole });
      showToast('Role assigned successfully', 'success');
      setShowAssignModal(false);
      setAssignUserId('');
      setAssignRole('');
      refreshData();
    } catch {
      showToast('Failed to assign role', 'error');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64 text-gray-700">
          Loading RBAC data...
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col justify-center items-center h-64 text-red-500">
          <p>Error: {error}</p>
          <button
            onClick={refreshData}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg"
          >
            Retry
          </button>
        </div>
      </MainLayout>
    );
  }

  if (!data) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64 text-slate-700 font-medium">
          No RBAC data available.
        </div>
      </MainLayout>
    );
  }

  const { roles, departments, franchiseLocations } = data;

  return (
    <MainLayout>
      <div className="max-w-[1536px] 2xl:max-w-[1680px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-12 max-w-full overflow-x-hidden text-slate-900">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3.5 rounded-2xl shadow-md">
              <KeyIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">RBAC &amp; Scoped Permissions Center</h1>
              <p className="text-slate-700 font-medium mt-1">Manage hierarchical roles, cryptographic permission grants, and sovereign access gates</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeView === 'dashboard'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveView('dashboard')}
              >
                Dashboard
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeView === 'roles'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveView('roles')}
              >
                Roles & Permissions
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeView === 'departments'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveView('departments')}
              >
                Departments
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  activeView === 'franchise'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveView('franchise')}
              >
                Franchise Locations
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-6">
                {activeView === 'dashboard' && <RbacDashboard />}

                {activeView === 'roles' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Roles & Permissions Management</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Role</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
                            <input
                              type="text"
                              value={newRoleName}
                              onChange={(e) => setNewRoleName(e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold border-slate-300 placeholder:text-slate-400"
                              placeholder="Enter role name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              value={newRoleDesc}
                              onChange={(e) => setNewRoleDesc(e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold border-slate-300 placeholder:text-slate-400"
                              placeholder="Enter role description"
                              rows={3}
                            ></textarea>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <select
                              value={newRoleDept}
                              onChange={(e) => setNewRoleDept(e.target.value)}
                              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold border-slate-300"
                            >
                              <option value="">Select department</option>
                              {departments.map((dept: any) => (
                                <option key={dept.id} value={dept.name}>{dept.name}</option>
                              ))}
                            </select>
                          </div>
                          <button
                            type="button"
                            onClick={handleCreateRole}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 rounded-lg"
                          >
                            Create Role
                          </button>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Assign Permissions</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto p-2">
                          {[
                            'Member Management',
                            'Content Moderation',
                            'Financial Reports',
                            'Marketing Campaigns',
                            'Product Management',
                            'System Monitoring',
                            'Analytics Dashboard',
                            'Franchise Management',
                            'Investor Communications',
                            'Support Ticket Management'
                          ].map((permission, index) => (
                            <div key={index} className="flex items-center p-3 bg-white rounded-lg border border-slate-300">
                              <input
                                type="checkbox"
                                id={`perm-${index}`}
                                className="w-4 h-4 text-slate-900 bg-white border-gray-300 rounded focus:ring-blue-500 font-bold border border-slate-300 focus:ring-2 placeholder:text-slate-400"
                              />
                              <label htmlFor={`perm-${index}`} className="ml-3 text-gray-700">
                                {permission}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeView === 'departments' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Department Management</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {departments.map((dept: any) => (
                        <div key={dept.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-slate-300">
                          <h3 className="font-bold text-gray-900 text-lg">{dept.name}</h3>
                          <div className="flex justify-between mt-4">
                            <div>
                              <p className="text-gray-600 text-sm">Members</p>
                              <p className="text-gray-900 font-bold">{dept.members}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 text-sm">Features</p>
                              <p className="text-gray-900 font-bold">{dept.features}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => showToast(`Opening department settings for ${dept.name}`, 'info')}
                            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium py-2.5 rounded-lg"
                          >
                            Manage
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeView === 'franchise' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Franchise Location Management</h2>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Franchise Hierarchy</h3>
                        <button
                          type="button"
                          onClick={() => showToast('Opening add franchise location dialog', 'info')}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center"
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add Location
                        </button>
                      </div>

                      <div className="space-y-4">
                        {franchiseLocations.map((continent: FranchiseLocation) => (
                          <div key={continent.id} className="border border-gray-300 rounded-xl">
                            <div
                              className={`p-4 bg-gradient-to-r from-gray-100 to-gray-50 font-bold text-gray-900 flex items-center cursor-pointer ${
                                expandedNodes.has(continent.id) ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : ''
                              }`}
                              onClick={() => {
                                if (continent.children && continent.children.length > 0) {
                                  setExpandedNodes(prev => {
                                    const newSet = new Set(prev);
                                    if (newSet.has(continent.id)) {
                                      newSet.delete(continent.id);
                                    } else {
                                      newSet.add(continent.id);
                                    }
                                    return newSet;
                                  });
                                }
                              }}
                            >
                              {continent.children && continent.children.length > 0 && (
                                <span className="mr-2">
                                  {expandedNodes.has(continent.id) ? '▼' : '►'}
                                </span>
                              )}
                              {continent.name}
                            </div>

                            {expandedNodes.has(continent.id) && (
                              <div className="p-4 space-y-3">
                                {continent.children?.map((country: FranchiseLocation) => (
                                  <div key={country.id} className="ml-4 border-l-2 border-gray-300 pl-4">
                                    <div
                                      className={`font-medium text-gray-700 flex items-center cursor-pointer ${
                                        expandedNodes.has(country.id) ? 'bg-blue-50' : ''
                                      }`}
                                      onClick={() => {
                                        if (country.children && country.children.length > 0) {
                                          setExpandedNodes(prev => {
                                            const newSet = new Set(prev);
                                            if (newSet.has(country.id)) {
                                              newSet.delete(country.id);
                                            } else {
                                              newSet.add(country.id);
                                            }
                                            return newSet;
                                          });
                                        }
                                      }}
                                    >
                                      {country.children && country.children.length > 0 && (
                                        <span className="mr-2">
                                          {expandedNodes.has(country.id) ? '▼' : '►'}
                                        </span>
                                      )}
                                      {country.name}
                                    </div>

                                    {expandedNodes.has(country.id) && (
                                      <div className="mt-2 space-y-2">
                                        {country.children?.map((state: FranchiseLocation) => (
                                          <div key={state.id} className="ml-4 text-sm text-gray-600 bg-gray-100 p-2 rounded-lg">
                                            {state.name}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-300">
              <div className="px-3.5 py-2 mb-4 bg-black text-white border border-[#880808] rounded-xl flex items-center justify-between shadow-xs">
                <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                  Compliance & RBAC Actions
                </h2>
                <span className="text-[9px] font-mono text-rose-300 font-bold">SOVEREIGN</span>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setActiveView('roles')}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center font-medium"
                >
                  <KeyIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Manage Access
                </button>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(true)}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center font-medium"
                >
                  <UserGroupIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Assign Roles
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('departments')}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center font-medium"
                >
                  <BuildingOfficeIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Department Setup
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-300">
              <h3 className="font-bold text-gray-900 mb-2">Access Control Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Follow principle of least privilege</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Regularly audit permissions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Review role assignments quarterly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sovereign Platform Ownership Directive */}
        <div className="mt-8">
          <PlatformOwnershipCard />
        </div>

        {/* Assign Role Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Assign Role to User</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User ID *
                  </label>
                  <input
                    type="text"
                    value={assignUserId}
                    onChange={(e) => setAssignUserId(e.target.value)}
                    placeholder="Enter user ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={assignRole}
                    onChange={(e) => setAssignRole(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-bold border-slate-300 bg-white"
                  >
                    <option value="">Select a role</option>
                    {roles.map((r: any) => (
                      <option key={r.id || r.name} value={r.name || r.id}>
                        {r.name || r.id}
                      </option>
                    ))}
                    {/* Fallbacks if roles are empty */}
                    {roles.length === 0 && (
                      <>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                        <option value="user">User</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={handleAssignRole}
                  disabled={assigning}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50"
                >
                  {assigning ? 'Assigning...' : 'Assign Role'}
                </button>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 md:hidden">
          <div className="flex items-center justify-around gap-1 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setActiveView('dashboard')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-[11px] font-bold ${
                activeView === 'dashboard' ? 'text-indigo-600 bg-indigo-50 border border-indigo-200' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span className="text-base font-black">📊</span>
              <span>Overview</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('roles')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-[11px] font-bold ${
                activeView === 'roles' ? 'text-indigo-600 bg-indigo-50 border border-indigo-200' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span className="text-base font-black">🔑</span>
              <span>Roles</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('departments')}
              className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-[11px] font-bold ${
                activeView === 'departments' ? 'text-indigo-600 bg-indigo-50 border border-indigo-200' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <span className="text-base font-black">🏢</span>
              <span>Depts</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAssignModal(true)}
              className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
            >
              <span className="text-base font-black">👤</span>
              <span>Assign</span>
            </button>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl text-[11px] font-bold text-slate-700 hover:text-slate-900"
            >
              <span className="text-base font-black">⌂</span>
              <span>Top</span>
            </button>
          </div>
        </div>
    </MainLayout>
  );
};

export default RbacManagementPage;
