import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_service.dart'; // Import the API service to use the auth token

// Define the member model directly in this file since the import was failing
class Member {
  final int id;
  final String name;
  final String email;
  final String? avatar;
  final DateTime createdAt;
  final String? bio;
  final String? joinDate;
  final String? location;

  Member({
    required this.id,
    required this.name,
    required this.email,
    this.avatar,
    required this.createdAt,
    this.bio,
    this.joinDate,
    this.location,
  });

  factory Member.fromJson(Map<String, dynamic> json) {
    return Member(
      id: int.tryParse(json['id'].toString()) ?? 0,
      name: json['name'] ?? json['full_name'] ?? 'Unknown',
      email: json['email'] ?? '',
      avatar: json['avatar']?.toString(),
      createdAt: DateTime.parse(json['created_at']?.toString() ?? DateTime.now().toIso8601String()),
      bio: json['bio']?.toString(),
      joinDate: json['join_date']?.toString() ?? json['created_at']?.toString(),
      location: json['location']?.toString(),
    );
  }
}

class ProfileService {
  // Use the same base URL as in ApiService
  static const String _baseUrl = 'http://localhost:3001/api';
  
  // Get profile data from the backend API
  Future<Member> getProfile(String? memberId) async {
    try {
      // Use the same headers as ApiService but with authentication
      final headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        if (ApiService._authToken != null) 'Authorization': 'Bearer ${ApiService._authToken}',
      };

      // If no member ID is provided, get the current member's profile
      String url;
      if (memberId == null) {
        url = '$_baseUrl/auth/profile';
      } else {
        url = '$_baseUrl/members/$memberId/profile';
      }

      final response = await http.get(
        Uri.parse(url),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body)['profile'] ?? json.decode(response.body);
        return Member.fromJson(data);
      } else {
        print('Failed to load profile: ${response.statusCode} - ${response.body}');
        // Return a default profile in case of error
        return Member(
          id: int.tryParse(memberId ?? '0') ?? 0,
          name: 'User',
          email: 'user@example.com',
          avatar: 'https://via.placeholder.com/150',
          createdAt: DateTime.now(),
          bio: 'Default bio',
          joinDate: DateTime.now().toString(),
          location: 'Unknown',
        );
      }
    } catch (e) {
      print('Error getting profile: $e');
      // Return a default profile in case of error
      return Member(
        id: int.tryParse(memberId ?? '0') ?? 0,
        name: 'User',
        email: 'user@example.com',
        avatar: 'https://via.placeholder.com/150',
        createdAt: DateTime.now(),
        bio: 'Default bio',
        joinDate: DateTime.now().toString(),
        location: 'Unknown',
      );
    }
  }
  
  // Update profile using the backend API
  Future<void> updateProfile(Map<String, dynamic> updates) async {
    try {
      final headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        if (ApiService._authToken != null) 'Authorization': 'Bearer ${ApiService._authToken}',
      };

      final response = await http.put(
        Uri.parse('$_baseUrl/members/profile'),
        headers: headers,
        body: json.encode(updates),
      );

      if (response.statusCode == 200) {
        print('Profile updated successfully');
      } else {
        print('Failed to update profile: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to update profile');
      }
    } catch (e) {
      print('Error updating profile: $e');
      throw Exception('Error updating profile');
    }
  }
  
  // Get member analytics
  Future<Map<String, dynamic>?> getMemberAnalytics(String? memberId) async {
    try {
      final headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        if (ApiService._authToken != null) 'Authorization': 'Bearer ${ApiService._authToken}',
      };

      String url;
      if (memberId == null) {
        url = '$_baseUrl/analytics/member';
      } else {
        url = '$_baseUrl/analytics/members/$memberId';
      }

      final response = await http.get(
        Uri.parse(url),
        headers: headers,
      );

      if (response.statusCode == 200) {
        return json.decode(response.body)['analytics'];
      } else {
        print('Failed to load analytics: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('Error getting analytics: $e');
      return null;
    }
  }
}
