import 'package:flutter/material.dart';

class EditorPage extends StatefulWidget {
  const EditorPage({super.key});

  @override
  State<EditorPage> createState() => _EditorPageState();
}

class _EditorPageState extends State<EditorPage> {
  bool _isLoading = false;
  String? _errorMessage;
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _contentController = TextEditingController();
  List<EditorToolbarOption> _toolbarOptions = [];
  List<String> _selectedTags = [];
  List<String> _availableTags = [];
  PublishVisibility _visibility = PublishVisibility.public;
  bool _isSaving = false;

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
        _toolbarOptions = [
          EditorToolbarOption(
            id: 'bold',
            icon: Icons.format_bold,
            label: 'Bold',
            onTap: () {
              // Apply bold formatting
            },
          ),
          EditorToolbarOption(
            id: 'italic',
            icon: Icons.format_italic,
            label: 'Italic',
            onTap: () {
              // Apply italic formatting
            },
          ),
          EditorToolbarOption(
            id: 'underline',
            icon: Icons.format_underline,
            label: 'Underline',
            onTap: () {
              // Apply underline formatting
            },
          ),
          EditorToolbarOption(
            id: 'link',
            icon: Icons.link,
            label: 'Link',
            onTap: () {
              // Insert link
            },
          ),
          EditorToolbarOption(
            id: 'image',
            icon: Icons.image,
            label: 'Image',
            onTap: () {
              // Insert image
            },
          ),
          EditorToolbarOption(
            id: 'bullet',
            icon: Icons.format_list_bulleted,
            label: 'Bullet List',
            onTap: () {
              // Insert bullet list
            },
          ),
        ];

        _availableTags = [
          'Technology',
          'Music',
          'Sports',
          'Travel',
          'Food',
          'Art',
          'Science',
          'Business',
          'Health',
          'Education',
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

  Future<void> _saveContent() async {
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
            content: Text('Content saved successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to save content. Please try again.';
      });
    } finally {
      setState(() {
        _isSaving = false;
      });
    }
  }

  Future<void> _publishContent() async {
    setState(() {
      _isSaving = true;
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
        _isSaving = false;
      });
    }
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
        title: const Text('Editor'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: _isSaving
                ? const CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  )
                : const Icon(Icons.save),
            onPressed: _isSaving ? null : _saveContent,
          ),
          IconButton(
            icon: const Icon(Icons.publish),
            onPressed: _isSaving ? null : _publishContent,
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
                            itemCount: _toolbarOptions.length,
                            itemBuilder: (context, index) {
                              var option = _toolbarOptions[index];
                              return IconButton(
                                icon: Icon(option.icon),
                                onPressed: option.onTap,
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
                        // Visibility
                        const Text(
                          'Visibility',
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
                                RadioListTile<PublishVisibility>(
                                  title: const Text('Public'),
                                  subtitle: const Text(
                                      'Visible to everyone'),
                                  value: PublishVisibility.public,
                                  groupValue: _visibility,
                                  onChanged: (value) {
                                    setState(() {
                                      _visibility = value ?? PublishVisibility.public;
                                    });
                                  },
                                ),
                                const Divider(),
                                RadioListTile<PublishVisibility>(
                                  title: const Text('Friends Only'),
                                  subtitle: const Text(
                                      'Visible to friends only'),
                                  value: PublishVisibility.friends,
                                  groupValue: _visibility,
                                  onChanged: (value) {
                                    setState(() {
                                      _visibility = value ?? PublishVisibility.friends;
                                    });
                                  },
                                ),
                                const Divider(),
                                RadioListTile<PublishVisibility>(
                                  title: const Text('Private'),
                                  subtitle: const Text(
                                      'Visible to only you'),
                                  value: PublishVisibility.private,
                                  groupValue: _visibility,
                                  onChanged: (value) {
                                    setState(() {
                                      _visibility = value ?? PublishVisibility.private;
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
}

enum PublishVisibility { public, friends, private }

class EditorToolbarOption {
  final String id;
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  EditorToolbarOption({
    required this.id,
    required this.icon,
    required this.label,
    required this.onTap,
  });
}