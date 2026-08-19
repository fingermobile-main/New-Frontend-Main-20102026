import 'package:flutter/material.dart';
import 'package:fingermobile_app/services/security_service.dart';
import 'package:fingermobile_app/models/member.dart';

class SessionManagementScreen extends StatefulWidget {
  final member member;

  const SessionManagementScreen({super.key, required this.member});

  @override
  State<SessionManagementScreen> createState() => _SessionManagementScreenState();
}

class _SessionManagementScreenState extends State<SessionManagementScreen> {
  final SecurityService _securityService = SecurityService();
  List<memberSession> _sessions = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadSessions();
  }

  Future<void> _loadSessions() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // In a real implementation, you would fetch sessions from the API
      // For now, we'll create mock data to demonstrate the UI
      await Future.delayed(const Duration(seconds: 1));
      
      setState(() {
        _sessions = [
          memberSession(
            id: '1',
            device: 'iPhone 14 Pro',
            location: 'New York, NY',
            lastActive: DateTime.now().subtract(const Duration(minutes: 5)),
            current: true,
          ),
          memberSession(
            id: '2',
            device: 'MacBook Pro',
            location: 'New York, NY',
            lastActive: DateTime.now().subtract(const Duration(hours: 2)),
            current: false,
          ),
          memberSession(
            id: '3',
            device: 'Samsung Galaxy S23',
            location: 'Los Angeles, CA',
            lastActive: DateTime.now().subtract(const Duration(days: 1)),
            current: false,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load sessions: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _terminateSession(String sessionId) async {
    try {
      // In a real implementation, you would call the API to terminate the session
      await Future.delayed(const Duration(milliseconds: 500));
      
      setState(() {
        _sessions.removeWhere((session) => session.id == sessionId);
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Session terminated')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to terminate session: $e')),
        );
      }
    }
  }

  Future<void> _terminateAllOtherSessions() async {
    try {
      // In a real implementation, you would call the API to terminate all other sessions
      await Future.delayed(const Duration(milliseconds: 500));
      
      setState(() {
        _sessions.removeWhere((session) => !session.current);
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('All other sessions terminated')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to terminate sessions: $e')),
        );
      }
    }
  }

  @override
  void dispose() {
    _securityService.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Active Sessions'),
        actions: [
          if (_sessions.where((s) => !s.current).isNotEmpty)
            IconButton(
              icon: const Icon(Icons.logout),
              onPressed: _terminateAllOtherSessions,
              tooltip: 'Terminate All Other Sessions',
            ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: _isLoading
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!, style: const TextStyle(color: Colors.red)),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadSessions,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : _buildSessionList(),
      ),
    );
  }

  Widget _buildSessionList() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Manage your active sessions across all devices',
          style: TextStyle(fontSize: 16),
        ),
        const SizedBox(height: 24),
        Expanded(
          child: ListView.builder(
            itemCount: _sessions.length,
            itemBuilder: (context, index) {
              final session = _sessions[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  title: Row(
                    children: [
                      Text(session.device),
                      if (session.current)
                        Container(
                          margin: const EdgeInsets.only(left: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.green,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'Current',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                            ),
                          ),
                        ),
                    ],
                  ),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(session.location),
                      const SizedBox(height: 4),
                      Text(
                        'Last active: ${_formatDateTime(session.lastActive)}',
                        style: const TextStyle(fontSize: 12),
                      ),
                    ],
                  ),
                  trailing: !session.current
                      ? IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => _terminateSession(session.id),
                          tooltip: 'Terminate Session',
                        )
                      : null,
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  String _formatDateTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);
    
    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes} minutes ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours} hours ago';
    } else {
      return '${difference.inDays} days ago';
    }
  }
}

class memberSession {
  final String id;
  final String device;
  final String location;
  final DateTime lastActive;
  final bool current;

  memberSession({
    required this.id,
    required this.device,
    required this.location,
    required this.lastActive,
    required this.current,
  });
}