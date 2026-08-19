import 'package:flutter/material.dart';

class SubscriptionsPage extends StatefulWidget {
  const SubscriptionsPage({super.key});

  @override
  State<SubscriptionsPage> createState() => _SubscriptionsPageState();
}

class _SubscriptionsPageState extends State<SubscriptionsPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<Subscription> _subscriptions = [];
  List<Plan> _plans = [];
  SubscriptionTab _selectedTab = SubscriptionTab.active;

  @override
  void initState() {
    super.initState();
    _loadSubscriptions();
  }

  Future<void> _loadSubscriptions() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock subscription plans
      setState(() {
        _plans = [
          Plan(
            id: 1,
            name: 'Basic Plan',
            description: 'Essential features for individuals',
            price: 9.99,
            billingCycle: BillingCycle.monthly,
            features: [
              'Up to 5 projects',
              '10GB storage',
              'Basic support',
              'Standard analytics',
            ],
            isPopular: false,
          ),
          Plan(
            id: 2,
            name: 'Pro Plan',
            description: 'Advanced features for professionals',
            price: 19.99,
            billingCycle: BillingCycle.monthly,
            features: [
              'Unlimited projects',
              '50GB storage',
              'Priority support',
              'Advanced analytics',
              'Team collaboration',
              'Custom themes',
            ],
            isPopular: true,
          ),
          Plan(
            id: 3,
            name: 'Enterprise Plan',
            description: 'Full-featured solution for organizations',
            price: 49.99,
            billingCycle: BillingCycle.monthly,
            features: [
              'Unlimited projects',
              '500GB storage',
              '24/7 dedicated support',
              'Advanced analytics',
              'Team collaboration',
              'Custom themes',
              'API access',
              'Single sign-on (SSO)',
              'Advanced security',
            ],
            isPopular: false,
          ),
        ];

        // Mock subscriptions
        _subscriptions = [
          Subscription(
            id: 1,
            planName: 'Pro Plan',
            planId: 2,
            status: SubscriptionStatus.active,
            startDate: DateTime.now().subtract(const Duration(days: 30)),
            endDate: DateTime.now().add(const Duration(days: 30)),
            amount: 19.99,
            billingCycle: BillingCycle.monthly,
            autoRenew: true,
            paymentMethod: 'Credit Card (**** 1234)',
            features: [
              'Unlimited projects',
              '50GB storage',
              'Priority support',
              'Advanced analytics',
              'Team collaboration',
              'Custom themes',
            ],
          ),
          Subscription(
            id: 2,
            planName: 'Basic Plan',
            planId: 1,
            status: SubscriptionStatus.expired,
            startDate: DateTime.now().subtract(const Duration(days: 60)),
            endDate: DateTime.now().subtract(const Duration(days: 30)),
            amount: 9.99,
            billingCycle: BillingCycle.monthly,
            autoRenew: false,
            paymentMethod: 'PayPal (member@example.com)',
            features: [
              'Up to 5 projects',
              '10GB storage',
              'Basic support',
              'Standard analytics',
            ],
          ),
          Subscription(
            id: 3,
            planName: 'Enterprise Plan',
            planId: 3,
            status: SubscriptionStatus.pending,
            startDate: DateTime.now(),
            endDate: DateTime.now().add(const Duration(days: 30)),
            amount: 49.99,
            billingCycle: BillingCycle.monthly,
            autoRenew: true,
            paymentMethod: 'Bank Transfer',
            features: [
              'Unlimited projects',
              '500GB storage',
              '24/7 dedicated support',
              'Advanced analytics',
              'Team collaboration',
              'Custom themes',
              'API access',
              'Single sign-on (SSO)',
              'Advanced security',
            ],
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load subscriptions. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _cancelSubscription(Subscription subscription) {
    setState(() {
      int index = _subscriptions.indexWhere((s) => s.id == subscription.id);
      if (index != -1) {
        _subscriptions[index] = Subscription(
          id: subscription.id,
          planName: subscription.planName,
          planId: subscription.planId,
          status: SubscriptionStatus.cancelled,
          startDate: subscription.startDate,
          endDate: subscription.endDate,
          amount: subscription.amount,
          billingCycle: subscription.billingCycle,
          autoRenew: false,
          paymentMethod: subscription.paymentMethod,
          features: subscription.features,
        );
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Subscription for ${subscription.planName} has been cancelled'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _renewSubscription(Subscription subscription) {
    setState(() {
      int index = _subscriptions.indexWhere((s) => s.id == subscription.id);
      if (index != -1) {
        _subscriptions[index] = Subscription(
          id: subscription.id,
          planName: subscription.planName,
          planId: subscription.planId,
          status: SubscriptionStatus.active,
          startDate: DateTime.now(),
          endDate: DateTime.now().add(const Duration(days: 30)),
          amount: subscription.amount,
          billingCycle: subscription.billingCycle,
          autoRenew: true,
          paymentMethod: subscription.paymentMethod,
          features: subscription.features,
        );
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Subscription for ${subscription.planName} has been renewed'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _upgradeSubscription(Subscription subscription) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildUpgradeSheet(subscription),
    );
  }

  Widget _buildUpgradeSheet(Subscription subscription) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Upgrade Subscription',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Current Plan: ${subscription.planName}',
            style: const TextStyle(
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Available Plans:',
            style: TextStyle(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          ..._plans.where((plan) => plan.id > subscription.planId).map((plan) {
            return Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          plan.name,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        if (plan.isPopular)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.blue,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Text(
                              'Popular',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      plan.description,
                      style: const TextStyle(
                        color: Colors.grey,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '\$${plan.price}/${_getBillingCycleText(plan.billingCycle)}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 20,
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Features:',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    ...plan.features.map((feature) => Padding(
                          padding: const EdgeInsets.symmetric(vertical: 2.0),
                          child: Row(
                            children: [
                              const Icon(Icons.check, size: 16, color: Colors.green),
                              const SizedBox(width: 8),
                              Text(feature),
                            ],
                          ),
                        )),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Upgraded to ${plan.name}'),
                            backgroundColor: Colors.green,
                          ),
                        );
                      },
                      child: const Text('Upgrade Now'),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ],
      ),
    );
  }

  void _viewSubscription(Subscription subscription) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildSubscriptionDetailsSheet(subscription),
    );
  }

  Widget _buildSubscriptionDetailsSheet(Subscription subscription) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  subscription.planName,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: _getStatusColor(subscription.status),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Status:',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  _getStatusText(subscription.status),
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          _buildInfoRow('Amount', '\$${subscription.amount.toStringAsFixed(2)}'),
          _buildInfoRow('Billing Cycle', _getBillingCycleText(subscription.billingCycle)),
          _buildInfoRow('Start Date', _formatDate(subscription.startDate)),
          _buildInfoRow('End Date', _formatDate(subscription.endDate)),
          _buildInfoRow('Auto Renew', subscription.autoRenew ? 'Yes' : 'No'),
          _buildInfoRow('Payment Method', subscription.paymentMethod),
          const SizedBox(height: 16),
          const Text(
            'Plan Features:',
            style: TextStyle(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          ...subscription.features.map((feature) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 2.0),
                child: Row(
                  children: [
                    const Icon(Icons.check, size: 16, color: Colors.green),
                    const SizedBox(width: 8),
                    Text(feature),
                  ],
                ),
              )),
          const SizedBox(height: 16),
          if (subscription.status == SubscriptionStatus.active)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                ElevatedButton(
                  onPressed: () => _upgradeSubscription(subscription),
                  child: const Text('Upgrade'),
                ),
                OutlinedButton(
                  onPressed: () => _cancelSubscription(subscription),
                  child: const Text('Cancel'),
                ),
              ],
            )
          else if (subscription.status == SubscriptionStatus.expired)
            Center(
              child: ElevatedButton(
                onPressed: () => _renewSubscription(subscription),
                child: const Text('Renew Subscription'),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          SizedBox(
            width: 120,
            child: Text(
              '$label:',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Expanded(
            child: Text(value),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Subscriptions'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadSubscriptions,
          ),
          IconButton(
            icon: const Icon(Icons.help_outline),
            onPressed: () {
              // Help functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Subscription help information would appear here'),
                  backgroundColor: Colors.blue,
                ),
              );
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadSubscriptions,
        child: _isLoading && _subscriptions.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _subscriptions.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadSubscriptions,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Stats Summary
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                _buildStatItem('Total',
                                    '${_subscriptions.length}'),
                                _buildStatItem('Active',
                                    '${_subscriptions.where((s) => s.status == SubscriptionStatus.active).length}'),
                                _buildStatItem('Expired',
                                    '${_subscriptions.where((s) => s.status == SubscriptionStatus.expired).length}'),
                                _buildStatItem('Monthly',
                                    '\$${_subscriptions.where((s) => s.status == SubscriptionStatus.active).fold(0.0, (sum, s) => sum + s.amount).toStringAsFixed(2)}'),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Tabs
                        Row(
                          children: [
                            ChoiceChip(
                              label: const Text('Active'),
                              selected: _selectedTab == SubscriptionTab.active,
                              onSelected: (selected) {
                                if (selected) {
                                  setState(() {
                                    _selectedTab = SubscriptionTab.active;
                                  });
                                }
                              },
                            ),
                            const SizedBox(width: 8),
                            ChoiceChip(
                              label: const Text('Expired'),
                              selected: _selectedTab == SubscriptionTab.expired,
                              onSelected: (selected) {
                                if (selected) {
                                  setState(() {
                                    _selectedTab = SubscriptionTab.expired;
                                  });
                                }
                              },
                            ),
                            const SizedBox(width: 8),
                            ChoiceChip(
                              label: const Text('All'),
                              selected: _selectedTab == SubscriptionTab.all,
                              onSelected: (selected) {
                                if (selected) {
                                  setState(() {
                                    _selectedTab = SubscriptionTab.all;
                                  });
                                }
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // Subscriptions List
                        Expanded(
                          child: _buildSubscriptionsList(),
                        ),
                      ],
                    ),
                  ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Theme.of(context).primaryColor,
        child: const Icon(Icons.add),
        onPressed: () {
          // Show subscription plans
          showModalBottomSheet(
            context: context,
            isScrollControlled: true,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
            ),
            builder: (context) => _buildPlansSheet(),
          );
        },
      ),
    );
  }

  Widget _buildSubscriptionsList() {
    List<Subscription> filteredSubscriptions = _subscriptions;
    
    switch (_selectedTab) {
      case SubscriptionTab.active:
        filteredSubscriptions = _subscriptions.where((s) => s.status == SubscriptionStatus.active).toList();
        break;
      case SubscriptionTab.expired:
        filteredSubscriptions = _subscriptions.where((s) => s.status == SubscriptionStatus.expired).toList();
        break;
      case SubscriptionTab.all:
        filteredSubscriptions = _subscriptions;
        break;
    }

    if (filteredSubscriptions.isEmpty) {
      return const Center(
        child: Text('No subscriptions found'),
      );
    }

    return ListView.builder(
      itemCount: filteredSubscriptions.length,
      itemBuilder: (context, index) {
        var subscription = filteredSubscriptions[index];
        return Card(
          child: InkWell(
            onTap: () => _viewSubscription(subscription),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        subscription.planName,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _getStatusColor(subscription.status),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          _getStatusText(subscription.status),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('\$${subscription.amount.toStringAsFixed(2)}/${_getBillingCycleText(subscription.billingCycle)}'),
                      Text(_formatDate(subscription.endDate)),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    subscription.paymentMethod,
                    style: const TextStyle(
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${subscription.features.length} features included',
                        style: const TextStyle(
                          color: Colors.grey,
                        ),
                      ),
                      if (subscription.status == SubscriptionStatus.active)
                        Row(
                          children: [
                            if (subscription.autoRenew)
                              const Icon(Icons.autorenew, size: 16, color: Colors.green)
                            else
                              const Icon(Icons.do_not_disturb_on, size: 16, color: Colors.grey),
                            const SizedBox(width: 8),
                            PopupMenuButton<String>(
                              icon: const Icon(Icons.more_vert),
                              onSelected: (String result) {
                                switch (result) {
                                  case 'upgrade':
                                    _upgradeSubscription(subscription);
                                    break;
                                  case 'cancel':
                                    _cancelSubscription(subscription);
                                    break;
                                }
                              },
                              itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
                                const PopupMenuItem<String>(
                                  value: 'upgrade',
                                  child: Text('Upgrade'),
                                ),
                                const PopupMenuItem<String>(
                                  value: 'cancel',
                                  child: Text('Cancel'),
                                ),
                              ],
                            ),
                          ],
                        )
                      else if (subscription.status == SubscriptionStatus.expired)
                        ElevatedButton(
                          onPressed: () => _renewSubscription(subscription),
                          child: const Text('Renew'),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildPlansSheet() {
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Subscription Plans',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            'Choose a plan that fits your needs:',
            style: TextStyle(
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView.builder(
              itemCount: _plans.length,
              itemBuilder: (context, index) {
                var plan = _plans[index];
                return Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              plan.name,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            if (plan.isPopular)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.blue,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Text(
                                  'Popular',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          plan.description,
                          style: const TextStyle(
                            color: Colors.grey,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          '\$${plan.price}/${_getBillingCycleText(plan.billingCycle)}',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 20,
                          ),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Features:',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        ...plan.features.map((feature) => Padding(
                              padding: const EdgeInsets.symmetric(vertical: 2.0),
                              child: Row(
                                children: [
                                  const Icon(Icons.check, size: 16, color: Colors.green),
                                  const SizedBox(width: 8),
                                  Text(feature),
                                ],
                              ),
                            )),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            Navigator.pop(context);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text('Subscribed to ${plan.name}'),
                                backgroundColor: Colors.green,
                              ),
                            );
                          },
                          child: const Text('Subscribe Now'),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.grey,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Color _getStatusColor(SubscriptionStatus status) {
    switch (status) {
      case SubscriptionStatus.active:
        return Colors.green;
      case SubscriptionStatus.expired:
        return Colors.red;
      case SubscriptionStatus.pending:
        return Colors.orange;
      case SubscriptionStatus.cancelled:
        return Colors.grey;
    }
  }

  String _getStatusText(SubscriptionStatus status) {
    switch (status) {
      case SubscriptionStatus.active:
        return 'Active';
      case SubscriptionStatus.expired:
        return 'Expired';
      case SubscriptionStatus.pending:
        return 'Pending';
      case SubscriptionStatus.cancelled:
        return 'Cancelled';
    }
  }

  String _getBillingCycleText(BillingCycle cycle) {
    switch (cycle) {
      case BillingCycle.monthly:
        return 'month';
      case BillingCycle.yearly:
        return 'year';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}

enum SubscriptionTab { active, expired, all }

enum SubscriptionStatus { active, expired, pending, cancelled }

enum BillingCycle { monthly, yearly }

class Subscription {
  final int id;
  final String planName;
  final int planId;
  final SubscriptionStatus status;
  final DateTime startDate;
  final DateTime endDate;
  final double amount;
  final BillingCycle billingCycle;
  final bool autoRenew;
  final String paymentMethod;
  final List<String> features;

  Subscription({
    required this.id,
    required this.planName,
    required this.planId,
    required this.status,
    required this.startDate,
    required this.endDate,
    required this.amount,
    required this.billingCycle,
    required this.autoRenew,
    required this.paymentMethod,
    required this.features,
  });
}

class Plan {
  final int id;
  final String name;
  final String description;
  final double price;
  final BillingCycle billingCycle;
  final List<String> features;
  final bool isPopular;

  Plan({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.billingCycle,
    required this.features,
    required this.isPopular,
  });
}