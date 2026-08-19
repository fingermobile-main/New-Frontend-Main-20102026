import 'package:flutter/material.dart';

class PhotosPage extends StatelessWidget {
  const PhotosPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Photos Page')),
      body: const Center(child: Text('Photos Page Content')),
    );
  }
}