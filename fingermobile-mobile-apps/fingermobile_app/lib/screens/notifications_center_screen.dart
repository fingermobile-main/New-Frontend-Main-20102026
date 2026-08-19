import 'package:flutter/material.dart';
import '../services/api_service.dart';

class NotificationItem {
  final int id;
  final String type;
  final String title;
  final String message;
  final String? senderName;
  final String? senderAvatar;
  final DateTime timestamp;
  final bool isRead;
  final String? actionUrl;

  NotificationItem({
    required this.id,
    required this.type,
    required this.title,
    required this.message,
    this.senderName,
    this.senderAvatar,
    required this.timestamp,
    required this.isRead,
    this.actionUrl,
  });
}

class NotificationsCenterScreen extends StatefulWidget {
  @override
  _NotificationsCenterScreenState createState() => _NotificationsCenterScreenState();
}

class _NotificationsCenterScreenState extends State<NotificationsCenterScreen> {
  List<NotificationItem> _notifications = [];
  bool _isLoading = true;
  int _selectedFilter = 0; // 0: All, 1: Unread, 2: Mentions, 3: Activity

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _notifications = [
          NotificationItem(
            id: 1,
            type: 'like',
            title: 'New Like',
            message: 'Someone liked your post',
            senderName: 'John Doe',
            senderAvatar: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(minutes: 5)),
            isRead: false,
            actionUrl: '/post/123',
          ),
          NotificationItem(
            id: 2,
            type: 'comment',
            title: 'New Comment',
            message: 'Commented on your post',
            senderName: 'Jane Smith',
            senderAvatar: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(minutes: 15)),
            isRead: false,
            actionUrl: '/post/124',
          ),
          NotificationItem(
            id: 3,
            type: 'mention',
            title: 'Mention',
            message: 'Mentioned you in a post',
            senderName: 'Bob Johnson',
            senderAvatar: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(hours: 1)),
            isRead: true,
            actionUrl: '/post/125',
          ),
          NotificationItem(
            id: 4,
            type: 'follow',
            title: 'New Follower',
            message: 'Started following you',
            senderName: 'Alice Williams',
            senderAvatar: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(hours: 2)),
            isRead: true,
            actionUrl: '/member/456',
          ),
          NotificationItem(
            id: 5,
            type: 'message',
            title: 'New Message',
            message: 'Sent you a message',
            senderName: 'Charlie Brown',
            senderAvatar: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(hours: 3)),
            isRead: false,
            actionUrl: '/messages/789',
          ),
          NotificationItem(
            id: 6,
            type: 'event',
            title: 'Event Invitation',
            message: 'Invited you to an event',
            senderName: 'Event Organizer',
            senderAvatar: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(hours: 5)),
            isRead: true,
            actionUrl: '/event/101',
          ),
        ];
        _isLoading = false;
      });
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

  List<NotificationItem> get filteredNotifications {
    switch (_selectedFilter) {
      case 1: // Unread
        return _notifications.where((n) => !n.isRead).toList();
      case 2: // Mentions
        return _notifications.where((n) => n.type == 'mention').toList();
      case 3: // Activity
        return _notifications.where((n) => ['like', 'comment', 'follow'].contains(n.type)).toList();
      default: // All
        return _notifications;
    }
  }

  void _markAsRead(int notificationId) {
    setState(() {
      final index = _notifications.indexWhere((n) => n.id == notificationId);
      if (index != -1) {
        _notifications[index] = NotificationItem(
          id: _notifications[index].id,
          type: _notifications[index].type,
          title: _notifications[index].title,
          message: _notifications[index].message,
          senderName: _notifications[index].senderName,
          senderAvatar: _notifications[index].senderAvatar,
          timestamp: _notifications[index].timestamp,
          isRead: true,
          actionUrl: _notifications[index].actionUrl,
        );
      }
    });
  }

  void _markAllAsRead() async {
    try {
      await ApiService.put('/notifications/mark-all-read', {});
      
      setState(() {
        _notifications = _notifications.map((n) => NotificationItem(
          id: n.id,
          type: n.type,
          title: n.title,
          message: n.message,
          senderName: n.senderName,
          senderAvatar: n.senderAvatar,
          timestamp: n.timestamp,
          isRead: true,
          actionUrl: n.actionUrl,
        )).toList();
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('All notifications marked as read'),
          backgroundColor: Colors.green,
        ),
      );
    } catch (e) {
      print('Error marking all as read: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error marking all as read'),
          backgroundColor: Colors.red,
        ),
      );
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
          PopupMenuButton<String>(
            onSelected: (String result) {
              if (result == 'mark_all_read') {
                _markAllAsRead();
              }
            },
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              PopupMenuItem<String>(
                value: 'mark_all_read',
                child: Text('Mark all as read'),
              ),
            ],
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Filter tabs
                Container(
                  height: 50,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: [
                      _buildFilterTab('All', 0),
                      _buildFilterTab('Unread', 1),
                      _buildFilterTab('Mentions', 2),
                      _buildFilterTab('Activity', 3),
                    ],
                  ),
                ),
                
                // Notifications list
                Expanded(
                  child: filteredNotifications.isEmpty
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
                            itemCount: filteredNotifications.length,
                            itemBuilder: (context, index) {
                              final notification = filteredNotifications[index];
                              return _buildNotificationItem(notification);
                            },
                          ),
                        ),
                ),
              ],
            ),
    );
  }

  Widget _buildFilterTab(String title, int index) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 8),
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedFilter = index;
          });
        },
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: _selectedFilter == index ? Colors.blue : Colors.grey[200],
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            title,
            style: TextStyle(
              color: _selectedFilter == index ? Colors.white : Colors.grey[700],
            ),
          ),
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
          _notifications.removeWhere((n) => n.id == notification.id);
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
          backgroundImage: notification.senderAvatar != null
              ? NetworkImage(notification.senderAvatar!)
              : null,
          child: notification.senderAvatar == null
              ? _getNotificationIcon(notification.type)
              : null,
          backgroundColor: !notification.isRead ? Colors.blue[100] : null,
        ),
        title: Row(
          children: [
            Text(
              notification.title,
              style: TextStyle(
                fontWeight: !notification.isRead ? FontWeight.bold : FontWeight.normal,
              ),
            ),
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
          '${notification.senderName ?? 'Someone'} ${notification.message}',
          style: TextStyle(
            fontWeight: !notification.isRead ? FontWeight.w500 : FontWeight.normal,
            color: !notification.isRead ? Colors.black87 : Colors.grey[600],
          ),
        ),
        trailing: Text(
          _formatTime(notification.timestamp),
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

  Icon _getNotificationIcon(String type) {
    switch (type) {
      case 'like':
        return Icon(Icons.thumb_up, color: Colors.blue);
      case 'comment':
        return Icon(Icons.comment, color: Colors.green);
      case 'mention':
        return Icon(Icons.alternate_email, color: Colors.purple);
      case 'follow':
        return Icon(Icons.person_add, color: Colors.orange);
      case 'message':
        return Icon(Icons.message, color: Colors.teal);
      case 'event':
        return Icon(Icons.event, color: Colors.indigo);
      default:
        return Icon(Icons.notifications, color: Colors.grey);
    }
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
      case 'mention':
        // Navigate to the post where mentioned
        break;
      case 'follow':
        // Navigate to the member's profile
        break;
      case 'message':
        // Navigate to the message
        break;
      case 'event':
        // Navigate to the event
        break;
      default:
        // Default behavior
        break;
    }
  }
}