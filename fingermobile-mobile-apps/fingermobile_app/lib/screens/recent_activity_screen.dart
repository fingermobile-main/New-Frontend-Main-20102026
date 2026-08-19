import 'package:flutter/material.dart';

class ActivityEvent {
  final int id;
  final String type;
  final String description;
  final String? targetName;
  final String? targetImageUrl;
  final DateTime timestamp;
  final bool isRead;

  ActivityEvent({
    required this.id,
    required this.type,
    required this.description,
    this.targetName,
    this.targetImageUrl,
    required this.timestamp,
    this.isRead = false,
  });
}

class RecentActivityScreen extends StatefulWidget {
  @override
  _RecentActivityScreenState createState() => _RecentActivityScreenState();
}

class _RecentActivityScreenState extends State<RecentActivityScreen> {
  List<ActivityEvent> _activityEvents = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadActivity();
  }

  Future<void> _loadActivity() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _activityEvents = [
          ActivityEvent(
            id: 1,
            type: 'like',
            description: 'liked your post',
            targetName: 'Beautiful Sunset',
            targetImageUrl: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(minutes: 15)),
            isRead: false,
          ),
          ActivityEvent(
            id: 2,
            type: 'comment',
            description: 'commented on your post',
            targetName: 'Great tutorial!',
            targetImageUrl: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(hours: 1)),
            isRead: false,
          ),
          ActivityEvent(
            id: 3,
            type: 'follow',
            description: 'started following you',
            targetName: 'Alex Johnson',
            targetImageUrl: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(hours: 2)),
            isRead: true,
          ),
          ActivityEvent(
            id: 4,
            type: 'mention',
            description: 'mentioned you in a post',
            targetName: 'Team Announcement',
            targetImageUrl: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(hours: 5)),
            isRead: true,
          ),
          ActivityEvent(
            id: 5,
            type: 'share',
            description: 'shared your post',
            targetName: 'Innovation Ideas',
            targetImageUrl: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(days: 1)),
            isRead: true,
          ),
          ActivityEvent(
            id: 6,
            type: 'join_group',
            description: 'joined a group you manage',
            targetName: 'Flutter Developers',
            targetImageUrl: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(days: 1)),
            isRead: true,
          ),
          ActivityEvent(
            id: 7,
            type: 'event_invite',
            description: 'invited you to an event',
            targetName: 'Tech Conference 2023',
            targetImageUrl: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(days: 2)),
            isRead: true,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading activity: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading activity')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Recent Activity'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.markunread_mailbox),
            onPressed: () {
              // Mark all as read
              _markAllAsRead();
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _activityEvents.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.notifications_active,
                        size: 80,
                        color: Colors.grey[400],
                      ),
                      SizedBox(height: 16),
                      Text(
                        'No recent activity',
                        style: TextStyle(
                          fontSize: 20,
                          color: Colors.grey[600],
                        ),
                      ),
                      SizedBox(height: 8),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          'Your recent activity will appear here when there are updates',
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
                  onRefresh: _loadActivity,
                  child: ListView.builder(
                    itemCount: _activityEvents.length,
                    itemBuilder: (context, index) {
                      final event = _activityEvents[index];
                      return _buildActivityItem(event);
                    },
                  ),
                ),
    );
  }

  Widget _buildActivityItem(ActivityEvent event) {
    return Dismissible(
      key: Key(event.id.toString()),
      direction: DismissDirection.endToStart,
      onDismissed: (direction) {
        setState(() {
          _activityEvents.removeAt(_activityEvents.indexOf(event));
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
          backgroundImage: event.targetImageUrl != null
              ? NetworkImage(event.targetImageUrl!)
              : null,
          child: event.targetImageUrl == null
              ? _getActivityIcon(event.type)
              : null,
          backgroundColor: !event.isRead ? Colors.blue[100] : null,
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                '${event.description} ${event.targetName ?? ''}',
                style: TextStyle(
                  fontWeight: !event.isRead ? FontWeight.bold : FontWeight.normal,
                ),
              ),
            ),
            if (!event.isRead)
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
          _formatTime(event.timestamp),
          style: TextStyle(
            color: !event.isRead ? Colors.black87 : Colors.grey[600],
          ),
        ),
        onTap: () {
          _markAsRead(event.id);
          // Navigate based on activity type
          _handleActivityTap(event);
        },
        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      ),
    );
  }

  Widget _getActivityIcon(String type) {
    switch (type) {
      case 'like':
        return Icon(Icons.thumb_up, color: Colors.blue);
      case 'comment':
        return Icon(Icons.comment, color: Colors.green);
      case 'follow':
        return Icon(Icons.person_add, color: Colors.orange);
      case 'mention':
        return Icon(Icons.alternate_email, color: Colors.purple);
      case 'share':
        return Icon(Icons.share, color: Colors.red);
      case 'join_group':
        return Icon(Icons.group, color: Colors.teal);
      case 'event_invite':
        return Icon(Icons.event, color: Colors.amber);
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

  void _markAsRead(int eventId) {
    setState(() {
      final index = _activityEvents.indexWhere((a) => a.id == eventId);
      if (index != -1) {
        _activityEvents[index] = ActivityEvent(
          id: _activityEvents[index].id,
          type: _activityEvents[index].type,
          description: _activityEvents[index].description,
          targetName: _activityEvents[index].targetName,
          targetImageUrl: _activityEvents[index].targetImageUrl,
          timestamp: _activityEvents[index].timestamp,
          isRead: true,
        );
      }
    });
  }

  void _markAllAsRead() {
    setState(() {
      _activityEvents = _activityEvents.map((event) => ActivityEvent(
        id: event.id,
        type: event.type,
        description: event.description,
        targetName: event.targetName,
        targetImageUrl: event.targetImageUrl,
        timestamp: event.timestamp,
        isRead: true,
      )).toList();
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('All activities marked as read'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _handleActivityTap(ActivityEvent event) {
    // Handle navigation based on activity type
    switch (event.type) {
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
      case 'share':
        // Navigate to the shared post
        break;
      case 'join_group':
        // Navigate to the group
        break;
      case 'event_invite':
        // Navigate to the event
        break;
      default:
        // Default behavior
        break;
    }
  }
}