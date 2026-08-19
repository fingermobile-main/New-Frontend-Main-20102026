import 'package:flutter/material.dart';

class ActivityItem {
  final int id;
  final String type;
  final String description;
  final String? targetName;
  final String? targetImageUrl;
  final DateTime timestamp;
  final bool isRead;

  ActivityItem({
    required this.id,
    required this.type,
    required this.description,
    this.targetName,
    this.targetImageUrl,
    required this.timestamp,
    this.isRead = false,
  });
}

class ActivityScreen extends StatefulWidget {
  @override
  _ActivityScreenState createState() => _ActivityScreenState();
}

class _ActivityScreenState extends State<ActivityScreen> {
  List<ActivityItem> _activities = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadActivities();
  }

  Future<void> _loadActivities() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _activities = [
          ActivityItem(
            id: 1,
            type: 'like',
            description: 'liked your post',
            targetName: 'Beautiful Sunset',
            targetImageUrl: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(minutes: 15)),
            isRead: false,
          ),
          ActivityItem(
            id: 2,
            type: 'comment',
            description: 'commented on your post',
            targetName: 'Great tutorial!',
            targetImageUrl: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(hours: 1)),
            isRead: false,
          ),
          ActivityItem(
            id: 3,
            type: 'follow',
            description: 'started following you',
            targetName: 'Alex Johnson',
            targetImageUrl: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(hours: 2)),
            isRead: true,
          ),
          ActivityItem(
            id: 4,
            type: 'mention',
            description: 'mentioned you in a post',
            targetName: 'Team Announcement',
            targetImageUrl: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(hours: 5)),
            isRead: true,
          ),
          ActivityItem(
            id: 5,
            type: 'share',
            description: 'shared your post',
            targetName: 'Innovation Ideas',
            targetImageUrl: 'https://via.placeholder.com/150',
            timestamp: DateTime.now().subtract(Duration(days: 1)),
            isRead: true,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading activities: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading activities')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Activity'),
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
          : _activities.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.history,
                        size: 80,
                        color: Colors.grey[400],
                      ),
                      SizedBox(height: 16),
                      Text(
                        'No activity yet',
                        style: TextStyle(
                          fontSize: 20,
                          color: Colors.grey[600],
                        ),
                      ),
                      SizedBox(height: 8),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          'Your activity will appear here when people interact with your content',
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
                  onRefresh: _loadActivities,
                  child: ListView.builder(
                    itemCount: _activities.length,
                    itemBuilder: (context, index) {
                      final activity = _activities[index];
                      return _buildActivityItem(activity);
                    },
                  ),
                ),
    );
  }

  Widget _buildActivityItem(ActivityItem activity) {
    return Dismissible(
      key: Key(activity.id.toString()),
      direction: DismissDirection.endToStart,
      onDismissed: (direction) {
        setState(() {
          _activities.removeAt(_activities.indexOf(activity));
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
          backgroundImage: activity.targetImageUrl != null
              ? NetworkImage(activity.targetImageUrl!)
              : null,
          child: activity.targetImageUrl == null
              ? _getActivityIcon(activity.type)
              : null,
          backgroundColor: !activity.isRead ? Colors.blue[100] : null,
        ),
        title: Row(
          children: [
            Text(
              activity.description,
              style: TextStyle(
                fontWeight: !activity.isRead ? FontWeight.bold : FontWeight.normal,
              ),
            ),
            if (!activity.isRead)
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
          activity.targetName ?? 'Unknown',
          style: TextStyle(
            fontWeight: !activity.isRead ? FontWeight.w500 : FontWeight.normal,
            color: !activity.isRead ? Colors.black87 : Colors.grey[600],
          ),
        ),
        trailing: Text(
          _formatTime(activity.timestamp),
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
        onTap: () {
          _markAsRead(activity.id);
          // Navigate based on activity type
          _handleActivityTap(activity);
        },
        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      ),
    );
  }

  Icon _getActivityIcon(String type) {
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

  void _markAsRead(int activityId) {
    setState(() {
      final index = _activities.indexWhere((a) => a.id == activityId);
      if (index != -1) {
        _activities[index] = ActivityItem(
          id: _activities[index].id,
          type: _activities[index].type,
          description: _activities[index].description,
          targetName: _activities[index].targetName,
          targetImageUrl: _activities[index].targetImageUrl,
          timestamp: _activities[index].timestamp,
          isRead: true,
        );
      }
    });
  }

  void _markAllAsRead() {
    setState(() {
      _activities = _activities.map((activity) => ActivityItem(
        id: activity.id,
        type: activity.type,
        description: activity.description,
        targetName: activity.targetName,
        targetImageUrl: activity.targetImageUrl,
        timestamp: activity.timestamp,
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

  void _handleActivityTap(ActivityItem activity) {
    // Handle navigation based on activity type
    switch (activity.type) {
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
      default:
        // Default behavior
        break;
    }
  }
}