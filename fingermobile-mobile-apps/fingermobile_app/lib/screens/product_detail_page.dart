import 'package:flutter/material.dart';

class ProductDetailPage extends StatefulWidget {
  final String productId;
  
  ProductDetailPage({required this.productId});

  @override
  _ProductDetailPageState createState() => _ProductDetailPageState();
}

class _ProductDetailPageState extends State<ProductDetailPage> {
  int _selectedQuantity = 1;
  int _selectedSize = 1;
  int _selectedColor = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Product Details'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.favorite_border),
            onPressed: () {},
          ),
          IconButton(
            icon: Icon(Icons.share),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Product Image
              Container(
                height: 300,
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  color: Colors.grey[200],
                ),
                child: Center(
                  child: Icon(
                    Icons.image,
                    size: 80,
                    color: Colors.grey,
                  ),
                ),
              ),
              SizedBox(height: 16),
              
              // Product Title and Price
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      'Premium Product Title',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  Text(
                    '\$29.99',
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.deepPurple,
                    ),
                  ),
                ],
              ),
              SizedBox(height: 8),
              
              // Rating and Reviews
              Row(
                children: [
                  Icon(Icons.star, color: Colors.orange),
                  Icon(Icons.star, color: Colors.orange),
                  Icon(Icons.star, color: Colors.orange),
                  Icon(Icons.star, color: Colors.orange),
                  Icon(Icons.star_half, color: Colors.orange),
                  SizedBox(width: 8),
                  Text('(128 reviews)'),
                ],
              ),
              SizedBox(height: 16),
              
              // Seller Info
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.grey[100],
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: Colors.purple[100],
                      child: Icon(Icons.store, color: Colors.deepPurple),
                    ),
                    SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Premium Store',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text(
                            'Verified Seller',
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.green,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Icon(Icons.arrow_forward_ios, size: 16),
                  ],
                ),
              ),
              SizedBox(height: 16),
              
              // Product Description
              Text(
                'Product Description',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 8),
              Text(
                'This is a detailed description of the product. It highlights the key features, specifications, and benefits. The product is designed to meet the needs of members looking for high-quality solutions.',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[700],
                  height: 1.5,
                ),
              ),
              SizedBox(height: 16),
              
              // Color Selection
              Text(
                'Color',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: List.generate(4, (index) {
                  Color color;
                  switch (index) {
                    case 0: color = Colors.red; break;
                    case 1: color = Colors.blue; break;
                    case 2: color = Colors.green; break;
                    case 3: color = Colors.black; break;
                    default: color = Colors.grey;
                  }
                  
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedColor = index;
                      });
                    },
                    child: Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: color,
                        border: Border.all(
                          color: _selectedColor == index 
                            ? Colors.deepPurple 
                            : Colors.grey,
                          width: 2,
                        ),
                      ),
                    ),
                  );
                }),
              ),
              SizedBox(height: 16),
              
              // Size Selection
              Text(
                'Size',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: List.generate(5, (index) {
                  String size = ['XS', 'S', 'M', 'L', 'XL'][index];
                  
                  return ChoiceChip(
                    label: Text(size),
                    selected: _selectedSize == index,
                    selectedColor: Colors.deepPurple,
                    onSelected: (selected) {
                      setState(() {
                        _selectedSize = selected ? index : 0;
                      });
                    },
                  );
                }),
              ),
              SizedBox(height: 16),
              
              // Quantity Selection
              Row(
                children: [
                  Text(
                    'Quantity',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Spacer(),
                  Row(
                    children: [
                      Container(
                        width: 30,
                        height: 30,
                        decoration: BoxDecoration(
                          color: Colors.grey[200],
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: IconButton(
                          padding: EdgeInsets.zero,
                          icon: Icon(Icons.remove, size: 16),
                          onPressed: () {
                            if (_selectedQuantity > 1) {
                              setState(() {
                                _selectedQuantity--;
                              });
                            }
                          },
                        ),
                      ),
                      SizedBox(width: 8),
                      Text(
                        '$_selectedQuantity',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      SizedBox(width: 8),
                      Container(
                        width: 30,
                        height: 30,
                        decoration: BoxDecoration(
                          color: Colors.grey[200],
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: IconButton(
                          padding: EdgeInsets.zero,
                          icon: Icon(Icons.add, size: 16),
                          onPressed: () {
                            setState(() {
                              _selectedQuantity++;
                            });
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: Container(
        padding: EdgeInsets.all(16),
        child: Row(
          children: [
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  // Add to cart
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.deepPurple,
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(vertical: 16),
                ),
                child: Text('Add to Cart'),
              ),
            ),
            SizedBox(width: 12),
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                Icons.shopping_bag,
                color: Colors.deepPurple,
              ),
            ),
          ],
        ),
      ),
    );
  }
}