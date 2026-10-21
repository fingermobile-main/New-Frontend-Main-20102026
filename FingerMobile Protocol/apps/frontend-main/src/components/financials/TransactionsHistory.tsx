import React, { useState } from 'react';
import { History, Filter, Download, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/Select';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
  amount: number;
  date: string;
  description?: string;
  status: 'completed' | 'pending' | 'failed';
  category?: string;
}

interface TransactionsHistoryProps {
  userId?: string;
  transactions?: Transaction[];
  onExport?: () => void;
}

const TransactionsHistory: React.FC<TransactionsHistoryProps> = ({
  userId,
  transactions: propTransactions,
  onExport
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState<string>('all');
  const [filterStatus, setFilterStatus] = React.useState<string>('all');

  const defaultTransactions: Transaction[] = [
    {
      id: '1',
      type: 'deposit',
      amount: 500,
      date: '2026-06-08 10:30 AM',
      description: 'Bank Transfer Deposit',
      status: 'completed',
      category: 'Income'
    },
    {
      id: '2',
      type: 'payment',
      amount: 45.99,
      date: '2026-06-07 03:15 PM',
      description: 'Online Purchase - Electronics',
      status: 'completed',
      category: 'Shopping'
    },
    {
      id: '3',
      type: 'transfer',
      amount: 200,
      date: '2026-06-06 09:00 AM',
      description: 'Transfer to Savings Account',
      status: 'completed',
      category: 'Transfer'
    },
    {
      id: '4',
      type: 'withdrawal',
      amount: 100,
      date: '2026-06-05 02:45 PM',
      description: 'ATM Withdrawal',
      status: 'pending',
      category: 'Cash'
    },
    {
      id: '5',
      type: 'payment',
      amount: 12.99,
      date: '2026-06-04 11:20 AM',
      description: 'Subscription Renewal',
      status: 'failed',
      category: 'Subscription'
    }
  ];

  const transactions = propTransactions || defaultTransactions;

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'failed':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
    case 'deposit':
      return '+';
    case 'withdrawal':
      return '-';
    case 'transfer':
      return '→';
    case 'payment':
      return '💳';
    default:
      return '•';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <History className="h-6 w-6" />
                Transaction History
              </CardTitle>
              <CardDescription>View and manage your transaction records</CardDescription>
            </div>
            <Button variant="outline" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                <SelectItem value="transfer">Transfers</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted px-4 py-3 grid grid-cols-12 gap-4 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <div className="col-span-1">Type</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-1">Status</div>
            </div>
            <div className="divide-y">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="px-4 py-3 grid grid-cols-12 gap-4 items-center hover:bg-muted/50 transition-colors"
                >
                  <div className="col-span-1 text-lg font-bold">
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div className="col-span-4 font-medium truncate">
                    {transaction.description || 'No description'}
                  </div>
                  <div className="col-span-2">
                    <Badge variant="outline">{transaction.category}</Badge>
                  </div>
                  <div
                    className={`col-span-2 font-semibold ${
                      transaction.type === 'deposit'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'deposit' ? '+' : '-'}$
                    {transaction.amount.toFixed(2)}
                  </div>
                  <div className="col-span-2 text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {transaction.date}
                  </div>
                  <div className="col-span-1">
                    <Badge className={`${getStatusColor(transaction.status)} text-white`}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12 text-slate-700 dark:text-slate-300 font-medium">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No transactions found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsHistory;
