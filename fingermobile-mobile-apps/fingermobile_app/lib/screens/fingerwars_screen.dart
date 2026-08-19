import 'package:flutter/material.dart';
import 'package:fingermobile_app/screens/web_view_screen.dart';

class FingerWarsScreen extends StatelessWidget {
  const FingerWarsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const WebViewScreen(
      url: 'https://fingerwars.fingermobile.com',
      title: 'FingerWars',
    );
  }
}