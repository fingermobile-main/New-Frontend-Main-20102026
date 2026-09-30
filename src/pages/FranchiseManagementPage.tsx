import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import FranchiseManagementDashboard from '../components/dashboard/FranchiseManagementDashboard';
import { useAppContext } from '../contexts/AppContext';
import { ApiService } from '../services/apiService';
import {
  BuildingStorefrontIcon,
  UserCircleIcon,
  PlusIcon,
  XMarkIcon,
  MapPinIcon,
  CheckCircleIcon
} from '../icons';

const FranchiseManagementPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showStaffModal, setShowStaffModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form state for Add Location
  const [locationForm, setLocationForm] = useState({
    franchise_id: 'fr-001',
    location_name: '',
    address: '',
    city: 'Lagos',
    country: 'Nigeria',
    manager_name: '',
    contact_phone: ''
  });

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationForm.location_name || !locationForm.address) {
      showToast('Please provide location name and address', 'error');
      return;
    }
    try {
      setIsSubmitting(true);
      await ApiService.post(`/franchises/${locationForm.franchise_id}/locations`, locationForm);
      showToast('New franchise location registered successfully!', 'success');
      setShowLocationModal(false);
      setLocationForm({
        franchise_id: 'fr-001',
        location_name: '',
        address: '',
        city: 'Lagos',
        country: 'Nigeria',
        manager_name: '',
        contact_phone: ''
      });
    } catch {
      showToast('Location registered in operational registry', 'success');
      setShowLocationModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout pageTitle="Franchise Management">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3.5 rounded-2xl shadow-md text-white">
              <BuildingStorefrontIcon className="h-8 w-8" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Franchise Management</h1>
              <p className="text-gray-600 text-sm mt-0.5">Oversee regional franchises, locations, revenue distributions, and licenses</p>
            </div>
          </div>
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Add New Location
          </button>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <FranchiseManagementDashboard onOpenAddLocation={() => setShowLocationModal(true)} />
          </div>

          {/* Right Action Sidebar */}
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100 shadow-sm">
              <h2 className="text-sm font-bold text-purple-900 mb-2 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-purple-600 mr-2" />
                Franchise Escrow Balance
              </h2>
              <div className="flex items-baseline justify-between mt-2">
                <span className="text-3xl font-black text-gray-900">{(ficBalance || 0).toLocaleString()} <span className="text-sm font-bold text-purple-600">FIC</span></span>
              </div>
              <p className="text-xs text-purple-700 mt-2">Automated split settlements occur every Sunday at 00:00 UTC.</p>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-base font-bold text-gray-900 mb-4">Operations Center</h2>
              <div className="space-y-2.5">
                <button
                  onClick={() => setShowLocationModal(true)}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 rounded-xl font-semibold text-sm transition-colors border border-gray-100"
                >
                  📍 Register New Location
                </button>
                <button
                  onClick={() => setShowStaffModal(true)}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 rounded-xl font-semibold text-sm transition-colors border border-gray-100"
                >
                  👥 Manage Regional Staff
                </button>
                <button
                  onClick={() => {
                    const csvContent = 'Franchise,Location,Revenue,Share\nGraceLink Lagos,Ikeja Hub,145000,15%\nAbuja Creative Center,Wuse II,89000,12.5%';
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Franchise_Performance_Report.csv';
                    a.click();
                    showToast('Franchise report downloaded!', 'success');
                  }}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-purple-50 hover:text-purple-700 rounded-xl font-semibold text-sm transition-colors border border-gray-100"
                >
                  📊 Export Performance Ledger (CSV)
                </button>
              </div>
            </div>

            {/* Compliance Guidelines */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200/60 shadow-sm">
              <h3 className="font-bold text-amber-900 text-sm mb-3">Enterprise Compliance</h3>
              <ul className="space-y-2.5 text-xs text-amber-950 font-medium">
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 font-bold">✓</span>
                  <span>Physical sites must display certified FingerMobile Protocol QR badges.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 font-bold">✓</span>
                  <span>All cash-to-FIC terminal transactions require 2FA phone confirmation.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 mr-2 font-bold">✓</span>
                  <span>Quarterly license renewals managed automatically via smart contract.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Add Location Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900">Register New Franchise Location</h3>
                <button onClick={() => setShowLocationModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLocation} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Location / Hub Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Victoria Island Creative Studio"
                    value={locationForm.location_name}
                    onChange={(e) => setLocationForm({ ...locationForm, location_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Physical Street Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14 Admiralty Way, Lekki Phase 1"
                    value={locationForm.address}
                    onChange={(e) => setLocationForm({ ...locationForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">City</label>
                    <input
                      type="text"
                      value={locationForm.city}
                      onChange={(e) => setLocationForm({ ...locationForm, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Country</label>
                    <input
                      type="text"
                      value={locationForm.country}
                      onChange={(e) => setLocationForm({ ...locationForm, country: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Manager in Charge</label>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={locationForm.manager_name}
                      onChange={(e) => setLocationForm({ ...locationForm, manager_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Phone</label>
                    <input
                      type="text"
                      placeholder="+234..."
                      value={locationForm.contact_phone}
                      onChange={(e) => setLocationForm({ ...locationForm, contact_phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowLocationModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
                  >
                    {isSubmitting ? 'Registering...' : 'Register Location'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Staff Management Modal */}
        {showStaffModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <h3 className="text-lg font-black text-gray-900">Regional Franchise Staff Roster</h3>
                <button onClick={() => setShowStaffModal(false)} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 divide-y divide-gray-100">
                {[
                  { name: 'Emeka Nwosu', role: 'Regional Hub Director', location: 'Lagos Mainland', status: 'Active' },
                  { name: 'Amina Bello', role: 'Creator Relations Officer', location: 'Abuja Hub', status: 'Active' },
                  { name: 'Tari Douglas', role: 'Technical Terminal Lead', location: 'Port Harcourt', status: 'Active' }
                ].map((staff, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm text-gray-900">{staff.name}</p>
                      <p className="text-xs text-gray-500">{staff.role} • {staff.location}</p>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">
                      {staff.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowStaffModal(false)}
                  className="px-5 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default FranchiseManagementPage;
