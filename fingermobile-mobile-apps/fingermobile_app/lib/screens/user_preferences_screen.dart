import 'package:flutter/material.dart';
import '../services/api_service.dart';

class memberPreferencesScreen extends StatefulWidget {
  @override
  _memberPreferencesScreenState createState() => _memberPreferencesScreenState();
}

class _memberPreferencesScreenState extends State<memberPreferencesScreen> {
  // Notification preferences
  bool _pushNotifications = true;
  bool _emailNotifications = true;
  bool _smsNotifications = false;
  bool _mentionNotifications = true;
  bool _followNotifications = true;
  bool _commentNotifications = true;
  
  // Display preferences
  String _theme = 'Light';
  String _language = 'English';
  bool _showSensitiveContent = false;
  bool _autoPlayVideos = true;
  
  // Privacy preferences
  bool _showOnlineStatus = true;
  bool _showLastSeen = true;
  bool _allowMessaging = true;
  bool _allowComments = true;
  bool _showActivityStatus = true;
  bool _allowTagging = true;
  
  // Content preferences
  bool _showPostsFromFollowing = true;
  bool _showTrendingContent = true;
  bool _showSuggestedContent = true;
  bool _showAds = true;

  @override
  void initState() {
    super.initState();
    _loadPreferences();
  }

  Future<void> _loadPreferences() async {
    try {
      final prefs = await ApiService.get('/member/preferences');
      if (prefs != null) {
        setState(() {
          // Notification preferences
          _pushNotifications = prefs['notification_push'] ?? true;
          _emailNotifications = prefs['notification_email'] ?? true;
          _smsNotifications = prefs['notification_sms'] ?? false;
          _mentionNotifications = prefs['notification_mention'] ?? true;
          _followNotifications = prefs['notification_follow'] ?? true;
          _commentNotifications = prefs['notification_comment'] ?? true;
          
          // Display preferences
          _theme = prefs['theme'] ?? 'Light';
          _language = prefs['language'] ?? 'English';
          _showSensitiveContent = prefs['show_sensitive_content'] ?? false;
          _autoPlayVideos = prefs['auto_play_videos'] ?? true;
          
          // Privacy preferences
          _showOnlineStatus = prefs['show_online_status'] ?? true;
          _showLastSeen = prefs['show_last_seen'] ?? true;
          _allowMessaging = prefs['allow_messaging'] ?? true;
          _allowComments = prefs['allow_comments'] ?? true;
          _showActivityStatus = prefs['show_activity_status'] ?? true;
          _allowTagging = prefs['allow_tagging'] ?? true;
          
          // Content preferences
          _showPostsFromFollowing = prefs['show_posts_from_following'] ?? true;
          _showTrendingContent = prefs['show_trending_content'] ?? true;
          _showSuggestedContent = prefs['show_suggested_content'] ?? true;
          _showAds = prefs['show_ads'] ?? true;
        });
      }
    } catch (e) {
      print('Error loading preferences: $e');
    }
  }

