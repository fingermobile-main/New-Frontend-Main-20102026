import 'package:flutter/material.dart';
import 'package:fingermobile_app/screens/web_view_screen.dart';

class ElibScreen extends StatelessWidget {
  const ElibScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const WebViewScreen(
      url: 'https://elib.fingermobile.com',
      title: 'E-Library',
    );
  }
}