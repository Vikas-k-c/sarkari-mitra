import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sarkari_mitra/core/theme/app_theme.dart';
import 'package:sarkari_mitra/core/theme/theme_provider.dart';
import 'package:sarkari_mitra/features/auth/screens/login_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const ProviderScope(
      child: SarkariMitraApp(),
    ),
  );
}

class SarkariMitraApp extends ConsumerWidget {
  const SarkariMitraApp({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeProvider);

    return MaterialApp(
      title: 'Sarkari Mitra',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      debugShowCheckedModeBanner: false,
      home: const LoginScreen(), // Will replace with Auth Checker later
    );
  }
}
