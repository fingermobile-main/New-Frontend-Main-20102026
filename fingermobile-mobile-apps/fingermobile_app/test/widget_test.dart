// This is a basic widget test for the FingerMobile app.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:fingermobile_app/main.dart';

void main() {
  testWidgets('App launches and displays login screen', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const MyApp());

    // Verify that the login screen is displayed.
    expect(find.text('FingerMobile'), findsOneWidget);
    expect(find.text('Login'), findsOneWidget);
    expect(find.widgetWithText(ElevatedButton, 'Login'), findsOneWidget);
  });
}