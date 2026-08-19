import 'package:flutter/material.dart';

class Dancia4TvPage extends StatefulWidget {
  const Dancia4TvPage({super.key});

  @override
  State<Dancia4TvPage> createState() => _Dancia4TvPageState();
}

class _Dancia4TvPageState extends State<Dancia4TvPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<DanciaChannel> _channels = [];
  List<DanciaProgram> _programs = [];
  List<DanciaCategory> _categories = [];
  String _selectedCategory = 'all';
  int _selectedChannelIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadDanciaContent();
  }

  Future<void> _loadDanciaContent() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock Dancia content
      setState(() {
        _channels = [
          DanciaChannel(
            id: 1,
            name: 'Dancia News',
            logoUrl: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=News',
            isLive: true,
          ),
          DanciaChannel(
            id: 2,
            name: 'Dancia Sports',
            logoUrl: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Sports',
            isLive: true,
          ),
          DanciaChannel(
            id: 3,
            name: 'Dancia Movies',
            logoUrl: 'https://via.placeholder.com/150/45B7D1/FFFFFF?text=Movies',
            isLive: false,
          ),
          DanciaChannel(
            id: 4,
            name: 'Dancia Kids',
            logoUrl: 'https://via.placeholder.com/150/F9CA24/FFFFFF?text=Kids',
            isLive: true,
          ),
        ];
        
        _programs = [
          DanciaProgram(
            id: 1,
            title: 'Morning News Digest',
            description: 'Catch up with the latest news from around the world',
            startTime: DateTime.now().subtract(const Duration(hours: 1)),
            endTime: DateTime.now().add(const Duration(hours: 1)),
            channel: 'Dancia News',
            isLive: true,
            thumbnailUrl: 'https://via.placeholder.com/600x300/4ECDC4/FFFFFF?text=News+Digest',
          ),
          DanciaProgram(
            id: 2,
            title: 'Football Highlights',
            description: 'Best goals and moments from yesterday\'s matches',
            startTime: DateTime.now().add(const Duration(hours: 2)),
            endTime: DateTime.now().add(const Duration(hours: 3)),
            channel: 'Dancia Sports',
            isLive: false,
            thumbnailUrl: 'https://via.placeholder.com/600x300/FF6B6B/FFFFFF?text=Football',
          ),
          DanciaProgram(
            id: 3,
            title: 'Movie of the Week',
            description: 'This week\'s featured movie with exclusive behind-the-scenes content',
            startTime: DateTime.now().add(const Duration(hours: 4)),
            endTime: DateTime.now().add(const Duration(hours: 6)),
            channel: 'Dancia Movies',
            isLive: false,
            thumbnailUrl: 'https://via.placeholder.com/600x300/45B7D1/FFFFFF?text=Movie+Week',
          ),
        ];
        
        _categories = [
          DanciaCategory(id: 'all', name: 'All Channels'),
          DanciaCategory(id: 'news', name: 'News'),
          DanciaCategory(id: 'sports', name: 'Sports'),
          DanciaCategory(id: 'movies', name: 'Movies'),
          DanciaCategory(id: 'kids', name: 'Kids'),
          DanciaCategory(id: 'music', name: 'Music'),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load Dancia TV content. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _selectChannel(int index) {
    setState(() {
      _selectedChannelIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dancia 4 TV'),
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
            icon: const Icon(Icons.cast),
            onPressed: () {
              // Cast to TV
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadDanciaContent,
        child: _isLoading && _channels.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _channels.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadDanciaContent,
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
                          // Live Channel Bar
                          const Text(
                            'Live Channels',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            height: 100,
                            child: ListView.builder(
                              scrollDirection: Axis.horizontal,
                              itemCount: _channels.length,
                              itemBuilder: (context, index) {
                                var channel = _channels[index];
                                bool isSelected = _selectedChannelIndex == index;
                                
                                return Padding(
                                  padding: EdgeInsets.only(
                                    right: 16.0,
                                    left: index == 0 ? 0 : 16.0,
                                  ),
                                  child: GestureDetector(
                                    onTap: () => _selectChannel(index),
                                    child: Container(
                                      width: 80,
                                      decoration: BoxDecoration(
                                        color: isSelected 
                                          ? Theme.of(context).primaryColor 
                                          : Colors.grey.shade200,
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Column(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Container(
                                            width: 40,
                                            height: 40,
                                            decoration: BoxDecoration(
                                              image: DecorationImage(
                                                image: NetworkImage(channel.logoUrl),
                                              ),
                                              shape: BoxShape.circle,
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            channel.name,
                                            style: TextStyle(
                                              fontSize: 12,
                                              color: isSelected 
                                                ? Colors.white 
                                                : Colors.black,
                                            ),
                                            textAlign: TextAlign.center,
                                          ),
                                          if (channel.isLive)
                                            Container(
                                              padding: const EdgeInsets.symmetric(
                                                horizontal: 4,
                                                vertical: 2,
                                              ),
                                              decoration: BoxDecoration(
                                                color: Colors.red,
                                                borderRadius: BorderRadius.circular(4),
                                              ),
                                              child: const Text(
                                                'LIVE',
                                                style: TextStyle(
                                                  color: Colors.white,
                                                  fontSize: 8,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                            ),
                                        ],
                                      ),
                                    ),
                                  ),
                                );
                              },
                            ),
                          ),
                          const SizedBox(height: 32),
                          // Categories
                          const Text(
                            'Categories',
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
                                      setState(() {
                                        _selectedCategory = category.id;
                                      });
                                    },
                                    selectedColor: Theme.of(context).primaryColor,
                                    showCheckmark: false,
                                  ),
                                );
                              },
                            ),
                          ),
                          const SizedBox(height: 32),
                          // Featured Program
                          const Text(
                            'Featured Program',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          if (_programs.isNotEmpty)
                            Container(
                              height: 200,
                              decoration: BoxDecoration(
                                image: DecorationImage(
                                  image: NetworkImage(_programs[0].thumbnailUrl),
                                  fit: BoxFit.cover,
                                ),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Container(
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(8),
                                  gradient: LinearGradient(
                                    begin: Alignment.bottomCenter,
                                    end: Alignment.topCenter,
                                    colors: [
                                      Colors.black.withOpacity(0.7),
                                      Colors.transparent,
                                    ],
                                  ),
                                ),
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.end,
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        _programs[0].title,
                                        style: const TextStyle(
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        _programs[0].description,
                                        style: const TextStyle(
                                          color: Colors.white70,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Row(
                                        children: [
                                          if (_programs[0].isLive)
                                            Container(
                                              padding: const EdgeInsets.symmetric(
                                                horizontal: 8,
                                                vertical: 4,
                                              ),
                                              decoration: BoxDecoration(
                                                color: Colors.red,
                                                borderRadius: BorderRadius.circular(12),
                                              ),
                                              child: const Text(
                                                'LIVE NOW',
                                                style: TextStyle(
                                                  color: Colors.white,
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 12,
                                                ),
                                              ),
                                            ),
                                          const SizedBox(width: 8),
                                          Text(
                                            _programs[0].channel,
                                            style: const TextStyle(
                                              color: Colors.white,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          const SizedBox(height: 32),
                          // Program Schedule
                          const Text(
                            'Program Schedule',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _programs.length,
                            itemBuilder: (context, index) {
                              var program = _programs[index];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 16),
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Row(
                                    children: [
                                      Container(
                                        width: 80,
                                        height: 60,
                                        decoration: BoxDecoration(
                                          image: DecorationImage(
                                            image: NetworkImage(program.thumbnailUrl),
                                            fit: BoxFit.cover,
                                          ),
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                      ),
                                      const SizedBox(width: 16),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              program.title,
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              program.description,
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: Colors.grey,
                                              ),
                                              maxLines: 2,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            const SizedBox(height: 8),
                                            Row(
                                              children: [
                                                Text(
                                                  program.channel,
                                                  style: const TextStyle(
                                                    fontSize: 12,
                                                  ),
                                                ),
                                                const SizedBox(width: 16),
                                                Text(
                                                  '${_formatTime(program.startTime)} - ${_formatTime(program.endTime)}',
                                                  style: const TextStyle(
                                                    fontSize: 12,
                                                    color: Colors.grey,
                                                  ),
                                                ),
                                                const Spacer(),
                                                if (program.isLive)
                                                  Container(
                                                    padding: const EdgeInsets.symmetric(
                                                      horizontal: 8,
                                                      vertical: 4,
                                                    ),
                                                    decoration: BoxDecoration(
                                                      color: Colors.red,
                                                      borderRadius: BorderRadius.circular(12),
                                                    ),
                                                    child: const Text(
                                                      'LIVE',
                                                      style: TextStyle(
                                                        color: Colors.white,
                                                        fontSize: 10,
                                                        fontWeight: FontWeight.bold,
                                                      ),
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
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
      ),
    );
  }

  String _formatTime(DateTime dateTime) {
    return '${dateTime.hour}:${dateTime.minute.toString().padLeft(2, '0')}';
  }
}

class DanciaChannel {
  final int id;
  final String name;
  final String logoUrl;
  final bool isLive;

  DanciaChannel({
    required this.id,
    required this.name,
    required this.logoUrl,
    required this.isLive,
  });
}

class DanciaProgram {
  final int id;
  final String title;
  final String description;
  final DateTime startTime;
  final DateTime endTime;
  final String channel;
  final bool isLive;
  final String thumbnailUrl;

  DanciaProgram({
    required this.id,
    required this.title,
    required this.description,
    required this.startTime,
    required this.endTime,
    required this.channel,
    required this.isLive,
    required this.thumbnailUrl,
  });
}

class DanciaCategory {
  final String id;
  final String name;

  DanciaCategory({
    required this.id,
    required this.name,
  });
}