import 'package:flutter/material.dart';
import '../services/api_service.dart';

class WalletScreen extends StatefulWidget {
  @override
  _WalletScreenState createState() => _WalletScreenState();
}

class _WalletScreenState extends State<WalletScreen> {
  bool _isLoading = true;
  Map<String, dynamic>? _walletData;
  List<dynamic>? _transactions;
  bool _isRefreshing = false;

  @override
  void initState() {
    super.initState();
    _loadWalletData();
  }

  Future<void> _loadWalletData() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final walletResponse = await ApiService.getWalletBalance();
      final transactionsResponse = await ApiService.get('/wallet/transactions');
      
      if (mounted) {
        setState(() {
          _walletData = walletResponse;
          _transactions = transactionsResponse?['transactions'] ?? [];
          _isLoading = false;
        });
      }
    } catch (e) {
      print('Error loading wallet data: $e');
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _refreshWalletData() async {
    setState(() {
      _isRefreshing = true;
    });
    
    await _loadWalletData();
    
    if (mounted) {
      setState(() {
        _isRefreshing = false;
      });
    }
  }

  Future<void> _addFunds() async {
    // Show dialog to enter amount
    final TextEditingController controller = TextEditingController();
    
    await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Add Funds'),
          content: TextField(
            controller: controller,
            keyboardType: TextInputType.number,
            decoration: InputDecoration(
              hintText: 'Enter amount',
              prefixText: '\$ ',
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                // Process payment
                Navigator.of(context).pop(controller.text);
              },
              child: Text('Add'),
            ),
          ],
        );
      },
    );
    
    // In a real app, you would process the payment here
    if (controller.text.isNotEmpty) {
      try {
        final amount = double.tryParse(controller.text);
        if (amount != null && amount > 0) {
          final result = await ApiService.post('/wallet/add-funds', {
            'amount': amount,
            'currency': 'USD',
          });
          
          if (result != null) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Funds added successfully')),
            );
            await _refreshWalletData();
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Failed to add funds')),
            );
          }
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error adding funds: $e')),
        );
      }
    }
  }

  Future<void> _sendMoney() async {
    // Show dialog to enter recipient and amount
    final TextEditingController recipientController = TextEditingController();
    final TextEditingController amountController = TextEditingController();
    
    await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Send Money'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: recipientController,
                decoration: InputDecoration(
                  hintText: 'Recipient username or email',
                ),
              ),
              SizedBox(height: 10),
              TextField(
                controller: amountController,
                keyboardType: TextInputType.number,
                decoration: InputDecoration(
                  hintText: 'Enter amount',
                  prefixText: '\$ ',
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                // Validate and send money
                if (recipientController.text.isNotEmpty && 
                    amountController.text.isNotEmpty) {
                  Navigator.of(context).pop({
                    'recipient': recipientController.text,
                    'amount': amountController.text
                  });
                }
              },
              child: Text('Send'),
            ),
          ],
        );
      },
    );
    
    // In a real app, you would process the transfer here
    final result = await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Confirm Transfer'),
          content: Text('Are you sure you want to send money?'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(false);
              },
              child: Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.of(context).pop(true);
              },
              child: Text('Confirm'),
            ),
          ],
        );
      },
    );
    
    if (result == true) {
      try {
        final amount = double.tryParse(amountController.text);
        if (amount != null && amount > 0) {
          final transferResult = await ApiService.post('/wallet/transfer', {
            'recipient': recipientController.text,
            'amount': amount,
            'currency': 'USD',
          });
          
          if (transferResult != null) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Money sent successfully')),
            );
            await _refreshWalletData();
          } else {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Failed to send money')),
            );
          }
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error sending money: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Wallet'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _refreshWalletData,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _refreshWalletData,
        child: _isLoading
            ? Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
                padding: EdgeInsets.all(16),
                child: Column(
                  children: [
                    // Wallet balance card
                    Container(
                      padding: EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                          colors: [Colors.blue, Colors.purple],
                        ),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        children: [
                          Text(
                            'Current Balance',
                            style: TextStyle(
                              fontSize: 18,
                              color: Colors.white70,
                            ),
                          ),
                          SizedBox(height: 8),
                          Text(
                            r'$' + (_walletData?['balance']?.toStringAsFixed(2) ?? '0.00'),
                            style: TextStyle(
                              fontSize: 36,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          SizedBox(height: 16),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                            children: [
                              ElevatedButton.icon(
                                onPressed: _addFunds,
                                icon: Icon(Icons.add),
                                label: Text('Add Funds'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.white,
                                  foregroundColor: Colors.blue,
                                ),
                              ),
                              ElevatedButton.icon(
                                onPressed: _sendMoney,
                                icon: Icon(Icons.send),
                                label: Text('Send Money'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.transparent,
                                  side: BorderSide(color: Colors.white),
                                  foregroundColor: Colors.white,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    
                    SizedBox(height: 20),
                    
                    // FIC (FingerMobile Infinite Coin) balance
                    Card(
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Container(
                              width: 50,
                              height: 50,
                              decoration: BoxDecoration(
                                color: Colors.amber[700],
                                borderRadius: BorderRadius.circular(25),
                              ),
                              child: Icon(
                                Icons.currency_bitcoin,
                                color: Colors.white,
                              ),
                            ),
                            SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'FIC Balance',
                                    style: TextStyle(
                                      fontSize: 16,
                                      color: Colors.grey[600],
                                    ),
                                  ),
                                  FutureBuilder<Map<String, dynamic>?>(
                                    future: ApiService.getFicBalance(),
                                    builder: (context, snapshot) {
                                      if (snapshot.connectionState == ConnectionState.waiting) {
                                        return LinearProgressIndicator();
                                      }
                                      if (snapshot.hasError) {
                                        return Text(
                                          'Error loading FIC balance',
                                          style: TextStyle(color: Colors.red),
                                        );
                                      }
                                      final ficData = snapshot.data;
                                      return Text(
                                        'FIC ' + (ficData?['balance']?.toStringAsFixed(2) ?? '0.00'),
                                        style: TextStyle(
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      );
                                    },
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    
                    SizedBox(height: 20),
                    
                    // Transaction history
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        'Transaction History',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    SizedBox(height: 12),
                    
                    if (_transactions != null && _transactions!.isNotEmpty)
                      ListView.separated(
                        shrinkWrap: true,
                        physics: NeverScrollableScrollPhysics(),
                        separatorBuilder: (context, index) => Divider(height: 1),
                        itemCount: _transactions!.length > 10 ? 10 : _transactions!.length, // Limit to 10 items
                        itemBuilder: (context, index) {
                          final transaction = _transactions![index];
                          return ListTile(
                            leading: Container(
                              width: 40,
                              height: 40,
                              decoration: BoxDecoration(
                                color: transaction['type'] == 'credit' ? Colors.green[100] : Colors.red[100],
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Icon(
                                transaction['type'] == 'credit' 
                                    ? Icons.arrow_downward 
                                    : Icons.arrow_upward,
                                color: transaction['type'] == 'credit' ? Colors.green : Colors.red,
                              ),
                            ),
                            title: Text(transaction['description'] ?? 'Transaction'),
                            subtitle: Text(
                              '${transaction['created_at'] ?? ''} • ${transaction['status'] ?? ''}',
                              style: TextStyle(fontSize: 12),
                            ),
                            trailing: Text(
                              (transaction['type'] == 'credit' ? '+' : '-') + 
                              r'$' + 
                              (transaction['amount']?.toStringAsFixed(2) ?? '0.00'),
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: transaction['type'] == 'credit' ? Colors.green : Colors.red,
                              ),
                            ),
                          );
                        },
                      )
                    else
                      Card(
                        child: Padding(
                          padding: EdgeInsets.all(16),
                          child: Column(
                            children: [
                              Icon(
                                Icons.wallet_giftcard,
                                size: 48,
                                color: Colors.grey[400],
                              ),
                              SizedBox(height: 8),
                              Text(
                                'No transactions yet',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.grey[600],
                                ),
                              ),
                              SizedBox(height: 8),
                              Text(
                                'Your transaction history will appear here',
                                style: TextStyle(
                                  fontSize: 14,
                                  color: Colors.grey[400],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
              ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _addFunds,
        icon: Icon(Icons.add),
        label: Text('Add Funds'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
    );
  }
}