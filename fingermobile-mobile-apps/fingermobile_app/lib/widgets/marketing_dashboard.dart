import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class MarketingDashboard extends StatefulWidget {
  @override
  _MarketingDashboardState createState() => _MarketingDashboardState();
}

class _MarketingDashboardState extends State<MarketingDashboard> {
  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Marketing Dashboard',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header section
              Text(
                'Marketing Overview',
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
                  _buildStatCard('Campaigns', '12', Icons.campaign, Colors.blue),
                  _buildStatCard('Leads', '1,245', Icons.leaderboard, Colors.green),
                  _buildStatCard('Conversion', '24.5%', Icons.trending_up, Colors.orange),
                  _buildStatCard('ROI', '185%', Icons.show_chart, Colors.purple),
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
                              'Traffic Sources',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            Container(
                              height: 200,
                              child: _buildTrafficChart(),
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
                              'Campaign Performance',
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
              
              // Marketing campaigns
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
              
              // Audience insights
              Text(
                'Audience Insights',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildAudienceInsights(),
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

  Widget _buildTrafficChart() {
    return Container(
      child: CustomPaint(
        painter: TrafficChartPainter(),
        size: Size.infinite,
      ),
    );
  }

  Widget _buildPerformanceList() {
    final campaigns = [
      {'name': 'Summer Sale', 'performance': 92},
      {'name': 'New Product', 'performance': 78},
      {'name': 'Retargeting', 'performance': 65},
      {'name': 'Email Blast', 'performance': 54},
    ];

    return Column(
      children: campaigns.map((campaign) {
        return Padding(
          padding: EdgeInsets.symmetric(vertical: 6),
          child: Row(
            children: [
              Expanded(
                flex: 2,
                child: Text(campaign['name']!),
              ),
              Expanded(
                child: LinearProgressIndicator(
                  value: campaign['performance']! / 100,
                  backgroundColor: Colors.grey[300],
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                ),
              ),
              SizedBox(width: 8),
              Text('${campaign['performance']}%'),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildCampaignsList() {
    final campaigns = [
      {
        'name': 'Summer Promotion',
        'status': 'Active',
        'budget': '\$2,500',
        'spent': '\$1,200',
        'reach': '12,450',
        'engagement': '3.2%'
      },
      {
        'name': 'New Feature Launch',
        'status': 'Active',
        'budget': '\$5,000',
        'spent': '\$3,800',
        'reach': '24,670',
        'engagement': '4.1%'
      },
      {
        'name': 'Holiday Campaign',
        'status': 'Paused',
        'budget': '\$3,000',
        'spent': '\$1,800',
        'reach': '18,200',
        'engagement': '2.8%'
      },
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Campaign')),
          DataColumn(label: Text('Status')),
          DataColumn(label: Text('Budget')),
          DataColumn(label: Text('Spent')),
          DataColumn(label: Text('Reach')),
          DataColumn(label: Text('Engagement')),
        ],
        rows: campaigns.map((campaign) {
          return DataRow(
            cells: [
              DataCell(Text(campaign['name']!)),
              DataCell(
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: campaign['status'] == 'Active' ? Colors.green[100] : Colors.orange[100],
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    campaign['status']!,
                    style: TextStyle(
                      color: campaign['status'] == 'Active' ? Colors.green[800] : Colors.orange[800],
                    ),
                  ),
                ),
              ),
              DataCell(Text(campaign['budget']!)),
              DataCell(Text(campaign['spent']!)),
              DataCell(Text(campaign['reach']!)),
              DataCell(Text(campaign['engagement']!)),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildAudienceInsights() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Demographics',
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                    fontSize: 16,
                  ),
                ),
                TextButton(
                  onPressed: () {},
                  child: Text('View Full Report'),
                ),
              ],
            ),
            SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildDemographicCard('Age Group', '25-34', Icons.group),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: _buildDemographicCard('Gender', '60% Male', Icons.face),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: _buildDemographicCard('Location', 'Urban', Icons.location_city),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDemographicCard(String title, String value, IconData icon) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(12),
        child: Column(
          children: [
            Icon(icon, color: Colors.blue, size: 30),
            SizedBox(height: 8),
            Text(
              title,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
            Text(
              value,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class TrafficChartPainter extends CustomPainter {
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