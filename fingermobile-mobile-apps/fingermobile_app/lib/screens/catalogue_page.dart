import 'package:flutter/material.dart';

class CataloguePage extends StatelessWidget {
  const CataloguePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Catalogue'),
      ),
      body: const Center(
        child: Text('Catalogue Page Content'),
      ),
    );
  }
}