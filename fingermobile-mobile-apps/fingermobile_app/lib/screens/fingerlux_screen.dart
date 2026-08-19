import 'package:flutter/material.dart';
import 'package:fingermobile_app/screens/web_view_screen.dart';

class FingerLuxScreen extends StatelessWidget {
  const FingerLuxScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const WebViewScreen(
      url: 'https://fingerlux.fingermobile.com',
      title: 'FingerLux',
    );
  }
}