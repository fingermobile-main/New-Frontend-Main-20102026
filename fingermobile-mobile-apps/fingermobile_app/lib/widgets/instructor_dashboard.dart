import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class InstructorDashboard extends StatefulWidget {
  @override
  _InstructorDashboardState createState() => _InstructorDashboardState();
}

class _InstructorDashboardState extends State<InstructorDashboard> {
  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Instructor Dashboard',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome section
              Container(
                padding: EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Colors.blue[600]!, Colors.blue[800]!],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Welcome back, Instructor!',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Here\'s your course performance overview',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
              
              SizedBox(height: 24),
              
              // Stats cards
              Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      'Courses',
                      '8',
                      Icons.book,
                      Colors.blue,
                    ),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: _buildStatCard(
                      'Students',
                      '2,450',
                      Icons.people,
                      Colors.green,
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 16),
              
              Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      'Revenue',
                      '\$12,450',
                      Icons.attach_money,
                      Colors.orange,
                    ),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: _buildStatCard(
                      'Rating',
                      '4.7★',
                      Icons.star,
                      Colors.purple,
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Quick actions
              Text(
                'Quick Actions',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: [
                  _buildQuickActionButton(
                    'Create Course',
                    Icons.add,
                    Colors.blue,
                    () {},
                  ),
                  _buildQuickActionButton(
                    'Upload Content',
                    Icons.upload,
                    Colors.green,
                    () {},
                  ),
                  _buildQuickActionButton(
                    'View Analytics',
                    Icons.analytics,
                    Colors.orange,
                    () {},
                  ),
                  _buildQuickActionButton(
                    'Manage Students',
                    Icons.people_alt,
                    Colors.purple,
                    () {},
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Courses section
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'My Courses',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  TextButton(
                    onPressed: () {},
                    child: Text('View All'),
                  ),
                ],
              ),
              SizedBox(height: 12),
              _buildCoursesList(),
              
              SizedBox(height: 24),
              
              // Student Engagement
              Text(
                'Student Engagement',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildEngagementChart(),
              
              SizedBox(height: 24),
              
              // Recent Reviews
              Text(
                'Recent Reviews',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildReviewsList(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: color),
                SizedBox(width: 8),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActionButton(String title, IconData icon, Color color, VoidCallback onPressed) {
    return Expanded(
      child: Card(
        child: InkWell(
          onTap: onPressed,
          child: Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, color: color),
                ),
                SizedBox(height: 8),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCoursesList() {
    final courses = [
      {'title': 'Flutter Fundamentals', 'students': '1,245', 'rating': '4.8', 'progress': 0.9},
      {'title': 'Advanced UI/UX Design', 'students': '876', 'rating': '4.7', 'progress': 0.75},
      {'title': 'State Management in Flutter', 'students': '567', 'rating': '4.9', 'progress': 0.6},
    ];

    return ListView.builder(
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      itemCount: courses.length,
      itemBuilder: (context, index) {
        final course = courses[index];
        return Card(
          child: ListTile(
            contentPadding: EdgeInsets.all(16),
            leading: Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: Colors.blue[50],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(Icons.book, color: Colors.blue),
            ),
            title: Text(course['title']!),
            subtitle: Text('${course['students']} students • Rating: ${course['rating']}★'),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  '${(course['progress']! * 100).toInt()}%',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                Text(
                  'Complete',
                  style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildEngagementChart() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Completion Rate (Last 30 Days)',
              style: TextStyle(
                fontWeight: FontWeight.w500,
              ),
            ),
            SizedBox(height: 12),
            Container(
              height: 120,
              child: CustomPaint(
                painter: EngagementChartPainter(),
                size: Size.infinite,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReviewsList() {
    final reviews = [
      {
        'student': 'John Doe',
        'rating': 5,
        'comment': 'Excellent course! Very well explained concepts.',
        'date': '2 days ago'
      },
      {
        'student': 'Sarah Johnson',
        'rating': 4,
        'comment': 'Good content but could use more examples.',
        'date': '1 week ago'
      },
      {
        'student': 'Mike Wilson',
        'rating': 5,
        'comment': 'Best Flutter course I\'ve taken so far!',
        'date': '2 weeks ago'
      },
    ];

    return ListView.builder(
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      itemCount: reviews.length,
      itemBuilder: (context, index) {
        final review = reviews[index];
        return Card(
          child: Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      radius: 16,
                      backgroundImage: NetworkImage('https://via.placeholder.com/150'),
                    ),
                    SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          review['student']!,
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        Text(
                          review['date']!,
                          style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                        ),
                      ],
                    ),
                    Spacer(),
                    Row(
                      children: List.generate(
                        5,
                        (starIndex) => Icon(
                          starIndex < review['rating']!
                              ? Icons.star
                              : Icons.star_border,
                          color: Colors.amber,
                          size: 16,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 8),
                Text(
                  review['comment']!,
                  style: TextStyle(color: Colors.grey[700]),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class EngagementChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.blue
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final points = <Offset>[];

    // Create sample data points
    for (int i = 0; i < 7; i++) {
      final x = (size.width / 6) * i;
      final y = size.height - (i % 3 == 0 ? size.height * 0.7 : i % 3 == 1 ? size.height * 0.5 : size.height * 0.3);
      points.add(Offset(x, y));
    }

    if (points.length > 1) {
      canvas.drawPoints(PointMode.polygon, points, paint);
    }

    // Draw data points
    final circlePaint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.fill;

    for (final point in points) {
      canvas.drawCircle(point, 4, circlePaint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}