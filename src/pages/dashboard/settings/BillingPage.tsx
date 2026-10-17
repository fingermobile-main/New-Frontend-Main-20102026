import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import { CreditCardIcon } from '@heroicons/react/24/solid';
import adminOperationsService, { PlatformBillingRecord } from '../../../services/adminOperationsService';

const BillingPage: React.FC = () => {
  const { showToast } = useAppContext();
  const { user } = useAuth();
  const [billingRecords, setBillingRecords] = useState<PlatformBillingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        setLoading(true);
        const data = await adminOperationsService.getBillingRecords();
        setBillingRecords(data);
      } catch (err) {
        console.error('Failed to load billing records:', err);
        showToast('Failed to load billing history', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchBilling();
  }, [showToast]);

  const currentPlan = billingRecords[0]?.plan_name || 'Enterprise Protocol Dedicated';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Billing & Subscriptions</h1>
        <p className="mt-1 text-sm font-medium text-slate-700">Manage protocol infrastructure plans, payment methods, and invoice records</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-300">
            <h2 className="text-lg font-black text-slate-900 mb-4">Current Plan</h2>
            <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-300">
              <p className="text-xl font-black text-blue-800">{currentPlan}</p>
              <p className="text-xs font-semibold text-slate-700 mt-1">
                Active Protocol Dedicated Node. Unlimited SLA.
              </p>
            </div>
            <button
              onClick={() => showToast('Subscription tier managed by Protocol Foundation', 'info')}
              className="w-full mt-4 py-2.5 font-bold text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
            >
              Manage Subscription
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-300">
            <h2 className="text-lg font-black text-slate-900 mb-4">Payment Method</h2>
            <div className="flex items-center gap-3">
              <CreditCardIcon className="w-8 h-8 text-slate-600" />
              <div>
                <p className="font-bold text-slate-900">Corporate Settlement Ledger</p>
                <p className="text-xs text-slate-700 font-mono font-bold">Net 30 Direct Treasury</p>
              </div>
            </div>
            <button
              onClick={() => showToast('Settlement details verified', 'info')}
              className="w-full mt-4 py-2.5 font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Update Payment Method
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900">Billing History</h2>
            <span className="text-xs bg-slate-100 text-slate-800 font-mono font-bold px-3 py-1 rounded-full border border-slate-300">
              {billingRecords.length} Invoices
            </span>
          </div>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-slate-700 py-6 text-center font-medium">Loading invoices from database...</p>
            ) : billingRecords.length === 0 ? (
              <p className="text-sm text-slate-700 py-6 text-center font-medium">No billing records found.</p>
            ) : (
              billingRecords.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50/70 p-4 rounded-xl border border-slate-300">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900">{item.invoice_number}</p>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'paid' ? 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold' : 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium mt-1">
                      {item.plan_name} • {item.created_at || item.paid_at ? new Date(item.created_at || item.paid_at || '').toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-black text-slate-900">
                      ${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} {item.currency}
                    </p>
                    <p className="text-xs text-slate-700 font-medium capitalize mt-0.5">{item.billing_cycle || 'monthly'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
