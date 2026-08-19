import 'package:flutter/material.dart';

class LoadingSpinner extends StatelessWidget {
  final double size;

  const LoadingSpinner({super.key, this.size = 40.0});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: SizedBox(
        width: size,
        height: size,
        child: CircularProgressIndicator(
          valueColor: AlwaysStoppedAnimation<Color>(Colors.blueGrey),
          strokeWidth: 3.0,
        ),
      ),
    );
  }
}