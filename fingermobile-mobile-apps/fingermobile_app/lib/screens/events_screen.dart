import 'package:flutter/material.dart';

class Event {
  final int id;
  final String title;
  final String description;
  final String? coverImageUrl;
  final DateTime startTime;
  final DateTime endTime;
  final String location;
  final int attendeeCount;
  final bool isOnline;
  final String privacyLevel;

  Event({
    required this.id,
    required this.title,
    required this.description,
    this.coverImageUrl,
    required this.startTime,
    required this.endTime,
    required this.location,
    required this.attendeeCount,
    required this.isOnline,
    required this.privacyLevel,
  });

  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      id: json['id'] ?? 0,
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      coverImageUrl: json['cover_image_url'] ?? json['coverImageUrl'],
      startTime: DateTime.tryParse(json['start_time'] ?? json['startTime'] ?? '') ?? DateTime.now(),
      endTime: DateTime.tryParse(json['end_time'] ?? json['endTime'] ?? '') ?? DateTime.now().add(Duration(hours: 1)),
      location: json['location'] ?? 'Online',
      attendeeCount: json['attendee_count'] ?? json['attendeeCount'] ?? 0,
      isOnline: json['is_online'] ?? json['isOnline'] ?? false,
      privacyLevel: json['privacy_level'] ?? json['privacyLevel'] ?? 'public',
    );
  }
}

