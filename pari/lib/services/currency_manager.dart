import 'package:flutter/foundation.dart';
import 'api_service.dart'; // <-- THIS IMPORT FIXES THE ERROR

class Bet {
  final int matchId;
  final String match;
  final String selection;
  final int amount;
  final DateTime time;
  bool isResolved;
  bool? isWon;
  String? finalScore; // NEW: Store the score permanently!

  Bet({
    required this.matchId, 
    required this.match, 
    required this.selection, 
    required this.amount, 
    required this.time,
    this.isResolved = false,
    this.isWon,
    this.finalScore, // NEW
  });
}

class CurrencyManager extends ChangeNotifier {
  int _balance = 1000;
  final List<Bet> _betHistory =[];
  
  DateTime? _lastRewardClaimTime;
  final int _dailyRewardAmount = 200;

  int get balance => _balance;
  List<Bet> get betHistory => _betHistory;

  int get totalBets => _betHistory.length;
  
  int get totalWins => _betHistory.where((bet) => bet.isResolved && bet.isWon == true).length;
  
  String get winRate {
    final resolvedBets = _betHistory.where((bet) => bet.isResolved).length;
    if (resolvedBets == 0) return "0%";
    return "${((totalWins / resolvedBets) * 100).toStringAsFixed(1)}%";
  }

  bool get canClaimDailyReward {
    if (_lastRewardClaimTime == null) return true;
    final now = DateTime.now();
    final difference = now.difference(_lastRewardClaimTime!);
    return difference.inHours >= 24; 
  }

  void claimDailyReward() {
    if (canClaimDailyReward) {
      _balance += _dailyRewardAmount;
      _lastRewardClaimTime = DateTime.now();
      notifyListeners();
    }
  }

  // Expects 4 arguments now: amount, matchId, match name, and selection
  bool placeBet(int amount, int matchId, String match, String selection) {
    if (_balance >= amount) {
      _balance -= amount;
      _betHistory.add(Bet(
        matchId: matchId,
        match: match,
        selection: selection,
        amount: amount,
        time: DateTime.now(),
      ));
      notifyListeners();
      return true; 
    }
    return false; 
  }

// 2. Further down, replace your checkPendingBets function with this:
  Future<void> checkPendingBets(ApiService apiService) async {
    for (var bet in _betHistory) {
      if (!bet.isResolved) {
        try {
          // Now it returns a Map with the winner AND the score
          Map<String, String>? matchData = await apiService.fetchMatchResult(bet.matchId);
          
          if (matchData == null) continue; // Match not finished

          String winningTeam = matchData['winner']!;
          
          // SAVE THE SCORE FOREVER
          bet.finalScore = matchData['score']; 
          bet.isResolved = true;
          
          if ((winningTeam == 'HOME_TEAM' && bet.selection.contains('Home')) ||
              (winningTeam == 'AWAY_TEAM' && bet.selection.contains('Away')) ||
              (winningTeam == 'DRAW' && bet.selection == 'Draw')) {
            
            bet.isWon = true;
            _balance += (bet.amount * 2); 
          } else {
            bet.isWon = false;
          }
        } catch (e) {
          continue; 
        }
      }
    }
    notifyListeners(); 
  }
}