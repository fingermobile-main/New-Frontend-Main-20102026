import 'package:flutter/material.dart';

class MyPages extends StatelessWidget {
  const MyPages({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Pages')),
      body: const Center(child: Text('My Pages Content')),
    );
  }
}
