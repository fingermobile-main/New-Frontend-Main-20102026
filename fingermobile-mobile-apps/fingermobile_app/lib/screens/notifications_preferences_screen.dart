import 'package:flutter/material.dart';
import '../services/api_service.dart';

class NotificationsPreferencesScreen extends StatefulWidget {
  @override
  _NotificationsPreferencesScreenState createState() => _NotificationsPreferencesScreenState();
}

class _NotificationsPreferencesScreenState extends State<NotificationsPreferencesScreen> {
  // Notification preferences
  bool _pushNotifications = true;
  bool _emailNotifications = true;
  bool _smsNotifications = false;
  bool _mentionNotifications = true;
  bool _followNotifications = true;
  bool _commentNotifications = true;
  bool _likeNotifications = true;
  bool _shareNotifications = false;
  bool _messageNotifications = true;
  bool _eventNotifications = true;
  bool _groupNotifications = true;
  bool _systemNotifications = true;
  String _notificationSound = 'Default';
  bool _vibrateOnNotification = true;
  bool _showNotificationPreview = true;

  @override
  void initState() {
    super.initState();
    _loadPreferences();
  }

  Future<void> _loadPreferences() async {
    try {
      final prefs = await ApiService.get('/member/notification_preferences');
      if (prefs != null) {
        setState(() {
          _pushNotifications = prefs['push_notifications'] ?? true;
          _emailNotifications = prefs['email_notifications'] ?? true;
          _smsNotifications = prefs['sms_notifications'] ?? false;
          _mentionNotifications = prefs['mention_notifications'] ?? true;
          _followNotifications = prefs['follow_notifications'] ?? true;
          _commentNotifications = prefs['comment_notifications'] ?? true;
          _likeNotifications = prefs['like_notifications'] ?? true;
          _shareNotifications = prefs['share_notifications'] ?? false;
          _messageNotifications = prefs['message_notifications'] ?? true;
          _eventNotifications = prefs['event_notifications'] ?? true;
          _groupNotifications = prefs['group_notifications'] ?? true;
          _systemNotifications = prefs['system_notifications'] ?? true;
          _notificationSound = prefs['notification_sound'] ?? 'Default';
          _vibrateOnNotification = prefs['vibrate_on_notification'] ?? true;
          _showNotificationPreview = prefs['show_notification_preview'] ?? true;
        });
      }
    } catch (e) {
      print('Error loading notification preferences: $e');
    }
  }

  Future<void> _savePreference(String key, dynamic value) async {
    try {
      await ApiService.put('/member/notification_preferences', {key: value});
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Notification preference updated'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      print('Error saving notification preference: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error saving notification preference'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Notification Preferences'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          // General Notification Settings
          _buildSectionHeader('General Settings'),
          SwitchListTile(
            title: Text('Push Notifications'),
            value: _pushNotifications,
            onChanged: (value) {
              setState(() {
                _pushNotifications = value;
              });
              _savePreference('push_notifications', value);
            },
          ),
          SwitchListTile(
            title: Text('Email Notifications'),
            value: _emailNotifications,
            onChanged: (value) {
              setState(() {
                _emailNotifications = value;
              });
              _savePreference('email_notifications', value);
            },
          ),
          SwitchListTile(
            title: Text('SMS Notifications'),
            value: _smsNotifications,
            onChanged: (value) {
              setState(() {
                _smsNotifications = value;
              });
              _savePreference('sms_notifications', value);
            },
          ),
          
          // Content Notifications
          _buildSectionHeader('Content Notifications'),
          SwitchListTile(
            title: Text('Mention Notifications'),
            value: _mentionNotifications,
            onChanged: (value) {
              setState(() {
                _mentionNotifications = value;
              });
              _savePreference('mention_notifications', value);
            },
          ),
          SwitchListTile(
            title: Text('Follow Notifications'),
            value: _followNotifications,
            onChanged: (value) {
              setState(() {
                _followNotifications = value;
              });
              _savePreference('follow_notifications', value);
            },
          ),
          SwitchListTile(
            title: Text('Comment Notifications'),
            value: _commentNotifications,
            onChanged: (value) {
              setState(() {
                _commentNotifications = value;
              });
              _savePreference('comment_notifications', value);
            },
          ),
          SwitchListTile(
            title: Text('Like Notifications'),
            value: _likeNotifications,
            onChanged: (value) {
              setState(() {
                _likeNotifications = value;
              });
              _savePreference('like_notifications', value);
            },
          ),
          SwitchListTile(
            title: Text('Share Notifications'),
            value: _shareNotifications,
            onChanged: (value) {
              setState(() {
                _shareNotifications = value;
              });
              _savePreference('share_notifications', value);
            },
          ),
          
          // Communication Notifications
          _buildSectionHeader('Communication Notifications'),
          SwitchListTile(
            title: Text('Message Notifications'),
            value: _messageNotifications,
            onChanged: (value) {
              setState(() {
                _messageNotifications = value;
              });
              _savePreference('message_notifications', value);
            },
          ),
          
          // Social Notifications
          _buildSectionHeader('Social Notifications'),
          SwitchListTile(
            title: Text('Event Notifications'),
            value: _eventNotifications,
            onChanged: (value) {
              setState(() {
                _eventNotifications = value;
              });
              _savePreference('event_notifications', value);
            },
          ),
          SwitchListTile(
            title: Text('Group Notifications'),
            value: _groupNotifications,
            onChanged: (value) {
              setState(() {
                _groupNotifications = value;
              });
              _savePreference('group_notifications', value);
            },
          ),
          SwitchListTile(
            title: Text('System Notifications'),
            value: _systemNotifications,
            onChanged: (value) {
              setState(() {
                _systemNotifications = value;
              });
              _savePreference('system_notifications', value);
            },
          ),
          
          // Notification Settings
          _buildSectionHeader('Notification Settings'),
          _buildDropdownSetting(
            title: 'Notification Sound',
            value: _notificationSound,
            items: ['Default', 'Sound 1', 'Sound 2', 'Sound 3', 'Silent'],
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  _notificationSound = newValue;
                });
                _savePreference('notification_sound', newValue);
              }
            },
          ),
          SwitchListTile(
            title: Text('Vibrate on Notification'),
            value: _vibrateOnNotification,
            onChanged: (value) {
              setState(() {
                _vibrateOnNotification = value;
              });
              _savePreference('vibrate_on_notification', value);
            },
          ),
          SwitchListTile(
            title: Text('Show Notification Preview'),
            value: _showNotificationPreview,
            onChanged: (value) {
              setState(() {
                _showNotificationPreview = value;
              });
              _savePreference('show_notification_preview', value);
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

  Widget _buildDropdownSetting({
    required String title,
    required String value,
    required List<String> items,
    required void Function(String?) onChanged,
  }) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Text(title, style: TextStyle(fontSize: 16)),
          Spacer(),
          DropdownButton<String>(
            value: value,
            items: items.map((String item) {
              return DropdownMenuItem<String>(
                value: item,
                child: Text(item),
              );
            }).toList(),
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
}