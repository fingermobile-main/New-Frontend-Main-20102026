import 'package:flutter/foundation.dart';
import 'api_service.dart';

class UseAuth extends ChangeNotifier {
  final ApiService _ApiService;
  bool _isAuthenticated = false;
  String? _currentMemberEmail;

  UseAuth({ApiService? ApiService}) : _ApiService = ApiService ?? ApiService() {
    _checkAuthStatus();
  }

  bool get isAuthenticated => _isAuthenticated;
  String? get currentMemberEmail => _currentMemberEmail;

  Future<void> _checkAuthStatus() async {
    String? token = await _ApiService.getAuthToken();
    _isAuthenticated = token != null && token.isNotEmpty;
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    try {
      final response = await _ApiService.login(email, password);
      
      if (response.statusCode == 200) {
        _isAuthenticated = true;
        _currentMemberEmail = email;
        notifyListeners();
        return true;
      } else {
        return false;
      }
    } catch (e) {
      debugPrint('Login error: $e');
      return false;
    }
  }

  Future<bool> register(String name, String email, String password) async {
    try {
      final response = await _ApiService.register(name, email, password);
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        // Auto-login after successful registration
        return await login(email, password);
      } else {
        return false;
      }
    } catch (e) {
      debugPrint('Registration error: $e');
      return false;
    }
  }

  Future<void> logout() async {
    await _ApiService.logout();
    _isAuthenticated = false;
    _currentMemberEmail = null;
    notifyListeners();
  }

  Future<bool> validateToken() async {
    // In a real implementation, you would call an API endpoint to validate the token
    // For now, just check if we have a token
    String? token = await _ApiService.getAuthToken();
    bool isValid = token != null && token.isNotEmpty;
    
    if (!isValid) {
      _isAuthenticated = false;
      _currentMemberEmail = null;
      notifyListeners();
    }
    
    return isValid;
  }
}