import 'package:flutter/material.dart';

class ContentModerationPage extends StatefulWidget {
  @override
  _ContentModerationPageState createState() => _ContentModerationPageState();
}

class _ContentModerationPageState extends State<ContentModerationPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Content Moderation'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Content Moderation',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Manage reported content and member reports',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 20),
            Container(
              height: 100,
              child: Row(
                children: [
                  Expanded(
                    child: _buildStatCard('124', 'Reports', Icons.flag, Colors.orange),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard('89', 'Pending', Icons.pending, Colors.blue),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),
            Container(
              height: 100,
              child: Row(
                children: [
                  Expanded(
                    child: _buildStatCard('32', 'Resolved', Icons.check_circle, Colors.green),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard('3', 'Violations', Icons.warning, Colors.red),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),
            Text(
              'Moderation Queue',
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
                  return Card(
                    elevation: 2,
                    margin: EdgeInsets.only(bottom: 12),
                    child: ExpansionTile(
                      title: Row(
                        children: [
                          Container(
                            padding: EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: index % 2 == 0 ? Colors.orange[100] : Colors.red[100],
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              index % 2 == 0 ? 'REPORT' : 'VIOLATION',
                              style: TextStyle(
                                fontSize: 10,
                                color: index % 2 == 0 ? Colors.orange[800] : Colors.red[800],
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          SizedBox(width: 12),
                          Text('Content $index'),
                        ],
                      ),
                      subtitle: Text('Reported by member$index • 2 hours ago'),
                      children: [
                        Padding(
                          padding: EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Reported Reason: ${index % 2 == 0 ? 'Inappropriate Content' : 'Copyright Violation'}',
                                style: TextStyle(
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              SizedBox(height: 8),
                              Text(
                                'This content was reported for violating community guidelines. Please review and take appropriate action.',
                                style: TextStyle(
                                  color: Colors.grey[600],
                                ),
                              ),
                              SizedBox(height: 16),
                              Row(
                                children: [
                                  Expanded(
                                    child: ElevatedButton(
                                      onPressed: () {
                                        // Approve content
                                      },
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.green,
                                        foregroundColor: Colors.white,
                                      ),
                                      child: Text('Approve'),
                                    ),
                                  ),
                                  SizedBox(width: 12),
                                  Expanded(
                                    child: ElevatedButton(
                                      onPressed: () {
                                        // Remove content
                                      },
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.red,
                                        foregroundColor: Colors.white,
                                      ),
                                      child: Text('Remove'),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
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

  Widget _buildStatCard(String value, String label, IconData icon, Color color) {
    return Card(
      elevation: 2,
      child: Container(
        padding: EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(icon, color: color, size: 28),
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
            SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }
}