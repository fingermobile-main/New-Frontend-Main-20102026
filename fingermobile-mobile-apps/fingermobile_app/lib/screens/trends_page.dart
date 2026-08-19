import 'package:flutter/material.dart';

class TrendsPage extends StatefulWidget {
  const TrendsPage({super.key});

  @override
  State<TrendsPage> createState() => _TrendsPageState();
}

class _TrendsPageState extends State<TrendsPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<TrendCategory> _categories = [];
  List<Trend> _trends = [];
  List<SocialPost> _socialPosts = [];
  TrendTimeFrame _selectedTimeFrame = TrendTimeFrame.today;
  TrendCategory? _selectedCategory;

  @override
  void initState() {
    super.initState();
    _loadTrends();
  }

  Future<void> _loadTrends() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock trend categories
      setState(() {
        _categories = [
          TrendCategory(id: 1, name: 'All Categories', icon: Icons.apps),
          TrendCategory(id: 2, name: 'Technology', icon: Icons.computer),
          TrendCategory(id: 3, name: 'Entertainment', icon: Icons.movie),
          TrendCategory(id: 4, name: 'Sports', icon: Icons.sports_soccer),
          TrendCategory(id: 5, name: 'Politics', icon: Icons.account_balance),
          TrendCategory(id: 6, name: 'Business', icon: Icons.business),
          TrendCategory(id: 7, name: 'Health', icon: Icons.local_hospital),
          TrendCategory(id: 8, name: 'Science', icon: Icons.science),
        ];

        // Mock trends
        _trends = [
          Trend(
            id: 1,
            title: 'Flutter Development',
            rank: 1,
            category: 'Technology',
            postCount: 12500,
            growthRate: 15.5,
            isTrendingUp: true,
            relatedTags: ['#Flutter', '#Dart', '#MobileDevelopment'],
          ),
          Trend(
            id: 2,
            title: 'AI Innovations',
            rank: 2,
            category: 'Technology',
            postCount: 9800,
            growthRate: 22.3,
            isTrendingUp: true,
            relatedTags: ['#AI', '#MachineLearning', '#DeepLearning'],
          ),
          Trend(
            id: 3,
            title: 'Sustainable Living',
            rank: 3,
            category: 'Lifestyle',
            postCount: 7600,
            growthRate: 18.7,
            isTrendingUp: true,
            relatedTags: ['#Sustainability', '#EcoFriendly', '#GreenLiving'],
          ),
          Trend(
            id: 4,
            title: 'Remote Work Tips',
            rank: 4,
            category: 'Business',
            postCount: 6400,
            growthRate: 12.1,
            isTrendingUp: false,
            relatedTags: ['#RemoteWork', '#WorkFromHome', '#Productivity'],
          ),
          Trend(
            id: 5,
            title: 'Plant-Based Recipes',
            rank: 5,
            category: 'Food',
            postCount: 5200,
            growthRate: 9.8,
            isTrendingUp: true,
            relatedTags: ['#Vegan', '#PlantBased', '#HealthyEating'],
          ),
          Trend(
            id: 6,
            title: 'Space Exploration',
            rank: 6,
            category: 'Science',
            postCount: 4800,
            growthRate: 31.2,
            isTrendingUp: true,
            relatedTags: ['#Space', '#NASA', '#Astronomy'],
          ),
          Trend(
            id: 7,
            title: 'Cryptocurrency News',
            rank: 7,
            category: 'Finance',
            postCount: 8900,
            growthRate: -5.3,
            isTrendingUp: false,
            relatedTags: ['#Crypto', '#Bitcoin', '#Blockchain'],
          ),
          Trend(
            id: 8,
            title: 'Mental Health Awareness',
            rank: 8,
            category: 'Health',
            postCount: 6700,
            growthRate: 14.7,
            isTrendingUp: true,
            relatedTags: ['#MentalHealth', '#Wellness', '#Mindfulness'],
          ),
        ];

        // Mock social posts
        _socialPosts = [
          SocialPost(
            id: 1,
            membername: 'tech_guru',
            memberAvatar: 'https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=TG',
            content:
                'Just released a new Flutter package that makes state management 3x easier! Check it out on pub.dev #Flutter #Dart',
            timestamp: DateTime.now().subtract(const Duration(minutes: 15)),
            likes: 245,
            comments: 32,
            shares: 18,
            mediaUrl: 'https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=Flutter+Package',
            mediaType: MediaType.image,
            isLiked: false,
            tags: ['Flutter', 'Dart', 'Programming'],
          ),
          SocialPost(
            id: 2,
            membername: 'ai_researcher',
            memberAvatar: 'https://via.placeholder.com/50x50/FF6B6B/FFFFFF?text=AR',
            content:
                'Exciting breakthrough in natural language processing! Our new model achieves 95% accuracy on complex reasoning tasks.',
            timestamp: DateTime.now().subtract(const Duration(hours: 2)),
            likes: 512,
            comments: 78,
            shares: 42,
            mediaUrl: null,
            mediaType: MediaType.none,
            isLiked: true,
            tags: ['AI', 'NLP', 'MachineLearning'],
          ),
          SocialPost(
            id: 3,
            membername: 'eco_warrior',
            memberAvatar: 'https://via.placeholder.com/50x50/96CEB4/000000?text=EW',
            content:
                'DIY tutorial: Turn your plastic waste into beautiful planters! 🌱♻️ #Upcycling #Sustainability',
            timestamp: DateTime.now().subtract(const Duration(hours: 5)),
            likes: 320,
            comments: 45,
            shares: 28,
            mediaUrl: 'https://via.placeholder.com/400x300/FFEAA7/000000?text=Upcycled+Planters',
            mediaType: MediaType.image,
            isLiked: false,
            tags: ['Sustainability', 'DIY', 'Upcycling'],
          ),
        ];

        _selectedCategory = _categories.first;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load trends. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _refreshTrends() async {
    await _loadTrends();
  }

  void _likePost(SocialPost post) {
    setState(() {
      int index = _socialPosts.indexWhere((p) => p.id == post.id);
      if (index != -1) {
        _socialPosts[index] = SocialPost(
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

  void _sharePost(SocialPost post) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Shared post by ${post.membername}'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _commentOnPost(SocialPost post) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Commenting on post by ${post.membername}'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _viewTrendDetails(Trend trend) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildTrendDetailsSheet(trend),
    );
  }

  Widget _buildTrendDetailsSheet(Trend trend) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  trend.title,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: Colors.blue.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Rank:',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '#${trend.rank}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                        color: Colors.blue,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Category:'),
                    Text(trend.category),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Posts:'),
                    Text('${trend.postCount}'),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Growth:'),
                    Row(
                      children: [
                        Icon(
                          trend.isTrendingUp ? Icons.trending_up : Icons.trending_down,
                          color: trend.isTrendingUp ? Colors.green : Colors.red,
                          size: 16,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '${trend.growthRate}%',
                          style: TextStyle(
                            color: trend.isTrendingUp ? Colors.green : Colors.red,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Related Tags:',
            style: TextStyle(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8.0,
            children: trend.relatedTags
                .map(
                  (tag) => Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.blue.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      tag,
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
          Center(
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Following trend: ${trend.title}'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: const Text('Follow Trend'),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Trends'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refreshTrends,
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
        onRefresh: _refreshTrends,
        child: _isLoading && _trends.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _trends.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadTrends,
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
                        // Time Frame Selector
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: [
                              ChoiceChip(
                                label: const Text('Today'),
                                selected: _selectedTimeFrame == TrendTimeFrame.today,
                                onSelected: (selected) {
                                  if (selected) {
                                    setState(() {
                                      _selectedTimeFrame = TrendTimeFrame.today;
                                    });
                                  }
                                },
                              ),
                              const SizedBox(width: 8),
                              ChoiceChip(
                                label: const Text('This Week'),
                                selected: _selectedTimeFrame == TrendTimeFrame.week,
                                onSelected: (selected) {
                                  if (selected) {
                                    setState(() {
                                      _selectedTimeFrame = TrendTimeFrame.week;
                                    });
                                  }
                                },
                              ),
                              const SizedBox(width: 8),
                              ChoiceChip(
                                label: const Text('This Month'),
                                selected: _selectedTimeFrame == TrendTimeFrame.month,
                                onSelected: (selected) {
                                  if (selected) {
                                    setState(() {
                                      _selectedTimeFrame = TrendTimeFrame.month;
                                    });
                                  }
                                },
                              ),
                              const SizedBox(width: 8),
                              ChoiceChip(
                                label: const Text('All Time'),
                                selected: _selectedTimeFrame == TrendTimeFrame.all,
                                onSelected: (selected) {
                                  if (selected) {
                                    setState(() {
                                      _selectedTimeFrame = TrendTimeFrame.all;
                                    });
                                  }
                                },
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                        // Category Selector
                        SizedBox(
                          height: 40,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: _categories.length,
                            itemBuilder: (context, index) {
                              var category = _categories[index];
                              return Padding(
                                padding: const EdgeInsets.only(right: 8.0),
                                child: ChoiceChip(
                                  label: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(category.icon, size: 16),
                                      const SizedBox(width: 4),
                                      Text(category.name),
                                    ],
                                  ),
                                  selected: _selectedCategory?.id == category.id,
                                  onSelected: (selected) {
                                    if (selected) {
                                      setState(() {
                                        _selectedCategory = category;
                                      });
                                    }
                                  },
                                ),
                              );
                            },
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Trends List
                        const Text(
                          'Top Trends',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Expanded(
                          child: ListView.builder(
                            itemCount: _trends.length,
                            itemBuilder: (context, index) {
                              var trend = _trends[index];
                              return Card(
                                child: InkWell(
                                  onTap: () => _viewTrendDetails(trend),
                                  child: Padding(
                                    padding: const EdgeInsets.all(16.0),
                                    child: Row(
                                      children: [
                                        Container(
                                          width: 30,
                                          height: 30,
                                          decoration: BoxDecoration(
                                            color: trend.rank <= 3
                                                ? (trend.rank == 1
                                                    ? Colors.amber
                                                    : trend.rank == 2
                                                        ? Colors.grey[300]
                                                        : Colors.orange[700])
                                                : Colors.blue,
                                            shape: BoxShape.circle,
                                          ),
                                          child: Center(
                                            child: Text(
                                              '${trend.rank}',
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                                color: Colors.white,
                                              ),
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 16),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                trend.title,
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 16,
                                                ),
                                              ),
                                              const SizedBox(height: 4),
                                              Text(
                                                trend.category,
                                                style: const TextStyle(
                                                  color: Colors.grey,
                                                  fontSize: 12,
                                                ),
                                              ),
                                              const SizedBox(height: 8),
                                              Wrap(
                                                spacing: 8.0,
                                                children: trend.relatedTags
                                                    .map(
                                                      (tag) => Container(
                                                        padding: const EdgeInsets.symmetric(
                                                            horizontal: 6, vertical: 2),
                                                        decoration: BoxDecoration(
                                                          color: Colors.blue.withOpacity(0.1),
                                                          borderRadius: BorderRadius.circular(12),
                                                        ),
                                                        child: Text(
                                                          tag,
                                                          style: const TextStyle(
                                                            color: Colors.blue,
                                                            fontSize: 10,
                                                          ),
                                                        ),
                                                      ),
                                                    )
                                                    .toList(),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Column(
                                          children: [
                                            Text('${trend.postCount} posts'),
                                            const SizedBox(height: 4),
                                            Row(
                                              children: [
                                                Icon(
                                                  trend.isTrendingUp
                                                      ? Icons.trending_up
                                                      : Icons.trending_down,
                                                  color: trend.isTrendingUp ? Colors.green : Colors.red,
                                                  size: 16,
                                                ),
                                                const SizedBox(width: 4),
                                                Text(
                                                  '${trend.growthRate}%',
                                                  style: TextStyle(
                                                    color:
                                                        trend.isTrendingUp ? Colors.green : Colors.red,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
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
}

enum TrendTimeFrame { today, week, month, all }

enum MediaType { none, image, video }

class TrendCategory {
  final int id;
  final String name;
  final IconData icon;

  TrendCategory({
    required this.id,
    required this.name,
    required this.icon,
  });
}

class Trend {
  final int id;
  final String title;
  final int rank;
  final String category;
  final int postCount;
  final double growthRate;
  final bool isTrendingUp;
  final List<String> relatedTags;

  Trend({
    required this.id,
    required this.title,
    required this.rank,
    required this.category,
    required this.postCount,
    required this.growthRate,
    required this.isTrendingUp,
    required this.relatedTags,
  });
}

class SocialPost {
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

  SocialPost({
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