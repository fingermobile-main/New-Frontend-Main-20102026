import 'package:flutter/material.dart';

class AiPlaylistPage extends StatefulWidget {
  const AiPlaylistPage({super.key});

  @override
  State<AiPlaylistPage> createState() => _AiPlaylistPageState();
}

class _AiPlaylistPageState extends State<AiPlaylistPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<Playlist> _playlists = [];
  List<Song> _recommendedSongs = [];
  String _playlistName = '';
  final TextEditingController _playlistNameController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadPlaylists();
  }

  Future<void> _loadPlaylists() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock playlist data
      setState(() {
        _playlists = [
          Playlist(
            id: 1,
            name: 'Workout Mix',
            songCount: 24,
            duration: '1h 32m',
            isAiGenerated: true,
            createdAt: '2023-05-15',
          ),
          Playlist(
            id: 2,
            name: 'Chill Vibes',
            songCount: 18,
            duration: '58m',
            isAiGenerated: true,
            createdAt: '2023-05-10',
          ),
          Playlist(
            id: 3,
            name: 'Focus Flow',
            songCount: 32,
            duration: '2h 15m',
            isAiGenerated: false,
            createdAt: '2023-05-05',
          ),
        ];
        
        _recommendedSongs = [
          Song(
            id: 1,
            title: 'Energetic Beats',
            artist: 'AI Composer',
            duration: '3:45',
            albumArt: 'https://via.placeholder.com/150',
          ),
          Song(
            id: 2,
            title: 'Ambient Waves',
            artist: 'Neural Network',
            duration: '4:22',
            albumArt: 'https://via.placeholder.com/150',
          ),
          Song(
            id: 3,
            title: 'Rhythmic Pulse',
            artist: 'Deep Learning',
            duration: '3:18',
            albumArt: 'https://via.placeholder.com/150',
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load playlists. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _generateAiPlaylist() async {
    if (_playlistNameController.text.isEmpty) {
      setState(() {
        _errorMessage = 'Please enter a playlist name';
      });
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate AI playlist generation
      await Future.delayed(const Duration(seconds: 3));
      
      // Add new AI-generated playlist
      setState(() {
        _playlists.insert(
          0,
          Playlist(
            id: _playlists.length + 1,
            name: _playlistNameController.text,
            songCount: 20,
            duration: '1h 15m',
            isAiGenerated: true,
            createdAt: DateTime.now().toString().split(' ')[0],
          ),
        );
        
        _playlistNameController.clear();
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('AI Playlist generated successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Failed to generate playlist. Please try again.';
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  void _deletePlaylist(int playlistId) {
    setState(() {
      _playlists.removeWhere((playlist) => playlist.id == playlistId);
    });
    
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Playlist deleted'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  @override
  void dispose() {
    _playlistNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Playlists'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadPlaylists,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadPlaylists,
        child: Column(
          children: [
            // AI Playlist Generator
            Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                border: Border(bottom: BorderSide(color: Colors.grey.shade300)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Generate AI Playlist',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  TextField(
                    controller: _playlistNameController,
                    decoration: const InputDecoration(
                      labelText: 'Playlist Name',
                      border: OutlineInputBorder(),
                    ),
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: _generateAiPlaylist,
                      icon: const Icon(Icons.auto_awesome),
                      label: const Text('Generate with AI'),
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                    ),
                  ),
                  if (_errorMessage != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 16.0),
                      child: Text(
                        _errorMessage!,
                        style: const TextStyle(color: Colors.red),
                      ),
                    ),
                ],
              ),
            ),
            // Main Content
            Expanded(
              child: _isLoading && _playlists.isEmpty
                  ? const Center(child: CircularProgressIndicator())
                  : _errorMessage != null && _playlists.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(_errorMessage!),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: _loadPlaylists,
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
                                // Your Playlists
                                const Text(
                                  'Your Playlists',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 16),
                                if (_playlists.isEmpty)
                                  const Center(
                                    child: Text('No playlists yet'),
                                  )
                                else
                                  ListView.builder(
                                    shrinkWrap: true,
                                    physics: const NeverScrollableScrollPhysics(),
                                    itemCount: _playlists.length,
                                    itemBuilder: (context, index) {
                                      var playlist = _playlists[index];
                                      return Card(
                                        margin: const EdgeInsets.only(bottom: 16),
                                        child: ListTile(
                                          leading: Container(
                                            width: 50,
                                            height: 50,
                                            decoration: BoxDecoration(
                                              color: playlist.isAiGenerated
                                                  ? Colors.deepPurple
                                                  : Colors.blue,
                                              borderRadius: BorderRadius.circular(8),
                                            ),
                                            child: Icon(
                                              playlist.isAiGenerated
                                                  ? Icons.auto_awesome
                                                  : Icons.queue_music,
                                              color: Colors.white,
                                            ),
                                          ),
                                          title: Text(playlist.name),
                                          subtitle: Text(
                                              '${playlist.songCount} songs • ${playlist.duration}'),
                                          trailing: Row(
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Text(playlist.createdAt),
                                              const SizedBox(width: 8),
                                              IconButton(
                                                icon: const Icon(Icons.delete),
                                                onPressed: () =>
                                                    _deletePlaylist(playlist.id),
                                              ),
                                            ],
                                          ),
                                          onTap: () {
                                            // Navigate to playlist detail
                                          },
                                        ),
                                      );
                                    },
                                  ),
                                const SizedBox(height: 32),
                                // Recommended Songs
                                const Text(
                                  'AI Recommended Songs',
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 16),
                                if (_recommendedSongs.isEmpty)
                                  const Center(
                                    child: Text('No recommendations yet'),
                                  )
                                else
                                  ListView.builder(
                                    shrinkWrap: true,
                                    physics: const NeverScrollableScrollPhysics(),
                                    itemCount: _recommendedSongs.length,
                                    itemBuilder: (context, index) {
                                      var song = _recommendedSongs[index];
                                      return Card(
                                        margin: const EdgeInsets.only(bottom: 8),
                                        child: ListTile(
                                          leading: ClipRRect(
                                            borderRadius: BorderRadius.circular(4),
                                            child: Image.network(
                                              song.albumArt,
                                              width: 50,
                                              height: 50,
                                              fit: BoxFit.cover,
                                            ),
                                          ),
                                          title: Text(song.title),
                                          subtitle: Text(song.artist),
                                          trailing: Text(song.duration),
                                          onTap: () {
                                            // Play song
                                          },
                                        ),
                                      );
                                    },
                                  ),
                              ],
                            ),
                          ),
                        ),
            ),
          ],
        ),
      ),
    );
  }
}

class Playlist {
  final int id;
  final String name;
  final int songCount;
  final String duration;
  final bool isAiGenerated;
  final String createdAt;

  Playlist({
    required this.id,
    required this.name,
    required this.songCount,
    required this.duration,
    required this.isAiGenerated,
    required this.createdAt,
  });
}

class Song {
  final int id;
  final String title;
  final String artist;
  final String duration;
  final String albumArt;

  Song({
    required this.id,
    required this.title,
    required this.artist,
    required this.duration,
    required this.albumArt,
  });
}