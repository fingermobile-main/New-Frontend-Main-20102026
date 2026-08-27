import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface PaymentFormData {
  amount: string;
  paymentMethod: string;
  description: string;
  currency: string;
}

const INITIAL_FORM_STATE: PaymentFormData = {
  amount: '',
  paymentMethod: '',
  description: '',
  currency: 'USD',
};

const PaymentForm: React.FC = () => {
  const [formData, setFormData] = useState<PaymentFormData>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);

  const handleInputChange = useCallback((field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleAmountChange = useCallback((value: string) => {
    // Sanitize input to allow only valid numbers with up to two decimal places
    const sanitized = value.replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    if (parts.length > 2) return; // Prevent multiple decimal points
    if (parts[1] && parts[1].length > 2) return; // Restrict to 2 decimal places

    handleInputChange('amount', sanitized);
  }, [handleInputChange]);

  const handleSubmit = async () => {
    const numericAmount = parseFloat(formData.amount);

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid amount greater than zero.');
      return;
    }

    if (!formData.paymentMethod.trim()) {
      Alert.alert('Validation Error', 'Payment Method is required.');
      return;
    }

    setLoading(true);
    try {
      // API integration placeholder
      console.log('Processing payment:', {
        ...formData,
        amount: numericAmount,
      });

      Alert.alert('Success', 'Payment processed successfully.');
      setFormData(INITIAL_FORM_STATE);
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Payment Form</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Amount *</Text>
          <TextInput
            style={styles.input}
            value={formData.amount}
            onChangeText={handleAmountChange}
            placeholder="0.00"
            keyboardType="decimal-pad"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Payment Method *</Text>
          <TextInput
            style={styles.input}
            value={formData.paymentMethod}
            onChangeText={(value) => handleInputChange('paymentMethod', value)}
            placeholder="Card, PayPal, Apple Pay"
            autoCapitalize="words"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Currency</Text>
          <TextInput
            style={styles.input}
            value={formData.currency}
            onChangeText={(value) => handleInputChange('currency', value.toUpperCase())}
            placeholder="USD"
            autoCapitalize="characters"
            maxLength={3}
            editable={!loading}
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
            numberOfLines={3}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
          accessibilityRole="button"
          accessibilityState={{ disabled: loading }}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Process Payment</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#A0C7FF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentForm;