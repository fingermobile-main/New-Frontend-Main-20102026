import 'package:flutter/material.dart';

class GamingAchievementsScreen extends StatefulWidget {
  @override
  _GamingAchievementsScreenState createState() => _GamingAchievementsScreenState();
}

class _GamingAchievementsScreenState extends State<GamingAchievementsScreen> {
  List<Game> _games = [];
  List<Achievement> _achievements = [];
  List<GamificationBadge> _badges = [];
  bool _isLoading = true;
  int _selectedTab = 0; // 0: Games, 1: Achievements, 2: Badges

  @override
  void initState() {
    super.initState();
    _loadGamingData();
  }

  Future<void> _loadGamingData() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _games = [
          Game(
            id: 1,
            name: 'Word Master',
            description: 'Test your vocabulary with daily challenges',
            category: 'Puzzle',
            level: 24,
            xp: 12500,
            totalXp: 15000,
            lastPlayed: DateTime.now().subtract(Duration(hours: 2)),
            isFavorite: true,
            icon: Icons.text_fields,
            color: Colors.blue,
          ),
          Game(
            id: 2,
            name: 'Trivia Challenge',
            description: 'Answer questions from various categories',
            category: 'Knowledge',
            level: 18,
            xp: 8750,
            totalXp: 10000,
            lastPlayed: DateTime.now().subtract(Duration(hours: 5)),
            isFavorite: false,
            icon: Icons.quiz,
            color: Colors.green,
          ),
          Game(
            id: 3,
            name: 'Memory Match',
            description: 'Test your memory with card matching',
            category: 'Brain',
            level: 32,
            xp: 18000,
            totalXp: 20000,
            lastPlayed: DateTime.now().subtract(Duration(days: 1)),
            isFavorite: true,
            icon: Icons.memory,
            color: Colors.orange,
          ),
        ];
        
        _achievements = [
          Achievement(
            id: 1,
            title: 'First Win',
            description: 'Win your first game',
            points: 100,
            unlocked: true,
            unlockDate: DateTime.now().subtract(Duration(days: 30)),
            icon: Icons.flag,
            color: Colors.blue,
          ),
          Achievement(
            id: 2,
            title: 'Win Streak',
            description: 'Win 5 games in a row',
            points: 250,
            unlocked: true,
            unlockDate: DateTime.now().subtract(Duration(days: 20)),
            icon: Icons.stars,
            color: Colors.green,
          ),
          Achievement(
            id: 3,
            title: 'Challenger',
            description: 'Complete 50 challenges',
            points: 500,
            unlocked: true,
            unlockDate: DateTime.now().subtract(Duration(days: 15)),
            icon: Icons.emoji_events,
            color: Colors.orange,
          ),
          Achievement(
            id: 4,
            title: 'Master Player',
            description: 'Reach level 20 in any game',
            points: 300,
            unlocked: false,
            unlockDate: null,
            icon: Icons.crown,
            color: Colors.purple,
          ),
          Achievement(
            id: 5,
            title: 'Quiz Master',
            description: 'Answer 100 questions correctly',
            points: 400,
            unlocked: false,
            unlockDate: null,
            icon: Icons.school,
            color: Colors.red,
          ),
        ];
        
