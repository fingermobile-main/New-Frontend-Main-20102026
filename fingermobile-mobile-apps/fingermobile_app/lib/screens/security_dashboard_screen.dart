import 'package:flutter/material.dart';
import 'package:fingermobile_app/models/member.dart';
import 'package:fingermobile_app/screens/totp_setup_screen.dart';
import 'package:fingermobile_app/screens/session_management_screen.dart';
import 'package:fingermobile_app/screens/security_setup_screen.dart';
import 'package:fingermobile_app/screens/connected_devices_screen.dart'; // Import the new screen

class SecurityDashboardScreen extends StatefulWidget {
  final member member;

  const SecurityDashboardScreen({super.key, required this.member});

  @override
  State<SecurityDashboardScreen> createState() => _SecurityDashboardScreenState();
}

class _SecurityDashboardScreenState extends State<SecurityDashboardScreen> {
  late member _member;

  @override
  void initState() {
    super.initState();
    _member = widget.member;
  }

  void _refreshmember() {
    // In a real app, you would fetch updated member data from the server
    setState(() {
      // Update member with new security settings
      _member = _member.copyWith(
        phoneVerified: true,
        twoFactorEnabled: true,
        multiFactorEnabled: true,
        biometricEnrolled: true,
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Security Settings'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Security Dashboard',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Manage your account security settings and connected devices',
            ),
            const SizedBox(height: 32),
            _buildSectionHeader('Two-Factor Authentication', Icons.security),
            const SizedBox(height: 16),
            _buildTwoFactorCard(),
            const SizedBox(height: 32),
            _buildSectionHeader('Multi-Factor Authentication', Icons.lock),
            const SizedBox(height: 16),
            _buildMultiFactorCard(),
            const SizedBox(height: 32),
            _buildSectionHeader('Biometric Authentication', Icons.fingerprint),
            const SizedBox(height: 16),
            _buildBiometricCard(),
            const SizedBox(height: 32),
            _buildSectionHeader('Connected Devices', Icons.devices),
            const SizedBox(height: 16),
            _buildConnectedDevicesCard(),
            const SizedBox(height: 32),
            _buildDevicesCard(),
            const SizedBox(height: 32),
            _buildSectionHeader('Additional Security', Icons.more_horiz),
            const SizedBox(height: 16),
            _buildAdditionalSecurityCard(),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon) {
    return Row(
      children: [
        Icon(icon, size: 20),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildTwoFactorCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Two-Factor Authentication',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Switch(
                  value: _member.twoFactorEnabled,
                  onChanged: (value) {
                    // In a real app, you would call the API to enable/disable 2FA
                    if (value) {
                      _setupTwoFactor();
                    } else {
                      _disableTwoFactor();
                    }
                  },
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              _member.twoFactorEnabled
                  ? 'Two-factor authentication is enabled'
                  : 'Add an extra layer of security to your account',
              style: const TextStyle(
                color: Colors.grey,
              ),
            ),
            if (_member.twoFactorEnabled) ...[
              const SizedBox(height: 16),
              const Text('Primary method:'),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Text('Authenticator App'),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildMultiFactorCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Multi-Factor Authentication',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Switch(
                  value: _member.multiFactorEnabled,
                  onChanged: (value) {
                    // In a real app, you would call the API to enable/disable MFA
                    if (value) {
                      _setupMultiFactor();
                    } else {
                      _disableMultiFactor();
                    }
                  },
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              _member.multiFactorEnabled
                  ? 'Multi-factor authentication is enabled'
                  : 'Add multiple layers of authentication for enhanced security',
              style: const TextStyle(
                color: Colors.grey,
              ),
            ),
            if (_member.multiFactorEnabled) ...[
              const SizedBox(height: 16),
              const Text('Active methods:'),
              const SizedBox(height: 4),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: const [
                  Chip(label: Text('Authenticator App')),
                  Chip(label: Text('SMS')),
                  Chip(label: Text('Email')),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildBiometricCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Biometric Authentication',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Switch(
                  value: _member.biometricEnrolled,
                  onChanged: (value) {
                    // In a real app, you would call the API to enroll/remove biometric
                    if (value) {
                      _enrollBiometric();
                    } else {
                      _removeBiometric();
                    }
                  },
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              _member.biometricEnrolled
                  ? 'Biometric authentication is enrolled'
                  : 'Use Face ID or Fingerprint for quick access',
              style: const TextStyle(
                color: Colors.grey,
              ),
            ),
            if (_member.biometricEnrolled) ...[
              const SizedBox(height: 16),
              const Text('Enrolled methods:'),
              const SizedBox(height: 4),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.purple.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: const Text('Face ID'),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildDevicesCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Connected Devices',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Manage devices that are signed in to your account',
              style: TextStyle(
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                icon: const Icon(Icons.devices),
                label: const Text('View Active Sessions'),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => SessionManagementScreen(member: _member),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAdditionalSecurityCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Additional Security Options',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                icon: const Icon(Icons.phone_iphone),
                label: const Text('Phone Verification'),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => SecuritySetupScreen(member: _member),
                    ),
                  ).then((_) => _refreshmember());
                },
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                icon: const Icon(Icons.qr_code),
                label: const Text('Authenticator App'),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => TotpSetupScreen(member: _member),
                    ),
                  ).then((result) {
                    if (result == true) {
                      _refreshmember();
                    }
                  });
                },
              ),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                icon: const Icon(Icons.password),
                label: const Text('Backup Codes'),
                onPressed: () {
                  // In a real app, you would navigate to backup codes screen
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _setupTwoFactor() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => SecuritySetupScreen(member: _member),
      ),
    ).then((_) => _refreshmember());
  }

  void _disableTwoFactor() {
    // In a real app, you would call the API to disable 2FA
    setState(() {
      _member = _member.copyWith(twoFactorEnabled: false);
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Two-factor authentication disabled')),
    );
  }

  void _setupMultiFactor() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => SecuritySetupScreen(member: _member),
      ),
    ).then((_) => _refreshmember());
  }

  void _disableMultiFactor() {
    // In a real app, you would call the API to disable MFA
    setState(() {
      _member = _member.copyWith(multiFactorEnabled: false);
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Multi-factor authentication disabled')),
    );
  }

  void _enrollBiometric() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => SecuritySetupScreen(member: _member),
      ),
    ).then((_) => _refreshmember());
  }

  void _removeBiometric() {
    // In a real app, you would call the API to remove biometric enrollment
    setState(() {
      _member = _member.copyWith(biometricEnrolled: false);
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Biometric authentication removed')),
    );
  }
}

  Widget _buildConnectedDevicesCard() {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16.0),
      child: ListTile(
        leading: const Icon(Icons.devices_other),
        title: const Text('Manage Connected Devices'),
        subtitle: const Text('View and disconnect devices logged into your account'),
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ConnectedDevicesScreen(memberId: widget.member.id), // Assuming member ID is available
            ),
          );
        },
      ),
    );
  }