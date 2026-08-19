import 'package:flutter/material.dart';

class OrderHistoryPage extends StatefulWidget {
  @override
  _OrderHistoryPageState createState() => _OrderHistoryPageState();
}

class _OrderHistoryPageState extends State<OrderHistoryPage> {
  final List<Map<String, dynamic>> _orders = [
    {
      'id': '#1001',
      'date': 'Dec 15, 2025',
      'status': 'Delivered',
      'total': 129.99,
      'items': 2,
      'statusColor': Colors.green,
    },
    {
      'id': '#1002',
      'date': 'Dec 10, 2025',
      'status': 'Shipped',
      'total': 89.50,
      'items': 1,
      'statusColor': Colors.orange,
    },
    {
      'id': '#1003',
      'date': 'Dec 5, 2025',
      'status': 'Processing',
      'total': 199.99,
      'items': 3,
      'statusColor': Colors.blue,
    },
    {
      'id': '#1004',
      'date': 'Nov 28, 2025',
      'status': 'Delivered',
      'total': 54.99,
      'items': 1,
      'statusColor': Colors.green,
    },
    {
      'id': '#1005',
      'date': 'Nov 20, 2025',
      'status': 'Cancelled',
      'total': 79.99,
      'items': 2,
      'statusColor': Colors.red,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Order History'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Order History',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Track your past orders',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 20),
            Container(
              height: 40,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _buildFilterChip('All', true),
                  SizedBox(width: 8),
                  _buildFilterChip('Delivered', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Shipped', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Processing', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Cancelled', false),
                ],
              ),
            ),
            SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: _orders.length,
                itemBuilder: (context, index) {
                  final order = _orders[index];
                  return Card(
                    elevation: 2,
                    margin: EdgeInsets.only(bottom: 12),
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                order['id'],
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Container(
                                padding: EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: order['statusColor'].withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Text(
                                  order['status'],
                                  style: TextStyle(
                                    color: order['statusColor'],
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 8),
                          Row(
                            children: [
                              Icon(
                                Icons.calendar_today,
                                size: 14,
                                color: Colors.grey,
                              ),
                              SizedBox(width: 4),
                              Text(
                                order['date'],
                                style: TextStyle(
                                  color: Colors.grey[700],
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 8),
                          Row(
                            children: [
                              Icon(
                                Icons.shopping_bag,
                                size: 14,
                                color: Colors.grey,
                              ),
                              SizedBox(width: 4),
                              Text(
                                '${order['items']} items',
                                style: TextStyle(
                                  color: Colors.grey[700],
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '\$${order['total'].toStringAsFixed(2)}',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              TextButton(
                                onPressed: () {
                                  // View order details
                                },
                                child: Text('View Details'),
                                style: TextButton.styleFrom(
                                  foregroundColor: Colors.deepPurple,
                                ),
                              ),
                            ],
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
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected) {
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (bool selected) {},
      selectedColor: Colors.deepPurple,
      checkmarkColor: Colors.white,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : Colors.black,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
          color: isSelected ? Colors.deepPurple : Colors.grey,
        ),
      ),
    );
  }
}