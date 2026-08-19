import 'package:flutter/material.dart';

class CreatePaylinkModal extends StatefulWidget {
  final String userId;
  final Function(String paylink, double amount, String description, DateTime? expiryDate)? onPaylinkCreated;
  final Function(String error)? onPaylinkError;

  const CreatePaylinkModal({
    Key? key,
    required this.userId,
    this.onPaylinkCreated,
    this.onPaylinkError,
  }) : super(key: key);

  @override
  _CreatePaylinkModalState createState() => _CreatePaylinkModalState();
}

class _CreatePaylinkModalState extends State<CreatePaylinkModal> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _expiryDateController = TextEditingController();
  final _redirectUrlController = TextEditingController();
  
  bool _isCreating = false;
  bool _hasExpiry = false;
  bool _hasRedirect = false;
  DateTime? _selectedExpiryDate;
  String _paylinkId = '';

  @override
  void dispose() {
    _amountController.dispose();
    _descriptionController.dispose();
    _expiryDateController.dispose();
    _redirectUrlController.dispose();
    super.dispose();
  }

  void _createPaylink() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isCreating = true;
      });

      try {
        // Generate a unique paylink ID
        _paylinkId = 'pay_${DateTime.now().millisecondsSinceEpoch}';
        
        // Simulate API call to create paylink
        await Future.delayed(Duration(seconds: 2));

        final amount = double.parse(_amountController.text);
        final description = _descriptionController.text;
        final expiryDate = _hasExpiry ? _selectedExpiryDate : null;
        final redirectUrl = _hasRedirect ? _redirectUrlController.text : null;

        // Trigger success callback
        if (widget.onPaylinkCreated != null) {
          widget.onPaylinkCreated!(_paylinkId, amount, description, expiryDate);
        }
      } catch (e) {
        // Handle error
        if (widget.onPaylinkError != null) {
          widget.onPaylinkError!(e.toString());
        }
      } finally {
        setState(() {
          _isCreating = false;
        });
      }
    }
  }

  Future<void> _selectExpiryDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(Duration(days: 7)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(Duration(days: 365)),
    );
    
    if (picked != null && picked != _selectedExpiryDate) {
      setState(() {
        _selectedExpiryDate = picked;
        _expiryDateController.text = 
            "${picked.day}/${picked.month}/${picked.year}";
      });
    }
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
                    'Create Paylink',
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
              
              // Info banner
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.blue[50],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Icon(Icons.link, color: Colors.blue),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Create a custom payment link that anyone can use to pay you directly',
                        style: TextStyle(
                          color: Colors.blue[700],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              
              SizedBox(height: 16),
              
              // Amount
              TextFormField(
                controller: _amountController,
                decoration: InputDecoration(
                  labelText: 'Amount',
                  hintText: 'Enter payment amount',
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
                  if (amount < 0.50) {
                    return 'Minimum amount is \$0.50';
                  }
                  return null;
                },
              ),
              
              SizedBox(height: 16),
              
              // Description
              TextFormField(
                controller: _descriptionController,
                decoration: InputDecoration(
                  labelText: 'Description',
                  hintText: 'What is this payment for?',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.description),
                ),
                maxLines: 2,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a description';
                  }
                  if (value.length < 5) {
                    return 'Description is too short';
                  }
                  return null;
                },
              ),
              
              SizedBox(height: 16),
              
              // Expiry date toggle
              Row(
                children: [
                  Checkbox(
                    value: _hasExpiry,
                    onChanged: (bool? value) {
                      setState(() {
                        _hasExpiry = value ?? false;
                        if (!_hasExpiry) {
                          _selectedExpiryDate = null;
                          _expiryDateController.clear();
                        }
                      });
                    },
                  ),
                  Text(
                    'Set expiration date',
                    style: TextStyle(
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              
              if (_hasExpiry) ...[
                SizedBox(height: 8),
                TextFormField(
                  controller: _expiryDateController,
                  decoration: InputDecoration(
                    labelText: 'Expiry Date',
                    hintText: 'Select expiry date',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.calendar_today),
                  ),
                  readOnly: true,
                  onTap: _selectExpiryDate,
                  validator: _hasExpiry
                      ? (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please select an expiry date';
                          }
                          return null;
                        }
                      : null,
                ),
              ],
              
              SizedBox(height: 16),
              
              // Redirect URL toggle
              Row(
                children: [
                  Checkbox(
                    value: _hasRedirect,
                    onChanged: (bool? value) {
                      setState(() {
                        _hasRedirect = value ?? false;
                        if (!_hasRedirect) {
                          _redirectUrlController.clear();
                        }
                      });
                    },
                  ),
                  Text(
                    'Redirect after payment',
                    style: TextStyle(
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              
              if (_hasRedirect) ...[
                SizedBox(height: 8),
                TextFormField(
                  controller: _redirectUrlController,
                  decoration: InputDecoration(
                    labelText: 'Redirect URL',
                    hintText: 'https://example.com/thanks',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.link),
                  ),
                  keyboardType: TextInputType.url,
                  validator: _hasRedirect
                      ? (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter a redirect URL';
                          }
                          if (!value.startsWith('http://') && !value.startsWith('https://')) {
                            return 'URL must start with http:// or https://';
                          }
                          return null;
                        }
                      : null,
                ),
              ],
              
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
                      onPressed: _isCreating ? null : _createPaylink,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        foregroundColor: Colors.white,
                        padding: EdgeInsets.symmetric(vertical: 12),
                      ),
                      child: _isCreating
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
                                Text('CREATING...'),
                              ],
                            )
                          : Text('CREATE PAYLINK'),
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
class CreatePaylinkModalExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Create Paylink Example')),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            showDialog(
              context: context,
              builder: (context) => CreatePaylinkModal(
                userId: 'user123',
                onPaylinkCreated: (paylinkId, amount, description, expiryDate) {
                  print('Paylink created: $paylinkId for \$${amount.toStringAsFixed(2)}');
                },
                onPaylinkError: (error) {
                  print('Paylink error: $error');
                },
              ),
            );
          },
          child: Text('Show Create Paylink Modal'),
        ),
      ),
    );
  }
}