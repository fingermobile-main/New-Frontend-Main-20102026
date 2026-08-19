import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:fingermobile_app/services/api_service.dart';

class AppProvider with ChangeNotifier {
  bool _isLoggedIn = false;
  Map<String, dynamic>? _currentUser;
  List<dynamic> _notifications = [];
  int _unreadNotificationsCount = 0;
  List<dynamic> _friendsList = [];
  List<dynamic> _feedPosts = [];
  bool _isLoading = false;
  String? _errorMessage;

  bool get isLoggedIn => _isLoggedIn;
  Map<String, dynamic>? get currentUser => _currentUser;
  List<dynamic> get notifications => _notifications;
  int get unreadNotificationsCount => _unreadNotificationsCount;
  List<dynamic> get friendsList => _friendsList;
  List<dynamic> get feedPosts => _feedPosts;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> init() async {
    _setLoading(true);
    try {
      final token = await ApiService.authToken;
      if (token != null) {
        _isLoggedIn = true;
        await loadCurrentUser();
        await refreshUserData();
      }
    } catch (e) {
      _setErrorMessage('Initialization error: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _setErrorMessage(null);
    
    try {
      final result = await ApiService.login(email, password);
      if (result != null) {
        _isLoggedIn = true;
        _currentUser = result['user'];
        await _saveUserData(result['user'], result['token']);
        await refreshUserData();
        notifyListeners();
        return true;
      }
      _setErrorMessage('Login failed');
    } catch (e) {
      _setErrorMessage('Login error: $e');
    } finally {
      _setLoading(false);
    }
    return false;
  }

  Future<bool> register(String email, String password, String username) async {
    _setLoading(true);
    _setErrorMessage(null);
    
    try {
      final result = await ApiService.register(email, password, username);
      if (result != null) {
        _isLoggedIn = true;
        _currentUser = result['user'];
        await _saveUserData(result['user'], result['token']);
        await refreshUserData();
        notifyListeners();
        return true;
      }
      _setErrorMessage('Registration failed');
    } catch (e) {
      _setErrorMessage('Registration error: $e');
    } finally {
      _setLoading(false);
    }
    return false;
  }

  Future<void> logout() async {
    await ApiService.logout();
    _isLoggedIn = false;
    _currentUser = null;
    _notifications = [];
    _unreadNotificationsCount = 0;
    _friendsList = [];
    _feedPosts = [];
    
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    
    notifyListeners();
  }

  Future<void> _saveUserData(Map<String, dynamic> user, String token) async {
    final prefs = await SharedPreferences.getInstance();
    if (user.containsKey('id')) {
      await prefs.setInt('member_id', user['id']);
    }
    if (user.containsKey('username')) {
      await prefs.setString('username', user['username']);
    }
    if (user.containsKey('email')) {
      await prefs.setString('email', user['email']);
    }
  }

  Future<void> loadCurrentUser() async {
    try {
      final userData = await ApiService.getMemberProfile();
      if (userData != null) {
        _currentUser = userData;
        notifyListeners();
      }
    } catch (e) {
      print('Error loading current user: $e');
    }
  }

  Future<void> loadNotifications() async {
    try {
      final notificationData = await ApiService.getNotifications();
      if (notificationData != null) {
        _notifications = notificationData;
        _unreadNotificationsCount = 
            notificationData.where((n) => n['read'] == false).length;
        notifyListeners();
      }
    } catch (e) {
      print('Error loading notifications: $e');
    }
  }

  Future<void> loadFriendsList() async {
    try {
      final friendsData = await ApiService.getFriends();
      if (friendsData != null) {
        _friendsList = friendsData;
        notifyListeners();
      }
    } catch (e) {
      print('Error loading friends list: $e');
    }
  }

  Future<void> loadFeed() async {
    try {
      final feedData = await ApiService.getFeed();
      if (feedData != null && feedData.containsKey('posts')) {
        _feedPosts = List.from(feedData['posts']);
        notifyListeners();
      }
    } catch (e) {
      print('Error loading feed: $e');
    }
  }

  Future<bool> updateProfile(Map<String, dynamic> profileData) async {
    _setLoading(true);
    _setErrorMessage(null);
    
    try {
      final result = await ApiService.updateUserProfile(profileData);
      if (result != null) {
        _currentUser = result;
        notifyListeners();
        return true;
      }
      _setErrorMessage('Profile update failed');
    } catch (e) {
      _setErrorMessage('Error updating profile: $e');
    } finally {
      _setLoading(false);
    }
    return false;
  }

  Future<bool> sendFriendRequest(int userId) async {
    _setLoading(true);
    _setErrorMessage(null);
    
    try {
      final result = await ApiService.sendFriendRequest(userId);
      if (result) {
        await loadFriendsList();
        notifyListeners();
        return true;
      }
      _setErrorMessage('Friend request failed');
    } catch (e) {
      _setErrorMessage('Error sending friend request: $e');
    } finally {
      _setLoading(false);
    }
    return false;
  }

  Future<bool> toggleLike(int postId) async {
    _setLoading(true);
    _setErrorMessage(null);
    
    try {
      final result = await ApiService.likePost(postId);
      if (result) {
        await loadFeed();
        notifyListeners();
        return true;
      }
      _setErrorMessage('Like action failed');
    } catch (e) {
      _setErrorMessage('Error toggling like: $e');
    } finally {
      _setLoading(false);
    }
    return false;
  }

  Future<bool> createPost(Map<String, dynamic> postData) async {
    _setLoading(true);
    _setErrorMessage(null);
    
    try {
      final result = await ApiService.createPost(postData);
      if (result != null) {
        await loadFeed();
        notifyListeners();
        return true;
      }
      _setErrorMessage('Post creation failed');
    } catch (e) {
      _setErrorMessage('Error creating post: $e');
    } finally {
      _setLoading(false);
    }
    return false;
  }

  Future<void> refreshUserData() async {
    await loadCurrentUser();
    await loadNotifications();
    await loadFriendsList();
    await loadFeed();
    notifyListeners();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setErrorMessage(String? message) {
    _errorMessage = message;
    notifyListeners();
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  Future<void> clearNotifications() async {
    _unreadNotificationsCount = 0;
    notifyListeners();
  }

  Future<bool> markNotificationAsRead(String notificationId) async {
    try {
      await ApiService.put('/notifications/$notificationId/read', {});
      await refreshNotificationCount();
      return true;
    } catch (e) {
      print('Error marking notification as read: $e');
      return false;
    }
  }

  Future<void> refreshNotificationCount() async {
    try {
      // ApiService doesn't have getUnreadNotificationCount, using getNotifications instead or assuming it's part of getNotifications
      final result = await ApiService.getNotifications();
      if (result != null) {
        _unreadNotificationsCount = result.where((n) => n['read'] == false).length;
        notifyListeners();
      }
    } catch (e) {
      print('Error refreshing notification count: $e');
    }
  }
}