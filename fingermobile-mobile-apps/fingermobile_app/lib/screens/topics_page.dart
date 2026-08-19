import 'package:flutter/material.dart';

class TopicsPage extends StatefulWidget {
  const TopicsPage({super.key});

  @override
  State<TopicsPage> createState() => _TopicsPageState();
}

class _TopicsPageState extends State<TopicsPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<Topic> _topics = [];
  List<Topic> _trendingTopics = [];
  List<Topic> _recommendedTopics = [];
  TopicTab _selectedTab = TopicTab.all;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadTopics();
  }

  Future<void> _loadTopics() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock topics data
      setState(() {
        _trendingTopics = [
          Topic(
            id: 1,
            name: 'Technology',
            description: 'Latest trends in technology and innovation',
            postCount: 12500,
            followerCount: 45000,
            isFollowing: true,
            imageUrl: 'https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=Tech',
          ),
          Topic(
            id: 2,
            name: 'Health & Wellness',
            description: 'Tips and news on health and wellness',
            postCount: 8900,
            followerCount: 32000,
            isFollowing: false,
            imageUrl: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=Health',
          ),
          Topic(
            id: 3,
            name: 'Travel',
            description: 'Discover amazing places around the world',
            postCount: 15600,
            followerCount: 68000,
            isFollowing: true,
            imageUrl: 'https://via.placeholder.com/150x150/45B7D1/FFFFFF?text=Travel',
          ),
          Topic(
            id: 4,
            name: 'Food & Cooking',
            description: 'Delicious recipes and food experiences',
            postCount: 22400,
            followerCount: 92000,
            isFollowing: false,
            imageUrl: 'https://via.placeholder.com/150x150/FFEEAD/000000?text=Food',
          ),
        ];

        _recommendedTopics = [
          Topic(
            id: 5,
            name: 'Photography',
            description: 'Capture and share stunning photos',
            postCount: 7800,
            followerCount: 28000,
            isFollowing: false,
            imageUrl: 'https://via.placeholder.com/150x150/96CEB4/000000?text=Photo',
          ),
          Topic(
            id: 6,
            name: 'Music',
            description: 'Discover new music and artists',
            postCount: 19200,
            followerCount: 75000,
            isFollowing: true,
            imageUrl: 'https://via.placeholder.com/150x150/FECA57/000000?text=Music',
          ),
          Topic(
            id: 7,
            name: 'Sports',
            description: 'News and discussions about sports',
            postCount: 31500,
            followerCount: 120000,
            isFollowing: false,
            imageUrl: 'https://via.placeholder.com/150x150/FF9FF3/000000?text=Sports',
          ),
          Topic(
            id: 8,
            name: 'Art & Design',
            description: 'Creative works and design inspiration',
            postCount: 6400,
            followerCount: 22000,
            isFollowing: false,
            imageUrl: 'https://via.placeholder.com/150x150/54A0FF/FFFFFF?text=Art',
          ),
        ];

        _topics = [..._trendingTopics, ..._recommendedTopics];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load topics. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _followTopic(Topic topic) {
    setState(() {
      int index = _topics.indexWhere((t) => t.id == topic.id);
      if (index != -1) {
        _topics[index] = Topic(
          id: topic.id,
          name: topic.name,
          description: topic.description,
          postCount: topic.postCount,
          followerCount: topic.followerCount + (topic.isFollowing ? -1 : 1),
          isFollowing: !topic.isFollowing,
          imageUrl: topic.imageUrl,
        );
      }

      // Update in trending topics if it exists there
      int trendingIndex = _trendingTopics.indexWhere((t) => t.id == topic.id);
      if (trendingIndex != -1) {
        _trendingTopics[trendingIndex] = Topic(
          id: topic.id,
          name: topic.name,
          description: topic.description,
          postCount: topic.postCount,
          followerCount: topic.followerCount + (topic.isFollowing ? -1 : 1),
          isFollowing: !topic.isFollowing,
          imageUrl: topic.imageUrl,
        );
      }

      // Update in recommended topics if it exists there
      int recommendedIndex = _recommendedTopics.indexWhere((t) => t.id == topic.id);
      if (recommendedIndex != -1) {
        _recommendedTopics[recommendedIndex] = Topic(
          id: topic.id,
          name: topic.name,
          description: topic.description,
          postCount: topic.postCount,
          followerCount: topic.followerCount + (topic.isFollowing ? -1 : 1),
          isFollowing: !topic.isFollowing,
          imageUrl: topic.imageUrl,
        );
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
            '${topic.isFollowing ? 'Unfollowed' : 'Followed'} topic: ${topic.name}'),
        backgroundColor: topic.isFollowing ? Colors.red : Colors.green,
      ),
    );
  }

  void _viewTopic(Topic topic) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildTopicDetailsSheet(topic),
    );
  }

  Widget _buildTopicDetailsSheet(Topic topic) {
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
                  topic.name,
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
          Center(
            child: Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(topic.imageUrl),
                  fit: BoxFit.cover,
                ),
                borderRadius: BorderRadius.circular(50),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            topic.description,
            style: const TextStyle(
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildStatItem('Posts', '${topic.postCount}'),
              _buildStatItem('Followers', '${topic.followerCount}'),
            ],
          ),
          const SizedBox(height: 16),
          Center(
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                _followTopic(topic);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: topic.isFollowing ? Colors.red : Theme.of(context).primaryColor,
              ),
              child: Text(topic.isFollowing ? 'Unfollow Topic' : 'Follow Topic'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.grey,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  List<Topic> _filterTopics(List<Topic> topics) {
    if (_searchQuery.isEmpty) {
      return topics;
    }

    return topics.where((topic) {
      return topic.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          topic.description.toLowerCase().contains(_searchQuery.toLowerCase());
    }).toList();
  }

  void _onSearchChanged(String query) {
    setState(() {
      _searchQuery = query;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Topics'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadTopics,
          ),
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              showSearch(
                context: context,
                delegate: _TopicSearchDelegate(_topics),
              );
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadTopics,
        child: _isLoading && _topics.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _topics.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadTopics,
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
                        // Search bar
                        TextField(
                          onChanged: _onSearchChanged,
                          decoration: const InputDecoration(
                            hintText: 'Search topics...',
                            prefixIcon: Icon(Icons.search),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.all(Radius.circular(25.0)),
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        // Stats Summary
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                _buildStatItem('Topics', '${_topics.length}'),
                                _buildStatItem('Following',
                                    '${_topics.where((t) => t.isFollowing).length}'),
                                _buildStatItem('Posts',
                                    '${_topics.fold(0, (sum, t) => sum + t.postCount)}'),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Tabs
                        Row(
                          children: [
                            ChoiceChip(
                              label: const Text('All'),
                              selected: _selectedTab == TopicTab.all,
                              onSelected: (selected) {
                                if (selected) {
                                  setState(() {
                                    _selectedTab = TopicTab.all;
                                  });
                                }
                              },
                            ),
                            const SizedBox(width: 8),
                            ChoiceChip(
                              label: const Text('Trending'),
                              selected: _selectedTab == TopicTab.trending,
                              onSelected: (selected) {
                                if (selected) {
                                  setState(() {
                                    _selectedTab = TopicTab.trending;
                                  });
                                }
                              },
                            ),
                            const SizedBox(width: 8),
                            ChoiceChip(
                              label: const Text('Recommended'),
                              selected: _selectedTab == TopicTab.recommended,
                              onSelected: (selected) {
                                if (selected) {
                                  setState(() {
                                    _selectedTab = TopicTab.recommended;
                                  });
                                }
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // Topics List
                        Expanded(
                          child: _buildTopicsList(),
                        ),
                      ],
                    ),
                  ),
      ),
    );
  }

  Widget _buildTopicsList() {
    List<Topic> displayedTopics = [];

    switch (_selectedTab) {
      case TopicTab.all:
        displayedTopics = _filterTopics(_topics);
        break;
      case TopicTab.trending:
        displayedTopics = _filterTopics(_trendingTopics);
        break;
      case TopicTab.recommended:
        displayedTopics = _filterTopics(_recommendedTopics);
        break;
    }

    if (displayedTopics.isEmpty) {
      return const Center(
        child: Text('No topics found'),
      );
    }

    return ListView.builder(
      itemCount: displayedTopics.length,
      itemBuilder: (context, index) {
        var topic = displayedTopics[index];
        return Card(
          child: InkWell(
            onTap: () => _viewTopic(topic),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      image: DecorationImage(
                        image: NetworkImage(topic.imageUrl),
                        fit: BoxFit.cover,
                      ),
                      borderRadius: BorderRadius.circular(30),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          topic.name,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          topic.description,
                          style: const TextStyle(
                            color: Colors.grey,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text('${topic.postCount} posts'),
                            Text('${topic.followerCount} followers'),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  IconButton(
                    icon: Icon(
                      topic.isFollowing ? Icons.favorite : Icons.favorite_border,
                      color: topic.isFollowing ? Colors.red : null,
                    ),
                    onPressed: () => _followTopic(topic),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

class _TopicSearchDelegate extends SearchDelegate<String> {
  final List<Topic> topics;

  _TopicSearchDelegate(this.topics);

  @override
  List<Widget> buildActions(BuildContext context) {
    return [
      IconButton(
        icon: const Icon(Icons.clear),
        onPressed: () {
          query = '';
        },
      ),
    ];
  }

  @override
  Widget buildLeading(BuildContext context) {
    return IconButton(
      icon: const Icon(Icons.arrow_back),
      onPressed: () {
        close(context, '');
      },
    );
  }

  @override
  Widget buildResults(BuildContext context) {
    final results = topics.where((topic) {
      return topic.name.toLowerCase().contains(query.toLowerCase()) ||
          topic.description.toLowerCase().contains(query.toLowerCase());
    }).toList();

    return ListView.builder(
      itemCount: results.length,
      itemBuilder: (context, index) {
        var topic = results[index];
        return ListTile(
          leading: Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(topic.imageUrl),
                fit: BoxFit.cover,
              ),
              borderRadius: BorderRadius.circular(25),
            ),
          ),
          title: Text(topic.name),
          subtitle: Text(topic.description),
          trailing: Icon(
            topic.isFollowing ? Icons.favorite : Icons.favorite_border,
            color: topic.isFollowing ? Colors.red : null,
          ),
          onTap: () {
            close(context, '');
            // Handle topic selection
          },
        );
      },
    );
  }

  @override
  Widget buildSuggestions(BuildContext context) {
    final suggestions = topics.where((topic) {
      return topic.name.toLowerCase().contains(query.toLowerCase()) ||
          topic.description.toLowerCase().contains(query.toLowerCase());
    }).toList();

    return ListView.builder(
      itemCount: suggestions.length,
      itemBuilder: (context, index) {
        var topic = suggestions[index];
        return ListTile(
          leading: Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(topic.imageUrl),
                fit: BoxFit.cover,
              ),
              borderRadius: BorderRadius.circular(25),
            ),
          ),
          title: Text(topic.name),
          subtitle: Text(topic.description),
          trailing: Icon(
            topic.isFollowing ? Icons.favorite : Icons.favorite_border,
            color: topic.isFollowing ? Colors.red : null,
          ),
          onTap: () {
            query = topic.name;
            showResults(context);
          },
        );
      },
    );
  }
}

enum TopicTab { all, trending, recommended }

class Topic {
  final int id;
  final String name;
  final String description;
  final int postCount;
  final int followerCount;
  final bool isFollowing;
  final String imageUrl;

  Topic({
    required this.id,
    required this.name,
    required this.description,
    required this.postCount,
    required this.followerCount,
    required this.isFollowing,
    required this.imageUrl,
  });
}