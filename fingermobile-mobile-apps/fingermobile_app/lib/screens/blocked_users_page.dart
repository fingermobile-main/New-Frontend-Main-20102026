import 'package:flutter/material.dart';

class BlockedmembersPage extends StatefulWidget {
  const BlockedmembersPage({super.key});

  @override
  State<BlockedmembersPage> createState() => _BlockedmembersPageState();
}

class _BlockedmembersPageState extends State<BlockedmembersPage> {
  final List<Map<String, dynamic>> _blockedmembers = [
    {
      'id': 1,
      'name': 'John Smith',
      'membername': '@johnsmith',
      'avatar': 'https://via.placeholder.com/50',
      'blockedDate': '2 days ago',
      'reason': 'Inappropriate content',
    },
    {
      'id': 2,
      'name': 'Sarah Johnson',
      'membername': '@sarahj',
      'avatar': 'https://via.placeholder.com/50',
      'blockedDate': '1 week ago',
      'reason': 'Spam messages',
    },
    {
      'id': 3,
      'name': 'Michael Brown',
      'membername': '@mikeb',
      'avatar': 'https://via.placeholder.com/50',
      'blockedDate': '2 weeks ago',
      'reason': 'Harassment',
    },
    {
      'id': 4,
      'name': 'Emily Davis',
      'membername': '@emilyd',
      'avatar': 'https://via.placeholder.com/50',
      'blockedDate': '3 weeks ago',
      'reason': 'Inappropriate content',
    },
    {
      'id': 5,
      'name': 'Robert Wilson',
      'membername': '@robertw',
      'avatar': 'https://via.placeholder.com/50',
      'blockedDate': '1 month ago',
      'reason': 'Spam messages',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Blocked Accounts'),
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
        ],
      ),
      body: Column(
        children: [
          // Stats header
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.grey[100],
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '${_blockedmembers.length} blocked accounts',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Blocked members list
          Expanded(
            child: ListView.builder(
              itemCount: _blockedmembers.length,
              itemBuilder: (context, index) {
                final member = _blockedmembers[index];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundImage: NetworkImage(member['avatar']),
                      radius: 25,
                    ),
                    title: Row(
                      children: [
                        Text(member['name']),
                        const SizedBox(width: 8),
                        Icon(
                          Icons.block,
                          color: Colors.red[600],
                          size: 16,
                        ),
                      ],
                    ),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${member['membername']} • Blocked ${member['blockedDate']}'),
                        const SizedBox(height: 4),
                        Text(
                          'Reason: ${member['reason']}',
                          style: const TextStyle(
                            color: Colors.red,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                    trailing: PopupMenuButton(
                      icon: const Icon(Icons.more_vert),
                      onSelected: (value) {
                        if (value == 'unblock') {
                          _unblockmember(member['id'], member['name']);
                        } else if (value == 'report') {
                          _reportmember(member['id'], member['name']);
                        }
                      },
                      itemBuilder: (context) => [
                        const PopupMenuItem(
                          value: 'unblock',
                          child: Text('Unblock'),
                        ),
                        const PopupMenuItem(
                          value: 'report',
                          child: Text('Report to Admin'),
                        ),
                      ],
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

  void _unblockmember(int memberId, String membername) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Unblock member'),
          content: Text('Are you sure you want to unblock $membername?'),
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
                  _blockedmembers.removeWhere((member) => member['id'] == memberId);
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Unblocked $membername'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: const Text('Unblock'),
            ),
          ],
        );
      },
    );
  }

  void _reportmember(int memberId, String membername) {
    showDialog(
      context: context,
      builder: (context) {
        String reason = '';
        return AlertDialog(
          title: const Text('Report member'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Report $membername for further review'),
              const SizedBox(height: 16),
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Reason for report',
                  border: OutlineInputBorder(),
                ),
                onChanged: (value) {
                  reason = value;
                },
              ),
            ],
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
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Report submitted successfully'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: const Text('Submit'),
            ),
          ],
        );
      },
    );
  }
}