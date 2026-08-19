import 'dart:convert';
import 'package:http/http.dart' as http;

class NotificationItem {
  final int id;
  final String type;
  final String title;
  final String content;
  final String? sender;
  final DateTime timestamp;
  final bool isRead;

  NotificationItem({
    required this.id,
    required this.type,
    required this.title,
    required this.content,
    this.sender,
    required this.timestamp,
    required this.isRead,
  });

  factory NotificationItem.fromJson(Map<String, dynamic> json) {
    return NotificationItem(
      id: json['id'] ?? 0,
      type: json['type'] ?? '',
      title: json['title'] ?? '',
      content: json['content'] ?? '',
      sender: json['sender'],
      timestamp: DateTime.tryParse(json['timestamp'] ?? '') ?? DateTime.now(),
      isRead: json['is_read'] ?? json['isRead'] ?? false,
    );
  }
}

class NotificationService {
  static Future<List<NotificationItem>?> getNotifications(int memberId) async {
    try {
      final response = await http.get(
        Uri.parse('http://localhost:5001/api/notifications/$memberId'),
        headers: await _getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body)['data'] as List;
        return data.map((json) => NotificationItem.fromJson(json)).toList();
      }
      return null;
    } catch (e) {
      print('Error getting notifications: $e');
      return null;
    }
  }

  static Future<bool> markAsRead(int memberId, int notificationId) async {
    try {
      final response = await http.put(
        Uri.parse('http://localhost:5001/api/notifications/$memberId/$notificationId/read'),
        headers: await _getAuthHeaders(),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error marking notification as read: $e');
      return false;
    }
  }

  static Future<bool> markAllAsRead(int memberId) async {
    try {
      final response = await http.put(
        Uri.parse('http://localhost:5001/api/notifications/$memberId/mark-all-read'),
        headers: await _getAuthHeaders(),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error marking all notifications as read: $e');
      return false;
    }
  }

  static Future<int> getUnreadCount(int memberId) async {
    try {
      final response = await http.get(
        Uri.parse('http://localhost:5001/api/notifications/$memberId/unread-count'),
        headers: await _getAuthHeaders(),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body)['count'] ?? 0;
      }
      return 0;
    } catch (e) {
      print('Error getting unread count: $e');
      return 0;
    }
  }

  static Future<Map<String, String>?> _getAuthHeaders() async {
    // In a real app, you would get the auth token from secure storage
    // For now, returning basic headers
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }
}