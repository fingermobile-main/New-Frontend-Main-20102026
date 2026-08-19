import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AccountManagementScreen extends StatefulWidget {
  @override
  _AccountManagementScreenState createState() => _AccountManagementScreenState();
}

class _AccountManagementScreenState extends State<AccountManagementScreen> {
  // Account settings
  String _membername = 'member123';
  String _email = 'member@example.com';
  String _phoneNumber = '+1234567890';
  String _accountType = 'Premium';
  DateTime _accountCreated = DateTime(2023, 1, 15);
  bool _twoFactorAuth = false;
  bool _emailVerified = true;
  bool _phoneNumberVerified = true;
  String _lastLogin = '2023-12-28 14:30:22';
  String _currentDevice = 'iPhone 14 Pro';

  @override
  void initState() {
    super.initState();
    _loadAccountInfo();
  }

  Future<void> _loadAccountInfo() async {
    try {
      final accountInfo = await ApiService.get('/member/account_info');
      if (accountInfo != null) {
        setState(() {
          _membername = accountInfo['membername'] ?? _membername;
          _email = accountInfo['email'] ?? _email;
          _phoneNumber = accountInfo['phone_number'] ?? accountInfo['phoneNumber'] ?? _phoneNumber;
          _accountType = accountInfo['account_type'] ?? accountInfo['accountType'] ?? _accountType;
          _accountCreated = DateTime.tryParse(accountInfo['created_at'] ?? accountInfo['createdAt'] ?? _accountCreated.toString()) ?? _accountCreated;
          _twoFactorAuth = accountInfo['two_factor_auth'] ?? accountInfo['twoFactorAuth'] ?? _twoFactorAuth;
          _emailVerified = accountInfo['email_verified'] ?? accountInfo['emailVerified'] ?? _emailVerified;
          _phoneNumberVerified = accountInfo['phone_verified'] ?? accountInfo['phoneVerified'] ?? _phoneNumberVerified;
          _lastLogin = accountInfo['last_login'] ?? accountInfo['lastLogin'] ?? _lastLogin;
        });
      }
    } catch (e) {
      print('Error loading account info: $e');
    }
  }

  Future<void> _toggleTwoFactorAuth() async {
    setState(() {
      _twoFactorAuth = !_twoFactorAuth;
    });
    
    try {
      await ApiService.put('/member/two_factor_auth', {
        'enabled': _twoFactorAuth
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_twoFactorAuth ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      print('Error updating two-factor auth: $e');
      setState(() {
        _twoFactorAuth = !_twoFactorAuth; // Revert the change
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error updating two-factor authentication'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _changePassword() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        final currentPasswordController = TextEditingController();
        final newPasswordController = TextEditingController();
        final confirmNewPasswordController = TextEditingController();

        return AlertDialog(
          title: Text('Change Password'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: currentPasswordController,
                decoration: InputDecoration(
                  labelText: 'Current Password',
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
              ),
              SizedBox(height: 16),
              TextField(
                controller: newPasswordController,
                decoration: InputDecoration(
                  labelText: 'New Password',
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
              ),
              SizedBox(height: 16),
              TextField(
                controller: confirmNewPasswordController,
                decoration: InputDecoration(
                  labelText: 'Confirm New Password',
                  border: OutlineInputBorder(),
                ),
                obscureText: true,
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
                // In a real app, this would change the password via API
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Password change request submitted'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: Text('Change'),
            ),
          ],
        );
      },
    );
  }

  void _deactivateAccount() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Deactivate Account'),
          content: Text('Are you sure you want to deactivate your account? You can reactivate it at any time.'),
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
                // In a real app, this would deactivate the account via API
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Account deactivation request submitted'),
                    backgroundColor: Colors.orange,
                  ),
                );
              },
              child: Text('Deactivate', style: TextStyle(color: Colors.orange)),
            ),
          ],
        );
      },
    );
  }

  void _deleteAccount() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Delete Account'),
          content: Text('Are you sure you want to delete your account? This action is irreversible and will permanently remove all your data from our servers.'),
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
                // In a real app, this would delete the account via API
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Account deletion request submitted'),
                    backgroundColor: Colors.red,
                  ),
                );
              },
              child: Text('Delete', style: TextStyle(color: Colors.red)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Account Management'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          // Account Summary
          Card(
            margin: EdgeInsets.all(16),
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 30,
                        child: Icon(Icons.person, size: 30),
                      ),
                      SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              _membername,
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              '$_email | $_phoneNumber',
                              style: TextStyle(
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: _accountType == 'Premium' ? Colors.orange[100] : Colors.blue[100],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          _accountType,
                          style: TextStyle(
                            color: _accountType == 'Premium' ? Colors.orange[800] : Colors.blue[800],
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildAccountStat('Posts', '142'),
                      _buildAccountStat('Followers', '1.2K'),
                      _buildAccountStat('Following', '856'),
                    ],
                  ),
                ],
              ),
            ),
          ),
          
          // Account Information
          _buildSectionHeader('Account Information'),
          _buildInfoItem('membername', _membername, Icons.person),
          _buildInfoItem('Email', _email, Icons.email),
          _buildInfoItem('Phone Number', _phoneNumber, Icons.phone),
          _buildInfoItem('Account Type', _accountType, Icons.verified),
          _buildInfoItem('Account Created', _formatDate(_accountCreated), Icons.calendar_today),
          _buildInfoItem('Last Login', _lastLogin, Icons.access_time),
          
          // Security Settings
          _buildSectionHeader('Security Settings'),
          SwitchListTile(
            title: Text('Two-Factor Authentication'),
            value: _twoFactorAuth,
            onChanged: (_) => _toggleTwoFactorAuth(),
          ),
          _buildInfoItem('Email Verified', _emailVerified ? 'Yes' : 'No', Icons.verified_member),
          _buildInfoItem('Phone Verified', _phoneNumberVerified ? 'Yes' : 'No', Icons.verified_member),
          _buildActionItem(
            icon: Icons.lock,
            title: 'Change Password',
            onTap: _changePassword,
          ),
          
          // Account Actions
          _buildSectionHeader('Account Actions'),
          _buildActionItem(
            icon: Icons.deactivate,
            title: 'Deactivate Account',
            onTap: _deactivateAccount,
          ),
          _buildActionItem(
            icon: Icons.delete,
            title: 'Delete Account',
            onTap: _deleteAccount,
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

  Widget _buildInfoItem(String label, String value, IconData icon) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Icon(icon, color: Colors.blue),
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
        ],
      ),
    );
  }

  Widget _buildActionItem({
    required IconData icon,
    required String title,
    VoidCallback? onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: Colors.blue),
      title: Text(title),
      trailing: Icon(Icons.arrow_forward_ios, size: 16),
      onTap: onTap,
    );
  }

  Widget _buildAccountStat(String label, String value) {
    return Expanded(
      child: Container(
        padding: EdgeInsets.all(8),
        child: Column(
          children: [
            Text(
              value,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}