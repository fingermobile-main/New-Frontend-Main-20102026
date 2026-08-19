import 'package:flutter/material.dart';

class DatabaseIntegrationDashboard extends StatefulWidget {
  @override
  _DatabaseIntegrationDashboardState createState() => _DatabaseIntegrationDashboardState();
}

class _DatabaseIntegrationDashboardState extends State<DatabaseIntegrationDashboard> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Database Integration'),
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
            icon: Icon(Icons.settings),
            onPressed: () {
              // Show settings
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
              'Database Integration Dashboard',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Monitor and manage database integrations',
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
                    child: _buildMetricCard('7', 'Connected Databases', Icons.storage, Colors.blue),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricCard('24.8K', 'Daily Queries', Icons.query_stats, Colors.green),
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
                    child: _buildMetricCard('99.98%', 'Uptime', Icons.timelapse, Colors.orange),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricCard('45ms', 'Avg. Response', Icons.speed, Colors.purple),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),
            Text(
              'Database Status',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Expanded(
              child: ListView(
                children: [
                  _buildDatabaseStatus(
                    'Identity DB',
                    'fingermobile_identity_db',
                    'Operational',
                    Icons.check_circle,
                    Colors.green,
                  ),
                  SizedBox(height: 12),
                  _buildDatabaseStatus(
                    'Content DB',
                    'fingermobile_content_db',
                    'Operational',
                    Icons.check_circle,
                    Colors.green,
                  ),
                  SizedBox(height: 12),
                  _buildDatabaseStatus(
                    'Social DB',
                    'fingermobile_social_db',
                    'Operational',
                    Icons.check_circle,
                    Colors.green,
                  ),
                  SizedBox(height: 12),
                  _buildDatabaseStatus(
                    'Monetization DB',
                    'fingermobile_monetization_db',
                    'Operational',
                    Icons.check_circle,
                    Colors.green,
                  ),
                  SizedBox(height: 12),
                  _buildDatabaseStatus(
                    'Analytics DB',
                    'fingermobile_analytics_db',
                    'Operational',
                    Icons.check_circle,
                    Colors.green,
                  ),
                  SizedBox(height: 12),
                  _buildDatabaseStatus(
                    'Communication DB',
                    'fingermobile_communication_db',
                    'Operational',
                    Icons.check_circle,
                    Colors.green,
                  ),
                  SizedBox(height: 12),
                  _buildDatabaseStatus(
                    'Control DB',
                    'fingermobile_control_db',
                    'Operational',
                    Icons.check_circle,
                    Colors.green,
                  ),
                ],
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

  Widget _buildDatabaseStatus(
    String name,
    String identifier,
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
                    name,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    identifier,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[700],
                    ),
                  ),
                  SizedBox(height: 2),
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      status,
                      style: TextStyle(
                        color: color,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              icon: Icon(Icons.arrow_forward_ios),
              onPressed: () {
                // Navigate to database details
              },
            ),
          ],
        ),
      ),
    );
  }
}