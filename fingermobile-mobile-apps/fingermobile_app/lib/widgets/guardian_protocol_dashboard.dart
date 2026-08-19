import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class GuardianProtocolDashboard extends StatefulWidget {
  @override
  _GuardianProtocolDashboardState createState() => _GuardianProtocolDashboardState();
}

class _GuardianProtocolDashboardState extends State<GuardianProtocolDashboard> {
  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Guardian Protocol',
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
                    colors: [Colors.indigo[600]!, Colors.indigo[800]!],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Guardian Protocol Dashboard',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Security and safety protocols monitoring',
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
                  _buildStatCard('Active Protocols', '24', Icons.shield, Colors.blue),
                  _buildStatCard('Security Events', '12', Icons.warning, Colors.orange),
                  _buildStatCard('Threat Level', 'Medium', Icons.security, Colors.red),
                  _buildStatCard('Uptime', '99.9%', Icons.check_circle, Colors.green),
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
                              'Security Events Timeline',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            Container(
                              height: 200,
                              child: _buildSecurityTimeline(),
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
                              'Protocol Status',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            _buildProtocolStatus(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Active protocols
              Text(
                'Active Protocols',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildActiveProtocolsList(),
              
              SizedBox(height: 24),
              
              // Security alerts
              Text(
                'Security Alerts',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildSecurityAlertsList(),
              
              SizedBox(height: 24),
              
              // Compliance status
              Text(
                'Compliance Status',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildComplianceStatus(),
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

  Widget _buildSecurityTimeline() {
    return Container(
      child: CustomPaint(
        painter: SecurityTimelinePainter(),
        size: Size.infinite,
      ),
    );
  }

  Widget _buildProtocolStatus() {
    final protocols = [
      {'name': 'Authentication', 'status': 'Active', 'level': 0.9},
      {'name': 'Encryption', 'status': 'Active', 'level': 1.0},
      {'name': 'Firewall', 'status': 'Active', 'level': 0.85},
      {'name': 'Monitoring', 'status': 'Active', 'level': 0.95},
    ];

    return Column(
      children: protocols.map((protocol) {
        return Padding(
          padding: EdgeInsets.symmetric(vertical: 6),
          child: Row(
            children: [
              Expanded(
                flex: 2,
                child: Text(protocol['name']!),
              ),
              Expanded(
                child: LinearProgressIndicator(
                  value: protocol['level']!,
                  backgroundColor: Colors.grey[300],
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.indigo),
                ),
              ),
              SizedBox(width: 8),
              Text(
                protocol['status']!,
                style: TextStyle(
                  color: Colors.green,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildActiveProtocolsList() {
    final protocols = [
      {'name': 'User Verification', 'type': 'Authentication', 'status': 'Active', 'lastCheck': '2 min ago'},
      {'name': 'Content Moderation', 'type': 'Safety', 'status': 'Active', 'lastCheck': '5 min ago'},
      {'name': 'Data Encryption', 'type': 'Privacy', 'status': 'Active', 'lastCheck': '1 min ago'},
      {'name': 'Access Control', 'type': 'Security', 'status': 'Active', 'lastCheck': '3 min ago'},
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Protocol')),
          DataColumn(label: Text('Type')),
          DataColumn(label: Text('Status')),
          DataColumn(label: Text('Last Check')),
          DataColumn(label: Text('Details')),
        ],
        rows: protocols.map((protocol) {
          return DataRow(
            cells: [
              DataCell(Text(protocol['name']!)),
              DataCell(Text(protocol['type']!)),
              DataCell(
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: protocol['status'] == 'Active' 
                        ? Colors.green[100] 
                        : protocol['status'] == 'Warning' 
                            ? Colors.orange[100] 
                            : Colors.red[100],
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    protocol['status']!,
                    style: TextStyle(
                      color: protocol['status'] == 'Active' 
                          ? Colors.green[800] 
                          : protocol['status'] == 'Warning' 
                              ? Colors.orange[800] 
                              : Colors.red[800],
                    ),
                  ),
                ),
              ),
              DataCell(Text(protocol['lastCheck']!)),
              DataCell(
                IconButton(
                  icon: Icon(Icons.info, color: Colors.blue),
                  onPressed: () {},
                ),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildSecurityAlertsList() {
    final alerts = [
      {'severity': 'High', 'type': 'Suspicious Login', 'time': '5 min ago', 'resolved': false},
      {'severity': 'Medium', 'type': 'Content Flagged', 'time': '12 min ago', 'resolved': true},
      {'severity': 'Low', 'type': 'Rate Limit Exceeded', 'time': '24 min ago', 'resolved': true},
      {'severity': 'High', 'type': 'DDoS Attempt', 'time': '1 hour ago', 'resolved': false},
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Severity')),
          DataColumn(label: Text('Type')),
          DataColumn(label: Text('Time')),
          DataColumn(label: Text('Status')),
          DataColumn(label: Text('Action')),
        ],
        rows: alerts.map((alert) {
          return DataRow(
            cells: [
              DataCell(
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: alert['severity'] == 'High' 
                        ? Colors.red[100] 
                        : alert['severity'] == 'Medium' 
                            ? Colors.orange[100] 
                            : Colors.yellow[100],
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    alert['severity']!,
                    style: TextStyle(
                      color: alert['severity'] == 'High' 
                          ? Colors.red[800] 
                          : alert['severity'] == 'Medium' 
                              ? Colors.orange[800] 
                              : Colors.yellow[800],
                    ),
                  ),
                ),
              ),
              DataCell(Text(alert['type']!)),
              DataCell(Text(alert['time']!)),
              DataCell(
                Text(
                  alert['resolved'] ? 'Resolved' : 'Open',
                  style: TextStyle(
                    color: alert['resolved'] ? Colors.green : Colors.red,
                  ),
                ),
              ),
              DataCell(
                alert['resolved'] 
                    ? Icon(Icons.check_circle, color: Colors.green)
                    : IconButton(
                        icon: Icon(Icons.report_problem, color: Colors.red),
                        onPressed: () {},
                      ),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildComplianceStatus() {
    final complianceItems = [
      {'name': 'GDPR', 'status': 'Compliant', 'level': 1.0},
      {'name': 'CCPA', 'status': 'Compliant', 'level': 1.0},
      {'name': 'SOC 2', 'status': 'Compliant', 'level': 0.95},
      {'name': 'ISO 27001', 'status': 'Pending', 'level': 0.75},
    ];

    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: complianceItems.map((item) {
            return Padding(
              padding: EdgeInsets.symmetric(vertical: 12),
              child: Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: Text(
                      item['name']!,
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                  Expanded(
                    child: Text(item['status']!),
                  ),
                  Expanded(
                    flex: 2,
                    child: LinearProgressIndicator(
                      value: item['level']!,
                      backgroundColor: Colors.grey[300],
                      valueColor: AlwaysStoppedAnimation<Color>(
                        item['status'] == 'Compliant' ? Colors.green : Colors.orange,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}

class SecurityTimelinePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.indigo
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final points = <Offset>[];

    // Create sample security event timeline data points
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
      ..color = Colors.indigo
      ..style = PaintingStyle.fill;

    for (final point in points) {
      canvas.drawCircle(point, 4, circlePaint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}