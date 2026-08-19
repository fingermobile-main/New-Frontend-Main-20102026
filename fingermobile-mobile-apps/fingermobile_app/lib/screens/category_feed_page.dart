import 'package:flutter/material.dart';

class CategoryFeedPage extends StatelessWidget {
  const CategoryFeedPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Category Feed'),
      ),
      body: const Center(
        child: Text('Category Feed Page Content'),
      ),
    );
  }
}