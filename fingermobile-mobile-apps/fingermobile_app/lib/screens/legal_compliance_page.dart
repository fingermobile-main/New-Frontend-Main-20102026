import 'package:flutter/material.dart';

class LegalCompliancePage extends StatefulWidget {
  const LegalCompliancePage({super.key});

  @override
  State<LegalCompliancePage> createState() => _LegalCompliancePageState();
}

class _LegalCompliancePageState extends State<LegalCompliancePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Legal Compliance'),
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
              'Legal Compliance Information',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            const Text(
              'This section provides information about our legal compliance measures and policies.',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[700],
              ),
            ),
            const SizedBox(height: 24),
            _buildComplianceCard(
              Icons.gavel,
              'Data Protection',
              'We comply with GDPR, CCPA, and other data protection regulations',
              Colors.blue,
            ),
            _buildComplianceCard(
              Icons.privacy_tip,
              'Privacy Compliance',
              'Our practices align with global privacy standards',
              Colors.green,
            ),
            _buildComplianceCard(
              Icons.security,
              'Security Standards',
              'SOC 2, ISO 27001, and other security certifications',
              Colors.orange,
            ),
            _buildComplianceCard(
              Icons.flag,
              'Regional Laws',
              'Compliance with local regulations in supported regions',
              Colors.red,
            ),
            _buildComplianceCard(
              Icons.policy,
              'Content Policies',
              'Guidelines for member-generated content moderation',
              Colors.purple,
            ),
            _buildComplianceCard(
              Icons.report,
              'Transparency Reports',
              'Regular reports on government requests and content removals',
              Colors.teal,
            ),
            const SizedBox(height: 24),
            const Text(
              'Compliance Status',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildStatusCard('GDPR Compliance', 'Certified', Colors.green),
            _buildStatusCard('CCPA Compliance', 'Certified', Colors.green),
            _buildStatusCard('SOC 2 Type II', 'In Progress', Colors.orange),
            _buildStatusCard('ISO 27001', 'Planned', Colors.red),
            const SizedBox(height: 24),
            const Text(
              'Your Rights',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildRightsCard(
              Icons.visibility,
              'Right to Access',
              'You can request a copy of your personal data',
            ),
            _buildRightsCard(
              Icons.edit,
              'Right to Rectification',
              'You can correct inaccurate personal data',
            ),
            _buildRightsCard(
              Icons.delete,
              'Right to Erasure',
              'You can request deletion of your personal data',
            ),
            _buildRightsCard(
              Icons.block,
              'Right to Restrict Processing',
              'You can limit how we process your data',
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildComplianceCard(IconData icon, String title, String subtitle, Color color) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Container(
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
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 14,
                      color: Colors.grey,
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

  Widget _buildStatusCard(String title, String status, Color color) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                status,
                style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRightsCard(IconData icon, String title, String description) {
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
                    description,
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