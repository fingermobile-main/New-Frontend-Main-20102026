import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class FranchiseManagementDashboard extends StatefulWidget {
  @override
  _FranchiseManagementDashboardState createState() => _FranchiseManagementDashboardState();
}

class _FranchiseManagementDashboardState extends State<FranchiseManagementDashboard> {
  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Franchise Management',
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
                    colors: [Colors.amber[600]!, Colors.amber[800]!],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Franchise Management Dashboard',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Manage franchises, locations, and performance metrics',
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
                  _buildStatCard('Active Franchises', '42', Icons.business, Colors.blue),
                  _buildStatCard('Total Locations', '124', Icons.location_city, Colors.green),
                  _buildStatCard('Revenue', '\$2.4M', Icons.attach_money, Colors.orange),
                  _buildStatCard('Performance', '84%', Icons.trending_up, Colors.purple),
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
                              'Revenue by Location',
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
                              'Performance Metrics',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            _buildPerformanceMetrics(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Franchise locations
              Text(
                'Franchise Locations',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildLocationsList(),
              
              SizedBox(height: 24),
              
              // Franchise applications
              Text(
                'Franchise Applications',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildApplicationsList(),
              
              SizedBox(height: 24),
              
              // Support tickets
              Text(
                'Support Tickets',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildTicketsList(),
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

  Widget _buildPerformanceMetrics() {
    final metrics = [
      {'metric': 'Customer Satisfaction', 'value': 4.2, 'max': 5.0},
      {'metric': 'Revenue Growth', 'value': 12.5, 'max': 20.0},
      {'metric': 'Compliance Score', 'value': 4.7, 'max': 5.0},
      {'metric': 'Staff Training', 'value': 85, 'max': 100},
    ];

    return Column(
      children: metrics.map((metric) {
        return Padding(
          padding: EdgeInsets.symmetric(vertical: 6),
          child: Row(
            children: [
              Expanded(
                flex: 2,
                child: Text(metric['metric']!),
              ),
              Expanded(
                flex: 3,
                child: LinearProgressIndicator(
                  value: metric['value']! / metric['max']!,
                  backgroundColor: Colors.grey[300],
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.amber),
                ),
              ),
              SizedBox(width: 8),
              Text('${metric['value']}${metric['max'] == 5.0 ? '' : '%'}'),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildLocationsList() {
    final locations = [
      {'name': 'NYC Central', 'revenue': '\$124,500', 'performance': 92, 'manager': 'John Smith'},
      {'name': 'LA Westside', 'revenue': '\$98,200', 'performance': 87, 'manager': 'Sarah Johnson'},
      {'name': 'Chicago North', 'revenue': '\$87,600', 'performance': 84, 'manager': 'Mike Wilson'},
      {'name': 'Miami Beach', 'revenue': '\$112,400', 'performance': 95, 'manager': 'Emma Davis'},
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Location')),
          DataColumn(label: Text('Revenue')),
          DataColumn(label: Text('Performance')),
          DataColumn(label: Text('Manager')),
          DataColumn(label: Text('Details')),
        ],
        rows: locations.map((location) {
          return DataRow(
            cells: [
              DataCell(Text(location['name']!)),
              DataCell(Text(location['revenue']!)),
              DataCell(
                Container(
                  width: 60,
                  child: LinearProgressIndicator(
                    value: location['performance']! / 100,
                    backgroundColor: Colors.grey[300],
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.amber),
                  ),
                ),
              ),
              DataCell(Text(location['manager']!)),
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

  Widget _buildApplicationsList() {
    final applications = [
      {'name': 'Tech Innovators LLC', 'location': 'Austin, TX', 'status': 'Pending Review'},
      {'name': 'Digital Solutions Inc', 'location': 'Seattle, WA', 'status': 'Approved'},
      {'name': 'Future Enterprises', 'location': 'Denver, CO', 'status': 'Rejected'},
      {'name': 'NextGen Ventures', 'location': 'Portland, OR', 'status': 'Interview Scheduled'},
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Applicant')),
          DataColumn(label: Text('Location')),
          DataColumn(label: Text('Status')),
          DataColumn(label: Text('Submitted')),
          DataColumn(label: Text('Action')),
        ],
        rows: applications.map((app) {
          return DataRow(
            cells: [
              DataCell(Text(app['name']!)),
              DataCell(Text(app['location']!)),
              DataCell(
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: app['status'] == 'Approved' 
                        ? Colors.green[100] 
                        : app['status'] == 'Pending Review' 
                            ? Colors.orange[100] 
                            : app['status'] == 'Interview Scheduled' 
                                ? Colors.blue[100] 
                                : Colors.red[100],
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    app['status']!,
                    style: TextStyle(
                      color: app['status'] == 'Approved' 
                          ? Colors.green[800] 
                          : app['status'] == 'Pending Review' 
                              ? Colors.orange[800] 
                              : app['status'] == 'Interview Scheduled' 
                                  ? Colors.blue[800] 
                                  : Colors.red[800],
                    ),
                  ),
                ),
              ),
              DataCell(Text('2026-02-15')),
              DataCell(
                PopupMenuButton(
                  icon: Icon(Icons.more_vert),
                  itemBuilder: (context) => [
                    PopupMenuItem(child: Text('View Details'), value: 'view'),
                    PopupMenuItem(child: Text('Approve'), value: 'approve'),
                    PopupMenuItem(child: Text('Reject'), value: 'reject'),
                  ],
                  onSelected: (value) {
                    // Handle menu selection
                  },
                ),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildTicketsList() {
    final tickets = [
      {'id': '#FR-001', 'subject': 'POS System Issue', 'priority': 'High', 'status': 'Open', 'assigned': 'IT Team'},
      {'id': '#FR-002', 'subject': 'Marketing Material', 'priority': 'Medium', 'status': 'In Progress', 'assigned': 'Marketing'},
      {'id': '#FR-003', 'subject': 'Training Schedule', 'priority': 'Low', 'status': 'Resolved', 'assigned': 'HR Team'},
      {'id': '#FR-004', 'subject': 'License Renewal', 'priority': 'High', 'status': 'Open', 'assigned': 'Legal'},
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Ticket')),
          DataColumn(label: Text('Subject')),
          DataColumn(label: Text('Priority')),
          DataColumn(label: Text('Status')),
          DataColumn(label: Text('Assigned')),
        ],
        rows: tickets.map((ticket) {
          return DataRow(
            cells: [
              DataCell(Text(ticket['id']!)),
              DataCell(Text(ticket['subject']!)),
              DataCell(
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: ticket['priority'] == 'High' 
                        ? Colors.red[100] 
                        : ticket['priority'] == 'Medium' 
                            ? Colors.orange[100] 
                            : Colors.green[100],
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    ticket['priority']!,
                    style: TextStyle(
                      color: ticket['priority'] == 'High' 
                          ? Colors.red[800] 
                          : ticket['priority'] == 'Medium' 
                              ? Colors.orange[800] 
                              : Colors.green[800],
                    ),
                  ),
                ),
              ),
              DataCell(
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: ticket['status'] == 'Open' 
                        ? Colors.red[100] 
                        : ticket['status'] == 'In Progress' 
                            ? Colors.blue[100] 
                            : Colors.green[100],
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    ticket['status']!,
                    style: TextStyle(
                      color: ticket['status'] == 'Open' 
                          ? Colors.red[800] 
                          : ticket['status'] == 'In Progress' 
                              ? Colors.blue[800] 
                              : Colors.green[800],
                    ),
                  ),
                ),
              ),
              DataCell(Text(ticket['assigned']!)),
            ],
          );
        }).toList(),
      ),
    );
  }
}

class RevenueChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.amber
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
      ..color = Colors.amber
      ..style = PaintingStyle.fill;

    for (final point in points) {
      canvas.drawCircle(point, 4, circlePaint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}