import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class CreatorTools extends StatefulWidget {
  @override
  _CreatorToolsState createState() => _CreatorToolsState();
}

class _CreatorToolsState extends State<CreatorTools> {
  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Creator Tools',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header section
              Container(
                padding: EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Colors.purple[600]!, Colors.purple[800]!],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Creator Toolkit',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Everything you need to create amazing content',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
              
              SizedBox(height: 24),
              
              // Stats grid
              GridView.count(
                crossAxisCount: 4,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                children: [
                  _buildStatCard('Content Created', '86', Icons.article, Colors.blue),
                  _buildStatCard('Engagement Rate', '4.2%', Icons.trending_up, Colors.green),
                  _buildStatCard('Earnings', '\$1,240', Icons.attach_money, Colors.orange),
                  _buildStatCard('Followers', '1,240', Icons.people, Colors.purple),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Charts section
              Row(
                children: [
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Content Performance',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            Container(
                              height: 200,
                              child: _buildPerformanceChart(),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Content Types',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            _buildContentTypeList(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Creator tools
              Text(
                'Content Creation Tools',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildCreatorTools(),
              
              SizedBox(height: 24),
              
              // Publishing options
              Text(
                'Publishing Options',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildPublishingOptions(),
              
              SizedBox(height: 24),
              
              // Analytics
              Text(
                'Creator Analytics',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildAnalyticsCards(),
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

  Widget _buildPerformanceChart() {
    return Container(
      child: CustomPaint(
        painter: PerformanceChartPainter(),
        size: Size.infinite,
      ),
    );
  }

  Widget _buildContentTypeList() {
    final contentTypes = [
      {'type': 'Posts', 'count': 45, 'percentage': 0.52},
      {'type': 'Videos', 'count': 23, 'percentage': 0.27},
      {'type': 'Images', 'count': 15, 'percentage': 0.17},
      {'type': 'Articles', 'count': 3, 'percentage': 0.04},
    ];

    return Column(
      children: contentTypes.map((content) {
        return Padding(
          padding: EdgeInsets.symmetric(vertical: 6),
          child: Row(
            children: [
              Expanded(
                flex: 2,
                child: Text(content['type']!),
              ),
              Expanded(
                child: LinearProgressIndicator(
                  value: content['percentage']!,
                  backgroundColor: Colors.grey[300],
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.purple),
                ),
              ),
              SizedBox(width: 8),
              Text('${content['count']}'),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildCreatorTools() {
    final tools = [
      {'name': 'Rich Editor', 'icon': Icons.edit, 'color': Colors.blue},
      {'name': 'Media Library', 'icon': Icons.photo_library, 'color': Colors.green},
      {'name': 'Scheduler', 'icon': Icons.schedule, 'color': Colors.orange},
      {'name': 'Analytics', 'icon': Icons.bar_chart, 'color': Colors.purple},
      {'name': 'Monetization', 'icon': Icons.attach_money, 'color': Colors.red},
      {'name': 'Collaboration', 'icon': Icons.group_work, 'color': Colors.teal},
    ];

    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Wrap(
          spacing: 16,
          runSpacing: 16,
          children: tools.map((tool) => _buildToolCard(tool)).toList(),
        ),
      ),
    );
  }

  Widget _buildToolCard(Map<String, dynamic> tool) {
    return Expanded(
      child: Card(
        child: InkWell(
          onTap: () {},
          child: Container(
            width: 120,
            padding: EdgeInsets.all(16),
            child: Column(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: tool['color'].withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(tool['icon'], color: tool['color']),
                ),
                SizedBox(height: 8),
                Text(
                  tool['name'],
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPublishingOptions() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildPublishOption('Publish Now', Icons.send, Colors.green),
                _buildPublishOption('Schedule', Icons.schedule, Colors.orange),
                _buildPublishOption('Draft', Icons.save, Colors.blue),
                _buildPublishOption('Preview', Icons.remove_red_eye, Colors.purple),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPublishOption(String title, IconData icon, Color color) {
    return Expanded(
      child: Card(
        child: InkWell(
          onTap: () {},
          child: Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              children: [
                Icon(icon, color: color, size: 30),
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

  Widget _buildAnalyticsCards() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      children: [
                        Text(
                          'Top Performing Post',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'How to Build an App in 30 Days',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[700],
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          '2,450 views • 124 likes',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                SizedBox(width: 12),
                Expanded(
                  child: Container(
                    padding: EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      children: [
                        Text(
                          'Audience Insights',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Most active: 7-9 PM',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[700],
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Preferred content: Tutorials',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class PerformanceChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.purple
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
      ..color = Colors.purple
      ..style = PaintingStyle.fill;

    for (final point in points) {
      canvas.drawCircle(point, 4, circlePaint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}