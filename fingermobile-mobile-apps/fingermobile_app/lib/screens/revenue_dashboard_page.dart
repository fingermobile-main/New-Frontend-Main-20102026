import 'package:flutter/material.dart';

class RevenueDashboardPage extends StatefulWidget {
  @override
  _RevenueDashboardPageState createState() => _RevenueDashboardPageState();
}

class _RevenueDashboardPageState extends State<RevenueDashboardPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Revenue Dashboard'),
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
              'Revenue Dashboard',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Track your earnings and performance',
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
                    child: _buildMetricCard('\$2,480', 'Total Earnings', Icons.attach_money, Colors.green),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricCard('\$420', 'This Month', Icons.trending_up, Colors.blue),
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
                    child: _buildMetricCard('42', 'Total Sales', Icons.shopping_bag, Colors.orange),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: _buildMetricCard('24%', 'Conversion Rate', Icons.bar_chart, Colors.purple),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20),
            Text(
              'Revenue Sources',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            _buildRevenueSource('Subscriptions', 65, Colors.blue, '\$1,620'),
            SizedBox(height: 12),
            _buildRevenueSource('Product Sales', 25, Colors.green, '\$620'),
            SizedBox(height: 12),
            _buildRevenueSource('Advertising', 10, Colors.orange, '\$240'),
            SizedBox(height: 20),
            Text(
              'Recent Transactions',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: 5,
                shrinkWrap: true,
                physics: ClampingScrollPhysics(),
                itemBuilder: (context, index) {
                  String type = index % 2 == 0 ? 'Subscription' : 'Product Sale';
                  String amount = index % 2 == 0 ? '\$19.99' : '\$49.99';
                  Color typeColor = index % 2 == 0 ? Colors.blue : Colors.green;
                  
                  return Card(
                    elevation: 1,
                    margin: EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      leading: Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: typeColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          index % 2 == 0 ? Icons.subscriptions : Icons.shopping_bag,
                          color: typeColor,
                        ),
                      ),
                      title: Text(type),
                      subtitle: Text('Transaction #${1000 + index}'),
                      trailing: Text(
                        amount,
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.green,
                        ),
                      ),
                      onTap: () {
                        // Show transaction details
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

  Widget _buildRevenueSource(String source, int percentage, Color color, String amount) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                Icons.pie_chart,
                color: color,
              ),
            ),
            SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    source,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    '$percentage% of total revenue',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ),
            Text(
              amount,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.green,
              ),
            ),
          ],
        ),
      ),
    );
  }
}