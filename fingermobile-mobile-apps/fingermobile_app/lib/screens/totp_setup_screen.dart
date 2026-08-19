import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:fingermobile_app/services/security_service.dart';
import 'package:fingermobile_app/models/member.dart';

class TotpSetupScreen extends StatefulWidget {
  final member member;

  const TotpSetupScreen({super.key, required this.member});

  @override
  State<TotpSetupScreen> createState() => _TotpSetupScreenState();
}

class _TotpSetupScreenState extends State<TotpSetupScreen> {
  final SecurityService _securityService = SecurityService();
  final TextEditingController _codeController = TextEditingController();
  
  bool _isLoading = false;
  bool _isSetupComplete = false;
  String? _errorMessage;
  String? _successMessage;
  String? _totpSecret;
  String? _totpUri;

  @override
  void initState() {
    super.initState();
    _enableTOTP();
  }

  Future<void> _enableTOTP() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final result = await _securityService.enableTOTP();
      
      if (result.isSuccess && result.data != null) {
        setState(() {
          _totpSecret = result.data!['secret'];
          _totpUri = result.data!['uri'];
        });
      } else {
        setState(() {
          _errorMessage = result.errorMessage ?? 'Failed to enable TOTP';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Error enabling TOTP: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _verifyTOTP() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _successMessage = null;
    });

    try {
      final result = await _securityService.verifyTOTP(_codeController.text.trim());
      
      if (result.isSuccess) {
        setState(() {
          _successMessage = 'TOTP verified successfully!';
          _isSetupComplete = true;
        });
        
        // Navigate back after a delay
        Future.delayed(const Duration(seconds: 2), () {
          if (mounted) {
            Navigator.pop(context, true);
          }
        });
      } else {
        setState(() {
          _errorMessage = result.errorMessage ?? 'Failed to verify TOTP code';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Error verifying TOTP: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _codeController.dispose();
    _securityService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Authenticator App Setup'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _buildContent(),
      ),
    );
  }

  Widget _buildContent() {
    if (_errorMessage != null) {
      return Column(
        children: [
          Text(_errorMessage!, style: const TextStyle(color: Colors.red)),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _enableTOTP,
            child: const Text('Retry'),
          ),
        ],
      );
    }

    if (_totpUri == null || _totpSecret == null) {
      return const Center(
        child: Text('Failed to load TOTP setup information'),
      );
    }

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Set up your Authenticator App',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          const Text(
            'Scan this QR code with your authenticator app (like Google Authenticator or Authy):',
          ),
          const SizedBox(height: 24),
          Center(
            child: QrImageView(
              data: _totpUri!,
              version: QrVersions.auto,
              size: 200.0,
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Or enter this code manually in your authenticator app:',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey),
              borderRadius: BorderRadius.circular(4),
            ),
            child: SelectableText(
              _totpSecret!,
              style: const TextStyle(
                fontFamily: 'monospace',
                fontSize: 16,
              ),
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Enter the 6-digit code from your authenticator app:',
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _codeController,
            decoration: const InputDecoration(
              labelText: '6-digit code',
              border: OutlineInputBorder(),
            ),
            keyboardType: TextInputType.number,
          ),
          const SizedBox(height: 16),
          if (_successMessage != null)
            Text(_successMessage!, style: const TextStyle(color: Colors.green)),
          if (_errorMessage != null)
            Text(_errorMessage!, style: const TextStyle(color: Colors.red)),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _isSetupComplete ? null : _verifyTOTP,
              child: _isSetupComplete
                  ? const Text('Setup Complete')
                  : const Text('Verify Code'),
            ),
          ),
        ],
      ),
    );
  }
}