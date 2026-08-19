import 'package:flutter/material.dart';

class DiscoverPage extends StatefulWidget {
  const DiscoverPage({super.key});

  @override
  State<DiscoverPage> createState() => _DiscoverPageState();
}

class _DiscoverPageState extends State<DiscoverPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<DiscoveryCategory> _categories = [];
  List<DiscoveryItem> _trendingItems = [];
  List<DiscoveryItem> _recommendedItems = [];
  String _selectedCategory = 'all';
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadDiscoveryData();
  }

  Future<void> _loadDiscoveryData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock discovery data
      setState(() {
        _categories = [
          DiscoveryCategory(id: 'all', name: 'All', icon: Icons.apps),
          DiscoveryCategory(id: 'music', name: 'Music', icon: Icons.music_note),
          DiscoveryCategory(id: 'videos', name: 'Videos', icon: Icons.play_arrow),
          DiscoveryCategory(id: 'articles', name: 'Articles', icon: Icons.article),
          DiscoveryCategory(id: 'podcasts', name: 'Podcasts', icon: Icons.mic),
          DiscoveryCategory(id: 'courses', name: 'Courses', icon: Icons.school),
        ];

        _trendingItems = [
          DiscoveryItem(
            id: 1,
            title: 'Top Music Hits',
            description: 'The hottest tracks right now',
            type: DiscoveryItemType.playlist,
            imageUrl: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Music+Hits',
            popularity: 95,
          ),
          DiscoveryItem(
            id: 2,
            title: 'Tech News Today',
            description: 'Latest developments in technology',
            type: DiscoveryItemType.article,
            imageUrl: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Tech+News',
            popularity: 87,
          ),
          DiscoveryItem(
            id: 3,
            title: 'Cooking Masterclass',
            description: 'Learn to cook like a pro',
            type: DiscoveryItemType.course,
            imageUrl: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Cooking+Class',
            popularity: 92,
          ),
        ];

        _recommendedItems = [
          DiscoveryItem(
            id: 4,
            title: 'Jazz Classics',
            description: 'Timeless jazz collection',
            type: DiscoveryItemType.playlist,
            imageUrl: 'https://via.placeholder.com/300x200/F9CA24/FFFFFF?text=Jazz+Classics',
            popularity: 78,
          ),
          DiscoveryItem(
            id: 5,
            title: 'Fitness Fundamentals',
            description: 'Beginner workout routines',
            type: DiscoveryItemType.video,
            imageUrl: 'https://via.placeholder.com/300x200/6C5CE7/FFFFFF?text=Fitness',
            popularity: 85,
          ),
          DiscoveryItem(
            id: 6,
            title: 'AI Explained',
            description: 'Understanding artificial intelligence',
            type: DiscoveryItemType.podcast,
            imageUrl: 'https://via.placeholder.com/300x200/A29BFE/FFFFFF?text=AI+Podcast',
            popularity: 90,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load discovery data. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _selectCategory(String categoryId) {
    setState(() {
      _selectedCategory = categoryId;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Discover'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Open search
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadDiscoveryData,
        child: _isLoading && _categories.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _categories.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadDiscoveryData,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : SingleChildScrollView(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Categories
                          const Text(
                            'Browse Categories',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            height: 100,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: _categories.length,
                              itemBuilder: (context, index) {
                                var category = _categories[index];
                                bool isSelected = _selectedCategory == category.id;

                                return Padding(
                                  padding: EdgeInsets.only(
                                    right: 16.0,
                                    left: index == 0 ? 0 : 16.0,
                                  ),
                                  child: ChoiceChip(
                                    label: Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Icon(
                                          category.icon,
                                          size: 32,
                                          color: isSelected ? Colors.white : null,
                                        ),
                                        const SizedBox(height: 8),
                                        Text(category.name),
                                      ],
                                    ),
                                    selected: isSelected,
                                    onSelected: (selected) {
                                      _selectCategory(category.id);
                                    },
                                    selectedColor: Theme.of(context).primaryColor,
                                  ),
                                );
                              },
                            ),
                          ),
                          const SizedBox(height: 32),
                          // Tab Bar
                          Container(
                            height: 50,
                            decoration: BoxDecoration(
                              color: Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(25),
                            ),
                            child: Row(
                              children: [
                                _buildTab('Trending', 0),
                                _buildTab('Recommended', 1),
                                _buildTab('New', 2),
                              ],
                            ),
                          ),
                          const SizedBox(height: 24),
                          // Tab Content
                          if (_activeTab == 0) ...[
                            // Trending Items
                            const Text(
                              'Trending Now',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _trendingItems.length,
                              itemBuilder: (context, index) {
                                var item = _trendingItems[index];
                                return Card(
                                  margin: const EdgeInsets.only(bottom: 16),
                                  child: Padding(
                                    padding: const EdgeInsets.all(16.0),
                                    child: Row(
                                      children: [
                                        Container(
                                          width: 80,
                                          height: 80,
                                          decoration: BoxDecoration(
                                            image: DecorationImage(
                                              image: NetworkImage(item.imageUrl),
                                              fit: BoxFit.cover,
                                            ),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                        ),
                                        const SizedBox(width: 16),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                item.title,
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 16,
                                                ),
                                              ),
                                              const SizedBox(height: 4),
                                              Text(
                                                item.description,
                                                style: const TextStyle(
                                                  color: Colors.grey,
                                                ),
                                              ),
                                              const SizedBox(height: 8),
                                              Row(
                                                children: [
                                                  Icon(
                                                    _getItemTypeIcon(item.type),
                                                    size: 16,
                                                    color: Colors.grey,
                                                  ),
                                                  const SizedBox(width: 4),
                                                  Text(
                                                    _getItemTypeName(item.type),
                                                    style: const TextStyle(
                                                      fontSize: 12,
                                                      color: Colors.grey,
                                                    ),
                                                  ),
                                                  const Spacer(),
                                                  Icon(
                                                    Icons.trending_up,
                                                    size: 16,
                                                    color: Colors.green,
                                                  ),
                                                  const SizedBox(width: 4),
                                                  Text(
                                                    '${item.popularity}%',
                                                    style: const TextStyle(
                                                      fontSize: 12,
                                                      color: Colors.green,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                          ] else if (_activeTab == 1) ...[
                            // Recommended Items
                            const Text(
                              'Recommended for You',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            GridView.builder(
                              gridDelegate:
                                  const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                crossAxisSpacing: 16,
                                mainAxisSpacing: 16,
                                childAspectRatio: 0.8,
                              ),
                              itemCount: _recommendedItems.length,
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemBuilder: (context, index) {
                                var item = _recommendedItems[index];
                                return Card(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Expanded(
                                        child: Container(
                                          decoration: BoxDecoration(
                                            image: DecorationImage(
                                              image: NetworkImage(item.imageUrl),
                                              fit: BoxFit.cover,
                                            ),
                                            borderRadius: const BorderRadius.vertical(
                                              top: Radius.circular(4),
                                            ),
                                          ),
                                        ),
                                      ),
                                      Padding(
                                        padding: const EdgeInsets.all(8.0),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              item.title,
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                              ),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              item.description,
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: Colors.grey,
                                              ),
                                              maxLines: 2,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            const SizedBox(height: 8),
                                            Row(
                                              children: [
                                                Icon(
                                                  _getItemTypeIcon(item.type),
                                                  size: 14,
                                                  color: Colors.grey,
                                                ),
                                                const SizedBox(width: 4),
                                                Text(
                                                  _getItemTypeName(item.type),
                                                  style: const TextStyle(
                                                    fontSize: 10,
                                                    color: Colors.grey,
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
                          ] else ...[
                            // New Items
                            const Text(
                              'New Releases',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Center(
                              child: Column(
                                children: [
                                  Icon(
                                    Icons.new_releases,
                                    size: 64,
                                    color: Colors.grey.shade400,
                                  ),
                                  const SizedBox(height: 16),
                                  const Text(
                                    'New content coming soon!',
                                    style: TextStyle(
                                      fontSize: 18,
                                      color: Colors.grey,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
      ),
    );
  }

  Widget _buildTab(String title, int index) {
    bool isActive = _activeTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _activeTab = index;
          });
        },
        child: Container(
          decoration: BoxDecoration(
            color: isActive ? Theme.of(context).primaryColor : Colors.transparent,
            borderRadius: BorderRadius.circular(25),
          ),
          child: Center(
            child: Text(
              title,
              style: TextStyle(
                fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                color: isActive ? Colors.white : Colors.grey,
              ),
            ),
          ),
        ),
      ),
    );
  }

  IconData _getItemTypeIcon(DiscoveryItemType type) {
    switch (type) {
      case DiscoveryItemType.playlist:
        return Icons.queue_music;
      case DiscoveryItemType.article:
        return Icons.article;
      case DiscoveryItemType.video:
        return Icons.play_arrow;
      case DiscoveryItemType.podcast:
        return Icons.mic;
      case DiscoveryItemType.course:
        return Icons.school;
    }
  }

  String _getItemTypeName(DiscoveryItemType type) {
    switch (type) {
      case DiscoveryItemType.playlist:
        return 'Playlist';
      case DiscoveryItemType.article:
        return 'Article';
      case DiscoveryItemType.video:
        return 'Video';
      case DiscoveryItemType.podcast:
        return 'Podcast';
      case DiscoveryItemType.course:
        return 'Course';
    }
  }
}

enum DiscoveryItemType { playlist, article, video, podcast, course }

class DiscoveryCategory {
  final String id;
  final String name;
  final IconData icon;

  DiscoveryCategory({
    required this.id,
    required this.name,
    required this.icon,
  });
}

class DiscoveryItem {
  final int id;
  final String title;
  final String description;
  final DiscoveryItemType type;
  final String imageUrl;
  final int popularity;

  DiscoveryItem({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.imageUrl,
    required this.popularity,
  });
}