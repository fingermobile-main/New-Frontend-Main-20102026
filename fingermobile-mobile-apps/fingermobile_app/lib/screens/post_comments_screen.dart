import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../services/api_service.dart';

class PostCommentsScreen extends StatefulWidget {
  @override
  _PostCommentsScreenState createState() => _PostCommentsScreenState();
}

class _PostCommentsScreenState extends State<PostCommentsScreen> {
  final _commentController = TextEditingController();
  List<dynamic> _comments = [];
  bool _isLoading = true;
  int _postId = 0;
  dynamic _post;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Get the post ID from route arguments
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args != null && args is int) {
      _postId = args;
      _loadPostAndComments();
    }
  }

  Future<void> _loadPostAndComments() async {
    try {
      // Load the post details
      // In a real app, we would fetch the specific post by ID
      // For now, we'll just load comments
      
      final commentsData = await ApiService.getPostComments(_postId);
      if (commentsData != null) {
        setState(() {
          _comments = commentsData;
          _isLoading = false;
        });
      } else {
        setState(() {
          _isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load comments')),
        );
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      print('Error loading comments: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading comments')),
      );
    }
  }

  Future<void> _addComment() async {
    if (_commentController.text.trim().isEmpty) {
      return;
    }

    final commentContent = _commentController.text.trim();
    _commentController.clear();

    try {
      final result = await ApiService.commentOnPost(_postId, commentContent);
      if (result != null) {
        setState(() {
          _comments.insert(0, result);
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to add comment')),
        );
      }
    } catch (e) {
      print('Error adding comment: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error adding comment')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Comments'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          // Comments list
          Expanded(
            child: _isLoading
                ? Center(child: CircularProgressIndicator())
                : _comments.isEmpty
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.chat_bubble_outline,
                              size: 80,
                              color: Colors.grey[400],
                            ),
                            SizedBox(height: 16),
                            Text(
                              'No comments yet',
                              style: TextStyle(fontSize: 18, color: Colors.grey[600]),
                            ),
                            SizedBox(height: 8),
                            Text(
                              'Be the first to comment!',
                              style: TextStyle(color: Colors.grey[500]),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        itemCount: _comments.length,
                        itemBuilder: (context, index) {
                          final comment = _comments[index];
                          final author = comment['author'] ?? {};

                          return Container(
                            padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                CircleAvatar(
                                  backgroundImage: author['avatarUrl'] != null
                                      ? CachedNetworkImageProvider(author['avatarUrl'])
                                      : null,
                                  child: author['avatarUrl'] == null
                                      ? Icon(Icons.person)
                                      : null,
                                  radius: 20,
                                ),
                                SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          Text(
                                            author['username'] ?? 'Unknown User',
                                            style: TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 16,
                                            ),
                                          ),
                                          SizedBox(width: 8),
                                          Text(
                                            comment['createdAt'] != null
                                                ? _formatDate(comment['createdAt'])
                                                : 'Just now',
                                            style: TextStyle(
                                              color: Colors.grey[600],
                                              fontSize: 12,
                                            ),
                                          ),
                                        ],
                                      ),
                                      SizedBox(height: 4),
                                      Text(
                                        comment['content'] ?? '',
                                        style: TextStyle(fontSize: 15),
                                      ),
                                      SizedBox(height: 8),
                                      Row(
                                        children: [
                                          TextButton.icon(
                                            onPressed: () {},
                                            icon: Icon(
                                              Icons.thumb_up_alt_outlined,
                                              size: 16,
                                            ),
                                            label: Text(
                                              'Like (${comment['likesCount'] ?? 0})',
                                              style: TextStyle(fontSize: 12),
                                            ),
                                          ),
                                          SizedBox(width: 8),
                                          TextButton.icon(
                                            onPressed: () {},
                                            icon: Icon(
                                              Icons.reply_outlined,
                                              size: 16,
                                            ),
                                            label: Text(
                                              'Reply',
                                              style: TextStyle(fontSize: 12),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
          ),

          // Add comment input
          Container(
            padding: EdgeInsets.all(8),
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(color: Colors.grey[300]!),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _commentController,
                    decoration: InputDecoration(
                      hintText: 'Write a comment...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      filled: true,
                      fillColor: Colors.grey[100],
                    ),
                    onSubmitted: (value) => _addComment(),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.send, color: Colors.blue),
                  onPressed: _addComment,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(String dateString) {
    try {
      final date = DateTime.parse(dateString);
      final now = DateTime.now();
      final difference = now.difference(date);

      if (difference.inDays > 0) {
        return '${difference.inDays}d ago';
      } else if (difference.inHours > 0) {
        return '${difference.inHours}h ago';
      } else if (difference.inMinutes > 0) {
        return '${difference.inMinutes}m ago';
      } else {
        return 'Just now';
      }
    } catch (e) {
      return 'Just now';
    }
  }
}