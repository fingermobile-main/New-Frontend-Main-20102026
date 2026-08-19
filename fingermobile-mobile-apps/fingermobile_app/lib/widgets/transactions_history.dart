import 'package:flutter/material.dart';

class TransactionsHistory extends StatefulWidget {
  final String userId;
  final DateTime? startDate;
  final DateTime? endDate;
  final Function(Transaction)? onTransactionTap;

  const TransactionsHistory({
    Key? key,
    required this.userId,
    this.startDate,
    this.endDate,
    this.onTransactionTap,
  }) : super(key: key);

  @override
  _TransactionsHistoryState createState() => _TransactionsHistoryState();
}

class _TransactionsHistoryState extends State<TransactionsHistory> {
  List<Transaction> _transactions = [];
  bool _isLoading = true;
  String _filter = 'all';
  String _sortOrder = 'desc';

  @override
  void initState() {
    super.initState();
    _loadTransactions();
  }

  Future<void> _loadTransactions() async {
    // Simulate API call
    await Future.delayed(Duration(seconds: 1));
    
    setState(() {
      _transactions = _generateSampleTransactions();
      _isLoading = false;
    });
  }

  List<Transaction> _generateSampleTransactions() {
    return [
      Transaction(
        id: 'TXN001',
        amount: 124.50,
        type: TransactionType.credit,
        description: 'Payment received from John Doe',
        date: DateTime.now().subtract(Duration(days: 1)),
        status: TransactionStatus.completed,
        category: 'Services',
      ),
      Transaction(
        id: 'TXN002',
        amount: 89.99,
        type: TransactionType.debit,
        description: 'Purchase - Premium Subscription',
        date: DateTime.now().subtract(Duration(days: 2)),
        status: TransactionStatus.completed,
        category: 'Subscription',
      ),
      Transaction(
        id: 'TXN003',
        amount: 250.00,
        type: TransactionType.credit,
        description: 'Referral bonus',
        date: DateTime.now().subtract(Duration(days: 5)),
        status: TransactionStatus.pending,
        category: 'Bonus',
      ),
      Transaction(
        id: 'TXN004',
        amount: 45.75,
        type: TransactionType.debit,
        description: 'Withdrawal to bank account',
        date: DateTime.now().subtract(Duration(days: 7)),
        status: TransactionStatus.processing,
        category: 'Withdrawal',
      ),
      Transaction(
        id: 'TXN005',
        amount: 500.00,
        type: TransactionType.credit,
        description: 'Investment return',
        date: DateTime.now().subtract(Duration(days: 10)),
        status: TransactionStatus.completed,
        category: 'Investment',
      ),
      Transaction(
        id: 'TXN006',
        amount: 12.99,
        type: TransactionType.debit,
        description: 'App store purchase',
        date: DateTime.now().subtract(Duration(days: 12)),
        status: TransactionStatus.failed,
        category: 'Purchase',
      ),
    ];
  }

  List<Transaction> _getFilteredTransactions() {
    var filtered = List<Transaction>.from(_transactions);

    // Apply filter
    if (_filter != 'all') {
      if (_filter == 'credit') {
        filtered = filtered.where((t) => t.type == TransactionType.credit).toList();
      } else if (_filter == 'debit') {
        filtered = filtered.where((t) => t.type == TransactionType.debit).toList();
      } else if (_filter == 'pending') {
        filtered = filtered.where((t) => t.status == TransactionStatus.pending).toList();
      }
    }

    // Apply sorting
    if (_sortOrder == 'asc') {
      filtered.sort((a, b) => a.date.compareTo(b.date));
    } else {
      filtered.sort((a, b) => b.date.compareTo(a.date));
    }

    return filtered;
  }

