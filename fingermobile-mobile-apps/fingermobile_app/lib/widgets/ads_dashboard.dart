import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class AdsDashboard extends StatefulWidget {
  @override
  _AdsDashboardState createState() => _AdsDashboardState();
}

class _AdsDashboardState extends State<AdsDashboard> {
  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Advertising Dashboard',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header section
              Text(
                'Advertising Performance',
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
                  _buildStatCard('Impressions', '1,245,678', Icons.visibility, Colors.blue),
                  _buildStatCard('Clicks', '45,230', Icons.touch_app, Colors.green),
                  _buildStatCard('CTR', '3.63%', Icons.bar_chart, Colors.orange),
                  _buildStatCard('Revenue', '\$12,450', Icons.attach_money, Colors.purple),
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
                              'Revenue by Ad Type',
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
                              'Ad Performance',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            _buildPerformanceList(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Active campaigns
              Text(
                'Active Campaigns',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildCampaignsList(),
              
              SizedBox(height: 24),
              
              // Ad inventory
              Text(
                'Ad Inventory',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildInventoryList(),
              
              SizedBox(height: 24),
              
              // Quick actions
              Text(
                'Quick Actions',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildQuickActions(),
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

  Widget _buildPerformanceList() {
    final adTypes = [
      {'type': 'Display Ads', 'ctr': 2.8},
      {'type': 'Video Ads', 'ctr': 4.2},
      {'type': 'Native Ads', 'ctr': 3.1},
      {'type': 'Interstitial', 'ctr': 5.6},
      {'type': 'Banner Ads', 'ctr': 2.4},
    ];

    return Column(
      children: adTypes.map((ad) {
        return Padding(
          padding: EdgeInsets.symmetric(vertical: 6),
          child: Row(
            children: [
              Expanded(
                flex: 2,
                child: Text(ad['type']!),
              ),
              Expanded(
                child: LinearProgressIndicator(
                  value: ad['ctr']! / 6,
                  backgroundColor: Colors.grey[300],
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.green),
                ),
              ),
              SizedBox(width: 8),
              Text('${ad['ctr']}%'),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildCampaignsList() {
    final campaigns = [
      {
        'name': 'Summer Sale',
        'status': 'Running',
        'budget': '\$2,500',
        'spent': '\$1,800',
        'impressions': '420,500',
        'clicks': '12,450',
        'ctr': '2.96%'
      },
      {
        'name': 'New Product Launch',
        'status': 'Running',
        'budget': '\$5,000',
        'spent': '\$3,200',
        'impressions': '680,200',
        'clicks': '28,750',
        'ctr': '4.23%'
      },
      {
        'name': 'Holiday Campaign',
        'status': 'Paused',
        'budget': '\$3,000',
        'spent': '\$1,500',
        'impressions': '280,400',
        'clicks': '7,800',
        'ctr': '2.78%'
      },
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Campaign')),
          DataColumn(label: Text('Status')),
          DataColumn(label: Text('Budget')),
          DataColumn(label: Text('Spent')),
          DataColumn(label: Text('Impressions')),
          DataColumn(label: Text('Clicks')),
          DataColumn(label: Text('CTR')),
        ],
        rows: campaigns.map((campaign) {
          return DataRow(
            cells: [
              DataCell(Text(campaign['name']!)),
              DataCell(
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: campaign['status'] == 'Running' ? Colors.green[100] : Colors.orange[100],
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    campaign['status']!,
                    style: TextStyle(
                      color: campaign['status'] == 'Running' ? Colors.green[800] : Colors.orange[800],
                    ),
                  ),
                ),
              ),
              DataCell(Text(campaign['budget']!)),
              DataCell(Text(campaign['spent']!)),
              DataCell(Text(campaign['impressions']!)),
              DataCell(Text(campaign['clicks']!)),
              DataCell(Text(campaign['ctr']!)),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildInventoryList() {
    final inventory = [
      {'position': 'Homepage Banner', 'fill': 85, 'avgCpm': '\$3.20'},
      {'position': 'Sidebar Ad', 'fill': 72, 'avgCpm': '\$2.80'},
      {'position': 'Video Pre-roll', 'fill': 92, 'avgCpm': '\$5.50'},
      {'position': 'In-feed Ad', 'fill': 68, 'avgCpm': '\$2.40'},
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Position')),
          DataColumn(label: Text('Fill Rate')),
          DataColumn(label: Text('Avg. CPM')),
        ],
        rows: inventory.map((item) {
          return DataRow(
            cells: [
              DataCell(Text(item['position']!)),
              DataCell(Row(
                children: [
                  Expanded(
                    child: LinearProgressIndicator(
                      value: item['fill']! / 100,
                      backgroundColor: Colors.grey[300],
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                    ),
                  ),
                  SizedBox(width: 8),
                  Text('${item['fill']}%'),
                ],
              )),
              DataCell(Text(item['avgCpm']!)),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildQuickActions() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Wrap(
          spacing: 16,
          runSpacing: 16,
          children: [
            _buildActionCard('Create Campaign', Icons.add, Colors.blue),
            _buildActionCard('Target Audiences', Icons.people, Colors.green),
            _buildActionCard('Ad Placements', Icons.ad_units, Colors.orange),
            _buildActionCard('Revenue Reports', Icons.bar_chart, Colors.purple),
          ],
        ),
      ),
    );
  }

  Widget _buildActionCard(String title, IconData icon, Color color) {
    return Expanded(
      child: Card(
        child: InkWell(
          onTap: () {},
          child: Padding(
            padding: EdgeInsets.all(16),
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

    final colors = [Colors.blue, Colors.green, Colors.orange, Colors.purple, Colors.red];
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