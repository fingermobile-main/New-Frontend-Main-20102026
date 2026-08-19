import 'package:flutter/material.dart';

class MyLearningPage extends StatelessWidget {
  const MyLearningPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Learning Page')),
      body: const Center(child: Text('My Learning Page Content')),
    );
  }
}