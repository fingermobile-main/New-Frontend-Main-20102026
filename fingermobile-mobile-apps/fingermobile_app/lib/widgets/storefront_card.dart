import 'package:flutter/material.dart';

class StorefrontCard extends StatelessWidget {
  final String name;
  final String description;
  final String location;
  final int rating;
  final int reviewCount;
  final String category;
  final String imageUrl;
  final bool isFavorite;
  final Function(bool)? onFavoriteToggle;
  final Function()? onTap;

  const StorefrontCard({
    Key? key,
    required this.name,
    required this.description,
    required this.location,
    required this.rating,
    required this.reviewCount,
    required this.category,
    required this.imageUrl,
    this.isFavorite = false,
    this.onFavoriteToggle,
    this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        borderRadius: BorderRadius.circular(12),
        onTap: onTap,
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Image and favorite button
              Stack(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      height: 160,
                      width: double.infinity,
                      child: imageUrl.isEmpty
                          ? Container(
                              color: Colors.grey[300],
                              child: Icon(
                                Icons.storefront,
                                size: 50,
                                color: Colors.grey[500],
                              ),
                            )
                          : Image.network(
                              imageUrl,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return Container(
                                  color: Colors.grey[300],
                                  child: Icon(
                                    Icons.storefront,
                                    size: 50,
                                    color: Colors.grey[500],
                                  ),
                                );
                              },
                            ),
                    ),
                  ),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.8),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 4,
                            offset: Offset(0, 2),
                          ),
                        ],
                      ),
                      child: IconButton(
                        icon: Icon(
                          isFavorite ? Icons.favorite : Icons.favorite_border,
                          color: isFavorite ? Colors.red : Colors.grey[600],
                          size: 24,
                        ),
                        onPressed: () {
                          if (onFavoriteToggle != null) {
                            onFavoriteToggle!(!isFavorite);
                          }
                        },
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 8,
                    left: 8,
                    child: Container(
                      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.6),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        category,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 12),
              
              // Store name
              Text(
                name,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[800],
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              
              SizedBox(height: 4),
              
              // Rating and reviews
              Row(
                children: [
                  Icon(
                    Icons.star,
                    color: Colors.amber,
                    size: 16,
                  ),
                  SizedBox(width: 4),
                  Text(
                    '$rating (${reviewCount} reviews)',
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 8),
              
              // Description
              Text(
                description,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              
              SizedBox(height: 12),
              
              // Location
              Row(
                children: [
                  Icon(
                    Icons.location_on,
                    size: 16,
                    color: Colors.blue,
                  ),
                  SizedBox(width: 4),
                  Text(
                    location,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.blue,
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 12),
              
              // Action buttons
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: onTap,
                      icon: Icon(Icons.store, size: 16),
                      label: Text('Visit Store'),
                      style: OutlinedButton.styleFrom(
                        padding: EdgeInsets.symmetric(vertical: 8),
                      ),
                    ),
                  ),
                  SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {},
                      icon: Icon(Icons.message, size: 16),
                      label: Text('Contact'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue[600],
                        padding: EdgeInsets.symmetric(vertical: 8),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class StorefrontCardExample extends StatefulWidget {
  @override
  _StorefrontCardExampleState createState() => _StorefrontCardExampleState();
}

class _StorefrontCardExampleState extends State<StorefrontCardExample> {
  bool _isFavorite = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Storefront Card Example'),
      ),
      body: SingleChildScrollView(
        child: StorefrontCard(
          name: 'Tech Gadgets Store',
          description: 'Your one-stop shop for the latest technology gadgets and accessories. High quality products with excellent customer service.',
          location: 'Downtown, New York',
          rating: 4,
          reviewCount: 128,
          category: 'Electronics',
          imageUrl: '',
          isFavorite: _isFavorite,
          onFavoriteToggle: (value) {
            setState(() {
              _isFavorite = value;
            });
          },
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Store visited!')),
            );
          },
        ),
      ),
    );
  }
}