import 'package:flutter/material.dart';

class MarketplaceSidebar extends StatefulWidget {
  final Function(String)? onCategorySelected;
  final String? initialCategory;
  final bool isExpanded;

  const MarketplaceSidebar({
    Key? key,
    this.onCategorySelected,
    this.initialCategory,
    this.isExpanded = true,
  }) : super(key: key);

  @override
  _MarketplaceSidebarState createState() => _MarketplaceSidebarState();
}

class _MarketplaceSidebarState extends State<MarketplaceSidebar> {
  String _selectedCategory = 'all';
  final ScrollController _scrollController = ScrollController();

  final List<Map<String, dynamic>> _categories = [
    {'id': 'all', 'name': 'All Products', 'icon': Icons.store, 'count': 1245},
    {'id': 'electronics', 'name': 'Electronics', 'icon': Icons.devices, 'count': 124},
    {'id': 'clothing', 'name': 'Clothing', 'icon': Icons.checkroom, 'count': 98},
    {'id': 'home', 'name': 'Home & Garden', 'icon': Icons.home, 'count': 87},
    {'id': 'beauty', 'name': 'Beauty', 'icon': Icons.face, 'count': 65},
    {'id': 'sports', 'name': 'Sports', 'icon': Icons.sports, 'count': 54},
    {'id': 'books', 'name': 'Books', 'icon': Icons.menu_book, 'count': 43},
    {'id': 'toys', 'name': 'Toys', 'icon': Icons.toys, 'count': 32},
    {'id': 'automotive', 'name': 'Automotive', 'icon': Icons.directions_car, 'count': 21},
    {'id': 'jewelry', 'name': 'Jewelry', 'icon': Icons.diamond, 'count': 15},
  ];

  @override
  void initState() {
    super.initState();
    _selectedCategory = widget.initialCategory ?? 'all';
  }

  void _onCategoryTap(String categoryId) {
    setState(() {
      _selectedCategory = categoryId;
    });
    
    if (widget.onCategorySelected != null) {
      widget.onCategorySelected!(categoryId);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: widget.isExpanded ? 280 : 70,
      decoration: BoxDecoration(
        color: Colors.grey[50],
        border: Border(
          right: BorderSide(
            color: Colors.grey[300]!,
            width: 1,
          ),
        ),
      ),
      child: Column(
        children: [
          // Header
          Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.blue[700],
              border: Border(
                bottom: BorderSide(
                  color: Colors.grey[300]!,
                  width: 1,
                ),
              ),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.shopping_bag_outlined,
                  color: Colors.white,
                  size: 24,
                ),
                if (widget.isExpanded) ...[
                  SizedBox(width: 12),
                  Text(
                    'Marketplace',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ],
            ),
          ),
          
          // Search bar
          if (widget.isExpanded)
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 12, vertical: 12),
              child: TextField(
                decoration: InputDecoration(
                  hintText: 'Search products...',
                  prefixIcon: Icon(Icons.search),
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ),
          
          // Categories list
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              itemCount: _categories.length,
              itemBuilder: (context, index) {
                final category = _categories[index];
                
                return ListTile(
                  leading: Icon(
                    category['icon'],
                    color: _selectedCategory == category['id'] 
                        ? Colors.blue[700] 
                        : Colors.grey[600],
                  ),
                  title: widget.isExpanded 
                      ? Text(
                          category['name'],
                          style: TextStyle(
                            fontWeight: _selectedCategory == category['id'] 
                                ? FontWeight.bold 
                                : FontWeight.normal,
                            color: _selectedCategory == category['id'] 
                                ? Colors.blue[700] 
                                : Colors.black87,
                          ),
                        )
                      : null,
                  trailing: widget.isExpanded 
                      ? Text(
                          category['count'].toString(),
                          style: TextStyle(
                            color: _selectedCategory == category['id'] 
                                ? Colors.blue[700] 
                                : Colors.grey[600],
                          ),
                        )
                      : null,
                  selected: _selectedCategory == category['id'],
                  selectedColor: Colors.blue[700],
                  dense: !widget.isExpanded,
                  onTap: () => _onCategoryTap(category['id']),
                );
              },
            ),
          ),
          
          // Footer
          if (widget.isExpanded)
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                border: Border(
                  top: BorderSide(
                    color: Colors.grey[300]!,
                    width: 1,
                  ),
                ),
              ),
              child: Column(
                children: [
                  ListTile(
                    leading: CircleAvatar(
                      backgroundColor: Colors.blue[100],
                      child: Icon(
                        Icons.local_shipping,
                        color: Colors.blue[700],
                      ),
                    ),
                    title: Text(
                      'Free Shipping',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    subtitle: Text(
                      'On orders over \$50',
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                  SizedBox(height: 8),
                  ListTile(
                    leading: CircleAvatar(
                      backgroundColor: Colors.green[100],
                      child: Icon(
                        Icons.discount,
                        color: Colors.green[700],
                      ),
                    ),
                    title: Text(
                      'Special Deals',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    subtitle: Text(
                      'Limited time offers',
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

class MarketplaceSidebarExample extends StatefulWidget {
  @override
  _MarketplaceSidebarExampleState createState() => _MarketplaceSidebarExampleState();
}

class _MarketplaceSidebarExampleState extends State<MarketplaceSidebarExample> {
  String _currentCategory = 'all';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Marketplace Sidebar Example'),
      ),
      body: Row(
        children: [
          MarketplaceSidebar(
            initialCategory: _currentCategory,
            onCategorySelected: (category) {
              setState(() {
                _currentCategory = category;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Selected: $category')),
              );
            },
          ),
          Expanded(
            child: Center(
              child: Text(
                'Main Content Area\nSelected Category: $_currentCategory',
                style: TextStyle(fontSize: 18),
                textAlign: TextAlign.center,
              ),
            ),
          ),
        ],
      ),
    );
  }
}