import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import apiService, { ApiService } from '../../services/apiService';


interface Transaction {
  id: string;
  amount: number;
  recipient: string;
  date: string;
  status: string;
}

const Wallet: React.FC<{
  ficBalance: number;
  transactions: Transaction[];
  onSendFic: (amount: number, recipient: string) => void;
  onAddFunds: (amount: number) => void;
}> = ({ ficBalance, transactions, onSendFic, onAddFunds }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-4">Wallet Overview</h2>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-500">Available Balance</p>
          <p className="text-3xl font-bold text-brand-blue">{ficBalance.toLocaleString()} FIC</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => onAddFunds(10)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Add $10
          </button>
          <button onClick={() => onSendFic(10, 'example')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Send 10 FIC
          </button>
        </div>
      </div>
    </div>
  );
};

const MyWalletPage: React.FC = () => {
    const { ficBalance, showToast } = useAppContext();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await (ApiService as any).getTransactions?.();
                if (response?.data) {
                    setTransactions(response.data);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
                showToast('Failed to load transactions.', 'error');
            }
        };

        fetchTransactions();
    }, [showToast]);

    const handleSendFic = async (amount: number, recipient: string) => {
        if (amount <= 0) {
            showToast('Amount must be positive.');
            return;
        }

        if (amount > ficBalance) {
            showToast('Insufficient FIC balance.');
            return;
        }

        if (!recipient) {
            showToast('Recipient cannot be empty.');
            return;
        }

        try {
            // Validate recipient
            const membersResponse = await (ApiService as any).getMembers?.({ membername: recipient });
            if (membersResponse.data && membersResponse.data.length === 0) {
                showToast('Recipient not found.', 'error');
                return;
            }

            await (ApiService as any).sendFic?.(amount, recipient);
            showToast(`Successfully sent ${amount} FIC to ${recipient}`, 'success');
        } catch (error) {
            console.error('Error sending FIC:', error);
            showToast('Failed to send FIC. Please try again.', 'error');
        }
    };

    const handleAddFunds = async (amount: number) => {
        if (amount <= 0) {
            showToast('Amount must be positive.');
            return;
        }

        try {
            await (ApiService as any).addFunds?.(amount);
            const ficAmount = amount * 10;
            showToast(`Successfully added $${amount} (${ficAmount} FIC) to your wallet`, 'success');
        } catch (error) {
            console.error('Error adding funds:', error);
            showToast('Failed to add funds. Please try again.', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">My Wallet</h1>
                    <p className="text-gray-600 mt-2">Manage your FIC tokens and transactions</p>
                </div>
                
                <Wallet 
                    ficBalance={ficBalance}
                    transactions={transactions}
                    onSendFic={handleSendFic}
                    onAddFunds={handleAddFunds}
                />
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Total Spent</p>
                                <p className="text-xl font-bold">250.50 FIC</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Security Score</p>
                                <p className="text-xl font-bold">98%</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Active Subscriptions</p>
                                <p className="text-xl font-bold">3</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyWalletPage;
