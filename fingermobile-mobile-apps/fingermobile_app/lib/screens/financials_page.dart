import 'package:flutter/material.dart';

class FinancialsPage extends StatefulWidget {
  const FinancialsPage({super.key});

  @override
  State<FinancialsPage> createState() => _FinancialsPageState();
}

class _FinancialsPageState extends State<FinancialsPage> {
  bool _isLoading = false;
  String? _errorMessage;
  FinancialOverview? _overview;
  List<FinancialTransaction> _transactions = [];
  List<FinancialAccount> _accounts = [];
  FinancialPeriod _selectedPeriod = FinancialPeriod.monthly;
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadFinancialData();
  }

  Future<void> _loadFinancialData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock financial data
      setState(() {
        _overview = FinancialOverview(
          totalBalance: 24560.75,
          income: 12540.50,
          expenses: 8920.25,
          savings: 3620.00,
        );

        _accounts = [
          FinancialAccount(
            id: 1,
            name: 'Checking Account',
            balance: 12540.75,
            accountType: AccountType.checking,
            institution: 'Bank of America',
            lastUpdated: DateTime.now().subtract(const Duration(days: 1)),
          ),
          FinancialAccount(
            id: 2,
            name: 'Savings Account',
            balance: 8920.50,
            accountType: AccountType.savings,
            institution: 'Chase Bank',
            lastUpdated: DateTime.now().subtract(const Duration(days: 2)),
          ),
          FinancialAccount(
            id: 3,
            name: 'Investment Portfolio',
            balance: 3620.25,
            accountType: AccountType.investment,
            institution: 'Fidelity',
            lastUpdated: DateTime.now().subtract(const Duration(days: 3)),
          ),
        ];

        _transactions = [
          FinancialTransaction(
            id: 1,
            title: 'Salary Deposit',
            amount: 5200.00,
            type: TransactionType.income,
            category: 'Salary',
            date: DateTime.now().subtract(const Duration(days: 1)),
            accountId: 1,
          ),
          FinancialTransaction(
            id: 2,
            title: 'Grocery Shopping',
            amount: 125.75,
            type: TransactionType.expense,
            category: 'Food',
            date: DateTime.now().subtract(const Duration(days: 2)),
            accountId: 1,
          ),
          FinancialTransaction(
            id: 3,
            title: 'Electricity Bill',
            amount: 89.50,
            type: TransactionType.expense,
            category: 'Utilities',
            date: DateTime.now().subtract(const Duration(days: 3)),
            accountId: 1,
          ),
          FinancialTransaction(
            id: 4,
            title: 'Dividend Payment',
            amount: 120.25,
            type: TransactionType.income,
            category: 'Investments',
            date: DateTime.now().subtract(const Duration(days: 4)),
            accountId: 3,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load financial data. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _changePeriod(FinancialPeriod period) {
    setState(() {
      _selectedPeriod = period;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Financials'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadFinancialData,
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              // Open filters
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadFinancialData,
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
                          onPressed: _loadFinancialData,
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
                          // Financial Overview
                          const Text(
                            'Financial Overview',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'Track your income, expenses, and savings',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.grey,
                            ),
                          ),
                          const SizedBox(height: 24),
                          if (_overview != null)
                            GridView.builder(
                              gridDelegate:
                                  const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                crossAxisSpacing: 16,
                                mainAxisSpacing: 16,
                                childAspectRatio: 1.5,
                              ),
                              itemCount: 4,
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemBuilder: (context, index) {
                                List<Map<String, dynamic>> overviewData = [
                                  {
                                    'title': 'Total Balance',
                                    'value': '\$${_overview!.totalBalance.toStringAsFixed(2)}',
                                    'icon': Icons.account_balance_wallet,
                                    'color': Colors.blue,
                                  },
                                  {
                                    'title': 'Income',
                                    'value': '\$${_overview!.income.toStringAsFixed(2)}',
                                    'icon': Icons.trending_up,
                                    'color': Colors.green,
                                  },
                                  {
                                    'title': 'Expenses',
                                    'value': '\$${_overview!.expenses.toStringAsFixed(2)}',
                                    'icon': Icons.trending_down,
                                    'color': Colors.red,
                                  },
                                  {
                                    'title': 'Savings',
                                    'value': '\$${_overview!.savings.toStringAsFixed(2)}',
                                    'icon': Icons.savings,
                                    'color': Colors.purple,
                                  },
                                ];

                                var data = overviewData[index];
                                return Card(
                                  child: Padding(
                                    padding: const EdgeInsets.all(16.0),
                                    child: Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
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
                            ),
                          const SizedBox(height: 32),
                          // Period Selector
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Period',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SegmentedButton<FinancialPeriod>(
                                segments: const [
                                  ButtonSegment(
                                    value: FinancialPeriod.weekly,
                                    label: Text('W'),
                                  ),
                                  ButtonSegment(
                                    value: FinancialPeriod.monthly,
                                    label: Text('M'),
                                  ),
                                  ButtonSegment(
                                    value: FinancialPeriod.yearly,
                                    label: Text('Y'),
                                  ),
                                ],
                                selected: {_selectedPeriod},
                                onSelectionChanged: (Set<FinancialPeriod> newSelection) {
                                  _changePeriod(newSelection.first);
                                },
                              ),
                            ],
                          ),
                          const SizedBox(height: 24),
                          // Accounts
                          const Text(
                            'Accounts',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _accounts.length,
                            itemBuilder: (context, index) {
                              var account = _accounts[index];
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
                                            account.name,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 16,
                                            ),
                                          ),
                                          Text(
                                            '\$${account.balance.toStringAsFixed(2)}',
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 18,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        account.institution,
                                        style: const TextStyle(
                                          color: Colors.grey,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Chip(
                                            label: Text(account.accountType.name),
                                            backgroundColor: _getAccountTypeColor(account.accountType),
                                          ),
                                          Text(
                                            'Updated: ${_formatDate(account.lastUpdated)}',
                                            style: const TextStyle(
                                              fontSize: 12,
                                              color: Colors.grey,
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
                          const SizedBox(height: 32),
                          // Transactions
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Recent Transactions',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  // View all transactions
                                },
                                child: const Text('View All'),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _transactions.length,
                            itemBuilder: (context, index) {
                              var transaction = _transactions[index];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 12),
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(12),
                                        decoration: BoxDecoration(
                                          color: transaction.type == TransactionType.income
                                              ? Colors.green.shade100
                                              : Colors.red.shade100,
                                          shape: BoxShape.circle,
                                        ),
                                        child: Icon(
                                          transaction.type == TransactionType.income
                                              ? Icons.arrow_downward
                                              : Icons.arrow_upward,
                                          color: transaction.type == TransactionType.income
                                              ? Colors.green
                                              : Colors.red,
                                        ),
                                      ),
                                      const SizedBox(width: 16),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              transaction.title,
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              transaction.category,
                                              style: const TextStyle(
                                                color: Colors.grey,
                                                fontSize: 12,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.end,
                                        children: [
                                          Text(
                                            transaction.type == TransactionType.income
                                                ? '+\$${transaction.amount.toStringAsFixed(2)}'
                                                : '-\$${transaction.amount.toStringAsFixed(2)}',
                                            style: TextStyle(
                                              fontWeight: FontWeight.bold,
                                              color: transaction.type == TransactionType.income
                                                  ? Colors.green
                                                  : Colors.red,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            _formatDate(transaction.date),
                                            style: const TextStyle(
                                              color: Colors.grey,
                                              fontSize: 12,
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
                        ],
                      ),
                    ),
                  ),
      ),
    );
  }

  Color _getAccountTypeColor(AccountType type) {
    switch (type) {
      case AccountType.checking:
        return Colors.blue.shade100;
      case AccountType.savings:
        return Colors.green.shade100;
      case AccountType.investment:
        return Colors.purple.shade100;
      case AccountType.credit:
        return Colors.red.shade100;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}

enum FinancialPeriod { weekly, monthly, yearly }
enum TransactionType { income, expense }
enum AccountType { checking, savings, investment, credit }

class FinancialOverview {
  final double totalBalance;
  final double income;
  final double expenses;
  final double savings;

  FinancialOverview({
    required this.totalBalance,
    required this.income,
    required this.expenses,
    required this.savings,
  });
}

class FinancialTransaction {
  final int id;
  final String title;
  final double amount;
  final TransactionType type;
  final String category;
  final DateTime date;
  final int accountId;

  FinancialTransaction({
    required this.id,
    required this.title,
    required this.amount,
    required this.type,
    required this.category,
    required this.date,
    required this.accountId,
  });
}

class FinancialAccount {
  final int id;
  final String name;
  final double balance;
  final AccountType accountType;
  final String institution;
  final DateTime lastUpdated;

  FinancialAccount({
    required this.id,
    required this.name,
    required this.balance,
    required this.accountType,
    required this.institution,
    required this.lastUpdated,
  });
}