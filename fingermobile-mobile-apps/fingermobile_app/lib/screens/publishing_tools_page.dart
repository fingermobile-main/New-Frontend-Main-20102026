import 'package:flutter/material.dart';

class PublishingToolsPage extends StatefulWidget {
  const PublishingToolsPage({super.key});

  @override
  State<PublishingToolsPage> createState() => _PublishingToolsPageState();
}

class _PublishingToolsPageState extends State<PublishingToolsPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<Tool> _tools = [];
  List<ToolCategory> _categories = [];
  String _selectedCategory = 'all';
  ToolSortOption _sortOption = ToolSortOption.name;

  @override
  void initState() {
    super.initState();
    _loadTools();
  }

  Future<void> _loadTools() async {
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
          ToolCategory(id: 'all', name: 'All Tools'),
          ToolCategory(id: 'content', name: 'Content Creation'),
          ToolCategory(id: 'analytics', name: 'Analytics'),
          ToolCategory(id: 'seo', name: 'SEO Tools'),
          ToolCategory(id: 'social', name: 'Social Media'),
          ToolCategory(id: 'marketing', name: 'Marketing'),
        ];

        // Mock tools
        _tools = [
          Tool(
            id: 1,
            name: 'Content Scheduler',
            description: 'Schedule and manage your content publishing across multiple platforms',
            icon: Icons.schedule,
            category: 'content',
            usageCount: 1250,
            lastUsed: DateTime.now().subtract(const Duration(days: 1)),
            isFeatured: true,
            tags: ['schedule', 'content', 'publishing'],
          ),
          Tool(
            id: 2,
            name: 'Audience Analytics',
            description: 'Analyze your audience demographics and engagement metrics',
            icon: Icons.analytics,
            category: 'analytics',
            usageCount: 890,
            lastUsed: DateTime.now().subtract(const Duration(hours: 5)),
            isFeatured: true,
            tags: ['analytics', 'audience', 'demographics'],
          ),
          Tool(
            id: 3,
            name: 'SEO Optimizer',
            description: 'Optimize your content for search engines with keyword suggestions',
            icon: Icons.search,
            category: 'seo',
            usageCount: 2100,
            lastUsed: DateTime.now().subtract(const Duration(days: 3)),
            isFeatured: false,
            tags: ['seo', 'keywords', 'optimization'],
          ),
          Tool(
            id: 4,
            name: 'Social Media Manager',
            description: 'Manage all your social media accounts from one place',
            icon: Icons.share,
            category: 'social',
            usageCount: 1560,
            lastUsed: DateTime.now().subtract(const Duration(days: 2)),
            isFeatured: false,
            tags: ['social', 'media', 'management'],
          ),
          Tool(
            id: 5,
            name: 'Email Campaign Builder',
            description: 'Create and send email campaigns to your subscribers',
            icon: Icons.email,
            category: 'marketing',
            usageCount: 750,
            lastUsed: DateTime.now().subtract(const Duration(days: 7)),
            isFeatured: true,
            tags: ['email', 'campaign', 'marketing'],
          ),
          Tool(
            id: 6,
            name: 'Content Editor',
            description: 'Rich text editor with formatting and media embedding capabilities',
            icon: Icons.edit,
            category: 'content',
            usageCount: 3200,
            lastUsed: DateTime.now().subtract(const Duration(minutes: 30)),
            isFeatured: true,
            tags: ['editor', 'content', 'formatting'],
          ),
          Tool(
            id: 7,
            name: 'Performance Dashboard',
            description: 'Monitor the performance of your published content',
            icon: Icons.dashboard,
            category: 'analytics',
            usageCount: 980,
            lastUsed: DateTime.now().subtract(const Duration(hours: 2)),
            isFeatured: false,
            tags: ['dashboard', 'performance', 'monitoring'],
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load publishing tools. Please try again.';
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

  void _changeSort(ToolSortOption option) {
    setState(() {
      _sortOption = option;
    });
  }

  void _useTool(Tool tool) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Opening ${tool.name}'),
        backgroundColor: Theme.of(context).primaryColor,
      ),
    );
  }

  void _viewToolDetails(Tool tool) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildToolDetailsSheet(tool),
    );
  }

  Widget _buildToolDetailsSheet(Tool tool) {
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
                  tool.name,
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
            height: 100,
            decoration: BoxDecoration(
              color: Theme.of(context).primaryColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              tool.icon,
              size: 50,
              color: Theme.of(context).primaryColor,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            tool.description,
            style: const TextStyle(
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              const Icon(Icons.bar_chart, size: 16, color: Colors.grey),
              const SizedBox(width: 4),
              Text('${tool.usageCount} times used'),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.access_time, size: 16, color: Colors.grey),
              const SizedBox(width: 4),
              Text('Last used: ${_formatRelativeTime(tool.lastUsed)}'),
            ],
          ),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8.0,
            children: tool.tags
                .map(
                  (tag) => Chip(
                    label: Text(tag),
                    backgroundColor: Colors.grey[300],
                  ),
                )
                .toList(),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                _useTool(tool);
              },
              child: Text('Use ${tool.name}'),
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
        title: const Text('Publishing Tools'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadTools,
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
        onRefresh: _loadTools,
        child: _isLoading && _tools.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _tools.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadTools,
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
                                _buildStatItem('Total Tools', '${_tools.length}'),
                                _buildStatItem(
                                    'Active Today', '${_tools.where((tool) => _isUsedToday(tool.lastUsed)).length}'),
                                _buildStatItem('Total Uses',
                                    '${_tools.fold(0, (sum, tool) => sum + tool.usageCount)}'),
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
                              '${_tools.length} tools available',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            PopupMenuButton<ToolSortOption>(
                              icon: const Icon(Icons.sort),
                              onSelected: _changeSort,
                              itemBuilder: (BuildContext context) {
                                return [
                                  const PopupMenuItem(
                                    value: ToolSortOption.name,
                                    child: Text('Name (A-Z)'),
                                  ),
                                  const PopupMenuItem(
                                    value: ToolSortOption.usage,
                                    child: Text('Most Used'),
                                  ),
                                  const PopupMenuItem(
                                    value: ToolSortOption.recent,
                                    child: Text('Recently Used'),
                                  ),
                                ];
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // Tools List
                        Expanded(
                          child: GridView.builder(
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              crossAxisSpacing: 16,
                              mainAxisSpacing: 16,
                              childAspectRatio: 0.9,
                            ),
                            itemCount: _tools.length,
                            itemBuilder: (context, index) {
                              var tool = _tools[index];
                              return Card(
                                child: InkWell(
                                  onTap: () => _viewToolDetails(tool),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(16),
                                        decoration: BoxDecoration(
                                          color: Theme.of(context).primaryColor.withOpacity(0.1),
                                          shape: BoxShape.circle,
                                        ),
                                        child: Icon(
                                          tool.icon,
                                          size: 40,
                                          color: Theme.of(context).primaryColor,
                                        ),
                                      ),
                                      const SizedBox(height: 16),
                                      Text(
                                        tool.name,
                                        textAlign: TextAlign.center,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        '${tool.usageCount} uses',
                                        style: const TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      if (tool.isFeatured)
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
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
                                      const SizedBox(height: 8),
                                      SizedBox(
                                        width: double.infinity,
                                        child: Padding(
                                          padding: const EdgeInsets.symmetric(horizontal: 8.0),
                                          child: ElevatedButton(
                                            onPressed: () => _useTool(tool),
                                            child: const Text('Use'),
                                          ),
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

  bool _isUsedToday(DateTime dateTime) {
    final now = DateTime.now();
    return dateTime.year == now.year &&
        dateTime.month == now.month &&
        dateTime.day == now.day;
  }

  String _formatRelativeTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes} minutes ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours} hours ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return '${dateTime.month}/${dateTime.day}/${dateTime.year}';
    }
  }
}

enum ToolSortOption { name, usage, recent }

class ToolCategory {
  final String id;
  final String name;

  ToolCategory({
    required this.id,
    required this.name,
  });
}

class Tool {
  final int id;
  final String name;
  final String description;
  final IconData icon;
  final String category;
  final int usageCount;
  final DateTime lastUsed;
  final bool isFeatured;
  final List<String> tags;

  Tool({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.category,
    required this.usageCount,
    required this.lastUsed,
    required this.isFeatured,
    required this.tags,
  });
}