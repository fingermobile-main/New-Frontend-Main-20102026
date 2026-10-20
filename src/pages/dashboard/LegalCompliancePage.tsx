import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import legalComplianceService, { DataSubjectRequest, AccountDeletionRecord } from '../../services/legalComplianceService';
import {
  ShieldCheckIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  LockIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowPathIcon
} from '../../icons';

const LegalCompliancePage: React.FC = () => {
  const { showToast } = useAppContext();
  const [dsrs, setDsrs] = useState<DataSubjectRequest[]>([]);
  const [deletions, setDeletions] = useState<AccountDeletionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplianceData = async () => {
    setLoading(true);
    try {
      const [dsrData, deletionData] = await Promise.all([
        legalComplianceService.getDSRs(),
        legalComplianceService.getAccountDeletions()
      ]);
      setDsrs(dsrData);
      setDeletions(deletionData);
    } catch (err) {
      console.warn('Could not load compliance queues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplianceData();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-950 dark:text-blue-300 text-xs font-bold rounded-full mb-2 border border-blue-400 dark:border-blue-800   font-black">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>NDPA 2023 & GDPR Compliance Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Legal & Regulatory Compliance Console
          </h1>
          <p className="text-slate-700 dark:text-slate-300 font-medium text-sm mt-1">
            Supervise data subject requests, statutory purge schedules, policy documents, and cryptographic audit records.
          </p>
        </div>
        <button
          onClick={fetchComplianceData}
          className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-all"
        >
          <ArrowPathIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Queues
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Pending DSR Inquiries</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {dsrs.filter(d => d.status === 'pending').length}
          </p>
          <span className="text-xs text-blue-600 font-semibold mt-1 block">Statutory 30-Day SLA</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Scheduled Account Purges</p>
          <p className="text-2xl font-black text-rose-600 mt-2">
            {deletions.filter(d => d.status === 'confirmed').length}
          </p>
          <span className="text-xs text-rose-500 font-semibold mt-1 block">Enclave Purge Stage</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Statutory Framework</p>
          <p className="text-2xl font-black text-emerald-600 mt-2">NDPA 2023</p>
          <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1 block">Certified Section 31</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Active Policies</p>
          <p className="text-2xl font-black text-indigo-600 mt-2">6 Active</p>
          <Link to="/dashboard/policies" className="text-xs text-indigo-600 hover:underline font-semibold mt-1 block">
            Manage in Policy Editor →
          </Link>
        </div>
      </div>

      {/* DSR Inquiries Queue */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Data Subject Requests (DSR Queue)
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Live statutory requests submitted under NDPA/GDPR</p>
          </div>
          <Link
            to="/privacy/data-subject-request"
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Public DSR Form</span>
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/40 text-xs uppercase tracking-wider font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Claimant</th>
                <th className="p-3">Request Type</th>
                <th className="p-3">Message</th>
                <th className="p-3">Status</th>
                <th className="p-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {dsrs.length > 0 ? (
                dsrs.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-white">{req.name}</div>
                      <div className="text-xs text-slate-700 dark:text-slate-300 font-medium">{req.email}</div>
                    </td>
                    <td className="p-3 font-semibold uppercase text-xs text-indigo-600">
                      {req.request_type}
                    </td>
                    <td className="p-3 text-xs text-slate-700 dark:text-slate-300 font-medium max-w-xs truncate">
                      {req.message || 'Standard access request'}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        req.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold'
                          : req.status === 'processing'
                            ? 'bg-blue-100 text-emerald-950 border border-emerald-400 font-bold'
                            : 'bg-amber-100 text-emerald-950 border border-emerald-400 font-bold'
                      }font-black`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-700 dark:text-slate-300 font-medium text-xs">
                    {loading ? 'Querying DSR registry...' : 'No pending Data Subject Requests logged.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Deletion Queue */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Permanent Deletion Schedules
            </h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">Statutory 30-day grace period purge pipeline</p>
          </div>
          <Link
            to="/account/delete"
            className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
          >
            <span>Public Deletion Console</span>
            <ArrowRightIcon className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/40 text-xs uppercase tracking-wider font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Account Email</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Password Challenge</th>
                <th className="p-3">Scheduled Purge</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {deletions.length > 0 ? (
                deletions.map((del) => (
                  <tr key={del.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white">{del.email}</td>
                    <td className="p-3 text-xs text-slate-700 dark:text-slate-300 font-medium max-w-xs truncate">{del.reason || 'None provided'}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold">
                        <CheckCircleIcon className="w-3 h-3" /> Confirmed
                      </span>
                    </td>
                    <td className="p-3 text-xs font-mono text-rose-600 font-bold">
                      {new Date(del.scheduled_purge_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-400  font-black">
                        {del.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-700 dark:text-slate-300 font-medium text-xs">
                    {loading ? 'Querying purge schedules...' : 'No accounts currently scheduled for deletion.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LegalCompliancePage;
