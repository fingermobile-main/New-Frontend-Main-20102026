import 'package:flutter/material.dart';
import '../services/api_service.dart';

class PostDetailPage extends StatefulWidget {
  final int? postId;

  const PostDetailPage({super.key, this.postId});

  @override
  State<PostDetailPage> createState() => _PostDetailPageState();
}

class _PostDetailPageState extends State<PostDetailPage> {
  bool _isLoading = false;
  String? _errorMessage;
  Map<String, dynamic>? _postJson;
  late final ApiService _ApiService;

  @override
  void initState() {
    super.initState();
    _ApiService = ApiService();
    if (widget.postId != null) {
      _loadPost(widget.postId!);
    }
  }

  @override
  void dispose() {
    _ApiService.dispose();
    super.dispose();
  }

  Future<void> _loadPost(int postId) async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _postJson = null;
    });

    try {
      final response = await _ApiService.getPostById(postId);
      if (response.isSuccess) {
        final data = response.data;
        Map<String, dynamic>? postJson;

        if (data is Map<String, dynamic>) {
          if (data['post'] is Map<String, dynamic>) {
            postJson = data['post'] as Map<String, dynamic>;
          } else {
            postJson = data;
          }
        }

        if (mounted) {
          setState(() {
            _postJson = postJson;
          });
        }
      } else {
        if (mounted) {
          setState(() {
            _errorMessage =
                response.errorMessage ?? 'Failed to load post. Please try again.';
          });
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Failed to load post. Please try again.';
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

  @override
  Widget build(BuildContext context) {
    final hasPost = _postJson != null;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Post'),
      ),
      body: widget.postId == null
          ? const Center(
              child: Text('No post selected'),
            )
          : _isLoading && !hasPost
              ? const Center(child: CircularProgressIndicator())
              : _errorMessage != null && !hasPost
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(_errorMessage!),
                          const SizedBox(height: 16),
                          ElevatedButton(
                            onPressed: () => _loadPost(widget.postId!),
                            child: const Text('Retry'),
                          ),
                        ],
                      ),
                    )
                  : _buildPostContent(),
    );
  }

  Widget _buildPostContent() {
    final json = _postJson ?? {};
    final id = json['id'];
    final memberId = json['member_id'];
    final content = json['text_content']?.toString() ?? '';
    final mediaUrl = json['media_url']?.toString();
    final createdAt = json['created_at'];

    final timestamp = _parseTimestamp(createdAt);
    final timeLabel = _formatTimestamp(timestamp);
    final memberLabel =
        memberId != null && memberId.toString().isNotEmpty ? 'member $memberId' : 'member';

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                child: Text(
                  memberLabel.isNotEmpty ? memberLabel[0].toUpperCase() : 'U',
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    memberLabel,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  Text(
                    timeLabel,
                    style: const TextStyle(
                      color: Colors.grey,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            content,
            style: const TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 16),
          if (mediaUrl != null && mediaUrl.isNotEmpty)
            Container(
              height: 240,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                image: DecorationImage(
                  image: NetworkImage(mediaUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          const SizedBox(height: 16),
          if (id != null)
            Text(
              'Post #$id',
              style: const TextStyle(
                color: Colors.grey,
                fontSize: 12,
              ),
            ),
        ],
      ),
    );
  }

  DateTime _parseTimestamp(dynamic value) {
    if (value is String) {
      return DateTime.tryParse(value) ?? DateTime.now();
    }
    return DateTime.now();
  }

  String _formatTimestamp(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else {
      return '${difference.inDays}d ago';
    }
  }
}
