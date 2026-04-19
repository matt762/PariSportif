import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_dotenv/flutter_dotenv.dart'; // 1. Import dotenv

class ApiService {
  // 2. Fetch the API key securely from the .env file.
  // Using a getter ensures it reads the loaded environment variables.
  static String get _apiKey => dotenv.env['API_FOOTBALL_KEY'] ?? 'KEY_NOT_FOUND'; 
  
  static const String _baseUrl = 'https://api.football-data.org/v4';

  // Fetch upcoming matches (Today + Next 3 Days)
  Future<List<Map<String, dynamic>>> fetchUpcomingMatches() async {
    try {
      // 1. Calculate dates to get a good batch of games
      final now = DateTime.now();
      final inThreeDays = now.add(const Duration(days: 3));
      
      // Format dates to YYYY-MM-DD for the API
      final todayStr = "${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}";
      final endStr = "${inThreeDays.year}-${inThreeDays.month.toString().padLeft(2, '0')}-${inThreeDays.day.toString().padLeft(2, '0')}";

      final response = await http.get(
        // 2. Add the date parameters to the URL
        Uri.parse('$_baseUrl/matches?dateFrom=$todayStr&dateTo=$endStr'),
        headers: {'X-Auth-Token': _apiKey}, // This now uses the secured key
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final List<dynamic> matchesList = data['matches'];
        
        // 3. Filter the list to ONLY keep future matches
        final futureMatches = matchesList.where((m) {
          final match = m as Map<String, dynamic>;
          
          // Convert the API's UTC match time to your local time
          final matchTime = DateTime.parse(match['utcDate']).toLocal();
          
          // Check if the match is in the future AND hasn't started yet
          final isFuture = matchTime.isAfter(now);
          final isScheduled = match['status'] == 'SCHEDULED' || match['status'] == 'TIMED';
          
          return isFuture && isScheduled;
        }).map((m) => m as Map<String, dynamic>).toList();

        return futureMatches;
      } else {
        print('API Error: ${response.statusCode}'); 
        print('Error Details: ${response.body}'); // <-- Add this line!
        return [];
      }
    } catch (e) {
      print('Network Error: $e');
      return[];
    }
  }

  // Fetch a single match result and score to resolve bets
  Future<Map<String, String>?> fetchMatchResult(int matchId) async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/matches/$matchId'),
        headers: {'X-Auth-Token': _apiKey}, // This now uses the secured key
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        
        if (data['status'] == 'FINISHED') {
          // Grab the actual goals scored
          final homeGoals = data['score']['fullTime']['home'];
          final awayGoals = data['score']['fullTime']['away'];
          
          return {
            'winner': data['score']['winner'], // 'HOME_TEAM', 'AWAY_TEAM', 'DRAW'
            'score': '$homeGoals - $awayGoals', // e.g., "2 - 1"
          };
        }
      }
      return null;
    } catch (e) {
      print('Result Error: $e');
      return null;
    }
  }
}