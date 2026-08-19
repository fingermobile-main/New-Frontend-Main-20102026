import 'package:flutter/material.dart';

class NotificationPreferencesPage extends StatefulWidget {
  @override
  _NotificationPreferencesPageState createState() => _NotificationPreferencesPageState();
}

class _NotificationPreferencesPageState extends State<NotificationPreferencesPage> {
  bool _emailNotifications = true;
  bool _pushNotifications = true;
  bool _smsNotifications = false;
  bool _marketingEmails = false;
  bool _digestEmails = true;

  Map<String, bool> _notificationTypes = {
    'Content Likes': true,
    'Comments': true,
    'Follows': true,
    'Mentions': true,
    'Direct Messages': true,
    'Group Invites': true,
    'Account Activity': true,
    'Security Alerts': true,
  };

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Notification Preferences'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Notification Preferences',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Manage how you receive notifications',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 24),
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
                    'Notification Channels',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 16),
                  _buildNotificationToggle(
                    'Email Notifications',
                    'Receive notifications via email',
                    _emailNotifications,
                    (value) {
                      setState(() {
                        _emailNotifications = value;
                      });
                    },
                  ),
                  Divider(height: 1),
                  _buildNotificationToggle(
                    'Push Notifications',
                    'Receive notifications on your device',
                    _pushNotifications,
                    (value) {
                      setState(() {
                        _pushNotifications = value;
                      });
                    },
                  ),
                  Divider(height: 1),
                  _buildNotificationToggle(
                    'SMS Notifications',
                    'Receive notifications via text message',
                    _smsNotifications,
                    (value) {
                      setState(() {
                        _smsNotifications = value;
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
                    'Email Preferences',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 16),
                  _buildNotificationToggle(
                    'Marketing Emails',
                    'Receive promotional emails and offers',
                    _marketingEmails,
                    (value) {
                      setState(() {
                        _marketingEmails = value;
                      });
                    },
                  ),
                  Divider(height: 1),
                  _buildNotificationToggle(
                    'Digest Emails',
                    'Receive weekly summary emails',
                    _digestEmails,
                    (value) {
                      setState(() {
                        _digestEmails = value;
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
                    'Notification Types',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 16),
                  ..._notificationTypes.keys.map((type) {
                    return Column(
                      children: [
                        _buildNotificationToggle(
                          type,
                          '',
                          _notificationTypes[type]!,
                          (value) {
                            setState(() {
                              _notificationTypes[type] = value;
                            });
                          },
                        ),
                        Divider(height: 1),
                      ],
                    );
                  }).toList(),
                ],
              ),
            ),
            SizedBox(height: 24),
            Container(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // Save preferences
                  _savePreferences();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepPurple,
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(vertical: 16),
                ),
                child: Text('Save Preferences'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNotificationToggle(
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
      subtitle: subtitle.isNotEmpty ? Text(subtitle) : null,
      trailing: Switch(
        value: value,
        onChanged: onChanged,
      ),
      onTap: () {
        onChanged(!value);
      },
    );
  }

  void _savePreferences() {
    // Show confirmation
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Preferences Saved'),
          content: Text('Your notification preferences have been updated successfully.'),
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