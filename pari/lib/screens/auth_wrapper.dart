import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'login_screen.dart';
import 'main_layout.dart';

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    // StreamBuilder automatically listens to login/logout events!
    return StreamBuilder<User?>(
      stream: FirebaseAuth.instance.authStateChanges(),
      builder: (context, snapshot) {
        // If Firebase is still checking the login status, show a loader
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }
        
        // If we have user data, they are logged in! Send them to the main app.
        if (snapshot.hasData) {
          return const MainLayout();
        }
        
        // Otherwise, they are NOT logged in. Send them to the Login screen.
        return const LoginScreen();
      },
    );
  }
}