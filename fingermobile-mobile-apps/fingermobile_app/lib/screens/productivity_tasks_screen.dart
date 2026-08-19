import 'package:flutter/material.dart';

class ProductivityTasksScreen extends StatefulWidget {
  @override
  _ProductivityTasksScreenState createState() => _ProductivityTasksScreenState();
}

class _ProductivityTasksScreenState extends State<ProductivityTasksScreen> {
  List<Task> _tasks = [];
  List<Task> _completedTasks = [];
  List<Project> _projects = [];
  bool _isLoading = true;
  String _filter = 'all'; // 'all', 'active', 'completed'

  @override
  void initState() {
    super.initState();
    _loadTasks();
  }

  Future<void> _loadTasks() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _tasks = [
          Task(
            id: 1,
            title: 'Complete project proposal',
            description: 'Finish the proposal for the new client',
            priority: 'high',
            dueDate: DateTime.now().add(Duration(days: 2)),
            completed: false,
            project: 'Client Project',
            tags: ['work', 'important'],
          ),
          Task(
            id: 2,
            title: 'Schedule team meeting',
            description: 'Set up meeting for next week',
            priority: 'medium',
            dueDate: DateTime.now().add(Duration(days: 1)),
            completed: false,
            project: 'Team Management',
            tags: ['meeting', 'team'],
          ),
          Task(
            id: 3,
            title: 'Buy groceries',
            description: 'Get milk, eggs, and bread',
            priority: 'low',
            dueDate: DateTime.now().add(Duration(hours: 6)),
            completed: false,
            project: 'Personal',
            tags: ['personal', 'shopping'],
          ),
        ];
        
        _completedTasks = [
          Task(
            id: 4,
            title: 'Update documentation',
            description: 'Update the API documentation',
            priority: 'medium',
            dueDate: DateTime.now().subtract(Duration(days: 1)),
            completed: true,
            project: 'Documentation',
            tags: ['work', 'docs'],
          ),
          Task(
            id: 5,
            title: 'Gym session',
            description: 'Morning workout',
            priority: 'low',
            dueDate: DateTime.now().subtract(Duration(days: 2)),
            completed: true,
            project: 'Health',
            tags: ['health', 'exercise'],
          ),
        ];
        
