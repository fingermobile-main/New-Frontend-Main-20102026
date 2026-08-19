import 'package:flutter/material.dart';

class OwnitPage extends StatelessWidget {
  const OwnitPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ownit Page')),
      body: const Center(child: Text('Ownit Page Content')),
    );
  }
}