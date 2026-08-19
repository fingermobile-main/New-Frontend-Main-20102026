import 'package:flutter/material.dart';

class SendFicModal extends StatefulWidget {
  final String senderWalletAddress;
  final Function(double amount, String recipientAddress, String memo)? onTransactionSuccess;
  final Function(String error)? onTransactionError;

  const SendFicModal({
    Key? key,
    required this.senderWalletAddress,
    this.onTransactionSuccess,
    this.onTransactionError,
  }) : super(key: key);

  @override
  _SendFicModalState createState() => _SendFicModalState();
}

class _SendFicModalState extends State<SendFicModal> {
  final _formKey = GlobalKey<FormState>();
  final _recipientController = TextEditingController();
  final _amountController = TextEditingController();
  final _memoController = TextEditingController();
  
  double _balance = 1245.67;
  bool _isSending = false;
  bool _useMaxAmount = false;

  @override
  void dispose() {
    _recipientController.dispose();
    _amountController.dispose();
    _memoController.dispose();
    super.dispose();
  }

  void _sendFic() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isSending = true;
      });

      try {
        // Simulate API call to send FIC
        await Future.delayed(Duration(seconds: 2));

        final amount = double.parse(_amountController.text);
        final recipient = _recipientController.text;
        final memo = _memoController.text;

        // Trigger success callback
        if (widget.onTransactionSuccess != null) {
          widget.onTransactionSuccess!(amount, recipient, memo);
        }

        // Close modal after success
        Navigator.of(context).pop();
      } catch (e) {
        // Handle error
        if (widget.onTransactionError != null) {
          widget.onTransactionError!(e.toString());
        }
      } finally {
        setState(() {
          _isSending = false;
        });
      }
    }
  }

  void _setToMaxAmount() {
    setState(() {
      _amountController.text = _balance.toStringAsFixed(2);
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
                    'Send FIC Tokens',
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
                  color: Colors.blue[50],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Icon(Icons.account_balance_wallet, color: Colors.blue),
                    SizedBox(width: 8),
                    Text(
                      'Available Balance: ',
                      style: TextStyle(fontWeight: FontWeight.w500),
                    ),
                    Text(
                      '\$${_balance.toStringAsFixed(2)} FIC',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.blue,
                      ),
                    ),
                  ],
                ),
              ),
              
              SizedBox(height: 16),
              
              // Recipient address
              TextFormField(
                controller: _recipientController,
                decoration: InputDecoration(
                  labelText: 'Recipient Address',
                  hintText: 'Enter wallet address',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.wallet),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a recipient address';
                  }
                  if (value.length < 20) {
                    return 'Invalid address format';
                  }
                  return null;
                },
              ),
              
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
                        hintText: 'Enter amount to send',
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
                        if (amount > _balance) {
                          return 'Insufficient balance';
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
              
              SizedBox(height: 8),
              
              // Memo/Note
              TextFormField(
                controller: _memoController,
                decoration: InputDecoration(
                  labelText: 'Memo (Optional)',
                  hintText: 'Add a note for the recipient',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.note),
                ),
                maxLines: 2,
              ),
              
              SizedBox(height: 16),
              
              // Fee estimation
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Estimated Fee:',
                      style: TextStyle(color: Colors.grey[700]),
                    ),
                    Text(
                      '< 0.01 FIC',
                      style: TextStyle(
                        fontWeight: FontWeight.w500,
                        color: Colors.grey[800],
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
                      onPressed: _isSending ? null : _sendFic,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                        padding: EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: _isSending
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
                                Text('SENDING...'),
                              ],
                            )
                          : Text('SEND FIC'),
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
class SendFicModalExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Send FIC Example')),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            showDialog(
              context: context,
              builder: (context) => SendFicModal(
                senderWalletAddress: 'f1234567890abcdef1234567890abcdef12345678',
                onTransactionSuccess: (amount, recipient, memo) {
                  print('Transaction successful: $amount FIC sent to $recipient');
                },
                onTransactionError: (error) {
                  print('Transaction error: $error');
                },
              ),
            );
          },
          child: Text('Show Send FIC Modal'),
        ),
      ),
    );
  }
}