import 'package:flutter/material.dart';
import 'package:fingermobile_app/services/platform_service.dart';
import 'package:fingermobile_app/screens/advanced_platform_screen.dart';

class PlatformSelectorScreen extends StatelessWidget {
  const PlatformSelectorScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final platforms = PlatformService.getAvailablePlatforms();

    // Map platform names to colors and icons
    final platformStyles = {
      'Beatwave Demo': {'color': Colors.purple, 'icon': Icons.music_note},
      'Dancia 4Tv': {'color': Colors.red, 'icon': Icons.tv},
      'FingerLux': {'color': Colors.blue, 'icon': Icons.star},
      'FingerWars': {'color': Colors.orange, 'icon': Icons.games},
      'Lush Pressies': {'color': Colors.green, 'icon': Icons.card_giftcard},
      'CAMUS': {'color': Colors.indigo, 'icon': Icons.library_books},
      'E-Library': {'color': Colors.teal, 'icon': Icons.menu_book},
      'E-Learning': {'color': Colors.cyan, 'icon': Icons.school},
      'NYSC': {'color': Colors.lime, 'icon': Icons.flag},
    };

    return Scaffold(
      appBar: AppBar(
        title: const Text('Platforms'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      body: GridView.count(
        crossAxisCount: 2,
        padding: const EdgeInsets.all(16),
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        children: List.generate(platforms.length, (index) {
          final platform = platforms[index];
          final style = platformStyles[platform.name] ?? 
              {'color': Colors.grey, 'icon': Icons.apps};
          
          return Card(
            elevation: 4,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: InkWell(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => AdvancedPlatformScreen(
                      platformId: platform.id,
                    ),
                  ),
                );
              },
              borderRadius: BorderRadius.circular(12),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    style['icon'] as IconData,
                    size: 50,
                    color: style['color'] as Color,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    platform.name,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${platform.features.length} features',
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.grey,
                    ),
                  ),
                ],
              ),
            ),
          );
        }),
      ),
    );
  }
}