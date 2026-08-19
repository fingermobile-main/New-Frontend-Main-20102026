import 'package:flutter/material.dart';

class TwoFactorAuthSettingsPage extends StatefulWidget {
  const TwoFactorAuthSettingsPage({super.key});

  @override
  State<TwoFactorAuthSettingsPage> createState() => _TwoFactorAuthSettingsPageState();
}

class _TwoFactorAuthSettingsPageState extends State<TwoFactorAuthSettingsPage> {
  bool _isSmsEnabled = false;
  bool _isAuthAppEnabled = false;
  bool _isBackupCodesEnabled = false;
  bool _requireTwoFactorForAllDevices = true;
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Two-Factor Authentication'),
        centerTitle: false,
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: ListView(
        children: [
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Two-Factor Authentication',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.0),
            child: Text(
              'Add extra security to your account by requiring a second form of verification when you sign in.',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),
          ),
          const SizedBox(height: 24),
          
          // SMS Authentication
          Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: ExpansionTile(
              leading: Icon(
                _isSmsEnabled ? Icons.sms : Icons.sms_failed,
                color: _isSmsEnabled ? Colors.green : Colors.grey,
              ),
              title: const Text('SMS Authentication'),
              subtitle: Text(
                _isSmsEnabled ? 'Enabled' : 'Disabled',
                style: TextStyle(
                  color: _isSmsEnabled ? Colors.green : Colors.grey,
                ),
              ),
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Receive SMS codes to verify your identity',
                        style: TextStyle(fontSize: 14),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        decoration: InputDecoration(
                          labelText: 'Phone Number',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                          prefixText: '+1 ',
                        ),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _isSmsEnabled ? null : () {
                          _enableSmsAuth();
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _isSmsEnabled ? Colors.grey : Colors.blue,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                        ),
                        child: Text(_isSmsEnabled ? 'Enabled' : 'Enable SMS Auth'),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          
          // Authenticator App
          Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: ExpansionTile(
              leading: Icon(
                _isAuthAppEnabled ? Icons.qr_code : Icons.qr_code_2_outlined,
                color: _isAuthAppEnabled ? Colors.green : Colors.grey,
              ),
              title: const Text('Authenticator App'),
              subtitle: Text(
                _isAuthAppEnabled ? 'Enabled' : 'Disabled',
                style: TextStyle(
                  color: _isAuthAppEnabled ? Colors.green : Colors.grey,
                ),
              ),
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Use an authenticator app for time-based codes',
                        style: TextStyle(fontSize: 14),
                      ),
                      const SizedBox(height: 16),
                      if (_isAuthAppEnabled) ...[
                        const Text(
                          'Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)',
                          style: TextStyle(fontSize: 14),
                        ),
                        const SizedBox(height: 16),
                        Container(
                          width: 200,
                          height: 200,
                          color: Colors.grey[200],
                          child: const Center(
                            child: Icon(
                              Icons.qr_code,
                              size: 100,
                              color: Colors.black,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        TextField(
                          decoration: InputDecoration(
                            labelText: 'Enter 6-digit code',
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            // Verify code and complete setup
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                          ),
                          child: const Text('Verify Code'),
                        ),
                      ] else ...[
                        const Text(
                          'Set up two-factor authentication with an authenticator app for increased security.',
                          style: TextStyle(fontSize: 14),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            _enableAuthApp();
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                          ),
                          child: const Text('Set up Authenticator App'),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
          
          // Backup Codes
          Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: ExpansionTile(
              leading: Icon(
                _isBackupCodesEnabled ? Icons.lock_outline : Icons.lock_open_outlined,
                color: _isBackupCodesEnabled ? Colors.green : Colors.grey,
              ),
              title: const Text('Backup Codes'),
              subtitle: Text(
                _isBackupCodesEnabled ? 'Enabled' : 'Disabled',
                style: TextStyle(
                  color: _isBackupCodesEnabled ? Colors.green : Colors.grey,
                ),
              ),
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Backup codes can be used when you don\'t have access to your other authentication methods',
                        style: TextStyle(fontSize: 14),
                      ),
                      const SizedBox(height: 16),
                      if (_isBackupCodesEnabled) ...[
                        const Text(
                          'Keep these backup codes in a safe place. Each code can only be used once.',
                          style: TextStyle(fontSize: 14),
                        ),
                        const SizedBox(height: 16),
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: Colors.grey[100],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Column(
                            children: [
                              for (int i = 0; i < 5; i++)
                                Padding(
                                  padding: const EdgeInsets.only(bottom: 8.0),
                                  child: Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 12,
                                          vertical: 8,
                                        ),
                                        decoration: BoxDecoration(
                                          color: Colors.white,
                                          borderRadius: BorderRadius.circular(4),
                                          border: Border.all(color: Colors.grey),
                                        ),
                                        child: Text(
                                          'XXXX-XXXX',
                                          style: const TextStyle(fontFamily: 'monospace'),
                                        ),
                                      ),
                                      const Spacer(),
                                      IconButton(
                                        icon: const Icon(Icons.copy, size: 16),
                                        onPressed: () {
                                          // Copy code to clipboard
                                        },
                                      ),
                                    ],
                                  ),
                                ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            // Generate new backup codes
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.orange,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                          ),
                          child: const Text('Generate New Codes'),
                        ),
                      ] else ...[
                        const Text(
                          'Generate backup codes to use when you don\'t have access to your phone.',
                          style: TextStyle(fontSize: 14),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: () {
                            _generateBackupCodes();
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                          ),
                          child: const Text('Generate Backup Codes'),
                        ),
                      ],
                    ],
                  ),
                ),
              ],
            ),
          ),
          
          // Additional Security Settings
          const Padding(
            padding: EdgeInsets.all(16.0),
            child: Text(
              'Additional Security',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          
          Card(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: SwitchListTile(
              title: const Text('Require 2FA for all devices'),
              subtitle: const Text('Require two-factor authentication for new device logins'),
              value: _requireTwoFactorForAllDevices,
              onChanged: (value) {
                setState(() {
                  _requireTwoFactorForAllDevices = value;
                });
              },
            ),
          ),
          
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  void _enableSmsAuth() {
    showDialog(
      context: context,
      builder: (context) {
        String phoneNumber = '';
        return AlertDialog(
          title: const Text('Enable SMS Authentication'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Enter your phone number to receive authentication codes via SMS.',
                style: TextStyle(fontSize: 14),
              ),
              const SizedBox(height: 16),
              TextField(
                decoration: InputDecoration(
                  labelText: 'Phone Number',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                  prefixText: '+1 ',
                ),
                onChanged: (value) {
                  phoneNumber = value;
                },
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                // Here you would implement the SMS verification logic
                Navigator.of(context).pop();
                setState(() {
                  _isSmsEnabled = true;
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('SMS Authentication enabled'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: const Text('Enable'),
            ),
          ],
        );
      },
    );
  }

  void _enableAuthApp() {
    setState(() {
      _isAuthAppEnabled = true;
    });
  }

  void _generateBackupCodes() {
    setState(() {
      _isBackupCodesEnabled = true;
    });
  }
}