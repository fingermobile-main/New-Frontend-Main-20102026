import 'package:flutter/material.dart';

class BusinessReportsPage extends StatelessWidget {
  const BusinessReportsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Business Reports'),
      ),
      body: const Center(
        child: Text('Business Reports Page Content'),
      ),
    );
  }
}
