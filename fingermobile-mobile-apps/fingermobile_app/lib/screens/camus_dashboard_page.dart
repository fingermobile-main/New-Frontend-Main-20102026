import 'package:flutter/material.dart';
import 'dart:async';

class CamusDashboardPage extends StatefulWidget {
  const CamusDashboardPage({super.key});

  @override
  State<CamusDashboardPage> createState() => _CamusDashboardPageState();
}

class _CamusDashboardPageState extends State<CamusDashboardPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<DashboardMetric> _metrics = [];
  List<Project> _projects = [];
  List<TeamMember> _teamMembers = [];
  int _activeProjects = 0;
  int _completedTasks = 0;
  double _productivityScore = 0.0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _loadDashboardData();
    // Update dashboard data every 30 seconds
    _timer = Timer.periodic(const Duration(seconds: 30), (timer) {
      _loadDashboardData();
    });
  }

  Future<void> _loadDashboardData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock dashboard data
      setState(() {
        _metrics = [
          DashboardMetric(
            title: 'Active Projects',
            value: '12',
            icon: Icons.work,
            color: Colors.blue,
            change: '+2',
          ),
          DashboardMetric(
            title: 'Team Members',
            value: '24',
            icon: Icons.people,
            color: Colors.green,
            change: '+1',
          ),
          DashboardMetric(
            title: 'Completed Tasks',
            value: '142',
            icon: Icons.check_circle,
            color: Colors.purple,
            change: '+12',
          ),
          DashboardMetric(
            title: 'Productivity',
            value: '87%',
            icon: Icons.trending_up,
            color: Colors.orange,
            change: '+3%',
          ),
        ];
        
        _projects = [
          Project(
            id: 1,
            name: 'Website Redesign',
            progress: 0.75,
            status: ProjectStatus.inProgress,
            deadline: DateTime.now().add(const Duration(days: 15)),
            teamLead: 'Alex Johnson',
          ),
          Project(
            id: 2,
            name: 'Mobile App Update',
            progress: 0.45,
            status: ProjectStatus.inProgress,
            deadline: DateTime.now().add(const Duration(days: 30)),
            teamLead: 'Sarah Williams',
          ),
          Project(
            id: 3,
            name: 'API Integration',
            progress: 1.0,
            status: ProjectStatus.completed,
            deadline: DateTime.now().subtract(const Duration(days: 5)),
            teamLead: 'Michael Chen',
          ),
        ];
        
        _teamMembers = [
          TeamMember(
            id: 1,
            name: 'John Smith',
            role: 'Frontend Developer',
            avatar: 'https://via.placeholder.com/150',
            tasksCompleted: 24,
            productivity: 0.92,
          ),
          TeamMember(
            id: 2,
            name: 'Emily Davis',
            role: 'UX Designer',
            avatar: 'https://via.placeholder.com/150',
            tasksCompleted: 18,
            productivity: 0.85,
          ),
          TeamMember(
            id: 3,
            name: 'Robert Brown',
            role: 'Backend Developer',
            avatar: 'https://via.placeholder.com/150',
            tasksCompleted: 32,
            productivity: 0.95,
          ),
        ];
        
        _activeProjects = 12;
        _completedTasks = 142;
        _productivityScore = 87.5;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load dashboard data. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Camus Dashboard'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              // Show notifications
            },
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // Open settings
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadDashboardData,
        child: _isLoading && _metrics.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _metrics.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadDashboardData,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : SingleChildScrollView(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Metrics Grid
                          const Text(
                            'Overview',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          GridView.builder(
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              crossAxisSpacing: 16,
                              mainAxisSpacing: 16,
                              childAspectRatio: 1.5,
                            ),
                            itemCount: _metrics.length,
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemBuilder: (context, index) {
                              var metric = _metrics[index];
                              return Card(
                                elevation: 4,
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Icon(
                                            metric.icon,
                                            color: metric.color,
                                          ),
                                          Text(
                                            metric.change,
                                            style: TextStyle(
                                              color: metric.color,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        metric.title,
                                        style: const TextStyle(
                                          fontSize: 14,
                                          color: Colors.grey,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        metric.value,
                                        style: const TextStyle(
                                          fontSize: 24,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                          const SizedBox(height: 32),
                          // Projects Section
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Projects',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  // View all projects
                                },
                                child: const Text('See All'),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _projects.length,
                            itemBuilder: (context, index) {
                              var project = _projects[index];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 16),
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          Text(
                                            project.name,
                                            style: const TextStyle(
                                              fontSize: 18,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 8,
                                              vertical: 4,
                                            ),
                                            decoration: BoxDecoration(
                                              color: _getStatusColor(project.status),
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: Text(
                                              _getStatusText(project.status),
                                              style: const TextStyle(
                                                color: Colors.white,
                                                fontSize: 12,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 8),
                                      Text('Team Lead: ${project.teamLead}'),
                                      const SizedBox(height: 8),
                                      Text('Deadline: ${_formatDate(project.deadline)}'),
                                      const SizedBox(height: 16),
                                      LinearProgressIndicator(
                                        value: project.progress,
                                        backgroundColor: Colors.grey.shade300,
                                        valueColor: AlwaysStoppedAnimation<Color>(
                                          project.progress == 1.0 
                                            ? Colors.green 
                                            : project.progress > 0.7 
                                              ? Colors.blue 
                                              : Colors.orange,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        '${(project.progress * 100).toInt()}% Complete',
                                        style: const TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                          const SizedBox(height: 32),
                          // Team Members
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Team Members',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  // View all team members
                                },
                                child: const Text('See All'),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _teamMembers.length,
                            itemBuilder: (context, index) {
                              var member = _teamMembers[index];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 16),
                                child: ListTile(
                                  leading: CircleAvatar(
                                    backgroundImage: NetworkImage(member.avatar),
                                  ),
                                  title: Text(member.name),
                                  subtitle: Text(member.role),
                                  trailing: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Text('${member.tasksCompleted} tasks'),
                                      Text(
                                        '${(member.productivity * 100).toInt()}% productive',
                                        style: const TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
      ),
    );
  }

  Color _getStatusColor(ProjectStatus status) {
    switch (status) {
      case ProjectStatus.inProgress:
        return Colors.blue;
      case ProjectStatus.completed:
        return Colors.green;
      case ProjectStatus.onHold:
        return Colors.orange;
      case ProjectStatus.delayed:
        return Colors.red;
    }
  }

  String _getStatusText(ProjectStatus status) {
    switch (status) {
      case ProjectStatus.inProgress:
        return 'In Progress';
      case ProjectStatus.completed:
        return 'Completed';
      case ProjectStatus.onHold:
        return 'On Hold';
      case ProjectStatus.delayed:
        return 'Delayed';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}

enum ProjectStatus { inProgress, completed, onHold, delayed }

class DashboardMetric {
  final String title;
  final String value;
  final IconData icon;
  final Color color;
  final String change;

  DashboardMetric({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
    required this.change,
  });
}

class Project {
  final int id;
  final String name;
  final double progress;
  final ProjectStatus status;
  final DateTime deadline;
  final String teamLead;

  Project({
    required this.id,
    required this.name,
    required this.progress,
    required this.status,
    required this.deadline,
    required this.teamLead,
  });
}

class TeamMember {
  final int id;
  final String name;
  final String role;
  final String avatar;
  final int tasksCompleted;
  final double productivity;

  TeamMember({
    required this.id,
    required this.name,
    required this.role,
    required this.avatar,
    required this.tasksCompleted,
    required this.productivity,
  });
}