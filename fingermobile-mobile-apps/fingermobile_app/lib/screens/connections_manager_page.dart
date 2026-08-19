import 'package:flutter/material.dart';

class ConnectionsManagerPage extends StatefulWidget {
  const ConnectionsManagerPage({super.key});

  @override
  State<ConnectionsManagerPage> createState() => _ConnectionsManagerPageState();
}

class _ConnectionsManagerPageState extends State<ConnectionsManagerPage> {
  final List<Map<String, dynamic>> _connections = [
    {
      'id': 1,
      'name': 'John Smith',
      'membername': '@johnsmith',
      'avatar': 'https://via.placeholder.com/50',
      'connectedAt': '2 days ago',
      'isOnline': true,
      'mutualConnections': 12,
    },
    {
      'id': 2,
      'name': 'Sarah Johnson',
      'membername': '@sarahj',
      'avatar': 'https://via.placeholder.com/50',
      'connectedAt': '1 week ago',
      'isOnline': false,
      'mutualConnections': 5,
    },
    {
      'id': 3,
      'name': 'Michael Brown',
      'membername': '@mikeb',
      'avatar': 'https://via.placeholder.com/50',
      'connectedAt': '2 weeks ago',
      'isOnline': true,
      'mutualConnections': 8,
    },
    {
      'id': 4,
      'name': 'Emily Davis',
      'membername': '@emilyd',
      'avatar': 'https://via.placeholder.com/50',
      'connectedAt': '3 weeks ago',
      'isOnline': false,
      'mutualConnections': 15,
    },
    {
      'id': 5,
      'name': 'Robert Wilson',
      'membername': '@robertw',
      'avatar': 'https://via.placeholder.com/50',
      'connectedAt': '1 month ago',
      'isOnline': true,
      'mutualConnections': 3,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Connections'),
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
            icon: const Icon(Icons.filter_list),
            onSelected: (value) {
              // Handle filter selection
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'all',
                child: Text('All Connections'),
              ),
              const PopupMenuItem(
                value: 'online',
                child: Text('Online'),
              ),
              const PopupMenuItem(
                value: 'recent',
                child: Text('Recent'),
              ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // Connection stats
          Container(
            height: 100,
            margin: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildStatCard('56', 'Connections'),
                _buildStatCard('12', 'Pending'),
                _buildStatCard('24', 'Requests'),
              ],
            ),
          ),
          
          // Tab bar for different connection types
          DefaultTabController(
            length: 3,
            child: Column(
              children: [
                const TabBar(
                  tabs: [
                    Tab(text: 'All'),
                    Tab(text: 'Pending'),
                    Tab(text: 'Requests'),
                  ],
                ),
                Expanded(
                  child: TabBarView(
                    children: [
                      _buildConnectionsList(),
                      _buildPendingList(),
                      _buildRequestsList(),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String count, String label) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          count,
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }

  Widget _buildConnectionsList() {
    return ListView.builder(
      itemCount: _connections.length,
      itemBuilder: (context, index) {
        final connection = _connections[index];
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          child: ListTile(
            leading: Stack(
              children: [
                CircleAvatar(
                  backgroundImage: NetworkImage(connection['avatar']),
                  radius: 25,
                ),
                if (connection['isOnline'])
                  Positioned(
                    right: 0,
                    bottom: 0,
                    child: Container(
                      width: 16,
                      height: 16,
                      decoration: BoxDecoration(
                        color: Colors.green,
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 2),
                      ),
                    ),
                  ),
              ],
            ),
            title: Row(
              children: [
                Text(connection['name']),
                const SizedBox(width: 8),
                Icon(
                  Icons.verified,
                  color: Colors.blue[600],
                  size: 16,
                ),
              ],
            ),
            subtitle: Text(
              '${connection['membername']} • ${connection['connectedAt']} • ${connection['mutualConnections']} mutual',
            ),
            trailing: PopupMenuButton(
              icon: const Icon(Icons.more_vert),
              onSelected: (value) {
                // Handle menu selection
              },
              itemBuilder: (context) => [
                const PopupMenuItem(
                  value: 'message',
                  child: Text('Message'),
                ),
                const PopupMenuItem(
                  value: 'profile',
                  child: Text('View Profile'),
                ),
                const PopupMenuItem(
                  value: 'remove',
                  child: Text('Remove Connection'),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildPendingList() {
    return const Center(
      child: Text('No pending connections'),
    );
  }

  Widget _buildRequestsList() {
    return const Center(
      child: Text('No connection requests'),
    );
  }
}