class EventsScreen extends StatefulWidget {
  @override
  _EventsScreenState createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen> {
  List<Event> _events = [];
  bool _isLoading = true;

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
          Event(
            id: 1,
            title: 'Flutter Developer Meetup',
            description: 'Monthly meetup for Flutter developers to share knowledge and network',
            coverImageUrl: 'https://via.placeholder.com/600x300',
            startTime: DateTime.now().add(Duration(days: 7)),
            endTime: DateTime.now().add(Duration(days: 7)).add(Duration(hours: 3)),
            location: 'Tech Hub, Downtown',
            attendeeCount: 45,
            isOnline: false,
            privacyLevel: 'public',
          ),
          Event(
            id: 2,
            title: 'Virtual Webinar: Future of Mobile Apps',
            description: 'Join industry experts discussing the future of mobile application development',
            coverImageUrl: 'https://via.placeholder.com/600x300',
            startTime: DateTime.now().add(Duration(days: 14)),
            endTime: DateTime.now().add(Duration(days: 14)).add(Duration(hours: 2)),
            location: 'Online',
            attendeeCount: 128,
            isOnline: true,
            privacyLevel: 'public',
          ),
          Event(
            id: 3,
            title: 'Startup Pitch Night',
            description: 'Local startups pitch their ideas to investors and the community',
            coverImageUrl: 'https://via.placeholder.com/600x300',
            startTime: DateTime.now().add(Duration(days: 21)),
            endTime: DateTime.now().add(Duration(days: 21)).add(Duration(hours: 4)),
            location: 'Innovation Center',
            attendeeCount: 23,
            isOnline: false,
            privacyLevel: 'private',
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading events: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading events')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Events'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () {
              // Search for events
            },
          ),
          IconButton(
            icon: Icon(Icons.add),
            onPressed: () {
              // Create new event
              _createNewEvent();
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _events.isEmpty
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
                        'No events yet',
                        style: TextStyle(
                          fontSize: 20,
                          color: Colors.grey[600],
                        ),
                      ),
                      SizedBox(height: 8),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 32),
                        child: Text(
                          'Create or join events to connect with the community',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            color: Colors.grey[500],
                          ),
                        ),
                      ),
                      SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _createNewEvent,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                          foregroundColor: Colors.white,
                        ),
                        child: Text('Create New Event'),
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
    );
  }

  Widget _buildEventItem(Event event) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Event cover image
          if (event.coverImageUrl != null)
            Container(
              height: 150,
              width: double.infinity,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(event.coverImageUrl!),
                  fit: BoxFit.cover,
                ),
              ),
            )
          else
            Container(
              height: 150,
              width: double.infinity,
              color: Colors.grey[300],
              child: Icon(
                Icons.event,
                size: 60,
                color: Colors.grey[600],
              ),
            ),
          
          // Event info
          Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        event.title,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: event.privacyLevel == 'public' 
                            ? Colors.green[100] 
                            : event.privacyLevel == 'private' 
                                ? Colors.orange[100] 
                                : Colors.blue[100],
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        event.privacyLevel.toUpperCase(),
                        style: TextStyle(
                          fontSize: 12,
                          color: event.privacyLevel == 'public' 
                              ? Colors.green[800] 
                              : event.privacyLevel == 'private' 
                                  ? Colors.orange[800] 
                                  : Colors.blue[800],
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 8),
                Text(
                  event.description,
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 14,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                SizedBox(height: 12),
                Row(
                  children: [
                    Icon(
                      Icons.calendar_today,
                      size: 16,
                      color: Colors.grey[600],
                    ),
                    SizedBox(width: 4),
                    Text(
                      '${_formatDate(event.startTime)} at ${_formatTime(event.startTime)}',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 4),
                Row(
                  children: [
                    Icon(
                      event.isOnline ? Icons.computer : Icons.location_on,
                      size: 16,
                      color: Colors.grey[600],
                    ),
                    SizedBox(width: 4),
                    Text(
                      event.location,
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 8),
                Row(
                  children: [
                    Icon(
                      Icons.people,
                      size: 16,
                      color: Colors.grey[600],
                    ),
                    SizedBox(width: 4),
                    Text(
                      '${event.attendeeCount} going',
                      style: TextStyle(
                        color: Colors.grey[600],
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          // RSVP to event
                          _rsvpToEvent(event);
                        },
                        child: Text('RSVP'),
                      ),
                    ),
                    SizedBox(width: 8),
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          // Navigate to event details
                          _openEventDetails(event);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue,
                        ),
                        child: Text('View Details'),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);
    
    if (difference.inDays == 0) {
      return 'Today';
    } else if (difference.inDays == -1) {
      return 'Tomorrow';
    } else if (difference.inDays > 0 && difference.inDays <= 7) {
      return '${difference.inDays} days ago';
    } else {
      return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
    }
  }

  String _formatTime(DateTime dateTime) {
    return '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  void _createNewEvent() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        final titleController = TextEditingController();
        final descriptionController = TextEditingController();
        final locationController = TextEditingController();
        final dateController = TextEditingController();
        final timeController = TextEditingController();
        bool isOnline = false;
        String privacyLevel = 'public';

        return AlertDialog(
          title: Text('Create New Event'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: titleController,
                  decoration: InputDecoration(
                    labelText: 'Event Title',
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
                TextField(
                  controller: locationController,
                  decoration: InputDecoration(
                    labelText: 'Location',
                    border: OutlineInputBorder(),
                  ),
                  enabled: !isOnline,
                ),
                SizedBox(height: 16),
                Row(
                  children: [
                    Checkbox(
                      value: isOnline,
                      onChanged: (value) {
                        setState(() {
                          isOnline = value ?? false;
                        });
                      },
                    ),
                    Text('Online Event'),
                  ],
                ),
                SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: dateController,
                        decoration: InputDecoration(
                          labelText: 'Date',
                          border: OutlineInputBorder(),
                        ),
                        readOnly: true,
                        onTap: () async {
                          DateTime? pickedDate = await showDatePicker(
                            context: context,
                            initialDate: DateTime.now(),
                            firstDate: DateTime.now(),
                            lastDate: DateTime.now().add(Duration(days: 365)),
                          );
                          if (pickedDate != null) {
                            dateController.text = 
                                "${pickedDate.day}/${pickedDate.month}/${pickedDate.year}";
                          }
                        },
                      ),
                    ),
                    SizedBox(width: 16),
                    Expanded(
                      child: TextField(
                        controller: timeController,
                        decoration: InputDecoration(
                          labelText: 'Start Time',
                          border: OutlineInputBorder(),
                        ),
                        readOnly: true,
                        onTap: () async {
                          TimeOfDay? pickedTime = await showTimePicker(
                            context: context,
                            initialTime: TimeOfDay.now(),
                          );
                          if (pickedTime != null) {
                            timeController.text = 
                                "${pickedTime.hour.toString().padLeft(2, '0')}:${pickedTime.minute.toString().padLeft(2, '0')}";
                          }
                        },
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  initialValue: privacyLevel,
                  decoration: InputDecoration(
                    labelText: 'Privacy Level',
                    border: OutlineInputBorder(),
                  ),
                  items: ['public', 'private', 'friends'].map((String value) {
                    return DropdownMenuItem<String>(
                      value: value,
                      child: Text(value.toUpperCase()),
                    );
                  }).toList(),
                  onChanged: (String? newValue) {
                    if (newValue != null) {
                      privacyLevel = newValue;
                    }
                  },
                ),
              ],
            ),
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
                // In a real app, this would create the event via API
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Event would be created'),
                    backgroundColor: Colors.green,
                  ),
                );
              },
              child: Text('Create'),
            ),
          ],
        );
      },
    );
  }

  void _rsvpToEvent(Event event) {
    // In a real app, this would RSVP to the event via API
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('RSVPed to ${event.title}'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _openEventDetails(Event event) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => EventDetailScreen(event: event),
      ),
    );
  }
}

