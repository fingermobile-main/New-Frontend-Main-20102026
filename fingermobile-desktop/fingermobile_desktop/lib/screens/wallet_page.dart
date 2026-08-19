import 'package:flutter/material.dart';

class WalletPage extends StatefulWidget {
  const WalletPage({Key? key}) : super(key: key);

  @override
  State<WalletPage> createState() => _WalletPageState();
}

class _WalletPageState extends State<WalletPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Wallet'),
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              Navigator.pushNamed(context, '/settings');
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Sidebar with wallet options
            SizedBox(
              width: 250,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Wallet Actions',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      _buildActionItem(Icons.add, 'Add Funds', () {}),
                      _buildActionItem(Icons.send, 'Send Money', () {}),
                      _buildActionItem(Icons.receipt, 'Payment History', () {}),
                      _buildActionItem(Icons.account_balance, 'Bank Accounts', () {}),
                      _buildActionItem(Icons.credit_card, 'Payment Methods', () {}),
                      _buildActionItem(Icons.qr_code, 'Scan QR', () {}),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            
            // Main wallet content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Wallet balance card
                  Card(
                    elevation: 4,
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [
                            Theme.of(context).primaryColor,
                            Theme.of(context).primaryColorDark,
                          ],
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Current Balance',
                            style: TextStyle(
                              color: Colors.white70,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            '\$2,450.75',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 36,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              _buildBalanceOption('Add', Icons.add, () {}),
                              _buildBalanceOption('Send', Icons.send, () {}),
                              _buildBalanceOption('History', Icons.receipt, () {}),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Recent transactions
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Recent Transactions',
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                      TextButton(
                        onPressed: () {
                          // View all transactions
                        },
                        child: const Text('View All'),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Transaction list
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: ListView.builder(
                          itemCount: 5,
                          itemBuilder: (context, index) {
                            return _buildTransactionItem(index);
                          },
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Add money to wallet
        },
        tooltip: 'Add Funds',
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildActionItem(IconData icon, String title, VoidCallback onPressed) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: ListTile(
        leading: Icon(icon, color: Theme.of(context).primaryColor),
        title: Text(title),
        trailing: const Icon(Icons.chevron_right),
        onTap: onPressed,
      ),
    );
  }

  Widget _buildBalanceOption(String title, IconData icon, VoidCallback onPressed) {
    return TextButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, color: Colors.white),
      label: Text(
        title,
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w600,
        ),
      ),
      style: TextButton.styleFrom(
        foregroundColor: Colors.white,
      ),
    );
  }

  Widget _buildTransactionItem(int index) {
    final transactionTypes = ['Received', 'Sent', 'Received', 'Subscription', 'Sent'];
    final amounts = ['+\$120.50', '-\$25.99', '+\$45.00', '-\$9.99', '-\$125.00'];
    final descriptions = [
      'Payment from John Doe',
      'Online Store Purchase',
      'Freelance Project',
      'Monthly Subscription',
      'Gift Card Purchase'
    ];
    final times = [
      '10 minutes ago',
      '1 hour ago',
      '3 hours ago',
      '1 day ago',
      '2 days ago'
    ];
    
    bool isPositive = amounts[index].startsWith('+');
    Color amountColor = isPositive 
        ? Colors.green 
        : Theme.of(context).colorScheme.onSurface;
    
    IconData icon = isPositive ? Icons.arrow_downward : Icons.arrow_upward;
    Color iconColor = isPositive ? Colors.green : Colors.red;
    
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: Color.alphaBlend(iconColor.withOpacity(0.1), Colors.transparent),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Icon(icon, color: iconColor),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  descriptions[index],
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                    color: Theme.of(context).colorScheme.onSurface,
                  ),
                ),
                Text(
                  times[index],
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
          Text(
            amounts[index],
            style: TextStyle(
              fontWeight: FontWeight.w600,
              color: amountColor,
            ),
          ),
        ],
      ),
    );
  }
}