import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_service.dart'; // Import the API service to use the auth token

// Define the search result model directly in this file since the import was failing
class SearchResult {
  final String id;
  final String title;
  final String type;
  final String? avatarUrl;
  final String? description;

  SearchResult({
    required this.id,
    required this.title,
    required this.type,
    this.avatarUrl,
    this.description,
  });

  factory SearchResult.fromJson(Map<String, dynamic> json) {
    return SearchResult(
      id: json['id']?.toString() ?? '',
      title: json['title'] ?? json['name'] ?? 'Untitled',
      type: json['type'] ?? 'unknown',
      avatarUrl: json['avatar']?.toString() ?? json['avatar_url']?.toString(),
      description: json['description'] ?? json['content']?.toString(),
    );
  }
}

class SearchService {
  // Use the same base URL as in ApiService
  static const String _baseUrl = 'http://localhost:3001/api';
  
  // Search using the backend API
  Future<List<SearchResult>> search(String query) async {
    try {
      // Use the same headers as ApiService but with authentication
      final headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        if (ApiService._authToken != null) 'Authorization': 'Bearer ${ApiService._authToken}',
      };

      final response = await http.get(
        Uri.parse('$_baseUrl/search?q=$query'),
        headers: headers,
      );

      if (response.statusCode == 200) {
        final responseBody = json.decode(response.body);
        final List<dynamic> data = responseBody['results'] as List? ?? [];
        
        return data.map((item) {
          return SearchResult(
            id: item['id']?.toString() ?? '',
            title: item['title'] ?? item['name'] ?? 'Untitled',
            type: item['type'] ?? 'unknown',
            avatarUrl: item['avatar'] ?? item['avatar_url'],
            description: item['description'] ?? item['content'] ?? item['email'],
          );
        }).toList();
      } else {
        print('Failed to search: ${response.statusCode} - ${response.body}');
        // Return empty list if search fails
        return [];
      }
    } catch (e) {
      print('Error during search: $e');
      // Return empty list in case of error
      return [];
    }
  }
  
  // Advanced search using the backend API
  Future<List<SearchResult>> advancedSearch(String query, {String? type, Map<String, dynamic>? filters}) async {
    try {
      final headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        if (ApiService._authToken != null) 'Authorization': 'Bearer ${ApiService._authToken}',
      };

      // Prepare the body for advanced search
      final body = {
        'query': query,
        if (filters != null) 'filters': filters,
        if (type != null) 'type': type,
      };

      final response = await http.post(
        Uri.parse('$_baseUrl/search/advanced'),
        headers: headers,
        body: json.encode(body),
      );

      if (response.statusCode == 200) {
        final responseBody = json.decode(response.body);
        final List<dynamic> data = responseBody['results'] as List? ?? [];
        
        return data.map((item) {
          return SearchResult(
            id: item['id']?.toString() ?? '',
            title: item['title'] ?? item['name'] ?? 'Untitled',
            type: item['type'] ?? 'unknown',
            avatarUrl: item['avatar'] ?? item['avatar_url'],
            description: item['description'] ?? item['content'] ?? item['email'],
          );
        }).toList();
      } else {
        print('Failed to perform advanced search: ${response.statusCode} - ${response.body}');
        // Return empty list if search fails
        return [];
      }
    } catch (e) {
      print('Error during advanced search: $e');
      // Return empty list in case of error
      return [];
    }
  }
}