import 'package:flutter/material.dart';

class Friend {
  final int id;
  final String membername;
  final String? firstName;
  final String? lastName;
  final String? profileImageUrl;
  final bool isOnline;
  final String lastSeen;
  final bool isMutual;

  Friend({
    required this.id,
    required this.membername,
    this.firstName,
    this.lastName,
    this.profileImageUrl,
    required this.isOnline,
    required this.lastSeen,
    required this.isMutual,
  });
}

class FriendsScreen extends StatefulWidget {
  @override
  _FriendsScreenState createState() => _FriendsScreenState();
}

class _FriendsScreenState extends State<FriendsScreen> {
  List<Friend> _friends = [];
  List<Friend> _pendingRequests = [];
  List<Friend> _suggestedFriends = [];
  bool _isLoading = true;
  int _currentTab = 0; // 0: Friends, 1: Requests, 2: Suggestions

  @override
  void initState() {
    super.initState();
    _loadFriends();
  }

  Future<void> _loadFriends() async {
    try {
      // In a real implementation, this would be API calls
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _friends = [
          Friend(
            id: 1,
            membername: 'johndoe',
            firstName: 'John',
            lastName: 'Doe',
            profileImageUrl: 'https://via.placeholder.com/150',
            isOnline: true,
            lastSeen: 'Online now',
            isMutual: true,
          ),
          Friend(
            id: 2,
            membername: 'janedesigner',
            firstName: 'Jane',
            lastName: 'Smith',
            profileImageUrl: 'https://via.placeholder.com/150',
            isOnline: false,
            lastSeen: 'Last seen 2 hours ago',
            isMutual: false,
          ),
          Friend(
            id: 3,
            membername: 'techguru',
            firstName: 'Alex',
            lastName: 'Johnson',
            profileImageUrl: 'https://via.placeholder.com/150',
            isOnline: true,
            lastSeen: 'Online now',
            isMutual: true,
          ),
          Friend(
            id: 4,
            membername: 'traveler',
            firstName: 'Sarah',
            lastName: 'Williams',
            profileImageUrl: 'https://via.placeholder.com/150',
            isOnline: false,
            lastSeen: 'Last seen yesterday',
            isMutual: true,
          ),
        ];
        
        _pendingRequests = [
          Friend(
            id: 5,
            membername: 'newmember',
            firstName: 'Mike',
            lastName: 'Brown',
            profileImageUrl: 'https://via.placeholder.com/150',
            isOnline: false,
            lastSeen: 'Joined last week',
            isMutual: false,
          ),
          Friend(
            id: 6,
            membername: 'colleague',
            firstName: 'Emily',
            lastName: 'Davis',
            profileImageUrl: 'https://via.placeholder.com/150',
            isOnline: false,
            lastSeen: 'Work colleague',
            isMutual: false,
          ),
        ];
        
        _suggestedFriends = [
          Friend(
            id: 7,
            membername: 'designer',
            firstName: 'Anna',
            lastName: 'Taylor',
            profileImageUrl: 'https://via.placeholder.com/150',
            isOnline: false,
            lastSeen: 'Designer',
            isMutual: false,
          ),
          Friend(
            id: 8,
            membername: 'developer',
            firstName: 'Robert',
            lastName: 'Wilson',
            profileImageUrl: 'https://via.placeholder.com/150',
            isOnline: false,
            lastSeen: 'Developer',
            isMutual: false,
          ),
          Friend(
            id: 9,
            membername: 'photographer',
            firstName: 'Lisa',
            lastName: 'Moore',
            profileImageUrl: 'https://via.placeholder.com/150',
            isOnline: false,
            lastSeen: 'Photographer',
            isMutual: false,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading friends: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading friends')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Friends'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        bottom: TabBar(
          controller: DefaultTabController.of(context),
          tabs: [
            Tab(text: 'Friends'),
            Tab(text: 'Requests (${_pendingRequests.length})'),
            Tab(text: 'Suggestions'),
          ],
          onTap: (index) {
            setState(() {
              _currentTab = index;
            });
          },
        ),
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: DefaultTabController.of(context),
              children: [
                _buildFriendsTab(),
                _buildRequestsTab(),
                _buildSuggestionsTab(),
              ],
            ),
    );
  }

  Widget _buildFriendsTab() {
    if (_friends.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.people,
              size: 80,
              color: Colors.grey[400],
            ),
            SizedBox(height: 16),
            Text(
              'No friends yet',
              style: TextStyle(
                fontSize: 20,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 8),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                'Your friends will appear here. Start by connecting with people!',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.grey[500],
                ),
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadFriends,
      child: ListView.builder(
        itemCount: _friends.length,
        itemBuilder: (context, index) {
          final friend = _friends[index];
          return _buildFriendItem(friend);
        },
      ),
    );
  }

