import 'package:flutter/material.dart';

class NotificationsPage extends StatefulWidget {
  const NotificationsPage({Key? key}) : super(key: key);

  @override
  State<NotificationsPage> createState() => _NotificationsPageState();
}

class _NotificationsPageState extends State<NotificationsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Notifications'),
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              Navigator.pushNamed(context, '/settings');
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Sidebar with notification filters
            SizedBox(
              width: 250,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Notification Filters',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      _buildFilterItem('All', true),
                      _buildFilterItem('Unread', false),
                      _buildFilterItem('Following', false),
                      _buildFilterItem('Comments', false),
                      _buildFilterItem('Likes', false),
                      _buildFilterItem('Mentions', false),
                      _buildFilterItem('Messages', false),
                      _buildFilterItem('System', false),
                      
                      const SizedBox(height: 24),
                      
                      ElevatedButton(
                        onPressed: () {
                          // Mark all as read
                        },
                        child: const Text('Mark All as Read'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            
            // Main notifications content
            Expanded(
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'Recent Notifications',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              // Clear all notifications
                            },
                            child: const Text('Clear All'),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      
                      Expanded(
                        child: ListView.builder(
                          itemCount: 10,
                          itemBuilder: (context, index) {
                            bool isUnread = index < 3; // First 3 are unread
                            return _buildNotificationItem(
                              index,
                              isUnread,
                              index % 4 == 0 ? 'comment' : 
                              index % 4 == 1 ? 'like' : 
                              index % 4 == 2 ? 'follow' : 'mention',
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterItem(String title, bool isSelected) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: ListTile(
        title: Text(title),
        selected: isSelected,
        selectedColor: Theme.of(context).primaryColor,
        onTap: () {
          // Handle filter selection
        },
      ),
    );
  }

  Widget _buildNotificationItem(int index, bool isUnread, String type) {
    IconData icon;
    Color iconColor;
    
    switch (type) {
      case 'comment':
        icon = Icons.comment;
        iconColor = Colors.green;
        break;
      case 'like':
        icon = Icons.favorite;
        iconColor = Colors.red;
        break;
      case 'follow':
        icon = Icons.person_add;
        iconColor = Colors.blue;
        break;
      case 'mention':
        icon = Icons.alternate_email;
        iconColor = Colors.orange;
        break;
      default:
        icon = Icons.notifications;
        iconColor = Colors.grey;
    }
    
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      decoration: BoxDecoration(
        color: isUnread ? Theme.of(context).colorScheme.surface : Colors.transparent,
        border: Border(
          left: BorderSide(
            color: isUnread ? Theme.of(context).primaryColor : Colors.transparent,
            width: 3,
          ),
        ),
      ),
      child: ListTile(
        leading: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: Color.alphaBlend(iconColor.withOpacity(0.1), Colors.transparent),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Icon(icon, color: iconColor),
        ),
        title: RichText(
          text: TextSpan(
            style: TextStyle(
              color: Theme.of(context).colorScheme.onSurface,
              fontWeight: isUnread ? FontWeight.bold : FontWeight.normal,
            ),
            children: [
              const TextSpan(text: 'John Doe '),
              TextSpan(
                text: type == 'comment' 
                    ? 'commented on your post' 
                    : type == 'like' 
                        ? 'liked your post' 
                        : type == 'follow' 
                            ? 'started following you' 
                            : 'mentioned you in a post',
              ),
            ],
          ),
        ),
        subtitle: Text('2 hours ago'),
        trailing: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () {
            // Dismiss notification
          },
        ),
        onTap: () {
          // Mark as read
        },
      ),
    );
  }
}