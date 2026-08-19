import 'package:flutter/material.dart';

class LiveChat extends StatefulWidget {
  final String chatTitle;
  final String? participantName;
  final String? participantAvatar;

  const LiveChat({
    Key? key,
    required this.chatTitle,
    this.participantName,
    this.participantAvatar,
  }) : super(key: key);

  @override
  _LiveChatState createState() => _LiveChatState();
}

class _LiveChatState extends State<LiveChat> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final List<_ChatMessage> _messages = [];
  bool _isOnline = true;

  @override
  void initState() {
    super.initState();
    
    // Initialize with some sample messages
    _messages.addAll([
      _ChatMessage(
        id: '1',
        text: 'Hello! How can I help you today?',
        sender: 'agent',
        timestamp: DateTime.now().subtract(Duration(minutes: 5)),
        isSentByMe: false,
      ),
      _ChatMessage(
        id: '2',
        text: 'I have a question about my order',
        sender: 'user',
        timestamp: DateTime.now().subtract(Duration(minutes: 4)),
        isSentByMe: true,
      ),
      _ChatMessage(
        id: '3',
        text: 'Sure, I can help with that. Could you please provide your order number?',
        sender: 'agent',
        timestamp: DateTime.now().subtract(Duration(minutes: 3)),
        isSentByMe: false,
      ),
    ]);
  }

  void _sendMessage() {
    if (_messageController.text.trim().isEmpty) return;

    final newMessage = _ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      text: _messageController.text,
      sender: 'user',
      timestamp: DateTime.now(),
      isSentByMe: true,
    );

    setState(() {
      _messages.add(newMessage);
    });

    _messageController.clear();
    
    // Scroll to the bottom
    _scrollController.animateTo(
      _scrollController.position.maxScrollExtent,
      duration: Duration(milliseconds: 300),
      curve: Curves.easeOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              radius: 16,
              backgroundImage: widget.participantAvatar != null
                  ? NetworkImage(widget.participantAvatar!)
                  : null,
              backgroundColor: Colors.grey[300],
              child: widget.participantAvatar == null
                  ? Icon(Icons.person, size: 16, color: Colors.grey[600])
                  : null,
            ),
            SizedBox(width: 12),
            Text(widget.chatTitle),
            SizedBox(width: 8),
            Container(
              width: 10,
              height: 10,
              decoration: BoxDecoration(
                color: _isOnline ? Colors.green : Colors.grey,
                shape: BoxShape.circle,
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.phone),
            onPressed: () {
              // Start voice call
            },
          ),
          IconButton(
            icon: Icon(Icons.videocam),
            onPressed: () {
              // Start video call
            },
          ),
          PopupMenuButton<String>(
            icon: Icon(Icons.more_vert),
            onSelected: (String result) {
              switch (result) {
                case 'info':
                  // Show chat info
                  break;
                case 'search':
                  // Search in chat
                  break;
                case 'archive':
                  // Archive chat
                  break;
              }
            },
            itemBuilder: (BuildContext context) => [
              PopupMenuItem<String>(
                value: 'info',
                child: Text('Chat Info'),
              ),
              PopupMenuItem<String>(
                value: 'search',
                child: Text('Search in Chat'),
              ),
              PopupMenuItem<String>(
                value: 'archive',
                child: Text('Archive Chat'),
              ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // Messages list
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[index];
                return _buildMessageItem(message);
              },
            ),
          ),
          
          // Input area
          Container(
            padding: EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              border: Border(
                top: BorderSide(color: Colors.grey[300]!),
              ),
            ),
            child: Row(
              children: [
                IconButton(
                  icon: Icon(Icons.emoji_emotions_outlined),
                  onPressed: () {
                    // Show emoji picker
                  },
                ),
                IconButton(
                  icon: Icon(Icons.attach_file),
                  onPressed: () {
                    // Attach file
                  },
                ),
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: InputDecoration(
                      hintText: 'Type a message...',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                    ),
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.camera_alt_outlined),
                  onPressed: () {
                    // Send image
                  },
                ),
                IconButton(
                  icon: Icon(Icons.send),
                  onPressed: _sendMessage,
                  color: Theme.of(context).primaryColor,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageItem(_ChatMessage message) {
    return Container(
      margin: EdgeInsets.only(
        top: 8,
        left: 8,
        right: 8,
        bottom: message.isSentByMe ? 8 : 0,
      ),
      child: Row(
        mainAxisAlignment: message.isSentByMe
            ? MainAxisAlignment.end
            : MainAxisAlignment.start,
        children: [
          if (!message.isSentByMe)
            CircleAvatar(
              radius: 14,
              backgroundImage: widget.participantAvatar != null
                  ? NetworkImage(widget.participantAvatar!)
                  : null,
              backgroundColor: Colors.grey[300],
              child: widget.participantAvatar == null
                  ? Icon(Icons.person, size: 12, color: Colors.grey[600])
                  : null,
            ),
          SizedBox(width: 8),
          Flexible(
            child: Container(
              constraints: BoxConstraints(maxWidth: 250),
              decoration: BoxDecoration(
                color: message.isSentByMe
                    ? Theme.of(context).primaryColor
                    : Colors.grey[300],
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(12),
                  topRight: Radius.circular(12),
                  bottomLeft: message.isSentByMe
                      ? Radius.circular(12)
                      : Radius.circular(0),
                  bottomRight: message.isSentByMe
                      ? Radius.circular(0)
                      : Radius.circular(12),
                ),
              ),
              child: Padding(
                padding: EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      message.text,
                      style: TextStyle(
                        color: message.isSentByMe
                            ? Colors.white
                            : Colors.black87,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      '${message.timestamp.hour.toString().padLeft(2, '0')}:${message.timestamp.minute.toString().padLeft(2, '0')}',
                      style: TextStyle(
                        fontSize: 10,
                        color: message.isSentByMe
                            ? Colors.blueGrey[100]
                            : Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          if (message.isSentByMe) SizedBox(width: 8),
          if (message.isSentByMe)
            CircleAvatar(
              radius: 14,
              backgroundImage: NetworkImage('https://via.placeholder.com/150'),
              backgroundColor: Colors.grey[300],
              child: Icon(Icons.person, size: 12, color: Colors.grey[600]),
            ),
        ],
      ),
    );
  }
}

class _ChatMessage {
  final String id;
  final String text;
  final String sender;
  final DateTime timestamp;
  final bool isSentByMe;

  _ChatMessage({
    required this.id,
    required this.text,
    required this.sender,
    required this.timestamp,
    required this.isSentByMe,
  });
}