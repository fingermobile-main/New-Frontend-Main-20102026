import 'package:flutter/material.dart';

class LushPressiesPage extends StatefulWidget {
  const LushPressiesPage({super.key});

  @override
  State<LushPressiesPage> createState() => _LushPressiesPageState();
}

class _LushPressiesPageState extends State<LushPressiesPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<DatingProfile> _profiles = [];
  List<DatingMatch> _matches = [];
  int _activeTab = 0;
  String _selectedFilter = 'all';

  @override
  void initState() {
    super.initState();
    _loadDatingData();
  }

  Future<void> _loadDatingData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock dating data
      setState(() {
        _profiles = [
          DatingProfile(
            id: 1,
            name: 'Emma Johnson',
            age: 28,
            location: 'New York, NY',
            distance: 2.5,
            profession: 'Marketing Director',
            interests: ['Travel', 'Photography', 'Wine Tasting'],
            imageUrl: 'https://via.placeholder.com/300x400/FFC0CB/FFFFFF?text=Emma',
            compatibilityScore: 92,
            isNew: true,
            isVerified: true,
          ),
          DatingProfile(
            id: 2,
            name: 'Alex Williams',
            age: 31,
            location: 'Brooklyn, NY',
            distance: 4.8,
            profession: 'Software Engineer',
            interests: ['Hiking', 'Cooking', 'Board Games'],
            imageUrl: 'https://via.placeholder.com/300x400/6495ED/FFFFFF?text=Alex',
            compatibilityScore: 85,
            isNew: false,
            isVerified: true,
          ),
          DatingProfile(
            id: 3,
            name: 'Sophia Martinez',
            age: 26,
            location: 'Manhattan, NY',
            distance: 1.2,
            profession: 'Fashion Designer',
            interests: ['Fashion', 'Art', 'Coffee Shops'],
            imageUrl: 'https://via.placeholder.com/300x400/98FB98/FFFFFF?text=Sophia',
            compatibilityScore: 78,
            isNew: false,
            isVerified: false,
          ),
        ];

        _matches = [
          DatingMatch(
            id: 1,
            name: 'Daniel Smith',
            age: 33,
            imageUrl: 'https://via.placeholder.com/150/4682B4/FFFFFF?text=Daniel',
            lastMessage: 'Hey, I love your profile!',
            lastMessageTime: DateTime.now().subtract(const Duration(hours: 2)),
            unreadCount: 1,
            isOnline: true,
          ),
          DatingMatch(
            id: 2,
            name: 'Olivia Brown',
            age: 29,
            imageUrl: 'https://via.placeholder.com/150/FFA500/FFFFFF?text=Olivia',
            lastMessage: 'Would you like to meet for coffee?',
            lastMessageTime: DateTime.now().subtract(const Duration(days: 1)),
            unreadCount: 0,
            isOnline: false,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load dating profiles. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _selectFilter(String filter) {
    setState(() {
      _selectedFilter = filter;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('LushPressies'),
        backgroundColor: const Color(0xFFE53935), // Tinder red color
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.message),
            onPressed: () {
              // Navigate to matches
              Navigator.pushNamed(context, '/lushpressies/matches');
            },
          ),
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              // Show notifications
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadDatingData,
        child: _isLoading && _profiles.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _profiles.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadDatingData,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : Column(
                    children: [
                      // Filter Bar
                      Container(
                        height: 50,
                        color: Colors.white,
                        child: Row(
                          children: [
                            _buildFilter('All', 'all'),
                            _buildFilter('New', 'new'),
                            _buildFilter('Verified', 'verified'),
                            _buildFilter('My Matches', 'matches'),
                          ],
                        ),
                      ),
                      const SizedBox(height: 8),
                      // Content
                      Expanded(
                        child: _selectedFilter == 'matches'
                            ? _buildMatchesView()
                            : _buildDiscoveryView(),
                      ),
                    ],
                  ),
      ),
      bottomNavigationBar: BottomAppBar(
        color: Colors.white,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            IconButton(
              icon: const Icon(Icons.home),
              color: Colors.red,
              onPressed: () {
                // Home
                setState(() {
                  _activeTab = 0;
                });
              },
            ),
            IconButton(
              icon: const Icon(Icons.favorite),
              onPressed: () {
                // Likes
                setState(() {
                  _activeTab = 1;
                });
              },
            ),
            IconButton(
              icon: const Icon(Icons.message),
              onPressed: () {
                // Messages
                setState(() {
                  _activeTab = 2;
                });
              },
            ),
            IconButton(
              icon: const Icon(Icons.person),
              onPressed: () {
                // Profile
                setState(() {
                  _activeTab = 3;
                });
              },
            ),
          ],
        ),
      ),
      floatingActionButton: _selectedFilter != 'matches'
          ? FloatingActionButton(
              backgroundColor: const Color(0xFFE53935),
              child: const Icon(Icons.flash_on),
              onPressed: () {
                // Super like
              })
          : null,
    );
  }

  Widget _buildFilter(String label, String filterId) {
    bool isActive = _selectedFilter == filterId;
    return Expanded(
      child: GestureDetector(
        onTap: () => _selectFilter(filterId),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12.0),
          child: Column(
            children: [
              Text(
                label,
                style: TextStyle(
                  color: isActive ? const Color(0xFFE53935) : Colors.grey,
                  fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                ),
              ),
              const SizedBox(height: 4),
              if (isActive)
                Container(
                  height: 2,
                  width: 30,
                  color: const Color(0xFFE53935),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDiscoveryView() {
    return RefreshIndicator(
      onRefresh: _loadDatingData,
      child: ListView.builder(
        itemCount: _profiles.length,
        itemBuilder: (context, index) {
          var profile = _profiles[index];
          return Card(
            margin: const EdgeInsets.all(8.0),
            elevation: 2,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Profile Image
                Container(
                  height: MediaQuery.of(context).size.height * 0.5,
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: NetworkImage(profile.imageUrl),
                      fit: BoxFit.cover,
                    ),
                  ),
                  // Match score overlay
                  if (profile.compatibilityScore > 0)
                    Positioned(
                      top: 16,
                      right: 16,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.green.shade500,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '${profile.compatibilityScore}% Match',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  // New profile badge
                  if (profile.isNew)
                    Positioned(
                      bottom: 16,
                      right: 16,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.blue.shade500,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Text(
                          'New',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                ),
                // Profile Info
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '$profile.name, $profile.age',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 20,
                            ),
                          ),
                          if (profile.isVerified)
                            const Icon(
                              Icons.verified,
                              color: Colors.blue,
                            ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(
                            Icons.location_on,
                            size: 16,
                            color: Colors.grey,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '$profile.location ($profile.distance mi away)',
                            style: const TextStyle(
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          const Icon(
                            Icons.work,
                            size: 16,
                            color: Colors.grey,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            profile.profession,
                            style: const TextStyle(
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // Interests
                      Wrap(
                        spacing: 8,
                        children: profile.interests
                            .map((interest) => Chip(
                                label: Text(interest),
                                backgroundColor: Colors.grey.shade200))
                            .toList(),
                      ),
                      const SizedBox(height: 16),
                      // Action Buttons
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildProfileActionButton(
                            Icons.close,
                            Colors.grey,
                            'Pass',
                          ),
                          _buildProfileActionButton(
                            Icons.favorite,
                            Colors.red,
                            'Like',
                          ),
                          _buildProfileActionButton(
                            Icons.star,
                            Colors.blue,
                            'Super Like',
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildProfileActionButton(
      IconData icon, Color color, String label) {
    return Expanded(
      child: ElevatedButton.icon(
        style: ElevatedButton.styleFrom(
          backgroundColor: color.withOpacity(0.1),
          foregroundColor: color,
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
        onPressed: () {
          // Handle action
        },
        icon: Icon(icon),
        label: Text(label),
      ),
    );
  }

  Widget _buildMatchesView() {
    return ListView.builder(
      itemCount: _matches.length,
      itemBuilder: (context, index) {
        var match = _matches[index];
        return Card(
          margin: const EdgeInsets.all(8.0),
          child: ListTile(
            leading: CircleAvatar(
              radius: 30,
              backgroundImage: NetworkImage(match.imageUrl),
            ),
            title: Text('$match.name, $match.age'),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 4),
                Text(
                  match.lastMessage,
                  style: const TextStyle(
                    fontWeight: FontWeight.normal,
                  ),
                ),
              ],
            ),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                if (match.unreadCount > 0)
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE53935),
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      '${match.unreadCount}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                      ),
                    ),
                  ),
                const SizedBox(height: 4),
                Text(
                  _formatTime(match.lastMessageTime),
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
            onTap: () {
              // View match details
            },
          ),
        );
      },
    );
  }

  String _formatTime(DateTime time) {
    final now = DateTime.now();
    final difference = now.difference(time);

    if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else {
      return '${difference.inDays}d ago';
    }
  }
}

class DatingProfile {
  final int id;
  final String name;
  final int age;
  final String location;
  final double distance;
  final String profession;
  final List<String> interests;
  final String imageUrl;
  final int compatibilityScore;
  final bool isNew;
  final bool isVerified;

  DatingProfile({
    required this.id,
    required this.name,
    required this.age,
    required this.location,
    required this.distance,
    required this.profession,
    required this.interests,
    required this.imageUrl,
    required this.compatibilityScore,
    required this.isNew,
    required this.isVerified,
  });
}

class DatingMatch {
  final int id;
  final String name;
  final int age;
  final String imageUrl;
  final String lastMessage;
  final DateTime lastMessageTime;
  final int unreadCount;
  final bool isOnline;

  DatingMatch({
    required this.id,
    required this.name,
    required this.age,
    required this.imageUrl,
    required this.lastMessage,
    required this.lastMessageTime,
    required this.unreadCount,
    required this.isOnline,
  });
}