import 'package:flutter/material.dart';

class DashboardLayout extends StatefulWidget {
  final String title;
  final Widget child;
  final List<Widget> actions;
  final Widget? drawer;

  const DashboardLayout({
    Key? key,
    required this.title,
    required this.child,
    this.actions = const [],
    this.drawer,
  }) : super(key: key);

  @override
  _DashboardLayoutState createState() => _DashboardLayoutState();
}

class _DashboardLayoutState extends State<DashboardLayout> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        centerTitle: true,
        actions: widget.actions,
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      drawer: widget.drawer,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: widget.child,
        ),
      ),
    );
  }
}