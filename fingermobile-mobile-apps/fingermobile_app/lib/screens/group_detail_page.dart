import 'package:flutter/material.dart';

class GroupDetailPage extends StatefulWidget {
  const GroupDetailPage({super.key});

  @override
  State<GroupDetailPage> createState() => _GroupDetailPageState();
}

class _GroupDetailPageState extends State<GroupDetailPage> {
  bool _isLoading = false;
  String? _errorMessage;
  GroupDetails? _groupDetails;
  List<GroupPost> _posts = [];
  List<GroupMember> _members = [];
  bool _isMember = false;
  bool _isAdmin = false;
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadGroupData();
  }

  Future<void> _loadGroupData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock group data
      setState(() {
        _groupDetails = GroupDetails(
          id: 1,
          name: 'Tech Enthusiasts',
          description: 'A group for people passionate about technology and innovation',
          memberCount: 1250,
          createdAt: DateTime.now().subtract(const Duration(days: 365)),
          privacy: GroupPrivacy.public,
          coverImageUrl: 'https://via.placeholder.com/600x200/4ECDC4/FFFFFF?text=Tech+Group',
          avatarUrl: 'https://via.placeholder.com/100/4ECDC4/FFFFFF?text=TE',
        );

        _posts = [
          GroupPost(
            id: 1,
            author: GroupMember(
              id: 1,
              name: 'Alex Johnson',
              avatarUrl: 'https://via.placeholder.com/50/FF6B6B/FFFFFF?text=AJ',
            ),
            content: 'Just launched our new mobile app! Check it out and let us know what you think.',
            timestamp: DateTime.now().subtract(const Duration(hours: 2)),
            likes: 24,
            comments: 8,
            mediaUrl: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=App+Screenshot',
            mediaType: MediaType.image,
          ),
          GroupPost(
            id: 2,
            author: GroupMember(
              id: 2,
              name: 'Sarah Williams',
              avatarUrl: 'https://via.placeholder.com/50/6A0572/FFFFFF?text=SW',
            ),
            content: 'What do you think will be the biggest tech trend next year?',
            timestamp: DateTime.now().subtract(const Duration(hours: 5)),
            likes: 42,
            comments: 15,
            mediaUrl: null,
            mediaType: MediaType.none,
          ),
        ];

        _members = [
          GroupMember(
            id: 1,
            name: 'Alex Johnson',
            avatarUrl: 'https://via.placeholder.com/50/FF6B6B/FFFFFF?text=AJ',
          ),
          GroupMember(
            id: 2,
            name: 'Sarah Williams',
            avatarUrl: 'https://via.placeholder.com/50/6A0572/FFFFFF?text=SW',
          ),
          GroupMember(
            id: 3,
            name: 'Mike Chen',
            avatarUrl: 'https://via.placeholder.com/50/118AB2/FFFFFF?text=MC',
          ),
          GroupMember(
            id: 4,
            name: 'Emma Rodriguez',
            avatarUrl: 'https://via.placeholder.com/50/FFD166/000000?text=ER',
          ),
        ];

        _isMember = true;
        _isAdmin = true;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load group details. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _joinGroup() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      setState(() {
        _isMember = true;
        _groupDetails!.memberCount++;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('You have joined the group!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to join group. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _leaveGroup() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      setState(() {
        _isMember = false;
        _groupDetails!.memberCount--;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('You have left the group.'),
            backgroundColor: Colors.orange,
          ),
        );
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to leave group. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _createPost() {
    // Navigate to create post screen
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Create post functionality would open here'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_groupDetails?.name ?? 'Group Details'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          if (_isAdmin)
            IconButton(
              icon: const Icon(Icons.settings),
              onPressed: () {
                // Open group settings
              },
            ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadGroupData,
        child: _isLoading && _groupDetails == null
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _groupDetails == null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadGroupData,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Group Cover Image
                        if (_groupDetails != null)
                          Stack(
                            children: [
                              Container(
                                height: 200,
                                decoration: BoxDecoration(
                                  image: DecorationImage(
                                    image: NetworkImage(_groupDetails!.coverImageUrl),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                              Positioned(
                                bottom: 16,
                                left: 16,
                                child: Row(
                                  children: [
                                    CircleAvatar(
                                      radius: 30,
                                      backgroundImage: NetworkImage(_groupDetails!.avatarUrl),
                                    ),
                                    const SizedBox(width: 16),
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          _groupDetails!.name,
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 24,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          '${_groupDetails!.memberCount} members',
                                          style: const TextStyle(
                                            color: Colors.white70,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        // Group Description and Actions
                        if (_groupDetails != null)
                          Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(_groupDetails!.description),
                                const SizedBox(height: 16),
                                Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 12,
                                        vertical: 6,
                                      ),
                                      decoration: BoxDecoration(
                                        color: _getPrivacyColor(_groupDetails!.privacy),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Text(
                                        _getPrivacyText(_groupDetails!.privacy),
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 12,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    Text(
                                      'Created ${_formatDate(_groupDetails!.createdAt)}',
                                      style: const TextStyle(
                                        color: Colors.grey,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                Row(
                                  children: [
                                    if (_isMember)
                                      Expanded(
                                        child: OutlinedButton(
                                          onPressed: _leaveGroup,
                                          child: const Text('Leave Group'),
                                        ),
                                      )
                                    else
                                      Expanded(
                                        child: ElevatedButton(
                                          onPressed: _joinGroup,
                                          child: const Text('Join Group'),
                                        ),
                                      ),
                                    const SizedBox(width: 16),
                                    if (_isMember)
                                      Expanded(
                                        child: ElevatedButton(
                                          onPressed: _createPost,
                                          child: const Text('Create Post'),
                                        ),
                                      ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        // Tab Bar
                        Container(
                          height: 50,
                          decoration: BoxDecoration(
                            color: Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(25),
                          ),
                          margin: const EdgeInsets.symmetric(horizontal: 16),
                          child: Row(
                            children: [
                              _buildTab('Posts', 0),
                              _buildTab('Members', 1),
                              _buildTab('Media', 2),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                        // Tab Content
                        if (_activeTab == 0) ...[
                          // Posts
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _posts.length,
                            itemBuilder: (context, index) {
                              var post = _posts[index];
                              return Card(
                                margin: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                  vertical: 8,
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        children: [
                                          CircleAvatar(
                                            backgroundImage: NetworkImage(post.author.avatarUrl),
                                          ),
                                          const SizedBox(width: 16),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  post.author.name,
                                                  style: const TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                                const SizedBox(height: 4),
                                                Text(
                                                  _formatTime(post.timestamp),
                                                  style: const TextStyle(
                                                    color: Colors.grey,
                                                    fontSize: 12,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 16),
                                      Text(post.content),
                                      if (post.mediaUrl != null) ...[
                                        const SizedBox(height: 16),
                                        Container(
                                          height: 200,
                                          decoration: BoxDecoration(
                                            image: DecorationImage(
                                              image: NetworkImage(post.mediaUrl!),
                                              fit: BoxFit.cover,
                                            ),
                                            borderRadius: BorderRadius.circular(8),
                                          ),
                                        ),
                                      ],
                                      const SizedBox(height: 16),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Row(
                                            children: [
                                              Icon(
                                                Icons.thumb_up,
                                                size: 16,
                                                color: Colors.grey,
                                              ),
                                              const SizedBox(width: 4),
                                              Text('${post.likes}'),
                                            ],
                                          ),
                                          Row(
                                            children: [
                                              Icon(
                                                Icons.comment,
                                                size: 16,
                                                color: Colors.grey,
                                              ),
                                              const SizedBox(width: 4),
                                              Text('${post.comments}'),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ] else if (_activeTab == 1) ...[
                          // Members
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: Text(
                              '${_groupDetails?.memberCount ?? 0} Members',
                              style: const TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _members.length,
                            itemBuilder: (context, index) {
                              var member = _members[index];
                              return ListTile(
                                leading: CircleAvatar(
                                  backgroundImage: NetworkImage(member.avatarUrl),
                                ),
                                title: Text(member.name),
                                trailing: _isAdmin
                                    ? IconButton(
                                        icon: const Icon(Icons.more_vert),
                                        onPressed: () {
                                          // Show member options
                                        },
                                      )
                                    : null,
                              );
                            },
                          ),
                        ] else ...[
                          // Media
                          Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: GridView.builder(
                              gridDelegate:
                                  const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 3,
                                crossAxisSpacing: 8,
                                mainAxisSpacing: 8,
                              ),
                              itemCount: 12, // Sample media count
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemBuilder: (context, index) {
                                return Container(
                                  decoration: BoxDecoration(
                                    image: const DecorationImage(
                                      image: NetworkImage(
                                          'https://via.placeholder.com/150/4ECDC4/FFFFFF'),
                                      fit: BoxFit.cover,
                                    ),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                );
                              },
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
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
          decoration: BoxDecoration(
            color: isActive ? Theme.of(context).primaryColor : Colors.transparent,
            borderRadius: BorderRadius.circular(25),
          ),
          child: Center(
            child: Text(
              title,
              style: TextStyle(
                fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                color: isActive ? Colors.white : Colors.grey,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Color _getPrivacyColor(GroupPrivacy privacy) {
    switch (privacy) {
      case GroupPrivacy.public:
        return Colors.green;
      case GroupPrivacy.private:
        return Colors.red;
      case GroupPrivacy.secret:
        return Colors.grey;
    }
  }

  String _getPrivacyText(GroupPrivacy privacy) {
    switch (privacy) {
      case GroupPrivacy.public:
        return 'PUBLIC';
      case GroupPrivacy.private:
        return 'PRIVATE';
      case GroupPrivacy.secret:
        return 'SECRET';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }

  String _formatTime(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else {
      return '${date.month}/${date.day}/${date.year}';
    }
  }
}

enum GroupPrivacy { public, private, secret }
enum MediaType { none, image, video }

class GroupDetails {
  final int id;
  final String name;
  final String description;
  final int memberCount;
  final DateTime createdAt;
  final GroupPrivacy privacy;
  final String coverImageUrl;
  final String avatarUrl;

  GroupDetails({
    required this.id,
    required this.name,
    required this.description,
    required this.memberCount,
    required this.createdAt,
    required this.privacy,
    required this.coverImageUrl,
    required this.avatarUrl,
  });
}

class GroupPost {
  final int id;
  final GroupMember author;
  final String content;
  final DateTime timestamp;
  final int likes;
  final int comments;
  final String? mediaUrl;
  final MediaType mediaType;

  GroupPost({
    required this.id,
    required this.author,
    required this.content,
    required this.timestamp,
    required this.likes,
    required this.comments,
    this.mediaUrl,
    required this.mediaType,
  });
}

class GroupMember {
  final int id;
  final String name;
  final String avatarUrl;

  GroupMember({
    required this.id,
    required this.name,
    required this.avatarUrl,
  });
}