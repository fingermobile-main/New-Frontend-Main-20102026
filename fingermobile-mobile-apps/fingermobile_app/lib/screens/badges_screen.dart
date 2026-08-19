import 'package:flutter/material.dart';
import '../services/api_service.dart';

class Badge {
  final int id;
  final String name;
  final String description;
  final String icon;
  final String category;
  final bool isUnlocked;
  final DateTime? unlockedAt;
  final Color color;

  Badge({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.category,
    required this.isUnlocked,
    this.unlockedAt,
    required this.color,
  });
}

class BadgesScreen extends StatefulWidget {
  @override
  _BadgesScreenState createState() => _BadgesScreenState();
}

class _BadgesScreenState extends State<BadgesScreen> {
  List<Badge> _badges = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadBadges();
  }

  Future<void> _loadBadges() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _badges = [
          Badge(
            id: 1,
            name: 'First Post',
            description: 'Made your first post on FingerMobile',
            icon: '📝',
            category: 'Content',
            isUnlocked: true,
            unlockedAt: DateTime.now().subtract(Duration(days: 30)),
            color: Colors.blue,
          ),
          Badge(
            id: 2,
            name: 'Social Butterfly',
            description: 'Connected with 10 other members',
            icon: '🦋',
            category: 'Social',
            isUnlocked: true,
            unlockedAt: DateTime.now().subtract(Duration(days: 25)),
            color: Colors.green,
          ),
          Badge(
            id: 3,
            name: 'Content Creator',
            description: 'Created 50 posts',
            icon: '📱',
            category: 'Content',
            isUnlocked: false,
            color: Colors.grey,
          ),
          Badge(
            id: 4,
            name: 'Influencer',
            description: 'Reached 1000 followers',
            icon: '👑',
            category: 'Social',
            isUnlocked: false,
            color: Colors.grey,
          ),
          Badge(
            id: 5,
            name: 'Comment King',
            description: 'Made 200 comments',
            icon: '💬',
            category: 'Engagement',
            isUnlocked: true,
            unlockedAt: DateTime.now().subtract(Duration(days: 20)),
            color: Colors.purple,
          ),
          Badge(
            id: 6,
            name: 'Trending Topic',
            description: 'Had a post go viral with 1000+ likes',
            icon: '🔥',
            category: 'Engagement',
            isUnlocked: false,
            color: Colors.grey,
          ),
          Badge(
            id: 7,
            name: 'Monetization Master',
            description: 'Earned your first FIC tokens',
            icon: '💰',
            category: 'Monetization',
            isUnlocked: false,
            color: Colors.grey,
          ),
          Badge(
            id: 8,
            name: 'Community Builder',
            description: 'Created a group with 50+ members',
            icon: '👥',
            category: 'Social',
            isUnlocked: false,
            color: Colors.grey,
          ),
          Badge(
            id: 9,
            name: 'Early Adopter',
            description: 'Joined FingerMobile in the first 1000 members',
            icon: '🚀',
            category: 'Milestone',
            isUnlocked: true,
            unlockedAt: DateTime.now().subtract(Duration(days: 45)),
            color: Colors.orange,
          ),
          Badge(
            id: 10,
            name: 'Challenge Champion',
            description: 'Completed 10 challenges',
            icon: '🏆',
            category: 'Achievement',
            isUnlocked: false,
            color: Colors.grey,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading badges: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading badges')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Badges'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Stats header
                Container(
                  padding: EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.blue[50],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildStatCard(
                        'Unlocked',
                        _badges.where((b) => b.isUnlocked).length.toString(),
                        Icons.verified,
                      ),
                      _buildStatCard(
                        'Total',
                        _badges.length.toString(),
                        Icons.star,
                      ),
                      _buildStatCard(
                        'Remaining',
                        _badges.where((b) => !b.isUnlocked).length.toString(),
                        Icons.lock,
                      ),
                    ],
                  ),
                ),
                
                // Category filter
                Container(
                  height: 50,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: [
                      _buildCategoryChip('All', Colors.blue),
                      _buildCategoryChip('Content', Colors.green),
                      _buildCategoryChip('Social', Colors.orange),
                      _buildCategoryChip('Engagement', Colors.purple),
                      _buildCategoryChip('Monetization', Colors.teal),
                      _buildCategoryChip('Milestone', Colors.red),
                      _buildCategoryChip('Achievement', Colors.amber),
                    ],
                  ),
                ),
                
                // Badges list
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadBadges,
                    child: GridView.builder(
                      padding: EdgeInsets.all(16),
                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                        childAspectRatio: 0.8,
                      ),
                      itemCount: _badges.length,
                      itemBuilder: (context, index) {
                        final badge = _badges[index];
                        return _buildBadgeCard(badge);
                      },
                    ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon) {
    return Expanded(
      child: Container(
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              spreadRadius: 1,
              blurRadius: 3,
              offset: Offset(0, 1),
            ),
          ],
        ),
        child: Column(
          children: [
            Icon(icon, color: Colors.blue),
            SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              title,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryChip(String label, Color color) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 4),
      child: FilterChip(
        label: Text(label),
        selected: false,
        onSelected: (selected) {},
        selectedColor: color.withOpacity(0.2),
        backgroundColor: Colors.grey[200],
        labelStyle: TextStyle(color: selected ? Colors.white : Colors.black),
      ),
    );
  }

  Widget _buildBadgeCard(Badge badge) {
    return Card(
      elevation: 3,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: badge.isUnlocked ? badge.color.withOpacity(0.2) : Colors.grey[200],
              shape: BoxShape.circle,
              border: Border.all(
                color: badge.isUnlocked ? badge.color : Colors.grey,
                width: 2,
              ),
            ),
            child: Center(
              child: Text(
                badge.icon,
                style: TextStyle(fontSize: 40),
              ),
            ),
          ),
          SizedBox(height: 12),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 8),
            child: Text(
              badge.name,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: badge.isUnlocked ? Colors.black : Colors.grey,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          if (badge.isUnlocked && badge.unlockedAt != null)
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              child: Text(
                'Unlocked ${_formatDate(badge.unlockedAt!)}',
                style: TextStyle(
                  fontSize: 10,
                  color: Colors.grey[600],
                ),
                textAlign: TextAlign.center,
              ),
            ),
        ],
      ),
    );
  }

  String _formatDate(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 0) {
      return '${difference.inDays} days ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours} hours ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes} minutes ago';
    } else {
      return 'Just now';
    }
  }
}