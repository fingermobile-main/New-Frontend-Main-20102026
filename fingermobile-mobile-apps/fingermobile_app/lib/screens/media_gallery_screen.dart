import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class MediaItem {
  final int id;
  final String url;
  final String type; // 'image' or 'video'
  final String caption;
  final DateTime createdAt;

  MediaItem({
    required this.id,
    required this.url,
    required this.type,
    required this.caption,
    required this.createdAt,
  });
}

class MediaGalleryScreen extends StatefulWidget {
  @override
  _MediaGalleryScreenState createState() => _MediaGalleryScreenState();
}

class _MediaGalleryScreenState extends State<MediaGalleryScreen> {
  List<MediaItem> _mediaItems = [];
  bool _isLoading = true;
  int _selectedFilter = 0; // 0: All, 1: Images, 2: Videos

  @override
  void initState() {
    super.initState();
    _loadMedia();
  }

  Future<void> _loadMedia() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _mediaItems = [
          MediaItem(
            id: 1,
            url: 'https://via.placeholder.com/400x400',
            type: 'image',
            caption: 'Beautiful sunset from my trip',
            createdAt: DateTime.now().subtract(Duration(days: 2)),
          ),
          MediaItem(
            id: 2,
            url: 'https://via.placeholder.com/400x400',
            type: 'image',
            caption: 'Loving this new coffee shop',
            createdAt: DateTime.now().subtract(Duration(days: 5)),
          ),
          MediaItem(
            id: 3,
            url: 'https://via.placeholder.com/400x400',
            type: 'video',
            caption: 'Quick video from the concert',
            createdAt: DateTime.now().subtract(Duration(days: 7)),
          ),
          MediaItem(
            id: 4,
            url: 'https://via.placeholder.com/400x400',
            type: 'image',
            caption: 'Working on a new project',
            createdAt: DateTime.now().subtract(Duration(days: 10)),
          ),
          MediaItem(
            id: 5,
            url: 'https://via.placeholder.com/400x400',
            type: 'image',
            caption: 'Weekend hike with friends',
            createdAt: DateTime.now().subtract(Duration(days: 12)),
          ),
          MediaItem(
            id: 6,
            url: 'https://via.placeholder.com/400x400',
            type: 'video',
            caption: 'Tried making this recipe today',
            createdAt: DateTime.now().subtract(Duration(days: 15)),
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading media: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading media')),
      );
    }
  }

  List<MediaItem> get filteredMedia {
    if (_selectedFilter == 0) return _mediaItems; // All
    if (_selectedFilter == 1) return _mediaItems.where((item) => item.type == 'image').toList(); // Images
    if (_selectedFilter == 2) return _mediaItems.where((item) => item.type == 'video').toList(); // Videos
    return _mediaItems;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Media Gallery'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Filter tabs
                Container(
                  height: 50,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: [
                      _buildFilterTab('All', 0),
                      _buildFilterTab('Images', 1),
                      _buildFilterTab('Videos', 2),
                    ],
                  ),
                ),
                
                // Gallery
                Expanded(
                  child: filteredMedia.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.photo_library,
                                size: 80,
                                color: Colors.grey[400],
                              ),
                              SizedBox(height: 16),
                              Text(
                                'No media yet',
                                style: TextStyle(
                                  fontSize: 20,
                                  color: Colors.grey[600],
                                ),
                              ),
                              SizedBox(height: 8),
                              Padding(
                                padding: EdgeInsets.symmetric(horizontal: 32),
                                child: Text(
                                  'Your photos and videos will appear here',
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    color: Colors.grey[500],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        )
                      : RefreshIndicator(
                          onRefresh: _loadMedia,
                          child: Padding(
                            padding: EdgeInsets.all(4),
                            child: GridView.builder(
                              gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 3,
                                crossAxisSpacing: 4,
                                mainAxisSpacing: 4,
                              ),
                              itemCount: filteredMedia.length,
                              itemBuilder: (context, index) {
                                final item = filteredMedia[index];
                                return _buildMediaItem(item);
                              },
                            ),
                          ),
                        ),
                ),
              ],
            ),
    );
  }

  Widget _buildFilterTab(String title, int index) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 8),
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedFilter = index;
          });
        },
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: _selectedFilter == index ? Colors.blue : Colors.grey[200],
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            title,
            style: TextStyle(
              color: _selectedFilter == index ? Colors.white : Colors.grey[700],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMediaItem(MediaItem item) {
    return GestureDetector(
      onTap: () {
        _openMediaDetail(item);
      },
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(8),
          color: Colors.grey[300],
        ),
        child: Stack(
          children: [
            // Media content
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: CachedNetworkImage(
                imageUrl: item.url,
                fit: BoxFit.cover,
                width: double.infinity,
                height: double.infinity,
                placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                errorWidget: (context, url, error) => Container(
                  color: Colors.grey[300],
                  child: const Icon(Icons.image),
                ),
              ),
            ),
            
            // Video indicator
            if (item.type == 'video')
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  padding: EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.black54,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.play_arrow,
                    color: Colors.white,
                    size: 16,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  void _openMediaDetail(MediaItem item) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MediaDetailScreen(item: item),
      ),
    );
  }
}

class MediaDetailScreen extends StatelessWidget {
  final MediaItem item;

  const MediaDetailScreen({required this.item});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // Full screen media
          InteractiveViewer(
            child: Container(
              width: double.infinity,
              height: double.infinity,
              child: CachedNetworkImage(
                imageUrl: item.url,
                fit: BoxFit.contain,
                width: double.infinity,
                height: double.infinity,
                placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                errorWidget: (context, url, error) => Container(
                  color: Colors.grey[300],
                  child: const Icon(Icons.image),
                ),
              ),
            ),
          ),
          
          // Top app bar
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            child: AppBar(
              backgroundColor: Colors.black54,
              foregroundColor: Colors.white,
              title: Text(
                item.type == 'image' ? 'Photo' : 'Video',
                style: TextStyle(color: Colors.white),
              ),
              actions: [
                IconButton(
                  icon: Icon(Icons.share),
                  onPressed: () {
                    // Share media
                  },
                ),
              ],
            ),
          ),
          
          // Bottom info
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.bottomCenter,
                  end: Alignment.topCenter,
                  colors: [
                    Colors.black.withOpacity(0.8),
                    Colors.transparent,
                  ],
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    item.caption,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    _formatDate(item.createdAt),
                    style: TextStyle(
                      color: Colors.grey[300],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 0) {
      return '${difference.inDays} days ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hours ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minutes ago';
    } else {
      return 'Just now';
    }
  }
}