import 'package:flutter/material.dart';

class MarketplacePage extends StatefulWidget {
  const MarketplacePage({Key? key}) : super(key: key);

  @override
  State<MarketplacePage> createState() => _MarketplacePageState();
}

class _MarketplacePageState extends State<MarketplacePage> {
  final List<String> _categories = [
    'All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books', 'Toys'
  ];
  String _selectedCategory = 'All';
  final TextEditingController _searchController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Marketplace'),
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.shopping_cart),
            onPressed: () {
              // Navigate to cart
            },
          ),
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              Navigator.pushNamed(context, '/notifications');
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Filters sidebar
            SizedBox(
              width: 250,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Filters',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      // Categories
                      const Text(
                        'Categories',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      ..._categories.map((category) => 
                        _buildFilterChip(
                          category, 
                          _selectedCategory == category,
                          () {
                            setState(() {
                              _selectedCategory = category;
                            });
                          },
                        ),
                      ),
                      
                      const SizedBox(height: 24),
                      
                      // Price range
                      const Text(
                        'Price Range',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Slider(
                        value: 50,
                        min: 0,
                        max: 100,
                        divisions: 10,
                        label: '\$50',
                        onChanged: null, // In a real app, this would update state
                      ),
                      
                      const SizedBox(height: 16),
                      
                      Row(
                        children: const [
                          Text('\$0'),
                          Spacer(),
                          Text('\$100'),
                        ],
                      ),
                      
                      const SizedBox(height: 24),
                      
                      // Condition
                      const Text(
                        'Condition',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      _buildFilterChip('New', true, () {}),
                      const SizedBox(height: 8),
                      _buildFilterChip('Used', false, () {}),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            
            // Main content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Search bar
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Row(
                        children: [
                          const Icon(Icons.search),
                          const SizedBox(width: 8),
                          Expanded(
                            child: TextField(
                              controller: _searchController,
                              decoration: const InputDecoration(
                                hintText: 'Search products...',
                                border: InputBorder.none,
                              ),
                            ),
                          ),
                          if (_searchController.text.isNotEmpty)
                            IconButton(
                              icon: const Icon(Icons.clear),
                              onPressed: () {
                                _searchController.clear();
                              },
                            ),
                        ],
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Sort by
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Products',
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                      DropdownButton<String>(
                        value: 'newest',
                        icon: const Icon(Icons.arrow_drop_down),
                        elevation: 16,
                        style: const TextStyle(color: Colors.black87),
                        underline: Container(
                          height: 2,
                          color: Theme.of(context).primaryColor,
                        ),
                        onChanged: (String? newValue) {
                          // Handle sort change
                        },
                        items: <String>['Newest', 'Price: Low to High', 'Price: High to Low', 'Top Rated']
                            .map<DropdownMenuItem<String>>((String value) {
                          return DropdownMenuItem<String>(
                            value: value.toLowerCase().replaceAll(': ', '_').replaceAll(' ', '_'),
                            child: Text(value),
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Products grid
                  Expanded(
                    child: GridView.builder(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 4,
                        crossAxisSpacing: 16,
                        mainAxisSpacing: 16,
                        childAspectRatio: 0.7,
                      ),
                      itemCount: 12,
                      itemBuilder: (context, index) {
                        return _buildProductCard(index);
                      },
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Create new product listing
        },
        tooltip: 'Add Product',
        child: const Icon(Icons.add),
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected, VoidCallback onPressed) {
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      selectedColor: Theme.of(context).primaryColor,
      onSelected: (selected) {
        onPressed();
      },
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : Colors.black87,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
          color: isSelected 
              ? Theme.of(context).primaryColor 
              : Colors.grey.shade300,
        ),
      ),
    );
  }

  Widget _buildProductCard(int index) {
    return Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
              child: Image.network(
                'https://via.placeholder.com/300',
                fit: BoxFit.cover,
                width: double.infinity,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Product ${index + 1}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  'Brand Name',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '\$${(index + 1) * 15}.99',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    Row(
                      children: [
                        const Icon(
                          Icons.star,
                          color: Colors.amber,
                          size: 16,
                        ),
                        Text(
                          '${(index % 5) + 1}.0',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
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
    );
  }
}