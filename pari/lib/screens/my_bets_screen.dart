import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/currency_manager.dart';
import '../services/api_service.dart';

class MyBetsScreen extends StatelessWidget {
  const MyBetsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Bets'),
        centerTitle: true,
        backgroundColor: Colors.red,
        actions:[
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              final apiService = ApiService();
              Provider.of<CurrencyManager>(context, listen: false)
                  .checkPendingBets(apiService);
              
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Checking for finished matches...')),
              );
            },
          )
        ],
      ),
      body: Consumer<CurrencyManager>(
        builder: (context, currencyManager, child) {
          if (currencyManager.betHistory.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children:[
                  Icon(Icons.receipt_long_outlined, size: 80, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('No bets placed yet', style: TextStyle(fontSize: 18, color: Colors.grey)),
                  Text('Place a bet from the matches tab!', style: TextStyle(color: Colors.grey)),
                ],
              ),
            );
          }

          // Reverse the list so newest bets are at the top
          final reversedBets = currencyManager.betHistory.reversed.toList();

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: reversedBets.length,
            itemBuilder: (context, index) {
              final bet = reversedBets[index];
              
              // Change color based on status
              Color statusColor = Colors.grey;
              IconData statusIcon = Icons.access_time;
              if (bet.isResolved) {
                statusColor = bet.isWon == true ? Colors.green : Colors.red;
                statusIcon = bet.isWon == true ? Icons.check_circle : Icons.cancel;
              }

              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: statusColor.withOpacity(0.2),
                    child: Icon(statusIcon, color: statusColor),
                  ),
                  title: Text(bet.match, style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text('${bet.selection} • ${bet.amount} coins'),
                  trailing: bet.isResolved 
                      ? Text(bet.finalScore ?? '', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16))
                      : const Text('Pending', style: TextStyle(color: Colors.orange, fontWeight: FontWeight.bold)),
                  
                  // CLICK TO SEE RESULT
                  onTap: () {
                    if (bet.isResolved) {
                      _showBetResultDialog(context, bet);
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Match is still pending! Refresh later.')),
                      );
                    }
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }

  // The Pop-up Dialog to show the final result
  void _showBetResultDialog(BuildContext context, Bet bet) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: const Text('Match Result', textAlign: TextAlign.center),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children:[
              Text(bet.match, style: const TextStyle(fontSize: 16, color: Colors.grey)),
              const SizedBox(height: 16),
              
              const Text('Final Score', style: TextStyle(fontWeight: FontWeight.bold)),
              Text(
                bet.finalScore ?? 'N/A', 
                style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.red)
              ),
              
              const Divider(height: 32),
              
              Text('Your Pick: ${bet.selection}'),
              const SizedBox(height: 8),
              
              Text(
                bet.isWon == true ? '🎉 YOU WON! (+${bet.amount * 2} coins)' : '❌ YOU LOST (-${bet.amount} coins)',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: bet.isWon == true ? Colors.green : Colors.red,
                ),
              ),
            ],
          ),
          actions:[
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }
}