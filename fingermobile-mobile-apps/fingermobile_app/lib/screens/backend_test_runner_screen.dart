import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fingermobile_app/services/platform_api_service_enhanced.dart';

/// Main Test Runner Screen
/// Use this to test all backend endpoints with the running services
class BackendTestRunnerScreen extends StatefulWidget {
  const BackendTestRunnerScreen({Key? key}) : super(key: key);

  @override
  State<BackendTestRunnerScreen> createState() => _BackendTestRunnerScreenState();
}

class _BackendTestRunnerScreenState extends State<BackendTestRunnerScreen> {
  late PlatformApiServiceEnhanced api;
  bool isRunning = false;
  int currentTestIndex = 0;
  int totalTests = 0;
  int passedTests = 0;
  int failedTests = 0;
  final List<TestResult> _results = [];
  final TextEditingController _authTokenController = TextEditingController();

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    api = context.watch<PlatformApiServiceEnhanced>();
  }

  @override
  void dispose() {
    _authTokenController.dispose();
    super.dispose();
  }

  Future<void> _runAllTests() async {
    if (_authTokenController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter an authentication token'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      isRunning = true;
      _results.clear();
      currentTestIndex = 0;
      passedTests = 0;
      failedTests = 0;
    });

    api.setAuthToken(_authTokenController.text);

    // Define all tests
    final tests = [
      TestDefinition('LendSqr - Get Loans', () => api.getLoans(page: 1, limit: 10)),
      TestDefinition('LendSqr - Get Credit Score', () => api.getCurrentCreditScore()),
      TestDefinition('LendSqr - Get Credit History', () => api.getCreditScores()),
      TestDefinition('FingerLux - Get Services', () => api.getLuxuryServices()),
      TestDefinition('FingerLux - Get Bookings', () => api.getLuxuryBookings()),
      TestDefinition('FingerWars - Get Games', () => api.getGames()),
      TestDefinition('FingerWars - Get Sessions', () => api.getGameSessions()),
      TestDefinition('FingerWars - Get Leaderboard', () => api.getLeaderboard(1)),
      TestDefinition('GameOn - Get Events', () => api.getEvents()),
      TestDefinition('GameOn - Get Teams', () => api.getTeams()),
      TestDefinition('GameOn - Get Bookings', () => api.getEventBookings()),
      TestDefinition('NYSC - Get Profile', () => api.getNyscProfile()),
      TestDefinition('NYSC - Get Activities', () => api.getNyscActivities()),
      TestDefinition('NYSC - Get Allowance', () => api.getNyscAllowance()),
      TestDefinition('NYSC - Get Documents', () => api.getNyscDocuments()),
      TestDefinition('Lumina - Get Assets', () => api.getLuminaAssets(page: 1, limit: 10)),
    ];

    totalTests = tests.length;

    for (int i = 0; i < tests.length; i++) {
      setState(() {
        currentTestIndex = i + 1;
      });

      final test = tests[i];
      final result = await _runTest(test);

      setState(() {
        _results.add(result);
        if (result.passed) {
          passedTests++;
        } else {
          failedTests++;
        }
      });

      // Small delay between tests
      await Future.delayed(const Duration(milliseconds: 500));
    }

    setState(() {
      isRunning = false;
    });

    _showResultsDialog();
  }

  Future<TestResult> _runTest(TestDefinition test) async {
    try {
      final result = await test.test();
      
      return TestResult(
        name: test.name,
        passed: result.isSuccess,
        message: result.message ?? (result.isSuccess ? 'Success' : 'Failed'),
        data: result.data,
      );
    } catch (e) {
      return TestResult(
        name: test.name,
        passed: false,
        message: 'Error: $e',
      );
    }
  }

  void _showResultsDialog() {
    final percentage = (passedTests / totalTests * 100).toInt();
    Color statusColor;
    String statusMessage;

    if (percentage == 100) {
      statusColor = Colors.green;
      statusMessage = 'All tests passed! 🎉';
    } else if (percentage >= 70) {
      statusColor = Colors.orange;
      statusMessage = 'Most tests passed';
    } else {
      statusColor = Colors.red;
      statusMessage = 'Many tests failed';
    }

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: Row(
          children: [
            Icon(Icons.check_circle, color: statusColor),
            const SizedBox(width: 8),
            Text('Test Complete'),
          ],
        ),
        content: SizedBox(
          width: double.maxFinite,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                statusMessage,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: statusColor,
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildStatColumn('Total', totalTests.toString(), Colors.blue),
                  _buildStatColumn('Passed', passedTests.toString(), Colors.green),
                  _buildStatColumn('Failed', failedTests.toString(), Colors.red),
                ],
              ),
              const SizedBox(height: 16),
              LinearProgressIndicator(
                value: percentage / 100,
                backgroundColor: Colors.grey.shade200,
                valueColor: AlwaysStoppedAnimation<Color>(statusColor),
              ),
              const SizedBox(height: 8),
              Text('$percentage% Success Rate'),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _navigateToDetailedResults();
            },
            child: const Text('View Details'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  Widget _buildStatColumn(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey.shade600,
          ),
        ),
      ],
    );
  }

  void _navigateToDetailedResults() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => TestResultsDetailScreen(results: _results),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Backend Test Runner'),
        backgroundColor: isRunning ? Colors.orange : Colors.green,
      ),
      body: Column(
        children: [
          // Auth Token Input
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: _authTokenController,
              decoration: const InputDecoration(
                labelText: 'Authentication Token',
                hintText: 'Enter JWT token for testing',
                border: OutlineInputBorder(),
                prefixIcon: Icon(Icons.key),
              ),
              obscureText: true,
            ),
          ),

          // Progress Section
          if (isRunning)
            Container(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  const CircularProgressIndicator(),
                  const SizedBox(height: 16),
                  Text(
                    'Running test $currentTestIndex of $totalTests',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: 8),
                  LinearProgressIndicator(
                    value: currentTestIndex / totalTests,
                  ),
                ],
              ),
            ),

          // Results List
          Expanded(
            child: _results.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.science,
                          size: 100,
                          color: Colors.grey.shade300,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No tests run yet',
                          style: Theme.of(context).textTheme.bodyLarge,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Click the button below to start',
                          style: Theme.of(context).textTheme.bodyMedium,
                        ),
                      ],
                    ),
                  )
                : ListView.builder(
                    itemCount: _results.length,
                    itemBuilder: (context, index) {
                      final result = _results[index];
                      return Card(
                        margin: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        child: ListTile(
                          leading: Icon(
                            result.passed
                                ? Icons.check_circle
                                : Icons.error,
                            color: result.passed ? Colors.green : Colors.red,
                          ),
                          title: Text(result.name),
                          subtitle: Text(
                            result.message,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                          trailing: result.passed
                              ? const Icon(Icons.thumb_up, color: Colors.green)
                              : const Icon(Icons.thumb_down, color: Colors.red),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: isRunning ? null : _runAllTests,
        icon: const Icon(Icons.play_arrow),
        label: const Text('Run All Tests'),
        backgroundColor: isRunning ? Colors.grey : Colors.green,
      ),
    );
  }
}

// ==================== HELPER CLASSES ====================

class TestDefinition {
  final String name;
  final Future<ApiResult<dynamic>> Function() test;

  TestDefinition({
    required this.name,
    required this.test,
  });
}

class TestResult {
  final String name;
  final bool passed;
  final String message;
  final dynamic data;

  TestResult({
    required this.name,
    required this.passed,
    required this.message,
    this.data,
  });
}

// ==================== DETAILED RESULTS SCREEN ====================

class TestResultsDetailScreen extends StatelessWidget {
  final List<TestResult> results;

  const TestResultsDetailScreen({Key? key, required this.results}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final passed = results.where((r) => r.passed).length;
    final failed = results.where((r) => !r.passed).length;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Test Results'),
        backgroundColor: passed == results.length ? Colors.green : Colors.orange,
      ),
      body: Column(
        children: [
          // Summary Card
          Container(
            padding: const EdgeInsets.all(16),
            color: passed == results.length
                ? Colors.green.shade50
                : Colors.orange.shade50,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildSummaryItem('Total', results.length.toString(), Colors.blue),
                _buildSummaryItem('Passed', passed.toString(), Colors.green),
                _buildSummaryItem('Failed', failed.toString(), Colors.red),
              ],
            ),
          ),

          // Results List
          Expanded(
            child: ListView.builder(
              itemCount: results.length,
              itemBuilder: (context, index) {
                final result = results[index];
                return ExpansionTile(
                  leading: Icon(
                    result.passed ? Icons.check_circle : Icons.error,
                    color: result.passed ? Colors.green : Colors.red,
                  ),
                  title: Text(result.name),
                  subtitle: Text(
                    result.message,
                    style: TextStyle(
                      color: result.passed ? Colors.green : Colors.red,
                    ),
                  ),
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Response Data:',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.grey.shade200,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              result.data != null
                                  ? _formatData(result.data)
                                  : 'No data',
                              style: const TextStyle(fontFamily: 'monospace'),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Export results
          _exportResults(context);
        },
        child: const Icon(Icons.share),
      ),
    );
  }

  Widget _buildSummaryItem(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.bold,
            color: color,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 14,
            color: Colors.grey.shade600,
          ),
        ),
      ],
    );
  }

  String _formatData(dynamic data) {
    if (data is Map) {
      return data.toString();
    } else if (data is List) {
      return '${data.length} items';
    }
    return data.toString();
  }

  void _exportResults(BuildContext context) {
    // In a real implementation, this would export to file or share
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Results exported (mock implementation)')),
    );
  }
}
