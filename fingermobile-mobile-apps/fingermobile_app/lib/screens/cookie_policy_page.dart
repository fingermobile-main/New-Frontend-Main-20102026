import 'package:flutter/material.dart';

class CookiePolicyPage extends StatelessWidget {
  const CookiePolicyPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cookie Policy'),
      ),
      body: const Center(
        child: Text('Cookie Policy Page Content'),
      ),
    );
  }
}