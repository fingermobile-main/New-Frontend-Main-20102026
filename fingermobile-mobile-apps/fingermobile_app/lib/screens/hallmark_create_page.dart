import 'package:flutter/material.dart';

class HallmarkCreatePage extends StatefulWidget {
  const HallmarkCreatePage({super.key});

  @override
  State<HallmarkCreatePage> createState() => _HallmarkCreatePageState();
}

class _HallmarkCreatePageState extends State<HallmarkCreatePage> {
  bool _isLoading = false;
  String? _errorMessage;
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final TextEditingController _locationController = TextEditingController();
  List<HallmarkMedia> _mediaItems = [];
  HallmarkCategory _selectedCategory = HallmarkCategory.general;
  HallmarkVisibility _visibility = HallmarkVisibility.public;
  DateTime? _eventDate;
  bool _isCreating = false;

  @override
  void initState() {
    super.initState();
  }

  Future<void> _selectEventDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );
    
    if (picked != null && picked != _eventDate) {
      setState(() {
        _eventDate = picked;
      });
    }
  }

  Future<void> _addMedia() async {
    // In a real app, this would open the image picker or camera
    setState(() {
      _mediaItems.add(HallmarkMedia(
        id: _mediaItems.length + 1,
        url: 'https://via.placeholder.com/150',
        type: MediaType.image,
      ));
    });

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Media added'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  void _removeMedia(int index) {
    setState(() {
      _mediaItems.removeAt(index);
    });
  }

  Future<void> _createHallmark() async {
    if (_titleController.text.isEmpty) {
      setState(() {
        _errorMessage = 'Please enter a title for your hallmark';
      });
      return;
    }

    setState(() {
      _isCreating = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 2));

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Hallmark created successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        
        // Navigate back
        Navigator.of(context).pop(true);
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to create hallmark. Please try again.';
      });
    } finally {
      setState(() {
        _isCreating = false;
      });
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Hallmark'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: _errorMessage != null
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(_errorMessage!),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _errorMessage = null;
                      });
                    },
                    child: const Text('OK'),
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
                    // Title
                    const Text(
                      'Title',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _titleController,
                      decoration: const InputDecoration(
                        hintText: 'Enter hallmark title',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Description
                    const Text(
                      'Description',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _descriptionController,
                      decoration: const InputDecoration(
                        hintText: 'Describe your hallmark',
                        border: OutlineInputBorder(),
                      ),
                      maxLines: 4,
                    ),
                    const SizedBox(height: 24),
                    // Location
                    const Text(
                      'Location',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _locationController,
                      decoration: const InputDecoration(
                        hintText: 'Where did this happen?',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Date
                    const Text(
                      'Event Date',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Card(
                      child: ListTile(
                        title: Text(
                          _eventDate == null
                              ? 'Select date'
                              : '${_eventDate!.month}/${_eventDate!.day}/${_eventDate!.year}',
                        ),
                        trailing: const Icon(Icons.calendar_today),
                        onTap: _selectEventDate,
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Category
                    const Text(
                      'Category',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          children: [
                            _buildCategoryOption(
                              HallmarkCategory.achievement,
                              Icons.emoji_events,
                              'Achievement',
                            ),
                            const Divider(),
                            _buildCategoryOption(
                              HallmarkCategory.experience,
                              Icons.travel_explore,
                              'Experience',
                            ),
                            const Divider(),
                            _buildCategoryOption(
                              HallmarkCategory.milestone,
                              Icons.flag,
                              'Milestone',
                            ),
                            const Divider(),
                            _buildCategoryOption(
                              HallmarkCategory.memory,
                              Icons.photo_camera,
                              'Memory',
                            ),
                            const Divider(),
                            _buildCategoryOption(
                              HallmarkCategory.general,
                              Icons.category,
                              'General',
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Visibility
                    const Text(
                      'Visibility',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          children: [
                            _buildVisibilityOption(
                              HallmarkVisibility.public,
                              Icons.public,
                              'Public',
                              'Visible to everyone',
                            ),
                            const Divider(),
                            _buildVisibilityOption(
                              HallmarkVisibility.friends,
                              Icons.group,
                              'Friends',
                              'Visible to friends only',
                            ),
                            const Divider(),
                            _buildVisibilityOption(
                              HallmarkVisibility.private,
                              Icons.lock,
                              'Private',
                              'Visible to only you',
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Media
                    const Text(
                      'Media',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 8),
                    if (_mediaItems.isNotEmpty)
                      SizedBox(
                        height: 100,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: _mediaItems.length,
                          itemBuilder: (context, index) {
                            var media = _mediaItems[index];
                            return Stack(
                              children: [
                                Container(
                                  width: 100,
                                  height: 100,
                                  margin: const EdgeInsets.only(right: 8),
                                  decoration: BoxDecoration(
                                    image: DecorationImage(
                                      image: NetworkImage(media.url),
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
                                    onPressed: () => _removeMedia(index),
                                  ),
                                ),
                              ],
                            );
                          },
                        ),
                      ),
                    const SizedBox(height: 16),
                    ElevatedButton.icon(
                      onPressed: _addMedia,
                      icon: const Icon(Icons.add_a_photo),
                      label: const Text('Add Photo/Video'),
                    ),
                    const SizedBox(height: 32),
                    // Create Button
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isCreating ? null : _createHallmark,
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: _isCreating
                            ? const CircularProgressIndicator(
                                color: Colors.white,
                              )
                            : const Text(
                                'Create Hallmark',
                                style: TextStyle(
                                  fontSize: 18,
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

  Widget _buildCategoryOption(HallmarkCategory category, IconData icon, String label) {
    bool isSelected = _selectedCategory == category;
    return ListTile(
      leading: Icon(
        icon,
        color: isSelected ? Theme.of(context).primaryColor : null,
      ),
      title: Text(label),
      trailing: isSelected
          ? Icon(
              Icons.check,
              color: Theme.of(context).primaryColor,
            )
          : null,
      onTap: () {
        setState(() {
          _selectedCategory = category;
        });
      },
    );
  }

  Widget _buildVisibilityOption(
    HallmarkVisibility visibility, 
    IconData icon, 
    String label, 
    String description
  ) {
    bool isSelected = _visibility == visibility;
    return ListTile(
      leading: Icon(
        icon,
        color: isSelected ? Theme.of(context).primaryColor : null,
      ),
      title: Text(label),
      subtitle: Text(description),
      trailing: isSelected
          ? Icon(
              Icons.check,
              color: Theme.of(context).primaryColor,
            )
          : null,
      onTap: () {
        setState(() {
          _visibility = visibility;
        });
      },
    );
  }
}

enum HallmarkCategory { achievement, experience, milestone, memory, general }
enum HallmarkVisibility { public, friends, private }
enum MediaType { image, video }

class HallmarkMedia {
  final int id;
  final String url;
  final MediaType type;

  HallmarkMedia({
    required this.id,
    required this.url,
    required this.type,
  });
}