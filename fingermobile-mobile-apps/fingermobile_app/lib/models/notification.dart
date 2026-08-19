import 'package:flutter/material.dart';

class Notification {
  final String id;
  final String title;
  final String message;
  final String time;
  final IconData icon;
  final String? type;
  final String? relatedEntityType;
  final String? relatedEntityId;
  bool isRead;

  Notification({
    required this.id,
    required this.title,
    required this.message,
    required this.time,
    required this.icon,
    this.type,
    this.relatedEntityType,
    this.relatedEntityId,
    this.isRead = false,
  });

  factory Notification.fromJson(Map<String, dynamic> json) {
    return Notification(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      message: json['message']?.toString() ?? '',
      time: json['time']?.toString() ?? '',
      icon: _getIconFromString(json['icon']?.toString() ?? 'notifications'),
      type: json['type']?.toString(),
      relatedEntityType: json['relatedEntityType']?.toString() ??
          json['related_entity_type']?.toString(),
      relatedEntityId: json['relatedEntityId']?.toString() ??
          json['related_entity_id']?.toString(),
      isRead: json['is_read'] as bool? ?? json['isRead'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'message': message,
      'time': time,
      'icon': _getStringFromIcon(icon),
      'type': type,
      'relatedEntityType': relatedEntityType,
      'relatedEntityId': relatedEntityId,
      'is_read': isRead,
    };
  }

  static IconData _getIconFromString(String iconString) {
    switch (iconString) {
      case 'message':
        return Icons.message;
      case 'person':
        return Icons.person;
      case 'favorite':
        return Icons.favorite;
      case 'info':
        return Icons.info;
      case 'warning':
        return Icons.warning;
      case 'error':
        return Icons.error;
      default:
        return Icons.notifications;
    }
  }

  static String _getStringFromIcon(IconData iconData) {
    if (iconData == Icons.message) {
      return 'message';
    } else if (iconData == Icons.person) {
      return 'person';
    } else if (iconData == Icons.favorite) {
      return 'favorite';
    } else if (iconData == Icons.info) {
      return 'info';
    } else if (iconData == Icons.warning) {
      return 'warning';
    } else if (iconData == Icons.error) {
      return 'error';
    } else {
      return 'notifications';
    }
  }
}
