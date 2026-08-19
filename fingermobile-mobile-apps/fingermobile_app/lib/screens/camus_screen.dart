import 'package:flutter/material.dart';
import 'package:fingermobile_app/screens/web_view_screen.dart';

class CamusScreen extends StatelessWidget {
  const CamusScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const WebViewScreen(
      url: 'https://camus.fingermobile.com',
      title: 'CAMUS',
    );
  }
}