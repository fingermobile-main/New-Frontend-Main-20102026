import 'package:flutter/material.dart';
import 'package:fingermobile_app/services/api_service.dart';
import 'package:fingermobile_app/models/member.dart';
import 'package:fingermobile_app/widgets/main_navigation_drawer.dart';
import 'package:syncfusion_flutter_charts/charts.dart';

class DashboardScreen extends StatefulWidget {
  final Member member;

  const DashboardScreen({super.key, required this.member});

  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  bool _isLoading = true;
  Map<String, dynamic>? _analyticsData;
  Map<String, dynamic>? _dashboardData;
  List<dynamic>? _recentActivities;
  List<Map<String, dynamic>>? _quickActions;

  @override
  void initState() {
    super.initState();
    _initQuickActions();
    _loadAllData();
  }

  void _initQuickActions() {
    _quickActions = [
      {'label': 'New Post', 'icon': Icons.add_box, 'action': () => _navigateTo('new_post')},
      {'label': 'Discovery', 'icon': Icons.explore, 'action': () => _navigateTo('discovery')},
      {'label': 'Friends', 'icon': Icons.people, 'action': () => _navigateTo('friends')},
      {'label': 'Messages', 'icon': Icons.message, 'action': () => _navigateTo('messages')},
      {'label': 'Trending', 'icon': Icons.trending_up, 'action': () => _navigateTo('trending')},
      {'label': 'Settings', 'icon': Icons.settings, 'action': () => _navigateTo('settings')},
    ];
  }

  void _navigateTo(String route) {
    // Navigation logic here
    print('Navigating to $route');
  }

  Future<void> _loadAllData() async {
    setState(() => _isLoading = true);
    await Future.wait([
      _loadAnalytics(),
      _loadDashboardData(),
    ]);
    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _loadAnalytics() async {
    try {
      final dashboardResponse = await ApiService.get('/dashboard');
      final engagementResponse = await ApiService.get('/analytics/engagement');
      final activityResponse = await ApiService.get('/analytics/activity');

      if (mounted) {
        setState(() {
          _analyticsData = {
            ...dashboardResponse,
            'engagementData': engagementResponse['data'],
            'activityData': activityResponse['data'],
          };
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error loading analytics: $e');
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load analytics')),
        );
      }
    }
  }


  Future<void> _loadDashboardData() async {
    try {
      // Load dashboard metrics
      final dashboardResponse = await ApiService.get('/dashboard');
      final activitiesResponse = await ApiService.get('/activity/recent');
      
      if (mounted) {
        setState(() {
          _dashboardData = dashboardResponse;
          _recentActivities = activitiesResponse?['activities'] ?? [];
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error loading dashboard: $e');
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Dashboard'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _loadDashboardData,
          ),
        ],
      ),
      drawer: MainNavigationDrawer(member: widget.member),
      body: RefreshIndicator(
        onRefresh: _loadDashboardData,
        child: _isLoading
            ? Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Welcome section
                    Container(
                      padding: EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [Colors.blue, Colors.purple],
                        ),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Welcome Back, ${widget.member.username ?? 'User'}!',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Here\'s what\'s happening today',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.white70,
                            ),
                          ),
                        ],
                      ),
                    ),
                    
                    SizedBox(height: 20),
                    
                    // Metrics cards
                    if (_dashboardData != null) ...[
                      Text(
                        'Metrics',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 12),
                      Wrap(
                        spacing: 12,
                        runSpacing: 12,
                        children: [
                          _buildMetricCard(
                            'Posts',
                            _dashboardData!['metrics']['posts_count']?.toString() ?? '0',
                            Icons.article,
                            Colors.blue,
                          ),
                          _buildMetricCard(
                            'Followers',
                            _dashboardData!['metrics']['followers_count']?.toString() ?? '0',
                            Icons.group,
                            Colors.green,
                          ),
                          _buildMetricCard(
                            'Following',
                            _dashboardData!['metrics']['following_count']?.toString() ?? '0',
                            Icons.person_add,
                            Colors.orange,
                          ),
                          _buildMetricCard(
                            'Likes Received',
                            _dashboardData!['metrics']['likes_received_count']?.toString() ?? '0',
                            Icons.thumb_up,
                            Colors.purple,
                          ),
                        ],
                      ),
                      
                      SizedBox(height: 20),
                    ],

                    // Analytics Charts
                    if (_analyticsData != null) ...[
                      Text(
                        'Engagement Overview',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 12),
                      Container(
                        height: 200,
                        child: SfCartesianChart(
                          primaryXAxis: CategoryAxis(),
                          series: _getEngagementSeries(),
                          tooltipBehavior: TooltipBehavior(enable: true),
                        ),
                      ),
                      SizedBox(height: 20),

                      Text(
                        'Activity Trends',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 12),
                      Container(
                        height: 200,
                        child: SfCartesianChart(
                          primaryXAxis: CategoryAxis(),
                          series: _getActivitySeries(),
                          tooltipBehavior: TooltipBehavior(enable: true),
                        ),
                      ),
                      SizedBox(height: 20),
                    ],
                    
