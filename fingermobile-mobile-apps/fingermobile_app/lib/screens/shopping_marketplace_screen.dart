import 'package:flutter/material.dart';

class ShoppingMarketplaceScreen extends StatefulWidget {
  @override
  _ShoppingMarketplaceScreenState createState() => _ShoppingMarketplaceScreenState();
}

class _ShoppingMarketplaceScreenState extends State<ShoppingMarketplaceScreen> {
  List<Product> _products = [];
  List<Product> _trendingProducts = [];
  List<Product> _recommendedProducts = [];
  bool _isLoading = true;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  Future<void> _loadProducts() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _products = [
          Product(
            id: 1,
            name: 'Wireless Bluetooth Headphones',
            description: 'Premium sound quality with noise cancellation',
            price: 129.99,
            originalPrice: 149.99,
            rating: 4.7,
            totalRatings: 1245,
            imageUrl: 'https://via.placeholder.com/300x300',
            category: 'Electronics',
            seller: 'TechGadgets',
            isFavorite: false,
          ),
          Product(
            id: 2,
            name: 'Fitness Tracker Watch',
            description: 'Track your steps, heart rate, and sleep',
            price: 79.99,
            originalPrice: 99.99,
            rating: 4.5,
            totalRatings: 876,
            imageUrl: 'https://via.placeholder.com/300x300',
            category: 'Health',
            seller: 'FitLife',
            isFavorite: true,
          ),
          Product(
            id: 3,
            name: 'Organic Coffee Beans',
            description: 'Premium single-origin coffee from Colombia',
            price: 24.99,
            originalPrice: 29.99,
            rating: 4.8,
            totalRatings: 542,
            imageUrl: 'https://via.placeholder.com/300x300',
            category: 'Food',
            seller: 'CoffeeLovers',
            isFavorite: false,
          ),
          Product(
            id: 4,
            name: 'Yoga Mat Premium',
            description: 'Non-slip, eco-friendly yoga mat',
            price: 39.99,
            originalPrice: 49.99,
            rating: 4.6,
            totalRatings: 321,
            imageUrl: 'https://via.placeholder.com/300x300',
            category: 'Sports',
            seller: 'YogaWorld',
            isFavorite: false,
          ),
        ];
        
        _trendingProducts = [
          Product(
            id: 5,
            name: 'Smart Home Hub',
            description: 'Control all your smart devices from one place',
            price: 199.99,
            originalPrice: 249.99,
            rating: 4.9,
            totalRatings: 654,
            imageUrl: 'https://via.placeholder.com/300x300',
            category: 'Electronics',
            seller: 'SmartHome',
            isFavorite: false,
          ),
          Product(
            id: 6,
            name: 'Artisanal Chocolate Gift Box',
            description: 'Assorted premium chocolates',
            price: 49.99,
            originalPrice: 59.99,
            rating: 4.7,
            totalRatings: 432,
            imageUrl: 'https://via.placeholder.com/300x300',
            category: 'Food',
            seller: 'SweetDelights',
            isFavorite: true,
          ),
        ];
        
