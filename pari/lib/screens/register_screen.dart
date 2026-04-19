import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();
  
  String _errorMessage = '';
  bool _isLoading = false;

  Future<void> _registerAccount() async {
    // 1. Check if passwords match
    if (_passwordController.text != _confirmPasswordController.text) {
      setState(() { _errorMessage = "Passwords do not match!"; });
      return;
    }

    setState(() { 
      _isLoading = true; 
      _errorMessage = ''; 
    });

    try {
      // 2. Create the user in Firebase Auth
      UserCredential userCredential = await _auth.createUserWithEmailAndPassword(
        email: _emailController.text.trim(),
        password: _passwordController.text.trim(),
      );
      
      // 3. Create a profile for them in the Cloud Database
      await FirebaseFirestore.instance
          .collection('users')
          .doc(userCredential.user!.uid)
          .set({
        'email': _emailController.text.trim(),
        'balance': 1000, // Give everyone 1,000 starting coins
        'role': 'user',  // Default role is a normal user
        'createdAt': FieldValue.serverTimestamp(),
      });
      
      // 4. If successful, close this screen. 
      // The AuthWrapper in main.dart will automatically detect the login and send you to the app!
      if (mounted) {
        Navigator.pop(context); 
      }
    } on FirebaseAuthException catch (e) {
       setState(() { _errorMessage = e.message ?? 'An error occurred during registration.'; });
    } finally {
      if (mounted) setState(() { _isLoading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Create an Account')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(labelText: 'Email'),
              keyboardType: TextInputType.emailAddress,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _passwordController,
              decoration: const InputDecoration(labelText: 'Password (min 6 characters)'),
              obscureText: true,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _confirmPasswordController,
              decoration: const InputDecoration(labelText: 'Confirm Password'),
              obscureText: true,
            ),
            const SizedBox(height: 16),
            
            // Show error message if one exists
            if (_errorMessage.isNotEmpty)
              Text(_errorMessage, style: const TextStyle(color: Colors.red)),
            const SizedBox(height: 16),
            
            // Show a loading spinner or the Sign Up button
            _isLoading 
              ? const CircularProgressIndicator()
              : ElevatedButton(
                  onPressed: _registerAccount,
                  child: const Text('Sign Up'),
                ),
          ],
        ),
      ),
    );
  }
}