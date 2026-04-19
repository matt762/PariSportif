import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/currency_manager.dart';

class BettingScreen extends StatelessWidget {
  final int matchId;
  final String homeTeam;
  final String awayTeam;
  final String status; // NEW: To detect if match is LIVE

  const BettingScreen({
    super.key, 
    required this.matchId,
    required this.homeTeam,
    required this.awayTeam,
    required this.status, // Pass this from HomeScreen
  });

  @override
  Widget build(BuildContext context) {
    final matchTitle = '$homeTeam vs $awayTeam';
    
    // Logic for Reduced Odds (Live vs Pre-match)
    final bool isLive = status == 'IN_PLAY' || status == 'LIVE';
    final double multiplier = isLive ? 1.4 : 2.0;

    return Scaffold(
      appBar: AppBar(
        title: Text(isLive ? '🔴 LIVE Betting' : 'Upcoming Match'),
        backgroundColor: isLive ? Colors.red.shade900 : Colors.red,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Match header with Odds badge
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    if (isLive)
                      const Badge(
                        label: Text('LIVE'),
                        backgroundColor: Colors.red,
                      ),
                    Text(
                      matchTitle,
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.amber.shade100,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        'Current Odds: x$multiplier',
                        style: TextStyle(fontWeight: FontWeight.bold, color: Colors.amber.shade900),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Current balance
            Consumer<CurrencyManager>(
              builder: (context, currencyManager, child) {
                return Card(
                  color: Colors.red.shade50,
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
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

            const Text(
              'Select your result:',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),

            // Home win bet
            _buildBetButton(
              context,
              '$homeTeam wins',
              50,
              multiplier,
              () async {
                final success = await Provider.of<CurrencyManager>(context, listen: false)
                    .placeBet(50, matchId, matchTitle, '$homeTeam wins (Home)', multiplier: multiplier);
                if (success && context.mounted) Navigator.pop(context);
              },
            ),
            const SizedBox(height: 12),

            // Draw bet
            _buildBetButton(
              context,
              'Draw',
              100,
              multiplier,
              () async {
                final success = await Provider.of<CurrencyManager>(context, listen: false)
                    .placeBet(100, matchId, matchTitle, 'Draw', multiplier: multiplier);
                if (success && context.mounted) Navigator.pop(context);
              },
            ),
            const SizedBox(height: 12),

            // Away win bet
            _buildBetButton(
              context,
              '$awayTeam wins',
              50,
              multiplier,
              () async {
                final success = await Provider.of<CurrencyManager>(context, listen: false)
                    .placeBet(50, matchId, matchTitle, '$awayTeam wins (Away)', multiplier: multiplier);
                if (success && context.mounted) Navigator.pop(context);
              },
            ),

            const Spacer(),

            Text(
              'Live matches have reduced odds (x1.4) due to lower risk.',
              style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBetButton(BuildContext context, String label, int amount, double multiplier, VoidCallback onPressed) {
    int potentialWin = (amount * multiplier).floor();

    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.all(16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        backgroundColor: Colors.redAccent.shade200,
        foregroundColor: Colors.white,
      ),
      onPressed: onPressed,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text('$label ($amount coins)', style: const TextStyle(fontSize: 16)),
          Text('Win: $potentialWin', style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}