import 'package:flutter/material.dart';

class DashboardHomePage extends StatelessWidget {
  const DashboardHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard Home'),
      ),
      body: const Center(
        child: Text('Dashboard Home Page Content'),
      ),
    );
  }
}