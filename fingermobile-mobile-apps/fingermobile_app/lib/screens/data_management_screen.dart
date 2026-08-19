import 'package:flutter/material.dart';
import '../services/api_service.dart';

class DataManagementScreen extends StatefulWidget {
  @override
  _DataManagementScreenState createState() => _DataManagementScreenState();
}

class _DataManagementScreenState extends State<DataManagementScreen> {
  // Data management settings
  bool _autoDownloadImages = true;
  bool _autoDownloadVideos = false;
  bool _wifiOnlyDownloads = true;
  bool _dataSaverMode = false;
  bool _backgroundDataSync = true;
  bool _locationDataCollection = true;
  bool _analyticsDataCollection = true;
  String _dataUsageLimit = 'Unlimited';
  String _mediaQuality = 'High';

  @override
  void initState() {
    super.initState();
    _loadDataSettings();
  }

  Future<void> _loadDataSettings() async {
    try {
      final settings = await ApiService.get('/member/data_settings');
      if (settings != null) {
        setState(() {
          _autoDownloadImages = settings['auto_download_images'] ?? true;
          _autoDownloadVideos = settings['auto_download_videos'] ?? false;
          _wifiOnlyDownloads = settings['wifi_only_downloads'] ?? true;
          _dataSaverMode = settings['data_saver_mode'] ?? false;
          _backgroundDataSync = settings['background_data_sync'] ?? true;
          _locationDataCollection = settings['location_data_collection'] ?? true;
          _analyticsDataCollection = settings['analytics_data_collection'] ?? true;
          _dataUsageLimit = settings['data_usage_limit'] ?? 'Unlimited';
          _mediaQuality = settings['media_quality'] ?? 'High';
        });
      }
    } catch (e) {
      print('Error loading data settings: $e');
    }
  }

  Future<void> _saveDataSetting(String key, dynamic value) async {
    try {
      await ApiService.put('/member/data_settings', {key: value});
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Data setting updated'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      print('Error saving data setting: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error saving data setting'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _requestDataDownload() {
    // Simulate requesting data download
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Data Download Request'),
          content: Text('Your data download request has been submitted. You will receive an email with a download link when your data is ready.'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('OK'),
            ),
          ],
        );
      },
    );
  }

  void _requestDataDeletion() {
    // Show confirmation dialog for data deletion
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Confirm Data Deletion'),
          content: Text('Are you sure you want to delete your data? This action is irreversible and will permanently remove all your data from our servers.'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                // In a real app, this would initiate the data deletion process
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Data deletion request submitted'),
                    backgroundColor: Colors.red,
                  ),
                );
              },
              child: Text('Delete', style: TextStyle(color: Colors.red)),
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
        title: Text('Data Management'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          // Data Usage Information
          Card(
            margin: EdgeInsets.all(16),
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Data Usage',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  _buildDataUsageItem('Total Used', '245 MB'),
                  _buildDataUsageItem('Images', '180 MB'),
                  _buildDataUsageItem('Videos', '55 MB'),
                  _buildDataUsageItem('Other', '10 MB'),
                ],
              ),
            ),
          ),
          
          // Download Settings
          _buildSectionHeader('Download Settings'),
          SwitchListTile(
            title: Text('Auto-download Images'),
            value: _autoDownloadImages,
            onChanged: (value) {
              setState(() {
                _autoDownloadImages = value;
              });
              _saveDataSetting('auto_download_images', value);
            },
          ),
          SwitchListTile(
            title: Text('Auto-download Videos'),
            value: _autoDownloadVideos,
            onChanged: (value) {
              setState(() {
                _autoDownloadVideos = value;
              });
              _saveDataSetting('auto_download_videos', value);
            },
          ),
          SwitchListTile(
            title: Text('WiFi-only Downloads'),
            value: _wifiOnlyDownloads,
            onChanged: (value) {
              setState(() {
                _wifiOnlyDownloads = value;
              });
              _saveDataSetting('wifi_only_downloads', value);
            },
          ),
          SwitchListTile(
            title: Text('Data Saver Mode'),
            value: _dataSaverMode,
            onChanged: (value) {
              setState(() {
                _dataSaverMode = value;
              });
              _saveDataSetting('data_saver_mode', value);
            },
          ),
          
          // Quality Settings
          _buildSectionHeader('Quality Settings'),
          _buildDropdownSetting(
            title: 'Media Quality',
            value: _mediaQuality,
            items: ['Low', 'Medium', 'High', 'Original'],
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  _mediaQuality = newValue;
                });
                _saveDataSetting('media_quality', newValue);
              }
            },
          ),
          _buildDropdownSetting(
            title: 'Data Usage Limit',
            value: _dataUsageLimit,
            items: ['Unlimited', '100 MB', '250 MB', '500 MB', '1 GB', '2 GB'],
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  _dataUsageLimit = newValue;
                });
                _saveDataSetting('data_usage_limit', newValue);
              }
            },
          ),
          
          // Data Collection Settings
          _buildSectionHeader('Data Collection'),
          SwitchListTile(
            title: Text('Location Data Collection'),
            subtitle: Text('Allow FingerMobile to collect location data for better service'),
            value: _locationDataCollection,
            onChanged: (value) {
              setState(() {
                _locationDataCollection = value;
              });
              _saveDataSetting('location_data_collection', value);
            },
          ),
          SwitchListTile(
            title: Text('Analytics Data Collection'),
            subtitle: Text('Help improve FingerMobile by sharing usage data'),
            value: _analyticsDataCollection,
            onChanged: (value) {
              setState(() {
                _analyticsDataCollection = value;
              });
              _saveDataSetting('analytics_data_collection', value);
            },
          ),
          SwitchListTile(
            title: Text('Background Datasync'),
            value: _backgroundDataSync,
            onChanged: (value) {
              setState(() {
                _backgroundDataSync = value;
              });
              _saveDataSetting('background_data_sync', value);
            },
          ),
          
          // Data Management Actions
          _buildSectionHeader('Data Management'),
          _buildActionItem(
            icon: Icons.download,
            title: 'Request Data Download',
            subtitle: 'Download a copy of your data',
            onTap: _requestDataDownload,
          ),
          _buildActionItem(
            icon: Icons.delete,
            title: 'Request Data Deletion',
            subtitle: 'Permanently delete your data',
            onTap: _requestDataDeletion,
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

  Widget _buildDataUsageItem(String label, String value) {
    return Padding(
      padding: EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label),
          Text(
            value,
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
        ],
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

  Widget _buildActionItem({
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
}