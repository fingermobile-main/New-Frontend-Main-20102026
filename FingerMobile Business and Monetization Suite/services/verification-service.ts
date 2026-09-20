export interface VerificationRecord {
  userId: string;
  status: 'pending' | 'verified' | 'rejected';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

class VerificationServiceClass {
  private verifications: Map<string, VerificationRecord> = new Map();

  async getStatus(userId: string): Promise<VerificationRecord | null> {
    return this.verifications.get(userId) || null;
  }

  async updateStatus(userId: string, status: VerificationRecord['status'], notes?: string): Promise<void> {
    const existing = this.verifications.get(userId);
    const record: VerificationRecord = {
      userId,
      status,
      notes,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.verifications.set(userId, record);
  }

  async getAll(): Promise<VerificationRecord[]> {
    return Array.from(this.verifications.values());
  }

  async create(verificationData: Omit<VerificationRecord, 'createdAt' | 'updatedAt'>): Promise<VerificationRecord> {
    const record: VerificationRecord = {
      ...verificationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.verifications.set(verificationData.userId, record);
    return record;
  }

  async update(id: string, updateData: Partial<VerificationRecord>): Promise<VerificationRecord | null> {
    const existing = this.verifications.get(id);
    if (!existing) return null;

    const updatedRecord: VerificationRecord = {
      ...existing,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    this.verifications.set(id, updatedRecord);
    return updatedRecord;
  }

  async delete(id: string): Promise<void> {
    this.verifications.delete(id);
  }
}

export const VerificationService = new VerificationServiceClass();