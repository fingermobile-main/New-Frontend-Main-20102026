import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'providers/app_provider.dart';
import 'providers/bluetooth_provider.dart'; // Import the new Bluetooth provider
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/bottom_nav_home.dart';
import 'screens/profile_screen.dart';
import 'screens/create_post_screen.dart';
import 'screens/search_screen.dart';
import 'screens/notifications_screen.dart';
import 'screens/messages_screen.dart';
import 'screens/settings_screen.dart';
import 'screens/wallet_screen.dart';
import 'screens/analytics_screen.dart';
import 'screens/groups_screen.dart';
import 'screens/events_screen.dart';
import 'screens/bookmarks_screen.dart';
import 'screens/activity_screen.dart';
import 'screens/media_gallery_screen.dart';
import 'screens/friends_screen.dart';
import 'screens/saved_posts_screen.dart';
import 'screens/recent_activity_screen.dart';
import 'screens/privacy_settings_screen.dart';
import 'screens/security_settings_screen.dart';
import 'screens/monetization_screen.dart';
import 'screens/help_support_screen.dart';
import 'screens/content_moderation_screen.dart';
import 'screens/trending_screen.dart';
import 'screens/achievements_screen.dart';
import 'screens/subscriptions_screen.dart';
import 'screens/challenges_screen.dart';
import 'screens/badges_screen.dart';
import 'screens/feedback_screen.dart';
import 'screens/notifications_preferences_screen.dart';
import 'screens/data_management_screen.dart';
import 'screens/account_management_screen.dart';
import 'screens/notifications_center_screen.dart';
import 'screens/content_filters_screen.dart';
import 'screens/accessibility_settings_screen.dart';
import 'screens/language_settings_screen.dart';
import 'screens/theme_settings_screen.dart';
import 'screens/backup_sync_settings_screen.dart';
import 'screens/parental_controls_screen.dart';
import 'screens/post_comments_screen.dart'; // Added import for post comments screen
import 'screens/bluetooth_settings_screen.dart'; // Import the new Bluetooth settings screen
import 'screens/bluetooth_device_manager.dart'; // Import the new Bluetooth device manager
import 'services/api_service.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (context) => AppProvider()..init(),
        ),
        ChangeNotifierProvider(
          create: (context) => BluetoothProvider(), // Add Bluetooth provider
        ),
      ],
      child: Consumer2<AppProvider, BluetoothProvider>(
        builder: (context, appProvider, bluetoothProvider, child) {
          return MaterialApp(
            title: 'FingerMobile',
            theme: ThemeData(
              primarySwatch: Colors.blue,
              visualDensity: VisualDensity.adaptivePlatformDensity,
            ),
            initialRoute: '/',
            routes: {
              '/': (context) => SplashScreen(),
              '/login': (context) => LoginScreen(),
              '/register': (context) => RegisterScreen(),
              '/home': (context) => BottomNavHome(),
              '/profile': (context) => ProfileScreen(),
              '/createPost': (context) => CreatePostScreen(),
              '/search': (context) => SearchScreen(),
              '/notifications': (context) => NotificationsScreen(),
              '/messages': (context) => MessagesScreen(),
              '/settings': (context) => SettingsScreen(),
              '/bluetooth-settings': (context) => BluetoothSettingsScreen(), // Add Bluetooth settings route
              '/wallet': (context) => WalletScreen(),
              '/analytics': (context) => AnalyticsScreen(),
              '/groups': (context) => GroupsScreen(),
              '/events': (context) => EventsScreen(),
              '/bookmarks': (context) => BookmarksScreen(),
              '/activity': (context) => ActivityScreen(),
              '/gallery': (context) => MediaGalleryScreen(),
              '/friends': (context) => FriendsScreen(),
              '/saved': (context) => SavedPostsScreen(),
              '/recent-activity': (context) => RecentActivityScreen(),
              '/privacy': (context) => PrivacySettingsScreen(),
              '/security': (context) => SecuritySettingsScreen(),
              '/monetization': (context) => MonetizationScreen(),
              '/help': (context) => HelpSupportScreen(),
              '/moderation': (context) => ContentModerationScreen(),
              '/reports': (context) => UserReportsScreen(),
              '/trending': (context) => TrendingScreen(),
              '/achievements': (context) => AchievementsScreen(),
              '/subscriptions': (context) => SubscriptionsScreen(),
              '/challenges': (context) => ChallengesScreen(),
              '/badges': (context) => BadgesScreen(),
              '/preferences': (context) => UserPreferencesScreen(),
              '/feedback': (context) => FeedbackScreen(),
              '/notification-preferences': (context) => NotificationsPreferencesScreen(),
              '/data-management': (context) => DataManagementScreen(),
              '/account-management': (context) => AccountManagementScreen(),
              '/notifications-center': (context) => NotificationsCenterScreen(),
              '/content-filters': (context) => ContentFiltersScreen(),
              '/accessibility': (context) => AccessibilitySettingsScreen(),
              '/language': (context) => LanguageSettingsScreen(),
              '/theme': (context) => ThemeSettingsScreen(),
              '/backup-sync': (context) => BackupSyncSettingsScreen(),
              '/parental-controls': (context) => ParentalControlsScreen(),
              '/post-comments': (context) => PostCommentsScreen(), // Added route for post comments
              '/bluetooth-manager': (context) => BluetoothDeviceManager(), // Add the new Bluetooth device manager route
            },
            debugShowCheckedModeBanner: false,
          );
        },
      ),
    );
  }
}

class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _checkAuthStatus();
  }

  _checkAuthStatus() async {
    // Check if member is already logged in
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');
    
    // Check if backend is accessible
    bool backendAccessible = await ApiService.checkHealth();
    
    if (backendAccessible && token != null) {
      // Token exists, try to validate it by fetching member profile
      try {
        final memberProfile = await ApiService.getMemberProfile();
        if (memberProfile != null) {
          // Valid token, go to home
          Navigator.pushReplacementNamed(context, '/home');
          return;
        }
      } catch (e) {
        print('Token validation failed: $e');
      }
    }
    
    // No valid token, go to login
    await Future.delayed(Duration(seconds: 2));
    Navigator.pushReplacementNamed(context, '/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Colors.blue, Colors.purple],
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.phone_android,
              size: 100,
              color: Colors.white,
            ),
            SizedBox(height: 20),
            Text(
              'FingerMobile',
              style: TextStyle(
                fontSize: 36,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            SizedBox(height: 20),
            CircularProgressIndicator(
              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
            ),
          ],
        ),
      ),
    );
  }
}