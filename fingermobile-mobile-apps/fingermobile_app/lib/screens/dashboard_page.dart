import 'package:flutter/material.dart';

class DashboardPage extends StatefulWidget {
  @override
  _DashboardPageState createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Dashboard'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.notifications),
            onPressed: () {
              Navigator.pushNamed(context, '/notifications');
            },
          ),
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: () {
              Navigator.pushNamed(context, '/settings');
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
              'Dashboard',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Your platform overview',
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
                    child: _buildMetricCard('1.2K', 'Total Posts', Icons.post_add, Colors.blue),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricCard('342', 'New Followers', Icons.people, Colors.green),
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
                    child: _buildMetricCard('84.5K', 'Total Views', Icons.visibility, Colors.orange),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricCard('24.8K', 'Engagement', Icons.favorite, Colors.purple),
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
                crossAxisCount: 4,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1.0,
                physics: NeverScrollableScrollPhysics(), // Disable scrolling for grid view
                children: [
                  _buildQuickAction(Icons.post_add, 'New Post', () {
                    Navigator.pushNamed(context, '/create-scheduled-content');
                  }),
                  _buildQuickAction(Icons.chat, 'Messages', () {
                    // Navigate to messages
                  }),
                  _buildQuickAction(Icons.trending_up, 'Analytics', () {
                    Navigator.pushNamed(context, '/content-analytics');
                  }),
                  _buildQuickAction(Icons.monetization_on, 'Earnings', () {
                    Navigator.pushNamed(context, '/wallet');
                  }),
                ],
              ),
            ),
            SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Recent Activity',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                TextButton(
                  onPressed: () {},
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
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: Colors.grey[200],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          index % 2 == 0 
                            ? Icons.post_add 
                            : index % 3 == 0 
                              ? Icons.notifications 
                              : Icons.favorite,
                          color: Colors.deepPurple,
                        ),
                      ),
                      title: Text(
                        index % 2 == 0 
                          ? 'New Post Published' 
                          : index % 3 == 0 
                            ? 'New Notification' 
                            : 'New Like Received',
                      ),
                      subtitle: Text(
                        index % 2 == 0 
                          ? 'Your post was published successfully' 
                          : index % 3 == 0 
                            ? 'You have 3 new notifications' 
                            : 'Someone liked your content',
                      ),
                      trailing: Text(
                        '${index + 1}h ago',
                        style: TextStyle(color: Colors.grey),
                      ),
                      onTap: () {
                        // Navigate to activity details
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