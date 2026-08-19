import 'package:flutter/material.dart';

class TravelDestinationsScreen extends StatefulWidget {
  @override
  _TravelDestinationsScreenState createState() => _TravelDestinationsScreenState();
}

class _TravelDestinationsScreenState extends State<TravelDestinationsScreen> {
  List<TravelDestination> _destinations = [];
  List<TravelDestination> _trending = [];
  List<TravelDestination> _recommended = [];
  bool _isLoading = true;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadDestinations();
  }

  Future<void> _loadDestinations() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _destinations = [
          TravelDestination(
            id: 1,
            name: 'Bali, Indonesia',
            description: 'Tropical paradise with beautiful beaches and temples',
            price: 1200,
            originalPrice: 1500,
            rating: 4.8,
            totalReviews: 2456,
            imageUrl: 'https://via.placeholder.com/600x400',
            category: 'Beach',
            duration: '7 days',
            isFavorite: false,
          ),
          TravelDestination(
            id: 2,
            name: 'Paris, France',
            description: 'City of lights with iconic landmarks and cuisine',
            price: 1800,
            originalPrice: 2200,
            rating: 4.7,
            totalReviews: 3124,
            imageUrl: 'https://via.placeholder.com/600x400',
            category: 'City',
            duration: '5 days',
            isFavorite: true,
          ),
          TravelDestination(
            id: 3,
            name: 'Tokyo, Japan',
            description: 'Modern metropolis blending tradition and innovation',
            price: 2200,
            originalPrice: 2500,
            rating: 4.9,
            totalReviews: 1876,
            imageUrl: 'https://via.placeholder.com/600x400',
            category: 'City',
            duration: '10 days',
            isFavorite: false,
          ),
          TravelDestination(
            id: 4,
            name: 'Santorini, Greece',
            description: 'Stunning sunsets and iconic white-washed buildings',
            price: 1600,
            originalPrice: 1900,
            rating: 4.8,
            totalReviews: 1543,
            imageUrl: 'https://via.placeholder.com/600x400',
            category: 'Island',
            duration: '6 days',
            isFavorite: false,
          ),
        ];
        
        _trending = [
          TravelDestination(
            id: 5,
            name: 'Maldives',
            description: 'Pristine beaches and overwater bungalows',
            price: 2800,
            originalPrice: 3200,
            rating: 4.9,
            totalReviews: 1234,
            imageUrl: 'https://via.placeholder.com/600x400',
            category: 'Beach',
            duration: '5 days',
            isFavorite: false,
          ),
          TravelDestination(
            id: 6,
            name: 'New York City',
            description: 'The city that never sleeps',
            price: 1900,
            originalPrice: 2300,
            rating: 4.6,
            totalReviews: 2789,
            imageUrl: 'https://via.placeholder.com/600x400',
            category: 'City',
            duration: '7 days',
            isFavorite: false,
          ),
        ];
        
        _recommended = [
          TravelDestination(
            id: 7,
            name: 'Swiss Alps',
            description: 'Breathtaking mountain landscapes',
            price: 2100,
            originalPrice: 2400,
            rating: 4.8,
            totalReviews: 987,
            imageUrl: 'https://via.placeholder.com/600x400',
            category: 'Mountain',
            duration: '8 days',
            isFavorite: false,
          ),
          TravelDestination(
            id: 8,
            name: 'Safari in Kenya',
            description: 'Wildlife adventure in the African savannah',
            price: 3200,
            originalPrice: 3600,
            rating: 4.9,
            totalReviews: 654,
            imageUrl: 'https://via.placeholder.com/600x400',
            category: 'Adventure',
            duration: '10 days',
            isFavorite: false,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading destinations: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading destinations')),
      );
    }
  }

  void _toggleFavorite(TravelDestination destination) {
    setState(() {
      final index = _destinations.indexWhere((d) => d.id == destination.id);
      if (index != -1) {
        _destinations[index] = TravelDestination(
          id: _destinations[index].id,
          name: _destinations[index].name,
          description: _destinations[index].description,
          price: _destinations[index].price,
          originalPrice: _destinations[index].originalPrice,
          rating: _destinations[index].rating,
          totalReviews: _destinations[index].totalReviews,
          imageUrl: _destinations[index].imageUrl,
          category: _destinations[index].category,
          duration: _destinations[index].duration,
          isFavorite: !_destinations[index].isFavorite,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Container(
          width: double.infinity,
          height: 40,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.2),
            borderRadius: BorderRadius.circular(10),
          ),
          child: TextField(
            onChanged: (value) {
              setState(() {
                _searchQuery = value;
              });
            },
            style: TextStyle(color: Colors.white),
            decoration: InputDecoration(
              prefixIcon: Icon(Icons.search, color: Colors.white),
              hintText: 'Search destinations...',
              hintStyle: TextStyle(color: Colors.white70),
              border: InputBorder.none,
            ),
          ),
        ),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.bookmark),
            onPressed: () {
              // Navigate to saved destinations
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadDestinations,
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Trending Destinations Section
                    Padding(
                      padding: EdgeInsets.all(16),
                      child: Text(
                        'Trending Destinations',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Container(
                      height: 200,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _trending.length,
                        itemBuilder: (context, index) {
                          final destination = _trending[index];
                          return _buildDestinationCard(destination, true);
                        },
                      ),
                    ),
                    
                    // Recommended For You Section
                    Padding(
                      padding: EdgeInsets.all(16),
                      child: Text(
                        'Recommended For You',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    Container(
                      height: 200,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _recommended.length,
                        itemBuilder: (context, index) {
                          final destination = _recommended[index];
                          return _buildDestinationCard(destination, true);
                        },
                      ),
                    ),
                    
                    // All Destinations Section
                    Padding(
                      padding: EdgeInsets.all(16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'All Destinations',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              // Navigate to all destinations
                            },
                            child: Text('See All'),
                          ),
                        ],
                      ),
                    ),
                    ListView.builder(
                      shrinkWrap: true,
                      physics: NeverScrollableScrollPhysics(),
                      itemCount: _destinations.length,
                      itemBuilder: (context, index) {
                        final destination = _destinations[index];
                        return _buildDestinationCard(destination, false);
                      },
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildDestinationCard(TravelDestination destination, bool isHorizontal) {
    return Card(
      margin: isHorizontal 
          ? EdgeInsets.only(left: 16, right: 8, bottom: 16) 
          : EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Container(
        width: isHorizontal ? 200 : double.infinity,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Destination image
            Stack(
              children: [
                Container(
                  height: isHorizontal ? 120 : 150,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: NetworkImage(destination.imageUrl),
                      fit: BoxFit.cover,
                    ),
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(4),
                      topRight: Radius.circular(4),
                    ),
                  ),
                ),
                Positioned(
                  top: 8,
                  right: 8,
                  child: GestureDetector(
                    onTap: () => _toggleFavorite(destination),
                    child: Icon(
                      destination.isFavorite ? Icons.favorite : Icons.favorite_border,
                      color: destination.isFavorite ? Colors.red : Colors.white,
                    ),
                  ),
                ),
                Positioned(
                  bottom: 8,
                  left: 8,
                  child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.blue,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      destination.category,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ),
              ],
            ),
            
            // Destination info
            Padding(
              padding: EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          destination.name,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 4),
                  Text(
                    destination.description,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 8),
                  Row(
                    children: [
                      Text(
                        '\$${destination.price}',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                      if (destination.originalPrice > destination.price) ...[
                        SizedBox(width: 8),
                        Text(
                          '\$${destination.originalPrice}',
                          style: TextStyle(
                            fontSize: 12,
                            decoration: TextDecoration.lineThrough,
                            color: Colors.grey[600],
                          ),
                        ),
                        SizedBox(width: 8),
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.red,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            '${(((destination.originalPrice - destination.price) / destination.originalPrice) * 100).round()}% OFF',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(
                        Icons.schedule,
                        size: 14,
                        color: Colors.grey[600],
                      ),
                      SizedBox(width: 4),
                      Text(
                        destination.duration,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                      Spacer(),
                      Icon(
                        Icons.star,
                        size: 14,
                        color: Colors.orange,
                      ),
                      SizedBox(width: 4),
                      Text(
                        '${destination.rating}',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                      Text(
                        '(${destination.totalReviews})',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  Container(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        // Navigate to destination details
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => DestinationDetailScreen(destination: destination),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                      ),
                      child: Text(
                        'View Details',
                        style: TextStyle(fontSize: 12),
                      ),
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
}

class TravelDestination {
  final int id;
  final String name;
  final String description;
  final int price;
  final int originalPrice;
  final double rating;
  final int totalReviews;
  final String imageUrl;
  final String category;
  final String duration;
  final bool isFavorite;

  TravelDestination({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.originalPrice,
    required this.rating,
    required this.totalReviews,
    required this.imageUrl,
    required this.category,
    required this.duration,
    required this.isFavorite,
  });
}

class DestinationDetailScreen extends StatelessWidget {
  final TravelDestination destination;

  const DestinationDetailScreen({required this.destination});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(destination.name),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Destination image
            Container(
              height: 300,
              width: double.infinity,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(destination.imageUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            
            // Destination details
            Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          destination.name,
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: Icon(
                          destination.isFavorite ? Icons.favorite : Icons.favorite_border,
                          color: destination.isFavorite ? Colors.red : Colors.grey,
                        ),
                        onPressed: () {
                          // Toggle favorite
                        },
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.blue[100],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      destination.category,
                      style: TextStyle(
                        color: Colors.blue[800],
                        fontSize: 14,
                      ),
                    ),
                  ),
                  SizedBox(height: 16),
                  Row(
                    children: [
                      Text(
                        '\$${destination.price}',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                      if (destination.originalPrice > destination.price) ...[
                        SizedBox(width: 8),
                        Text(
                          '\$${destination.originalPrice}',
                          style: TextStyle(
                            fontSize: 16,
                            decoration: TextDecoration.lineThrough,
                            color: Colors.grey[600],
                          ),
                        ),
                        SizedBox(width: 8),
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.red,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            '${(((destination.originalPrice - destination.price) / destination.originalPrice) * 100).round()}% OFF',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  SizedBox(height: 16),
                  Row(
                    children: [
                      Icon(
                        Icons.schedule,
                        color: Colors.grey[600],
                      ),
                      SizedBox(width: 4),
                      Text(
                        destination.duration,
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 16),
                  Row(
                    children: [
                      Icon(
                        Icons.star,
                        color: Colors.orange,
                      ),
                      SizedBox(width: 4),
                      Text(
                        '${destination.rating}',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Text(
                        '(${destination.totalReviews} reviews)',
                        style: TextStyle(
                          color: Colors.grey[600],
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
                    destination.description,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[700],
                    ),
                  ),
                  SizedBox(height: 24),
                  Container(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        // Book trip
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                      ),
                      child: Text('Book Now'),
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
}