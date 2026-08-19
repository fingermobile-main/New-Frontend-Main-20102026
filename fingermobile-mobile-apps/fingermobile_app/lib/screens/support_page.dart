import 'package:flutter/material.dart';

class SupportPage extends StatefulWidget {
  const SupportPage({super.key});

  @override
  State<SupportPage> createState() => _SupportPageState();
}

class _SupportPageState extends State<SupportPage> {
  final TextEditingController _subjectController = TextEditingController();
  final TextEditingController _messageController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Support'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'How can we help you?',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Contact our support team for assistance',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 24),
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                children: [
                  _buildSupportOption(
                    'Report a Problem',
                    Icons.report_problem,
                    Colors.red,
                    () {
                      // Navigate to report problem
                    },
                  ),
                  Divider(height: 1),
                  _buildSupportOption(
                    'Request a Feature',
                    Icons.auto_awesome,
                    Colors.blue,
                    () {
                      // Navigate to feature request
                    },
                  ),
                  Divider(height: 1),
                  _buildSupportOption(
                    'Account Help',
                    Icons.account_circle,
                    Colors.green,
                    () {
                      // Navigate to account help
                    },
                  ),
                  Divider(height: 1),
                  _buildSupportOption(
                    'Billing & Payments',
                    Icons.payment,
                    Colors.orange,
                    () {
                      // Navigate to billing help
                    },
                  ),
                  Divider(height: 1),
                  _buildSupportOption(
                    'Privacy & Security',
                    Icons.lock,
                    Colors.purple,
                    () {
                      // Navigate to privacy help
                    },
                  ),
                ],
              ),
            ),
            SizedBox(height: 24),
            Text(
              'Contact Support',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            TextField(
              controller: _subjectController,
              decoration: InputDecoration(
                labelText: 'Subject',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                contentPadding: EdgeInsets.all(12),
              ),
            ),
            SizedBox(height: 16),
            TextField(
              controller: _messageController,
              maxLines: 5,
              decoration: InputDecoration(
                labelText: 'Message',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                contentPadding: EdgeInsets.all(12),
              ),
            ),
            SizedBox(height: 16),
            Container(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // Submit support request
                  _submitSupportRequest();
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepPurple,
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(vertical: 16),
                ),
                child: Text('Submit Request'),
              ),
            ),
            SizedBox(height: 16),
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Frequently Asked Questions',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 12),
                  _buildFAQItem('How do I reset my password?'),
                  _buildFAQItem('How do I change my privacy settings?'),
                  _buildFAQItem('How do I report inappropriate content?'),
                  _buildFAQItem('How do subscriptions work?'),
                  TextButton(
                    onPressed: () {
                      // Navigate to full FAQ
                    },
                    child: Text('View all FAQs'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSupportOption(String title, IconData icon, Color color, VoidCallback onTap) {
    return ListTile(
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: color),
      ),
      title: Text(title),
      trailing: Icon(Icons.arrow_forward_ios, size: 16),
      onTap: onTap,
    );
  }

  Widget _buildFAQItem(String question) {
    return Padding(
      padding: EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.arrow_right, size: 16),
          SizedBox(width: 4),
          Expanded(
            child: Text(
              question,
              style: TextStyle(
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _submitSupportRequest() {
    // Show confirmation dialog
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Request Submitted'),
          content: Text('Your support request has been submitted successfully. We will get back to you within 24 hours.'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                _subjectController.clear();
                _messageController.clear();
              },
              child: Text('OK'),
            ),
          ],
        );
      },
    );
  }
}

enum SupportTab { tickets, faq, contact }

enum TicketStatus { open, inProgress, resolved, closed }

enum TicketPriority { low, medium, high }

class SupportTicket {
  final int id;
  final String subject;
  final String description;
  final String category;
  final TicketStatus status;
  final TicketPriority priority;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String assignedTo;

  SupportTicket({
    required this.id,
    required this.subject,
    required this.description,
    required this.category,
    required this.status,
    required this.priority,
    required this.createdAt,
    required this.updatedAt,
    required this.assignedTo,
  });
}

class FAQ {
  final int id;
  final String question;
  final String answer;
  final String category;

  FAQ({
    required this.id,
    required this.question,
    required this.answer,
    required this.category,
  });
}

class SupportCategory {
  final int id;
  final String name;
  final IconData icon;

  SupportCategory({
    required this.id,
    required this.name,
    required this.icon,
  });
}