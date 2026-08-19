import 'package:flutter/material.dart';
import 'package:fingermobile_app/services/platform_api_service_enhanced.dart';

/// Comprehensive API Testing Utility
/// Use this to test all backend endpoints
class ApiTestingUtility {
  final PlatformApiServiceEnhanced api;
  final Function(String, bool) onTestResult;

  ApiTestingUtility({
    required this.api,
    required this.onTestResult,
  });

  /// Run all tests
  Future<void> runAllTests(String authToken) async {
    api.setAuthToken(authToken);
    
    await testLendSqrEndpoints();
    await testFingerLuxEndpoints();
    await testFingerWarsEndpoints();
    await testGameOnEndpoints();
    await testNyscEndpoints();
    await testLuminaEndpoints();
  }

  // ==================== LENDSQR TESTS ====================

  Future<void> testLendSqrEndpoints() async {
    _log('🏦 Testing LendSqr endpoints...');

    // Test 1: Get Loans
    await _test(
      name: 'Get Loans',
      test: () async {
        final result = await api.getLoans(page: 1, limit: 10);
        return result.isSuccess && result.data != null;
      },
    );

    // Test 2: Get Credit Score
    await _test(
      name: 'Get Credit Score',
      test: () async {
        final result = await api.getCurrentCreditScore();
        return result.isSuccess && result.data != null;
      },
    );

    // Test 3: Get Credit Scores History
    await _test(
      name: 'Get Credit Scores History',
      test: () async {
        final result = await api.getCreditScores();
        return result.isSuccess && result.data != null;
      },
    );

    _log('✅ LendSqr tests complete\n');
  }

  // ==================== FINGERLUX TESTS ====================

  Future<void> testFingerLuxEndpoints() async {
    _log('💎 Testing FingerLux endpoints...');

    // Test 1: Get Luxury Services
    await _test(
      name: 'Get Luxury Services',
      test: () async {
        final result = await api.getLuxuryServices();
        return result.isSuccess && result.data != null;
      },
    );

    // Test 2: Get Bookings
    await _test(
      name: 'Get Luxury Bookings',
      test: () async {
        final result = await api.getLuxuryBookings();
        return result.isSuccess && result.data != null;
      },
    );

    _log('✅ FingerLux tests complete\n');
  }

  // ==================== FINGERWARS TESTS ====================

  Future<void> testFingerWarsEndpoints() async {
    _log('🎮 Testing FingerWars endpoints...');

    // Test 1: Get Games
    await _test(
      name: 'Get Games',
      test: () async {
        final result = await api.getGames();
        return result.isSuccess && result.data != null;
      },
    );

    // Test 2: Get Sessions
    await _test(
      name: 'Get Game Sessions',
      test: () async {
        final result = await api.getGameSessions();
        return result.isSuccess && result.data != null;
      },
    );

    // Test 3: Get Leaderboard
    await _test(
      name: 'Get Leaderboard',
      test: () async {
        final result = await api.getLeaderboard(1);
        return result.isSuccess;
      },
    );

    _log('✅ FingerWars tests complete\n');
  }

  // ==================== GAMEON TESTS ====================

  Future<void> testGameOnEndpoints() async {
    _log('🏆 Testing GameOn endpoints...');

    // Test 1: Get Events
    await _test(
      name: 'Get Events',
      test: () async {
        final result = await api.getEvents();
        return result.isSuccess && result.data != null;
      },
    );

    // Test 2: Get Teams
    await _test(
      name: 'Get Teams',
      test: () async {
        final result = await api.getTeams();
        return result.isSuccess && result.data != null;
      },
    );

    // Test 3: Get Bookings
    await _test(
      name: 'Get Event Bookings',
      test: () async {
        final result = await api.getEventBookings();
        return result.isSuccess && result.data != null;
      },
    );

    _log('✅ GameOn tests complete\n');
  }

  // ==================== NYSC TESTS ====================

  Future<void> testNyscEndpoints() async {
    _log('🎓 Testing NYSC endpoints...');

    // Test 1: Get Profile
    await _test(
      name: 'Get NYSC Profile',
      test: () async {
        final result = await api.getNyscProfile();
        return result.isSuccess && result.data != null;
      },
    );

    // Test 2: Get Activities
    await _test(
      name: 'Get NYSC Activities',
      test: () async {
        final result = await api.getNyscActivities();
        return result.isSuccess && result.data != null;
      },
    );

    // Test 3: Get Allowance
    await _test(
      name: 'Get NYSC Allowance',
      test: () async {
        final result = await api.getNyscAllowance();
        return result.isSuccess && result.data != null;
      },
    );

    // Test 4: Get Documents
    await _test(
      name: 'Get NYSC Documents',
      test: () async {
        final result = await api.getNyscDocuments();
        return result.isSuccess && result.data != null;
      },
    );

    _log('✅ NYSC tests complete\n');
  }

