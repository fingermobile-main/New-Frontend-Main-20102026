import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AccessibilitySettingsScreen extends StatefulWidget {
  @override
  _AccessibilitySettingsScreenState createState() => _AccessibilitySettingsScreenState();
}

class _AccessibilitySettingsScreenState extends State<AccessibilitySettingsScreen> {
  // Accessibility settings
  bool _highContrastMode = false;
  bool _largeTextMode = false;
  bool _voiceOverEnabled = false;
  bool _reduceMotion = false;
  bool _reduceTransparency = false;
  bool _boldText = false;
  bool _grayscale = false;
  double _textSizeScale = 1.0;
  String _preferredLanguage = 'English';
  bool _screenReader = false;
  bool _captions = false;
  String _colorTheme = 'Default';

  @override
  void initState() {
    super.initState();
    _loadAccessibilitySettings();
  }

  Future<void> _loadAccessibilitySettings() async {
    try {
      final settings = await ApiService.get('/member/accessibility_settings');
      if (settings != null) {
        setState(() {
          _highContrastMode = settings['high_contrast_mode'] ?? false;
          _largeTextMode = settings['large_text_mode'] ?? false;
          _voiceOverEnabled = settings['voice_over_enabled'] ?? false;
          _reduceMotion = settings['reduce_motion'] ?? false;
          _reduceTransparency = settings['reduce_transparency'] ?? false;
          _boldText = settings['bold_text'] ?? false;
          _grayscale = settings['grayscale'] ?? false;
          _textSizeScale = double.tryParse(settings['text_size_scale']?.toString() ?? '1.0') ?? 1.0;
          _preferredLanguage = settings['preferred_language'] ?? 'English';
          _screenReader = settings['screen_reader'] ?? false;
          _captions = settings['captions'] ?? false;
          _colorTheme = settings['color_theme'] ?? 'Default';
        });
      }
    } catch (e) {
      print('Error loading accessibility settings: $e');
    }
  }

  Future<void> _saveAccessibilitySetting(String key, dynamic value) async {
    try {
      await ApiService.put('/member/accessibility_settings', {key: value});
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Accessibility setting updated'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      print('Error saving accessibility setting: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error saving accessibility setting'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Accessibility Settings'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          // Visual Accessibility Settings
          _buildSectionHeader('Visual Accessibility'),
          SwitchListTile(
            title: Text('High Contrast Mode'),
            subtitle: Text('Increase contrast between text and background'),
            value: _highContrastMode,
            onChanged: (value) {
              setState(() {
                _highContrastMode = value;
              });
              _saveAccessibilitySetting('high_contrast_mode', value);
            },
          ),
          SwitchListTile(
            title: Text('Large Text Mode'),
            subtitle: Text('Increase the size of text throughout the app'),
            value: _largeTextMode,
            onChanged: (value) {
              setState(() {
                _largeTextMode = value;
              });
              _saveAccessibilitySetting('large_text_mode', value);
            },
          ),
          SwitchListTile(
            title: Text('Bold Text'),
            value: _boldText,
            onChanged: (value) {
              setState(() {
                _boldText = value;
              });
              _saveAccessibilitySetting('bold_text', value);
            },
          ),
          SwitchListTile(
            title: Text('Reduce Transparency'),
            value: _reduceTransparency,
            onChanged: (value) {
              setState(() {
                _reduceTransparency = value;
              });
              _saveAccessibilitySetting('reduce_transparency', value);
            },
          ),
          SwitchListTile(
            title: Text('Grayscale'),
            value: _grayscale,
            onChanged: (value) {
              setState(() {
                _grayscale = value;
              });
              _saveAccessibilitySetting('grayscale', value);
            },
          ),
          
          // Text Size Slider
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Text Size Scale: ${(_textSizeScale * 100).round()}%',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                ),
                Slider(
                  value: _textSizeScale,
                  min: 0.8,
                  max: 1.5,
                  divisions: 14,
                  label: '${(_textSizeScale * 100).round()}%',
                  onChanged: (value) {
                    setState(() {
                      _textSizeScale = value;
                    });
                    _saveAccessibilitySetting('text_size_scale', value);
                  },
                ),
              ],
            ),
          ),
          
          // Motion and Animation Settings
          _buildSectionHeader('Motion and Animation'),
          SwitchListTile(
            title: Text('Reduce Motion'),
            subtitle: Text('Reduce motion and animation effects'),
            value: _reduceMotion,
            onChanged: (value) {
              setState(() {
                _reduceMotion = value;
              });
              _saveAccessibilitySetting('reduce_motion', value);
            },
          ),
          
          // Audio Accessibility Settings
          _buildSectionHeader('Audio Accessibility'),
          SwitchListTile(
            title: Text('Screen Reader'),
            subtitle: Text('Narrate items as you interact with them'),
            value: _screenReader,
            onChanged: (value) {
              setState(() {
                _screenReader = value;
              });
              _saveAccessibilitySetting('screen_reader', value);
            },
          ),
          SwitchListTile(
            title: Text('Captions'),
            subtitle: Text('Show captions for videos'),
            value: _captions,
            onChanged: (value) {
              setState(() {
                _captions = value;
              });
              _saveAccessibilitySetting('captions', value);
            },
          ),
          
          // Language and Communication
          _buildSectionHeader('Language and Communication'),
          _buildDropdownSetting(
            title: 'Preferred Language',
            value: _preferredLanguage,
            items: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic'],
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  _preferredLanguage = newValue;
                });
                _saveAccessibilitySetting('preferred_language', newValue);
              }
            },
          ),
          _buildDropdownSetting(
            title: 'Color Theme',
            value: _colorTheme,
            items: ['Default', 'Dark', 'Light', 'High Contrast', 'Blue Light Filter'],
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  _colorTheme = newValue;
                });
                _saveAccessibilitySetting('color_theme', newValue);
              }
            },
          ),
          
          // Additional Information
          Card(
            margin: EdgeInsets.all(16),
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'About Accessibility',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Accessibility features are designed to help members with disabilities use the app more effectively. '
                    'These settings affect how content is displayed and how you interact with the app.',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[700],
                    ),
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Need additional support?',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'If you need further accessibility options or assistance, please contact our support team.',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[700],
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