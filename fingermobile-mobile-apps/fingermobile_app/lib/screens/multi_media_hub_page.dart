import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class MultiMediaHubPage extends StatefulWidget {
  const MultiMediaHubPage({super.key});

  @override
  State<MultiMediaHubPage> createState() => _MultiMediaHubPageState();
}

class _MultiMediaHubPageState extends State<MultiMediaHubPage> {
  final List<Map<String, dynamic>> _mediaItems = [
    {
      'id': 1,
      'title': 'Vacation Photos',
      'type': 'images',
      'count': 42,
      'date': 'Dec 20, 2025',
      'size': '1.2 GB',
      'thumbnail': 'https://via.placeholder.com/150',
    },
    {
      'id': 2,
      'title': 'Family Videos',
      'type': 'videos',
      'count': 18,
      'date': 'Dec 15, 2025',
      'size': '2.4 GB',
      'thumbnail': 'https://via.placeholder.com/150',
    },
    {
      'id': 3,
      'title': 'Music Collection',
      'type': 'audio',
      'count': 128,
      'date': 'Dec 10, 2025',
      'size': '850 MB',
      'thumbnail': 'https://via.placeholder.com/150',
    },
    {
      'id': 4,
      'title': 'Documents',
      'type': 'documents',
      'count': 24,
      'date': 'Dec 5, 2025',
      'size': '45 MB',
      'thumbnail': 'https://via.placeholder.com/150',
    },
    {
      'id': 5,
      'title': 'Screenshots',
      'type': 'images',
      'count': 67,
      'date': 'Dec 1, 2025',
      'size': '320 MB',
      'thumbnail': 'https://via.placeholder.com/150',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Media Hub'),
        centerTitle: false,
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Search functionality
            },
          ),
          PopupMenuButton(
            icon: const Icon(Icons.more_vert),
            onSelected: (value) {
              if (value == 'upload') {
                _uploadMedia();
              } else if (value == 'settings') {
                // Navigate to media settings
              } else if (value == 'backup') {
                // Backup media
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'upload',
                child: Text('Upload Media'),
              ),
              const PopupMenuItem(
                value: 'backup',
                child: Text('Backup Media'),
              ),
              const PopupMenuItem(
                value: 'settings',
                child: Text('Settings'),
              ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // Stats header
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.grey[100],
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatCard('279', 'Total Files'),
                _buildStatCard('4.8 GB', 'Total Size'),
                _buildStatCard('5', 'Collections'),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Media types filter
          Container(
            height: 50,
            margin: const EdgeInsets.symmetric(horizontal: 16),
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                _buildCategoryChip('All', true),
                const SizedBox(width: 8),
                _buildCategoryChip('Images', false),
                const SizedBox(width: 8),
                _buildCategoryChip('Videos', false),
                const SizedBox(width: 8),
                _buildCategoryChip('Audio', false),
                const SizedBox(width: 8),
                _buildCategoryChip('Documents', false),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Media collections
          Expanded(
            child: ListView.builder(
              itemCount: _mediaItems.length,
              itemBuilder: (context, index) {
                final item = _mediaItems[index];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: ListTile(
                    leading: Container(
                      width: 60,
                      height: 60,
                      decoration: BoxDecoration(
                        color: Colors.grey[200],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: CachedNetworkImage(
                          imageUrl: item['thumbnail'],
                          fit: BoxFit.cover,
                          placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                          errorWidget: (context, url, error) => Container(
                            color: Colors.grey[300],
                            child: const Icon(Icons.image),
                          ),
                        ),
                      ),
                    ),
                    title: Text(
                      item['title'],
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${item['count']} items • ${item['size']}',
                          style: const TextStyle(fontSize: 12),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Updated: ${item['date']}',
                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                      ],
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {
                      _openMediaCollection(item['id']);
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }

  Widget _buildCategoryChip(String label, bool isSelected) {
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        setState(() {
          // In a real app, you would filter the list based on category
        });
      },
      selectedColor: Colors.grey[300],
      labelStyle: TextStyle(
        color: isSelected ? Colors.black : Colors.grey[600],
      ),
      checkmarkColor: Colors.black,
      side: BorderSide(
        color: isSelected ? Colors.transparent : Colors.grey[300]!,
      ),
    );
  }

  void _uploadMedia() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(16),
          child: Wrap(
            children: [
              ListTile(
                leading: const Icon(Icons.photo_camera),
                title: const Text('Take Photo'),
                onTap: () {
                  Navigator.of(context).pop();
                  // Handle photo capture
                },
              ),
              ListTile(
                leading: const Icon(Icons.videocam),
                title: const Text('Record Video'),
                onTap: () {
                  Navigator.of(context).pop();
                  // Handle video recording
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('Select from Gallery'),
                onTap: () {
                  Navigator.of(context).pop();
                  // Handle gallery selection
                },
              ),
              ListTile(
                leading: const Icon(Icons.file_upload),
                title: const Text('Upload File'),
                onTap: () {
                  Navigator.of(context).pop();
                  // Handle file upload
                },
              ),
            ],
          ),
        );
      },
    );
  }

  void _openMediaCollection(int id) {
    // Navigate to media collection details
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MediaCollectionPage(collectionId: id),
      ),
    );
  }
}

class MediaCollectionPage extends StatefulWidget {
  final int collectionId;

  const MediaCollectionPage({super.key, required this.collectionId});

  @override
  State<MediaCollectionPage> createState() => _MediaCollectionPageState();
}

class _MediaCollectionPageState extends State<MediaCollectionPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Media Collection'),
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
      ),
      body: const Center(
        child: Text('Media Collection Details'),
      ),
    );
  }
}