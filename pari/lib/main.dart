import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart'; // Make sure this is imported

import 'screens/main_layout.dart';
import 'services/currency_manager.dart';

// The single, asynchronous main function
Future<void> main() async {
  // 1. Ensure Flutter bindings are initialized before loading dotenv
  WidgetsFlutterBinding.ensureInitialized();
  
  // 2. Load the environment variables from the .env file
  await dotenv.load(fileName: ".env");
  
  // 3. Run your actual app class
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
        theme: ThemeData(
          primarySwatch: Colors.red, 
          useMaterial3: true,
        ),
        home: const MainLayout(),
      ),
    );
  }
}