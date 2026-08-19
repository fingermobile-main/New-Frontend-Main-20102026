import 'package:flutter/material.dart';

class TermsOfServicePage extends StatefulWidget {
  const TermsOfServicePage({super.key});

  @override
  State<TermsOfServicePage> createState() => _TermsOfServicePageState();
}

class _TermsOfServicePageState extends State<TermsOfServicePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Terms of Service'),
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
              'Last Updated: December 27, 2025',
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 16),
            _buildSection(
              '1. Introduction',
              'Welcome to FingerMobile Platform. These terms and conditions outline the rules and regulations for the use of our services.',
            ),
            _buildSection(
              '2. member Responsibilities',
              'members are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.',
            ),
            _buildSection(
              '3. Content Guidelines',
              'members must not post content that is illegal, offensive, or infringes on the rights of others. All content must comply with applicable laws and regulations.',
            ),
            _buildSection(
              '4. Privacy Policy',
              'We collect and use your personal information in accordance with our Privacy Policy. By using our services, you consent to such collection and use.',
            ),
            _buildSection(
              '5. Termination',
              'We may terminate or suspend your account and access to our services immediately, without prior notice, for any reason whatsoever, including without limitation if you breach these terms.',
            ),
            _buildSection(
              '6. Limitation of Liability',
              'In no event shall FingerMobile, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.',
            ),
            _buildSection(
              '7. Changes to Terms',
              'We reserve the right to modify or replace these terms at any time. It is your responsibility to check this page periodically for changes.',
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                // Accept terms and continue
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('I Agree to the Terms of Service'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, String content) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            content,
            style: const TextStyle(
              fontSize: 14,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}