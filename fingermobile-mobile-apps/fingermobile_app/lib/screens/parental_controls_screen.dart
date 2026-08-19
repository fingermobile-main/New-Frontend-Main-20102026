import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ParentalControlsScreen extends StatefulWidget {
  @override
  _ParentalControlsScreenState createState() => _ParentalControlsScreenState();
}

class _ParentalControlsScreenState extends State<ParentalControlsScreen> {
  bool _parentalControlsEnabled = false;
  bool _contentFiltering = true;
  bool _screenTimeLimit = false;
  bool _appRestrictions = false;
  bool _purchaseRestrictions = true;
  String _contentRating = 'Teen';
  String _screenTimeDuration = '2 hours';
  String _allowedApps = 'All Apps';
  String _allowedContentTypes = 'All Content';
  bool _locationSharing = false;
  bool _messageFiltering = true;
  bool _contactRestrictions = true;
  bool _socialMediaAccess = true;
  bool _inAppPurchases = false;
  String _pinCode = '';

  @override
  void initState() {
    super.initState();
    _loadParentalControls();
  }

  Future<void> _loadParentalControls() async {
    try {
      final settings = await ApiService.get('/member/parental_controls');
      if (settings != null) {
        setState(() {
          _parentalControlsEnabled = settings['parental_controls_enabled'] ?? false;
          _contentFiltering = settings['content_filtering'] ?? true;
          _screenTimeLimit = settings['screen_time_limit'] ?? false;
          _appRestrictions = settings['app_restrictions'] ?? false;
          _purchaseRestrictions = settings['purchase_restrictions'] ?? true;
          _contentRating = settings['content_rating'] ?? 'Teen';
          _screenTimeDuration = settings['screen_time_duration'] ?? '2 hours';
          _allowedApps = settings['allowed_apps'] ?? 'All Apps';
          _allowedContentTypes = settings['allowed_content_types'] ?? 'All Content';
          _locationSharing = settings['location_sharing'] ?? false;
          _messageFiltering = settings['message_filtering'] ?? true;
          _contactRestrictions = settings['contact_restrictions'] ?? true;
          _socialMediaAccess = settings['social_media_access'] ?? true;
          _inAppPurchases = settings['in_app_purchases'] ?? false;
          _pinCode = settings['pin_code'] ?? '';
        });
      }
    } catch (e) {
      print('Error loading parental controls: $e');
    }
  }

