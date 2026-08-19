import 'package:flutter/material.dart';

class DatabaseIntegrationSummary extends StatefulWidget {
  const DatabaseIntegrationSummary({super.key});

  @override
  State<DatabaseIntegrationSummary> createState() =>
      _DatabaseIntegrationSummaryState();
}

class _DatabaseIntegrationSummaryState
    extends State<DatabaseIntegrationSummary> {
  bool _isLoading = false;
  String? _errorMessage;
  DatabaseIntegrationOverview? _overview;
  List<DatabaseConnectionSummary> _connections = [];
  List<PerformanceMetric> _metrics = [];

  @override
  void initState() {
    super.initState();
    _loadSummaryData();
  }

  Future<void> _loadSummaryData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock summary data
      setState(() {
        _overview = DatabaseIntegrationOverview(
          totalDatabases: 12,
          activeConnections: 10,
          failedConnections: 2,
          totalQueries: 125430,
          avgResponseTime: 142,
          uptime: 99.8,
        );

        _connections = [
          DatabaseConnectionSummary(
            id: 1,
            name: 'member Identity DB',
            type: 'PostgreSQL',
            status: ConnectionStatus.connected,
            lastSync: DateTime.now().subtract(const Duration(minutes: 5)),
            queriesPerSecond: 42,
          ),
          DatabaseConnectionSummary(
            id: 2,
            name: 'Content Management DB',
            type: 'MongoDB',
            status: ConnectionStatus.connected,
            lastSync: DateTime.now().subtract(const Duration(minutes: 2)),
            queriesPerSecond: 28,
          ),
          DatabaseConnectionSummary(
            id: 3,
            name: 'Analytics DB',
            type: 'MySQL',
            status: ConnectionStatus.disconnected,
            lastSync: DateTime.now().subtract(const Duration(hours: 1)),
            queriesPerSecond: 0,
          ),
          DatabaseConnectionSummary(
            id: 4,
            name: 'Payment Processing DB',
            type: 'PostgreSQL',
            status: ConnectionStatus.connecting,
            lastSync: DateTime.now().subtract(const Duration(minutes: 10)),
            queriesPerSecond: 15,
          ),
        ];

        _metrics = [
          PerformanceMetric(
            name: 'Query Throughput',
            value: '1,254 QPS',
            change: '+12.4%',
            trend: Trend.up,
          ),
          PerformanceMetric(
            name: 'Avg Latency',
            value: '142 ms',
            change: '-5.2%',
            trend: Trend.down,
          ),
          PerformanceMetric(
            name: 'Error Rate',
            value: '0.2%',
            change: '-0.1%',
            trend: Trend.down,
          ),
          PerformanceMetric(
            name: 'Availability',
            value: '99.8%',
            change: '+0.1%',
            trend: Trend.up,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load summary data. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Database Integration Summary'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadSummaryData,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadSummaryData,
        child: _isLoading && _overview == null
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _overview == null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadSummaryData,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : SingleChildScrollView(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Header
                          const Text(
                            'Integration Summary',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Overview of database connections and performance metrics',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.grey,
                            ),
                          ),
                          const SizedBox(height: 24),
                          // Overview Cards
                          const Text(
                            'System Overview',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          _overview != null
                              ? GridView.builder(
                                  gridDelegate:
                                      const SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: 2,
                                    crossAxisSpacing: 16,
                                    mainAxisSpacing: 16,
                                    childAspectRatio: 1.5,
                                  ),
                                  itemCount: 6,
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  itemBuilder: (context, index) {
                                    List<Map<String, dynamic>> overviewData = [
                                      {
                                        'title': 'Total Databases',
                                        'value': _overview!.totalDatabases.toString(),
                                        'icon': Icons.storage,
                                        'color': Colors.blue,
                                      },
                                      {
                                        'title': 'Active Connections',
                                        'value': _overview!.activeConnections.toString(),
                                        'icon': Icons.check_circle,
                                        'color': Colors.green,
                                      },
                                      {
                                        'title': 'Failed Connections',
                                        'value': _overview!.failedConnections.toString(),
                                        'icon': Icons.error,
                                        'color': Colors.red,
                                      },
                                      {
                                        'title': 'Total Queries',
                                        'value': _overview!.totalQueries.toString(),
                                        'icon': Icons.query_builder,
                                        'color': Colors.purple,
                                      },
                                      {
                                        'title': 'Avg Response',
                                        'value': '${_overview!.avgResponseTime} ms',
                                        'icon': Icons.speed,
                                        'color': Colors.orange,
                                      },
                                      {
                                        'title': 'Uptime',
                                        'value': '${_overview!.uptime}%',
                                        'icon': Icons.av_timer,
                                        'color': Colors.teal,
                                      },
                                    ];

                                    var data = overviewData[index];
                                    return Card(
                                      child: Padding(
                                        padding: const EdgeInsets.all(16.0),
                                        child: Column(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: [
                                            Icon(
                                              data['icon'],
                                              color: data['color'],
                                              size: 32,
                                            ),
                                            const SizedBox(height: 8),
                                            Text(
                                              data['title'],
                                              style: const TextStyle(
                                                fontSize: 14,
                                                color: Colors.grey,
                                              ),
                                            ),
                                            const SizedBox(height: 8),
                                            Text(
                                              data['value'],
                                              style: const TextStyle(
                                                fontSize: 20,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    );
                                  },
                                )
                              : const SizedBox.shrink(),
                          const SizedBox(height: 32),
                          // Performance Metrics
                          const Text(
                            'Performance Metrics',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: ListView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount: _metrics.length,
                                itemBuilder: (context, index) {
                                  var metric = _metrics[index];
                                  return Padding(
                                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                                    child: Row(
                                      children: [
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                metric.name,
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              const SizedBox(height: 4),
                                              Text(
                                                metric.value,
                                                style: const TextStyle(
                                                  fontSize: 20,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Row(
                                          children: [
                                            Icon(
                                              metric.trend == Trend.up
                                                  ? Icons.trending_up
                                                  : Icons.trending_down,
                                              color: metric.trend == Trend.up
                                                  ? Colors.green
                                                  : Colors.red,
                                            ),
                                            const SizedBox(width: 4),
                                            Text(
                                              metric.change,
                                              style: TextStyle(
                                                color: metric.trend == Trend.up
                                                    ? Colors.green
                                                    : Colors.red,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                            ),
                          ),
                          const SizedBox(height: 32),
                          // Database Connections
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Database Connections',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  // View all connections
                                },
                                child: const Text('View All'),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _connections.length,
                            itemBuilder: (context, index) {
                              var connection = _connections[index];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 12),
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            connection.name,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 16,
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 8,
                                              vertical: 4,
                                            ),
                                            decoration: BoxDecoration(
                                              color: _getConnectionColor(connection.status),
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: Text(
                                              _getConnectionStatusText(connection.status),
                                              style: const TextStyle(
                                                color: Colors.white,
                                                fontSize: 12,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        '${connection.type} Database',
                                        style: const TextStyle(
                                          color: Colors.grey,
                                        ),
                                      ),
                                      const SizedBox(height: 16),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          _buildInfoItem(
                                            Icons.sync,
                                            'Last sync: ${_formatRelativeTime(connection.lastSync)}',
                                          ),
                                          _buildInfoItem(
                                            Icons.query_stats,
                                            '${connection.queriesPerSecond} QPS',
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
      ),
    );
  }

  Widget _buildInfoItem(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey),
        const SizedBox(width: 4),
        Text(
          text,
          style: const TextStyle(
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Color _getConnectionColor(ConnectionStatus status) {
    switch (status) {
      case ConnectionStatus.connected:
        return Colors.green;
      case ConnectionStatus.connecting:
        return Colors.orange;
      case ConnectionStatus.disconnected:
        return Colors.red;
    }
  }

  String _getConnectionStatusText(ConnectionStatus status) {
    switch (status) {
      case ConnectionStatus.connected:
        return 'Connected';
      case ConnectionStatus.connecting:
        return 'Connecting';
      case ConnectionStatus.disconnected:
        return 'Disconnected';
    }
  }

  String _formatRelativeTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes} min ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours} hours ago';
    } else {
      return '${difference.inDays} days ago';
    }
  }
}

enum ConnectionStatus { connected, connecting, disconnected }
enum Trend { up, down }

class DatabaseIntegrationOverview {
  final int totalDatabases;
  final int activeConnections;
  final int failedConnections;
  final int totalQueries;
  final int avgResponseTime;
  final double uptime;

  DatabaseIntegrationOverview({
    required this.totalDatabases,
    required this.activeConnections,
    required this.failedConnections,
    required this.totalQueries,
    required this.avgResponseTime,
    required this.uptime,
  });
}

class DatabaseConnectionSummary {
  final int id;
  final String name;
  final String type;
  final ConnectionStatus status;
  final DateTime lastSync;
  final int queriesPerSecond;

  DatabaseConnectionSummary({
    required this.id,
    required this.name,
    required this.type,
    required this.status,
    required this.lastSync,
    required this.queriesPerSecond,
  });
}

class PerformanceMetric {
  final String name;
  final String value;
  final String change;
  final Trend trend;

  PerformanceMetric({
    required this.name,
    required this.value,
    required this.change,
    required this.trend,
  });
}