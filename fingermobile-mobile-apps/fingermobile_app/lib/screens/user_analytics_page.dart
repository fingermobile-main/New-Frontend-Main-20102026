import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

class memberAnalyticsPage extends StatefulWidget {
  const memberAnalyticsPage({super.key});

  @override
  State<memberAnalyticsPage> createState() => _memberAnalyticsPageState();
}

class _memberAnalyticsPageState extends State<memberAnalyticsPage> {
  // Sample data for charts
  final List<ChartData> _engagementData = [
    ChartData('Mon', 20),
    ChartData('Tue', 35),
    ChartData('Wed', 30),
    ChartData('Thu', 45),
    ChartData('Fri', 50),
    ChartData('Sat', 40),
    ChartData('Sun', 55),
  ];

  final List<ChartData> _followersData = [
    ChartData('Jan', 120),
    ChartData('Feb', 180),
    ChartData('Mar', 250),
    ChartData('Apr', 320),
    ChartData('May', 400),
    ChartData('Jun', 520),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('member Analytics'),
        centerTitle: false,
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Engagement metrics cards
              const Text(
                'Engagement Metrics',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 12,
                children: [
                  _buildMetricCard('Total Views', '2.4K', Icons.visibility),
                  _buildMetricCard('Likes', '456', Icons.thumb_up),
                  _buildMetricCard('Comments', '128', Icons.comment),
                  _buildMetricCard('Shares', '89', Icons.share),
                ],
              ),
              const SizedBox(height: 24),
              
              // Engagement chart
              const Text(
                'Engagement Over Time',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              Container(
                height: 250,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey.withOpacity(0.3)),
                ),
                child: SfCartesianChart(
                  primaryXAxis: const CategoryAxis(),
                  primaryYAxis: NumericAxis(
                    minimum: 0,
                    maximum: 60,
                    interval: 15,
                  ),
                  series: <ChartSeries>[
                    LineSeries<ChartData, String>(
                      dataSource: _engagementData,
                      xValueMapper: (ChartData data, _) => data.x,
                      yValueMapper: (ChartData data, _) => data.y,
                      color: Colors.deepPurple,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              
              // Followers metrics
              const Text(
                'Followers Growth',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              Container(
                height: 250,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey.withOpacity(0.3)),
                ),
                child: SfCartesianChart(
                  primaryXAxis: const CategoryAxis(),
                  primaryYAxis: NumericAxis(
                    minimum: 0,
                    maximum: 600,
                    interval: 100,
                  ),
                  series: <ChartSeries>[
                    SplineSeries<ChartData, String>(
                      dataSource: _followersData,
                      xValueMapper: (ChartData data, _) => data.x,
                      yValueMapper: (ChartData data, _) => data.y,
                      color: Colors.green,
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
              
              // Top performing content
              const Text(
                'Top Performing Content',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              _buildTopContentCard('New Product Launch', '1.2K views', Icons.emoji_events),
              _buildTopContentCard('Behind the Scenes', '890 views', Icons.emoji_events),
              _buildTopContentCard('Tutorial Video', '765 views', Icons.emoji_events),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricCard(String title, String value, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.grey[100],
          borderRadius: BorderRadius.circular(8),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: Colors.deepPurple),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 14,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              value,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopContentCard(String title, String subtitle, IconData icon) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Icon(icon, color: Colors.orange),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
      ),
    );
  }
}

class ChartData {
  ChartData(this.x, this.y);
  final String x;
  final double y;
}