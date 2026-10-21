import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import type { PayoutRequest, PayoutData } from '../../types';
import { NIGERIAN_BANKS } from '../../constants';
import AnimatedAvatar from '../../components/AnimatedAvatar';
import PlatformOwnershipCard from '../../components/dashboard/PlatformOwnershipCard';
import { apiService } from '../../services/apiService';

const PayoutsPage: React.FC = () => {
  const { payoutRequests, handleInitiatePayout, handleProcessPayout, showToast } =
    useAppContext();

  // State for the form
  const [memberId, setmemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState(NIGERIAN_BANKS[0].name);
  const [accountNumber, setAccountNumber] = useState('');
  const [livePayouts, setLivePayouts] = useState<PayoutRequest[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadPayouts = useCallback(async () => {
    try {
      const res = await apiService.get<any>('/api/payouts');
      if (res?.data && Array.isArray(res.data)) {
        setLivePayouts(res.data.map((p: any) => ({
          id: String(p.id),
          memberId: p.memberId || '4',
          amount: Number(p.amount || 0),
          status: (p.status || 'pending').toLowerCase() as any,
          bankName: p.bankName || 'Bank',
          accountNumber: p.accountNumber || '0000000000',
          date: p.date || (p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Recent'),
          member: {
            id: p.memberId || '4',
            name: p.memberId ? `Member ${p.memberId}` : 'User',
            avatarUrl: ''
          }
        })));
      }
    } catch (err) {
      console.error('Failed to load payouts:', err);
    }
  }, []);

  useEffect(() => {
    loadPayouts();
  }, [loadPayouts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payoutData: PayoutData = {
      memberId,
      amount: parseInt(amount, 10),
      bankName,
      accountNumber
    };

    if (
      !payoutData.memberId ||
      isNaN(payoutData.amount) ||
      !payoutData.bankName ||
      !payoutData.accountNumber
    ) {
      showToast?.('Please fill in all payout fields with valid data', 'error');
      return;
    }

    try {
      const res = await apiService.post<any>('/api/payouts', payoutData);
      if (res?.success) {
        showToast?.('Manual payout created successfully', 'success');
        await loadPayouts();
      } else {
        handleInitiatePayout(payoutData.amount, payoutData.bankName);
      }
    } catch {
      handleInitiatePayout(payoutData.amount, payoutData.bankName);
    }

    // Reset form
    setmemberId('');
    setAmount('');
    setBankName(NIGERIAN_BANKS[0].name);
    setAccountNumber('');
  };

  const handleUpdateStatus = async (id: string, action: 'approve' | 'reject') => {
    const status = action === 'approve' ? 'approved' : 'rejected';
    setIsProcessing(true);
    try {
      const res = await apiService.patch<any>(`/api/payouts/${id}`, { status });
      if (res?.success) {
        showToast?.(`Payout ${action}d successfully`, 'success');
        await loadPayouts();
      } else {
        handleProcessPayout(id, action);
      }
    } catch {
      handleProcessPayout(id, action);
    } finally {
      setIsProcessing(false);
    }
  };

  const allRequests = livePayouts.length > 0 ? livePayouts : (payoutRequests || []);
  const pendingRequests = allRequests.filter((p: PayoutRequest) => String(p.status).toLowerCase() === 'pending');
  const processedRequests = allRequests.filter(
    (p: PayoutRequest) => String(p.status).toLowerCase() !== 'pending',
  );

  const PayoutRequestCard: React.FC<{
    request: PayoutRequest;
    isPending: boolean;
  }> = ({ request, isPending }) => {
    const statusLower = String(request.status).toLowerCase();
    const statusStyles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-950 border border-amber-400 font-bold',
      approved: 'bg-green-100 text-green-950 border border-green-400 font-bold',
      completed: 'bg-green-100 text-green-950 border border-green-400 font-bold',
      rejected: 'bg-red-100 text-red-950 border border-red-400 font-bold',
      failed: 'bg-red-100 text-red-950 border border-red-400 font-bold'
    };

    return (
      <div className="bg-white p-5 rounded-xl border border-slate-300 shadow-sm">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <AnimatedAvatar
              staticUrl={request.member?.avatarUrl || ''}
              altText={request.member?.name || 'Unknown'}
              className="w-10 h-10 rounded-full border border-slate-300 object-cover"
            />
            <div>
              <p className="font-bold text-slate-900">{request.member?.name || 'Unknown'}</p>
              <p className="text-xs font-semibold text-slate-600">{request.member?.id || request.memberId}</p>
            </div>
          </div>
          <span
            className={`px-2.5 py-0.5 text-xs font-bold rounded-full capitalize ${statusStyles[statusLower] || 'bg-slate-100 text-slate-900 border border-slate-300'}`}
          >
            {request.status}
          </span>
        </div>
        <div className="mt-3.5 border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-800">
          <p>
            <strong className="text-slate-900 font-bold">Amount:</strong> <span className="font-mono font-black text-slate-900 text-sm">{request.amount.toLocaleString()} FIC</span>
          </p>
          <p>
            <strong className="text-slate-900 font-bold">Bank:</strong> <span className="font-semibold text-slate-800">{request.bankName} - {request.accountNumber}</span>
          </p>
          <p>
            <strong className="text-slate-900 font-bold">Date:</strong> <span className="text-slate-700 font-medium">{request.date}</span>
          </p>
        </div>
        {isPending && (
          <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-slate-200">
            <button
              onClick={() => handleUpdateStatus(request.id, 'reject')}
              disabled={isProcessing}
              className="px-3.5 py-1.5 text-xs font-bold bg-rose-100 text-rose-950 border border-rose-400 rounded-lg hover:bg-rose-200 disabled:opacity-50 transition-colors"
            >
              Deny
            </button>
            <button
              onClick={() => handleUpdateStatus(request.id, 'approve')}
              disabled={isProcessing}
              className="px-3.5 py-1.5 text-xs font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 rounded-lg hover:bg-emerald-200 disabled:opacity-50 transition-colors"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <PlatformOwnershipCard />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-300 p-6 rounded-2xl shadow-sm sticky top-24">
            <h2 className="text-xl font-black text-slate-900 mb-4">Initiate Manual Payout</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Member ID
                </label>
                <input
                  type="text"
                  value={memberId}
                  onChange={(e) => setmemberId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 font-bold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue placeholder:text-slate-400"
                  placeholder="Enter member ID"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Amount (FIC)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 font-bold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue placeholder:text-slate-400 font-mono"
                  placeholder="e.g. 500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Bank
                </label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 font-bold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                >
                  {NIGERIAN_BANKS.map((bank) => (
                    <option key={bank.code} value={bank.name}>
                      {bank.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 border border-slate-300 bg-white text-slate-900 font-mono font-bold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue placeholder:text-slate-400"
                  placeholder="0123456789"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 font-bold text-sm bg-brand-blue text-white rounded-lg hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
              >
                Create Payout Request
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Lists */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-4">
              Pending Requests ({pendingRequests.length})
            </h2>
            {pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((req: PayoutRequest) => (
                  <PayoutRequestCard
                    key={req.id}
                    request={req}
                    isPending={true}
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-700 text-sm bg-white border border-slate-300 p-6 rounded-xl text-center font-medium shadow-sm">
                No pending payout requests.
              </p>
            )}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-4">Payout History</h2>
            {processedRequests.length > 0 ? (
              <div className="space-y-4">
                {processedRequests.map((req: PayoutRequest) => (
                  <PayoutRequestCard
                    key={req.id}
                    request={req}
                    isPending={false}
                  />
                ))}
              </div>
            ) : (
              <p className="text-slate-700 text-sm bg-white border border-slate-300 p-6 rounded-xl text-center font-medium shadow-sm">
                No processed payouts yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutsPage;
