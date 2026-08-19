import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/member.dart';
import '../providers/app_provider.dart';
import '../services/api_service.dart';

class Conversation {
  final int id;
  final member member;
  final String lastMessage;
  final DateTime lastMessageTime;
  final bool isRead;

  Conversation({
    required this.id,
    required this.member,
    required this.lastMessage,
    required this.lastMessageTime,
    this.isRead = false,
  });
}

class MessagesScreen extends StatefulWidget {
  @override
  _MessagesScreenState createState() => _MessagesScreenState();
}

class _MessagesScreenState extends State<MessagesScreen> {
  List<Conversation> _conversations = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadConversations();
  }

  Future<void> _loadConversations() async {
    try {
      // In a real implementation, this would be an API call to get conversations
      // For now, we'll simulate some data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      final mockmembers = [
        member(
          id: 1,
          membername: 'johndoe',
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          profileImageUrl: 'https://via.placeholder.com/150',
          isVerified: true,
          createdAt: DateTime.now(),
        ),
        member(
          id: 2,
          membername: 'janedoe',
          email: 'jane@example.com',
          firstName: 'Jane',
          lastName: 'Doe',
          profileImageUrl: 'https://via.placeholder.com/150',
          isVerified: false,
          createdAt: DateTime.now(),
        ),
        member(
          id: 3,
          membername: 'bobsmith',
          email: 'bob@example.com',
          firstName: 'Bob',
          lastName: 'Smith',
          profileImageUrl: 'https://via.placeholder.com/150',
          isVerified: true,
          createdAt: DateTime.now(),
        ),
      ];

      setState(() {
        _conversations = [
          Conversation(
            id: 1,
            member: mockmembers[0],
            lastMessage: 'Hey, how are you doing?',
            lastMessageTime: DateTime.now().subtract(Duration(minutes: 5)),
            isRead: false,
          ),
          Conversation(
            id: 2,
            member: mockmembers[1],
            lastMessage: 'Thanks for the help!',
            lastMessageTime: DateTime.now().subtract(Duration(hours: 1)),
            isRead: true,
          ),
          Conversation(
            id: 3,
            member: mockmembers[2],
            lastMessage: 'See you tomorrow',
            lastMessageTime: DateTime.now().subtract(Duration(days: 1)),
            isRead: true,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading conversations: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading conversations')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Messages'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.edit),
            onPressed: () {
              // Start new conversation
              _startNewConversation();
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _conversations.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.message,
                        size: 80,
                        color: Colors.grey[400],
                      ),
                      SizedBox(height: 16),
                      Text(
                        'No messages yet',
                        style: TextStyle(
                          fontSize: 20,
                          color: Colors.grey[600],
                        ),
                      ),
                      SizedBox(height: 8),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          'When you start conversations, they\'ll appear here',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: Colors.grey[500],
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadConversations,
                  child: ListView.builder(
                    itemCount: _conversations.length,
                    itemBuilder: (context, index) {
                      final conversation = _conversations[index];
                      return _buildConversationItem(conversation);
                    },
                  ),
                ),
    );
  }

  Widget _buildConversationItem(Conversation conversation) {
    return ListTile(
      leading: CircleAvatar(
        backgroundImage: conversation.member.profileImageUrl != null
            ? NetworkImage(conversation.member.profileImageUrl!)
            : null,
        child: conversation.member.profileImageUrl == null
            ? Icon(Icons.person)
            : null,
        backgroundColor: !conversation.isRead ? Colors.blue[100] : null,
      ),
      title: Row(
        children: [
          Text(
            conversation.handlename,
            style: TextStyle(
              fontWeight: !conversation.isRead ? FontWeight.bold : FontWeight.normal,
            ),
          ),
          if (conversation.member.isVerified)
            Icon(
              Icons.verified,
              color: Colors.blue,
              size: 16,
            ),
        ],
      ),
      subtitle: Text(
        conversation.lastMessage,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: TextStyle(
          fontWeight: !conversation.isRead ? FontWeight.w500 : FontWeight.normal,
          color: !conversation.isRead ? Colors.black87 : Colors.grey[600],
        ),
      ),
      trailing: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          Text(
            _formatTime(conversation.lastMessageTime),
            style: TextStyle(
              fontSize: 12,
              color: Colors.grey[600],
            ),
          ),
          if (!conversation.isRead)
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: Colors.blue,
                shape: BoxShape.circle,
              ),
            ),
        ],
      ),
      onTap: () {
        // Navigate to chat screen
        _openChat(conversation);
      },
    );
  }

  String _formatTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }

  void _startNewConversation() {
    // Show dialog to select member to message
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Start New Conversation'),
          content: TextField(
            decoration: InputDecoration(
              hintText: 'Search for a member...',
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                // In a real app, this would start a new conversation
                Navigator.of(context).pop();
              },
              child: Text('Start'),
            ),
          ],
        );
      },
    );
  }

  void _openChat(Conversation conversation) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ChatScreen(conversation: conversation),
      ),
    );
  }
}

