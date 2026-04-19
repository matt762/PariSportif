import 'package:flutter/material.dart';
import 'screens/main_layout.dart';
import 'package:provider/provider.dart';
import 'services/currency_manager.dart';

// The main function is the entry point of the application
void main() {
  runApp(const FriendlyBetsApp());
}

class FriendlyBetsApp extends StatelessWidget {
  const FriendlyBetsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => CurrencyManager(),
      child: MaterialApp(
        title: 'Friendly Bets',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(primarySwatch: Colors.red, useMaterial3: true),
        home: const MainLayout(),
      ),
    );
  }
}
