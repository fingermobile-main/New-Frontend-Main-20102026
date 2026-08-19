import 'package:flutter/material.dart';

class NotificationSettingsPage extends StatefulWidget {
  @override
  _NotificationSettingsPageState createState() => _NotificationSettingsPageState();
}

class _NotificationSettingsPageState extends State<NotificationSettingsPage> {
  bool _pushNotifications = true;
  bool _emailNotifications = false;
  bool _smsNotifications = false;
  bool _commentNotifications = true;
  bool _likeNotifications = true;
  bool _followNotifications = true;
  bool _promotionalNotifications = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Notification Settings'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Notification Settings',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Manage your notification preferences',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 24),
            Text(
              'Notification Types',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            _buildSettingsCard([
              _buildSettingsItem(
                title: 'Push Notifications',
                subtitle: 'Receive notifications on this device',
                trailing: Switch(
                  value: _pushNotifications,
                  onChanged: (value) {
                    setState(() {
                      _pushNotifications = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _pushNotifications = !_pushNotifications;
                  });
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'Email Notifications',
                subtitle: 'Receive notifications via email',
                trailing: Switch(
                  value: _emailNotifications,
                  onChanged: (value) {
                    setState(() {
                      _emailNotifications = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _emailNotifications = !_emailNotifications;
                  });
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'SMS Notifications',
                subtitle: 'Receive notifications via SMS',
                trailing: Switch(
                  value: _smsNotifications,
                  onChanged: (value) {
                    setState(() {
                      _smsNotifications = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _smsNotifications = !_smsNotifications;
                  });
                },
              ),
            ]),
            SizedBox(height: 24),
            Text(
              'Notification Preferences',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            _buildSettingsCard([
              _buildSettingsItem(
                title: 'Comments',
                subtitle: 'Notify when someone comments on your posts',
                trailing: Switch(
                  value: _commentNotifications,
                  onChanged: (value) {
                    setState(() {
                      _commentNotifications = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _commentNotifications = !_commentNotifications;
                  });
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'Likes',
                subtitle: 'Notify when someone likes your content',
                trailing: Switch(
                  value: _likeNotifications,
                  onChanged: (value) {
                    setState(() {
                      _likeNotifications = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _likeNotifications = !_likeNotifications;
                  });
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'Follows',
                subtitle: 'Notify when someone follows you',
                trailing: Switch(
                  value: _followNotifications,
                  onChanged: (value) {
                    setState(() {
                      _followNotifications = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _followNotifications = !_followNotifications;
                  });
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'Promotional',
                subtitle: 'Receive promotional offers and updates',
                trailing: Switch(
                  value: _promotionalNotifications,
                  onChanged: (value) {
                    setState(() {
                      _promotionalNotifications = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _promotionalNotifications = !_promotionalNotifications;
                  });
                },
              ),
            ]),
            SizedBox(height: 24),
            Text(
              'Additional Options',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            _buildSettingsCard([
              _buildSettingsItem(
                title: 'Do Not Disturb',
                subtitle: 'Set quiet hours for notifications',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {},
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'Notification Sound',
                subtitle: 'Customize notification sounds',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {},
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'Notification Preview',
                subtitle: 'Show content preview in notifications',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {},
              ),
            ]),
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