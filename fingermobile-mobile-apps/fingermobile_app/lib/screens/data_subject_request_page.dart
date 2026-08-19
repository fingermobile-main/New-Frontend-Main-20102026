import 'package:flutter/material.dart';

class DataSubjectRequestPage extends StatefulWidget {
  const DataSubjectRequestPage({super.key});

  @override
  State<DataSubjectRequestPage> createState() => _DataSubjectRequestPageState();
}

class _DataSubjectRequestPageState extends State<DataSubjectRequestPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<DataRequestType> _requestTypes = [];
  DataRequestType? _selectedRequestType;
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _messageController = TextEditingController();
  List<DataRequestHistory> _requestHistory = [];
  final _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    _loadRequestData();
  }

  Future<void> _loadRequestData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock request data
      setState(() {
        _requestTypes = [
          DataRequestType(
            id: 1,
            name: 'Access My Data',
            description:
                'Request a copy of all personal data we hold about you',
            icon: Icons.visibility,
          ),
          DataRequestType(
            id: 2,
            name: 'Correct My Data',
            description: 'Request corrections to inaccurate personal data',
            icon: Icons.edit,
          ),
          DataRequestType(
            id: 3,
            name: 'Delete My Data',
            description:
                'Request deletion of your personal data (subject to legal requirements)',
            icon: Icons.delete,
          ),
          DataRequestType(
            id: 4,
            name: 'Port My Data',
            description:
                'Request your data in a structured, machine-readable format',
            icon: Icons.download,
          ),
          DataRequestType(
            id: 5,
            name: 'Restrict Processing',
            description:
                'Request restriction of processing your personal data',
            icon: Icons.block,
          ),
          DataRequestType(
            id: 6,
            name: 'Object to Processing',
            description: 'Object to the processing of your personal data',
            icon: Icons.do_not_disturb,
          ),
        ];

        _requestHistory = [
          DataRequestHistory(
            id: 1,
            type: 'Access My Data',
            status: RequestStatus.completed,
            submitted: DateTime.now().subtract(const Duration(days: 5)),
            completed: DateTime.now().subtract(const Duration(days: 3)),
          ),
          DataRequestHistory(
            id: 2,
            type: 'Correct My Data',
            status: RequestStatus.inProgress,
            submitted: DateTime.now().subtract(const Duration(days: 2)),
            completed: null,
          ),
          DataRequestHistory(
            id: 3,
            type: 'Delete My Data',
            status: RequestStatus.pending,
            submitted: DateTime.now().subtract(const Duration(days: 1)),
            completed: null,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load request data. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _submitRequest() async {
    if (_selectedRequestType == null) {
      setState(() {
        _errorMessage = 'Please select a request type';
        return;
      });
    }

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

      // Add to history
      setState(() {
        _requestHistory.insert(
          0,
          DataRequestHistory(
            id: _requestHistory.length + 1,
            type: _selectedRequestType!.name,
            status: RequestStatus.pending,
            submitted: DateTime.now(),
            completed: null,
          ),
        );
      });

      // Reset form
      setState(() {
        _selectedRequestType = null;
        _emailController.clear();
        _messageController.clear();
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Your request has been submitted successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to submit request. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    _messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Data Subject Request'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: RefreshIndicator(
        onRefresh: _loadRequestData,
        child: _isLoading && _requestTypes.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _requestTypes.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadRequestData,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : SingleChildScrollView(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Header
                            const Text(
                              'Data Subject Request',
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'Submit requests regarding your personal data in accordance with GDPR and CCPA regulations',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.grey,
                              ),
                            ),
                            const SizedBox(height: 24),
                            // Request Type Selection
                            const Text(
                              'Select Request Type',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            GridView.builder(
                              gridDelegate:
                                  const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 2,
                                crossAxisSpacing: 16,
                                mainAxisSpacing: 16,
                                childAspectRatio: 1.2,
                              ),
                              itemCount: _requestTypes.length,
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemBuilder: (context, index) {
                                var requestType = _requestTypes[index];
                                bool isSelected =
                                    _selectedRequestType?.id == requestType.id;

                                return Card(
                                  elevation: isSelected ? 4 : 2,
                                  child: InkWell(
                                    onTap: () {
                                      setState(() {
                                        _selectedRequestType = requestType;
                                      });
                                    },
                                    child: Padding(
                                      padding: const EdgeInsets.all(16.0),
                                      child: Column(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        children: [
                                          Icon(
                                            requestType.icon,
                                            size: 40,
                                            color: isSelected
                                                ? Theme.of(context).primaryColor
                                                : Colors.grey,
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            requestType.name,
                                            textAlign: TextAlign.center,
                                            style: TextStyle(
                                              fontWeight: isSelected
                                                  ? FontWeight.bold
                                                  : FontWeight.normal,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            requestType.description,
                                            textAlign: TextAlign.center,
                                            style: const TextStyle(
                                              fontSize: 10,
                                              color: Colors.grey,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                            const SizedBox(height: 24),
                            // Request Details
                            if (_selectedRequestType != null) ...[
                              const Text(
                                'Request Details',
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
                                      TextFormField(
                                        controller: _emailController,
                                        decoration: const InputDecoration(
                                          labelText: 'Email Address *',
                                          hintText:
                                              'Enter your email for verification',
                                          border: OutlineInputBorder(),
                                        ),
                                        keyboardType: TextInputType.emailAddress,
                                        validator: (value) {
                                          if (value == null || value.isEmpty) {
                                            return 'Please enter your email address';
                                          }
                                          if (!RegExp(r'^[^@]+@[^@]+\.[^@]+')
                                              .hasMatch(value)) {
                                            return 'Please enter a valid email address';
                                          }
                                          return null;
                                        },
                                      ),
                                      const SizedBox(height: 16),
                                      TextFormField(
                                        controller: _messageController,
                                        decoration: const InputDecoration(
                                          labelText: 'Additional Information',
                                          hintText:
                                              'Provide any additional details about your request',
                                          border: OutlineInputBorder(),
                                        ),
                                        maxLines: 4,
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              const SizedBox(height: 24),
                            ],
                            // Error Message
                            if (_errorMessage != null) ...[
                              Card(
                                color: Colors.red.shade100,
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Text(
                                    _errorMessage!,
                                    style: const TextStyle(
                                      color: Colors.red,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 24),
                            ],
                            // Submit Button
                            if (_selectedRequestType != null)
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton(
                                  onPressed: _isLoading ? null : _submitRequest,
                                  style: ElevatedButton.styleFrom(
                                    padding:
                                        const EdgeInsets.symmetric(vertical: 16),
                                  ),
                                  child: _isLoading
                                      ? const CircularProgressIndicator(
                                          color: Colors.white)
                                      : const Text(
                                          'Submit Request',
                                          style: TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                ),
                              ),
                            const SizedBox(height: 32),
                            // Request History
                            const Text(
                              'Request History',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _requestHistory.length,
                              itemBuilder: (context, index) {
                                var historyItem = _requestHistory[index];
                                return Card(
                                  margin: const EdgeInsets.only(bottom: 12),
                                  child: Padding(
                                    padding: const EdgeInsets.all(16.0),
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(
                                              historyItem.type,
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                                fontSize: 16,
                                              ),
                                            ),
                                            Container(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                horizontal: 8,
                                                vertical: 4,
                                              ),
                                              decoration: BoxDecoration(
                                                color: _getStatusColor(
                                                    historyItem.status),
                                                borderRadius:
                                                    BorderRadius.circular(12),
                                              ),
                                              child: Text(
                                                _getStatusText(
                                                    historyItem.status),
                                                style: const TextStyle(
                                                  color: Colors.white,
                                                  fontSize: 12,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 8),
                                        Text(
                                          'Submitted: ${_formatDate(historyItem.submitted)}',
                                          style: const TextStyle(
                                            color: Colors.grey,
                                          ),
                                        ),
                                        if (historyItem.completed != null) ...[
                                          const SizedBox(height: 4),
                                          Text(
                                            'Completed: ${_formatDate(historyItem.completed!)}',
                                            style: const TextStyle(
                                              color: Colors.grey,
                                            ),
                                          ),
                                        ],
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
      ),
    );
  }

  Color _getStatusColor(RequestStatus status) {
    switch (status) {
      case RequestStatus.pending:
        return Colors.orange;
      case RequestStatus.inProgress:
        return Colors.blue;
      case RequestStatus.completed:
        return Colors.green;
    }
  }

  String _getStatusText(RequestStatus status) {
    switch (status) {
      case RequestStatus.pending:
        return 'Pending';
      case RequestStatus.inProgress:
        return 'In Progress';
      case RequestStatus.completed:
        return 'Completed';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}

enum RequestStatus { pending, inProgress, completed }

class DataRequestType {
  final int id;
  final String name;
  final String description;
  final IconData icon;

  DataRequestType({
    required this.id,
    required this.name,
    required this.description,
    required this.icon,
  });
}

class DataRequestHistory {
  final int id;
  final String type;
  final RequestStatus status;
  final DateTime submitted;
  final DateTime? completed;

  DataRequestHistory({
    required this.id,
    required this.type,
    required this.status,
    required this.submitted,
    this.completed,
  });
}