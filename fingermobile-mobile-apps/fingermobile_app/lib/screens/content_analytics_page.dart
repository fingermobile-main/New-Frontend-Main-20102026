import 'package:flutter/material.dart';

class ContentAnalyticsPage extends StatefulWidget {
  @override
  _ContentAnalyticsPageState createState() => _ContentAnalyticsPageState();
}

class _ContentAnalyticsPageState extends State<ContentAnalyticsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Content Analytics'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Content Performance',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 20),
            Card(
              elevation: 2,
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStatCard('Total Views', '1,245', Icons.visibility, Colors.blue),
                    _buildStatCard('Engagement', '24.5%', Icons.bar_chart, Colors.green),
                  ],
                ),
              ),
            ),
            SizedBox(height: 20),
            Card(
              elevation: 2,
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStatCard('Top Post', '245 views', Icons.trending_up, Colors.orange),
                    _buildStatCard('Avg. Time', '2m 34s', Icons.access_time, Colors.purple),
                  ],
                ),
              ),
            ),
            SizedBox(height: 20),
            Text(
              'Engagement Overview',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 12),
            Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey[300]!),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Center(
                child: Text(
                  'Analytics Chart\nComing Soon',
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 16,
                  ),
                ),
              ),
            ),
            SizedBox(height: 20),
            Text(
              'Top Performing Content',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 12),
            Expanded(
              child: ListView.builder(
                shrinkWrap: true,
                itemCount: 5,
                itemBuilder: (context, index) {
                  return Card(
                    elevation: 1,
                    margin: EdgeInsets.only(bottom: 10),
                    child: ListTile(
                      leading: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Colors.blue[50],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          index % 2 == 0 ? Icons.post_add : Icons.video_library,
                          color: Colors.blue,
                        ),
                      ),
                      title: Text('Content Title $index'),
                      subtitle: Text('${125 - (index * 15)} views'),
                      trailing: Text('${25 - (index * 3)}% engagement'),
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

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Container(
      width: 150,
      child: Column(
        children: [
          Icon(icon, size: 36, color: color),
          SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 4),
          Text(
            title,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey,
            ),
          ),
        ],
      ),
    );
  }
}