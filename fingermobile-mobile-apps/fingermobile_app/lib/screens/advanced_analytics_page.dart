import 'package:flutter/material.dart';
import 'package:fingermobile_app/services/api_service.dart';

class AdvancedAnalyticsPage extends StatefulWidget {
  const AdvancedAnalyticsPage({super.key});

  @override
  State<AdvancedAnalyticsPage> createState() => _AdvancedAnalyticsPageState();
}

class _AdvancedAnalyticsPageState extends State<AdvancedAnalyticsPage> {
  final ApiService _ApiService = ApiService();
  Map<String, dynamic>? _analyticsData;
  bool _isLoading = true;
  String? _errorMessage;
  String _timeRange = '7d'; // Default to 7 days

  @override
  void initState() {
    super.initState();
    _loadAnalyticsData();
  }

  Future<void> _loadAnalyticsData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // In a real implementation, we would call the actual analytics API
      // For now, we'll simulate the data
      await Future.delayed(const Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _analyticsData = {
          'totalmembers': 12540,
          'activemembers': 8750,
          'newmembers': 125,
          'pageViews': 45678,
          'avgSessionDuration': '4m 22s',
          'bounceRate': '24.5%',
          'engagementScore': 78.3,
          'topPages': [
            {'name': 'Home', 'views': 12500},
            {'name': 'Dashboard', 'views': 8900},
            {'name': 'Profile', 'views': 6700},
            {'name': 'Settings', 'views': 4500},
          ],
          'memberGrowth': [
            {'day': 'Mon', 'count': 120},
            {'day': 'Tue', 'count': 135},
            {'day': 'Wed', 'count': 142},
            {'day': 'Thu', 'count': 128},
            {'day': 'Fri', 'count': 156},
            {'day': 'Sat', 'count': 145},
            {'day': 'Sun', 'count': 132},
          ],
        };
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load analytics data: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Advanced Analytics'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          PopupMenuButton<String>(
            onSelected: (String result) {
              setState(() {
                _timeRange = result;
              });
              _loadAnalyticsData();
            },
            itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
              const PopupMenuItem<String>(
                value: '24h',
                child: Text('Last 24 Hours'),
              ),
              const PopupMenuItem<String>(
                value: '7d',
                child: Text('Last 7 Days'),
              ),
              const PopupMenuItem<String>(
                value: '30d',
                child: Text('Last 30 Days'),
              ),
              const PopupMenuItem<String>(
                value: '90d',
                child: Text('Last 90 Days'),
              ),
            ],
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadAnalyticsData,
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadAnalyticsData,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : _analyticsData == null
                    ? const Center(child: Text('No analytics data available'))
                    : SingleChildScrollView(
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Summary Cards
                              Wrap(
                                spacing: 16,
                                runSpacing: 16,
                                children: [
                                  _buildSummaryCard(
                                    'Total members',
                                    _analyticsData!['totalmembers'].toString(),
                                    Icons.people,
                                    Colors.blue,
                                  ),
                                  _buildSummaryCard(
                                    'Active members',
                                    _analyticsData!['activemembers'].toString(),
                                    Icons.visibility,
                                    Colors.green,
                                  ),
                                  _buildSummaryCard(
                                    'New members',
                                    '+${_analyticsData!['newmembers']}',
                                    Icons.person_add,
                                    Colors.orange,
                                  ),
                                  _buildSummaryCard(
                                    'Page Views',
                                    _analyticsData!['pageViews'].toString(),
                                    Icons.insert_chart,
                                    Colors.purple,
                                  ),
                                ],
                              ),
                              const SizedBox(height: 24),
                              
                              // Charts Section
                              const Text(
                                'member Growth',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 16),
                              Container(
                                height: 200,
                                decoration: BoxDecoration(
                                  border: Border.all(color: Colors.grey.withOpacity(0.3)),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: _buildmemberGrowthChart(),
                              ),
                              const SizedBox(height: 24),
                              
                              // Top Pages Section
                              const Text(
                                'Top Pages',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 16),
                              ..._buildTopPagesList(),
                              const SizedBox(height: 24),
                              
                              // Additional Metrics
                              _buildMetricCard(
                                'Avg. Session Duration',
                                _analyticsData!['avgSessionDuration'],
                              ),
                              const SizedBox(height: 12),
                              _buildMetricCard(
                                'Bounce Rate',
                                _analyticsData!['bounceRate'],
                              ),
                              const SizedBox(height: 12),
                              _buildMetricCard(
                                'Engagement Score',
                                '${_analyticsData!['engagementScore']}%',
                              ),
                            ],
                          ),
                        ),
                      ),
      ),
    );
  }

  Widget _buildSummaryCard(String title, String value, IconData icon, Color color) {
    return SizedBox(
      width: MediaQuery.of(context).size.width / 2 - 24,
      child: Card(
        elevation: 4,
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(icon, color: color),
                  const SizedBox(width: 8),
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                value,
                style: const TextStyle(
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

  Widget _buildmemberGrowthChart() {
    final data = _analyticsData!['memberGrowth'] as List<dynamic>;
    
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          Expanded(
            child: Row(
              children: data.asMap().entries.map((entry) {
                final item = entry.value as Map<String, dynamic>;
                final maxValue = (data.map((e) => (e as Map<String, dynamic>)['count'] as int).reduce((a, b) => a > b ? a : b)).toDouble();
                
                return Expanded(
                  child: Column(
                    children: [
                      Expanded(
                        child: Container(
                          alignment: Alignment.bottomCenter,
                          child: FractionallySizedBox(
                            heightFactor: (item['count'] as int).toDouble() / maxValue,
                            child: Container(
                              width: 20,
                              decoration: BoxDecoration(
                                color: Colors.blue,
                                borderRadius: BorderRadius.circular(4),
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        item['day'],
                        style: const TextStyle(fontSize: 12),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildTopPagesList() {
    final topPages = _analyticsData!['topPages'] as List<dynamic>;
    
    return topPages.map((page) {
      final pageInfo = page as Map<String, dynamic>;
      return Card(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  pageInfo['name'],
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
              Text(
                pageInfo['views'].toString(),
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.blue,
                ),
              ),
            ],
          ),
        ),
      );
    }).toList();
  }

  Widget _buildMetricCard(String title, String value) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
            Text(
              value,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Colors.green,
              ),
            ),
          ],
        ),
      ),
    );
  }
}