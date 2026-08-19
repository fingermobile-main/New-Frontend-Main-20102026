import 'package:flutter/material.dart';

class CampaignPage extends StatelessWidget {
  const CampaignPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Campaign'),
      ),
      body: const Center(
        child: Text('Campaign Page Content'),
      ),
    );
  }
}