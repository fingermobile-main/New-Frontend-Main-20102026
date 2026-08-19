import 'package:flutter/material.dart';
import 'package:fingermobile_app/services\notification_service.dart';

class NotificationComponent extends StatefulWidget {
  @override
  _NotificationComponentState createState() => _NotificationComponentState();
}

class _NotificationComponentState extends State<NotificationComponent> {
  late Future<List<NotificationModel>> _notificationsFuture;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    setState(() {
      _isLoading = true;
    });
    
    final notificationService = NotificationService();
    final notifications = await notificationService.getNotifications();
    
    setState(() {
      _notificationsFuture = Future.value(notifications);
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Notifications'),
        actions: [
          IconButton(
            icon: Icon(Icons.mark_email_read),
            onPressed: () async {
              final notificationService = NotificationService();
              await notificationService.markAllAsRead();
              _loadNotifications();
            },
          ),
          PopupMenuButton<String>(
            icon: Icon(Icons.filter_list),
            onSelected: (String result) {
              // Handle filter selection
            },
            itemBuilder: (BuildContext context) => [
              PopupMenuItem<String>(
                value: 'all',
                child: Text('All Notifications'),
              ),
              PopupMenuItem<String>(
                value: 'unread',
                child: Text('Unread Only'),
              ),
              PopupMenuItem<String>(
                value: 'mentions',
                child: Text('Mentions'),
              ),
              PopupMenuItem<String>(
                value: 'messages',
                child: Text('Messages'),
              ),
              PopupMenuItem<String>(
                value: 'system',
                child: Text('System'),
              ),
            ],
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : FutureBuilder<List<NotificationModel>>(
              future: _notificationsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                }
                
                if (snapshot.hasError) {
                  return Center(child: Text('Error loading notifications'));
                }
                
                if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.notifications_none,
                          size: 80,
                          color: Colors.grey[300],
                        ),
                        SizedBox(height: 16),
                        Text(
                          'No notifications',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey[600],
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'You\'re all caught up!',
                          style: TextStyle(
                            color: Colors.grey[500],
                          ),
                        ),
                      ],
                    ),
                  );
                }
                
                final notifications = snapshot.data!;
                return ListView.builder(
                  itemCount: notifications.length,
                  itemBuilder: (context, index) {
                    final notification = notifications[index];
                    return _buildNotificationItem(notification);
                  },
                );
              },
            ),
    );
  }

  Widget _buildNotificationItem(NotificationModel notification) {
    return Dismissible(
      key: Key(notification.id),
      direction: DismissDirection.endToStart,
      onDismissed: (direction) {
        // Remove notification from list
        setState(() {
          // In a real app, we would remove from the backend too
        });
      },
      background: Container(
        color: Colors.red,
        alignment: Alignment.centerRight,
        padding: EdgeInsets.only(right: 20),
        child: Icon(
          Icons.delete,
          color: Colors.white,
        ),
      ),
      child: Card(
        margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        child: ListTile(
          contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          leading: Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: notification.isRead 
                  ? Colors.grey[200] 
                  : Colors.blue[100],
              borderRadius: BorderRadius.circular(20),
            ),
            child: Icon(
              notification.icon,
              color: notification.isRead 
                  ? Colors.grey[600] 
                  : Colors.blue,
            ),
          ),
          title: Text(
            notification.title,
            style: TextStyle(
              fontWeight: notification.isRead 
                  ? FontWeight.normal 
                  : FontWeight.bold,
            ),
          ),
          subtitle: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(height: 4),
              Text(
                notification.message,
                style: TextStyle(
                  color: notification.isRead 
                      ? Colors.grey[600] 
                      : Colors.black87,
                ),
              ),
              SizedBox(height: 4),
              Text(
                notification.time,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[500],
                ),
              ),
            ],
          ),
          trailing: !notification.isRead 
              ? Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: Colors.red,
                    shape: BoxShape.circle,
                  ),
                )
              : null,
          onTap: () async {
            if (!notification.isRead) {
              final notificationService = NotificationService();
              await notificationService.markAsRead(notification.id);
              _loadNotifications();
            }
            // Handle notification tap
          },
        ),
      ),
    );
  }
}

// Define the notification model locally since it's used in this component
class NotificationModel {
  final String id;
  final String title;
  final String message;
  final String time;
  final IconData icon;
  final bool isRead;

  NotificationModel({
    required this.id,
    required this.title,
    required this.message,
    required this.time,
    required this.icon,
    required this.isRead,
  });
}