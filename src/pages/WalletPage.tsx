import { Link } from 'react-router-dom';
import React, { useState } from 'react';

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

const WalletPage: React.FC = () => {
  const { toast } = useToast();
  const [balance, setBalance] = useState(1245.75);
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'received',
      amount: 250.00,
      from: 'John Doe',
      date: '2023-08-15',
      description: 'Payment for project work'
    },
    {
      id: 2,
      type: 'sent',
      amount: 45.99,
      to: 'Amazon',
      date: '2023-08-14',
      description: 'Online purchase'
    },
    {
      id: 3,
      type: 'received',
      amount: 50.00,
      from: 'Gift Bonus',
      date: '2023-08-12',
      description: 'Referral bonus'
    },
    {
      id: 4,
      type: 'sent',
      amount: 120.50,
      to: 'Netflix',
      date: '2023-08-10',
      description: 'Monthly subscription'
    },
    {
      id: 5,
      type: 'received',
      amount: 100.00,
      from: 'Jane Smith',
      date: '2023-08-08',
      description: 'Reimbursement'
    }
  ]);
  const [fiatBalance, setFiatBalance] = useState(875.25);
  const [ficBalance, setFicBalance] = useState(370.50);

  const handleFundWallet = () => {
    toast({
      title: "Fund Wallet",
      description: "Wallet funding options would be displayed here."
    });
  };

  const handleWithdraw = () => {
    toast({
      title: "Withdraw Funds",
      description: "Withdrawal options would be displayed here."
    });
  };

  const handleSendMoney = () => {
    toast({
      title: "Send Money",
      description: "Send money form would open here."
    });
  };

  const handleReceiveMoney = () => {
    toast({
      title: "Receive Money",
      description: "Receive money options would be displayed here."
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Wallet</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your funds, track transactions, and make secure payments
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <CardHeader className="pb-2">
                <CardDescription className="text-blue-100">Total Balance</CardDescription>
                <CardTitle className="text-3xl">${balance.toFixed(2)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span>Fiat: ${fiatBalance.toFixed(2)}</span>
                  <span>FIC: {ficBalance.toFixed(2)} FIC</span>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex space-x-3">
                  <Button variant="secondary" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleFundWallet}>
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Fund
                  </Button>
                  <Button variant="secondary" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleWithdraw}>
                    Withdraw
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <WalletIcon className="w-5 h-5 mr-2 text-indigo-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="flex flex-col items-center p-4" onClick={handleSendMoney}>
                  <ArrowUpIcon className="w-6 h-6 mb-2 text-green-500" />
                  Send
                </Button>
                <Button variant="outline" className="flex flex-col items-center p-4" onClick={handleReceiveMoney}>
                  <ArrowDownIcon className="w-6 h-6 mb-2 text-blue-500" />
                  Receive
                </Button>
                <Button variant="outline" className="flex flex-col items-center p-4">
                  <QrCodeIcon className="w-6 h-6 mb-2 text-purple-500" />
                  Scan QR
                </Button>
                <Button variant="outline" className="flex flex-col items-center p-4">
                  <GiftIcon className="w-6 h-6 mb-2 text-pink-500" />
                  Gift
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ChartBarIcon className="w-5 h-5 mr-2 text-indigo-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">
                        {transaction.type === 'received' ? `From: ${transaction.from}` : `To: ${transaction.to}`}
                      </p>
                      <p className="text-sm text-gray-500">{transaction.description || 'No description'} • {transaction.date}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.type === 'received' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'received' ? '+' : '-'}${transaction.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/wallet/transactions">View All Transactions</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-gray-500">Fiat Balance</CardDescription>
                  <CardTitle className="text-2xl">${fiatBalance.toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-green-600">
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                    +2.5% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-gray-500">FIC Balance</CardDescription>
                  <CardTitle className="text-2xl">{ficBalance.toFixed(2)} FIC</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-green-600">
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                    +5.2% from last month
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription className="text-gray-500">Total Assets</CardDescription>
                  <CardTitle className="text-2xl">${(fiatBalance + ficBalance).toFixed(2)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-green-600">
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                    +3.8% from last month
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Balance Breakdown</CardTitle>
                <CardDescription>Distribution of your assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Fiat Currency</span>
                      <span>${fiatBalance.toFixed(2)} ({((fiatBalance / balance) * 100).toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(fiatBalance / balance) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>FIC Tokens</span>
                      <span>{ficBalance.toFixed(2)} FIC ({((ficBalance / balance) * 100).toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${(ficBalance / balance) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Transaction History</h2>
            
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full mr-3 ${
                          transaction.type === 'received' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {transaction.type === 'received' ? (
                            <ArrowDownIcon className="w-5 h-5" />
                          ) : (
                            <ArrowUpIcon className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.type === 'received' ? `Received from ${transaction.from}` : `Sent to ${transaction.to}`}
                          </p>
                          <p className="text-sm text-gray-500">{transaction.description} • {transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.type === 'received' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'received' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Payment Methods</h2>
              <Button>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Linked Cards</CardTitle>
                <CardDescription>Manage your payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm opacity-80">Visa ending in 4235</p>
                        <p className="text-xl font-semibold mt-1">•••• •••• •••• 4235</p>
                      </div>
                      <div className="bg-gray-700 p-2 rounded">
                        <CreditCardIcon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex justify-between mt-4 text-sm">
                      <span>John Doe</span>
                      <span>Expires 12/25</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-800 to-indigo-900 rounded-lg text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm opacity-80">Mastercard ending in 7890</p>
                        <p className="text-xl font-semibold mt-1">•••• •••• •••• 7890</p>
                      </div>
                      <div className="bg-blue-700 p-2 rounded">
                        <CreditCardIcon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex justify-between mt-4 text-sm">
                      <span>John Doe</span>
                      <span>Expires 08/24</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Wallet Settings</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure wallet security options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Biometric Unlock</h3>
                    <p className="text-sm text-gray-500">Use fingerprint or face ID</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Auto-Lock Timer</h3>
                    <p className="text-sm text-gray-500">Time before wallet locks automatically</p>
                  </div>
                  <select className="border rounded p-2">
                    <option>1 minute</option>
                    <option>5 minutes</option>
                    <option>10 minutes</option>
                    <option>Never</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WalletPage;