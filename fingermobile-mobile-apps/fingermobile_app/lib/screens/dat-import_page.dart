import 'package:flutter/material.dart';

class DataImportPage extends StatelessWidget {
  const DataImportPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Data Import'),
      ),
      body: const Center(
        child: Text('Data Import Page Content'),
      ),
    );
  }
}