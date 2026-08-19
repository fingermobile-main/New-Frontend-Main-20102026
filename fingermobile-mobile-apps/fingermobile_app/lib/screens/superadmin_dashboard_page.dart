import 'package:flutter/material.dart';

class SuperadminDashboardPage extends StatefulWidget {
  const SuperadminDashboardPage({super.key});

  @override
  State<SuperadminDashboardPage> createState() => _SuperadminDashboardPageState();
}

class _SuperadminDashboardPageState extends State<SuperadminDashboardPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Super Admin Dashboard'),
        centerTitle: false,
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              // Navigate to notifications
            },
          ),
          PopupMenuButton(
            icon: const Icon(Icons.more_vert),
            onSelected: (value) {
              if (value == 'settings') {
                // Navigate to admin settings
              } else if (value == 'logout') {
                // Handle logout
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'settings',
                child: Text('Admin Settings'),
              ),
              const PopupMenuItem(
                value: 'logout',
                child: Text('Logout'),
              ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // Stats cards
          Container(
            height: 140,
            margin: const EdgeInsets.all(16),
            child: GridView.count(
              crossAxisCount: 2,
              childAspectRatio: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _buildStatCard('24.5K', 'members', Icons.people, Colors.blue),
                _buildStatCard('1.2M', 'Posts', Icons.post_add, Colors.green),
                _buildStatCard('45.8K', 'Active Today', Icons.trending_up, Colors.orange),
                _buildStatCard('98%', 'Uptime', Icons.power, Colors.purple),
              ],
            ),
          ),
          
          // Quick actions
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                const Text(
                  'Quick Actions',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const Spacer(),
                TextButton(
                  onPressed: () {
                    // View all actions
                  },
                  child: const Text('View All'),
                ),
              ],
            ),
          ),
          
          Container(
            height: 100,
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                _buildQuickAction('System Status', Icons.health_and_safety, Colors.red),
                const SizedBox(width: 16),
                _buildQuickAction('member Management', Icons.people_alt, Colors.blue),
                const SizedBox(width: 16),
                _buildQuickAction('Content Moderation', Icons.gavel, Colors.orange),
                const SizedBox(width: 16),
                _buildQuickAction('System Logs', Icons.list_alt, Colors.grey),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Recent activity
          Expanded(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Recent Activity',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Expanded(
                    child: ListView.builder(
                      itemCount: 5,
                      itemBuilder: (context, index) {
                        return Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          child: ListTile(
                            leading: Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: _getActivityColor(index),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Icon(
                                _getActivityIcon(index),
                                color: Colors.white,
                              ),
                            ),
                            title: Text(_getActivityTitle(index)),
                            subtitle: Text(_getActivitySubtitle(index)),
                            trailing: Text(_getActivityTime(index)),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String value, String label, IconData icon, Color color) {
    return Container(
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: color,
            size: 28,
          ),
          const SizedBox(height: 4),
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
      ),
    );
  }

  Widget _buildQuickAction(String title, IconData icon, Color color) {
    return Container(
      width: 120,
      decoration: BoxDecoration(
        color: Colors.grey[100],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: color,
            size: 24,
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  String _getActivityTitle(int index) {
    final titles = [
      'New member registration',
      'Content moderation',
      'System maintenance',
      'Security alert',
      'Feature update',
    ];
    return titles[index];
  }

  String _getActivitySubtitle(int index) {
    final subtitles = [
      'member JohnDoe joined the platform',
      'Post #12345 was flagged and reviewed',
      'Database maintenance completed',
      'Suspicious login attempt detected',
      'New feature deployed to production',
    ];
    return subtitles[index];
  }

  String _getActivityTime(int index) {
    final times = [
      '2 min ago',
      '15 min ago',
      '1 hour ago',
      '3 hours ago',
      '5 hours ago',
    ];
    return times[index];
  }

  IconData _getActivityIcon(int index) {
    final icons = [
      Icons.person_add,
      Icons.gavel,
      Icons.build,
      Icons.security,
      Icons.new_releases,
    ];
    return icons[index];
  }

  Color _getActivityColor(int index) {
    final colors = [
      Colors.green,
      Colors.orange,
      Colors.blue,
      Colors.red,
      Colors.purple,
    ];
    return colors[index];
  }
}