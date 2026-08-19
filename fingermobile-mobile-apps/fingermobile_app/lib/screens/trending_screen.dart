import 'package:flutter/material.dart';
import '../models/post.dart';

class TrendingScreen extends StatefulWidget {
  @override
  _TrendingScreenState createState() => _TrendingScreenState();
}

class _TrendingScreenState extends State<TrendingScreen> {
  List<Post> _trendingPosts = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadTrendingPosts();
  }

  Future<void> _loadTrendingPosts() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _trendingPosts = [
          Post(
            id: 1,
            memberId: 123,
            membername: 'technews',
            profileImageUrl: 'https://via.placeholder.com/150',
            content: 'Latest trends in mobile development for 2023',
            mediaUrls: ['https://via.placeholder.com/600x400'],
            postType: 'image',
            privacyLevel: 'public',
            createdAt: DateTime.now().subtract(Duration(hours: 2)),
            likesCount: 245,
            commentsCount: 42,
            sharesCount: 67,
          ),
          Post(
            id: 2,
            memberId: 456,
            membername: 'designerpro',
            profileImageUrl: 'https://via.placeholder.com/150',
            content: 'Beautiful UI design inspiration for social media apps',
            mediaUrls: ['https://via.placeholder.com/600x400'],
            postType: 'image',
            privacyLevel: 'public',
            createdAt: DateTime.now().subtract(Duration(hours: 4)),
            likesCount: 189,
            commentsCount: 31,
            sharesCount: 45,
          ),
          Post(
            id: 3,
            memberId: 789,
            membername: 'flutterdev',
            profileImageUrl: 'https://via.placeholder.com/150',
            content: 'New Flutter features that will change how we build apps',
            postType: 'text',
            privacyLevel: 'public',
            createdAt: DateTime.now().subtract(Duration(hours: 6)),
            likesCount: 312,
            commentsCount: 56,
            sharesCount: 89,
          ),
          Post(
            id: 4,
            memberId: 101,
            membername: 'startuplife',
            profileImageUrl: 'https://via.placeholder.com/150',
            content: 'How we scaled our startup to 1M members in 6 months',
            mediaUrls: ['https://via.placeholder.com/600x400'],
            postType: 'image',
            privacyLevel: 'public',
            createdAt: DateTime.now().subtract(Duration(hours: 8)),
            likesCount: 421,
            commentsCount: 78,
            sharesCount: 123,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading trending posts: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading trending posts')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Trending'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _trendingPosts.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.trending_up,
                        size: 80,
                        color: Colors.grey[400],
                      ),
                      SizedBox(height: 16),
                      Text(
                        'No trending content',
                        style: TextStyle(
                          fontSize: 20,
                          color: Colors.grey[600],
                        ),
                      ),
                      SizedBox(height: 8),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          'There is no content trending right now. Check back later!',
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
                  onRefresh: _loadTrendingPosts,
                  child: ListView.builder(
                    itemCount: _trendingPosts.length,
                    itemBuilder: (context, index) {
                      final post = _trendingPosts[index];
                      return _buildTrendingPost(post);
                    },
                  ),
                ),
    );
  }

  Widget _buildTrendingPost(Post post) {
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
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.orange[100],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    'TRENDING',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: Colors.orange[800],
                    ),
                  ),
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
}