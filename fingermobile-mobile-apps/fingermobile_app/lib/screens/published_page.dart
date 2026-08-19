dimport 'package:flutter/material.dart';

class PublishedPage extends StatefulWidget {
  const PublishedPage({super.key});

  @override
  State<PublishedPage> createState() => _PublishedPageState();
}

class _PublishedPageState extends State<PublishedPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<Publication> _publications = [];
  List<PublicationCategory> _categories = [];
  String _selectedCategory = 'all';
  PublicationSortOption _sortOption = PublicationSortOption.newest;
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadPublications();
  }

  Future<void> _loadPublications() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock categories
      setState(() {
        _categories = [
          PublicationCategory(id: 'all', name: 'All Publications'),
          PublicationCategory(id: 'articles', name: 'Articles'),
          PublicationCategory(id: 'blogs', name: 'Blogs'),
          PublicationCategory(id: 'news', name: 'News'),
          PublicationCategory(id: 'reports', name: 'Reports'),
          PublicationCategory(id: 'whitepapers', name: 'White Papers'),
        ];

        // Mock publications
        _publications = [
          Publication(
            id: 1,
            title: 'The Future of Mobile Technology',
            description: 'Exploring the latest trends and innovations in mobile technology',
            content: 'Mobile technology continues to evolve at a rapid pace...',
            imageUrl: 'https://via.placeholder.com/400x200/4ECDC4/FFFFFF?text=Mobile+Tech',
            category: 'articles',
            author: 'Jane Smith',
            authorAvatar: 'https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=JS',
            publishDate: DateTime.now().subtract(const Duration(days: 5)),
            views: 1250,
            likes: 89,
            comments: 24,
            shares: 15,
            isFeatured: true,
            tags: ['mobile', 'technology', 'innovation'],
          ),
          Publication(
            id: 2,
            title: 'Building Scalable Web Applications',
            description: 'Best practices for developing scalable web applications',
            content: 'Scalability is a critical factor in modern web development...',
            imageUrl: 'https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=Web+Apps',
            category: 'blogs',
            author: 'John Doe',
            authorAvatar: 'https://via.placeholder.com/50x50/FF6B6B/FFFFFF?text=JD',
            publishDate: DateTime.now().subtract(const Duration(days: 10)),
            views: 890,
            likes: 67,
            comments: 18,
            shares: 9,
            isFeatured: false,
            tags: ['web', 'scalability', 'development'],
          ),
          Publication(
            id: 3,
            title: 'Quarterly Financial Report Q3 2023',
            description: 'Detailed analysis of our financial performance in Q3 2023',
            content: 'Our financial performance in Q3 2023 showed significant growth...',
            imageUrl: 'https://via.placeholder.com/400x200/45B7D1/FFFFFF?text=Financial+Report',
            category: 'reports',
            author: 'Finance Team',
            authorAvatar: 'https://via.placeholder.com/50x50/45B7D1/FFFFFF?text=FT',
            publishDate: DateTime.now().subtract(const Duration(days: 15)),
            views: 560,
            likes: 23,
            comments: 7,
            shares: 3,
            isFeatured: true,
            tags: ['finance', 'report', 'q3-2023'],
          ),
          Publication(
            id: 4,
            title: 'AI in Healthcare: Current Applications',
            description: 'How artificial intelligence is transforming healthcare',
            content: 'Artificial intelligence is revolutionizing the healthcare industry...',
            imageUrl: 'https://via.placeholder.com/400x200/96CEB4/FFFFFF?text=AI+Healthcare',
            category: 'whitepapers',
            author: 'Research Department',
            authorAvatar: 'https://via.placeholder.com/50x50/96CEB4/FFFFFF?text=RD',
            publishDate: DateTime.now().subtract(const Duration(days: 20)),
            views: 2100,
            likes: 156,
            comments: 42,
            shares: 28,
            isFeatured: false,
            tags: ['ai', 'healthcare', 'research'],
          ),
          Publication(
            id: 5,
            title: 'New Partnership Announcement',
            description: 'We are excited to announce a strategic partnership',
            content: 'Today we are proud to announce a new strategic partnership...',
            imageUrl: 'https://via.placeholder.com/400x200/FFEAA7/000000?text=Partnership',
            category: 'news',
            author: 'PR Team',
            authorAvatar: 'https://via.placeholder.com/50x50/FFEAA7/000000?text=PT',
            publishDate: DateTime.now().subtract(const Duration(days: 2)),
            views: 3400,
            likes: 210,
            comments: 68,
            shares: 89,
            isFeatured: true,
            tags: ['partnership', 'announcement', 'news'],
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load publications. Please try again.';
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

  void _changeSort(PublicationSortOption option) {
    setState(() {
      _sortOption = option;
    });
  }

  void _changeTab(int index) {
    setState(() {
      _activeTab = index;
    });
  }

  void _viewPublication(Publication publication) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildPublicationDetailsSheet(publication),
    );
  }

  void _editPublication(Publication publication) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Editing ${publication.title}'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _deletePublication(Publication publication) {
    setState(() {
      _publications.removeWhere((p) => p.id == publication.id);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Deleted ${publication.title}'),
        backgroundColor: Colors.red,
      ),
    );
  }

  Widget _buildPublicationDetailsSheet(Publication publication) {
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
                  publication.title,
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
            height: 200,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(publication.imageUrl),
                fit: BoxFit.cover,
              ),
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundImage: NetworkImage(publication.authorAvatar),
              ),
              const SizedBox(width: 8),
              Text(
                publication.author,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Spacer(),
              Text(_formatDate(publication.publishDate)),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            publication.content,
            style: const TextStyle(
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8.0,
            children: publication.tags
                .map(
                  (tag) => Chip(
                    label: Text(tag),
                    backgroundColor: Colors.grey[300],
                  ),
                )
                .toList(),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _buildInteractionButton(Icons.visibility, '${publication.views}'),
              _buildInteractionButton(Icons.thumb_up, '${publication.likes}'),
              _buildInteractionButton(Icons.comment, '${publication.comments}'),
              _buildInteractionButton(Icons.share, '${publication.shares}'),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton.icon(
                onPressed: () => _editPublication(publication),
                icon: const Icon(Icons.edit),
                label: const Text('Edit'),
              ),
              const SizedBox(width: 8),
              TextButton.icon(
                onPressed: () => _deletePublication(publication),
                icon: const Icon(Icons.delete),
                label: const Text('Delete'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInteractionButton(IconData icon, String count) {
    return Row(
      children: [
        Icon(icon, size: 18),
        const SizedBox(width: 4),
        Text(count),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Published Content'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadPublications,
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              // Show filter options
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadPublications,
        child: _isLoading && _publications.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _publications.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadPublications,
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
                        // Stats Summary
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                _buildStatItem('Total', '${_publications.length}'),
                                _buildStatItem(
                                    'Views', '${_publications.fold(0, (sum, pub) => sum + pub.views)}'),
                                _buildStatItem(
                                    'Likes', '${_publications.fold(0, (sum, pub) => sum + pub.likes)}'),
                                _buildStatItem(
                                    'Comments', '${_publications.fold(0, (sum, pub) => sum + pub.comments)}'),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Tabs
                        Container(
                          height: 50,
                          decoration: BoxDecoration(
                            color: Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(25),
                          ),
                          child: Row(
                            children: [
                              _buildTab('List', 0),
                              _buildTab('Grid', 1),
                            ],
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Categories
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
                        // Sort and Results Info
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${_publications.length} publications',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            PopupMenuButton<PublicationSortOption>(
                              icon: const Icon(Icons.sort),
                              onSelected: _changeSort,
                              itemBuilder: (BuildContext context) {
                                return [
                                  const PopupMenuItem(
                                    value: PublicationSortOption.newest,
                                    child: Text('Newest First'),
                                  ),
                                  const PopupMenuItem(
                                    value: PublicationSortOption.oldest,
                                    child: Text('Oldest First'),
                                  ),
                                  const PopupMenuItem(
                                    value: PublicationSortOption.views,
                                    child: Text('Most Viewed'),
                                  ),
                                  const PopupMenuItem(
                                    value: PublicationSortOption.likes,
                                    child: Text('Most Liked'),
                                  ),
                                  const PopupMenuItem(
                                    value: PublicationSortOption.comments,
                                    child: Text('Most Commented'),
                                  ),
                                ];
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // Publications List
                        Expanded(
                          child: _activeTab == 0
                              ? ListView.builder(
                                  itemCount: _publications.length,
                                  itemBuilder: (context, index) {
                                    var publication = _publications[index];
                                    return Card(
                                      margin: const EdgeInsets.only(bottom: 16),
                                      child: InkWell(
                                        onTap: () => _viewPublication(publication),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Container(
                                              height: 150,
                                              decoration: BoxDecoration(
                                                image: DecorationImage(
                                                  image: NetworkImage(publication.imageUrl),
                                                  fit: BoxFit.cover,
                                                ),
                                              ),
                                            ),
                                            Padding(
                                              padding: const EdgeInsets.all(16.0),
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Row(
                                                    children: [
                                                      CircleAvatar(
                                                        radius: 15,
                                                        backgroundImage:
                                                            NetworkImage(publication.authorAvatar),
                                                      ),
                                                      const SizedBox(width: 8),
                                                      Text(
                                                        publication.author,
                                                        style: const TextStyle(
                                                          fontWeight: FontWeight.bold,
                                                        ),
                                                      ),
                                                      const Spacer(),
                                                      if (publication.isFeatured)
                                                        Container(
                                                          padding: const EdgeInsets.symmetric(
                                                              horizontal: 8, vertical: 4),
                                                          decoration: BoxDecoration(
                                                            color: Colors.red,
                                                            borderRadius: BorderRadius.circular(12),
                                                          ),
                                                          child: const Text(
                                                            'Featured',
                                                            style: TextStyle(
                                                              color: Colors.white,
                                                              fontSize: 10,
                                                            ),
                                                          ),
                                                        ),
                                                    ],
                                                  ),
                                                  const SizedBox(height: 8),
                                                  Text(
                                                    publication.title,
                                                    style: const TextStyle(
                                                      fontWeight: FontWeight.bold,
                                                      fontSize: 18,
                                                    ),
                                                  ),
                                                  const SizedBox(height: 8),
                                                  Text(
                                                    publication.description,
                                                    style: const TextStyle(
                                                      color: Colors.grey,
                                                    ),
                                                    maxLines: 2,
                                                    overflow: TextOverflow.ellipsis,
                                                  ),
                                                  const SizedBox(height: 16),
                                                  Row(
                                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                    children: [
                                                      Text(_formatDate(publication.publishDate)),
                                                      Row(
                                                        children: [
                                                          _buildInteractionItem(
                                                              Icons.visibility, publication.views),
                                                          const SizedBox(width: 16),
                                                          _buildInteractionItem(
                                                              Icons.thumb_up, publication.likes),
                                                          const SizedBox(width: 16),
                                                          _buildInteractionItem(
                                                              Icons.comment, publication.comments),
                                                        ],
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
                                )
                              : GridView.builder(
                                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: 2,
                                    crossAxisSpacing: 16,
                                    mainAxisSpacing: 16,
                                    childAspectRatio: 0.8,
                                  ),
                                  itemCount: _publications.length,
                                  itemBuilder: (context, index) {
                                    var publication = _publications[index];
                                    return Card(
                                      child: InkWell(
                                        onTap: () => _viewPublication(publication),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Container(
                                              height: 100,
                                              decoration: BoxDecoration(
                                                image: DecorationImage(
                                                  image: NetworkImage(publication.imageUrl),
                                                  fit: BoxFit.cover,
                                                ),
                                                borderRadius: const BorderRadius.vertical(
                                                  top: Radius.circular(12),
                                                ),
                                              ),
                                            ),
                                            Padding(
                                              padding: const EdgeInsets.all(8.0),
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    publication.title,
                                                    style: const TextStyle(
                                                      fontWeight: FontWeight.bold,
                                                    ),
                                                    maxLines: 2,
                                                    overflow: TextOverflow.ellipsis,
                                                  ),
                                                  const SizedBox(height: 4),
                                                  Row(
                                                    children: [
                                                      CircleAvatar(
                                                        radius: 10,
                                                        backgroundImage:
                                                            NetworkImage(publication.authorAvatar),
                                                      ),
                                                      const SizedBox(width: 4),
                                                      Expanded(
                                                        child: Text(
                                                          publication.author,
                                                          style: const TextStyle(
                                                            fontSize: 12,
                                                          ),
                                                          maxLines: 1,
                                                          overflow: TextOverflow.ellipsis,
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  const SizedBox(height: 4),
                                                  Row(
                                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                    children: [
                                                      _buildSmallInteractionItem(
                                                          Icons.visibility, publication.views),
                                                      _buildSmallInteractionItem(
                                                          Icons.thumb_up, publication.likes),
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
                        ),
                      ],
                    ),
                  ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Theme.of(context).primaryColor,
        child: const Icon(Icons.add),
        onPressed: () {
          // Create new publication
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Create new publication functionality would open here'),
              backgroundColor: Colors.blue,
            ),
          );
        },
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

  Widget _buildInteractionItem(IconData icon, int count) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey),
        const SizedBox(width: 4),
        Text(
          '$count',
          style: const TextStyle(
            fontSize: 12,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }

  Widget _buildSmallInteractionItem(IconData icon, int count) {
    return Row(
      children: [
        Icon(icon, size: 12, color: Colors.grey),
        const SizedBox(width: 2),
        Text(
          '$count',
          style: const TextStyle(
            fontSize: 10,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}

enum PublicationSortOption { newest, oldest, views, likes, comments }

class PublicationCategory {
  final String id;
  final String name;

  PublicationCategory({
    required this.id,
    required this.name,
  });
}

class Publication {
  final int id;
  final String title;
  final String description;
  final String content;
  final String imageUrl;
  final String category;
  final String author;
  final String authorAvatar;
  final DateTime publishDate;
  final int views;
  final int likes;
  final int comments;
  final int shares;
  final bool isFeatured;
  final List<String> tags;

  Publication({
    required this.id,
    required this.title,
    required this.description,
    required this.content,
    required this.imageUrl,
    required this.category,
    required this.author,
    required this.authorAvatar,
    required this.publishDate,
    required this.views,
    required this.likes,
    required this.comments,
    required this.shares,
    required this.isFeatured,
    required this.tags,
  });
}