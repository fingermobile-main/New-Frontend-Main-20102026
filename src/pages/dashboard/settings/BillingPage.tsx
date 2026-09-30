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
    <div>
      <h1 className="text-2xl font-bold mb-6">Billing & Subscriptions</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Current Plan</h2>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-xl font-bold text-blue-700">{currentPlan}</p>
              <p className="text-sm text-gray-600 mt-1">
                Active Protocol Dedicated Node. Unlimited SLA.
              </p>
            </div>
            <button 
              onClick={() => showToast('Subscription tier managed by Protocol Foundation', 'info')}
              className="w-full mt-4 py-2 font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
            >
              Manage Subscription
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="flex items-center gap-3">
              <CreditCardIcon className="w-8 h-8 text-gray-400" />
              <div>
                <p className="font-semibold text-gray-900">Corporate Settlement Ledger</p>
                <p className="text-sm text-gray-500 font-mono">Net 30 Direct Treasury</p>
              </div>
            </div>
            <button 
              onClick={() => showToast('Settlement details verified', 'info')}
              className="w-full mt-4 py-2 font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              Update Payment Method
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Billing History</h2>
            <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-1 rounded">
              {billingRecords.length} Invoices
            </span>
          </div>
          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-gray-500 py-4 text-center">Loading invoices from database...</p>
            ) : billingRecords.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">No billing records found.</p>
            ) : (
              billingRecords.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{item.invoice_number}</p>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.plan_name} • {item.created_at || item.paid_at ? new Date(item.created_at || item.paid_at || '').toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} {item.currency}
                    </p>
                    <p className="text-[11px] text-gray-500 capitalize">{item.billing_cycle || 'monthly'}</p>
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
