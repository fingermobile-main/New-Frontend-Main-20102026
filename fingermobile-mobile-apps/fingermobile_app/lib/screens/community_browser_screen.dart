import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class WebViewScreen extends StatelessWidget {
  final String url;
  final String title;

  const WebViewScreen({super.key, required this.url, required this.title});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        backgroundColor: Theme.of(context).colorScheme.primary,
      ),
      body: WebView(
        initialUrl: url,
      ),
    );
  }
}
import 'package:fingermobile_app/models/page_category.dart';
import 'package:fingermobile_app/services/page_navigation_service.dart';

class CommunityBrowserScreen extends StatelessWidget {
  const CommunityBrowserScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final categories = PageNavigationService.getPageCategories();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Community Browser'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: ListView.builder(
        itemCount: categories.length,
        itemBuilder: (context, index) {
          final category = categories[index];
          return Card(
            margin: const EdgeInsets.all(8.0),
            child: ExpansionTile(
              leading: Icon(_getIconData(category.icon)),
              title: Text(
                category.name,
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              children: category.subCategories.map((subCategory) {
                return ListTile(
                  title: Text(subCategory.name),
                  subtitle: Text(subCategory.description),
                  onTap: () {
                    // Navigate to the specific page
                    _navigateToPage(context, subCategory);
                  },
                );
              }).toList(),
            ),
          );
        },
      ),
    );
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