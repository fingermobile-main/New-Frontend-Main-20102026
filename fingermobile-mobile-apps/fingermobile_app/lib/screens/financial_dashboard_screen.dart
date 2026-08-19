import 'package:flutter/material.dart';
import 'package:fingermobile_app/services/content_service.dart';

class FinancialDashboardScreen extends StatefulWidget {
  const FinancialDashboardScreen({super.key});

  @override
  State<FinancialDashboardScreen> createState() => _FinancialDashboardScreenState();
}

class _FinancialDashboardScreenState extends State<FinancialDashboardScreen> {
  late Future<FinancialSummary> _financialSummaryFuture;

  @override
  void initState() {
    super.initState();
    _financialSummaryFuture = ContentService.getFinancialSummary();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Financial Dashboard'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: FutureBuilder<FinancialSummary>(
        future: _financialSummaryFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error, size: 50, color: Colors.red),
                  const SizedBox(height: 16),
                  const Text('Failed to load financial data'),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _financialSummaryFuture = ContentService.getFinancialSummary();
                      });
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          } else if (snapshot.hasData) {
            final summary = snapshot.data!;
            return SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Balance card
                    Card(
                      color: Theme.of(context).colorScheme.primary,
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Available Balance',
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 16,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              '${summary.currency} ${summary.balance.toStringAsFixed(2)}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 32,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            Row(
                              children: [
                                Expanded(
                                  child: ElevatedButton(
                                    onPressed: () {
                                      // TODO: Implement add funds functionality
                                    },
                                    child: const Text('Add Funds'),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: ElevatedButton(
                                    onPressed: () {
                                      // TODO: Implement withdraw functionality
                                    },
                                    child: const Text('Withdraw'),
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),
                    // Recent transactions
                    const Text(
                      'Recent Transactions',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    ListView.builder(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: summary.recentTransactions.length,
                      itemBuilder: (context, index) {
                        final transaction = summary.recentTransactions[index];
                        return Card(
                          child: ListTile(
                            leading: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: transaction.type == 'credit'
                                    ? Colors.green[100]
                                    : Colors.red[100],
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                transaction.type == 'credit'
                                    ? Icons.arrow_downward
                                    : Icons.arrow_upward,
                                color: transaction.type == 'credit'
                                    ? Colors.green
                                    : Colors.red,
                              ),
                            ),
                            title: Text(transaction.description),
                            subtitle: Text(_formatDate(transaction.date)),
                            trailing: Text(
                              '${transaction.type == 'credit' ? '+' : '-'}${summary.currency} ${transaction.amount.toStringAsFixed(2)}',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: transaction.type == 'credit'
                                    ? Colors.green
                                    : Colors.red,
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            );
          } else {
            return const Center(child: Text('No financial data available'));
          }
        },
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}