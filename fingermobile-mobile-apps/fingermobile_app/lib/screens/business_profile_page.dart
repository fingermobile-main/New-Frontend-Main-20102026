import 'package:flutter/material.dart';

class BusinessProfilePage extends StatelessWidget {
  const BusinessProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Business Profile'),
      ),
      body: const Center(
        child: Text('Business Profile Page Content'),
      ),
    );
  }
}
