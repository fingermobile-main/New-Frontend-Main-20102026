import 'package:flutter/material.dart';

class SecuritySetupPage extends StatefulWidget {
  const SecuritySetupPage({super.key});

  @override
  State<SecuritySetupPage> createState() => _SecuritySetupPageState();
}

class _SecuritySetupPageState extends State<SecuritySetupPage> {
  bool _isLoading = false;
  String? _errorMessage;
  SecuritySettings _securitySettings = SecuritySettings();
  bool _biometricEnabled = false;
  bool _twoFactorEnabled = false;
  String _selectedAuthMethod = 'sms';
  String _backupEmail = '';
  bool _locationTracking = false;
  bool _suspiciousActivityAlerts = true;

  @override
  void initState() {
    super.initState();
    _loadSecuritySettings();
  }

  Future<void> _loadSecuritySettings() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock security settings
      setState(() {
        _securitySettings = SecuritySettings(
          passwordLastChanged: DateTime.now().subtract(const Duration(days: 30)),
          lastLogin: DateTime.now().subtract(const Duration(hours: 2)),
          trustedDevices: 3,
          activeSessions: 2,
          twoFactorEnabled: true,
          biometricEnabled: true,
          backupEmail: 'member.backup@example.com',
          locationTracking: true,
          suspiciousActivityAlerts: true,
        );

        _biometricEnabled = _securitySettings.biometricEnabled;
        _twoFactorEnabled = _securitySettings.twoFactorEnabled;
        _backupEmail = _securitySettings.backupEmail;
        _locationTracking = _securitySettings.locationTracking;
        _suspiciousActivityAlerts = _securitySettings.suspiciousActivityAlerts;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load security settings. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _changePassword() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildChangePasswordSheet(),
    );
  }

