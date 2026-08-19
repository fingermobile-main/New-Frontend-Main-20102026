import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class RbacDashboard extends StatefulWidget {
  @override
  _RbacDashboardState createState() => _RbacDashboardState();
}

class _RbacDashboardState extends State<RbacDashboard> {
  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'RBAC Management',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header section
              Text(
                'Role-Based Access Control',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 8),
              Text(
                'Manage roles, permissions, and access rights',
                style: TextStyle(
                  color: Colors.grey[600],
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
                  _buildStatCard('Total Roles', '12', Icons.people_alt, Colors.blue),
                  _buildStatCard('Active Permissions', '84', Icons.lock, Colors.green),
                  _buildStatCard('Users Assigned', '1,240', Icons.person, Colors.orange),
                  _buildStatCard('Policy Violations', '3', Icons.warning, Colors.red),
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
                              'Permission Distribution',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            Container(
                              height: 200,
                              child: _buildPermissionsChart(),
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
                              'Role Assignment',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            _buildRoleAssignmentList(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Roles management
              Text(
                'Roles Management',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildRolesList(),
              
              SizedBox(height: 24),
              
              // Permissions management
              Text(
                'Permissions Management',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildPermissionsList(),
              
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

  Widget _buildPermissionsChart() {
    return Container(
      child: CustomPaint(
        painter: PermissionsChartPainter(),
        size: Size.infinite,
      ),
    );
  }

  Widget _buildRoleAssignmentList() {
    final assignments = [
      {'role': 'Admin', 'count': 5, 'percentage': 0.4},
      {'role': 'Moderator', 'count': 12, 'percentage': 1.0},
      {'role': 'Creator', 'count': 45, 'percentage': 3.6},
      {'role': 'Member', 'count': 1178, 'percentage': 94.2},
    ];

    return Column(
      children: assignments.map((assignment) {
        return Padding(
          padding: EdgeInsets.symmetric(vertical: 6),
          child: Row(
            children: [
              Expanded(
                flex: 2,
                child: Text(assignment['role']!),
              ),
              Expanded(
                child: LinearProgressIndicator(
                  value: assignment['percentage']! / 100,
                  backgroundColor: Colors.grey[300],
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                ),
              ),
              SizedBox(width: 8),
              Text('${assignment['count']}'),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildRolesList() {
    final roles = [
      {'name': 'Admin', 'permissions': 24, 'users': 5, 'description': 'Full system access'},
      {'name': 'Moderator', 'permissions': 18, 'users': 12, 'description': 'Content management'},
      {'name': 'Creator', 'permissions': 12, 'users': 45, 'description': 'Content creation'},
      {'name': 'Member', 'permissions': 6, 'users': 1178, 'description': 'Basic access'},
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Role')),
          DataColumn(label: Text('Permissions')),
          DataColumn(label: Text('Assigned Users')),
          DataColumn(label: Text('Description')),
          DataColumn(label: Text('Actions')),
        ],
        rows: roles.map((role) {
          return DataRow(
            cells: [
              DataCell(Text(role['name']!)),
              DataCell(Text(role['permissions'].toString())),
              DataCell(Text(role['users'].toString())),
              DataCell(Text(role['description']!)),
              DataCell(
                PopupMenuButton(
                  icon: Icon(Icons.more_vert),
                  itemBuilder: (context) => [
                    PopupMenuItem(child: Text('Edit Role'), value: 'edit'),
                    PopupMenuItem(child: Text('Assign Users'), value: 'assign'),
                    PopupMenuItem(child: Text('View Permissions'), value: 'permissions'),
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

  Widget _buildPermissionsList() {
    final permissions = [
      {'name': 'View Content', 'role': 'Member', 'access': 'Public'},
      {'name': 'Create Content', 'role': 'Creator', 'access': 'Allowed'},
      {'name': 'Delete Content', 'role': 'Moderator', 'access': 'Restricted'},
      {'name': 'User Management', 'role': 'Admin', 'access': 'Full'},
      {'name': 'System Settings', 'role': 'Admin', 'access': 'Full'},
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Permission')),
          DataColumn(label: Text('Role')),
          DataColumn(label: Text('Access Level')),
          DataColumn(label: Text('Status')),
          DataColumn(label: Text('Actions')),
        ],
        rows: permissions.map((perm) {
          return DataRow(
            cells: [
              DataCell(Text(perm['name']!)),
              DataCell(Text(perm['role']!)),
              DataCell(Text(perm['access']!)),
              DataCell(
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: perm['access'] == 'Full' || perm['access'] == 'Allowed'
                        ? Colors.green[100]
                        : perm['access'] == 'Restricted'
                            ? Colors.orange[100]
                            : Colors.grey[100],
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    perm['access'] == 'Full' || perm['access'] == 'Allowed'
                        ? 'Active'
                        : perm['access'] == 'Restricted'
                            ? 'Limited'
                            : 'Inactive',
                    style: TextStyle(
                      color: perm['access'] == 'Full' || perm['access'] == 'Allowed'
                          ? Colors.green[800]
                          : perm['access'] == 'Restricted'
                              ? Colors.orange[800]
                              : Colors.grey[800],
                    ),
                  ),
                ),
              ),
              DataCell(
                PopupMenuButton(
                  icon: Icon(Icons.more_vert),
                  itemBuilder: (context) => [
                    PopupMenuItem(child: Text('Edit Permission'), value: 'edit'),
                    PopupMenuItem(child: Text('Grant Access'), value: 'grant'),
                    PopupMenuItem(child: Text('Revoke Access'), value: 'revoke'),
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

  Widget _buildQuickActions() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Wrap(
          spacing: 16,
          runSpacing: 16,
          children: [
            _buildActionCard('Create Role', Icons.add, Colors.blue),
            _buildActionCard('Assign Users', Icons.person_add, Colors.green),
            _buildActionCard('Manage Permissions', Icons.lock_open, Colors.orange),
            _buildActionCard('Audit Trail', Icons.history, Colors.purple),
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

class PermissionsChartPainter extends CustomPainter {
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