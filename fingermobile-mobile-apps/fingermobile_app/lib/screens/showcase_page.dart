import 'package:flutter/material.dart';

class ShowcasePage extends StatelessWidget {
  const ShowcasePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Showcase Page')),
      body: const Center(child: Text('Showcase Page Content')),
    );
  }
}