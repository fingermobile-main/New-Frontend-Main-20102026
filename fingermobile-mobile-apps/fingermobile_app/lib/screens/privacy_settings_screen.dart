import 'package:flutter/material.dart';
import '../services/api_service.dart';

class PrivacySettingsScreen extends StatefulWidget {
  @override
  _PrivacySettingsScreenState createState() => _PrivacySettingsScreenState();
}

class _PrivacySettingsScreenState extends State<PrivacySettingsScreen> {
  // Privacy settings state
  bool _profilePublic = true;
  bool _showOnlineStatus = true;
  bool _showLastSeen = true;
  bool _allowMessaging = true;
  bool _allowComments = true;
  bool _showActivityStatus = true;
  bool _allowTagging = true;
  bool _showEmail = false;
  bool _showPhoneNumber = false;

  @override
  void initState() {
    super.initState();
    _loadPrivacySettings();
  }

  Future<void> _loadPrivacySettings() async {
    try {
      final settings = await ApiService.get('/member/privacy');
      if (settings != null) {
        setState(() {
          _profilePublic = settings['profile_public'] ?? true;
          _showOnlineStatus = settings['show_online_status'] ?? true;
          _showLastSeen = settings['show_last_seen'] ?? true;
          _allowMessaging = settings['allow_messaging'] ?? true;
          _allowComments = settings['allow_comments'] ?? true;
          _showActivityStatus = settings['show_activity_status'] ?? true;
          _allowTagging = settings['allow_tagging'] ?? true;
          _showEmail = settings['show_email'] ?? false;
          _showPhoneNumber = settings['show_phone_number'] ?? false;
        });
      }
    } catch (e) {
      print('Error loading privacy settings: $e');
    }
  }

  Future<void> _savePrivacySetting(String setting, bool value) async {
    try {
      await ApiService.put('/member/privacy', {
        setting: value,
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Privacy setting updated'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      print('Error saving privacy setting: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error saving privacy setting'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Privacy Settings'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          // Profile Privacy section
          _buildSectionHeader('Profile Privacy'),
          SwitchListTile(
            title: Text('Profile Visible to Public'),
            subtitle: Text('Allow anyone to view your profile'),
            value: _profilePublic,
            onChanged: (value) {
              setState(() {
                _profilePublic = value;
              });
              _savePrivacySetting('profile_public', value);
            },
          ),
          SwitchListTile(
            title: Text('Show Online Status'),
            subtitle: Text('Show when you are online'),
            value: _showOnlineStatus,
            onChanged: (value) {
              setState(() {
                _showOnlineStatus = value;
              });
              _savePrivacySetting('show_online_status', value);
            },
          ),
          SwitchListTile(
            title: Text('Show Last Seen'),
            subtitle: Text('Show when you were last active'),
            value: _showLastSeen,
            onChanged: (value) {
              setState(() {
                _showLastSeen = value;
              });
              _savePrivacySetting('show_last_seen', value);
            },
          ),
          SwitchListTile(
            title: Text('Show Activity Status'),
            subtitle: Text('Show your activity status to others'),
            value: _showActivityStatus,
            onChanged: (value) {
              setState(() {
                _showActivityStatus = value;
              });
              _savePrivacySetting('show_activity_status', value);
            },
          ),
          
          // Communication Privacy section
          _buildSectionHeader('Communication Privacy'),
          SwitchListTile(
            title: Text('Allow Messaging'),
            subtitle: Text('Allow others to send you messages'),
            value: _allowMessaging,
            onChanged: (value) {
              setState(() {
                _allowMessaging = value;
              });
              _savePrivacySetting('allow_messaging', value);
            },
          ),
          SwitchListTile(
            title: Text('Allow Comments'),
            subtitle: Text('Allow others to comment on your posts'),
            value: _allowComments,
            onChanged: (value) {
              setState(() {
                _allowComments = value;
              });
              _savePrivacySetting('allow_comments', value);
            },
          ),
          
          // Tagging Privacy section
          _buildSectionHeader('Tagging Privacy'),
          SwitchListTile(
            title: Text('Allow Tagging'),
            subtitle: Text('Allow others to tag you in posts'),
            value: _allowTagging,
            onChanged: (value) {
              setState(() {
                _allowTagging = value;
              });
              _savePrivacySetting('allow_tagging', value);
            },
          ),
          
          // Information Visibility section
          _buildSectionHeader('Information Visibility'),
          SwitchListTile(
            title: Text('Show Email Address'),
            subtitle: Text('Allow others to see your email address'),
            value: _showEmail,
            onChanged: (value) {
              setState(() {
                _showEmail = value;
              });
              _savePrivacySetting('show_email', value);
            },
          ),
          SwitchListTile(
            title: Text('Show Phone Number'),
            subtitle: Text('Allow others to see your phone number'),
            value: _showPhoneNumber,
            onChanged: (value) {
              setState(() {
                _showPhoneNumber = value;
              });
              _savePrivacySetting('show_phone_number', value);
            },
          ),
          
          // Additional Privacy Options
          _buildSectionHeader('Additional Privacy Options'),
          _buildSettingItem(
            icon: Icons.block,
            title: 'Blocked members',
            subtitle: 'Manage your blocked members',
            onTap: () {
              // Navigate to blocked members
            },
          ),
          _buildSettingItem(
            icon: Icons.visibility_off,
            title: 'Activity Log',
            subtitle: 'Review your recent activity',
            onTap: () {
              // Navigate to activity log
            },
          ),
          _buildSettingItem(
            icon: Icons.security,
            title: 'Two-Factor Authentication',
            subtitle: 'Add an extra layer of security',
            onTap: () {
              // Navigate to 2FA settings
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
}