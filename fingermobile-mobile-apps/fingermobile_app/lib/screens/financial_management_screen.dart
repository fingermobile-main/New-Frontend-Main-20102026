import 'package:flutter/material.dart';

class FinancialManagementScreen extends StatefulWidget {
  @override
  _FinancialManagementScreenState createState() => _FinancialManagementScreenState();
}

class _FinancialManagementScreenState extends State<FinancialManagementScreen> {
  double _totalBalance = 5420.75;
  double _totalIncome = 3200.00;
  double _totalExpenses = 1850.25;
  double _savings = 1349.50;
  List<Transaction> _recentTransactions = [];
  List<Budget> _budgets = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadFinancialData();
  }

  Future<void> _loadFinancialData() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _recentTransactions = [
          Transaction(
            id: 1,
            title: 'Salary Deposit',
            amount: 3200.00,
            type: 'income',
            date: DateTime.now().subtract(Duration(days: 2)),
            category: 'Income',
            account: 'Checking',
          ),
          Transaction(
            id: 2,
            title: 'Grocery Store',
            amount: 85.43,
            type: 'expense',
            date: DateTime.now().subtract(Duration(days: 1)),
            category: 'Food',
            account: 'Credit Card',
          ),
          Transaction(
            id: 3,
            title: 'Electricity Bill',
            amount: 120.00,
            type: 'expense',
            date: DateTime.now().subtract(Duration(days: 3)),
            category: 'Utilities',
            account: 'Checking',
          ),
          Transaction(
            id: 4,
            title: 'Coffee Shop',
            amount: 5.75,
            type: 'expense',
            date: DateTime.now().subtract(Duration(days: 1)),
            category: 'Food',
            account: 'Credit Card',
          ),
          Transaction(
            id: 5,
            title: 'Freelance Project',
            amount: 450.00,
            type: 'income',
            date: DateTime.now().subtract(Duration(days: 5)),
            category: 'Income',
            account: 'Checking',
          ),
        ];
        
        _budgets = [
          Budget(
            id: 1,
            name: 'Groceries',
            allocated: 400.00,
            spent: 285.43,
            category: 'Food',
            color: Colors.green,
          ),
          Budget(
            id: 2,
            name: 'Entertainment',
            allocated: 200.00,
            spent: 150.00,
            category: 'Entertainment',
            color: Colors.blue,
          ),
          Budget(
            id: 3,
            name: 'Utilities',
            allocated: 300.00,
            spent: 220.00,
            category: 'Utilities',
            color: Colors.orange,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading financial data: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading financial data')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Finance'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.add),
            onPressed: () {
              // Add transaction
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadFinancialData,
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    // Financial Summary Cards
                    Container(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        children: [
                          // Balance Card
                          Card(
                            elevation: 4,
                            child: Container(
                              padding: EdgeInsets.all(16),
                              width: double.infinity,
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
                                    'Total Balance',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 16,
                                      fontWeight: FontWeight.w400,
                                    ),
                                  ),
                                  SizedBox(height: 8),
                                  Text(
                                    '\$${_totalBalance.toStringAsFixed(2)}',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 32,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  SizedBox(height: 16),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                    children: [
                                      _buildSummaryCard('Income', '+\$${_totalIncome.toStringAsFixed(2)}', Colors.green),
                                      _buildSummaryCard('Expenses', '-\$${_totalExpenses.toStringAsFixed(2)}', Colors.red),
                                      _buildSummaryCard('Savings', '+\$${_savings.toStringAsFixed(2)}', Colors.orange),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    
                    // Budget Section
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Budgets',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              // Navigate to budgets
                            },
                            child: Text('See All'),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      height: 150,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _budgets.length,
                        itemBuilder: (context, index) {
                          final budget = _budgets[index];
                          return _buildBudgetCard(budget);
                        },
                      ),
                    ),
                    
                    // Recent Transactions
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Recent Transactions',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              // Navigate to all transactions
                            },
                            child: Text('See All'),
                          ),
                        ],
                      ),
                    ),
                    ListView.builder(
                      shrinkWrap: true,
                      physics: NeverScrollableScrollPhysics(),
                      itemCount: _recentTransactions.length,
                      itemBuilder: (context, index) {
                        final transaction = _recentTransactions[index];
                        return _buildTransactionItem(transaction);
                      },
                    ),
                    
                    // Financial Insights
                    Padding(
                      padding: EdgeInsets.all(16),
                      child: Card(
                        child: Padding(
                          padding: EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Icon(Icons.insights, color: Colors.blue),
                                  SizedBox(width: 8),
                                  Text(
                                    'Financial Insights',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                              SizedBox(height: 16),
                              Text(
                                'You spent 25% less this month compared to last month. Your biggest expense category is Food & Dining.',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey[700],
                                ),
                              ),
                              SizedBox(height: 16),
                              LinearProgressIndicator(
                                value: 0.75,
                                backgroundColor: Colors.grey[300],
                                valueColor: AlwaysStoppedAnimation<Color>(Colors.green),
                              ),
                              SizedBox(height: 8),
                              Text(
                                '75% of your budget allocated',
                                style: TextStyle(
                                  fontSize: 12,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildSummaryCard(String title, String value, Color color) {
    return Expanded(
      child: Container(
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.2),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(
              title,
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                color: Colors.white,
                fontSize: 14,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBudgetCard(Budget budget) {
    double percentage = budget.spent / budget.allocated;
    
    return Card(
      margin: EdgeInsets.only(left: 16, right: 8),
      child: Container(
        width: 200,
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 12,
                  height: 12,
                  decoration: BoxDecoration(
                    color: budget.color,
                    shape: BoxShape.circle,
                  ),
                ),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    budget.name,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            SizedBox(height: 16),
            Text(
              '\$${budget.spent.toStringAsFixed(2)} of \$${budget.allocated.toStringAsFixed(2)}',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 8),
            LinearProgressIndicator(
              value: percentage,
              backgroundColor: Colors.grey[300],
              valueColor: AlwaysStoppedAnimation<Color>(budget.color),
            ),
            SizedBox(height: 8),
            Text(
              '${(percentage * 100).round()}% used',
              style: TextStyle(
                fontSize: 12,
                color: percentage > 0.9 ? Colors.red : Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTransactionItem(Transaction transaction) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: transaction.type == 'income' ? Colors.green[100] : Colors.red[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                transaction.type == 'income' ? Icons.arrow_downward : Icons.arrow_upward,
                color: transaction.type == 'income' ? Colors.green : Colors.red,
              ),
            ),
            SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    transaction.title,
                    style: TextStyle(
                      fontWeight: FontWeight.w500,
                      fontSize: 16,
                    ),
                  ),
                  SizedBox(height: 4),
                  Row(
                    children: [
                      Text(
                        transaction.category,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                      SizedBox(width: 8),
                      Text(
                        '• ${transaction.account}',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                      SizedBox(width: 8),
                      Text(
                        _formatDate(transaction.date),
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            Text(
              transaction.type == 'income' ? '+\$${transaction.amount.toStringAsFixed(2)}' : '-\$${transaction.amount.toStringAsFixed(2)}',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: transaction.type == 'income' ? Colors.green : Colors.red,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}

class Transaction {
  final int id;
  final String title;
  final double amount;
  final String type;
  final DateTime date;
  final String category;
  final String account;

  Transaction({
    required this.id,
    required this.title,
    required this.amount,
    required this.type,
    required this.date,
    required this.category,
    required this.account,
  });
}

class Budget {
  final int id;
  final String name;
  final double allocated;
  final double spent;
  final String category;
  final Color color;

  Budget({
    required this.id,
    required this.name,
    required this.allocated,
    required this.spent,
    required this.category,
    required this.color,
  });
}