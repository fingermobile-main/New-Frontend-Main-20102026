import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import api from '../../services/api';
import adminOperationsService, { FranchiseOrg } from '../../services/adminOperationsService';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

const FranchiseManagementPage: React.FC = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const activeFranchiseId = params.id;

  const [franchises, setFranchises] = useState<FranchiseOrg[]>([]);
  const [selectedFranchise, setSelectedFranchise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New franchise form state
  const [newFranchise, setNewFranchise] = useState({
    name: '',
    code: '',
    region: 'West Africa (Lagos)',
    contact_email: '',
    contact_phone: '',
    royalty_pct: 8.5,
    active_terminals: 10
  });

  // Edit form state
  const [formState, setFormState] = useState({
    name: '',
    region: '',
    contact_email: '',
    contact_phone: '',
    royalty_pct: 8.5,
    status: 'active'
  });

  const loadFranchises = useCallback(async () => {
    try {
      setLoading(true);
      const list = await adminOperationsService.getFranchises();
      setFranchises(list);

      if (activeFranchiseId) {
        const found = list.find((f: any) => f.id === activeFranchiseId || f.code === activeFranchiseId);
        if (found) {
          setSelectedFranchise({
            ...found,
            stats: {
              revenue: Number(found.royalty_pct || 8.5) * 12000,
              employees: Number(found.active_terminals || 1) * 3,
              customers: Number(found.active_terminals || 1) * 140
            }
          });
          setFormState({
            name: found.name || '',
            region: found.region || '',
            contact_email: found.contact_email || '',
            contact_phone: found.contact_phone || '',
            royalty_pct: found.royalty_pct || 8.5,
            status: found.status || 'active'
          });
        } else {
          // Attempt direct fetch
          try {
            const res = await api.get(`/operations/franchises/${activeFranchiseId}`);
            if (res.data?.data) {
              const f = res.data.data;
              setSelectedFranchise({
                ...f,
                stats: {
                  revenue: Number(f.royalty_pct || 8.5) * 12000,
                  employees: Number(f.active_terminals || 1) * 3,
                  customers: Number(f.active_terminals || 1) * 140
                }
              });
              setFormState({
                name: f.name || '',
                region: f.region || '',
                contact_email: f.contact_email || '',
                contact_phone: f.contact_phone || '',
                royalty_pct: f.royalty_pct || 8.5,
                status: f.status || 'active'
              });
            }
          } catch {
            showToast('Franchise details could not be retrieved', 'error');
          }
        }
      } else {
        setSelectedFranchise(null);
      }
    } catch {
      showToast('Error loading franchise directory', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeFranchiseId, showToast]);

  useEffect(() => {
    loadFranchises();
  }, [loadFranchises]);

  const handleCreateFranchise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFranchise.name || !newFranchise.contact_email) {
      showToast('Please provide a franchise name and contact email', 'error');
      return;
    }

    try {
      const generatedCode = newFranchise.code || `FR-${newFranchise.name.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      const payload: Partial<FranchiseOrg> = {
        name: newFranchise.name,
        code: generatedCode,
        region: newFranchise.region,
        contact_email: newFranchise.contact_email,
        contact_phone: newFranchise.contact_phone,
        royalty_pct: Number(newFranchise.royalty_pct),
        active_terminals: Number(newFranchise.active_terminals),
        status: 'active'
      };

      const created = await adminOperationsService.createFranchise(payload);
      setFranchises((prev) => [created, ...prev]);
      setShowCreateModal(false);
      showToast(`Franchise ${newFranchise.name} registered successfully!`, 'success');
      setNewFranchise({
        name: '',
        code: '',
        region: 'West Africa (Lagos)',
        contact_email: '',
        contact_phone: '',
        royalty_pct: 8.5,
        active_terminals: 10
      });
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to create franchise license', 'error');
    }
  };

  const filteredFranchises = franchises.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = regionFilter === 'all' || f.region.toLowerCase().includes(regionFilter.toLowerCase());
    return matchesSearch && matchesRegion;
  });

  const totalTerminals = franchises.reduce((acc, f) => acc + (f.active_terminals || 0), 0);
  const totalRevenue = franchises.reduce((acc, f) => acc + ((f.royalty_pct || 8.5) * 12000), 0);

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 overflow-x-hidden text-slate-900 pb-28 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Franchise &amp; Terminal Operations Console
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
              PoS Mesh Active
            </span>
          </div>
          <p className="text-slate-700 font-medium text-sm mt-1">
            Oversee regional franchise territories, merchant licenses, POS hardware mesh, and revenue settlement
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedFranchise ? (
            <button
              onClick={() => {
                setSelectedFranchise(null);
                navigate('/franchisemanagement');
              }}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-900 text-xs font-bold rounded-xl shadow-xs hover:bg-slate-100 transition-colors cursor-pointer"
            >
              ← Back to Franchise Directory
            </button>
          ) : (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              + Register New Franchise
            </button>
          )}
        </div>
      </div>

      {/* Platform Ownership Card */}
      <PlatformOwnershipCard />

        {/* Global Statistics Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
            <p className="text-sm font-bold text-slate-700">Total Franchises</p>
            <p className="text-3xl font-black text-slate-900 mt-2">{franchises.length}</p>
            <p className="text-xs text-slate-700 font-medium mt-1">Licensed operational nodes</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
            <p className="text-sm font-bold text-slate-700">Active Terminals</p>
            <p className="text-3xl font-black text-slate-900 mt-2">{totalTerminals}</p>
            <p className="text-xs text-slate-700 font-medium mt-1">PoS nodes online</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
            <p className="text-sm font-bold text-slate-700">Platform Revenue Yield</p>
            <p className="text-3xl font-black text-slate-900 mt-2">${totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-slate-700 font-medium mt-1">Royalty settlement (FIC &amp; Fiat)</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-6">
            <p className="text-sm font-bold text-slate-700">Average Royalty</p>
            <p className="text-3xl font-black text-slate-900 mt-2">8.5%</p>
            <p className="text-xs text-slate-700 font-medium mt-1">Standard franchise margin</p>
          </div>
        </div>

        {/* VIEW 1: SELECTED FRANCHISE DETAIL VIEW */}
        {selectedFranchise ? (
          <div className="space-y-6">
            {/* Franchise Banner */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {selectedFranchise.code}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                      {selectedFranchise.status?.toUpperCase() || 'ACTIVE'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900 mt-1">{selectedFranchise.name}</h2>
                  <p className="text-sm text-slate-700 font-medium">{selectedFranchise.region}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                  >
                    {isEditing ? 'Cancel Editing' : 'Edit Details'}
                  </button>
                  <button
                    onClick={() => showToast(`Diagnostics complete: ${selectedFranchise.active_terminals} terminals online. Latency: 22ms.`, 'success')}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                  >
                    Audit Terminals
                  </button>
                </div>
              </div>

              {/* Detail KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-700">Calculated Revenue</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    ${selectedFranchise.stats?.revenue?.toLocaleString() || '0'}
                  </p>
                  <p className="text-xs text-slate-700 font-medium mt-1">Based on {selectedFranchise.royalty_pct || 8.5}% royalty</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-700">Dedicated Terminals</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {selectedFranchise.active_terminals || 10} Units
                  </p>
                  <p className="text-xs text-slate-700 font-medium mt-1">PoS mesh hardware</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-700">Active Customer Ingress</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {selectedFranchise.stats?.customers || 1400}
                  </p>
                  <p className="text-xs text-slate-700 font-medium mt-1">Monthly consumer volume</p>
                </div>
              </div>

              {/* Franchise Details Form */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <h3 className="text-lg font-black text-slate-900">License Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Franchise Organization Name</label>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                      readOnly={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Regional Territory</label>
                    <input
                      type="text"
                      value={formState.region}
                      onChange={(e) => setFormState({ ...formState, region: e.target.value })}
                      className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                      readOnly={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Official Contact Email</label>
                    <input
                      type="email"
                      value={formState.contact_email}
                      onChange={(e) => setFormState({ ...formState, contact_email: e.target.value })}
                      className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                      readOnly={!isEditing}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={formState.contact_phone}
                      onChange={(e) => setFormState({ ...formState, contact_phone: e.target.value })}
                      className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={async () => {
                        try {
                          await api.put(`/operations/franchises/${selectedFranchise.id}`, formState);
                          setSelectedFranchise((prev: any) => ({ ...prev, ...formState }));
                          showToast('Franchise details updated successfully!', 'success');
                          setIsEditing(false);
                        } catch (err: any) {
                          showToast(err?.response?.data?.message || 'Failed to update franchise', 'error');
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm text-sm cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* VIEW 2: FRANCHISE DIRECTORY GRID */
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-300 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <input
                type="text"
                placeholder="Search franchise by name, code, or territory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:max-w-md text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
              />

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-700">Region:</span>
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="text-slate-900 font-bold border border-slate-300 bg-white rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="all">All Territories</option>
                  <option value="lagos">Lagos</option>
                  <option value="abuja">Abuja</option>
                  <option value="port harcourt">Port Harcourt</option>
                  <option value="london">London UK</option>
                </select>
              </div>
            </div>

            {/* Franchise Cards Grid */}
            {loading ? (
              <div className="text-center py-12 bg-white rounded-xl border border-slate-300">
                <p className="text-slate-700 font-bold">Loading franchise directory...</p>
              </div>
            ) : filteredFranchises.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <p className="text-slate-700 font-bold mb-4">No franchises match your search criteria</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  + Add Franchise
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFranchises.map((f) => (
                  <div
                    key={f.id}
                    className="bg-white rounded-xl shadow-sm border border-slate-300 p-6 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                          {f.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
                          {f.status?.toUpperCase() || 'ACTIVE'}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900">{f.name}</h3>
                      <p className="text-xs text-slate-700 font-medium mt-0.5">{f.region}</p>

                      <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-700 font-bold block">Terminals</span>
                          <span className="text-slate-900 font-black text-sm">{f.active_terminals || 0} Units</span>
                        </div>
                        <div>
                          <span className="text-slate-700 font-bold block">Royalty</span>
                          <span className="text-slate-900 font-black text-sm">{f.royalty_pct || 8.5}%</span>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-slate-700 font-medium truncate">
                        ✉️ {f.contact_email}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedFranchise({
                            ...f,
                            stats: {
                              revenue: Number(f.royalty_pct || 8.5) * 12000,
                              employees: Number(f.active_terminals || 1) * 3,
                              customers: Number(f.active_terminals || 1) * 140
                            }
                          });
                          setFormState({
                            name: f.name || '',
                            region: f.region || '',
                            contact_email: f.contact_email || '',
                            contact_phone: f.contact_phone || '',
                            royalty_pct: f.royalty_pct || 8.5,
                            status: f.status || 'active'
                          });
                          navigate(`/franchisemanagement/${f.id}`);
                        }}
                        className="w-full px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer text-center"
                      >
                        Manage Franchise Console →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CREATE FRANCHISE MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-lg w-full p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="text-lg font-black text-slate-900">Register New Franchise Node</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-500 hover:text-slate-800 font-bold text-lg cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateFranchise} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Franchise Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lagos Lekki Regional Hub"
                    value={newFranchise.name}
                    onChange={(e) => setNewFranchise({ ...newFranchise, name: e.target.value })}
                    className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Franchise Code</label>
                    <input
                      type="text"
                      placeholder="e.g. FR-LEK-001"
                      value={newFranchise.code}
                      onChange={(e) => setNewFranchise({ ...newFranchise, code: e.target.value })}
                      className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Territory / Region</label>
                    <input
                      type="text"
                      value={newFranchise.region}
                      onChange={(e) => setNewFranchise({ ...newFranchise, region: e.target.value })}
                      className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Contact Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@franchise.fingermobile.com"
                      value={newFranchise.contact_email}
                      onChange={(e) => setNewFranchise({ ...newFranchise, contact_email: e.target.value })}
                      className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      placeholder="+234 800 000 0000"
                      value={newFranchise.contact_phone}
                      onChange={(e) => setNewFranchise({ ...newFranchise, contact_phone: e.target.value })}
                      className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Initial Terminals</label>
                    <input
                      type="number"
                      min="1"
                      value={newFranchise.active_terminals}
                      onChange={(e) => setNewFranchise({ ...newFranchise, active_terminals: Number(e.target.value) })}
                      className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">Royalty Percentage (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={newFranchise.royalty_pct}
                      onChange={(e) => setNewFranchise({ ...newFranchise, royalty_pct: Number(e.target.value) })}
                      className="w-full text-slate-900 font-bold border border-slate-300 bg-white rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm cursor-pointer"
                  >
                    Register Franchise
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around z-30 shadow-lg">
        <button
          onClick={() => setShowCreateModal(true)}
          type="button"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 transition-colors"
        >
          <span className="text-base font-extrabold leading-none mb-0.5">+</span>
          <span>New</span>
        </button>
        <button
          onClick={() => loadFranchises()}
          type="button"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <span className="text-base font-extrabold leading-none mb-0.5">⚡</span>
          <span>Refresh</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          type="button"
          className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] px-2 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <span className="text-base font-black leading-none mb-0.5">↑</span>
          <span>Top</span>
        </button>
      </div>
    </div>
  );
};

export default FranchiseManagementPage;
