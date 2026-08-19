import 'package:flutter/material.dart';
import '../services/api_service.dart';

class LanguageSettingsScreen extends StatefulWidget {
  @override
  _LanguageSettingsScreenState createState() => _LanguageSettingsScreenState();
}

class _LanguageSettingsScreenState extends State<LanguageSettingsScreen> {
  String _appLanguage = 'English';
  bool _translateContent = false;
  bool _autoDetectLanguage = true;
  String _contentLanguage = 'English';
  String _keyboardLanguage = 'English';
  bool _showLanguageFlags = true;
  List<String> _secondaryLanguages = [];

  @override
  void initState() {
    super.initState();
    _loadLanguageSettings();
  }

  Future<void> _loadLanguageSettings() async {
    try {
      final settings = await ApiService.get('/member/language_settings');
      if (settings != null) {
        setState(() {
          _appLanguage = settings['app_language'] ?? 'English';
          _translateContent = settings['translate_content'] ?? false;
          _autoDetectLanguage = settings['auto_detect_language'] ?? true;
          _contentLanguage = settings['content_language'] ?? 'English';
          _keyboardLanguage = settings['keyboard_language'] ?? 'English';
          _showLanguageFlags = settings['show_language_flags'] ?? true;
          _secondaryLanguages = List<String>.from(settings['secondary_languages'] ?? []);
        });
      }
    } catch (e) {
      print('Error loading language settings: $e');
    }
  }

  Future<void> _saveLanguageSetting(String key, dynamic value) async {
    try {
      await ApiService.put('/member/language_settings', {key: value});
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Language setting updated'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      print('Error saving language setting: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error saving language setting'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _addSecondaryLanguage() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        String selectedLanguage = 'Spanish';
        
        return AlertDialog(
          title: Text('Add Secondary Language'),
          content: DropdownButton<String>(
            value: selectedLanguage,
            onChanged: (String? newValue) {
              if (newValue != null) {
                selectedLanguage = newValue;
              }
            },
            items: [
              'Spanish',
              'French',
              'German',
              'Chinese',
              'Japanese',
              'Arabic',
              'Russian',
              'Portuguese',
            ].map<DropdownMenuItem<String>>((String value) {
              return DropdownMenuItem<String>(
                value: value,
                child: Text(value),
              );
            }).toList(),
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
                if (!_secondaryLanguages.contains(selectedLanguage)) {
                  setState(() {
                    _secondaryLanguages.add(selectedLanguage);
                  });
                  _saveLanguageSetting('secondary_languages', _secondaryLanguages);
                }
                Navigator.of(context).pop();
              },
              child: Text('Add'),
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
        title: Text('Language Settings'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          // App Language Settings
          _buildSectionHeader('App Language'),
          _buildDropdownSetting(
            title: 'Display Language',
            value: _appLanguage,
            items: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Russian', 'Portuguese'],
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  _appLanguage = newValue;
                });
                _saveLanguageSetting('app_language', newValue);
              }
            },
          ),
          
          // Content Language Settings
          _buildSectionHeader('Content Language'),
          SwitchListTile(
            title: Text('Auto-detect Language'),
            subtitle: Text('Detect language of content automatically'),
            value: _autoDetectLanguage,
            onChanged: (value) {
              setState(() {
                _autoDetectLanguage = value;
              });
              _saveLanguageSetting('auto_detect_language', value);
            },
          ),
          _buildDropdownSetting(
            title: 'Content Language',
            value: _contentLanguage,
            items: ['Any Language', 'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Russian', 'Portuguese'],
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  _contentLanguage = newValue;
                });
                _saveLanguageSetting('content_language', newValue);
              }
            },
          ),
          SwitchListTile(
            title: Text('Translate Content'),
            subtitle: Text('Show translations for content in other languages'),
            value: _translateContent,
            onChanged: (value) {
              setState(() {
                _translateContent = value;
              });
              _saveLanguageSetting('translate_content', value);
            },
          ),
          
          // Keyboard Language Settings
          _buildSectionHeader('Keyboard Language'),
          _buildDropdownSetting(
            title: 'Keyboard Language',
            value: _keyboardLanguage,
            items: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Russian', 'Portuguese'],
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  _keyboardLanguage = newValue;
                });
                _saveLanguageSetting('keyboard_language', newValue);
              }
            },
          ),
          
          // Secondary Languages
          _buildSectionHeader('Secondary Languages'),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Column(
              children: [
                if (_secondaryLanguages.isEmpty)
                  Text(
                    'No secondary languages added',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontStyle: FontStyle.italic,
                    ),
                  )
                else
                  Wrap(
                    spacing: 8,
                    runSpacing: 4,
                    children: _secondaryLanguages.map((lang) => 
                      Chip(
                        label: Text(lang),
                        deleteIcon: Icon(Icons.close, size: 18),
                        onDeleted: () {
                          setState(() {
                            _secondaryLanguages.remove(lang);
                          });
                          _saveLanguageSetting('secondary_languages', _secondaryLanguages);
                        },
                      ),
                    ).toList(),
                  ),
                SizedBox(height: 8),
                OutlinedButton.icon(
                  onPressed: _addSecondaryLanguage,
                  icon: Icon(Icons.add),
                  label: Text('Add Language'),
                ),
              ],
            ),
          ),
          
          // Display Options
          _buildSectionHeader('Display Options'),
          SwitchListTile(
            title: Text('Show Language Flags'),
            value: _showLanguageFlags,
            onChanged: (value) {
              setState(() {
                _showLanguageFlags = value;
              });
              _saveLanguageSetting('show_language_flags', value);
            },
          ),
          
          // Information Card
          Card(
            margin: EdgeInsets.all(16),
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'About Language Settings',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Language settings control how content is displayed in the app. '
                    'You can set the app language, content language preferences, '
                    'and add secondary languages for multilingual content.',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[700],
                    ),
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Note: Changing the app language requires restarting the app to take effect.',
                    style: TextStyle(
                      fontSize: 12,
                      fontStyle: FontStyle.italic,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
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

