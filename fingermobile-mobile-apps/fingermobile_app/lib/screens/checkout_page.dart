import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class CheckoutPage extends StatefulWidget {
  const CheckoutPage({super.key});

  @override
  State<CheckoutPage> createState() => _CheckoutPageState();
}

class _CheckoutPageState extends State<CheckoutPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<CartItem> _cartItems = [];
  PaymentMethod _selectedPaymentMethod = PaymentMethod.creditCard;
  DeliveryMethod _selectedDeliveryMethod = DeliveryMethod.standard;
  String _promoCode = '';
  bool _promoApplied = false;
  double _discount = 0.0;

  final TextEditingController _cardNumberController = TextEditingController();
  final TextEditingController _expiryDateController = TextEditingController();
  final TextEditingController _cvvController = TextEditingController();
  final TextEditingController _cardHolderController = TextEditingController();
  final TextEditingController _addressController = TextEditingController();
  final TextEditingController _cityController = TextEditingController();
  final TextEditingController _zipCodeController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadCartItems();
  }

  Future<void> _loadCartItems() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock cart items
      setState(() {
        _cartItems = [
          CartItem(
            id: 1,
            name: 'Wireless Headphones',
            price: 129.99,
            quantity: 1,
            imageUrl: 'https://via.placeholder.com/150x150/4ECDC4/FFFFFF?text=Headphones',
          ),
          CartItem(
            id: 2,
            name: 'Smart Watch',
            price: 199.99,
            quantity: 1,
            imageUrl: 'https://via.placeholder.com/150x150/FF6B6B/FFFFFF?text=Watch',
          ),
          CartItem(
            id: 3,
            name: 'Cotton T-Shirt',
            price: 24.99,
            quantity: 2,
            imageUrl: 'https://via.placeholder.com/150x150/45B7D1/FFFFFF?text=T-Shirt',
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load cart items. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  double get _subtotal {
    return _cartItems.fold(0.0, (sum, item) => sum + (item.price * item.quantity));
  }

  double get _shippingCost {
    switch (_selectedDeliveryMethod) {
      case DeliveryMethod.standard:
        return 5.99;
      case DeliveryMethod.express:
        return 12.99;
      case DeliveryMethod.nextDay:
        return 24.99;
    }
  }

  double get _tax {
    return (_subtotal - _discount) * 0.08; // 8% tax
  }

  double get _total {
    return _subtotal - _discount + _shippingCost + _tax;
  }

  void _applyPromoCode() {
    if (_promoCode.trim().toUpperCase() == 'SAVE10') {
      setState(() {
        _discount = _subtotal * 0.10;
        _promoApplied = true;
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Promo code applied! 10% discount added.'),
          backgroundColor: Colors.green,
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Invalid promo code.'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _processPayment() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate payment processing
      await Future.delayed(const Duration(seconds: 3));
      
      // Show success dialog
      if (mounted) {
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: const Text('Order Placed!'),
              content: const Text('Your order has been successfully placed. Thank you for your purchase!'),
              actions: [
                TextButton(
                  onPressed: () {
                    Navigator.of(context).pop(); // Close dialog
                    // Navigate to order confirmation page or home
                    Navigator.of(context).popUntil((route) => route.isFirst);
                  },
                  child: const Text('OK'),
                ),
              ],
            );
          },
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _errorMessage = 'Payment failed. Please try again.';
        });
      }
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  void dispose() {
    _cardNumberController.dispose();
    _expiryDateController.dispose();
    _cvvController.dispose();
    _cardHolderController.dispose();
    _addressController.dispose();
    _cityController.dispose();
    _zipCodeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Checkout'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: _isLoading && _cartItems.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null && _cartItems.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(_errorMessage!),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _loadCartItems,
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
                        // Order Summary
                        const Text(
                          'Order Summary',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: _cartItems.length,
                          itemBuilder: (context, index) {
                            var item = _cartItems[index];
                            return Card(
                              margin: const EdgeInsets.only(bottom: 8),
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Row(
                                  children: [
                                    CachedNetworkImage(
                                      imageUrl: item.imageUrl,
                                      width: 60,
                                      height: 60,
                                      fit: BoxFit.cover,
                                      placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                                      errorWidget: (context, url, error) => Container(
                                        color: Colors.grey[300],
                                        child: const Icon(Icons.image),
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            item.name,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text('\$${item.price.toStringAsFixed(2)}'),
                                        ],
                                      ),
                                    ),
                                    Text('Qty: ${item.quantity}'),
                                    const SizedBox(width: 16),
                                    Text(
                                      '\$${(item.price * item.quantity).toStringAsFixed(2)}',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            );
                          },
                        ),
                        const SizedBox(height: 24),
                        // Promo Code
                        const Text(
                          'Promo Code',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Row(
                          children: [
                            Expanded(
                              child: TextField(
                                decoration: const InputDecoration(
                                  hintText: 'Enter promo code',
                                  border: OutlineInputBorder(),
                                ),
                                onChanged: (value) {
                                  setState(() {
                                    _promoCode = value;
                                  });
                                },
                              ),
                            ),
                            const SizedBox(width: 8),
                            ElevatedButton(
                              onPressed: _promoCode.isEmpty ? null : _applyPromoCode,
                              child: const Text('Apply'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),
                        // Delivery Method
                        const Text(
                          'Delivery Method',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              children: [
                                _buildDeliveryOption(
                                  DeliveryMethod.standard,
                                  'Standard Delivery',
                                  '3-5 business days',
                                  '\$5.99',
                                ),
                                const Divider(),
                                _buildDeliveryOption(
                                  DeliveryMethod.express,
                                  'Express Delivery',
                                  '1-2 business days',
                                  '\$12.99',
                                ),
                                const Divider(),
                                _buildDeliveryOption(
                                  DeliveryMethod.nextDay,
                                  'Next Day Delivery',
                                  'Next business day',
                                  '\$24.99',
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Shipping Address
                        const Text(
                          'Shipping Address',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              children: [
                                TextField(
                                  controller: _addressController,
                                  decoration: const InputDecoration(
                                    labelText: 'Street Address',
                                    border: OutlineInputBorder(),
                                  ),
                                ),
                                const SizedBox(height: 16),
                                Row(
                                  children: [
                                    Expanded(
                                      child: TextField(
                                        controller: _cityController,
                                        decoration: const InputDecoration(
                                          labelText: 'City',
                                          border: OutlineInputBorder(),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    Expanded(
                                      child: TextField(
                                        controller: _zipCodeController,
                                        decoration: const InputDecoration(
                                          labelText: 'ZIP Code',
                                          border: OutlineInputBorder(),
                                        ),
                                      ),
                                    ),
                                ],
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Payment Method
                        const Text(
                          'Payment Method',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              children: [
                                _buildPaymentOption(
                                  PaymentMethod.creditCard,
                                  'Credit/Debit Card',
                                  Icons.credit_card,
                                ),
                                const Divider(),
                                _buildPaymentOption(
                                  PaymentMethod.paypal,
                                  'PayPal',
                                  Icons.account_balance_wallet,
                                ),
                                const Divider(),
                                _buildPaymentOption(
                                  PaymentMethod.applePay,
                                  'Apple Pay',
                                  Icons.phone_iphone,
                                ),
                              ],
                            ),
                          ),
                        ),
                        if (_selectedPaymentMethod == PaymentMethod.creditCard)
                          Card(
                            margin: const EdgeInsets.only(top: 16),
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                children: [
                                  TextField(
                                    controller: _cardNumberController,
                                    decoration: const InputDecoration(
                                      labelText: 'Card Number',
                                      border: OutlineInputBorder(),
                                    ),
                                    keyboardType: TextInputType.number,
                                  ),
                                  const SizedBox(height: 16),
                                  Row(
                                    children: [
                                      Expanded(
                                        child: TextField(
                                          controller: _expiryDateController,
                                          decoration: const InputDecoration(
                                            labelText: 'Expiry Date (MM/YY)',
                                            border: OutlineInputBorder(),
                                          ),
                                          keyboardType: TextInputType.datetime,
                                        ),
                                      ),
                                      const SizedBox(width: 16),
                                      Expanded(
                                        child: TextField(
                                          controller: _cvvController,
                                          decoration: const InputDecoration(
                                            labelText: 'CVV',
                                            border: OutlineInputBorder(),
                                          ),
                                          keyboardType: TextInputType.number,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 16),
                                  TextField(
                                    controller: _cardHolderController,
                                    decoration: const InputDecoration(
                                      labelText: 'Cardholder Name',
                                      border: OutlineInputBorder(),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        const SizedBox(height: 24),
                        // Order Total
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              children: [
                                _buildOrderSummaryRow('Subtotal', '\$${_subtotal.toStringAsFixed(2)}'),
                                if (_promoApplied)
                                  _buildOrderSummaryRow(
                                    'Discount', 
                                    '-\$${_discount.toStringAsFixed(2)}',
                                    isDiscount: true,
                                  ),
                                _buildOrderSummaryRow(
                                  'Shipping', 
                                  '\$${_shippingCost.toStringAsFixed(2)}',
                                ),
                                _buildOrderSummaryRow(
                                  'Tax', 
                                  '\$${_tax.toStringAsFixed(2)}',
                                ),
                                const Divider(),
                                _buildOrderSummaryRow(
                                  'Total', 
                                  '\$${_total.toStringAsFixed(2)}',
                                  isTotal: true,
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Error message
                        if (_errorMessage != null)
                          Text(
                            _errorMessage!,
                            style: const TextStyle(
                              color: Colors.red,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        const SizedBox(height: 16),
                        // Checkout Button
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: _isLoading ? null : _processPayment,
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 16),
                            ),
                            child: _isLoading
                                ? const CircularProgressIndicator(color: Colors.white)
                                : const Text(
                                    'Place Order',
                                    style: TextStyle(
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
    );
  }

  Widget _buildDeliveryOption(
    DeliveryMethod method,
    String title,
    String description,
    String price,
  ) {
    bool isSelected = _selectedDeliveryMethod == method;
    return RadioListTile<DeliveryMethod>(
      title: Text(title),
      subtitle: Text(description),
      secondary: Text(price),
      value: method,
      groupValue: _selectedDeliveryMethod,
      onChanged: (DeliveryMethod? value) {
        setState(() {
          _selectedDeliveryMethod = value!;
        });
      },
      selected: isSelected,
      activeColor: Theme.of(context).primaryColor,
    );
  }

  Widget _buildPaymentOption(
    PaymentMethod method,
    String title,
    IconData icon,
  ) {
    bool isSelected = _selectedPaymentMethod == method;
    return RadioListTile<PaymentMethod>(
      title: Row(
        children: [
          Icon(icon),
          const SizedBox(width: 8),
          Text(title),
        ],
      ),
      value: method,
      groupValue: _selectedPaymentMethod,
      onChanged: (PaymentMethod? value) {
        setState(() {
          _selectedPaymentMethod = value!;
        });
      },
      selected: isSelected,
      activeColor: Theme.of(context).primaryColor,
    );
  }

  Widget _buildOrderSummaryRow(
    String label,
    String value, {
    bool isTotal = false,
    bool isDiscount = false,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
              fontSize: isTotal ? 16 : 14,
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontWeight: isTotal ? FontWeight.bold : FontWeight.normal,
              fontSize: isTotal ? 16 : 14,
              color: isDiscount ? Colors.red : null,
            ),
          ),
        ],
      ),
    );
  }
}

enum PaymentMethod { creditCard, paypal, applePay }
enum DeliveryMethod { standard, express, nextDay }

class CartItem {
  final int id;
  final String name;
  final double price;
  final int quantity;
  final String imageUrl;

  CartItem({
    required this.id,
    required this.name,
    required this.price,
    required this.quantity,
    required this.imageUrl,
  });
}