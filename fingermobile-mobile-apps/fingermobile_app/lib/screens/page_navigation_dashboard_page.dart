import 'package:flutter/material.dart';

class PageNavigationDashboardPage extends StatefulWidget {
  const PageNavigationDashboardPage({super.key});

  @override
  State<PageNavigationDashboardPage> createState() => _PageNavigationDashboardPageState();
}

class _PageNavigationDashboardPageState extends State<PageNavigationDashboardPage> {
  final List<Map<String, dynamic>> _pages = [
    {
      'id': 1,
      'title': 'Dashboard',
      'subtitle': 'Your main dashboard',
      'icon': Icons.dashboard,
      'route': '/dashboard',
      'color': Colors.blue,
    },
    {
      'id': 2,
      'title': 'Profile',
      'subtitle': 'Manage your profile',
      'icon': Icons.person,
      'route': '/profile',
      'color': Colors.green,
    },
    {
      'id': 3,
      'title': 'Content Management',
      'subtitle': 'Create and manage content',
      'icon': Icons.post_add,
      'route': '/content-management',
      'color': Colors.orange,
    },
    {
      'id': 4,
      'title': 'Notifications',
      'subtitle': 'View all notifications',
      'icon': Icons.notifications,
      'route': '/notifications',
      'color': Colors.purple,
    },
    {
      'id': 5,
      'title': 'Settings',
      'subtitle': 'App settings',
      'icon': Icons.settings,
      'route': '/settings',
      'color': Colors.grey,
    },
    {
      'id': 6,
      'title': 'Messages',
      'subtitle': 'Your messages',
      'icon': Icons.message,
      'route': '/messages',
      'color': Colors.teal,
    },
    {
      'id': 7,
      'title': 'Marketplace',
      'subtitle': 'Buy and sell items',
      'icon': Icons.shopping_bag,
      'route': '/marketplace',
      'color': Colors.red,
    },
    {
      'id': 8,
      'title': 'Wallet',
      'subtitle': 'Manage your wallet',
      'icon': Icons.account_balance_wallet,
      'route': '/wallet',
      'color': Colors.amber,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Page Navigation'),
        centerTitle: false,
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search pages...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          
          // Categories
          Container(
            height: 50,
            margin: const EdgeInsets.symmetric(horizontal: 16),
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                _buildCategoryChip('All', true),
                const SizedBox(width: 8),
                _buildCategoryChip('Content', false),
                const SizedBox(width: 8),
                _buildCategoryChip('Social', false),
                const SizedBox(width: 8),
                _buildCategoryChip('Commerce', false),
                const SizedBox(width: 8),
                _buildCategoryChip('Settings', false),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Pages list
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                childAspectRatio: 0.9,
              ),
              itemCount: _pages.length,
              itemBuilder: (context, index) {
                final page = _pages[index];
                return Card(
                  elevation: 2,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(12),
                    onTap: () {
                      Navigator.of(context).pushNamed(page['route']);
                    },
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 60,
                          height: 60,
                          decoration: BoxDecoration(
                            color: page['color'].withOpacity(0.2),
                            borderRadius: BorderRadius.circular(30),
                          ),
                          child: Icon(
                            page['icon'],
                            color: page['color'],
                            size: 30,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          page['title'],
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          page['subtitle'],
                          style: const TextStyle(
                            fontSize: 12,
                            color: Colors.grey,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryChip(String label, bool isSelected) {
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        setState(() {
          // In a real app, you would filter the list based on category
        });
      },
      selectedColor: Colors.grey[300],
      labelStyle: TextStyle(
        color: isSelected ? Colors.black : Colors.grey[600],
      ),
      checkmarkColor: Colors.black,
      side: BorderSide(
        color: isSelected ? Colors.transparent : Colors.grey[300]!,
      ),
    );
  }
}