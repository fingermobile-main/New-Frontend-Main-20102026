import 'package:flutter/material.dart';

class ReportsPage extends StatefulWidget {
  @override
  _ReportsPageState createState() => _ReportsPageState();
}

class _ReportsPageState extends State<ReportsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Reports'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Reports Dashboard',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Review and manage member reports',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 20),
            Container(
              height: 150,
              child: Row(
                children: [
                  Expanded(
                    child: _buildStatCard('124', 'Total Reports', Icons.flag, Colors.orange),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard('89', 'Pending', Icons.pending, Colors.blue),
                  ),
                ],
              ),
            ),
            SizedBox(height: 12),
            Container(
              height: 150,
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
              'Recent Reports',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: 6,
                itemBuilder: (context, index) {
                  return Card(
                    elevation: 1,
                    margin: EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: index % 2 == 0 ? Colors.orange[100] : Colors.red[100],
                        child: Icon(
                          index % 2 == 0 ? Icons.flag : Icons.warning,
                          color: index % 2 == 0 ? Colors.orange : Colors.red,
                        ),
                      ),
                      title: Text(
                        index % 2 == 0 ? 'Content Report' : 'member Report',
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      subtitle: Text(
                        index % 2 == 0 
                          ? 'Reported content $index for inappropriate content' 
                          : 'Reported member $index for spam',
                      ),
                      trailing: Container(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: index % 2 == 0 ? Colors.orange[50] : Colors.red[50],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          index % 2 == 0 ? 'PENDING' : 'VIOLATION',
                          style: TextStyle(
                            fontSize: 12,
                            color: index % 2 == 0 ? Colors.orange[800] : Colors.red[800],
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      onTap: () {
                        // Navigate to report details
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
                Icon(icon, color: color, size: 32),
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
            SizedBox(height: 4),
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
}