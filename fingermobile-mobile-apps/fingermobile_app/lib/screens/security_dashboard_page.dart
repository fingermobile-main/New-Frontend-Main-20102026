import 'package:flutter/material.dart';

class SecurityDashboardPage extends StatefulWidget {
  @override
  _SecurityDashboardPageState createState() => _SecurityDashboardPageState();
}

class _SecurityDashboardPageState extends State<SecurityDashboardPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Security Dashboard'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: () {
              // Refresh dashboard
            },
          ),
          IconButton(
            icon: Icon(Icons.notifications),
            onPressed: () {
              // Show security alerts
            },
          ),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Security Dashboard',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Monitor security events and threats',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 20),
            Container(
              height: 120,
              child: Row(
                children: [
                  Expanded(
                    child: _buildMetricCard('24', 'Threats Blocked', Icons.block, Colors.red),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricCard('3.2K', 'Login Attempts', Icons.login, Colors.blue),
                  ),
                ],
              ),
            ),
            SizedBox(height: 12),
            Container(
              height: 120,
              child: Row(
                children: [
                  Expanded(
                    child: _buildMetricCard('0', 'Active Threats', Icons.warning, Colors.orange),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricCard('99.9%', 'Security Uptime', Icons.shield, Colors.green),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),
            Text(
              'Security Status',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            _buildSecurityStatusCard(
              'Authentication',
              'All systems operational',
              Icons.verified_member,
              Colors.green,
            ),
            SizedBox(height: 12),
            _buildSecurityStatusCard(
              'Data Encryption',
              'AES-256 encryption active',
              Icons.lock,
              Colors.green,
            ),
            SizedBox(height: 12),
            _buildSecurityStatusCard(
              'Firewall',
              'All rules active and updated',
              Icons.security,
              Colors.green,
            ),
            SizedBox(height: 12),
            _buildSecurityStatusCard(
              'API Security',
              'Rate limiting active',
              Icons.http,
              Colors.green,
            ),
            SizedBox(height: 20),
            Text(
              'Recent Security Events',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: 5,
                itemBuilder: (context, index) {
                  String event = index == 0 ? 'Successful login from new device' :
                                index == 1 ? 'Failed login attempt blocked' :
                                index == 2 ? 'Security scan completed' :
                                index == 3 ? 'New 2FA device registered' :
                                'Security policy updated';
                  
                  IconData icon = index == 0 ? Icons.login : 
                                 index == 1 ? Icons.block : 
                                 index == 2 ? Icons.check_circle : 
                                 index == 3 ? Icons.phonelink_setup : 
                                 Icons.settings;
                                 
                  Color color = index == 0 ? Colors.green : 
                                index == 1 ? Colors.orange : 
                                index == 2 ? Colors.blue : 
                                index == 3 ? Colors.green : 
                                Colors.purple;
                  
                  return Card(
                    elevation: 1,
                    margin: EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      leading: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: color.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(icon, color: color),
                      ),
                      title: Text(event),
                      subtitle: Text('Today, ${10 + index}:3${index} AM'),
                      trailing: Icon(Icons.arrow_forward_ios, size: 16),
                      onTap: () {
                        // Show event details
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard(String value, String label, IconData icon, Color color) {
    return Card(
      elevation: 2,
      child: Container(
        padding: EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Icon(icon, color: color, size: 30),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSecurityStatusCard(
    String title,
    String status,
    IconData icon,
    Color color,
  ) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: color),
            ),
            SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    status,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[700],
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
}