  void _setupTwoFactorAuth() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildTwoFactorAuthSheet(),
    );
  }

  void _manageTrustedDevices() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildTrustedDevicesSheet(),
    );
  }

  void _manageActiveSessions() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildActiveSessionsSheet(),
    );
  }

  Widget _buildChangePasswordSheet() {
    TextEditingController currentPasswordController = TextEditingController();
    TextEditingController newPasswordController = TextEditingController();
    TextEditingController confirmNewPasswordController = TextEditingController();

    return StatefulBuilder(
      builder: (BuildContext context, StateSetter setState) {
        return Container(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Change Password',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 20,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextField(
                controller: currentPasswordController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Current Password',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: newPasswordController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'New Password',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: confirmNewPasswordController,
                obscureText: true,
                decoration: const InputDecoration(
                  labelText: 'Confirm New Password',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    // Validate and change password
                    if (newPasswordController.text == confirmNewPasswordController.text &&
                        newPasswordController.text.isNotEmpty) {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Password changed successfully'),
                          backgroundColor: Colors.green,
                        ),
                      );
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Passwords do not match or are empty'),
                          backgroundColor: Colors.red,
                        ),
                      );
                    }
                  },
                  child: const Text('Change Password'),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildTwoFactorAuthSheet() {
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Two-Factor Authentication',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            'Choose your preferred authentication method:',
            style: TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 16),
          ListTile(
            title: const Text('SMS'),
            subtitle: const Text('Receive codes via text message'),
            leading: Radio<String>(
              value: 'sms',
              groupValue: _selectedAuthMethod,
              onChanged: (value) {
                setState(() {
                  _selectedAuthMethod = value!;
                });
              },
            ),
            onTap: () {
              setState(() {
                _selectedAuthMethod = 'sms';
              });
            },
          ),
          ListTile(
            title: const Text('Email'),
            subtitle: const Text('Receive codes via email'),
            leading: Radio<String>(
              value: 'email',
              groupValue: _selectedAuthMethod,
              onChanged: (value) {
                setState(() {
                  _selectedAuthMethod = value!;
                });
              },
            ),
            onTap: () {
              setState(() {
                _selectedAuthMethod = 'email';
              });
            },
          ),
          ListTile(
            title: const Text('Authenticator App'),
            subtitle: const Text('Use Google Authenticator or similar app'),
            leading: Radio<String>(
              value: 'authenticator',
              groupValue: _selectedAuthMethod,
              onChanged: (value) {
                setState(() {
                  _selectedAuthMethod = value!;
                });
              },
            ),
            onTap: () {
              setState(() {
                _selectedAuthMethod = 'authenticator';
              });
            },
          ),
          const SizedBox(height: 16),
          TextField(
            decoration: const InputDecoration(
              labelText: 'Backup Email',
              border: OutlineInputBorder(),
            ),
            controller: TextEditingController(text: _backupEmail),
            onChanged: (value) {
              setState(() {
                _backupEmail = value;
              });
            },
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('2FA enabled with $_selectedAuthMethod'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: const Text('Enable 2FA'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTrustedDevicesSheet() {
    List<Device> devices = [
      Device(
        id: 1,
        name: 'iPhone 12 Pro',
        type: 'Mobile',
        lastActive: DateTime.now().subtract(const Duration(hours: 2)),
        isCurrent: true,
      ),
      Device(
        id: 2,
        name: 'MacBook Pro',
        type: 'Desktop',
        lastActive: DateTime.now().subtract(const Duration(days: 1)),
        isCurrent: false,
      ),
      Device(
        id: 3,
        name: 'iPad Air',
        type: 'Tablet',
        lastActive: DateTime.now().subtract(const Duration(days: 5)),
        isCurrent: false,
      ),
    ];

    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Trusted Devices',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            'Manage devices that are trusted to access your account',
            style: TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 300,
            child: ListView.builder(
              itemCount: devices.length,
              itemBuilder: (context, index) {
                var device = devices[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              device.name,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            if (device.isCurrent)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.green,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Text(
                                  'Current',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text('${device.type} • Last active: ${_formatRelativeTime(device.lastActive)}'),
                        const SizedBox(height: 16),
                        if (!device.isCurrent)
                          SizedBox(
                            width: double.infinity,
                            child: OutlinedButton(
                              onPressed: () {
                                // Remove device
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('Removed ${device.name}'),
                                    backgroundColor: Colors.red,
                                  ),
                                );
                              },
                              child: const Text('Remove Device'),
                            ),
                          ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveSessionsSheet() {
    List<Session> sessions = [
      Session(
        id: 1,
        device: 'iPhone 12 Pro',
        location: 'New York, US',
        ipAddress: '192.168.1.100',
        lastActive: DateTime.now().subtract(const Duration(minutes: 5)),
        isCurrent: true,
      ),
      Session(
        id: 2,
        device: 'Chrome on Windows',
        location: 'London, UK',
        ipAddress: '203.0.113.45',
        lastActive: DateTime.now().subtract(const Duration(hours: 3)),
        isCurrent: false,
      ),
    ];

    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Active Sessions',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            'Manage currently active sessions',
            style: TextStyle(fontSize: 16),
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: 300,
            child: ListView.builder(
              itemCount: sessions.length,
              itemBuilder: (context, index) {
                var session = sessions[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 16),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              session.device,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            if (session.isCurrent)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.green,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Text(
                                  'Current',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(session.ipAddress),
                        Text(session.location),
                        const SizedBox(height: 8),
                        Text('Last active: ${_formatRelativeTime(session.lastActive)}'),
                        const SizedBox(height: 16),
                        if (!session.isCurrent)
                          SizedBox(
                            width: double.infinity,
                            child: OutlinedButton(
                              onPressed: () {
                                // End session
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('Ended session on ${session.device}'),
                                    backgroundColor: Colors.red,
                                  ),
                                );
                              },
                              child: const Text('End Session'),
                            ),
                          ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Security Setup'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadSecuritySettings,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadSecuritySettings,
        child: _isLoading && _securitySettings.lastLogin == null
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _securitySettings.lastLogin == null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadSecuritySettings,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : SingleChildScrollView(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Security Summary
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Security Status',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 18,
                                  ),
                                ),
                                const SizedBox(height: 16),
                                Row(
                                  children: [
                                    Icon(
                                      _securitySettings.twoFactorEnabled
                                          ? Icons.lock
                                          : Icons.lock_open,
                                      color: _securitySettings.twoFactorEnabled
                                          ? Colors.green
                                          : Colors.red,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      _securitySettings.twoFactorEnabled
                                          ? '2FA Enabled'
                                          : '2FA Disabled',
                                      style: TextStyle(
                                        color: _securitySettings.twoFactorEnabled
                                            ? Colors.green
                                            : Colors.red,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    Icon(
                                      _securitySettings.biometricEnabled
                                          ? Icons.fingerprint
                                          : Icons.fingerprint_outlined,
                                      color: _securitySettings.biometricEnabled
                                          ? Colors.green
                                          : Colors.red,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      _securitySettings.biometricEnabled
                                          ? 'Biometrics Enabled'
                                          : 'Biometrics Disabled',
                                      style: TextStyle(
                                        color: _securitySettings.biometricEnabled
                                            ? Colors.green
                                            : Colors.red,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    const Icon(Icons.access_time),
                                    const SizedBox(width: 8),
                                    Text(
                                        'Password last changed: ${_formatRelativeTime(_securitySettings.passwordLastChanged)}'),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    const Icon(Icons.login),
                                    const SizedBox(width: 8),
                                    Text(
                                        'Last login: ${_formatRelativeTime(_securitySettings.lastLogin)}'),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Password Section
                        const Text(
                          'Password',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Card(
                          child: ListTile(
                            title: const Text('Change Password'),
                            subtitle: const Text('Update your account password'),
                            trailing: const Icon(Icons.arrow_forward_ios),
                            onTap: _changePassword,
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Two-Factor Authentication
                        const Text(
                          'Two-Factor Authentication',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Card(
                          child: SwitchListTile(
                            title: const Text('Enable 2FA'),
                            subtitle: const Text('Add an extra layer of security'),
                            value: _twoFactorEnabled,
                            onChanged: (value) {
                              setState(() {
                                _twoFactorEnabled = value;
                              });
                              if (value) {
                                _setupTwoFactorAuth();
                              } else {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('2FA disabled'),
                                    backgroundColor: Colors.orange,
                                  ),
                                );
                              }
                            },
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Biometric Authentication
                        const Text(
                          'Biometric Authentication',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Card(
                          child: SwitchListTile(
                            title: const Text('Enable Biometrics'),
                            subtitle: const Text('Use fingerprint or face recognition'),
                            value: _biometricEnabled,
                            onChanged: (value) {
                              setState(() {
                                _biometricEnabled = value;
                              });
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(value
                                      ? 'Biometrics enabled'
                                      : 'Biometrics disabled'),
                                  backgroundColor:
                                      value ? Colors.green : Colors.orange,
                                ),
                              );
                            },
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Device Management
                        const Text(
                          'Device Management',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Card(
                          child: ListTile(
                            title: const Text('Trusted Devices'),
                            subtitle: Text(
                                '${_securitySettings.trustedDevices} trusted devices'),
                            trailing: const Icon(Icons.arrow_forward_ios),
                            onTap: _manageTrustedDevices,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Card(
                          child: ListTile(
                            title: const Text('Active Sessions'),
                            subtitle: Text(
                                '${_securitySettings.activeSessions} active sessions'),
                            trailing: const Icon(Icons.arrow_forward_ios),
                            onTap: _manageActiveSessions,
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Privacy Settings
                        const Text(
                          'Privacy Settings',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Card(
                          child: SwitchListTile(
                            title: const Text('Location Tracking'),
                            subtitle: const Text('Allow location tracking for security'),
                            value: _locationTracking,
                            onChanged: (value) {
                              setState(() {
                                _locationTracking = value;
                              });
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(value
                                      ? 'Location tracking enabled'
                                      : 'Location tracking disabled'),
                                  backgroundColor:
                                      value ? Colors.green : Colors.orange,
                                ),
                              );
                            },
                          ),
                        ),
                        const SizedBox(height: 16),
                        Card(
                          child: SwitchListTile(
                            title: const Text('Suspicious Activity Alerts'),
                            subtitle:
                                const Text('Notify about unusual account activity'),
                            value: _suspiciousActivityAlerts,
                            onChanged: (value) {
                              setState(() {
                                _suspiciousActivityAlerts = value;
                              });
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text(value
                                      ? 'Alerts enabled'
                                      : 'Alerts disabled'),
                                  backgroundColor:
                                      value ? Colors.green : Colors.orange,
                                ),
                              );
                            },
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Security Tips
                        const Text(
                          'Security Tips',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  '• Use a strong, unique password',
                                  style: TextStyle(fontSize: 16),
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  '• Enable two-factor authentication',
                                  style: TextStyle(fontSize: 16),
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  '• Regularly review trusted devices',
                                  style: TextStyle(fontSize: 16),
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  '• Keep your software updated',
                                  style: TextStyle(fontSize: 16),
                                ),
                                const SizedBox(height: 8),
                                const Text(
                                  '• Be cautious of phishing attempts',
                                  style: TextStyle(fontSize: 16),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
      ),
    );
  }

  String _formatRelativeTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes} min ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours} hrs ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return '${dateTime.month}/${dateTime.day}/${dateTime.year}';
    }
  }
}

class SecuritySettings {
  final DateTime passwordLastChanged;
  final DateTime lastLogin;
  final int trustedDevices;
  final int activeSessions;
  final bool twoFactorEnabled;
  final bool biometricEnabled;
  final String backupEmail;
  final bool locationTracking;
  final bool suspiciousActivityAlerts;

  SecuritySettings({
    this.passwordLastChanged = const DateTime(2023, 1, 1),
    this.lastLogin = const DateTime(2023, 1, 1),
    this.trustedDevices = 0,
    this.activeSessions = 0,
    this.twoFactorEnabled = false,
    this.biometricEnabled = false,
    this.backupEmail = '',
    this.locationTracking = false,
    this.suspiciousActivityAlerts = false,
  });
}

class Device {
  final int id;
  final String name;
  final String type;
  final DateTime lastActive;
  final bool isCurrent;

  Device({
    required this.id,
    required this.name,
    required this.type,
    required this.lastActive,
    required this.isCurrent,
  });
}

class Session {
  final int id;
  final String device;
  final String location;
  final String ipAddress;
  final DateTime lastActive;
  final bool isCurrent;

  Session({
    required this.id,
    required this.device,
    required this.location,
    required this.ipAddress,
    required this.lastActive,
    required this.isCurrent,
  });
}