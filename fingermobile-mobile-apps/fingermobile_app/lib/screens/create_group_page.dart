import 'package:flutter/material.dart';

class CreateGroupPage extends StatefulWidget {
  const CreateGroupPage({super.key});

  @override
  State<CreateGroupPage> createState() => _CreateGroupPageState();
}

class _CreateGroupPageState extends State<CreateGroupPage> {
  bool _isLoading = false;
  String? _errorMessage;
  final _formKey = GlobalKey<FormState>();
  String _groupName = '';
  String _groupDescription = '';
  GroupPrivacy _privacy = GroupPrivacy.public;
  bool _allowInvites = true;
  String _selectedCategory = 'General';
  List<String> _categories = [
    'General',
    'Technology',
    'Arts & Entertainment',
    'Education',
    'Business',
    'Health & Wellness',
    'Sports',
    'Hobbies',
    'Travel',
    'Food & Cooking',
  ];

  Future<void> _createGroup() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }
    
    _formKey.currentState!.save();
    
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 2));
      
      // Show success dialog
      if (mounted) {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Group Created!'),
              content: Text('Your group "$_groupName" has been successfully created.'),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop(); // Close dialog
                    Navigator.of(context).pop(true); // Return success to previous screen
                  },
                  child: const Text('OK'),
                ),
              ],
            );
          },
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Failed to create group. Please try again.';
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Create Group'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              const Text(
                'Create a New Group',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Start a community around a shared interest or purpose',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.grey,
                ),
              ),
              const SizedBox(height: 32),
              // Group Name
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Group Name *',
                  hintText: 'Enter a name for your group',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a group name';
                  }
                  if (value.length < 3) {
                    return 'Group name must be at least 3 characters';
                  }
                  if (value.length > 50) {
                    return 'Group name must be less than 50 characters';
                  }
                  return null;
                },
                onSaved: (value) {
                  setState(() {
                    _groupName = value ?? '';
                  });
                },
              ),
              const SizedBox(height: 16),
              // Group Description
              TextFormField(
                decoration: const InputDecoration(
                  labelText: 'Description *',
                  hintText: 'Describe what your group is about',
                  border: OutlineInputBorder(),
                ),
                maxLines: 4,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a group description';
                  }
                  if (value.length < 10) {
                    return 'Description must be at least 10 characters';
                  }
                  if (value.length > 500) {
                    return 'Description must be less than 500 characters';
                  }
                  return null;
                },
                onSaved: (value) {
                  setState(() {
                    _groupDescription = value ?? '';
                  });
                },
              ),
              const SizedBox(height: 16),
              // Category
              DropdownButtonFormField<String>(
                initialValue: _selectedCategory,
                decoration: const InputDecoration(
                  labelText: 'Category',
                  border: OutlineInputBorder(),
                ),
                items: _categories.map((String category) {
                  return DropdownMenuItem<String>(
                    value: category,
                    child: Text(category),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _selectedCategory = value ?? 'General';
                  });
                },
              ),
              const SizedBox(height: 16),
              // Privacy Settings
              const Text(
                'Privacy Settings',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      RadioListTile<GroupPrivacy>(
                        title: const Text('Public Group'),
                        subtitle: const Text('Anyone can see the group, its members and posts'),
                        value: GroupPrivacy.public,
                        groupValue: _privacy,
                        onChanged: (value) {
                          setState(() {
                            _privacy = value ?? GroupPrivacy.public;
                          });
                        },
                      ),
                      const Divider(),
                      RadioListTile<GroupPrivacy>(
                        title: const Text('Private Group'),
                        subtitle: const Text('Only members can see the group and its content'),
                        value: GroupPrivacy.private,
                        groupValue: _privacy,
                        onChanged: (value) {
                          setState(() {
                            _privacy = value ?? GroupPrivacy.private;
                          });
                        },
                      ),
                      const Divider(),
                      RadioListTile<GroupPrivacy>(
                        title: const Text('Secret Group'),
                        subtitle: const Text('Only invited members can find and join the group'),
                        value: GroupPrivacy.secret,
                        groupValue: _privacy,
                        onChanged: (value) {
                          setState(() {
                            _privacy = value ?? GroupPrivacy.secret;
                          });
                        },
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              // Additional Settings
              const Text(
                'Additional Settings',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      SwitchListTile(
                        title: const Text('Allow members to invite others'),
                        value: _allowInvites,
                        onChanged: (value) {
                          setState(() {
                            _allowInvites = value;
                          });
                        },
                      ),
                      const Divider(),
                      const ListTile(
                        title: const Text('Member Requests'),
                        subtitle: const Text('Approve new members manually'),
                        trailing: Icon(Icons.toggle_on),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
              // Error message
              if (_errorMessage != null)
                Text(
                  _errorMessage!,
                  style: const TextStyle(
                    color: Colors.red,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              const SizedBox(height: 16),
              // Create Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _createGroup,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text(
                          'Create Group',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                ),
              ),
              const SizedBox(height: 16),
              // Cancel Button
              SizedBox(
                width: double.infinity,
                child: OutlinedButton(
                  onPressed: () {
                    Navigator.of(context).pop();
                  },
                  style: OutlinedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: const Text(
                    'Cancel',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
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
}

enum GroupPrivacy { public, private, secret }