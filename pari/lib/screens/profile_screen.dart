import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:firebase_auth/firebase_auth.dart'; // 1. Imported Firebase Auth
import '../services/currency_manager.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // 2. Fetch the current logged-in user from Firebase
    final user = FirebaseAuth.instance.currentUser;
    final userEmail = user?.email ?? 'Unknown User';

    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Consumer<CurrencyManager>(
            builder: (context, currencyManager, child) {
              return Column(
                children: [
                  // Header
                  Row(
                    children: [
                      const CircleAvatar(
                        radius: 30,
                        backgroundColor: Colors.grey,
                        child: Icon(Icons.person, size: 35, color: Colors.white),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Player Profile', // Generic title since we use email below
                              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                            ),
                            Text(
                              userEmail, // 3. Display actual Firebase email here!
                              style: const TextStyle(color: Colors.grey)
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        onPressed: () {},
                        icon: const Icon(Icons.edit),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Daily Reward Button
                  if (currencyManager.canClaimDailyReward)
                    Container(
                      width: double.infinity,
                      margin: const EdgeInsets.only(bottom: 24),
                      child: ElevatedButton.icon(
                        onPressed: () {
                          currencyManager.claimDailyReward();
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('🎉 200 Coins Claimed! Come back tomorrow.'),
                              backgroundColor: Colors.green,
                            ),
                          );
                        },
                        icon: const Icon(Icons.card_giftcard),
                        label: const Text('Claim Daily Reward (200 Coins)'),
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.all(16),
                          backgroundColor: Colors.amber.shade700,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),

                  // Stats cards
                  Row(
                    children: [
                      Expanded(child: _buildStatCard('Coins', '${currencyManager.balance}')),
                      const SizedBox(width: 12),
                      Expanded(child: _buildStatCard('Bets', '${currencyManager.totalBets}')),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(child: _buildStatCard('Wins', '${currencyManager.totalWins}')),
                      const SizedBox(width: 12),
                      Expanded(child: _buildStatCard('Win Rate', currencyManager.winRate)),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // About section
                  const ListTile(
                    leading: Icon(Icons.info_outline),
                    title: Text('About'),
                    subtitle: Text('Player since 2026. Virtual currency only.'),
                  ),
                  const ListTile(
                    leading: Icon(Icons.settings),
                    title: Text('Settings'),
                    trailing: Icon(Icons.arrow_forward_ios),
                  ),
                  
                  // 4. Functional Sign Out Button
                  ListTile(
                    leading: const Icon(Icons.logout, color: Colors.red),
                    title: const Text(
                      'Sign Out',
                      style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                    ),
                    onTap: () async {
                      // Tell Firebase to sign out
                      await FirebaseAuth.instance.signOut();
                      // The AuthWrapper in main.dart will automatically notice this 
                      // and instantly flip the screen back to the Login Screen!
                    },
                  ),
                ],
              );
            }
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Text(value, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text(label, style: const TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}