import 'package:flutter/material.dart';

class PrivateMessagesPage extends StatefulWidget {
  const PrivateMessagesPage({super.key});

  @override
  State<PrivateMessagesPage> createState() => _PrivateMessagesPageState();
}

class _PrivateMessagesPageState extends State<PrivateMessagesPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<PrivateMessageThread> _messageThreads = [];
  List<Contact> _contacts = [];
  int? _selectedThreadId;
  bool _isSearching = false;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadInitialData();
  }

  Future<void> _loadInitialData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock contacts
      setState(() {
        _contacts = [
          Contact(
            id: 1,
            name: 'Alex Johnson',
            avatarUrl: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=AJ',
            lastMessage: 'Hey, how are you doing?',
            lastMessageTime: DateTime.now().subtract(const Duration(minutes: 15)),
            unreadCount: 2,
            isOnline: true,
          ),
          Contact(
            id: 2,
            name: 'Sarah Williams',
            avatarUrl: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=SW',
            lastMessage: 'Can we discuss the project details?',
            lastMessageTime: DateTime.now().subtract(const Duration(hours: 2)),
            unreadCount: 0,
            isOnline: false,
          ),
          Contact(
            id: 3,
            name: 'Mike Chen',
            avatarUrl: 'https://via.placeholder.com/150/118AB2/FFFFFF?text=MC',
            lastMessage: 'I saw your profile and wanted to connect',
            lastMessageTime: DateTime.now().subtract(const Duration(days: 1)),
            unreadCount: 1,
            isOnline: true,
          ),
          Contact(
            id: 4,
            name: 'Emma Davis',
            avatarUrl: 'https://via.placeholder.com/150/FFC0CB/FFFFFF?text=ED',
            lastMessage: 'Thanks for the collaboration!',
            lastMessageTime: DateTime.now().subtract(const Duration(days: 2)),
            unreadCount: 0,
            isOnline: false,
          ),
          Contact(
            id: 5,
            name: 'Daniel Smith',
            avatarUrl: 'https://via.placeholder.com/150/6A0572/FFFFFF?text=DS',
            lastMessage: 'Let me know when you\'re available',
            lastMessageTime: DateTime.now().subtract(const Duration(days: 3)),
            unreadCount: 3,
            isOnline: false,
          ),
        ];

        // Mock message threads
        _messageThreads = [
          PrivateMessageThread(
            id: 1,
            participants: [_contacts[0]],
            lastMessage: 'Hey, how are you doing?',
            lastMessageTime: DateTime.now().subtract(const Duration(minutes: 15)),
            unreadCount: 2,
            isArchived: false,
            isMuted: false,
          ),
          PrivateMessageThread(
            id: 2,
            participants: [_contacts[1]],
            lastMessage: 'Can we discuss the project details?',
            lastMessageTime: DateTime.now().subtract(const Duration(hours: 2)),
            unreadCount: 0,
            isArchived: false,
            isMuted: false,
          ),
          PrivateMessageThread(
            id: 3,
            participants: [_contacts[2]],
            lastMessage: 'I saw your profile and wanted to connect',
            lastMessageTime: DateTime.now().subtract(const Duration(days: 1)),
            unreadCount: 1,
            isArchived: false,
            isMuted: true,
          ),
          PrivateMessageThread(
            id: 4,
            participants: [_contacts[3]],
            lastMessage: 'Thanks for the collaboration!',
            lastMessageTime: DateTime.now().subtract(const Duration(days: 2)),
            unreadCount: 0,
            isArchived: true,
            isMuted: false,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load messages. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _selectThread(int threadId) {
    setState(() {
      _selectedThreadId = threadId;
    });
  }

  void _sendMessage(String content) {
    if (content.trim().isEmpty || _selectedThreadId == null) return;

    setState(() {
      var thread = _messageThreads.firstWhere((t) => t.id == _selectedThreadId);
      thread.lastMessage = content;
      thread.lastMessageTime = DateTime.now();
      thread.unreadCount = 0;
    });

    // In a real app, this would send the message to the server
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Message sent'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _searchMessages(String query) {
    setState(() {
      _searchQuery = query;
      _isSearching = query.isNotEmpty;
      
      if (_isSearching) {
        // In a real app, this would search the database
        // For now, we'll just filter existing threads
        _messageThreads = _messageThreads.where((thread) {
          return thread.participants.any((contact) => 
            contact.name.toLowerCase().contains(query.toLowerCase()));
        }).toList();
      } else {
        // Reset to all threads
        _loadInitialData();
      }
    });
  }

  void _startNewChat(Contact contact) {
    setState(() {
      _messageThreads.add(
        PrivateMessageThread(
          id: _messageThreads.length + 1,
          participants: [contact],
          lastMessage: 'New chat started',
          lastMessageTime: DateTime.now(),
          unreadCount: 0,
          isArchived: false,
          isMuted: false,
        ),
      );
      _selectedThreadId = _messageThreads.last.id;
    });
  }

  void _archiveThread(int threadId) {
    setState(() {
      var thread = _messageThreads.firstWhere((t) => t.id == threadId);
      thread.isArchived = !thread.isArchived;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _messageThreads.firstWhere((t) => t.id == threadId).isArchived 
            ? 'Conversation archived' 
            : 'Conversation unarchived'
        ),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _muteThread(int threadId) {
    setState(() {
      var thread = _messageThreads.firstWhere((t) => t.id == threadId);
      thread.isMuted = !thread.isMuted;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _messageThreads.firstWhere((t) => t.id == threadId).isMuted 
            ? 'Conversation muted' 
            : 'Conversation unmuted'
        ),
        backgroundColor: Colors.orange,
      ),
    );
  }

  void _deleteThread(int threadId) {
    setState(() {
      _messageThreads.removeWhere((t) => t.id == threadId);
      if (_selectedThreadId == threadId) {
        _selectedThreadId = null;
      }
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Conversation deleted'),
        backgroundColor: Colors.red,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Private Messages'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Show search
            },
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadInitialData,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadInitialData,
        child: _isLoading && _messageThreads.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _messageThreads.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadInitialData,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : Row(
                    children: [
                      // Threads list
                      Expanded(
                        flex: 1,
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Search
                              TextField(
                                decoration: const InputDecoration(
                                  hintText: 'Search messages...',
                                  prefixIcon: Icon(Icons.search),
                                  border: OutlineInputBorder(),
                                ),
                                onChanged: _searchMessages,
                              ),
                              const SizedBox(height: 16),
                              // Message threads
                              Expanded(
                                child: ListView.builder(
                                  itemCount: _messageThreads.length,
                                  itemBuilder: (context, index) {
                                    var thread = _messageThreads[index];
                                    var participant = thread.participants[0];
                                    bool isSelected = _selectedThreadId == thread.id;
                                    
                                    return Card(
                                      color: isSelected ? Theme.of(context).primaryColor.withOpacity(0.1) : null,
                                      margin: const EdgeInsets.only(bottom: 12),
                                      child: ListTile(
                                        leading: Stack(
                                          children: [
                                            CircleAvatar(
                                              radius: 25,
                                              backgroundImage: NetworkImage(participant.avatarUrl),
                                            ),
                                            if (participant.isOnline)
                                              Positioned(
                                                bottom: 0,
                                                right: 0,
                                                child: Container(
                                                  width: 12,
                                                  height: 12,
                                                  decoration: const BoxDecoration(
                                                    color: Colors.green,
                                                    shape: BoxShape.circle,
                                                  ),
                                                ),
                                              ),
                                          ],
                                        ),
                                        title: Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(participant.name),
                                            Text(
                                              _formatTime(thread.lastMessageTime),
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: Colors.grey,
                                              ),
                                            ),
                                          ],
                                        ),
                                        subtitle: Row(
                                          children: [
                                            if (thread.unreadCount > 0)
                                              Container(
                                                margin: const EdgeInsets.only(right: 8),
                                                padding: const EdgeInsets.symmetric(
                                                  horizontal: 8,
                                                  vertical: 4,
                                                ),
                                                decoration: BoxDecoration(
                                                  color: Theme.of(context).primaryColor,
                                                  borderRadius: BorderRadius.circular(12),
                                                ),
                                                child: Text(
                                                  '${thread.unreadCount}',
                                                  style: const TextStyle(
                                                    color: Colors.white,
                                                    fontSize: 12,
                                                  ),
                                                ),
                                              ),
                                            Expanded(
                                              child: Text(
                                                thread.lastMessage,
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                                style: const TextStyle(
                                                  fontSize: 14,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        trailing: PopupMenuButton<String>(
                                          icon: const Icon(Icons.more_vert),
                                          onSelected: (value) {
                                            switch (value) {
                                              case 'archive':
                                                _archiveThread(thread.id);
                                                break;
                                              case 'mute':
                                                _muteThread(thread.id);
                                                break;
                                              case 'delete':
                                                _deleteThread(thread.id);
                                                break;
                                            }
                                          },
                                          itemBuilder: (BuildContext context) {
                                            return [
                                              PopupMenuItem(
                                                value: 'archive',
                                                child: Text(thread.isArchived ? 'Unarchive' : 'Archive'),
                                              ),
                                              PopupMenuItem(
                                                value: 'mute',
                                                child: Text(thread.isMuted ? 'Unmute' : 'Mute'),
                                              ),
                                              const PopupMenuItem(
                                                value: 'delete',
                                                child: Text('Delete'),
                                              ),
                                            ];
                                          },
                                        ),
                                        onTap: () => _selectThread(thread.id),
                                      ),
                                    );
                                  },
                                ),
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'Contacts',
                                style: TextStyle(
                                  color: Colors.grey[800],
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 8),
                              // Contacts
                              Expanded(
                                child: ListView.builder(
                                  itemCount: _contacts.length,
                                  itemBuilder: (context, index) {
                                    var contact = _contacts[index];
                                    return Card(
                                      margin: const EdgeInsets.only(bottom: 12),
                                      child: ListTile(
                                        leading: CircleAvatar(
                                          radius: 25,
                                          backgroundImage: NetworkImage(contact.avatarUrl),
                                        ),
                                        title: Text(contact.name),
                                        subtitle: Text(contact.lastMessage),
                                        trailing: contact.isOnline
                                            ? const Icon(
                                                Icons.circle,
                                                color: Colors.green,
                                                size: 16,
                                              )
                                            : null,
                                        onTap: () => _startNewChat(contact),
                                      ),
                                    );
                                  },
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      // Message view
                      if (_selectedThreadId != null)
                        Expanded(
                          flex: 2,
                          child: _buildMessageView(),
                        ),
                    ],
                  ),
      ),
      floatingActionButton: _selectedThreadId != null
          ? FloatingActionButton(
              backgroundColor: Theme.of(context).primaryColor,
              child: const Icon(Icons.send),
              onPressed: () {
                // Show message input dialog
                _showMessageInput(context);
              })
          : null,
    );
  }

  Widget _buildMessageView() {
    var thread = _messageThreads.firstWhere(
      (thread) => thread.id == _selectedThreadId,
    );
    var participant = thread.participants[0];

    return Column(
      children: [
        // Thread header
        Container(
          padding: const EdgeInsets.all(16.0),
          color: Colors.grey[200],
          child: Row(
            children: [
              CircleAvatar(
                radius: 25,
                backgroundImage: NetworkImage(participant.avatarUrl),
              ),
              const SizedBox(width: 16),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    participant.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    participant.isOnline ? 'Online' : 'Offline',
                    style: TextStyle(
                      fontSize: 12,
                      color: participant.isOnline ? Colors.green : Colors.grey,
                    ),
                  ),
                ],
              ),
              const Spacer(),
              IconButton(
                icon: Icon(thread.isMuted ? Icons.volume_off : Icons.volume_up),
                onPressed: () => _muteThread(thread.id),
              ),
              IconButton(
                icon: Icon(thread.isArchived ? Icons.unarchive : Icons.archive),
                onPressed: () => _archiveThread(thread.id),
              ),
            ],
          ),
        ),
        const SizedBox(height: 1),
        // Messages list
        Expanded(
          child: ListView.builder(
            itemCount: 10, // Mock messages
            itemBuilder: (context, index) {
              bool isMyMessage = index % 3 == 0;
              return Padding(
                padding: EdgeInsets.only(
                  top: 8,
                  left: isMyMessage ? 80 : 16,
                  right: isMyMessage ? 16 : 80,
                ),
                child: Card(
                  color: isMyMessage
                      ? Theme.of(context).primaryColor
                      : Colors.grey[200],
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  margin: EdgeInsets.only(
                    left: isMyMessage ? 80 : 16,
                    right: isMyMessage ? 16 : 80,
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(12.0),
                    child: Column(
                      crossAxisAlignment: isMyMessage
                          ? CrossAxisAlignment.end
                          : CrossAxisAlignment.start,
                      children: [
                        if (!isMyMessage)
                          Text(
                            participant.name,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        const Text(
                          'This is a sample message to demonstrate the private messaging interface. In a real application, this would show actual messages exchanged between members.',
                        ),
                        const SizedBox(height: 4),
                        Row(
                          mainAxisAlignment: isMyMessage
                              ? MainAxisAlignment.end
                              : MainAxisAlignment.start,
                          children: [
                            Text(
                              _formatTime(DateTime.now().subtract(Duration(minutes: index * 5))),
                              style: TextStyle(
                                fontSize: 12,
                                color: isMyMessage ? Colors.white.withOpacity(0.8) : Colors.black.withOpacity(0.6),
                              ),
                            ),
                            const SizedBox(width: 4),
                            if (isMyMessage)
                              const Icon(
                                Icons.done_all,
                                size: 16,
                                color: Colors.white,
                              ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  void _showMessageInput(BuildContext context) {
    TextEditingController _controller = TextEditingController();
    
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'New Message to ${_messageThreads.firstWhere((thread) => thread.id == _selectedThreadId).participants[0].name}',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: _controller,
                decoration: const InputDecoration(
                  hintText: 'Type your message...',
                  border: OutlineInputBorder(),
                ),
                maxLines: 5,
                minLines: 1,
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                      _sendMessage(_controller.text);
                      _controller.clear();
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).primaryColor,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Send'),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  String _formatTime(DateTime time) {
    final now = DateTime.now();
    final difference = now.difference(time);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d';
    } else {
      return '${time.month}/${time.day}';
    }
  }
}

class Contact {
  final int id;
  final String name;
  final String avatarUrl;
  final String lastMessage;
  final DateTime lastMessageTime;
  final int unreadCount;
  final bool isOnline;

  Contact({
    required this.id,
    required this.name,
    required this.avatarUrl,
    required this.lastMessage,
    required this.lastMessageTime,
    required this.unreadCount,
    required this.isOnline,
  });
}

class PrivateMessageThread {
  final int id;
  final List<Contact> participants;
  String lastMessage;
  DateTime lastMessageTime;
  int unreadCount;
  bool isArchived;
  bool isMuted;

  PrivateMessageThread({
    required this.id,
    required this.participants,
    required this.lastMessage,
    required this.lastMessageTime,
    required this.unreadCount,
    required this.isArchived,
    required this.isMuted,
  });
}