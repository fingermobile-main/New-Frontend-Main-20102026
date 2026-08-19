import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fingermobile_app/services/platform_api_service_enhanced.dart';
import 'package:fingermobile_app/utils/api_testing_utility.dart';
import 'package:intl/intl.dart';

/// Complete LendSqr Screen with all features:
/// - Loading states
/// - Error handling
/// - Offline mode
/// - Caching
/// - Pull to refresh
class LendSqrScreen extends StatefulWidget {
  const LendSqrScreen({Key? key}) : super(key: key);

  @override
  State<LendSqrScreen> createState() => _LendSqrScreenState();
}

class _LendSqrScreenState extends State<LendSqrScreen> {
  late PlatformApiServiceEnhanced api;
  bool isLoading = true;
  bool isOffline = false;
  String? error;
  List loans = [];
  Map? creditScore;
  int selectedTab = 0;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    api = context.watch<PlatformApiServiceEnhanced>();
    api.addListener(_onApiChange);
  }

  @override
  void dispose() {
    api.removeListener(_onApiChange);
    super.dispose();
  }

  void _onApiChange() {
    if (mounted) {
      setState(() {
        isOffline = api.isOffline;
      });
      
      if (isOffline) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('📴 You are offline. Showing cached data.'),
            backgroundColor: Colors.orange,
            duration: Duration(seconds: 3),
          ),
        );
      }
    }
  }

  Future<void> _loadData() async {
    setState(() {
      isLoading = true;
      error = null;
    });

    try {
      // Load loans
      final loansResult = await api.getLoans(page: 1, limit: 10, useCache: true);
      
      // Load credit score
      final scoreResult = await api.getCurrentCreditScore(useCache: true);

      if (loansResult.isSuccess && scoreResult.isSuccess) {
        setState(() {
          loans = loansResult.data ?? [];
          creditScore = scoreResult.data;
          isLoading = false;
        });
      } else {
        setState(() {
          error = loansResult.message ?? scoreResult.message ?? 'Failed to load data';
          isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        error = 'Error: $e';
        isLoading = false;
      });
    }
  }

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('LendSqr'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
        ],
      ),
      body: Column(
        children: [
          // Offline Banner
          if (isOffline)
            Container(
              color: Colors.orange.shade100,
              padding: const EdgeInsets.all(8),
              child: Row(
                children: [
                  const Icon(Icons.wifi_off, color: Colors.orange),
                  const SizedBox(width: 8),
                  const Text('Offline Mode - Showing cached data'),
                ],
              ),
            ),

          // Credit Score Card
          if (creditScore != null)
            Container(
              margin: const EdgeInsets.all(16),
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    _getScoreColor(creditScore!['score']),
                    _getScoreColor(creditScore!['score']).withOpacity(0.7),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: _getScoreColor(creditScore!['score']).withOpacity(0.3),
                    blurRadius: 10,
                    offset: const Offset(0, 5),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Credit Score',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const Icon(
                        Icons.trending_up,
                        color: Colors.white,
                        size: 28,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Text(
                    creditScore!['score']?.toString() ?? 'N/A',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _getScoreLabel(creditScore!['score']),
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),

          // Tabs
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                Expanded(
                  child: _buildTab('My Loans', 0),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _buildTab('Apply', 1),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Content
          Expanded(
            child: _buildContent(),
          ),
        ],
      ),
      floatingActionButton: selectedTab == 1
          ? FloatingActionButton.extended(
              onPressed: _applyForLoan,
              icon: const Icon(Icons.add),
              label: const Text('Apply Now'),
            )
          : null,
    );
  }

  Widget _buildTab(String label, int index) {
    final isSelected = selectedTab == index;
    return GestureDetector(
      onTap: () => setState(() => selectedTab = index),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? Theme.of(context).primaryColor : Colors.grey.shade200,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Center(
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.white : Colors.grey.shade700,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildContent() {
    if (isLoading) {
      return const LoadingState(
        message: 'Loading your loans...',
        isLoading: true,
        child: SizedBox.shrink(),
      );
    }

    if (error != null) {
      return ErrorState(
        message: error!,
        onRetry: _loadData,
      );
    }

    if (selectedTab == 0) {
      // Loans Tab
      if (loans.isEmpty) {
        return EmptyState(
          message: 'No loans yet',
          icon: Icons.account_balance_wallet,
          actionLabel: 'Apply for Loan',
          onAction: () => setState(() => selectedTab = 1),
        );
      }

      return RefreshIndicator(
        onRefresh: _loadData,
        child: ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: loans.length,
          itemBuilder: (context, index) {
            final loan = loans[index];
            return _buildLoanCard(loan);
          },
        ),
      );
    } else {
      // Apply Tab
      return _buildApplyForm();
    }
  }

  Widget _buildLoanCard(Map loan) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    '${loan['loan_type'] ?? 'Personal Loan'}',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
                _buildStatusChip(loan['status']),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              '₦${_formatAmount(loan['amount'])}',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Theme.of(context).primaryColor,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                _buildInfoChip(Icons.calendar_today, '${loan['tenure_months']} months'),
                const SizedBox(width: 8),
                _buildInfoChip(Icons.percent, '${loan['interest_rate']}%'),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              'Purpose: ${loan['purpose'] ?? 'N/A'}',
              style: TextStyle(color: Colors.grey.shade600),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Text(
                  'Created: ',
                  style: TextStyle(color: Colors.grey.shade600),
                ),
                Text(
                  _formatDate(loan['created_at']),
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
              ],
            ),
            if (loan['status'] == 'pending') ...[
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () => _cancelLoan(loan['id']),
                  icon: const Icon(Icons.cancel, color: Colors.red),
                  label: const Text(
                    'Cancel Application',
                    style: TextStyle(color: Colors.red),
                  ),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Colors.red),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(4),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: Colors.grey.shade600),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(fontSize: 12, color: Colors.grey.shade700),
          ),
        ],
      ),
    );
  }

  Widget _buildStatusChip(String? status) {
    Color color;
    IconData icon;

    switch (status) {
      case 'approved':
        color = Colors.green;
        icon = Icons.check_circle;
        break;
      case 'pending':
        color = Colors.orange;
        icon = Icons.schedule;
        break;
      case 'rejected':
        color = Colors.red;
        icon = Icons.cancel;
        break;
      case 'disbursed':
        color = Colors.blue;
        icon = Icons.payment;
        break;
      default:
        color = Colors.grey;
        icon = Icons.help;
    }

    return Chip(
      avatar: Icon(icon, size: 16, color: color),
      label: Text(
        status?.toUpperCase() ?? 'UNKNOWN',
        style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 12),
      ),
      backgroundColor: color.withOpacity(0.1),
      labelPadding: EdgeInsets.zero,
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
    );
  }

  Widget _buildApplyForm() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Loan Application',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 24),
          TextField(
            decoration: const InputDecoration(
              labelText: 'Loan Amount (₦)',
              border: OutlineInputBorder(),
              prefixText: '₦ ',
            ),
            keyboardType: TextInputType.number,
          ),
          const SizedBox(height: 16),
          DropdownButtonFormField<String>(
            decoration: const InputDecoration(
              labelText: 'Loan Type',
              border: OutlineInputBorder(),
            ),
            items: const [
              DropdownMenuItem(value: 'personal', child: Text('Personal Loan')),
              DropdownMenuItem(value: 'business', child: Text('Business Loan')),
              DropdownMenuItem(value: 'emergency', child: Text('Emergency Loan')),
            ],
            onChanged: (value) {},
          ),
          const SizedBox(height: 16),
          TextField(
            decoration: const InputDecoration(
              labelText: 'Tenure (months)',
              border: OutlineInputBorder(),
              hintText: 'e.g., 12',
            ),
            keyboardType: TextInputType.number,
          ),
          const SizedBox(height: 16),
          TextField(
            decoration: const InputDecoration(
              labelText: 'Purpose',
              border: OutlineInputBorder(),
              hintText: 'Why do you need this loan?',
            ),
            maxLines: 3,
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            height: 50,
            child: ElevatedButton(
              onPressed: _submitLoanApplication,
              child: const Text(
                'Submit Application',
                style: TextStyle(fontSize: 16),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _applyForLoan() {
    setState(() => selectedTab = 1);
  }

  Future<void> _submitLoanApplication() async {
    // In real implementation, gather form data and call API
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Application submitted (mock)')),
    );
  }

  Future<void> _cancelLoan(String loanId) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Cancel Loan'),
        content: const Text('Are you sure you want to cancel this loan application?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('No'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
            child: const Text('Yes, Cancel'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      final result = await api.cancelLoan(loanId);
      
      if (result.isSuccess) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Loan cancelled successfully')),
        );
        _loadData();
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result.message ?? 'Failed to cancel')),
        );
      }
    }
  }

  String _formatAmount(dynamic amount) {
    if (amount == null) return '0.00';
    return NumberFormat('#,##0.00').format(amount);
  }

  String _formatDate(dynamic date) {
    if (date == null) return 'N/A';
    try {
      final dateTime = date is String ? DateTime.parse(date) : date;
      return DateFormat('MMM dd, yyyy').format(dateTime);
    } catch (e) {
      return 'N/A';
    }
  }

  Color _getScoreColor(int? score) {
    if (score == null) return Colors.grey;
    if (score >= 750) return Colors.green;
    if (score >= 650) return Colors.orange;
    return Colors.red;
  }

  String _getScoreLabel(int? score) {
    if (score == null) return 'No Score';
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  }
}