class EventDetailScreen extends StatelessWidget {
  final Event event;

  const EventDetailScreen({required this.event});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(event.title),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Event cover
            if (event.coverImageUrl != null)
              Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: NetworkImage(event.coverImageUrl!),
                    fit: BoxFit.cover,
                  ),
                ),
              )
            else
              Container(
                height: 200,
                width: double.infinity,
                color: Colors.grey[300],
                child: Icon(
                  Icons.event,
                  size: 80,
                  color: Colors.grey[600],
                ),
              ),
            
            Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          event.title,
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: event.privacyLevel == 'public' 
                              ? Colors.green[100] 
                              : event.privacyLevel == 'private' 
                                  ? Colors.orange[100] 
                                  : Colors.blue[100],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          event.privacyLevel.toUpperCase(),
                          style: TextStyle(
                            fontSize: 12,
                            color: event.privacyLevel == 'public' 
                                ? Colors.green[800] 
                                : event.privacyLevel == 'private' 
                                    ? Colors.orange[800] 
                                    : Colors.blue[800],
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(
                        Icons.people,
                        color: Colors.grey[600],
                      ),
                      SizedBox(width: 4),
                      Text(
                        '${event.attendeeCount} people going',
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 16),
                  Row(
                    children: [
                      Icon(
                        Icons.calendar_today,
                        color: Colors.grey[600],
                      ),
                      SizedBox(width: 8),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _formatDate(event.startTime),
                            style: TextStyle(
                              fontSize: 16,
                            ),
                          ),
                          Text(
                            '${_formatTime(event.startTime)} - ${_formatTime(event.endTime)}',
                            style: TextStyle(
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(
                        event.isOnline ? Icons.computer : Icons.location_on,
                        color: Colors.grey[600],
                      ),
                      SizedBox(width: 8),
                      Text(
                        event.location,
                        style: TextStyle(
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Description',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    event.description,
                    style: TextStyle(
                      fontSize: 16,
                    ),
                  ),
                  SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {},
                          child: Text('Maybe'),
                        ),
                      ),
                      SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                          ),
                          child: Text('Going'),
                        ),
                      ),
                      SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {},
                          child: Text('Invite'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
  }

  String _formatTime(DateTime dateTime) {
    return '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
  }
}