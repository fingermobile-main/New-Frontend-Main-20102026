import 'package:flutter/material.dart';

class RequestTitleModal extends StatefulWidget {
  final String userId;
  final List<String> availableTitles;
  final Function(String title, String reason, String category)? onTitleRequested;
  final Function(String error)? onTitleError;

  const RequestTitleModal({
    Key? key,
    required this.userId,
    required this.availableTitles,
    this.onTitleRequested,
    this.onTitleError,
  }) : super(key: key);

  @override
  _RequestTitleModalState createState() => _RequestTitleModalState();
}

class _RequestTitleModalState extends State<RequestTitleModal> {
  final _formKey = GlobalKey<FormState>();
  final _reasonController = TextEditingController();
  final _customTitleController = TextEditingController();
  
  String _selectedTitle = '';
  String _selectedCategory = 'general';
  bool _isCustomTitle = false;
  bool _isSubmitting = false;
  
  List<String> get _titleCategories => [
        'general',
        'professional',
        'academic',
        'social',
        'special'
      ];

  @override
  void initState() {
    super.initState();
    if (widget.availableTitles.isNotEmpty) {
      _selectedTitle = widget.availableTitles[0];
    }
  }

  @override
  void dispose() {
    _reasonController.dispose();
    _customTitleController.dispose();
    super.dispose();
  }

  void _requestTitle() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isSubmitting = true;
      });

      try {
        // Simulate API call to request title
        await Future.delayed(Duration(seconds: 2));

        final title = _isCustomTitle ? _customTitleController.text : _selectedTitle;
        final reason = _reasonController.text;
        final category = _selectedCategory;

        // Trigger success callback
        if (widget.onTitleRequested != null) {
          widget.onTitleRequested!(title, reason, category);
        }

        // Close modal after success
        Navigator.of(context).pop();
      } catch (e) {
        // Handle error
        if (widget.onTitleError != null) {
          widget.onTitleError!(e.toString());
        }
      } finally {
        setState(() {
          _isSubmitting = false;
        });
      }
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
                    'Request Title',
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
                    Icon(Icons.badge, color: Colors.blue),
                    SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Request a special title for your profile. Select from available titles or request a custom one.',
                        style: TextStyle(
                          color: Colors.blue[700],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              
              SizedBox(height: 16),
              
              // Title type selection
              Text(
                'Title Type',
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                  fontSize: 16,
                ),
              ),
              SizedBox(height: 8),
              ToggleButtons(
                isSelected: [_isCustomTitle == false, _isCustomTitle == true],
                onPressed: (index) {
                  setState(() {
                    _isCustomTitle = index == 1;
                  });
                },
                children: [
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 12),
                    child: Text('Available Titles'),
                  ),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 12),
                    child: Text('Custom Title'),
                  ),
                ],
              ),
              
              SizedBox(height: 16),
              
              // Available titles selection or custom title input
              if (!_isCustomTitle) ...[
                Text(
                  'Select Title',
                  style: TextStyle(
                    fontWeight: FontWeight.w500,
                    fontSize: 16,
                  ),
                ),
                SizedBox(height: 8),
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey[300]!),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: DropdownButton<String>(
                    isExpanded: true,
                    value: _selectedTitle.isEmpty && widget.availableTitles.isNotEmpty
                        ? widget.availableTitles[0]
                        : _selectedTitle,
                    items: widget.availableTitles.map((title) {
                      return DropdownMenuItem(
                        value: title,
                        child: Padding(
                          padding: EdgeInsets.symmetric(horizontal: 12),
                          child: Text(title),
                        ),
                      );
                    }).toList(),
                    onChanged: (value) {
                      if (value != null) {
                        setState(() {
                          _selectedTitle = value;
                        });
                      }
                    },
                  ),
                ),
              ] else ...[
                TextFormField(
                  controller: _customTitleController,
                  decoration: InputDecoration(
                    labelText: 'Custom Title',
                    hintText: 'Enter your desired title',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.edit),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a title';
                    }
                    if (value.length < 3) {
                      return 'Title must be at least 3 characters';
                    }
                    if (value.length > 30) {
                      return 'Title must be less than 30 characters';
                    }
                    return null;
                  },
                ),
              ],
              
              SizedBox(height: 16),
              
              // Category selection
              Text(
                'Category',
                style: TextStyle(
                  fontWeight: FontWeight.w500,
                  fontSize: 16,
                ),
              ),
              SizedBox(height: 8),
              Container(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey[300]!),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: DropdownButton<String>(
                  isExpanded: true,
                  value: _selectedCategory,
                  items: _titleCategories.map((category) {
                    String displayText = category[0].toUpperCase() + category.substring(1);
                    
                    return DropdownMenuItem(
                      value: category,
                      child: Padding(
                        padding: EdgeInsets.symmetric(horizontal: 12),
                        child: Text(displayText),
                      ),
                    );
                  }).toList(),
                  onChanged: (value) {
                    if (value != null) {
                      setState(() {
                        _selectedCategory = value;
                      });
                    }
                  },
                ),
              ),
              
              SizedBox(height: 16),
              
              // Reason for request
              TextFormField(
                controller: _reasonController,
                decoration: InputDecoration(
                  labelText: 'Reason for Request',
                  hintText: 'Why do you want this title?',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.comment),
                ),
                maxLines: 3,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please provide a reason for your request';
                  }
                  if (value.length < 10) {
                    return 'Please provide more details in your reason';
                  }
                  return null;
                },
              ),
              
              SizedBox(height: 16),
              
              // Requirements info
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
                      'Title Guidelines',
                      style: TextStyle(
                        fontWeight: FontWeight.w500,
                        color: Colors.grey[800],
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      '• Titles must be respectful and appropriate',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                    Text(
                      '• Custom titles subject to approval',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),
                    Text(
                      '• Approval process may take 1-3 business days',
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
                      onPressed: _isSubmitting ? null : _requestTitle,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.purple,
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
                                Text('REQUESTING...'),
                              ],
                            )
                          : Text('REQUEST TITLE'),
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
class RequestTitleModalExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Request Title Example')),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            showDialog(
              context: context,
              builder: (context) => RequestTitleModal(
                userId: 'user123',
                availableTitles: [
                  'Verified Creator',
                  'Community Leader',
                  'Top Contributor',
                  'Ambassador',
                  'Expert'
                ],
                onTitleRequested: (title, reason, category) {
                  print('Title requested: $title in category $category');
                },
                onTitleError: (error) {
                  print('Title request error: $error');
                },
              ),
            );
          },
          child: Text('Show Request Title Modal'),
        ),
      ),
    );
  }
}