import { VerificationStatus } from '../shared/types';
import { db } from '../database.js';

export const checkVerificationStatus = async (userId: string): Promise<VerificationStatus> => {
  const row = db.prepare('SELECT verification_status, notes, verified_at FROM business_verifications WHERE user_id = ?').get(userId) as Record<string, unknown> | undefined;
  
  if (!row) {
    return {
      status: 'pending',
      notes: undefined,
      verifiedAt: undefined
    };
  }

  return {
    status: row.verification_status as 'pending' | 'verified' | 'rejected',
    notes: row.notes as string | undefined,
    verifiedAt: row.verified_at ? new Date(row.verified_at as string) : undefined
  };
};

export interface VerificationRecord {
  userId: string;
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

class VerificationServiceClass {
  async getStatus(userId: string): Promise<VerificationRecord | null> {
    const row = db.prepare('SELECT * FROM business_verifications WHERE user_id = ?').get(userId) as Record<string, unknown> | undefined;
    if (!row) return null;
    
    return {
      userId: row.user_id as string,
      status: row.verification_status as 'pending' | 'verified' | 'rejected',
      notes: row.notes as string | undefined,
      createdAt: row.verified_at as string || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async updateStatus(userId: string, status: VerificationRecord['status'], notes?: string): Promise<void> {
    const existing = await this.getStatus(userId);
    
    if (existing) {
      db.prepare(`
        UPDATE business_verifications 
        SET verification_status = ?, notes = ?, verified_at = ?
        WHERE user_id = ?
      `).run(status, notes || null, status === 'verified' ? new Date().toISOString() : null, userId);
    } else {
      // Create new dummy record since one doesn't exist
      const id = `bv-${Date.now()}`;
      db.prepare(`
        INSERT INTO business_verifications (id, user_id, business_name, verification_status, notes, verified_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, userId, 'Unknown Business', status, notes || null, status === 'verified' ? new Date().toISOString() : null);
    }
  }

  async getAll(): Promise<VerificationRecord[]> {
    const rows = db.prepare('SELECT * FROM business_verifications').all() as Record<string, unknown>[];
    return rows.map(row => ({
      userId: row.user_id as string,
      status: row.verification_status as 'pending' | 'verified' | 'rejected',
      notes: row.notes as string | undefined,
      createdAt: row.verified_at as string || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  async create(verificationData: Omit<VerificationRecord, 'createdAt' | 'updatedAt'>): Promise<VerificationRecord> {
    const id = `bv-${Date.now()}`;
    db.prepare(`
      INSERT INTO business_verifications (id, user_id, business_name, verification_status, notes, verified_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      id, 
      verificationData.userId, 
      'Unknown Business', 
      verificationData.status, 
      verificationData.notes || null,
      verificationData.status === 'verified' ? new Date().toISOString() : null
    );
    
    return {
      ...verificationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async update(userId: string, updateData: Partial<VerificationRecord>): Promise<VerificationRecord | null> {
    await this.updateStatus(userId, updateData.status || 'pending', updateData.notes);
    return this.getStatus(userId);
  }

  async delete(userId: string): Promise<void> {
    db.prepare('DELETE FROM business_verifications WHERE user_id = ?').run(userId);
  }
}

export const VerificationService = new VerificationServiceClass();

export default {
  checkVerificationStatus
};