import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/currency_manager.dart';

class BettingScreen extends StatelessWidget {
  final int matchId;
  final String homeTeam;
  final String awayTeam;

  const BettingScreen({
    super.key, 
    required this.matchId,
    required this.homeTeam,
    required this.awayTeam,
  });

  @override
  Widget build(BuildContext context) {
    final matchTitle = '$homeTeam vs $awayTeam';

    return Scaffold(
      appBar: AppBar(
        title: Text(matchTitle),
        backgroundColor: Colors.red,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children:[
            // Match header
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children:[
                    Text(
                      matchTitle,
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Place your virtual bet',
                      style: TextStyle(color: Colors.grey.shade600),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Current balance display
            Consumer<CurrencyManager>(
              builder: (context, currencyManager, child) {
                return Card(
                  color: Colors.red.shade50,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children:[
                        const Text('Your balance:', style: TextStyle(fontWeight: FontWeight.bold)),
                        Text(
                          '${currencyManager.balance} coins',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.red.shade700,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 24),

            // Bet options
            const Text(
              'Pick your bet:',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),

            // Home win bet (50 coins) -> Notice we pass 4 arguments and include "(Home)"
            _buildBetButton(
              context,
              '$homeTeam wins (50 coins)',
              () {
                Provider.of<CurrencyManager>(context, listen: false)
                    .placeBet(50, matchId, matchTitle, '$homeTeam wins (Home)');
                Navigator.pop(context);
              },
            ),
            const SizedBox(height: 12),

            // Draw bet (100 coins)
            _buildBetButton(
              context,
              'Draw (100 coins)',
              () {
                Provider.of<CurrencyManager>(context, listen: false)
                    .placeBet(100, matchId, matchTitle, 'Draw');
                Navigator.pop(context);
              },
            ),
            const SizedBox(height: 12),

            // Away win bet (50 coins) -> Notice we pass 4 arguments and include "(Away)"
            _buildBetButton(
              context,
              '$awayTeam wins (50 coins)',
              () {
                Provider.of<CurrencyManager>(context, listen: false)
                    .placeBet(50, matchId, matchTitle, '$awayTeam wins (Away)');
                Navigator.pop(context);
              },
            ),

            const Spacer(),

            // Confirmation text
            Text(
              'Virtual currency only - no real money',
              style: TextStyle(
                color: Colors.grey.shade600,
                fontSize: 12,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBetButton(BuildContext context, String label, VoidCallback onPressed) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        backgroundColor: Colors.redAccent.shade200,
        foregroundColor: Colors.white,
      ),
      onPressed: onPressed,
      child: Text(label, style: const TextStyle(fontSize: 16)),
    );
  }
}