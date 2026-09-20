export interface RevenueRecord {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  date: string;
  source: string;
  status: 'pending' | 'completed' | 'failed';
}

interface RevenueReport {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  records: RevenueRecord[];
  count: number;
}

interface RevenueSource {
  source: string;
  amount: number;
}

interface MonthlyRevenue {
  month: string;
  amount: number;
}

interface TopProduct {
  productId: string;
  productName: string;
  amount: number;
}

class RevenueServiceClass {
  private revenueRecords: Map<string, RevenueRecord> = new Map();

  async getRevenueByUser(userId: string): Promise<RevenueRecord[]> {
    return Array.from(this.revenueRecords.values()).filter(record => record.userId === userId);
  }

  async getTotalRevenue(): Promise<number> {
    return Array.from(this.revenueRecords.values())
      .filter(record => record.status === 'completed')
      .reduce((sum, record) => sum + record.amount, 0);
  }

  async createRevenueRecord(record: Omit<RevenueRecord, 'id'>): Promise<RevenueRecord> {
    const newRecord: RevenueRecord = {
      ...record,
      id: Math.random().toString(36).substring(2, 15) // Simple ID generation for demo purposes
    };
    this.revenueRecords.set(newRecord.id, newRecord);
    return newRecord;
  }

  async getRevenueReport(startDate?: string, endDate?: string): Promise<RevenueRecord[]> {
    let records = Array.from(this.revenueRecords.values());
    
    if (startDate) {
      records = records.filter(r => r.date >= startDate);
    }
    
    if (endDate) {
      records = records.filter(r => r.date <= endDate);
    }
    
    return records;
  }

  async generateReport(startDate: string, endDate: string): Promise<RevenueReport> {
    // Generate a revenue report between two dates
    const records = await this.getRevenueReport(startDate, endDate);
    const totalRevenue = records
      .filter(r => r.status === 'completed')
      .reduce((sum, record) => sum + record.amount, 0);

    return {
      startDate,
      endDate,
      totalRevenue,
      records,
      count: records.length
    };
  }

  async getRevenueBySource(): Promise<RevenueSource[]> {
    const groupedBySource: { [key: string]: number } = {};
    
    Array.from(this.revenueRecords.values())
      .filter(record => record.status === 'completed')
      .forEach(record => {
        if (!groupedBySource[record.source]) {
          groupedBySource[record.source] = 0;
        }
        groupedBySource[record.source] += record.amount;
      });

    return Object.entries(groupedBySource).map(([source, amount]) => ({
      source,
      amount
    }));
  }

  async getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
    const groupedByMonth: { [key: string]: number } = {};
    
    Array.from(this.revenueRecords.values())
      .filter(record => record.status === 'completed')
      .forEach(record => {
        const date = new Date(record.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!groupedByMonth[monthKey]) {
          groupedByMonth[monthKey] = 0;
        }
        groupedByMonth[monthKey] += record.amount;
      });

    return Object.entries(groupedByMonth).map(([month, amount]) => ({
      month,
      amount
    }));
  }

  async getTopPerformingProducts(): Promise<TopProduct[]> {
    // Group revenue records by source (assuming source represents product)
    const groupedBySource: { [key: string]: number } = {};
    
    Array.from(this.revenueRecords.values())
      .filter(record => record.status === 'completed')
      .forEach(record => {
        if (!groupedBySource[record.source]) {
          groupedBySource[record.source] = 0;
        }
        groupedBySource[record.source] += record.amount;
      });

    // Convert to array and sort by amount
    return Object.entries(groupedBySource)
      .map(([source, amount]) => ({
        productId: source,
        productName: source, // In a real implementation, this would map to actual product names
        amount
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10); // Top 10 performing products
  }

  async getProjectedRevenue(): Promise<number> {
    // Calculate projected revenue based on historical data
    const allRecords = Array.from(this.revenueRecords.values());
    const completedRecords = allRecords.filter(r => r.status === 'completed');
    
    if (completedRecords.length === 0) {
      return 0;
    }

    // Simple projection: average monthly revenue * 12 months
    const now = new Date();
    const earliestDate = new Date(Math.min(...completedRecords.map(r => new Date(r.date).getTime())));
    const monthsDifference = (now.getFullYear() - earliestDate.getFullYear()) * 12 + (now.getMonth() - earliestDate.getMonth());

    if (monthsDifference <= 0) {
      // If we only have data for one month, use that month's revenue as projection
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      const currentMonthRevenue = completedRecords
        .filter(r => r.date.startsWith(currentMonth))
        .reduce((sum, record) => sum + record.amount, 0);
      
      return currentMonthRevenue * 12; // Annual projection
    }

    const totalRevenue = completedRecords.reduce((sum, record) => sum + record.amount, 0);
    const avgMonthlyRevenue = totalRevenue / monthsDifference;
    
    return avgMonthlyRevenue * 12; // Annual projection
  }
}

export const RevenueService = new RevenueServiceClass();