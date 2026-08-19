import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class MusicAudioScreen extends StatefulWidget {
  @override
  _MusicAudioScreenState createState() => _MusicAudioScreenState();
}

class _MusicAudioScreenState extends State<MusicAudioScreen> {
  List<MusicTrack> _tracks = [];
  List<Playlist> _playlists = [];
  List<AudioCategory> _categories = [];
  bool _isLoading = true;
  bool _isPlaying = false;
  int _currentTrackIndex = 0;
  double _currentPosition = 0.0;
  String _currentCategory = 'All';

  @override
  void initState() {
    super.initState();
    _loadMusicData();
  }

  Future<void> _loadMusicData() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _categories = [
          AudioCategory(id: 1, name: 'All', icon: Icons.music_note),
          AudioCategory(id: 2, name: 'Pop', icon: Icons.radio),
          AudioCategory(id: 3, name: 'Rock', icon: Icons.music_video),
          AudioCategory(id: 4, name: 'Hip Hop', icon: Icons.hearing),
          AudioCategory(id: 5, name: 'Jazz', icon: Icons.library_music),
          AudioCategory(id: 6, name: 'Classical', icon: Icons.sentiment_very_satisfied),
          AudioCategory(id: 7, name: 'Podcasts', icon: Icons.mic),
        ];
        
        _tracks = [
          MusicTrack(
            id: 1,
            title: 'Summer Vibes',
            artist: 'Ocean Waves',
            album: 'Beach Memories',
            duration: 180, // in seconds
            category: 'Pop',
            coverUrl: 'https://via.placeholder.com/300x300',
            isFavorite: true,
          ),
          MusicTrack(
            id: 2,
            title: 'Mountain Echo',
            artist: 'Nature Sounds',
            album: 'Peaceful Moments',
            duration: 240,
            category: 'Jazz',
            coverUrl: 'https://via.placeholder.com/300x300',
            isFavorite: false,
          ),
          MusicTrack(
            id: 3,
            title: 'Urban Dreams',
            artist: 'City Lights',
            album: 'Metropolitan',
            duration: 210,
            category: 'Hip Hop',
            coverUrl: 'https://via.placeholder.com/300x300',
            isFavorite: true,
          ),
          MusicTrack(
            id: 4,
            title: 'Classical Harmony',
            artist: 'Symphony Orchestra',
            album: 'Timeless Classics',
            duration: 300,
            category: 'Classical',
            coverUrl: 'https://via.placeholder.com/300x300',
            isFavorite: false,
          ),
        ];
        