        _badges = [
          GamificationBadge(
            id: 1,
            name: 'Gamer',
            description: 'Played 10 games',
            icon: Icons.gamepad,
            color: Colors.blue,
            earned: true,
            earnedDate: DateTime.now().subtract(Duration(days: 25)),
          ),
          GamificationBadge(
            id: 2,
            name: 'Achiever',
            description: 'Unlocked 5 achievements',
            icon: Icons.verified,
            color: Colors.green,
            earned: true,
            earnedDate: DateTime.now().subtract(Duration(days: 18)),
          ),
          GamificationBadge(
            id: 3,
            name: 'Competitor',
            description: 'Participated in 5 tournaments',
            icon: Icons.sports_esports,
            color: Colors.orange,
            earned: true,
            earnedDate: DateTime.now().subtract(Duration(days: 12)),
          ),
          GamificationBadge(
            id: 4,
            name: 'Master',
            description: 'Reached level 50',
            icon: Icons.star,
            color: Colors.purple,
            earned: false,
            earnedDate: null,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading gaming data: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading gaming data')),
      );
    }
  }

  void _toggleFavorite(Game game) {
    setState(() {
      final index = _games.indexWhere((g) => g.id == game.id);
      if (index != -1) {
        _games[index] = Game(
          id: _games[index].id,
          name: _games[index].name,
          description: _games[index].description,
          category: _games[index].category,
          level: _games[index].level,
          xp: _games[index].xp,
          totalXp: _games[index].totalXp,
          lastPlayed: _games[index].lastPlayed,
          isFavorite: !_games[index].isFavorite,
          icon: _games[index].icon,
          color: _games[index].color,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Gaming'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.leaderboard),
            onPressed: () {
              // Navigate to leaderboards
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Stats Summary
                Container(
                  padding: EdgeInsets.all(16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildStatCard('Games', _games.length.toString(), Icons.games),
                      _buildStatCard('Achievements', _achievements.where((a) => a.unlocked).length.toString(), Icons.emoji_events),
                      _buildStatCard('XP Earned', '39,250', Icons.stars),
                    ],
                  ),
                ),
                
                // Tab Selector
                Container(
                  height: 50,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: [
                      _buildTab('Games', 0),
                      _buildTab('Achievements', 1),
                      _buildTab('Badges', 2),
                    ],
                  ),
                ),
                
                // Content based on selected tab
                Expanded(
                  child: _selectedTab == 0
                      ? _buildGamesList()
                      : _selectedTab == 1
                          ? _buildAchievementsList()
                          : _buildBadgesList(),
                ),
              ],
            ),
    );
  }

  Widget _buildTab(String title, int index) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 4),
      child: GestureDetector(
        onTap: () {
          setState(() {
            _selectedTab = index;
          });
        },
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: _selectedTab == index ? Colors.blue : Colors.grey[200],
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            title,
            style: TextStyle(
              color: _selectedTab == index ? Colors.white : Colors.grey[700],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildGamesList() {
    return RefreshIndicator(
      onRefresh: _loadGamingData,
      child: _games.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.games,
                    size: 80,
                    color: Colors.grey[400],
                  ),
                  SizedBox(height: 16),
                  Text(
                    'No games available',
                    style: TextStyle(
                      fontSize: 20,
                      color: Colors.grey[600],
                    ),
                  ),
                  SizedBox(height: 8),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 32),
                    child: Text(
                      'Check back later for new games to play',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.grey[500],
                      ),
                    ),
                  ),
                ],
              ),
            )
          : ListView.builder(
              itemCount: _games.length,
              itemBuilder: (context, index) {
                final game = _games[index];
                return _buildGameItem(game);
              },
            ),
    );
  }

  Widget _buildAchievementsList() {
    return RefreshIndicator(
      onRefresh: _loadGamingData,
      child: _achievements.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.emoji_events,
                    size: 80,
                    color: Colors.grey[400],
                  ),
                  SizedBox(height: 16),
                  Text(
                    'No achievements',
                    style: TextStyle(
                      fontSize: 20,
                      color: Colors.grey[600],
                    ),
                  ),
                  SizedBox(height: 8),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 32),
                    child: Text(
                      'Complete challenges to earn achievements',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.grey[500],
                      ),
                    ),
                  ),
                ],
              ),
            )
          : ListView.builder(
              itemCount: _achievements.length,
              itemBuilder: (context, index) {
                final achievement = _achievements[index];
                return _buildAchievementItem(achievement);
              },
            ),
    );
  }

  Widget _buildBadgesList() {
    return RefreshIndicator(
      onRefresh: _loadGamingData,
      child: _badges.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.verified,
                    size: 80,
                    color: Colors.grey[400],
                  ),
                  SizedBox(height: 16),
                  Text(
                    'No badges earned',
                    style: TextStyle(
                      fontSize: 20,
                      color: Colors.grey[600],
                    ),
                  ),
                  SizedBox(height: 8),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 32),
                    child: Text(
                      'Earn badges by completing milestones',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.grey[500],
                      ),
                    ),
                  ),
                ],
              ),
            )
          : ListView.builder(
              itemCount: _badges.length,
              itemBuilder: (context, index) {
                final badge = _badges[index];
                return _buildBadgeItem(badge);
              },
            ),
    );
  }

  Widget _buildGameItem(Game game) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: game.color.withOpacity(0.2),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                game.icon,
                color: game.color,
              ),
            ),
            SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          game.name,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: Icon(
                          game.isFavorite ? Icons.favorite : Icons.favorite_border,
                          color: game.isFavorite ? Colors.red : Colors.grey,
                        ),
                        onPressed: () => _toggleFavorite(game),
                      ),
                    ],
                  ),
                  Text(
                    game.description,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                  SizedBox(height: 4),
                  Row(
                    children: [
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.blue[100],
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          game.category,
                          style: TextStyle(
                            color: Colors.blue[800],
                            fontSize: 10,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      SizedBox(width: 8),
                      Text(
                        'Level ${game.level}',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
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

  Widget _buildAchievementItem(Achievement achievement) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: achievement.color.withOpacity(0.2),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                achievement.icon,
                color: achievement.color,
              ),
            ),
            SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    achievement.title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    achievement.description,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                  SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(
                        Icons.stars,
                        size: 14,
                        color: Colors.orange,
                      ),
                      SizedBox(width: 4),
                      Text(
                        '${achievement.points} XP',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                      Spacer(),
                      if (achievement.unlocked)
                        Text(
                          'Unlocked ${_formatDate(achievement.unlockDate!)}',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.green,
                          ),
                        )
                      else
                        Text(
                          'Locked',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
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

  Widget _buildBadgeItem(GamificationBadge badge) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: badge.color.withOpacity(0.2),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                badge.icon,
                color: badge.color,
              ),
            ),
            SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    badge.name,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    badge.description,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                  SizedBox(height: 4),
                  if (badge.earned)
                    Text(
                      'Earned ${_formatDate(badge.earnedDate!)}',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.green,
                      ),
                    )
                  else
                    Text(
                      'Not earned',
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

  Widget _buildStatCard(String title, String value, IconData icon) {
    return Expanded(
      child: Container(
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(12),
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

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}

class Game {
  final int id;
  final String name;
  final String description;
  final String category;
  final int level;
  final int xp;
  final int totalXp;
  final DateTime lastPlayed;
  final bool isFavorite;
  final IconData icon;
  final Color color;

  Game({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    required this.level,
    required this.xp,
    required this.totalXp,
    required this.lastPlayed,
    required this.isFavorite,
    required this.icon,
    required this.color,
  });
}

class Achievement {
  final int id;
  final String title;
  final String description;
  final int points;
  final bool unlocked;
  final DateTime? unlockDate;
  final IconData icon;
  final Color color;

  Achievement({
    required this.id,
    required this.title,
    required this.description,
    required this.points,
    required this.unlocked,
    this.unlockDate,
    required this.icon,
    required this.color,
  });
}

class GamificationBadge {
  final int id;
  final String name;
  final String description;
  final IconData icon;
  final Color color;
  final bool earned;
  final DateTime? earnedDate;

  GamificationBadge({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
    required this.color,
    required this.earned,
    this.earnedDate,
  });
}