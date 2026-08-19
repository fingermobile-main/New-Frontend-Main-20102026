import 'package:flutter/material.dart';

class MyWalletPage extends StatelessWidget {
  const MyWalletPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Wallet Page')),
      body: const Center(child: Text('My Wallet Page Content')),
    );
  }
}
