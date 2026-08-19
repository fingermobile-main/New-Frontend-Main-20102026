import 'package:flutter/material.dart';

class MyDownloadsPage extends StatelessWidget {
  const MyDownloadsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Downloads Page')),
      body: const Center(child: Text('My Downloads Page Content')),
    );
  }
}