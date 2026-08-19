import 'package:flutter/material.dart';
import 'package:fingermobile_app/screens/web_view_screen.dart';

class Dancia4TvScreen extends StatelessWidget {
  const Dancia4TvScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const WebViewScreen(
      url: 'https://dancia4tv.fingermobile.com',
      title: 'Dancia 4Tv',
    );
  }
}