import 'package:flutter/material.dart';

class CalendarSchedulingScreen extends StatefulWidget {
  @override
  _CalendarSchedulingScreenState createState() => _CalendarSchedulingScreenState();
}

class _CalendarSchedulingScreenState extends State<CalendarSchedulingScreen> {
  DateTime _selectedDate = DateTime.now();
  List<CalendarEvent> _events = [];

  @override
  void initState() {
    super.initState();
    _loadEvents();
  }

  Future<void> _loadEvents() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _events = [
          CalendarEvent(
            id: 1,
            title: 'Team Meeting',
            description: 'Weekly team sync meeting',
            startTime: DateTime(_selectedDate.year, _selectedDate.month, _selectedDate.day, 10, 0),
            endTime: DateTime(_selectedDate.year, _selectedDate.month, _selectedDate.day, 11, 0),
            location: 'Conference Room A',
            isAllDay: false,
            category: 'Work',
          ),
          CalendarEvent(
            id: 2,
            title: 'Lunch with Client',
            description: 'Discuss new project requirements',
            startTime: DateTime(_selectedDate.year, _selectedDate.month, _selectedDate.day, 13, 0),
            endTime: DateTime(_selectedDate.year, _selectedDate.month, _selectedDate.day, 14, 30),
            location: 'Restaurant',
            isAllDay: false,
            category: 'Business',
          ),
          CalendarEvent(
            id: 3,
            title: 'Gym Session',
            description: 'Workout with personal trainer',
            startTime: DateTime(_selectedDate.year, _selectedDate.month, _selectedDate.day, 18, 0),
            endTime: DateTime(_selectedDate.year, _selectedDate.month, _selectedDate.day, 19, 0),
            location: 'Fitness Center',
            isAllDay: false,
            category: 'Personal',
          ),
        ];
      });
    } catch (e) {
      print('Error loading events: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading events')),
      );
    }
  }

  void _createNewEvent() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => CreateEventScreen(
          selectedDate: _selectedDate,
          onSave: (event) {
            setState(() {
              _events.add(event);
            });
          },
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Calendar'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.add),
            onPressed: _createNewEvent,
          ),
        ],
      ),
      body: Column(
        children: [
          // Calendar header with month navigation
          Container(
            padding: EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: Icon(Icons.chevron_left),
                  onPressed: () {
                    setState(() {
                      _selectedDate = DateTime(_selectedDate.year, _selectedDate.month - 1, _selectedDate.day);
                    });
                    _loadEvents();
                  },
                ),
                Text(
                  '${_selectedDate.month}/${_selectedDate.year}',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.chevron_right),
                  onPressed: () {
                    setState(() {
                      _selectedDate = DateTime(_selectedDate.year, _selectedDate.month + 1, _selectedDate.day);
                    });
                    _loadEvents();
                  },
                ),
              ],
            ),
          ),
          
          // Day selector
          Container(
            height: 100,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: 7,
              itemBuilder: (context, index) {
                final day = DateTime(_selectedDate.year, _selectedDate.month, _selectedDate.day + index - _selectedDate.weekday + 1);
                final isToday = DateTime(day.year, day.month, day.day) == DateTime.now().add(Duration(days: index - _selectedDate.weekday + 1)).day;
                
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedDate = day;
                    });
                    _loadEvents();
                  },
                  child: Container(
                    width: 70,
                    margin: EdgeInsets.symmetric(horizontal: 4),
                    decoration: BoxDecoration(
                      color: _selectedDate.day == day.day && _selectedDate.month == day.month 
                          ? Colors.blue 
                          : Colors.transparent,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          '${day.day}',
                          style: TextStyle(
                            color: isToday ? Colors.white : _selectedDate.day == day.day ? Colors.white : Colors.black,
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                          ),
                        ),
                        Text(
                          '${day.weekday < 7 ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day.weekday - 1] : ''}',
                          style: TextStyle(
                            color: isToday ? Colors.white : _selectedDate.day == day.day ? Colors.white : Colors.grey,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          
          // Events list
          Expanded(
            child: _events.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.event,
                          size: 80,
                          color: Colors.grey[400],
                        ),
                        SizedBox(height: 16),
                        Text(
                          'No events scheduled',
                          style: TextStyle(
                            fontSize: 20,
                            color: Colors.grey[600],
                          ),
                        ),
                        SizedBox(height: 8),
                        Padding(
                          padding: EdgeInsets.symmetric(horizontal: 32),
                          child: Text(
                            'Tap the + button to create a new event',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              color: Colors.grey[500],
                            ),
                          ),
                        ),
                      ],
                    ),
                  )
                : RefreshIndicator(
                    onRefresh: _loadEvents,
                    child: ListView.builder(
                      itemCount: _events.length,
                      itemBuilder: (context, index) {
                        final event = _events[index];
                        return _buildEventItem(event);
                      },
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildEventItem(CalendarEvent event) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: _getCategoryColor(event.category).withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                _getCategoryIcon(event.category),
                color: _getCategoryColor(event.category),
              ),
            ),
            SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    event.title,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (event.description.isNotEmpty)
                    Padding(
                      padding: EdgeInsets.only(top: 4),
                      child: Text(
                        event.description,
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 14,
                        ),
                      ),
                    ),
                  Padding(
                    padding: EdgeInsets.only(top: 8),
                    child: Row(
                      children: [
                        Icon(
                          Icons.access_time,
                          size: 16,
                          color: Colors.grey[600],
                        ),
                        SizedBox(width: 4),
                        Text(
                          '${_formatTime(event.startTime)} - ${_formatTime(event.endTime)}',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                        SizedBox(width: 12),
                        Icon(
                          Icons.location_on,
                          size: 16,
                          color: Colors.grey[600],
                        ),
                        SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            event.location,
                            style: TextStyle(
                              color: Colors.grey[600],
                              fontSize: 12,
                            ),
                            overflow: TextOverflow.ellipsis,
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

  Color _getCategoryColor(String category) {
    switch (category) {
      case 'Work':
        return Colors.blue;
      case 'Personal':
        return Colors.green;
      case 'Business':
        return Colors.orange;
      case 'Health':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  IconData _getCategoryIcon(String category) {
    switch (category) {
      case 'Work':
        return Icons.work;
      case 'Personal':
        return Icons.person;
      case 'Business':
        return Icons.business;
      case 'Health':
        return Icons.favorite;
      default:
        return Icons.event;
    }
  }

  String _formatTime(DateTime dateTime) {
    return '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
  }
}

class CalendarEvent {
  final int id;
  final String title;
  final String description;
  final DateTime startTime;
  final DateTime endTime;
  final String location;
  final bool isAllDay;
  final String category;

  CalendarEvent({
    required this.id,
    required this.title,
    required this.description,
    required this.startTime,
    required this.endTime,
    required this.location,
    required this.isAllDay,
    required this.category,
  });
}

class CreateEventScreen extends StatefulWidget {
  final DateTime selectedDate;
  final Function(CalendarEvent) onSave;

  const CreateEventScreen({
    required this.selectedDate,
    required this.onSave,
  });

  @override
  _CreateEventScreenState createState() => _CreateEventScreenState();
}

class _CreateEventScreenState extends State<CreateEventScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _locationController = TextEditingController();
  TimeOfDay _startTime = TimeOfDay.now();
  TimeOfDay _endTime = TimeOfDay.now().replacing(hour: TimeOfDay.now().hour + 1);
  String _category = 'Personal';
  bool _isAllDay = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Create Event'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          TextButton(
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                final event = CalendarEvent(
                  id: DateTime.now().millisecondsSinceEpoch,
                  title: _titleController.text,
                  description: _descriptionController.text,
                  startTime: DateTime(
                    widget.selectedDate.year,
                    widget.selectedDate.month,
                    widget.selectedDate.day,
                    _startTime.hour,
                    _startTime.minute,
                  ),
                  endTime: DateTime(
                    widget.selectedDate.year,
                    widget.selectedDate.month,
                    widget.selectedDate.day,
                    _endTime.hour,
                    _endTime.minute,
                  ),
                  location: _locationController.text,
                  isAllDay: _isAllDay,
                  category: _category,
                );
                
                widget.onSave(event);
                Navigator.pop(context);
              }
            },
            child: Text(
              'Save',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: Padding(
          padding: EdgeInsets.all(16),
          child: ListView(
            children: [
              TextFormField(
                controller: _titleController,
                decoration: InputDecoration(
                  labelText: 'Event Title',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter an event title';
                  }
                  return null;
                },
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: _descriptionController,
                maxLines: 3,
                decoration: InputDecoration(
                  labelText: 'Description',
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 16),
              TextFormField(
                controller: _locationController,
                decoration: InputDecoration(
                  labelText: 'Location',
                  border: OutlineInputBorder(),
                ),
              ),
              SizedBox(height: 16),
              SwitchListTile(
                title: Text('All Day Event'),
                value: _isAllDay,
                onChanged: (value) {
                  setState(() {
                    _isAllDay = value;
                  });
                },
              ),
              if (!_isAllDay) ...[
                ListTile(
                  title: Text('Start Time'),
                  subtitle: Text('${_startTime.format(context)}'),
                  trailing: Icon(Icons.arrow_forward_ios),
                  onTap: () async {
                    final time = await showTimePicker(
                      context: context,
                      initialTime: _startTime,
                    );
                    if (time != null) {
                      setState(() {
                        _startTime = time;
                      });
                    }
                  },
                ),
                ListTile(
                  title: Text('End Time'),
                  subtitle: Text('${_endTime.format(context)}'),
                  trailing: Icon(Icons.arrow_forward_ios),
                  onTap: () async {
                    final time = await showTimePicker(
                      context: context,
                      initialTime: _endTime,
                    );
                    if (time != null) {
                      setState(() {
                        _endTime = time;
                      });
                    }
                  },
                ),
              ],
              ListTile(
                title: Text('Category'),
                subtitle: Text(_category),
                trailing: Icon(Icons.arrow_forward_ios),
                onTap: () {
                  _selectCategory();
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _selectCategory() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Select Category'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              RadioListTile<String>(
                title: Text('Personal'),
                value: 'Personal',
                groupValue: _category,
                onChanged: (value) {
                  if (value != null) {
                    setState(() {
                      _category = value;
                    });
                  }
                  Navigator.pop(context);
                },
              ),
              RadioListTile<String>(
                title: Text('Work'),
                value: 'Work',
                groupValue: _category,
                onChanged: (value) {
                  if (value != null) {
                    setState(() {
                      _category = value;
                    });
                  }
                  Navigator.pop(context);
                },
              ),
              RadioListTile<String>(
                title: Text('Business'),
                value: 'Business',
                groupValue: _category,
                onChanged: (value) {
                  if (value != null) {
                    setState(() {
                      _category = value;
                    });
                  }
                  Navigator.pop(context);
                },
              ),
              RadioListTile<String>(
                title: Text('Health'),
                value: 'Health',
                groupValue: _category,
                onChanged: (value) {
                  if (value != null) {
                    setState(() {
                      _category = value;
                    });
                  }
                  Navigator.pop(context);
                },
              ),
            ],
          ),
        );
      },
    );
  }
}