import 'package:flutter/material.dart';

class CreatorDashboardPage extends StatelessWidget {
  const CreatorDashboardPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Creator Dashboard'),
      ),
      body: const Center(
        child: Text('Creator Dashboard Page Content'),
      ),
    );
  }
}