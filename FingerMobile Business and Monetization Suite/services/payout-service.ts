import { PayoutAccount } from '../shared/types';

const mockPayoutAccounts: PayoutAccount[] = [];

export const createPayoutAccount = async (payoutAccount: Omit<PayoutAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<PayoutAccount> => {
  const newAccount: PayoutAccount = {
    ...payoutAccount,
    id: `payout-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  mockPayoutAccounts.push(newAccount);
  return newAccount;
};

export const getPayoutAccount = async (id: string): Promise<PayoutAccount | null> => {
  return mockPayoutAccounts.find(account => account.id === id) || null;
};

export const updatePayoutAccount = async (id: string, updates: Partial<PayoutAccount>): Promise<PayoutAccount | null> => {
  const index = mockPayoutAccounts.findIndex(account => account.id === id);
  if (index === -1) return null;
  
  mockPayoutAccounts[index] = {
    ...mockPayoutAccounts[index],
    ...updates,
    updatedAt: new Date(),
  };
  
  return mockPayoutAccounts[index];
};

export default {
  createPayoutAccount,
  getPayoutAccount,
  updatePayoutAccount
};