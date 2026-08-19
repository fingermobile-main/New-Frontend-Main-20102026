import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class InvestorRelationsDashboard extends StatefulWidget {
  @override
  _InvestorRelationsDashboardState createState() => _InvestorRelationsDashboardState();
}

class _InvestorRelationsDashboardState extends State<InvestorRelationsDashboard> {
  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Investor Relations',
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
                    colors: [Colors.deepOrange[600]!, Colors.deepOrange[800]!],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Investor Relations Dashboard',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Financial metrics and investor communications',
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
                  _buildStatCard('Market Cap', '\$245.6M', Icons.account_balance, Colors.blue),
                  _buildStatCard('Revenue YTD', '\$42.3M', Icons.trending_up, Colors.green),
                  _buildStatCard('Active Investors', '1,240', Icons.people, Colors.orange),
                  _buildStatCard('Dividend Yield', '2.4%', Icons.pie_chart, Colors.purple),
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
                              'Revenue Growth',
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
                              'Investor Metrics',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            _buildInvestorMetrics(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Investor communications
              Text(
                'Investor Communications',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildCommunicationsList(),
              
              SizedBox(height: 24),
              
              // Financial documents
              Text(
                'Financial Documents',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildDocumentsList(),
              
              SizedBox(height: 24),
              
              // Investment opportunities
              Text(
                'Investment Opportunities',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildOpportunitiesList(),
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

  Widget _buildInvestorMetrics() {
    final metrics = [
      {'metric': 'EPS Growth', 'value': '+12.5%', 'change': '+2.3%'},
      {'metric': 'ROE', 'value': '18.2%', 'change': '+1.2%'},
      {'metric': 'Debt/Equity', 'value': '0.45', 'change': '-0.05'},
      {'metric': 'Current Ratio', 'value': '2.15', 'change': '+0.12'},
    ];

    return Column(
      children: metrics.map((metric) {
        return Padding(
          padding: EdgeInsets.symmetric(vertical: 8),
          child: Row(
            children: [
              Expanded(
                flex: 2,
                child: Text(metric['metric']!),
              ),
              Expanded(
                child: Text(
                  metric['value']!,
                  style: TextStyle(fontWeight: FontWeight.w500),
                ),
              ),
              Expanded(
                child: Text(
                  metric['change']!,
                  style: TextStyle(
                    color: metric['change']!.startsWith('+') ? Colors.green : Colors.red,
                  ),
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildCommunicationsList() {
    final communications = [
      {'title': 'Q4 Earnings Call', 'date': '2026-02-15', 'type': 'Earnings'},
      {'title': 'Annual Shareholders Meeting', 'date': '2026-05-10', 'type': 'Meeting'},
      {'title': 'Q1 Results Preview', 'date': '2026-04-05', 'type': 'Update'},
      {'title': 'ESG Initiative Announcement', 'date': '2026-03-01', 'type': 'Announcement'},
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Event')),
          DataColumn(label: Text('Date')),
          DataColumn(label: Text('Type')),
          DataColumn(label: Text('Status')),
        ],
        rows: communications.map((comm) {
          return DataRow(
            cells: [
              DataCell(Text(comm['title']!)),
              DataCell(Text(comm['date']!)),
              DataCell(
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: comm['type'] == 'Earnings' 
                        ? Colors.blue[100] 
                        : comm['type'] == 'Meeting' 
                            ? Colors.green[100] 
                            : comm['type'] == 'Update' 
                                ? Colors.orange[100] 
                                : Colors.purple[100],
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    comm['type']!,
                    style: TextStyle(
                      color: comm['type'] == 'Earnings' 
                          ? Colors.blue[800] 
                          : comm['type'] == 'Meeting' 
                              ? Colors.green[800] 
                              : comm['type'] == 'Update' 
                                  ? Colors.orange[800] 
                                  : Colors.purple[800],
                    ),
                  ),
                ),
              ),
              DataCell(
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.green[100],
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    'Completed',
                    style: TextStyle(color: Colors.green[800]),
                  ),
                ),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildDocumentsList() {
    final documents = [
      {'name': 'Annual Report 2025', 'type': 'PDF', 'size': '2.4 MB', 'date': '2026-01-15'},
      {'name': 'Q4 Earnings Report', 'type': 'PDF', 'size': '1.2 MB', 'date': '2025-12-15'},
      {'name': 'Investor Presentation', 'type': 'PPT', 'size': '3.1 MB', 'date': '2025-12-20'},
      {'name': 'Proxy Statement', 'type': 'PDF', 'size': '4.7 MB', 'date': '2026-03-01'},
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Document')),
          DataColumn(label: Text('Type')),
          DataColumn(label: Text('Size')),
          DataColumn(label: Text('Date')),
          DataColumn(label: Text('Download')),
        ],
        rows: documents.map((doc) {
          return DataRow(
            cells: [
              DataCell(Text(doc['name']!)),
              DataCell(Text(doc['type']!)),
              DataCell(Text(doc['size']!)),
              DataCell(Text(doc['date']!)),
              DataCell(
                IconButton(
                  icon: Icon(Icons.download, color: Colors.blue),
                  onPressed: () {},
                ),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildOpportunitiesList() {
    final opportunities = [
      {'name': 'Expansion Fund', 'target': '\$50M', 'raised': '\$32M', 'progress': 0.64},
      {'name': 'Technology Upgrade', 'target': '\$25M', 'raised': '\$18M', 'progress': 0.72},
      {'name': 'Global Market Entry', 'target': '\$75M', 'raised': '\$45M', 'progress': 0.60},
    ];

    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: opportunities.map((opp) {
            return Padding(
              padding: EdgeInsets.symmetric(vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        flex: 2,
                        child: Text(opp['name']!, style: TextStyle(fontWeight: FontWeight.bold)),
                      ),
                      Expanded(
                        child: Text('Target: ${opp['target']}'),
                      ),
                      Expanded(
                        child: Text('Raised: ${opp['raised']}'),
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  LinearProgressIndicator(
                    value: opp['progress']!,
                    backgroundColor: Colors.grey[300],
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.deepOrange),
                  ),
                  SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(
                        '${(opp['progress']! * 100).toInt()}% funded',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ],
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
      ..color = Colors.deepOrange
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
      ..color = Colors.deepOrange
      ..style = PaintingStyle.fill;

    for (final point in points) {
      canvas.drawCircle(point, 4, circlePaint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}