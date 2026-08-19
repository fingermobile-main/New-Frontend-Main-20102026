import 'package:flutter/material.dart';

class memberJourneyTrackerPage extends StatefulWidget {
  const memberJourneyTrackerPage({super.key});

  @override
  State<memberJourneyTrackerPage> createState() => _memberJourneyTrackerPageState();
}

class _memberJourneyTrackerPageState extends State<memberJourneyTrackerPage> {
  final List<Map<String, dynamic>> _journeyEvents = [
    {
      'id': 1,
      'title': 'Account Created',
      'description': 'Successfully created your account',
      'timestamp': '2025-01-15 10:30 AM',
      'icon': Icons.person_add,
      'color': Colors.green,
    },
    {
      'id': 2,
      'title': 'First Post',
      'description': 'Made your first content post',
      'timestamp': '2025-01-16 2:45 PM',
      'icon': Icons.post_add,
      'color': Colors.blue,
    },
    {
      'id': 3,
      'title': 'First Connection',
      'description': 'Connected with another member',
      'timestamp': '2025-01-17 9:15 AM',
      'icon': Icons.people,
      'color': Colors.purple,
    },
    {
      'id': 4,
      'title': 'First Purchase',
      'description': 'Made your first purchase',
      'timestamp': '2025-01-20 4:20 PM',
      'icon': Icons.shopping_cart,
      'color': Colors.orange,
    },
    {
      'id': 5,
      'title': 'Achievement Unlocked',
      'description': 'Completed profile setup',
      'timestamp': '2025-01-22 11:30 AM',
      'icon': Icons.emoji_events,
      'color': Colors.red,
    },
    {
      'id': 6,
      'title': 'Content Trending',
      'description': 'Your post reached top 10',
      'timestamp': '2025-01-25 7:45 PM',
      'icon': Icons.trending_up,
      'color': Colors.teal,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('member Journey'),
        centerTitle: false,
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
        elevation: 0,
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
                _buildStatCard('24', 'Days Active'),
                _buildStatCard('42', 'Posts'),
                _buildStatCard('18', 'Connections'),
                _buildStatCard('8', 'Achievements'),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Journey timeline
          Expanded(
            child: ListView.builder(
              itemCount: _journeyEvents.length,
              itemBuilder: (context, index) {
                final event = _journeyEvents[index];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: ListTile(
                    leading: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: event['color'].withOpacity(0.2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Icon(
                        event['icon'],
                        color: event['color'],
                      ),
                    ),
                    title: Text(
                      event['title'],
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(event['description']),
                        const SizedBox(height: 4),
                        Text(
                          event['timestamp'],
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
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
}