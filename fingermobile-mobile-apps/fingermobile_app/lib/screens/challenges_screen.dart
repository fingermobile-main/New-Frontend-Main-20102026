import 'package:flutter/material.dart';

class Challenge {
  final int id;
  final String title;
  final String description;
  final String category;
  final int reward;
  final int participants;
  final DateTime startDate;
  final DateTime endDate;
  final bool isActive;
  final String difficulty;
  final String icon;

  Challenge({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.reward,
    required this.participants,
    required this.startDate,
    required this.endDate,
    required this.isActive,
    required this.difficulty,
    required this.icon,
  });
}

class ChallengesScreen extends StatefulWidget {
  @override
  _ChallengesScreenState createState() => _ChallengesScreenState();
}

class _ChallengesScreenState extends State<ChallengesScreen> {
  List<Challenge> _activeChallenges = [];
  List<Challenge> _upcomingChallenges = [];
  List<Challenge> _completedChallenges = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadChallenges();
  }

  Future<void> _loadChallenges() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _activeChallenges = [
          Challenge(
            id: 1,
            title: '30-Day Fitness Challenge',
            description: 'Post a workout video every day for 30 days',
            category: 'Health',
            reward: 500,
            participants: 1245,
            startDate: DateTime.now().subtract(Duration(days: 5)),
            endDate: DateTime.now().add(Duration(days: 25)),
            isActive: true,
            difficulty: 'Medium',
            icon: '🏃',
          ),
          Challenge(
            id: 2,
            title: 'Photography Masterclass',
            description: 'Capture and share one beautiful photo each day',
            category: 'Creative',
            reward: 300,
            participants: 876,
            startDate: DateTime.now().subtract(Duration(days: 2)),
            endDate: DateTime.now().add(Duration(days: 28)),
            isActive: true,
            difficulty: 'Easy',
            icon: '📸',
          ),
        ];
        
        _upcomingChallenges = [
          Challenge(
            id: 3,
            title: 'Coding Bootcamp',
            description: 'Build a new app feature every week',
            category: 'Tech',
            reward: 1000,
            participants: 234,
            startDate: DateTime.now().add(Duration(days: 3)),
            endDate: DateTime.now().add(Duration(days: 33)),
            isActive: false,
            difficulty: 'Hard',
            icon: '💻',
          ),
          Challenge(
            id: 4,
            title: 'Cooking Adventure',
            description: 'Try a new recipe every day',
            category: 'Lifestyle',
            reward: 200,
            participants: 567,
            startDate: DateTime.now().add(Duration(days: 7)),
            endDate: DateTime.now().add(Duration(days: 37)),
            isActive: false,
            difficulty: 'Easy',
            icon: '🍳',
          ),
        ];
        
        _completedChallenges = [
          Challenge(
            id: 5,
            title: 'Reading Marathon',
            description: 'Read for 30 minutes every day for a month',
            category: 'Education',
            reward: 400,
            participants: 2100,
            startDate: DateTime.now().subtract(Duration(days: 40)),
            endDate: DateTime.now().subtract(Duration(days: 10)),
            isActive: false,
            difficulty: 'Medium',
            icon: '📚',
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading challenges: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading challenges')),
      );
    }
  }

  void _joinChallenge(Challenge challenge) {
    // In a real app, this would join the challenge via API
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Joined challenge: ${challenge.title}'),
        backgroundColor: Colors.green,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Challenges'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : DefaultTabController(
              length: 3,
              child: Column(
                children: [
                  TabBar(
                    tabs: [
                      Tab(text: 'Active (${_activeChallenges.length})'),
                      Tab(text: 'Upcoming (${_upcomingChallenges.length})'),
                      Tab(text: 'Completed (${_completedChallenges.length})'),
                    ],
                  ),
                  Expanded(
                    child: TabBarView(
                      children: [
                        _buildChallengeList(_activeChallenges, true),
                        _buildChallengeList(_upcomingChallenges, false),
                        _buildChallengeList(_completedChallenges, false),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildChallengeList(List<Challenge> challenges, bool showJoinButton) {
    if (challenges.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.flag_outlined,
              size: 80,
              color: Colors.grey[400],
            ),
            SizedBox(height: 16),
            Text(
              'No challenges',
              style: TextStyle(
                fontSize: 20,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 8),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                'There are no challenges in this category right now',
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
      onRefresh: _loadChallenges,
      child: ListView.builder(
        itemCount: challenges.length,
        itemBuilder: (context, index) {
          final challenge = challenges[index];
          return _buildChallengeCard(challenge, showJoinButton);
        },
      ),
    );
  }

  Widget _buildChallengeCard(Challenge challenge, bool showJoinButton) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: Colors.blue[50],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Center(
                    child: Text(
                      challenge.icon,
                      style: TextStyle(fontSize: 24),
                    ),
                  ),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        challenge.title,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        challenge.category,
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 14,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getDifficultyColor(challenge.difficulty),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    challenge.difficulty,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 12),
            Text(
              challenge.description,
              style: TextStyle(fontSize: 14),
            ),
            SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Reward',
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                      Row(
                        children: [
                          Icon(
                            Icons.monetization_on,
                            size: 16,
                            color: Colors.green,
                          ),
                          SizedBox(width: 4),
                          Text(
                            '${challenge.reward} FIC',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Participants',
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                      Row(
                        children: [
                          Icon(
                            Icons.people,
                            size: 16,
                            color: Colors.blue,
                          ),
                          SizedBox(width: 4),
                          Text(
                            '${challenge.participants}',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: Text(
                    'Start: ${_formatDate(challenge.startDate)}',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                ),
                Expanded(
                  child: Text(
                    'End: ${_formatDate(challenge.endDate)}',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                      textAlign: TextAlign.end,
                    ),
                  ),
                ),
              ],
            ),
            if (showJoinButton && challenge.isActive)
              Padding(
                padding: EdgeInsets.only(top: 12),
                child: SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      _joinChallenge(challenge);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                    ),
                    child: Text('Join Challenge'),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Color _getDifficultyColor(String difficulty) {
    switch (difficulty) {
      case 'Easy':
        return Colors.green;
      case 'Medium':
        return Colors.orange;
      case 'Hard':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _formatDate(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
  }
}