  // ==================== LUMINA TESTS ====================

  Future<void> testLuminaEndpoints() async {
    _log('🖼️ Testing Lumina Gallery endpoints...');

    // Test 1: Get Assets
    await _test(
      name: 'Get Lumina Assets',
      test: () async {
        final result = await api.getLuminaAssets(page: 1, limit: 10);
        return result.isSuccess;
      },
    );

    _log('✅ Lumina tests complete\n');
  }

  // ==================== HELPER METHODS ====================

  Future<void> _test({
    required String name,
    required Future<bool> Function() test,
  }) async {
    try {
      final success = await test();
      _log('${success ? '✅' : '❌'} $name');
      onTestResult(name, success);
    } catch (e) {
      _log('❌ $name - Error: $e');
      onTestResult(name, false);
    }
  }

  void _log(String message) {
    debugPrint(message);
    onTestResult(message, true);
  }
}

/// Test Results Screen
class ApiTestResultsScreen extends StatefulWidget {
  final List<MapEntry<String, bool>> results;

  const ApiTestResultsScreen({Key? key, required this.results}) : super(key: key);

  @override
  State<ApiTestResultsScreen> createState() => _ApiTestResultsScreenState();
}

class _ApiTestResultsScreenState extends State<ApiTestResultsScreen> {
  @override
  Widget build(BuildContext context) {
    final passed = widget.results.where((r) => r.value).length;
    final failed = widget.results.where((r) => !r.value).length;
    final total = widget.results.length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('API Test Results'),
        backgroundColor: passed == total ? Colors.green : Colors.orange,
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            color: passed == total ? Colors.green.shade50 : Colors.orange.shade50,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildStatCard('Total', total.toString(), Colors.blue),
                _buildStatCard('Passed', passed.toString(), Colors.green),
                _buildStatCard('Failed', failed.toString(), Colors.red),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: widget.results.length,
              itemBuilder: (context, index) {
                final result = widget.results[index];
                return ListTile(
                  leading: Icon(
                    result.value ? Icons.check_circle : Icons.error,
                    color: result.value ? Colors.green : Colors.red,
                  ),
                  title: Text(result.key),
                  subtitle: Text(
                    result.value ? 'Success' : 'Failed',
                    style: TextStyle(
                      color: result.value ? Colors.green : Colors.red,
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: TextStyle(fontSize: 14, color: Colors.grey.shade700),
        ),
      ],
    );
  }
}

/// Loading State Widget
class LoadingState extends StatelessWidget {
  final String message;
  final bool isLoading;
  final Widget child;

  const LoadingState({
    Key? key,
    required this.message,
    required this.isLoading,
    required this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircularProgressIndicator(),
            const SizedBox(height: 16),
            Text(
              message,
              style: Theme.of(context).textTheme.bodyLarge,
              textAlign: TextAlign.center,
            ),
          ],
        ),
      );
    }
    return child;
  }
}

/// Error State Widget
class ErrorState extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;

  const ErrorState({
    Key? key,
    required this.message,
    this.onRetry,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.error_outline,
              size: 64,
              color: Colors.red.shade300,
            ),
            const SizedBox(height: 16),
            Text(
              message,
              style: Theme.of(context).textTheme.bodyLarge,
              textAlign: TextAlign.center,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: onRetry,
                icon: const Icon(Icons.refresh),
                label: const Text('Retry'),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

/// Empty State Widget
class EmptyState extends StatelessWidget {
  final String message;
  final IconData icon;
  final VoidCallback? onAction;
  final String? actionLabel;

  const EmptyState({
    Key? key,
    required this.message,
    this.icon = Icons.inbox,
    this.onAction,
    this.actionLabel,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 64,
              color: Colors.grey.shade400,
            ),
            const SizedBox(height: 16),
            Text(
              message,
              style: Theme.of(context).textTheme.bodyLarge,
              textAlign: TextAlign.center,
            ),
            if (onAction != null && actionLabel != null) ...[
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: onAction,
                child: Text(actionLabel!),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
