import 'package:flutter/material.dart';

class DashboardSidebar extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.grey[900],
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 10,
            offset: Offset(5, 0),
          ),
        ],
      ),
      child: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: EdgeInsets.all(16.0),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 20,
                    backgroundImage: NetworkImage(
                      'https://via.placeholder.com/150',
                    ),
                  ),
                  SizedBox(width: 10),
                  Text(
                    'FingerMobile',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: ListView(
                padding: EdgeInsets.zero,
                children: [
                  _buildSidebarItem(
                    context,
                    Icons.dashboard,
                    'Dashboard',
                    '/dashboard',
                  ),
                  _buildSidebarItem(
                    context,
                    Icons.person,
                    'Profile',
                    '/profile',
                  ),
                  _buildSidebarItem(
                    context,
                    Icons.forum,
                    'Community',
                    '/community',
                  ),
                  _buildSidebarItem(
                    context,
                    Icons.store,
                    'Marketplace',
                    '/marketplace',
                  ),
                  _buildSidebarItem(
                    context,
                    Icons.monetization_on,
                    'Wallet',
                    '/wallet',
                  ),
                  _buildSidebarItem(
                    context,
                    Icons.school,
                    'Education',
                    '/education',
                  ),
                  _buildSidebarItem(
                    context,
                    Icons.music_note,
                    'Entertainment',
                    '/entertainment',
                  ),
                  Divider(color: Colors.grey[700]),
                  _buildSidebarItem(
                    context,
                    Icons.settings,
                    'Settings',
                    '/settings',
                  ),
                  _buildSidebarItem(
                    context,
                    Icons.help,
                    'Support',
                    '/support',
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSidebarItem(
    BuildContext context,
    IconData icon,
    String title,
    String route,
  ) {
    return ListTile(
      leading: Icon(icon, color: Colors.white70),
      title: Text(
        title,
        style: TextStyle(
          color: Colors.white70,
          fontSize: 14,
        ),
      ),
      onTap: () {
        // Navigate to the selected route
        Navigator.of(context).pushReplacementNamed(route);
      },
    );
  }
}