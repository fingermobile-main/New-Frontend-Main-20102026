import 'package:flutter/material.dart';

class ManageMyHallmarkPage extends StatefulWidget {
  const ManageMyHallmarkPage({super.key});

  @override
  State<ManageMyHallmarkPage> createState() => _ManageMyHallmarkPageState();
}

class _ManageMyHallmarkPageState extends State<ManageMyHallmarkPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<HallmarkItem> _hallmarks = [];
  List<HallmarkCategory> _categories = [];
  String _selectedCategory = 'all';
  HallmarkSortOption _sortOption = HallmarkSortOption.newest;

  @override
  void initState() {
    super.initState();
    _loadHallmarksData();
  }

  Future<void> _loadHallmarksData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock hallmarks data
      setState(() {
        _categories = [
          HallmarkCategory(id: 'all', name: 'All Hallmarks'),
          HallmarkCategory(id: 'achievements', name: 'Achievements'),
          HallmarkCategory(id: 'experiences', name: 'Experiences'),
          HallmarkCategory(id: 'milestones', name: 'Milestones'),
          HallmarkCategory(id: 'memories', name: 'Memories'),
        ];

        _hallmarks = [
          HallmarkItem(
            id: 1,
            title: 'Graduation Day',
            description: 'Successfully graduated with honors from university',
            date: DateTime.now().subtract(const Duration(days: 365)),
            category: 'milestones',
            imageUrl: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Graduation',
            likes: 124,
            comments: 28,
            visibility: HallmarkVisibility.public,
            isLiked: false,
          ),
          HallmarkItem(
            id: 2,
            title: 'First Job',
            description: 'Started my dream job as a software engineer',
            date: DateTime.now().subtract(const Duration(days: 180)),
            category: 'milestones',
            imageUrl: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=First+Job',
            likes: 89,
            comments: 15,
            visibility: HallmarkVisibility.friends,
            isLiked: true,
          ),
          HallmarkItem(
            id: 3,
            title: 'Mountain Adventure',
            description: 'Hiked to the summit of Mount Everest',
            date: DateTime.now().subtract(const Duration(days: 90)),
            category: 'experiences',
            imageUrl: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Mountain+Adventure',
            likes: 256,
            comments: 42,
            visibility: HallmarkVisibility.public,
            isLiked: false,
          ),
          HallmarkItem(
            id: 4,
            title: 'Marathon Completion',
            description: 'Completed my first marathon in under 4 hours',
            date: DateTime.now().subtract(const Duration(days: 45)),
            category: 'achievements',
            imageUrl: 'https://via.placeholder.com/300x200/F9CA24/FFFFFF?text=Marathon',
            likes: 178,
            comments: 31,
            visibility: HallmarkVisibility.private,
            isLiked: true,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load hallmarks. Please try again.';
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

  void _changeSort(HallmarkSortOption option) {
    setState(() {
      _sortOption = option;
    });
  }

  void _toggleLike(int hallmarkId) {
    setState(() {
      var hallmark = _hallmarks.firstWhere((h) => h.id == hallmarkId);
      hallmark.isLiked = !hallmark.isLiked;
      hallmark.likes += hallmark.isLiked ? 1 : -1;
    });
  }

  void _editHallmark(int hallmarkId) {
    // Navigate to edit hallmark page
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Edit hallmark functionality would open here'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _deleteHallmark(int hallmarkId) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Delete Hallmark'),
          content: const Text('Are you sure you want to delete this hallmark? This action cannot be undone.'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                setState(() {
                  _hallmarks.removeWhere((h) => h.id == hallmarkId);
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Hallmark deleted successfully'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: const Text('Delete', style: TextStyle(color: Colors.red)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Manage Hallmarks'),
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
            icon: const Icon(Icons.refresh),
            onPressed: _loadHallmarksData,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadHallmarksData,
        child: _isLoading && _hallmarks.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _hallmarks.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadHallmarksData,
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
                            height: 100,
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
                                  _buildStatItem('${_hallmarks.length}', 'Total'),
                                  _buildStatItem(
                                    '${_hallmarks.where((h) => h.visibility == HallmarkVisibility.public).length}',
                                    'Public',
                                  ),
                                  _buildStatItem('${_hallmarks.fold(0, (sum, h) => sum + h.likes)}', 'Likes'),
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
                          const SizedBox(height: 24),
                          // Sort Options
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'My Hallmarks',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              PopupMenuButton<HallmarkSortOption>(
                                icon: const Icon(Icons.sort),
                                onSelected: _changeSort,
                                itemBuilder: (BuildContext context) {
                                  return [
                                    const PopupMenuItem(
                                      value: HallmarkSortOption.newest,
                                      child: Text('Newest First'),
                                    ),
                                    const PopupMenuItem(
                                      value: HallmarkSortOption.oldest,
                                      child: Text('Oldest First'),
                                    ),
                                    const PopupMenuItem(
                                      value: HallmarkSortOption.mostLiked,
                                      child: Text('Most Liked'),
                                    ),
                                    const PopupMenuItem(
                                      value: HallmarkSortOption.mostCommented,
                                      child: Text('Most Commented'),
                                    ),
                                  ];
                                },
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          // Hallmarks List
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _hallmarks.length,
                            itemBuilder: (context, index) {
                              var hallmark = _hallmarks[index];
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
                                      const SizedBox(height: 8),
                                      Text(
                                        _formatDate(hallmark.date),
                                        style: const TextStyle(
                                          color: Colors.grey,
                                          fontSize: 12,
                                        ),
                                      ),
                                      const SizedBox(height: 16),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
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
                                              IconButton(
                                                icon: const Icon(Icons.comment),
                                                onPressed: () {
                                                  // View comments
                                                },
                                              ),
                                              Text('${hallmark.comments}'),
                                            ],
                                          ),
                                          Row(
                                            children: [
                                              IconButton(
                                                icon: const Icon(Icons.edit),
                                                onPressed: () => _editHallmark(hallmark.id),
                                              ),
                                              IconButton(
                                                icon: const Icon(Icons.delete),
                                                onPressed: () => _deleteHallmark(hallmark.id),
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
            fontWeight: FontWeight.bold,
            fontSize: 20,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white70,
            fontSize: 12,
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

enum HallmarkSortOption { newest, oldest, mostLiked, mostCommented }
enum HallmarkVisibility { public, friends, private }

class HallmarkCategory {
  final String id;
  final String name;

  HallmarkCategory({
    required this.id,
    required this.name,
  });
}

class HallmarkItem {
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

  HallmarkItem({
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