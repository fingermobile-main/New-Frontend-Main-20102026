import 'package:flutter/material.dart';

class SystemSettingsPage extends StatefulWidget {
  @override
  _SystemSettingsPageState createState() => _SystemSettingsPageState();
}

class _SystemSettingsPageState extends State<SystemSettingsPage> {
  bool _maintenanceMode = false;
  bool _analyticsEnabled = true;
  bool _debugMode = false;
  bool _notificationsEnabled = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('System Settings'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'System Settings',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Configure system-wide settings',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 24),
            _buildSettingsCard([
              _buildSettingsItem(
                title: 'Maintenance Mode',
                subtitle: 'Enable/disable maintenance mode',
                trailing: Switch(
                  value: _maintenanceMode,
                  onChanged: (value) {
                    setState(() {
                      _maintenanceMode = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _maintenanceMode = !_maintenanceMode;
                  });
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'Analytics',
                subtitle: 'Enable system analytics',
                trailing: Switch(
                  value: _analyticsEnabled,
                  onChanged: (value) {
                    setState(() {
                      _analyticsEnabled = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _analyticsEnabled = !_analyticsEnabled;
                  });
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'Debug Mode',
                subtitle: 'Enable debug features',
                trailing: Switch(
                  value: _debugMode,
                  onChanged: (value) {
                    setState(() {
                      _debugMode = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _debugMode = !_debugMode;
                  });
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'System Notifications',
                subtitle: 'Enable system notifications',
                trailing: Switch(
                  value: _notificationsEnabled,
                  onChanged: (value) {
                    setState(() {
                      _notificationsEnabled = value;
                    });
                  },
                ),
                onTap: () {
                  setState(() {
                    _notificationsEnabled = !_notificationsEnabled;
                  });
                },
              ),
            ]),
            SizedBox(height: 24),
            Text(
              'System Configuration',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            _buildSettingsCard([
              _buildSettingsItem(
                title: 'Cache Management',
                subtitle: 'Clear system cache',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {
                  // Clear cache functionality
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'Database Settings',
                subtitle: 'Configure database connections',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {
                  // Database settings
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'API Configuration',
                subtitle: 'Manage API endpoints',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {
                  // API configuration
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'Security Settings',
                subtitle: 'Configure security parameters',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {
                  // Security settings
                },
              ),
            ]),
            SizedBox(height: 24),
            Text(
              'Advanced Options',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            _buildSettingsCard([
              _buildSettingsItem(
                title: 'Feature Flags',
                subtitle: 'Enable/disable features',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {
                  // Feature flags
                },
              ),
              Divider(height: 1),
              _buildSettingsItem(
                title: 'System Logs',
                subtitle: 'View system logs',
                trailing: Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () {
                  // View logs
                },
              ),
            ]),
            SizedBox(height: 30),
            Container(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // Save system settings
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('System settings saved'),
                      backgroundColor: Colors.green,
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepPurple,
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