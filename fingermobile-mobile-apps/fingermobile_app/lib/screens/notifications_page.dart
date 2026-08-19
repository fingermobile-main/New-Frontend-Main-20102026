import 'package:flutter/material.dart';

class NotificationsPage extends StatefulWidget {
  @override
  _NotificationsPageState createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Notifications'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: () {
              // Navigate to notification settings
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
              'Notifications',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Container(
              height: 40,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _buildFilterChip('All', true),
                  SizedBox(width: 8),
                  _buildFilterChip('Unread', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Following', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Comments', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Mentions', false),
                ],
              ),
            ),
            SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: 6,
                itemBuilder: (context, index) {
                  bool isUnread = index < 3; // First 3 notifications are unread
                  return Card(
                    elevation: 1,
                    margin: EdgeInsets.only(bottom: 12),
                    color: isUnread ? Colors.blue[50] : Colors.white,
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: Colors.grey[200],
                        child: Icon(
                          index == 0 ? Icons.favorite : 
                          index == 1 ? Icons.chat : 
                          index == 2 ? Icons.person_add : 
                          index == 3 ? Icons.notifications :
                          index == 4 ? Icons.shopping_cart : Icons.info,
                          color: isUnread ? Colors.blue : Colors.grey,
                        ),
                      ),
                      title: Text(
                        index == 0 ? 'John liked your post' :
                        index == 1 ? 'Sarah commented on your post' :
                        index == 2 ? 'Mike started following you' :
                        index == 3 ? 'New announcement' :
                        index == 4 ? 'Order update' : 'System notification',
                        style: TextStyle(
                          fontWeight: isUnread ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                      subtitle: Text(
                        index == 0 ? '2 hours ago' :
                        index == 1 ? '4 hours ago' :
                        index == 2 ? '1 day ago' :
                        index == 3 ? '2 days ago' :
                        index == 4 ? '3 days ago' : '5 days ago',
                      ),
                      trailing: isUnread ? Container(
                        width: 10,
                        height: 10,
                        decoration: BoxDecoration(
                          color: Colors.blue,
                          shape: BoxShape.circle,
                        ),
                      ) : null,
                      onTap: () {
                        // Mark as read and navigate to notification content
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
      selectedColor: Colors.blue,
      checkmarkColor: Colors.white,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : Colors.black,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
          color: isSelected ? Colors.blue : Colors.grey,
        ),
      ),
    );
  }
}