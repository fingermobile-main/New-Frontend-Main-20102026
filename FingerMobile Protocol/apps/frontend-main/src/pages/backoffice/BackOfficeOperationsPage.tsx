/**
 * Back Office Operations Portal
 * Route: /backoffice/operations
 * Restricted administrative screen for Back Office staff departments & Executives
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  ShieldCheck,
  CheckCircle,
  FileCheck,
  CreditCard,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  UserCheck,
  Clock,
  ArrowRight,
  Lock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import sovereignRbacApi, { StaffRole, StaffAssignment } from '../../services/sovereignRbacApi';
import { usePlatformPrivilege } from '../../components/common/ExecutiveOnlyContent';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';

export const BackOfficeOperationsPage: React.FC = () => {
  const { isExecutive, userEmail } = usePlatformPrivilege();
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [assignments, setAssignments] = useState<StaffAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'queue' | 'staff' | 'settlement'>('queue');

  // Mock operational items for the Back Office queue
  const [queueItems] = useState([
    {
      id: 'KYC-8821',
      type: 'KYC Verification',
      user: 'elena_ross@protocol.fm',
      department: 'Trust & Compliance',
      status: 'Awaiting Document Review',
      priority: 'High',
      time: '12 mins ago'
    },
    {
      id: 'DISP-4019',
      type: 'Storefront Escrow Dispute',
      user: 'marcus_v@fingerlux.art',
      department: 'Customer Operations',
      status: 'Evidence Submitted',
      priority: 'Urgent',
      time: '28 mins ago'
    },
    {
      id: 'SETTL-1092',
      type: 'Payout Batch Settlement',
      user: 'crypto_vault_sg@treasury.fm',
      department: 'Treasury & Settlements',
      status: 'Ready for Authorization',
      priority: 'Standard',
      time: '1 hour ago'
    },
    {
      id: 'CAT-5510',
      type: 'Flagged Catalogue Item',
      user: 'store_operator_8@ownit.fm',
      department: 'Content & Stores',
      status: 'Trademark Review',
      priority: 'Medium',
      time: '3 hours ago'
    }
  ]);

  useEffect(() => {
    document.title = 'Back Office Operations Portal | FingerMobile Protocol';
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await sovereignRbacApi.getStaffDirectory();
      setRoles(data.roles);
      setAssignments(data.assignments);
    } catch (err) {
      console.error('Failed to load staff directory:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 font-sans w-full max-w-full overflow-x-hidden pb-28 md:pb-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Link to="/forum" className="hover:text-orange-600 transition">Forum Home</Link>
          <ChevronRight className="w-3 h-3 text-slate-500" />
          <span className="text-slate-900 font-extrabold flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            Back Office Operations
          </span>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400 text-[11px] font-black">
            Clearance Tier 1-5 Operational Enclave
          </span>
        </nav>

        {/* Ownership Banner */}
        <PlatformOwnershipCard />

        {/* Page Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2.5 rounded-xl bg-blue-100 text-blue-900 border border-blue-300">
                <Briefcase className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Back Office Staff Operations Portal
                </h1>
                <p className="text-xs text-slate-700 font-semibold mt-0.5">
                  Decentralized operations, merchant dispute resolution, identity KYC validation, and treasury payout settlements.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-700" />
              Refresh Queues
            </button>
            {isExecutive && (
              <Link
                to="/admin/users-permissions"
                className="px-4 py-2 text-xs font-black rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition flex items-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Staff Role Manager
              </Link>
            )}
          </div>
        </div>

        {/* Operational Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Pending KYC Audits</div>
            <div className="text-2xl font-black text-slate-900 mt-1">18 Cases</div>
            <div className="text-[11px] font-semibold text-emerald-800 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" /> 94% Biometric match rate
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Disputes</div>
            <div className="text-2xl font-black text-amber-900 mt-1">4 Tickets</div>
            <div className="text-[11px] font-semibold text-slate-700 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-600" /> Avg resolution: 1.4 hrs
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Settlement Batches</div>
            <div className="text-2xl font-black text-blue-900 mt-1">$482,900.00</div>
            <div className="text-[11px] font-semibold text-blue-800 mt-1 flex items-center gap-1">
              <CreditCard className="w-3 h-3 text-blue-600" /> Treasury liquidity active
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-300 shadow-sm">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Back Office Staff</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{assignments.length || 5} Officers</div>
            <div className="text-[11px] font-semibold text-slate-700 mt-1">
              Clearance Levels 1 through 5
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-300 bg-white rounded-t-xl px-4 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('queue')}
            className={`pb-3 text-xs font-black border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'queue'
                ? 'border-blue-600 text-blue-900'
                : 'border-transparent text-slate-700 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-4 h-4 text-blue-600" />
            Operational Queue (4 Items)
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`pb-3 text-xs font-black border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'staff'
                ? 'border-blue-600 text-blue-900'
                : 'border-transparent text-slate-700 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-slate-600" />
            Department Roles & Clearance
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'queue' && (
          <div className="bg-white rounded-b-xl border border-t-0 border-slate-300 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Live Adjudication & Processing Queue
              </span>
              <span className="text-xs text-slate-700 font-semibold">
                Authenticated Operator: <strong className="text-slate-900">{userEmail || 'Executive Office'}</strong>
              </span>
            </div>

            <div className="divide-y divide-slate-200">
              {queueItems.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="p-2 rounded-lg bg-blue-100 text-blue-900 border border-blue-300 shrink-0 mt-0.5">
                      <FileCheck className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-black text-slate-900">{item.id}</span>
                        <span className="font-bold text-xs text-slate-900">{item.type}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                          item.priority === 'Urgent'
                            ? 'bg-rose-100 text-rose-950 border-rose-300'
                            : item.priority === 'High'
                              ? 'bg-amber-100 text-amber-950 border-amber-300'
                              : 'bg-slate-100 text-slate-900 border-slate-300'
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                      <div className="text-xs text-slate-700 font-semibold mt-1">
                        Department: <span className="text-slate-900 font-bold">{item.department}</span> • Target: <span className="font-mono font-bold text-slate-800">{item.user}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <span className="text-xs font-bold text-slate-700">{item.status}</span>
                    <button
                      onClick={() => alert(`Opening adjudication workspace for case ${item.id}.`)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1 shadow-xs"
                    >
                      Process Case
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="bg-white rounded-b-xl border border-t-0 border-slate-300 p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900">Configured Back Office Operational Roles</h3>
              <p className="text-xs text-slate-700 font-semibold mt-0.5">
                Each role grants dedicated screen permissions, audit logging, and specific departmental oversight.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => (
                <div key={role.id} className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-950 border border-blue-400">
                      Clearance Level {role.clearance_level}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{role.department}</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{role.name}</h4>
                  <p className="text-xs text-slate-700 font-semibold leading-relaxed">{role.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
        <a
          href="/backoffice/operations"
          aria-label="Back Office Operations"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">🏢</span>
          <span>Ops</span>
        </a>
        <button
          onClick={() => { const input = document.querySelector('input[type="text"]') as HTMLInputElement; if (input) { input.focus(); input.scrollIntoView({ behavior: 'smooth' }); } }}
          aria-label="Search Tasks"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">🔍</span>
          <span>Search</span>
        </button>
        <button
          onClick={loadData}
          aria-label="Reload Back Office"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">🔄</span>
          <span>Sync</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to Top"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">⬆️</span>
          <span>Top</span>
        </button>
      </div>
    </div>
  );
};

export default BackOfficeOperationsPage;
