import 'package:flutter/material.dart';
import 'package:fingermobile_app/services/content_service.dart';

class ContentFeedScreen extends StatefulWidget {
  const ContentFeedScreen({super.key});

  @override
  State<ContentFeedScreen> createState() => _ContentFeedScreenState();
}

class _ContentFeedScreenState extends State<ContentFeedScreen> {
  late Future<List<ContentItem>> _contentFuture;

  @override
  void initState() {
    super.initState();
    _contentFuture = ContentService.getRecentContent();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Community Feed'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: FutureBuilder<List<ContentItem>>(
        future: _contentFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error, size: 50, color: Colors.red),
                  const SizedBox(height: 16),
                  const Text('Failed to load content'),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _contentFuture = ContentService.getRecentContent();
                      });
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          } else if (snapshot.hasData) {
            final contentItems = snapshot.data!;
            return ListView.builder(
              itemCount: contentItems.length,
              itemBuilder: (context, index) {
                final item = contentItems[index];
                return Card(
                  margin: const EdgeInsets.all(8.0),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(16),
                    leading: CircleAvatar(
                      backgroundImage: NetworkImage(item.imageUrl),
                      onBackgroundImageError: (exception, stackTrace) {
                        // Handle image loading errors
                      },
                    ),
                    title: Text(
                      item.title,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 8),
                        Text(item.description),
                        const SizedBox(height: 8),
                        Text(
                          '${item.type} • ${_formatDate(item.createdAt)}',
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            );
          } else {
            return const Center(child: Text('No content available'));
          }
        },
      ),
    );
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);
    
    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }
}