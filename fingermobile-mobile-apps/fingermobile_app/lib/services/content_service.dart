import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_service.dart'; // Import the API service to use the auth token

class ContentItem {
  final String id;
  final String title;
  final String description;
  final String type;
  final String imageUrl;
  final DateTime createdAt;

  ContentItem({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.imageUrl,
    required this.createdAt,
  });

  factory ContentItem.fromJson(Map<String, dynamic> json) {
    return ContentItem(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      type: json['type'] as String,
      imageUrl: json['image_url'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }
}

class MarketplaceItem {
  final String id;
  final String name;
  final String description;
  final double price;
  final String currency;
  final String imageUrl;
  final double rating;

  MarketplaceItem({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.currency,
    required this.imageUrl,
    required this.rating,
  });

  factory MarketplaceItem.fromJson(Map<String, dynamic> json) {
    return MarketplaceItem(
      id: json['id'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      price: (json['price'] as num).toDouble() ?? 0.0,
      currency: json['currency'] as String,
      imageUrl: json['image_url'] as String,
      rating: (json['rating'] as num).toDouble() ?? 0.0,
    );
  }
}

class FinancialSummary {
  final double balance;
  final String currency;
  final List<Transaction> recentTransactions;

  FinancialSummary({
    required this.balance,
    required this.currency,
    required this.recentTransactions,
  });

  factory FinancialSummary.fromJson(Map<String, dynamic> json) {
    var transactionsList = json['recent_transactions'] as List? ?? [];
    List<Transaction> transactions = transactionsList
        .map((transaction) => Transaction.fromJson(transaction))
        .toList();

    return FinancialSummary(
      balance: (json['balance'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] as String? ?? '',
      recentTransactions: transactions,
    );
  }
}

class Transaction {
  final String id;
  final String description;
  final double amount;
  final String type; // 'credit' or 'debit'
  final DateTime date;

  Transaction({
    required this.id,
    required this.description,
    required this.amount,
    required this.type,
    required this.date,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'] as String,
      description: json['description'] as String,
      amount: (json['amount'] as num).toDouble() ?? 0.0,
      type: json['type'] as String,
      date: DateTime.parse(json['date'] as String? ?? DateTime.now().toIso8601String()),
    );
  }
}

class ContentService {
  // Use the same base URL as in ApiService
  static const String baseUrl = 'http://localhost:3001/api';
  
  // Get recent content for the forum/home page using the posts endpoint
  static Future<List<ContentItem>> getRecentContent() async {
    try {
      // Use the same headers as ApiService but with authentication
      final headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        if (ApiService._authToken != null) 'Authorization': 'Bearer ${ApiService._authToken}',
      };

      final response = await http.get(
        Uri.parse('$baseUrl/posts/feed?page=1&limit=20'), // Get first 20 posts
        headers: headers,
      );

      if (response.statusCode == 200) {
        final responseBody = json.decode(response.body);
        final List<dynamic> data = responseBody['posts'] as List? ?? [];
        
        return data.map((item) {
          // Map the post data to ContentItem format
          return ContentItem(
            id: item['id'].toString(),
            title: item['title'] ?? 'Untitled Post',
            description: item['content'] ?? item['description'] ?? 'No description',
            type: item['post_type'] ?? item['type'] ?? 'post',
            imageUrl: item['media_urls']?.length > 0 ? item['media_urls'][0] : 'https://via.placeholder.com/400x300.png',
            createdAt: DateTime.parse(item['created_at'] ?? DateTime.now().toIso8601String()),
          );
        }).toList();
      } else {
        print('Failed to load content: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to load content');
      }
    } catch (e) {
      print('Error getting recent content: $e');
      // Return sample data for demonstration
      return [
        ContentItem(
          id: '1',
          title: 'Welcome to FingerMobile',
          description: 'Your all-in-one platform for entertainment, education, and commerce',
          type: 'post',
          imageUrl: 'https://via.placeholder.com/400x300.png',
          createdAt: DateTime.now().subtract(const Duration(days: 1)),
        ),
        ContentItem(
          id: '2',
          title: 'New Features Available',
          description: 'Check out our new platform features and enhancements',
          type: 'announcement',
          imageUrl: 'https://via.placeholder.com/400x300.png',
          createdAt: DateTime.now().subtract(const Duration(hours: 5)),
        ),
      ];
    }
  }

  // Get marketplace items - we could extend the backend to support this
  static Future<List<MarketplaceItem>> getMarketplaceItems() async {
    try {
      final headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        if (ApiService._authToken != null) 'Authorization': 'Bearer ${ApiService._authToken}',
      };

      // We'll use the search endpoint as an example, though ideally we'd have a dedicated marketplace endpoint
      final response = await http.get(
        Uri.parse('$baseUrl/search?type=products&q=all'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final responseBody = json.decode(response.body);
        final List<dynamic> data = responseBody['results'] as List? ?? [];
        
        return data.map((item) {
          return MarketplaceItem(
            id: item['id'].toString(),
            name: item['title'] ?? item['name'] ?? 'Unnamed Item',
            description: item['description'] ?? 'No description',
            price: (item['price'] as num?)?.toDouble() ?? 0.0,
            currency: item['currency'] ?? 'USD',
            imageUrl: item['image_url'] ?? item['avatar'] ?? 'https://via.placeholder.com/400x300.png',
            rating: (item['rating'] as num?)?.toDouble() ?? 0.0,
          );
        }).toList();
      } else {
        print('Failed to load marketplace items: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to load marketplace items');
      }
    } catch (e) {
      print('Error getting marketplace items: $e');
      // Return sample data for demonstration
      return [
        MarketplaceItem(
          id: '1',
          name: 'Premium Subscription',
          description: 'Access to all premium content and features',
          price: 9.99,
          currency: 'USD',
          imageUrl: 'https://via.placeholder.com/400x300.png',
          rating: 4.8,
        ),
        MarketplaceItem(
          id: '2',
          name: 'Exclusive Merchandise',
          description: 'Official FingerMobile branded merchandise',
          price: 24.99,
          currency: 'USD',
          imageUrl: 'https://via.placeholder.com/400x300.png',
          rating: 4.5,
        ),
      ];
    }
  }

  // Get financial summary using wallet endpoints
  static Future<FinancialSummary> getFinancialSummary() async {
    try {
      final headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        if (ApiService._authToken != null) 'Authorization': 'Bearer ${ApiService._authToken}',
      };

      // Get wallet information which contains balance
      final response = await http.get(
        Uri.parse('$baseUrl/wallet'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final walletInfo = data['walletInfo'];

        // Get recent transactions
        final transactionsResponse = await http.get(
          Uri.parse('$baseUrl/wallet/transactions?limit=5'),
          headers: headers,
        );

        List<Transaction> recentTransactions = [];
        if (transactionsResponse.statusCode == 200) {
          final transactionsData = json.decode(transactionsResponse.body);
          final List<dynamic> transactionsList = transactionsData['transactionHistory'] as List? ?? [];
          
          recentTransactions = transactionsList.map((trans) {
            return Transaction(
              id: trans['id']?.toString() ?? '0',
              description: trans['description'] ?? trans['note'] ?? 'Transaction',
              amount: (trans['amount'] as num?)?.toDouble() ?? 0.0,
              type: trans['type'] ?? 'general',
              date: DateTime.parse(trans['created_at'] ?? DateTime.now().toIso8601String()),
            );
          }).toList();
        }

        return FinancialSummary(
          balance: (walletInfo['fic_balance'] as num?)?.toDouble() ?? 
                  (walletInfo['balance'] as num?)?.toDouble() ?? 0.0,
          currency: walletInfo['currency'] ?? 'FIC',
          recentTransactions: recentTransactions,
        );
      } else {
        print('Failed to load financial summary: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to load financial summary');
      }
    } catch (e) {
      print('Error getting financial summary: $e');
      // Return sample data for demonstration
      return FinancialSummary(
        balance: 125.50,
        currency: 'FIC',
        recentTransactions: [
          Transaction(
            id: '1',
            description: 'Marketplace Purchase',
            amount: 24.99,
            type: 'debit',
            date: DateTime.now().subtract(const Duration(days: 2)),
          ),
          Transaction(
            id: '2',
            description: 'Content Subscription',
            amount: 9.99,
            type: 'debit',
            date: DateTime.now().subtract(const Duration(days: 5)),
          ),
          Transaction(
            id: '3',
            description: 'Referral Bonus',
            amount: 5.00,
            type: 'credit',
            date: DateTime.now().subtract(const Duration(days: 7)),
          ),
        ],
      );
    }
  }
}