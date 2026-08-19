import 'package:fingermobile_app/services/content_service.dart';
import 'package:fingermobile_app/services/platform_service.dart';

class TestingService {
  // Test content loading
  static Future<bool> testContentLoading() async {
    try {
      final content = await ContentService.getRecentContent();
      return content.isNotEmpty;
    } catch (e) {
      return false;
    }
  }

  // Test marketplace loading
  static Future<bool> testMarketplaceLoading() async {
    try {
      final items = await ContentService.getMarketplaceItems();
      return items.isNotEmpty;
    } catch (e) {
      return false;
    }
  }

  // Test financial data loading
  static Future<bool> testFinancialDataLoading() async {
    try {
      final summary = await ContentService.getFinancialSummary();
      return summary != null;
    } catch (e) {
      return false;
    }
  }

  // Test platform configurations
  static Future<bool> testPlatformConfigurations() async {
    try {
      final platforms = PlatformService.getAvailablePlatforms();
      return platforms.isNotEmpty;
    } catch (e) {
      return false;
    }
  }

  // Run all tests
  static Future<Map<String, bool>> runAllTests() async {
    return {
      'content_loading': await testContentLoading(),
      'marketplace_loading': await testMarketplaceLoading(),
      'financial_data_loading': await testFinancialDataLoading(),
      'platform_configurations': await testPlatformConfigurations(),
    };
  }

  // Get test report
  static Future<String> getTestReport() async {
    final results = await runAllTests();
    final totalTests = results.length;
    final passedTests = results.values.where((result) => result).length;
    final failedTests = totalTests - passedTests;

    final report = StringBuffer();
    report.writeln('=== FingerMobile Testing Report ===');
    report.writeln('Total Tests: $totalTests');
    report.writeln('Passed: $passedTests');
    report.writeln('Failed: $failedTests');
    report.writeln('Success Rate: ${((passedTests / totalTests) * 100).toStringAsFixed(2)}%');
    report.writeln('');
    report.writeln('Detailed Results:');

    results.forEach((test, result) {
      report.writeln('- $test: ${result ? 'PASS' : 'FAIL'}');
    });

    return report.toString();
  }
}