  Future<void> _savePreference(String key, dynamic value) async {
    try {
      await ApiService.put('/member/preferences', {key: value});
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Preference updated'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      print('Error saving preference: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error saving preference'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Preferences'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          // Notification Preferences
          _buildSectionHeader('Notification Preferences'),
          SwitchListTile(
            title: Text('Push Notifications'),
            value: _pushNotifications,
            onChanged: (value) {
              setState(() {
                _pushNotifications = value;
              });
              _savePreference('notification_push', value);
            },
          ),
          SwitchListTile(
            title: Text('Email Notifications'),
            value: _emailNotifications,
            onChanged: (value) {
              setState(() {
                _emailNotifications = value;
              });
              _savePreference('notification_email', value);
            },
          ),
          SwitchListTile(
            title: Text('SMS Notifications'),
            value: _smsNotifications,
            onChanged: (value) {
              setState(() {
                _smsNotifications = value;
              });
              _savePreference('notification_sms', value);
            },
          ),
          SwitchListTile(
            title: Text('Mention Notifications'),
            value: _mentionNotifications,
            onChanged: (value) {
              setState(() {
                _mentionNotifications = value;
              });
              _savePreference('notification_mention', value);
            },
          ),
          SwitchListTile(
            title: Text('Follow Notifications'),
            value: _followNotifications,
            onChanged: (value) {
              setState(() {
                _followNotifications = value;
              });
              _savePreference('notification_follow', value);
            },
          ),
          SwitchListTile(
            title: Text('Comment Notifications'),
            value: _commentNotifications,
            onChanged: (value) {
              setState(() {
                _commentNotifications = value;
              });
              _savePreference('notification_comment', value);
            },
          ),
          
          // Display Preferences
          _buildSectionHeader('Display Preferences'),
          _buildDropdownSetting(
            title: 'Theme',
            value: _theme,
            items: ['Light', 'Dark', 'System'],
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  _theme = newValue;
                });
                _savePreference('theme', newValue);
              }
            },
          ),
          _buildDropdownSetting(
            title: 'Language',
            value: _language,
            items: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'],
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  _language = newValue;
                });
                _savePreference('language', newValue);
              }
            },
          ),
          SwitchListTile(
            title: Text('Show Sensitive Content'),
            value: _showSensitiveContent,
            onChanged: (value) {
              setState(() {
                _showSensitiveContent = value;
              });
              _savePreference('show_sensitive_content', value);
            },
          ),
          SwitchListTile(
            title: Text('Auto Play Videos'),
            value: _autoPlayVideos,
            onChanged: (value) {
              setState(() {
                _autoPlayVideos = value;
              });
              _savePreference('auto_play_videos', value);
            },
          ),
          
          // Privacy Preferences
          _buildSectionHeader('Privacy Preferences'),
          SwitchListTile(
            title: Text('Show Online Status'),
            value: _showOnlineStatus,
            onChanged: (value) {
              setState(() {
                _showOnlineStatus = value;
              });
              _savePreference('show_online_status', value);
            },
          ),
          SwitchListTile(
            title: Text('Show Last Seen'),
            value: _showLastSeen,
            onChanged: (value) {
              setState(() {
                _showLastSeen = value;
              });
              _savePreference('show_last_seen', value);
            },
          ),
          SwitchListTile(
            title: Text('Allow Messaging'),
            value: _allowMessaging,
            onChanged: (value) {
              setState(() {
                _allowMessaging = value;
              });
              _savePreference('allow_messaging', value);
            },
          ),
          SwitchListTile(
            title: Text('Allow Comments'),
            value: _allowComments,
            onChanged: (value) {
              setState(() {
                _allowComments = value;
              });
              _savePreference('allow_comments', value);
            },
          ),
          SwitchListTile(
            title: Text('Show Activity Status'),
            value: _showActivityStatus,
            onChanged: (value) {
              setState(() {
                _showActivityStatus = value;
              });
              _savePreference('show_activity_status', value);
            },
          ),
          SwitchListTile(
            title: Text('Allow Tagging'),
            value: _allowTagging,
            onChanged: (value) {
              setState(() {
                _allowTagging = value;
              });
              _savePreference('allow_tagging', value);
            },
          ),
          
          // Content Preferences
          _buildSectionHeader('Content Preferences'),
          SwitchListTile(
            title: Text('Show Posts from Following'),
            value: _showPostsFromFollowing,
            onChanged: (value) {
              setState(() {
                _showPostsFromFollowing = value;
              });
              _savePreference('show_posts_from_following', value);
            },
          ),
          SwitchListTile(
            title: Text('Show Trending Content'),
            value: _showTrendingContent,
            onChanged: (value) {
              setState(() {
                _showTrendingContent = value;
              });
              _savePreference('show_trending_content', value);
            },
          ),
          SwitchListTile(
            title: Text('Show Suggested Content'),
            value: _showSuggestedContent,
            onChanged: (value) {
              setState(() {
                _showSuggestedContent = value;
              });
              _savePreference('show_suggested_content', value);
            },
          ),
          SwitchListTile(
            title: Text('Show Ads'),
            value: _showAds,
            onChanged: (value) {
              setState(() {
                _showAds = value;
              });
              _savePreference('show_ads', value);
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