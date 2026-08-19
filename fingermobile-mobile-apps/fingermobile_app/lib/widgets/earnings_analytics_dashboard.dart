import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class EarningsAnalyticsDashboard extends StatefulWidget {
  @override
  _EarningsAnalyticsDashboardState createState() => _EarningsAnalyticsDashboardState();
}

class _EarningsAnalyticsDashboardState extends State<EarningsAnalyticsDashboard> {
  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Earnings Analytics',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header section
              Container(
                padding: EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Colors.green[600]!, Colors.green[800]!],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Earnings Analytics Dashboard',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Analyze earnings, revenue, and financial performance',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
              
              SizedBox(height: 24),
              
              // Stats grid
              GridView.count(
                crossAxisCount: 4,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                children: [
                  _buildStatCard('Total Earnings', '\$42,560', Icons.attach_money, Colors.blue),
                  _buildStatCard('Avg. Monthly', '\$3,540', Icons.calendar_month, Colors.green),
                  _buildStatCard('Growth Rate', '+12.5%', Icons.trending_up, Colors.orange),
                  _buildStatCard('Active Revenue', '\$12,450', Icons.bar_chart, Colors.purple),
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
                              'Revenue Trends',
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
                              'Earnings Breakdown',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            _buildEarningsBreakdown(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Earnings by source
              Text(
                'Earnings by Source',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildEarningsBySource(),
              
              SizedBox(height: 24),
              
              // Top earners
              Text(
                'Top Earners',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildTopEarnersList(),
              
              SizedBox(height: 24),
              
              // Financial insights
              Text(
                'Financial Insights',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildFinancialInsights(),
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

  Widget _buildEarningsBreakdown() {
    final breakdown = [
      {'source': 'Subscriptions', 'amount': 12450, 'percentage': 0.42},
      {'source': 'Ads Revenue', 'amount': 8750, 'percentage': 0.30},
      {'source': 'Affiliates', 'amount': 4250, 'percentage': 0.15},
      {'source': 'Premium', 'amount': 3800, 'percentage': 0.13},
    ];

    return Column(
      children: breakdown.map((item) {
        return Padding(
          padding: EdgeInsets.symmetric(vertical: 6),
          child: Row(
            children: [
              Expanded(
                flex: 2,
                child: Text(item['source']!),
              ),
              Expanded(
                child: LinearProgressIndicator(
                  value: item['percentage']!,
                  backgroundColor: Colors.grey[300],
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.green),
                ),
              ),
              SizedBox(width: 8),
              Text('\$${item['amount']}'),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildEarningsBySource() {
    final sources = [
      {'name': 'Direct Sales', 'jan': 1200, 'feb': 1450, 'mar': 1300, 'apr': 1600, 'may': 1750, 'jun': 1800},
      {'name': 'Affiliate', 'jan': 800, 'feb': 900, 'mar': 950, 'apr': 1000, 'may': 1100, 'jun': 1200},
      {'name': 'Subscriptions', 'jan': 2200, 'feb': 2300, 'mar': 2400, 'apr': 2500, 'may': 2600, 'jun': 2700},
      {'name': 'Ads', 'jan': 1500, 'feb': 1600, 'mar': 1550, 'apr': 1700, 'may': 1800, 'jun': 1900},
    ];

    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(flex: 2, child: Text('Source', style: TextStyle(fontWeight: FontWeight.bold))),
                Expanded(child: Text('Jan', textAlign: TextAlign.center)),
                Expanded(child: Text('Feb', textAlign: TextAlign.center)),
                Expanded(child: Text('Mar', textAlign: TextAlign.center)),
                Expanded(child: Text('Apr', textAlign: TextAlign.center)),
                Expanded(child: Text('May', textAlign: TextAlign.center)),
                Expanded(child: Text('Jun', textAlign: TextAlign.center)),
              ],
            ),
            SizedBox(height: 12),
            ...sources.map((source) => Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Row(
                    children: [
                      Expanded(flex: 2, child: Text(source['name']!)),
                      Expanded(child: Text('\$${source['jan']}', textAlign: TextAlign.center)),
                      Expanded(child: Text('\$${source['feb']}', textAlign: TextAlign.center)),
                      Expanded(child: Text('\$${source['mar']}', textAlign: TextAlign.center)),
                      Expanded(child: Text('\$${source['apr']}', textAlign: TextAlign.center)),
                      Expanded(child: Text('\$${source['may']}', textAlign: TextAlign.center)),
                      Expanded(child: Text('\$${source['jun']}', textAlign: TextAlign.center)),
                    ],
                  ),
                )),
          ],
        ),
      ),
    );
  }

  Widget _buildTopEarnersList() {
    final earners = [
      {'name': 'Creator Pro', 'earnings': '\$12,450', 'growth': '+12%'},
      {'name': 'Premium Subscribers', 'earnings': '\$8,750', 'growth': '+8%'},
      {'name': 'Affiliate Program', 'earnings': '\$6,230', 'growth': '+15%'},
      {'name': 'Ad Revenue', 'earnings': '\$5,120', 'growth': '+5%'},
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Source')),
          DataColumn(label: Text('Earnings')),
          DataColumn(label: Text('Growth')),
          DataColumn(label: Text('Details')),
        ],
        rows: earners.map((earner) {
          return DataRow(
            cells: [
              DataCell(Text(earner['name']!)),
              DataCell(Text(earner['earnings']!)),
              DataCell(
                Text(
                  earner['growth']!,
                  style: TextStyle(
                    color: earner['growth']!.startsWith('+') ? Colors.green : Colors.red,
                  ),
                ),
              ),
              DataCell(
                IconButton(
                  icon: Icon(Icons.visibility, color: Colors.blue),
                  onPressed: () {},
                ),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildFinancialInsights() {
    final insights = [
      {'title': 'Seasonal Trends', 'value': 'Q4 highest revenue', 'icon': Icons.trending_up},
      {'title': 'Peak Hours', 'value': '7-9 PM daily', 'icon': Icons.access_time},
      {'title': 'Top Region', 'value': 'North America', 'icon': Icons.public},
      {'title': 'Avg. Transaction', 'value': '\$24.50', 'icon': Icons.monetization_on},
    ];

    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: insights.map((insight) {
            return Expanded(
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: 8),
                child: Column(
                  children: [
                    Icon(insight['icon'], color: Colors.green, size: 30),
                    SizedBox(height: 8),
                    Text(
                      insight['title']!,
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 4),
                    Text(
                      insight['value']!,
                      style: TextStyle(color: Colors.grey[600]),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}

class RevenueChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.green
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final points = <Offset>[];

    // Create sample revenue data points
    for (int i = 0; i < 7; i++) {
      final x = (size.width / 6) * i;
      final y = size.height - (i % 3 == 0 ? size.height * 0.7 : i % 3 == 1 ? size.height * 0.5 : size.height * 0.3);
      points.add(Offset(x, y));
    }

    if (points.length > 1) {
      canvas.drawPoints(PointMode.polygon, points, paint);
    }

    // Draw data points
    final circlePaint = Paint()
      ..color = Colors.green
      ..style = PaintingStyle.fill;

    for (final point in points) {
      canvas.drawCircle(point, 4, circlePaint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}