import 'package:flutter/material.dart';

class PrivacyPolicyPage extends StatefulWidget {
  const PrivacyPolicyPage({super.key});

  @override
  State<PrivacyPolicyPage> createState() => _PrivacyPolicyPageState();
}

class _PrivacyPolicyPageState extends State<PrivacyPolicyPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Privacy Policy'),
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
              '1. Information We Collect',
              'We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us. This includes personal information like your name, email address, and payment information.',
            ),
            _buildSection(
              '2. How We Use Your Information',
              'We use the information we collect to provide, maintain, and improve our services, to communicate with you, to monitor and analyze trends and usage, and to ensure the security of our services.',
            ),
            _buildSection(
              '3. Information Sharing',
              'We do not share your personal information with third parties except as described in this policy. We may share information with service providers who help us operate our services and conduct business activities.',
            ),
            _buildSection(
              '4. Data Security',
              'We implement appropriate technical and organizational measures to protect the security of your personal information against unauthorized access, alteration, disclosure, or destruction.',
            ),
            _buildSection(
              '5. Your Rights',
              'You have the right to access, update, or delete your personal information at any time. You can also object to the processing of your information or request that we restrict processing in certain circumstances.',
            ),
            _buildSection(
              '6. Data Retention',
              'We retain your personal information for as long as necessary to provide our services and comply with our legal obligations. The retention period varies depending on the type of information and purpose of processing.',
            ),
            _buildSection(
              '7. Children\'s Privacy',
              'Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected personal information from a child, please contact us immediately.',
            ),
            _buildSection(
              '8. Changes to This Policy',
              'We may update this privacy policy from time to time. When we do, we will post the updated policy on this page and update the "Last Updated" date above. Your continued use of our services after any changes constitutes acceptance of the updated policy.',
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                // Accept privacy policy and continue
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              child: const Text('I Agree to the Privacy Policy'),
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