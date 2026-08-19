import 'package:flutter/material.dart';
import '../services/api_service.dart';

class TrendsFeedPage extends StatefulWidget {
  const TrendsFeedPage({super.key});

  @override
  State<TrendsFeedPage> createState() => _TrendsFeedPageState();
}

class _TrendsFeedPageState extends State<TrendsFeedPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<Trend> _trends = [];
  List<Post> _posts = [];
  TrendCategory _selectedCategory = TrendCategory.all;
  final ScrollController _scrollController = ScrollController();
  int _currentPage = 1;
  bool _hasMoreData = true;
  late final ApiService _ApiService;

  @override
  void initState() {
    super.initState();
    _ApiService = ApiService();
    _loadTrendsFeed();
    _scrollController.addListener(_scrollListener);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_scrollListener);
    _scrollController.dispose();
    _ApiService.dispose();
    super.dispose();
  }

  void _scrollListener() {
    if (_scrollController.position.pixels ==
        _scrollController.position.maxScrollExtent) {
      _loadMoreData();
    }
  }

  Future<void> _loadTrendsFeed() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await _ApiService.getRecentPosts();

      if (response.isSuccess) {
        final data = response.data;
        List<dynamic> postsJson = [];

        if (data is Map<String, dynamic>) {
          if (data['posts'] is List) {
            postsJson = data['posts'] as List<dynamic>;
          } else if (data['data'] is List) {
            postsJson = data['data'] as List<dynamic>;
          }
        } else if (data is List) {
          postsJson = data;
        }

        final posts = postsJson
            .whereType<Map<String, dynamic>>()
            .map(_mapApiPostToPost)
            .toList();

        if (mounted) {
          setState(() {
            _trends = [
              Trend(
                id: 1,
                title: 'Flutter Development',
                postCount: 12500,
                isTrending: true,
                category: 'Technology',
                growthRate: 15.5,
              ),
              Trend(
                id: 2,
                title: 'AI Innovations',
                postCount: 9800,
                isTrending: true,
                category: 'Technology',
                growthRate: 22.3,
              ),
              Trend(
                id: 3,
                title: 'Sustainable Living',
                postCount: 7600,
                isTrending: true,
                category: 'Lifestyle',
                growthRate: 18.7,
              ),
              Trend(
                id: 4,
                title: 'Remote Work Tips',
                postCount: 6400,
                isTrending: true,
                category: 'Business',
                growthRate: 12.1,
              ),
              Trend(
                id: 5,
                title: 'Plant-Based Recipes',
                postCount: 5200,
                isTrending: true,
                category: 'Food',
                growthRate: 9.8,
              ),
            ];
            _posts = posts;
            _currentPage = 1;
            _hasMoreData = false;
          });
        }
      } else {
        if (mounted) {
          setState(() {
            _errorMessage =
                response.errorMessage ?? 'Failed to load trends feed. Please try again.';
          });
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Failed to load trends feed. Please try again.';
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _loadMoreData() async {
    if (!_hasMoreData || _isLoading) return;
  }

  void _refreshFeed() async {
    setState(() {
      _currentPage = 1;
      _hasMoreData = true;
    });
    await _loadTrendsFeed();
  }

  void _likePost(Post post) {
    setState(() {
      int index = _posts.indexWhere((p) => p.id == post.id);
      if (index != -1) {
        _posts[index] = Post(
          id: post.id,
          membername: post.membername,
          memberAvatar: post.memberAvatar,
          content: post.content,
          timestamp: post.timestamp,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          comments: post.comments,
          shares: post.shares,
          mediaUrl: post.mediaUrl,
          mediaType: post.mediaType,
          isLiked: !post.isLiked,
          tags: post.tags,
        );
      }
    });
  }

  void _sharePost(Post post) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Shared post by ${post.membername}'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _commentOnPost(Post post) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Commenting on post by ${post.membername}'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _viewPostDetails(Post post) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildPostDetailsSheet(post),
    );
  }

  Widget _buildPostDetailsSheet(Post post) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    backgroundImage: NetworkImage(post.memberAvatar),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        post.membername,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        _formatTimestamp(post.timestamp),
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(post.content),
          const SizedBox(height: 16),
          if (post.mediaUrl != null)
            Container(
              height: 200,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(post.mediaUrl!),
                  fit: BoxFit.cover,
                ),
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8.0,
            children: post.tags
                .map(
                  (tag) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.blue.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      '#$tag',
                      style: const TextStyle(
                        color: Colors.blue,
                        fontSize: 12,
                      ),
                    ),
                  ),
                )
                .toList(),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Row(
                children: [
                  IconButton(
                    icon: Icon(
                      post.isLiked ? Icons.favorite : Icons.favorite_border,
                      color: post.isLiked ? Colors.red : null,
                    ),
                    onPressed: () => _likePost(post),
                  ),
                  Text('${post.likes}'),
                ],
              ),
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.comment_outlined),
                    onPressed: () => _commentOnPost(post),
                  ),
                  Text('${post.comments}'),
                ],
              ),
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.share),
                    onPressed: () => _sharePost(post),
                  ),
                  Text('${post.shares}'),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Trends Feed'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refreshFeed,
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              // Filter functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Filter functionality would open here'),
                  backgroundColor: Colors.blue,
                ),
              );
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _refreshFeed,
        child: _isLoading && _posts.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _posts.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadTrendsFeed,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Trends Section
                        const Text(
                          'Trending Now',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        const SizedBox(height: 16),
                        SizedBox(
                          height: 120,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: _trends.length,
                            itemBuilder: (context, index) {
                              var trend = _trends[index];
                              return Card(
                                child: Container(
                                  width: 150,
                                  padding: const EdgeInsets.all(12.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            trend.title,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                            ),
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            trend.category,
                                            style: const TextStyle(
                                              color: Colors.grey,
                                              fontSize: 12,
                                            ),
                                          ),
                                        ],
                                      ),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            '${trend.postCount} posts',
                                            style: const TextStyle(
                                              fontSize: 12,
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 6, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: Colors.green,
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: Text(
                                              '+${trend.growthRate}%',
                                              style: const TextStyle(
                                                color: Colors.white,
                                                fontSize: 10,
                                              ),
                                            ),
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
                        const SizedBox(height: 24),
                        // Category Filters
                        SizedBox(
                          height: 40,
                          child: ListView(
                            scrollDirection: Axis.horizontal,
                            children: [
                              ChoiceChip(
                                label: const Text('All'),
                                selected: _selectedCategory == TrendCategory.all,
                                onSelected: (selected) {
                                  if (selected) {
                                    setState(() {
                                      _selectedCategory = TrendCategory.all;
                                    });
                                  }
                                },
                              ),
                              const SizedBox(width: 8),
                              ChoiceChip(
                                label: const Text('Technology'),
                                selected: _selectedCategory == TrendCategory.technology,
                                onSelected: (selected) {
                                  if (selected) {
                                    setState(() {
                                      _selectedCategory = TrendCategory.technology;
                                    });
                                  }
                                },
                              ),
                              const SizedBox(width: 8),
                              ChoiceChip(
                                label: const Text('Lifestyle'),
                                selected: _selectedCategory == TrendCategory.lifestyle,
                                onSelected: (selected) {
                                  if (selected) {
                                    setState(() {
                                      _selectedCategory = TrendCategory.lifestyle;
                                    });
                                  }
                                },
                              ),
                              const SizedBox(width: 8),
                              ChoiceChip(
                                label: const Text('Business'),
                                selected: _selectedCategory == TrendCategory.business,
                                onSelected: (selected) {
                                  if (selected) {
                                    setState(() {
                                      _selectedCategory = TrendCategory.business;
                                    });
                                  }
                                },
                              ),
                              const SizedBox(width: 8),
                              ChoiceChip(
                                label: const Text('Food'),
                                selected: _selectedCategory == TrendCategory.food,
                                onSelected: (selected) {
                                  if (selected) {
                                    setState(() {
                                      _selectedCategory = TrendCategory.food;
                                    });
                                  }
                                },
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                        // Posts Feed
                        Expanded(
                          child: ListView.builder(
                            controller: _scrollController,
                            itemCount: _posts.length + (_hasMoreData ? 1 : 0),
                            itemBuilder: (context, index) {
                              if (index == _posts.length) {
                                return _hasMoreData
                                    ? const Padding(
                                        padding: EdgeInsets.all(16.0),
                                        child: Center(child: CircularProgressIndicator()),
                                      )
                                    : const SizedBox.shrink();
                              }

                              var post = _posts[index];
                              return Card(
                                child: InkWell(
                                  onTap: () => _viewPostDetails(post),
                                  child: Padding(
                                    padding: const EdgeInsets.all(16.0),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            CircleAvatar(
                                              backgroundImage: NetworkImage(post.memberAvatar),
                                            ),
                                            const SizedBox(width: 12),
                                            Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  post.membername,
                                                  style: const TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                                Text(
                                                  _formatTimestamp(post.timestamp),
                                                  style: const TextStyle(
                                                    color: Colors.grey,
                                                    fontSize: 12,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 12),
                                        Text(post.content),
                                        const SizedBox(height: 12),
                                        if (post.mediaUrl != null)
                                          Container(
                                            height: 200,
                                            decoration: BoxDecoration(
                                              image: DecorationImage(
                                                image: NetworkImage(post.mediaUrl!),
                                                fit: BoxFit.cover,
                                              ),
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                          ),
                                        const SizedBox(height: 12),
                                        Wrap(
                                          spacing: 8.0,
                                          children: post.tags
                                              .map(
                                                (tag) => Container(
                                                  padding: const EdgeInsets.symmetric(
                                                      horizontal: 8, vertical: 4),
                                                  decoration: BoxDecoration(
                                                    color: Colors.blue.withOpacity(0.1),
                                                    borderRadius: BorderRadius.circular(12),
                                                  ),
                                                  child: Text(
                                                    '#$tag',
                                                    style: const TextStyle(
                                                      color: Colors.blue,
                                                      fontSize: 12,
                                                    ),
                                                  ),
                                                ),
                                              )
                                              .toList(),
                                        ),
                                        const SizedBox(height: 16),
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                          children: [
                                            Row(
                                              children: [
                                                IconButton(
                                                  icon: Icon(
                                                    post.isLiked
                                                        ? Icons.favorite
                                                        : Icons.favorite_border,
                                                    color: post.isLiked ? Colors.red : null,
                                                  ),
                                                  onPressed: () => _likePost(post),
                                                ),
                                                Text('${post.likes}'),
                                              ],
                                            ),
                                            Row(
                                              children: [
                                                IconButton(
                                                  icon: const Icon(Icons.comment_outlined),
                                                  onPressed: () => _commentOnPost(post),
                                                ),
                                                Text('${post.comments}'),
                                              ],
                                            ),
                                            Row(
                                              children: [
                                                IconButton(
                                                  icon: const Icon(Icons.share),
                                                  onPressed: () => _sharePost(post),
                                                ),
                                                Text('${post.shares}'),
                                              ],
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
      ),
    );
  }

  String _formatTimestamp(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else {
      return '${difference.inDays}d ago';
    }
  }

  Post _mapApiPostToPost(Map<String, dynamic> json) {
    final idValue = json['id'];
    final memberIdValue = json['member_id'];
    final contentValue = json['text_content'];
    final createdAtValue = json['created_at'];
    final mediaUrlValue = json['media_url'];
    final contentTypeValue = json['content_type'];

    final id = idValue is int
        ? idValue
        : int.tryParse(idValue?.toString() ?? '') ?? 0;
    final memberIdString = memberIdValue?.toString() ?? '';
    final content = contentValue?.toString() ?? '';
    final timestamp = _parseTimestamp(createdAtValue);
    final mediaType = _mapContentTypeToMediaType(contentTypeValue);
    final mediaUrl = mediaUrlValue is String && mediaUrlValue.isNotEmpty
        ? mediaUrlValue
        : null;
    final tags = _extractTags(content);

    return Post(
      id: id,
      membername:
          memberIdString.isNotEmpty ? 'member $memberIdString' : 'member',
      memberAvatar:
          'https://via.placeholder.com/50x50/CCCCCC/000000?text=U',
      content: content,
      timestamp: timestamp,
      likes: 0,
      comments: 0,
      shares: 0,
      mediaUrl: mediaUrl,
      mediaType: mediaType,
      isLiked: false,
      tags: tags,
    );
  }

  DateTime _parseTimestamp(dynamic value) {
    if (value is String) {
      return DateTime.tryParse(value) ?? DateTime.now();
    }
    return DateTime.now();
  }

  MediaType _mapContentTypeToMediaType(dynamic value) {
    if (value is String) {
      final lower = value.toLowerCase();
      if (lower.contains('image')) {
        return MediaType.image;
      }
      if (lower.contains('video')) {
        return MediaType.video;
      }
    }
    return MediaType.none;
  }

  List<String> _extractTags(String text) {
    final regex = RegExp(r'#(\w+)');
    return regex
        .allMatches(text)
        .map((match) => match.group(1))
        .whereType<String>()
        .toList();
  }
}

enum TrendCategory { all, technology, lifestyle, business, food }

enum MediaType { none, image, video }

class Trend {
  final int id;
  final String title;
  final int postCount;
  final bool isTrending;
  final String category;
  final double growthRate;

  Trend({
    required this.id,
    required this.title,
    required this.postCount,
    required this.isTrending,
    required this.category,
    required this.growthRate,
  });
}

class Post {
  final int id;
  final String membername;
  final String memberAvatar;
  final String content;
  final DateTime timestamp;
  final int likes;
  final int comments;
  final int shares;
  final String? mediaUrl;
  final MediaType mediaType;
  final bool isLiked;
  final List<String> tags;

  Post({
    required this.id,
    required this.membername,
    required this.memberAvatar,
    required this.content,
    required this.timestamp,
    required this.likes,
    required this.comments,
    required this.shares,
    this.mediaUrl,
    required this.mediaType,
    required this.isLiked,
    required this.tags,
  });
}
