import 'package:flutter/material.dart';
import '../services/api_service.dart';

class MonetizationScreen extends StatefulWidget {
  @override
  _MonetizationScreenState createState() => _MonetizationScreenState();
}

class _MonetizationScreenState extends State<MonetizationScreen> {
  // Monetization settings state
  bool _enableMonetization = false;
  bool _allowAds = true;
  bool _allowSponsored = true;
  bool _showEarnings = true;
  double _totalEarnings = 0.0;
  double _pendingEarnings = 0.0;
  String _paymentMethod = 'PayPal';
  String _bankAccount = '**** 4567';

  @override
  void initState() {
    super.initState();
    _loadMonetizationSettings();
  }

  Future<void> _loadMonetizationSettings() async {
    try {
      final settings = await ApiService.get('/member/monetization');
      if (settings != null) {
        setState(() {
          _enableMonetization = settings['enable_monetization'] ?? false;
          _allowAds = settings['allow_ads'] ?? true;
          _allowSponsored = settings['allow_sponsored'] ?? true;
          _showEarnings = settings['show_earnings'] ?? true;
          _totalEarnings = double.tryParse(settings['total_earnings']?.toString() ?? '0.0') ?? 0.0;
          _pendingEarnings = double.tryParse(settings['pending_earnings']?.toString() ?? '0.0') ?? 0.0;
          _paymentMethod = settings['payment_method'] ?? 'PayPal';
          _bankAccount = settings['bank_account'] ?? '**** 4567';
        });
      }
    } catch (e) {
      print('Error loading monetization settings: $e');
    }
  }

