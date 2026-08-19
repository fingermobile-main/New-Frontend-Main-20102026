import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class ActivityFeedPage extends StatefulWidget {
  const ActivityFeedPage({super.key});

  @override
  State<ActivityFeedPage> createState() => _ActivityFeedPageState();
}

class _ActivityFeedPageState extends State<ActivityFeedPage> {
  final List<Map<String, dynamic>> _activities = [
    {
      'id': 1,
      'membername': 'John Doe',
      'avatar': 'https://via.placeholder.com/40',
      'action': 'liked your post',
      'time': '2 mins ago',
      'postImage': 'https://via.placeholder.com/100x100',
    },
    {
      'id': 2,
      'membername': 'Jane Smith',
      'avatar': 'https://via.placeholder.com/40',
      'action': 'commented on your post',
      'time': '5 mins ago',
      'comment': 'Great content! Keep it up!',
    },
    {
      'id': 3,
      'membername': 'Alex Johnson',
      'avatar': 'https://via.placeholder.com/40',
      'action': 'started following you',
      'time': '1 hour ago',
    },
    {
      'id': 4,
      'membername': 'Sarah Williams',
      'avatar': 'https://via.placeholder.com/40',
      'action': 'shared your post',
      'time': '3 hours ago',
      'postImage': 'https://via.placeholder.com/100x100',
    },
    {
      'id': 5,
      'membername': 'Mike Brown',
      'avatar': 'https://via.placeholder.com/40',
      'action': 'mentioned you in a comment',
      'time': '5 hours ago',
      'comment': 'Check out @membername post!',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Activity Feed'),
        centerTitle: false,
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          // Simulate refresh
          await Future.delayed(const Duration(seconds: 1));
          if (mounted) {
            setState(() {});
          }
        },
        child: ListView.builder(
          itemCount: _activities.length,
          itemBuilder: (context, index) {
            final activity = _activities[index];
            return Card(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: ListTile(
                contentPadding: const EdgeInsets.all(16),
                leading: CircleAvatar(
                  backgroundImage: CachedNetworkImageProvider(activity['avatar']),
                  radius: 20,
                ),
                title: RichText(
                  text: TextSpan(
                    style: const TextStyle(
                      color: Colors.black87,
                      fontSize: 14,
                    ),
                    children: [
                      TextSpan(
                        text: activity['membername'],
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      TextSpan(
                        text: ' ${activity['action']}',
                      ),
                    ],
                  ),
                ),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (activity['comment'] != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 4.0),
                        child: Text(
                          activity['comment'],
                          style: const TextStyle(fontSize: 13),
                        ),
                      ),
                    Padding(
                      padding: const EdgeInsets.only(top: 8.0),
                      child: Text(
                        activity['time'],
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
                trailing: activity['postImage'] != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: CachedNetworkImage(
                          imageUrl: activity['postImage'],
                          width: 50,
                          height: 50,
                          fit: BoxFit.cover,
                          placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                          errorWidget: (context, url, error) => Container(
                            color: Colors.grey[300],
                            child: const Icon(Icons.image),
                          ),
                        ),
                      )
                    : null,
              ),
            );
          },
        ),
      ),
    );
  }
}