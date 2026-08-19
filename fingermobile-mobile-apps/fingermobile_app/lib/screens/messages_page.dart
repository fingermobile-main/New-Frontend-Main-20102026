import 'package:flutter/material.dart';

class MessagesPage extends StatefulWidget {
  @override
  _MessagesPageState createState() => _MessagesPageState();
}

class _MessagesPageState extends State<MessagesPage> {
  final List<Map<String, dynamic>> _conversations = [
    {
      'id': 1,
      'name': 'Alex Johnson',
      'lastMessage': 'Thanks for the update!',
      'time': '2m ago',
      'unread': 2,
      'isOnline': true,
    },
    {
      'id': 2,
      'name': 'Sarah Williams',
      'lastMessage': 'Can we schedule a meeting?',
      'time': '1h ago',
      'unread': 0,
      'isOnline': true,
    },
    {
      'id': 3,
      'name': 'Team Discussions',
      'lastMessage': 'Michael: The project is on track',
      'time': '3h ago',
      'unread': 5,
      'isOnline': false,
    },
    {
      'id': 4,
      'name': 'Marketing Group',
      'lastMessage': 'New campaign ideas?',
      'time': '1d ago',
      'unread': 0,
      'isOnline': false,
    },
    {
      'id': 5,
      'name': 'David Chen',
      'lastMessage': 'Did you see the new design?',
      'time': '2d ago',
      'unread': 1,
      'isOnline': true,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Messages'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.edit),
            onPressed: () {
              // Start new conversation
            },
          ),
          IconButton(
            icon: Icon(Icons.more_vert),
            onPressed: () {
              // Show options
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: EdgeInsets.all(16.0),
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: TextField(
                decoration: InputDecoration(
                  hintText: 'Search conversations...',
                  border: InputBorder.none,
                  prefixIcon: Icon(Icons.search),
                ),
              ),
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: _conversations.length,
              itemBuilder: (context, index) {
                final conversation = _conversations[index];
                return Card(
                  margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  child: ListTile(
                    leading: Stack(
                      children: [
                        CircleAvatar(
                          backgroundColor: Colors.purple[100],
                          child: Text(
                            conversation['name'].split(' ').map((n) => n[0]).take(2).join(),
                            style: TextStyle(color: Colors.deepPurple),
                          ),
                        ),
                        if (conversation['isOnline'])
                          Positioned(
                            right: 0,
                            bottom: 0,
                            child: Container(
                              width: 12,
                              height: 12,
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
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          conversation['name'],
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          conversation['time'],
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                    subtitle: Row(
                      children: [
                        Expanded(
                          child: Text(
                            conversation['lastMessage'],
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              color: Colors.grey[700],
                            ),
                          ),
                        ),
                      ],
                    ),
                    trailing: conversation['unread'] > 0
                        ? Container(
                            width: 24,
                            height: 24,
                            decoration: BoxDecoration(
                              color: Colors.deepPurple,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Center(
                              child: Text(
                                conversation['unread'].toString(),
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          )
                        : Icon(
                            Icons.done_all,
                            size: 16,
                            color: Colors.grey,
                          ),
                    onTap: () {
                      // Navigate to conversation
                      _openConversation(conversation['id']);
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Start new conversation
          _startNewConversation();
        },
        backgroundColor: Colors.deepPurple,
        child: Icon(Icons.edit),
      ),
    );
  }

  void _openConversation(int conversationId) {
    // Navigate to conversation screen
    print('Opening conversation $conversationId');
  }

  void _startNewConversation() {
    // Navigate to new conversation screen
    print('Starting new conversation');
  }
}