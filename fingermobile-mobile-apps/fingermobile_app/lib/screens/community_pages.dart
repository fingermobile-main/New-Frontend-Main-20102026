import 'package:flutter/material.dart';

class CommunityPages extends StatelessWidget {
  const CommunityPages({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Community Pages'),
      ),
      body: const Center(
        child: Text('Community Pages Content'),
      ),
    );
  }
}