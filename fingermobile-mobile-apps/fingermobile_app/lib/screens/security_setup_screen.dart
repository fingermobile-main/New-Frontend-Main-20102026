import 'package:flutter/material.dart';

class SecuritySetupScreen extends StatelessWidget {
  const SecuritySetupScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Security Setup Screen')),
      body: const Center(child: Text('Security Setup Screen Content')),
    );
  }
}