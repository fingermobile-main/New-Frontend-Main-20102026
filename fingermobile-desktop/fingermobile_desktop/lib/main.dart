import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// Services
import 'services/api_service.dart';
import 'services/auth_service.dart';
import 'services/notification_service.dart';

// Screens - importing from the mobile app structure
// Note: These will be adapted for desktop use
import 'screens/dashboard_page.dart';
import 'screens/profile_page.dart';
import 'screens/settings_page.dart';
import 'screens/notifications_page.dart';
import 'screens/marketplace_page.dart';
import 'screens/wallet_page.dart';
import 'screens/posts_page.dart';
import 'screens/content_management_page.dart';
import 'screens/admin_dashboard_page.dart';

// Themes and styles
import 'themes/app_theme.dart';

void main() {
  runApp(const FingerMobileDesktopApp());
}

class FingerMobileDesktopApp extends StatelessWidget {
  const FingerMobileDesktopApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        // Services
        ChangeNotifierProvider(create: (_) => ApiService()),
        ChangeNotifierProvider(create: (_) => UseAuth()),
        ChangeNotifierProvider(create: (_) => NotificationService()),
      ],
      child: MaterialApp(
        title: 'FingerMobile Desktop',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        home: const DesktopHomePage(),
        routes: {
          '/dashboard': (context) => const DashboardPage(),
          '/profile': (context) => const ProfilePage(),
          '/settings': (context) => const SettingsPage(),
          '/notifications': (context) => const NotificationsPage(),
          '/marketplace': (context) => const MarketplacePage(),
          '/wallet': (context) => const WalletPage(),
          '/posts': (context) => const PostsPage(),
          '/content': (context) => const ContentManagementPage(),
          '/admin': (context) => const AdminDashboardPage(),
        },
      ),
    );
  }
}

class DesktopHomePage extends StatefulWidget {
  const DesktopHomePage({Key? key}) : super(key: key);

  @override
  State<DesktopHomePage> createState() => _DesktopHomePageState();
}

class _DesktopHomePageState extends State<DesktopHomePage> {
  int _selectedIndex = 0;
  
  // Define the pages for navigation
  final List<Widget> _pages = [
    const DashboardPage(),
    const PostsPage(),
    const MarketplacePage(),
    const NotificationsPage(),
    const ProfilePage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          // Desktop Sidebar Navigation
          NavigationRail(
            selectedIndex: _selectedIndex,
            onDestinationSelected: _onItemTapped,
            labelType: NavigationRailLabelType.all,
            destinations: const [
              NavigationRailDestination(
                icon: Icon(Icons.dashboard),
                selectedIcon: Icon(Icons.dashboard_outlined),
                label: Text('Dashboard'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.article),
                selectedIcon: Icon(Icons.article_outlined),
                label: Text('Posts'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.shopping_bag),
                selectedIcon: Icon(Icons.shopping_bag_outlined),
                label: Text('Marketplace'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.notifications),
                selectedIcon: Icon(Icons.notifications_outlined),
                label: Text('Notifications'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.person),
                selectedIcon: Icon(Icons.person_outlined),
                label: Text('Profile'),
              ),
            ],
          ),
          // Main content area
          Expanded(
            child: Container(
              color: Theme.of(context).colorScheme.surface,
              child: _pages[_selectedIndex],
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Add desktop-specific functionality
          if (_selectedIndex == 0) {
            // On dashboard, maybe create new content
            Navigator.pushNamed(context, '/content');
          }
        },
        tooltip: 'Create',
        child: const Icon(Icons.add),
      ),
    );
  }
}