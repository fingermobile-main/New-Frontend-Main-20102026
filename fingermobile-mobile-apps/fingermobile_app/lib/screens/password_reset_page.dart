import 'package:flutter/material.dart';

class PasswordResetPage extends StatelessWidget {
  const PasswordResetPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Password Reset Page')),
      body: const Center(child: Text('Password Reset Page Content')),
    );
  }
}