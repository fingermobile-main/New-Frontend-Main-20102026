import 'package:flutter/material.dart';
import 'package:fingermobile_app/models/member.dart';
import 'package:fingermobile_app/services/page_navigation_service.dart';
import 'package:fingermobile_app/screens/web_view_screen.dart';
import 'package:fingermobile_app/screens/platform_selector_screen.dart';

class MainNavigationDrawer extends StatelessWidget {
  final member member;

  const MainNavigationDrawer({super.key, required this.member});

  @override
  Widget build(BuildContext context) {
    final categories = PageNavigationService.getPageCategories();

    return Drawer(
      child: Column(
        children: [
          memberAccountsDrawerHeader(
            accountName: Text(member.name),
            accountEmail: Text(member.email),
            currentAccountPicture: CircleAvatar(
              child: Text(member.name.substring(0, 1)),
            ),
          ),
          Expanded(
            child: ListView(
              children: [
                const ListTile(
                  title: Text('Home'),
                  leading: Icon(Icons.home),
                ),
                ListTile(
                  title: const Text('Platforms'),
                  leading: const Icon(Icons.apps),
                  onTap: () {
                    Navigator.pop(context); // Close drawer
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const PlatformSelectorScreen(),
                      ),
                    );
                  },
                ),
                const Divider(),
                ..._buildCategoryList(context, categories),
                const Divider(),
                const ListTile(
                  title: Text('Settings'),
                  leading: Icon(Icons.settings),
                ),
                const ListTile(
                  title: Text('Help & Support'),
                  leading: Icon(Icons.help),
                ),
                const ListTile(
                  title: Text('Logout'),
                  leading: Icon(Icons.logout),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildCategoryList(BuildContext context, List<PageCategory> categories) {
    List<Widget> items = [];
    
    for (var category in categories) {
      items.add(
        ExpansionTile(
          title: Text(category.name),
          leading: Icon(_getIconData(category.icon)),
          children: category.subCategories.map((subCategory) {
            return ListTile(
              title: Text(subCategory.name),
              onTap: () {
                Navigator.pop(context); // Close drawer
                _navigateToPage(context, subCategory);
              },
            );
          }).toList(),
        ),
      );
    }
    
    return items;
  }

  IconData _getIconData(String icon) {
    switch (icon) {
      case 'forum':
        return Icons.forum;
      case 'music_note':
        return Icons.music_note;
      case 'store':
        return Icons.store;
      case 'school':
        return Icons.school;
      case 'business':
        return Icons.business;
      case 'palette':
        return Icons.palette;
      default:
        return Icons.category;
    }
  }

  void _navigateToPage(BuildContext context, SubCategory subCategory) {
    final url = PageNavigationService.getPageUrl(subCategory.id);
    
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => WebViewScreen(
          url: url,
          title: subCategory.name,
        ),
      ),
    );
  }
}