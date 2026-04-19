import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'api_service.dart';

// --- BET CLASS UPDATED FOR FIREBASE ---
class Bet {
  String? id; // NEW: Firestore document ID to update the bet later
  final int matchId;
  final String match;
  final String selection;
  final int amount;
  final DateTime time;
  final double payoutMultiplier;
  bool isResolved;
  bool? isWon;
  String? finalScore;

  Bet({
    this.id,
    required this.matchId, 
    required this.match, 
    required this.selection, 
    required this.amount, 
    required this.time,
    this.isResolved = false,
    this.isWon,
    this.finalScore,
    this.payoutMultiplier = 2.0,
  });

  // Convert Firestore JSON into a Bet object
  factory Bet.fromMap(String docId, Map<String, dynamic> data) {
    return Bet(
      id: docId,
      matchId: data['matchId'] ?? 0,
      match: data['match'] ?? '',
      selection: data['selection'] ?? '',
      amount: data['amount'] ?? 0,
      time: (data['time'] as Timestamp).toDate(),
      isResolved: data['isResolved'] ?? false,
      isWon: data['isWon'],
      finalScore: data['finalScore'],
    );
  }

  // Convert a Bet object into Firestore JSON
  Map<String, dynamic> toMap() {
    return {
      'matchId': matchId,
      'match': match,
      'selection': selection,
      'amount': amount,
      'time': Timestamp.fromDate(time),
      'isResolved': isResolved,
      'isWon': isWon,
      'finalScore': finalScore,
    };
  }
}

// --- CURRENCY MANAGER UPDATED FOR FIREBASE ---
class CurrencyManager extends ChangeNotifier {
  int _balance = 0; // Default to 0, Firestore will provide the real number
  List<Bet> _betHistory = [];
  int _totalWins = 0;
  
  DateTime? _lastRewardClaimTime;
  final int _dailyRewardAmount = 200;

  StreamSubscription<DocumentSnapshot>? _userSubscription;
  StreamSubscription<QuerySnapshot>? _betsSubscription;

  CurrencyManager() {
    // Automatically listen to login/logout events
    FirebaseAuth.instance.authStateChanges().listen((User? user) {
      if (user != null) {
        _listenToUserData(user.uid);
      } else {
        _clearData();
      }
    });
  }

  // Getters
  int get balance => _balance;
  List<Bet> get betHistory => _betHistory;
  int get totalBets => _betHistory.length;
  int get totalWins => _totalWins;
  
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

  // 1. Listen to Real-Time Data (Profile & Bets)
  void _listenToUserData(String uid) {
    _userSubscription?.cancel();
    _betsSubscription?.cancel();
    
    // Listen to User Profile (Balance, Reward Time, Total Wins)
    _userSubscription = FirebaseFirestore.instance
        .collection('users')
        .doc(uid)
        .snapshots()
        .listen((snapshot) {
      if (snapshot.exists) {
        final data = snapshot.data() as Map<String, dynamic>;
        _balance = data['balance'] ?? 0;
        _totalWins = data['totalWins'] ?? 0;
        
        if (data['lastRewardClaimTime'] != null) {
          _lastRewardClaimTime = (data['lastRewardClaimTime'] as Timestamp).toDate();
        }
        notifyListeners();
      }
    });

    // Listen to the user's Bets Subcollection
    _betsSubscription = FirebaseFirestore.instance
        .collection('users')
        .doc(uid)
        .collection('bets')
        .orderBy('time', descending: true) // Newest bets first!
        .snapshots()
        .listen((snapshot) {
      _betHistory = snapshot.docs
          .map((doc) => Bet.fromMap(doc.id, doc.data()))
          .toList();
      notifyListeners();
    });
  }

  void _clearData() {
    _balance = 0;
    _totalWins = 0;
    _betHistory = [];
    _lastRewardClaimTime = null;
    _userSubscription?.cancel();
    _betsSubscription?.cancel();
    notifyListeners();
  }

  // 2. Cloud-Secured Daily Reward
  Future<void> claimDailyReward() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null || !canClaimDailyReward) return;

    try {
      await FirebaseFirestore.instance.collection('users').doc(user.uid).update({
        'balance': FieldValue.increment(_dailyRewardAmount),
        'lastRewardClaimTime': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      print("Error claiming reward: $e");
    }
  }

  // 3. Place Bet in Firestore
  Future<bool> placeBet(int amount, int matchId, String match, String selection, {double multiplier = 2.0}) async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null || _balance < amount) return false;

    try {
      // Step A: Deduct the balance
      await FirebaseFirestore.instance.collection('users').doc(user.uid).update({
        'balance': FieldValue.increment(-amount),
      });

      // Step B: Create a new bet document in the 'bets' subcollection
      final newBet = Bet(
        matchId: matchId,
        match: match,
        selection: selection,
        amount: amount,
        payoutMultiplier: multiplier,
        time: DateTime.now(),
      );

      await FirebaseFirestore.instance
          .collection('users')
          .doc(user.uid)
          .collection('bets')
          .add(newBet.toMap());

      return true; 
    } catch (e) {
      print("Error placing bet: $e");
      return false;
    }
  }

  // 4. Resolve Pending Bets in Firestore
  Future<void> checkPendingBets(ApiService apiService) async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return;

    for (var bet in _betHistory) {
      // Only process unresolved bets
      if (!bet.isResolved && bet.id != null) {
        try {
          Map<String, String>? matchData = await apiService.fetchMatchResult(bet.matchId);
          if (matchData == null) continue; // Match not finished yet

          String winningTeam = matchData['winner']!;
          String score = matchData['score']!;
          bool isWin = false;
          
          if ((winningTeam == 'HOME_TEAM' && bet.selection.contains('Home')) ||
              (winningTeam == 'AWAY_TEAM' && bet.selection.contains('Away')) ||
              (winningTeam == 'DRAW' && bet.selection == 'Draw')) {
            isWin = true;
          }

          // Step A: Update the exact Bet document in Firestore
          await FirebaseFirestore.instance
              .collection('users')
              .doc(user.uid)
              .collection('bets')
              .doc(bet.id) // We use the ID we saved to find the right bet
              .update({
            'isResolved': true,
            'isWon': isWin,
            'finalScore': score,
          });
          
          // Step B: If won, give them their payout!
          if (isWin) {
            int winnings = (bet.amount * bet.payoutMultiplier).floor();

            await FirebaseFirestore.instance.collection('users').doc(user.uid).update({
              'balance': FieldValue.increment(winnings),
              'totalWins': FieldValue.increment(1),
            });
          }
        } catch (e) {
          print("Error checking bet ${bet.matchId}: $e");
          continue; 
        }
      }
    }
  }

  @override
  void dispose() {
    _userSubscription?.cancel();
    _betsSubscription?.cancel();
    super.dispose();
  }
}