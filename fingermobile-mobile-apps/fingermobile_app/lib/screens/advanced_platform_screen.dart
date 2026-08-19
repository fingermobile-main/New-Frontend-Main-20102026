import 'package:flutter/material.dart';
import 'package:fingermobile_app/services/platform_service.dart';
import 'package:fingermobile_app/screens/web_view_screen.dart';

class AdvancedPlatformScreen extends StatelessWidget {
  final String platformId;

  const AdvancedPlatformScreen({super.key, required this.platformId});

  @override
  Widget build(BuildContext context) {
    final platform = PlatformService.getPlatformById(platformId);

    if (platform == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Platform Not Found'),
        ),
        body: const Center(
          child: Text('The requested platform could not be found.'),
        ),
      );
    }

    return WebViewScreen(
      url: platform.baseUrl,
      title: platform.name,
    );
  }
}