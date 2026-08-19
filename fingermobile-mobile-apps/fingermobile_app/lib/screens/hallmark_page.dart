import 'package:flutter/material.dart';

class HallmarkPage extends StatefulWidget {
  const HallmarkPage({super.key});

  @override
  State<HallmarkPage> createState() => _HallmarkPageState();
}

class _HallmarkPageState extends State<HallmarkPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<HallmarkItem> _hallmarks = [];
  List<HallmarkCategory> _categories = [];
  String _selectedCategory = 'all';
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadHallmarkData();
  }

  Future<void> _loadHallmarkData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock hallmark data
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

  void _toggleLike(int hallmarkId) {
    setState(() {
      var hallmark = _hallmarks.firstWhere((h) => h.id == hallmarkId);
      hallmark.isLiked = !hallmark.isLiked;
      hallmark.likes += hallmark.isLiked ? 1 : -1;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hallmarks'),
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
            icon: const Icon(Icons.search),
            onPressed: () {
              // Open search
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadHallmarkData,
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
                          onPressed: _loadHallmarkData,
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
                          // Welcome Banner
                          Container(
                            height: 150,
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
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Your Hallmarks',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 28,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    'Capture and celebrate life\'s important moments',
                                    style: TextStyle(
                                      color: Colors.white70,
                                      fontSize: 16,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  ElevatedButton(
                                    onPressed: () {
                                      // Navigate to create hallmark page
                                      Navigator.pushNamed(context, '/hallmark/create');
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.white,
                                      foregroundColor: Theme.of(context).primaryColor,
                                    ),
                                    child: const Text('Create Hallmark'),
                                  ),
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
                          // Hallmarks
                          const Text(
                            'Hallmarks',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
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
                                      Text(
                                        hallmark.title,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 18,
                                        ),
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

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}

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
    required this.isLiked,
  });
}