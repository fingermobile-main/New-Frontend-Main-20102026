import 'package:flutter/material.dart';

class SeadsPage extends StatefulWidget {
  const SeadsPage({super.key});

  @override
  State<SeadsPage> createState() => _SeadsPageState();
}

class _SeadsPageState extends State<SeadsPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<Sead> _seads = [];
  List<SeadCategory> _categories = [];
  String _selectedCategory = 'all';
  SeadSortOption _sortOption = SeadSortOption.newest;

  @override
  void initState() {
    super.initState();
    _loadSeads();
  }

  Future<void> _loadSeads() async {
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
          SeadCategory(id: 'all', name: 'All SEADs'),
          SeadCategory(id: 'technology', name: 'Technology'),
          SeadCategory(id: 'health', name: 'Health & Wellness'),
          SeadCategory(id: 'education', name: 'Education'),
          SeadCategory(id: 'environment', name: 'Environment'),
          SeadCategory(id: 'business', name: 'Business'),
        ];

        // Mock SEADs
        _seads = [
          Sead(
            id: 1,
            title: 'Digital Transformation Strategy',
            description: 'Comprehensive approach to digitizing business operations',
            content: 'This SEAD outlines a step-by-step approach to digital transformation...',
            imageUrl: 'https://via.placeholder.com/400x200/4ECDC4/FFFFFF?text=Digital+Transformation',
            category: 'technology',
            author: 'Tech Solutions Inc.',
            authorAvatar: 'https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=TS',
            publishDate: DateTime.now().subtract(const Duration(days: 5)),
            views: 1250,
            likes: 89,
            comments: 24,
            shares: 15,
            isFeatured: true,
            tags: ['digital', 'transformation', 'strategy'],
            version: '1.2.0',
            status: SeadStatus.published,
          ),
          Sead(
            id: 2,
            title: 'Mental Health Awareness Program',
            description: 'Program to promote mental wellness in the workplace',
            content: 'This SEAD presents a comprehensive mental health awareness program...',
            imageUrl: 'https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=Mental+Health',
            category: 'health',
            author: 'Wellness Experts',
            authorAvatar: 'https://via.placeholder.com/50x50/FF6B6B/FFFFFF?text=WE',
            publishDate: DateTime.now().subtract(const Duration(days: 10)),
            views: 890,
            likes: 67,
            comments: 18,
            shares: 9,
            isFeatured: false,
            tags: ['mental', 'health', 'wellness'],
            version: '2.1.0',
            status: SeadStatus.draft,
          ),
          Sead(
            id: 3,
            title: 'Sustainable Energy Solutions',
            description: 'Innovative approaches to renewable energy adoption',
            content: 'This SEAD explores cutting-edge sustainable energy solutions...',
            imageUrl: 'https://via.placeholder.com/400x200/45B7D1/FFFFFF?text=Sustainable+Energy',
            category: 'environment',
            author: 'Green Tech Group',
            authorAvatar: 'https://via.placeholder.com/50x50/45B7D1/FFFFFF?text=GT',
            publishDate: DateTime.now().subtract(const Duration(days: 15)),
            views: 2100,
            likes: 156,
            comments: 42,
            shares: 28,
            isFeatured: true,
            tags: ['energy', 'sustainability', 'renewable'],
            version: '1.0.5',
            status: SeadStatus.published,
          ),
          Sead(
            id: 4,
            title: 'Online Learning Platforms',
            description: 'Best practices for effective remote education',
            content: 'This SEAD analyzes successful online learning platform implementations...',
            imageUrl: 'https://via.placeholder.com/400x200/96CEB4/FFFFFF?text=Online+Learning',
            category: 'education',
            author: 'Education Innovators',
            authorAvatar: 'https://via.placeholder.com/50x50/96CEB4/FFFFFF?text=EI',
            publishDate: DateTime.now().subtract(const Duration(days: 20)),
            views: 1780,
            likes: 112,
            comments: 35,
            shares: 22,
            isFeatured: false,
            tags: ['education', 'online', 'learning'],
            version: '3.0.1',
            status: SeadStatus.archived,
          ),
          Sead(
            id: 5,
            title: 'Customer Experience Optimization',
            description: 'Strategies to enhance customer satisfaction and loyalty',
            content: 'This SEAD provides actionable insights on customer experience optimization...',
            imageUrl: 'https://via.placeholder.com/400x200/FFEAA7/000000?text=Customer+Experience',
            category: 'business',
            author: 'Business Growth Partners',
            authorAvatar: 'https://via.placeholder.com/50x50/FFEAA7/000000?text=BG',
            publishDate: DateTime.now().subtract(const Duration(days: 2)),
            views: 950,
            likes: 78,
            comments: 16,
            shares: 12,
            isFeatured: true,
            tags: ['customer', 'experience', 'business'],
            version: '1.1.0',
            status: SeadStatus.published,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load SEADs. Please try again.';
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

  void _changeSort(SeadSortOption option) {
    setState(() {
      _sortOption = option;
    });
  }

  void _viewSead(Sead sead) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildSeadDetailsSheet(sead),
    );
  }

  void _editSead(Sead sead) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Editing ${sead.title}'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _deleteSead(Sead sead) {
    setState(() {
      _seads.removeWhere((s) => s.id == sead.id);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Deleted ${sead.title}'),
        backgroundColor: Colors.red,
      ),
    );
  }

  Widget _buildSeadDetailsSheet(Sead sead) {
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
                  sead.title,
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
                image: NetworkImage(sead.imageUrl),
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
                backgroundImage: NetworkImage(sead.authorAvatar),
              ),
              const SizedBox(width: 8),
              Text(
                sead.author,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: _getStatusColor(sead.status),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  _getStatusText(sead.status),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Version: ${sead.version}',
            style: const TextStyle(
              fontSize: 14,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            sead.content,
            style: const TextStyle(
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8.0,
            children: sead.tags
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
              _buildInteractionButton(Icons.visibility, '${sead.views}'),
              _buildInteractionButton(Icons.thumb_up, '${sead.likes}'),
              _buildInteractionButton(Icons.comment, '${sead.comments}'),
              _buildInteractionButton(Icons.share, '${sead.shares}'),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton.icon(
                onPressed: () => _editSead(sead),
                icon: const Icon(Icons.edit),
                label: const Text('Edit'),
              ),
              const SizedBox(width: 8),
              TextButton.icon(
                onPressed: () => _deleteSead(sead),
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
        title: const Text('SEADs'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadSeads,
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
        onRefresh: _loadSeads,
        child: _isLoading && _seads.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _seads.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadSeads,
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
                                _buildStatItem('Total', '${_seads.length}'),
                                _buildStatItem(
                                    'Published', '${_seads.where((sead) => sead.status == SeadStatus.published).length}'),
                                _buildStatItem('Views',
                                    '${_seads.fold(0, (sum, sead) => sum + sead.views)}'),
                                _buildStatItem('Likes',
                                    '${_seads.fold(0, (sum, sead) => sum + sead.likes)}'),
                              ],
                            ),
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
                              '${_seads.length} SEADs',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            PopupMenuButton<SeadSortOption>(
                              icon: const Icon(Icons.sort),
                              onSelected: _changeSort,
                              itemBuilder: (BuildContext context) {
                                return [
                                  const PopupMenuItem(
                                    value: SeadSortOption.newest,
                                    child: Text('Newest First'),
                                  ),
                                  const PopupMenuItem(
                                    value: SeadSortOption.oldest,
                                    child: Text('Oldest First'),
                                  ),
                                  const PopupMenuItem(
                                    value: SeadSortOption.views,
                                    child: Text('Most Viewed'),
                                  ),
                                  const PopupMenuItem(
                                    value: SeadSortOption.likes,
                                    child: Text('Most Liked'),
                                  ),
                                  const PopupMenuItem(
                                    value: SeadSortOption.comments,
                                    child: Text('Most Commented'),
                                  ),
                                ];
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // SEADs List
                        Expanded(
                          child: ListView.builder(
                            itemCount: _seads.length,
                            itemBuilder: (context, index) {
                              var sead = _seads[index];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 16),
                                child: InkWell(
                                  onTap: () => _viewSead(sead),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        height: 150,
                                        decoration: BoxDecoration(
                                          image: DecorationImage(
                                            image: NetworkImage(sead.imageUrl),
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
                                                  backgroundImage: NetworkImage(sead.authorAvatar),
                                                ),
                                                const SizedBox(width: 8),
                                                Text(
                                                  sead.author,
                                                  style: const TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                                const Spacer(),
                                                if (sead.isFeatured)
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
                                              sead.title,
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 18,
                                              ),
                                            ),
                                            const SizedBox(height: 8),
                                            Text(
                                              sead.description,
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
                                                Text(
                                                  'v${sead.version}',
                                                  style: const TextStyle(
                                                    fontSize: 12,
                                                    color: Colors.grey,
                                                  ),
                                                ),
                                                Container(
                                                  padding: const EdgeInsets.symmetric(
                                                      horizontal: 8, vertical: 4),
                                                  decoration: BoxDecoration(
                                                    color: _getStatusColor(sead.status),
                                                    borderRadius: BorderRadius.circular(12),
                                                  ),
                                                  child: Text(
                                                    _getStatusText(sead.status),
                                                    style: const TextStyle(
                                                      color: Colors.white,
                                                      fontSize: 10,
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 16),
                                            Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                              children: [
                                                Text(_formatDate(sead.publishDate)),
                                                Row(
                                                  children: [
                                                    _buildInteractionItem(
                                                        Icons.visibility, sead.views),
                                                    const SizedBox(width: 16),
                                                    _buildInteractionItem(
                                                        Icons.thumb_up, sead.likes),
                                                    const SizedBox(width: 16),
                                                    _buildInteractionItem(
                                                        Icons.comment, sead.comments),
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
          // Create new SEAD
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Create new SEAD functionality would open here'),
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

  Color _getStatusColor(SeadStatus status) {
    switch (status) {
      case SeadStatus.draft:
        return Colors.grey;
      case SeadStatus.published:
        return Colors.green;
      case SeadStatus.archived:
        return Colors.orange;
    }
  }

  String _getStatusText(SeadStatus status) {
    switch (status) {
      case SeadStatus.draft:
        return 'Draft';
      case SeadStatus.published:
        return 'Published';
      case SeadStatus.archived:
        return 'Archived';
    }
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

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}

enum SeadSortOption { newest, oldest, views, likes, comments }
enum SeadStatus { draft, published, archived }

class SeadCategory {
  final String id;
  final String name;

  SeadCategory({
    required this.id,
    required this.name,
  });
}

class Sead {
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
  final String version;
  final SeadStatus status;

  Sead({
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
    required this.version,
    required this.status,
  });
}