        _recommendedProducts = [
          Product(
            id: 7,
            name: 'Wireless Charging Pad',
            description: 'Fast charging for all compatible devices',
            price: 29.99,
            originalPrice: 39.99,
            rating: 4.4,
            totalRatings: 210,
            imageUrl: 'https://via.placeholder.com/300x300',
            category: 'Electronics',
            seller: 'ChargersRUs',
            isFavorite: false,
          ),
          Product(
            id: 8,
            name: 'Essential Oil Diffmember',
            description: 'Ultrasonic aromatherapy diffmember with LED lights',
            price: 34.99,
            originalPrice: 44.99,
            rating: 4.6,
            totalRatings: 387,
            imageUrl: 'https://via.placeholder.com/300x300',
            category: 'Home',
            seller: 'WellnessShop',
            isFavorite: false,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading products: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading products')),
      );
    }
  }

  void _toggleFavorite(Product product) {
    setState(() {
      final index = _products.indexWhere((p) => p.id == product.id);
      if (index != -1) {
        _products[index] = Product(
          id: _products[index].id,
          name: _products[index].name,
          description: _products[index].description,
          price: _products[index].price,
          originalPrice: _products[index].originalPrice,
          rating: _products[index].rating,
          totalRatings: _products[index].totalRatings,
          imageUrl: _products[index].imageUrl,
          category: _products[index].category,
          seller: _products[index].seller,
          isFavorite: !_products[index].isFavorite,
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
              hintText: 'Search products...',
              hintStyle: TextStyle(color: Colors.white70),
              border: InputBorder.none,
            ),
          ),
        ),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.shopping_cart),
            onPressed: () {
              // Navigate to cart
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadProducts,
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Trending Products Section
                    Padding(
                      padding: EdgeInsets.all(16),
                      child: Text(
                        'Trending Now',
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
                        itemCount: _trendingProducts.length,
                        itemBuilder: (context, index) {
                          final product = _trendingProducts[index];
                          return _buildProductCard(product, true);
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
                        itemCount: _recommendedProducts.length,
                        itemBuilder: (context, index) {
                          final product = _recommendedProducts[index];
                          return _buildProductCard(product, true);
                        },
                      ),
                    ),
                    
                    // All Products Section
                    Padding(
                      padding: EdgeInsets.all(16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'All Products',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              // Navigate to all products
                            },
                            child: Text('See All'),
                          ),
                        ],
                      ),
                    ),
                    ListView.builder(
                      shrinkWrap: true,
                      physics: NeverScrollableScrollPhysics(),
                      itemCount: _products.length,
                      itemBuilder: (context, index) {
                        final product = _products[index];
                        return _buildProductCard(product, false);
                      },
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildProductCard(Product product, bool isHorizontal) {
    return Card(
      margin: isHorizontal 
          ? EdgeInsets.only(left: 16, right: 8, bottom: 16) 
          : EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Container(
        width: isHorizontal ? 150 : double.infinity,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product image
            Stack(
              children: [
                Container(
                  height: isHorizontal ? 120 : 150,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: NetworkImage(product.imageUrl),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                Positioned(
                  top: 8,
                  right: 8,
                  child: GestureDetector(
                    onTap: () => _toggleFavorite(product),
                    child: Icon(
                      product.isFavorite ? Icons.favorite : Icons.favorite_border,
                      color: product.isFavorite ? Colors.red : Colors.white,
                    ),
                  ),
                ),
              ],
            ),
            
            // Product info
            Padding(
              padding: EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 4),
                  Text(
                    product.seller,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    product.description,
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
                        '\$${product.price}',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                      if (product.originalPrice > product.price) ...[
                        SizedBox(width: 8),
                        Text(
                          '\$${product.originalPrice}',
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
                            '${(((product.originalPrice - product.price) / product.originalPrice) * 100).round()}% OFF',
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
                        Icons.star,
                        size: 14,
                        color: Colors.orange,
                      ),
                      SizedBox(width: 4),
                      Text(
                        '${product.rating}',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                      Text(
                        '(${product.totalRatings})',
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
                        // Navigate to product details
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ProductDetailScreen(product: product),
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

class Product {
  final int id;
  final String name;
  final String description;
  final double price;
  final double originalPrice;
  final double rating;
  final int totalRatings;
  final String imageUrl;
  final String category;
  final String seller;
  final bool isFavorite;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.originalPrice,
    required this.rating,
    required this.totalRatings,
    required this.imageUrl,
    required this.category,
    required this.seller,
    required this.isFavorite,
  });
}

class ProductDetailScreen extends StatelessWidget {
  final Product product;

  const ProductDetailScreen({required this.product});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(product.name),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product image
            Container(
              height: 300,
              width: double.infinity,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(product.imageUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            
            // Product details
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
                          product.name,
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      IconButton(
                        icon: Icon(
                          product.isFavorite ? Icons.favorite : Icons.favorite_border,
                          color: product.isFavorite ? Colors.red : Colors.grey,
                        ),
                        onPressed: () {
                          // Toggle favorite
                        },
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  Text(
                    product.seller,
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey[600],
                    ),
                  ),
                  SizedBox(height: 16),
                  Row(
                    children: [
                      Text(
                        '\$${product.price}',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                      if (product.originalPrice > product.price) ...[
                        SizedBox(width: 8),
                        Text(
                          '\$${product.originalPrice}',
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
                            '${(((product.originalPrice - product.price) / product.originalPrice) * 100).round()}% OFF',
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
                        Icons.star,
                        color: Colors.orange,
                      ),
                      SizedBox(width: 4),
                      Text(
                        '${product.rating}',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Text(
                        '(${product.totalRatings} ratings)',
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
                    product.description,
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
                        // Add to cart
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                      ),
                      child: Text('Add to Cart'),
                    ),
                  ),
                  SizedBox(height: 8),
                  OutlinedButton(
                    onPressed: () {
                      // Buy now
                    },
                    style: OutlinedButton.styleFrom(
                      side: BorderSide(color: Colors.blue),
                    ),
                    child: Text(
                      'Buy Now',
                      style: TextStyle(color: Colors.blue),
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