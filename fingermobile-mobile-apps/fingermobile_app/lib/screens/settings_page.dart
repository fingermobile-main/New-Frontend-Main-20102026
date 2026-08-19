import 'package:flutter/material.dart';

class SettingsPage extends StatefulWidget {
  @override
  _SettingsPageState createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _notificationsEnabled = true;
  bool _emailUpdatesEnabled = false;
  bool _darkModeEnabled = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Settings'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Account Settings',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            _buildSettingsCard([
              _buildSettingsItem(
                icon: Icons.person,
                title: 'Edit Profile',
                subtitle: 'Update your profile information',
                onTap: () {},
              ),
              Divider(height: 1),
              _buildSettingsItem(
                icon: Icons.lock,
                title: 'Privacy & Security',
                subtitle: 'Manage your privacy settings',
                onTap: () {},
              ),
              Divider(height: 1),
              _buildSettingsItem(
                icon: Icons.notifications,
                title: 'Notifications',
                subtitle: 'Configure notification preferences',
                trailing: Switch(
                  value: _notificationsEnabled,
                  onChanged: (value) {
                    setState(() {
                      _notificationsEnabled = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _notificationsEnabled = !_notificationsEnabled;
                  });
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                icon: Icons.email,
                title: 'Email Updates',
                subtitle: 'Receive email notifications',
                trailing: Switch(
                  value: _emailUpdatesEnabled,
                  onChanged: (value) {
                    setState(() {
                      _emailUpdatesEnabled = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _emailUpdatesEnabled = !_emailUpdatesEnabled;
                  });
                },
              ),
            ]),
            SizedBox(height: 20),
            Text(
              'App Settings',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            _buildSettingsCard([
              _buildSettingsItem(
                icon: Icons.dark_mode,
                title: 'Dark Mode',
                subtitle: 'Switch to dark theme',
                trailing: Switch(
                  value: _darkModeEnabled,
                  onChanged: (value) {
                    setState(() {
                      _darkModeEnabled = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _darkModeEnabled = !_darkModeEnabled;
                  });
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                icon: Icons.language,
                title: 'Language',
                subtitle: 'English',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {},
              ),
              Divider(height: 1),
              _buildSettingsItem(
                icon: Icons.storage,
                title: 'Storage',
                subtitle: 'Manage app storage',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {},
              ),
            ]),
            SizedBox(height: 20),
            Text(
              'Support & About',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            _buildSettingsCard([
              _buildSettingsItem(
                icon: Icons.help,
                title: 'Help & Support',
                subtitle: 'Get help using the app',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {},
              ),
              Divider(height: 1),
              _buildSettingsItem(
                icon: Icons.privacy_tip,
                title: 'Privacy Policy',
                subtitle: 'Read our privacy policy',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {},
              ),
              Divider(height: 1),
              _buildSettingsItem(
                icon: Icons.article,
                title: 'Terms of Service',
                subtitle: 'Read our terms of service',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {},
              ),
              Divider(height: 1),
              _buildSettingsItem(
                icon: Icons.info,
                title: 'About App',
                subtitle: 'Version 1.0.0',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {},
              ),
            ]),
            SizedBox(height: 30),
            Container(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // Handle logout
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red,
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(vertical: 16),
                ),
                child: Text('Logout'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsCard(List<Widget> children) {
    return Card(
      elevation: 2,
      child: Column(
        children: children,
      ),
    );
  }

  Widget _buildSettingsItem({
    required IconData icon,
    required String title,
    required String subtitle,
    Widget? trailing,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(
        icon,
        color: Colors.blue,
      ),
      title: Text(
        title,
        style: TextStyle(
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Text(subtitle),
      trailing: trailing,
      onTap: onTap,
    );
  }
}