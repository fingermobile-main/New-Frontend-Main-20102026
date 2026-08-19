import 'package:flutter/material.dart';

class HallmarksPage extends StatefulWidget {
  const HallmarksPage({super.key});

  @override
  State<HallmarksPage> createState() => _HallmarksPageState();
}

class _HallmarksPageState extends State<HallmarksPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<memberHallmark> _memberHallmarks = [];
  List<HallmarkCategory> _categories = [];
  String _selectedCategory = 'all';
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadmemberHallmarks();
  }

  Future<void> _loadmemberHallmarks() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock member hallmark data
      setState(() {
        _categories = [
          HallmarkCategory(id: 'all', name: 'All Hallmarks'),
          HallmarkCategory(id: 'achievements', name: 'Achievements'),
          HallmarkCategory(id: 'experiences', name: 'Experiences'),
          HallmarkCategory(id: 'milestones', name: 'Milestones'),
          HallmarkCategory(id: 'memories', name: 'Memories'),
        ];

        _memberHallmarks = [
          memberHallmark(
            id: 1,
            title: 'University Graduation',
            description: 'Graduated with honors from Computer Science program',
            date: DateTime.now().subtract(const Duration(days: 1200)),
            category: 'milestones',
            imageUrl: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Graduation',
            likes: 89,
            comments: 12,
            visibility: HallmarkVisibility.public,
            isLiked: false,
          ),
          memberHallmark(
            id: 2,
            title: 'First Marathon',
            description: 'Completed my first marathon in 4 hours 15 minutes',
            date: DateTime.now().subtract(const Duration(days: 365)),
            category: 'achievements',
            imageUrl: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Marathon',
            likes: 156,
            comments: 28,
            visibility: HallmarkVisibility.friends,
            isLiked: true,
          ),
          memberHallmark(
            id: 3,
            title: 'Europe Trip',
            description: 'Visited 7 countries across Europe in 3 weeks',
            date: DateTime.now().subtract(const Duration(days: 180)),
            category: 'experiences',
            imageUrl: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Europe+Trip',
            likes: 234,
            comments: 42,
            visibility: HallmarkVisibility.public,
            isLiked: false,
          ),
          memberHallmark(
            id: 4,
            title: 'Promotion Celebration',
            description: 'Promoted to Senior Software Engineer',
            date: DateTime.now().subtract(const Duration(days: 90)),
            category: 'milestones',
            imageUrl: 'https://via.placeholder.com/300x200/F9CA24/FFFFFF?text=Promotion',
            likes: 78,
            comments: 15,
            visibility: HallmarkVisibility.friends,
            isLiked: false,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load your hallmarks. Please try again.';
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

  void _toggleLike(int hallmarkId) {
    setState(() {
      var hallmark = _memberHallmarks.firstWhere((h) => h.id == hallmarkId);
      hallmark.isLiked = !hallmark.isLiked;
      hallmark.likes += hallmark.isLiked ? 1 : -1;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Hallmarks'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              // Navigate to create hallmark page
              Navigator.pushNamed(context, '/hallmark/create');
            },
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // Open settings
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadmemberHallmarks,
        child: _isLoading && _memberHallmarks.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _memberHallmarks.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadmemberHallmarks,
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
                          // Stats Banner
                          Container(
                            height: 120,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  Theme.of(context).primaryColor,
                                  Theme.of(context).primaryColorDark,
                                ],
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                children: [
                                  _buildStatItem('4', 'Total'),
                                  _buildStatItem('2', 'Public'),
                                  _buildStatItem('323', 'Likes'),
                                  _buildStatItem('97', 'Comments'),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 32),
                          // Categories
                          const Text(
                            'Categories',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            height: 40,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: _categories.length,
                              itemBuilder: (context, index) {
                                var category = _categories[index];
                                bool isSelected = _selectedCategory == category.id;

                                return Padding(
                                  padding: EdgeInsets.only(
                                    right: 8.0,
                                    left: index == 0 ? 0 : 8.0,
                                  ),
                                  child: FilterChip(
                                    label: Text(category.name),
                                    selected: isSelected,
                                    onSelected: (selected) {
                                      _selectCategory(category.id);
                                    },
                                    selectedColor: Theme.of(context).primaryColor,
                                    showCheckmark: false,
                                  ),
                                );
                              },
                            ),
                          ),
                          const SizedBox(height: 32),
                          // member Hallmarks
                          const Text(
                            'Your Hallmarks',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _memberHallmarks.length,
                            itemBuilder: (context, index) {
                              var hallmark = _memberHallmarks[index];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 16),
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        height: 150,
                                        decoration: BoxDecoration(
                                          image: DecorationImage(
                                            image: NetworkImage(hallmark.imageUrl),
                                            fit: BoxFit.cover,
                                          ),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                      ),
                                      const SizedBox(height: 16),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            hallmark.title,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 18,
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 8,
                                              vertical: 4,
                                            ),
                                            decoration: BoxDecoration(
                                              color: _getVisibilityColor(hallmark.visibility),
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: Row(
                                              children: [
                                                Icon(
                                                  _getVisibilityIcon(hallmark.visibility),
                                                  size: 16,
                                                  color: Colors.white,
                                                ),
                                                const SizedBox(width: 4),
                                                Text(
                                                  _getVisibilityText(hallmark.visibility),
                                                  style: const TextStyle(
                                                    color: Colors.white,
                                                    fontSize: 12,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        hallmark.description,
                                        style: const TextStyle(
                                          color: Colors.grey,
                                        ),
                                      ),
                                      const SizedBox(height: 16),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            _formatDate(hallmark.date),
                                            style: const TextStyle(
                                              color: Colors.grey,
                                              fontSize: 12,
                                            ),
                                          ),
                                          Row(
                                            children: [
                                              IconButton(
                                                icon: Icon(
                                                  hallmark.isLiked
                                                      ? Icons.favorite
                                                      : Icons.favorite_border,
                                                  color: hallmark.isLiked
                                                      ? Colors.red
                                                      : null,
                                                ),
                                                onPressed: () => _toggleLike(hallmark.id),
                                              ),
                                              Text('${hallmark.likes}'),
                                              const SizedBox(width: 16),
                                              Icon(
                                                Icons.comment,
                                                size: 16,
                                                color: Colors.grey,
                                              ),
                                              const SizedBox(width: 4),
                                              Text('${hallmark.comments}'),
                                              const SizedBox(width: 16),
                                              IconButton(
                                                icon: const Icon(Icons.more_vert),
                                                onPressed: () {
                                                  // Show options menu
                                                },
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
      ),
    );
  }

  Widget _buildStatItem(String value, String label) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white70,
          ),
        ),
      ],
    );
  }

  Color _getVisibilityColor(HallmarkVisibility visibility) {
    switch (visibility) {
      case HallmarkVisibility.public:
        return Colors.green;
      case HallmarkVisibility.friends:
        return Colors.blue;
      case HallmarkVisibility.private:
        return Colors.grey;
    }
  }

  IconData _getVisibilityIcon(HallmarkVisibility visibility) {
    switch (visibility) {
      case HallmarkVisibility.public:
        return Icons.public;
      case HallmarkVisibility.friends:
        return Icons.group;
      case HallmarkVisibility.private:
        return Icons.lock;
    }
  }

  String _getVisibilityText(HallmarkVisibility visibility) {
    switch (visibility) {
      case HallmarkVisibility.public:
        return 'Public';
      case HallmarkVisibility.friends:
        return 'Friends';
      case HallmarkVisibility.private:
        return 'Private';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}

enum HallmarkVisibility { public, friends, private }

class HallmarkCategory {
  final String id;
  final String name;

  HallmarkCategory({
    required this.id,
    required this.name,
  });
}

class memberHallmark {
  final int id;
  final String title;
  final String description;
  final DateTime date;
  final String category;
  final String imageUrl;
  final int likes;
  final int comments;
  final HallmarkVisibility visibility;
  bool isLiked;

  memberHallmark({
    required this.id,
    required this.title,
    required this.description,
    required this.date,
    required this.category,
    required this.imageUrl,
    required this.likes,
    required this.comments,
    required this.visibility,
    required this.isLiked,
  });
}