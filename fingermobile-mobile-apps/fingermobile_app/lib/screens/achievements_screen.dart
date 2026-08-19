import 'package:flutter/material.dart';
import '../services/api_service.dart';

class Achievement {
  final int id;
  final String title;
  final String description;
  final String icon;
  final String category;
  final bool isUnlocked;
  final DateTime? unlockedAt;
  final int points;

  Achievement({
    required this.id,
    required this.title,
    required this.description,
    required this.icon,
    required this.category,
    required this.isUnlocked,
    this.unlockedAt,
    required this.points,
  });
}

class AchievementsScreen extends StatefulWidget {
  @override
  _AchievementsScreenState createState() => _AchievementsScreenState();
}

class _AchievementsScreenState extends State<AchievementsScreen> {
  List<Achievement> _achievements = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadAchievements();
  }

  Future<void> _loadAchievements() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _achievements = [
          Achievement(
            id: 1,
            title: 'First Post',
            description: 'Made your first post on FingerMobile',
            icon: '📝',
            category: 'Content',
            isUnlocked: true,
            unlockedAt: DateTime.now().subtract(Duration(days: 30)),
            points: 10,
          ),
          Achievement(
            id: 2,
            title: 'Social Butterfly',
            description: 'Connected with 10 other members',
            icon: '🦋',
            category: 'Social',
            isUnlocked: true,
            unlockedAt: DateTime.now().subtract(Duration(days: 25)),
            points: 25,
          ),
          Achievement(
            id: 3,
            title: 'Content Creator',
            description: 'Created 50 posts',
            icon: '📱',
            category: 'Content',
            isUnlocked: false,
            points: 50,
          ),
          Achievement(
            id: 4,
            title: 'Influencer',
            description: 'Reached 1000 followers',
            icon: '👑',
            category: 'Social',
            isUnlocked: false,
            points: 100,
          ),
          Achievement(
            id: 5,
            title: 'Comment King',
            description: 'Made 200 comments',
            icon: '💬',
            category: 'Engagement',
            isUnlocked: true,
            unlockedAt: DateTime.now().subtract(Duration(days: 20)),
            points: 30,
          ),
          Achievement(
            id: 6,
            title: 'Trending Topic',
            description: 'Had a post go viral with 1000+ likes',
            icon: '🔥',
            category: 'Engagement',
            isUnlocked: false,
            points: 75,
          ),
          Achievement(
            id: 7,
            title: 'Monetization Master',
            description: 'Earned your first FIC tokens',
            icon: '💰',
            category: 'Monetization',
            isUnlocked: false,
            points: 40,
          ),
          Achievement(
            id: 8,
            title: 'Community Builder',
            description: 'Created a group with 50+ members',
            icon: '👥',
            category: 'Social',
            isUnlocked: false,
            points: 60,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading achievements: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading achievements')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Achievements'),
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
                        _achievements.where((a) => a.isUnlocked).length.toString(),
                        Icons.verified,
                      ),
                      _buildStatCard(
                        'Total Points',
                        _achievements.where((a) => a.isUnlocked).fold(0, (sum, a) => sum + a.points).toString(),
                        Icons.star,
                      ),
                      _buildStatCard(
                        'Remaining',
                        _achievements.where((a) => !a.isUnlocked).length.toString(),
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
                    ],
                  ),
                ),
                
                // Achievements list
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadAchievements,
                    child: ListView.builder(
                      itemCount: _achievements.length,
                      itemBuilder: (context, index) {
                        final achievement = _achievements[index];
                        return _buildAchievementItem(achievement);
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

  Widget _buildAchievementItem(Achievement achievement) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: achievement.isUnlocked ? Colors.blue[50] : Colors.grey[200],
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: achievement.isUnlocked ? Colors.blue : Colors.grey,
                  width: 1,
                ),
              ),
              child: Center(
                child: Text(
                  achievement.icon,
                  style: TextStyle(fontSize: 30),
                ),
              ),
            ),
            SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          achievement.title,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: achievement.isUnlocked ? Colors.black : Colors.grey,
                          ),
                        ),
                      ),
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: achievement.isUnlocked ? Colors.green : Colors.grey,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          achievement.isUnlocked ? 'UNLOCKED' : 'LOCKED',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 4),
                  Text(
                    achievement.description,
                    style: TextStyle(
                      color: achievement.isUnlocked ? Colors.grey[700] : Colors.grey[400],
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    '${achievement.points} points',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                  if (achievement.isUnlocked && achievement.unlockedAt != null)
                    Text(
                      'Unlocked ${_formatDate(achievement.unlockedAt!)}',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
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