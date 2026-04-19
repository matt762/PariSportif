import 'package:flutter/material.dart';
import '../services/currency_manager.dart';
import 'package:intl/intl.dart';

class BetDetailScreen extends StatelessWidget {
  final Bet bet;

  const BetDetailScreen({super.key, required this.bet});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bet Details')),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(bet.match, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const Divider(),
            _detailRow('Status', bet.isResolved ? 'Resolved' : 'Pending'),
            _detailRow('Your Pick', bet.selection),
            _detailRow('Stake', '${bet.amount} Coins'),
            _detailRow('Odds', 'x${bet.payoutMultiplier}'),
            if (bet.isResolved) ...[
              _detailRow('Result', bet.isWon! ? 'Won' : 'Lost', color: bet.isWon! ? Colors.green : Colors.red),
              _detailRow('Final Score', bet.finalScore ?? 'N/A'),
              _detailRow('Payout', '${(bet.amount * bet.payoutMultiplier).floor()} Coins'),
            ],
            const Spacer(),
            Text('Placed on: ${DateFormat('yyyy-MM-dd HH:mm').format(bet.time)}', style: const TextStyle(color: Colors.grey)),
          ],
        ),
      ),
    );
  }

  Widget _detailRow(String label, String value, {Color? color}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 16, color: Colors.grey)),
          Text(value, style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: color)),
        ],
      ),
    );
  }
}