  Future<void> _saveParentalControl(String key, dynamic value) async {
    try {
      await ApiService.put('/member/parental_controls', {key: value});
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Parental control setting updated'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      print('Error saving parental control: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error saving parental control'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _setPinCode() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        final pinController = TextEditingController();
        final confirmPinController = TextEditingController();

        return AlertDialog(
          title: Text('Set PIN Code'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: pinController,
                decoration: InputDecoration(
                  labelText: 'Enter PIN (4 digits)',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                obscureText: true,
              ),
              SizedBox(height: 16),
              TextField(
                controller: confirmPinController,
                decoration: InputDecoration(
                  labelText: 'Confirm PIN',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
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
                if (pinController.text.length == 4 && 
                    pinController.text == confirmPinController.text) {
                  setState(() {
                    _pinCode = pinController.text;
                  });
                  _saveParentalControl('pin_code', pinController.text);
                  Navigator.of(context).pop();
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('PIN code set successfully'),
                      backgroundColor: Colors.green,
                    ),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('PIN must be 4 digits and match'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              },
              child: Text('Set PIN'),
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
        title: Text('Parental Controls'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          // Parental Controls Toggle
          SwitchListTile(
            title: Text('Enable Parental Controls'),
            subtitle: Text('Restrict content and features for child accounts'),
            value: _parentalControlsEnabled,
            onChanged: (value) {
              if (value && _pinCode.isEmpty) {
                _setPinCode();
                return;
              }
              setState(() {
                _parentalControlsEnabled = value;
              });
              _saveParentalControl('parental_controls_enabled', value);
            },
          ),
          
          if (_parentalControlsEnabled) ...[
            // Content Controls
            _buildSectionHeader('Content Controls'),
            SwitchListTile(
              title: Text('Content Filtering'),
              value: _contentFiltering,
              onChanged: (value) {
                setState(() {
                  _contentFiltering = value;
                });
                _saveParentalControl('content_filtering', value);
              },
            ),
            _buildDropdownSetting(
              title: 'Content Rating',
              value: _contentRating,
              items: ['All Ages', 'Young Child', 'Older Child', 'Teen', 'Mature'],
              onChanged: (String? newValue) {
                if (newValue != null) {
                  setState(() {
                    _contentRating = newValue;
                  });
                  _saveParentalControl('content_rating', newValue);
                }
              },
            ),
            _buildDropdownSetting(
              title: 'Allowed Content Types',
              value: _allowedContentTypes,
              items: ['All Content', 'Educational', 'Entertainment', 'News', 'Filtered'],
              onChanged: (String? newValue) {
                if (newValue != null) {
                  setState(() {
                    _allowedContentTypes = newValue;
                  });
                  _saveParentalControl('allowed_content_types', newValue);
                }
              },
            ),
            
            // Screen Time Controls
            _buildSectionHeader('Screen Time Controls'),
            SwitchListTile(
              title: Text('Screen Time Limit'),
              value: _screenTimeLimit,
              onChanged: (value) {
                setState(() {
                  _screenTimeLimit = value;
                });
                _saveParentalControl('screen_time_limit', value);
              },
            ),
            if (_screenTimeLimit)
              _buildDropdownSetting(
                title: 'Screen Time Duration',
                value: _screenTimeDuration,
                items: ['30 minutes', '1 hour', '2 hours', '3 hours', '4 hours', 'No Limit'],
                onChanged: (String? newValue) {
                  if (newValue != null) {
                    setState(() {
                      _screenTimeDuration = newValue;
                    });
                    _saveParentalControl('screen_time_duration', newValue);
                  }
                },
              ),
            
            // App and Feature Controls
            _buildSectionHeader('App & Feature Controls'),
            SwitchListTile(
              title: Text('App Restrictions'),
              value: _appRestrictions,
              onChanged: (value) {
                setState(() {
                  _appRestrictions = value;
                });
                _saveParentalControl('app_restrictions', value);
              },
            ),
            if (_appRestrictions)
              _buildDropdownSetting(
                title: 'Allowed Apps',
                value: _allowedApps,
                items: ['All Apps', 'Approved Only', 'Educational Only', 'Communication Only'],
                onChanged: (String? newValue) {
                  if (newValue != null) {
                    setState(() {
                      _allowedApps = newValue;
                    });
                    _saveParentalControl('allowed_apps', newValue);
                  }
                },
              ),
            SwitchListTile(
              title: Text('Social Media Access'),
              value: _socialMediaAccess,
              onChanged: (value) {
                setState(() {
                  _socialMediaAccess = value;
                });
                _saveParentalControl('social_media_access', value);
              },
            ),
            SwitchListTile(
              title: Text('Message Filtering'),
              value: _messageFiltering,
              onChanged: (value) {
                setState(() {
                  _messageFiltering = value;
                });
                _saveParentalControl('message_filtering', value);
              },
            ),
            SwitchListTile(
              title: Text('Contact Restrictions'),
              value: _contactRestrictions,
              onChanged: (value) {
                setState(() {
                  _contactRestrictions = value;
                });
                _saveParentalControl('contact_restrictions', value);
              },
            ),
            
            // Purchase Controls
            _buildSectionHeader('Purchase Controls'),
            SwitchListTile(
              title: Text('Purchase Restrictions'),
              value: _purchaseRestrictions,
              onChanged: (value) {
                setState(() {
                  _purchaseRestrictions = value;
                });
                _saveParentalControl('purchase_restrictions', value);
              },
            ),
            SwitchListTile(
              title: Text('In-App Purchases'),
              value: _inAppPurchases,
              onChanged: (value) {
                setState(() {
                  _inAppPurchases = value;
                });
                _saveParentalControl('in_app_purchases', value);
              },
            ),
            
            // Privacy Controls
            _buildSectionHeader('Privacy Controls'),
            SwitchListTile(
              title: Text('Location Sharing'),
              value: _locationSharing,
              onChanged: (value) {
                setState(() {
                  _locationSharing = value;
                });
                _saveParentalControl('location_sharing', value);
              },
            ),
          ],
          
          // PIN Management
          if (_parentalControlsEnabled)
            _buildSectionHeader('PIN Management')
          else
            _buildSectionHeader('Setup Parental Controls'),
          
          ListTile(
            leading: Icon(Icons.lock, color: Colors.blue),
            title: Text('Set PIN Code'),
            subtitle: _pinCode.isEmpty 
                ? Text('Not set') 
                : Text('****', style: TextStyle(fontSize: 18)),
            trailing: Icon(Icons.arrow_forward_ios, size: 16),
            onTap: _setPinCode,
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
                    'About Parental Controls',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Parental controls help you manage what your children can access on the platform. '
                    'These settings restrict content, limit screen time, and control features based on age-appropriate settings.',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[700],
                    ),
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Note: Remember your PIN code as it will be required to change these settings.',
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