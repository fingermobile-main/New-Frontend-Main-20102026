import 'package:flutter/material.dart';
import 'package:fingermobile_app/screens/web_view_screen.dart';

class BeatwaveNGScreen extends StatelessWidget {
  const BeatwaveNGScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const WebViewScreen(
      url: 'https://beatwavedemo.fingermobile.com',
      title: 'Beatwave NG',
    );
  }
}