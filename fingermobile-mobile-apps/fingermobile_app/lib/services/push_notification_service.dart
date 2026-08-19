import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:http/http.dart' as http;

/// Push Notification Service for FingerMobile
/// Handles both Firebase Cloud Messaging and local notifications
class PushNotificationService {
  static final PushNotificationService _instance = PushNotificationService._internal();
  factory PushNotificationService() => _instance;
  PushNotificationService._internal();

  final FlutterLocalNotificationsPlugin _localNotifications = FlutterLocalNotificationsPlugin();
  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  
  StreamController<NotificationData> _notificationStream = StreamController<NotificationData>.broadcast();
  Stream<NotificationData> get notificationStream => _notificationStream.stream;
  
  String? _deviceToken;
  bool _isInitialized = false;

  // Notification channels for Android
  static const List<AndroidNotificationChannel> _channels = [
    AndroidNotificationChannel(
      'lendsqr_channel',
      'LendSqr Notifications',
      description: 'Loan approvals, repayments, and credit score updates',
      importance: Importance.high,
    ),
    AndroidNotificationChannel(
      'fingerlux_channel',
      'FingerLux Notifications',
      description: 'Booking confirmations and luxury service updates',
      importance: Importance.high,
    ),
    AndroidNotificationChannel(
      'fingerwars_channel',
      'FingerWars Notifications',
      description: 'Game invitations, leaderboard updates, and achievements',
      importance: Default,
    ),
    AndroidNotificationChannel(
      'gameon_channel',
      'GameOn Notifications',
      description: 'Event reminders and ticket confirmations',
      importance: Importance.high,
    ),
    AndroidNotificationChannel(
      'nysc_channel',
      'NYSC Notifications',
      description: 'Activity reminders and allowance notifications',
      importance: Importance.high,
    ),
    AndroidNotificationChannel(
      'lumina_channel',
      'Lumina Gallery Notifications',
      description: 'Media processing complete and upload notifications',
      importance: Default,
    ),
    AndroidNotificationChannel(
      'general_channel',
      'General Notifications',
      description: 'General platform notifications',
      importance: Default,
    ),
  ];

  /// Initialize push notifications
  Future<void> initialize() async {
    if (_isInitialized) return;

    try {
      // Request permissions
      await _requestPermissions();

      // Create notification channels
      await _createNotificationChannels();

      // Setup Firebase Messaging
      await _setupFirebaseMessaging();

      // Setup local notifications
      await _setupLocalNotifications();

      // Get device token
      await _getDeviceToken();

      _isInitialized = true;
      debugPrint('✅ Push Notification Service initialized');
    } catch (e) {
      debugPrint('❌ Failed to initialize push notifications: $e');
    }
  }

  Future<void> _requestPermissions() async {
    // iOS permissions
    await _firebaseMessaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: false,
    );

    // Android permissions (for Android 13+)
    final prefs = await SharedPreferences.getInstance();
    final notificationsEnabled = prefs.getBool('notifications_enabled') ?? true;
    
