import 'package:flutter/material.dart';

class StercsMediaLibraryPage extends StatefulWidget {
  const StercsMediaLibraryPage({super.key});

  @override
  State<StercsMediaLibraryPage> createState() => _StercsMediaLibraryPageState();
}

class _StercsMediaLibraryPageState extends State<StercsMediaLibraryPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<MediaAsset> _mediaAssets = [];
  List<MediaCategory> _categories = [];
  String _selectedCategory = 'all';
  MediaSortOption _sortOption = MediaSortOption.newest;
  MediaTypeFilter _mediaTypeFilter = MediaTypeFilter.all;

  @override
  void initState() {
    super.initState();
    _loadMediaAssets();
  }

  Future<void> _loadMediaAssets() async {
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
          MediaCategory(id: 'all', name: 'All Media'),
          MediaCategory(id: 'images', name: 'Images'),
          MediaCategory(id: 'videos', name: 'Videos'),
          MediaCategory(id: 'audio', name: 'Audio'),
          MediaCategory(id: 'documents', name: 'Documents'),
          MediaCategory(id: 'fonts', name: 'Fonts'),
        ];

        // Mock media assets
        _mediaAssets = [
          MediaAsset(
            id: 1,
            name: 'Mountain Landscape',
            description: 'Beautiful mountain landscape photo',
            url: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Mountains',
            thumbnailUrl: 'https://via.placeholder.com/100x100/4ECDC4/FFFFFF?text=MTN',
            type: MediaType.image,
            size: '2.4 MB',
            dimensions: '1920x1080',
            uploadDate: DateTime.now().subtract(const Duration(days: 5)),
            tags: ['nature', 'landscape', 'mountain'],
          ),
          MediaAsset(
            id: 2,
            name: 'Product Demo Video',
            description: 'Demonstration of our latest product features',
            url: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Video',
            thumbnailUrl: 'https://via.placeholder.com/100x100/FF6B6B/FFFFFF?text=VID',
            type: MediaType.video,
            size: '45.2 MB',
            dimensions: '1920x1080',
            uploadDate: DateTime.now().subtract(const Duration(days: 10)),
            tags: ['product', 'demo', 'features'],
          ),
          MediaAsset(
            id: 3,
            name: 'Company Logo',
            description: 'Official company logo in vector format',
            url: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Logo',
            thumbnailUrl: 'https://via.placeholder.com/100x100/45B7D1/FFFFFF?text=LOGO',
            type: MediaType.image,
            size: '1.1 MB',
            dimensions: '512x512',
            uploadDate: DateTime.now().subtract(const Duration(days: 15)),
            tags: ['logo', 'brand', 'vector'],
          ),
          MediaAsset(
            id: 4,
            name: 'Background Music',
            description: 'Royalty-free background music track',
            url: 'https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=Music',
            thumbnailUrl: 'https://via.placeholder.com/100x100/96CEB4/FFFFFF?text=MUS',
            type: MediaType.audio,
            size: '5.7 MB',
            dimensions: '',
            uploadDate: DateTime.now().subtract(const Duration(days: 20)),
            tags: ['music', 'background', 'royalty-free'],
          ),
          MediaAsset(
            id: 5,
            name: 'Project Presentation',
            description: 'Slide deck for quarterly presentation',
            url: 'https://via.placeholder.com/300x200/FFEAA7/000000?text=Slides',
            thumbnailUrl: 'https://via.placeholder.com/100x100/FFEAA7/000000?text=SLD',
            type: MediaType.document,
            size: '3.2 MB',
            dimensions: '',
            uploadDate: DateTime.now().subtract(const Duration(days: 2)),
            tags: ['presentation', 'quarterly', 'slides'],
          ),
          MediaAsset(
            id: 6,
            name: 'Modern Sans Font',
            description: 'Clean and modern sans-serif font family',
            url: 'https://via.placeholder.com/300x200/DDA0DD/FFFFFF?text=Font',
            thumbnailUrl: 'https://via.placeholder.com/100x100/DDA0DD/FFFFFF?text=FNT',
            type: MediaType.font,
            size: '0.8 MB',
            dimensions: '',
            uploadDate: DateTime.now().subtract(const Duration(days: 8)),
            tags: ['font', 'typography', 'sans-serif'],
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load media assets. Please try again.';
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

  void _changeSort(MediaSortOption option) {
    setState(() {
      _sortOption = option;
    });
  }

  void _filterByMediaType(MediaTypeFilter filter) {
    setState(() {
      _mediaTypeFilter = filter;
    });
  }

  void _viewMediaAsset(MediaAsset asset) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildMediaAssetDetailsSheet(asset),
    );
  }

  void _editMediaAsset(MediaAsset asset) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Editing ${asset.name}'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _deleteMediaAsset(MediaAsset asset) {
    setState(() {
      _mediaAssets.removeWhere((a) => a.id == asset.id);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Deleted ${asset.name}'),
        backgroundColor: Colors.red,
      ),
    );
  }

  Widget _buildMediaAssetDetailsSheet(MediaAsset asset) {
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
                  asset.name,
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
                image: NetworkImage(asset.thumbnailUrl),
                fit: BoxFit.contain,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            asset.description,
            style: const TextStyle(
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 16),
          _buildInfoRow('Type', _getMediaTypeText(asset.type)),
          _buildInfoRow('Size', asset.size),
          if (asset.dimensions.isNotEmpty) _buildInfoRow('Dimensions', asset.dimensions),
          _buildInfoRow('Uploaded', _formatDate(asset.uploadDate)),
          const SizedBox(height: 16),
          Wrap(
            spacing: 8.0,
            children: asset.tags
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
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton.icon(
                onPressed: () => _editMediaAsset(asset),
                icon: const Icon(Icons.edit),
                label: const Text('Edit'),
              ),
              const SizedBox(width: 8),
              TextButton.icon(
                onPressed: () => _deleteMediaAsset(asset),
                icon: const Icon(Icons.delete),
                label: const Text('Delete'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Expanded(
            child: Text(value),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('STERCS Media Library'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadMediaAssets,
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
        onRefresh: _loadMediaAssets,
        child: _isLoading && _mediaAssets.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _mediaAssets.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadMediaAssets,
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
                                _buildStatItem('Total', '${_mediaAssets.length}'),
                                _buildStatItem(
                                    'Images', '${_mediaAssets.where((asset) => asset.type == MediaType.image).length}'),
                                _buildStatItem('Videos',
                                    '${_mediaAssets.where((asset) => asset.type == MediaType.video).length}'),
                                _buildStatItem('Storage',
                                    '${_mediaAssets.fold(0, (sum, asset) => sum + _parseFileSize(asset.size))} MB'),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Filters
                        Row(
                          children: [
                            Expanded(
                              child: SizedBox(
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
                            ),
                            PopupMenuButton<MediaTypeFilter>(
                              icon: const Icon(Icons.filter_alt),
                              onSelected: _filterByMediaType,
                              itemBuilder: (BuildContext context) {
                                return [
                                  const PopupMenuItem(
                                    value: MediaTypeFilter.all,
                                    child: Text('All Types'),
                                  ),
                                  const PopupMenuItem(
                                    value: MediaTypeFilter.images,
                                    child: Text('Images'),
                                  ),
                                  const PopupMenuItem(
                                    value: MediaTypeFilter.videos,
                                    child: Text('Videos'),
                                  ),
                                  const PopupMenuItem(
                                    value: MediaTypeFilter.audio,
                                    child: Text('Audio'),
                                  ),
                                  const PopupMenuItem(
                                    value: MediaTypeFilter.documents,
                                    child: Text('Documents'),
                                  ),
                                  const PopupMenuItem(
                                    value: MediaTypeFilter.fonts,
                                    child: Text('Fonts'),
                                  ),
                                ];
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        // Sort and Results Info
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${_mediaAssets.length} media assets',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            PopupMenuButton<MediaSortOption>(
                              icon: const Icon(Icons.sort),
                              onSelected: _changeSort,
                              itemBuilder: (BuildContext context) {
                                return [
                                  const PopupMenuItem(
                                    value: MediaSortOption.newest,
                                    child: Text('Newest First'),
                                  ),
                                  const PopupMenuItem(
                                    value: MediaSortOption.oldest,
                                    child: Text('Oldest First'),
                                  ),
                                  const PopupMenuItem(
                                    value: MediaSortOption.name,
                                    child: Text('Name (A-Z)'),
                                  ),
                                  const PopupMenuItem(
                                    value: MediaSortOption.size,
                                    child: Text('Size'),
                                  ),
                                ];
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // Media Assets Grid
                        Expanded(
                          child: GridView.builder(
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              crossAxisSpacing: 16,
                              mainAxisSpacing: 16,
                              childAspectRatio: 0.8,
                            ),
                            itemCount: _mediaAssets.length,
                            itemBuilder: (context, index) {
                              var asset = _mediaAssets[index];
                              return Card(
                                child: InkWell(
                                  onTap: () => _viewMediaAsset(asset),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        height: 100,
                                        decoration: BoxDecoration(
                                          image: DecorationImage(
                                            image: NetworkImage(asset.thumbnailUrl),
                                            fit: BoxFit.cover,
                                          ),
                                        ),
                                      ),
                                      Padding(
                                        padding: const EdgeInsets.all(8.0),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              asset.name,
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                              ),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              _getMediaTypeText(asset.type),
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: Colors.grey,
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              asset.size,
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: Colors.grey,
                                              ),
                                            ),
                                            const SizedBox(height: 8),
                                            Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                              children: [
                                                Text(
                                                  _formatRelativeTime(asset.uploadDate),
                                                  style: const TextStyle(
                                                    fontSize: 10,
                                                    color: Colors.grey,
                                                  ),
                                                ),
                                                PopupMenuButton<String>(
                                                  icon: const Icon(Icons.more_vert, size: 20),
                                                  onSelected: (String result) {
                                                    switch (result) {
                                                      case 'edit':
                                                        _editMediaAsset(asset);
                                                        break;
                                                      case 'delete':
                                                        _deleteMediaAsset(asset);
                                                        break;
                                                    }
                                                  },
                                                  itemBuilder: (BuildContext context) =>
                                                      <PopupMenuEntry<String>>[
                                                    const PopupMenuItem<String>(
                                                      value: 'edit',
                                                      child: Text('Edit'),
                                                    ),
                                                    const PopupMenuItem<String>(
                                                      value: 'delete',
                                                      child: Text('Delete'),
                                                    ),
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
          // Upload new media asset
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Upload new media asset functionality would open here'),
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

  String _getMediaTypeText(MediaType type) {
    switch (type) {
      case MediaType.image:
        return 'Image';
      case MediaType.video:
        return 'Video';
      case MediaType.audio:
        return 'Audio';
      case MediaType.document:
        return 'Document';
      case MediaType.font:
        return 'Font';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }

  String _formatRelativeTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes} min ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours} hrs ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return '${dateTime.month}/${dateTime.day}/${dateTime.year}';
    }
  }

  int _parseFileSize(String size) {
    // Simple parser for file size in format "X.X MB"
    try {
      return int.parse(size.split(' ')[0].split('.')[0]);
    } catch (e) {
      return 0;
    }
  }
}

enum MediaSortOption { newest, oldest, name, size }
enum MediaTypeFilter { all, images, videos, audio, documents, fonts }

class MediaCategory {
  final String id;
  final String name;

  MediaCategory({
    required this.id,
    required this.name,
  });
}

class MediaAsset {
  final int id;
  final String name;
  final String description;
  final String url;
  final String thumbnailUrl;
  final MediaType type;
  final String size;
  final String dimensions;
  final DateTime uploadDate;
  final List<String> tags;

  MediaAsset({
    required this.id,
    required this.name,
    required this.description,
    required this.url,
    required this.thumbnailUrl,
    required this.type,
    required this.size,
    required this.dimensions,
    required this.uploadDate,
    required this.tags,
  });
}

enum MediaType { image, video, audio, document, font }