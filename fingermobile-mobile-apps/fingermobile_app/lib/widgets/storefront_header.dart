import 'package:flutter/material.dart';

class StorefrontHeader extends StatelessWidget {
  final String storeName;
  final String storeDescription;
  final String storeCategory;
  final String coverImageUrl;
  final String profileImageUrl;
  final int followerCount;
  final int productCount;
  final int rating;
  final int reviewCount;
  final bool isFollowing;
  final Function(bool)? onFollowToggle;
  final List<String> featuredProducts;

  const StorefrontHeader({
    Key? key,
    required this.storeName,
    required this.storeDescription,
    required this.storeCategory,
    required this.coverImageUrl,
    required this.profileImageUrl,
    required this.followerCount,
    required this.productCount,
    required this.rating,
    required this.reviewCount,
    this.isFollowing = false,
    this.onFollowToggle,
    this.featuredProducts = const [],
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        children: [
          // Cover Image Section
          Stack(
            children: [
              // Cover Image
              Container(
                height: 180,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  image: coverImageUrl.isNotEmpty
                      ? DecorationImage(
                          image: NetworkImage(coverImageUrl),
                          fit: BoxFit.cover,
                        )
                      : null,
                ),
                child: coverImageUrl.isEmpty
                    ? Icon(
                        Icons.image_not_supported,
                        size: 60,
                        color: Colors.grey[500],
                      )
                    : null,
              ),
              
              // Profile Picture Overlay
              Positioned(
                bottom: -40,
                left: 20,
                child: Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: Colors.white,
                      width: 4,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.2),
                        blurRadius: 10,
                        offset: Offset(0, 5),
                      ),
                    ],
                  ),
                  child: ClipOval(
                    child: profileImageUrl.isNotEmpty
                        ? Image.network(
                            profileImageUrl,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                color: Colors.grey[300],
                                child: Icon(
                                  Icons.storefront,
                                  size: 40,
                                  color: Colors.grey[500],
                                ),
                              );
                            },
                          )
                        : Container(
                            color: Colors.blue[100],
                            child: Icon(
                              Icons.storefront,
                              size: 40,
                              color: Colors.blue[600],
                            ),
                          ),
                  ),
                ),
              ),
            ],
          ),
          
          SizedBox(height: 48), // Space for profile picture overlap
          
          // Store Info Section
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Store Name and Follow Button
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        storeName,
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.grey[800],
                        ),
                      ),
                    ),
                    SizedBox(width: 16),
                    OutlinedButton(
                      onPressed: () {
                        if (onFollowToggle != null) {
                          onFollowToggle!(!isFollowing);
                        }
                      },
                      style: OutlinedButton.styleFrom(
                        side: BorderSide(
                          color: isFollowing ? Colors.red : Colors.blue,
                        ),
                        foregroundColor: isFollowing ? Colors.red : Colors.blue,
                        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                      child: Text(
                        isFollowing ? 'Following' : 'Follow',
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ],
                ),
                
                SizedBox(height: 8),
                
                // Store Category
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.blue[50],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    storeCategory,
                    style: TextStyle(
                      color: Colors.blue[700],
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                
                SizedBox(height: 12),
                
                // Store Description
                Text(
                  storeDescription,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                    height: 1.4,
                  ),
                ),
                
                SizedBox(height: 16),
                
                // Stats Row
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStatColumn(productCount, 'Products'),
                    _buildStatColumn(followerCount, 'Followers'),
                    _buildRatingColumn(),
                  ],
                ),
                
                SizedBox(height: 20),
                
                // Featured Products Title
                if (featuredProducts.isNotEmpty) ...[
                  Text(
                    'Featured Products',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey[800],
                    ),
                  ),
                  SizedBox(height: 12),
                  
                  // Featured Products Carousel
                  SizedBox(
                    height: 120,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: featuredProducts.length,
                      separatorBuilder: (context, index) => SizedBox(width: 12),
                      itemBuilder: (context, index) {
                        return Container(
                          width: 100,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.grey[300]!),
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.network(
                              featuredProducts[index],
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) {
                                return Container(
                                  color: Colors.grey[200],
                                  child: Icon(
                                    Icons.image_not_supported,
                                    color: Colors.grey[400],
                                  ),
                                );
                              },
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildStatColumn(int count, String label) {
    return Column(
      children: [
        Text(
          count.toString(),
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.grey[800],
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }
  
  Widget _buildRatingColumn() {
    return Column(
      children: [
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              Icons.star,
              color: Colors.amber,
              size: 18,
            ),
            SizedBox(width: 4),
            Text(
              rating.toString(),
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.grey[800],
              ),
            ),
          ],
        ),
        Text(
          '(${reviewCount})',
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }
}

class StorefrontHeaderExample extends StatefulWidget {
  @override
  _StorefrontHeaderExampleState createState() => _StorefrontHeaderExampleState();
}

class _StorefrontHeaderExampleState extends State<StorefrontHeaderExample> {
  bool _isFollowing = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 300,
            pinned: true,
            flexibleSpace: StorefrontHeader(
              storeName: 'Tech Gadgets Store',
              storeDescription: 'Your one-stop shop for the latest technology gadgets and accessories. High quality products with excellent customer service.',
              storeCategory: 'Electronics',
              coverImageUrl: '',
              profileImageUrl: '',
              followerCount: 1245,
              productCount: 89,
              rating: 4,
              reviewCount: 128,
              isFollowing: _isFollowing,
              onFollowToggle: (value) {
                setState(() {
                  _isFollowing = value;
                });
              },
              featuredProducts: [
                'https://via.placeholder.com/100',
                'https://via.placeholder.com/100',
                'https://via.placeholder.com/100',
              ],
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, index) {
                return ListTile(
                  title: Text('Product $index'),
                  subtitle: Text('Description for product $index'),
                  trailing: Text('\$${(index + 1) * 10}.99'),
                );
              },
              childCount: 10,
            ),
          ),
        ],
      ),
    );
  }
}