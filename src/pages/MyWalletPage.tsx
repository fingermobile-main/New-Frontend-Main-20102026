import React from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useAppContext } from "../contexts/AppContext";
import { GiftIcon, LinkIcon } from '../icons';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  from?: string;
  to?: string;
  date: string;
  description: string;
}

const MyWalletPage: React.FC = () => {
  const web3Data = useWeb3();
  const { balance, sendFIC } = web3Data;
  const { ficBalance, showToast } = useAppContext();
  const [recipient, setRecipient] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [showSendModal, setShowSendModal] = React.useState(false);
  const [showGiftModal, setShowGiftModal] = React.useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);
  const [giftAmount, setGiftAmount] = React.useState('');
  const [paylinkAmount, setPaylinkAmount] = React.useState('');
  const [paylinkDescription, setPaylinkDescription] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const [transactionHistory, setTransactionHistory] = React.useState<Transaction[]>([
    { id: 1, type: 'received', amount: 250, from: 'Alex Johnson', date: '2023-06-15', description: 'Content monetization' },
    { id: 2, type: 'sent', amount: 50, to: 'Taylor Swift', date: '2023-06-12', description: 'Gift' },
    { id: 3, type: 'received', amount: 100, from: 'Platform Rewards', date: '2023-06-10', description: 'Loyalty rewards' },
    { id: 4, type: 'sent', amount: 25, to: 'Music Store', date: '2023-06-08', description: 'Premium content purchase' },
    { id: 5, type: 'received', amount: 75, from: 'DJ Pulse', date: '2023-06-05', description: 'Collaboration payment' }
  ]);

  const handleSendGift = async () => {
    if (!selectedTransaction || !giftAmount) {
      showToast('Please enter a valid gift amount', 'error');
      return;
    }

    const amount = parseFloat(giftAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (amount > ficBalance) {
      showToast('Insufficient balance for this gift', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const newTransaction: Transaction = {
        id: transactionHistory.length + 1,
        type: 'sent',
        amount: amount,
        to: selectedTransaction.from || selectedTransaction.to,
        date: new Date().toISOString().split('T')[0],
        description: 'Gift sent'
      };

      setTransactionHistory([newTransaction, ...transactionHistory]);
      showToast('Gift sent successfully', 'success');
      setShowGiftModal(false);
      setGiftAmount('');
      setSelectedTransaction(null);
    } catch (error) {
      showToast('Failed to send gift', 'error');
    }
    setIsProcessing(false);
  };

  const handleCreatePaylink = async () => {
    if (!selectedTransaction || !paylinkAmount || !paylinkDescription) {
      showToast('Please fill in all paylink details', 'error');
      return;
    }

    const amount = parseFloat(paylinkAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (amount > ficBalance) {
      showToast('Insufficient balance for this paylink', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const newTransaction: Transaction = {
        id: transactionHistory.length + 1,
        type: 'sent',
        amount: amount,
        to: 'Paylink',
        date: new Date().toISOString().split('T')[0],
        description: paylinkDescription
      };

      setTransactionHistory([newTransaction, ...transactionHistory]);
      showToast('Paylink created successfully', 'success');
      setShowPaylinkModal(false);
      setPaylinkAmount('');
      setPaylinkDescription('');
      setSelectedTransaction(null);
    } catch (error) {
      showToast('Failed to create paylink', 'error');
    }
    setIsProcessing(false);
  };

  const handleSendFICInternal = async () => {
    if (!recipient || !amount) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (amountNum > ficBalance) {
      showToast('Insufficient balance', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await sendFIC?.(recipient, amountNum);
      showToast(`Successfully sent ${amountNum} FIC to ${recipient}`, 'success');
      setRecipient('');
      setAmount('');
      setShowSendModal(false);
      
      const newTransaction: Transaction = {
        id: transactionHistory.length + 1,
        type: 'sent',
        amount: amountNum,
        to: recipient,
        date: new Date().toISOString().split('T')[0],
        description: 'Direct transfer'
      };

      setTransactionHistory([newTransaction, ...transactionHistory]);
    } catch (error) {
      showToast('Transaction failed. Please try again.', 'error');
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600">Manage your FIC tokens and transaction history</p>
        </div>

        {/* Wallet Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Total Balance</h2>
                <p className="text-3xl font-bold text-gray-900">{balance.toLocaleString()} <span className="text-lg text-gray-500">FIC</span></p>
                <p className="text-gray-500 mt-1">≈ ${(balance * 0.1).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</p>
              </div>
              {/* <div className="flex space-x-3">
                <button onClick={() => setShowSendModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center" aria-label="Button"><svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Receive
                </button>
              </div> */}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <h3 className="font-bold mb-2">FIC Token</h3>
            <p className="text-sm opacity-90 mb-4">The official currency of the FingerMobile ecosystem</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">1 FIC = $0.10</p>
                <p className="text-sm opacity-90">Stable value</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-2">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Buy FIC</span>
            </div>
          </button>
          
          <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Withdraw</span>
            </div>
          </button>
          
          <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Swap</span>
            </div>
          </button>
          
          <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mb-2">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Gift Cards</span>
            </div>
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactionHistory.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          transaction.type === 'received' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {transaction.type === 'received' ? (
                            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                            </svg>
                          )}
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-900 capitalize">{transaction.type}</span>
                      </div>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.type === 'received' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'received' ? '+' : '-'}{transaction.amount} FIC
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.description}
                      <div className="text-xs text-gray-400 mt-1">
                        {transaction.from ? `From: ${transaction.from}` : 
                         transaction.to ? `To: ${transaction.to}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-4">
                        <button onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowGiftModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <GiftIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => {
                            setSelectedTransaction(transaction);
                            setShowPaylinkModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <LinkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Send Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Send Gift</h3>
              <button onClick={() => {
                  setShowGiftModal(false);
                  setGiftAmount('');
                  setSelectedTransaction(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (FIC)</label>
                <input type="number"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="mt-1 text-sm text-gray-500">
                  Available: {ficBalance.toLocaleString()} FIC
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button onClick={() => {
                    setShowGiftModal(false);
                    setGiftAmount('');
                    setSelectedTransaction(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button onClick={handleSendGift}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Sending...' : 'Send Gift'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paylink Modal */}
      {showPaylinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create Paylink</h3>
              <button onClick={() => {
                  setShowPaylinkModal(false);
                  setPaylinkAmount('');
                  setPaylinkDescription('');
                  setSelectedTransaction(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (FIC)</label>
                <input type="number"
                  value={paylinkAmount}
                  onChange={(e) => setPaylinkAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text"
                  value={paylinkDescription}
                  onChange={(e) => setPaylinkDescription(e.target.value)}
                  placeholder="e.g. For content access"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button onClick={() => {
                    setShowPaylinkModal(false);
                    setPaylinkAmount('');
                    setPaylinkDescription('');
                    setSelectedTransaction(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button onClick={handleCreatePaylink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Creating...' : 'Create Paylink'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWalletPage;
