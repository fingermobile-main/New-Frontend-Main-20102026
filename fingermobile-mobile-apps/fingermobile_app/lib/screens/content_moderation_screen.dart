import 'package:flutter/material.dart';

class ContentModerationScreen extends StatefulWidget {
  @override
  _ContentModerationScreenState createState() => _ContentModerationScreenState();
}

class _ContentModerationScreenState extends State<ContentModerationScreen> {
  List<ModerationItem> _moderationQueue = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadModerationQueue();
  }

  Future<void> _loadModerationQueue() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _moderationQueue = [
          ModerationItem(
            id: 1,
            memberId: 123,
            membername: 'member123',
            content: 'This post contains inappropriate content',
            mediaUrl: 'https://via.placeholder.com/400x300',
            reportedBy: 'moderator',
            reportedAt: DateTime.now().subtract(Duration(hours: 2)),
            status: 'pending',
            category: 'inappropriate_content',
          ),
          ModerationItem(
            id: 2,
            memberId: 456,
            membername: 'member456',
            content: 'Spam content that should be removed',
            mediaUrl: null,
            reportedBy: 'automated',
            reportedAt: DateTime.now().subtract(Duration(hours: 4)),
            status: 'pending',
            category: 'spam',
          ),
          ModerationItem(
            id: 3,
            memberId: 789,
            membername: 'member789',
            content: 'Harassment in the comments',
            mediaUrl: 'https://via.placeholder.com/400x300',
            reportedBy: 'other_member',
            reportedAt: DateTime.now().subtract(Duration(hours: 6)),
            status: 'pending',
            category: 'harassment',
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading moderation queue: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading moderation queue')),
      );
    }
  }

  void _moderateContent(ModerationItem item, String action) {
    // In a real app, this would update the moderation status via API
    setState(() {
      _moderationQueue.removeWhere((modItem) => modItem.id == item.id);
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Content $action for ${item.membername}'),
        backgroundColor: action == 'approved' ? Colors.green : Colors.red,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Content Moderation'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _moderationQueue.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.gavel,
                        size: 80,
                        color: Colors.grey[400],
                      ),
                      SizedBox(height: 16),
                      Text(
                        'No items to moderate',
                        style: TextStyle(
                          fontSize: 20,
                          color: Colors.grey[600],
                        ),
                      ),
                      SizedBox(height: 8),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          'All caught up! There are no items in the moderation queue',
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
                  onRefresh: _loadModerationQueue,
                  child: ListView.builder(
                    itemCount: _moderationQueue.length,
                    itemBuilder: (context, index) {
                      final item = _moderationQueue[index];
                      return _buildModerationItem(item);
                    },
                  ),
                ),
    );
  }

  Widget _buildModerationItem(ModerationItem item) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  child: Icon(Icons.person),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        item.membername,
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      Text(
                        'Reported ${_formatTime(item.reportedAt)}',
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getStatusColor(item.status),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    item.status.toUpperCase(),
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 12),
            if (item.mediaUrl != null)
              Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  image: DecorationImage(
                    image: NetworkImage(item.mediaUrl!),
                    fit: BoxFit.cover,
                  ),
                ),
              )
            else
              Container(
                width: double.infinity,
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  Icons.textsms,
                  size: 50,
                  color: Colors.grey[400],
                ),
              ),
            SizedBox(height: 12),
            Text(
              item.content,
              style: TextStyle(fontSize: 16),
            ),
            SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      _moderateContent(item, 'rejected');
                    },
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: Colors.red),
                    ),
                    child: Text(
                      'Reject',
                      style: TextStyle(color: Colors.red),
                    ),
                  ),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      _moderateContent(item, 'approved');
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                    ),
                    child: Text('Approve'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'pending':
        return Colors.orange;
      case 'approved':
        return Colors.green;
      case 'rejected':
        return Colors.red;
      default:
        return Colors.grey;
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
}

class ModerationItem {
  final int id;
  final int memberId;
  final String membername;
  final String content;
  final String? mediaUrl;
  final String reportedBy;
  final DateTime reportedAt;
  final String status;
  final String category;

  ModerationItem({
    required this.id,
    required this.memberId,
    required this.membername,
    required this.content,
    this.mediaUrl,
    required this.reportedBy,
    required this.reportedAt,
    required this.status,
    required this.category,
  });
}