import 'package:flutter/material.dart';

class memberReportsScreen extends StatefulWidget {
  @override
  _memberReportsScreenState createState() => _memberReportsScreenState();
}

class _memberReportsScreenState extends State<memberReportsScreen> {
  List<ReportItem> _reports = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadReports();
  }

  Future<void> _loadReports() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _reports = [
          ReportItem(
            id: 1,
            reporterName: 'John Doe',
            reportedmember: 'Spammember456',
            category: 'Spam',
            description: 'This member is posting spam content',
            reportedAt: DateTime.now().subtract(Duration(hours: 3)),
            status: 'pending',
          ),
          ReportItem(
            id: 2,
            reporterName: 'Jane Smith',
            reportedmember: 'Harasser789',
            category: 'Harassment',
            description: 'This member is harassing other members',
            reportedAt: DateTime.now().subtract(Duration(hours: 5)),
            status: 'under_review',
          ),
          ReportItem(
            id: 3,
            reporterName: 'Mike Johnson',
            reportedmember: 'Inappropriatemember',
            category: 'Inappropriate Content',
            description: 'This member is sharing inappropriate images',
            reportedAt: DateTime.now().subtract(Duration(hours: 8)),
            status: 'resolved',
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading reports: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading reports')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('member Reports'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _reports.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.flag,
                        size: 80,
                        color: Colors.grey[400],
                      ),
                      SizedBox(height: 16),
                      Text(
                        'No reports',
                        style: TextStyle(
                          fontSize: 20,
                          color: Colors.grey[600],
                        ),
                      ),
                      SizedBox(height: 8),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          'There are no active reports to review',
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
                  onRefresh: _loadReports,
                  child: ListView.builder(
                    itemCount: _reports.length,
                    itemBuilder: (context, index) {
                      final report = _reports[index];
                      return _buildReportItem(report);
                    },
                  ),
                ),
    );
  }

  Widget _buildReportItem(ReportItem report) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  Icons.flag,
                  color: _getStatusColor(report.status),
                  size: 24,
                ),
                SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        report.category,
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      Text(
                        'Reported ${_formatTime(report.reportedAt)}',
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getStatusColor(report.status),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    report.status.toUpperCase(),
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            SizedBox(height: 12),
            Text(
              'Reported member: ${report.reportedmember}',
              style: TextStyle(fontSize: 16),
            ),
            SizedBox(height: 4),
            Text(
              'Reported by: ${report.reporterName}',
              style: TextStyle(fontSize: 14, color: Colors.grey[600]),
            ),
            SizedBox(height: 8),
            Text(
              report.description,
              style: TextStyle(fontSize: 14),
            ),
            if (report.status == 'pending')
              Padding(
                padding: EdgeInsets.only(top: 12),
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          // Mark as resolved
                          _updateReportStatus(report.id, 'resolved');
                        },
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(color: Colors.green),
                        ),
                        child: Text(
                          'Resolve',
                          style: TextStyle(color: Colors.green),
                        ),
                      ),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          // Escalate report
                          _escalateReport(report.id);
                        },
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(color: Colors.orange),
                        ),
                        child: Text(
                          'Escalate',
                          style: TextStyle(color: Colors.orange),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'pending':
        return Colors.orange;
      case 'under_review':
        return Colors.blue;
      case 'resolved':
        return Colors.green;
      case 'dismissed':
        return Colors.grey;
      default:
        return Colors.grey;
    }
  }

  String _formatTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 0) {
      return '${difference.inDays}d ago';
    } else if (difference.inHours > 0) {
      return '${difference.inHours}h ago';
    } else if (difference.inMinutes > 0) {
      return '${difference.inMinutes}m ago';
    } else {
      return 'Just now';
    }
  }

  void _updateReportStatus(int reportId, String newStatus) {
    setState(() {
      final index = _reports.indexWhere((r) => r.id == reportId);
      if (index != -1) {
        _reports[index] = ReportItem(
          id: _reports[index].id,
          reporterName: _reports[index].reporterName,
          reportedmember: _reports[index].reportedmember,
          category: _reports[index].category,
          description: _reports[index].description,
          reportedAt: _reports[index].reportedAt,
          status: newStatus,
        );
      }
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Report status updated'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _escalateReport(int reportId) {
    // In a real app, this would escalate the report
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Report escalated'),
        backgroundColor: Colors.orange,
      ),
    );
  }
}

class ReportItem {
  final int id;
  final String reporterName;
  final String reportedmember;
  final String category;
  final String description;
  final DateTime reportedAt;
  final String status;

  ReportItem({
    required this.id,
    required this.reporterName,
    required this.reportedmember,
    required this.category,
    required this.description,
    required this.reportedAt,
    required this.status,
  });
}