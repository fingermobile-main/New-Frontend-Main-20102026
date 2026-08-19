import 'package:flutter/material.dart';

class LiveStreamingPage extends StatefulWidget {
  const LiveStreamingPage({super.key});

  @override
  State<LiveStreamingPage> createState() => _LiveStreamingPageState();
}

class _LiveStreamingPageState extends State<LiveStreamingPage> {
  bool _isLoading = false;
  String? _errorMessage;
  StreamData? _streamData;
  List<StreamComment> _comments = [];
  List<StreamViewer> _viewers = [];
  bool _isLive = true;
  bool _isMuted = false;
  bool _isFullscreen = false;
  int _likes = 1240;
  bool _isLiked = false;
  final TextEditingController _commentController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadStreamData();
    _simulateLiveComments();
  }

  Future<void> _loadStreamData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock stream data
      setState(() {
        _streamData = StreamData(
          id: 1,
          title: 'Live Coding Session - Building a Flutter App',
          streamer: Streamer(
            id: 1,
            name: 'Tech Guru',
            avatarUrl: 'https://via.placeholder.com/50/4ECDC4/FFFFFF?text=TG',
            followers: 25400,
          ),
          viewerCount: 1250,
          startTime: DateTime.now().subtract(const Duration(minutes: 30)),
          description: 'Join me as I build a real-time messaging app using Flutter and Firebase.',
        );

        _viewers = [
          StreamViewer(
            id: 1,
            name: 'Alex Johnson',
            avatarUrl: 'https://via.placeholder.com/40/FF6B6B/FFFFFF?text=AJ',
          ),
          StreamViewer(
            id: 2,
            name: 'Sarah Williams',
            avatarUrl: 'https://via.placeholder.com/40/6A0572/FFFFFF?text=SW',
          ),
          StreamViewer(
            id: 3,
            name: 'Mike Chen',
            avatarUrl: 'https://via.placeholder.com/40/118AB2/FFFFFF?text=MC',
          ),
        ];

        _comments = [
          StreamComment(
            id: 1,
            author: CommentAuthor(
              id: 1,
              name: 'CodeMaster',
              avatarUrl: 'https://via.placeholder.com/30/FFD166/000000?text=CM',
            ),
            text: 'Great explanation! Can you show how to handle errors?',
            timestamp: DateTime.now().subtract(const Duration(minutes: 5)),
          ),
          StreamComment(
            id: 2,
            author: CommentAuthor(
              id: 2,
              name: 'FlutterFan',
              avatarUrl: 'https://via.placeholder.com/30/073B4C/FFFFFF?text=FF',
            ),
            text: 'This is really helpful, thanks for sharing!',
            timestamp: DateTime.now().subtract(const Duration(minutes: 3)),
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load stream. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _simulateLiveComments() {
    // Simulate incoming comments during the stream
    Future.delayed(const Duration(seconds: 10), () {
      if (mounted && _isLive) {
        setState(() {
          _comments.add(StreamComment(
            id: _comments.length + 1,
            author: CommentAuthor(
              id: 3,
              name: 'NewViewer',
              avatarUrl: 'https://via.placeholder.com/30/EF476F/FFFFFF?text=NV',
            ),
            text: 'Just joined! What topic are we covering today?',
            timestamp: DateTime.now(),
          ));
        });
        _simulateLiveComments(); // Continue simulating
      }
    });
  }

  void _toggleLike() {
    setState(() {
      _isLiked = !_isLiked;
      _likes += _isLiked ? 1 : -1;
    });
  }

  void _sendComment() {
    if (_commentController.text.trim().isEmpty) return;

    setState(() {
      _comments.add(StreamComment(
        id: _comments.length + 1,
        author: CommentAuthor(
          id: 0, // Current member
          name: 'You',
          avatarUrl: 'https://via.placeholder.com/30/118AB2/FFFFFF?text=Y',
        ),
        text: _commentController.text,
        timestamp: DateTime.now(),
      ));
      _commentController.clear();
    });
  }

  void _toggleMute() {
    setState(() {
      _isMuted = !_isMuted;
    });
  }

  void _toggleFullscreen() {
    setState(() {
      _isFullscreen = !_isFullscreen;
    });
  }

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _isLoading && _streamData == null
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null && _streamData == null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(_errorMessage!),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadStreamData,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : Column(
                  children: [
                    // Stream Video Player
                    Stack(
                      children: [
                        // Video placeholder
                        Container(
                          height: _isFullscreen
                              ? MediaQuery.of(context).size.height
                              : MediaQuery.of(context).size.height * 0.4,
                          color: Colors.black,
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.live_tv,
                                  size: 64,
                                  color: Colors.red.shade400,
                                ),
                                const SizedBox(height: 16),
                                const Text(
                                  'LIVE STREAM',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  _streamData?.title ?? 'Untitled Stream',
                                  style: const TextStyle(
                                    color: Colors.white70,
                                    fontSize: 16,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ],
                            ),
                          ),
                        ),
                        // Live indicator
                        Positioned(
                          top: 16,
                          left: 16,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.red,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.circle,
                                  color: Colors.white,
                                  size: 12,
                                ),
                                SizedBox(width: 4),
                                Text(
                                  'LIVE',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        // Viewer count
                        Positioned(
                          top: 16,
                          right: 16,
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.black54,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  Icons.visibility,
                                  color: Colors.white,
                                  size: 16,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  '${_streamData?.viewerCount ?? 0}',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        // Control buttons
                        Positioned(
                          bottom: 16,
                          right: 16,
                          child: Row(
                            children: [
                              IconButton(
                                icon: Icon(
                                  _isMuted ? Icons.volume_off : Icons.volume_up,
                                  color: Colors.white,
                                ),
                                onPressed: _toggleMute,
                              ),
                              IconButton(
                                icon: Icon(
                                  _isFullscreen
                                      ? Icons.fullscreen_exit
                                      : Icons.fullscreen,
                                  color: Colors.white,
                                ),
                                onPressed: _toggleFullscreen,
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    if (!_isFullscreen) ...[
                      // Stream Info
                      Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                CircleAvatar(
                                  backgroundImage: NetworkImage(
                                    _streamData?.streamer.avatarUrl ??
                                        'https://via.placeholder.com/50',
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        _streamData?.title ?? 'Untitled Stream',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 18,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        _streamData?.streamer.name ?? 'Unknown Streamer',
                                        style: const TextStyle(
                                          color: Colors.grey,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                IconButton(
                                  icon: Icon(
                                    _isLiked ? Icons.favorite : Icons.favorite_border,
                                    color: _isLiked ? Colors.red : null,
                                  ),
                                  onPressed: _toggleLike,
                                ),
                                Text('$_likes'),
                              ],
                            ),
                            const SizedBox(height: 16),
                            Text(
                              _streamData?.description ??
                                  'No description available',
                              style: const TextStyle(
                                color: Colors.grey,
                              ),
                            ),
                          ],
                        ),
                      ),
                      // Comments Section
                      Expanded(
                        child: Column(
                          children: [
                            // Viewers
                            SizedBox(
                              height: 50,
                              child: ListView.builder(
                                scrollDirection: Axis.horizontal,
                                itemCount: _viewers.length,
                                itemBuilder: (context, index) {
                                  var viewer = _viewers[index];
                                  return Padding(
                                    padding: EdgeInsets.only(
                                      left: index == 0 ? 16 : 8,
                                      right: 8,
                                    ),
                                    child: Column(
                                      children: [
                                        CircleAvatar(
                                          radius: 15,
                                          backgroundImage: NetworkImage(viewer.avatarUrl),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          viewer.name,
                                          style: const TextStyle(
                                            fontSize: 10,
                                          ),
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                            ),
                            // Comments list
                            Expanded(
                              child: ListView.builder(
                                reverse: true,
                                itemCount: _comments.length,
                                itemBuilder: (context, index) {
                                  var comment = _comments[_comments.length - 1 - index];
                                  return ListTile(
                                    leading: CircleAvatar(
                                      radius: 15,
                                      backgroundImage: NetworkImage(comment.author.avatarUrl),
                                    ),
                                    title: Text(
                                      comment.author.name,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 14,
                                      ),
                                    ),
                                    subtitle: Text(
                                      comment.text,
                                      style: const TextStyle(
                                        fontSize: 14,
                                      ),
                                    ),
                                    trailing: Text(
                                      _formatTime(comment.timestamp),
                                      style: const TextStyle(
                                        color: Colors.grey,
                                        fontSize: 12,
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                            // Comment input
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: TextField(
                                      controller: _commentController,
                                      decoration: const InputDecoration(
                                        hintText: 'Add a comment...',
                                        border: OutlineInputBorder(),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  IconButton(
                                    icon: const Icon(Icons.send),
                                    onPressed: _sendComment,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
    );
  }

  String _formatTime(DateTime time) {
    final now = DateTime.now();
    final difference = now.difference(time);

    if (difference.inSeconds < 60) {
      return '${difference.inSeconds}s ago';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else {
      return '${difference.inHours}h ago';
    }
  }
}

class StreamData {
  final int id;
  final String title;
  final Streamer streamer;
  final int viewerCount;
  final DateTime startTime;
  final String description;

  StreamData({
    required this.id,
    required this.title,
    required this.streamer,
    required this.viewerCount,
    required this.startTime,
    required this.description,
  });
}

class Streamer {
  final int id;
  final String name;
  final String avatarUrl;
  final int followers;

  Streamer({
    required this.id,
    required this.name,
    required this.avatarUrl,
    required this.followers,
  });
}

class StreamComment {
  final int id;
  final CommentAuthor author;
  final String text;
  final DateTime timestamp;

  StreamComment({
    required this.id,
    required this.author,
    required this.text,
    required this.timestamp,
  });
}

class CommentAuthor {
  final int id;
  final String name;
  final String avatarUrl;

  CommentAuthor({
    required this.id,
    required this.name,
    required this.avatarUrl,
  });
}

class StreamViewer {
  final int id;
  final String name;
  final String avatarUrl;

  StreamViewer({
    required this.id,
    required this.name,
    required this.avatarUrl,
  });
}