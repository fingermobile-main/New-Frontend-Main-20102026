import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';

class SettingsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Settings'),
      ),
      body: ListView(
        children: [
          // Bluetooth section
          ListTile(
            leading: CircleAvatar(
              child: Icon(Icons.bluetooth),
            ),
            title: Text('Bluetooth Settings'),
            subtitle: Text('Connect to external devices'),
            trailing: Icon(Icons.arrow_forward_ios),
            onTap: () {
              Navigator.pushNamed(context, '/bluetooth-settings');
            },
          ),
          Divider(height: 1),
          
          // Account section
          ListTile(
            leading: CircleAvatar(
              child: Icon(Icons.account_circle),
            ),
            title: Text('Account'),
            subtitle: Text('Manage your account settings'),
            trailing: Icon(Icons.arrow_forward_ios),
            onTap: () {
              Navigator.pushNamed(context, '/account-management');
            },
          ),
          Divider(height: 1),
          
          // Privacy section
          ListTile(
            leading: CircleAvatar(
              child: Icon(Icons.privacy_tip),
            ),
            title: Text('Privacy'),
            subtitle: Text('Control your privacy settings'),
            trailing: Icon(Icons.arrow_forward_ios),
            onTap: () {
              Navigator.pushNamed(context, '/privacy');
            },
          ),
          Divider(height: 1),
          
          // Security section
          ListTile(
            leading: CircleAvatar(
              child: Icon(Icons.security),
            ),
            title: Text('Security'),
            subtitle: Text('Two-factor authentication, etc.'),
            trailing: Icon(Icons.arrow_forward_ios),
            onTap: () {
              Navigator.pushNamed(context, '/security');
            },
          ),
          Divider(height: 1),
          
          // Notifications section
          ListTile(
            leading: CircleAvatar(
              child: Icon(Icons.notifications),
            ),
            title: Text('Notifications'),
            subtitle: Text('Notification preferences'),
            trailing: Icon(Icons.arrow_forward_ios),
            onTap: () {
              Navigator.pushNamed(context, '/notification-preferences');
            },
          ),
          Divider(height: 1),
          
          // Appearance section
          ListTile(
            leading: CircleAvatar(
              child: Icon(Icons.palette),
            ),
            title: Text('Appearance'),
            subtitle: Text('Theme, language, accessibility'),
            trailing: Icon(Icons.arrow_forward_ios),
            onTap: () {
              Navigator.pushNamed(context, '/theme');
            },
          ),
          Divider(height: 1),
          
          // Content section
          ListTile(
            leading: CircleAvatar(
              child: Icon(Icons.filter_none),
            ),
            title: Text('Content Preferences'),
            subtitle: Text('Filters and content settings'),
            trailing: Icon(Icons.arrow_forward_ios),
            onTap: () {
              Navigator.pushNamed(context, '/content-filters');
            },
          ),
          Divider(height: 1),
          
          // Support section
          ListTile(
            leading: CircleAvatar(
              child: Icon(Icons.help),
            ),
            title: Text('Help & Support'),
            subtitle: Text('FAQ, contact support'),
            trailing: Icon(Icons.arrow_forward_ios),
            onTap: () {
              Navigator.pushNamed(context, '/help');
            },
          ),
          Divider(height: 1),
          
          // About section
          ListTile(
            leading: CircleAvatar(
              child: Icon(Icons.info),
            ),
            title: Text('About'),
            subtitle: Text('Version, terms, policy'),
            trailing: Icon(Icons.arrow_forward_ios),
            onTap: () {
              // For now, just show a snackbar
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('FingerMobile v1.0.0'),
                  duration: Duration(seconds: 2),
                ),
              );
            },
          ),
          Divider(height: 1),
          
          // Logout section
          SizedBox(height: 24),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: ElevatedButton(
              onPressed: () async {
                final provider = Provider.of<AppProvider>(context, listen: false);
                await provider.logout();
                Navigator.pushReplacementNamed(context, '/login');
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                padding: EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: Text(
                'Log Out',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ),
          SizedBox(height: 24),
        ],
      ),
    );
  }
}