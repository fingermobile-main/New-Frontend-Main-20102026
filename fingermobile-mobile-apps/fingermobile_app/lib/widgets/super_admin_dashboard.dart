import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class SuperAdminDashboard extends StatefulWidget {
  @override
  _SuperAdminDashboardState createState() => _SuperAdminDashboardState();
}

class _SuperAdminDashboardState extends State<SuperAdminDashboard> {
  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Super Admin Dashboard',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // System Overview
              Text(
                'System Overview',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              
              GridView.count(
                crossAxisCount: 4,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                children: [
                  _buildSystemMetric('Total Users', '124,563', Icons.people, Colors.blue),
                  _buildSystemMetric('Active Sessions', '8,421', Icons.access_time, Colors.green),
                  _buildSystemMetric('Total Posts', '2.4M', Icons.article, Colors.orange),
                  _buildSystemMetric('System Uptime', '99.9%', Icons.flash_on, Colors.purple),
                ],
              ),
              
              SizedBox(height: 24),
              
              // System Status Cards
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    flex: 2,
                    child: Card(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'System Health',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 16),
                            
                            _buildHealthStatus('Database', true),
                            _buildHealthStatus('API Gateway', true),
                            _buildHealthStatus('Cache Layer', true),
                            _buildHealthStatus('File Storage', true),
                            _buildHealthStatus('Payment Gateway', true),
                            _buildHealthStatus('External Services', false),
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
                              'Quick Actions',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 16),
                            
                            _buildQuickAction('System Maintenance', Icons.build, () {}),
                            _buildQuickAction('User Management', Icons.people_alt_outlined, () {}),
                            _buildQuickAction('Audit Logs', Icons.list_alt_outlined, () {}),
                            _buildQuickAction('Security Settings', Icons.lock_outline, () {}),
                            _buildQuickAction('System Configuration', Icons.settings_outlined, () {}),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Platform Analytics
              Text(
                'Platform Analytics',
                style: TextStyle(
                  fontSize: 20,
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
                              'User Growth',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 12),
                            _buildSimpleGraph([80, 85, 90, 92, 95, 97, 100], Colors.blue),
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
                              'Content Engagement',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 12),
                            _buildSimpleGraph([70, 75, 80, 82, 85, 88, 90], Colors.green),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Recent Activities
              Text(
                'Recent Activities',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      _buildActivityRow('System Update', 'v2.4.1 deployed', '10 min ago', Colors.blue),
                      _buildActivityRow('Security Scan', 'Completed successfully', '25 min ago', Colors.green),
                      _buildActivityRow('User Report', 'High activity alert', '1 hour ago', Colors.orange),
                      _buildActivityRow('Maintenance', 'Database optimization', '2 hours ago', Colors.purple),
                      _buildActivityRow('Incident', 'External service failure', '4 hours ago', Colors.red),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSystemMetric(String title, String value, IconData icon, Color color) {
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

  Widget _buildHealthStatus(String service, bool healthy) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(
            healthy ? Icons.check_circle : Icons.warning,
            color: healthy ? Colors.green : Colors.red,
          ),
          SizedBox(width: 8),
          Text(service),
          Spacer(),
          Text(
            healthy ? 'Operational' : 'Issues',
            style: TextStyle(
              color: healthy ? Colors.green : Colors.red,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickAction(String title, IconData icon, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: Colors.blue),
      title: Text(title),
      trailing: Icon(Icons.arrow_forward_ios, size: 16),
      onTap: onTap,
    );
  }

  Widget _buildSimpleGraph(List<int> values, Color color) {
    return Container(
      height: 100,
      child: CustomPaint(
        painter: SimpleGraphPainter(values, color),
        size: Size.infinite,
      ),
    );
  }

  Widget _buildActivityRow(String title, String description, String time, Color color) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 12.0),
      child: Row(
        children: [
          Container(
            width: 8,
            height: 8,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: color,
            ),
          ),
          SizedBox(width: 12),
          Expanded(
            flex: 2,
            child: Text(
              title,
              style: TextStyle(
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              description,
              style: TextStyle(
                color: Colors.grey[600],
              ),
            ),
          ),
          Expanded(
            child: Text(
              time,
              style: TextStyle(
                color: Colors.grey[500],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class SimpleGraphPainter extends CustomPainter {
  final List<int> values;
  final Color color;

  SimpleGraphPainter(this.values, this.color);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    final points = <Offset>[];

    for (int i = 0; i < values.length; i++) {
      final x = (size.width / (values.length - 1)) * i;
      final y = size.height - (values[i] / 100) * size.height;
      points.add(Offset(x, y));
    }

    if (points.length > 1) {
      canvas.drawPoints(PointMode.polygon, points, paint);
    }

    // Draw data points
    final circlePaint = Paint()
      ..color = color
      ..style = PaintingStyle.fill;

    for (final point in points) {
      canvas.drawCircle(point, 3, circlePaint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}