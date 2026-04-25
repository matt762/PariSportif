import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_core/firebase_core.dart'; // 1. Import Firebase
import 'firebase_options.dart'; // 2. Import the generated options

import 'screens/main_layout.dart';
import 'services/currency_manager.dart';
import 'screens/auth_wrapper.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
    
  // 3. Initialize Firebase before running the app
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
  
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
        // For now, we will still load MainLayout. 
        // We will change this to LoginScreen next!
        home: const AuthWrapper(),
      ),
    );
  }
}