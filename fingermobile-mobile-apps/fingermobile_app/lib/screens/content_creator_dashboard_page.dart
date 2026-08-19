import 'package:flutter/material.dart';

class ContentCreatorDashboardPage extends StatefulWidget {
  @override
  _ContentCreatorDashboardPageState createState() => _ContentCreatorDashboardPageState();
}

class _ContentCreatorDashboardPageState extends State<ContentCreatorDashboardPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Creator Dashboard'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.analytics),
            onPressed: () {
              Navigator.pushNamed(context, '/content-analytics');
            },
          ),
          IconButton(
            icon: Icon(Icons.schedule),
            onPressed: () {
              Navigator.pushNamed(context, '/content-schedule');
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
              'Content Creator Dashboard',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Track your content performance',
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
                    child: _buildMetricCard('245', 'Total Posts', Icons.post_add, Colors.blue),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricCard('1.2K', 'Total Views', Icons.visibility, Colors.green),
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
                    child: _buildMetricCard('342', 'New Followers', Icons.people, Colors.orange),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricCard('86', 'Engagement', Icons.favorite, Colors.purple),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),
            Text(
              'Quick Actions',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Container(
              height: 100,
              child: GridView.count(
                crossAxisCount: 3,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1.5,
                physics: NeverScrollableScrollPhysics(),
                children: [
                  _buildQuickAction(Icons.post_add, 'New Post', () {
                    Navigator.pushNamed(context, '/create-scheduled-content');
                  }),
                  _buildQuickAction(Icons.edit, 'Edit Content', () {
                    // Navigate to edit content
                  }),
                  _buildQuickAction(Icons.schedule, 'Schedule', () {
                    Navigator.pushNamed(context, '/content-schedule');
                  }),
                ],
              ),
            ),
            SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Recent Posts',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton(
                  onPressed: () {
                    Navigator.pushNamed(context, '/posts');
                  },
                  child: Text('View All'),
                ),
              ],
            ),
            SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: 5,
                shrinkWrap: true,
                physics: ClampingScrollPhysics(),
                itemBuilder: (context, index) {
                  return Card(
                    elevation: 1,
                    margin: EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      leading: Container(
                        width: 50,
                        height: 50,
                        decoration: BoxDecoration(
                          color: Colors.grey[200],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          Icons.image,
                          color: Colors.deepPurple,
                        ),
                      ),
                      title: Text('Post Title $index'),
                      subtitle: Text('${index + 1} hours ago • ${index * 12} views'),
                      trailing: Icon(Icons.arrow_forward_ios, size: 16),
                      onTap: () {
                        // Navigate to post details
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

  Widget _buildQuickAction(IconData icon, String label, VoidCallback onTap) {
    return Card(
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: EdgeInsets.all(12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: Colors.deepPurple, size: 30),
              SizedBox(height: 8),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}