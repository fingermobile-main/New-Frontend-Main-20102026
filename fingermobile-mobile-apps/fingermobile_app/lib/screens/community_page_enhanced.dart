import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class CommunityPageEnhanced extends StatefulWidget {
  const CommunityPageEnhanced({super.key});

  @override
  State<CommunityPageEnhanced> createState() => _CommunityPageEnhancedState();
}

class _CommunityPageEnhancedState extends State<CommunityPageEnhanced> {
  bool _isLoading = false;
  String? _errorMessage;
  List<CommunityPost> _posts = [];
  List<CommunityEvent> _events = [];
  List<CommunityMember> _popularMembers = [];
  int _activeTab = 0;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadCommunityContent();
  }

  Future<void> _loadCommunityContent() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock community content
      setState(() {
        _posts = [
          CommunityPost(
            id: 1,
            author: 'Alex Johnson',
            avatar: 'https://via.placeholder.com/150',
            content: 'Just finished an amazing project using Flutter! The new widgets are fantastic.',
            timestamp: DateTime.now().subtract(const Duration(minutes: 15)),
            likes: 24,
            comments: 5,
            shares: 3,
            images: [],
          ),
          CommunityPost(
            id: 2,
            author: 'Sarah Williams',
            avatar: 'https://via.placeholder.com/150',
            content: 'Hosting a workshop on mobile app development this Saturday. All skill levels welcome!',
            timestamp: DateTime.now().subtract(const Duration(hours: 2)),
            likes: 42,
            comments: 12,
            shares: 8,
            images: ['https://via.placeholder.com/600x400/4ECDC4/FFFFFF?text=Workshop'],
          ),
          CommunityPost(
            id: 3,
            author: 'Mike Chen',
            avatar: 'https://via.placeholder.com/150',
            content: 'Check out this cool UI design I created for a music app concept.',
            timestamp: DateTime.now().subtract(const Duration(hours: 5)),
            likes: 87,
            comments: 23,
            shares: 15,
            images: [
              'https://via.placeholder.com/600x400/FF6B6B/FFFFFF?text=Design+1',
              'https://via.placeholder.com/600x400/45B7D1/FFFFFF?text=Design+2',
            ],
          ),
        ];
        
        _events = [
          CommunityEvent(
            id: 1,
            title: 'Mobile Dev Workshop',
            description: 'Learn the latest in mobile development technologies',
            date: DateTime.now().add(const Duration(days: 3)),
            location: 'Online',
            attendees: 120,
            isAttending: false,
          ),
          CommunityEvent(
            id: 2,
            title: 'Community Meetup',
            description: 'Monthly in-person meetup for developers',
            date: DateTime.now().add(const Duration(days: 10)),
            location: 'Tech Hub Downtown',
            attendees: 45,
            isAttending: true,
          ),
          CommunityEvent(
            id: 3,
            title: 'Hackathon Finals',
            description: 'Watch the final presentations of our community hackathon',
            date: DateTime.now().add(const Duration(days: 17)),
            location: 'Innovation Center',
            attendees: 200,
            isAttending: false,
          ),
        ];
        
        _popularMembers = [
          CommunityMember(
            id: 1,
            name: 'Tech Guru',
            avatar: 'https://via.placeholder.com/150',
            followers: 12500,
            posts: 340,
            isFollowing: false,
          ),
          CommunityMember(
            id: 2,
            name: 'Design Maven',
            avatar: 'https://via.placeholder.com/150',
            followers: 8900,
            posts: 210,
            isFollowing: true,
          ),
          CommunityMember(
            id: 3,
            name: 'Code Ninja',
            avatar: 'https://via.placeholder.com/150',
            followers: 7600,
            posts: 180,
            isFollowing: false,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load community content. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _toggleLike(int postId) {
    setState(() {
      var post = _posts.firstWhere((p) => p.id == postId);
      post.likes += post.isLiked ? -1 : 1;
      post.isLiked = !post.isLiked;
    });
  }

  void _toggleAttendance(int eventId) {
    setState(() {
      var event = _events.firstWhere((e) => e.id == eventId);
      event.isAttending = !event.isAttending;
      event.attendees += event.isAttending ? 1 : -1;
    });
  }

  void _toggleFollow(int memberId) {
    setState(() {
      var member = _popularMembers.firstWhere((m) => m.id == memberId);
      member.isFollowing = !member.isFollowing;
      member.followers += member.isFollowing ? 1 : -1;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Community'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Open search
            },
          ),
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              // Open notifications
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadCommunityContent,
        child: _isLoading && _posts.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _posts.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadCommunityContent,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : Column(
                    children: [
                      // Tab Bar
                      Container(
                        color: Colors.grey.shade100,
                        child: Row(
                          children: [
                            _buildTab('Feed', 0),
                            _buildTab('Events', 1),
                            _buildTab('Members', 2),
                          ],
                        ),
                      ),
                      // Search Bar
                      Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: TextField(
                          decoration: const InputDecoration(
                            hintText: 'Search community...',
                            prefixIcon: Icon(Icons.search),
                            border: OutlineInputBorder(),
                          ),
                          onChanged: (value) {
                            setState(() {
                              _searchQuery = value;
                            });
                          },
                        ),
                      ),
                      // Tab Content
                      Expanded(
                        child: IndexedStack(
                          index: _activeTab,
                          children: [
                            _buildFeedTab(),
                            _buildEventsTab(),
                            _buildMembersTab(),
                          ],
                        ),
                      ),
                    ],
                  ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Create new post
        },
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildTab(String title, int index) {
    bool isActive = _activeTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _activeTab = index;
          });
        },
        child: Container(
          padding: const EdgeInsets.all(16.0),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: isActive 
                  ? Theme.of(context).primaryColor 
                  : Colors.transparent,
                width: 3.0,
              ),
            ),
          ),
          child: Text(
            title,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
              color: isActive 
                ? Theme.of(context).primaryColor 
                : Colors.grey,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFeedTab() {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      itemCount: _posts.length,
      itemBuilder: (context, index) {
        var post = _posts[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Post Header
                Row(
                  children: [
                    CircleAvatar(
                      backgroundImage: CachedNetworkImageProvider(post.avatar),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            post.author,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            _formatRelativeTime(post.timestamp),
                            style: const TextStyle(
                              color: Colors.grey,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.more_vert),
                      onPressed: () {
                        // Show post options
                      },
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                // Post Content
                Text(post.content),
                const SizedBox(height: 12),
                // Post Images
                if (post.images.isNotEmpty)
                  SizedBox(
                    height: 200,
                    child: PageView.builder(
                      itemCount: post.images.length,
                      itemBuilder: (context, imgIndex) {
                        return Padding(
                          padding: const EdgeInsets.only(right: 8.0),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: CachedNetworkImage(
                            imageUrl: post.images[imgIndex],
                            fit: BoxFit.cover,
                            placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                            errorWidget: (context, url, error) => Container(
                              color: Colors.grey[300],
                              child: const Icon(Icons.image),
                            ),
                          ),
                          ),
                        );
                      },
                    ),
                  ),
                const SizedBox(height: 12),
                // Post Actions
                Row(
                  children: [
                    IconButton(
                      icon: Icon(
                        post.isLiked ? Icons.favorite : Icons.favorite_border,
                        color: post.isLiked ? Colors.red : null,
                      ),
                      onPressed: () => _toggleLike(post.id),
                    ),
                    Text('${post.likes}'),
                    const SizedBox(width: 16),
                    IconButton(
                      icon: const Icon(Icons.comment_outlined),
                      onPressed: () {
                        // Show comments
                      },
                    ),
                    Text('${post.comments}'),
                    const SizedBox(width: 16),
                    IconButton(
                      icon: const Icon(Icons.share),
                      onPressed: () {
                        // Share post
                      },
                    ),
                    Text('${post.shares}'),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildEventsTab() {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      itemCount: _events.length,
      itemBuilder: (context, index) {
        var event = _events[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  event.title,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
                const SizedBox(height: 8),
                Text(event.description),
                const SizedBox(height: 12),
                Row(
                  children: [
                    const Icon(Icons.calendar_today, size: 16, color: Colors.grey),
                    const SizedBox(width: 8),
                    Text(_formatDate(event.date)),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.location_on, size: 16, color: Colors.grey),
                    const SizedBox(width: 8),
                    Text(event.location),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('${event.attendees} attending'),
                    ElevatedButton(
                      onPressed: () => _toggleAttendance(event.id),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: event.isAttending 
                          ? Colors.grey 
                          : Theme.of(context).primaryColor,
                      ),
                      child: Text(
                        event.isAttending ? 'Attending' : 'Attend',
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildMembersTab() {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      itemCount: _popularMembers.length,
      itemBuilder: (context, index) {
        var member = _popularMembers[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                CircleAvatar(
                  backgroundImage: CachedNetworkImageProvider(member.avatar),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        member.name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${member.followers} followers • ${member.posts} posts',
                        style: const TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                ElevatedButton(
                  onPressed: () => _toggleFollow(member.id),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: member.isFollowing 
                      ? Colors.grey 
                      : Theme.of(context).primaryColor,
                  ),
                  child: Text(
                    member.isFollowing ? 'Following' : 'Follow',
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  String _formatRelativeTime(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);
    
    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d ago';
    } else {
      return '${date.month}/${date.day}/${date.year}';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year} at ${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }
}

class CommunityPost {
  final int id;
  final String author;
  final String avatar;
  final String content;
  final DateTime timestamp;
  int likes;
  final int comments;
  final int shares;
  final List<String> images;
  bool isLiked;

  CommunityPost({
    required this.id,
    required this.author,
    required this.avatar,
    required this.content,
    required this.timestamp,
    required this.likes,
    required this.comments,
    required this.shares,
    required this.images,
    this.isLiked = false,
  });
}

class CommunityEvent {
  final int id;
  final String title;
  final String description;
  final DateTime date;
  final String location;
  int attendees;
  bool isAttending;

  CommunityEvent({
    required this.id,
    required this.title,
    required this.description,
    required this.date,
    required this.location,
    required this.attendees,
    required this.isAttending,
  });
}

class CommunityMember {
  final int id;
  final String name;
  final String avatar;
  int followers;
  final int posts;
  bool isFollowing;

  CommunityMember({
    required this.id,
    required this.name,
    required this.avatar,
    required this.followers,
    required this.posts,
    required this.isFollowing,
  });
}