  @override
  Widget build(BuildContext context) {
    final filteredTransactions = _getFilteredTransactions();

    return Scaffold(
      appBar: AppBar(
        title: Text('Transaction History'),
        backgroundColor: Colors.grey[800],
        foregroundColor: Colors.white,
        actions: [
          PopupMenuButton(
            icon: Icon(Icons.sort),
            onSelected: (value) {
              setState(() {
                _sortOrder = value.toString();
              });
            },
            itemBuilder: (context) => [
              PopupMenuItem(
                value: 'desc',
                child: Text('Newest First'),
              ),
              PopupMenuItem(
                value: 'asc',
                child: Text('Oldest First'),
              ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // Filters
          Container(
            padding: EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    initialValue: _filter,
                    decoration: InputDecoration(
                      labelText: 'Filter',
                      border: OutlineInputBorder(),
                    ),
                    items: [
                      DropdownMenuItem(
                        value: 'all',
                        child: Text('All Transactions'),
                      ),
                      DropdownMenuItem(
                        value: 'credit',
                        child: Text('Credits'),
                      ),
                      DropdownMenuItem(
                        value: 'debit',
                        child: Text('Debits'),
                      ),
                      DropdownMenuItem(
                        value: 'pending',
                        child: Text('Pending'),
                      ),
                    ],
                    onChanged: (value) {
                      setState(() {
                        _filter = value!;
                      });
                    },
                  ),
                ),
                SizedBox(width: 16),
                ElevatedButton(
                  onPressed: _loadTransactions,
                  child: Icon(Icons.refresh),
                ),
              ],
          ),
        ),
        
        // Transaction list
        Expanded(
          child: _isLoading
              ? Center(child: CircularProgressIndicator())
              : filteredTransactions.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.receipt_long,
                            size: 64,
                            color: Colors.grey[400],
                          ),
                          SizedBox(height: 16),
                          Text(
                            'No transactions found',
                            style: TextStyle(
                              fontSize: 16,
                              color: Colors.grey[600],
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            'Try changing your filters',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.grey[500],
                            ),
                          ),
                        ],
                      ),
                    )
                  : ListView.builder(
                      itemCount: filteredTransactions.length,
                      itemBuilder: (context, index) {
                        final transaction = filteredTransactions[index];
                        return _buildTransactionItem(transaction);
                      },
                    ),
        ),
      ],
    );
  }

  Widget _buildTransactionItem(Transaction transaction) {
    final isCredit = transaction.type == TransactionType.credit;
    final statusColor = _getStatusColor(transaction.status);
    
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: InkWell(
        onTap: () {
          if (widget.onTransactionTap != null) {
            widget.onTransactionTap!(transaction);
          }
        },
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: isCredit ? Colors.green[50] : Colors.red[50],
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Icon(
                  isCredit ? Icons.arrow_downward : Icons.arrow_upward,
                  color: isCredit ? Colors.green[700] : Colors.red[700],
                ),
              ),
              SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            transaction.description,
                            style: TextStyle(
                              fontWeight: FontWeight.w500,
                              fontSize: 16,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        SizedBox(width: 8),
                        Text(
                          '${isCredit ? '+' : '-'}\$${transaction.amount.toStringAsFixed(2)}',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: isCredit ? Colors.green[700] : Colors.red[700],
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 4),
                    Row(
                      children: [
                        Text(
                          '${transaction.date.day}/${transaction.date.month}/${transaction.date.year}',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                        SizedBox(width: 8),
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: statusColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(4),
                            border: Border.all(
                              color: statusColor,
                              width: 1,
                            ),
                          ),
                          child: Text(
                            transaction.status.toString().split('.').last.toUpperCase(),
                            style: TextStyle(
                              color: statusColor,
                              fontSize: 10,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        SizedBox(width: 8),
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.grey[100],
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            transaction.category,
                            style: TextStyle(
                              color: Colors.grey[700],
                              fontSize: 10,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Color _getStatusColor(TransactionStatus status) {
    switch (status) {
      case TransactionStatus.completed:
        return Colors.green;
      case TransactionStatus.pending:
        return Colors.orange;
      case TransactionStatus.processing:
        return Colors.blue;
      case TransactionStatus.failed:
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}

class Transaction {
  final String id;
  final double amount;
  final TransactionType type;
  final String description;
  final DateTime date;
  final TransactionStatus status;
  final String category;

  Transaction({
    required this.id,
    required this.amount,
    required this.type,
    required this.description,
    required this.date,
    required this.status,
    required this.category,
  });
}

enum TransactionType { credit, debit }
enum TransactionStatus { completed, pending, processing, failed }