        _projects = [
          Project(
            id: 1,
            name: 'Client Project',
            description: 'New client onboarding project',
            progress: 65,
            tasksCompleted: 8,
            totalTasks: 12,
            color: Colors.blue,
          ),
          Project(
            id: 2,
            name: 'Personal Goals',
            description: 'Personal development objectives',
            progress: 40,
            tasksCompleted: 4,
            totalTasks: 10,
            color: Colors.green,
          ),
          Project(
            id: 3,
            name: 'Team Management',
            description: 'Internal team coordination',
            progress: 80,
            tasksCompleted: 12,
            totalTasks: 15,
            color: Colors.orange,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading tasks: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading tasks')),
      );
    }
  }

  void _toggleTaskCompletion(Task task) {
    setState(() {
      final index = _tasks.indexWhere((t) => t.id == task.id);
      if (index != -1) {
        _tasks[index] = Task(
          id: _tasks[index].id,
          title: _tasks[index].title,
          description: _tasks[index].description,
          priority: _tasks[index].priority,
          dueDate: _tasks[index].dueDate,
          completed: !_tasks[index].completed,
          project: _tasks[index].project,
          tags: _tasks[index].tags,
        );
        
        if (_tasks[index].completed) {
          _completedTasks.add(_tasks[index]);
          _tasks.removeAt(index);
        }
      }
    });
  }

  void _addTask() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        final titleController = TextEditingController();
        final descriptionController = TextEditingController();
        String priority = 'medium';
        String project = 'Personal';

        return AlertDialog(
          title: Text('Add New Task'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: titleController,
                decoration: InputDecoration(
                  labelText: 'Task Title',
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 16),
              TextField(
                controller: descriptionController,
                maxLines: 3,
                decoration: InputDecoration(
                  labelText: 'Description',
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: priority,
                decoration: InputDecoration(
                  labelText: 'Priority',
                  border: OutlineInputBorder(),
                ),
                items: ['low', 'medium', 'high'].map((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value.toUpperCase()),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  if (newValue != null) {
                    priority = newValue;
                  }
                },
              ),
              SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: project,
                decoration: InputDecoration(
                  labelText: 'Project',
                  border: OutlineInputBorder(),
                ),
                items: _projects.map((Project p) {
                  return DropdownMenuItem<String>(
                    value: p.name,
                    child: Text(p.name),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  if (newValue != null) {
                    project = newValue;
                  }
                },
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                if (titleController.text.isNotEmpty) {
                  setState(() {
                    _tasks.add(
                      Task(
                        id: _tasks.length + 1,
                        title: titleController.text,
                        description: descriptionController.text,
                        priority: priority,
                        dueDate: DateTime.now().add(Duration(days: 1)),
                        completed: false,
                        project: project,
                        tags: [],
                      ),
                    );
                  });
                  Navigator.of(context).pop();
                }
              },
              child: Text('Add'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    List<Task> displayTasks = [];
    
    if (_filter == 'all') {
      displayTasks = [..._tasks, ..._completedTasks];
    } else if (_filter == 'active') {
      displayTasks = _tasks;
    } else if (_filter == 'completed') {
      displayTasks = _completedTasks;
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Productivity'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.add),
            onPressed: _addTask,
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadTasks,
              child: Column(
                children: [
                  // Stats Summary
                  Container(
                    padding: EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _buildStatCard('Tasks', _tasks.length.toString(), Colors.blue),
                        _buildStatCard('Completed', _completedTasks.length.toString(), Colors.green),
                        _buildStatCard('Projects', _projects.length.toString(), Colors.orange),
                      ],
                    ),
                  ),
                  
                  // Filter Tabs
                  Container(
                    height: 50,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      children: [
                        _buildFilterTab('All', 'all'),
                        _buildFilterTab('Active', 'active'),
                        _buildFilterTab('Completed', 'completed'),
                      ],
                    ),
                  ),
                  
                  // Projects Section
                  Padding(
                    padding: EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Projects',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            // Navigate to projects
                          },
                          child: Text('See All'),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    height: 100,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _projects.length,
                      itemBuilder: (context, index) {
                        final project = _projects[index];
                        return _buildProjectCard(project);
                      },
                    ),
                  ),
                  
                  // Tasks Section
                  Padding(
                    padding: EdgeInsets.all(16),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Tasks',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        TextButton(
                          onPressed: () {
                            // Navigate to all tasks
                          },
                          child: Text('See All'),
                        ),
                      ],
                    ),
                  ),
                  
                  // Tasks List
                  Expanded(
                    child: displayTasks.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.checklist,
                                  size: 80,
                                  color: Colors.grey[400],
                                ),
                                SizedBox(height: 16),
                                Text(
                                  'No tasks',
                                  style: TextStyle(
                                    fontSize: 20,
                                    color: Colors.grey[600],
                                  ),
                                ),
                                SizedBox(height: 8),
                                Padding(
                                  padding: EdgeInsets.symmetric(horizontal: 32),
                                  child: Text(
                                    'Add a new task using the + button',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      color: Colors.grey[500],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          )
                        : ListView.builder(
                            itemCount: displayTasks.length,
                            itemBuilder: (context, index) {
                              final task = displayTasks[index];
                              return _buildTaskItem(task);
                            },
                          ),
                  ),
                ],
              ),
            ),
    );
  }

  Widget _buildStatCard(String title, String value, Color color) {
    return Expanded(
      child: Container(
        padding: EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            Text(
              title,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterTab(String title, String filterValue) {
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 4),
      child: GestureDetector(
        onTap: () {
          setState(() {
            _filter = filterValue;
          });
        },
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: _filter == filterValue ? Colors.blue : Colors.grey[200],
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            title,
            style: TextStyle(
              color: _filter == filterValue ? Colors.white : Colors.grey[700],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildProjectCard(Project project) {
    return Card(
      margin: EdgeInsets.only(left: 16, right: 8),
      child: Container(
        width: 150,
        padding: EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 10,
              height: 10,
              decoration: BoxDecoration(
                color: project.color,
                shape: BoxShape.circle,
              ),
            ),
            SizedBox(height: 8),
            Text(
              project.name,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            SizedBox(height: 4),
            Text(
              project.description,
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            SizedBox(height: 8),
            LinearProgressIndicator(
              value: project.progress / 100,
              backgroundColor: Colors.grey[300],
              valueColor: AlwaysStoppedAnimation<Color>(project.color),
            ),
            SizedBox(height: 4),
            Text(
              '${project.tasksCompleted}/${project.totalTasks} tasks',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTaskItem(Task task) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            GestureDetector(
              onTap: () => _toggleTaskCompletion(task),
              child: Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  border: Border.all(
                    color: task.completed ? Colors.green : Colors.grey,
                    width: 2,
                  ),
                  color: task.completed ? Colors.green : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: task.completed
                    ? Icon(
                        Icons.check,
                        size: 16,
                        color: Colors.white,
                      )
                    : null,
              ),
            ),
            SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    task.title,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      decoration: task.completed ? TextDecoration.lineThrough : null,
                      color: task.completed ? Colors.grey : Colors.black,
                    ),
                  ),
                  if (task.description.isNotEmpty)
                    Padding(
                      padding: EdgeInsets.only(top: 4),
                      child: Text(
                        task.description,
                        style: TextStyle(
                          color: Colors.grey[600],
                          decoration: task.completed ? TextDecoration.lineThrough : null,
                        ),
                      ),
                    ),
                  Padding(
                    padding: EdgeInsets.only(top: 8),
                    child: Row(
                      children: [
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: _getPriorityColor(task.priority).withOpacity(0.2),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            task.priority.toUpperCase(),
                            style: TextStyle(
                              color: _getPriorityColor(task.priority),
                              fontSize: 10,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        SizedBox(width: 8),
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.blue[100],
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            task.project,
                            style: TextStyle(
                              color: Colors.blue[800],
                              fontSize: 10,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                        Spacer(),
                        Icon(
                          Icons.access_time,
                          size: 16,
                          color: Colors.grey[600],
                        ),
                        SizedBox(width: 4),
                        Text(
                          _formatDate(task.dueDate),
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getPriorityColor(String priority) {
    switch (priority) {
      case 'high':
        return Colors.red;
      case 'medium':
        return Colors.orange;
      case 'low':
        return Colors.green;
      default:
        return Colors.grey;
    }
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) {
      return 'Today';
    } else if (difference.inDays == -1) {
      return 'Tomorrow';
    } else if (difference.inDays < 0) {
      return 'In ${difference.inDays.abs()} days';
    } else {
      return '${date.day}/${date.month}';
    }
  }
}

class Task {
  final int id;
  final String title;
  final String description;
  final String priority;
  final DateTime dueDate;
  final bool completed;
  final String project;
  final List<String> tags;

  Task({
    required this.id,
    required this.title,
    required this.description,
    required this.priority,
    required this.dueDate,
    required this.completed,
    required this.project,
    required this.tags,
  });
}

class Project {
  final int id;
  final String name;
  final String description;
  final int progress;
  final int tasksCompleted;
  final int totalTasks;
  final Color color;

  Project({
    required this.id,
    required this.name,
    required this.description,
    required this.progress,
    required this.tasksCompleted,
    required this.totalTasks,
    required this.color,
  });
}