import 'package:flutter/material.dart';
import '../services/api_service.dart';

class NotificationItem {
  final int id;
  final int memberId;
  final String membername;
  final String? profileImageUrl;
  final String type;
  final String message;
  final DateTime createdAt;
  final bool isRead;

  NotificationItem({
    required this.id,
    required this.memberId,
    required this.membername,
    this.profileImageUrl,
    required this.type,
    required this.message,
    required this.createdAt,
    this.isRead = false,
  });

  factory NotificationItem.fromJson(Map<String, dynamic> json) {
    return NotificationItem(
      id: json['id'] ?? 0,
      memberId: json['member_id'] ?? json['memberId'] ?? 0,
      membername: json['membername'] ?? '',
      profileImageUrl: json['profile_image_url'] ?? json['profileImageUrl'],
      type: json['type'] ?? '',
      message: json['message'] ?? '',
      createdAt: DateTime.tryParse(json['created_at'] ?? json['createdAt'] ?? '') ?? DateTime.now(),
      isRead: json['is_read'] ?? json['isRead'] ?? false,
    );
  }
}

class NotificationsScreen extends StatefulWidget {
  @override
  _NotificationsScreenState createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  List<NotificationItem> _notifications = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    try {
      final result = await ApiService.get('/notifications');
      if (result != null && result['notifications'] != null) {
        setState(() {
          _notifications = (result['notifications'] as List)
              .map((item) => NotificationItem.fromJson(item))
              .toList();
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error loading notifications: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading notifications')),
      );
    }
  }

  Future<void> _markAsRead(int notificationId) async {
    try {
      await ApiService.put('/notifications/$notificationId/read', {});
      
      // Update the notification locally
      setState(() {
        final index = _notifications.indexWhere((n) => n.id == notificationId);
        if (index != -1) {
          _notifications[index] = NotificationItem(
            id: _notifications[index].id,
            memberId: _notifications[index].memberId,
            membername: _notifications[index].membername,
            profileImageUrl: _notifications[index].profileImageUrl,
            type: _notifications[index].type,
            message: _notifications[index].message,
            createdAt: _notifications[index].createdAt,
            isRead: true,
          );
        }
      });
    } catch (e) {
      print('Error marking notification as read: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Notifications'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.markunread_mailbox),
            onPressed: () async {
              // Mark all as read
              try {
                await ApiService.put('/notifications/mark-all-read', {});
                
                // Update all notifications locally
                setState(() {
                  _notifications = _notifications.map((n) => NotificationItem(
                    id: n.id,
                    memberId: n.memberId,
                    membername: n.membername,
                    profileImageUrl: n.profileImageUrl,
                    type: n.type,
                    message: n.message,
                    createdAt: n.createdAt,
                    isRead: true,
                  )).toList();
                });
                
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('All notifications marked as read')),
                );
              } catch (e) {
                print('Error marking all as read: $e');
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Error marking all as read')),
                );
              }
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _notifications.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.notifications_none,
                        size: 80,
                        color: Colors.grey[400],
                      ),
                      SizedBox(height: 16),
                      Text(
                        'No notifications',
                        style: TextStyle(
                          fontSize: 20,
                          color: Colors.grey[600],
                        ),
                      ),
                      SizedBox(height: 8),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          'When you receive notifications, they\'ll appear here',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: Colors.grey[500],
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadNotifications,
                  child: ListView.builder(
                    itemCount: _notifications.length,
                    itemBuilder: (context, index) {
                      final notification = _notifications[index];
                      return _buildNotificationItem(notification);
                    },
                  ),
                ),
    );
  }

  Widget _buildNotificationItem(NotificationItem notification) {
    return Dismissible(
      key: Key(notification.id.toString()),
      direction: DismissDirection.endToStart,
      onDismissed: (direction) {
        setState(() {
          _notifications.removeAt(_notifications.indexOf(notification));
        });
      },
      background: Container(
        color: Colors.red,
        alignment: Alignment.centerRight,
        padding: EdgeInsets.only(right: 16),
        child: Icon(
          Icons.delete,
          color: Colors.white,
        ),
      ),
      child: ListTile(
        leading: CircleAvatar(
          backgroundImage: notification.profileImageUrl != null
              ? NetworkImage(notification.profileImageUrl!)
              : null,
          child: notification.profileImageUrl == null
              ? Icon(Icons.person)
              : null,
          backgroundColor: !notification.isRead ? Colors.blue[100] : null,
        ),
        title: Row(
          children: [
            Text(
              notification.membername,
              style: TextStyle(
                fontWeight: !notification.isRead ? FontWeight.bold : FontWeight.normal,
              ),
            ),
            SizedBox(width: 4),
            if (!notification.isRead)
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  color: Colors.blue,
                  shape: BoxShape.circle,
                ),
              ),
          ],
        ),
        subtitle: Text(
          notification.message,
          style: TextStyle(
            fontWeight: !notification.isRead ? FontWeight.w500 : FontWeight.normal,
            color: !notification.isRead ? Colors.black87 : Colors.grey[600],
          ),
        ),
        trailing: Text(
          _formatTime(notification.createdAt),
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
        onTap: () {
          _markAsRead(notification.id);
          // Navigate based on notification type
          _handleNotificationTap(notification);
        },
        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      ),
    );
  }

  String _formatTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }

  void _handleNotificationTap(NotificationItem notification) {
    // Handle navigation based on notification type
    switch (notification.type) {
      case 'like':
        // Navigate to the post that was liked
        break;
      case 'comment':
        // Navigate to the post with the comment
        break;
      case 'follow':
        // Navigate to the member's profile
        break;
      case 'mention':
        // Navigate to the post where mentioned
        break;
      default:
        // Default behavior
        break;
    }
  }
}