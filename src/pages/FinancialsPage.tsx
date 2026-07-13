import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import StatCard from '../components/StatCard';

// --- Subcomponent: Decoupled Quick Actions Grid ---
interface QuickAction {
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
}

interface QuickActionsGridProps {
  actions: QuickAction[];
}

const QuickActionsGrid: React.FC<QuickActionsGridProps> = React.memo(({ actions }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {actions.map((action, index) => (
        <button key={index} className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            {action.icon}
          </div>
          <span className="text-sm sm:text-base font-medium">{action.title}</span>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 text-center">{action.description}</p>
        </button>
      ))}
    </div>
  );
});

QuickActionsGrid.displayName = "QuickActionsGrid";

// --- Subcomponent: Decoupled Exchange Rate Panel ---
interface ExchangeRatePanelProps {
  ficExchangeRate: string;
  lastUpdated: string;
}

const ExchangeRatePanel: React.FC<ExchangeRatePanelProps> = React.memo(({ ficExchangeRate, lastUpdated }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-6">FIC Exchange Rate</h2>
      <div className="text-center">
        <p className="text-xl sm:text-2xl font-bold text-gray-900">{ficExchangeRate}</p>
        <p className="text-sm sm:text-base text-gray-500 mt-2">Current exchange rate</p>
        <p className="text-xs sm:text-sm text-blue-700">Last updated: {lastUpdated}</p>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm sm:text-base font-medium text-blue-800 mb-2">Did you know?</h3>
          <p className="text-xs sm:text-sm text-blue-700">
            You can exchange your FIC tokens for USD at any time. 
            Minimum withdrawal amount is 100 FIC.
          </p>
        </div>
      </div>
    </div>
  );
});

ExchangeRatePanel.displayName = "ExchangeRatePanel";

// --- Subcomponent: Time Range Selector ---
interface TimeRangeSelectorProps {
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = React.memo(({ timeRange, onTimeRangeChange }) => {
  const ranges = ['7d', '30d', '90d'];
  return (
    <div className="flex gap-2">
      {ranges.map((range) => (
        <button
          key={range}
          className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${timeRange === range ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
          onClick={() => onTimeRangeChange(range)}
        >
          {range}
        </button>
      ))}
    </div>
  );
});

TimeRangeSelector.displayName = "TimeRangeSelector";

// --- Subcomponent: Transaction History Table ---
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: string;
  type: 'credit' | 'debit';
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = React.memo(({ transactions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th scope="col" className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th scope="col" className="px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Type</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-900">{transaction.date}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm sm:text-base font-medium text-gray-900">{transaction.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-500">
                <span className={transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                  {transaction.amount}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-500">
                <span className={`px-2 inline-flex text-xs sm:text-sm leading-5 font-semibold rounded-full ${
                  transaction.type === 'credit' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

TransactionHistory.displayName = "TransactionHistory";

// --- Main Container Page Component ---
const FinancialsPage: React.FC = () => {
  const { balance } = useWeb3();
  const [timeRange, setTimeRange] = React.useState('30d');

  // Mock data for financial stats
  const convertFICtoUSD = (fic: number) => fic * 0.1; // Assuming 1 FIC = $0.10
  
  const financialStats = [
    { title: 'Total Balance', value: `${balance.toLocaleString()} FIC`, subtitle: `≈ $${convertFICtoUSD(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`, color: 'blue' },
    { title: 'Earnings (This Month)', value: '1,250 FIC', subtitle: '≈ $125.00 USD', color: 'green' },
    { title: 'Pending Withdrawals', value: '250 FIC', subtitle: '≈ $25.00 USD', color: 'yellow' },
    { title: 'Total Transactions', value: '42', subtitle: 'This month', color: 'indigo' }
  ];

  // Mock transaction history
  const transactions: Transaction[] = [
    { id: '1', date: '2023-06-15', description: 'Content monetization payout', amount: '+450 FIC', type: 'credit' },
    { id: '2', date: '2023-06-12', description: 'Gift received from member', amount: '+25 FIC', type: 'credit' },
    { id: '3', date: '2023-06-10', description: 'Token purchase', amount: '-120 FIC', type: 'debit' },
    { id: '4', date: '2023-06-08', description: 'Subscription payment', amount: '-50 FIC', type: 'debit' },
    { id: '5', date: '2023-06-05', description: 'Content monetization payout', amount: '+320 FIC', type: 'credit' },
    { id: '6', date: '2023-06-01', description: 'Withdrawal to wallet', amount: '-500 FIC', type: 'debit' }
  ];

  const quickActions: QuickAction[] = [
    {
      title: "Withdraw Funds",
      description: "Transfer FIC to your wallet",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      color: "blue-300"
    },
    {
      title: "Send Gift",
      description: "Gift FIC to other members",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>,
      color: "green-300"
    },
    {
      title: "View Analytics",
      description: "Detailed financial reports",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>,
      color: "purple-300"
    },
    {
      title: "Financial Settings",
      description: "Manage payout preferences",
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>,
      color: "indigo-300"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Financial Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your earnings, transactions, and financial settings</p>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {financialStats.map((stat, index) => (
            <StatCard 
              key={index}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              color={stat.color as string}
            />
          ))}
        </div>

        {/* Financial Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold">Quick Actions</h2>
            </div>
            
            <QuickActionsGrid actions={quickActions} />
          </div>
          
          <ExchangeRatePanel 
            ficExchangeRate="10 FIC = $1 USD" 
            lastUpdated="5 minutes ago" 
          />
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold">Transaction History</h2>
            <TimeRangeSelector timeRange={timeRange} onTimeRangeChange={setTimeRange} />
          </div>
          
          <TransactionHistory transactions={transactions} />
          
          <div className="mt-6 flex justify-center">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-xs sm:text-sm">
              View All Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; // End of component function

export default FinancialsPage;