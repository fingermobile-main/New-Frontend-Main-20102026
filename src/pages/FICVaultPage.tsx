import React, { useState, useCallback } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { useAppContext } from "../contexts/AppContext";

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

VaultStatCard.displayName = "VaultStatCard";

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

VaultHistoryTable.displayName = "VaultHistoryTable";

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
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <h1 className="text-2xl font-bold">FIC Vault</h1>
      <p>This is the FIC vault page.</p>
    </div>
  );
};

export default FICVaultPage;
