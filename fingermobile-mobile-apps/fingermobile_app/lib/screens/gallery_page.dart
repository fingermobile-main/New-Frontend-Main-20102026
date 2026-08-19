import 'package:flutter/material.dart';

class GalleryPage extends StatefulWidget {
  const GalleryPage({super.key});

  @override
  State<GalleryPage> createState() => _GalleryPageState();
}

class _GalleryPageState extends State<GalleryPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<GalleryAlbum> _albums = [];
  List<GalleryMedia> _mediaItems = [];
  List<GalleryMedia> _filteredMedia = [];
  String _selectedAlbum = 'all';
  MediaType _selectedMediaType = MediaType.all;
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadGalleryData();
  }

  Future<void> _loadGalleryData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock gallery data
      setState(() {
        _albums = [
          GalleryAlbum(id: 'all', name: 'All Media'),
          GalleryAlbum(id: 'vacation', name: 'Vacation 2023'),
          GalleryAlbum(id: 'family', name: 'Family Photos'),
          GalleryAlbum(id: 'work', name: 'Work Events'),
          GalleryAlbum(id: 'nature', name: 'Nature'),
        ];

        _mediaItems = [
          GalleryMedia(
            id: 1,
            title: 'Beach Sunset',
            url: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Beach',
            type: MediaType.image,
            album: 'vacation',
            date: DateTime.now().subtract(const Duration(days: 5)),
            favorite: true,
          ),
          GalleryMedia(
            id: 2,
            title: 'Mountain Hike',
            url: 'https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=Mountains',
            type: MediaType.image,
            album: 'nature',
            date: DateTime.now().subtract(const Duration(days: 10)),
            favorite: false,
          ),
          GalleryMedia(
            id: 3,
            title: 'Birthday Party',
            url: 'https://via.placeholder.com/300x300/FFD166/000000?text=Birthday',
            type: MediaType.image,
            album: 'family',
            date: DateTime.now().subtract(const Duration(days: 15)),
            favorite: true,
          ),
          GalleryMedia(
            id: 4,
            title: 'Conference Presentation',
            url: 'https://via.placeholder.com/300x300/6A0572/FFFFFF?text=Presentation',
            type: MediaType.image,
            album: 'work',
            date: DateTime.now().subtract(const Duration(days: 20)),
            favorite: false,
          ),
          GalleryMedia(
            id: 5,
            title: 'City Timelapse',
            url: 'https://via.placeholder.com/300x300/118AB2/FFFFFF?text=Timelapse',
            type: MediaType.video,
            album: 'vacation',
            date: DateTime.now().subtract(const Duration(days: 25)),
            favorite: false,
          ),
          GalleryMedia(
            id: 6,
            title: 'Family Dinner',
            url: 'https://via.placeholder.com/300x300/073B4C/FFFFFF?text=Dinner',
            type: MediaType.image,
            album: 'family',
            date: DateTime.now().subtract(const Duration(days: 30)),
            favorite: true,
          ),
        ];

        _filteredMedia = List.from(_mediaItems);
        _selectedAlbum = 'all';
        _selectedMediaType = MediaType.all;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load gallery. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _selectAlbum(String albumId) {
    setState(() {
      _selectedAlbum = albumId;
      _filterMedia();
    });
  }

  void _selectMediaType(MediaType type) {
    setState(() {
      _selectedMediaType = type;
      _filterMedia();
    });
  }

  void _filterMedia() {
    setState(() {
      _filteredMedia = _mediaItems.where((media) {
        bool albumMatch = _selectedAlbum == 'all' || media.album == _selectedAlbum;
        bool typeMatch = _selectedMediaType == MediaType.all || media.type == _selectedMediaType;
        return albumMatch && typeMatch;
      }).toList();
    });
  }

  void _toggleFavorite(int mediaId) {
    setState(() {
      var media = _mediaItems.firstWhere((item) => item.id == mediaId);
      media.favorite = !media.favorite;
      _filterMedia(); // Re-apply filter to update displayed items
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Gallery'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Open search
            },
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              // Open advanced filters
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadGalleryData,
        child: _isLoading && _albums.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _albums.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadGalleryData,
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
                          // Albums
                          const Text(
                            'Albums',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            height: 100,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: _albums.length,
                              itemBuilder: (context, index) {
                                var album = _albums[index];
                                bool isSelected = _selectedAlbum == album.id;

                                return Padding(
                                  padding: EdgeInsets.only(
                                    right: 16.0,
                                    left: index == 0 ? 0 : 16.0,
                                  ),
                                  child: ChoiceChip(
                                    label: Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Icon(
                                          Icons.photo_album,
                                          size: 32,
                                          color: isSelected ? Colors.white : null,
                                        ),
                                        const SizedBox(height: 8),
                                        Text(album.name),
                                      ],
                                    ),
                                    selected: isSelected,
                                    onSelected: (selected) {
                                      _selectAlbum(album.id);
                                    },
                                    selectedColor: Theme.of(context).primaryColor,
                                  ),
                                );
                              },
                            ),
                          ),
                          const SizedBox(height: 32),
                          // Media Type Filter
                          const Text(
                            'Media Type',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              _buildMediaTypeButton(
                                'All',
                                Icons.grid_view,
                                MediaType.all,
                              ),
                              _buildMediaTypeButton(
                                'Photos',
                                Icons.photo,
                                MediaType.image,
                              ),
                              _buildMediaTypeButton(
                                'Videos',
                                Icons.videocam,
                                MediaType.video,
                              ),
                            ],
                          ),
                          const SizedBox(height: 32),
                          // Media Grid
                          const Text(
                            'Media',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          if (_filteredMedia.isEmpty)
                            Center(
                              child: Column(
                                children: [
                                  Icon(
                                    Icons.image_not_supported,
                                    size: 64,
                                    color: Colors.grey.shade400,
                                  ),
                                  const SizedBox(height: 16),
                                  const Text(
                                    'No media found',
                                    style: TextStyle(
                                      fontSize: 18,
                                      color: Colors.grey,
                                    ),
                                  ),
                                ],
                              ),
                            )
                          else
                            GridView.builder(
                              gridDelegate:
                                  const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 3,
                                crossAxisSpacing: 8,
                                mainAxisSpacing: 8,
                              ),
                              itemCount: _filteredMedia.length,
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemBuilder: (context, index) {
                                var media = _filteredMedia[index];
                                return Stack(
                                  children: [
                                    Container(
                                      decoration: BoxDecoration(
                                        image: DecorationImage(
                                          image: NetworkImage(media.url),
                                          fit: BoxFit.cover,
                                        ),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                    ),
                                    Positioned(
                                      top: 8,
                                      right: 8,
                                      child: GestureDetector(
                                        onTap: () => _toggleFavorite(media.id),
                                        child: Icon(
                                          media.favorite
                                              ? Icons.favorite
                                              : Icons.favorite_border,
                                          color: media.favorite ? Colors.red : Colors.white,
                                          size: 20,
                                        ),
                                      ),
                                    ),
                                    if (media.type == MediaType.video)
                                      const Positioned(
                                        bottom: 8,
                                        right: 8,
                                        child: Icon(
                                          Icons.play_circle_fill,
                                          color: Colors.white,
                                        ),
                                      ),
                                  ],
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

  Widget _buildMediaTypeButton(String label, IconData icon, MediaType type) {
    bool isSelected = _selectedMediaType == type;
    return ElevatedButton(
      onPressed: () => _selectMediaType(type),
      style: ElevatedButton.styleFrom(
        backgroundColor: isSelected ? Theme.of(context).primaryColor : Colors.grey.shade300,
        foregroundColor: isSelected ? Colors.white : Colors.grey.shade700,
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 20),
          const SizedBox(width: 8),
          Text(label),
        ],
      ),
    );
  }
}

enum MediaType { all, image, video }

class GalleryAlbum {
  final String id;
  final String name;

  GalleryAlbum({
    required this.id,
    required this.name,
  });
}

class GalleryMedia {
  final int id;
  final String title;
  final String url;
  final MediaType type;
  final String album;
  final DateTime date;
  bool favorite;

  GalleryMedia({
    required this.id,
    required this.title,
    required this.url,
    required this.type,
    required this.album,
    required this.date,
    required this.favorite,
  });
}