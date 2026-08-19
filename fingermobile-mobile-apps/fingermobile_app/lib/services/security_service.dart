import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:local_auth/local_auth.dart';
import 'package:local_auth_android/local_auth_android.dart';
import 'package:local_auth_ios/local_auth_ios.dart';
import 'package:fingermobile_app/models/member.dart';
import 'package:fingermobile_app/models/connected_device.dart';

class SecurityService {
  static const String _baseUrl = 'http://localhost:3001/api';
  final http.Client _client = http.Client();
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();
  final LocalAuthentication _localAuth = LocalAuthentication();
  String? _token;

  void setToken(String? token) {
    _token = token;
  }

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        if (_token != null) 'Authorization': 'Bearer $_token',
      };

  // Send phone verification code - not implemented in our backend yet
  Future<ApiResponse> sendPhoneVerification(String phoneNumber) async {
    try {
      // This endpoint doesn't exist in our current backend implementation
      // Would need to be added to auth.js route file
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/send-phone-verification'),
        headers: _headers,
        body: jsonEncode({'phone_number': phoneNumber}),
      );

      if (response.statusCode == 200) {
        return ApiResponse(success: true);
      } else {
        final errorData = jsonDecode(response.body);
        return ApiResponse(
          success: false,
          errorMessage: errorData['message'] ?? 'Failed to send verification code',
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        errorMessage: 'Network error: $e',
      );
    }
  }

  // Verify phone number with code - not implemented in our backend yet
  Future<ApiResponse> verifyPhoneNumber(String phoneNumber, String code) async {
    try {
      // This endpoint doesn't exist in our current backend implementation
      // Would need to be added to auth.js route file
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/verify-phone'),
        headers: _headers,
        body: jsonEncode({
          'phone_number': phoneNumber,
          'code': code,
        }),
      );

      if (response.statusCode == 200) {
        return ApiResponse(success: true);
      } else {
        final errorData = jsonDecode(response.body);
        return ApiResponse(
          success: false,
          errorMessage: errorData['message'] ?? 'Failed to verify phone number',
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        errorMessage: 'Network error: $e',
      );
    }
  }

  // Enable two-factor authentication - not implemented in our backend yet
  Future<ApiResponse> enableTwoFactor(String method, String? phoneNumber, String? email) async {
    try {
      // This endpoint doesn't exist in our current backend implementation
      // Would need to be added to auth.js route file
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/enable-2fa'),
        headers: _headers,
        body: jsonEncode({'method': method}),
      );

      if (response.statusCode == 200) {
        return ApiResponse(success: true);
      } else {
        final errorData = jsonDecode(response.body);
        return ApiResponse(
          success: false,
          errorMessage: errorData['message'] ?? 'Failed to enable 2FA',
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        errorMessage: 'Network error: $e',
      );
    }
  }

  // Verify two-factor authentication code - not implemented in our backend yet
  Future<SecurityResponse> verifyTwoFactor(String code) async {
    try {
      // This endpoint doesn't exist in our current backend implementation
      // Would need to be added to auth.js route file
      final url = Uri.parse('$_baseUrl/auth/verify-2fa');
      final token = await _secureStorage.read(key: 'auth_token');
      
      final response = await _client.post(
        url,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'code': code}),
      );
      
      return _handleResponse(response);
    } catch (e) {
      return SecurityResponse.error('Failed to verify 2FA: $e');
    }
  }

  // Enable multi-factor authentication - not implemented in our backend yet
  Future<ApiResponse> enableMultiFactor(List<String> methods) async {
    try {
      // This endpoint doesn't exist in our current backend implementation
      // Would need to be added to auth.js route file
      final response = await http.post(
        Uri.parse('$_baseUrl/security/enable-mfa'),
        headers: _headers,
        body: jsonEncode({'methods': methods}),
      );

      if (response.statusCode == 200) {
        return ApiResponse(success: true);
      } else {
        final errorData = jsonDecode(response.body);
        return ApiResponse(
          success: false,
          errorMessage: errorData['message'] ?? 'Failed to enable MFA',
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        errorMessage: 'Network error: $e',
      );
    }
  }

  // Verify multi-factor authentication codes - not implemented in our backend yet
  Future<SecurityResponse> verifyMultiFactor(
      Map<String, String> codes) async {
    try {
      // This endpoint doesn't exist in our current backend implementation
      // Would need to be added to auth.js route file
      final url = Uri.parse('$_baseUrl/security/verify-mfa');
      final token = await _secureStorage.read(key: 'auth_token');
      
      final response = await _client.post(
        url,
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: jsonEncode({'codes': codes}),
      );
      
      return _handleResponse(response);
    } catch (e) {
      return SecurityResponse.error('Failed to verify MFA: $e');
    }
  }

  // Generate backup codes - not implemented in our backend yet
  Future<ApiResponse<Map<String, dynamic>>> generateBackupCodes() async {
    try {
      // This endpoint doesn't exist in our current backend implementation
      // Would need to be added to auth.js route file
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/generate-backup-codes'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return ApiResponse(success: true, data: data);
      } else {
        final errorData = jsonDecode(response.body);
        return ApiResponse(
          success: false,
          errorMessage: errorData['message'] ?? 'Failed to generate backup codes',
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        errorMessage: 'Network error: $e',
      );
    }
  }

  // Check if biometric authentication is available
  Future<bool> isBiometricAvailable() async {
    try {
      return await _localAuth.canCheckBiometrics || await _localAuth.isDeviceSupported();
    } catch (e) {
      return false;
    }
  }

  // Get available biometric types
  Future<List<BiometricType>> getAvailableBiometrics() async {
    try {
      return await _localAuth.getAvailableBiometrics();
    } catch (e) {
      return [];
    }
  }

  // Authenticate with biometrics
  Future<ApiResponse> authenticateWithBiometrics() async {
    try {
      final LocalAuthentication auth = LocalAuthentication();
      
      // Check if biometric authentication is available
      final bool canAuthenticateWithBiometrics = await auth.canCheckBiometrics;
      final bool isDeviceSupported = await auth.isDeviceSupported();
      
      if (!canAuthenticateWithBiometrics || !isDeviceSupported) {
        return ApiResponse(
          success: false,
          errorMessage: 'Biometric authentication is not available on this device',
        );
      }
      
      // Get available biometric types
      final List<BiometricType> availableBiometrics = await auth.getAvailableBiometrics();
      
      if (availableBiometrics.isEmpty) {
        return ApiResponse(
          success: false,
          errorMessage: 'No biometric sensors available',
        );
      }
      
      // Authenticate with biometrics
      final bool didAuthenticate = await auth.authenticate(
        localizedReason: 'Please authenticate to access your account',
        options: const AuthenticationOptions(
          stickyAuth: true,
          biometricOnly: true,
        ),
      );
      
      if (didAuthenticate) {
        return ApiResponse(success: true);
      } else {
        return ApiResponse(
          success: false,
          errorMessage: 'Biometric authentication failed',
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        errorMessage: 'Biometric authentication error: $e',
      );
    }
  }

  // Enroll biometric - using FIC biometric endpoint
  Future<ApiResponse> enrollBiometric(String biometricType) async {
    try {
      // Using the FIC biometric registration endpoint
      final response = await http.post(
        Uri.parse('$_baseUrl/fic/biometric/register'),
        headers: _headers,
        body: jsonEncode({
          'memberId': 'current_user', // Would need to get actual member ID
          'biometricType': biometricType
        }),
      );

      if (response.statusCode == 200) {
        return ApiResponse(success: true);
      } else {
        final errorData = jsonDecode(response.body);
        return ApiResponse(
          success: false,
          errorMessage: errorData['message'] ?? 'Failed to enroll biometric',
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        errorMessage: 'Network error: $e',
      );
    }
  }

  // TOTP (Time-based One-Time Password) methods - not implemented in our backend yet
  
  // Enable TOTP authentication - not implemented in our backend yet
  Future<ApiResponse<Map<String, dynamic>>> enableTOTP() async {
    try {
      // This endpoint doesn't exist in our current backend implementation
      // Would need to be added to auth.js route file
      final response = await _client.post(
        Uri.parse('$_baseUrl/auth/totp/enable'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return ApiResponse(success: true, data: data);
      } else {
        final errorData = jsonDecode(response.body);
        return ApiResponse(
          success: false,
          errorMessage: errorData['message'] ?? 'Failed to enable TOTP',
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        errorMessage: 'Network error: $e',
      );
    }
  }

  // Verify TOTP code - not implemented in our backend yet
  Future<ApiResponse> verifyTOTP(String code) async {
    try {
      // This endpoint doesn't exist in our current backend implementation
      // Would need to be added to auth.js route file
      final response = await _client.post(
        Uri.parse('$_baseUrl/auth/totp/verify'),
        headers: _headers,
        body: jsonEncode({'code': code}),
      );

      if (response.statusCode == 200) {
        return ApiResponse(success: true);
      } else {
        final errorData = jsonDecode(response.body);
        return ApiResponse(
          success: false,
          errorMessage: errorData['message'] ?? 'Failed to verify TOTP code',
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        errorMessage: 'Network error: $e',
      );
    }
  }

  // Disable TOTP authentication - not implemented in our backend yet
  Future<ApiResponse> disableTOTP(String code) async {
    try {
      // This endpoint doesn't exist in our current backend implementation
      // Would need to be added to auth.js route file
      final response = await _client.post(
        Uri.parse('$_baseUrl/auth/totp/disable'),
        headers: _headers,
        body: jsonEncode({'code': code}),
      );

      if (response.statusCode == 200) {
        return ApiResponse(success: true);
      } else {
        final errorData = jsonDecode(response.body);
        return ApiResponse(
          success: false,
          errorMessage: errorData['message'] ?? 'Failed to disable TOTP',
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        errorMessage: 'Network error: $e',
      );
    }
  }

  // Connected Devices methods - not implemented in our backend yet
  Future<ApiResponse<List<ConnectedDevice>>> fetchConnectedDevices() async {
    try {
      // This endpoint doesn't exist in our current backend implementation
      // Would need to be added to auth.js or a new device management route file
      final response = await _client.get(
        Uri.parse('$_baseUrl/security/connected-devices'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final List<dynamic> deviceJson = jsonDecode(response.body);
        final List<ConnectedDevice> devices = deviceJson
            .map((json) => ConnectedDevice.fromJson(json))
            .toList();
        return ApiResponse(success: true, data: devices);
      } else {
        final errorData = jsonDecode(response.body);
        return ApiResponse(
          success: false,
          errorMessage:
              errorData['message'] ?? 'Failed to fetch connected devices',
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        errorMessage: 'Network error: $e',
      );
    }
  }

  Future<ApiResponse> disconnectDevice(String deviceId) async {
    try {
      // This endpoint doesn't exist in our current backend implementation
      // Would need to be added to auth.js or a new device management route file
      final response = await _client.post(
        Uri.parse('$_baseUrl/security/disconnect-device'),
        headers: _headers,
        body: jsonEncode({'deviceId': deviceId}),
      );

      if (response.statusCode == 200) {
        return ApiResponse(success: true);
      } else {
        final errorData = jsonDecode(response.body);
        return ApiResponse(
          success: false,
          errorMessage: errorData['message'] ?? 'Failed to disconnect device',
        );
      }
    } catch (e) {
      return ApiResponse(
        success: false,
        errorMessage: 'Network error: $e',
      );
    }
  }

  // Handle HTTP response
  SecurityResponse _handleResponse(http.Response response) {
    try {
      final data = jsonDecode(response.body);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return SecurityResponse.success(data);
      } else {
        final message = data['message'] ?? 'Unknown error occurred';
        return SecurityResponse.error(message, statusCode: response.statusCode);
      }
    } catch (e) {
      return SecurityResponse.error('Invalid response format', statusCode: response.statusCode);
    }
  }

  // Close the HTTP client
  void dispose() {
    _client.close();
  }
}

class ApiResponse<T> {
  final bool success;
  final String? errorMessage;
  final T? data;

  ApiResponse({
    required this.success,
    this.errorMessage,
    this.data,
  });

  bool get hasError => !success;

  bool get isSuccess => success;
}

class SecurityResponse {
  final bool isSuccess;
  final dynamic data;
  final String? errorMessage;
  final int? statusCode;

  SecurityResponse.success(this.data)
      : isSuccess = true,
        errorMessage = null,
        statusCode = null;

  SecurityResponse.error(this.errorMessage, {this.statusCode, this.data})
      : isSuccess = false;

  bool get hasError => !isSuccess;
}