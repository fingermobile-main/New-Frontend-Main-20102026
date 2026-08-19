import 'package:flutter/material.dart';

class HelpAndSupportPage extends StatefulWidget {
  const HelpAndSupportPage({super.key});

  @override
  State<HelpAndSupportPage> createState() => _HelpAndSupportPageState();
}

class _HelpAndSupportPageState extends State<HelpAndSupportPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Help & Support'),
        centerTitle: false,
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: ListView(
          children: [
            const Text(
              'How can we help you?',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'Browse our help topics or contact our support team for assistance.',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[700],
              ),
            ),
            const SizedBox(height: 24),
            _buildHelpCard(
              Icons.question_answer,
              'FAQ',
              'Find answers to common questions',
              Colors.blue,
              () {
                // Navigate to FAQ page
              },
            ),
            _buildHelpCard(
              Icons.chat_bubble,
              'Contact Support',
              'Get help from our support team',
              Colors.green,
              () {
                // Navigate to contact form
              },
            ),
            _buildHelpCard(
              Icons.video_help,
              'Video Tutorials',
              'Watch step-by-step guides',
              Colors.orange,
              () {
                // Navigate to video tutorials
              },
            ),
            _buildHelpCard(
              Icons.report,
              'Report a Problem',
              'Tell us about issues you\'re experiencing',
              Colors.red,
              () {
                // Navigate to problem reporting
              },
            ),
            _buildHelpCard(
              Icons.feedback,
              'Send Feedback',
              'Share your ideas and suggestions',
              Colors.purple,
              () {
                // Navigate to feedback form
              },
            ),
            _buildHelpCard(
              Icons.account_circle,
              'Account Help',
              'Assistance with your account',
              Colors.teal,
              () {
                // Navigate to account help
              },
            ),
            const SizedBox(height: 24),
            const Text(
              'Contact Information',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildContactInfo(
              Icons.email,
              'Email Support',
              'support@fingermobile.com',
            ),
            _buildContactInfo(
              Icons.phone,
              'Phone Support',
              '+1 (555) 123-4567',
            ),
            _buildContactInfo(
              Icons.access_time,
              'Support Hours',
              'Monday-Friday: 9AM-5PM EST',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHelpCard(IconData icon, String title, String subtitle, Color color, VoidCallback onTap) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Container(
          width: 48,
          height: 48,
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Icon(
            icon,
            color: color,
            size: 24,
          ),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }

  Widget _buildContactInfo(IconData icon, String title, String subtitle) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Icon(icon, color: Colors.grey[600]),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      color: Colors.grey,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}