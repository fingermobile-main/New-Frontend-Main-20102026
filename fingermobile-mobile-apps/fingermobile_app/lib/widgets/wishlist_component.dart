import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\product_card.dart';

class WishlistComponent extends StatefulWidget {
  @override
  _WishlistComponentState createState() => _WishlistComponentState();
}

class _WishlistComponentState extends State<WishlistComponent> {
  // Sample wishlist items
  final List<_WishlistItem> _wishlistItems = [
    _WishlistItem(
      id: '1',
      title: 'Wireless Bluetooth Headphones',
      description: 'Premium sound quality with noise cancellation',
      price: 129.99,
      currency: '\$',
      imageUrl: 'https://via.placeholder.com/300x300',
      rating: 4.5,
      ratingCount: 245,
      originalPrice: 149.99,
    ),
    _WishlistItem(
      id: '2',
      title: 'Smart Fitness Watch',
      description: 'Track your health and fitness goals',
      price: 199.99,
      currency: '\$',
      imageUrl: 'https://via.placeholder.com/300x300',
      rating: 4.3,
      ratingCount: 187,
      originalPrice: 249.99,
    ),
    _WishlistItem(
      id: '3',
      title: 'Portable Power Bank',
      description: 'Fast charging with 20000mAh capacity',
      price: 39.99,
      currency: '\$',
      imageUrl: 'https://via.placeholder.com/300x300',
      rating: 4.7,
      ratingCount: 98,
      originalPrice: 49.99,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('My Wishlist'),
        actions: [
          IconButton(
            icon: Icon(Icons.delete_sweep),
            onPressed: () {
              _confirmClearWishlist();
            },
          ),
        ],
      ),
      body: _wishlistItems.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.favorite_border,
                    size: 80,
                    color: Colors.grey[300],
                  ),
                  SizedBox(height: 16),
                  Text(
                    'Your wishlist is empty',
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.grey[600],
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Products you add to your wishlist will appear here',
                    style: TextStyle(
                      color: Colors.grey[500],
                    ),
                  ),
                  SizedBox(height: 24),
                  ElevatedButton(
                    onPressed: () {
                      // Navigate to shop
                    },
                    child: Text('Start Shopping'),
                  ),
                ],
              ),
            )
          : RefreshIndicator(
              onRefresh: () async {
                // Simulate refreshing wishlist
                await Future.delayed(Duration(seconds: 1));
              },
              child: ListView.builder(
                padding: EdgeInsets.all(16),
                itemCount: _wishlistItems.length,
                itemBuilder: (context, index) {
                  final item = _wishlistItems[index];
                  return _buildWishlistItem(item, index);
                },
              ),
            ),
    );
  }

  Widget _buildWishlistItem(_WishlistItem item, int index) {
    return Card(
      margin: EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Product image
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              color: Colors.grey[200],
              borderRadius: BorderRadius.circular(8),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: item.imageUrl.isNotEmpty
                  ? Image.network(
                      item.imageUrl,
                      fit: BoxFit.cover,
                      loadingBuilder: (context, child, loadingProgress) {
                        if (loadingProgress == null) return child;
                        return Center(
                          child: CircularProgressIndicator(
                            value: loadingProgress.expectedTotalBytes != null
                                ? loadingProgress.cumulativeBytesLoaded /
                                    loadingProgress.expectedTotalBytes!
                                : null,
                          ),
                        );
                      },
                      errorBuilder: (context, error, stackTrace) {
                        return Icon(
                          Icons.image_not_supported,
                          color: Colors.grey[400],
                        );
                      },
                    )
                  : Container(
                      child: Icon(
                        Icons.image_not_supported,
                        color: Colors.grey[400],
                      ),
                    ),
            ),
          ),
          
          SizedBox(width: 16),
          
          // Product details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                
                SizedBox(height: 4),
                
                Text(
                  item.description,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                
                SizedBox(height: 8),
                
                // Price and rating
                Row(
                  children: [
                    Text(
                      '${item.currency}${item.price.toStringAsFixed(2)}',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.green[700],
                      ),
                    ),
                    
                    if (item.originalPrice > item.price)
                      ...[
                        SizedBox(width: 8),
                        Text(
                          '${item.currency}${item.originalPrice.toStringAsFixed(2)}',
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[500],
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                      ],
                    
                    Spacer(),
                    
                    Row(
                      children: [
                        Icon(
                          Icons.star,
                          color: Colors.amber,
                          size: 16,
                        ),
                        SizedBox(width: 4),
                        Text(
                          item.rating.toStringAsFixed(1),
                          style: TextStyle(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                
                SizedBox(height: 12),
                
                // Action buttons
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: () {
                          // Move to cart
                          _moveToCart(index);
                        },
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(color: Colors.blue),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(6),
                          ),
                        ),
                        child: Text(
                          'Move to Cart',
                          style: TextStyle(
                            color: Colors.blue,
                          ),
                        ),
                      ),
                    ),
                    
                    SizedBox(width: 8),
                    
                    Expanded(
                      child: ElevatedButton(
                        onPressed: () {
                          // Buy now
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.orange,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(6),
                          ),
                        ),
                        child: Text(
                          'Buy Now',
                          style: TextStyle(
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          
          // Delete button
          IconButton(
            icon: Icon(
              Icons.delete,
              color: Colors.grey[600],
            ),
            onPressed: () {
              _removeFromWishlist(index);
            },
          ),
        ],
      ),
    );
  }

  void _removeFromWishlist(int index) {
    setState(() {
      _wishlistItems.removeAt(index);
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Item removed from wishlist'),
        action: SnackBarAction(
          label: 'Undo',
          onPressed: () {
            // Add back to wishlist
            setState(() {
              _wishlistItems.insert(index, _wishlistItems[index]);
            });
          },
        ),
      ),
    );
  }

  void _moveToCart(int index) {
    final item = _wishlistItems[index];
    
    // In a real app, this would move the item to cart
    // For now, just show a snackbar
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${item.title} moved to cart'),
      ),
    );
  }

  void _confirmClearWishlist() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Clear Wishlist'),
        content: Text('Are you sure you want to remove all items from your wishlist?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              setState(() {
                _wishlistItems.clear();
              });
              Navigator.of(context).pop();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Wishlist cleared'),
                ),
              );
            },
            child: Text('Clear All', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}

class _WishlistItem {
  final String id;
  final String title;
  final String description;
  final double price;
  final String currency;
  final String imageUrl;
  final double rating;
  final int ratingCount;
  final double originalPrice;

  _WishlistItem({
    required this.id,
    required this.title,
    required this.description,
    required this.price,
    required this.currency,
    required this.imageUrl,
    required this.rating,
    required this.ratingCount,
    required this.originalPrice,
  });
}