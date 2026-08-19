import 'package:flutter/material.dart';

class BecomeAnInstructorPage extends StatelessWidget {
  const BecomeAnInstructorPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Become An Instructor'),
      ),
      body: const Center(
        child: Text('Become An Instructor Page Content'),
      ),
    );
  }
}