import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ContentFiltersScreen extends StatefulWidget {
  @override
  _ContentFiltersScreenState createState() => _ContentFiltersScreenState();
}

class _ContentFiltersScreenState extends State<ContentFiltersScreen> {
  // Content filtering preferences
  bool _showSensitiveContent = false;
  bool _showPoliticalContent = true;
  bool _showViolentContent = false;
  bool _showAdultContent = false;
  bool _showMisinformation = true;
  bool _showAds = true;
  bool _showSponsoredContent = true;
  String _contentLanguage = 'All Languages';
  String _contentRegion = 'All Regions';
  bool _autoBlockKeywords = true;
  String _customKeywords = '';

  @override
  void initState() {
    super.initState();
    _loadFilterSettings();
  }

  Future<void> _loadFilterSettings() async {
    try {
      final settings = await ApiService.get('/member/content_filters');
      if (settings != null) {
        setState(() {
          _showSensitiveContent = settings['show_sensitive_content'] ?? false;
          _showPoliticalContent = settings['show_political_content'] ?? true;
          _showViolentContent = settings['show_violent_content'] ?? false;
          _showAdultContent = settings['show_adult_content'] ?? false;
          _showMisinformation = settings['show_misinformation'] ?? true;
          _showAds = settings['show_ads'] ?? true;
          _showSponsoredContent = settings['show_sponsored_content'] ?? true;
          _contentLanguage = settings['content_language'] ?? 'All Languages';
          _contentRegion = settings['content_region'] ?? 'All Regions';
          _autoBlockKeywords = settings['auto_block_keywords'] ?? true;
          _customKeywords = settings['custom_keywords'] ?? '';
        });
      }
    } catch (e) {
      print('Error loading filter settings: $e');
    }
  }

  Future<void> _saveFilterSetting(String key, dynamic value) async {
    try {
      await ApiService.put('/member/content_filters', {key: value});
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Filter setting updated'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      print('Error saving filter setting: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error saving filter setting'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  void _addCustomKeyword() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        final keywordController = TextEditingController();

        return AlertDialog(
          title: Text('Add Custom Keyword'),
          content: TextField(
            controller: keywordController,
            decoration: InputDecoration(
              hintText: 'Enter keyword to block',
            ),
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
                if (keywordController.text.isNotEmpty) {
                  setState(() {
                    _customKeywords = _customKeywords.isEmpty 
                        ? keywordController.text 
                        : '$_customKeywords, ${keywordController.text}';
                  });
                  _saveFilterSetting('custom_keywords', _customKeywords);
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
        title: Text('Content Filters'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          // Content Sensitivity Filters
          _buildSectionHeader('Content Sensitivity'),
          SwitchListTile(
            title: Text('Show Sensitive Content'),
            subtitle: Text('Include content that may be sensitive'),
            value: _showSensitiveContent,
            onChanged: (value) {
              setState(() {
                _showSensitiveContent = value;
              });
              _saveFilterSetting('show_sensitive_content', value);
            },
          ),
          SwitchListTile(
            title: Text('Show Violent Content'),
            subtitle: Text('Include content depicting violence'),
            value: _showViolentContent,
            onChanged: (value) {
              setState(() {
                _showViolentContent = value;
              });
              _saveFilterSetting('show_violent_content', value);
            },
          ),
          SwitchListTile(
            title: Text('Show Adult Content'),
            subtitle: Text('Include content for mature audiences'),
            value: _showAdultContent,
            onChanged: (value) {
              setState(() {
                _showAdultContent = value;
              });
              _saveFilterSetting('show_adult_content', value);
            },
          ),
          SwitchListTile(
            title: Text('Show Political Content'),
            subtitle: Text('Include political discussions'),
            value: _showPoliticalContent,
            onChanged: (value) {
              setState(() {
                _showPoliticalContent = value;
              });
              _saveFilterSetting('show_political_content', value);
            },
          ),
          SwitchListTile(
            title: Text('Show Misinformation'),
            subtitle: Text('Include content flagged as misinformation'),
            value: _showMisinformation,
            onChanged: (value) {
              setState(() {
                _showMisinformation = value;
              });
              _saveFilterSetting('show_misinformation', value);
            },
          ),
          
          // Content Type Filters
          _buildSectionHeader('Content Type'),
          SwitchListTile(
            title: Text('Show Ads'),
            value: _showAds,
            onChanged: (value) {
              setState(() {
                _showAds = value;
              });
              _saveFilterSetting('show_ads', value);
            },
          ),
          SwitchListTile(
            title: Text('Show Sponsored Content'),
            value: _showSponsoredContent,
            onChanged: (value) {
              setState(() {
                _showSponsoredContent = value;
              });
              _saveFilterSetting('show_sponsored_content', value);
            },
          ),
          
          // Content Preferences
          _buildSectionHeader('Content Preferences'),
          _buildDropdownSetting(
            title: 'Content Language',
            value: _contentLanguage,
            items: ['All Languages', 'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'],
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  _contentLanguage = newValue;
                });
                _saveFilterSetting('content_language', newValue);
              }
            },
          ),
          _buildDropdownSetting(
            title: 'Content Region',
            value: _contentRegion,
            items: ['All Regions', 'United States', 'Europe', 'Asia', 'Africa', 'South America', 'Other'],
            onChanged: (String? newValue) {
              if (newValue != null) {
                setState(() {
                  _contentRegion = newValue;
                });
                _saveFilterSetting('content_region', newValue);
              }
            },
          ),
          
          // Keyword Filtering
          _buildSectionHeader('Keyword Filtering'),
          SwitchListTile(
            title: Text('Auto-block Keywords'),
            subtitle: Text('Automatically filter content with flagged keywords'),
            value: _autoBlockKeywords,
            onChanged: (value) {
              setState(() {
                _autoBlockKeywords = value;
              });
              _saveFilterSetting('auto_block_keywords', value);
            },
          ),
          ListTile(
            title: Text('Custom Keywords'),
            subtitle: Text(_customKeywords.isEmpty ? 'No custom keywords added' : _customKeywords),
            trailing: IconButton(
              icon: Icon(Icons.add),
              onPressed: _addCustomKeyword,
            ),
            onTap: _addCustomKeyword,
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