  Widget _buildRequestsTab() {
    if (_pendingRequests.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.person_add,
              size: 80,
              color: Colors.grey[400],
            ),
            SizedBox(height: 16),
            Text(
              'No pending requests',
              style: TextStyle(
                fontSize: 20,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 8),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                'Your friend requests will appear here',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.grey[500],
                ),
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadFriends,
      child: ListView.builder(
        itemCount: _pendingRequests.length,
        itemBuilder: (context, index) {
          final request = _pendingRequests[index];
          return _buildRequestItem(request);
        },
      ),
    );
  }

  Widget _buildSuggestionsTab() {
    if (_suggestedFriends.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.group_add,
              size: 80,
              color: Colors.grey[400],
            ),
            SizedBox(height: 16),
            Text(
              'No suggestions',
              style: TextStyle(
                fontSize: 20,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 8),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                'We couldn\'t find any suggestions for you right now',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.grey[500],
                ),
              ),
            ),
          ],
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: _loadFriends,
      child: ListView.builder(
        itemCount: _suggestedFriends.length,
        itemBuilder: (context, index) {
          final friend = _suggestedFriends[index];
          return _buildSuggestedFriendItem(friend);
        },
      ),
    );
  }

  Widget _buildFriendItem(Friend friend) {
    return ListTile(
      leading: Stack(
        children: [
          CircleAvatar(
            backgroundImage: friend.profileImageUrl != null
                ? NetworkImage(friend.profileImageUrl!)
                : null,
            child: friend.profileImageUrl == null
                ? Icon(Icons.person)
                : null,
          ),
          if (friend.isOnline)
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
          Text(
            '${friend.firstName ?? ''} ${friend.lastName ?? ''}'.trim(),
            style: TextStyle(
              fontWeight: FontWeight.w500,
            ),
          ),
          if (friend.isMutual)
            Icon(
              Icons.check_circle,
              color: Colors.blue,
              size: 16,
            ),
        ],
      ),
      subtitle: Text(
        friend.lastSeen,
        style: TextStyle(
          color: friend.isOnline ? Colors.green : Colors.grey[600],
        ),
      ),
      trailing: PopupMenuButton<String>(
        onSelected: (String result) {
          _handleFriendMenu(result, friend);
        },
        itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
          PopupMenuItem<String>(
            value: 'message',
            child: Text('Message'),
          ),
          PopupMenuItem<String>(
            value: 'profile',
            child: Text('View Profile'),
          ),
          PopupMenuItem<String>(
            value: 'remove',
            child: Text('Remove Friend'),
          ),
        ],
      ),
      onTap: () {
        // Navigate to friend's profile
        _openProfile(friend);
      },
    );
  }

  Widget _buildRequestItem(Friend request) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            CircleAvatar(
              backgroundImage: request.profileImageUrl != null
                  ? NetworkImage(request.profileImageUrl!)
                  : null,
              child: request.profileImageUrl == null
                  ? Icon(Icons.person)
                  : null,
            ),
            SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${request.firstName ?? ''} ${request.lastName ?? ''}'.trim(),
                    style: TextStyle(
                      fontWeight: FontWeight.w500,
                      fontSize: 16,
                    ),
                  ),
                  Text(
                    request.membername,
                    style: TextStyle(
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                IconButton(
                  icon: Icon(Icons.check, color: Colors.green),
                  onPressed: () {
                    // Accept request
                    _acceptRequest(request);
                  },
                ),
                IconButton(
                  icon: Icon(Icons.close, color: Colors.red),
                  onPressed: () {
                    // Decline request
                    _declineRequest(request);
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSuggestedFriendItem(Friend friend) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            CircleAvatar(
              backgroundImage: friend.profileImageUrl != null
                  ? NetworkImage(friend.profileImageUrl!)
                  : null,
              child: friend.profileImageUrl == null
                  ? Icon(Icons.person)
                  : null,
            ),
            SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${friend.firstName ?? ''} ${friend.lastName ?? ''}'.trim(),
                    style: TextStyle(
                      fontWeight: FontWeight.w500,
                      fontSize: 16,
                    ),
                  ),
                  Text(
                    friend.membername,
                    style: TextStyle(
                      color: Colors.grey[600],
                    ),
                  ),
                  Text(
                    friend.lastSeen,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[500],
                    ),
                  ),
                ],
              ),
            ),
            ElevatedButton(
              onPressed: () {
                // Send friend request
                _sendFriendRequest(friend);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
              ),
              child: Text('Add'),
            ),
          ],
        ),
      ),
    );
  }

  void _handleFriendMenu(String result, Friend friend) {
    switch (result) {
      case 'message':
        // Navigate to message screen
        break;
      case 'profile':
        _openProfile(friend);
        break;
      case 'remove':
        _removeFriend(friend);
        break;
    }
  }

  void _openProfile(Friend friend) {
    // Navigate to friend's profile
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => FriendProfileScreen(friend: friend),
      ),
    );
  }

  void _acceptRequest(Friend request) {
    setState(() {
      _pendingRequests.remove(request);
      _friends.add(request);
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Friend request accepted'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _declineRequest(Friend request) {
    setState(() {
      _pendingRequests.remove(request);
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Friend request declined'),
        backgroundColor: Colors.red,
      ),
    );
  }

  void _sendFriendRequest(Friend friend) {
    setState(() {
      _suggestedFriends.remove(friend);
      _pendingRequests.add(friend);
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Friend request sent'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _removeFriend(Friend friend) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Remove Friend'),
          content: Text('Are you sure you want to remove ${friend.firstName ?? friend.membername} from your friends?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                setState(() {
                  _friends.remove(friend);
                });
                
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Friend removed'),
                    backgroundColor: Colors.red,
                  ),
                );
              },
              child: Text('Remove', style: TextStyle(color: Colors.red)),
            ),
          ],
        );
      },
    );
  }
}

