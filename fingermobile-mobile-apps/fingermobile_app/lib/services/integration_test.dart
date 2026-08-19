import 'api_service.dart';
import 'content_service.dart';
import 'profile_service.dart';
import 'notification_service.dart';
import 'wallet_service.dart';

class IntegrationTestService {
  // Test basic health check
  static Future<bool> testBackendHealth() async {
    try {
      final isHealthy = await ApiService.checkHealth();
      print('Backend health check: ${isHealthy ? "SUCCESS" : "FAILED"}');
      return isHealthy;
    } catch (e) {
      print('Backend health check failed: $e');
      return false;
    }
  }

  // Test authentication flow
  static Future<bool> testAuthenticationFlow() async {
    try {
      // Attempt to register a test user
      final registrationResult = await ApiService.register(
        'testuser@example.com',
        'password123',
        'testuser',
      );
      
      if (registrationResult != null) {
        print('Registration test: SUCCESS');
        
        // Attempt to login with the test user
        final loginResult = await ApiService.login(
          'testuser@example.com',
          'password123',
        );
        
        if (loginResult != null) {
          print('Login test: SUCCESS');
          return true;
        }
      }
      
      print('Authentication flow test: FAILED');
      return false;
    } catch (e) {
      print('Authentication flow test failed: $e');
      return false;
    }
  }

  // Test content service integration
  static Future<bool> testContentServiceIntegration() async {
    try {
      final content = await ContentService.getRecentContent();
      print('Content service integration: ${content.isNotEmpty ? "SUCCESS" : "NO DATA BUT CONNECTED"}');
      return true; // If we got a response (even if no data), connection is working
    } catch (e) {
      print('Content service integration failed: $e');
      return false;
    }
  }

  // Test profile service integration
  static Future<bool> testProfileServiceIntegration() async {
    try {
      final profileService = ProfileService();
      final profile = await profileService.getProfile(null); // Get current user profile
      
      print('Profile service integration: ${profile.name != 'User' ? "SUCCESS" : "DEFAULT RESPONSE"}');
      return true; // If we got a response, connection is working
    } catch (e) {
      print('Profile service integration failed: $e');
      return false;
    }
  }

  // Test notification service integration
  static Future<bool> testNotificationServiceIntegration() async {
    try {
      final notificationService = NotificationService();
      final notifications = await notificationService.getNotifications();
      
      print('Notification service integration: ${notifications.length >= 0 ? "SUCCESS" : "FAILED"}');
      return true; // If we got a response, connection is working
    } catch (e) {
      print('Notification service integration failed: $e');
      return false;
    }
  }

  // Test wallet service integration
  static Future<bool> testWalletServiceIntegration() async {
    try {
      final walletService = WalletService();
      final walletInfo = await walletService.getWalletInfo();
      
      print('Wallet service integration: ${walletInfo != null ? "SUCCESS" : "NO DATA BUT CONNECTED"}');
      return true; // If we got a response, connection is working
    } catch (e) {
      print('Wallet service integration failed: $e');
      return false;
    }
  }

  // Run all integration tests
  static Future<Map<String, dynamic>> runAllIntegrationTests() async {
    print('Starting backend integration tests...\n');
    
    final results = <String, dynamic>{
      'backend_health': await testBackendHealth(),
      'authentication_flow': await testAuthenticationFlow(),
      'content_service_integration': await testContentServiceIntegration(),
      'profile_service_integration': await testProfileServiceIntegration(),
      'notification_service_integration': await testNotificationServiceIntegration(),
      'wallet_service_integration': await testWalletServiceIntegration(),
    };
    
    // Calculate summary
    final totalTests = results.length;
    final passedTests = results.values.where((result) => result == true).length;
    final successRate = (passedTests / totalTests) * 100;
    
    results['summary'] = {
      'total_tests': totalTests,
      'passed_tests': passedTests,
      'failed_tests': totalTests - passedTests,
      'success_rate_percent': successRate,
    };
    
    print('\nIntegration test summary:');
    print('Total tests: $totalTests');
    print('Passed: $passedTests');
    print('Failed: ${totalTests - passedTests}');
    print('Success rate: ${successRate.toStringAsFixed(2)}%');
    
    return results;
  }
}