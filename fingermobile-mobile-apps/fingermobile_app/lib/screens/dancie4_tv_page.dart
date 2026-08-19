import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class Dancie4TvPage extends StatefulWidget {
  const Dancie4TvPage({super.key});

  @override
  State<Dancie4TvPage> createState() => _Dancie4TvPageState();
}

class _Dancie4TvPageState extends State<Dancie4TvPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<DancieChannel> _channels = [];
  List<DancieShow> _shows = [];
  List<DancieCategory> _categories = [];
  String _selectedCategory = 'all';
  int _selectedChannelIndex = 0;
  bool _isPlaying = false;

  @override
  void initState() {
    super.initState();
    _loadDancieContent();
  }

  Future<void> _loadDancieContent() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock Dancie content
      setState(() {
        _channels = [
          DancieChannel(
            id: 1,
            name: 'Dancie HD',
            logoUrl: 'https://via.placeholder.com/150/4ECDC4/FFFFFF?text=Dancie+HD',
            isLive: true,
          ),
          DancieChannel(
            id: 2,
            name: 'Dancie Sports',
            logoUrl: 'https://via.placeholder.com/150/FF6B6B/FFFFFF?text=Sports',
            isLive: true,
          ),
          DancieChannel(
            id: 3,
            name: 'Dancie Movies',
            logoUrl: 'https://via.placeholder.com/150/45B7D1/FFFFFF?text=Movies',
            isLive: false,
          ),
          DancieChannel(
            id: 4,
            name: 'Dancie Kids',
            logoUrl: 'https://via.placeholder.com/150/F9CA24/FFFFFF?text=Kids',
            isLive: true,
          ),
        ];
        
        _shows = [
          DancieShow(
            id: 1,
            title: 'Dancie Prime Time',
            description: 'The hottest shows and exclusive content',
            episodeTitle: 'Episode 42: Special Guest',
            duration: '45 min',
            channel: 'Dancie HD',
            isLive: true,
            thumbnailUrl: 'https://via.placeholder.com/600x300/4ECDC4/FFFFFF?text=Prime+Time',
            rating: 4.5,
          ),
          DancieShow(
            id: 2,
            title: 'Sports Central',
            description: 'Live sports coverage and analysis',
            episodeTitle: 'Championship Finals',
            duration: '2h 15min',
            channel: 'Dancie Sports',
            isLive: true,
            thumbnailUrl: 'https://via.placeholder.com/600x300/FF6B6B/FFFFFF?text=Sports+Central',
            rating: 4.2,
          ),
          DancieShow(
            id: 3,
            title: 'Movie Night',
            description: 'Classic films and new releases',
            episodeTitle: 'Casablanca',
            duration: '1h 42min',
            channel: 'Dancie Movies',
            isLive: false,
            thumbnailUrl: 'https://via.placeholder.com/600x300/45B7D1/FFFFFF?text=Movie+Night',
            rating: 4.8,
          ),
          DancieShow(
            id: 4,
            title: 'Kids Corner',
            description: 'Educational and entertaining shows for kids',
            episodeTitle: 'The Magic School Bus',
            duration: '30 min',
            channel: 'Dancie Kids',
            isLive: false,
            thumbnailUrl: 'https://via.placeholder.com/600x300/F9CA24/FFFFFF?text=Kids+Corner',
            rating: 4.0,
          ),
        ];
        
        _categories = [
          DancieCategory(id: 'all', name: 'All Shows'),
          DancieCategory(id: 'live', name: 'Live Now'),
          DancieCategory(id: 'movies', name: 'Movies'),
          DancieCategory(id: 'sports', name: 'Sports'),
          DancieCategory(id: 'kids', name: 'Kids'),
          DancieCategory(id: 'news', name: 'News'),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load Dancie TV content. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _togglePlay() {
    setState(() {
      _isPlaying = !_isPlaying;
    });
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
        title: const Text('Dancie 4 TV'),
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
        onRefresh: _loadDancieContent,
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
                          onPressed: _loadDancieContent,
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
                          // Live Player Section
                          const Text(
                            'Now Playing',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Container(
                            height: 200,
                            decoration: BoxDecoration(
                              image: DecorationImage(
                                image: CachedNetworkImageProvider(_shows[0].thumbnailUrl),
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
                                    Colors.black.withOpacity(0.8),
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
                                      _shows[0].title,
                                      style: const TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      _shows[0].episodeTitle,
                                      style: const TextStyle(
                                        color: Colors.white70,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Row(
                                      children: [
                                        if (_shows[0].isLive)
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
                                          _shows[0].channel,
                                          style: const TextStyle(
                                            color: Colors.white,
                                          ),
                                        ),
                                        const Spacer(),
                                        IconButton(
                                          icon: Icon(
                                            _isPlaying 
                                              ? Icons.pause_circle_filled 
                                              : Icons.play_circle_fill,
                                            color: Colors.white,
                                            size: 40,
                                          ),
                                          onPressed: _togglePlay,
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 32),
                          // Channels
                          const Text(
                            'Channels',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            height: 80,
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
                                      width: 70,
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
                                                image: CachedNetworkImageProvider(channel.logoUrl),
                                              ),
                                              shape: BoxShape.circle,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            channel.name,
                                            style: TextStyle(
                                              fontSize: 10,
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
                          // Shows Grid
                          const Text(
                            'Popular Shows',
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
                              childAspectRatio: 0.7,
                            ),
                            itemCount: _shows.length,
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemBuilder: (context, index) {
                              var show = _shows[index];
                              return GestureDetector(
                                onTap: () {
                                  // Play show
                                },
                                child: Card(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Expanded(
                                        child: Stack(
                                          children: [
                                            CachedNetworkImage(
                                               imageUrl: show.thumbnailUrl,
                                               width: double.infinity,
                                               fit: BoxFit.cover,
                                               placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                                               errorWidget: (context, url, error) => Container(
                                                 color: Colors.grey[300],
                                                 child: const Icon(Icons.image),
                                               ),
                                             ),
                                            if (show.isLive)
                                              Positioned(
                                                top: 8,
                                                right: 8,
                                                child: Container(
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
                                              ),
                                          ],
                                        ),
                                      ),
                                      Padding(
                                        padding: const EdgeInsets.all(8.0),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              show.title,
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                              ),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              show.episodeTitle,
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: Colors.grey,
                                              ),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            const SizedBox(height: 4),
                                            Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                              children: [
                                                Text(
                                                  show.duration,
                                                  style: const TextStyle(
                                                    fontSize: 12,
                                                  ),
                                                ),
                                                Row(
                                                  children: [
                                                    const Icon(
                                                      Icons.star,
                                                      size: 14,
                                                      color: Colors.amber,
                                                    ),
                                                    Text(
                                                      show.rating.toString(),
                                                      style: const TextStyle(
                                                        fontSize: 12,
                                                      ),
                                                    ),
                                                  ],
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
}

class DancieChannel {
  final int id;
  final String name;
  final String logoUrl;
  final bool isLive;

  DancieChannel({
    required this.id,
    required this.name,
    required this.logoUrl,
    required this.isLive,
  });
}

class DancieShow {
  final int id;
  final String title;
  final String description;
  final String episodeTitle;
  final String duration;
  final String channel;
  final bool isLive;
  final String thumbnailUrl;
  final double rating;

  DancieShow({
    required this.id,
    required this.title,
    required this.description,
    required this.episodeTitle,
    required this.duration,
    required this.channel,
    required this.isLive,
    required this.thumbnailUrl,
    required this.rating,
  });
}

class DancieCategory {
  final String id;
  final String name;

  DancieCategory({
    required this.id,
    required this.name,
  });
}