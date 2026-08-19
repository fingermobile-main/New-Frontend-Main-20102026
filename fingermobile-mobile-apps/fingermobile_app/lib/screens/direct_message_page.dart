import 'package:flutter/material.dart';

class DirectMessagePage extends StatefulWidget {
  final String contactName;
  final String contactId;

  DirectMessagePage({required this.contactName, required this.contactId});

  @override
  _DirectMessagePageState createState() => _DirectMessagePageState();
}

class _DirectMessagePageState extends State<DirectMessagePage> {
  final TextEditingController _messageController = TextEditingController();
  final List<Map<String, dynamic>> _messages = [
    {
      'id': 1,
      'text': 'Hey there! How are you doing?',
      'sender': 'other',
      'timestamp': '10:30 AM',
    },
    {
      'id': 2,
      'text': 'I\'m doing great! Just working on the new project.',
      'sender': 'me',
      'timestamp': '10:32 AM',
    },
    {
      'id': 3,
      'text': 'That sounds exciting! Can you tell me more about it?',
      'sender': 'other',
      'timestamp': '10:33 AM',
    },
    {
      'id': 4,
      'text': 'Sure, it\'s a new feature for our platform that will improve member experience.',
      'sender': 'me',
      'timestamp': '10:35 AM',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              backgroundColor: Colors.purple[100],
              child: Text(
                widget.contactName.split(' ').map((n) => n[0]).take(2).join(),
                style: TextStyle(color: Colors.deepPurple),
              ),
            ),
            SizedBox(width: 12),
            Text(widget.contactName),
          ],
        ),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
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
          IconButton(
            icon: Icon(Icons.info),
            onPressed: () {
              // Show contact info
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              reverse: true,
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final message = _messages[_messages.length - 1 - index];
                bool isMe = message['sender'] == 'me';
                
                return Container(
                  margin: EdgeInsets.only(
                    left: isMe ? 50 : 10,
                    right: isMe ? 10 : 50,
                    top: 5,
                    bottom: 5,
                  ),
                  child: Row(
                    mainAxisAlignment: isMe 
                        ? MainAxisAlignment.end 
                        : MainAxisAlignment.start,
                    children: [
                      Flexible(
                        child: Container(
                          decoration: BoxDecoration(
                            color: isMe ? Colors.deepPurple : Colors.grey[300],
                            borderRadius: BorderRadius.only(
                              topLeft: Radius.circular(12),
                              topRight: Radius.circular(12),
                              bottomLeft: isMe ? Radius.circular(12) : Radius.circular(0),
                              bottomRight: isMe ? Radius.circular(0) : Radius.circular(12),
                            ),
                          ),
                          child: Padding(
                            padding: EdgeInsets.all(12),
                            child: Text(
                              message['text'],
                              style: TextStyle(
                                color: isMe ? Colors.white : Colors.black,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          Container(
            padding: EdgeInsets.all(8),
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
