import { Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/layout/MainLayout';
import apiService from '../services/apiService';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import {
  CreditCardIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  WalletIcon,
  ChartBarIcon,
  GiftIcon,
  CurrencyDollarIcon,
  QrCodeIcon,
  PlusIcon
} from '@/icons';
import { useToast } from '@/hooks/use-toast';

interface WalletTransaction {
  id: string | number;
  type: string;
  amount: number;
  from?: string;
  to?: string;
  date: string;
  description?: string;
  status?: string;
}

const WalletPage: React.FC = () => {
  const { toast } = useToast();
  const [balance, setBalance] = useState(0);
  const [fiatBalance, setFiatBalance] = useState(0);
  const [ficBalance, setFicBalance] = useState(0);
  const [walletAddress, setWalletAddress] = useState('');
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [showFundModal, setShowFundModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);

  // Form Fields
  const [actionAmount, setActionAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWalletData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch wallet balance
      const balanceData = await apiService.get('/api/wallet/balance');
      if (balanceData) {
        const bal = balanceData.balance || balanceData.ficBalance || 0;
        setBalance(bal);
        setFicBalance(bal);
        setFiatBalance(balanceData.fiatBalance || parseFloat((bal * 0.1).toFixed(2)));
        if (balanceData.data?.wallet_address) {
          setWalletAddress(balanceData.data.wallet_address);
        }
      }

      // Fetch wallet info for address if needed
      if (!walletAddress) {
        const walletInfo = await apiService.get('/api/wallet');
        if (walletInfo?.data?.wallet_address) {
          setWalletAddress(walletInfo.data.wallet_address);
        }
      }

      // Fetch transactions
      const txData = await apiService.get('/api/wallet/transactions');
      if (txData && (txData.transactions || txData.data)) {
        setTransactions(txData.transactions || txData.data);
      }
    } catch (err) {
      console.error('Failed to fetch live wallet data', err);
      toast({
        title: 'Error',
        description: 'Failed to synchronize live wallet balance.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast, walletAddress]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  // Handle Fund Wallet
  const handleFundWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(actionAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid deposit amount', variant: 'destructive' });
      return;
    }

    try {
      setIsSubmitting(true);
      await apiService.post('/api/wallet/deposit', {
        amount: amountNum,
        payment_method: selectedMethod
      });
      toast({ title: 'Deposit Successful', description: `Added ${amountNum} FIC to your live wallet.` });
      setShowFundModal(false);
      setActionAmount('');
      fetchWalletData();
    } catch (error) {
      toast({ title: 'Deposit Failed', description: 'Could not process deposit.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Withdraw Funds
  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(actionAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid withdrawal amount', variant: 'destructive' });
      return;
    }
    if (amountNum > ficBalance) {
      toast({ title: 'Insufficient Funds', description: 'Withdrawal amount exceeds your FIC balance.', variant: 'destructive' });
      return;
    }

    try {
      setIsSubmitting(true);
      await apiService.post('/api/wallet/withdraw', {
        amount: amountNum,
        withdrawal_method: 'bank_transfer',
        account_details: { bankName: selectedMethod }
      });
      toast({ title: 'Withdrawal Initiated', description: `Withdrawal of ${amountNum} FIC is being processed.` });
      setShowWithdrawModal(false);
      setActionAmount('');
      fetchWalletData();
    } catch (error) {
      toast({ title: 'Withdrawal Failed', description: 'Could not process withdrawal.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Send Money
  const handleSendMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(actionAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid transfer amount', variant: 'destructive' });
      return;
    }
    if (!recipientAddress.trim()) {
      toast({ title: 'Recipient Required', description: 'Please specify the recipient address or member ID', variant: 'destructive' });
      return;
    }
    if (amountNum > ficBalance) {
      toast({ title: 'Insufficient Funds', description: 'Transfer amount exceeds your FIC balance.', variant: 'destructive' });
      return;
    }

    try {
      setIsSubmitting(true);
      await apiService.post('/api/wallet/transfer', {
        recipient_wallet_address: recipientAddress.trim(),
        amount: amountNum,
        note: 'Direct wallet transfer'
      });
      toast({ title: 'Transfer Completed', description: `Sent ${amountNum} FIC to ${recipientAddress}.` });
      setShowSendModal(false);
      setActionAmount('');
      setRecipientAddress('');
      fetchWalletData();
    } catch (error) {
      toast({ title: 'Transfer Failed', description: 'Failed to execute transfer.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout pageTitle="Wallet">
      <div className="bg-white min-h-screen text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">My Live Wallet</h3>
                <p className="text-sm text-gray-500 mb-4">Manage your funds, track PostgreSQL transactions, and make secure transfers.</p>
                {walletAddress && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-gray-400 uppercase font-semibold">Your Wallet Address</p>
                    <p className="text-xs font-mono text-gray-700 truncate mt-1">{walletAddress}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(walletAddress);
                        toast({ title: 'Copied', description: 'Address copied to clipboard' });
                      }}
                      className="mt-2 text-xs text-blue-600 font-bold hover:underline"
                    >
                      Copy Address
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Center Content */}
            <div className="lg:col-span-9">
              <div className="w-full">
                <div className="mb-8 text-center sm:text-left">
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">Wallet</h1>
                  <p className="text-lg text-gray-600 max-w-2xl">
                    Manage your funds, track transactions, and make instant on-chain payments
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
                      <CardHeader className="pb-2">
                        <CardDescription className="text-blue-100 font-medium">Total Balance</CardDescription>
                        <CardTitle className="text-3xl font-extrabold">{ficBalance.toLocaleString()} FIC</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm text-blue-100">
                          <span>Fiat Value: ${fiatBalance.toFixed(2)} USD</span>
                          <span>Status: Live Active</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex space-x-3">
                          <Button variant="secondary" size="sm" className="bg-white text-blue-700 hover:bg-blue-50 font-bold" onClick={() => setShowFundModal(true)}>
                            <PlusIcon className="w-4 h-4 mr-1" />
                            Fund
                          </Button>
                          <Button variant="secondary" size="sm" className="bg-blue-800/80 hover:bg-blue-800 text-white font-bold" onClick={() => setShowWithdrawModal(true)}>
                            Withdraw
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-lg">
                          <WalletIcon className="w-5 h-5 mr-2 text-indigo-600" />
                          Quick Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="flex flex-col items-center p-4 hover:border-blue-500 hover:bg-blue-50" onClick={() => setShowSendModal(true)}>
                          <ArrowUpIcon className="w-6 h-6 mb-2 text-green-500" />
                          Send
                        </Button>
                        <Button variant="outline" className="flex flex-col items-center p-4 hover:border-blue-500 hover:bg-blue-50" onClick={() => setShowReceiveModal(true)}>
                          <ArrowDownIcon className="w-6 h-6 mb-2 text-blue-500" />
                          Receive
                        </Button>
                        <Button variant="outline" className="flex flex-col items-center p-4" asChild>
                          <Link to="/financials/vault">
                            <CurrencyDollarIcon className="w-6 h-6 mb-2 text-purple-500" />
                            Vault
                          </Link>
                        </Button>
                        <Button variant="outline" className="flex flex-col items-center p-4" asChild>
                          <Link to="/financials/giftcards">
                            <GiftIcon className="w-6 h-6 mb-2 text-pink-500" />
                            Gift Cards
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <ChartBarIcon className="w-5 h-5 mr-2 text-indigo-600" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {transactions.length === 0 ? (
                          <p className="text-sm text-gray-500 py-4 text-center">No recent transactions recorded.</p>
                        ) : (
                          transactions.slice(0, 3).map((transaction) => (
                            <div key={transaction.id} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                              <div>
                                <p className="font-medium text-sm">
                                  {transaction.type === 'received' ? `From: ${transaction.from || 'Platform'}` : `To: ${transaction.to || 'Transfer'}`}
                                </p>
                                <p className="text-xs text-gray-500">{transaction.description || 'Transaction'} • {transaction.date}</p>
                              </div>
                              <div className="text-right">
                                <p className={`font-bold text-sm ${transaction.type === 'received' ? 'text-green-600' : 'text-red-600'}`}>
                                  {transaction.type === 'received' ? '+' : '-'}{transaction.amount} FIC
                                </p>
                                <p className="text-xs text-gray-400 capitalize">{transaction.status || 'completed'}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full text-xs" asChild>
                        <Link to="/financials/wallet">Full Financials Portal</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions ({transactions.length})</TabsTrigger>
                    <TabsTrigger value="settings">Wallet Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-gray-500">Live FIC Balance</CardDescription>
                          <CardTitle className="text-2xl font-bold">{ficBalance.toLocaleString()} FIC</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center text-sm text-green-600">
                            <ArrowUpIcon className="w-4 h-4 mr-1" />
                            Live PostgreSQL Synced
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-gray-500">Estimated USD Value</CardDescription>
                          <CardTitle className="text-2xl font-bold">${fiatBalance.toFixed(2)} USD</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-gray-500">
                            1 FIC ≈ $0.10 USD
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription className="text-gray-500">Total Transactions</CardDescription>
                          <CardTitle className="text-2xl font-bold">{transactions.length}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm text-blue-600">
                            Verified on Database
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="transactions" className="space-y-6">
                    <Card>
                      <CardContent className="p-0">
                        <div className="divide-y divide-gray-200">
                          {transactions.length === 0 ? (
                            <p className="text-center py-8 text-gray-500">No transactions found.</p>
                          ) : (
                            transactions.map((tx) => (
                              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                    tx.type === 'received' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                  }`}>
                                    {tx.type === 'received' ? '↓' : '↑'}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900 text-sm">{tx.description || 'Transaction'}</p>
                                    <p className="text-xs text-gray-500">{tx.date} • Ref: {String(tx.id)}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`font-bold text-sm ${tx.type === 'received' ? 'text-green-600' : 'text-red-600'}`}>
                                    {tx.type === 'received' ? '+' : '-'}{tx.amount} FIC
                                  </p>
                                  <span className="inline-block text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full capitalize">
                                    {tx.status || 'completed'}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Wallet Details</CardTitle>
                        <CardDescription>Security and cryptographic identifier</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-700">Wallet Public Identifier</label>
                          <input
                            type="text"
                            readOnly
                            value={walletAddress || 'fm_wallet_live'}
                            className="mt-1 w-full p-2 bg-gray-100 border border-gray-200 rounded-md font-mono text-sm text-gray-700"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fund Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-in fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Fund Your Live Wallet</h3>
            <p className="text-sm text-gray-500 mb-4">Direct deposit into PostgreSQL backed wallet.</p>
            <form onSubmit={handleFundWallet} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (FIC)</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder="e.g. 250"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Funding Method</label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="card">Debit / Credit Card</option>
                  <option value="bank_transfer">Instant Bank Transfer</option>
                  <option value="paystack">Paystack Gateway</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowFundModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  {isSubmitting ? 'Processing...' : 'Deposit Funds'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-in fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Withdraw to Bank</h3>
            <p className="text-sm text-gray-500 mb-4">Available balance: {ficBalance.toLocaleString()} FIC</p>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (FIC)</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  max={ficBalance}
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Bank Destination</label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Zenith Bank">Zenith Bank (0123456789)</option>
                  <option value="Guaranty Trust Bank">Guaranty Trust Bank (0987654321)</option>
                  <option value="Access Bank">Access Bank (0555666777)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowWithdrawModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  {isSubmitting ? 'Processing...' : 'Withdraw'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-in fade-in">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Send FIC Tokens</h3>
            <p className="text-sm text-gray-500 mb-4">Transfer instantly to any FingerMobile member.</p>
            <form onSubmit={handleSendMoney} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Recipient Address or Member ID</label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="fm_wallet_address or 5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (FIC)</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  max={ficBalance}
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setShowSendModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  {isSubmitting ? 'Sending...' : 'Confirm Transfer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receive Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-in fade-in text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Receive FIC</h3>
            <p className="text-sm text-gray-500 mb-4">Share your wallet address to receive funds.</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl my-4 text-center">
              <div className="w-32 h-32 mx-auto bg-slate-200 rounded-xl flex items-center justify-center mb-3">
                <QrCodeIcon className="w-16 h-16 text-slate-500" />
              </div>
              <p className="text-xs font-mono text-gray-800 break-all">{walletAddress || 'fm_wallet_active'}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowReceiveModal(false)}>
                Close
              </Button>
              <Button
                type="button"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                onClick={() => {
                  navigator.clipboard.writeText(walletAddress || '');
                  toast({ title: 'Copied!', description: 'Address copied to clipboard.' });
                }}
              >
                Copy Address
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default WalletPage;
