import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fingermobile_app/services/api_service.dart';
import 'package:fingermobile_app/models/member.dart';
import 'package:fingermobile_app/screens/login_screen.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:fingermobile_app/providers/app_provider.dart';
import 'package:fingermobile_app/providers/bluetooth_provider.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Member? _member;
  bool _isLoading = true;
  String? _errorMessage;
  List<dynamic> _posts = [];
  bool _isPostsLoading = true;
  String? _postsErrorMessage;
  int _currentPage = 1;
  static const int _pageSize = 10;
  bool _hasMorePosts = true;
  int _selectedIndex = 0;

  final List<Widget> _widgetOptions = <Widget>[
    // Placeholder widgets - replace with actual screens
    Center(
      child: Text(
        'Welcome to FingerMobile!',
        style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
      ),
    ),
    Center(
      child: Text(
        'Posts Screen',
        style: TextStyle(fontSize: 24),
      ),
    ),
    Center(
      child: Text(
        'Chat Screen',
        style: TextStyle(fontSize: 24),
      ),
    ),
    Center(
      child: Text(
        'Profile Screen',
        style: TextStyle(fontSize: 24),
      ),
    ),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  void initState() {
    super.initState();
    _loadmemberProfile();
    _loadFeed();
  }

  Future<void> _loadmemberProfile() async {
    try {
      final response = await ApiService.getMemberProfile();

      if (response.isSuccess && mounted) {
        setState(() {
          _member = Member.fromJson(response.data['member']);
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = response.errorMessage;
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load member profile';
        _isLoading = false;
      });
    }
  }

  Future<void> _loadFeed() async {
    try {
      final feedData = await ApiService.get('/posts/feed?page=$_currentPage&limit=$_pageSize');
      
      if (feedData != null && feedData['posts'] != null && mounted) {
        setState(() {
          _posts.addAll(feedData['posts']);
          _isPostsLoading = false;
          _hasMorePosts = feedData['posts'].length == _pageSize;
        });
      }
    } catch (e) {
      setState(() {
        _postsErrorMessage = 'Failed to load feed';
        _isPostsLoading = false;
      });
    }
  }

  Future<void> _loadMorePosts() async {
    if (_hasMorePosts && !_isPostsLoading) {
      setState(() {
        _currentPage++;
      });
      
      try {
        final feedData = await ApiService.get('/posts/feed?page=$_currentPage&limit=$_pageSize');
        
        if (feedData != null && feedData['posts'] != null && mounted) {
          setState(() {
            _posts.addAll(feedData['posts']);
            _hasMorePosts = feedData['posts'].length == _pageSize;
          });
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Failed to load more posts')),
          );
        }
      }
    }
  }

  Future<void> _toggleLike(int postId) async {
    try {
      final result = await ApiService.post('/posts/like', {
        'postId': postId
      });
      
      if (result != null && mounted) {
        // Update the post in the local list
        final postIndex = _posts.indexWhere((post) => post['id'] == postId);
        if (postIndex != -1) {
          setState(() {
            _posts[postIndex]['liked'] = !(_posts[postIndex]['liked'] ?? false);
            _posts[postIndex]['likes_count'] = _posts[postIndex]['liked'] 
                ? (_posts[postIndex]['likes_count'] ?? 0) + 1 
                : (_posts[postIndex]['likes_count'] ?? 1) - 1;
          });
        }
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(_posts[postIndex]['liked'] ? 'Post liked' : 'Like removed'))
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error updating like'))
        );
      }
    }
  }

  String _formatDate(String dateString) {
    try {
      DateTime date = DateTime.parse(dateString);
      return "${date.day}/${date.month}/${date.year}";
    } catch (e) {
      return dateString;
    }
  }

  Future<void> _logout() async {
    await ApiService.logout();
    if (mounted) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const LoginScreen()),
      );
    }
  }

  @override
  void dispose() {
    // ApiService is static, no need to dispose instance logic here if it doesn't exist
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final appProvider = Provider.of<AppProvider>(context);
    final bluetoothProvider = Provider.of<BluetoothProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('FingerMobile Home'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.notifications),
            onPressed: () {
              Navigator.pushNamed(context, '/notifications');
            },
          ),
          PopupMenuButton<String>(
            onSelected: (String choice) {
              if (choice == 'settings') {
                Navigator.pushNamed(context, '/settings');
              } else if (choice == 'logout') {
                appProvider.logout();
                Navigator.pushReplacementNamed(context, '/login');
              } else if (choice == 'bluetooth') {
                Navigator.pushNamed(context, '/bluetooth');
              } else if (choice == 'bluetooth-manager') {
                Navigator.pushNamed(context, '/bluetooth-manager');
              }
            },
            itemBuilder: (BuildContext context) {
              return {
                'bluetooth': 'Bluetooth Settings',
                'bluetooth-manager': 'Bluetooth Device Manager',
                'settings': 'Settings',
                'logout': 'Logout'
              }.map((String choice, String displayText) {
                return MapEntry(
                  choice,
                  PopupMenuItem<String>(
                    value: choice,
                    child: Text(displayText),
                  ),
                );
              }).values.toList();
            },
          ),
        ],
      ),
      body: Center(
        child: _widgetOptions.elementAt(_selectedIndex),
      ),
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            DrawerHeader(
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Icon(
                    Icons.account_circle,
                    size: 50,
                    color: Colors.white,
                  ),
                  SizedBox(height: 10),
                  Text(
                    appProvider.currentUser?['username'] ?? 'Guest User',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                    ),
                  ),
                  Text(
                    appProvider.currentUser?['email'] ?? 'Not logged in',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
            ListTile(
              leading: Icon(Icons.home),
              title: Text('Home'),
              selected: _selectedIndex == 0,
              onTap: () {
                setState(() {
                  _selectedIndex = 0;
                  Navigator.pop(context);
                });
              },
            ),
            ListTile(
              leading: Icon(Icons.forum),
              title: Text('Posts'),
              selected: _selectedIndex == 1,
              onTap: () {
                setState(() {
                  _selectedIndex = 1;
                  Navigator.pop(context);
                });
              },
            ),
            ListTile(
              leading: Icon(Icons.chat),
              title: Text('Chat'),
              selected: _selectedIndex == 2,
              onTap: () {
                setState(() {
                  _selectedIndex = 2;
                  Navigator.pop(context);
                });
              },
            ),
            ListTile(
              leading: Icon(Icons.people),
              title: Text('Friends'),
              onTap: () {
                Navigator.pushNamed(context, '/friends');
              },
            ),
            ListTile(
              leading: Icon(Icons.search),
              title: Text('Search'),
              onTap: () {
                Navigator.pushNamed(context, '/search');
              },
            ),
            Divider(),
            ListTile(
              leading: Icon(Icons.bluetooth),
              title: Text('Bluetooth Settings'),
              onTap: () {
                Navigator.pushNamed(context, '/bluetooth');
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Icon(Icons.devices_other),
              title: Text('Bluetooth Device Manager'),
              onTap: () {
                Navigator.pushNamed(context, '/bluetooth-manager');
                Navigator.pop(context);
              },
            ),
            Divider(),
            ListTile(
              leading: Icon(Icons.person),
              title: Text('Profile'),
              selected: _selectedIndex == 3,
              onTap: () {
                setState(() {
                  _selectedIndex = 3;
                  Navigator.pop(context);
                });
              },
            ),
            ListTile(
              leading: Icon(Icons.settings),
              title: Text('Settings'),
              onTap: () {
                Navigator.pushNamed(context, '/settings');
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: Icon(Icons.exit_to_app),
              title: Text('Logout'),
              onTap: () {
                appProvider.logout();
                Navigator.pushReplacementNamed(context, '/login');
              },
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.forum),
            label: 'Posts',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.chat),
            label: 'Chat',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Theme.of(context).primaryColor,
        onTap: _onItemTapped,
      ),
    );
  }

  Widget _buildPostCard(dynamic post) {
    final liked = post['liked'] ?? false;
    final likesCount = post['likes_count'] ?? 0;
    final commentsCount = post['comments_count'] ?? 0;
    
    return Card(
      margin: EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Post header
          Padding(
            padding: EdgeInsets.all(12),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundImage: post['profile_image_url'] != null
                      ? CachedNetworkImageProvider(post['profile_image_url'])
                      : null,
                  child: post['profile_image_url'] == null
                      ? Icon(Icons.person)
                      : null,
                  radius: 20,
                ),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        post['membername'] ?? 'Unknown member',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      Text(
                        post['created_at'] != null
                            ? _formatDate(post['created_at'])
                            : '',
                        style: TextStyle(color: Colors.grey[600], fontSize: 12),
                      ),
                    ],
                  ),
                ),
                PopupMenuButton(
                  icon: Icon(Icons.more_vert),
                  itemBuilder: (context) => [
                    PopupMenuItem(
                      value: 'report',
                      child: Text('Report'),
                    ),
                    PopupMenuItem(
                      value: 'save',
                      child: Text('Save for later'),
                    ),
                  ],
                  onSelected: (value) {
                    if (value == 'report') {
                      // Handle report
                    } else if (value == 'save') {
                      // Handle save
                    }
                  },
                ),
              ],
            ),
          ),

          // Post content
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              post['content'] ?? '',
              style: TextStyle(fontSize: 16),
            ),
          ),

          // Post media
          if (post['media_urls'] != null && post['media_urls'].isNotEmpty)
            Padding(
              padding: EdgeInsets.all(8),
              child: SizedBox(
                height: 250,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: post['media_urls'].length,
                  itemBuilder: (context, index) {
                    return Padding(
                      padding: EdgeInsets.only(right: 8),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: CachedNetworkImage(
                          imageUrl: post['media_urls'][index],
                          fit: BoxFit.cover,
                          width: MediaQuery.of(context).size.width * 0.8,
                          placeholder: (context, url) => Container(
                            color: Colors.grey[300],
                            child: Center(child: CircularProgressIndicator()),
                          ),
                          errorWidget: (context, url, error) => Container(
                            color: Colors.grey[300],
                            child: Icon(Icons.error_outline),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),

          // Post actions
          Padding(
            padding: EdgeInsets.all(12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    IconButton(
                      icon: Icon(
                        liked ? Icons.thumb_up_alt : Icons.thumb_up_alt_outlined,
                        color: liked ? Colors.blue : null,
                      ),
                      onPressed: () => _toggleLike(post['id']),
                    ),
                    Text('$likesCount likes'),
                  ],
                ),
                Row(
                  children: [
                    IconButton(
                      icon: Icon(Icons.comment_outlined),
                      onPressed: () {
                        // Navigate to comments
                      },
                    ),
                    Text('$commentsCount comments'),
                  ],
                ),
                IconButton(
                  icon: Icon(Icons.share_outlined),
                  onPressed: () {
                    // Share post
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}