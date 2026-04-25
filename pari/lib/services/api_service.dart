import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Replace this with your actual Vercel Proxy URL!
  static const String _proxyUrl = 'https://football-proxy-9147timzb-jean-michels-projects-8b37d3ce.vercel.app/api/proxy';

  static const Map<String, String> _headers = {
    'Content-Type': 'application/json',
  };

  // Helper method to build the proxy URL dynamically
  static Uri _buildUrl(String endpoint) {
    return Uri.parse('$_proxyUrl?endpoint=$endpoint');
  }

  // -------------------------------------------------------------------------
  // 1. Fetch all upcoming matches (FIXED RETURN TYPE)
  // -------------------------------------------------------------------------
  Future<List<Map<String, dynamic>>> fetchUpcomingMatches() async {
    final url = _buildUrl('/v4/matches');

    try {
      final response = await http.get(url, headers: _headers);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        
        // Explicitly cast the dynamic list into a List of Maps
        return List<Map<String, dynamic>>.from(data['matches'] ?? []);
      } else {
        print('Error fetching matches: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to load upcoming matches');
      }
    } catch (e) {
      print('Connection Error: $e');
      throw Exception('Connection failed: Please check your internet or proxy setup.');
    }
  }

  // -------------------------------------------------------------------------
  // 2. Fetch specific match result 
  // -------------------------------------------------------------------------
  Future<Map<String, String>?> fetchMatchResult(dynamic matchId) async {
    final url = _buildUrl('/v4/matches/$matchId');

    try {
      final response = await http.get(url, headers: _headers);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        
        // Extract the status (e.g., 'FINISHED', 'IN_PLAY', 'TIMED')
        String status = data['status']?.toString() ?? 'UNKNOWN';
        
        // Extract the winner (e.g., 'HOME_TEAM', 'AWAY_TEAM', 'DRAW')
        String winner = data['score']?['winner']?.toString() ?? 'PENDING';
        
        return {
          'status': status,
          'winner': winner,
        };
      } else {
        print('Error fetching match result: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Connection Error: $e');
      return null;
    }
  }

  // -------------------------------------------------------------------------
  // 3. Fetch specific competitions (FIXED RETURN TYPE)
  // -------------------------------------------------------------------------
  Future<List<Map<String, dynamic>>> fetchCompetitions() async {
    final url = _buildUrl('/v4/competitions');

    try {
      final response = await http.get(url, headers: _headers);

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        
        // Explicitly cast the dynamic list into a List of Maps
        return List<Map<String, dynamic>>.from(data['competitions'] ?? []);
      } else {
        throw Exception('Failed to load competitions');
      }
    } catch (e) {
      throw Exception('Connection failed');
    }
  }
}