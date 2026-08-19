import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';

class HomeFeedTab extends StatefulWidget {
  @override
  _HomeFeedTabState createState() => _HomeFeedTabState();
}

class _HomeFeedTabState extends State<HomeFeedTab> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final appProvider = Provider.of<AppProvider>(context, listen: false);
      appProvider.loadFeed();
    });
  }

  @override
  Widget build(BuildContext context) {
    final appProvider = Provider.of<AppProvider>(context);
    
    return Scaffold(
      appBar: AppBar(
        title: Text('FingerMobile Feed'),
        actions: [
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () {
              Navigator.pushNamed(context, '/search');
            },
          ),
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: () {
              Navigator.pushNamed(context, '/settings');
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: () => appProvider.loadFeed(),
        child: appProvider.isLoading
            ? Center(child: CircularProgressIndicator())
            : appProvider.feedPosts.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.feed_outlined,
                          size: 80,
                          color: Colors.grey[400],
                        ),
                        SizedBox(height: 16),
                        Text(
                          'No posts yet',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey[600],
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Be the first to share something!',
                          style: TextStyle(
                            color: Colors.grey[500],
                          ),
                        ),
                        SizedBox(height: 24),
                        ElevatedButton(
                          onPressed: () {
                            Navigator.pushNamed(context, '/createPost');
                          },
                          child: Text('Create Post'),
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    itemCount: appProvider.feedPosts.length,
                    itemBuilder: (context, index) {
                      final post = appProvider.feedPosts[index];
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
                                    backgroundImage: post['author']['avatar'] != null
                                        ? NetworkImage(post['author']['avatar'])
                                        : null,
                                    child: post['author']['avatar'] == null
                                        ? Icon(Icons.person)
                                        : null,
                                  ),
                                  SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          post['author']['username'] ?? 'Unknown User',
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            fontSize: 16,
                                          ),
                                        ),
                                        Text(
                                          post['created_at'] ?? '',
                                          style: TextStyle(
                                            color: Colors.grey[600],
                                            fontSize: 12,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              SizedBox(height: 12),
                              Text(
                                post['content'] ?? '',
                                style: TextStyle(fontSize: 16),
                              ),
                              if (post['image_url'] != null) ...[
                                SizedBox(height: 12),
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(8),
                                  child: Image.network(
                                    post['image_url'],
                                    fit: BoxFit.cover,
                                    width: double.infinity,
                                    height: 200,
                                  ),
                                ),
                              ],
                              SizedBox(height: 12),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                children: [
                                  TextButton.icon(
                                    onPressed: () {
                                      appProvider.toggleLike(post['id']);
                                    },
                                    icon: Icon(
                                      post['liked'] == true
                                          ? Icons.thumb_up
                                          : Icons.thumb_up_outlined,
                                      color: post['liked'] == true
                                          ? Colors.blue
                                          : Colors.grey,
                                    ),
                                    label: Text(
                                      '${post['likes_count'] ?? 0}',
                                      style: TextStyle(
                                        color: post['liked'] == true
                                            ? Colors.blue
                                            : Colors.grey,
                                      ),
                                    ),
                                  ),
                                  TextButton.icon(
                                    onPressed: () {
                                      Navigator.pushNamed(
                                        context,
                                        '/post-comments',
                                        arguments: post['id'],
                                      );
                                    },
                                    icon: Icon(Icons.comment_outlined),
                                    label: Text('${post['comments_count'] ?? 0}'),
                                  ),
                                  TextButton.icon(
                                    onPressed: () {},
                                    icon: Icon(Icons.share_outlined),
                                    label: Text('Share'),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
      ),
    );
  }
}