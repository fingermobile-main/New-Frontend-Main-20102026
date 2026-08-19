import 'package:flutter/material.dart';

class FeatureFlagsPage extends StatefulWidget {
  @override
  _FeatureFlagsPageState createState() => _FeatureFlagsPageState();
}

class _FeatureFlagsPageState extends State<FeatureFlagsPage> {
  final List<Map<String, dynamic>> _featureFlags = [
    {
      'name': 'New Dashboard UI',
      'description': 'Enable the new dashboard interface',
      'enabled': true,
      'type': 'UI',
    },
    {
      'name': 'Advanced Analytics',
      'description': 'Enable advanced analytics features',
      'enabled': false,
      'type': 'Analytics',
    },
    {
      'name': 'Social Features',
      'description': 'Enable social interaction features',
      'enabled': true,
      'type': 'Social',
    },
    {
      'name': 'Payment Gateway',
      'description': 'Enable payment processing features',
      'enabled': true,
      'type': 'Monetization',
    },
    {
      'name': 'AI Recommendations',
      'description': 'Enable AI-powered content recommendations',
      'enabled': false,
      'type': 'AI',
    },
    {
      'name': 'Dark Mode',
      'description': 'Enable dark theme option',
      'enabled': true,
      'type': 'UI',
    },
    {
      'name': 'Live Streaming',
      'description': 'Enable live streaming capabilities',
      'enabled': false,
      'type': 'Content',
    },
    {
      'name': 'Two-Factor Auth',
      'description': 'Enable 2FA for member accounts',
      'enabled': true,
      'type': 'Security',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Feature Flags'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Feature Flags',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Manage feature availability and experiments',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 20),
            Container(
              height: 50,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _buildFilterChip('All', true),
                  SizedBox(width: 8),
                  _buildFilterChip('UI', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Analytics', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Social', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Security', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Monetization', false),
                ],
              ),
            ),
            SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: _featureFlags.length,
                itemBuilder: (context, index) {
                  var flag = _featureFlags[index];
                  Color typeColor = _getTypeColor(flag['type']);
                  
                  return Card(
                    elevation: 2,
                    margin: EdgeInsets.only(bottom: 12),
                    child: ExpansionTile(
                      title: Row(
                        children: [
                          Container(
                            padding: EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: typeColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              flag['type'],
                              style: TextStyle(
                                fontSize: 10,
                                color: typeColor,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          SizedBox(width: 12),
                          Text(
                            flag['name'],
                            style: TextStyle(
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                      subtitle: Text(flag['description']),
                      trailing: Switch(
                        value: flag['enabled'],
                        onChanged: (value) {
                          setState(() {
                            _featureFlags[index]['enabled'] = value;
                          });
                        },
                      ),
                      children: [
                        Padding(
                          padding: EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Details',
                                style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              SizedBox(height: 8),
                              Text(
                                'This feature flag controls the ${flag['name'].toLowerCase()} functionality. '
                                'When enabled, members will have access to this feature. '
                                'When disabled, the feature will be hidden from the interface.',
                              ),
                              SizedBox(height: 16),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.end,
                                children: [
                                  TextButton(
                                    onPressed: () {
                                      // Rollback feature
                                    },
                                    child: Text('Rollback'),
                                  ),
                                  SizedBox(width: 8),
                                  ElevatedButton(
                                    onPressed: () {
                                      // Save changes
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.deepPurple,
                                      foregroundColor: Colors.white,
                                    ),
                                    child: Text('Save'),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected) {
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (bool selected) {},
      selectedColor: Colors.deepPurple,
      checkmarkColor: Colors.white,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : Colors.black,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
          color: isSelected ? Colors.deepPurple : Colors.grey,
        ),
      ),
    );
  }

  Color _getTypeColor(String type) {
    switch (type) {
      case 'UI':
        return Colors.blue;
      case 'Analytics':
        return Colors.green;
      case 'Social':
        return Colors.orange;
      case 'Security':
        return Colors.red;
      case 'Monetization':
        return Colors.purple;
      case 'AI':
        return Colors.teal;
      case 'Content':
        return Colors.indigo;
      default:
        return Colors.grey;
    }
  }
}