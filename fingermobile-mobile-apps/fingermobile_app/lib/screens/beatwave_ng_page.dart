import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class BeatwaveNGPage extends StatefulWidget {
  const BeatwaveNGPage({super.key});

  @override
  State<BeatwaveNGPage> createState() => _BeatwaveNGPageState();
}

class _BeatwaveNGPageState extends State<BeatwaveNGPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<NgCategory> _categories = [];
  List<NgTrack> _featuredTracks = [];
  List<NgArtist> _topArtists = [];
  NgViewMode _viewMode = NgViewMode.grid;

  @override
  void initState() {
    super.initState();
    _loadContent();
  }

  Future<void> _loadContent() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock data
      setState(() {
        _categories = [
          NgCategory(id: 1, name: 'Electronic', icon: Icons.electric_bolt),
          NgCategory(id: 2, name: 'Hip Hop', icon: Icons.music_video),
          NgCategory(id: 3, name: 'Rock', icon: Icons.music_note),
          NgCategory(id: 4, name: 'Jazz', icon: Icons.piano),
          NgCategory(id: 5, name: 'Classical', icon: Icons.audiotrack),
          NgCategory(id: 6, name: 'Pop', icon: Icons.radio),
        ];
        
        _featuredTracks = [
          NgTrack(
            id: 1,
            title: 'Midnight Drive',
            artist: 'Neon Dreams',
            duration: '3:45',
            albumArt: 'https://via.placeholder.com/300/FF6B6B/FFFFFF?text=MD',
            plays: 125430,
            likes: 8920,
          ),
          NgTrack(
            id: 2,
            title: 'Digital Sunrise',
            artist: 'Synth Masters',
            duration: '4:22',
            albumArt: 'https://via.placeholder.com/300/4ECDC4/FFFFFF?text=DS',
            plays: 98765,
            likes: 7650,
          ),
          NgTrack(
            id: 3,
            title: 'Cyber Groove',
            artist: 'Virtual Band',
            duration: '3:18',
            albumArt: 'https://via.placeholder.com/300/45B7D1/FFFFFF?text=CG',
            plays: 87654,
            likes: 6540,
          ),
        ];
        
        _topArtists = [
          NgArtist(
            id: 1,
            name: 'Neural Networks',
            followers: 1250000,
            avatar: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=NN',
            isVerified: true,
          ),
          NgArtist(
            id: 2,
            name: 'AI Composers',
            followers: 980000,
            avatar: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=AIC',
            isVerified: true,
          ),
          NgArtist(
            id: 3,
            name: 'Digital Soundscapes',
            followers: 765000,
            avatar: 'https://via.placeholder.com/150/45B7D1/FFFFFF?text=DSS',
            isVerified: false,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load content. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Beatwave NG'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(_viewMode == NgViewMode.grid ? Icons.list : Icons.grid_view),
            onPressed: () {
              setState(() {
                _viewMode = _viewMode == NgViewMode.grid ? NgViewMode.list : NgViewMode.grid;
              });
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
        onRefresh: _loadContent,
        child: _isLoading && _categories.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _categories.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadContent,
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
                          // Categories
                          const Text(
                            'Browse Categories',
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
                              itemCount: _categories.length,
                              itemBuilder: (context, index) {
                                var category = _categories[index];
                                return Container(
                                  width: 80,
                                  margin: const EdgeInsets.only(right: 16),
                                  child: Column(
                                    children: [
                                      Container(
                                        width: 60,
                                        height: 60,
                                        decoration: BoxDecoration(
                                          color: Theme.of(context).primaryColor,
                                          shape: BoxShape.circle,
                                        ),
                                        child: Icon(
                                          category.icon,
                                          color: Colors.white,
                                          size: 30,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        category.name,
                                        textAlign: TextAlign.center,
                                        style: const TextStyle(fontSize: 12),
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                          ),
                          const SizedBox(height: 32),
                          // Featured Tracks
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Featured Tracks',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  // View all featured tracks
                                },
                                child: const Text('See All'),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            height: 220,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: _featuredTracks.length,
                              itemBuilder: (context, index) {
                                var track = _featuredTracks[index];
                                return Container(
                                  width: 160,
                                  margin: const EdgeInsets.only(right: 16),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Stack(
                                        children: [
                                          ClipRRect(
                                            borderRadius: BorderRadius.circular(8),
                                            child: CachedNetworkImage(
                                              imageUrl: track.albumArt,
                                              width: 160,
                                              height: 160,
                                              fit: BoxFit.cover,
                                              placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                                              errorWidget: (context, url, error) => Container(
                                                color: Colors.grey[300],
                                                child: const Icon(Icons.image),
                                              ),
                                            ),
                                          ),
                                          Positioned(
                                            right: 8,
                                            bottom: 8,
                                            child: Container(
                                              padding: const EdgeInsets.all(4),
                                              decoration: BoxDecoration(
                                                color: Colors.black54,
                                                borderRadius: BorderRadius.circular(12),
                                              ),
                                              child: Text(
                                                track.duration,
                                                style: const TextStyle(
                                                  color: Colors.white,
                                                  fontSize: 12,
                                                ),
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        track.title,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      Text(
                                        track.artist,
                                        style: const TextStyle(
                                          color: Colors.grey,
                                          fontSize: 12,
                                        ),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                          ),
                          const SizedBox(height: 32),
                          // Top Artists
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Top Artists',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  // View all artists
                                },
                                child: const Text('See All'),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            height: 100,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: _topArtists.length,
                              itemBuilder: (context, index) {
                                var artist = _topArtists[index];
                                return Container(
                                  width: 80,
                                  margin: const EdgeInsets.only(right: 16),
                                  child: Column(
                                    children: [
                                      Stack(
                                        children: [
                                          CircleAvatar(
                                            backgroundImage: CachedNetworkImageProvider(artist.avatar),
                                            radius: 30,
                                          ),
                                          if (artist.isVerified)
                                            Positioned(
                                              right: 0,
                                              bottom: 0,
                                              child: Container(
                                                padding: const EdgeInsets.all(2),
                                                decoration: const BoxDecoration(
                                                  color: Colors.blue,
                                                  shape: BoxShape.circle,
                                                ),
                                                child: const Icon(
                                                  Icons.verified,
                                                  color: Colors.white,
                                                  size: 16,
                                                ),
                                              ),
                                            ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        artist.name,
                                        textAlign: TextAlign.center,
                                        style: const TextStyle(fontSize: 12),
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                      Text(
                                        '${(artist.followers / 1000).round()}K followers',
                                        textAlign: TextAlign.center,
                                        style: const TextStyle(
                                          color: Colors.grey,
                                          fontSize: 10,
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              },
                            ),
                          ),
                          const SizedBox(height: 32),
                          // Recently Played
                          const Text(
                            'Recently Played',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          if (_viewMode == NgViewMode.list)
                            ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: 10, // Mock recently played tracks
                              itemBuilder: (context, index) {
                                return ListTile(
                                  leading: Container(
                                    width: 50,
                                    height: 50,
                                    decoration: BoxDecoration(
                                      color: Colors.grey.shade300,
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: const Icon(Icons.music_note),
                                  ),
                                  title: Text('Recently Played Track ${index + 1}'),
                                  subtitle: Text('Artist ${index + 1}'),
                                  trailing: const Text('3:45'),
                                  onTap: () {
                                    // Play track
                                  },
                                );
                              },
                            )
                          else
                            GridView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                crossAxisSpacing: 16,
                                mainAxisSpacing: 16,
                                childAspectRatio: 0.8,
                              ),
                              itemCount: 10, // Mock recently played tracks
                              itemBuilder: (context, index) {
                                return Container(
                                  decoration: BoxDecoration(
                                    color: Colors.grey.shade100,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Expanded(
                                        child: Container(
                                          width: double.infinity,
                                          decoration: BoxDecoration(
                                            color: Colors.grey.shade300,
                                            borderRadius: const BorderRadius.vertical(
                                              top: Radius.circular(8),
                                            ),
                                          ),
                                          child: const Icon(Icons.music_note),
                                        ),
                                      ),
                                      Padding(
                                        padding: const EdgeInsets.all(8.0),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              'Track ${index + 1}',
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                              ),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            Text(
                                              'Artist ${index + 1}',
                                              style: const TextStyle(
                                                color: Colors.grey,
                                                fontSize: 12,
                                              ),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
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
}

enum NgViewMode { grid, list }

class NgCategory {
  final int id;
  final String name;
  final IconData icon;

  NgCategory({
    required this.id,
    required this.name,
    required this.icon,
  });
}

class NgTrack {
  final int id;
  final String title;
  final String artist;
  final String duration;
  final String albumArt;
  final int plays;
  final int likes;

  NgTrack({
    required this.id,
    required this.title,
    required this.artist,
    required this.duration,
    required this.albumArt,
    required this.plays,
    required this.likes,
  });
}

class NgArtist {
  final int id;
  final String name;
  final int followers;
  final String avatar;
  final bool isVerified;

  NgArtist({
    required this.id,
    required this.name,
    required this.followers,
    required this.avatar,
    required this.isVerified,
  });
}