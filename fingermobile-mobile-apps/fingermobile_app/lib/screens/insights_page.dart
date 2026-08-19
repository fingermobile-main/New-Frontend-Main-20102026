import 'package:flutter/material.dart';

class InsightsPage extends StatelessWidget {
  const InsightsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Insights Page')),
      body: const Center(child: Text('Insights Page Content')),
    );
  }
}