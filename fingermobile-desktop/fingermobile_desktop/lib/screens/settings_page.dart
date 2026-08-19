import 'package:flutter/material.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({Key? key}) : super(key: key);

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _notificationsEnabled = true;
  bool _darkModeEnabled = false;
  String _language = 'English';
  String _theme = 'System';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Navigation sidebar
            SizedBox(
              width: 250,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Column(
                    children: [
                      _buildNavigationItem(Icons.person, 'Account', true),
                      _buildNavigationItem(Icons.lock, 'Privacy', false),
                      _buildNavigationItem(Icons.security, 'Security', false),
                      _buildNavigationItem(Icons.notifications, 'Notifications', false),
                      _buildNavigationItem(Icons.language, 'Language', false),
                      _buildNavigationItem(Icons.invert_colors, 'Appearance', false),
                      _buildNavigationItem(Icons.help, 'Help & Support', false),
                      _buildNavigationItem(Icons.info, 'About', false),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            
            // Main settings content
            Expanded(
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'General Settings',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 24),
                      
                      // Notifications setting
                      _buildSettingItem(
                        Icons.notifications,
                        'Notifications',
                        Switch(
                          value: _notificationsEnabled,
                          onChanged: (value) {
                            setState(() {
                              _notificationsEnabled = value;
                            });
                          },
                        ),
                      ),
                      
                      const Divider(height: 32),
                      
                      // Dark mode setting
                      _buildSettingItem(
                        Icons.invert_colors,
                        'Dark Mode',
                        Switch(
                          value: _darkModeEnabled,
                          onChanged: (value) {
                            setState(() {
                              _darkModeEnabled = value;
                            });
                          },
                        ),
                      ),
                      
                      const Divider(height: 32),
                      
                      // Language setting
                      _buildSettingItem(
                        Icons.language,
                        'Language',
                        DropdownButton<String>(
                          value: _language,
                          icon: const Icon(Icons.arrow_drop_down),
                          elevation: 16,
                          style: const TextStyle(color: Colors.black87),
                          underline: Container(
                            height: 2,
                            color: Theme.of(context).primaryColor,
                          ),
                          onChanged: (String? newValue) {
                            setState(() {
                              _language = newValue!;
                            });
                          },
                          items: <String>['English', 'Spanish', 'French', 'German', 'Chinese']
                              .map<DropdownMenuItem<String>>((String value) {
                            return DropdownMenuItem<String>(
                              value: value,
                              child: Text(value),
                            );
                          }).toList(),
                        ),
                      ),
                      
                      const Divider(height: 32),
                      
                      // Theme setting
                      _buildSettingItem(
                        Icons.color_lens,
                        'Theme',
                        DropdownButton<String>(
                          value: _theme,
                          icon: const Icon(Icons.arrow_drop_down),
                          elevation: 16,
                          style: const TextStyle(color: Colors.black87),
                          underline: Container(
                            height: 2,
                            color: Theme.of(context).primaryColor,
                          ),
                          onChanged: (String? newValue) {
                            setState(() {
                              _theme = newValue!;
                            });
                          },
                          items: <String>['System', 'Light', 'Dark']
                              .map<DropdownMenuItem<String>>((String value) {
                            return DropdownMenuItem<String>(
                              value: value,
                              child: Text(value),
                            );
                          }).toList(),
                        ),
                      ),
                      
                      const Divider(height: 32),
                      
                      // Sign out button
                      Align(
                        alignment: Alignment.centerRight,
                        child: ElevatedButton(
                          onPressed: () {
                            // Handle sign out
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.red,
                          ),
                          child: const Text(
                            'Sign Out',
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavigationItem(IconData icon, String title, bool isSelected) {
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      selected: isSelected,
      selectedColor: Theme.of(context).primaryColor,
      onTap: () {
        // Handle navigation
      },
    );
  }

  Widget _buildSettingItem(IconData icon, String title, Widget trailing) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(icon, color: Theme.of(context).primaryColor),
          const SizedBox(width: 16),
          Text(
            title,
            style: const TextStyle(fontSize: 16),
          ),
          const Spacer(),
          Container(
            width: 200,
            child: Align(
              alignment: Alignment.centerRight,
              child: trailing,
            ),
          ),
        ],
      ),
    );
  }
}