class ChatScreen extends StatefulWidget {
  final Conversation conversation;

  ChatScreen({required this.conversation});

  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();
  final List<Message> _messages = [];

  @override
  void initState() {
    super.initState();
    
    // Simulate some messages
    _messages.addAll([
      Message(
        id: 1,
        senderId: widget.conversation.member.id,
        content: 'Hey there!',
        sentAt: DateTime.now().subtract(Duration(minutes: 10)),
        isOwn: false,
      ),
      Message(
        id: 2,
        senderId: 0, // Own message
        content: 'Hi! How are you?',
        sentAt: DateTime.now().subtract(Duration(minutes: 8)),
        isOwn: true,
      ),
      Message(
        id: 3,
        senderId: widget.conversation.member.id,
        content: 'I\'m doing great, thanks for asking!',
        sentAt: DateTime.now().subtract(Duration(minutes: 5)),
        isOwn: false,
      ),
    ]);
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty) return;

    setState(() {
      _messages.add(
        Message(
          id: _messages.length + 1,
          senderId: 0, // Own message
          content: _messageController.text.trim(),
          sentAt: DateTime.now(),
          isOwn: true,
        ),
      );
    });

    _messageController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              backgroundImage: widget.conversation.member.profileImageUrl != null
                  ? NetworkImage(widget.conversation.member.profileImageUrl!)
                  : null,
              child: widget.conversation.member.profileImageUrl == null
                  ? Icon(Icons.person)
                  : null,
            ),
            SizedBox(width: 10),
            Text(widget.conversation.handlename),
            if (widget.conversation.member.isVerified)
              Icon(
                Icons.verified,
                color: Colors.blue,
                size: 16,
              ),
          ],
        ),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              reverse: true,
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[_messages.length - 1 - index];
                return _buildMessageItem(message);
              },
            ),
          ),
          _buildMessageInput(),
        ],
      ),
    );
  }

  Widget _buildMessageItem(Message message) {
    return Align(
      alignment: message.isOwn ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: EdgeInsets.symmetric(vertical: 4, horizontal: 8),
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: message.isOwn ? Colors.blue : Colors.grey[300],
          borderRadius: BorderRadius.circular(18),
        ),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              message.content,
              style: TextStyle(
                color: message.isOwn ? Colors.white : Colors.black,
              ),
            ),
            Align(
              alignment: Alignment.centerRight,
              child: Text(
                '${message.sentAt.hour.toString().padLeft(2, '0')}:${message.sentAt.minute.toString().padLeft(2, '0')}',
                style: TextStyle(
                  fontSize: 10,
                  color: message.isOwn ? Colors.blue[100] : Colors.grey[600],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMessageInput() {
    return Container(
      padding: EdgeInsets.all(8),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _messageController,
              decoration: InputDecoration(
                hintText: 'Type a message...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(30),
                ),
                contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              ),
              onSubmitted: (value) {
                _sendMessage();
              },
            ),
          ),
          SizedBox(width: 8),
          FloatingActionButton(
            onPressed: _sendMessage,
            backgroundColor: Colors.blue,
            child: Icon(Icons.send, color: Colors.white),
          ),
        ],
      ),
    );
  }
}

class Message {
  final int id;
  final int senderId;
  final String content;
  final DateTime sentAt;
  final bool isOwn;

  Message({
    required this.id,
    required this.senderId,
    required this.content,
    required this.sentAt,
    required this.isOwn,
  });
}