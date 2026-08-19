import 'package:flutter/material.dart';

class PrivacySettingsPage extends StatefulWidget {
  @override
  _PrivacySettingsPageState createState() => _PrivacySettingsPageState();
}

class _PrivacySettingsPageState extends State<PrivacySettingsPage> {
  bool _profileVisible = true;
  bool _showActivityStatus = true;
  bool _allowMessaging = true;
  bool _showEmail = false;
  bool _locationSharing = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Privacy Settings'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Privacy Settings',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Control who can see your information',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 24),
            _buildSettingsCard([
              _buildSettingsItem(
                title: 'Profile Visibility',
                subtitle: 'Who can see your profile',
                trailing: Switch(
                  value: _profileVisible,
                  onChanged: (value) {
                    setState(() {
                      _profileVisible = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _profileVisible = !_profileVisible;
                  });
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'Online Status',
                subtitle: 'Show when you\'re active',
                trailing: Switch(
                  value: _showActivityStatus,
                  onChanged: (value) {
                    setState(() {
                      _showActivityStatus = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _showActivityStatus = !_showActivityStatus;
                  });
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'Allow Messaging',
                subtitle: 'Allow members to message you',
                trailing: Switch(
                  value: _allowMessaging,
                  onChanged: (value) {
                    setState(() {
                      _allowMessaging = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _allowMessaging = !_allowMessaging;
                  });
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'Show Email',
                subtitle: 'Show email on profile',
                trailing: Switch(
                  value: _showEmail,
                  onChanged: (value) {
                    setState(() {
                      _showEmail = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _showEmail = !_showEmail;
                  });
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'Location Sharing',
                subtitle: 'Share location with contacts',
                trailing: Switch(
                  value: _locationSharing,
                  onChanged: (value) {
                    setState(() {
                      _locationSharing = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _locationSharing = !_locationSharing;
                  });
                },
              ),
            ]),
            SizedBox(height: 24),
            Text(
              'Additional Privacy Controls',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            _buildSettingsCard([
              _buildSettingsItem(
                title: 'Block members',
                subtitle: 'Manage blocked members',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {},
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'Report Content',
                subtitle: 'Report inappropriate content',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {},
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'Data Usage',
                subtitle: 'Control data usage settings',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {},
              ),
            ]),
            SizedBox(height: 24),
            Container(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // Save privacy settings
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Privacy settings saved'),
                      backgroundColor: Colors.green,
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
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

  Widget _buildSettingsCard(List<Widget> children) {
    return Card(
      elevation: 2,
      child: Column(
        children: children,
      ),
    );
  }

  Widget _buildSettingsItem({
    required String title,
    required String subtitle,
    Widget? trailing,
    required VoidCallback onTap,
  }) {
    return ListTile(
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