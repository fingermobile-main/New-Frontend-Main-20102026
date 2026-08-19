import 'package:flutter/material.dart';

class LoginHistoryPage extends StatefulWidget {
  const LoginHistoryPage({super.key});

  @override
  State<LoginHistoryPage> createState() => _LoginHistoryPageState();
}

class _LoginHistoryPageState extends State<LoginHistoryPage> {
  final List<Map<String, dynamic>> _loginHistory = [
    {
      'id': 1,
      'date': '2025-12-27',
      'time': '14:30',
      'device': 'iPhone 13 Pro',
      'platform': 'iOS',
      'location': 'New York, USA',
      'ip': '192.168.1.101',
      'status': 'Successful',
      'browser': 'Safari',
    },
    {
      'id': 2,
      'date': '2025-12-26',
      'time': '09:15',
      'device': 'MacBook Pro',
      'platform': 'macOS',
      'location': 'New York, USA',
      'ip': '192.168.1.102',
      'status': 'Successful',
      'browser': 'Safari',
    },
    {
      'id': 3,
      'date': '2025-12-25',
      'time': '18:45',
      'device': 'Samsung Galaxy S21',
      'platform': 'Android',
      'location': 'London, UK',
      'ip': '192.168.1.103',
      'status': 'Successful',
      'browser': 'Chrome',
    },
    {
      'id': 4,
      'date': '2025-12-24',
      'time': '11:20',
      'device': 'Windows Laptop',
      'platform': 'Windows',
      'location': 'Tokyo, Japan',
      'ip': '192.168.1.104',
      'status': 'Failed',
      'browser': 'Edge',
    },
    {
      'id': 5,
      'date': '2025-12-23',
      'time': '16:50',
      'device': 'iPad Air',
      'platform': 'iOS',
      'location': 'Sydney, Australia',
      'ip': '192.168.1.105',
      'status': 'Successful',
      'browser': 'Safari',
    },
    {
      'id': 6,
      'date': '2025-12-22',
      'time': '13:05',
      'device': 'iPhone 12',
      'platform': 'iOS',
      'location': 'Los Angeles, USA',
      'ip': '192.168.1.106',
      'status': 'Successful',
      'browser': 'Safari',
    },
    {
      'id': 7,
      'date': '2025-12-21',
      'time': '20:30',
      'device': 'MacBook Air',
      'platform': 'macOS',
      'location': 'Berlin, Germany',
      'ip': '192.168.1.107',
      'status': 'Successful',
      'browser': 'Firefox',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login History'),
        centerTitle: false,
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              // Refresh login history
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
                child: Text('All Logins'),
              ),
              const PopupMenuItem(
                value: 'successful',
                child: Text('Successful Only'),
              ),
              const PopupMenuItem(
                value: 'failed',
                child: Text('Failed Only'),
              ),
              const PopupMenuItem(
                value: 'last7',
                child: Text('Last 7 Days'),
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
                _buildStatCard('${_loginHistory.length}', 'Total Logins'),
                _buildStatCard(
                  '${_loginHistory.where((item) => item['status'] == 'Successful').length}', 
                  'Successful',
                ),
                _buildStatCard(
                  '${_loginHistory.where((item) => item['status'] == 'Failed').length}', 
                  'Failed',
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Login history list
          Expanded(
            child: ListView.builder(
              itemCount: _loginHistory.length,
              itemBuilder: (context, index) {
                final login = _loginHistory[index];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: ListTile(
                    leading: Container(
                      width: 48,
                      height: 48,
                      decoration: BoxDecoration(
                        color: login['status'] == 'Successful' 
                          ? Colors.green[100] 
                          : Colors.red[100],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        login['platform'] == 'iOS' || login['platform'] == 'macOS' 
                          ? Icons.phone_iphone 
                          : login['platform'] == 'Windows' 
                            ? Icons.laptop 
                            : Icons.phone_android,
                        color: login['status'] == 'Successful' 
                          ? Colors.green 
                          : Colors.red,
                      ),
                    ),
                    title: Row(
                      children: [
                        Text('${login['date']} at ${login['time']}'),
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: login['status'] == 'Successful' 
                              ? Colors.green[100] 
                              : Colors.red[100],
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            login['status'],
                            style: TextStyle(
                              color: login['status'] == 'Successful' 
                                ? Colors.green[700] 
                                : Colors.red[700],
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${login['device']} • ${login['platform']}'),
                        const SizedBox(height: 4),
                        Text(
                          '${login['location']} • ${login['ip']}',
                          style: const TextStyle(fontSize: 12),
                        ),
                      ],
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.info_outline),
                      onPressed: () {
                        _showLoginDetails(login);
                      },
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

  void _showLoginDetails(Map<String, dynamic> login) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Login Details'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildDetailRow('Date', login['date']),
              _buildDetailRow('Time', login['time']),
              _buildDetailRow('Device', login['device']),
              _buildDetailRow('Platform', login['platform']),
              _buildDetailRow('Browser', login['browser']),
              _buildDetailRow('Location', login['location']),
              _buildDetailRow('IP Address', login['ip']),
              _buildDetailRow('Status', login['status']),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 80,
            child: Text(
              '$label: ',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: Text(value),
          ),
        ],
      ),
    );
  }
}