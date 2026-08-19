import 'package:flutter/material.dart';

class PrivacyControlsPage extends StatefulWidget {
  const PrivacyControlsPage({super.key});

  @override
  State<PrivacyControlsPage> createState() => _PrivacyControlsPageState();
}

class _PrivacyControlsPageState extends State<PrivacyControlsPage> {
  bool _profileVisibility = true;
  bool _searchable = true;
  bool _dataSharing = false;
  bool _locationSharing = false;
  bool _contactVisibility = true;
  bool _allowMessages = true;
  String _messagePrivacy = 'Everyone';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Privacy Controls'),
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
              'Profile Privacy',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          
          _buildSwitchItem(
            icon: Icons.visibility,
            title: 'Profile Visibility',
            subtitle: _profileVisibility ? 'Public' : 'Private',
            value: _profileVisibility,
            onChanged: (value) {
              setState(() {
                _profileVisibility = value;
              });
            },
          ),
          
          _buildSwitchItem(
            icon: Icons.search,
            title: 'Appear in Search',
            subtitle: _searchable ? 'Searchable' : 'Not searchable',
            value: _searchable,
            onChanged: (value) {
              setState(() {
                _searchable = value;
              });
            },
          ),
          
          _buildSwitchItem(
            icon: Icons.location_on,
            title: 'Location Sharing',
            subtitle: _locationSharing ? 'Enabled' : 'Disabled',
            value: _locationSharing,
            onChanged: (value) {
              setState(() {
                _locationSharing = value;
              });
            },
          ),
          
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Data Privacy',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          
          _buildSwitchItem(
            icon: Icons.privacy_tip,
            title: 'Data Sharing',
            subtitle: _dataSharing ? 'Allowed' : 'Restricted',
            value: _dataSharing,
            onChanged: (value) {
              setState(() {
                _dataSharing = value;
              });
            },
          ),
          
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Communication Privacy',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          
          _buildSwitchItem(
            icon: Icons.person,
            title: 'Contact Visibility',
            subtitle: _contactVisibility ? 'Visible to all' : 'Visible to connections only',
            value: _contactVisibility,
            onChanged: (value) {
              setState(() {
                _contactVisibility = value;
              });
            },
          ),
          
          _buildSwitchItem(
            icon: Icons.message,
            title: 'Allow Messages',
            subtitle: _allowMessages ? 'From everyone' : 'From connections only',
            value: _allowMessages,
            onChanged: (value) {
              setState(() {
                _allowMessages = value;
              });
            },
          ),
          
          Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: ExpansionTile(
              leading: const Icon(Icons.message),
              title: const Text('Message Privacy'),
              subtitle: Text(_messagePrivacy),
              children: [
                RadioListTile<String>(
                  title: const Text('Everyone'),
                  value: 'Everyone',
                  groupValue: _messagePrivacy,
                  onChanged: (value) {
                    setState(() {
                      _messagePrivacy = value!;
                    });
                  },
                ),
                RadioListTile<String>(
                  title: const Text('Connections Only'),
                  value: 'Connections Only',
                  groupValue: _messagePrivacy,
                  onChanged: (value) {
                    setState(() {
                      _messagePrivacy = value!;
                    });
                  },
                ),
                RadioListTile<String>(
                  title: const Text('No One'),
                  value: 'No One',
                  groupValue: _messagePrivacy,
                  onChanged: (value) {
                    setState(() {
                      _messagePrivacy = value!;
                    });
                  },
                ),
              ],
            ),
          ),
          
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Additional Controls',
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
              // Navigate to blocked accounts page
            },
          ),
          
          _buildSettingItem(
            icon: Icons.report,
            title: 'Privacy Report',
            subtitle: 'View your privacy settings summary',
            onTap: () {
              // Navigate to privacy report
            },
          ),
          
          _buildSettingItem(
            icon: Icons.history,
            title: 'Privacy History',
            subtitle: 'View privacy changes history',
            onTap: () {
              // Navigate to privacy history
            },
          ),
          
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildSwitchItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required Function(bool) onChanged,
  }) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: SwitchListTile(
        secondary: Icon(icon, color: Colors.deepPurple),
        title: Text(title),
        subtitle: Text(subtitle),
        value: value,
        onChanged: onChanged,
      ),
    );
  }

  Widget _buildSettingItem({
    required IconData icon,
    required String title,
    required String subtitle,
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
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }
}