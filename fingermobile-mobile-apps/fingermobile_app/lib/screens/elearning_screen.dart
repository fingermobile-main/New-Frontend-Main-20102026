import 'package:flutter/material.dart';
import 'package:fingermobile_app/screens/web_view_screen.dart';

class ELearningScreen extends StatelessWidget {
  const ELearningScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const WebViewScreen(
      url: 'https://elearning.fingermobile.com',
      title: 'E-Learning',
    );
  }
}