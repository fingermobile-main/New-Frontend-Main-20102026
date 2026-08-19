import 'package:flutter/material.dart';

class BecomeAnArtistPage extends StatelessWidget {
  const BecomeAnArtistPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Become An Artist'),
      ),
      body: const Center(
        child: Text('Become An Artist Page Content'),
      ),
    );
  }
}