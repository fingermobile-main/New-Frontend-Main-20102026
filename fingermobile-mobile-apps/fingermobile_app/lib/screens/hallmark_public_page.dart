import 'package:flutter/material.dart';

class HallmarkPublicPage extends StatefulWidget {
  const HallmarkPublicPage({super.key});

  @override
  State<HallmarkPublicPage> createState() => _HallmarkPublicPageState();
}

class _HallmarkPublicPageState extends State<HallmarkPublicPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<PublicHallmark> _hallmarks = [];
  List<HallmarkCategory> _categories = [];
  String _selectedCategory = 'all';
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadPublicHallmarks();
  }

  Future<void> _loadPublicHallmarks() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock public hallmark data
      setState(() {
        _categories = [
          HallmarkCategory(id: 'all', name: 'All Hallmarks'),
          HallmarkCategory(id: 'achievements', name: 'Achievements'),
          HallmarkCategory(id: 'experiences', name: 'Experiences'),
          HallmarkCategory(id: 'milestones', name: 'Milestones'),
          HallmarkCategory(id: 'memories', name: 'Memories'),
        ];

        _hallmarks = [
          PublicHallmark(
            id: 1,
            title: 'Mountain Summit Achievement',
            description: 'Reached the summit of Mount Kilimanjaro with my hiking group',
            date: DateTime.now().subtract(const Duration(days: 15)),
            category: 'achievements',
            imageUrl: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Mountain+Summit',
            likes: 245,
            comments: 32,
            author: HallmarkAuthor(
              id: 1,
              name: 'Alex Johnson',
              avatarUrl: 'https://via.placeholder.com/50/FF6B6B/FFFFFF?text=AJ',
            ),
            isLiked: false,
          ),
          PublicHallmark(
            id: 2,
            title: 'Wedding Anniversary',
            description: 'Celebrating 25 wonderful years together',
            date: DateTime.now().subtract(const Duration(days: 8)),
            category: 'milestones',
            imageUrl: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Anniversary',
            likes: 178,
            comments: 24,
            author: HallmarkAuthor(
              id: 2,
              name: 'Sarah Williams',
              avatarUrl: 'https://via.placeholder.com/50/45B7D1/FFFFFF?text=SW',
            ),
            isLiked: true,
          ),
          PublicHallmark(
            id: 3,
            title: 'Art Exhibition Opening',
            description: 'My paintings are now on display at the city art gallery',
            date: DateTime.now().subtract(const Duration(days: 5)),
            category: 'achievements',
            imageUrl: 'https://via.placeholder.com/300x200/F9CA24/FFFFFF?text=Art+Exhibition',
            likes: 312,
            comments: 41,
            author: HallmarkAuthor(
              id: 3,
              name: 'Michael Chen',
              avatarUrl: 'https://via.placeholder.com/50/6C5CE7/FFFFFF?text=MC',
            ),
            isLiked: false,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load public hallmarks. Please try again.';
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
        title: const Text('Public Hallmarks'),
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
        onRefresh: _loadPublicHallmarks,
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
                          onPressed: _loadPublicHallmarks,
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
                          // Introduction Banner
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
                                    'Public Hallmarks',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 28,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    'Discover and celebrate memorable moments from our community',
                                    style: TextStyle(
                                      color: Colors.white70,
                                      fontSize: 16,
                                    ),
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
                          // Public Hallmarks
                          const Text(
                            'Community Highlights',
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
                                      // Author Info
                                      Row(
                                        children: [
                                          CircleAvatar(
                                            backgroundImage: NetworkImage(hallmark.author.avatarUrl),
                                          ),
                                          const SizedBox(width: 16),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  hallmark.author.name,
                                                  style: const TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                                const SizedBox(height: 4),
                                                Text(
                                                  _formatDate(hallmark.date),
                                                  style: const TextStyle(
                                                    color: Colors.grey,
                                                    fontSize: 12,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 16),
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
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 12,
                                              vertical: 6,
                                            ),
                                            decoration: BoxDecoration(
                                              color: Colors.grey.shade200,
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: Text(
                                              _getCategoryName(hallmark.category),
                                              style: const TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.bold,
                                              ),
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

  String _getCategoryName(String categoryId) {
    switch (categoryId) {
      case 'achievements':
        return 'Achievement';
      case 'experiences':
        return 'Experience';
      case 'milestones':
        return 'Milestone';
      case 'memories':
        return 'Memory';
      default:
        return 'General';
    }
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

class PublicHallmark {
  final int id;
  final String title;
  final String description;
  final DateTime date;
  final String category;
  final String imageUrl;
  final int likes;
  final int comments;
  final HallmarkAuthor author;
  bool isLiked;

  PublicHallmark({
    required this.id,
    required this.title,
    required this.description,
    required this.date,
    required this.category,
    required this.imageUrl,
    required this.likes,
    required this.comments,
    required this.author,
    required this.isLiked,
  });
}

class HallmarkAuthor {
  final int id;
  final String name;
  final String avatarUrl;

  HallmarkAuthor({
    required this.id,
    required this.name,
    required this.avatarUrl,
  });
}