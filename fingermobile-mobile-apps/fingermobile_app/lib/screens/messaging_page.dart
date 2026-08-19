import 'package:flutter/material.dart';

class MessagingPage extends StatefulWidget {
  const MessagingPage({super.key});

  @override
  State<MessagingPage> createState() => _MessagingPageState();
}

class _MessagingPageState extends State<MessagingPage> {
  final List<Map<String, dynamic>> _conversations = [
    {
      'id': 1,
      'name': 'John Smith',
      'membername': '@johnsmith',
      'lastMessage': 'Hey, how are you doing?',
      'timestamp': '2 min ago',
      'unread': 2,
      'avatar': 'https://via.placeholder.com/50',
      'isOnline': true,
    },
    {
      'id': 2,
      'name': 'Sarah Johnson',
      'membername': '@sarahj',
      'lastMessage': 'Thanks for the help!',
      'timestamp': '1 hour ago',
      'unread': 0,
      'avatar': 'https://via.placeholder.com/50',
      'isOnline': false,
    },
    {
      'id': 3,
      'name': 'Michael Brown',
      'membername': '@mikeb',
      'lastMessage': 'Can we schedule a meeting?',
      'timestamp': '3 hours ago',
      'unread': 1,
      'avatar': 'https://via.placeholder.com/50',
      'isOnline': true,
    },
    {
      'id': 4,
      'name': 'Emily Davis',
      'membername': '@emilyd',
      'lastMessage': 'The project is complete',
      'timestamp': 'Yesterday',
      'unread': 0,
      'avatar': 'https://via.placeholder.com/50',
      'isOnline': false,
    },
    {
      'id': 5,
      'name': 'Robert Wilson',
      'membername': '@robertw',
      'lastMessage': 'See you tomorrow!',
      'timestamp': '2 days ago',
      'unread': 0,
      'avatar': 'https://via.placeholder.com/50',
      'isOnline': true,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Messages'),
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
            icon: const Icon(Icons.more_vert),
            onSelected: (value) {
              if (value == 'new') {
                _startNewConversation();
              } else if (value == 'settings') {
                // Navigate to messaging settings
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'new',
                child: Text('New Message'),
              ),
              const PopupMenuItem(
                value: 'settings',
                child: Text('Settings'),
              ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Container(
            padding: const EdgeInsets.all(16),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search conversations...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                ),
              ),
            ),
          ),
          
          // Conversations list
          Expanded(
            child: ListView.builder(
              itemCount: _conversations.length,
              itemBuilder: (context, index) {
                final conversation = _conversations[index];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  child: ListTile(
                    leading: Stack(
                      children: [
                        CircleAvatar(
                          backgroundImage: NetworkImage(conversation['avatar']),
                          radius: 25,
                        ),
                        if (conversation['isOnline'])
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
                        Text(conversation['name']),
                        const SizedBox(width: 8),
                        if (conversation['isOnline'])
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 4),
                            child: const Text(
                              '•',
                              style: TextStyle(color: Colors.green),
                            ),
                          ),
                      ],
                    ),
                    subtitle: Text(
                      conversation['lastMessage'],
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    trailing: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        Text(
                          conversation['timestamp'],
                          style: const TextStyle(fontSize: 12),
                        ),
                        if (conversation['unread'] > 0)
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: Colors.blue,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            constraints: const BoxConstraints(
                              minWidth: 20,
                              minHeight: 20,
                            ),
                            child: Text(
                              conversation['unread'].toString(),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ),
                      ],
                    ),
                    onTap: () {
                      _openConversation(conversation['id'], conversation['name']);
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _startNewConversation() {
    // Navigate to new conversation screen
    showDialog(
      context: context,
      builder: (context) {
        String recipient = '';
        return AlertDialog(
          title: const Text('New Message'),
          content: TextField(
            decoration: const InputDecoration(
              labelText: 'Search for a member',
              hintText: 'Enter membername or name',
            ),
            onChanged: (value) {
              recipient = value;
            },
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
                // Navigate to new conversation with the specified member
              },
              child: const Text('Start'),
            ),
          ],
        );
      },
    );
  }

  void _openConversation(int conversationId, String name) {
    // Navigate to the conversation screen
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ConversationScreen(
          conversationId: conversationId,
          name: name,
        ),
      ),
    );
  }
}

class ConversationScreen extends StatefulWidget {
  final int conversationId;
  final String name;

  const ConversationScreen({
    super.key,
    required this.conversationId,
    required this.name,
  });

  @override
  State<ConversationScreen> createState() => _ConversationScreenState();
}

class _ConversationScreenState extends State<ConversationScreen> {
  final List<Map<String, dynamic>> _messages = [
    {
      'id': 1,
      'text': 'Hello there!',
      'timestamp': '10:30 AM',
      'isMe': true,
    },
    {
      'id': 2,
      'text': 'Hi! How are you?',
      'timestamp': '10:32 AM',
      'isMe': false,
    },
    {
      'id': 3,
      'text': 'I\'m doing great, thanks for asking!',
      'timestamp': '10:33 AM',
      'isMe': true,
    },
    {
      'id': 4,
      'text': 'That\'s good to hear. Did you finish the project?',
      'timestamp': '10:35 AM',
      'isMe': false,
    },
  ];

  final TextEditingController _messageController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.name),
        centerTitle: false,
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Messages list
          Expanded(
            child: ListView.builder(
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[index];
                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                  child: Align(
                    alignment: message['isMe'] ? Alignment.centerRight : Alignment.centerLeft,
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: message['isMe'] ? Colors.blue[100] : Colors.grey[200],
                        borderRadius: BorderRadius.circular(18),
                      ),
                      constraints: BoxConstraints(
                        maxWidth: MediaQuery.of(context).size.width * 0.75,
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            message['text'],
                            style: const TextStyle(fontSize: 16),
                          ),
                          const SizedBox(height: 4),
                          Align(
                            alignment: Alignment.bottomRight,
                            child: Text(
                              message['timestamp'],
                              style: const TextStyle(
                                fontSize: 10,
                                color: Colors.grey,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          
          // Message input
          Container(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.grey[200],
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Row(
                      children: [
                        const SizedBox(width: 16),
                        Expanded(
                          child: TextField(
                            controller: _messageController,
                            decoration: const InputDecoration(
                              hintText: 'Type a message...',
                              border: InputBorder.none,
                            ),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.emoji_emotions_outlined),
                          onPressed: () {
                            // Show emoji picker
                          },
                        ),
                        IconButton(
                          icon: const Icon(Icons.attach_file),
                          onPressed: () {
                            // Show attachment options
                          },
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  decoration: BoxDecoration(
                    color: Colors.blue,
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white),
                    onPressed: () {
                      _sendMessage();
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty) return;

    setState(() {
      _messages.add({
        'id': _messages.length + 1,
        'text': _messageController.text,
        'timestamp': _formatTime(DateTime.now()),
        'isMe': true,
      });
    });

    _messageController.clear();
  }

  String _formatTime(DateTime time) {
    return '${time.hour}:${time.minute.toString().padLeft(2, '0')}';
  }
}