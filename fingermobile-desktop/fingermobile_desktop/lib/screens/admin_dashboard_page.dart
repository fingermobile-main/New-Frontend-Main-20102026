import 'package:flutter/material.dart';

class AdminDashboardPage extends StatefulWidget {
  const AdminDashboardPage({Key? key}) : super(key: key);

  @override
  State<AdminDashboardPage> createState() => _AdminDashboardPageState();
}

class _AdminDashboardPageState extends State<AdminDashboardPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              Navigator.pushNamed(context, '/notifications');
            },
          ),
          PopupMenuButton<String>(
            onSelected: (String result) {
              if (result == 'settings') {
                Navigator.pushNamed(context, '/settings');
              } else if (result == 'profile') {
                Navigator.pushNamed(context, '/profile');
              }
            },
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              const PopupMenuItem<String>(
                value: 'profile',
                child: ListTile(
                  leading: Icon(Icons.person),
                  title: Text('Profile'),
                ),
              ),
              const PopupMenuItem<String>(
                value: 'settings',
                child: ListTile(
                  leading: Icon(Icons.settings),
                  title: Text('Settings'),
                ),
              ),
            ],
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Admin sidebar
            SizedBox(
              width: 250,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Admin Tools',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      _buildAdminItem(Icons.dashboard, 'Dashboard', true),
                      _buildAdminItem(Icons.people, 'Member Management', false),
                      _buildAdminItem(Icons.flag, 'Content Moderation', false),
                      _buildAdminItem(Icons.report, 'Reports', false),
                      _buildAdminItem(Icons.list, 'Audit Logs', false),
                      _buildAdminItem(Icons.toggle_on, 'Feature Flags', false),
                      _buildAdminItem(Icons.bar_chart, 'Platform Metrics', false),
                      _buildAdminItem(Icons.lock, 'Permissions', false),
                      _buildAdminItem(Icons.settings, 'System Settings', false),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            
            // Main content area
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Stats overview
                  Row(
                    children: [
                      _buildStatCard('Total Members', '12,456', Icons.people, Colors.blue),
                      const SizedBox(width: 16),
                      _buildStatCard('Active members', '8,742', Icons.visibility, Colors.green),
                      const SizedBox(width: 16),
                      _buildStatCard('Total Posts', '56,789', Icons.article, Colors.orange),
                      const SizedBox(width: 16),
                      _buildStatCard('Revenue', '\$124,567', Icons.monetization_on, Colors.purple),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // System status
                      Expanded(
                        child: Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'System Status',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 16),
                                
                                _buildStatusItem(Icons.cloud_queue, 'API Server', 'Online', Colors.green),
                                _buildStatusItem(Icons.storage, 'Database', 'Online', Colors.green),
                                _buildStatusItem(Icons.memory, 'Cache', 'Warning', Colors.orange),
                                _buildStatusItem(Icons.storage, 'Storage', 'Healthy', Colors.green),
                              ],
                            ),
                          ),
                        ),
                      ),
                      
                      const SizedBox(width: 16),
                      
                      // Recent activities
                      Expanded(
                        child: Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Recent Activities',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 16),
                                
                                Expanded(
                                  child: ListView.builder(
                                    itemCount: 5,
                                    itemBuilder: (context, index) => _buildActivityItem(index),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Charts section
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Platform Metrics',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          
                          // Placeholder for charts - in a real app, you would use a charting package
                          Container(
                            height: 300,
                            decoration: BoxDecoration(
                              border: Border.all(color: Colors.grey.shade300),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Center(
                              child: Text(
                                'Charts would appear here\n(Member Engagement, Revenue, Growth, etc.)',
                                textAlign: TextAlign.center,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAdminItem(IconData icon, String title, bool isSelected) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: ListTile(
        leading: Icon(icon, color: isSelected ? Theme.of(context).primaryColor : null),
        title: Text(title),
        selected: isSelected,
        selectedColor: Theme.of(context).primaryColor,
        onTap: () {
          // Handle admin section selection
        },
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(icon, color: color),
                  const SizedBox(width: 8),
                  Text(
                    title,
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                value,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusItem(IconData icon, String title, String status, Color color) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(icon, color: color),
          const SizedBox(width: 12),
          Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.w500),
          ),
          const Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Text(
              status,
              style: TextStyle(color: color, fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActivityItem(int index) {
    final members = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Alex Thompson'];
    final actions = [
      'Account Suspended',
      'Report Reviewed',
      'Content Removed',
      'Account Verified',
      'Feature Flag Updated'
    ];
    final times = ['2 min ago', '15 min ago', '1 hour ago', '2 hours ago', '3 hours ago'];
    final types = ['warning', 'info', 'danger', 'success', 'info'];
    
    IconData icon;
    Color iconColor;
    
    switch (types[index]) {
      case 'success':
        icon = Icons.check_circle;
        iconColor = Colors.green;
        break;
      case 'warning':
        icon = Icons.warning;
        iconColor = Colors.orange;
        break;
      case 'danger':
        icon = Icons.error;
        iconColor = Colors.red;
        break;
      case 'info':
      default:
        icon = Icons.info;
        iconColor = Colors.blue;
        break;
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: iconColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Icon(icon, color: iconColor),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  members[index],
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                Text(
                  actions[index],
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          Text(
            times[index],
            style: TextStyle(
              color: Colors.grey[600],
              fontSize: 12,
            ),
          ),
        ],
      ),
    );
  }
}