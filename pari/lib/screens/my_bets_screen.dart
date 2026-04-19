import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/currency_manager.dart';
import '../services/api_service.dart';
import 'bet_detail_screen.dart'; // 1. Import the new detail screen

class MyBetsScreen extends StatelessWidget {
  const MyBetsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Bets'),
        centerTitle: true,
        backgroundColor: Colors.red,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              final apiService = ApiService();
              Provider.of<CurrencyManager>(context, listen: false)
                  .checkPendingBets(apiService);
              
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Updating match results...')),
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
                children: [
                  Icon(Icons.receipt_long_outlined, size: 80, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('No bets placed yet', style: TextStyle(fontSize: 18, color: Colors.grey)),
                  Text('Check the Home tab for live matches!', style: TextStyle(color: Colors.grey)),
                ],
              ),
            );
          }

          // Newest bets at the top
          final bets = currencyManager.betHistory;

          return RefreshIndicator( // 2. Added Pull-to-Refresh for better UX
            onRefresh: () async {
              await currencyManager.checkPendingBets(ApiService());
            },
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: bets.length,
              itemBuilder: (context, index) {
                final bet = bets[index];
                
                Color statusColor = Colors.grey;
                IconData statusIcon = Icons.access_time;
                
                if (bet.isResolved) {
                  statusColor = bet.isWon == true ? Colors.green : Colors.red;
                  statusIcon = bet.isWon == true ? Icons.check_circle : Icons.cancel;
                } else if (bet.id == null) {
                   statusColor = Colors.orange; // Syncing with cloud
                }

                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  elevation: 2,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: statusColor.withOpacity(0.2),
                      child: Icon(statusIcon, color: statusColor),
                    ),
                    title: Text(
                      bet.match, 
                      style: const TextStyle(fontWeight: FontWeight.bold),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    subtitle: Text('${bet.selection} • ${bet.amount} coins'),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        if (bet.isResolved)
                          Text(
                            bet.finalScore ?? '', 
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)
                          )
                        else
                          const Text(
                            'Pending', 
                            style: TextStyle(color: Colors.orange, fontWeight: FontWeight.bold)
                          ),
                        const Icon(Icons.chevron_right, size: 16, color: Colors.grey),
                      ],
                    ),
                    
                    // 3. Navigate to Dedicated Detail Screen
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => BetDetailScreen(bet: bet),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}