    if (!notificationsEnabled) {
      debugPrint('⚠️ Notifications disabled by user');
    }
  }

  Future<void> _createNotificationChannels() async {
    for (final channel in _channels) {
      await _localNotifications
          .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
          ?.createNotificationChannel(channel);
    }
    debugPrint('✅ Created ${_channels.length} notification channels');
  }

  Future<void> _setupFirebaseMessaging() async {
    // Foreground message handler
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

    // Background message handler
    FirebaseMessaging.onBackgroundMessage(_handleBackgroundMessage);

    // Notification tap handler
    FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationTap);

    // Check if app opened from notification
    final initialMessage = await _firebaseMessaging.getInitialMessage();
    if (initialMessage != null) {
      _handleNotificationTap(initialMessage);
    }

    debugPrint('✅ Firebase Messaging setup complete');
  }

  Future<void> _setupLocalNotifications() async {
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const settings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _localNotifications.initialize(
      settings,
      onDidReceiveNotificationResponse: _handleLocalNotificationTap,
      onDidReceiveBackgroundNotificationResponse: _handleBackgroundNotification,
    );

    debugPrint('✅ Local Notifications setup complete');
  }

  Future<void> _getDeviceToken() async {
    try {
      _deviceToken = await _firebaseMessaging.getToken();
      debugPrint('📱 Device FCM Token: $_deviceToken');

      // Save token for backend
      await _saveDeviceToken(_deviceToken);

      // Listen for token refresh
      _firebaseMessaging.onTokenRefresh.listen((newToken) {
        _deviceToken = newToken;
        _saveDeviceToken(newToken);
        debugPrint('🔄 Token refreshed: $newToken');
      });
    } catch (e) {
      debugPrint('❌ Failed to get device token: $e');
    }
  }

  Future<void> _saveDeviceToken(String? token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('device_token', token ?? '');
    
    // TODO: Send token to backend
    // await ApiService.registerDeviceToken(token);
  }

  void _handleForegroundMessage(RemoteMessage message) {
    debugPrint('📬 Foreground message: ${message.data}');
    
    final notificationData = NotificationData(
      id: message.messageId ?? DateTime.now().millisecondsSinceEpoch.toString(),
      title: message.notification?.title ?? 'Notification',
      body: message.notification?.body ?? '',
      type: message.data['type'] ?? 'general',
      data: message.data,
      isRead: false,
      timestamp: DateTime.now(),
    );

    _notificationStream.add(notificationData);
    _saveNotification(notificationData);
  }

  void _handleNotificationTap(RemoteMessage message) {
    debugPrint('👆 Notification tapped: ${message.data}');
    
    final notificationData = NotificationData(
      id: message.messageId ?? DateTime.now().millisecondsSinceEpoch.toString(),
      title: message.notification?.title ?? 'Notification',
      body: message.notification?.body ?? '',
      type: message.data['type'] ?? 'general',
      data: message.data,
      isRead: true,
      timestamp: DateTime.now(),
    );

    _notificationStream.add(notificationData);
    _markNotificationAsRead(notificationData.id);
  }

  void _handleLocalNotificationTap(NotificationResponse response) {
    debugPrint('👆 Local notification tapped: ${response.payload}');
    
    if (response.payload != null) {
      final data = jsonDecode(response.payload!);
      final notificationData = NotificationData(
        id: response.id,
        title: data['title'] ?? 'Notification',
        body: data['body'] ?? '',
        type: data['type'] ?? 'general',
        data: data,
        isRead: true,
        timestamp: DateTime.now(),
      );

      _notificationStream.add(notificationData);
      _markNotificationAsRead(notificationData.id);
    }
  }

  // ==================== SHOW NOTIFICATIONS ====================

  /// Show LendSqr notification
  Future<void> showLendSqrNotification({
    required String title,
    required String body,
    String? loanId,
    String type = 'loan_update',
  }) async {
    await _showNotification(
      id: DateTime.now().millisecondsSinceEpoch,
      title: title,
      body: body,
      channelId: 'lendsqr_channel',
      channelName: 'LendSqr Notifications',
      payload: jsonEncode({
        'type': type,
        'loanId': loanId,
        'service': 'lendsqr',
      }),
    );
  }

  /// Show FingerLux notification
  Future<void> showFingerLuxNotification({
    required String title,
    required String body,
    int? bookingId,
    String type = 'booking_confirmation',
  }) async {
    await _showNotification(
      id: DateTime.now().millisecondsSinceEpoch,
      title: title,
      body: body,
      channelId: 'fingerlux_channel',
      channelName: 'FingerLux Notifications',
      payload: jsonEncode({
        'type': type,
        'bookingId': bookingId,
        'service': 'fingerlux',
      }),
    );
  }

  /// Show FingerWars notification
  Future<void> showFingerWarsNotification({
    required String title,
    required String body,
    String? gameId,
    String type = 'game_update',
  }) async {
    await _showNotification(
      id: DateTime.now().millisecondsSinceEpoch,
      title: title,
      body: body,
      channelId: 'fingerwars_channel',
      channelName: 'FingerWars Notifications',
      payload: jsonEncode({
        'type': type,
        'gameId': gameId,
        'service': 'fingerwars',
      }),
    );
  }

  /// Show GameOn notification
  Future<void> showGameOnNotification({
    required String title,
    required String body,
    int? eventId,
    String type = 'event_reminder',
  }) async {
    await _showNotification(
      id: DateTime.now().millisecondsSinceEpoch,
      title: title,
      body: body,
      channelId: 'gameon_channel',
      channelName: 'GameOn Notifications',
      payload: jsonEncode({
        'type': type,
        'eventId': eventId,
        'service': 'gameon',
      }),
    );
  }

  /// Show NYSC notification
  Future<void> showNyscNotification({
    required String title,
    required String body,
    String? activityId,
    String type = 'activity_reminder',
  }) async {
    await _showNotification(
      id: DateTime.now().millisecondsSinceEpoch,
      title: title,
      body: body,
      channelId: 'nysc_channel',
      channelName: 'NYSC Notifications',
      payload: jsonEncode({
        'type': type,
        'activityId': activityId,
        'service': 'nysc',
      }),
    );
  }

  /// Show Lumina Gallery notification
  Future<void> showLuminaNotification({
    required String title,
    required String body,
    String? fileId,
    String type = 'processing_complete',
  }) async {
    await _showNotification(
      id: DateTime.now().millisecondsSinceEpoch,
      title: title,
      body: body,
      channelId: 'lumina_channel',
      channelName: 'Lumina Gallery Notifications',
      payload: jsonEncode({
        'type': type,
        'fileId': fileId,
        'service': 'lumina',
      }),
    );
  }

  /// Show general notification
  Future<void> showGeneralNotification({
    required String title,
    required String body,
    Map<String, dynamic>? additionalData,
  }) async {
    await _showNotification(
      id: DateTime.now().millisecondsSinceEpoch,
      title: title,
      body: body,
      channelId: 'general_channel',
      channelName: 'General Notifications',
      payload: jsonEncode(additionalData ?? {}),
    );
  }

  Future<void> _showNotification({
    required int id,
    required String title,
    required String body,
    required String channelId,
    required String channelName,
    String? payload,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'general_channel',
      'General Notifications',
      channelDescription: 'General platform notifications',
      importance: Importance.high,
      priority: Priority.high,
      showWhen: true,
      icon: '@mipmap/ic_launcher',
    );

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    const details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _localNotifications.show(
      id,
      title,
      body,
      details,
      payload: payload,
    );

    debugPrint('🔔 Notification shown: $title');
  }

  // ==================== LOCAL NOTIFICATIONS (SCHEDULED) ====================

  /// Schedule a notification
  Future<void> scheduleNotification({
    required int id,
    required String title,
    required String body,
    required DateTime scheduledDate,
    String channelId = 'general_channel',
    Map<String, dynamic>? payload,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'general_channel',
      'General Notifications',
      channelDescription: 'Scheduled notifications',
      importance: Importance.high,
    );

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    const details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _localNotifications.zonedSchedule(
      id,
      title,
      body,
      scheduledDate,
      details,
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
      payload: jsonEncode(payload ?? {}),
    );

    debugPrint('⏰ Notification scheduled for $scheduledDate');
  }

  /// Schedule daily reminder
  Future<void> scheduleDailyReminder({
    required int id,
    required String title,
    required String body,
    required Time time,
  }) async {
    const androidDetails = AndroidNotificationDetails(
      'general_channel',
      'Daily Reminders',
      channelDescription: 'Daily reminder notifications',
      importance: Importance.high,
    );

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    const details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _localNotifications.zonedSchedule(
      id,
      title,
      body,
      _nextInstanceOfTime(time),
      details,
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      uiLocalNotificationDateInterpretation: UILocalNotificationDateInterpretation.absoluteTime,
      matchDateTimeComponents: DateTimeComponents.time,
    );

    debugPrint('⏰ Daily reminder scheduled for ${time.hour}:${time.minute}');
  }

  DateTime _nextInstanceOfTime(Time time) {
    final now = DateTime.now();
    var scheduledDate = DateTime(now.year, now.month, now.day, time.hour, time.minute);
    
    if (scheduledDate.isBefore(now)) {
      scheduledDate = scheduledDate.add(const Duration(days: 1));
    }
    
    return scheduledDate;
  }

  /// Cancel scheduled notification
  Future<void> cancelNotification(int id) async {
    await _localNotifications.cancel(id);
    debugPrint('❌ Notification cancelled: $id');
  }

  /// Cancel all scheduled notifications
  Future<void> cancelAllNotifications() async {
    await _localNotifications.cancelAll();
    debugPrint('❌ All notifications cancelled');
  }

  // ==================== NOTIFICATION STORAGE ====================

  Future<void> _saveNotification(NotificationData notification) async {
    final prefs = await SharedPreferences.getInstance();
    final notifications = await getStoredNotifications();
    
    notifications.insert(0, notification);
    
    // Keep only last 50 notifications
    if (notifications.length > 50) {
      notifications.removeRange(50, notifications.length);
    }
    
    await prefs.setString('stored_notifications', jsonEncode(notifications.map((n) => n.toJson()).toList()));
  }

  Future<List<NotificationData>> getStoredNotifications() async {
    final prefs = await SharedPreferences.getInstance();
    final notificationsJson = prefs.getStringList('stored_notifications') ?? [];
    
    return notificationsJson
        .map((json) => NotificationData.fromJson(jsonDecode(json)))
        .toList();
  }

  Future<void> _markNotificationAsRead(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final notifications = await getStoredNotifications();
    
    for (var notification in notifications) {
      if (notification.id == id) {
        notification.isRead = true;
        break;
      }
    }
    
    await prefs.setString('stored_notifications', jsonEncode(notifications.map((n) => n.toJson()).toList()));
  }

  Future<int> getUnreadCount() async {
    final notifications = await getStoredNotifications();
    return notifications.where((n) => !n.isRead).length;
  }

  Future<void> clearAllNotifications() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('stored_notifications');
    _notificationStream = StreamController<NotificationData>.broadcast();
  }

  // ==================== UTILITIES ====================

  Future<void> enableNotifications() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('notifications_enabled', true);
    await initialize();
  }

  Future<void> disableNotifications() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('notifications_enabled', false);
    await cancelAllNotifications();
    _isInitialized = false;
  }

  bool get isInitialized => _isInitialized;
  String? get deviceToken => _deviceToken;
}