class FriendProfileScreen extends StatelessWidget {
  final Friend friend;

  const FriendProfileScreen({required this.friend});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(friend.membername),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Profile header
            Container(
              width: double.infinity,
              padding: EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Colors.blue, Colors.purple],
                ),
              ),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 50,
                    backgroundImage: friend.profileImageUrl != null
                        ? NetworkImage(friend.profileImageUrl!)
                        : null,
                    child: friend.profileImageUrl == null
                        ? Icon(Icons.person, size: 50, color: Colors.white)
                        : null,
                    backgroundColor: Colors.grey[300],
                  ),
                  SizedBox(height: 16),
                  Text(
                    '${friend.firstName ?? ''} ${friend.lastName ?? ''}'.trim(),
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    '@${friend.membername}',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white70,
                    ),
                  ),
                  SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        friend.isOnline ? Icons.radio_button_checked : Icons.radio_button_unchecked,
                        color: friend.isOnline ? Colors.green : Colors.grey,
                        size: 16,
                      ),
                      SizedBox(width: 4),
                      Text(
                        friend.lastSeen,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.white70,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            
            // Action buttons
            Padding(
              padding: EdgeInsets.all(16),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () {
                        // Send message
                      },
                      child: Text('Message'),
                    ),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        // Share profile
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                      ),
                      child: Text('Share Profile'),
                    ),
                  ),
                ],
              ),
            ),
            
            // Content section
            Padding(
              padding: EdgeInsets.all(16),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'About',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Text(
                    'This is a sample about section. In a real app, this would contain information about the member.',
                    style: TextStyle(fontSize: 16),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}