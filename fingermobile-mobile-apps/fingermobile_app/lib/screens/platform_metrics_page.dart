import 'package:flutter/material.dart';

class PlatformMetricsPage extends StatefulWidget {
  @override
  _PlatformMetricsPageState createState() => _PlatformMetricsPageState();
}

class _PlatformMetricsPageState extends State<PlatformMetricsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Platform Metrics'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: () {
              // Refresh metrics
            },
          ),
          IconButton(
            icon: Icon(Icons.filter_list),
            onPressed: () {
              // Show filter options
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
              'Platform Metrics',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Key performance indicators and metrics',
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
                    child: _buildMetricCard('12.4K', 'Total members', Icons.people, Colors.blue),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricCard('3.2K', 'Active members', Icons.check_circle, Colors.green),
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
                    child: _buildMetricCard('842', 'Daily Sessions', Icons.access_time, Colors.orange),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricCard('24.5%', 'Engagement Rate', Icons.trending_up, Colors.purple),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),
            Container(
              height: 120,
              child: Row(
                children: [
                  Expanded(
                    child: _buildMetricCard('3.2K', 'Total Posts', Icons.post_add, Colors.blue),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricCard('\$24.8K', 'Revenue', Icons.attach_money, Colors.green),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),
            Text(
              'Platform Performance',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Expanded(
              child: ListView(
                children: [
                  _buildPerformanceCard(
                    'API Response Time',
                    'Average: 120ms',
                    '95th Percentile: 250ms',
                    Icons.speed,
                    Colors.blue,
                  ),
                  SizedBox(height: 12),
                  _buildPerformanceCard(
                    'Database Performance',
                    'Average Query Time: 45ms',
                    'Slow Queries: 2',
                    Icons.storage,
                    Colors.green,
                  ),
                  SizedBox(height: 12),
                  _buildPerformanceCard(
                    'System Uptime',
                    '99.98% this month',
                    'Last downtime: Dec 20, 2025',
                    Icons.timelapse,
                    Colors.orange,
                  ),
                  SizedBox(height: 12),
                  _buildPerformanceCard(
                    'Error Rate',
                    '0.02% of requests',
                    'Most common: 404 errors',
                    Icons.error,
                    Colors.red,
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

  Widget _buildPerformanceCard(
    String title,
    String primaryValue,
    String secondaryValue,
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
                    primaryValue,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[700],
                    ),
                  ),
                  SizedBox(height: 2),
                  Text(
                    secondaryValue,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
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