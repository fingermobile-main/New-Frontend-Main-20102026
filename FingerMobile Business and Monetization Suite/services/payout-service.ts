import { PayoutAccount } from '../shared/types';

export const getPayoutAccount = async (): Promise<PayoutAccount> => {
  // In a real implementation, this would fetch actual payout account details
  // For now, returning mock data
  return {
    bankName: '',
    accountLast4: '',
    currency: 'USD',
    updatedAt: new Date().toISOString()
  };
};

export default {
  getPayoutAccount
};