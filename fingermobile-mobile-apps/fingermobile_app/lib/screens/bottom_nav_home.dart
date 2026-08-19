import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import 'home_feed_tab.dart';
import 'notifications_screen.dart';
import 'messages_screen.dart';
import 'profile_screen.dart';

class BottomNavHome extends StatefulWidget {
  @override
  _BottomNavHomeState createState() => _BottomNavHomeState();
}

class _BottomNavHomeState extends State<BottomNavHome> {
  int _currentIndex = 0;
  
  final List<Widget> _tabs = [
    HomeFeedTab(),
    NotificationsScreen(),
    MessagesScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final appProvider = Provider.of<AppProvider>(context);
    
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _tabs,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          if (index == 1) {
            // Refresh notifications when navigating to the notifications tab
            appProvider.loadNotifications();
          } else if (index == 3) {
            // Refresh user profile when navigating to the profile tab
            appProvider.loadCurrentUser();
          }
          
          setState(() {
            _currentIndex = index;
          });
        },
        type: BottomNavigationBarType.fixed,
        selectedItemColor: Colors.blue,
        unselectedItemColor: Colors.grey,
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.notifications),
            label: appProvider.unreadNotificationsCount > 0
                ? Badge(
                    child: Icon(Icons.notifications),
                    smallSize: 10,
                    text: appProvider.unreadNotificationsCount > 99
                        ? '99+'
                        : appProvider.unreadNotificationsCount.toString(),
                  )
                : Icon(Icons.notifications),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.message),
            label: 'Messages',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
      floatingActionButton: _currentIndex == 0
          ? FloatingActionButton(
              onPressed: () {
                Navigator.pushNamed(context, '/createPost');
              },
              backgroundColor: Colors.blue,
              child: Icon(Icons.add, color: Colors.white),
            )
          : null,
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }
}