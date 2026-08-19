import 'package:flutter/material.dart';
import 'dart:async';

class BeatwaveDemoPage extends StatefulWidget {
  const BeatwaveDemoPage({super.key});

  @override
  State<BeatwaveDemoPage> createState() => _BeatwaveDemoPageState();
}

class _BeatwaveDemoPageState extends State<BeatwaveDemoPage> {
  bool _isLoading = false;
  String? _errorMessage;
  bool _isPlaying = false;
  int _currentTrackIndex = 0;
  double _progress = 0.0;
  Timer? _progressTimer;
  List<Track> _tracks = [];
  List<VisualizerBar> _visualizerBars = [];

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
          Track(
            id: 1,
            title: 'Digital Sunrise',
            artist: 'Beatwave AI',
            duration: '3:45',
            albumArt: 'https://via.placeholder.com/300',
            waveform: List.generate(100, (index) => (index % 10) / 10),
          ),
          Track(
            id: 2,
            title: 'Neon Dreams',
            artist: 'Synth Master',
            duration: '4:22',
            albumArt: 'https://via.placeholder.com/300',
            waveform: List.generate(100, (index) => ((index + 5) % 10) / 10),
          ),
          Track(
            id: 3,
            title: 'Cyber Groove',
            artist: 'Virtual Band',
            duration: '3:18',
            albumArt: 'https://via.placeholder.com/300',
            waveform: List.generate(100, (index) => ((index + 3) % 10) / 10),
          ),
        ];
        
        // Initialize visualizer bars
        _visualizerBars = List.generate(
          32,
          (index) => VisualizerBar(height: 0.1 + (index % 5) * 0.2),
        );
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load demo. Please try again.';
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
      
      // Update visualizer
      setState(() {
        for (int i = 0; i < _visualizerBars.length; i++) {
          double variation = (DateTime.now().millisecondsSinceEpoch % 1000) / 1000;
          _visualizerBars[i] = VisualizerBar(
            height: 0.1 + (variation * 0.9),
          );
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

  @override
  void dispose() {
    _progressTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Beatwave Demo'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          // Visualizer
          Container(
            height: 200,
            color: Colors.black,
            child: CustomPaint(
              size: const Size(double.infinity, 200),
              painter: WaveformPainter(_tracks.isEmpty ? [] : _tracks[_currentTrackIndex].waveform),
            ),
          ),
          // Visualizer Bars
          Container(
            height: 100,
            color: Colors.black87,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: _visualizerBars.map((bar) {
                return Container(
                  width: 8,
                  height: 80 * bar.height,
                  decoration: BoxDecoration(
                    color: Colors.purpleAccent,
                    borderRadius: BorderRadius.circular(4),
                  ),
                );
              }).toList(),
            ),
          ),
          // Track Info
          Container(
            padding: const EdgeInsets.all(16.0),
            child: _tracks.isEmpty
                ? const Center(child: Text('No tracks available'))
                : Column(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Image.network(
                          _tracks[_currentTrackIndex].albumArt,
                          width: 200,
                          height: 200,
                          fit: BoxFit.cover,
                        ),
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
                      const SizedBox(height: 16),
                      // Progress Bar
                      Slider(
                        value: _progress,
                        onChanged: _seekTo,
                      ),
                      // Time Info
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(_formatTime(_progress * 225)), // Assuming 3:45 duration
                          Text(_tracks[_currentTrackIndex].duration),
                        ],
                      ),
                    ],
                  ),
          ),
          // Controls
          Container(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
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
                              child: Image.network(
                                track.albumArt,
                                width: 50,
                                height: 50,
                                fit: BoxFit.cover,
                              ),
                            ),
                            title: Text(
                              track.title,
                              style: TextStyle(
                                fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
                              ),
                            ),
                            subtitle: Text(track.artist),
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
}

class Track {
  final int id;
  final String title;
  final String artist;
  final String duration;
  final String albumArt;
  final List<double> waveform;

  Track({
    required this.id,
    required this.title,
    required this.artist,
    required this.duration,
    required this.albumArt,
    required this.waveform,
  });
}

class VisualizerBar {
  final double height;

  VisualizerBar({required this.height});
}

class WaveformPainter extends CustomPainter {
  final List<double> waveform;

  WaveformPainter(this.waveform);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.purpleAccent
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final path = Path();
    
    if (waveform.isEmpty) return;
    
    double widthStep = size.width / (waveform.length - 1);
    
    path.moveTo(0, size.height / 2);
    
    for (int i = 1; i < waveform.length; i++) {
      double x = i * widthStep;
      double y = size.height / 2 - (waveform[i] * size.height / 2);
      path.lineTo(x, y);
    }
    
    canvas.drawPath(path, paint);
    
    // Draw mirrored waveform
    final mirrorPaint = Paint()
      ..color = Colors.purpleAccent.withOpacity(0.5)
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;
    
    final mirrorPath = Path();
    mirrorPath.moveTo(0, size.height / 2);
    
    for (int i = 1; i < waveform.length; i++) {
      double x = i * widthStep;
      double y = size.height / 2 + (waveform[i] * size.height / 2);
      mirrorPath.lineTo(x, y);
    }
    
    canvas.drawPath(mirrorPath, mirrorPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}