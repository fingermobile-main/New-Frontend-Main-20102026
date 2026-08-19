import 'package:flutter/material.dart';
import '../services/api_service.dart';

class MeditationMindfulnessScreen extends StatefulWidget {
  @override
  _MeditationMindfulnessScreenState createState() => _MeditationMindfulnessScreenState();
}

class _MeditationMindfulnessScreenState extends State<MeditationMindfulnessScreen> {
  List<MeditationSession> _sessions = [];
  List<MeditationCategory> _categories = [];
  List<MindfulnessExercise> _exercises = [];
  bool _isLoading = true;
  int _currentSessionTime = 0;
  bool _isSessionActive = false;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _loadMeditationData();
  }

  Future<void> _loadMeditationData() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _categories = [
          MeditationCategory(id: 1, name: 'Sleep', icon: Icons.bed, color: Colors.blue),
          MeditationCategory(id: 2, name: 'Focus', icon: Icons.lightbulb, color: Colors.green),
          MeditationCategory(id: 3, name: 'Anxiety', icon: Icons.sentiment_very_satisfied, color: Colors.orange),
          MeditationCategory(id: 4, name: 'Stress', icon: Icons.wb_sunny, color: Colors.purple),
          MeditationCategory(id: 5, name: 'Breathing', icon: Icons.air, color: Colors.teal),
          MeditationCategory(id: 6, name: 'Mindfulness', icon: Icons.nature, color: Colors.red),
        ];
        
        _sessions = [
          MeditationSession(
            id: 1,
            title: 'Morning Calm',
            description: 'Start your day with peace and clarity',
            duration: 10,
            category: 'Focus',
            instructor: 'Sarah Johnson',
            rating: 4.8,
            totalRatings: 1245,
            isFavorite: true,
            image: 'https://via.placeholder.com/300x200',
          ),
          MeditationSession(
            id: 2,
            title: 'Deep Sleep',
            description: 'Fall asleep peacefully with this calming session',
            duration: 20,
            category: 'Sleep',
            instructor: 'Michael Chen',
            rating: 4.9,
            totalRatings: 876,
            isFavorite: false,
            image: 'https://via.placeholder.com/300x200',
          ),
          MeditationSession(
            id: 3,
            title: 'Anxiety Relief',
            description: 'Reduce anxiety and find inner calm',
            duration: 15,
            category: 'Anxiety',
            instructor: 'Emma Wilson',
            rating: 4.7,
            totalRatings: 921,
            isFavorite: true,
            image: 'https://via.placeholder.com/300x200',
          ),
          MeditationSession(
            id: 4,
            title: 'Stress Release',
            description: 'Release tension and find balance',
            duration: 12,
            category: 'Stress',
            instructor: 'David Park',
            rating: 4.6,
            totalRatings: 756,
            isFavorite: false,
            image: 'https://via.placeholder.com/300x200',
          ),
        ];
        
        _exercises = [
          MindfulnessExercise(
            id: 1,
            title: '4-7-8 Breathing',
            description: 'Breathe in for 4, hold for 7, exhale for 8',
            duration: 4,
            category: 'Breathing',
          ),
          MindfulnessExercise(
            id: 2,
            title: 'Body Scan',
            description: 'Mindfully scan your body from head to toe',
            duration: 10,
            category: 'Mindfulness',
          ),
          MindfulnessExercise(
            id: 3,
            title: 'Mindful Walking',
            description: 'Focus on each step and your surroundings',
            duration: 15,
            category: 'Mindfulness',
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading meditation data: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading meditation data')),
      );
    }
  }

  void _startSession(MeditationSession session) {
    setState(() {
      _isSessionActive = true;
      _currentSessionTime = session.duration * 60; // Convert to seconds
    });

    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      if (_currentSessionTime > 0) {
        setState(() {
          _currentSessionTime--;
        });
      } else {
        _stopSession();
      }
    });
  }

  void _stopSession() {
    setState(() {
      _isSessionActive = false;
    });
    _timer?.cancel();
  }

  void _toggleFavorite(MeditationSession session) {
    setState(() {
      final index = _sessions.indexWhere((s) => s.id == session.id);
      if (index != -1) {
        _sessions[index] = MeditationSession(
          id: _sessions[index].id,
          title: _sessions[index].title,
          description: _sessions[index].description,
          duration: _sessions[index].duration,
          category: _sessions[index].category,
          instructor: _sessions[index].instructor,
          rating: _sessions[index].rating,
          totalRatings: _sessions[index].totalRatings,
          isFavorite: !_sessions[index].isFavorite,
          image: _sessions[index].image,
        );
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Meditation'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.bookmark),
            onPressed: () {
              // Navigate to saved sessions
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _isSessionActive
              ? _buildActiveSession()
              : RefreshIndicator(
                  onRefresh: _loadMeditationData,
                  child: SingleChildScrollView(
                    child: Column(
                      children: [
                        // Stats Summary
                        Container(
                          padding: EdgeInsets.all(16),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              _buildStatCard('Sessions', '42', Icons.local_play),
                              _buildStatCard('Hours', '28.5', Icons.schedule),
                              _buildStatCard('Streak', '12 days', Icons.local_fire_department),
                            ],
                          ),
                        ),
                        
                        // Categories
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          child: Text(
                            'Categories',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        Container(
                          height: 100,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: _categories.length,
                            itemBuilder: (context, index) {
                              final category = _categories[index];
                              return _buildCategoryCard(category);
                            },
                          ),
                        ),
                        
                        // Featured Sessions
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Featured Sessions',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  // Navigate to all sessions
                                },
                                child: Text('See All'),
                              ),
                            ],
                          ),
                        ),
                        ListView.builder(
                          shrinkWrap: true,
                          physics: NeverScrollableScrollPhysics(),
                          itemCount: _sessions.length,
                          itemBuilder: (context, index) {
                            final session = _sessions[index];
                            return _buildSessionCard(session);
                          },
                        ),
                        
                        // Mindfulness Exercises
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Quick Exercises',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  // Navigate to all exercises
                                },
                                child: Text('See All'),
                              ),
                            ],
                          ),
                        ),
                        ListView.builder(
                          shrinkWrap: true,
                          physics: NeverScrollableScrollPhysics(),
                          itemCount: _exercises.length,
                          itemBuilder: (context, index) {
                            final exercise = _exercises[index];
                            return _buildExerciseCard(exercise);
                          },
                        ),
                      ],
                    ),
                  ),
                ),
    );
  }

  Widget _buildActiveSession() {
    int minutes = _currentSessionTime ~/ 60;
    int seconds = _currentSessionTime % 60;
    
    return Container(
      width: double.infinity,
      height: double.infinity,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Colors.blue[200]!, Colors.purple[200]!],
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 200,
            height: 200,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.3),
              borderRadius: BorderRadius.circular(100),
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}',
                    style: TextStyle(
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Meditation Time',
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: 40),
          Text(
            'Breathe deeply and focus on the present moment',
            style: TextStyle(
              fontSize: 16,
              color: Colors.white,
              fontStyle: FontStyle.italic,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 40),
          ElevatedButton(
            onPressed: _stopSession,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: Colors.blue,
            ),
            child: Text('End Session'),
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

  Widget _buildCategoryCard(MeditationCategory category) {
    return Card(
      margin: EdgeInsets.only(left: 16, right: 8),
      child: Container(
        width: 120,
        padding: EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: category.color.withOpacity(0.2),
                borderRadius: BorderRadius.circular(25),
              ),
              child: Icon(
                category.icon,
                color: category.color,
              ),
            ),
            SizedBox(height: 8),
            Text(
              category.name,
              style: TextStyle(
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSessionCard(MeditationSession session) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Container(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Session image
            Container(
              height: 150,
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(4),
                  topRight: Radius.circular(4),
                ),
                image: DecorationImage(
                  image: NetworkImage(session.image),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            
            // Session info
            Padding(
              padding: EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          session.title,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: Icon(
                          session.isFavorite ? Icons.favorite : Icons.favorite_border,
                          color: session.isFavorite ? Colors.red : Colors.grey,
                        ),
                        onPressed: () => _toggleFavorite(session),
                      ),
                    ],
                  ),
                  SizedBox(height: 4),
                  Text(
                    session.description,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                  SizedBox(height: 8),
                  Row(
                    children: [
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.blue[100],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          session.category,
                          style: TextStyle(
                            color: Colors.blue[800],
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      SizedBox(width: 8),
                      Icon(
                        Icons.schedule,
                        size: 14,
                        color: Colors.grey[600],
                      ),
                      SizedBox(width: 4),
                      Text(
                        '${session.duration} min',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(
                        Icons.person,
                        size: 14,
                        color: Colors.grey[600],
                      ),
                      SizedBox(width: 4),
                      Text(
                        session.instructor,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                      Spacer(),
                      Icon(
                        Icons.star,
                        size: 14,
                        color: Colors.orange,
                      ),
                      SizedBox(width: 4),
                      Text(
                        '${session.rating}',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 12),
                  Container(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => _startSession(session),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                      ),
                      child: Text('Start Session'),
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

  Widget _buildExerciseCard(MindfulnessExercise exercise) {
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
                color: Colors.blue[100],
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                Icons.local_activity,
                color: Colors.blue,
              ),
            ),
            SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    exercise.title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    exercise.description,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(10),
              ),
              child: Text(
                '${exercise.duration} min',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[700],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class MeditationCategory {
  final int id;
  final String name;
  final IconData icon;
  final Color color;

  MeditationCategory({
    required this.id,
    required this.name,
    required this.icon,
    required this.color,
  });
}

class MeditationSession {
  final int id;
  final String title;
  final String description;
  final int duration;
  final String category;
  final String instructor;
  final double rating;
  final int totalRatings;
  final bool isFavorite;
  final String image;

  MeditationSession({
    required this.id,
    required this.title,
    required this.description,
    required this.duration,
    required this.category,
    required this.instructor,
    required this.rating,
    required this.totalRatings,
    required this.isFavorite,
    required this.image,
  });
}

class MindfulnessExercise {
  final int id;
  final String title;
  final String description;
  final int duration;
  final String category;

  MindfulnessExercise({
    required this.id,
    required this.title,
    required this.description,
    required this.duration,
    required this.category,
  });
}