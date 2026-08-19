import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/foundation.dart';

/// Enhanced Platform API Service with caching, offline support, and error handling
class PlatformApiServiceEnhanced extends ChangeNotifier {
  // Base URLs
  static const String lendsqrBaseUrl = 'http://10.0.2.2:5030/api';
  static const String fingerluxBaseUrl = 'http://10.0.2.2:5028/api';
  static const String fingerwarsBaseUrl = 'http://10.0.2.2:5032/api';
  static const String gameonBaseUrl = 'http://10.0.2.2:5025/api';
  static const String nyscBaseUrl = 'http://10.0.2.2:5027/api';
  static const String luminaBaseUrl = 'http://10.0.2.2:5040/api/lumina';

  // Cache configuration
  static const Duration defaultCacheDuration = Duration(minutes: 5);
  static const Duration longCacheDuration = Duration(hours: 1);
  
  String? _authToken;
  bool _isOffline = false;
  Map<String, _CacheEntry> _cache = {};

  // Get authentication headers
  Map<String, String> get _authHeaders {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (_authToken != null) 'Authorization': 'Bearer $_authToken',
    };
  }

  void setAuthToken(String? token) {
    _authToken = token;
    notifyListeners();
  }

  bool get isOffline => _isOffline;

  // ==================== CONNECTIVITY CHECK ====================

  Future<bool> checkConnectivity() async {
    try {
      final connectivity = await Connectivity().checkConnectivity();
      _isOffline = connectivity == ConnectivityResult.none;
      notifyListeners();
      return !_isOffline;
    } catch (e) {
      _isOffline = true;
      notifyListeners();
      return false;
    }
  }

  // ==================== CACHING ====================

  Future<void> _saveToCache(String key, dynamic data, Duration duration) async {
    final prefs = await SharedPreferences.getInstance();
    final entry = _CacheEntry(
      data: data,
      expiresAt: DateTime.now().add(duration),
    );
    await prefs.setString(key, jsonEncode(entry.toJson()));
    _cache[key] = entry;
  }

  Future<dynamic> _getFromCache(String key) async {
    // Check memory cache first
    if (_cache.containsKey(key)) {
      final entry = _cache[key]!;
      if (entry.isValid) {
        return entry.data;
      } else {
        _cache.remove(key);
      }
    }

    // Check persistent cache
    final prefs = await SharedPreferences.getInstance();
    final cached = prefs.getString(key);
    if (cached != null) {
      try {
        final entry = _CacheEntry.fromJson(jsonDecode(cached));
        if (entry.isValid) {
          _cache[key] = entry; // Restore to memory cache
          return entry.data;
        }
      } catch (e) {
        await prefs.remove(key);
      }
    }
    return null;
  }

  Future<void> _clearCache(String key) async {
    _cache.remove(key);
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(key);
  }

  Future<void> clearAllCache() async {
    _cache.clear();
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }

  // ==================== ERROR HANDLING ====================

  ApiResult<T> _handleError<T>(String operation, dynamic error) {
    debugPrint('❌ $operation failed: $error');
    
    if (error is http.ClientException) {
      return ApiResult.error(
        errorCode: ErrorCode.networkError,
        message: 'Network error: ${error.message}',
      );
    }
    
    return ApiResult.error(
      errorCode: ErrorCode.unknown,
      message: 'An error occurred: $error',
    );
  }

  ApiResult<T> _handleHttpResponse<T>(http.Response response, String operation) {
    try {
      final data = jsonDecode(response.body);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return ApiResult.success(data);
      } else if (response.statusCode == 401) {
        _authToken = null;
        notifyListeners();
        return ApiResult.error(
          errorCode: ErrorCode.unauthorized,
          message: 'Authentication failed. Please login again.',
        );
      } else if (response.statusCode == 403) {
        return ApiResult.error(
          errorCode: ErrorCode.forbidden,
          message: 'Access denied',
        );
      } else if (response.statusCode == 404) {
        return ApiResult.error(
          errorCode: ErrorCode.notFound,
          message: 'Resource not found',
        );
      } else {
        return ApiResult.error(
          errorCode: ErrorCode.apiError,
          message: data['message'] ?? data['error'] ?? 'Operation failed',
          data: data,
        );
      }
    } catch (e) {
      return _handleError(operation, e);
    }
  }

  // ==================== LENDSQR API WITH CACHING ====================

  Future<ApiResult<List>> getLoans({
    String? status,
    int page = 1,
    int limit = 10,
    bool useCache = true,
  }) async {
    try {
      // Check connectivity
      if (!await checkConnectivity()) {
        // Try cache
        if (useCache) {
          final cached = await _getFromCache('lendsqr_loans_$status');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(
          errorCode: ErrorCode.offline,
          message: 'No internet connection',
        );
      }

      final queryParams = {
        'page': page.toString(),
        'limit': limit.toString(),
        if (status != null) 'status': status,
      };
      final uri = Uri.parse('$lendsqrBaseUrl/loans').replace(
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );

      final response = await http.get(uri, headers: _authHeaders).timeout(
        const Duration(seconds: 30),
      );

      final result = _handleHttpResponse<List>(response, 'getLoans');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('lendsqr_loans_$status', result.data, defaultCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getLoans', e);
    }
  }

  Future<ApiResult<Map>> getLoanById(String loanId, {bool useCache = true}) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('lendsqr_loan_$loanId');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$lendsqrBaseUrl/loans/$loanId'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<Map>(response, 'getLoanById');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('lendsqr_loan_$loanId', result.data, longCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getLoanById', e);
    }
  }

  Future<ApiResult<Map>> createLoan({
    required String loanType,
    required double amount,
    required int tenure,
    required String purpose,
    String? collateralId,
  }) async {
    try {
      if (!await checkConnectivity()) {
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

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
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<Map>(response, 'createLoan');
      
      if (result.isSuccess) {
        await _clearCache('lendsqr_loans_null');
      }

      return result;
    } catch (e) {
      return _handleError('createLoan', e);
    }
  }

  Future<ApiResult<Map>> cancelLoan(String loanId) async {
    try {
      if (!await checkConnectivity()) {
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.put(
        Uri.parse('$lendsqrBaseUrl/loans/$loanId/cancel'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<Map>(response, 'cancelLoan');
      
      if (result.isSuccess) {
        await _clearCache('lendsqr_loans_null');
        await _clearCache('lendsqr_loan_$loanId');
      }

      return result;
    } catch (e) {
      return _handleError('cancelLoan', e);
    }
  }

  Future<ApiResult<Map>> makeRepayment({
    required String loanId,
    required double amount,
  }) async {
    try {
      if (!await checkConnectivity()) {
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.post(
        Uri.parse('$lendsqrBaseUrl/repayments'),
        headers: _authHeaders,
        body: jsonEncode({
          'loanId': loanId,
          'amount': amount,
        }),
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<Map>(response, 'makeRepayment');
      
      if (result.isSuccess) {
        await _clearCache('lendsqr_repayments_$loanId');
      }

      return result;
    } catch (e) {
      return _handleError('makeRepayment', e);
    }
  }

  Future<ApiResult<List>> getRepayments(String loanId, {bool useCache = true}) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('lendsqr_repayments_$loanId');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$lendsqrBaseUrl/repayments/loan/$loanId'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<List>(response, 'getRepayments');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('lendsqr_repayments_$loanId', result.data, defaultCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getRepayments', e);
    }
  }

  Future<ApiResult<List>> getCreditScores({bool useCache = true}) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('lendsqr_credit_scores');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$lendsqrBaseUrl/credit-scores'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<List>(response, 'getCreditScores');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('lendsqr_credit_scores', result.data, defaultCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getCreditScores', e);
    }
  }

  Future<ApiResult<Map>> getCurrentCreditScore({bool useCache = true}) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('lendsqr_current_credit_score');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$lendsqrBaseUrl/credit-scores/current'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<Map>(response, 'getCurrentCreditScore');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('lendsqr_current_credit_score', result.data, defaultCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getCurrentCreditScore', e);
    }
  }

  // ==================== FINGERLUX API ====================

  Future<ApiResult<List>> getLuxuryServices({bool useCache = true}) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('fingerlux_services');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$fingerluxBaseUrl/services'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<List>(response, 'getLuxuryServices');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('fingerlux_services', result.data, longCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getLuxuryServices', e);
    }
  }

  Future<ApiResult<Map>> createLuxuryBooking({
    required int serviceId,
    required DateTime date,
    required TimeOfDay time,
    int guests = 1,
    String? specialRequests,
  }) async {
    try {
      if (!await checkConnectivity()) {
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

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
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<Map>(response, 'createLuxuryBooking');
      
      if (result.isSuccess) {
        await _clearCache('fingerlux_bookings');
      }

      return result;
    } catch (e) {
      return _handleError('createLuxuryBooking', e);
    }
  }

  Future<ApiResult<List>> getLuxuryBookings({bool useCache = true}) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('fingerlux_bookings');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$fingerluxBaseUrl/bookings'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<List>(response, 'getLuxuryBookings');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('fingerlux_bookings', result.data, defaultCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getLuxuryBookings', e);
    }
  }

  // ==================== FINGERWARS API ====================

  Future<ApiResult<List>> getGames({bool useCache = true}) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('fingerwars_games');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$fingerwarsBaseUrl/games'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<List>(response, 'getGames');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('fingerwars_games', result.data, longCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getGames', e);
    }
  }

  Future<ApiResult<Map>> createGameSession({
    required int gameId,
    String mode = 'single',
    double betAmount = 0,
  }) async {
    try {
      if (!await checkConnectivity()) {
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.post(
        Uri.parse('$fingerwarsBaseUrl/sessions'),
        headers: _authHeaders,
        body: jsonEncode({
          'gameId': gameId,
          'mode': mode,
          'betAmount': betAmount,
        }),
      ).timeout(const Duration(seconds: 30));

      return _handleHttpResponse<Map>(response, 'createGameSession');
    } catch (e) {
      return _handleError('createGameSession', e);
    }
  }

  Future<ApiResult<List>> getGameSessions({bool useCache = true}) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('fingerwars_sessions');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$fingerwarsBaseUrl/sessions'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<List>(response, 'getGameSessions');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('fingerwars_sessions', result.data, defaultCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getGameSessions', e);
    }
  }

  Future<ApiResult<Map>> submitLeaderboardScore({
    required String sessionId,
    required int score,
    Map<String, dynamic>? metadata,
  }) async {
    try {
      if (!await checkConnectivity()) {
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.post(
        Uri.parse('$fingerwarsBaseUrl/leaderboards/submit'),
        headers: _authHeaders,
        body: jsonEncode({
          'sessionId': sessionId,
          'score': score,
          if (metadata != null) 'metadata': metadata,
        }),
      ).timeout(const Duration(seconds: 30));

      return _handleHttpResponse<Map>(response, 'submitLeaderboardScore');
    } catch (e) {
      return _handleError('submitLeaderboardScore', e);
    }
  }

  Future<ApiResult<List>> getLeaderboard(int gameId, {bool useCache = true}) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('fingerwars_leaderboard_$gameId');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$fingerwarsBaseUrl/leaderboards/$gameId'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<List>(response, 'getLeaderboard');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('fingerwars_leaderboard_$gameId', result.data, Duration(minutes: 1));
      }

      return result;
    } catch (e) {
      return _handleError('getLeaderboard', e);
    }
  }

  // ==================== GAMEON API ====================

  Future<ApiResult<List>> getEvents({
    String? sport,
    String? status,
    String? date,
    bool useCache = true,
  }) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('gameon_events_${sport}_$status');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final queryParams = {
        if (sport != null) 'sport': sport,
        if (status != null) 'status': status,
        if (date != null) 'date': date,
      };
      final uri = Uri.parse('$gameonBaseUrl/events').replace(
        queryParameters: queryParams.isNotEmpty ? queryParams : null,
      );

      final response = await http.get(uri, headers: _authHeaders).timeout(
        const Duration(seconds: 30),
      );

      final result = _handleHttpResponse<List>(response, 'getEvents');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('gameon_events_${sport}_$status', result.data, defaultCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getEvents', e);
    }
  }

  Future<ApiResult<Map>> bookEventTickets({
    required int eventId,
    required String ticketType,
    required int quantity,
  }) async {
    try {
      if (!await checkConnectivity()) {
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.post(
        Uri.parse('$gameonBaseUrl/bookings'),
        headers: _authHeaders,
        body: jsonEncode({
          'eventId': eventId,
          'ticketType': ticketType,
          'quantity': quantity,
        }),
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<Map>(response, 'bookEventTickets');
      
      if (result.isSuccess) {
        await _clearCache('gameon_bookings');
      }

      return result;
    } catch (e) {
      return _handleError('bookEventTickets', e);
    }
  }

  Future<ApiResult<List>> getEventBookings({bool useCache = true}) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('gameon_bookings');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$gameonBaseUrl/bookings'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<List>(response, 'getEventBookings');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('gameon_bookings', result.data, defaultCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getEventBookings', e);
    }
  }

  Future<ApiResult<List>> getTeams({bool useCache = true}) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('gameon_teams');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$gameonBaseUrl/teams'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<List>(response, 'getTeams');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('gameon_teams', result.data, longCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getTeams', e);
    }
  }

  // ==================== NYSC API ====================

  Future<ApiResult<Map>> getNyscProfile({bool useCache = true}) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('nysc_profile');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$nyscBaseUrl/members/profile'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<Map>(response, 'getNyscProfile');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('nysc_profile', result.data, longCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getNyscProfile', e);
    }
  }

  Future<ApiResult<List>> getNyscActivities({bool useCache = true}) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('nysc_activities');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$nyscBaseUrl/activities'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<List>(response, 'getNyscActivities');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('nysc_activities', result.data, defaultCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getNyscActivities', e);
    }
  }

  Future<ApiResult<Map>> submitNyscActivity({
    required String activityType,
    required String description,
    required int hours,
  }) async {
    try {
      if (!await checkConnectivity()) {
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.post(
        Uri.parse('$nyscBaseUrl/activities/submit'),
        headers: _authHeaders,
        body: jsonEncode({
          'activityType': activityType,
          'description': description,
          'hours': hours,
        }),
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<Map>(response, 'submitNyscActivity');
      
      if (result.isSuccess) {
        await _clearCache('nysc_activities');
      }

      return result;
    } catch (e) {
      return _handleError('submitNyscActivity', e);
    }
  }

  Future<ApiResult<List>> getNyscAllowance({bool useCache = true}) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('nysc_allowance');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$nyscBaseUrl/allowance'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<List>(response, 'getNyscAllowance');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('nysc_allowance', result.data, defaultCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getNyscAllowance', e);
    }
  }

  Future<ApiResult<List>> getNyscDocuments({bool useCache = true}) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('nysc_documents');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$nyscBaseUrl/documents'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<List>(response, 'getNyscDocuments');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('nysc_documents', result.data, longCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getNyscDocuments', e);
    }
  }

  // ==================== LUMINA GALLERY API ====================

  Future<ApiResult<List>> getLuminaAssets({
    int page = 1,
    int limit = 10,
    bool useCache = true,
  }) async {
    try {
      if (!await checkConnectivity()) {
        if (useCache) {
          final cached = await _getFromCache('lumina_assets_$page');
          if (cached != null) {
            return ApiResult.success(cached);
          }
        }
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$luminaBaseUrl/my-assets?page=$page&limit=$limit'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = _handleHttpResponse<List>(response, 'getLuminaAssets');
      
      if (result.isSuccess && useCache) {
        await _saveToCache('lumina_assets_$page', result.data, defaultCacheDuration);
      }

      return result;
    } catch (e) {
      return _handleError('getLuminaAssets', e);
    }
  }

  Future<ApiResult<Map>> transcodeLuminaMedia({
    required String fileId,
    String format = 'mp4',
    String quality = 'high',
    String? resolution,
  }) async {
    try {
      if (!await checkConnectivity()) {
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.post(
        Uri.parse('$luminaBaseUrl/transcode'),
        headers: _authHeaders,
        body: jsonEncode({
          'fileId': fileId,
          'format': format,
          'quality': quality,
          if (resolution != null) 'resolution': resolution,
        }),
      ).timeout(const Duration(seconds: 30));

      return _handleHttpResponse<Map>(response, 'transcodeLuminaMedia');
    } catch (e) {
      return _handleError('transcodeLuminaMedia', e);
    }
  }

  Future<ApiResult<Map>> applyLuminaFilter({
    required String fileId,
    required String filter,
    double intensity = 1.0,
  }) async {
    try {
      if (!await checkConnectivity()) {
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.post(
        Uri.parse('$luminaBaseUrl/apply-filter'),
        headers: _authHeaders,
        body: jsonEncode({
          'fileId': fileId,
          'filter': filter,
          'intensity': intensity,
        }),
      ).timeout(const Duration(seconds: 30));

      return _handleHttpResponse<Map>(response, 'applyLuminaFilter');
    } catch (e) {
      return _handleError('applyLuminaFilter', e);
    }
  }

  Future<ApiResult<bool>> deleteLuminaMedia(String fileId) async {
    try {
      if (!await checkConnectivity()) {
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.delete(
        Uri.parse('$luminaBaseUrl/files/$fileId'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      final result = response.statusCode == 200;
      
      if (result) {
        await _clearCache('lumina_assets_1');
        await _clearCache('lumina_file_$fileId');
      }

      return ApiResult.success(result);
    } catch (e) {
      return _handleError('deleteLuminaMedia', e);
    }
  }

  Future<ApiResult<Map>> getLuminaJobStatus(String jobId) async {
    try {
      if (!await checkConnectivity()) {
        return ApiResult.error(errorCode: ErrorCode.offline, message: 'No internet connection');
      }

      final response = await http.get(
        Uri.parse('$luminaBaseUrl/jobs/$jobId'),
        headers: _authHeaders,
      ).timeout(const Duration(seconds: 30));

      return _handleHttpResponse<Map>(response, 'getLuminaJobStatus');
    } catch (e) {
      return _handleError('getLuminaJobStatus', e);
    }
  }

  // ==================== UTILITY METHODS ====================

  Future<void> preloadCriticalData() async {
    // Preload frequently accessed data
    await getLuxuryServices();
    await getGames();
    await getTeams();
    await getNyscProfile();
  }

  void clearServiceCache(String service) {
    final keys = _cache.keys.where((k) => k.startsWith(service)).toList();
    for (final key in keys) {
      _cache.remove(key);
    }
  }
}

// ==================== HELPER CLASSES ====================

class _CacheEntry {
  final dynamic data;
  final DateTime expiresAt;

  _CacheEntry({
    required this.data,
    required this.expiresAt,
  });

  bool get isValid => DateTime.now().isBefore(expiresAt);

  Map<String, dynamic> toJson() => {
        'data': data,
        'expiresAt': expiresAt.toIso8601String(),
      };

  factory _CacheEntry.fromJson(Map<String, dynamic> json) {
    return _CacheEntry(
      data: json['data'],
      expiresAt: DateTime.parse(json['expiresAt']),
    );
  }
}

enum ErrorCode {
  success,
  networkError,
  offline,
  unauthorized,
  forbidden,
  notFound,
  apiError,
  unknown,
}

class ApiResult<T> {
  final bool isSuccess;
  final T? data;
  final ErrorCode? errorCode;
  final String? message;

  ApiResult.success(this.data)
      : isSuccess = true,
        errorCode = ErrorCode.success,
        message = null;

  ApiResult.error({
    required this.errorCode,
    required this.message,
    this.data,
  }) : isSuccess = false;

  @override
  String toString() {
    if (isSuccess) {
      return 'ApiResult.success($data)';
    } else {
      return 'ApiResult.error(code: $errorCode, message: $message)';
    }
  }
}
