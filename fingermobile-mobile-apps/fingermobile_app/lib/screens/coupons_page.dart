import 'package:flutter/material.dart';

class CouponsPage extends StatelessWidget {
  const CouponsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Coupons'),
      ),
      body: const Center(
        child: Text('Coupons Page Content'),
      ),
    );
  }
}