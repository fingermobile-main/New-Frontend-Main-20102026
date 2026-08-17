import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

interface PaymentFormData {
  amount: string;
  paymentMethod: string;
  description?: string;
  currency: string;
}

const PaymentForm: React.FC = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: '',
    paymentMethod: '',
    description: '',
    currency: 'USD'
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.amount || !formData.paymentMethod) {
      Alert.alert('Validation Error', 'Amount and Payment Method are required');
      return;
    }

    setLoading(true);
    try {
      // In a real implementation, this would call the paymentAPI.processPayment method
      console.log('Processing payment:', formData);
      Alert.alert('Success', 'Payment processed successfully');
      setFormData({
        amount: '',
        paymentMethod: '',
        description: '',
        currency: 'USD'
      });
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Payment Form</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount *</Text>
        <TextInput
          style={styles.input}
          value={formData.amount}
          onChangeText={(value) => handleInputChange('amount', value)}
          placeholder="Enter amount"
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Payment Method *</Text>
        <TextInput
          style={styles.input}
          value={formData.paymentMethod}
          onChangeText={(value) => handleInputChange('paymentMethod', value)}
          placeholder="Enter payment method (e.g., card, paypal)"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Currency</Text>
        <TextInput
          style={styles.input}
          value={formData.currency}
          onChangeText={(value) => handleInputChange('currency', value)}
          placeholder="Currency (default: USD)"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
          placeholder="Enter payment description"
          multiline
        />
      </View>
      
      <TouchableOpacity 
        style={[styles.button, loading && styles.disabledButton]} 
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Processing...' : 'Process Payment'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentForm;