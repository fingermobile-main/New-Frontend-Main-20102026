import 'package:flutter/material.dart';

class Group {
  final int id;
  final String name;
  final String description;
  final String? coverImageUrl;
  final int memberCount;
  final String privacyLevel;
  final DateTime createdAt;

  Group({
    required this.id,
    required this.name,
    required this.description,
    this.coverImageUrl,
    required this.memberCount,
    required this.privacyLevel,
    required this.createdAt,
  });

  factory Group.fromJson(Map<String, dynamic> json) {
    return Group(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      description: json['description'] ?? '',
      coverImageUrl: json['cover_image_url'] ?? json['coverImageUrl'],
      memberCount: json['member_count'] ?? json['memberCount'] ?? 0,
      privacyLevel: json['privacy_level'] ?? json['privacyLevel'] ?? 'public',
      createdAt: DateTime.tryParse(json['created_at'] ?? json['createdAt'] ?? '') ?? DateTime.now(),
    );
  }
}

class GroupsScreen extends StatefulWidget {
  @override
  _GroupsScreenState createState() => _GroupsScreenState();
}

class _GroupsScreenState extends State<GroupsScreen> {
  List<Group> _groups = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadGroups();
  }

  Future<void> _loadGroups() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _groups = [
          Group(
            id: 1,
            name: 'Flutter Developers',
            description: 'A community for Flutter developers to share knowledge and resources',
            coverImageUrl: 'https://via.placeholder.com/600x200',
            memberCount: 1245,
            privacyLevel: 'public',
            createdAt: DateTime.now().subtract(Duration(days: 45)),
          ),
          Group(
            id: 2,
            name: 'Mobile App Designers',
            description: 'For UI/UX designers focused on mobile applications',
            coverImageUrl: 'https://via.placeholder.com/600x200',
            memberCount: 876,
            privacyLevel: 'public',
            createdAt: DateTime.now().subtract(Duration(days: 23)),
          ),
          Group(
            id: 3,
            name: 'FingerMobile Beta Testers',
            description: 'Exclusive group for testing new features',
            coverImageUrl: 'https://via.placeholder.com/600x200',
            memberCount: 234,
            privacyLevel: 'private',
            createdAt: DateTime.now().subtract(Duration(days: 12)),
          ),
          Group(
            id: 4,
            name: 'Entrepreneurs Network',
            description: 'Connecting entrepreneurs and startup founders',
            coverImageUrl: 'https://via.placeholder.com/600x200',
            memberCount: 3421,
            privacyLevel: 'public',
            createdAt: DateTime.now().subtract(Duration(days: 120)),
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading groups: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading groups')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Groups'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () {
              // Search for groups
            },
          ),
          IconButton(
            icon: Icon(Icons.add),
            onPressed: () {
              // Create new group
              _createNewGroup();
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _groups.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.groups,
                        size: 80,
                        color: Colors.grey[400],
                      ),
                      SizedBox(height: 16),
                      Text(
                        'No groups yet',
                        style: TextStyle(
                          fontSize: 20,
                          color: Colors.grey[600],
                        ),
                      ),
                      SizedBox(height: 8),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          'Join or create groups to connect with like-minded people',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: Colors.grey[500],
                          ),
                        ),
                      ),
                      SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _createNewGroup,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          foregroundColor: Colors.white,
                        ),
                        child: Text('Create New Group'),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadGroups,
                  child: ListView.builder(
                    itemCount: _groups.length,
                    itemBuilder: (context, index) {
                      final group = _groups[index];
                      return _buildGroupItem(group);
                    },
                  ),
                ),
    );
  }

  Widget _buildGroupItem(Group group) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Group cover image
          if (group.coverImageUrl != null)
            Container(
              height: 120,
              width: double.infinity,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(group.coverImageUrl!),
                  fit: BoxFit.cover,
                ),
              ),
            )
          else
            Container(
              height: 120,
              width: double.infinity,
              color: Colors.grey[300],
              child: Icon(
                Icons.groups,
                size: 60,
                color: Colors.grey[600],
              ),
            ),
          
          // Group info
          Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        group.name,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: group.privacyLevel == 'public' 
                            ? Colors.green[100] 
                            : group.privacyLevel == 'private' 
                                ? Colors.orange[100] 
                                : Colors.blue[100],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        group.privacyLevel.toUpperCase(),
                        style: TextStyle(
                          fontSize: 12,
                          color: group.privacyLevel == 'public' 
                              ? Colors.green[800] 
                              : group.privacyLevel == 'private' 
                                  ? Colors.orange[800] 
                                  : Colors.blue[800],
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 8),
                Text(
                  group.description,
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 14,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 12),
                Row(
                  children: [
                    Icon(
                      Icons.people,
                      size: 16,
                      color: Colors.grey[600],
                    ),
                    SizedBox(width: 4),
                    Text(
                      '${group.memberCount} members',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                    SizedBox(width: 16),
                    Icon(
                      Icons.event,
                      size: 16,
                      color: Colors.grey[600],
                    ),
                    SizedBox(width: 4),
                    Text(
                      'Created ${_formatDate(group.createdAt)}',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          // Join group
                          _joinGroup(group);
                        },
                        child: Text('Join Group'),
                      ),
                    ),
                    SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          // Navigate to group
                          _openGroup(group);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                        ),
                        child: Text('View Group'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 365) {
      return '${(difference.inDays / 365).floor()}y ago';
    } else if (difference.inDays > 30) {
      return '${(difference.inDays / 30).floor()}mo ago';
    } else if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }

  void _createNewGroup() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        final nameController = TextEditingController();
        final descriptionController = TextEditingController();
        String privacyLevel = 'public';

        return AlertDialog(
          title: Text('Create New Group'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: InputDecoration(
                  labelText: 'Group Name',
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 16),
              TextField(
                controller: descriptionController,
                maxLines: 3,
                decoration: InputDecoration(
                  labelText: 'Description',
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: privacyLevel,
                decoration: InputDecoration(
                  labelText: 'Privacy Level',
                  border: OutlineInputBorder(),
                ),
                items: ['public', 'private', 'secret'].map((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value.toUpperCase()),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  if (newValue != null) {
                    privacyLevel = newValue;
                  }
                },
              ),
            ],
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
                // In a real app, this would create the group via API
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Group would be created'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: Text('Create'),
            ),
          ],
        );
      },
    );
  }

  void _joinGroup(Group group) {
    // In a real app, this would join the group via API
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Joined ${group.name}'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _openGroup(Group group) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => GroupDetailScreen(group: group),
      ),
    );
  }
}

class GroupDetailScreen extends StatelessWidget {
  final Group group;

  const GroupDetailScreen({required this.group});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(group.name),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Group cover
            if (group.coverImageUrl != null)
              Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: NetworkImage(group.coverImageUrl!),
                    fit: BoxFit.cover,
                  ),
                ),
              )
            else
              Container(
                height: 200,
                width: double.infinity,
                color: Colors.grey[300],
                child: Icon(
                  Icons.groups,
                  size: 80,
                  color: Colors.grey[600],
                ),
              ),
            
            Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          group.name,
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: group.privacyLevel == 'public' 
                              ? Colors.green[100] 
                              : group.privacyLevel == 'private' 
                                  ? Colors.orange[100] 
                                  : Colors.blue[100],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          group.privacyLevel.toUpperCase(),
                          style: TextStyle(
                            fontSize: 12,
                            color: group.privacyLevel == 'public' 
                                ? Colors.green[800] 
                                : group.privacyLevel == 'private' 
                                    ? Colors.orange[800] 
                                    : Colors.blue[800],
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  Text(
                    '${group.memberCount} members',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 16,
                    ),
                  ),
                  SizedBox(height: 16),
                  Text(
                    group.description,
                    style: TextStyle(
                      fontSize: 16,
                    ),
                  ),
                  SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {},
                          child: Text('Leave Group'),
                        ),
                      ),
                      SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                          ),
                          child: Text('Post in Group'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}