import 'package:flutter/material.dart';

class HelpSupportScreen extends StatefulWidget {
  @override
  _HelpSupportScreenState createState() => _HelpSupportScreenState();
}

class _HelpSupportScreenState extends State<HelpSupportScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Help & Support'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        children: [
          // Welcome message
          Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.blue[50],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Need help?',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'We\'re here to assist you with any questions or issues you may have.',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[700],
                  ),
                ),
              ],
            ),
          ),
          
          SizedBox(height: 16),
          
          // Quick help section
          _buildSectionHeader('Quick Help'),
          _buildHelpItem(
            icon: Icons.question_answer,
            title: 'Frequently Asked Questions',
            subtitle: 'Find answers to common questions',
            onTap: () {
              _openFAQ();
            },
          ),
          _buildHelpItem(
            icon: Icons.article,
            title: 'member Guide',
            subtitle: 'Learn how to use FingerMobile features',
            onTap: () {
              _openmemberGuide();
            },
          ),
          _buildHelpItem(
            icon: Icons.video_call,
            title: 'Video Tutorials',
            subtitle: 'Watch step-by-step guides',
            onTap: () {
              _openVideoTutorials();
            },
          ),
          
          // Contact support section
          _buildSectionHeader('Contact Support'),
          _buildHelpItem(
            icon: Icons.chat,
            title: 'Chat with Support',
            subtitle: 'Get instant help from our support team',
            onTap: () {
              _startChat();
            },
          ),
          _buildHelpItem(
            icon: Icons.email,
            title: 'Email Support',
            subtitle: 'Send us a detailed message',
            onTap: () {
              _sendEmail();
            },
          ),
          _buildHelpItem(
            icon: Icons.report,
            title: 'Report a Problem',
            subtitle: 'Tell us about issues you\'re experiencing',
            onTap: () {
              _reportProblem();
            },
          ),
          
          // Account and privacy
          _buildSectionHeader('Account & Privacy'),
          _buildHelpItem(
            icon: Icons.lock,
            title: 'Privacy Settings',
            subtitle: 'Manage your privacy preferences',
            onTap: () {
              Navigator.pushNamed(context, '/privacy');
            },
          ),
          _buildHelpItem(
            icon: Icons.security,
            title: 'Security Settings',
            subtitle: 'Manage your account security',
            onTap: () {
              Navigator.pushNamed(context, '/security');
            },
          ),
          
          // Additional resources
          _buildSectionHeader('Additional Resources'),
          _buildHelpItem(
            icon: Icons.code,
            title: 'Developer Resources',
            subtitle: 'API documentation and tools',
            onTap: () {
              _openDeveloperResources();
            },
          ),
          _buildHelpItem(
            icon: Icons.policy,
            title: 'Terms of Service',
            subtitle: 'Our terms and conditions',
            onTap: () {
              _openTermsOfService();
            },
          ),
          _buildHelpItem(
            icon: Icons.privacy_tip,
            title: 'Privacy Policy',
            subtitle: 'How we protect your data',
            onTap: () {
              _openPrivacyPolicy();
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: Colors.grey[200],
      child: Text(
        title,
        style: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.bold,
          color: Colors.grey[600],
        ),
      ),
    );
  }

  Widget _buildHelpItem({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: Colors.blue[100],
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: Colors.blue),
      ),
      title: Text(title),
      subtitle: Text(subtitle),
      trailing: Icon(Icons.arrow_forward_ios, size: 16),
      onTap: onTap,
    );
  }

  void _openFAQ() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Frequently Asked Questions'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildFAQItem(
                  'How do I change my password?',
                  'Go to Settings > Security > Change Password',
                ),
                _buildFAQItem(
                  'How do I report inappropriate content?',
                  'Tap the three dots on a post and select "Report"',
                ),
                _buildFAQItem(
                  'How do I control who sees my posts?',
                  'Adjust your privacy settings in your profile',
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Close'),
            ),
          ],
        );
      },
    );
  }

  Widget _buildFAQItem(String question, String answer) {
    return Padding(
      padding: EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            question,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
          SizedBox(height: 4),
          Text(
            answer,
            style: TextStyle(
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  void _openmemberGuide() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('member Guide'),
          content: Text(
            'The FingerMobile member guide is available in the app or on our website. '
            'It includes step-by-step instructions for all features and functionalities.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('OK'),
            ),
          ],
        );
      },
    );
  }

  void _openVideoTutorials() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Video Tutorials'),
          content: Text(
            'Visit our YouTube channel for video tutorials on using FingerMobile. '
            'New videos are added regularly to help you get the most out of our platform.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('OK'),
            ),
          ],
        );
      },
    );
  }

  void _startChat() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Chat with Support'),
          content: Text(
            'Our support team is available 24/7. '
            'Please describe your issue briefly and we\'ll connect you with an agent.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
                // In a real app, this would start a chat
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Starting chat with support...'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: Text('Start Chat'),
            ),
          ],
        );
      },
    );
  }

  void _sendEmail() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        final emailController = TextEditingController();
        final messageController = TextEditingController();

        return AlertDialog(
          title: Text('Email Support'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: emailController,
                decoration: InputDecoration(
                  labelText: 'Your Email',
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 16),
              TextField(
                controller: messageController,
                maxLines: 5,
                decoration: InputDecoration(
                  labelText: 'Your Message',
                  border: OutlineInputBorder(),
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
            TextButton(
              onPressed: () {
                // In a real app, this would send the email
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Your message has been sent'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: Text('Send'),
            ),
          ],
        );
      },
    );
  }

  void _reportProblem() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        final categoryController = TextEditingController();
        final descriptionController = TextEditingController();

        return AlertDialog(
          title: Text('Report a Problem'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: categoryController,
                decoration: InputDecoration(
                  labelText: 'Category',
                  hintText: 'e.g., Login issues, App crashes, etc.',
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 16),
              TextField(
                controller: descriptionController,
                maxLines: 5,
                decoration: InputDecoration(
                  labelText: 'Describe the problem',
                  hintText: 'Please be as specific as possible...',
                  border: OutlineInputBorder(),
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
            TextButton(
              onPressed: () {
                // In a real app, this would submit the report
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Problem reported successfully'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: Text('Submit'),
            ),
          ],
        );
      },
    );
  }

  void _openDeveloperResources() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Developer Resources'),
          content: Text(
            'Visit our developer portal for API documentation, SDKs, and tools to build on the FingerMobile platform.',
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('OK'),
            ),
          ],
        );
      },
    );
  }

  void _openTermsOfService() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Terms of Service'),
          content: SingleChildScrollView(
            child: Text(
              'Our Terms of Service govern your use of the FingerMobile platform. '
              'By using our services, you agree to these terms:\n\n'
              '1. You must be at least 13 years old to use FingerMobile\n'
              '2. You are responsible for your content and activity\n'
              '3. You must respect the rights of others\n'
              '4. We may modify or discontinue services with notice\n'
              '5. Your use of the service is at your own risk',
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Accept'),
            ),
          ],
        );
      },
    );
  }

  void _openPrivacyPolicy() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Privacy Policy'),
          content: SingleChildScrollView(
            child: Text(
              'Our Privacy Policy explains how we collect, use, and protect your personal information:\n\n'
              '1. We collect information you provide directly to us\n'
              '2. We collect data about your interactions with our service\n'
              '3. We use your information to provide and improve our service\n'
              '4. We share information only as necessary to provide our service\n'
              '5. You have rights regarding your personal information',
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Accept'),
            ),
          ],
        );
      },
    );
  }
}