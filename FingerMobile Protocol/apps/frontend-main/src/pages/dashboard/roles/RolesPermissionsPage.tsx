import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import { CollaboratorsTable } from '../../../components/dashboard/roles/CollaboratorsTable';
import rolesPermissionsService from '../../../services/rolesPermissionsService';
import { Collaborator, CollaboratorSeatPlan, RoleDetail } from '../../../types/roles-permissions';
import { useAuth } from '../../../contexts/AuthContext';
import { getUserRoleTier, getUserRoleBadge } from '../../../services/platformRbac';
import { Shield, Users, Lock, Building2, Sparkles, Sliders, CheckCircle, CreditCard, X } from 'lucide-react';
import PlatformOwnershipCard from '../../../components/dashboard/PlatformOwnershipCard';

export const RolesPermissionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleTier = getUserRoleTier(user);
  const roleBadge = getUserRoleBadge(user);

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [seats, setSeats] = useState<CollaboratorSeatPlan>({
    totalSeats: 10,
    usedSeats: 5,
    availableSeats: 5,
    canUpgrade: true,
  });
  const [availableRoles, setAvailableRoles] = useState<RoleDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [seatsToAdd, setSeatsToAdd] = useState(5);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [collabRes, rolesRes] = await Promise.all([
        rolesPermissionsService.getCollaborators(),
        rolesPermissionsService.getRoles(),
      ]);
      setCollaborators(collabRes.collaborators);
      setSeats(collabRes.seats);
      setAvailableRoles(rolesRes.roles);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvite = async (data: any) => {
    await rolesPermissionsService.inviteCollaborator(data);
    await fetchData();
  };

  const handleRemove = async (id: string) => {
    await rolesPermissionsService.removeCollaborator(id);
    await fetchData();
  };

  const handleUpdateRoles = async (id: string, roleIds: string[]) => {
    await rolesPermissionsService.updateCollaboratorRoles(id, roleIds);
    await fetchData();
  };

  const handleUpdateLocations = async (id: string, data: any) => {
    await rolesPermissionsService.updateCollaboratorLocations(id, data);
    await fetchData();
  };

  const handleUpgradePlan = () => {
    setIsUpgradeModalOpen(true);
  };

  const handleConfirmUpgrade = () => {
    setSeats((prev) => ({
      ...prev,
      totalSeats: prev.totalSeats + seatsToAdd,
      availableSeats: prev.availableSeats + seatsToAdd,
    }));
    setIsUpgradeModalOpen(false);
    setUpgradeSuccess(`Successfully upgraded! Added ${seatsToAdd} collaborator seats to sovereign ledger.`);
    setTimeout(() => setUpgradeSuccess(null), 5000);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Upgrade Success Notification */}
        {upgradeSuccess && (
          <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-950 font-bold shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-800" />
              <span>{upgradeSuccess}</span>
            </div>
            <button type="button" onClick={() => setUpgradeSuccess(null)} className="text-emerald-900 font-black">✕</button>
          </div>
        )}

        {/* Sovereign Platform Ownership Proof */}
        <PlatformOwnershipCard />

        {/* Sovereign RBAC Navigation Bar */}
        <div className="bg-white border border-slate-300 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-100 text-slate-900 border border-slate-300">
                <Shield className="w-3.5 h-3.5 text-blue-700" />
                Access & Security Governance
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${roleBadge.badgeColor}`}>
                {roleBadge.label}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Roles & Collaborators Governance
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
              Assign seat plans, invite team members, and orchestrate platform permissions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate('/settings-hub')}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-700" />
              Settings Hub
            </button>
            <button
              onClick={() => navigate('/settings/roles-permissions/manage-roles')}
              className="px-3.5 py-2 text-xs font-bold rounded-xl border border-blue-400 bg-blue-50 hover:bg-blue-100 text-blue-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Shield className="w-3.5 h-3.5 text-blue-800" />
              Manage Role Definitions
            </button>
          </div>
        </div>

        {/* Quick Nav Tabs to All Sovereign Consoles */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-300">
          <button
            type="button"
            aria-label={`Collaborator Seats (${collaborators.length})`}
            onClick={(e) => { e.stopPropagation(); }}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-white shadow-sm flex items-center gap-2 whitespace-nowrap cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Collaborator Seats ({collaborators.length})</span>
          </button>
          <button
            onClick={() => navigate('/admin/users-permissions')}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer"
          >
            <Shield className="w-4 h-4 text-orange-600" />
            <span>Users Permission Matrix</span>
          </button>
          <button
            onClick={() => navigate('/admin/pages-permissions')}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4 text-purple-600" />
            <span>Pages Permission Directory (385)</span>
          </button>
          <button
            onClick={() => navigate('/admin/creators-console')}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-pink-600" />
            <span>Content Creators Hive</span>
          </button>
          <button
            onClick={() => navigate('/admin/business-console')}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Business & Orgs Console</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white border border-slate-300 rounded-2xl">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <CollaboratorsTable
            collaborators={collaborators}
            seats={seats}
            availableRoles={availableRoles}
            onInvite={handleInvite}
            onRemove={handleRemove}
            onUpdateRoles={handleUpdateRoles}
            onUpdateLocations={handleUpdateLocations}
            onUpgradePlan={handleUpgradePlan}
            onNavigateToManageRoles={() => navigate('/settings/roles-permissions/manage-roles')}
          />
        )}

        {/* Upgrade Collaborator Seat Pack Modal */}
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white border border-slate-300 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-700" />
                  <h3 className="text-lg font-black text-slate-900">Upgrade Collaborator Seats</h3>
                </div>
                <button type="button" aria-label="Close"
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="text-slate-500 hover:text-slate-900 font-bold"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-700">
                  Select an additional collaborator seat tier pack. Expanded seats are provisioned immediately across all organization branches.
                </p>

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  {[
                    { seats: 5, price: '$49/mo' },
                    { seats: 10, price: '$89/mo' },
                    { seats: 25, price: '$199/mo' }
                  ].map((tier) => (
                    <button
                      key={tier.seats}
                      type="button"
                      onClick={() => setSeatsToAdd(tier.seats)}
                      className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        seatsToAdd === tier.seats
                          ? 'border-blue-600 bg-blue-50 text-blue-950 font-black shadow-xs'
                          : 'border-slate-300 hover:border-slate-400 bg-white text-slate-800 font-bold'
                      }`}
                    >
                      <p className="text-lg font-black">+{tier.seats}</p>
                      <p className="text-[11px] font-semibold text-slate-600 mt-0.5">{tier.price}</p>
                    </button>
                  ))}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-800 font-bold">
                    <span>Current Active Capacity:</span>
                    <span className="text-slate-900 font-black">{seats.totalSeats} seats</span>
                  </div>
                  <div className="flex justify-between text-slate-800 font-bold">
                    <span>Capacity After Upgrade:</span>
                    <span className="text-blue-700 font-black">{seats.totalSeats + seatsToAdd} seats</span>
                  </div>
                  <div className="flex justify-between text-slate-800 font-bold">
                    <span>Settlement Account:</span>
                    <span className="text-slate-900 font-mono font-bold">Sovereign Billing Ledger</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmUpgrade}
                  className="px-5 py-2.5 text-xs font-black rounded-xl bg-blue-700 hover:bg-blue-800 text-white shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  Confirm Seat Upgrade (+{seatsToAdd})
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default RolesPermissionsPage;
