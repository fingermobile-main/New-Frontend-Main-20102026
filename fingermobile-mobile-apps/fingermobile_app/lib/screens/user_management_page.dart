import 'package:flutter/material.dart';

class memberManagementPage extends StatefulWidget {
  @override
  _memberManagementPageState createState() => _memberManagementPageState();
}

class _memberManagementPageState extends State<memberManagementPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('member Management'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () {},
          ),
          IconButton(
            icon: Icon(Icons.filter_list),
            onPressed: () {},
          ),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'member Management',
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
                  _buildFilterChip('All members', true),
                  SizedBox(width: 8),
                  _buildFilterChip('Active', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Inactive', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Verified', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Unverified', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Suspended', false),
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
                        hintText: 'Search members...',
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
                itemCount: 8,
                itemBuilder: (context, index) {
                  return Card(
                    elevation: 1,
                    margin: EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: Colors.grey[200],
                        child: Text('U$index'),
                      ),
                      title: Text('member $index'),
                      subtitle: Text('member$index@example.com'),
                      trailing: PopupMenuButton(
                        onSelected: (value) {
                          if (value == 'view') {
                            // Navigate to view member details
                          } else if (value == 'edit') {
                            // Navigate to edit member
                          } else if (value == 'suspend') {
                            // Suspend member
                          } else if (value == 'delete') {
                            // Delete member
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
                            value: 'suspend',
                            child: Text('Suspend member'),
                          ),
                          PopupMenuItem(
                            value: 'delete',
                            child: Text('Delete member'),
                          ),
                        ],
                      ),
                      onTap: () {
                        // Navigate to member details
                      },
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
          // Add new member
        },
        child: Icon(Icons.add),
        backgroundColor: Colors.deepPurple,
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