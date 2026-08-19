import 'package:flutter/material.dart';
import '../models/post.dart';

class SavedPostsScreen extends StatefulWidget {
  @override
  _SavedPostsScreenState createState() => _SavedPostsScreenState();
}

class _SavedPostsScreenState extends State<SavedPostsScreen> {
  List<Post> _savedPosts = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadSavedPosts();
  }

  Future<void> _loadSavedPosts() async {
    try {
      // In a real implementation, this would be an API call to get saved posts
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _savedPosts = [
          Post(
            id: 1,
            memberId: 123,
            membername: 'technews',
            profileImageUrl: 'https://via.placeholder.com/150',
            content: 'New study reveals the impact of social media on productivity. Key findings suggest that strategic use of social platforms can enhance professional networking.',
            postType: 'text',
            privacyLevel: 'public',
            createdAt: DateTime.now().subtract(Duration(days: 3)),
            likesCount: 89,
            commentsCount: 34,
            sharesCount: 45,
          ),
          Post(
            id: 2,
            memberId: 456,
            membername: 'designinsights',
            profileImageUrl: 'https://via.placeholder.com/150',
            content: 'Check out these amazing UI design trends for 2023. Minimalism and bold typography continue to dominate the design landscape.',
            mediaUrls: ['https://via.placeholder.com/600x400'],
            postType: 'image',
            privacyLevel: 'public',
            createdAt: DateTime.now().subtract(Duration(days: 7)),
            likesCount: 210,
            commentsCount: 42,
            sharesCount: 28,
          ),
          Post(
            id: 3,
            memberId: 789,
            membername: 'flutterdev',
            profileImageUrl: 'https://via.placeholder.com/150',
            content: 'Just released a new package that simplifies state management in Flutter apps. Check out the documentation in the link below.',
            postType: 'text',
            privacyLevel: 'public',
            createdAt: DateTime.now().subtract(Duration(days: 12)),
            likesCount: 156,
            commentsCount: 21,
            sharesCount: 15,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading saved posts: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading saved posts')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Saved Posts'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _savedPosts.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.bookmark_added,
                        size: 80,
                        color: Colors.grey[400],
                      ),
                      SizedBox(height: 16),
                      Text(
                        'No saved posts yet',
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
                  onRefresh: _loadSavedPosts,
                  child: ListView.builder(
                    itemCount: _savedPosts.length,
                    itemBuilder: (context, index) {
                      final post = _savedPosts[index];
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
                    // Remove from saved
                    _unsavePost(post.id);
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

  void _unsavePost(int postId) {
    // In a real app, this would remove the save via API
    setState(() {
      _savedPosts.removeWhere((post) => post.id == postId);
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Removed from saved'),
        action: SnackBarAction(
          label: 'Undo',
          onPressed: () {
            // In a real app, this would re-add the save
            _loadSavedPosts();
          },
        ),
      ),
    );
  }
}