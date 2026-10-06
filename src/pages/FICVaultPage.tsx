import React, { useState, useCallback, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/apiService';

// --- Subcomponent: Vault Stats Card ---
interface VaultStatCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
  color: string;
}

const VaultStatCard: React.FC<VaultStatCardProps> = React.memo(({ title, value, description, icon, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`w-12 h-12 ${color}-100 rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
});

VaultStatCard.displayName = 'VaultStatCard';

// --- Subcomponent: Vault History Table ---
interface VaultHistoryTableProps {
  history: Array<{
    id: number;
    type: string;
    amount: number;
    date: string;
    description?: string;
  }>;
}

const VaultHistoryTable: React.FC<VaultHistoryTableProps> = React.memo(({ history }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th scope="col" className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th scope="col" className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th scope="col" className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {history.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'deposit' || transaction.type === 'interest' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'deposit' || transaction.type === 'interest' ? (
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    )}
                  </div>
                  <span className="ml-2 text-xs sm:text-sm font-medium text-gray-900 capitalize">{transaction.type}</span>
                </div>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium ${
                transaction.type === 'deposit' || transaction.type === 'interest' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'deposit' || transaction.type === 'interest' ? '+' : '-'}{transaction.amount} FIC
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                {transaction.description || 'No description'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                {transaction.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

VaultHistoryTable.displayName = 'VaultHistoryTable';

// --- Subcomponent: Vault Security Card ---
interface SecurityCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
}

const SecurityCard: React.FC<SecurityCardProps> = React.memo(({ title, description, icon }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <h3 className="ml-3 text-sm sm:text-base font-medium text-gray-900">{title}</h3>
      </div>
      <p className="mt-2 text-xs sm:text-sm text-gray-500">{description}</p>
    </div>
  );
});

SecurityCard.displayName = 'SecurityCard';

// --- Subcomponent: Action Modal ---
interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actionButtonText: string;
  onAction: () => void;
  balance?: number;
  eventTitle?: string;
}

const ActionModal: React.FC<ActionModalProps> = React.memo(({
  isOpen,
  onClose,
  title,
  children,
  actionButtonText,
  onAction,
  balance,
  eventTitle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4 lg:text-2xl">{title}</h3>
        {eventTitle && <p className="text-gray-600 mb-2 lg:text-lg">Event: {eventTitle}</p>}
        {balance !== undefined && <p className="text-gray-600 mb-4 lg:text-lg">Your FIC Balance: {balance.toLocaleString()} FIC</p>}
        <div className="space-y-4">
          {children}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 rounded-lg lg:text-lg"
            >
              Cancel
            </button>
            <button
              onClick={onAction}
              className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg lg:text-lg"
            >
              {actionButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ActionModal.displayName = 'ActionModal';

const FICVaultPage: React.FC = () => {
  const { balance: _balance } = useWeb3();
  // eslint-disable-next-line no-unused-vars
  const { ficBalance: _ficBalance, showToast } = useAppContext();
  const [vaultBalance, setVaultBalance] = useState(0);
  const [apy, setApy] = useState(5.0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [amount, setAmount] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showGiftModal, setShowGiftModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isProcessing, setIsProcessing] = useState(false);

  const [vaultHistory, setVaultHistory] = useState<Array<{
    id: number;
    type: string;
    amount: number;
    date: string;
    description?: string;
  }>>([]);

  const loadVaultData = useCallback(async () => {
    try {
      const [statusRes, historyRes] = await Promise.all([
        apiService.get<any>('/api/fic-vault').catch(() => null),
        apiService.get<any>('/api/fic-vault/history').catch(() => null)
      ]);

      if (statusRes?.data) {
        setVaultBalance(Number(statusRes.data.balance || 0));
        setApy(Number(statusRes.data.apy || 5.0));
        setTotalInterest(Number(statusRes.data.totalInterestEarned || 0));
      }

      if (historyRes?.data && Array.isArray(historyRes.data)) {
        setVaultHistory(historyRes.data.map((tx: any, idx: number) => ({
          id: tx.id || idx + 1,
          type: (tx.transactionType || 'deposit').toLowerCase(),
          amount: Number(tx.amount || 0),
          date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Recent',
          description: tx.reference || (tx.transactionType === 'DEPOSIT' ? 'Deposit to Vault' : 'Withdrawal from Vault')
        })));
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to load FIC Vault data:', err);
    }
  }, []);

  useEffect(() => {
    loadVaultData();
  }, [loadVaultData]);

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const onLike = useCallback(async (_postId: string) => {
    showToast('Like action triggered', 'info');
  }, [showToast]);

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const onAddComment = useCallback(async (_postId: string, _comment: string) => {
    showToast('Add comment action triggered', 'info');
  }, [showToast]);

  // eslint-disable-next-line no-unused-vars
  const onOpenGiftModal = useCallback(() => {
    setShowGiftModal(true);
    showToast('Gift modal opened', 'info');
  }, [showToast]);

  // eslint-disable-next-line no-unused-vars
  const onOpenPaylinkModal = useCallback(() => {
    setShowPaylinkModal(true);
    showToast('Paylink modal opened', 'info');
  }, [showToast]);

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const onVote = useCallback(async (_postId: string, _voteType: unknown) => {
    showToast('Vote action triggered', 'info');
  }, [showToast]);

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const handleDeletePost = useCallback(async (_postId?: string) => {
    showToast('Delete post action triggered', 'info');
  }, [showToast]);

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const handleTokenizePost = useCallback(async (_postId?: string) => {
    showToast('Tokenize post action triggered', 'info');
  }, [showToast]);

  // eslint-disable-next-line no-unused-vars
  // eslint-disable-next-line no-unused-vars
  const handleAiAssist = useCallback(async (..._args: unknown[]) => {
    showToast('AI assist action triggered', 'info');
    return { success: true, message: 'AI assist completed' };
  }, [showToast]);

  const handleDeposit = useCallback(async () => {
    if (!amount) {
      showToast('Please enter an amount', 'error');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await apiService.post<any>('/api/fic-vault/deposit', { amount: amountNum });
      if (res?.success) {
        showToast(`Successfully deposited ${amountNum} FIC to your vault`, 'success');
        setAmount('');
        setShowDepositModal(false);
        await loadVaultData();
      } else {
        showToast(res?.message || 'Deposit failed', 'error');
      }
    } catch (error: any) {
      showToast(error?.response?.data?.message || error?.message || 'Failed to deposit FIC', 'error');
      // eslint-disable-next-line no-console
      console.error('Deposit error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [amount, showToast, loadVaultData]);

  const handleWithdrawal = useCallback(async () => {
    if (!amount) {
      showToast('Please enter an amount', 'error');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (amountNum > vaultBalance) {
      showToast('Insufficient vault balance', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await apiService.post<any>('/api/fic-vault/withdraw', { amount: amountNum });
      if (res?.success) {
        showToast(`Successfully withdrew ${amountNum} FIC from your vault`, 'success');
        setAmount('');
        setShowWithdrawModal(false);
        await loadVaultData();
      } else {
        showToast(res?.message || 'Withdrawal failed', 'error');
      }
    } catch (error: any) {
      showToast(error?.response?.data?.message || error?.message || 'Failed to withdraw FIC', 'error');
      // eslint-disable-next-line no-console
      console.error('Withdrawal error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [amount, vaultBalance, showToast, loadVaultData]);

  const vaultInterest = totalInterest > 0 ? totalInterest.toFixed(2) : (vaultBalance * (apy / 100)).toFixed(2);

  // Vault stats data
  const vaultStats = [
    {
      title: 'Total Deposits',
      value: '1,250 FIC',
      description: '',
      icon: (
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'blue'
    },
    {
      title: 'Interest Earned',
      value: `${vaultInterest} FIC`,
      description: '',
      icon: (
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'green'
    },
    {
      title: 'Next Interest Payment',
      value: 'Jun 30, 2023',
      description: '',
      icon: (
        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      color: 'purple'
    }
  ];

  // Security features
  const securityFeatures = [
    {
      title: 'Bank-Grade Encryption',
      description: 'All vault transactions are secured with military-grade encryption.',
      icon: (
        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: 'Multi-Signature',
      description: 'All vault withdrawals require multi-signature verification.',
      icon: (
        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Cold Storage',
      description: '95% of vault funds are stored in offline cold storage wallets.',
      icon: (
        <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">FIC Vault</h1>
          <p className="text-sm sm:text-base text-gray-600">Securely store your FIC tokens and earn interest</p>
        </div>

        {/* Vault Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Vault Balance</h2>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{vaultBalance.toLocaleString()} <span className="text-lg text-gray-500">FIC</span></p>
                <p className="text-sm sm:text-base text-gray-500 mt-1">≈ ${(vaultBalance * 0.1).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Deposit
                </button>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Withdraw
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
            <h3 className="text-base sm:text-lg font-bold mb-2">Vault Benefits</h3>
            <p className="text-xs sm:text-sm opacity-90 mb-4">Earn interest on your stored FIC tokens</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl sm:text-2xl font-bold">5% APR</p>
                <p className="text-xs sm:text-sm opacity-90">Interest rate</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-2">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Vault Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {vaultStats.map((stat, index) => (
            <VaultStatCard
              key={index}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              color={stat.color}
            />
          ))}
        </div>

        {/* Vault History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">Vault History</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>

          <VaultHistoryTable history={vaultHistory} />
        </div>

        {/* Vault Security */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Vault Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <SecurityCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      <ActionModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        title="Deposit to Vault"
        actionButtonText="Deposit FIC"
        onAction={handleDeposit}
      >
        <div>
          <label htmlFor="deposit-amount" className="block text-sm font-medium text-gray-700 mb-1">Amount (FIC)</label>
          <input
            id="deposit-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="mt-1 text-xs sm:text-sm text-gray-500">
            Available: {_balance.toLocaleString()} FIC
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs sm:text-sm text-blue-800">
            <span className="font-medium">5% APR</span> interest will be applied to your deposit.
            Interest is compounded monthly and paid out on the last day of each month.
          </p>
        </div>
      </ActionModal>

      {/* Withdraw Modal */}
      <ActionModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Withdraw from Vault"
        actionButtonText="Withdraw FIC"
        onAction={handleWithdrawal}
      >
        <div>
          <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-700 mb-1">Amount (FIC)</label>
          <input
            id="withdraw-amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="mt-1 text-xs sm:text-sm text-gray-500">
            Available: {vaultBalance.toLocaleString()} FIC
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-medium">Note:</span> Withdrawing funds will forfeit any interest
            that would have been earned on those funds for the current period.
          </p>
        </div>
      </ActionModal>
    </div>
  );
};

export default FICVaultPage;