                    // Quick actions
                    Text(
                      'Quick Actions',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 12),
                    GridView.builder(
                      shrinkWrap: true,
                      physics: NeverScrollableScrollPhysics(),
                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 3,
                        crossAxisSpacing: 12,
                        mainAxisSpacing: 12,
                        childAspectRatio: 1.0,
                      ),
                      itemCount: _quickActions!.length,
                      itemBuilder: (context, index) {
                        final action = _quickActions![index];
                        return Card(
                          elevation: 2,
                          child: InkWell(
                            onTap: action['action'],
                            borderRadius: BorderRadius.circular(8),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  action['icon'],
                                  size: 32,
                                  color: Colors.blue,
                                ),
                                SizedBox(height: 8),
                                Text(
                                  action['label'],
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                    
                    SizedBox(height: 20),
                    
                    // Recent activity
                    Text(
                      'Recent Activity',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 12),
                    
                    if (_recentActivities != null && _recentActivities!.isNotEmpty)
                      ListView.separated(
                        shrinkWrap: true,
                        physics: NeverScrollableScrollPhysics(),
                        separatorBuilder: (context, index) => Divider(height: 1),
                        itemCount: _recentActivities!.length,
                        itemBuilder: (context, index) {
                          final activity = _recentActivities![index];
                          return ListTile(
                            leading: CircleAvatar(
                              child: Icon(
                                _getActivityIcon(activity['type']),
                                color: Colors.white,
                              ),
                              backgroundColor: _getActivityColor(activity['type']),
                            ),
                            title: Text(activity['title'] ?? ''),
                            subtitle: Text(activity['subtitle'] ?? ''),
                            trailing: Text(
                              activity['timestamp'] ?? '',
                              style: TextStyle(fontSize: 12, color: Colors.grey),
                            ),
                          );
                        },
                      )
                    else
                      Card(
                        child: Padding(
                          padding: EdgeInsets.all(16),
                          child: Column(
                            children: [
                              Icon(
                                Icons.event_note,
                                size: 48,
                                color: Colors.grey[400],
                              ),
                              SizedBox(height: 8),
                              Text(
                                'No recent activity',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
              ),
      ),
    );
  }

  Widget _buildMetricCard(String title, String value, IconData icon, Color color) {
    return Container(
      width: (MediaQuery.of(context).size.width - 44) / 2,
      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: color, size: 28),
              SizedBox(height: 12),
              Text(
                value,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                title,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }



  List<CartesianSeries<ChartData, String>> _getEngagementSeries() {
    final engagementData = _analyticsData!['engagementData'] as List;
    final chartData = engagementData
        .map((item) => ChartData(
              item['date'] as String,
              (item['value'] as num).toDouble(),
            ))
        .toList();
 
    return <CartesianSeries<ChartData, String>>[
      SplineSeries<ChartData, String>(
        dataSource: chartData,
        xValueMapper: (ChartData data, _) => data.x,
        yValueMapper: (ChartData data, _) => data.y,
        color: Colors.blue,
      )
    ];
  }
 
  List<CartesianSeries<ChartData, String>> _getActivitySeries() {
    final activityData = _analyticsData!['activityData'] as List;
    final chartData = activityData
        .map((item) => ChartData(
              item['day'] as String,
              (item['count'] as num).toDouble(),
            ))
        .toList();
 
    return <CartesianSeries<ChartData, String>>[
      ColumnSeries<ChartData, String>(
        dataSource: chartData,
        xValueMapper: (ChartData data, _) => data.x,
        yValueMapper: (ChartData data, _) => data.y,
        color: Colors.green,
      )
    ];
  }

  IconData _getActivityIcon(String? type) {
    switch (type) {
      case 'post':
        return Icons.article;
      case 'like':
        return Icons.thumb_up;
      case 'comment':
        return Icons.comment;
      case 'follow':
        return Icons.person_add;
      case 'message':
        return Icons.message;
      default:
        return Icons.info;
    }
  }

  Color _getActivityColor(String? type) {
    switch (type) {
      case 'post':
        return Colors.blue;
      case 'like':
        return Colors.green;
      case 'comment':
        return Colors.orange;
      case 'follow':
        return Colors.purple;
      case 'message':
        return Colors.teal;
      default:
        return Colors.grey;
    }
  }
}

class ChartData {
  ChartData(this.x, this.y);
  final String x;
  final double y;
}