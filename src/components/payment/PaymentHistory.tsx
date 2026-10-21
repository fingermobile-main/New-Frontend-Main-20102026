import React, { useEffect, useState } from 'react';
import { View, Text, FlatList as NativeFlatList, StyleSheet, RefreshControl } from 'react-native-web';
import { paymentAPI } from '../../services/paymentAPI';

const WebStyleSheet = StyleSheet as unknown as { create: (styles: Record<string, any>) => any };
const FlatList = NativeFlatList as unknown as React.ComponentType<any>;

interface PaymentHistoryItem {
  id: string;
  amount: number;
  paymentMethod: string;
  description?: string;
  currency: string;
  status: string;
  createdAt: string;
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would call the paymentAPI.getPaymentHistory method
      // For now, using mock data
      const mockPayments: PaymentHistoryItem[] = [
        {
          id: '1',
          amount: 99.99,
          paymentMethod: 'Visa ending in 4242',
          description: 'Premium subscription',
          currency: 'USD',
          status: 'completed',
          createdAt: '2026-07-15T10:30:00Z'
        },
        {
          id: '2',
          amount: 29.99,
          paymentMethod: 'PayPal',
          description: 'Pro plan renewal',
          currency: 'USD',
          status: 'completed',
          createdAt: '2026-06-15T14:22:00Z'
        },
        {
          id: '3',
          amount: 19.99,
          paymentMethod: 'Mastercard ending in 1234',
          description: 'Add-on features',
          currency: 'USD',
          status: 'completed',
          createdAt: '2026-05-20T09:15:00Z'
        }
      ];

      setPayments(mockPayments);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      window.alert('Error: Failed to load payment history');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPaymentHistory();
  };

  const renderPaymentItem = ({ item }: { item: PaymentHistoryItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
        <Text style={[styles.status, item.status === 'completed' ? styles.completed : styles.pending]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
      <Text style={styles.description}>{item.description || 'No description'}</Text>
      <Text style={styles.method}>{item.paymentMethod}</Text>
      <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment History</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading payment history...</Text>
        </View>
      ) : payments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No payment history found</Text>
        </View>
      ) : (
        <FlatList
          data={payments}
          renderItem={renderPaymentItem}
          keyExtractor={(item: PaymentHistoryItem) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = WebStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  completed: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  pending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  method: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default PaymentHistory;