        _playlists = [
          Playlist(
            id: 1,
            name: 'Chill Vibes',
            trackCount: 24,
            coverUrl: 'https://via.placeholder.com/300x300',
            isFavorite: true,
          ),
          Playlist(
            id: 2,
            name: 'Workout Mix',
            trackCount: 18,
            coverUrl: 'https://via.placeholder.com/300x300',
            isFavorite: false,
          ),
          Playlist(
            id: 3,
            name: 'Focus Time',
            trackCount: 32,
            coverUrl: 'https://via.placeholder.com/300x300',
            isFavorite: true,
          ),
          Playlist(
            id: 4,
            name: 'Road Trip',
            trackCount: 42,
            coverUrl: 'https://via.placeholder.com/300x300',
            isFavorite: false,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading music data: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading music data')),
      );
    }
  }

  void _toggleFavorite(MusicTrack track) {
    setState(() {
      final index = _tracks.indexWhere((t) => t.id == track.id);
      if (index != -1) {
        _tracks[index] = MusicTrack(
          id: _tracks[index].id,
          title: _tracks[index].title,
          artist: _tracks[index].artist,
          album: _tracks[index].album,
          duration: _tracks[index].duration,
          category: _tracks[index].category,
          coverUrl: _tracks[index].coverUrl,
          isFavorite: !_tracks[index].isFavorite,
        );
      }
    });
  }

  void _playTrack(int index) {
    setState(() {
      _currentTrackIndex = index;
      _isPlaying = true;
    });
  }

  void _togglePlayPause() {
    setState(() {
      _isPlaying = !_isPlaying;
    });
  }

  List<MusicTrack> get _filteredTracks {
    if (_currentCategory == 'All') {
      return _tracks;
    }
    return _tracks.where((track) => track.category == _currentCategory).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Music & Audio'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () {
              // Navigate to search
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Now Playing Mini Player
                if (_isPlaying)
                  Container(
                    height: 60,
                    padding: EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      border: Border(
                        top: BorderSide(color: Colors.grey[300]!),
                      ),
                    ),
                    child: Row(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: CachedNetworkImage(
                          imageUrl: _tracks[_currentTrackIndex].coverUrl,
                          width: 40,
                          height: 40,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                          errorWidget: (context, url, error) => Container(
                            color: Colors.grey[300],
                            child: const Icon(Icons.image),
                          ),
                        ),
                        ),
                        SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _tracks[_currentTrackIndex].title,
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w500,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              Text(
                                _tracks[_currentTrackIndex].artist,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[600],
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: Icon(
                            _isPlaying ? Icons.pause : Icons.play_arrow,
                            color: Colors.blue,
                          ),
                          onPressed: _togglePlayPause,
                        ),
                      ],
                    ),
                  ),
                
                // Categories
                Container(
                  height: 60,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _categories.length,
                    itemBuilder: (context, index) {
                      final category = _categories[index];
                      return Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8),
                        child: GestureDetector(
                          onTap: () {
                            setState(() {
                              _currentCategory = category.name;
                            });
                          },
                          child: Container(
                            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: _currentCategory == category.name ? Colors.blue : Colors.grey[200],
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  category.icon,
                                  color: _currentCategory == category.name ? Colors.white : Colors.grey[700],
                                  size: 16,
                                ),
                                SizedBox(width: 4),
                                Text(
                                  category.name,
                                  style: TextStyle(
                                    color: _currentCategory == category.name ? Colors.white : Colors.grey[700],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                
                // Main content
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadMusicData,
                    child: SingleChildScrollView(
                      child: Column(
                        children: [
                          // Playlists
                          Padding(
                            padding: EdgeInsets.all(16),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Your Playlists',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                TextButton(
                                  onPressed: () {
                                    // Navigate to all playlists
                                  },
                                  child: Text('See All'),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            height: 120,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: _playlists.length,
                              itemBuilder: (context, index) {
                                final playlist = _playlists[index];
                                return _buildPlaylistCard(playlist);
                              },
                            ),
                          ),
                          
                          // Tracks
                          Padding(
                            padding: EdgeInsets.all(16),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Top Tracks',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                TextButton(
                                  onPressed: () {
                                    // Navigate to all tracks
                                  },
                                  child: Text('See All'),
                                ),
                              ],
                            ),
                          ),
                          ListView.builder(
                            shrinkWrap: true,
                            physics: NeverScrollableScrollPhysics(),
                            itemCount: _filteredTracks.length,
                            itemBuilder: (context, index) {
                              final track = _filteredTracks[index];
                              return _buildTrackItem(track, index);
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildPlaylistCard(Playlist playlist) {
    return Card(
      margin: EdgeInsets.only(left: 16, right: 8),
      child: Container(
        width: 150,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(4),
                topRight: Radius.circular(4),
              ),
              child: CachedNetworkImage(
                imageUrl: playlist.coverUrl,
                width: double.infinity,
                height: 100,
                fit: BoxFit.cover,
                placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                errorWidget: (context, url, error) => Container(
                  color: Colors.grey[300],
                  child: const Icon(Icons.image),
                ),
              ),
            ),
            Padding(
              padding: EdgeInsets.all(8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    playlist.name,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    '${playlist.trackCount} tracks',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTrackItem(MusicTrack track, int index) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: ListTile(
        leading: ClipRRect(
          borderRadius: BorderRadius.circular(4),
          child: CachedNetworkImage(
            imageUrl: track.coverUrl,
            width: 50,
            height: 50,
            fit: BoxFit.cover,
            placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
            errorWidget: (context, url, error) => Container(
              color: Colors.grey[300],
              child: const Icon(Icons.image),
            ),
          ),
        ),
        title: Text(
          track.title,
          style: TextStyle(
            fontWeight: FontWeight.w500,
          ),
        ),
        subtitle: Text(
          '${track.artist} • ${track.album}',
          style: TextStyle(
            fontSize: 12,
          ),
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: Icon(
                track.isFavorite ? Icons.favorite : Icons.favorite_border,
                color: track.isFavorite ? Colors.red : Colors.grey,
              ),
              onPressed: () => _toggleFavorite(track),
            ),
            Text(
              _formatDuration(track.duration),
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
        onTap: () => _playTrack(_filteredTracks.indexOf(track)),
      ),
    );
  }

  String _formatDuration(int seconds) {
    int minutes = seconds ~/ 60;
    int remainingSeconds = seconds % 60;
    return '${minutes}:${remainingSeconds.toString().padLeft(2, '0')}';
  }
}

class AudioCategory {
  final int id;
  final String name;
  final IconData icon;

  AudioCategory({
    required this.id,
    required this.name,
    required this.icon,
  });
}

class MusicTrack {
  final int id;
  final String title;
  final String artist;
  final String album;
  final int duration;
  final String category;
  final String coverUrl;
  final bool isFavorite;

  MusicTrack({
    required this.id,
    required this.title,
    required this.artist,
    required this.album,
    required this.duration,
    required this.category,
    required this.coverUrl,
    required this.isFavorite,
  });
}

class Playlist {
  final int id;
  final String name;
  final int trackCount;
  final String coverUrl;
  final bool isFavorite;

  Playlist({
    required this.id,
    required this.name,
    required this.trackCount,
    required this.coverUrl,
    required this.isFavorite,
  });
}