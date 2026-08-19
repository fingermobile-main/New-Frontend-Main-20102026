import 'package:flutter/material.dart';

class DatabaseIntegrationReportPage extends StatefulWidget {
  const DatabaseIntegrationReportPage({super.key});

  @override
  State<DatabaseIntegrationReportPage> createState() =>
      _DatabaseIntegrationReportPageState();
}

class _DatabaseIntegrationReportPageState
    extends State<DatabaseIntegrationReportPage> {
  bool _isLoading = false;
  String? _errorMessage;
  DatabaseIntegrationReport? _report;
  List<DatabaseMetric> _metrics = [];
  List<PerformanceChart> _charts = [];
  DateTime _startDate = DateTime.now().subtract(const Duration(days: 30));
  DateTime _endDate = DateTime.now();
  String _selectedDatabase = 'All Databases';

  @override
  void initState() {
    super.initState();
    _loadReportData();
  }

  Future<void> _loadReportData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock report data
      setState(() {
        _report = DatabaseIntegrationReport(
          totalDatabases: 12,
          activeDatabases: 10,
          failedDatabases: 2,
          totalQueries: 125430,
          avgResponseTime: 142,
          uptime: 99.8,
        );

        _metrics = [
          DatabaseMetric(
            title: 'Total Databases',
            value: '12',
            icon: Icons.storage,
            color: Colors.blue,
          ),
          DatabaseMetric(
            title: 'Active Connections',
            value: '10',
            icon: Icons.check_circle,
            color: Colors.green,
          ),
          DatabaseMetric(
            title: 'Failed Connections',
            value: '2',
            icon: Icons.error,
            color: Colors.red,
          ),
          DatabaseMetric(
            title: 'Avg Response Time',
            value: '142 ms',
            icon: Icons.speed,
            color: Colors.orange,
          ),
        ];

        _charts = [
          PerformanceChart(
            title: 'Query Performance',
            data: [
              ChartDataPoint(label: 'Jan', value: 12000),
              ChartDataPoint(label: 'Feb', value: 15000),
              ChartDataPoint(label: 'Mar', value: 18000),
              ChartDataPoint(label: 'Apr', value: 22000),
              ChartDataPoint(label: 'May', value: 25000),
            ],
          ),
          PerformanceChart(
            title: 'Database Uptime',
            data: [
              ChartDataPoint(label: 'Jan', value: 99.2),
              ChartDataPoint(label: 'Feb', value: 99.5),
              ChartDataPoint(label: 'Mar', value: 99.7),
              ChartDataPoint(label: 'Apr', value: 99.8),
              ChartDataPoint(label: 'May', value: 99.9),
            ],
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load report data. Please try again.';
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
        title: const Text('Database Integration Report'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.download),
            onPressed: () {
              // Download report
            },
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadReportData,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadReportData,
        child: _isLoading && _report == null
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _report == null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadReportData,
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
                          // Report Header
                          const Text(
                            'Integration Report',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Period: ${_formatDate(_startDate)} - ${_formatDate(_endDate)}',
                            style: const TextStyle(
                              fontSize: 16,
                              color: Colors.grey,
                            ),
                          ),
                          const SizedBox(height: 24),
                          // Filters
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                        child: DropdownButtonFormField<String>(
                                          initialValue: _selectedDatabase,
                                          decoration: const InputDecoration(
                                            labelText: 'Database',
                                            border: OutlineInputBorder(),
                                          ),
                                          items: const [
                                            DropdownMenuItem(
                                              value: 'All Databases',
                                              child: Text('All Databases'),
                                            ),
                                            DropdownMenuItem(
                                              value: 'member Identity DB',
                                              child: Text('member Identity DB'),
                                            ),
                                            DropdownMenuItem(
                                              value: 'Content DB',
                                              child: Text('Content DB'),
                                            ),
                                            DropdownMenuItem(
                                              value: 'Analytics DB',
                                              child: Text('Analytics DB'),
                                            ),
                                          ],
                                          onChanged: (value) {
                                            setState(() {
                                              _selectedDatabase = value ?? 'All Databases';
                                            });
                                          },
                                        ),
                                      ),
                                      const SizedBox(width: 16),
                                      ElevatedButton(
                                        onPressed: () {
                                          // Show date picker
                                        },
                                        child: const Text('Select Dates'),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 24),
                          // Metrics Overview
                          const Text(
                            'Key Metrics',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          _report != null
                              ? GridView.builder(
                                  gridDelegate:
                                      const SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: 2,
                                    crossAxisSpacing: 16,
                                    mainAxisSpacing: 16,
                                    childAspectRatio: 1.5,
                                  ),
                                  itemCount: _metrics.length,
                                  shrinkWrap: true,
                                  physics: const NeverScrollableScrollPhysics(),
                                  itemBuilder: (context, index) {
                                    var metric = _metrics[index];
                                    return Card(
                                      child: Padding(
                                        padding: const EdgeInsets.all(16.0),
                                        child: Column(
                                          mainAxisAlignment:
                                              MainAxisAlignment.center,
                                          children: [
                                            Icon(
                                              metric.icon,
                                              color: metric.color,
                                              size: 32,
                                            ),
                                            const SizedBox(height: 8),
                                            Text(
                                              metric.title,
                                              style: const TextStyle(
                                                fontSize: 14,
                                                color: Colors.grey,
                                              ),
                                            ),
                                            const SizedBox(height: 8),
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
                                    );
                                  },
                                )
                              : const SizedBox.shrink(),
                          const SizedBox(height: 32),
                          // Performance Charts
                          const Text(
                            'Performance Charts',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _charts.length,
                            itemBuilder: (context, index) {
                              var chart = _charts[index];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 16),
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        chart.title,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 18,
                                        ),
                                      ),
                                      const SizedBox(height: 16),
                                      Container(
                                        height: 200,
                                        decoration: BoxDecoration(
                                          color: Colors.grey.shade200,
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Center(
                                          child: Text('${chart.title} Chart'),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                          const SizedBox(height: 32),
                          // Detailed Report
                          const Text(
                            'Detailed Report',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Card(
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                children: [
                                  _buildReportRow('Total Databases', _report?.totalDatabases.toString() ?? 'N/A'),
                                  const Divider(),
                                  _buildReportRow('Active Databases', _report?.activeDatabases.toString() ?? 'N/A'),
                                  const Divider(),
                                  _buildReportRow('Failed Databases', _report?.failedDatabases.toString() ?? 'N/A'),
                                  const Divider(),
                                  _buildReportRow('Total Queries', _report?.totalQueries.toString() ?? 'N/A'),
                                  const Divider(),
                                  _buildReportRow('Average Response Time', '${_report?.avgResponseTime.toString() ?? 'N/A'} ms'),
                                  const Divider(),
                                  _buildReportRow('System Uptime', '${_report?.uptime.toString() ?? 'N/A'}%'),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
      ),
    );
  }

  Widget _buildReportRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(value),
      ],
    );
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}

class DatabaseIntegrationReport {
  final int totalDatabases;
  final int activeDatabases;
  final int failedDatabases;
  final int totalQueries;
  final int avgResponseTime;
  final double uptime;

  DatabaseIntegrationReport({
    required this.totalDatabases,
    required this.activeDatabases,
    required this.failedDatabases,
    required this.totalQueries,
    required this.avgResponseTime,
    required this.uptime,
  });
}

class DatabaseMetric {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  DatabaseMetric({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });
}

class PerformanceChart {
  final String title;
  final List<ChartDataPoint> data;

  PerformanceChart({
    required this.title,
    required this.data,
  });
}

class ChartDataPoint {
  final String label;
  final double value;

  ChartDataPoint({
    required this.label,
    required this.value,
  });
}