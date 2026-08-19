import 'package:flutter/material.dart';

class EnhancedEditorPage extends StatefulWidget {
  const EnhancedEditorPage({super.key});

  @override
  State<EnhancedEditorPage> createState() => _EnhancedEditorPageState();
}

class _EnhancedEditorPageState extends State<EnhancedEditorPage> {
  bool _isLoading = false;
  String? _errorMessage;
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _contentController = TextEditingController();
  List<EditorFeature> _features = [];
  List<MediaAsset> _mediaAssets = [];
  List<String> _selectedTags = [];
  List<String> _availableTags = [];
  PublishSettings _publishSettings = PublishSettings();
  bool _isSaving = false;
  bool _isPublishing = false;
  EditorMode _editorMode = EditorMode.richText;

  @override
  void initState() {
    super.initState();
    _loadEditorData();
  }

  Future<void> _loadEditorData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock editor data
      setState(() {
        _features = [
          EditorFeature(
            id: 'bold',
            icon: Icons.format_bold,
            label: 'Bold',
            isActive: false,
            onTap: () {
              _toggleFeature('bold');
            },
          ),
          EditorFeature(
            id: 'italic',
            icon: Icons.format_italic,
            label: 'Italic',
            isActive: false,
            onTap: () {
              _toggleFeature('italic');
            },
          ),
          EditorFeature(
            id: 'underline',
            icon: Icons.format_underline,
            label: 'Underline',
            isActive: false,
            onTap: () {
              _toggleFeature('underline');
            },
          ),
          EditorFeature(
            id: 'strikethrough',
            icon: Icons.format_strikethrough,
            label: 'Strikethrough',
            isActive: false,
            onTap: () {
              _toggleFeature('strikethrough');
            },
          ),
          EditorFeature(
            id: 'bullet_list',
            icon: Icons.format_list_bulleted,
            label: 'Bullet List',
            isActive: false,
            onTap: () {
              _toggleFeature('bullet_list');
            },
          ),
          EditorFeature(
            id: 'number_list',
            icon: Icons.format_list_numbered,
            label: 'Numbered List',
            isActive: false,
            onTap: () {
              _toggleFeature('number_list');
            },
          ),
          EditorFeature(
            id: 'quote',
            icon: Icons.format_quote,
            label: 'Quote',
            isActive: false,
            onTap: () {
              _toggleFeature('quote');
            },
          ),
          EditorFeature(
            id: 'link',
            icon: Icons.link,
            label: 'Insert Link',
            isActive: false,
            onTap: () {
              _insertLink();
            },
          ),
          EditorFeature(
            id: 'image',
            icon: Icons.image,
            label: 'Insert Image',
            isActive: false,
            onTap: () {
              _insertImage();
            },
          ),
          EditorFeature(
            id: 'video',
            icon: Icons.video_library,
            label: 'Insert Video',
            isActive: false,
            onTap: () {
              _insertVideo();
            },
          ),
        ];

        _availableTags = [
          'Technology',
          'Science',
          'Art',
          'Music',
          'Sports',
          'Travel',
          'Food',
          'Business',
          'Education',
          'Health',
          'Entertainment',
          'Politics',
        ];

        _mediaAssets = [
          MediaAsset(
            id: 1,
            url: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Image+1',
            type: MediaType.image,
          ),
          MediaAsset(
            id: 2,
            url: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Image+2',
            type: MediaType.image,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load editor. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _toggleFeature(String featureId) {
    setState(() {
      var feature = _features.firstWhere((f) => f.id == featureId);
      feature.isActive = !feature.isActive;
    });
  }

  void _insertLink() {
    // In a real app, this would open a dialog to enter link details
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Link insertion feature activated'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _insertImage() {
    // In a real app, this would open the image picker
    setState(() {
      _mediaAssets.add(MediaAsset(
        id: _mediaAssets.length + 1,
        url: 'https://via.placeholder.com/150',
        type: MediaType.image,
      ));
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Image added to media library'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _insertVideo() {
    // In a real app, this would open the video picker or URL input
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Video insertion feature activated'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _toggleTag(String tag) {
    setState(() {
      if (_selectedTags.contains(tag)) {
        _selectedTags.remove(tag);
      } else {
        _selectedTags.add(tag);
      }
    });
  }

  Future<void> _saveDraft() async {
    setState(() {
      _isSaving = true;
      _errorMessage = null;
    });

    try {
      // Simulate saving delay
      await Future.delayed(const Duration(seconds: 2));

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Draft saved successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to save draft. Please try again.';
      });
    } finally {
      setState(() {
        _isSaving = false;
      });
    }
  }

  Future<void> _publishContent() async {
    setState(() {
      _isPublishing = true;
      _errorMessage = null;
    });

    try {
      // Simulate publishing delay
      await Future.delayed(const Duration(seconds: 2));

      if (mounted) {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Published!'),
              content: const Text('Your content has been published successfully.'),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                    Navigator.of(context).pop(true); // Return success
                  },
                  child: const Text('OK'),
                ),
              ],
            );
          },
        );
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to publish content. Please try again.';
      });
    } finally {
      setState(() {
        _isPublishing = false;
      });
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _contentController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Enhanced Editor'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: _isSaving
                ? const CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  )
                : const Icon(Icons.save),
            onPressed: _isSaving ? null : _saveDraft,
          ),
          IconButton(
            icon: _isPublishing
                ? const CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  )
                : const Icon(Icons.publish),
            onPressed: _isPublishing ? null : _publishContent,
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
                        onPressed: _loadEditorData,
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
                        // Editor Mode Toggle
                        SegmentedButton<EditorMode>(
                          segments: const [
                            ButtonSegment(
                              value: EditorMode.richText,
                              label: Text('Rich Text'),
                            ),
                            ButtonSegment(
                              value: EditorMode.markdown,
                              label: Text('Markdown'),
                            ),
                          ],
                          selected: {_editorMode},
                          onSelectionChanged: (Set<EditorMode> newSelection) {
                            setState(() {
                              _editorMode = newSelection.first;
                            });
                          },
                        ),
                        const SizedBox(height: 16),
                        // Title Input
                        TextField(
                          controller: _titleController,
                          decoration: const InputDecoration(
                            hintText: 'Title',
                            border: InputBorder.none,
                            hintStyle: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Divider(),
                        // Toolbar
                        SizedBox(
                          height: 50,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: _features.length,
                            itemBuilder: (context, index) {
                              var feature = _features[index];
                              return IconButton(
                                icon: Icon(
                                  feature.icon,
                                  color: feature.isActive 
                                    ? Theme.of(context).primaryColor 
                                    : null,
                                ),
                                onPressed: feature.onTap,
                              );
                            },
                          ),
                        ),
                        const Divider(),
                        // Content Editor
                        TextField(
                          controller: _contentController,
                          decoration: const InputDecoration(
                            hintText: 'Write your content here...',
                            border: InputBorder.none,
                          ),
                          maxLines: null,
                          keyboardType: TextInputType.multiline,
                        ),
                        const SizedBox(height: 32),
                        // Media Assets
                        const Text(
                          'Media Library',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        if (_mediaAssets.isNotEmpty)
                          SizedBox(
                            height: 100,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: _mediaAssets.length,
                              itemBuilder: (context, index) {
                                var asset = _mediaAssets[index];
                                return Padding(
                                  padding: const EdgeInsets.only(right: 8.0),
                                  child: Container(
                                    width: 100,
                                    decoration: BoxDecoration(
                                      image: DecorationImage(
                                        image: NetworkImage(asset.url),
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
                        // Tags
                        const Text(
                          'Tags',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Wrap(
                          spacing: 8,
                          runSpacing: 8,
                          children: _availableTags.map((tag) {
                            bool isSelected = _selectedTags.contains(tag);
                            return FilterChip(
                              label: Text(tag),
                              selected: isSelected,
                              onSelected: (selected) => _toggleTag(tag),
                              selectedColor: Theme.of(context).primaryColor,
                            );
                          }).toList(),
                        ),
                        const SizedBox(height: 32),
                        // Publish Settings
                        const Text(
                          'Publish Settings',
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
                              children: [
                                // Visibility
                                ListTile(
                                  title: const Text('Visibility'),
                                  subtitle: Text(_publishSettings.visibility.name),
                                  trailing: IconButton(
                                    icon: const Icon(Icons.edit),
                                    onPressed: () {
                                      // Open visibility settings
                                    },
                                  ),
                                ),
                                const Divider(),
                                // Schedule
                                ListTile(
                                  title: const Text('Schedule Publication'),
                                  subtitle: Text(
                                    _publishSettings.scheduledTime != null
                                        ? 'Scheduled for ${_formatDateTime(_publishSettings.scheduledTime!)}'
                                        : 'Publish immediately',
                                  ),
                                  trailing: IconButton(
                                    icon: const Icon(Icons.schedule),
                                    onPressed: () {
                                      // Open schedule settings
                                    },
                                  ),
                                ),
                                const Divider(),
                                // Comments
                                SwitchListTile(
                                  title: const Text('Allow Comments'),
                                  value: _publishSettings.allowComments,
                                  onChanged: (value) {
                                    setState(() {
                                      _publishSettings.allowComments = value;
                                    });
                                  },
                                ),
                                const Divider(),
                                // Notifications
                                SwitchListTile(
                                  title: const Text('Send Notifications'),
                                  value: _publishSettings.sendNotifications,
                                  onChanged: (value) {
                                    setState(() {
                                      _publishSettings.sendNotifications = value;
                                    });
                                  },
                                ),
                              ],
                            ),
                          ),
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
                      ],
                    ),
                  ),
                ),
    );
  }

  String _formatDateTime(DateTime dateTime) {
    return '${dateTime.month}/${dateTime.day}/${dateTime.year} at ${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
  }
}

enum EditorMode { richText, markdown }
enum Visibility { public, friends, private }

class EditorFeature {
  final String id;
  final IconData icon;
  final String label;
  bool isActive;
  final VoidCallback onTap;

  EditorFeature({
    required this.id,
    required this.icon,
    required this.label,
    required this.isActive,
    required this.onTap,
  });
}

class MediaAsset {
  final int id;
  final String url;
  final MediaType type;

  MediaAsset({
    required this.id,
    required this.url,
    required this.type,
  });
}

enum MediaType { image, video, audio }

class PublishSettings {
  Visibility visibility;
  DateTime? scheduledTime;
  bool allowComments;
  bool sendNotifications;

  PublishSettings({
    this.visibility = Visibility.public,
    this.scheduledTime,
    this.allowComments = true,
    this.sendNotifications = true,
  });
}