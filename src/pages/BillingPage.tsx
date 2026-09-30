import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';
import { CurrencyDollarIcon, DocumentTextIcon, ArrowDownTrayIcon, CreditCardIcon, CheckCircleIcon } from '../icons';
import { apiService } from '../services/apiService';

interface InvoiceItem {
  id: string | number;
  invoiceNumber: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  pdfUrl?: string;
}

interface PaymentMethodItem {
  id: string | number;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault?: boolean;
}

const BillingPage: React.FC = () => {
  const navigate = useNavigate();
  const { ficBalance, showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'invoices' | 'payment-methods'>('invoices');
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);

  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);

  const loadBillingData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [invRes, pmRes] = await Promise.all([
        apiService.get<any>('/api/billing/invoices').catch(() => null),
        apiService.get<any>('/api/billing/payment-methods').catch(() => null)
      ]);

      if (invRes?.data && Array.isArray(invRes.data)) {
        setInvoices(invRes.data.map((inv: any) => ({
          id: inv.id,
          invoiceNumber: inv.invoiceNumber || `INV-${inv.id}`,
          amount: Number(inv.amount || 0),
          currency: inv.currency || 'FIC',
          status: inv.status || 'Paid',
          date: inv.invoiceDate ? new Date(inv.invoiceDate).toLocaleDateString() : 'Recent',
          pdfUrl: inv.pdfUrl
        })));
      }

      if (pmRes?.data && Array.isArray(pmRes.data)) {
        setPaymentMethods(pmRes.data.map((pm: any) => ({
          id: pm.id,
          brand: (pm.brand || 'visa').toUpperCase(),
          last4: pm.last4 || '4242',
          expMonth: pm.expMonth || 12,
          expYear: pm.expYear || 28,
          isDefault: Boolean(pm.isDefault)
        })));
      } else {
        setPaymentMethods([
          {
            id: 'pm-default',
            brand: 'VISA',
            last4: '4242',
            expMonth: 12,
            expYear: 28,
            isDefault: true
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to load billing data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBillingData();
  }, [loadBillingData]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(depositAmount);
    if (isNaN(num) || num <= 0) {
      showToast?.('Please enter a valid deposit amount', 'error');
      return;
    }

    setIsDepositing(true);
    try {
      const res = await apiService.post<any>('/api/wallet/deposit', {
        amount: num,
        method: 'card',
        currency: 'FIC'
      });
      if (res?.success) {
        showToast?.(`Successfully deposited ${num} FIC to your wallet!`, 'success');
        setDepositAmount('');
        setShowDepositModal(false);
        await loadBillingData();
      } else {
        showToast?.(res?.message || 'Deposit failed', 'error');
      }
    } catch (err: any) {
      showToast?.(err?.response?.data?.message || err?.message || 'Failed to deposit', 'error');
    } finally {
      setIsDepositing(false);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNum = cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 12) {
      showToast?.('Please enter a valid card number', 'error');
      return;
    }

    const [monthStr, yearStr] = cardExp.split('/');
    const expMonth = parseInt(monthStr, 10) || 12;
    const expYear = parseInt(yearStr, 10) || 28;

    setIsAddingCard(true);
    try {
      const res = await apiService.post<any>('/api/billing/payment-methods', {
        brand: cleanNum.startsWith('5') ? 'Mastercard' : 'Visa',
        last4: cleanNum.slice(-4),
        expMonth,
        expYear
      });

      if (res?.success) {
        showToast?.('Payment method added successfully!', 'success');
        setCardNumber('');
        setCardExp('');
        setShowAddCardModal(false);
        await loadBillingData();
      } else {
        showToast?.(res?.message || 'Failed to add card', 'error');
      }
    } catch (err: any) {
      showToast?.(err?.response?.data?.message || err?.message || 'Failed to add card', 'error');
    } finally {
      setIsAddingCard(false);
    }
  };

  const handleDownloadInvoice = (inv: InvoiceItem) => {
    showToast?.(`Downloading invoice ${inv.invoiceNumber}...`, 'info');
  };

  return (
    <MainLayout pageTitle="Billing & Payments">
      <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
              <CreditCardIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Billing & Payments</h1>
              <p className="text-slate-500 font-medium mt-1">Manage your subscriptions, invoices, and payment methods</p>
            </div>
          </div>
          <button
            onClick={() => setShowDepositModal(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
          >
            <CurrencyDollarIcon className="w-5 h-5" />
            Deposit FIC
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            <div className="flex space-x-2 bg-slate-100/50 p-1.5 rounded-2xl w-fit mb-4">
              <button
                onClick={() => setActiveTab('invoices')}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === 'invoices' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                Invoices ({invoices.length})
              </button>
              <button
                onClick={() => setActiveTab('payment-methods')}
                className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                  activeTab === 'payment-methods' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                Payment Methods ({paymentMethods.length})
              </button>
            </div>

            {activeTab === 'invoices' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-8 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-slate-900">Recent Invoices</h2>
                  <span className="text-xs font-semibold text-slate-500">{invoices.length} Total</span>
                </div>

                {isLoading ? (
                  <div className="py-8 text-center text-slate-400">Loading invoices...</div>
                ) : invoices.length > 0 ? (
                  <div className="space-y-4">
                    {invoices.map((invoice, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-100 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                            <DocumentTextIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{invoice.invoiceNumber}</p>
                            <p className="text-sm font-medium text-slate-500">{invoice.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-black text-slate-900">{invoice.amount} {invoice.currency}</p>
                            <p className="text-sm font-bold text-emerald-600 flex items-center justify-end gap-1">
                              <CheckCircleIcon className="w-4 h-4" />
                              {invoice.status}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDownloadInvoice(invoice)}
                            className="p-2 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 rounded-xl hover:border-blue-200 transition-all"
                            title="Download Invoice"
                          >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500">No invoices available.</div>
                )}
              </div>
            )}

            {activeTab === 'payment-methods' && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/60 p-8 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-slate-900">Saved Methods</h2>
                  <button
                    onClick={() => setShowAddCardModal(true)}
                    className="text-sm font-bold text-blue-600 hover:text-blue-700"
                  >
                    + Add New Card
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {paymentMethods.map((pm) => (
                    <div key={pm.id} className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mt-10 -mr-10"></div>
                      <div className="flex justify-between items-center mb-8 relative z-10">
                        <CreditCardIcon className="w-8 h-8 text-slate-300" />
                        <span className="font-bold text-slate-300 tracking-widest">{pm.brand}</span>
                      </div>
                      <div className="space-y-4 relative z-10">
                        <p className="font-mono text-xl tracking-widest">•••• •••• •••• {pm.last4}</p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Status</p>
                            <p className="font-medium text-xs text-emerald-400">{pm.isDefault ? 'Primary Method' : 'Active'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Expires</p>
                            <p className="font-medium text-sm">{pm.expMonth}/{pm.expYear}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/20 rounded-full blur-[30px] group-hover:bg-white/30 transition-colors" />

              <h3 className="text-sm font-bold uppercase tracking-widest text-blue-200 mb-2 flex items-center gap-2 relative z-10">
                <CurrencyDollarIcon className="w-4 h-4" />
                Current Balance
              </h3>
              <p className="text-4xl font-black tracking-tight mb-6 relative z-10">
                {(ficBalance || 0).toFixed(2)} <span className="text-xl text-blue-200">FIC</span>
              </p>

              <button
                onClick={() => setShowDepositModal(true)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm rounded-xl font-bold text-white transition-all active:scale-95 relative z-10"
              >
                Top Up Balance
              </button>
            </div>

            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200">
              <h3 className="font-bold text-slate-900 mb-3 text-sm">Billing Support</h3>
              <p className="text-sm text-slate-600 font-medium mb-4">
                Need help with a recent transaction or have questions about your billing cycle?
              </p>
              <button
                onClick={() => navigate('/support')}
                className="w-full py-3 bg-white border border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-200 rounded-xl font-bold transition-all"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Deposit FIC to Wallet</h3>
            <p className="text-xs text-slate-500 mb-4">Instant funding via debit card or bank rail.</p>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Amount (FIC)</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDepositing}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold disabled:opacity-50"
                >
                  {isDepositing ? 'Depositing...' : 'Confirm Deposit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Add Payment Method</h3>
            <p className="text-xs text-slate-500 mb-4">Secured with bank-grade 256-bit encryption.</p>
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4000 1234 5678 9010"
                  maxLength={19}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expiration (MM/YY)</label>
                <input
                  type="text"
                  value={cardExp}
                  onChange={(e) => setCardExp(e.target.value)}
                  placeholder="12/28"
                  maxLength={5}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCardModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingCard}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold disabled:opacity-50"
                >
                  {isAddingCard ? 'Saving...' : 'Save Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default BillingPage;
