import 'package:flutter/material.dart';

class SessionManagementPage extends StatefulWidget {
  const SessionManagementPage({super.key});

  @override
  State<SessionManagementPage> createState() => _SessionManagementPageState();
}

class _SessionManagementPageState extends State<SessionManagementPage> {
  final List<Map<String, dynamic>> _sessions = [
    {
      'id': 1,
      'device': 'iPhone 13 Pro',
      'platform': 'iOS',
      'location': 'New York, USA',
      'ip': '192.168.1.101',
      'lastActive': 'Just now',
      'current': true,
      'browser': 'Safari',
    },
    {
      'id': 2,
      'device': 'MacBook Pro',
      'platform': 'macOS',
      'location': 'New York, USA',
      'ip': '192.168.1.102',
      'lastActive': '2 hours ago',
      'current': false,
      'browser': 'Safari',
    },
    {
      'id': 3,
      'device': 'Samsung Galaxy S21',
      'platform': 'Android',
      'location': 'London, UK',
      'ip': '192.168.1.103',
      'lastActive': '1 day ago',
      'current': false,
      'browser': 'Chrome',
    },
    {
      'id': 4,
      'device': 'Windows Laptop',
      'platform': 'Windows',
      'location': 'Tokyo, Japan',
      'ip': '192.168.1.104',
      'lastActive': '3 days ago',
      'current': false,
      'browser': 'Edge',
    },
    {
      'id': 5,
      'device': 'iPad Air',
      'platform': 'iOS',
      'location': 'Sydney, Australia',
      'ip': '192.168.1.105',
      'lastActive': '1 week ago',
      'current': false,
      'browser': 'Safari',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Session Management'),
        centerTitle: false,
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          PopupMenuButton(
            icon: const Icon(Icons.more_vert),
            onSelected: (value) {
              if (value == 'refresh') {
                // Refresh sessions
              } else if (value == 'logout_all') {
                _logoutAllSessions();
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'refresh',
                child: Text('Refresh Sessions'),
              ),
              const PopupMenuItem(
                value: 'logout_all',
                child: Text('Logout All Other Sessions'),
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
                _buildStatCard('${_sessions.length}', 'Total Sessions'),
                _buildStatCard('1', 'Active Now'),
                _buildStatCard('${_sessions.length - 1}', 'Other Sessions'),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Sessions list
          Expanded(
            child: ListView.builder(
              itemCount: _sessions.length,
              itemBuilder: (context, index) {
                final session = _sessions[index];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: ListTile(
                    leading: Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: session['current'] ? Colors.green[100] : Colors.grey[200],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        session['platform'] == 'iOS' || session['platform'] == 'macOS' 
                          ? Icons.phone_iphone 
                          : session['platform'] == 'Windows' 
                            ? Icons.laptop 
                            : Icons.phone_android,
                        color: session['current'] ? Colors.green : Colors.grey[600],
                      ),
                    ),
                    title: Row(
                      children: [
                        Text(session['device']),
                        if (session['current']) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.green[100],
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'Current',
                              style: TextStyle(
                                color: Colors.green,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${session['browser']} • ${session['platform']}'),
                        const SizedBox(height: 4),
                        Text(
                          '${session['location']} • ${session['ip']}',
                          style: const TextStyle(fontSize: 12),
                        ),
                        Text(
                          'Last active: ${session['lastActive']}',
                          style: const TextStyle(fontSize: 12),
                        ),
                      ],
                    ),
                    trailing: session['current'] 
                      ? null 
                      : IconButton(
                          icon: const Icon(Icons.power_settings_new, color: Colors.red),
                          onPressed: () => _logoutSession(session['id'], session['device']),
                        ),
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

  void _logoutSession(int sessionId, String deviceName) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Logout Session'),
          content: Text('Are you sure you want to logout from $deviceName?'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                setState(() {
                  _sessions.removeWhere((session) => session['id'] == sessionId);
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Logged out from $deviceName'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: const Text('Logout'),
            ),
          ],
        );
      },
    );
  }

  void _logoutAllSessions() {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Logout All Sessions'),
          content: const Text(
            'Are you sure you want to logout from all other sessions? This will end all active sessions except the current one.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                setState(() {
                  _sessions.removeWhere((session) => !session['current']);
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Logged out from all other sessions'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: const Text('Logout All'),
            ),
          ],
        );
      },
    );
  }
}