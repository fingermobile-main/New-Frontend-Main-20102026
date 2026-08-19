import 'package:flutter/material.dart';

class AccountSecurityPage extends StatefulWidget {
  @override
  _AccountSecurityPageState createState() => _AccountSecurityPageState();
}

class _AccountSecurityPageState extends State<AccountSecurityPage> {
  bool _twoFactorAuth = false;
  bool _biometricAuth = false;
  bool _requirePassword = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Account Security'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Account Security',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Manage your account security settings',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 20),
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Authentication',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 16),
                  _buildSecurityToggle(
                    'Two-Factor Authentication',
                    'Add an extra layer of security to your account',
                    _twoFactorAuth,
                    (value) {
                      setState(() {
                        _twoFactorAuth = value;
                      });
                      if (value) {
                        // Navigate to setup 2FA
                        _setupTwoFactorAuth();
                      }
                    },
                  ),
                  Divider(height: 1),
                  _buildSecurityToggle(
                    'Biometric Authentication',
                    'Use fingerprint or face recognition to sign in',
                    _biometricAuth,
                    (value) {
                      setState(() {
                        _biometricAuth = value;
                      });
                    },
                  ),
                  Divider(height: 1),
                  _buildSecurityToggle(
                    'Require Password for Payments',
                    'Enter password for each payment',
                    _requirePassword,
                    (value) {
                      setState(() {
                        _requirePassword = value;
                      });
                    },
                  ),
                ],
              ),
            ),
            SizedBox(height: 16),
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Security Settings',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 16),
                  ListTile(
                    leading: Icon(
                      Icons.password,
                      color: Colors.deepPurple,
                    ),
                    title: Text('Change Password'),
                    trailing: Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {
                      // Navigate to change password
                    },
                  ),
                  Divider(height: 1),
                  ListTile(
                    leading: Icon(
                      Icons.devices,
                      color: Colors.deepPurple,
                    ),
                    title: Text('Active Sessions'),
                    trailing: Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {
                      // Navigate to active sessions
                    },
                  ),
                  Divider(height: 1),
                  ListTile(
                    leading: Icon(
                      Icons.privacy_tip,
                      color: Colors.deepPurple,
                    ),
                    title: Text('Privacy Settings'),
                    trailing: Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {
                      Navigator.pushNamed(context, '/privacy-controls');
                    },
                  ),
                ],
              ),
            ),
            SizedBox(height: 16),
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Recent Activity',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 16),
                  _buildActivityItem(
                    'Dec 25, 2025, 14:30',
                    'New device signed in',
                    Icons.devices,
                    Colors.blue,
                  ),
                  Divider(height: 1),
                  _buildActivityItem(
                    'Dec 24, 2025, 09:15',
                    'Password changed',
                    Icons.lock,
                    Colors.green,
                  ),
                  Divider(height: 1),
                  _buildActivityItem(
                    'Dec 23, 2025, 18:45',
                    'New recovery email added',
                    Icons.email,
                    Colors.orange,
                  ),
                ],
              ),
            ),
            SizedBox(height: 24),
            Container(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // Save security settings
                  _saveSettings();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepPurple,
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(vertical: 16),
                ),
                child: Text('Save Settings'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSecurityToggle(
    String title,
    String subtitle,
    bool value,
    Function(bool) onChanged,
  ) {
    return ListTile(
      title: Text(
        title,
        style: TextStyle(
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Text(subtitle),
      trailing: Switch(
        value: value,
        onChanged: onChanged,
      ),
      onTap: () {
        onChanged(!value);
      },
    );
  }

  Widget _buildActivityItem(
    String time,
    String description,
    IconData icon,
    Color color,
  ) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8),
      child: Row(
        children: [
          Icon(icon, color: color),
          SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  description,
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  time,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _setupTwoFactorAuth() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Enable Two-Factor Authentication'),
          content: Text('Would you like to set up two-factor authentication using an authenticator app or SMS?'),
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
                // Navigate to 2FA setup
              },
              child: Text('Setup'),
              style: TextButton.styleFrom(
                foregroundColor: Colors.deepPurple,
              ),
            ),
          ],
        );
      },
    );
  }

  void _saveSettings() {
    // Show confirmation
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Settings Saved'),
          content: Text('Your security settings have been updated successfully.'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('OK'),
            ),
          ],
        );
      },
    );
  }
}