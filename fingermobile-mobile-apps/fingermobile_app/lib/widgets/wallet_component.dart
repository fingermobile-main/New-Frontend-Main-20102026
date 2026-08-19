import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';
import 'package:fingermobile_app/services\wallet_service.dart';

class WalletComponent extends StatefulWidget {
  @override
  _WalletComponentState createState() => _WalletComponentState();
}

class _WalletComponentState extends State<WalletComponent> {
  late Future<WalletInfo?> _walletInfoFuture;
  late Future<List<Transaction>> _transactionsFuture;
  
  @override
  void initState() {
    super.initState();
    _walletInfoFuture = WalletService().getWalletInfo();
    _transactionsFuture = WalletService().getTransactionHistory();
  }

  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Wallet & Payments',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Wallet Header
              Text(
                'My Wallet',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              
              // Balance Card
              FutureBuilder<WalletInfo?>(
                future: _walletInfoFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return _buildBalanceCardPlaceholder();
                  }
                  
                  if (snapshot.hasError || !snapshot.hasData) {
                    return _buildBalanceCardPlaceholder();
                  }
                  
                  final walletInfo = snapshot.data!;
                  return _buildBalanceCard(walletInfo);
                },
              ),
              
              SizedBox(height: 24),
              
              // Quick Actions
              Text(
                'Quick Actions',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              
              Wrap(
                spacing: 16,
                runSpacing: 16,
                children: [
                  _buildQuickAction('Send Money', Icons.send, Colors.blue, () {}),
                  _buildQuickAction('Receive', Icons.qr_code, Colors.green, () {}),
                  _buildQuickAction('Top Up', Icons.add, Colors.orange, () {}),
                  _buildQuickAction('Exchange', Icons.swap_horiz, Colors.purple, () {}),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Transaction History
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Recent Transactions',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () {},
                    child: Text('View All'),
                  ),
                ],
              ),
              SizedBox(height: 16),
              
              FutureBuilder<List<Transaction>>(
                future: _transactionsFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return _buildTransactionPlaceholder();
                  }
                  
                  if (snapshot.hasError || !snapshot.hasData) {
                    return _buildTransactionPlaceholder();
                  }
                  
                  final transactions = snapshot.data!;
                  return _buildTransactionList(transactions);
                },
              ),
              
              SizedBox(height: 24),
              
              // Payment Methods
              Text(
                'Payment Methods',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      _buildPaymentMethod('Credit Card', Icons.credit_card, '**** 1234'),
                      _buildPaymentMethod('PayPal', Icons.paypal, 'user@example.com'),
                      _buildPaymentMethod('Bank Account', Icons.account_balance, '**** 5678'),
                    ],
                  ),
                ),
              ),
              
              SizedBox(height: 24),
              
              // Security Features
              Text(
                'Security Features',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      _buildSecurityOption('Transaction Alerts', Icons.notifications, true),
                      _buildSecurityOption('Spending Limits', Icons.block, false),
                      _buildSecurityOption('Biometric Authentication', Icons.fingerprint, true),
                      _buildSecurityOption('Auto Logout', Icons.lock_clock, true),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBalanceCard(WalletInfo walletInfo) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Total Balance',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 8),
            Text(
              '\$${walletInfo.fiatBalance.toStringAsFixed(2)} USD',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildCurrencyCard('FIC', walletInfo.ficBalance.toStringAsFixed(2), Colors.orange),
                _buildCurrencyCard('USD', walletInfo.fiatBalance.toStringAsFixed(2), Colors.blue),
                _buildCurrencyCard('EUR', '0.00', Colors.green),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBalanceCardPlaceholder() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Total Balance',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 8),
            Text(
              '\$0.00 USD',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildCurrencyCard('FIC', '0.00', Colors.orange),
                _buildCurrencyCard('USD', '0.00', Colors.blue),
                _buildCurrencyCard('EUR', '0.00', Colors.green),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCurrencyCard(String currency, String amount, Color color) {
    return Container(
      width: 100,
      child: Card(
        color: color.withOpacity(0.1),
        child: Padding(
          padding: EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                currency,
                style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.w500,
                ),
              ),
              SizedBox(height: 4),
              Text(
                amount,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickAction(String title, IconData icon, Color color, VoidCallback onTap) {
    return Expanded(
      child: Card(
        child: InkWell(
          onTap: onTap,
          child: Padding(
            padding: EdgeInsets.all(16.0),
            child: Column(
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: color),
                ),
                SizedBox(height: 8),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTransactionList(List<Transaction> transactions) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(0),
        child: Column(
          children: transactions.take(5).map((transaction) {
            return ListTile(
              leading: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: transaction.type == 'credit' ? Colors.green.withOpacity(0.1) : Colors.red.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  transaction.type == 'credit' ? Icons.arrow_downward : Icons.arrow_upward,
                  color: transaction.type == 'credit' ? Colors.green : Colors.red,
                ),
              ),
              title: Text(transaction.description),
              subtitle: Text('${transaction.timestamp.day}/${transaction.timestamp.month}/${transaction.timestamp.year} • ${transaction.status}'),
              trailing: Text(
                transaction.type == 'credit' ? '+\$${transaction.amount.toStringAsFixed(2)}' : '-\$${transaction.amount.toStringAsFixed(2)}',
                style: TextStyle(
                  color: transaction.type == 'credit' ? Colors.green : Colors.red,
                  fontWeight: FontWeight.w500,
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildTransactionPlaceholder() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            ListTile(
              leading: Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.grey.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(Icons.hourglass_empty, color: Colors.grey),
              ),
              title: Text('Loading transactions...'),
              subtitle: Text('Please wait'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentMethod(String method, IconData icon, String details) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(icon, color: Colors.blue),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(method),
                Text(
                  details,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
          Icon(Icons.arrow_forward_ios, size: 16),
        ],
      ),
    );
  }

  Widget _buildSecurityOption(String title, IconData icon, bool enabled) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(icon, color: Colors.blue),
          SizedBox(width: 12),
          Expanded(
            child: Text(title),
          ),
          Switch(
            value: enabled,
            onChanged: (value) {
              setState(() {});
            },
          ),
        ],
      ),
    );
  }
}