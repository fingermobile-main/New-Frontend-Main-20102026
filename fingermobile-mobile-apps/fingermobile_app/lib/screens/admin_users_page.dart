import 'package:flutter/material.dart';

class AdminmembersPage extends StatefulWidget {
  @override
  _AdminmembersPageState createState() => _AdminmembersPageState();
}

class _AdminmembersPageState extends State<AdminmembersPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Admin members'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () {},
          ),
          IconButton(
            icon: Icon(Icons.add),
            onPressed: () {
              // Add new admin member
            },
          ),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Admin members',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Container(
              height: 50,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _buildFilterChip('All', true),
                  SizedBox(width: 8),
                  _buildFilterChip('Super Admin', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Admin', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Moderator', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Active', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Inactive', false),
                ],
              ),
            ),
            SizedBox(height: 16),
            Container(
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: 'Search admin members...',
                        border: InputBorder.none,
                        prefixIcon: Icon(Icons.search),
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.tune),
                    onPressed: () {},
                  ),
                ],
              ),
            ),
            SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: 6,
                itemBuilder: (context, index) {
                  bool isSuperAdmin = index == 0;
                  bool isActive = index < 5;
                  
                  return Card(
                    elevation: 1,
                    margin: EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: isSuperAdmin ? Colors.orange[100] : Colors.grey[200],
                        child: Text(
                          'A${index + 1}',
                          style: TextStyle(
                            color: isSuperAdmin ? Colors.orange : Colors.grey[700],
                          ),
                        ),
                      ),
                      title: Row(
                        children: [
                          Text('Admin member $index'),
                          if (isSuperAdmin)
                            Container(
                              margin: EdgeInsets.only(left: 8),
                              padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.orange,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                'SUPER',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                        ],
                      ),
                      subtitle: Text('admin$index@example.com'),
                      trailing: PopupMenuButton(
                        onSelected: (value) {
                          if (value == 'view') {
                            // Navigate to view member details
                          } else if (value == 'edit') {
                            // Navigate to edit member
                          } else if (value == 'permissions') {
                            // Manage permissions
                          } else if (value == 'deactivate') {
                            // Deactivate member
                          }
                        },
                        itemBuilder: (context) => [
                          PopupMenuItem(
                            value: 'view',
                            child: Text('View Details'),
                          ),
                          PopupMenuItem(
                            value: 'edit',
                            child: Text('Edit member'),
                          ),
                          PopupMenuItem(
                            value: 'permissions',
                            child: Text('Manage Permissions'),
                          ),
                          PopupMenuItem(
                            value: 'deactivate',
                            child: Text(isActive ? 'Deactivate' : 'Activate'),
                          ),
                        ],
                      ),
                      onTap: () {
                        // Navigate to admin member details
                      },
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
}