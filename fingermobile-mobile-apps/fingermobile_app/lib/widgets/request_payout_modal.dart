import 'package:flutter/material.dart';

class RequestPayoutModal extends StatefulWidget {
  final String userId;
  final double availableBalance;
  final Function(double amount, String method, String accountInfo)? onPayoutRequested;
  final Function(String error)? onPayoutError;

  const RequestPayoutModal({
    Key? key,
    required this.userId,
    required this.availableBalance,
    this.onPayoutRequested,
    this.onPayoutError,
  }) : super(key: key);

  @override
  _RequestPayoutModalState createState() => _RequestPayoutModalState();
}

class _RequestPayoutModalState extends State<RequestPayoutModal> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _accountNumberController = TextEditingController();
  final _routingNumberController = TextEditingController();
  final _paypalEmailController = TextEditingController();
  
  String _payoutMethod = 'bank_transfer';
  double _minimumPayout = 10.0;
  bool _isSubmitting = false;
  bool _useMaxAmount = false;

  @override
  void initState() {
    super.initState();
    _accountNumberController.addListener(_onAccountInfoChanged);
    _routingNumberController.addListener(_onAccountInfoChanged);
    _paypalEmailController.addListener(_onAccountInfoChanged);
  }

  @override
  void dispose() {
    _amountController.dispose();
    _accountNumberController.dispose();
    _routingNumberController.dispose();
    _paypalEmailController.dispose();
    super.dispose();
  }

  void _onAccountInfoChanged() {
    // Validate form when account info changes
    setState(() {});
  }

  void _requestPayout() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isSubmitting = true;
      });

      try {
        // Simulate API call to request payout
        await Future.delayed(Duration(seconds: 2));

        final amount = double.parse(_amountController.text);
        final method = _payoutMethod;
        String accountInfo = '';

        if (_payoutMethod == 'bank_transfer') {
          accountInfo = 'Routing: ${_routingNumberController.text}, Account: ${_accountNumberController.text}';
        } else if (_payoutMethod == 'paypal') {
          accountInfo = _paypalEmailController.text;
        }

        // Trigger success callback
        if (widget.onPayoutRequested != null) {
          widget.onPayoutRequested!(amount, method, accountInfo);
        }

        // Close modal after success
        Navigator.of(context).pop();
      } catch (e) {
        // Handle error
        if (widget.onPayoutError != null) {
          widget.onPayoutError!(e.toString());
        }
      } finally {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  void _setToMaxAmount() {
    setState(() {
      _amountController.text = widget.availableBalance.toStringAsFixed(2);
      _useMaxAmount = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Container(
        padding: EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Request Payout',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.close),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
              
              SizedBox(height: 16),
              
              // Balance info
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.green[50],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Icon(Icons.account_balance, color: Colors.green),
                    SizedBox(width: 8),
                    Text(
                      'Available Balance: ',
                      style: TextStyle(fontWeight: FontWeight.w500),
                    ),
                    Text(
                      '\$${widget.availableBalance.toStringAsFixed(2)}',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.green[700],
                      ),
                    ),
                  ],
                ),
              ),
              
              SizedBox(height: 16),
              
              // Minimum payout info
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue[50],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Icon(Icons.info, color: Colors.blue),
                    SizedBox(width: 8),
                    Text(
                      'Minimum payout: \$${_minimumPayout.toStringAsFixed(2)}',
                      style: TextStyle(
                        color: Colors.blue[700],
                      ),
                    ),
                  ],
                ),
              ),
              
              SizedBox(height: 16),
              
              // Payout method selection
              Text(
                'Payout Method',
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                  fontSize: 16,
                ),
              ),
              SizedBox(height: 8),
              ToggleButtons(
                isSelected: [
                  _payoutMethod == 'bank_transfer',
                  _payoutMethod == 'paypal',
                ],
                onPressed: (index) {
                  setState(() {
                    _payoutMethod = index == 0 ? 'bank_transfer' : 'paypal';
                  });
                },
                children: [
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 12),
                    child: Text('Bank Transfer'),
                  ),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 12),
                    child: Text('PayPal'),
                  ),
                ],
              ),
              
              SizedBox(height: 16),
              
              // Account information based on method
              if (_payoutMethod == 'bank_transfer') ...[
                TextFormField(
                  controller: _routingNumberController,
                  decoration: InputDecoration(
                    labelText: 'Routing Number',
                    hintText: 'Enter routing number',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.numbers),
                  ),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter routing number';
                    }
                    if (value.length != 9) {
                      return 'Routing number must be 9 digits';
                    }
                    return null;
                  },
                ),
                SizedBox(height: 16),
                TextFormField(
                  controller: _accountNumberController,
                  decoration: InputDecoration(
                    labelText: 'Account Number',
                    hintText: 'Enter account number',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.account_balance),
                  ),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter account number';
                    }
                    if (value.length < 8) {
                      return 'Account number is too short';
                    }
                    return null;
                  },
                ),
              ] else ...[
                TextFormField(
                  controller: _paypalEmailController,
                  decoration: InputDecoration(
                    labelText: 'PayPal Email',
                    hintText: 'Enter PayPal email',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.email),
                  ),
                  keyboardType: TextInputType.emailAddress,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter PayPal email';
                    }
                    if (!value.contains('@')) {
                      return 'Please enter a valid email';
                    }
                    return null;
                  },
                ),
              ],
              
              SizedBox(height: 16),
              
              // Amount
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _amountController,
                      enabled: !_useMaxAmount,
                      decoration: InputDecoration(
                        labelText: 'Amount',
                        hintText: 'Enter amount to withdraw',
                        border: OutlineInputBorder(),
                        prefixIcon: Icon(Icons.monetization_on),
                      ),
                      keyboardType: TextInputType.numberWithOptions(decimal: true),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Please enter an amount';
                        }
                        final amount = double.tryParse(value);
                        if (amount == null || amount <= 0) {
                          return 'Please enter a valid amount';
                        }
                        if (amount > widget.availableBalance) {
                          return 'Amount exceeds available balance';
                        }
                        if (amount < _minimumPayout) {
                          return 'Minimum payout is \$_minimumPayout';
                        }
                        return null;
                      },
                    ),
                  ),
                  SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: _setToMaxAmount,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.orange,
                      foregroundColor: Colors.white,
                    ),
                    child: Text('MAX'),
                  ),
                ],
              ),
              
              SizedBox(height: 16),
              
              // Estimated arrival info
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Payout Processing Info',
                      style: TextStyle(
                        fontWeight: FontWeight.w500,
                        color: Colors.grey[800],
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      '• Bank transfers: 3-5 business days',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                    Text(
                      '• PayPal: 1-2 business days',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                    Text(
                      '• Processing fee: 2.9% + \$0.30',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
              
              SizedBox(height: 20),
              
              // Action buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.of(context).pop(),
                      style: OutlinedButton.styleFrom(
                        padding: EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: Text('CANCEL'),
                    ),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: _isSubmitting ? null : _requestPayout,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        padding: EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: _isSubmitting
                          ? Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                SizedBox(
                                  width: 16,
                                  height: 16,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                  ),
                                ),
                                SizedBox(width: 8),
                                Text('PROCESSING...'),
                              ],
                            )
                          : Text('REQUEST PAYOUT'),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// Example usage
class RequestPayoutModalExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Request Payout Example')),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            showDialog(
              context: context,
              builder: (context) => RequestPayoutModal(
                userId: 'user123',
                availableBalance: 1245.67,
                onPayoutRequested: (amount, method, accountInfo) {
                  print('Payout requested: \$${amount.toStringAsFixed(2)} via $method');
                },
                onPayoutError: (error) {
                  print('Payout error: $error');
                },
              ),
            );
          },
          child: Text('Show Request Payout Modal'),
        ),
      ),
    );
  }
}