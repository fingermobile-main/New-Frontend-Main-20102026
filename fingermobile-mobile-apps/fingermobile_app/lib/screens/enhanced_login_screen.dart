import 'package:flutter/material.dart';
import 'package:fingermobile_app/services/api_service.dart';
import 'package:fingermobile_app/services/security_service.dart';
import 'package:fingermobile_app/models/member.dart';
import 'package:fingermobile_app/screens/home_screen.dart';
import 'package:fingermobile_app/screens/register_screen.dart';

class EnhancedLoginScreen extends StatefulWidget {
  const EnhancedLoginScreen({super.key});

  @override
  State<EnhancedLoginScreen> createState() => _EnhancedLoginScreenState();
}

class _EnhancedLoginScreenState extends State<EnhancedLoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _phoneController = TextEditingController();
  final _verificationCodeController = TextEditingController();
  final _twoFactorCodeController = TextEditingController();
  
  bool _isLoading = false;
  String? _errorMessage;
  
  // Authentication steps
  AuthStep _currentStep = AuthStep.login;
  
  final ApiService _ApiService = ApiService();
  final SecurityService _securityService = SecurityService();
  
  // member data
  member? _member;
  String? _token;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _phoneController.dispose();
    _verificationCodeController.dispose();
    _twoFactorCodeController.dispose();
    _ApiService.dispose();
    _securityService.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      try {
        final response = await _ApiService.loginmember(
          _emailController.text.trim(),
          _passwordController.text,
        );

        if (response.isSuccess) {
          // Save token and member data
          _token = response.data['token'];
          final memberJson = response.data['member'];
          _member = member.fromJson(memberJson);
          
          // Set token in security service
          _securityService.setToken(_token);
          
          // Check what authentication steps are required
          if (!_member!.phoneVerified) {
            // Send phone verification
            await _securityService.sendPhoneVerification(
                _member!.phoneNumber ?? _phoneController.text.trim());
            setState(() {
              _currentStep = AuthStep.phoneVerification;
            });
          } else if (_member!.twoFactorEnabled) {
            setState(() {
              _currentStep = AuthStep.twoFactor;
            });
          } else if (_member!.multiFactorEnabled) {
            setState(() {
              _currentStep = AuthStep.multiFactor;
            });
          } else if (_member!.biometricEnrolled) {
            setState(() {
              _currentStep = AuthStep.biometric;
            });
          } else {
            // Complete login
            if (mounted) {
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(
                  builder: (context) => const HomeScreen(),
                ),
              );
            }
          }
        } else {
          setState(() {
            _errorMessage = response.errorMessage;
          });
        }
      } catch (e) {
        setState(() {
          _errorMessage = 'An unexpected error occurred. Please try again.';
        });
      } finally {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _verifyPhone() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final result = await _securityService.verifyPhoneNumber(
          _member!.phoneNumber ?? _phoneController.text.trim(),
          _verificationCodeController.text);

      if (result.isSuccess) {
        // Update member with phone verified
        setState(() {
          _member = member(
            id: _member!.id,
            email: _member!.email,
            name: _member!.name,
            avatar: _member!.avatar,
            createdAt: _member!.createdAt,
            updatedAt: _member!.updatedAt,
            phoneNumber: _member!.phoneNumber,
            phoneVerified: true,
            twoFactorEnabled: _member!.twoFactorEnabled,
            twoFactorMethods: _member!.twoFactorMethods,
            multiFactorEnabled: _member!.multiFactorEnabled,
            mfaMethods: _member!.mfaMethods,
            biometricEnrolled: _member!.biometricEnrolled,
            faceIdEnabled: _member!.faceIdEnabled,
            fingerprintEnabled: _member!.fingerprintEnabled,
            backupCodes: _member!.backupCodes,
          );
        });

        // Check next step
        if (_member!.twoFactorEnabled) {
          setState(() {
            _currentStep = AuthStep.twoFactor;
          });
        } else if (_member!.multiFactorEnabled) {
          setState(() {
            _currentStep = AuthStep.multiFactor;
          });
        } else if (_member!.biometricEnrolled) {
          setState(() {
            _currentStep = AuthStep.biometric;
          });
        } else {
          // Complete login
          if (mounted) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => const HomeScreen(),
              ),
            );
          }
        }
      } else {
        setState(() {
          _errorMessage = result.errorMessage;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to verify phone number. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _verifyTwoFactor() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final result = await _securityService.verifyTwoFactor(
          _twoFactorCodeController.text);

      if (result.isSuccess) {
        // Check next step
        if (_member!.multiFactorEnabled) {
          setState(() {
            _currentStep = AuthStep.multiFactor;
          });
        } else if (_member!.biometricEnrolled) {
          setState(() {
            _currentStep = AuthStep.biometric;
          });
        } else {
          // Complete login
          if (mounted) {
            Navigator.pushReplacement(
              context,
              MaterialPageRoute(
                builder: (context) => const HomeScreen(),
              ),
            );
          }
        }
      } else {
        setState(() {
          _errorMessage = result.errorMessage;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to verify 2FA. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _authenticateWithBiometrics() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final result = await _securityService.authenticateWithBiometrics();

      if (result.isSuccess) {
        // Complete login
        if (mounted) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => const HomeScreen(),
            ),
          );
        }
      } else {
        setState(() {
          _errorMessage = result.errorMessage;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Biometric authentication failed. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Enhanced Login'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  'FingerMobile',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 32),

                // Login step
                if (_currentStep == AuthStep.login) ...[
                  if (_errorMessage != null)
                    Text(
                      _errorMessage!,
                      style: const TextStyle(color: Colors.red),
                    ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _emailController,
                    decoration: const InputDecoration(
                      labelText: 'Email',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your email';
                      }
                      if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                        return 'Please enter a valid email';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _passwordController,
                    decoration: const InputDecoration(
                      labelText: 'Password',
                      border: OutlineInputBorder(),
                    ),
                    obscureText: true,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your password';
                      }
                      if (value.length < 6) {
                        return 'Password must be at least 6 characters';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _phoneController,
                    decoration: const InputDecoration(
                      labelText: 'Phone Number (for verification)',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.phone,
                  ),
                  const SizedBox(height: 24),
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: _isLoading ? null : _login,
                      child: _isLoading
                          ? const CircularProgressIndicator()
                          : const Text('Login'),
                    ),
                  ),
                ],

                // Phone verification step
                if (_currentStep == AuthStep.phoneVerification) ...[
                  const Text(
                    'Phone Verification',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Enter the verification code sent to your phone number.',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  if (_errorMessage != null)
                    Text(
                      _errorMessage!,
                      style: const TextStyle(color: Colors.red),
                    ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _verificationCodeController,
                    decoration: const InputDecoration(
                      labelText: 'Verification Code',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter the verification code';
                      }
                      if (value.length != 6) {
                        return 'Code must be 6 digits';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: _isLoading
                              ? null
                              : () {
                                  setState(() {
                                    _currentStep = AuthStep.login;
                                  });
                                },
                          child: const Text('Back'),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _verifyPhone,
                          child: _isLoading
                              ? const CircularProgressIndicator()
                              : const Text('Verify Phone'),
                        ),
                      ),
                    ],
                  ),
                ],

                // Two-factor authentication step
                if (_currentStep == AuthStep.twoFactor) ...[
                  const Text(
                    'Two-Factor Authentication',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Enter the code from your authenticator app or SMS.',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  if (_errorMessage != null)
                    Text(
                      _errorMessage!,
                      style: const TextStyle(color: Colors.red),
                    ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _twoFactorCodeController,
                    decoration: const InputDecoration(
                      labelText: '2FA Code',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.number,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter the 2FA code';
                      }
                      if (value.length != 6) {
                        return 'Code must be 6 digits';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: _isLoading
                              ? null
                              : () {
                                  setState(() {
                                    _currentStep = AuthStep.phoneVerification;
                                  });
                                },
                          child: const Text('Back'),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _verifyTwoFactor,
                          child: _isLoading
                              ? const CircularProgressIndicator()
                              : const Text('Verify 2FA'),
                        ),
                      ),
                    ],
                  ),
                ],

                // Multi-factor authentication step
                if (_currentStep == AuthStep.multiFactor) ...[
                  const Text(
                    'Multi-Factor Authentication',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Additional authentication factors required.',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  if (_errorMessage != null)
                    Text(
                      _errorMessage!,
                      style: const TextStyle(color: Colors.red),
                    ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: _isLoading
                              ? null
                              : () {
                                  setState(() {
                                    _currentStep = _member!.twoFactorEnabled
                                        ? AuthStep.twoFactor
                                        : AuthStep.phoneVerification;
                                  });
                                },
                          child: const Text('Back'),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: _isLoading
                              ? null
                              : () {
                                  // For demo purposes, we'll skip MFA and go to biometric
                                  setState(() {
                                    _currentStep = AuthStep.biometric;
                                  });
                                },
                          child: const Text('Continue'),
                        ),
                      ),
                    ],
                  ),
                ],

                // Biometric authentication step
                if (_currentStep == AuthStep.biometric) ...[
                  const Text(
                    'Biometric Authentication',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Use Face ID or Fingerprint to complete authentication.',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  if (_errorMessage != null)
                    Text(
                      _errorMessage!,
                      style: const TextStyle(color: Colors.red),
                    ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: _isLoading
                              ? null
                              : () {
                                  setState(() {
                                    _currentStep = _member!.multiFactorEnabled
                                        ? AuthStep.multiFactor
                                        : _member!.twoFactorEnabled
                                            ? AuthStep.twoFactor
                                            : AuthStep.phoneVerification;
                                  });
                                },
                          child: const Text('Back'),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: ElevatedButton(
                          onPressed:
                              _isLoading ? null : _authenticateWithBiometrics,
                          child: _isLoading
                              ? const CircularProgressIndicator()
                              : const Text('Authenticate'),
                        ),
                      ),
                    ],
                  ),
                ],

                const SizedBox(height: 16),
                TextButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => RegisterScreen(
                          onRegistered: () {
                            // Go back to login screen after successful registration
                            Navigator.pop(context);
                            // Show a snackbar or dialog indicating successful registration
                            if (mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text(
                                      'Registration successful! Please login.'),
                                ),
                              );
                            }
                          },
                        ),
                      ),
                    );
                  },
                  child: const Text('Don\'t have an account? Register'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

enum AuthStep {
  login,
  phoneVerification,
  twoFactor,
  multiFactor,
  biometric,
}