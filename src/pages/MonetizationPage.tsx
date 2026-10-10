import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Wallet, 
  Package, 
  BarChart3, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  Receipt,
  Coins,
  PiggyBank,
  Activity,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RevenueStream {
  id: number;
  name: string;
  description: string;
  type: 'subscription' | 'advertising' | 'premium_features' | 'marketplace' | 'merchandise' | 'donation';
  status: 'active' | 'inactive' | 'paused';
  monthlyRevenue: number;
  annualRevenue: number;
  conversionRate: number;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'one_time';
  features: string[];
  status: 'active' | 'inactive' | 'trial';
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Transaction {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  currency: string;
  type: 'payment' | 'refund' | 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  description: string;
  timestamp: string;
  processedBy: string;
}

const MonetizationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'revenue' | 'subscriptions' | 'transactions' | 'billing' | 'analytics'>('revenue');
  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredRevenue, setFilteredRevenue] = useState<RevenueStream[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<SubscriptionPlan[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [monetizationStats, setMonetizationStats] = useState<any>(null);
  const [billingInfo, setBillingInfo] = useState<any>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState<'revenue' | 'subscription'>('revenue');
  const [newRevenue, setNewRevenue] = useState({
    name: '',
    description: '',
    type: 'subscription' as 'subscription' | 'advertising' | 'premium_features' | 'marketplace' | 'merchandise' | 'donation',
    status: 'active' as 'active' | 'inactive' | 'paused'
  });
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    billingCycle: 'monthly' as 'monthly' | 'yearly' | 'one_time',
    features: '',
    status: 'active' as 'active' | 'inactive' | 'trial'
  });

  const navigate = useNavigate();
  const history = { push: (path: string) => navigate(path), replace: (path: string) => navigate(path, { replace: true }) };

  // Simulate loading monetization data
  useEffect(() => {
    const fetchMonetizationData = async () => {
      setLoading(true);
      // Simulating API call
      setTimeout(() => {
        const mockRevenue: RevenueStream[] = [
          {
            id: 1,
            name: 'Premium Subscriptions',
            description: 'Monthly and yearly premium subscriptions',
            type: 'subscription',
            status: 'active',
            monthlyRevenue: 25000,
            annualRevenue: 300000,
            conversionRate: 3.2,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-10-09T00:00:00Z'
          },
          {
            id: 2,
            name: 'Advertising Revenue',
            description: 'Revenue from advertisements on the platform',
            type: 'advertising',
            status: 'active',
            monthlyRevenue: 15000,
            annualRevenue: 180000,
            conversionRate: 1.8,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-10-09T00:00:00Z'
          },
          {
            id: 3,
            name: 'Marketplace Fees',
            description: 'Commission from marketplace transactions',
            type: 'marketplace',
            status: 'active',
            monthlyRevenue: 8000,
            annualRevenue: 96000,
            conversionRate: 2.5,
            createdAt: '2024-03-01T00:00:00Z',
            updatedAt: '2024-10-09T00:00:00Z'
          },
          {
            id: 4,
            name: 'Merchandise Sales',
            description: 'Revenue from branded merchandise',
            type: 'merchandise',
            status: 'inactive',
            monthlyRevenue: 2000,
            annualRevenue: 24000,
            conversionRate: 0.8,
            createdAt: '2024-05-15T00:00:00Z',
            updatedAt: '2024-09-30T00:00:00Z'
          }
        ];

        const mockSubscriptions: SubscriptionPlan[] = [
          {
            id: 1,
            name: 'Basic',
            description: 'Basic access to platform features',
            price: 9.99,
            currency: 'USD',
            billingCycle: 'monthly',
            features: ['Standard support', 'Limited storage', 'Basic tools'],
            status: 'active',
            userCount: 5000,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-10-01T00:00:00Z'
          },
          {
            id: 2,
            name: 'Premium',
            description: 'Full access to all platform features',
            price: 24.99,
            currency: 'USD',
            billingCycle: 'monthly',
            features: ['Priority support', 'Unlimited storage', 'Advanced tools', 'Exclusive content'],
            status: 'active',
            userCount: 2500,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-10-01T00:00:00Z'
          },
          {
            id: 3,
            name: 'Enterprise',
            description: 'For large organizations and teams',
            price: 99.99,
            currency: 'USD',
            billingCycle: 'monthly',
            features: ['24/7 support', 'Unlimited storage', 'Team collaboration', 'Custom integrations'],
            status: 'active',
            userCount: 100,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-10-01T00:00:00Z'
          }
        ];

        const mockTransactions: Transaction[] = [
          {
            id: 1,
            userId: 1,
            userName: 'John Doe',
            amount: 24.99,
            currency: 'USD',
            type: 'payment',
            status: 'completed',
            paymentMethod: 'credit_card',
            description: 'Premium subscription renewal',
            timestamp: '2024-10-09T10:30:00Z',
            processedBy: 'Stripe'
          },
          {
            id: 2,
            userId: 2,
            userName: 'Jane Smith',
            amount: 9.99,
            currency: 'USD',
            type: 'payment',
            status: 'completed',
            paymentMethod: 'paypal',
            description: 'Basic subscription purchase',
            timestamp: '2024-10-09T09:15:00Z',
            processedBy: 'PayPal'
          },
          {
            id: 3,
            userId: 3,
            userName: 'Bob Johnson',
            amount: 99.99,
            currency: 'USD',
            type: 'payment',
            status: 'completed',
            paymentMethod: 'bank_transfer',
            description: 'Enterprise subscription',
            timestamp: '2024-10-09T08:45:00Z',
            processedBy: 'Bank Transfer'
          },
          {
            id: 4,
            userId: 4,
            userName: 'Alice Williams',
            amount: 19.99,
            currency: 'USD',
            type: 'refund',
            status: 'refunded',
            paymentMethod: 'credit_card',
            description: 'Subscription cancellation',
            timestamp: '2024-10-08T15:30:00Z',
            processedBy: 'Stripe'
          }
        ];

        const mockStats = {
          totalRevenue: 480000,
          monthlyRevenue: 40000,
          annualRevenue: 480000,
          revenueGrowth: 12.5,
          totalSubscribers: 7600,
          activeSubscribers: 7200,
          churnRate: 2.3,
          conversionRate: 3.2,
          avgRevenuePerUser: 63.16
        };

        const mockBilling = {
          activeInvoices: 12,
          overdueInvoices: 2,
          pendingPayments: 8,
          totalOutstanding: 2450.75,
          billingCycles: {
            monthly: 7200,
            yearly: 400,
            oneTime: 0
          },
          paymentMethods: {
            creditCard: 65,
            paypal: 25,
            bankTransfer: 10
          }
        };

        setRevenueStreams(mockRevenue);
        setSubscriptionPlans(mockSubscriptions);
        setTransactions(mockTransactions);
        setFilteredRevenue(mockRevenue);
        setFilteredSubscriptions(mockSubscriptions);
        setFilteredTransactions(mockTransactions);
        setMonetizationStats(mockStats);
        setBillingInfo(mockBilling);
        setLoading(false);
      }, 1000);
    };

    fetchMonetizationData();
  }, []);

  // Filter data based on active tab and filters
  useEffect(() => {
    if (activeTab === 'revenue') {
      let result = revenueStreams;

      if (searchTerm) {
        result = result.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterType !== 'all') {
        result = result.filter(item => item.type === filterType);
      }

      if (filterStatus !== 'all') {
        result = result.filter(item => item.status === filterStatus);
      }

      setFilteredRevenue(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'subscriptions') {
      let result = subscriptionPlans;

      if (searchTerm) {
        result = result.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filterStatus !== 'all') {
        result = result.filter(item => item.status === filterStatus);
      }

      setFilteredSubscriptions(result);
      setCurrentPage(1); // Reset to first page when filtering
    } else if (activeTab === 'transactions') {
      let result = transactions;

      if (searchTerm) {
        result = result.filter(item => 
          item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredTransactions(result);
      setCurrentPage(1); // Reset to first page when filtering
    }
  }, [searchTerm, filterType, filterStatus, activeTab, revenueStreams, subscriptionPlans, transactions]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  let currentItems: any[] = [];
  let totalPages = 0;
  
  if (activeTab === 'revenue') {
    currentItems = filteredRevenue.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredRevenue.length / itemsPerPage);
  } else if (activeTab === 'subscriptions') {
    currentItems = filteredSubscriptions.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
  } else if (activeTab === 'transactions') {
    currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
    totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  }

  const handleCreateRevenue = async () => {
    try {
      // In a real implementation, this would call the API to create a revenue stream
      console.log('Creating revenue stream:', newRevenue);
      setShowCreateModal(false);
      // Reset form
      setNewRevenue({
        name: '',
        description: '',
        type: 'subscription',
        status: 'active'
      });
    } catch (error) {
      console.error('Error creating revenue stream:', error);
    }
  };

  const handleCreateSubscription = async () => {
    try {
      // In a real implementation, this would call the API to create a subscription plan
      console.log('Creating subscription plan:', newSubscription);
      setShowCreateModal(false);
      // Reset form
      setNewSubscription({
        name: '',
        description: '',
        price: 0,
        currency: 'USD',
        billingCycle: 'monthly',
        features: '',
        status: 'active'
      });
    } catch (error) {
      console.error('Error creating subscription plan:', error);
    }
  };

  const handleToggleSubscriptionStatus = async (planId: number) => {
    try {
      // In a real implementation, this would call the API to toggle subscription status
      console.log('Toggling subscription status:', planId);
      setSubscriptionPlans(subscriptionPlans.map(plan => 
        plan.id === planId ? {...plan, status: plan.status === 'active' ? 'inactive' : 'active'} : plan
      ));
      setFilteredSubscriptions(filteredSubscriptions.map(plan => 
        plan.id === planId ? {...plan, status: plan.status === 'active' ? 'inactive' : 'active'} : plan
      ));
    } catch (error) {
      console.error('Error toggling subscription status:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'subscription': return 'bg-blue-100 text-blue-800';
      case 'advertising': return 'bg-green-100 text-green-800';
      case 'premium_features': return 'bg-purple-100 text-purple-800';
      case 'marketplace': return 'bg-yellow-100 text-yellow-800';
      case 'merchandise': return 'bg-red-100 text-red-800';
      case 'donation': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card': return <CreditCard className="h-4 w-4 text-blue-500" />;
      case 'paypal': return <Wallet className="h-4 w-4 text-blue-500" />;
      case 'bank_transfer': return <Coins className="h-4 w-4 text-blue-500" />;
      default: return <DollarSign className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 ml-3">Monetization Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                onClick={() => {
                  setModalType('revenue');
                  setShowCreateModal(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Revenue Stream
              </button>
              <button 
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center"
                onClick={() => {
                  setModalType('subscription');
                  setShowCreateModal(true);
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Subscription
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {monetizationStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                  <p className="text-2xl font-semibold text-gray-900">${monetizationStats.monthlyRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenue Growth</p>
                  <p className="text-2xl font-semibold text-gray-900">{monetizationStats.revenueGrowth}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
                  <p className="text-2xl font-semibold text-gray-900">{monetizationStats.activeSubscribers.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-100">
                  <Activity className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-semibold text-gray-900">{monetizationStats.conversionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('revenue')}
              className={`${
                activeTab === 'revenue'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Revenue Streams
            </button>
            <button
              onClick={() => setActiveTab('subscriptions')}
              className={`${
                activeTab === 'subscriptions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Package className="h-4 w-4 mr-2" />
              Subscriptions
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Receipt className="h-4 w-4 mr-2" />
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`${
                activeTab === 'billing'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <Wallet className="h-4 w-4 mr-2" />
              Billing
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </button>
          </nav>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {(activeTab === 'revenue' || activeTab === 'subscriptions') && (
              <>
                {activeTab === 'revenue' && (
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="subscription">Subscription</option>
                    <option value="advertising">Advertising</option>
                    <option value="premium_features">Premium Features</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="merchandise">Merchandise</option>
                    <option value="donation">Donation</option>
                  </select>
                )}
                
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="paused">Paused</option>
                  <option value="trial">Trial</option>
                </select>
              </>
            )}
            
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">
                {activeTab === 'revenue' ? `${filteredRevenue.length} streams` : 
                 activeTab === 'subscriptions' ? `${filteredSubscriptions.length} plans` : 
                 `${filteredTransactions.length} transactions`}
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Revenue Streams Tab */}
            {activeTab === 'revenue' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stream
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Monthly Revenue
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Annual Revenue
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Conversion Rate
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                            No revenue streams found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as RevenueStream[]).map((stream) => (
                          <tr key={stream.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{stream.name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">{stream.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(stream.type)}`}>
                                {stream.type.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${stream.monthlyRevenue.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${stream.annualRevenue.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {stream.conversionRate}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(stream.status)}`}>
                                {stream.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/monetization/revenue/${stream.id}/details`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                  className="text-green-600 hover:text-green-900"
                                  onClick={() => {
                                    // Edit revenue stream
                                    console.log('Edit revenue stream:', stream.id);
                                  }}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <div className="relative">
                                  <button className="text-gray-600 hover:text-gray-900">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/monetization/revenue/${stream.id}/analytics`)}
                                    >
                                      View Analytics
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/monetization/revenue/${stream.id}/performance`)}
                                    >
                                      Performance Report
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Subscriptions Tab */}
            {activeTab === 'subscriptions' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Billing Cycle
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Users
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Features
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                            No subscription plans found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as SubscriptionPlan[]).map((plan) => (
                          <tr key={plan.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">{plan.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${plan.price}/{plan.billingCycle}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {plan.billingCycle}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {plan.userCount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <div className="flex flex-wrap gap-1">
                                {plan.features.slice(0, 2).map((feature, idx) => (
                                  <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {feature}
                                  </span>
                                ))}
                                {plan.features.length > 2 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    +{plan.features.length - 2} more
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(plan.status)}`}>
                                {plan.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/monetization/subscriptions/${plan.id}/details`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button 
                                  className={`${plan.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                                  onClick={() => handleToggleSubscriptionStatus(plan.id)}
                                >
                                  {plan.status === 'active' ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                </button>
                                <div className="relative">
                                  <button className="text-gray-600 hover:text-gray-900">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/monetization/subscriptions/${plan.id}/edit`)}
                                    >
                                      Edit Plan
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/monetization/subscriptions/${plan.id}/users`)}
                                    >
                                      Manage Users
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/monetization/subscriptions/${plan.id}/analytics`)}
                                    >
                                      View Analytics
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="bg-white rounded-xl shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                            No transactions found
                          </td>
                        </tr>
                      ) : (
                        (currentItems as Transaction[]).map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{transaction.userName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${transaction.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(transaction.type)}`}>
                                {transaction.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                {getPaymentMethodIcon(transaction.paymentMethod)}
                                <span className="ml-1 capitalize">{transaction.paymentMethod.replace(/_/g, ' ')}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                                {transaction.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                              {transaction.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(transaction.timestamp).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button 
                                  className="text-blue-600 hover:text-blue-900"
                                  onClick={() => history.push(`/dashboard/monetization/transactions/${transaction.id}/details`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <div className="relative">
                                  <button className="text-gray-600 hover:text-gray-900">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </button>
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden">
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/monetization/transactions/${transaction.id}/invoice`)}
                                    >
                                      View Invoice
                                    </button>
                                    <button 
                                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                      onClick={() => history.push(`/dashboard/monetization/transactions/${transaction.id}/user-profile`)}
                                    >
                                      View User Profile
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && billingInfo && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-blue-100">
                        <Receipt className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Invoices</p>
                        <p className="text-2xl font-semibold text-gray-900">{billingInfo.activeInvoices}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-yellow-100">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Overdue Invoices</p>
                        <p className="text-2xl font-semibold text-gray-900">{billingInfo.overdueInvoices}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-purple-100">
                        <Wallet className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                        <p className="text-2xl font-semibold text-gray-900">{billingInfo.pendingPayments}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-red-100">
                        <DollarSign className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Outstanding Amount</p>
                        <p className="text-2xl font-semibold text-gray-900">${billingInfo.totalOutstanding.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Cycles</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly</span>
                        <span className="font-medium">{billingInfo.billingCycles.monthly}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Yearly</span>
                        <span className="font-medium">{billingInfo.billingCycles.yearly}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">One-Time</span>
                        <span className="font-medium">{billingInfo.billingCycles.oneTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Credit Card</span>
                        <span className="font-medium">{billingInfo.paymentMethods.creditCard}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">PayPal</span>
                        <span className="font-medium">{billingInfo.paymentMethods.paypal}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bank Transfer</span>
                        <span className="font-medium">{billingInfo.paymentMethods.bankTransfer}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Invoices</h3>
                  <div className="h-64 flex items-center justify-center">
                    <Receipt className="h-16 w-16 text-gray-300" />
                    <p className="ml-4 text-gray-500">Recent invoices list would appear here</p>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && monetizationStats && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Revenue Overview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Revenue</span>
                        <span className="font-medium">${monetizationStats.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Monthly Revenue</span>
                        <span className="font-medium">${monetizationStats.monthlyRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Annual Revenue</span>
                        <span className="font-medium">${monetizationStats.annualRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Revenue Growth</span>
                        <span className="font-medium">{monetizationStats.revenueGrowth}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Subscriber Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Subscribers</span>
                        <span className="font-medium">{monetizationStats.totalSubscribers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Subscribers</span>
                        <span className="font-medium">{monetizationStats.activeSubscribers.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Churn Rate</span>
                        <span className="font-medium">{monetizationStats.churnRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">ARPU</span>
                        <span className="font-medium">${monetizationStats.avgRevenuePerUser.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Top Revenue Streams</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Premium Subscriptions', revenue: 25000, percentage: 62.5 },
                        { name: 'Advertising Revenue', revenue: 15000, percentage: 37.5 }
                      ].map((stream, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-sm text-gray-600 truncate">{stream.name}</span>
                          <span className="font-medium">${stream.revenue.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Trend</h3>
                    <div className="h-32 flex items-end space-x-1">
                      {monetizationStats.monthlyTrend?.map((month: any, index: number) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className="w-full bg-blue-500 rounded-t" 
                            style={{ height: `${(month.revenue / Math.max(...monetizationStats.monthlyTrend.map((d: any) => d.revenue))) * 100}%` }}
                          ></div>
                          <span className="text-xs mt-1">{month.month}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Subscription Breakdown</h3>
                  <div className="h-64 flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-gray-300" />
                    <p className="ml-4 text-gray-500">Subscription breakdown visualization would appear here</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {['revenue', 'subscriptions', 'transactions'].includes(activeTab) && totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(indexOfLastItem, (activeTab === 'revenue' ? filteredRevenue : activeTab === 'subscriptions' ? filteredSubscriptions : filteredTransactions).length)}</span> of{' '}
                  <span className="font-medium">{(activeTab === 'revenue' ? filteredRevenue : activeTab === 'subscriptions' ? filteredSubscriptions : filteredTransactions).length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-1" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 ? 'text-gray-400' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages ? 'text-gray-400' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {modalType === 'revenue' ? 'Create New Revenue Stream' : 'Create New Subscription Plan'}
                </h3>
                <button 
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowCreateModal(false)}
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              {modalType === 'revenue' ? (
                <form onSubmit={(e) => { e.preventDefault(); handleCreateRevenue(); }}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="revenue-name">
                      Name
                    </label>
                    <input
                      type="text"
                      id="revenue-name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={newRevenue.name}
                      onChange={(e) => setNewRevenue({...newRevenue, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="revenue-description">
                      Description
                    </label>
                    <textarea
                      id="revenue-description"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={newRevenue.description}
                      onChange={(e) => setNewRevenue({...newRevenue, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="revenue-type">
                      Type
                    </label>
                    <select
                      id="revenue-type"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={newRevenue.type}
                      onChange={(e) => setNewRevenue({...newRevenue, type: e.target.value as any})}
                    >
                      <option value="subscription">Subscription</option>
                      <option value="advertising">Advertising</option>
                      <option value="premium_features">Premium Features</option>
                      <option value="marketplace">Marketplace</option>
                      <option value="merchandise">Merchandise</option>
                      <option value="donation">Donation</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="revenue-status">
                      Status
                    </label>
                    <select
                      id="revenue-status"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={newRevenue.status}
                      onChange={(e) => setNewRevenue({...newRevenue, status: e.target.value as any})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="paused">Paused</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                      Create Revenue Stream
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); handleCreateSubscription(); }}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sub-name">
                      Name
                    </label>
                    <input
                      type="text"
                      id="sub-name"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={newSubscription.name}
                      onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sub-description">
                      Description
                    </label>
                    <textarea
                      id="sub-description"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={newSubscription.description}
                      onChange={(e) => setNewSubscription({...newSubscription, description: e.target.value})}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sub-price">
                        Price
                      </label>
                      <input
                        type="number"
                        id="sub-price"
                        step="0.01"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={newSubscription.price}
                        onChange={(e) => setNewSubscription({...newSubscription, price: parseFloat(e.target.value) || 0})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sub-currency">
                        Currency
                      </label>
                      <select
                        id="sub-currency"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={newSubscription.currency}
                        onChange={(e) => setNewSubscription({...newSubscription, currency: e.target.value})}
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sub-cycle">
                      Billing Cycle
                    </label>
                    <select
                      id="sub-cycle"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={newSubscription.billingCycle}
                      onChange={(e) => setNewSubscription({...newSubscription, billingCycle: e.target.value as any})}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                      <option value="one_time">One-Time</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sub-features">
                      Features (comma separated)
                    </label>
                    <textarea
                      id="sub-features"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={newSubscription.features}
                      onChange={(e) => setNewSubscription({...newSubscription, features: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sub-status">
                      Status
                    </label>
                    <select
                      id="sub-status"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={newSubscription.status}
                      onChange={(e) => setNewSubscription({...newSubscription, status: e.target.value as any})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="trial">Trial</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none"
                      onClick={() => setShowCreateModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none"
                    >
                      Create Subscription Plan
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonetizationPage;