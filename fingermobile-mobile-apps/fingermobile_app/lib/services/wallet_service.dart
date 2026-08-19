import 'dart:convert';
import 'package:http/http.dart' as http;

// Define models for wallet functionality
class WalletInfo {
  final double balance;
  final String currency;
  final String walletAddress;
  final List<Transaction> transactions;

  WalletInfo({
    required this.balance,
    required this.currency,
    required this.walletAddress,
    required this.transactions,
  });

  factory WalletInfo.fromJson(Map<String, dynamic> json) {
    List<Transaction> transactions = [];
    if (json['transactions'] != null) {
      transactions = (json['transactions'] as List)
          .map((transaction) => Transaction.fromJson(transaction))
          .toList();
    }

    return WalletInfo(
      balance: (json['balance'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] ?? 'USD',
      walletAddress: json['wallet_address'] ?? '',
      transactions: transactions,
    );
  }
}

class Transaction {
  final int id;
  final String type; // 'credit' or 'debit'
  final double amount;
  final String description;
  final DateTime timestamp;
  final String status; // 'completed', 'pending', 'failed'

  Transaction({
    required this.id,
    required this.type,
    required this.amount,
    required this.description,
    required this.timestamp,
    required this.status,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] ?? 0,
      type: json['type'] ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      description: json['description'] ?? '',
      timestamp: DateTime.tryParse(json['timestamp'] ?? '') ?? DateTime.now(),
      status: json['status'] ?? 'pending',
    );
  }
}

class WalletService {
  static Future<WalletInfo?> getWalletInfo(int memberId) async {
    try {
      final response = await http.get(
        Uri.parse('http://localhost:5001/api/wallet/$memberId'),
        headers: await _getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        return WalletInfo.fromJson(json.decode(response.body)['data']);
      }
      return null;
    } catch (e) {
      print('Error getting wallet info: $e');
      return null;
    }
  }

  static Future<List<Transaction>?> getTransactions(int memberId) async {
    try {
      final response = await http.get(
        Uri.parse('http://localhost:5001/api/wallet/$memberId/transactions'),
        headers: await _getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body)['data'] as List;
        return data.map((json) => Transaction.fromJson(json)).toList();
      }
      return null;
    } catch (e) {
      print('Error getting transactions: $e');
      return null;
    }
  }

  static Future<bool> makePayment(int memberId, double amount, String description) async {
    try {
      final response = await http.post(
        Uri.parse('http://localhost:5001/api/wallet/$memberId/payment'),
        headers: await _getAuthHeaders(),
        body: json.encode({
          'amount': amount,
          'description': description,
        }),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error making payment: $e');
      return false;
    }
  }

  static Future<Map<String, dynamic>?> getWalletStats(int memberId) async {
    try {
      final response = await http.get(
        Uri.parse('http://localhost:5001/api/wallet/$memberId/stats'),
        headers: await _getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body)['data'];
      }
      return null;
    } catch (e) {
      print('Error getting wallet stats: $e');
      return null;
    }
  }

  static Future<Map<String, String>?> _getAuthHeaders() async {
    // In a real app, you would get the auth token from secure storage
    // For now, returning basic headers
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }
}