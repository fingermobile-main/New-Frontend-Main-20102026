import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class AnalyticsDashboard extends StatefulWidget {
  @override
  _AnalyticsDashboardState createState() => _AnalyticsDashboardState();
}

class _AnalyticsDashboardState extends State<AnalyticsDashboard> {
  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Analytics Dashboard',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title
              Text(
                'Analytics Overview',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              
              // Stats Grid
              GridView.count(
                crossAxisCount: 4,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                children: [
                  _buildStatCard('Total Views', '24.8K', Icons.visibility, Colors.blue),
                  _buildStatCard('Engagement Rate', '78.5%', Icons.trending_up, Colors.green),
                  _buildStatCard('Avg. Session', '4m 22s', Icons.timer, Colors.orange),
                  _buildStatCard('Bounce Rate', '24.3%', Icons.leak_remove, Colors.red),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Charts Row
              Row(
                children: [
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Engagement Over Time',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 12),
                            Container(
                              height: 200,
                              child: _buildLineChart(),
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
                        padding: EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Traffic Sources',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 12),
                            _buildPieChart(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Content Performance
              Text(
                'Content Performance',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              
              Card(
                child: DataTable(
                  columns: [
                    DataColumn(label: Text('Content')),
                    DataColumn(label: Text('Views')),
                    DataColumn(label: Text('Likes')),
                    DataColumn(label: Text('Shares')),
                  ],
                  rows: [
                    DataRow(cells: [
                      DataCell(Text('Top 10 Tips for Flutter')),
                      DataCell(Text('2,450')),
                      DataCell(Text('180')),
                      DataCell(Text('42')),
                    ]),
                    DataRow(cells: [
                      DataCell(Text('Building Responsive UIs')),
                      DataCell(Text('1,890')),
                      DataCell(Text('145')),
                      DataCell(Text('28')),
                    ]),
                    DataRow(cells: [
                      DataCell(Text('State Management Guide')),
                      DataCell(Text('1,650')),
                      DataCell(Text('120')),
                      DataCell(Text('35')),
                    ]),
                    DataRow(cells: [
                      DataCell(Text('Animations Tutorial')),
                      DataCell(Text('1,420')),
                      DataCell(Text('98')),
                      DataCell(Text('18')),
                    ]),
                  ],
                ),
              ),
              
              SizedBox(height: 24),
              
              // Audience Demographics
              Text(
                'Audience Demographics',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              
              Row(
                children: [
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Geographic Distribution',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 12),
                            _buildGeographicDistribution(),
                          ],
                        ),
                      ),
                    ),
                  ),
                  
                  SizedBox(width: 16),
                  
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Device Breakdown',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 12),
                            _buildDeviceBreakdown(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
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
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLineChart() {
    return Container(
      child: CustomPaint(
        painter: LineChartPainter(),
        size: Size.infinite,
      ),
    );
  }

  Widget _buildPieChart() {
    return Container(
      height: 180,
      child: CustomPaint(
        painter: PieChartPainter(),
        size: Size.infinite,
      ),
    );
  }

  Widget _buildGeographicDistribution() {
    return Column(
      children: [
        _buildDistributionItem('United States', 32.4, Colors.blue),
        _buildDistributionItem('United Kingdom', 18.7, Colors.green),
        _buildDistributionItem('Canada', 14.2, Colors.orange),
        _buildDistributionItem('Australia', 12.1, Colors.purple),
        _buildDistributionItem('Germany', 9.8, Colors.red),
      ],
    );
  }

  Widget _buildDeviceBreakdown() {
    return Column(
      children: [
        _buildDistributionItem('Mobile', 64.3, Colors.blue),
        _buildDistributionItem('Desktop', 28.7, Colors.green),
        _buildDistributionItem('Tablet', 7.0, Colors.orange),
      ],
    );
  }

  Widget _buildDistributionItem(String label, double percentage, Color color) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          Container(
            width: 12,
            height: 12,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
            ),
          ),
          SizedBox(width: 8),
          Expanded(
            flex: 2,
            child: Text(label),
          ),
          Expanded(
            child: Text('$percentage%'),
          ),
          Expanded(
            flex: 3,
            child: LinearProgressIndicator(
              value: percentage / 100,
              backgroundColor: Colors.grey[300],
              valueColor: AlwaysStoppedAnimation<Color>(color),
            ),
          ),
        ],
      ),
    );
  }
}

class LineChartPainter extends CustomPainter {
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

class PieChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.shortestSide / 2;

    final colors = [Colors.blue, Colors.green, Colors.orange, Colors.purple, Colors.red];
    final values = [35, 25, 20, 15, 5]; // Total = 100%

    double startAngle = -90 * (3.14159 / 180); // Start from top

    for (int i = 0; i < values.length; i++) {
      final sweepAngle = (values[i] / 100) * 360 * (3.14159 / 180);
      
      final paint = Paint()
        ..color = colors[i]
        ..style = PaintingStyle.fill;

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle,
        sweepAngle,
        true,
        paint,
      );

      startAngle += sweepAngle;
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}