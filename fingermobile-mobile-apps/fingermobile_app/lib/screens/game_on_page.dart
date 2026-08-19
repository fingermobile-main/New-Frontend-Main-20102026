import 'package:flutter/material.dart';

class GameOnPage extends StatelessWidget {
  const GameOnPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Game On')),
      body: const Center(child: Text('Game On Page Content')),
    );
  }
}