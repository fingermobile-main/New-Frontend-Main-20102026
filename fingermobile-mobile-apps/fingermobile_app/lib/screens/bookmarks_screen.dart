import 'package:flutter/material.dart';
import '../models/post.dart';

class BookmarksScreen extends StatefulWidget {
  @override
  _BookmarksScreenState createState() => _BookmarksScreenState();
}

class _BookmarksScreenState extends State<BookmarksScreen> {
  List<Post> _bookmarkedPosts = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadBookmarks();
  }

  Future<void> _loadBookmarks() async {
    try {
      // In a real implementation, this would be an API call to get bookmarked posts
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _bookmarkedPosts = [
          Post(
            id: 1,
            memberId: 123,
            membername: 'johndoe',
            profileImageUrl: 'https://via.placeholder.com/150',
            content: 'Just finished an amazing Flutter tutorial! The new features in the latest version are incredible.',
            mediaUrls: ['https://via.placeholder.com/600x400'],
            postType: 'text',
            privacyLevel: 'public',
            createdAt: DateTime.now().subtract(Duration(days: 2)),
            likesCount: 24,
            commentsCount: 5,
            sharesCount: 3,
          ),
          Post(
            id: 2,
            memberId: 456,
            membername: 'janedesigner',
            profileImageUrl: 'https://via.placeholder.com/150',
            content: 'Beautiful sunset from my trip to the mountains. Nature never fails to amaze me.',
            mediaUrls: ['https://via.placeholder.com/600x400'],
            postType: 'image',
            privacyLevel: 'public',
            createdAt: DateTime.now().subtract(Duration(days: 5)),
            likesCount: 142,
            commentsCount: 28,
            sharesCount: 12,
          ),
          Post(
            id: 3,
            memberId: 789,
            membername: 'technews',
            profileImageUrl: 'https://via.placeholder.com/150',
            content: 'Breaking: New study reveals the impact of social media on productivity. Key findings suggest that strategic use of social platforms can enhance professional networking.',
            postType: 'text',
            privacyLevel: 'public',
            createdAt: DateTime.now().subtract(Duration(days: 7)),
            likesCount: 89,
            commentsCount: 34,
            sharesCount: 45,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading bookmarks: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading bookmarks')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Bookmarks'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _bookmarkedPosts.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.bookmark_border,
                        size: 80,
                        color: Colors.grey[400],
                      ),
                      SizedBox(height: 16),
                      Text(
                        'No bookmarks yet',
                        style: TextStyle(
                          fontSize: 20,
                          color: Colors.grey[600],
                        ),
                      ),
                      SizedBox(height: 8),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          'Save posts by tapping the bookmark icon to find them here later',
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
                  onRefresh: _loadBookmarks,
                  child: ListView.builder(
                    itemCount: _bookmarkedPosts.length,
                    itemBuilder: (context, index) {
                      final post = _bookmarkedPosts[index];
                      return _buildPostCard(post);
                    },
                  ),
                ),
    );
  }

  Widget _buildPostCard(Post post) {
    return Card(
      margin: EdgeInsets.all(12.0),
      child: Padding(
        padding: EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundImage: post.profileImageUrl != null
                      ? NetworkImage(post.profileImageUrl!)
                      : null,
                  child: post.profileImageUrl == null
                      ? Icon(Icons.person)
                      : null,
                ),
                SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        post.membername,
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      Text(
                        _formatDate(post.createdAt),
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: Icon(
                    Icons.bookmark,
                    color: Colors.blue,
                  ),
                  onPressed: () {
                    // Remove bookmark
                    _unbookmarkPost(post.id);
                  },
                ),
              ],
            ),
            SizedBox(height: 10),
            Text(
              post.content,
              style: TextStyle(fontSize: 16),
            ),
            if (post.mediaUrls != null && post.mediaUrls!.isNotEmpty)
              Container(
                height: 200,
                margin: EdgeInsets.symmetric(vertical: 10),
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: post.mediaUrls!.length,
                  itemBuilder: (context, index) {
                    return Container(
                      width: 200,
                      margin: EdgeInsets.only(right: 10),
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(8),
                        image: DecorationImage(
                          image: NetworkImage(post.mediaUrls![index]),
                          fit: BoxFit.cover,
                        ),
                      ),
                    );
                  },
                ),
              ),
            SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                TextButton.icon(
                  onPressed: () {},
                  icon: Icon(
                    Icons.thumb_up_alt_outlined,
                    color: Colors.grey,
                  ),
                  label: Text(
                    '${post.likesCount}',
                    style: TextStyle(color: Colors.grey),
                  ),
                ),
                TextButton.icon(
                  onPressed: () {},
                  icon: Icon(
                    Icons.comment_outlined,
                    color: Colors.grey,
                  ),
                  label: Text(
                    '${post.commentsCount}',
                    style: TextStyle(color: Colors.grey),
                  ),
                ),
                TextButton.icon(
                  onPressed: () {},
                  icon: Icon(
                    Icons.share_outlined,
                    color: Colors.grey,
                  ),
                  label: Text(
                    '${post.sharesCount}',
                    style: TextStyle(color: Colors.grey),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
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
  }

  void _unbookmarkPost(int postId) {
    // In a real app, this would remove the bookmark via API
    setState(() {
      _bookmarkedPosts.removeWhere((post) => post.id == postId);
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Removed from bookmarks'),
        action: SnackBarAction(
          label: 'Undo',
          onPressed: () {
            // In a real app, this would re-add the bookmark
            _loadBookmarks();
          },
        ),
      ),
    );
  }
}