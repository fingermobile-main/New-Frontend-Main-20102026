import 'package:flutter/material.dart';

class EventsPage extends StatefulWidget {
  const EventsPage({super.key});

  @override
  State<EventsPage> createState() => _EventsPageState();
}

class _EventsPageState extends State<EventsPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<EventCategory> _categories = [];
  List<EventItem> _upcomingEvents = [];
  List<EventItem> _pastEvents = [];
  String _selectedCategory = 'all';
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadEventsData();
  }

  Future<void> _loadEventsData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock events data
      setState(() {
        _categories = [
          EventCategory(id: 'all', name: 'All Events'),
          EventCategory(id: 'conference', name: 'Conferences'),
          EventCategory(id: 'workshop', name: 'Workshops'),
          EventCategory(id: 'meetup', name: 'Meetups'),
          EventCategory(id: 'webinar', name: 'Webinars'),
          EventCategory(id: 'hackathon', name: 'Hackathons'),
        ];

        _upcomingEvents = [
          EventItem(
            id: 1,
            title: 'Mobile Development Conference 2023',
            description: 'Join industry experts for insights on the latest mobile development trends',
            date: DateTime.now().add(const Duration(days: 5)),
            location: 'San Francisco, CA',
            type: EventType.conference,
            imageUrl: 'https://via.placeholder.com/600x300/4ECDC4/FFFFFF?text=Mobile+Conf',
            attendees: 1200,
            isAttending: false,
          ),
          EventItem(
            id: 2,
            title: 'Flutter Workshop for Beginners',
            description: 'Hands-on workshop to learn Flutter basics and build your first app',
            date: DateTime.now().add(const Duration(days: 12)),
            location: 'Online',
            type: EventType.workshop,
            imageUrl: 'https://via.placeholder.com/600x300/FF6B6B/FFFFFF?text=Flutter+Workshop',
            attendees: 85,
            isAttending: true,
          ),
          EventItem(
            id: 3,
            title: 'Tech Startup Meetup',
            description: 'Network with fellow entrepreneurs and tech enthusiasts',
            date: DateTime.now().add(const Duration(days: 18)),
            location: 'Tech Hub Downtown',
            type: EventType.meetup,
            imageUrl: 'https://via.placeholder.com/600x300/45B7D1/FFFFFF?text=Startup+Meetup',
            attendees: 45,
            isAttending: false,
          ),
        ];

        _pastEvents = [
          EventItem(
            id: 4,
            title: 'Annual Developer Summit',
            description: 'Three-day summit featuring keynote speakers and technical sessions',
            date: DateTime.now().subtract(const Duration(days: 15)),
            location: 'Convention Center',
            type: EventType.conference,
            imageUrl: 'https://via.placeholder.com/600x300/F9CA24/FFFFFF?text=Dev+Summit',
            attendees: 2500,
            isAttending: true,
          ),
          EventItem(
            id: 5,
            title: 'UI/UX Design Webinar',
            description: 'Learn the latest design principles and member experience best practices',
            date: DateTime.now().subtract(const Duration(days: 30)),
            location: 'Online',
            type: EventType.webinar,
            imageUrl: 'https://via.placeholder.com/600x300/6C5CE7/FFFFFF?text=UI+UX+Webinar',
            attendees: 540,
            isAttending: false,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load events. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _toggleAttendance(int eventId) {
    setState(() {
      if (_activeTab == 0) {
        var event = _upcomingEvents.firstWhere((e) => e.id == eventId);
        event.isAttending = !event.isAttending;
        event.attendees += event.isAttending ? 1 : -1;
      } else {
        var event = _pastEvents.firstWhere((e) => e.id == eventId);
        event.isAttending = !event.isAttending;
        event.attendees += event.isAttending ? 1 : -1;
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _activeTab == 0 
            ? (_upcomingEvents.firstWhere((e) => e.id == eventId).isAttending
               ? 'You are now attending this event!'
               : 'Removed from your events')
            : (_pastEvents.firstWhere((e) => e.id == eventId).isAttending
               ? 'Marked as attended'
               : 'Unmarked as attended'),
        ),
        backgroundColor: 
          _activeTab == 0 
            ? (_upcomingEvents.firstWhere((e) => e.id == eventId).isAttending
               ? Colors.green
               : Colors.orange)
            : (_pastEvents.firstWhere((e) => e.id == eventId).isAttending
               ? Colors.green
               : Colors.orange),
      ),
    );
  }

  void _selectCategory(String categoryId) {
    setState(() {
      _selectedCategory = categoryId;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Events'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Open search
            },
          ),
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              // Create new event
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadEventsData,
        child: _isLoading && _categories.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _categories.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadEventsData,
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
                          // Categories
                          const Text(
                            'Event Categories',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            height: 40,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: _categories.length,
                              itemBuilder: (context, index) {
                                var category = _categories[index];
                                bool isSelected = _selectedCategory == category.id;

                                return Padding(
                                  padding: EdgeInsets.only(
                                    right: 8.0,
                                    left: index == 0 ? 0 : 8.0,
                                  ),
                                  child: FilterChip(
                                    label: Text(category.name),
                                    selected: isSelected,
                                    onSelected: (selected) {
                                      _selectCategory(category.id);
                                    },
                                    selectedColor: Theme.of(context).primaryColor,
                                    showCheckmark: false,
                                  ),
                                );
                              },
                            ),
                          ),
                          const SizedBox(height: 32),
                          // Tab Bar
                          Container(
                            height: 50,
                            decoration: BoxDecoration(
                              color: Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(25),
                            ),
                            child: Row(
                              children: [
                                _buildTab('Upcoming', 0),
                                _buildTab('Past Events', 1),
                              ],
                            ),
                          ),
                          const SizedBox(height: 24),
                          // Tab Content
                          if (_activeTab == 0) ...[
                            // Upcoming Events
                            const Text(
                              'Upcoming Events',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _upcomingEvents.length,
                              itemBuilder: (context, index) {
                                var event = _upcomingEvents[index];
                                return _buildEventCard(event);
                              },
                            ),
                          ] else ...[
                            // Past Events
                            const Text(
                              'Past Events',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _pastEvents.length,
                              itemBuilder: (context, index) {
                                var event = _pastEvents[index];
                                return _buildEventCard(event);
                              },
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
      ),
    );
  }

  Widget _buildTab(String title, int index) {
    bool isActive = _activeTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _activeTab = index;
          });
        },
        child: Container(
          decoration: BoxDecoration(
            color: isActive ? Theme.of(context).primaryColor : Colors.transparent,
            borderRadius: BorderRadius.circular(25),
          ),
          child: Center(
            child: Text(
              title,
              style: TextStyle(
                fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                color: isActive ? Colors.white : Colors.grey,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildEventCard(EventItem event) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              height: 150,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(event.imageUrl),
                  fit: BoxFit.cover,
                ),
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            const SizedBox(height: 16),
            Text(
              event.title,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 18,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              event.description,
              style: const TextStyle(
                color: Colors.grey,
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Icon(
                  Icons.calendar_today,
                  size: 16,
                  color: Colors.grey,
                ),
                const SizedBox(width: 8),
                Text(_formatDate(event.date)),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(
                  Icons.location_on,
                  size: 16,
                  color: Colors.grey,
                ),
                const SizedBox(width: 8),
                Text(event.location),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('${event.attendees} attending'),
                ElevatedButton(
                  onPressed: () => _toggleAttendance(event.id),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: event.isAttending 
                      ? Colors.grey 
                      : Theme.of(context).primaryColor,
                  ),
                  child: Text(
                    event.isAttending ? 'Attending' : 'Attend',
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year} at ${_formatTime(date)}';
  }

  String _formatTime(DateTime date) {
    return '${date.hour}:${date.minute.toString().padLeft(2, '0')}';
  }
}

enum EventType { conference, workshop, meetup, webinar, hackathon }

class EventCategory {
  final String id;
  final String name;

  EventCategory({
    required this.id,
    required this.name,
  });
}

class EventItem {
  final int id;
  final String title;
  final String description;
  final DateTime date;
  final String location;
  final EventType type;
  final String imageUrl;
  final int attendees;
  bool isAttending;

  EventItem({
    required this.id,
    required this.title,
    required this.description,
    required this.date,
    required this.location,
    required this.type,
    required this.imageUrl,
    required this.attendees,
    required this.isAttending,
  });
}