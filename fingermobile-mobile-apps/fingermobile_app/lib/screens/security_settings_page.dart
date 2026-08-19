import 'package:flutter/material.dart';

class SecuritySettingsPage extends StatefulWidget {
  const SecuritySettingsPage({super.key});

  @override
  State<SecuritySettingsPage> createState() => _SecuritySettingsPageState();
}

class _SecuritySettingsPageState extends State<SecuritySettingsPage> {
  bool _twoFactorEnabled = false;
  bool _biometricAuthEnabled = true;
  bool _loginAlertsEnabled = true;
  bool _showPassword = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Security Settings'),
        centerTitle: false,
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView(
        children: [
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Account Security',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          _buildSettingItem(
            icon: Icons.lock,
            title: 'Password',
            subtitle: 'Change your account password',
            onTap: () {
              _changePassword();
            },
          ),
          _buildSettingItem(
            icon: Icons.phonelink_lock,
            title: 'Two-Factor Authentication',
            subtitle: _twoFactorEnabled ? 'Enabled' : 'Disabled',
            trailing: Switch(
              value: _twoFactorEnabled,
              onChanged: (value) {
                setState(() {
                  _twoFactorEnabled = value;
                });
              },
            ),
          ),
          _buildSettingItem(
            icon: Icons.fingerprint,
            title: 'Biometric Authentication',
            subtitle: _biometricAuthEnabled ? 'Enabled' : 'Disabled',
            trailing: Switch(
              value: _biometricAuthEnabled,
              onChanged: (value) {
                setState(() {
                  _biometricAuthEnabled = value;
                });
              },
            ),
          ),
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Privacy & Safety',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          _buildSettingItem(
            icon: Icons.notifications_active,
            title: 'Login Alerts',
            subtitle: _loginAlertsEnabled ? 'Enabled' : 'Disabled',
            trailing: Switch(
              value: _loginAlertsEnabled,
              onChanged: (value) {
                setState(() {
                  _loginAlertsEnabled = value;
                });
              },
            ),
          ),
          _buildSettingItem(
            icon: Icons.visibility,
            title: 'Profile Visibility',
            subtitle: 'Public',
            onTap: () {
              _changeProfileVisibility();
            },
          ),
          _buildSettingItem(
            icon: Icons.devices,
            title: 'Connected Devices',
            subtitle: 'Manage active sessions',
            onTap: () {
              _manageDevices();
            },
          ),
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Advanced Security',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          _buildSettingItem(
            icon: Icons.block,
            title: 'Blocked Accounts',
            subtitle: 'Manage blocked members',
            onTap: () {
              _manageBlockedAccounts();
            },
          ),
          _buildSettingItem(
            icon: Icons.history,
            title: 'Login History',
            subtitle: 'View recent login activity',
            onTap: () {
              _viewLoginHistory();
            },
          ),
          _buildSettingItem(
            icon: Icons.delete_forever,
            title: 'Deactivate Account',
            subtitle: 'Temporarily disable your account',
            onTap: () {
              _deactivateAccount();
            },
          ),
          const SizedBox(height: 16),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: ElevatedButton(
              onPressed: () {
                _logoutAllDevices();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('Logout from All Devices'),
            ),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildSettingItem({
    required IconData icon,
    required String title,
    required String subtitle,
    Widget? trailing,
    VoidCallback? onTap,
  }) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: ListTile(
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: Colors.grey[200],
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(
            icon,
            color: Colors.deepPurple,
          ),
        ),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: trailing,
        onTap: onTap,
      ),
    );
  }

  void _changePassword() {
    showDialog(
      context: context,
      builder: (context) {
        String currentPassword = '';
        String newPassword = '';
        String confirmPassword = '';

        return AlertDialog(
          title: const Text('Change Password'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                obscureText: !_showPassword,
                decoration: const InputDecoration(
                  labelText: 'Current Password',
                  suffixIcon: Icon(Icons.visibility),
                ),
                onChanged: (value) {
                  currentPassword = value;
                },
              ),
              const SizedBox(height: 10),
              TextField(
                obscureText: !_showPassword,
                decoration: InputDecoration(
                  labelText: 'New Password',
                  suffixIcon: IconButton(
                    icon: Icon(
                      _showPassword ? Icons.visibility : Icons.visibility_off,
                    ),
                    onPressed: () {
                      setState(() {
                        _showPassword = !_showPassword;
                      });
                    },
                  ),
                ),
                onChanged: (value) {
                  newPassword = value;
                },
              ),
              const SizedBox(height: 10),
              TextField(
                obscureText: !_showPassword,
                decoration: const InputDecoration(
                  labelText: 'Confirm New Password',
                ),
                onChanged: (value) {
                  confirmPassword = value;
                },
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                // Here you would implement password change logic
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Password changed successfully'),
                  ),
                );
              },
              child: const Text('Save'),
            ),
          ],
        );
      },
    );
  }

  void _changeProfileVisibility() {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const ListTile(
                leading: Icon(Icons.public),
                title: Text('Public'),
                subtitle: Text('Anyone can see your profile'),
              ),
              const ListTile(
                leading: Icon(Icons.group),
                title: Text('Friends'),
                subtitle: Text('Only your connections can see your profile'),
              ),
              const ListTile(
                leading: Icon(Icons.lock),
                title: Text('Private'),
                subtitle: Text('Only you can see your profile'),
              ),
            ],
          ),
        );
      },
    );
  }

  void _manageDevices() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const ConnectedDevicesScreen(),
      ),
    );
  }

  void _manageBlockedAccounts() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const BlockedmembersPage(),
      ),
    );
  }

  void _viewLoginHistory() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const LoginHistoryPage(),
      ),
    );
  }

  void _deactivateAccount() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Deactivate Account'),
          content: const Text(
            'Are you sure you want to deactivate your account? You can reactivate it at any time by logging in.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                // Implement deactivation logic here
              },
              child: const Text('Deactivate'),
            ),
          ],
        );
      },
    );
  }

  void _logoutAllDevices() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Logout from All Devices'),
          content: const Text(
            'Are you sure you want to logout from all devices? This will end all active sessions except this one.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                // Implement logout from all devices logic
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Logged out from all other devices'),
                  ),
                );
              },
              child: const Text('Logout'),
            ),
          ],
        );
      },
    );
  }
}

class ConnectedDevicesScreen extends StatelessWidget {
  const ConnectedDevicesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Connected Devices'),
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Active Sessions',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          _buildDeviceItem(
            deviceName: 'iPhone 13 Pro',
            deviceType: 'Mobile',
            location: 'New York, USA',
            lastActive: 'Just now',
            isActive: true,
          ),
          _buildDeviceItem(
            deviceName: 'MacBook Pro',
            deviceType: 'Desktop',
            location: 'New York, USA',
            lastActive: '2 hours ago',
            isActive: true,
          ),
          _buildDeviceItem(
            deviceName: 'Samsung Galaxy S21',
            deviceType: 'Mobile',
            location: 'London, UK',
            lastActive: '1 day ago',
            isActive: false,
          ),
        ],
      ),
    );
  }

  Widget _buildDeviceItem({
    required String deviceName,
    required String deviceType,
    required String location,
    required String lastActive,
    required bool isActive,
  }) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: ListTile(
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: Colors.grey[200],
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(
            deviceType == 'Mobile' ? Icons.phone_iphone : Icons.laptop,
            color: Colors.deepPurple,
          ),
        ),
        title: Text(deviceName),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('$deviceType • $location'),
            Text(
              'Last active: $lastActive',
              style: TextStyle(
                color: isActive ? Colors.green : Colors.grey,
                fontSize: 12,
              ),
            ),
          ],
        ),
        trailing: isActive
            ? OutlinedButton(
                onPressed: () {
                  // Implement device logout logic
                },
                child: const Text('Logout'),
              )
            : null,
      ),
    );
  }
}

class BlockedmembersPage extends StatelessWidget {
  const BlockedmembersPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Blocked Accounts'),
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
      ),
      body: const Center(
        child: Text('Blocked members page'),
      ),
    );
  }
}

class LoginHistoryPage extends StatelessWidget {
  const LoginHistoryPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login History'),
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
      ),
      body: const Center(
        child: Text('Login history page'),
      ),
    );
  }
}