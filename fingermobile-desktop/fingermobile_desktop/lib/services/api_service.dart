import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService extends ChangeNotifier {
  static const String _baseUrl = 'http://localhost:3000/api'; // Update with your backend URL
  String? _authToken;

  ApiService() {
    _loadAuthToken();
  }

  Future<void> _loadAuthToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    _authToken = prefs.getString('auth_token');
    notifyListeners();
  }

  Future<void> setAuthToken(String token) async {
    _authToken = token;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
    notifyListeners();
  }

  Future<String?> getAuthToken() async {
    if (_authToken == null) {
      SharedPreferences prefs = await SharedPreferences.getInstance();
      _authToken = prefs.getString('auth_token');
    }
    return _authToken;
  }

  Future<void> removeAuthToken() async {
    _authToken = null;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
    notifyListeners();
  }

  Map<String, String> _getHeaders() {
    Map<String, String> headers = {
      'Content-Type': 'application/json',
    };
    if (_authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }
    return headers;
  }

  // Generic method to handle API requests
  Future<http.Response> _makeRequest({
    required String endpoint,
    required String method,
    dynamic body,
    Map<String, String>? additionalHeaders,
  }) async {
    final uri = Uri.parse('$_baseUrl$endpoint');
    final headers = _getHeaders();

    if (additionalHeaders != null) {
      headers.addAll(additionalHeaders);
    }

    http.Response response;

    switch (method) {
      case 'GET':
        response = await http.get(uri, headers: headers);
        break;
      case 'POST':
        response = await http.post(
          uri,
          headers: headers,
          body: body != null ? jsonEncode(body) : null,
        );
        break;
      case 'PUT':
        response = await http.put(
          uri,
          headers: headers,
          body: body != null ? jsonEncode(body) : null,
        );
        break;
      case 'DELETE':
        response = await http.delete(uri, headers: headers);
        break;
      default:
        throw Exception('HTTP method $method not supported');
    }

    // Handle authentication errors
    if (response.statusCode == 401) {
      await removeAuthToken();
    }

    return response;
  }

  // Authentication methods
  Future<http.Response> login(String email, String password) async {
    final response = await _makeRequest(
      endpoint: '/auth/login',
      method: 'POST',
      body: {
        'email': email,
        'password': password,
      },
    );
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await setAuthToken(data['token']);
    }
    return response;
  }

  Future<http.Response> register(String name, String email, String password) async {
    return await _makeRequest(
      endpoint: '/auth/register',
      method: 'POST',
      body: {
        'name': name,
        'email': email,
        'password': password,
      },
    );
  }

  Future<http.Response> logout() async {
    final response = await _makeRequest(
      endpoint: '/auth/logout',
      method: 'POST',
    );
    if (response.statusCode == 200) {
      await removeAuthToken();
    }
    return response;
  }

  // Member methods
  Future<http.Response> getMemberProfile() async {
    return await _makeRequest(
      endpoint: '/member/profile',
      method: 'GET',
    );
  }

  Future<http.Response> updateMemberProfile(Map<String, dynamic> memberData) async {
    return await _makeRequest(
      endpoint: '/member/profile',
      method: 'PUT',
      body: memberData,
    );
  }

  // Content methods
  Future<http.Response> getPosts() async {
    return await _makeRequest(
      endpoint: '/content/posts',
      method: 'GET',
    );
  }

  Future<http.Response> createPost(Map<String, dynamic> postData) async {
    return await _makeRequest(
      endpoint: '/content/posts',
      method: 'POST',
      body: postData,
    );
  }

  Future<http.Response> getContentById(String id) async {
    return await _makeRequest(
      endpoint: '/content/$id',
      method: 'GET',
    );
  }

  // Marketplace methods
  Future<http.Response> getMarketplaceItems() async {
    return await _makeRequest(
      endpoint: '/marketplace/items',
      method: 'GET',
    );
  }

  Future<http.Response> getWalletInfo() async {
    return await _makeRequest(
      endpoint: '/wallet/info',
      method: 'GET',
    );
  }

  // Notifications
  Future<http.Response> getNotifications() async {
    return await _makeRequest(
      endpoint: '/notifications',
      method: 'GET',
    );
  }

  Future<http.Response> markNotificationAsRead(String notificationId) async {
    return await _makeRequest(
      endpoint: '/notifications/$notificationId/read',
      method: 'POST',
    );
  }

  // Admin methods
  Future<http.Response> getAdminDashboardData() async {
    return await _makeRequest(
      endpoint: '/admin/dashboard',
      method: 'GET',
    );
  }
}