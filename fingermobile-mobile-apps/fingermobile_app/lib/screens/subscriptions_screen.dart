import 'package:flutter/material.dart';

class Subscription {
  final int id;
  final String name;
  final String description;
  final double price;
  final String period;
  final List<String> features;
  final bool isActive;
  final DateTime? expiresAt;

  Subscription({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.period,
    required this.features,
    required this.isActive,
    this.expiresAt,
  });
}

class SubscriptionsScreen extends StatefulWidget {
  @override
  _SubscriptionsScreenState createState() => _SubscriptionsScreenState();
}

class _SubscriptionsScreenState extends State<SubscriptionsScreen> {
  List<Subscription> _subscriptions = [];
  List<Subscription> _availablePlans = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSubscriptions();
  }

  Future<void> _loadSubscriptions() async {
    try {
      // In a real implementation, this would be API calls
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _subscriptions = [
          Subscription(
            id: 1,
            name: 'Premium Plan',
            description: 'Access to all premium features',
            price: 9.99,
            period: 'monthly',
            features: [
              'Ad-free experience',
              'Advanced analytics',
              'Priority support',
              'Exclusive content',
              'Monetization tools',
            ],
            isActive: true,
            expiresAt: DateTime.now().add(Duration(days: 25)),
          ),
          Subscription(
            id: 2,
            name: 'Creator Plan',
            description: 'Tools for content creators',
            price: 19.99,
            period: 'monthly',
            features: [
              'All Premium features',
              'Advanced monetization',
              'Creator analytics',
              'Custom branding',
              'Early access to features',
            ],
            isActive: false,
            expiresAt: DateTime.now().subtract(Duration(days: 5)),
          ),
        ];
        
        _availablePlans = [
          Subscription(
            id: 3,
            name: 'Basic Plan',
            description: 'Essential features for all members',
            price: 0.00,
            period: 'monthly',
            features: [
              'Basic profile',
              'Standard posts',
              'Standard analytics',
              'Community support',
            ],
            isActive: false,
          ),
          Subscription(
            id: 4,
            name: 'Premium Plan',
            description: 'Access to all premium features',
            price: 9.99,
            period: 'monthly',
            features: [
              'Ad-free experience',
              'Advanced analytics',
              'Priority support',
              'Exclusive content',
              'Monetization tools',
            ],
            isActive: false,
          ),
          Subscription(
            id: 5,
            name: 'Creator Plan',
            description: 'Tools for content creators',
            price: 19.99,
            period: 'monthly',
            features: [
              'All Premium features',
              'Advanced monetization',
              'Creator analytics',
              'Custom branding',
              'Early access to features',
            ],
            isActive: false,
          ),
          Subscription(
            id: 6,
            name: 'Enterprise Plan',
            description: 'For large organizations',
            price: 99.99,
            period: 'monthly',
            features: [
              'All Creator features',
              'Dedicated support',
              'Custom integrations',
              'Team management',
              'Advanced security',
            ],
            isActive: false,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading subscriptions: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading subscriptions')),
      );
    }
  }

  void _subscribeToPlan(Subscription plan) {
    // In a real app, this would initiate the subscription process
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Subscribe to ${plan.name}'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Price: \$${plan.price}/${plan.period}'),
              SizedBox(height: 16),
              Text('Features:'),
              ...plan.features.map((feature) => Padding(
                padding: EdgeInsets.only(left: 16, top: 4),
                child: Row(
                  children: [
                    Icon(Icons.check, size: 16, color: Colors.green),
                    SizedBox(width: 8),
                    Text(feature),
                  ],
                ),
              )),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                // In a real app, this would process the subscription
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Subscription to ${plan.name} initiated'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: Text('Subscribe'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final activeSub = _subscriptions.where((sub) => sub.isActive).toList();
    final expiredSub = _subscriptions.where((sub) => !sub.isActive).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text('Subscriptions'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (activeSub.isNotEmpty) ...[
                      Text(
                        'Active Subscriptions',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 16),
                      ...activeSub.map((sub) => _buildSubscriptionCard(sub, isActive: true)),
                      SizedBox(height: 24),
                    ],
                    
                    if (expiredSub.isNotEmpty) ...[
                      Text(
                        'Expired Subscriptions',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 16),
                      ...expiredSub.map((sub) => _buildSubscriptionCard(sub, isActive: false)),
                      SizedBox(height: 24),
                    ],
                    
                    Text(
                      'Available Plans',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 16),
                    ..._availablePlans.map((plan) => _buildPlanCard(plan)),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildSubscriptionCard(Subscription sub, {required bool isActive}) {
    return Card(
      margin: EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        sub.name,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        sub.description,
                        style: TextStyle(
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: isActive ? Colors.green : Colors.red,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    isActive ? 'ACTIVE' : 'EXPIRED',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),
            Text(
              'Features:',
              style: TextStyle(
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            ...sub.features.map((feature) => Padding(
              padding: EdgeInsets.only(left: 16, top: 4),
              child: Row(
                children: [
                  Icon(
                    Icons.check,
                    size: 16,
                    color: isActive ? Colors.green : Colors.grey,
                  ),
                  SizedBox(width: 8),
                  Text(
                    feature,
                    style: TextStyle(
                      color: isActive ? null : Colors.grey,
                    ),
                  ),
                ],
              ),
            )),
            if (isActive && sub.expiresAt != null)
              Padding(
                padding: EdgeInsets.only(top: 16),
                child: Text(
                  'Expires: ${_formatDate(sub.expiresAt!)}',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlanCard(Subscription plan) {
    return Card(
      margin: EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        plan.name,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        plan.description,
                        style: TextStyle(
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                Text(
                  plan.price == 0 ? 'FREE' : '\$${plan.price}/${plan.period}',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.blue,
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),
            Text(
              'Features:',
              style: TextStyle(
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            ...plan.features.map((feature) => Padding(
              padding: EdgeInsets.only(left: 16, top: 4),
              child: Row(
                children: [
                  Icon(
                    Icons.check,
                    size: 16,
                    color: Colors.green,
                  ),
                  SizedBox(width: 8),
                  Text(feature),
                ],
              ),
            )),
            SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  _subscribeToPlan(plan);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                ),
                child: Text('Choose Plan'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
  }
}