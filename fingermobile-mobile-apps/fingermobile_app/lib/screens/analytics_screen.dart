import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_charts/charts.dart';
import '../services/api_service.dart';

class AnalyticsScreen extends StatefulWidget {
  @override
  _AnalyticsScreenState createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> {
  memberAnalytics? _analytics;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadAnalytics();
  }

  Future<void> _loadAnalytics() async {
    try {
      final result = await ApiService.get('/analytics/member');
      if (result != null && result['analytics'] != null) {
        // Get the most recent analytics data
        final recentData = result['analytics'].length > 0 
            ? result['analytics'][0] 
            : {};
        
        setState(() {
          _analytics = memberAnalytics.fromJson(recentData);
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error loading analytics: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading analytics')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Analytics'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _analytics == null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.analytics,
                        size: 80,
                        color: Colors.grey[400],
                      ),
                      SizedBox(height: 16),
                      Text(
                        'No analytics data',
                        style: TextStyle(
                          fontSize: 20,
                          color: Colors.grey[600],
                        ),
                      ),
                      SizedBox(height: 8),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          'Analytics will be available once you start creating content',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: Colors.grey[500],
                          ),
                        ),
                      ),
                    ],
                  ),
                )
              : RefreshIndicator(
                  onRefresh: _loadAnalytics,
                  child: SingleChildScrollView(
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        children: [
                          // Stats overview
                          _buildStatsOverview(),
                          
                          SizedBox(height: 20),
                          
                          // Engagement chart
                          _buildEngagementChart(),
                          
                          SizedBox(height: 20),
                          
                          // Followers vs Following
                          _buildFollowersChart(),
                          
                          SizedBox(height: 20),
                          
                          // Post performance
                          _buildPostPerformance(),
                        ],
                      ),
                    ),
                  ),
                ),
    );
  }

  Widget _buildStatsOverview() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Text(
              'Overview',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildStatCard(
                  'Posts',
                  _analytics!.postsCount.toString(),
                  Icons.feed,
                  Colors.blue,
                ),
                _buildStatCard(
                  'Followers',
                  _analytics!.followersCount.toString(),
                  Icons.people,
                  Colors.green,
                ),
              ],
            ),
            SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildStatCard(
                  'Following',
                  _analytics!.followingCount.toString(),
                  Icons.person_add,
                  Colors.orange,
                ),
                _buildStatCard(
                  'Engagement',
                  '${_analytics!.engagementRate.toStringAsFixed(2)}%',
                  Icons.trending_up,
                  Colors.purple,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Icon(
              icon,
              color: color,
              size: 30,
            ),
            SizedBox(height: 8),
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
    );
  }

  Widget _buildEngagementChart() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Engagement Overview',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Container(
              height: 200,
              child: SfCircularChart(
                legend: Legend(isVisible: true),
                series: _getEngagementData(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<PieSeries<EngagementData, String>> _getEngagementData() {
    final List<EngagementData> data = [
      EngagementData('Likes', _analytics!.likesReceivedCount.toDouble()),
      EngagementData('Comments', _analytics!.commentsReceivedCount.toDouble()),
      EngagementData('Shares', _analytics!.sharesReceivedCount.toDouble()),
    ];

    return [
      PieSeries<EngagementData, String>(
        dataSource: data,
        xValueMapper: (EngagementData data, _) => data.category,
        yValueMapper: (EngagementData data, _) => data.value,
        dataLabelMapper: (EngagementData data, _) => '${data.value.toInt()}',
        dataLabelSettings: DataLabelSettings(isVisible: true),
        enableTooltip: true,
      ),
    ];
  }

  Widget _buildFollowersChart() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Followers vs Following',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Container(
              height: 150,
              child: SfChart(
                plotAreaBorderWidth: 0,
                primaryXAxis: CategoryAxis(),
                primaryYAxis: NumericAxis(
                  minimum: 0,
                  maximum: (_analytics!.followersCount > _analytics!.followingCount 
                      ? _analytics!.followersCount 
                      : _analytics!.followingCount) * 1.2,
                ),
                series: _getFollowersData(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<ColumnSeries<FollowersData, String>> _getFollowersData() {
    final List<FollowersData> data = [
      FollowersData('Followers', _analytics!.followersCount.toDouble()),
      FollowersData('Following', _analytics!.followingCount.toDouble()),
    ];

    return [
      ColumnSeries<FollowersData, String>(
        dataSource: data,
        xValueMapper: (FollowersData data, _) => data.category,
        yValueMapper: (FollowersData data, _) => data.value,
        name: 'Followers',
        color: Colors.blue,
      ),
    ];
  }

  Widget _buildPostPerformance() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Post Performance',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            ListTile(
              leading: Icon(Icons.thumb_up, color: Colors.green),
              title: Text('Likes Received'),
              trailing: Text(_analytics!.likesReceivedCount.toString()),
            ),
            ListTile(
              leading: Icon(Icons.comment, color: Colors.blue),
              title: Text('Comments Received'),
              trailing: Text(_analytics!.commentsReceivedCount.toString()),
            ),
            ListTile(
              leading: Icon(Icons.share, color: Colors.orange),
              title: Text('Shares Received'),
              trailing: Text(_analytics!.sharesReceivedCount.toString()),
            ),
          ],
        ),
      ),
    );
  }
}

class memberAnalytics {
  final int followersCount;
  final int followingCount;
  final int postsCount;
  final int likesReceivedCount;
  final int commentsReceivedCount;
  final int sharesReceivedCount;
  final double engagementRate;
  final DateTime createdAt;

  memberAnalytics({
    required this.followersCount,
    required this.followingCount,
    required this.postsCount,
    required this.likesReceivedCount,
    required this.commentsReceivedCount,
    required this.sharesReceivedCount,
    required this.engagementRate,
    required this.createdAt,
  });

  factory memberAnalytics.fromJson(Map<String, dynamic> json) {
    return memberAnalytics(
      followersCount: json['followers_count'] ?? 0,
      followingCount: json['following_count'] ?? 0,
      postsCount: json['posts_count'] ?? 0,
      likesReceivedCount: json['likes_received_count'] ?? 0,
      commentsReceivedCount: json['comments_received_count'] ?? 0,
      sharesReceivedCount: json['shares_received_count'] ?? 0,
      engagementRate: double.tryParse(json['engagement_rate']?.toString() ?? '0.0') ?? 0.0,
      createdAt: DateTime.tryParse(json['created_at'] ?? '') ?? DateTime.now(),
    );
  }
}

class EngagementData {
  final String category;
  final double value;

  EngagementData(this.category, this.value);
}

class FollowersData {
  final String category;
  final double value;

  FollowersData(this.category, this.value);
}