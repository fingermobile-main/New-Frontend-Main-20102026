import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useAppContext } from "../contexts/AppContext";

// --- Subcomponent: Vault Stats Card ---
interface VaultStatCardProps {
  title: string;
  value: string;
  description: string;
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

VaultStatCard.displayName = "VaultStatCard";

// --- Subcomponent: Vault History Table ---
interface VaultHistoryTableProps {
  history: Array<{
    id: number;
    type: string;
    amount: number;
    date: string;
    description: string;
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
                {transaction.description}
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

VaultHistoryTable.displayName = "VaultHistoryTable";

// --- Subcomponent: Vault Security Card ---
interface SecurityCardProps {
  title: string;
  description: string;
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

SecurityCard.displayName = "SecurityCard";

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

ActionModal.displayName = "ActionModal";

const FICVaultPage: React.FC = () => {
  const { balance: _balance } = useWeb3();
  const { ficBalance: _ficBalance, showToast } = useAppContext();
  const [vaultBalance, setVaultBalance] = React.useState(1250); // Mock vault balance
  const [amount, setAmount] = React.useState('');
  const [showDepositModal, setShowDepositModal] = React.useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = React.useState(false);
  const [showGiftModal, setShowGiftModal] = React.useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = React.useState(false);

  const onLike = React.useCallback(async (_postId: string) => {
    showToast('Like action triggered', 'info');
  }, [showToast]);

  const onAddComment = React.useCallback(async (_postId: string, _comment: string) => {
    showToast('Add comment action triggered', 'info');
  }, [showToast]);

  const onOpenGiftModal = React.useCallback(() => {
    setShowGiftModal(true);
    showToast('Gift modal opened', 'info');
  }, [showToast]);

  const onOpenPaylinkModal = React.useCallback(() => {
    setShowPaylinkModal(true);
    showToast('Paylink modal opened', 'info');
  }, [showToast]);

  const onVote = React.useCallback(async (_postId: string, _voteType: unknown) => {
    showToast('Vote action triggered', 'info');
  }, [showToast]);

  const handleDeletePost = React.useCallback(async (_postId?: string) => {
    showToast('Delete post action triggered', 'info');
  }, [showToast]);

  const handleTokenizePost = React.useCallback(async (_postId?: string) => {
    showToast('Tokenize post action triggered', 'info');
  }, [showToast]);

  const handleAiAssist = React.useCallback(async (..._args: unknown[]) => {
    showToast('AI assist action triggered', 'info');
    return { success: true, message: 'AI assist completed' };
  }, [showToast]);

  const [vaultHistory, setVaultHistory] = React.useState([
    { id: 1, type: 'deposit', amount: 500, date: '2023-06-10', description: 'Weekly savings' },
    { id: 2, type: 'interest', amount: 25, date: '2023-06-05', description: 'Vault interest' },
    { id: 3, type: 'deposit', amount: 500, date: '2023-06-01', description: 'Monthly deposit' },
    { id: 4, type: 'interest', amount: 20, date: '2023-05-28', description: 'Vault interest' },
    { id: 5, type: 'withdrawal', amount: 250, date: '2023-05-20', description: 'Emergency withdrawal' }
  ]);

  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleDeposit = React.useCallback(async () => {
    if (!amount) {
      showToast('Please enter an amount', 'error');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (amountNum > _balance) {
      showToast('Insufficient balance', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVaultBalance(prev => prev + amountNum);
      showToast(`Successfully deposited ${amountNum} FIC to your vault`, 'success');
      setAmount('');
      setShowDepositModal(false);
      
      // Add to history
      const newTransaction = {
        id: vaultHistory.length + 1,
        type: 'deposit',
        amount: amountNum,
        date: new Date().toISOString().split('T')[0],
        description: 'Manual deposit'
      };

      setVaultHistory([newTransaction, ...vaultHistory]);
    } catch (error) {
      showToast('Failed to deposit FIC. Please try again.', 'error');
      console.error('Deposit error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [amount, _balance, showToast, vaultHistory]);

  const handleWithdrawal = React.useCallback(async () => {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVaultBalance(prev => prev - amountNum);
      showToast(`Successfully withdrew ${amountNum} FIC from your vault`, 'success');
      setAmount('');
      setShowWithdrawModal(false);
      
      // Add to history
      const newTransaction = {
        id: vaultHistory.length + 1,
        type: 'withdrawal',
        amount: amountNum,
        date: new Date().toISOString().split('T')[0],
        description: 'Manual withdrawal'
      };

      setVaultHistory([newTransaction, ...vaultHistory]);
    } catch (error) {
      showToast('Failed to withdraw FIC. Please try again.', 'error');
      console.error('Withdrawal error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [amount, vaultBalance, showToast, vaultHistory]);

  // Calculate vault interest (mock)
  const vaultInterest = (vaultBalance * 0.05).toFixed(2); // 5% annual interest

  // Vault stats data
  const vaultStats = [
    {
      title: "Total Deposits",
      value: "1,250 FIC",
      description: "",
      icon: (
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "blue"
    },
    {
      title: "Interest Earned",
      value: `${vaultInterest} FIC`,
      description: "",
      icon: (
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "green"
    },
    {
      title: "Next Interest Payment",
      value: "Jun 30, 2023",
      description: "",
      icon: (
        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      color: "purple"
    }
  ];

  // Security features
  const securityFeatures = [
    {
      title: "Bank-Grade Encryption",
      description: "All vault transactions are secured with military-grade encryption.",
      icon: (
        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: "Multi-Signature",
      description: "All vault withdrawals require multi-signature verification.",
      icon: (
        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Cold Storage",
      description: "95% of vault funds are stored in offline cold storage wallets.",
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