  Future<void> _saveMonetizationSetting(String setting, dynamic value) async {
    try {
      await ApiService.put('/member/monetization', {
        setting: value,
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Monetization setting updated'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      print('Error saving monetization setting: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error saving monetization setting'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Monetization'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          // Earnings Overview
          Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Colors.green, Colors.blue],
              ),
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(20),
                bottomRight: Radius.circular(20),
              ),
            ),
            child: Column(
              children: [
                Text(
                  'Total Earnings',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w400,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  '\$${_totalEarnings.toStringAsFixed(2)}',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _buildEarningsCard('Pending', '\$${_pendingEarnings.toStringAsFixed(2)}', Colors.orange),
                    _buildEarningsCard('This Month', '\$125.50', Colors.blue),
                  ],
                ),
              ],
            ),
          ),
          
          SizedBox(height: 16),
          
          // Monetization Settings
          _buildSectionHeader('Monetization Settings'),
          SwitchListTile(
            title: Text('Enable Monetization'),
            subtitle: Text('Allow your content to be monetized'),
            value: _enableMonetization,
            onChanged: (value) {
              setState(() {
                _enableMonetization = value;
              });
              _saveMonetizationSetting('enable_monetization', value);
            },
          ),
          SwitchListTile(
            title: Text('Allow Ads'),
            subtitle: Text('Show ads on your content'),
            value: _allowAds,
            onChanged: (value) {
              setState(() {
                _allowAds = value;
              });
              _saveMonetizationSetting('allow_ads', value);
            },
          ),
          SwitchListTile(
            title: Text('Allow Sponsored Content'),
            subtitle: Text('Allow sponsored content on your profile'),
            value: _allowSponsored,
            onChanged: (value) {
              setState(() {
                _allowSponsored = value;
              });
              _saveMonetizationSetting('allow_sponsored', value);
            },
          ),
          
          // Payment Methods
          _buildSectionHeader('Payment Methods'),
          _buildSettingItem(
            icon: Icons.account_balance,
            title: 'Bank Account',
            subtitle: _bankAccount,
            onTap: () {
              // Navigate to bank account settings
              _showBankAccountDialog();
            },
          ),
          _buildSettingItem(
            icon: Icons.paypal,
            title: 'PayPal',
            subtitle: _paymentMethod == 'PayPal' ? 'Default' : 'Not set as default',
            onTap: () {
              // Navigate to PayPal settings
              _showPaymentMethodDialog();
            },
          ),
          
          // Monetization Options
          _buildSectionHeader('Monetization Options'),
          _buildSettingItem(
            icon: Icons.pie_chart,
            title: 'Earnings Report',
            subtitle: 'View your detailed earnings report',
            onTap: () {
              // Navigate to earnings report
            },
          ),
          _buildSettingItem(
            icon: Icons.trending_up,
            title: 'Performance Analytics',
            subtitle: 'See how your content performs',
            onTap: () {
              // Navigate to performance analytics
            },
          ),
          _buildSettingItem(
            icon: Icons.campaign,
            title: 'Ad Preferences',
            subtitle: 'Manage your ad preferences',
            onTap: () {
              // Navigate to ad preferences
            },
          ),
          
          // FIC Token Options
          _buildSectionHeader('FIC Token Options'),
          _buildSettingItem(
            icon: Icons.monetization_on,
            title: 'FIC Wallet',
            subtitle: 'Manage your FIC token wallet',
            onTap: () {
              // Navigate to FIC wallet
              Navigator.pushNamed(context, '/wallet');
            },
          ),
          _buildSettingItem(
            icon: Icons.swap_horiz,
            title: 'FIC Exchange',
            subtitle: 'Exchange FIC tokens',
            onTap: () {
              // Navigate to FIC exchange
            },
          ),
          _buildSettingItem(
            icon: Icons.info,
            title: 'About FIC Tokens',
            subtitle: 'Learn more about FIC tokens',
            onTap: () {
              // Show FIC token information
              _showFicInfoDialog();
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: Colors.grey[200],
      child: Text(
        title,
        style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.bold,
          color: Colors.grey[600],
        ),
      ),
    );
  }

  Widget _buildSettingItem({
    required IconData icon,
    required String title,
    String? subtitle,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: Colors.blue),
      title: Text(title),
      subtitle: subtitle != null ? Text(subtitle) : null,
      trailing: Icon(Icons.arrow_forward_ios, size: 16),
      onTap: onTap,
    );
  }

  Widget _buildEarningsCard(String title, String value, Color color) {
    return Expanded(
      child: Container(
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.2),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(
              title,
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showBankAccountDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        final accountNumberController = TextEditingController();
        final routingNumberController = TextEditingController();

        return AlertDialog(
          title: Text('Add Bank Account'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: accountNumberController,
                decoration: InputDecoration(
                  labelText: 'Account Number',
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 16),
              TextField(
                controller: routingNumberController,
                decoration: InputDecoration(
                  labelText: 'Routing Number',
                  border: OutlineInputBorder(),
                ),
              ),
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
                // In a real app, this would save the bank account via API
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Bank account would be added'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: Text('Save'),
            ),
          ],
        );
      },
    );
  }

  void _showPaymentMethodDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Select Payment Method'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              RadioListTile<String>(
                title: Text('PayPal'),
                value: 'PayPal',
                groupValue: _paymentMethod,
                onChanged: (String? value) {
                  if (value != null) {
                    setState(() {
                      _paymentMethod = value;
                    });
                    Navigator.of(context).pop();
                    _saveMonetizationSetting('payment_method', value);
                  }
                },
              ),
              RadioListTile<String>(
                title: Text('Bank Transfer'),
                value: 'Bank Transfer',
                groupValue: _paymentMethod,
                onChanged: (String? value) {
                  if (value != null) {
                    setState(() {
                      _paymentMethod = value;
                    });
                    Navigator.of(context).pop();
                    _saveMonetizationSetting('payment_method', value);
                  }
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _showFicInfoDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('About FIC Tokens'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'FIC (FingerMobile Infinite Coin) tokens are the native cryptocurrency of the FingerMobile platform. They can be used for:',
                  style: TextStyle(fontSize: 16),
                ),
                SizedBox(height: 16),
                Text(
                  '• Purchasing premium features\n'
                  '• Boosting your posts\n'
                  '• Supporting your favorite creators\n'
                  '• Participating in platform governance\n'
                  '• Exchanging for other cryptocurrencies',
                  style: TextStyle(fontSize: 16),
                ),
                SizedBox(height: 16),
                Text(
                  'FIC tokens are built on the Ethereum blockchain as an ERC-20 token, ensuring security and interoperability.',
                  style: TextStyle(fontSize: 16),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Close'),
            ),
          ],
        );
      },
    );
  }
}