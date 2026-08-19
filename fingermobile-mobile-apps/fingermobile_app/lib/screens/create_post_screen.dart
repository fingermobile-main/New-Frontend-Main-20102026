import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'dart:io';
import '../providers/app_provider.dart';

class CreatePostScreen extends StatefulWidget {
  @override
  _CreatePostScreenState createState() => _CreatePostScreenState();
}

class _CreatePostScreenState extends State<CreatePostScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _postController = TextEditingController();
  final ImagePicker _picker = ImagePicker();
  List<File> _imageFiles = [];
  bool _isLoading = false;
  String _postType = 'text';
  String _privacyLevel = 'public';
  bool _hasMedia = false;
  String _selectedPrivacy = 'public'; // public, friends, private

  @override
  void dispose() {
    _postController.dispose();
    super.dispose();
  }

  Future<void> _pickImageFromGallery() async {
    try {
      final XFile? pickedFile = await _picker.pickImage(source: ImageSource.gallery);
      
      if (pickedFile != null) {
        setState(() {
          _imageFiles.add(File(pickedFile.path));
          _hasMedia = true;
        });
      }
    } catch (e) {
      print('Error picking image: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error picking image: $e')),
        );
      }
    }
  }

  Future<void> _captureImageWithCamera() async {
    try {
      final XFile? pickedFile = await _picker.pickImage(source: ImageSource.camera);
      
      if (pickedFile != null) {
        setState(() {
          _imageFiles.add(File(pickedFile.path));
          _hasMedia = true;
        });
      }
    } catch (e) {
      print('Error capturing image: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error capturing image: $e')),
        );
      }
    }
  }

  Future<void> _removeImage(int index) async {
    setState(() {
      _imageFiles.removeAt(index);
      if (_imageFiles.isEmpty) {
        _hasMedia = false;
      }
    });
  }

  Future<void> _createPost() async {
    if (_postController.text.trim().isEmpty && _imageFiles.isEmpty) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Please enter content or add media'),
            backgroundColor: Colors.red,
          ),
        );
      }
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final provider = Provider.of<AppProvider>(context, listen: false);
      
      // Create post with all the media files
      final success = await provider.createPost(
        _postController.text,
        mediaUrls: _imageFiles.map((file) => file.path).toList(),
      );

      if (success) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Post created successfully!')),
          );
          // Clear the form
          _postController.clear();
          setState(() {
            _imageFiles.clear();
            _hasMedia = false;
          });
          // Pop the screen if we're successful
          Navigator.pop(context);
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to create post'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error creating post: $e'),
            backgroundColor: Colors.red,
          ),
        );
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
    return Scaffold(
      appBar: AppBar(
        title: Text('Create Post'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          TextButton(
            onPressed: _isLoading ? null : _createPost,
            child: Text(
              'POST',
              style: TextStyle(
                color: _isLoading ? Colors.grey : Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: EdgeInsets.all(16),
          children: [
            // Post content input
            TextFormField(
              controller: _postController,
              maxLines: 8,
              decoration: InputDecoration(
                hintText: 'What\'s on your mind?',
                border: InputBorder.none,
                hintStyle: TextStyle(color: Colors.grey[400]),
              ),
              validator: (value) {
                if (value == null || value.trim().isEmpty) {
                  return 'Please enter some content for your post';
                }
                return null;
              },
            ),
            
            SizedBox(height: 16),
            
            // Media preview if images are selected
            if (_imageFiles.isNotEmpty)
              Container(
                width: double.infinity,
                height: 250,
                child: GridView.builder(
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: _imageFiles.length > 1 ? 2 : 1,
                    childAspectRatio: 16/9,
                    crossAxisSpacing: 8,
                    mainAxisSpacing: 8,
                  ),
                  itemCount: _imageFiles.length,
                  itemBuilder: (context, index) {
                    return Stack(
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(8),
                          child: Image.file(
                            _imageFiles[index],
                            fit: BoxFit.cover,
                            width: double.infinity,
                            height: double.infinity,
                          ),
                        ),
                        Positioned(
                          top: 8,
                          right: 8,
                          child: Container(
                            decoration: BoxDecoration(
                              color: Colors.black54,
                              shape: BoxShape.circle,
                            ),
                            child: IconButton(
                              icon: Icon(Icons.close, color: Colors.white, size: 20),
                              onPressed: () => _removeImage(index),
                            ),
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
            
            if (_imageFiles.isNotEmpty) SizedBox(height: 16),
            
            // Media options
            Container(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _pickImageFromGallery,
                      icon: Icon(Icons.photo_library, color: Colors.blue),
                      label: Text('Photo/Video', style: TextStyle(color: Colors.blue)),
                    ),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: _captureImageWithCamera,
                      icon: Icon(Icons.camera_alt, color: Colors.blue),
                      label: Text('Camera', style: TextStyle(color: Colors.blue)),
                    ),
                  ),
                ],
              ),
            ),
            
            SizedBox(height: 24),
            
            // Privacy settings
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                color: Colors.grey[100],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Privacy',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  SizedBox(height: 12),
                  SegmentedButton<String>(
                    segments: [
                      ButtonSegment(
                        value: 'public',
                        label: Text('Public'),
                        icon: Icon(Icons.public),
                      ),
                      ButtonSegment(
                        value: 'friends',
                        label: Text('Friends'),
                        icon: Icon(Icons.people),
                      ),
                      ButtonSegment(
                        value: 'private',
                        label: Text('Private'),
                        icon: Icon(Icons.lock),
                      ),
                    ],
                    selected: {_selectedPrivacy},
                    onSelectionChanged: (Set<String> newSelection) {
                      setState(() {
                        _selectedPrivacy = newSelection.first;
                      });
                    },
                  ),
                  SizedBox(height: 8),
                  Text(
                    _selectedPrivacy == 'public' 
                        ? 'Anyone on the internet can see this post'
                        : _selectedPrivacy == 'friends' 
                            ? 'Your friends can see this post' 
                            : 'Only you can see this post',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
            
            SizedBox(height: 24),
            
            // Additional options
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                color: Colors.grey[100],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Additional Options',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  SizedBox(height: 12),
                  SwitchListTile(
                    title: Text('Add Location'),
                    value: false,
                    onChanged: (bool value) {},
                  ),
                  SwitchListTile(
                    title: Text('Tag Friends'),
                    value: false,
                    onChanged: (bool value) {},
                  ),
                  SwitchListTile(
                    title: Text('Add Feeling'),
                    value: false,
                    onChanged: (bool value) {},
                  ),
                ],
              ),
            ),
            
            SizedBox(height: 24),
            
            // Loading indicator
            if (_isLoading)
              Padding(
                padding: EdgeInsets.all(16),
                child: LinearProgressIndicator(),
              ),
          ],
        ),
      ),
    );
  }
}