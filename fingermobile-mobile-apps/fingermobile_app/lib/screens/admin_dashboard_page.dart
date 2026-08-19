import 'package:flutter/material.dart';

class AdminDashboardPage extends StatefulWidget {
  @override
  _AdminDashboardPageState createState() => _AdminDashboardPageState();
}

class _AdminDashboardPageState extends State<AdminDashboardPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Admin Dashboard'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.notifications),
            onPressed: () {},
          ),
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () {},
          ),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Admin Dashboard',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Welcome back, Admin',
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
                    child: _buildStatCard('12.4K', 'members', Icons.people, Colors.blue),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard('3.2K', 'Posts', Icons.post_add, Colors.green),
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
                    child: _buildStatCard('842', 'Orders', Icons.shopping_cart, Colors.orange),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildStatCard('\$24.8K', 'Revenue', Icons.attach_money, Colors.purple),
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
            GridView.count(
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.3,
              children: [
                _buildQuickActionCard(
                  Icons.people,
                  'member Management',
                  'Manage member accounts and permissions',
                  Colors.blue,
                  () {},
                ),
                _buildQuickActionCard(
                  Icons.post_add,
                  'Content Moderation',
                  'Review and moderate content',
                  Colors.green,
                  () {},
                ),
                _buildQuickActionCard(
                  Icons.shopping_cart,
                  'Order Management',
                  'Manage orders and transactions',
                  Colors.orange,
                  () {},
                ),
                _buildQuickActionCard(
                  Icons.analytics,
                  'Analytics',
                  'View platform analytics',
                  Colors.purple,
                  () {},
                ),
              ],
            ),
            SizedBox(height: 20),
            Text(
              'Recent Activity',
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
                      leading: CircleAvatar(
                        backgroundColor: index % 2 == 0 ? Colors.green[100] : Colors.blue[100],
                        child: Icon(
                          index % 2 == 0 ? Icons.person_add : Icons.post_add,
                          color: index % 2 == 0 ? Colors.green : Colors.blue,
                        ),
                      ),
                      title: Text(
                        index % 2 == 0 ? 'New member registered' : 'New post published',
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      subtitle: Text('2 hours ago'),
                      trailing: Icon(Icons.arrow_forward_ios, size: 16),
                      onTap: () {},
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

  Widget _buildQuickActionCard(
    IconData icon,
    String title,
    String subtitle,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Icon(
                  icon,
                  color: color,
                  size: 20,
                ),
              ),
              SizedBox(height: 12),
              Text(
                title,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
              SizedBox(height: 4),
              Text(
                subtitle,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
}