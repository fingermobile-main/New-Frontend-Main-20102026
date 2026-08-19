import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  // Base URL for the backend server - Updated to match our backend setup on port 5001
  static const String baseUrl = 'http://localhost:5001/api';

  // Headers for API requests
  static Map<String, String> get headers {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  // Authentication token storage using flutter_secure_storage
  static final FlutterSecureStorage _storage = FlutterSecureStorage();
  
  static Future<String?> get authToken async {
    return await _storage.read(key: 'auth_token');
  }

  // Set authentication token
  static Future<void> setAuthToken(String? token) async {
    if (token != null) {
      await _storage.write(key: 'auth_token', value: token);
    } else {
      await _storage.delete(key: 'auth_token');
    }
  }

  // Get authentication headers
  static Future<Map<String, String>> get authHeaders async {
    Map<String, String> authHeaders = {...headers};
    String? token = await authToken;
    if (token != null) {
      authHeaders['Authorization'] = 'Bearer $token';
    }
    return authHeaders;
  }

  // Logout method
  static Future<void> logout() async {
    await _storage.delete(key: 'auth_token');
  }

  // Health check endpoint
  static Future<bool> checkHealth() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/health'),
        headers: headers,
      );
      return response.statusCode == 200;
    } catch (e) {
      print('Health check failed: $e');
      return false;
    }
  }

  // Authentication endpoints
  static Future<Map<String, dynamic>?> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: headers,
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        await setAuthToken(data['token']);
        return data;
      } else {
        print('Login failed: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('Login error: $e');
      return null;
    }
  }

  static Future<Map<String, dynamic>?> register(
    String email,
    String password,
    String username,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: headers,
        body: jsonEncode({
          'email': email,
          'password': password,
          'username': username,
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body);
        await setAuthToken(data['token']);
        return data;
      } else {
        print('Registration failed: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('Registration error: $e');
      return null;
    }
  }

  // Generic GET request
  static Future<dynamic> get(String endpoint) async {
    try {
      final headers = await authHeaders;
      final response = await http.get(
        Uri.parse('$baseUrl$endpoint'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        print('GET request failed: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('GET request error: $e');
      return null;
    }
  }

  // Generic POST request
  static Future<dynamic> post(String endpoint, dynamic data) async {
    try {
      final headers = await authHeaders;
      final response = await http.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: headers,
        body: jsonEncode(data),
      );

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return json.decode(response.body);
      } else {
        print('POST request failed: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('POST request error: $e');
      return null;
    }
  }

  // Generic PUT request
  static Future<dynamic> put(String endpoint, dynamic data) async {
    try {
      final headers = await authHeaders;
      final response = await http.put(
        Uri.parse('$baseUrl$endpoint'),
        headers: headers,
        body: jsonEncode(data),
      );

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return json.decode(response.body);
      } else {
        print('PUT request failed: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('PUT request error: $e');
      return null;
    }
  }

  // Generic DELETE request
  static Future<bool> delete(String endpoint) async {
    try {
      final headers = await authHeaders;
      final response = await http.delete(
        Uri.parse('$baseUrl$endpoint'),
        headers: headers,
      );

      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (e) {
      print('DELETE request error: $e');
      return false;
    }
  }

  // Upload file
  static Future<Map<String, dynamic>?> uploadFile(String endpoint, String filePath) async {
    try {
      final uri = Uri.parse('$baseUrl$endpoint');
      final request = http.MultipartRequest('POST', uri);
      
      final token = await authToken;
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }
      
      request.files.add(await http.MultipartFile.fromPath('file', filePath));
      
      final response = await request.send();
      final responseString = await response.stream.bytesToString();
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return json.decode(responseString);
      } else {
        print('File upload failed: ${response.statusCode} - $responseString');
        return null;
      }
    } catch (e) {
      print('File upload error: $e');
      return null;
    }
  }

  // Get member profile
  static Future<Map<String, dynamic>?> getMemberProfile() async {
    return await get('/members/profile');
  }

  // Get feed posts
  static Future<List<dynamic>?> getFeed() async {
    final response = await get('/posts/feed');
    if (response != null && response is List) {
      return response.cast<Map<String, dynamic>>();
    }
    return null;
  }

  // Create a post
  static Future<Map<String, dynamic>?> createPost(Map<String, dynamic> postData) async {
    return await post('/posts', postData);
  }

  // Get notifications
  static Future<List<dynamic>?> getNotifications() async {
    final response = await get('/notifications');
    if (response != null && response is List) {
      return response.cast<Map<String, dynamic>>();
    }
    return null;
  }

  // Mark notification as read
  static Future<bool> markNotificationAsRead(String notificationId) async {
    return await put('/notifications/$notificationId/read', {});
  }

  // Get user's friends
  static Future<List<dynamic>?> getFriends() async {
    final response = await get('/friends');
    if (response != null && response is List) {
      return response.cast<Map<String, dynamic>>();
    }
    return null;
  }

  // Send friend request
  static Future<bool> sendFriendRequest(int userId) async {
    final result = await post('/friends/request', {'userId': userId});
    return result != null;
  }

  // Accept friend request
  static Future<bool> acceptFriendRequest(int requestId) async {
    final result = await post('/friends/accept', {'requestId': requestId});
    return result != null;
  }

  // Get messages for a conversation
  static Future<List<dynamic>?> getMessages(int conversationId) async {
    final response = await get('/conversations/$conversationId/messages');
    if (response != null && response is List) {
      return response.cast<Map<String, dynamic>>();
    }
    return null;
  }

  // Send message
  static Future<Map<String, dynamic>?> sendMessage(int conversationId, String content) async {
    return await post('/conversations/$conversationId/messages', {
      'content': content,
    });
  }

  // Get trending topics
  static Future<List<dynamic>?> getTrendingTopics() async {
    final response = await get('/trending');
    if (response != null && response is List) {
      return response.cast<Map<String, dynamic>>();
    }
    return null;
  }

  // Get analytics data for a user
  static Future<Map<String, dynamic>?> getUserAnalytics() async {
    return await get('/analytics/user');
  }

  // Update user profile
  static Future<Map<String, dynamic>?> updateUserProfile(Map<String, dynamic> profileData) async {
    return await put('/members/profile', profileData);
  }

  // Get user's posts
  static Future<List<dynamic>?> getUserPosts(int userId) async {
    final response = await get('/members/$userId/posts');
    if (response != null && response is List) {
      return response.cast<Map<String, dynamic>>();
    }
    return null;
  }

  // Search users
  static Future<List<dynamic>?> searchUsers(String query) async {
    final response = await get('/search/users?q=$query');
    if (response != null && response is List) {
      return response.cast<Map<String, dynamic>>();
    }
    return null;
  }

  // Like a post
  static Future<bool> likePost(int postId) async {
    final result = await post('/posts/$postId/like', {});
    return result != null;
  }

  // Comment on a post
  static Future<Map<String, dynamic>?> commentOnPost(int postId, String content) async {
    return await post('/posts/$postId/comments', {
      'content': content,
    });
  }

  // Get post comments
  static Future<List<dynamic>?> getPostComments(int postId) async {
    final response = await get('/posts/$postId/comments');
    if (response != null && response is List) {
      return response.cast<Map<String, dynamic>>();
    }
    return null;
  }
}