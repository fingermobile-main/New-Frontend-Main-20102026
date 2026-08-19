import 'package:flutter/material.dart';

class PermanencePage extends StatefulWidget {
  const PermanencePage({super.key});

  @override
  State<PermanencePage> createState() => _PermanencePageState();
}

class _PermanencePageState extends State<PermanencePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Permanence'),
        centerTitle: false,
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.info),
            onPressed: () {
              // Show permanence info
            },
          ),
          PopupMenuButton(
            icon: const Icon(Icons.more_vert),
            onSelected: (value) {
              if (value == 'settings') {
                // Navigate to permanence settings
              } else if (value == 'help') {
                // Show help
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'settings',
                child: Text('Settings'),
              ),
              const PopupMenuItem(
                value: 'help',
                child: Text('Help'),
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
                _buildStatCard('24.5K', 'Active Challenges'),
                _buildStatCard('1.2M', 'Total Participants'),
                _buildStatCard('98%', 'Success Rate'),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Permanence features
          Expanded(
            child: ListView(
              children: [
                _buildFeatureCard(
                  Icons.trending_up,
                  'Active Challenges',
                  'Participate in ongoing challenges',
                  Colors.blue,
                ),
                _buildFeatureCard(
                  Icons.monetization_on,
                  'Pledge System',
                  'Pledge and earn rewards',
                  Colors.green,
                ),
                _buildFeatureCard(
                  Icons.live_tv,
                  'Live Streaming',
                  'Stream your challenges',
                  Colors.orange,
                ),
                _buildFeatureCard(
                  Icons.leaderboard,
                  'Leaderboard',
                  'Check top performers',
                  Colors.purple,
                ),
                _buildFeatureCard(
                  Icons.redeem,
                  'Rewards',
                  'Earn and redeem rewards',
                  Colors.red,
                ),
                _buildFeatureCard(
                  Icons.event,
                  'Events',
                  'Join special events',
                  Colors.teal,
                ),
              ],
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

  Widget _buildFeatureCard(IconData icon, String title, String subtitle, Color color) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListTile(
        leading: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(
            icon,
            color: color,
            size: 24,
          ),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: () {
          // Navigate to feature page
        },
      ),
    );
  }
}