import 'package:flutter/material.dart';
import 'package:fingermobile_app/services/api_service.dart';

class AdminControlDashboard extends StatefulWidget {
  const AdminControlDashboard({super.key});

  @override
  State<AdminControlDashboard> createState() => _AdminControlDashboardState();
}

class _AdminControlDashboardState extends State<AdminControlDashboard> {
  final ApiService _ApiService = ApiService();
  List<dynamic> _verificationRecords = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadVerificationRecords();
  }

  Future<void> _loadVerificationRecords() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await _ApiService.getAdminVerificationRecords();
      if (response.isSuccess) {
        setState(() {
          _verificationRecords = response.data as List<dynamic>;
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = response.errorMessage;
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load verification records: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _updateVerificationStatus(String recordId, String newStatus) async {
    try {
      final response = await _ApiService.updateVerificationStatus({
        'recordId': recordId,
        'status': newStatus,
      });

      if (response.isSuccess) {
        // Refresh the records after update
        await _loadVerificationRecords();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Verification status updated successfully'),
              backgroundColor: Colors.green,
            ),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to update status: ${response.errorMessage}'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error updating status: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Control Dashboard'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: RefreshIndicator(
        onRefresh: _loadVerificationRecords,
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
                          onPressed: _loadVerificationRecords,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : _verificationRecords.isEmpty
                    ? const Center(
                        child: Text('No verification records found'),
                      )
                    : ListView.builder(
                        itemCount: _verificationRecords.length,
                        itemBuilder: (context, index) {
                          final record = _verificationRecords[index];
                          return Card(
                            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              record['memberId'] ?? 'N/A',
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 16,
                                              ),
                                            ),
                                            Text(
                                              record['requestType'] ?? 'N/A',
                                              style: const TextStyle(color: Colors.grey),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: _getStatusColor(record['status']),
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        child: Text(
                                          record['status']?.toUpperCase() ?? 'UNKNOWN',
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 12,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    'Submitted: ${record['submittedAt'] ?? 'N/A'}',
                                    style: const TextStyle(color: Colors.grey),
                                  ),
                                  if (record['reviewedBy'] != null) ...[
                                    const SizedBox(height: 4),
                                    Text(
                                      'Reviewed by: ${record['reviewedBy']}',
                                      style: const TextStyle(color: Colors.grey),
                                    ),
                                  ],
                                  const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      Expanded(
                                        child: ElevatedButton.icon(
                                          onPressed: record['status'] == 'pending'
                                              ? () => _updateVerificationStatus(record['id'], 'approved')
                                              : null,
                                          icon: const Icon(Icons.check, size: 18),
                                          label: const Text('Approve'),
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: Colors.green,
                                            foregroundColor: Colors.white,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: ElevatedButton.icon(
                                          onPressed: record['status'] == 'pending'
                                              ? () => _updateVerificationStatus(record['id'], 'rejected')
                                              : null,
                                          icon: const Icon(Icons.clear, size: 18),
                                          label: const Text('Reject'),
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: Colors.red,
                                            foregroundColor: Colors.white,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        },
                      ),
      ),
    );
  }

  Color _getStatusColor(String? status) {
    switch (status?.toLowerCase()) {
      case 'approved':
        return Colors.green;
      case 'rejected':
        return Colors.red;
      case 'pending':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }
}