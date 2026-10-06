import React, { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import { useAppContext } from '../contexts/AppContext';
import { TrashIcon, GiftIcon, LinkIcon, PaylinkIcon, PlusIcon, XMarkIcon } from '../icons';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';

interface PaylinkItem {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  url: string;
  is_redeemable?: boolean;
}

const PaylinksPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast, ficBalance } = useAppContext();

  const [paylinks, setPaylinks] = useState<PaylinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPaylink, setSelectedPaylink] = useState<PaylinkItem | null>(null);
  const [giftAmount, setGiftAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [newPaylink, setNewPaylink] = useState({
    title: '',
    description: '',
    amount: '',
    currency: 'FIC'
  });

  const loadPaylinks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiService.get('/api/paylinks');
      const items: PaylinkItem[] = (res.paylinks || res.data || []).map((p: any) => ({
        id: String(p.id),
        title: p.title || 'Payment Link',
        description: p.description || '',
        amount: parseFloat(p.amount) || 0,
        currency: p.currency || 'FIC',
        url: p.url || `${window.location.origin}/pay/${p.id}`,
        is_redeemable: p.is_redeemable ?? true
      }));
      setPaylinks(items);
    } catch {
      showToast?.('Failed to load paylinks', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadPaylinks();
  }, [loadPaylinks]);

  const handleCreatePaylink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaylink.title || !newPaylink.amount) {
      showToast?.('Title and amount are required', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const res = await apiService.post('/api/paylinks', {
        title: newPaylink.title,
        description: newPaylink.description,
        amount: parseFloat(newPaylink.amount),
        currency: newPaylink.currency
      });

      showToast?.('Paylink created successfully!', 'success');
      setShowCreateModal(false);
      setNewPaylink({ title: '', description: '', amount: '', currency: 'FIC' });
      loadPaylinks();
    } catch (err: any) {
      showToast?.(err.message || 'Failed to create paylink', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeletePaylink = async (paylinkId: string) => {
    if (!window.confirm('Are you sure you want to delete this paylink?')) return;
    try {
      await apiService.delete(`/api/paylinks/${paylinkId}`);
      setPaylinks(prev => prev.filter(p => p.id !== paylinkId));
      showToast?.('Paylink deleted successfully', 'success');
    } catch (err: any) {
      showToast?.(err.message || 'Failed to delete paylink', 'error');
    }
  };

  const handleSendGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaylink) return;

    const amountNum = parseFloat(giftAmount);
    if (!giftAmount || isNaN(amountNum) || amountNum <= 0) {
      showToast?.('Please enter a valid gift amount', 'error');
      return;
    }

    if (ficBalance !== undefined && amountNum > ficBalance) {
      showToast?.('Insufficient FIC balance', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.post('/api/paylinks/send-gift', {
        paylink_id: selectedPaylink.id,
        amount: amountNum,
        sender_id: user?.id || 'guest'
      });
      showToast?.(`Successfully sent ${amountNum} FIC gift!`, 'success');
      setShowGiftModal(false);
      setGiftAmount('');
      setSelectedPaylink(null);
    } catch (err: any) {
      showToast?.(err.message || 'Failed to send gift. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <PageHeader title="Paylinks" />
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow self-start sm:self-auto text-sm"
        >
          <PlusIcon className="w-4 h-4" />
          Create Paylink
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-gray-400">Loading paylinks...</div>
      ) : paylinks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
          <PaylinkIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">No paylinks found.</p>
          <p className="text-gray-400 text-sm mt-1 mb-4">Create your first instant settlement paylink to start receiving payments.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition shadow"
          >
            Create Paylink
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paylinks.map((paylink) => (
            <div key={paylink.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-blue-50 rounded-xl">
                    <PaylinkIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <button
                    onClick={() => handleDeletePaylink(paylink.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Delete Paylink"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{paylink.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{paylink.description || 'Instant payment link'}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xl font-bold text-blue-600">
                  {paylink.amount.toLocaleString()} {paylink.currency}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPaylink(paylink);
                      setShowGiftModal(true);
                    }}
                    className="p-2 text-gray-600 hover:bg-pink-50 hover:text-pink-600 rounded-lg transition-colors"
                    title="Send Gift"
                  >
                    <GiftIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(paylink.url);
                      showToast?.('Link copied to clipboard!', 'success');
                    }}
                    className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    title="Copy Link"
                  >
                    <LinkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Paylink Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Create New Paylink</h3>
            <form onSubmit={handleCreatePaylink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newPaylink.title}
                  onChange={(e) => setNewPaylink(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="e.g. VIP Consultation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newPaylink.description}
                  onChange={(e) => setNewPaylink(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Service or product details..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={newPaylink.amount}
                    onChange={(e) => setNewPaylink(prev => ({ ...prev, amount: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="50.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    value={newPaylink.currency}
                    onChange={(e) => setNewPaylink(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  >
                    <option value="FIC">FIC</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 text-sm shadow"
                >
                  {isProcessing ? 'Generating...' : 'Create Paylink'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gift Modal */}
      {showGiftModal && selectedPaylink && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative">
            <button
              onClick={() => {
                setShowGiftModal(false);
                setSelectedPaylink(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-pink-50 rounded-xl">
                <GiftIcon className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Send Gift</h3>
                <p className="text-xs text-gray-500">Attach a tip to {selectedPaylink.title}</p>
              </div>
            </div>
            <form onSubmit={handleSendGift} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gift Amount (FIC)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  required
                  placeholder="e.g. 10.00"
                  className="w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                />
                {ficBalance !== undefined && (
                  <p className="text-xs text-gray-400 mt-1">Available balance: {ficBalance} FIC</p>
                )}
              </div>
              <div className="mt-6 flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 bg-pink-600 text-white py-2.5 rounded-xl font-bold hover:bg-pink-700 transition disabled:opacity-50 text-sm shadow"
                >
                  {isProcessing ? 'Sending...' : 'Send Gift'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowGiftModal(false);
                    setSelectedPaylink(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaylinksPage;
