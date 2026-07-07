import 'package:flutter/material.dart';

class ResponsiveLayout extends StatelessWidget {
  final Widget child;
  final PreferredSizeWidget? appBar;
  final Widget? floatingActionButton;
  final Color? backgroundColor;

  const ResponsiveLayout({
    super.key,
    required this.child,
    this.appBar,
    this.floatingActionButton,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundColor ?? Colors.grey.shade50,
      appBar: appBar,
      floatingActionButton: floatingActionButton,
      body: Center(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 600), // Max width for web/desktop
          child: child,
        ),
      ),
    );
  }
}
