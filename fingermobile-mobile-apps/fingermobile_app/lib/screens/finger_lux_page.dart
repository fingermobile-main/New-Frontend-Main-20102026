import 'package:flutter/material.dart';

class FingerLuxPage extends StatefulWidget {
  const FingerLuxPage({super.key});

  @override
  State<FingerLuxPage> createState() => _FingerLuxPageState();
}

class _FingerLuxPageState extends State<FingerLuxPage> {
  bool _isLoading = false;
  String? _errorMessage;
  LuxCollection? _featuredCollection;
  List<LuxItem> _luxuryItems = [];
  List<LuxCategory> _categories = [];
  String _selectedCategory = 'all';
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadLuxuryData();
  }

  Future<void> _loadLuxuryData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock luxury data
      setState(() {
        _featuredCollection = LuxCollection(
          id: 1,
          name: 'Exclusive Watches Collection',
          description: 'Handcrafted timepieces from renowned Swiss manufacturers',
          imageUrl: 'https://via.placeholder.com/600x300/000000/FFFFFF?text=Watch+Collection',
          itemCount: 24,
        );

        _categories = [
          LuxCategory(id: 'all', name: 'All Items'),
          LuxCategory(id: 'watches', name: 'Watches'),
          LuxCategory(id: 'jewelry', name: 'Jewelry'),
          LuxCategory(id: 'fashion', name: 'Fashion'),
          LuxCategory(id: 'cars', name: 'Luxury Cars'),
          LuxCategory(id: 'real_estate', name: 'Real Estate'),
        ];

        _luxuryItems = [
          LuxItem(
            id: 1,
            name: 'Rolex Submariner',
            brand: 'Rolex',
            price: 12500.00,
            originalPrice: 13500.00,
            currency: 'USD',
            rating: 4.9,
            reviewCount: 124,
            imageUrl: 'https://via.placeholder.com/300x200/000000/FFFFFF?text=Rolex',
            category: 'watches',
            isFeatured: true,
          ),
          LuxItem(
            id: 2,
            name: 'Diamond Necklace',
            brand: 'Tiffany & Co.',
            price: 8900.00,
            originalPrice: 9500.00,
            currency: 'USD',
            rating: 4.8,
            reviewCount: 89,
            imageUrl: 'https://via.placeholder.com/300x200/E7E7E7/000000?text=Diamond+Necklace',
            category: 'jewelry',
            isFeatured: false,
          ),
          LuxItem(
            id: 3,
            name: 'Limited Edition Handbag',
            brand: 'Hermès',
            price: 15600.00,
            originalPrice: 16800.00,
            currency: 'USD',
            rating: 4.9,
            reviewCount: 67,
            imageUrl: 'https://via.placeholder.com/300x200/F5F5F5/000000?text=Hermes+Bag',
            category: 'fashion',
            isFeatured: true,
          ),
          LuxItem(
            id: 4,
            name: 'Luxury Sedan',
            brand: 'Mercedes-Benz',
            price: 85000.00,
            originalPrice: 92000.00,
            currency: 'USD',
            rating: 4.7,
            reviewCount: 42,
            imageUrl: 'https://via.placeholder.com/300x200/C0C0C0/000000?text=Mercedes+Sedan',
            category: 'cars',
            isFeatured: false,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load luxury items. Please try again.';
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('FingerLux'),
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
            icon: const Icon(Icons.shopping_cart),
            onPressed: () {
              // Open cart
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadLuxuryData,
        child: _isLoading && _featuredCollection == null
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _featuredCollection == null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadLuxuryData,
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
                          // Welcome Banner
                          Container(
                            height: 150,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  Theme.of(context).primaryColor,
                                  Theme.of(context).primaryColorDark,
                                ],
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'FingerLux',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 28,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    'Discover exclusive luxury items',
                                    style: TextStyle(
                                      color: Colors.white70,
                                      fontSize: 16,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  ElevatedButton(
                                    onPressed: () {
                                      // Browse collections
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.white,
                                      foregroundColor: Theme.of(context).primaryColor,
                                    ),
                                    child: const Text('Browse Collections'),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 32),
                          // Featured Collection
                          const Text(
                            'Featured Collection',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          if (_featuredCollection != null)
                            Card(
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Container(
                                      height: 150,
                                      decoration: BoxDecoration(
                                        image: DecorationImage(
                                          image: NetworkImage(_featuredCollection!.imageUrl),
                                          fit: BoxFit.cover,
                                        ),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    Text(
                                      _featuredCollection!.name,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      _featuredCollection!.description,
                                      style: const TextStyle(
                                        color: Colors.grey,
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text('${_featuredCollection!.itemCount} items'),
                                        ElevatedButton(
                                          onPressed: () {
                                            // View collection
                                          },
                                          child: const Text('View Collection'),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
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
                          // Luxury Items
                          const Text(
                            'Luxury Items',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          GridView.builder(
                            gridDelegate:
                                const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              crossAxisSpacing: 16,
                              mainAxisSpacing: 16,
                              childAspectRatio: 0.8,
                            ),
                            itemCount: _luxuryItems.length,
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemBuilder: (context, index) {
                              var item = _luxuryItems[index];
                              return Card(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Stack(
                                      children: [
                                        Container(
                                          height: 120,
                                          decoration: BoxDecoration(
                                            image: DecorationImage(
                                              image: NetworkImage(item.imageUrl),
                                              fit: BoxFit.cover,
                                            ),
                                          ),
                                        ),
                                        if (item.isFeatured)
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
                                                'Featured',
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
                                    Padding(
                                      padding: const EdgeInsets.all(8.0),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            item.name,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                            ),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            item.brand,
                                            style: const TextStyle(
                                              color: Colors.grey,
                                              fontSize: 12,
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          Row(
                                            children: [
                                              Icon(
                                                Icons.star,
                                                size: 16,
                                                color: Colors.amber,
                                              ),
                                              const SizedBox(width: 4),
                                              Text('${item.rating}'),
                                              const SizedBox(width: 4),
                                              Text(
                                                '(${item.reviewCount})',
                                                style: const TextStyle(
                                                  color: Colors.grey,
                                                  fontSize: 12,
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 8),
                                          Row(
                                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                            children: [
                                              Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    '${item.currency} \$${item.price.toStringAsFixed(2)}',
                                                    style: const TextStyle(
                                                      fontWeight: FontWeight.bold,
                                                    ),
                                                  ),
                                                  if (item.originalPrice > item.price)
                                                    Text(
                                                      '${item.currency} \$${item.originalPrice.toStringAsFixed(2)}',
                                                      style: const TextStyle(
                                                        color: Colors.grey,
                                                        decoration: TextDecoration.lineThrough,
                                                        fontSize: 12,
                                                      ),
                                                    ),
                                                ],
                                              ),
                                              IconButton(
                                                icon: const Icon(Icons.favorite_border),
                                                onPressed: () {
                                                  // Add to wishlist
                                                },
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
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

class LuxCollection {
  final int id;
  final String name;
  final String description;
  final String imageUrl;
  final int itemCount;

  LuxCollection({
    required this.id,
    required this.name,
    required this.description,
    required this.imageUrl,
    required this.itemCount,
  });
}

class LuxCategory {
  final String id;
  final String name;

  LuxCategory({
    required this.id,
    required this.name,
  });
}

class LuxItem {
  final int id;
  final String name;
  final String brand;
  final double price;
  final double originalPrice;
  final String currency;
  final double rating;
  final int reviewCount;
  final String imageUrl;
  final String category;
  final bool isFeatured;

  LuxItem({
    required this.id,
    required this.name,
    required this.brand,
    required this.price,
    required this.originalPrice,
    required this.currency,
    required this.rating,
    required this.reviewCount,
    required this.imageUrl,
    required this.category,
    required this.isFeatured,
  });
}