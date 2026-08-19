import 'package:flutter/material.dart';

class StorefrontDetailPage extends StatefulWidget {
  const StorefrontDetailPage({super.key});

  @override
  State<StorefrontDetailPage> createState() => _StorefrontDetailPageState();
}

class _StorefrontDetailPageState extends State<StorefrontDetailPage> {
  bool _isLoading = false;
  String? _errorMessage;
  Storefront? _storefront;
  List<Product> _products = [];
  List<Order> _orders = [];
  StorefrontTab _selectedTab = StorefrontTab.overview;
  DisplayMode _displayMode = DisplayMode.postCard; // New: Default to post card view

  @override
  void initState() {
    super.initState();
    _loadStorefrontDetails();
  }

  Future<void> _loadStorefrontDetails() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock storefront data
      setState(() {
        _storefront = Storefront(
          id: 1,
          name: 'Tech Gadgets Store',
          description: 'Your one-stop shop for the latest tech gadgets and accessories',
          logoUrl: 'https://via.placeholder.com/100x100/4ECDC4/FFFFFF?text=Tech+Gadgets',
          bannerUrl: 'https://via.placeholder.com/400x200/45B7D1/FFFFFF?text=Tech+Gadgets+Banner',
          owner: 'John Doe',
          ownerId: 123,
          createdDate: DateTime.now().subtract(const Duration(days: 30)),
          lastUpdated: DateTime.now().subtract(const Duration(hours: 5)),
          status: StorefrontStatus.active,
          rating: 4.7,
          totalReviews: 128,
          totalProducts: 42,
          totalOrders: 256,
          totalRevenue: 12500.75,
          visitors: 1250,
          isFeatured: true,
        );

        // Mock products
        _products = [
          Product(
            id: 1,
            name: 'Wireless Bluetooth Headphones',
            description: 'High-quality wireless headphones with noise cancellation',
            price: 89.99,
            discountPrice: 69.99,
            imageUrl: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=Headphones',
            category: 'Electronics',
            inStock: true,
            stockQuantity: 25,
            rating: 4.5,
            reviewCount: 42,
            isFeatured: true,
          ),
          Product(
            id: 2,
            name: 'Smart Fitness Tracker',
            description: 'Track your steps, heart rate, and sleep patterns',
            price: 49.99,
            discountPrice: null,
            imageUrl: 'https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=Fitness+Tracker',
            category: 'Wearables',
            inStock: true,
            stockQuantity: 15,
            rating: 4.2,
            reviewCount: 28,
            isFeatured: false,
          ),
          Product(
            id: 3,
            name: 'Portable Phone Charger',
            description: '10000mAh high-capacity power bank for all your devices',
            price: 29.99,
            discountPrice: 19.99,
            imageUrl: 'https://via.placeholder.com/150x150/FFEAA7/000000?text=Power+Bank',
            category: 'Accessories',
            inStock: true,
            stockQuantity: 50,
            rating: 4.0,
            reviewCount: 36,
            isFeatured: true,
          ),
          Product(
            id: 4,
            name: 'Wireless Keyboard and Mouse',
            description: 'Ergonomic wireless keyboard and mouse combo',
            price: 39.99,
            discountPrice: null,
            imageUrl: 'https://via.placeholder.com/150x150/A2DBFA/000000?text=Keyboard',
            category: 'Computer Accessories',
            inStock: true,
            stockQuantity: 30,
            rating: 4.3,
            reviewCount: 21,
            isFeatured: false,
          ),
          Product(
            id: 5,
            name: 'Smart Home Speaker',
            description: 'Voice-controlled speaker with premium sound quality',
            price: 79.99,
            discountPrice: 64.99,
            imageUrl: 'https://via.placeholder.com/150x150/FFB6C1/000000?text=Speaker',
            category: 'Smart Home',
            inStock: true,
            stockQuantity: 20,
            rating: 4.6,
            reviewCount: 54,
            isFeatured: true,
          ),
          Product(
            id: 6,
            name: 'USB-C Hub',
            description: 'Multi-port USB-C hub for laptops and tablets',
            price: 24.99,
            discountPrice: null,
            imageUrl: 'https://via.placeholder.com/150x150/DDA0DD/000000?text=Hub',
            category: 'Computer Accessories',
            inStock: true,
            stockQuantity: 40,
            rating: 4.1,
            reviewCount: 17,
            isFeatured: false,
          ),
        ];

        // Mock orders
        _orders = [
          Order(
            id: 1001,
            customerName: 'Alice Johnson',
            customerEmail: 'alice@example.com',
            orderDate: DateTime.now().subtract(const Duration(days: 1)),
            totalAmount: 159.98,
            status: OrderStatus.processing,
            items: [
              OrderItem(productName: 'Wireless Bluetooth Headphones', quantity: 1, price: 89.99),
              OrderItem(productName: 'Portable Phone Charger', quantity: 1, price: 29.99),
            ],
          ),
          Order(
            id: 1002,
            customerName: 'Bob Smith',
            customerEmail: 'bob@example.com',
            orderDate: DateTime.now().subtract(const Duration(days: 2)),
            totalAmount: 49.99,
            status: OrderStatus.shipped,
            items: [
              OrderItem(productName: 'Smart Fitness Tracker', quantity: 1, price: 49.99),
            ],
          ),
          Order(
            id: 1003,
            customerName: 'Carol Williams',
            customerEmail: 'carol@example.com',
            orderDate: DateTime.now().subtract(const Duration(days: 3)),
            totalAmount: 139.98,
            status: OrderStatus.delivered,
            items: [
              OrderItem(productName: 'Wireless Bluetooth Headphones', quantity: 2, price: 89.99),
            ],
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load storefront details. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _editStorefront() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Edit storefront functionality would open here'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _toggleStorefrontStatus() {
    if (_storefront != null) {
      setState(() {
        _storefront = Storefront(
          id: _storefront!.id,
          name: _storefront!.name,
          description: _storefront!.description,
          logoUrl: _storefront!.logoUrl,
          bannerUrl: _storefront!.bannerUrl,
          owner: _storefront!.owner,
          ownerId: _storefront!.ownerId,
          createdDate: _storefront!.createdDate,
          lastUpdated: DateTime.now(),
          status: _storefront!.status == StorefrontStatus.active
              ? StorefrontStatus.inactive
              : StorefrontStatus.active,
          rating: _storefront!.rating,
          totalReviews: _storefront!.totalReviews,
          totalProducts: _storefront!.totalProducts,
          totalOrders: _storefront!.totalOrders,
          totalRevenue: _storefront!.totalRevenue,
          visitors: _storefront!.visitors,
          isFeatured: _storefront!.isFeatured,
        );
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
              'Storefront is now ${_storefront!.status == StorefrontStatus.active ? 'active' : 'inactive'}'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }

  void _viewProduct(Product product) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildProductDetailsSheet(product),
    );
  }

  void _editProduct(Product product) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Editing product: ${product.name}'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _deleteProduct(Product product) {
    setState(() {
      _products.removeWhere((p) => p.id == product.id);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Deleted product: ${product.name}'),
        backgroundColor: Colors.red,
      ),
    );
  }

  void _viewOrder(Order order) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildOrderDetailsSheet(order),
    );
  }

  void _updateOrderStatus(Order order, OrderStatus newStatus) {
    setState(() {
      int index = _orders.indexWhere((o) => o.id == order.id);
      if (index != -1) {
        _orders[index] = Order(
          id: order.id,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          orderDate: order.orderDate,
          totalAmount: order.totalAmount,
          status: newStatus,
          items: order.items,
        );
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Order #${order.id} status updated to ${_getOrderStatusText(newStatus)}'),
        backgroundColor: Colors.green,
      ),
    );
  }

  Widget _buildProductDetailsSheet(Product product) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
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
                    fontSize: 20,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Center(
            child: Container(
              height: 200,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(product.imageUrl),
                  fit: BoxFit.contain,
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            product.description,
            style: const TextStyle(
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 16),
          _buildInfoRow('Category', product.category),
          _buildInfoRow('In Stock', product.inStock ? 'Yes (${product.stockQuantity})' : 'No'),
          _buildInfoRow('Rating', '${product.rating} (${product.reviewCount} reviews)'),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (product.discountPrice != null)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '\$${product.discountPrice}',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 20,
                        color: Colors.green,
                      ),
                    ),
                    Text(
                      '\$${product.price}',
                      style: const TextStyle(
                        decoration: TextDecoration.lineThrough,
                        color: Colors.grey,
                      ),
                    ),
                  ],
                )
              else
                Text(
                  '\$${product.price}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
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
                      fontSize: 12,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton.icon(
                onPressed: () => _editProduct(product),
                icon: const Icon(Icons.edit),
                label: const Text('Edit'),
              ),
              const SizedBox(width: 8),
              TextButton.icon(
                onPressed: () => _deleteProduct(product),
                icon: const Icon(Icons.delete),
                label: const Text('Delete'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOrderDetailsSheet(Order order) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Order #${order.id}',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _buildInfoRow('Customer', order.customerName),
          _buildInfoRow('Email', order.customerEmail),
          _buildInfoRow('Date', _formatDate(order.orderDate)),
          _buildInfoRow('Status', _getOrderStatusText(order.status)),
          _buildInfoRow('Total', '\$${order.totalAmount.toStringAsFixed(2)}'),
          const SizedBox(height: 16),
          const Text(
            'Items:',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 8),
          Column(
            children: order.items.map((item) {
              return Padding(
                padding: const EdgeInsets.symmetric(vertical: 4.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text('${item.quantity} x ${item.productName}'),
                    ),
                    Text('\$${(item.quantity * item.price).toStringAsFixed(2)}'),
                  ],
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 16),
          const Text(
            'Update Status:',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8.0,
            children: [
              ChoiceChip(
                label: const Text('Processing'),
                selected: order.status == OrderStatus.processing,
                onSelected: (selected) {
                  if (selected) {
                    _updateOrderStatus(order, OrderStatus.processing);
                  }
                },
              ),
              ChoiceChip(
                label: const Text('Shipped'),
                selected: order.status == OrderStatus.shipped,
                onSelected: (selected) {
                  if (selected) {
                    _updateOrderStatus(order, OrderStatus.shipped);
                  }
                },
              ),
              ChoiceChip(
                label: const Text('Delivered'),
                selected: order.status == OrderStatus.delivered,
                onSelected: (selected) {
                  if (selected) {
                    _updateOrderStatus(order, OrderStatus.delivered);
                  }
                },
              ),
              ChoiceChip(
                label: const Text('Cancelled'),
                selected: order.status == OrderStatus.cancelled,
                onSelected: (selected) {
                  if (selected) {
                    _updateOrderStatus(order, OrderStatus.cancelled);
                  }
                },
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          SizedBox(
            width: 120,
            child: Text(
              '$label:',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Expanded(
            child: Text(value),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Storefront Details'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadStorefrontDetails,
          ),
          if (_storefront != null)
            IconButton(
              icon: const Icon(Icons.edit),
              onPressed: _editStorefront,
            ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadStorefrontDetails,
        child: _isLoading && _storefront == null
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _storefront == null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadStorefrontDetails,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : _storefront == null
                    ? const Center(child: Text('No storefront data available'))
                    : SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Storefront Banner
                            Container(
                              height: 150,
                              decoration: BoxDecoration(
                                image: DecorationImage(
                                  image: NetworkImage(_storefront!.bannerUrl),
                                  fit: BoxFit.cover,
                                ),
                              ),
                              child: Container(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topCenter,
                                    end: Alignment.bottomCenter,
                                    colors: [
                                      Colors.transparent,
                                      Colors.black.withOpacity(0.7),
                                    ],
                                  ),
                                ),
                                child: Align(
                                  alignment: Alignment.bottomLeft,
                                  child: Padding(
                                    padding: const EdgeInsets.all(16.0),
                                    child: Row(
                                      children: [
                                        CircleAvatar(
                                          radius: 30,
                                          backgroundImage: NetworkImage(_storefront!.logoUrl),
                                        ),
                                        const SizedBox(width: 16),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            mainAxisSize: MainAxisSize.min,
                                            children: [
                                              Text(
                                                _storefront!.name,
                                                style: const TextStyle(
                                                  color: Colors.white,
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 20,
                                                ),
                                              ),
                                              const SizedBox(height: 4),
                                              Text(
                                                _storefront!.description,
                                                style: const TextStyle(
                                                  color: Colors.white70,
                                                  fontSize: 14,
                                                ),
                                                maxLines: 2,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            // Storefront Actions
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 16.0),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  ElevatedButton.icon(
                                    onPressed: _toggleStorefrontStatus,
                                    icon: Icon(
                                      _storefront!.status == StorefrontStatus.active
                                          ? Icons.pause
                                          : Icons.play_arrow,
                                    ),
                                    label: Text(
                                      _storefront!.status == StorefrontStatus.active
                                          ? 'Pause Store'
                                          : 'Activate Store',
                                    ),
                                  ),
                                  OutlinedButton.icon(
                                    onPressed: _editStorefront,
                                    icon: const Icon(Icons.edit),
                                    label: const Text('Edit Store'),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 16),
                            // Storefront Stats
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 16.0),
                              child: Card(
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    children: [
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                                        children: [
                                          _buildStatItem('Products', '${_storefront!.totalProducts}'),
                                          _buildStatItem('Orders', '${_storefront!.totalOrders}'),
                                          _buildStatItem('Revenue',
                                              '\$${_storefront!.totalRevenue.toStringAsFixed(2)}'),
                                        ],
                                      ),
                                      const SizedBox(height: 16),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                                        children: [
                                          _buildStatItem('Visitors', '${_storefront!.visitors}'),
                                          _buildRatingItem(_storefront!.rating,
                                              _storefront!.totalReviews),
                                          _buildStatusItem(_storefront!.status),
                                        ],
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 16),
                            // Tabs
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 16.0),
                              child: Row(
                                children: [
                                  ChoiceChip(
                                    label: const Text('Overview'),
                                    selected: _selectedTab == StorefrontTab.overview,
                                    onSelected: (selected) {
                                      if (selected) {
                                        setState(() {
                                          _selectedTab = StorefrontTab.overview;
                                        });
                                      }
                                    },
                                  ),
                                  const SizedBox(width: 8),
                                  ChoiceChip(
                                    label: const Text('Products'),
                                    selected: _selectedTab == StorefrontTab.products,
                                    onSelected: (selected) {
                                      if (selected) {
                                        setState(() {
                                          _selectedTab = StorefrontTab.products;
                                        });
                                      }
                                    },
                                  ),
                                  const SizedBox(width: 8),
                                  ChoiceChip(
                                    label: const Text('Orders'),
                                    selected: _selectedTab == StorefrontTab.orders,
                                    onSelected: (selected) {
                                      if (selected) {
                                        setState(() {
                                          _selectedTab = StorefrontTab.orders;
                                        });
                                      }
                                    },
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 16),
                            // Tab Content
                            if (_selectedTab == StorefrontTab.overview)
                              _buildOverviewTab()
                            else if (_selectedTab == StorefrontTab.products)
                              _buildProductsTab()
                            else if (_selectedTab == StorefrontTab.orders)
                              _buildOrdersTab(),
                          ],
                        ),
                      ),
      ),
    );
  }

  Widget _buildOverviewTab() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Recent Activity',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Latest Orders',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ..._orders.take(3).map((order) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 20,
                            backgroundColor: Colors.grey[300],
                            child: Text(
                              order.customerName.substring(0, 1),
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  order.customerName,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  'Order #${order.id} • \$${order.totalAmount.toStringAsFixed(2)}',
                                  style: const TextStyle(
                                    color: Colors.grey,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: _getOrderStatusColor(order.status),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              _getOrderStatusText(order.status),
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Top Selling Products',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ..._products.where((p) => p.isFeatured).take(2).map((product) {
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0),
                      child: Row(
                        children: [
                          Container(
                            width: 50,
                            height: 50,
                            decoration: BoxDecoration(
                              image: DecorationImage(
                                image: NetworkImage(product.imageUrl),
                                fit: BoxFit.cover,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  product.name,
                                  style: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  '\$${product.price}',
                                  style: const TextStyle(
                                    color: Colors.grey,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Text('${product.rating} ★'),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductsTab() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '${_products.length} Products',
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
              Row(
                children: [
                  // Display mode selector
                  IconButton(
                    icon: Icon(
                      _displayMode == DisplayMode.grid
                          ? Icons.grid_view
                          : _displayMode == DisplayMode.list
                              ? Icons.list
                              : Icons.dashboard, // Post card view icon
                    ),
                    onPressed: () {
                      // Cycle through display modes
                      setState(() {
                        if (_displayMode == DisplayMode.grid) {
                          _displayMode = DisplayMode.list;
                        } else if (_displayMode == DisplayMode.list) {
                          _displayMode = DisplayMode.postCard;
                        } else {
                          _displayMode = DisplayMode.grid;
                        }
                      });
                    },
                  ),
                  TextButton.icon(
                    onPressed: () {
                      // Add new product
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Add new product functionality would open here'),
                          backgroundColor: Colors.blue,
                        ),
                      );
                    },
                    icon: const Icon(Icons.add),
                    label: const Text('Add Product'),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 16),
          // Display products based on selected mode
          if (_displayMode == DisplayMode.grid)
            _buildGridView()
          else if (_displayMode == DisplayMode.list)
            _buildListView()
          else
            _buildPostCardView(), // Post card view as default
        ],
      ),
    );
  }

  Widget _buildGridView() {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 0.8,
      ),
      itemCount: _products.length,
      itemBuilder: (context, index) {
        var product = _products[index];
        return Card(
          child: InkWell(
            onTap: () => _viewProduct(product),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  height: 100,
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: NetworkImage(product.imageUrl),
                      fit: BoxFit.cover,
                    ),
                  ),
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
                        '\$${product.price}',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.green,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '${product.rating}',
                            style: const TextStyle(
                              fontSize: 12,
                            ),
                          ),
                          const Icon(
                            Icons.star,
                            size: 14,
                            color: Colors.amber,
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
    );
  }

  Widget _buildListView() {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _products.length,
      itemBuilder: (context, index) {
        var product = _products[index];
        return Card(
          child: ListTile(
            leading: Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(product.imageUrl),
                  fit: BoxFit.cover,
                ),
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            title: Text(product.name),
            subtitle: Text('\$${product.price}'),
            trailing: PopupMenuButton<String>(
              onSelected: (String result) {
                switch (result) {
                  case 'view':
                    _viewProduct(product);
                    break;
                  case 'edit':
                    _editProduct(product);
                    break;
                  case 'delete':
                    _deleteProduct(product);
                    break;
                }
              },
              itemBuilder: (BuildContext context) => <PopupMenuEntry<String>>[
                const PopupMenuItem<String>(
                  value: 'view',
                  child: Text('View'),
                ),
                const PopupMenuItem<String>(
                  value: 'edit',
                  child: Text('Edit'),
                ),
                const PopupMenuItem<String>(
                  value: 'delete',
                  child: Text('Delete'),
                ),
              ],
            ),
            onTap: () => _viewProduct(product),
          ),
        );
      },
    );
  }

  Widget _buildPostCardView() {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3, // Three column layout as requested
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
        childAspectRatio: 0.8,
      ),
      itemCount: _products.length,
      itemBuilder: (context, index) {
        var product = _products[index];
        return Card(
          child: InkWell(
            onTap: () => _viewProduct(product),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top: Large HD Image/Video formats
                Expanded(
                  flex: 3,
                  child: Container(
                    width: double.infinity,
                    decoration: BoxDecoration(
                      image: DecorationImage(
                        image: NetworkImage(product.imageUrl),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),
                // Bottom: Product details
                Expanded(
                  flex: 2,
                  child: Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Product name
                        Text(
                          product.name,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 10,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        // Price
                        Text(
                          '\$${product.price}',
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 10,
                            color: Colors.green,
                          ),
                        ),
                        // Rating
                        Row(
                          children: [
                            Text(
                              '${product.rating}',
                              style: const TextStyle(
                                fontSize: 10,
                              ),
                            ),
                            const Icon(
                              Icons.star,
                              size: 12,
                              color: Colors.amber,
                            ),
                            const Spacer(),
                            // Add to cart button
                            IconButton(
                              icon: const Icon(Icons.shopping_cart, size: 16),
                              padding: EdgeInsets.zero,
                              onPressed: () {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('Added ${product.name} to cart'),
                                    backgroundColor: Colors.green,
                                  ),
                                );
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildOrdersTab() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '${_orders.length} Orders',
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
            ),
          ),
          const SizedBox(height: 16),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _orders.length,
            itemBuilder: (context, index) {
              var order = _orders[index];
              return Card(
                child: ListTile(
                  title: Text('Order #${order.id}'),
                  subtitle: Text(
                      '${order.customerName} • \$${order.totalAmount.toStringAsFixed(2)}'),
                  trailing: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _getOrderStatusColor(order.status),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      _getOrderStatusText(order.status),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  onTap: () => _viewOrder(order),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.grey,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildRatingItem(double rating, int reviewCount) {
    return Column(
      children: [
        Row(
          children: [
            const Icon(Icons.star, size: 16, color: Colors.amber),
            const SizedBox(width: 4),
            Text(
              '$rating',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          '$reviewCount reviews',
          style: const TextStyle(
            color: Colors.grey,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Widget _buildStatusItem(StorefrontStatus status) {
    Color color;
    String text;

    switch (status) {
      case StorefrontStatus.active:
        color = Colors.green;
        text = 'Active';
        break;
      case StorefrontStatus.inactive:
        color = Colors.grey;
        text = 'Inactive';
        break;
      case StorefrontStatus.suspended:
        color = Colors.red;
        text = 'Suspended';
        break;
    }

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            text,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
            ),
          ),
        ),
        const SizedBox(height: 4),
        const Text(
          'Status',
          style: TextStyle(
            color: Colors.grey,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  String _getOrderStatusText(OrderStatus status) {
    switch (status) {
      case OrderStatus.processing:
        return 'Processing';
      case OrderStatus.shipped:
        return 'Shipped';
      case OrderStatus.delivered:
        return 'Delivered';
      case OrderStatus.cancelled:
        return 'Cancelled';
    }
  }

  Color _getOrderStatusColor(OrderStatus status) {
    switch (status) {
      case OrderStatus.processing:
        return Colors.blue;
      case OrderStatus.shipped:
        return Colors.orange;
      case OrderStatus.delivered:
        return Colors.green;
      case OrderStatus.cancelled:
        return Colors.red;
    }
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}

enum StorefrontTab { overview, products, orders }
enum DisplayMode { grid, list, postCard } // New enum for display modes

enum StorefrontStatus { active, inactive, suspended }

enum OrderStatus { processing, shipped, delivered, cancelled }

class Storefront {
  final int id;
  final String name;
  final String description;
  final String logoUrl;
  final String bannerUrl;
  final String owner;
  final int ownerId;
  final DateTime createdDate;
  final DateTime lastUpdated;
  final StorefrontStatus status;
  final double rating;
  final int totalReviews;
  final int totalProducts;
  final int totalOrders;
  final double totalRevenue;
  final int visitors;
  final bool isFeatured;

  Storefront({
    required this.id,
    required this.name,
    required this.description,
    required this.logoUrl,
    required this.bannerUrl,
    required this.owner,
    required this.ownerId,
    required this.createdDate,
    required this.lastUpdated,
    required this.status,
    required this.rating,
    required this.totalReviews,
    required this.totalProducts,
    required this.totalOrders,
    required this.totalRevenue,
    required this.visitors,
    required this.isFeatured,
  });
}

class Product {
  final int id;
  final String name;
  final String description;
  final double price;
  final double? discountPrice;
  final String imageUrl;
  final String category;
  final bool inStock;
  final int stockQuantity;
  final double rating;
  final int reviewCount;
  final bool isFeatured;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    this.discountPrice,
    required this.imageUrl,
    required this.category,
    required this.inStock,
    required this.stockQuantity,
    required this.rating,
    required this.reviewCount,
    required this.isFeatured,
  });
}

class Order {
  final int id;
  final String customerName;
  final String customerEmail;
  final DateTime orderDate;
  final double totalAmount;
  final OrderStatus status;
  final List<OrderItem> items;

  Order({
    required this.id,
    required this.customerName,
    required this.customerEmail,
    required this.orderDate,
    required this.totalAmount,
    required this.status,
    required this.items,
  });
}

class OrderItem {
  final String productName;
  final int quantity;
  final double price;

  OrderItem({
    required this.productName,
    required this.quantity,
    required this.price,
  });
}