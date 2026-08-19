import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class MonetizationDashboard extends StatefulWidget {
  @override
  _MonetizationDashboardState createState() => _MonetizationDashboardState();
}

class _MonetizationDashboardState extends State<MonetizationDashboard> {
  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Monetization Dashboard',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Text(
                'Monetization Overview',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              
              // Revenue Metrics
              Wrap(
                spacing: 16,
                runSpacing: 16,
                children: [
                  _buildRevenueCard('Total Revenue', '\$12,450', Icons.attach_money, Colors.green),
                  _buildRevenueCard('Daily Revenue', '\$1,245', Icons.timeline, Colors.blue),
                  _buildRevenueCard('Subscriptions', '\$8,920', Icons.subscriptions, Colors.orange),
                  _buildRevenueCard('Ad Revenue', '\$3,530', Icons.ads_click, Colors.purple),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Charts Section
              Row(
                children: [
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Revenue Trends',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
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
                        padding: EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Revenue Sources',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 12),
                            _buildRevenueSourcesChart(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Monetization Tools
              Text(
                'Monetization Tools',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              
              Wrap(
                spacing: 16,
                runSpacing: 16,
                children: [
                  _buildToolCard('Create Subscription Plan', Icons.card_membership, Colors.blue),
                  _buildToolCard('Set Up Ad Spaces', Icons.ads_click, Colors.orange),
                  _buildToolCard('Configure Paywalls', Icons.lock, Colors.green),
                  _buildToolCard('Manage Pricing', Icons.money, Colors.purple),
                  _buildToolCard('Track Performance', Icons.bar_chart, Colors.red),
                  _buildToolCard('Revenue Reports', Icons.insert_chart, Colors.teal),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Payment Methods
              Text(
                'Payment Methods',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      _buildPaymentMethod('Credit Card', Icons.credit_card, true),
                      _buildPaymentMethod('PayPal', Icons.paypal, true),
                      _buildPaymentMethod('Bank Transfer', Icons.account_balance, false),
                      _buildPaymentMethod('Cryptocurrency', Icons.currency_bitcoin, false),
                      _buildPaymentMethod('Mobile Payments', Icons.phone_iphone, true),
                    ],
                  ),
                ),
              ),
              
              SizedBox(height: 24),
              
              // Recent Transactions
              Text(
                'Recent Transactions',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              
              Card(
                child: DataTable(
                  columns: [
                    DataColumn(label: Text('User')),
                    DataColumn(label: Text('Plan')),
                    DataColumn(label: Text('Amount')),
                    DataColumn(label: Text('Date')),
                    DataColumn(label: Text('Status')),
                  ],
                  rows: [
                    DataRow(cells: [
                      DataCell(Text('John Doe')),
                      DataCell(Text('Premium')),
                      DataCell(Text('\$9.99')),
                      DataCell(Text('2026-03-01')),
                      DataCell(Text('Completed', style: TextStyle(color: Colors.green))),
                    ]),
                    DataRow(cells: [
                      DataCell(Text('Jane Smith')),
                      DataCell(Text('Pro')),
                      DataCell(Text('\$19.99')),
                      DataCell(Text('2026-02-28')),
                      DataCell(Text('Completed', style: TextStyle(color: Colors.green))),
                    ]),
                    DataRow(cells: [
                      DataCell(Text('Bob Johnson')),
                      DataCell(Text('Basic')),
                      DataCell(Text('\$4.99')),
                      DataCell(Text('2026-02-27')),
                      DataCell(Text('Failed', style: TextStyle(color: Colors.red))),
                    ]),
                    DataRow(cells: [
                      DataCell(Text('Alice Williams')),
                      DataCell(Text('Premium')),
                      DataCell(Text('\$9.99')),
                      DataCell(Text('2026-02-26')),
                      DataCell(Text('Completed', style: TextStyle(color: Colors.green))),
                    ]),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRevenueCard(String title, String value, IconData icon, Color color) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: EdgeInsets.all(16.0),
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

  Widget _buildRevenueSourcesChart() {
    return Container(
      height: 180,
      child: CustomPaint(
        painter: RevenueSourcesPainter(),
        size: Size.infinite,
      ),
    );
  }

  Widget _buildToolCard(String title, IconData icon, Color color) {
    return SizedBox(
      width: 200,
      child: Card(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: color, size: 40),
              SizedBox(height: 12),
              Text(
                title,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
              SizedBox(height: 8),
              ElevatedButton(
                onPressed: () {},
                child: Text('Configure'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPaymentMethod(String method, IconData icon, bool enabled) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(icon, color: enabled ? Colors.green : Colors.grey),
          SizedBox(width: 12),
          Text(method),
          Spacer(),
          Switch(
            value: enabled,
            onChanged: (value) {},
          ),
        ],
      ),
    );
  }
}

class RevenueChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.blue
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final points = <Offset>[];

    // Create sample revenue data points
    for (int i = 0; i < 7; i++) {
      final x = (size.width / 6) * i;
      // Varying heights to simulate revenue trends
      final y = size.height - (i % 3 == 0 ? size.height * 0.7 : i % 3 == 1 ? size.height * 0.5 : size.height * 0.3);
      points.add(Offset(x, y));
    }

    if (points.length > 1) {
      canvas.drawPoints(PointMode.polygon, points, paint);
    }

    // Draw data points
    final circlePaint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.fill;

    for (final point in points) {
      canvas.drawCircle(point, 4, circlePaint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}

class RevenueSourcesPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.shortestSide / 2;

    final colors = [Colors.green, Colors.blue, Colors.orange, Colors.purple, Colors.red];
    final values = [40, 25, 20, 10, 5]; // Total = 100%

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