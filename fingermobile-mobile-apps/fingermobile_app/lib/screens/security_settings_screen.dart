import 'package:flutter/material.dart';
import '../services/api_service.dart';

class SecuritySettingsScreen extends StatefulWidget {
  @override
  _SecuritySettingsScreenState createState() => _SecuritySettingsScreenState();
}

class _SecuritySettingsScreenState extends State<SecuritySettingsScreen> {
  // Security settings state
  bool _twoFactorAuth = false;
  bool _loginAlerts = true;
  bool _appLock = false;
  String _lastPasswordChange = '2023-01-15';
  List<LoginActivity> _recentActivity = [];

  @override
  void initState() {
    super.initState();
    _loadSecuritySettings();
    _loadRecentActivity();
  }

  Future<void> _loadSecuritySettings() async {
    try {
      final settings = await ApiService.get('/member/security');
      if (settings != null) {
        setState(() {
          _twoFactorAuth = settings['two_factor_auth'] ?? false;
          _loginAlerts = settings['login_alerts'] ?? true;
          _appLock = settings['app_lock'] ?? false;
          _lastPasswordChange = settings['last_password_change'] ?? 'Never';
        });
      }
    } catch (e) {
      print('Error loading security settings: $e');
    }
  }

  Future<void> _loadRecentActivity() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      setState(() {
        _recentActivity = [
          LoginActivity(
            id: 1,
            device: 'iPhone 14 Pro',
            location: 'New York, USA',
            time: DateTime.now().subtract(Duration(minutes: 30)),
            ip: '192.168.1.100',
            isCurrent: true,
          ),
          LoginActivity(
            id: 2,
            device: 'MacBook Pro',
            location: 'San Francisco, USA',
            time: DateTime.now().subtract(Duration(hours: 2)),
            ip: '104.28.29.101',
            isCurrent: false,
          ),
          LoginActivity(
            id: 3,
            device: 'Android Device',
            location: 'London, UK',
            time: DateTime.now().subtract(Duration(days: 1)),
            ip: '172.67.34.156',
            isCurrent: false,
          ),
          LoginActivity(
            id: 4,
            device: 'Windows PC',
            location: 'Tokyo, Japan',
            time: DateTime.now().subtract(Duration(days: 7)),
            ip: '203.45.67.89',
            isCurrent: false,
          ),
        ];
      });
    } catch (e) {
      print('Error loading recent activity: $e');
    }
  }

  Future<void> _saveSecuritySetting(String setting, bool value) async {
    try {
      await ApiService.put('/member/security', {
        setting: value,
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Security setting updated'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      print('Error saving security setting: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error saving security setting'),
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
                    content: Text('Password would be changed'),
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Security Settings'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          // Account Security section
          _buildSectionHeader('Account Security'),
          SwitchListTile(
            title: Text('Two-Factor Authentication'),
            subtitle: Text('Add an extra layer of security to your account'),
            value: _twoFactorAuth,
            onChanged: (value) {
              setState(() {
                _twoFactorAuth = value;
              });
              _saveSecuritySetting('two_factor_auth', value);
            },
          ),
          SwitchListTile(
            title: Text('Login Alerts'),
            subtitle: Text('Get notified when your account is accessed'),
            value: _loginAlerts,
            onChanged: (value) {
              setState(() {
                _loginAlerts = value;
              });
              _saveSecuritySetting('login_alerts', value);
            },
          ),
          SwitchListTile(
            title: Text('App Lock'),
            subtitle: Text('Require authentication to open the app'),
            value: _appLock,
            onChanged: (value) {
              setState(() {
                _appLock = value;
              });
              _saveSecuritySetting('app_lock', value);
            },
          ),
          _buildSettingItem(
            icon: Icons.lock,
            title: 'Change Password',
            subtitle: 'Last changed: $_lastPasswordChange',
            onTap: _changePassword,
          ),
          
          // Recent Activity section
          _buildSectionHeader('Recent Activity'),
          ..._recentActivity.map((activity) => _buildActivityItem(activity)),
          
          // Security Options section
          _buildSectionHeader('Security Options'),
          _buildSettingItem(
            icon: Icons.history,
            title: 'Login History',
            subtitle: 'View your complete login history',
            onTap: () {
              // Navigate to full login history
            },
          ),
          _buildSettingItem(
            icon: Icons.devices,
            title: 'Active Sessions',
            subtitle: 'View and manage active sessions',
            onTap: () {
              // Navigate to active sessions
            },
          ),
          _buildSettingItem(
            icon: Icons.vpn_key,
            title: 'App Passwords',
            subtitle: 'Manage app-specific passwords',
            onTap: () {
              // Navigate to app passwords
            },
          ),
          _buildSettingItem(
            icon: Icons.privacy_tip,
            title: 'Privacy Settings',
            subtitle: 'Review your privacy settings',
            onTap: () {
              // Navigate to privacy settings
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

  Widget _buildActivityItem(LoginActivity activity) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  activity.isCurrent ? Icons.check_circle : Icons.access_time,
                  color: activity.isCurrent ? Colors.green : Colors.grey,
                ),
                SizedBox(width: 8),
                Text(
                  activity.device,
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                if (activity.isCurrent)
                  Container(
                    margin: EdgeInsets.only(left: 8),
                    padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.green,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      'Current',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                      ),
                    ),
                  ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              activity.location,
              style: TextStyle(
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 4),
            Text(
              'IP: ${activity.ip}',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[500],
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Time: ${_formatDateTime(activity.time)}',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[500],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDateTime(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} at ${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
  }
}

class LoginActivity {
  final int id;
  final String device;
  final String location;
  final DateTime time;
  final String ip;
  final bool isCurrent;

  LoginActivity({
    required this.id,
    required this.device,
    required this.location,
    required this.time,
    required this.ip,
    required this.isCurrent,
  });
}