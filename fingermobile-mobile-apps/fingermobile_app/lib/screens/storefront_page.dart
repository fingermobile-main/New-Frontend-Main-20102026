import 'package:flutter/material.dart';

class StorefrontPage extends StatelessWidget {
  const StorefrontPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Storefront Page')),
      body: const Center(child: Text('Storefront Page Content')),
    );
  }
}