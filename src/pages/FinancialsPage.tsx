import React, { useState } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import StatCard from '../components/StatCard';

// --- Subcomponent: Decoupled Quick Action Card ---
interface QuickAction {
  title: string;
  description?: string;
  icon: JSX.Element;
  onClick: () => void;
}

const QuickActionCard: React.FC<QuickAction> = ({ title, description, icon, onClick }) => (
  <div 
    className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        {description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
      </div>
    </div>
  </div>
);

// --- Main Component ---
const FinancialsPage: React.FC = () => {
  const { balance } = useWeb3();
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'analytics'>('overview');

  // Mock data for stats
  const statsData = [
    { title: "Total Balance", value: "₦1,250,000", change: "+12.5%", icon: "💰" },
    { title: "Monthly Income", value: "₦340,000", change: "+8.2%", icon: "📈" },
    { title: "Expenses", value: "₦120,500", change: "-3.1%", icon: "📉" },
    { title: "Pending Payouts", value: "₦45,000", change: "0.0%", icon: "⏳" },
  ];

  // Mock data for quick actions
  const quickActions: QuickAction[] = [
    {
      title: "Send Money",
      description: "Transfer to contacts",
      icon: <span className="text-lg">💸</span>,
      onClick: () => console.log("Send Money clicked")
    },
    {
      title: "Request Payment",
      description: "Ask for money",
      icon: <span className="text-lg">🤲</span>,
      onClick: () => console.log("Request Payment clicked")
    },
    {
      title: "Top Up",
      description: "Add funds to wallet",
      icon: <span className="text-lg">💳</span>,
      onClick: () => console.log("Top Up clicked")
    },
    {
      title: "Pay Bills",
      description: "Utilities, subscriptions",
      icon: <span className="text-lg">🧾</span>,
      onClick: () => console.log("Pay Bills clicked")
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 pb-20">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Financials</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your finances</p>
      </header>

      {/* Stats Overview */}
      <section className="mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {statsData.map((stat, index) => (
            <StatCard key={index} title={stat.title} value={stat.value} subtitle={stat.change} icon={stat.icon} />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => (
            <QuickActionCard 
              key={index}
              title={action.title}
              description={action.description}
              icon={action.icon}
              onClick={action.onClick}
            />
          ))}
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        {(['overview', 'transactions', 'analytics'] as const).map(tab => (
          <button
            key={tab}
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === tab
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        {activeTab === 'overview' && (
          <div>
            <h3 className="font-semibold mb-3">Account Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">Current Balance</span>
                <span className="font-semibold">₦{balance || "0.00"}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">Available Funds</span>
                <span className="font-semibold">₦1,205,000</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">Pending Transactions</span>
                <span className="font-semibold">₦45,000</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div>
            <h3 className="font-semibold mb-3">Recent Transactions</h3>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <span className="text-green-600 dark:text-green-400">✓</span>
                    </div>
                    <div>
                      <p className="font-medium">Transaction #{i}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Today, 10:30 AM</p>
                    </div>
                  </div>
                  <p className="font-semibold">₦25,000</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h3 className="font-semibold mb-3">Financial Analytics</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Analytics chart would go here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialsPage;