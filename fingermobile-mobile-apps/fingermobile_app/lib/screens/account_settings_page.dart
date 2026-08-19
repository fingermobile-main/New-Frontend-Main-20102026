import 'package:flutter/material.dart';

class AccountSettingsPage extends StatefulWidget {
  const AccountSettingsPage({super.key});

  @override
  State<AccountSettingsPage> createState() => _AccountSettingsPageState();
}

class _AccountSettingsPageState extends State<AccountSettingsPage> {
  bool _notificationsEnabled = true;
  bool _emailNotifications = true;
  bool _smsNotifications = false;
  bool _dataSaverMode = false;
  String _language = 'English';
  String _theme = 'System Default';
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Account Settings'),
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
              'Account Information',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          
          _buildSettingItem(
            icon: Icons.person,
            title: 'Edit Profile',
            subtitle: 'Update your profile information',
            onTap: () {
              // Navigate to profile editing
            },
          ),
          
          _buildSettingItem(
            icon: Icons.lock,
            title: 'Change Password',
            subtitle: 'Update your account password',
            onTap: () {
              _changePassword();
            },
          ),
          
          _buildSettingItem(
            icon: Icons.email,
            title: 'Email Address',
            subtitle: 'member@example.com',
            onTap: () {
              _changeEmail();
            },
          ),
          
          _buildSettingItem(
            icon: Icons.phone,
            title: 'Phone Number',
            subtitle: '+1 (555) 123-4567',
            onTap: () {
              _changePhone();
            },
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
            icon: Icons.visibility,
            title: 'Profile Visibility',
            subtitle: 'Public',
            onTap: () {
              _changeProfileVisibility();
            },
          ),
          
          _buildSettingItem(
            icon: Icons.people,
            title: 'Who can contact me',
            subtitle: 'Everyone',
            onTap: () {
              _changeContactPrivacy();
            },
          ),
          
          _buildSettingItem(
            icon: Icons.search,
            title: 'Search Visibility',
            subtitle: 'Appear in search results',
            trailing: Switch(
              value: true,
              onChanged: (value) {},
            ),
          ),
          
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Notifications',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          
          SwitchListTile(
            title: const Text('Enable Notifications'),
            value: _notificationsEnabled,
            onChanged: (value) {
              setState(() {
                _notificationsEnabled = value;
              });
            },
          ),
          
          SwitchListTile(
            title: const Text('Email Notifications'),
            value: _emailNotifications,
            onChanged: (value) {
              setState(() {
                _emailNotifications = value;
              });
            },
          ),
          
          SwitchListTile(
            title: const Text('SMS Notifications'),
            value: _smsNotifications,
            onChanged: (value) {
              setState(() {
                _smsNotifications = value;
              });
            },
          ),
          
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Preferences',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          
          _buildSettingItem(
            icon: Icons.language,
            title: 'Language',
            subtitle: _language,
            onTap: () {
              _changeLanguage();
            },
          ),
          
          _buildSettingItem(
            icon: Icons.dark_mode,
            title: 'Theme',
            subtitle: _theme,
            onTap: () {
              _changeTheme();
            },
          ),
          
          SwitchListTile(
            title: const Text('Data Saver Mode'),
            value: _dataSaverMode,
            onChanged: (value) {
              setState(() {
                _dataSaverMode = value;
              });
            },
          ),
          
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Account Management',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          
          _buildSettingItem(
            icon: Icons.backup,
            title: 'Backup Data',
            subtitle: 'Backup your data to cloud',
            onTap: () {
              _backupData();
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
          
          _buildSettingItem(
            icon: Icons.delete,
            title: 'Delete Account',
            subtitle: 'Permanently delete your account',
            onTap: () {
              _deleteAccount();
            },
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
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Current Password',
                ),
                onChanged: (value) {
                  currentPassword = value;
                },
              ),
              const SizedBox(height: 10),
              TextField(
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'New Password',
                ),
                onChanged: (value) {
                  newPassword = value;
                },
              ),
              const SizedBox(height: 10),
              TextField(
                obscureText: true,
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

  void _changeEmail() {
    showDialog(
      context: context,
      builder: (context) {
        String email = '';

        return AlertDialog(
          title: const Text('Change Email'),
          content: TextField(
            decoration: const InputDecoration(
              labelText: 'New Email Address',
            ),
            onChanged: (value) {
              email = value;
            },
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
                // Here you would implement email change logic
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Email changed successfully'),
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

  void _changePhone() {
    showDialog(
      context: context,
      builder: (context) {
        String phone = '';

        return AlertDialog(
          title: const Text('Change Phone Number'),
          content: TextField(
            decoration: const InputDecoration(
              labelText: 'New Phone Number',
            ),
            onChanged: (value) {
              phone = value;
            },
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
                // Here you would implement phone change logic
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Phone number changed successfully'),
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

  void _changeContactPrivacy() {
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
                title: Text('Everyone'),
                subtitle: Text('Anyone can contact you'),
              ),
              const ListTile(
                leading: Icon(Icons.group),
                title: Text('Friends'),
                subtitle: Text('Only your connections can contact you'),
              ),
              const ListTile(
                leading: Icon(Icons.people),
                title: Text('Friends of Friends'),
                subtitle: Text('Friends and their connections can contact you'),
              ),
            ],
          ),
        );
      },
    );
  }

  void _changeLanguage() {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const ListTile(
                title: Text('English'),
              ),
              const ListTile(
                title: Text('Spanish'),
              ),
              const ListTile(
                title: Text('French'),
              ),
              const ListTile(
                title: Text('German'),
              ),
            ],
          ),
        );
      },
    );
  }

  void _changeTheme() {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              RadioListTile(
                title: const Text('System Default'),
                value: 'System Default',
                groupValue: _theme,
                onChanged: (value) {
                  setState(() {
                    _theme = value!;
                  });
                  Navigator.of(context).pop();
                },
              ),
              RadioListTile(
                title: const Text('Light Theme'),
                value: 'Light',
                groupValue: _theme,
                onChanged: (value) {
                  setState(() {
                    _theme = value!;
                  });
                  Navigator.of(context).pop();
                },
              ),
              RadioListTile(
                title: const Text('Dark Theme'),
                value: 'Dark',
                groupValue: _theme,
                onChanged: (value) {
                  setState(() {
                    _theme = value!;
                  });
                  Navigator.of(context).pop();
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _backupData() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Backup Data'),
          content: const Text('Do you want to backup your data to cloud?'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                // Here you would implement backup logic
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Data backup started'),
                  ),
                );
              },
              child: const Text('Backup'),
            ),
          ],
        );
      },
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

  void _deleteAccount() {
    showDialog(
      context: context,
      builder: (context) {
        String confirmation = '';

        return AlertDialog(
          title: const Text('Delete Account'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Are you sure you want to permanently delete your account? This action cannot be undone.',
                style: TextStyle(color: Colors.red),
              ),
              const SizedBox(height: 16),
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Type DELETE to confirm',
                ),
                onChanged: (value) {
                  confirmation = value;
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
              onPressed: confirmation == 'DELETE' 
                ? () {
                    Navigator.of(context).pop();
                    // Implement deletion logic here
                  } 
                : null,
              child: const Text('Delete'),
            ),
          ],
        );
      },
    );
  }
}