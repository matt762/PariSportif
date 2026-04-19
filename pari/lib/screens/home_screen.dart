import 'package:flutter/material.dart';
import 'betting_screen.dart';
import '../services/api_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ApiService _apiService = ApiService();
  late Future<List<Map<String, dynamic>>> _matchesFuture;

  @override
  void initState() {
    super.initState();
    // Fetch matches when the screen loads
    _matchesFuture = _apiService.fetchUpcomingMatches();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: const Text('Friendly Bets'),
        backgroundColor: Colors.red,
        actions:[
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              // Refresh the matches
              setState(() {
                _matchesFuture = _apiService.fetchUpcomingMatches();
              });
            },
          )
        ],
      ),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _matchesFuture,
        builder: (context, snapshot) {
          // 1. Show loading spinner while waiting for internet
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator(color: Colors.red));
          } 
          // 2. Show error if API fails
          else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } 
          // 3. Show empty state if no matches today
          else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No matches scheduled today.'));
          }

          // 4. Build the list of real matches
          final matches = snapshot.data!;

          return ListView.builder(
            padding: const EdgeInsets.all(16.0),
            itemCount: matches.length,
itemBuilder: (context, index) {
              final match = matches[index];
              final homeTeam = match['homeTeam']['name'];
              final awayTeam = match['awayTeam']['name'];
              final matchId = match['id'];
              
              // NEW: Parse the match date to display it nicely
              final matchTime = DateTime.parse(match['utcDate']).toLocal();
              final timeString = "${matchTime.day}/${matchTime.month} • ${matchTime.hour.toString().padLeft(2, '0')}:${matchTime.minute.toString().padLeft(2, '0')}";

              return Card(
                margin: const EdgeInsets.only(bottom: 16.0),
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    children:[
                      // Updated: Shows Competition Name + The Date and Time
                      Text(
                        '${match['competition']['name']}  |  $timeString', 
                        style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)
                      ),
                      const SizedBox(height: 16),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children:[
                          Expanded(child: Text(homeTeam, textAlign: TextAlign.center, style: const TextStyle(fontWeight: FontWeight.bold))),
                          const Text(' VS ', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.red)),
                          Expanded(child: Text(awayTeam, textAlign: TextAlign.center, style: const TextStyle(fontWeight: FontWeight.bold))),
                        ],
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: () {
                          // Pass ID and team names to betting screen
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => BettingScreen(
                                matchId: match['id'],
                                homeTeam: match['homeTeam']['name'],
                                awayTeam: match['awayTeam']['name'],
                                status: match['status'], // <--- ADD THIS LINE
                              ),
                            ),
                          );
                        }, 
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.redAccent,
                          foregroundColor: Colors.white,
                        ),
                        child: const Text('Place Virtual Bet'),
                      )
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}