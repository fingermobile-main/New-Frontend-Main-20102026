import 'package:flutter/material.dart';

class AdminPermissionsPage extends StatefulWidget {
  @override
  _AdminPermissionsPageState createState() => _AdminPermissionsPageState();
}

class _AdminPermissionsPageState extends State<AdminPermissionsPage> {
  final List<Map<String, dynamic>> _permissionGroups = [
    {
      'name': 'member Management',
      'permissions': [
        {'name': 'View members', 'enabled': true},
        {'name': 'Edit members', 'enabled': true},
        {'name': 'Delete members', 'enabled': false},
        {'name': 'Ban members', 'enabled': false},
      ],
    },
    {
      'name': 'Content Management',
      'permissions': [
        {'name': 'View Content', 'enabled': true},
        {'name': 'Edit Content', 'enabled': true},
        {'name': 'Delete Content', 'enabled': true},
        {'name': 'Moderate Content', 'enabled': true},
      ],
    },
    {
      'name': 'System Settings',
      'permissions': [
        {'name': 'View Settings', 'enabled': true},
        {'name': 'Edit Settings', 'enabled': false},
        {'name': 'Manage Security', 'enabled': false},
        {'name': 'View Logs', 'enabled': true},
      ],
    },
    {
      'name': 'Analytics',
      'permissions': [
        {'name': 'View Analytics', 'enabled': true},
        {'name': 'Export Data', 'enabled': false},
        {'name': 'Create Reports', 'enabled': true},
        {'name': 'Manage Dashboards', 'enabled': false},
      ],
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Admin Permissions'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Admin Permissions',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Manage member roles and permissions',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 20),
            Expanded(
              child: ListView.builder(
                itemCount: _permissionGroups.length,
                itemBuilder: (context, groupIndex) {
                  var group = _permissionGroups[groupIndex];
                  return Card(
                    elevation: 2,
                    margin: EdgeInsets.only(bottom: 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.grey[100],
                            borderRadius: BorderRadius.vertical(
                              top: Radius.circular(8),
                            ),
                          ),
                          child: Row(
                            children: [
                              Icon(Icons.group, color: Colors.deepPurple),
                              SizedBox(width: 12),
                              Text(
                                group['name'],
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                        ...List.generate(
                          group['permissions'].length,
                          (permIndex) {
                            var permission = group['permissions'][permIndex];
                            return _buildPermissionItem(
                              permission['name'],
                              permission['enabled'],
                              groupIndex,
                              permIndex,
                            );
                          },
                        ).expand((element) => [
                          Divider(height: 1),
                          element,
                        ]).toList()..removeAt(0), // Remove first divider
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Create new permission group
        },
        child: Icon(Icons.add),
        backgroundColor: Colors.deepPurple,
      ),
    );
  }

  Widget _buildPermissionItem(
    String name,
    bool enabled,
    int groupIndex,
    int permIndex,
  ) {
    return ListTile(
      title: Text(name),
      trailing: Switch(
        value: enabled,
        onChanged: (value) {
          setState(() {
            _permissionGroups[groupIndex]['permissions'][permIndex]['enabled'] = value;
          });
        },
      ),
      onTap: () {
        setState(() {
          _permissionGroups[groupIndex]['permissions'][permIndex]['enabled'] = 
              !_permissionGroups[groupIndex]['permissions'][permIndex]['enabled'];
        });
      },
    );
  }
}