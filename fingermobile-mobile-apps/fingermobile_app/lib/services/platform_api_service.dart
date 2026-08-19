import 'dart:convert';
import 'package:http/http.dart' as http;

/// Flutter API Service for all newly implemented backend modules
/// Includes: LendSqr, FingerLux, FingerWars, GameOn, NYSC, Lumina Gallery
class PlatformApiService {
  // Base URLs for each service
  static const String lendsqrBaseUrl = 'http://localhost:5030/api';
  static const String fingerluxBaseUrl = 'http://localhost:5028/api';
  static const String fingerwarsBaseUrl = 'http://localhost:5032/api';
  static const String gameonBaseUrl = 'http://localhost:5025/api';
  static const String nyscBaseUrl = 'http://localhost:5027/api';
  static const String luminaBaseUrl = 'http://localhost:5040/api/lumina';
  
  // Authentication token
  static String? _authToken;
  
  // Set authentication token
  static void setAuthToken(String? token) {
    _authToken = token;
  }
  
  // Get authentication headers
  static Map<String, String> get _authHeaders {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (_authToken != null) 'Authorization': 'Bearer $_authToken',
    };
  }
  
  // Get headers for multipart requests
  static Map<String, String> get _multipartHeaders {
    return {
      'Accept': 'application/json',
      if (_authToken != null) 'Authorization': 'Bearer $_authToken',
    };
  }
  
  // ==================== LENDSQR API ====================
  
  /// Get all loans for the authenticated member
  static Future<Map<String, dynamic>?> getLoans({
    String? status,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final queryParams = {
        'page': page.toString(),
        'limit': limit.toString(),
        if (status != null) 'status': status,
      };
      final uri = Uri.parse('$lendsqrBaseUrl/loans').replace(
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );
      
      final response = await http.get(uri, headers: _authHeaders);
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get loans failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get loans error: $e');
      return null;
    }
  }
  
  /// Get loan by ID
  static Future<Map<String, dynamic>?> getLoanById(String loanId) async {
    try {
      final response = await http.get(
        Uri.parse('$lendsqrBaseUrl/loans/$loanId'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get loan failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get loan error: $e');
      return null;
    }
  }
  
  /// Create a new loan application
  static Future<Map<String, dynamic>?> createLoan({
    required String loanType,
    required double amount,
    required int tenure,
    required String purpose,
    String? collateralId,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$lendsqrBaseUrl/loans'),
        headers: _authHeaders,
        body: jsonEncode({
          'loanType': loanType,
          'amount': amount,
          'tenure': tenure,
          'purpose': purpose,
          if (collateralId != null) 'collateralId': collateralId,
        }),
      );
      
      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        print('Create loan failed: ${response.statusCode} - ${response.body}');
        return null;
      }
    } catch (e) {
      print('Create loan error: $e');
      return null;
    }
  }
  
  /// Cancel a pending loan application
  static Future<Map<String, dynamic>?> cancelLoan(String loanId) async {
    try {
      final response = await http.put(
        Uri.parse('$lendsqrBaseUrl/loans/$loanId/cancel'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Cancel loan failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Cancel loan error: $e');
      return null;
    }
  }
  
  /// Make a loan repayment
  static Future<Map<String, dynamic>?> makeRepayment({
    required String loanId,
    required double amount,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$lendsqrBaseUrl/repayments'),
        headers: _authHeaders,
        body: jsonEncode({
          'loanId': loanId,
          'amount': amount,
        }),
      );
      
      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        print('Make repayment failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Make repayment error: $e');
      return null;
    }
  }
  
  /// Get repayments for a loan
  static Future<Map<String, dynamic>?> getRepayments(String loanId) async {
    try {
      final response = await http.get(
        Uri.parse('$lendsqrBaseUrl/repayments/loan/$loanId'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get repayments failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get repayments error: $e');
      return null;
    }
  }
  
  /// Get credit score history
  static Future<Map<String, dynamic>?> getCreditScores() async {
    try {
      final response = await http.get(
        Uri.parse('$lendsqrBaseUrl/credit-scores'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get credit scores failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get credit scores error: $e');
      return null;
    }
  }
  
  /// Get current credit score
  static Future<Map<String, dynamic>?> getCurrentCreditScore() async {
    try {
      final response = await http.get(
        Uri.parse('$lendsqrBaseUrl/credit-scores/current'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get current credit score failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get current credit score error: $e');
      return null;
    }
  }
  
  // ==================== FINGERLUX API ====================
  
  /// Get all luxury services
  static Future<Map<String, dynamic>?> getLuxuryServices() async {
    try {
      final cached = await http.get(
        Uri.parse('$fingerluxBaseUrl/services'),
        headers: _authHeaders,
      );
      
      if (cached.statusCode == 200) {
        return jsonDecode(cached.body);
      } else {
        print('Get luxury services failed: ${cached.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get luxury services error: $e');
      return null;
    }
  }
  
  /// Create a luxury service booking
  static Future<Map<String, dynamic>?> createLuxuryBooking({
    required int serviceId,
    required DateTime date,
    required TimeOfDay time,
    int guests = 1,
    String? specialRequests,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$fingerluxBaseUrl/bookings'),
        headers: _authHeaders,
        body: jsonEncode({
          'serviceId': serviceId,
          'date': date.toIso8601String().split('T')[0],
          'time': '${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}',
          'guests': guests,
          'specialRequests': specialRequests,
        }),
      );
      
      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        print('Create luxury booking failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Create luxury booking error: $e');
      return null;
    }
  }
  
  /// Get member bookings
  static Future<Map<String, dynamic>?> getLuxuryBookings() async {
    try {
      final response = await http.get(
        Uri.parse('$fingerluxBaseUrl/bookings'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get luxury bookings failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get luxury bookings error: $e');
      return null;
    }
  }
  
  // ==================== FINGERWARS API ====================
  
  /// Get all games
  static Future<Map<String, dynamic>?> getGames() async {
    try {
      final response = await http.get(
        Uri.parse('$fingerwarsBaseUrl/games'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get games failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get games error: $e');
      return null;
    }
  }
  
  /// Create a game session
  static Future<Map<String, dynamic>?> createGameSession({
    required int gameId,
    String mode = 'single',
    double betAmount = 0,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$fingerwarsBaseUrl/sessions'),
        headers: _authHeaders,
        body: jsonEncode({
          'gameId': gameId,
          'mode': mode,
          'betAmount': betAmount,
        }),
      );
      
      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        print('Create game session failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Create game session error: $e');
      return null;
    }
  }
  
  /// Get member game sessions
  static Future<Map<String, dynamic>?> getGameSessions() async {
    try {
      final response = await http.get(
        Uri.parse('$fingerwarsBaseUrl/sessions'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get game sessions failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get game sessions error: $e');
      return null;
    }
  }
  
  /// Submit score to leaderboard
  static Future<Map<String, dynamic>?> submitLeaderboardScore({
    required String sessionId,
    required int score,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$fingerwarsBaseUrl/leaderboards/submit'),
        headers: _authHeaders,
        body: jsonEncode({
          'sessionId': sessionId,
          'score': score,
          if (metadata != null) 'metadata': metadata,
        }),
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Submit score failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Submit score error: $e');
      return null;
    }
  }
  
  /// Get leaderboard for a game
  static Future<Map<String, dynamic>?> getLeaderboard(int gameId) async {
    try {
      final response = await http.get(
        Uri.parse('$fingerwarsBaseUrl/leaderboards/$gameId'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get leaderboard failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get leaderboard error: $e');
      return null;
    }
  }
  
  // ==================== GAMEON API ====================
  
  /// Get all events
  static Future<Map<String, dynamic>?> getEvents({
    String? sport,
    String? status,
    String? date,
  }) async {
    try {
      final queryParams = {
        if (sport != null) 'sport': sport,
        if (status != null) 'status': status,
        if (date != null) 'date': date,
      };
      final uri = Uri.parse('$gameonBaseUrl/events').replace(
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );
      
      final response = await http.get(uri, headers: _authHeaders);
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get events failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get events error: $e');
      return null;
    }
  }
  
  /// Get event by ID
  static Future<Map<String, dynamic>?> getEvent(int eventId) async {
    try {
      final response = await http.get(
        Uri.parse('$gameonBaseUrl/events/$eventId'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get event failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get event error: $e');
      return null;
    }
  }
  
  /// Book event tickets
  static Future<Map<String, dynamic>?> bookEventTickets({
    required int eventId,
    required String ticketType,
    required int quantity,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$gameonBaseUrl/bookings'),
        headers: _authHeaders,
        body: jsonEncode({
          'eventId': eventId,
          'ticketType': ticketType,
          'quantity': quantity,
        }),
      );
      
      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        print('Book tickets failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Book tickets error: $e');
      return null;
    }
  }
  
  /// Get member bookings
  static Future<Map<String, dynamic>?> getEventBookings() async {
    try {
      final response = await http.get(
        Uri.parse('$gameonBaseUrl/bookings'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get event bookings failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get event bookings error: $e');
      return null;
    }
  }
  
  /// Get all teams
  static Future<Map<String, dynamic>?> getTeams() async {
    try {
      final response = await http.get(
        Uri.parse('$gameonBaseUrl/teams'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get teams failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get teams error: $e');
      return null;
    }
  }
  
  // ==================== NYSC API ====================
  
  /// Get corps member profile
  static Future<Map<String, dynamic>?> getNyscProfile() async {
    try {
      final response = await http.get(
        Uri.parse('$nyscBaseUrl/members/profile'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get NYSC profile failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get NYSC profile error: $e');
      return null;
    }
  }
  
  /// Get weekly activities
  static Future<Map<String, dynamic>?> getNyscActivities() async {
    try {
      final response = await http.get(
        Uri.parse('$nyscBaseUrl/activities'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get NYSC activities failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get NYSC activities error: $e');
      return null;
    }
  }
  
  /// Submit weekly activity
  static Future<Map<String, dynamic>?> submitNyscActivity({
    required String activityType,
    required String description,
    required int hours,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$nyscBaseUrl/activities/submit'),
        headers: _authHeaders,
        body: jsonEncode({
          'activityType': activityType,
          'description': description,
          'hours': hours,
        }),
      );
      
      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        print('Submit NYSC activity failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Submit NYSC activity error: $e');
      return null;
    }
  }
  
  /// Get allowance history
  static Future<Map<String, dynamic>?> getNyscAllowance() async {
    try {
      final response = await http.get(
        Uri.parse('$nyscBaseUrl/allowance'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get NYSC allowance failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get NYSC allowance error: $e');
      return null;
    }
  }
  
  /// Get member documents
  static Future<Map<String, dynamic>?> getNyscDocuments() async {
    try {
      final response = await http.get(
        Uri.parse('$nyscBaseUrl/documents'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get NYSC documents failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get NYSC documents error: $e');
      return null;
    }
  }
  
  // ==================== LUMINA GALLERY API ====================
  
  /// Upload media file
  static Future<Map<String, dynamic>?> uploadLuminaMedia({
    required String filePath,
    String? title,
    String? description,
    List<String>? tags,
  }) async {
    try {
      // Note: For actual implementation, use http.MultipartRequest
      // This is a simplified version
      print('Upload media: $filePath');
      return null;
    } catch (e) {
      print('Upload media error: $e');
      return null;
    }
  }
  
  /// Get user media assets
  static Future<Map<String, dynamic>?> getLuminaAssets({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$luminaBaseUrl/my-assets?page=$page&limit=$limit'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get Lumina assets failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get Lumina assets error: $e');
      return null;
    }
  }
  
  /// Get media file by ID
  static Future<Map<String, dynamic>?> getLuminaMedia(String fileId) async {
    try {
      final response = await http.get(
        Uri.parse('$luminaBaseUrl/files/$fileId'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get Lumina media failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get Lumina media error: $e');
      return null;
    }
  }
  
  /// Request video transcoding
  static Future<Map<String, dynamic>?> transcodeLuminaMedia({
    required String fileId,
    String format = 'mp4',
    String quality = 'high',
    String? resolution,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$luminaBaseUrl/transcode'),
        headers: _authHeaders,
        body: jsonEncode({
          'fileId': fileId,
          'format': format,
          'quality': quality,
          if (resolution != null) 'resolution': resolution,
        }),
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Transcode media failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Transcode media error: $e');
      return null;
    }
  }
  
  /// Apply filter to media
  static Future<Map<String, dynamic>?> applyLuminaFilter({
    required String fileId,
    required String filter,
    double intensity = 1.0,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$luminaBaseUrl/apply-filter'),
        headers: _authHeaders,
        body: jsonEncode({
          'fileId': fileId,
          'filter': filter,
          'intensity': intensity,
        }),
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Apply filter failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Apply filter error: $e');
      return null;
    }
  }
  
  /// Delete media file
  static Future<bool> deleteLuminaMedia(String fileId) async {
    try {
      final response = await http.delete(
        Uri.parse('$luminaBaseUrl/files/$fileId'),
        headers: _authHeaders,
      );
      
      return response.statusCode == 200;
    } catch (e) {
      print('Delete media error: $e');
      return false;
    }
  }
  
  /// Get FFmpeg job status
  static Future<Map<String, dynamic>?> getLuminaJobStatus(String jobId) async {
    try {
      final response = await http.get(
        Uri.parse('$luminaBaseUrl/jobs/$jobId'),
        headers: _authHeaders,
      );
      
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        print('Get job status failed: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Get job status error: $e');
      return null;
    }
  }
}
