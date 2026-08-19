import 'package:flutter/material.dart';

class AuditLogsPage extends StatefulWidget {
  @override
  _AuditLogsPageState createState() => _AuditLogsPageState();
}

class _AuditLogsPageState extends State<AuditLogsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Audit Logs'),
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
              'Audit Logs',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'System activity and member actions',
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
                  _buildFilterChip('member Actions', false),
                  SizedBox(width: 8),
                  _buildFilterChip('System', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Security', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Today', false),
                  SizedBox(width: 8),
                  _buildFilterChip('This Week', false),
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
                        hintText: 'Search logs...',
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
                  String action = index % 3 == 0 ? 'Login' : 
                                 index % 3 == 1 ? 'Content Update' : 'Permission Change';
                  String type = index % 3 == 0 ? 'security' : 
                               index % 3 == 1 ? 'content' : 'system';
                  Color iconColor = index % 3 == 0 ? Colors.red : 
                                    index % 3 == 1 ? Colors.blue : Colors.orange;
                  
                  return Card(
                    elevation: 1,
                    margin: EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      leading: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: iconColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          index % 3 == 0 ? Icons.login : 
                          index % 3 == 1 ? Icons.edit : Icons.settings,
                          color: iconColor,
                        ),
                      ),
                      title: Text('$action Action'),
                      subtitle: Text(
                        index % 3 == 0 
                          ? 'member$index logged in from IP 192.168.1.${index + 100}' 
                          : index % 3 == 1 
                            ? 'member$index updated content item #${index + 100}' 
                            : 'Admin changed permissions for role$index',
                        style: TextStyle(fontSize: 12),
                      ),
                      trailing: Text(
                        '${index + 1} hour${index > 0 ? 's' : ''} ago',
                        style: TextStyle(fontSize: 12),
                      ),
                      onTap: () {
                        // Show log details
                        _showLogDetails(index, action, type);
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
          // Export logs
        },
        child: Icon(Icons.download),
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

  void _showLogDetails(int index, String action, String type) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Log Details'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Action: $action', style: TextStyle(fontWeight: FontWeight.bold)),
              SizedBox(height: 8),
              Text('member: member$index'),
              Text('Timestamp: ${DateTime.now().subtract(Duration(hours: index))}'),
              Text('IP Address: 192.168.1.${index + 100}'),
              Text('Type: $type'),
              Text('Result: Success'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Close'),
            ),
          ],
        );
      },
    );
  }
}