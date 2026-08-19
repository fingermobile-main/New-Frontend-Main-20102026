import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class CommunityMonetizationDashboard extends StatefulWidget {
  @override
  _CommunityMonetizationDashboardState createState() => _CommunityMonetizationDashboardState();
}

class _CommunityMonetizationDashboardState extends State<CommunityMonetizationDashboard> {
  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Community Monetization',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header section
              Text(
                'Community Monetization Overview',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              
              // Stats grid
              GridView.count(
                crossAxisCount: 4,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                children: [
                  _buildStatCard('Total Revenue', '\$42,560', Icons.attach_money, Colors.green),
                  _buildStatCard('Active Members', '12,450', Icons.people, Colors.blue),
                  _buildStatCard('Conversion Rate', '3.2%', Icons.trending_up, Colors.orange),
                  _buildStatCard('Avg. Spend', '\$3.42', Icons.monetization_on, Colors.purple),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Charts section
              Row(
                children: [
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Revenue by Source',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            Container(
                              height: 200,
                              child: _buildRevenueChart(),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Member Engagement',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            _buildEngagementList(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Monetization tools
              Text(
                'Monetization Tools',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildMonetizationTools(),
              
              SizedBox(height: 24),
              
              // Revenue streams
              Text(
                'Revenue Streams',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildRevenueStreams(),
              
              SizedBox(height: 24),
              
              // Community Insights
              Text(
                'Community Insights',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildCommunityInsights(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: color),
                SizedBox(width: 8),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
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
          ],
        ),
      ),
    );
  }

  Widget _buildRevenueChart() {
    return Container(
      child: CustomPaint(
        painter: RevenueChartPainter(),
        size: Size.infinite,
      ),
    );
  }

  Widget _buildEngagementList() {
    final engagementTypes = [
      {'type': 'Premium Members', 'value': 18.5},
      {'type': 'Subscriptions', 'value': 24.2},
      {'type': 'Purchases', 'value': 32.1},
      {'type': 'Donations', 'value': 12.7},
      {'type': 'Ads Viewed', 'value': 45.3},
    ];

    return Column(
      children: engagementTypes.map((item) {
        return Padding(
          padding: EdgeInsets.symmetric(vertical: 6),
          child: Row(
            children: [
              Expanded(
                flex: 2,
                child: Text(item['type']!),
              ),
              Expanded(
                child: LinearProgressIndicator(
                  value: item['value']! / 100,
                  backgroundColor: Colors.grey[300],
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.green),
                ),
              ),
              SizedBox(width: 8),
              Text('${item['value']}%'),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildMonetizationTools() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildToolCard('Membership Plans', Icons.card_membership, Colors.blue),
                _buildToolCard('Subscription Tiers', Icons.auto_graph, Colors.green),
                _buildToolCard('Virtual Goods', Icons.shopping_bag, Colors.orange),
                _buildToolCard('Donation Tools', Icons.volunteer_activism, Colors.purple),
              ],
            ),
            SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildToolCard('Ad Revenue', Icons.ads_click, Colors.red),
                _buildToolCard('Sponsorships', Icons.workspace_premium, Colors.teal),
                _buildToolCard('Events', Icons.event, Colors.indigo),
                _buildToolCard('Merchandise', Icons.store, Colors.brown),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRevenueStreams() {
    final streams = [
      {'name': 'Subscriptions', 'revenue': '\$18,450', 'change': '+12%'},
      {'name': 'Virtual Goods', 'revenue': '\$12,300', 'change': '+8%'},
      {'name': 'Ads Revenue', 'revenue': '\$8,250', 'change': '+5%'},
      {'name': 'Sponsorships', 'revenue': '\$3,560', 'change': '+15%'},
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Revenue Stream')),
          DataColumn(label: Text('Revenue')),
          DataColumn(label: Text('Change')),
        ],
        rows: streams.map((stream) {
          return DataRow(
            cells: [
              DataCell(Text(stream['name']!)),
              DataCell(Text(stream['revenue']!)),
              DataCell(Text(
                stream['change']!,
                style: TextStyle(
                  color: stream['change']!.startsWith('+') ? Colors.green : Colors.red,
                ),
              )),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildCommunityInsights() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Top Performing Communities',
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                    fontSize: 16,
                  ),
                ),
                TextButton(
                  onPressed: () {},
                  child: Text('View All'),
                ),
              ],
            ),
            SizedBox(height: 12),
            _buildCommunityList(),
          ],
        ),
      ),
    );
  }

  Widget _buildCommunityList() {
    final communities = [
      {'name': 'Tech Enthusiasts', 'members': '2,450', 'revenue': '\$4,250'},
      {'name': 'Fitness Lovers', 'members': '1,875', 'revenue': '\$3,120'},
      {'name': 'Art Community', 'members': '1,560', 'revenue': '\$2,890'},
      {'name': 'Gaming Zone', 'members': '3,240', 'revenue': '\$5,670'},
    ];

    return Column(
      children: communities.map((community) {
        return Padding(
          padding: EdgeInsets.symmetric(vertical: 8),
          child: Row(
            children: [
              Expanded(
                flex: 3,
                child: Text(community['name']!),
              ),
              Expanded(
                child: Text(community['members']!),
              ),
              Expanded(
                child: Text(community['revenue']!),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildToolCard(String title, IconData icon, Color color) {
    return Expanded(
      child: Card(
        child: InkWell(
          onTap: () {},
          child: Padding(
            padding: EdgeInsets.all(12),
            child: Column(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, color: color),
                ),
                SizedBox(height: 8),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class RevenueChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.shortestSide / 2;

    final colors = [Colors.green, Colors.blue, Colors.orange, Colors.purple, Colors.red];
    final values = [35, 25, 20, 15, 5]; // Total = 100%

    double startAngle = -90 * (3.14159 / 180); // Start from top

    for (int i = 0; i < values.length; i++) {
      final sweepAngle = (values[i] / 100) * 360 * (3.14159 / 180);
      
      final paint = Paint()
        ..color = colors[i]
        ..style = PaintingStyle.fill;

      canvas.drawArc(
        Rect.fromCircle(center: center, radius: radius),
        startAngle,
        sweepAngle,
        true,
        paint,
      );

      startAngle += sweepAngle;
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}