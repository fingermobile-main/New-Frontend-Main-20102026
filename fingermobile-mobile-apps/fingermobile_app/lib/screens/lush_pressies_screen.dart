import 'package:flutter/material.dart';
import 'package:fingermobile_app/screens/web_view_screen.dart';

class LushPressiesScreen extends StatelessWidget {
  const LushPressiesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const WebViewScreen(
      url: 'https://lushpressies.fingermobile.com',
      title: 'Lush Pressies',
    );
  }
}