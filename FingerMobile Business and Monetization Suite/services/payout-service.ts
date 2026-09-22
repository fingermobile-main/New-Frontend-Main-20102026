import { PayoutAccount } from '../shared/types';
import { db } from '../database.js';

function mapRowToPayoutAccount(row: Record<string, unknown>): PayoutAccount {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    accountHolderName: row.account_holder_name as string,
    accountNumber: row.account_number as string,
    routingNumber: row.routing_number as string,
    bankName: row.bank_name as string,
    bankCountry: row.bank_country as string,
    currency: row.currency as string,
    verificationStatus: row.verification_status as 'pending' | 'verified' | 'rejected',
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string)
  };
}

export const createPayoutAccount = async (payoutAccount: Omit<PayoutAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<PayoutAccount> => {
  const id = `payout-${Date.now()}`;
  
  db.prepare(`
    INSERT INTO payout_accounts (
      id, user_id, account_holder_name, account_number, routing_number, bank_name, bank_country, currency, verification_status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    payoutAccount.userId,
    payoutAccount.accountHolderName,
    payoutAccount.accountNumber,
    payoutAccount.routingNumber,
    payoutAccount.bankName,
    payoutAccount.bankCountry,
    payoutAccount.currency,
    payoutAccount.verificationStatus
  );

  return getPayoutAccount(id) as Promise<PayoutAccount>;
};

export const getPayoutAccount = async (id: string): Promise<PayoutAccount | null> => {
  const row = db.prepare('SELECT * FROM payout_accounts WHERE id = ?').get(id) as Record<string, unknown> | undefined;
  if (!row) return null;
  return mapRowToPayoutAccount(row);
};

export const updatePayoutAccount = async (id: string, updates: Partial<PayoutAccount>): Promise<PayoutAccount | null> => {
  const current = await getPayoutAccount(id);
  if (!current) return null;
  
  const updateKeys: string[] = [];
  const values: unknown[] = [];
  
  Object.entries(updates).forEach(([key, value]) => {
    const column = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    updateKeys.push(`${column} = ?`);
    values.push(value);
  });
  
  if (updateKeys.length > 0) {
    updateKeys.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    
    db.prepare(`
      UPDATE payout_accounts 
      SET ${updateKeys.join(', ')} 
      WHERE id = ?
    `).run(...values);
  }
  
  return getPayoutAccount(id);
};

// Also needed by BusinessSuiteService
export const getAllPayoutAccounts = async (): Promise<PayoutAccount[]> => {
  const rows = db.prepare('SELECT * FROM payout_accounts').all() as Record<string, unknown>[];
  return rows.map(mapRowToPayoutAccount);
};

export default {
  createPayoutAccount,
  getPayoutAccount,
  updatePayoutAccount,
  getAllPayoutAccounts
};