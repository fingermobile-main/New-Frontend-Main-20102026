import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class FingerShortsPage extends StatefulWidget {
  const FingerShortsPage({super.key});

  @override
  State<FingerShortsPage> createState() => _FingerShortsPageState();
}

class _FingerShortsPageState extends State<FingerShortsPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<ShortVideo> _shortVideos = [];
  List<ShortCategory> _categories = [];
  String _selectedCategory = 'all';
  int _currentVideoIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadShortsData();
  }

  Future<void> _loadShortsData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock shorts data
      setState(() {
        _categories = [
          ShortCategory(id: 'all', name: 'For You'),
          ShortCategory(id: 'trending', name: 'Trending'),
          ShortCategory(id: 'funny', name: 'Funny'),
          ShortCategory(id: 'music', name: 'Music'),
          ShortCategory(id: 'gaming', name: 'Gaming'),
          ShortCategory(id: 'sports', name: 'Sports'),
          ShortCategory(id: 'news', name: 'News'),
        ];

        _shortVideos = [
          ShortVideo(
            id: 1,
            title: 'Amazing sunset timelapse',
            author: 'NatureLover',
            views: 125400,
            likes: 15200,
            comments: 340,
            duration: '0:45',
            thumbnailUrl: 'https://via.placeholder.com/300x500/FF6B6B/FFFFFF?text=Sunset',
            videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
          ),
          ShortVideo(
            id: 2,
            title: 'Cooking tutorial: Perfect pasta',
            author: 'ChefMaster',
            views: 89200,
            likes: 12400,
            comments: 210,
            duration: '1:20',
            thumbnailUrl: 'https://via.placeholder.com/300x500/4ECDC4/FFFFFF?text=Pasta',
            videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
          ),
          ShortVideo(
            id: 3,
            title: 'Funny cat compilation',
            author: 'PetLover',
            views: 245600,
            likes: 32500,
            comments: 890,
            duration: '0:58',
            thumbnailUrl: 'https://via.placeholder.com/300x500/FFD166/000000?text=Cat+Video',
            videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
          ),
          ShortVideo(
            id: 4,
            title: 'Gaming highlight reel',
            author: 'ProGamer',
            views: 156800,
            likes: 18900,
            comments: 420,
            duration: '1:05',
            thumbnailUrl: 'https://via.placeholder.com/300x500/6A0572/FFFFFF?text=Gaming',
            videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load shorts. Please try again.';
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

  void _onVideoChanged(int index) {
    setState(() {
      _currentVideoIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading && _shortVideos.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null && _shortVideos.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(_errorMessage!),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadShortsData,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : Column(
                  children: [
                    // Top Categories Bar
                    Container(
                      height: 50,
                      color: Colors.black,
                      child: Row(
                        children: [
                          IconButton(
                            icon: const Icon(Icons.arrow_back, color: Colors.white),
                            onPressed: () {
                              Navigator.of(context).pop();
                            },
                          ),
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
                                      left: index == 0 ? 8.0 : 0,
                                    ),
                                    child: FilterChip(
                                      label: Text(
                                        category.name,
                                        style: TextStyle(
                                          color: isSelected ? Colors.black : Colors.white,
                                        ),
                                      ),
                                      selected: isSelected,
                                      onSelected: (selected) {
                                        _selectCategory(category.id);
                                      },
                                      selectedColor: Colors.white,
                                      backgroundColor: Colors.transparent,
                                      showCheckmark: false,
                                      side: BorderSide(
                                        color: isSelected ? Colors.white : Colors.grey,
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.search, color: Colors.white),
                            onPressed: () {
                              // Open search
                            },
                          ),
                        ],
                      ),
                    ),
                    // Video Feed
                    Expanded(
                      child: PageView.builder(
                        scrollDirection: Axis.vertical,
                        itemCount: _shortVideos.length,
                        onPageChanged: _onVideoChanged,
                        itemBuilder: (context, index) {
                          var video = _shortVideos[index];
                          return Stack(
                            children: [
                              // Video Player Placeholder
                              Container(
                                color: Colors.black,
                                child: Center(
                                  child: CachedNetworkImage(
                                    imageUrl: video.thumbnailUrl,
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
                              ),
                              // Video Overlay
                              Positioned.fill(
                                child: Container(
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topCenter,
                                      end: Alignment.bottomCenter,
                                      colors: [
                                        Colors.transparent,
                                        Colors.black.withOpacity(0.8),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                              // Video Info
                              Positioned(
                                bottom: 100,
                                left: 16,
                                right: 16,
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      video.title,
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      '@${video.author}',
                                      style: const TextStyle(
                                        color: Colors.white70,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      '${_formatViews(video.views)} views',
                                      style: const TextStyle(
                                        color: Colors.white70,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              // Action Buttons
                              Positioned(
                                right: 16,
                                bottom: 100,
                                child: Column(
                                  children: [
                                    _buildActionButton(
                                      Icons.account_circle,
                                      video.author,
                                      true,
                                    ),
                                    const SizedBox(height: 24),
                                    _buildActionButton(
                                      Icons.favorite_border,
                                      '${_formatLargeNumber(video.likes)}',
                                      false,
                                    ),
                                    const SizedBox(height: 24),
                                    _buildActionButton(
                                      Icons.comment,
                                      '${_formatLargeNumber(video.comments)}',
                                      false,
                                    ),
                                    const SizedBox(height: 24),
                                    _buildActionButton(
                                      Icons.share,
                                      'Share',
                                      false,
                                    ),
                                    const SizedBox(height: 24),
                                    Container(
                                      width: 50,
                                      height: 50,
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        borderRadius: BorderRadius.circular(25),
                                      ),
                                      child: const Icon(
                                        Icons.music_note,
                                        color: Colors.black,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              // Video Progress Indicator
                              Positioned(
                                top: 0,
                                left: 0,
                                right: 0,
                                child: LinearProgressIndicator(
                                  value: (_currentVideoIndex + 1) / _shortVideos.length,
                                  backgroundColor: Colors.white24,
                                  valueColor:
                                      const AlwaysStoppedAnimation<Color>(Colors.white),
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                    ),
                  ],
                ),
    );
  }

  Widget _buildActionButton(IconData icon, String label, bool isProfile) {
    return Column(
      children: [
        Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            color: isProfile ? Colors.transparent : Colors.black54,
            borderRadius: BorderRadius.circular(25),
            border: isProfile
                ? Border.all(
                    color: Colors.white,
                    width: 2,
                  )
                : null,
          ),
          child: Icon(
            icon,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  String _formatViews(int views) {
    if (views >= 1000000) {
      return '${(views / 1000000).toStringAsFixed(1)}M';
    } else if (views >= 1000) {
      return '${(views / 1000).toStringAsFixed(1)}K';
    } else {
      return views.toString();
    }
  }

  String _formatLargeNumber(int number) {
    if (number >= 1000000) {
      return '${(number / 1000000).toStringAsFixed(1)}M';
    } else if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(1)}K';
    } else {
      return number.toString();
    }
  }
}

class ShortCategory {
  final String id;
  final String name;

  ShortCategory({
    required this.id,
    required this.name,
  });
}

class ShortVideo {
  final int id;
  final String title;
  final String author;
  final int views;
  final int likes;
  final int comments;
  final String duration;
  final String thumbnailUrl;
  final String videoUrl;

  ShortVideo({
    required this.id,
    required this.title,
    required this.author,
    required this.views,
    required this.likes,
    required this.comments,
    required this.duration,
    required this.thumbnailUrl,
    required this.videoUrl,
  });
}