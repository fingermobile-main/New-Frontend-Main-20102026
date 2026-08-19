import 'package:flutter/material.dart';

class ProductsPage extends StatefulWidget {
  const ProductsPage({super.key});

  @override
  State<ProductsPage> createState() => _ProductsPageState();
}

class _ProductsPageState extends State<ProductsPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<Product> _products = [];
  List<ProductCategory> _categories = [];
  String _selectedCategory = 'all';
  ProductSortOption _sortOption = ProductSortOption.name;
  bool _isGridView = true;

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  Future<void> _loadProducts() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock categories
      setState(() {
        _categories = [
          ProductCategory(id: 'all', name: 'All Products'),
          ProductCategory(id: 'electronics', name: 'Electronics'),
          ProductCategory(id: 'fashion', name: 'Fashion'),
          ProductCategory(id: 'home', name: 'Home & Garden'),
          ProductCategory(id: 'sports', name: 'Sports & Outdoors'),
          ProductCategory(id: 'beauty', name: 'Beauty & Health'),
        ];

        // Mock products
        _products = [
          Product(
            id: 1,
            name: 'Wireless Bluetooth Headphones',
            description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life',
            price: 89.99,
            originalPrice: 129.99,
            currency: 'USD',
            imageUrl: 'https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=Headphones',
            category: 'electronics',
            inStock: true,
            stockQuantity: 25,
            rating: 4.5,
            reviewCount: 128,
            isFeatured: true,
            isNew: false,
            tags: ['wireless', 'bluetooth', 'headphones'],
            createdAt: DateTime.now().subtract(const Duration(days: 30)),
          ),
          Product(
            id: 2,
            name: 'Smart Fitness Tracker',
            description: 'Track your steps, heart rate, sleep patterns, and more with this sleek fitness tracker',
            price: 49.99,
            originalPrice: 69.99,
            currency: 'USD',
            imageUrl: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Fitness',
            category: 'electronics',
            inStock: true,
            stockQuantity: 15,
            rating: 4.2,
            reviewCount: 86,
            isFeatured: false,
            isNew: true,
            tags: ['fitness', 'tracker', 'wearable'],
            createdAt: DateTime.now().subtract(const Duration(days: 5)),
          ),
          Product(
            id: 3,
            name: 'Organic Cotton T-Shirt',
            description: 'Comfortable and eco-friendly t-shirt made from 100% organic cotton',
            price: 24.99,
            originalPrice: 29.99,
            currency: 'USD',
            imageUrl: 'https://via.placeholder.com/300x300/45B7D1/FFFFFF?text=T-Shirt',
            category: 'fashion',
            inStock: true,
            stockQuantity: 50,
            rating: 4.7,
            reviewCount: 64,
            isFeatured: true,
            isNew: false,
            tags: ['organic', 'cotton', 'clothing'],
            createdAt: DateTime.now().subtract(const Duration(days: 15)),
          ),
          Product(
            id: 4,
            name: 'Stainless Steel Water Bottle',
            description: 'Keep your drinks hot or cold for hours with this durable stainless steel bottle',
            price: 19.99,
            originalPrice: 24.99,
            currency: 'USD',
            imageUrl: 'https://via.placeholder.com/300x300/96CEB4/FFFFFF?text=Bottle',
            category: 'home',
            inStock: true,
            stockQuantity: 30,
            rating: 4.3,
            reviewCount: 92,
            isFeatured: false,
            isNew: true,
            tags: ['water', 'bottle', 'stainless steel'],
            createdAt: DateTime.now().subtract(const Duration(days: 2)),
          ),
          Product(
            id: 5,
            name: 'Yoga Mat',
            description: 'Non-slip yoga mat with carrying strap for all your fitness needs',
            price: 29.99,
            originalPrice: 39.99,
            currency: 'USD',
            imageUrl: 'https://via.placeholder.com/300x300/FFEAA7/000000?text=Yoga+Mat',
            category: 'sports',
            inStock: true,
            stockQuantity: 20,
            rating: 4.6,
            reviewCount: 75,
            isFeatured: true,
            isNew: false,
            tags: ['yoga', 'mat', 'fitness'],
            createdAt: DateTime.now().subtract(const Duration(days: 45)),
          ),
          Product(
            id: 6,
            name: 'Moisturizing Face Cream',
            description: 'Hydrating face cream with natural ingredients for all skin types',
            price: 15.99,
            originalPrice: 19.99,
            currency: 'USD',
            imageUrl: 'https://via.placeholder.com/300x300/DDA0DD/FFFFFF?text=Face+Cream',
            category: 'beauty',
            inStock: true,
            stockQuantity: 40,
            rating: 4.4,
            reviewCount: 58,
            isFeatured: false,
            isNew: true,
            tags: ['moisturizer', 'face', 'skincare'],
            createdAt: DateTime.now().subtract(const Duration(days: 1)),
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load products. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _selectCategory(String categoryId) {
    setState(() {
      _selectedCategory = categoryId;
    });
  }

  void _changeSort(ProductSortOption option) {
    setState(() {
      _sortOption = option;
    });
  }

  void _toggleView() {
    setState(() {
      _isGridView = !_isGridView;
    });
  }

  void _addToCart(Product product) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${product.name} added to cart'),
        backgroundColor: Theme.of(context).primaryColor,
      ),
    );
  }

  void _viewProduct(Product product) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Viewing ${product.name}'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Products'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(_isGridView ? Icons.list : Icons.grid_view),
            onPressed: _toggleView,
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              // Show filter options
            },
          ),
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Show search
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadProducts,
        child: _isLoading && _products.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _products.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadProducts,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Categories
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
                        const SizedBox(height: 24),
                        // Sort and Results Info
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${_products.length} products',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            PopupMenuButton<ProductSortOption>(
                              icon: const Icon(Icons.sort),
                              onSelected: _changeSort,
                              itemBuilder: (BuildContext context) {
                                return [
                                  const PopupMenuItem(
                                    value: ProductSortOption.name,
                                    child: Text('Name (A-Z)'),
                                  ),
                                  const PopupMenuItem(
                                    value: ProductSortOption.priceLow,
                                    child: Text('Price (Low to High)'),
                                  ),
                                  const PopupMenuItem(
                                    value: ProductSortOption.priceHigh,
                                    child: Text('Price (High to Low)'),
                                  ),
                                  const PopupMenuItem(
                                    value: ProductSortOption.rating,
                                    child: Text('Rating'),
                                  ),
                                  const PopupMenuItem(
                                    value: ProductSortOption.newest,
                                    child: Text('Newest'),
                                  ),
                                ];
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // Products List
                        Expanded(
                          child: _isGridView
                              ? GridView.builder(
                                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                    crossAxisCount: 2,
                                    crossAxisSpacing: 16,
                                    mainAxisSpacing: 16,
                                    childAspectRatio: 0.8,
                                  ),
                                  itemCount: _products.length,
                                  itemBuilder: (context, index) {
                                    var product = _products[index];
                                    return _buildProductCard(product);
                                  },
                                )
                              : ListView.builder(
                                  itemCount: _products.length,
                                  itemBuilder: (context, index) {
                                    var product = _products[index];
                                    return _buildProductListItem(product);
                                  },
                                ),
                        ),
                      ],
                    ),
                  ),
      ),
    );
  }

  Widget _buildProductCard(Product product) {
    return Card(
      child: InkWell(
        onTap: () => _viewProduct(product),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Stack(
              children: [
                Container(
                  height: 120,
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: NetworkImage(product.imageUrl),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                if (product.isFeatured)
                  Positioned(
                    top: 8,
                    left: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'Featured',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ),
                if (product.isNew)
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.green,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        'New',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    product.description,
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.grey,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (product.originalPrice > product.price)
                            Text(
                              '\$${product.originalPrice.toStringAsFixed(2)}',
                              style: const TextStyle(
                                decoration: TextDecoration.lineThrough,
                                color: Colors.grey,
                                fontSize: 12,
                              ),
                            ),
                          Text(
                            '\$${product.price.toStringAsFixed(2)}',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.blue,
                            ),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          const Icon(
                            Icons.star,
                            size: 16,
                            color: Colors.amber,
                          ),
                          Text('${product.rating}'),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      if (product.inStock)
                        const Text(
                          'In Stock',
                          style: TextStyle(
                            color: Colors.green,
                            fontSize: 12,
                          ),
                        )
                      else
                        const Text(
                          'Out of Stock',
                          style: TextStyle(
                            color: Colors.red,
                            fontSize: 12,
                          ),
                        ),
                      IconButton(
                        icon: const Icon(Icons.shopping_cart),
                        onPressed: () => _addToCart(product),
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

  Widget _buildProductListItem(Product product) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () => _viewProduct(product),
        child: Row(
          children: [
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(product.imageUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          product.name,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      if (product.isFeatured)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.red,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            'Featured',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                            ),
                          ),
                        ),
                      if (product.isNew)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.green,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text(
                            'New',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                            ),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(
                    product.description,
                    style: const TextStyle(
                      fontSize: 12,
                      color: Colors.grey,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          if (product.originalPrice > product.price)
                            Text(
                              '\$${product.originalPrice.toStringAsFixed(2)}',
                              style: const TextStyle(
                                decoration: TextDecoration.lineThrough,
                                color: Colors.grey,
                                fontSize: 12,
                              ),
                            ),
                          Text(
                            '\$${product.price.toStringAsFixed(2)}',
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.blue,
                            ),
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          const Icon(
                            Icons.star,
                            size: 16,
                            color: Colors.amber,
                          ),
                          Text('${product.rating} (${product.reviewCount})'),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      if (product.inStock)
                        const Text(
                          'In Stock',
                          style: TextStyle(
                            color: Colors.green,
                            fontSize: 12,
                          ),
                        )
                      else
                        const Text(
                          'Out of Stock',
                          style: TextStyle(
                            color: Colors.red,
                            fontSize: 12,
                          ),
                        ),
                      IconButton(
                        icon: const Icon(Icons.shopping_cart),
                        onPressed: () => _addToCart(product),
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
}

enum ProductSortOption { name, priceLow, priceHigh, rating, newest }

class ProductCategory {
  final String id;
  final String name;

  ProductCategory({
    required this.id,
    required this.name,
  });
}

class Product {
  final int id;
  final String name;
  final String description;
  final double price;
  final double originalPrice;
  final String currency;
  final String imageUrl;
  final String category;
  final bool inStock;
  final int stockQuantity;
  final double rating;
  final int reviewCount;
  final bool isFeatured;
  final bool isNew;
  final List<String> tags;
  final DateTime createdAt;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.originalPrice,
    required this.currency,
    required this.imageUrl,
    required this.category,
    required this.inStock,
    required this.stockQuantity,
    required this.rating,
    required this.reviewCount,
    required this.isFeatured,
    required this.isNew,
    required this.tags,
    required this.createdAt,
  });
}