// ==================== NOTIFICATION DATA MODEL ====================

class NotificationData {
  final String id;
  final String title;
  final String body;
  final String type;
  final Map<String, dynamic> data;
  final bool isRead;
  final DateTime timestamp;

  NotificationData({
    required this.id,
    required this.title,
    required this.body,
    required this.type,
    required this.data,
    required this.isRead,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'body': body,
        'type': type,
        'data': data,
        'isRead': isRead,
        'timestamp': timestamp.toIso8601String(),
      };

  factory NotificationData.fromJson(Map<String, dynamic> json) {
    return NotificationData(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      body: json['body'] ?? '',
      type: json['type'] ?? 'general',
      data: json['data'] ?? {},
      isRead: json['isRead'] ?? false,
      timestamp: DateTime.parse(json['timestamp']),
    );
  }
}

// ==================== BACKGROUND MESSAGE HANDLER ====================

@pragma('vm:entry-point')
Future<void> _handleBackgroundMessage(RemoteMessage message) async {
  debugPrint('🌙 Background message: ${message.data}');
  
  // Handle background message
  // This runs in a separate isolate
}

@pragma('vm:entry-point')
void _handleBackgroundNotification(NotificationResponse response) {
  debugPrint('🌙 Background notification tapped: ${response.payload}');
}
