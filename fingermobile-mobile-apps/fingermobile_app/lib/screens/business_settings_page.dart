import 'package:flutter/material.dart';

class BusinessSettingsPage extends StatelessWidget {
  const BusinessSettingsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Business Settings'),
      ),
      body: const Center(
        child: Text('Business Settings Page Content'),
      ),
    );
  }
}
