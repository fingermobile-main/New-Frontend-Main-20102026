import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ThemeSettingsScreen extends StatefulWidget {
  @override
  _ThemeSettingsScreenState createState() => _ThemeSettingsScreenState();
}

class _ThemeSettingsScreenState extends State<ThemeSettingsScreen> {
  String _themeMode = 'System';
  String _primaryColor = 'Blue';
  String _accentColor = 'Indigo';
  bool _useMaterialYou = false;
  bool _reduceTransparency = false;
  bool _reduceMotion = false;
  bool _useDynamicColors = false;
  double _fontSizeScale = 1.0;
  bool _enableCustomBackground = false;
  String _customBackground = 'Default';

  @override
  void initState() {
    super.initState();
    _loadThemeSettings();
  }

  Future<void> _loadThemeSettings() async {
    try {
      final settings = await ApiService.get('/member/theme_settings');
      if (settings != null) {
        setState(() {
          _themeMode = settings['theme_mode'] ?? 'System';
          _primaryColor = settings['primary_color'] ?? 'Blue';
          _accentColor = settings['accent_color'] ?? 'Indigo';
          _useMaterialYou = settings['use_material_you'] ?? false;
          _reduceTransparency = settings['reduce_transparency'] ?? false;
          _reduceMotion = settings['reduce_motion'] ?? false;
          _useDynamicColors = settings['use_dynamic_colors'] ?? false;
          _fontSizeScale = double.tryParse(settings['font_size_scale']?.toString() ?? '1.0') ?? 1.0;
          _enableCustomBackground = settings['enable_custom_background'] ?? false;
          _customBackground = settings['custom_background'] ?? 'Default';
        });
      }
    } catch (e) {
      print('Error loading theme settings: $e');
    }
  }

  Future<void> _saveThemeSetting(String key, dynamic value) async {
    try {
      await ApiService.put('/member/theme_settings', {key: value});
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Theme setting updated'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      print('Error saving theme setting: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error saving theme setting'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Theme Settings'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          // Theme Mode
          _buildSectionHeader('Theme Mode'),
          _buildDropdownSetting(
            title: 'Theme Mode',
            value: _themeMode,
            items: ['System', 'Light', 'Dark'],
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  _themeMode = newValue;
                });
                _saveThemeSetting('theme_mode', newValue);
              }
            },
          ),
          
          // Color Settings
          _buildSectionHeader('Color Settings'),
          _buildDropdownSetting(
            title: 'Primary Color',
            value: _primaryColor,
            items: ['Blue', 'Red', 'Green', 'Purple', 'Orange', 'Teal', 'Pink', 'Indigo'],
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  _primaryColor = newValue;
                });
                _saveThemeSetting('primary_color', newValue);
              }
            },
          ),
          _buildDropdownSetting(
            title: 'Accent Color',
            value: _accentColor,
            items: ['Indigo', 'Blue', 'Red', 'Green', 'Purple', 'Orange', 'Teal', 'Pink'],
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  _accentColor = newValue;
                });
                _saveThemeSetting('accent_color', newValue);
              }
            },
          ),
          SwitchListTile(
            title: Text('Use Dynamic Colors'),
            subtitle: Text('Use colors from your wallpaper'),
            value: _useDynamicColors,
            onChanged: (value) {
              setState(() {
                _useDynamicColors = value;
              });
              _saveThemeSetting('use_dynamic_colors', value);
            },
          ),
          
          // Material You Settings
          _buildSectionHeader('Material You'),
          SwitchListTile(
            title: Text('Use Material You'),
            subtitle: Text('Apply Material You design principles'),
            value: _useMaterialYou,
            onChanged: (value) {
              setState(() {
                _useMaterialYou = value;
              });
              _saveThemeSetting('use_material_you', value);
            },
          ),
          
          // Accessibility Settings
          _buildSectionHeader('Accessibility'),
          SwitchListTile(
            title: Text('Reduce Transparency'),
            value: _reduceTransparency,
            onChanged: (value) {
              setState(() {
                _reduceTransparency = value;
              });
              _saveThemeSetting('reduce_transparency', value);
            },
          ),
          SwitchListTile(
            title: Text('Reduce Motion'),
            value: _reduceMotion,
            onChanged: (value) {
              setState(() {
                _reduceMotion = value;
              });
              _saveThemeSetting('reduce_motion', value);
            },
          ),
          
          // Font Settings
          _buildSectionHeader('Font Settings'),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Font Size Scale: ${(_fontSizeScale * 100).round()}%',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                ),
                Slider(
                  value: _fontSizeScale,
                  min: 0.8,
                  max: 1.5,
                  divisions: 14,
                  label: '${(_fontSizeScale * 100).round()}%',
                  onChanged: (value) {
                    setState(() {
                      _fontSizeScale = value;
                    });
                    _saveThemeSetting('font_size_scale', value);
                  },
                ),
              ],
            ),
          ),
          
          // Background Settings
          _buildSectionHeader('Background'),
          SwitchListTile(
            title: Text('Enable Custom Background'),
            value: _enableCustomBackground,
            onChanged: (value) {
              setState(() {
                _enableCustomBackground = value;
              });
              _saveThemeSetting('enable_custom_background', value);
            },
          ),
          if (_enableCustomBackground)
            _buildDropdownSetting(
              title: 'Background Style',
              value: _customBackground,
              items: ['Default', 'Solid Color', 'Gradient', 'Image', 'Pattern'],
              onChanged: (String? newValue) {
                if (newValue != null) {
                  setState(() {
                    _customBackground = newValue;
                  });
                  _saveThemeSetting('custom_background', newValue);
                }
              },
            ),
          
          // Preview Section
          _buildSectionHeader('Theme Preview'),
          Card(
            margin: EdgeInsets.all(16),
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                children: [
                  Container(
                    width: double.infinity,
                    padding: EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Theme.of(context).primaryColor,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Primary Color Preview',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  SizedBox(height: 16),
                  Container(
                    width: double.infinity,
                    padding: EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.secondary,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Accent Color Preview',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
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
                    'About Theme Settings',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Theme settings allow you to customize the look and feel of the app. '
                    'Changes to theme settings are applied immediately throughout the app.',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[700],
                    ),
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Note: Some theme options may not be available on all devices.',
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