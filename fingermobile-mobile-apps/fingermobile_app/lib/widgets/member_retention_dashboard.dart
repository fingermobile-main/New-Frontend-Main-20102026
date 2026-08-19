import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class MemberRetentionDashboard extends StatefulWidget {
  @override
  _MemberRetentionDashboardState createState() => _MemberRetentionDashboardState();
}

class _MemberRetentionDashboardState extends State<MemberRetentionDashboard> {
  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Member Retention',
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
                    colors: [Colors.teal[600]!, Colors.teal[800]!],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Member Retention Analytics',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Track and improve member engagement and retention',
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
                  _buildStatCard('Active Members', '8,240', Icons.people, Colors.blue),
                  _buildStatCard('Retention Rate', '78.5%', Icons.trending_up, Colors.green),
                  _buildStatCard('Churn Risk', '420', Icons.warning, Colors.orange),
                  _buildStatCard('Engagement Score', '7.2/10', Icons.show_chart, Colors.purple),
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
                              'Member Retention Rate',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            Container(
                              height: 200,
                              child: _buildRetentionChart(),
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
                              'Engagement Metrics',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            _buildEngagementMetrics(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // At-risk members
              Text(
                'At-Risk Members',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildAtRiskMembersList(),
              
              SizedBox(height: 24),
              
              // Retention strategies
              Text(
                'Retention Strategies',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildRetentionStrategies(),
              
              SizedBox(height: 24),
              
              // Member segments
              Text(
                'Member Segments',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildMemberSegments(),
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

  Widget _buildRetentionChart() {
    return Container(
      child: CustomPaint(
        painter: RetentionChartPainter(),
        size: Size.infinite,
      ),
    );
  }

  Widget _buildEngagementMetrics() {
    final metrics = [
      {'metric': 'Daily Visits', 'value': 1.8, 'max': 3.0},
      {'metric': 'Session Duration', 'value': 12.4, 'max': 20.0},
      {'metric': 'Content Interactions', 'value': 3.2, 'max': 5.0},
      {'metric': 'Social Engagements', 'value': 1.7, 'max': 3.0},
    ];

    return Column(
      children: metrics.map((metric) {
        return Padding(
          padding: EdgeInsets.symmetric(vertical: 6),
          child: Row(
            children: [
              Expanded(
                flex: 2,
                child: Text(metric['metric']!),
              ),
              Expanded(
                flex: 3,
                child: LinearProgressIndicator(
                  value: metric['value']! / metric['max']!,
                  backgroundColor: Colors.grey[300],
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.teal),
                ),
              ),
              SizedBox(width: 8),
              Text('${metric['value']}'),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildAtRiskMembersList() {
    final members = [
      {'name': 'John Doe', 'risk': 'High', 'daysInactive': 14, 'reason': 'Low activity'},
      {'name': 'Sarah Johnson', 'risk': 'Medium', 'daysInactive': 7, 'reason': 'No engagement'},
      {'name': 'Mike Wilson', 'risk': 'High', 'daysInactive': 21, 'reason': 'Unsubscribed'},
      {'name': 'Emma Davis', 'risk': 'Low', 'daysInactive': 3, 'reason': 'Vacation'},
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Member')),
          DataColumn(label: Text('Risk Level')),
          DataColumn(label: Text('Days Inactive')),
          DataColumn(label: Text('Reason')),
          DataColumn(label: Text('Action')),
        ],
        rows: members.map((member) {
          return DataRow(
            cells: [
              DataCell(Text(member['name']!)),
              DataCell(
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: member['risk'] == 'High'
                        ? Colors.red[100]
                        : member['risk'] == 'Medium'
                            ? Colors.orange[100]
                            : Colors.green[100],
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    member['risk']!,
                    style: TextStyle(
                      color: member['risk'] == 'High'
                          ? Colors.red[800]
                          : member['risk'] == 'Medium'
                              ? Colors.orange[800]
                              : Colors.green[800],
                    ),
                  ),
                ),
              ),
              DataCell(Text(member['daysInactive'].toString())),
              DataCell(Text(member['reason']!)),
              DataCell(
                IconButton(
                  icon: Icon(Icons.message, color: Colors.blue),
                  onPressed: () {},
                ),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildRetentionStrategies() {
    final strategies = [
      {'name': 'Welcome Series', 'applied': 245, 'success': 78},
      {'name': 'Re-engagement Email', 'applied': 120, 'success': 45},
      {'name': 'Special Offers', 'applied': 85, 'success': 32},
      {'name': 'Feature Tours', 'applied': 65, 'success': 28},
    ];

    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: strategies.map((strategy) {
            return Padding(
              padding: EdgeInsets.symmetric(vertical: 12),
              child: Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: Text(strategy['name']!),
                  ),
                  Expanded(
                    child: Text('Applied to ${strategy['applied']} members'),
                  ),
                  Expanded(
                    child: Text('${strategy['success']}% success'),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildMemberSegments() {
    final segments = [
      {'name': 'New Members', 'count': 1240, 'growth': '+12%'},
      {'name': 'Active Members', 'count': 5680, 'growth': '+3%'},
      {'name': 'Power Users', 'count': 890, 'growth': '+8%'},
      {'name': 'Inactive', 'count': 430, 'growth': '-5%'},
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Segment')),
          DataColumn(label: Text('Members')),
          DataColumn(label: Text('Growth')),
        ],
        rows: segments.map((segment) {
          return DataRow(
            cells: [
              DataCell(Text(segment['name']!)),
              DataCell(Text(segment['count'].toString())),
              DataCell(
                Text(
                  segment['growth']!,
                  style: TextStyle(
                    color: segment['growth']!.startsWith('+') ? Colors.green : Colors.red,
                  ),
                ),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }
}

class RetentionChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.teal
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final points = <Offset>[];

    // Create sample retention data points
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
      ..color = Colors.teal
      ..style = PaintingStyle.fill;

    for (final point in points) {
      canvas.drawCircle(point, 4, circlePaint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}