import 'package:flutter/material.dart';

class EditPostPage extends StatefulWidget {
  const EditPostPage({super.key});

  @override
  State<EditPostPage> createState() => _EditPostPageState();
}

class _EditPostPageState extends State<EditPostPage> {
  bool _isLoading = false;
  String? _errorMessage;
  final TextEditingController _contentController = TextEditingController();
  PostData? _postData;
  List<String> _selectedImages = [];
  bool _isUpdating = false;

  @override
  void initState() {
    super.initState();
    _loadPostData();
  }

  Future<void> _loadPostData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock post data
      setState(() {
        _postData = PostData(
          id: 1,
          content: 'This is the original post content that we want to edit. '
              'It can include multiple sentences and paragraphs to demonstrate '
              'how the editing functionality works in our application.',
          images: [
            'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Image+1',
            'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Image+2',
          ],
          likes: 24,
          comments: 8,
          timestamp: DateTime.now().subtract(const Duration(hours: 2)),
        );
        
        _contentController.text = _postData!.content;
        _selectedImages = List.from(_postData!.images);
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load post. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _updatePost() async {
    setState(() {
      _isUpdating = true;
      _errorMessage = null;
    });

    try {
      // Simulate update delay
      await Future.delayed(const Duration(seconds: 2));

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Post updated successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        
        // Pop with success result
        Navigator.of(context).pop(true);
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to update post. Please try again.';
      });
    } finally {
      setState(() {
        _isUpdating = false;
      });
    }
  }

  void _addImage() {
    // In a real app, this would open the image picker
    setState(() {
      _selectedImages.add('https://via.placeholder.com/150');
      if (_selectedImages.length > 5) {
        _selectedImages.removeLast();
      }
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Image added'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _removeImage(int index) {
    setState(() {
      _selectedImages.removeAt(index);
    });
  }

  @override
  void dispose() {
    _contentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Post'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: _isUpdating
                ? const CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  )
                : const Icon(Icons.check),
            onPressed: _isUpdating ? null : _updatePost,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(_errorMessage!),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadPostData,
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
                        // Original Post Preview
                        const Text(
                          'Original Post',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Post Content
                                Text(_postData?.content ?? ''),
                                const SizedBox(height: 16),
                                // Post Images
                                if (_postData?.images.isNotEmpty ?? false)
                                  SizedBox(
                                    height: 100,
                                    child: ListView.builder(
                                      scrollDirection: Axis.horizontal,
                                      itemCount: _postData!.images.length,
                                      itemBuilder: (context, index) {
                                        return Padding(
                                          padding: const EdgeInsets.only(right: 8.0),
                                          child: Container(
                                            width: 100,
                                            decoration: BoxDecoration(
                                              image: DecorationImage(
                                                image: NetworkImage(_postData!.images[index]),
                                                fit: BoxFit.cover,
                                              ),
                                              borderRadius: BorderRadius.circular(8),
                                            ),
                                          ),
                                        );
                                      },
                                    ),
                                  ),
                                const SizedBox(height: 16),
                                // Post Metadata
                                Row(
                                  children: [
                                    Icon(
                                      Icons.thumb_up,
                                      size: 16,
                                      color: Colors.grey,
                                    ),
                                    const SizedBox(width: 4),
                                    Text('${_postData?.likes ?? 0}'),
                                    const SizedBox(width: 16),
                                    Icon(
                                      Icons.comment,
                                      size: 16,
                                      color: Colors.grey,
                                    ),
                                    const SizedBox(width: 4),
                                    Text('${_postData?.comments ?? 0}'),
                                    const Spacer(),
                                    Text(
                                      _formatTime(_postData?.timestamp ?? DateTime.now()),
                                      style: const TextStyle(
                                        color: Colors.grey,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 32),
                        // Edit Section
                        const Text(
                          'Edit Content',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        // Content Editor
                        TextField(
                          controller: _contentController,
                          decoration: const InputDecoration(
                            hintText: 'Edit your post content...',
                            border: OutlineInputBorder(),
                          ),
                          maxLines: 5,
                        ),
                        const SizedBox(height: 16),
                        // Image Section
                        const Text(
                          'Images',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        // Selected Images
                        if (_selectedImages.isNotEmpty)
                          SizedBox(
                            height: 100,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: _selectedImages.length,
                              itemBuilder: (context, index) {
                                return Stack(
                                  children: [
                                    Container(
                                      width: 100,
                                      height: 100,
                                      margin: const EdgeInsets.only(right: 8),
                                      decoration: BoxDecoration(
                                        image: DecorationImage(
                                          image: NetworkImage(_selectedImages[index]),
                                          fit: BoxFit.cover,
                                        ),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                    ),
                                    Positioned(
                                      right: 0,
                                      child: IconButton(
                                        icon: const Icon(
                                          Icons.close,
                                          color: Colors.red,
                                        ),
                                        onPressed: () => _removeImage(index),
                                      ),
                                    ),
                                  ],
                                );
                              },
                            ),
                          ),
                        const SizedBox(height: 16),
                        // Add Image Button
                        ElevatedButton.icon(
                          onPressed: _addImage,
                          icon: const Icon(Icons.add_a_photo),
                          label: const Text('Add Image'),
                        ),
                        const SizedBox(height: 32),
                        // Error Message
                        if (_errorMessage != null)
                          Card(
                            color: Colors.red.shade100,
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Text(
                                _errorMessage!,
                                style: const TextStyle(
                                  color: Colors.red,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        const SizedBox(height: 16),
                        // Delete Post Button
                        Center(
                          child: TextButton(
                            onPressed: () {
                              showDialog(
                                context: context,
                                builder: (BuildContext context) {
                                  return AlertDialog(
                                    title: const Text('Delete Post'),
                                    content: const Text(
                                        'Are you sure you want to delete this post? This action cannot be undone.'),
                                    actions: [
                                      TextButton(
                                        onPressed: () {
                                          Navigator.of(context).pop();
                                        },
                                        child: const Text('Cancel'),
                                      ),
                                      TextButton(
                                        onPressed: () {
                                          Navigator.of(context).pop();
                                          // In a real app, you would delete the post here
                                          ScaffoldMessenger.of(context).showSnackBar(
                                            const SnackBar(
                                              content: Text('Post deleted successfully!'),
                                              backgroundColor: Colors.red,
                                            ),
                                          );
                                          Navigator.of(context).pop(true);
                                        },
                                        child: const Text(
                                          'Delete',
                                          style: TextStyle(color: Colors.red),
                                        ),
                                      ),
                                    ],
                                  );
                                },
                              );
                            },
                            child: const Text(
                              'Delete Post',
                              style: TextStyle(color: Colors.red),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
    );
  }

  String _formatTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else {
      return '${dateTime.month}/${dateTime.day}/${dateTime.year}';
    }
  }
}

class PostData {
  final int id;
  final String content;
  final List<String> images;
  final int likes;
  final int comments;
  final DateTime timestamp;

  PostData({
    required this.id,
    required this.content,
    required this.images,
    required this.likes,
    required this.comments,
    required this.timestamp,
  });
}