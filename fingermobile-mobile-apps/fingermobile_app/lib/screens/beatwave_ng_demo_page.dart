import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart'; // Ensure cached_network_image is imported
import 'dart:async';

class BeatwaveNGDemoPage extends StatefulWidget {
  const BeatwaveNGDemoPage({super.key});

  @override
  State<BeatwaveNGDemoPage> createState() => _BeatwaveNGDemoPageState();
}

class _BeatwaveNGDemoPageState extends State<BeatwaveNGDemoPage> {
  bool _isLoading = false;
  String? _errorMessage;
  bool _isPlaying = false;
  int _currentTrackIndex = 0;
  double _progress = 0.0;
  Timer? _progressTimer;
  List<NgTrack> _tracks = [];
  List<EqualizerBand> _eqBands = [];
  NgPlaybackMode _playbackMode = NgPlaybackMode.normal;
  double _volume = 0.8;
  double _bass = 0.5;
  double _treble = 0.5;

  @override
  void initState() {
    super.initState();
    _initializeDemo();
  }

  Future<void> _initializeDemo() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock track data
      setState(() {
        _tracks = [
          NgTrack(
            id: 1,
            title: 'Quantum Leap',
            artist: 'NG Collective',
            duration: '4:12',
            albumArt: 'https://via.placeholder.com/300/FF6B6B/FFFFFF?text=QL',
            genre: 'Electronic',
            bpm: 128,
          ),
          NgTrack(
            id: 2,
            title: 'Neural Pathways',
            artist: 'Synaptic Sounds',
            duration: '3:56',
            albumArt: 'https://via.placeholder.com/300/4ECDC4/FFFFFF?text=NP',
            genre: 'Ambient',
            bpm: 95,
          ),
          NgTrack(
            id: 3,
            title: 'Digital Horizon',
            artist: 'Cyber Symphony',
            duration: '5:23',
            albumArt: 'https://via.placeholder.com/300/45B7D1/FFFFFF?text=DH',
            genre: 'Trance',
            bpm: 132,
          ),
          NgTrack(
            id: 4,
            title: 'Binary Sunset',
            artist: 'Code Poets',
            duration: '3:45',
            albumArt: 'https://via.placeholder.com/300/F9CA24/FFFFFF?text=BS',
            genre: 'Techno',
            bpm: 124,
          ),
        ];
        
        // Initialize EQ bands
        _eqBands = [
          EqualizerBand(frequency: '60Hz', gain: 0.0),
          EqualizerBand(frequency: '170Hz', gain: 0.2),
          EqualizerBand(frequency: '310Hz', gain: 0.1),
          EqualizerBand(frequency: '600Hz', gain: -0.1),
          EqualizerBand(frequency: '1kHz', gain: 0.0),
          EqualizerBand(frequency: '3kHz', gain: 0.3),
          EqualizerBand(frequency: '6kHz', gain: 0.2),
          EqualizerBand(frequency: '12kHz', gain: 0.1),
          EqualizerBand(frequency: '18kHz', gain: 0.0),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load NG demo. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _togglePlayback() {
    setState(() {
      _isPlaying = !_isPlaying;
    });

    if (_isPlaying) {
      _startPlayback();
    } else {
      _pausePlayback();
    }
  }

  void _startPlayback() {
    _progressTimer = Timer.periodic(const Duration(milliseconds: 100), (timer) {
      setState(() {
        _progress += 0.01;
        if (_progress >= 1.0) {
          _progress = 0.0;
          _nextTrack();
        }
      });
    });
  }

  void _pausePlayback() {
    _progressTimer?.cancel();
  }

  void _nextTrack() {
    setState(() {
      _currentTrackIndex = (_currentTrackIndex + 1) % _tracks.length;
    });
  }

  void _previousTrack() {
    setState(() {
      _currentTrackIndex = (_currentTrackIndex - 1 + _tracks.length) % _tracks.length;
    });
  }

  void _seekTo(double value) {
    setState(() {
      _progress = value;
    });
  }

  void _changePlaybackMode() {
    setState(() {
      switch (_playbackMode) {
        case NgPlaybackMode.normal:
          _playbackMode = NgPlaybackMode.repeat;
          break;
        case NgPlaybackMode.repeat:
          _playbackMode = NgPlaybackMode.shuffle;
          break;
        case NgPlaybackMode.shuffle:
          _playbackMode = NgPlaybackMode.normal;
          break;
      }
    });
  }

  void _updateEqBand(int index, double gain) {
    setState(() {
      _eqBands[index] = EqualizerBand(
        frequency: _eqBands[index].frequency,
        gain: gain,
      );
    });
  }

  @override
  void dispose() {
    _progressTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Beatwave NG Demo'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // Open settings
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Album Art and Track Info
          Container(
            padding: const EdgeInsets.all(16.0),
            child: _tracks.isEmpty
                ? const Center(child: Text('No tracks available'))
                : Column(
                    children: [
                      Stack(
                        alignment: Alignment.center,
                        children: [
                          Container(
                            width: 250,
                            height: 250,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: LinearGradient(
                                colors: [
                                  Colors.purple.shade300,
                                  Colors.blue.shade300,
                                ],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                            ),
                          ),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(16),
                            child: CachedNetworkImage(
                              imageUrl: _tracks[_currentTrackIndex].albumArt,
                              width: 220,
                              height: 220,
                              fit: BoxFit.cover,
                              placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                              errorWidget: (context, url, error) => Container(
                                color: Colors.grey[300],
                                child: const Icon(Icons.image),
                              ),
                            ),
                          ),
                          if (_isPlaying)
                            Container(
                              width: 220,
                              height: 220,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: Theme.of(context).primaryColor,
                                  width: 4,
                                ),
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        _tracks[_currentTrackIndex].title,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        _tracks[_currentTrackIndex].artist,
                        style: const TextStyle(
                          fontSize: 18,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${_tracks[_currentTrackIndex].genre} • ${_tracks[_currentTrackIndex].bpm} BPM',
                        style: const TextStyle(
                          fontSize: 14,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
          ),
          // Progress and Controls
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Column(
              children: [
                // Progress Bar
                Slider(
                  value: _progress,
                  onChanged: _seekTo,
                ),
                // Time Info
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(_formatTime(_progress * 252)), // Assuming 4:12 duration
                    Text(_tracks[_currentTrackIndex].duration),
                  ],
                ),
                const SizedBox(height: 16),
                // Playback Controls
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    IconButton(
                      icon: Icon(_getPlaybackModeIcon()),
                      onPressed: _changePlaybackMode,
                    ),
                    IconButton(
                      icon: const Icon(Icons.skip_previous, size: 40),
                      onPressed: _previousTrack,
                    ),
                    FloatingActionButton(
                      onPressed: _togglePlayback,
                      child: Icon(_isPlaying ? Icons.pause : Icons.play_arrow),
                    ),
                    IconButton(
                      icon: const Icon(Icons.skip_next, size: 40),
                      onPressed: _nextTrack,
                    ),
                    IconButton(
                      icon: const Icon(Icons.playlist_play),
                      onPressed: () {
                        // Open playlist
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Equalizer
          Container(
            height: 150,
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Equalizer',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                Expanded(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: _eqBands.map((band) {
                      int index = _eqBands.indexOf(band);
                      return Column(
                        children: [
                          RotatedBox(
                            quarterTurns: -1,
                            child: Text(
                              band.frequency,
                              style: const TextStyle(fontSize: 10),
                            ),
                          ),
                          RotatedBox(
                            quarterTurns: -1,
                            child: Slider(
                              value: band.gain,
                              min: -1.0,
                              max: 1.0,
                              onChanged: (value) => _updateEqBand(index, value),
                            ),
                          ),
                        ],
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
          // Volume Controls
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Column(
              children: [
                Row(
                  children: [
                    const Icon(Icons.volume_down),
                    Expanded(
                      child: Slider(
                        value: _volume,
                        onChanged: (value) {
                          setState(() {
                            _volume = value;
                          });
                        },
                      ),
                    ),
                    const Icon(Icons.volume_up),
                  ],
                ),
                Row(
                  children: [
                    const Text('Bass'),
                    Expanded(
                      child: Slider(
                        value: _bass,
                        onChanged: (value) {
                          setState(() {
                            _bass = value;
                          });
                        },
                      ),
                    ),
                    const Text('Treble'),
                    Expanded(
                      child: Slider(
                        value: _treble,
                        onChanged: (value) {
                          setState(() {
                            _treble = value;
                          });
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Track List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _errorMessage != null
                    ? Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(_errorMessage!),
                            const SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: _initializeDemo,
                              child: const Text('Retry'),
                            ),
                          ],
                        ),
                      )
                    : ListView.builder(
                        itemCount: _tracks.length,
                        itemBuilder: (context, index) {
                          var track = _tracks[index];
                          bool isCurrent = index == _currentTrackIndex;
                          
                          return ListTile(
                            leading: ClipRRect(
                              borderRadius: BorderRadius.circular(4),
                              child: CachedNetworkImage(
                                imageUrl: track.albumArt,
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
                                fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
                              ),
                            ),
                            subtitle: Text('${track.artist} • ${track.genre}'),
                            trailing: Text(track.duration),
                            onTap: () {
                              setState(() {
                                _currentTrackIndex = index;
                                _progress = 0.0;
                              });
                              
                              if (_isPlaying) {
                                _pausePlayback();
                                _startPlayback();
                              }
                            },
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }

  String _formatTime(double seconds) {
    int minutes = seconds ~/ 60;
    int secs = seconds.toInt() % 60;
    return '$minutes:${secs.toString().padLeft(2, '0')}';
  }

  IconData _getPlaybackModeIcon() {
    switch (_playbackMode) {
      case NgPlaybackMode.normal:
        return Icons.repeat;
      case NgPlaybackMode.repeat:
        return Icons.repeat_one;
      case NgPlaybackMode.shuffle:
        return Icons.shuffle;
    }
  }
}

enum NgPlaybackMode { normal, repeat, shuffle }

class NgTrack {
  final int id;
  final String title;
  final String artist;
  final String duration;
  final String albumArt;
  final String genre;
  final int bpm;

  NgTrack({
    required this.id,
    required this.title,
    required this.artist,
    required this.duration,
    required this.albumArt,
    required this.genre,
    required this.bpm,
  });
}

class EqualizerBand {
  final String frequency;
  final double gain;

  EqualizerBand({
    required this.frequency,
    required this.gain,
  });
}