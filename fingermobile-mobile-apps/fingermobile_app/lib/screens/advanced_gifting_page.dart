import 'package:flutter/material.dart';
import 'package:fingermobile_app/services/api_service.dart';
import 'package:fingermobile_app/models/gift.dart';

class AdvancedGiftingPage extends StatefulWidget {
  const AdvancedGiftingPage({super.key});

  @override
  State<AdvancedGiftingPage> createState() => _AdvancedGiftingPageState();
}

class _AdvancedGiftingPageState extends State<AdvancedGiftingPage> {
  final ApiService _ApiService = ApiService();
  List<GiftCard> _giftCards = [];
  List<GiftCard> _purchasedGiftCards = [];
  bool _isLoading = true;
  String? _errorMessage;
  String _selectedAmount = '50';
  String _recipientEmail = '';
  String _message = '';

  @override
  void initState() {
    super.initState();
    _loadGiftCards();
    _loadPurchasedGiftCards();
  }

  Future<void> _loadGiftCards() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await _ApiService.get('/api/gift-cards');
      if (response.isSuccess) {
        setState(() {
          _giftCards = (response.data as List)
              .map((item) => GiftCard.fromJson(item as Map<String, dynamic>))
              .toList();
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = response.errorMessage;
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load gift cards: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _loadPurchasedGiftCards() async {
    try {
      final response = await _ApiService.get('/api/member/gift-cards');
      if (response.isSuccess) {
        setState(() {
          _purchasedGiftCards = (response.data as List)
              .map((item) => GiftCard.fromJson(item as Map<String, dynamic>))
              .toList();
        });
      }
    } catch (e) {
      // Handle error silently as this is secondary data
      print('Failed to load purchased gift cards: $e');
    }
  }

  Future<void> _purchaseGiftCard() async {
    if (_recipientEmail.isEmpty) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please enter recipient email'),
            backgroundColor: Colors.red,
          ),
        );
      }
      return;
    }

    setState(() {
      _isProcessing = true;
      _errorMessage = null;
    });

    try {
      final response = await _ApiService.post('/api/gift-cards/purchase', {
        'amount': double.tryParse(_selectedAmount) ?? 0,
        'recipientEmail': _recipientEmail,
        'message': _message,
      });

      if (response.isSuccess) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Gift card purchased successfully!'),
              backgroundColor: Colors.green,
            ),
          );
        }
        // Refresh the lists
        await _loadGiftCards();
        await _loadPurchasedGiftCards();
        
        // Reset form
        setState(() {
          _recipientEmail = '';
          _message = '';
          _isProcessing = false;
        });
      } else {
        setState(() {
          _errorMessage = response.errorMessage;
          _isProcessing = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to purchase gift card: $e';
        _isProcessing = false;
      });
    }
  }

  Future<void> _sendGiftCard(GiftCard giftCard) async {
    showDialog(
      context: context,
      builder: (BuildContext dialogContext) {
        String recipientEmail = '';
        String message = '';

        return AlertDialog(
          title: const Text('Send Gift Card'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Recipient Email',
                  hintText: 'Enter recipient email',
                ),
                onChanged: (value) {
                  recipientEmail = value;
                },
              ),
              const SizedBox(height: 16),
              TextField(
                decoration: const InputDecoration(
                  labelText: 'Message (optional)',
                  hintText: 'Add a personal message',
                ),
                maxLines: 3,
                onChanged: (value) {
                  message = value;
                },
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () async {
                if (recipientEmail.isNotEmpty) {
                  try {
                    final response = await _ApiService.post('/api/gift-cards/send', {
                      'giftCardId': giftCard.id,
                      'recipientEmail': recipientEmail,
                      'message': message,
                    });

                    if (response.isSuccess) {
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Gift card sent successfully!'),
                            backgroundColor: Colors.green,
                          ),
                        );
                      }
                      Navigator.of(dialogContext).pop();
                      // Refresh purchased gift cards
                      await _loadPurchasedGiftCards();
                    } else {
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Failed to send gift card: ${response.errorMessage}'),
                            backgroundColor: Colors.red,
                          ),
                        );
                      }
                    }
                  } catch (e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Error sending gift card: $e'),
                          backgroundColor: Colors.red,
                        ),
                      );
                    }
                  }
                }
              },
              child: const Text('Send'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Advanced Gifting'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: _errorMessage != null
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(_errorMessage!),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _errorMessage = null;
                      });
                      _loadGiftCards();
                      _loadPurchasedGiftCards();
                    },
                    child: const Text('Retry'),
                  ),
                ],
              ),
            )
          : _isLoading
              ? const Center(child: CircularProgressIndicator())
              : RefreshIndicator(
                  onRefresh: () async {
                    await _loadGiftCards();
                    await _loadPurchasedGiftCards();
                  },
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Gift Card Purchase Section
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'Purchase Gift Card',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 16),
                                
                                // Amount Selection
                                const Text('Select Amount'),
                                Wrap(
                                  spacing: 8,
                                  children: const [
                                    '10', '25', '50', '100', '250', '500', '1000'
                                  ].map((amount) {
                                    return ChoiceChip(
                                      label: Text('\$$amount'),
                                      selected: _selectedAmount == amount,
                                      onSelected: (selected) {
                                        if (selected) {
                                          setState(() {
                                            _selectedAmount = amount;
                                          });
                                        }
                                      },
                                    );
                                  }).toList(),
                                ),
                                const SizedBox(height: 16),
                                
                                // Recipient Email
                                TextField(
                                  decoration: const InputDecoration(
                                    labelText: 'Recipient Email',
                                    hintText: 'Enter recipient email',
                                    prefixIcon: Icon(Icons.email),
                                  ),
                                  keyboardType: TextInputType.emailAddress,
                                  onChanged: (value) {
                                    setState(() {
                                      _recipientEmail = value;
                                    });
                                  },
                                ),
                                const SizedBox(height: 16),
                                
                                // Personal Message
                                TextField(
                                  decoration: const InputDecoration(
                                    labelText: 'Personal Message (Optional)',
                                    hintText: 'Add a personal message',
                                    prefixIcon: Icon(Icons.message),
                                  ),
                                  maxLines: 3,
                                  onChanged: (value) {
                                    setState(() {
                                      _message = value;
                                    });
                                  },
                                ),
                                const SizedBox(height: 16),
                                
                                // Purchase Button
                                SizedBox(
                                  width: double.infinity,
                                  child: ElevatedButton(
                                    onPressed: _isProcessing ? null : _purchaseGiftCard,
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.green,
                                      foregroundColor: Colors.white,
                                    ),
                                    child: _isProcessing
                                        ? const Row(
                                            mainAxisAlignment: MainAxisAlignment.center,
                                            children: [
                                              SizedBox(
                                                width: 20,
                                                height: 20,
                                                child: CircularProgressIndicator(
                                                  strokeWidth: 2,
                                                  valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                                ),
                                              ),
                                              SizedBox(width: 12),
                                              Text('Processing...'),
                                            ],
                                          )
                                        : Text('Purchase \$$_selectedAmount Gift Card'),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        
                        const SizedBox(height: 16),
                        
                        // Available Gift Cards
                        const Text(
                          'Available Gift Cards',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        if (_giftCards.isEmpty)
                          const Center(child: Text('No gift cards available'))
                        else
                          GridView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              crossAxisSpacing: 16,
                              mainAxisSpacing: 16,
                              childAspectRatio: 0.75,
                            ),
                            itemCount: _giftCards.length,
                            itemBuilder: (context, index) {
                              final giftCard = _giftCards[index];
                              return Card(
                                child: Padding(
                                  padding: const EdgeInsets.all(12.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.center,
                                    children: [
                                      Container(
                                        width: 80,
                                        height: 80,
                                        decoration: BoxDecoration(
                                          color: Colors.blue[100],
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                        child: const Icon(
                                          Icons.card_giftcard,
                                          size: 40,
                                          color: Colors.blue,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        '\$${giftCard.amount}',
                                        style: const TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        giftCard.name,
                                        style: const TextStyle(
                                          fontSize: 12,
                                          color: Colors.grey,
                                        ),
                                        textAlign: TextAlign.center,
                                      ),
                                      const Spacer(),
                                      ElevatedButton(
                                        onPressed: () => _sendGiftCard(giftCard),
                                        child: const Text('Send'),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        
                        const SizedBox(height: 24),
                        
                        // Purchased/Owned Gift Cards
                        const Text(
                          'Your Gift Cards',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 8),
                        if (_purchasedGiftCards.isEmpty)
                          const Center(child: Text('You have no gift cards'))
                        else
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _purchasedGiftCards.length,
                            itemBuilder: (context, index) {
                              final giftCard = _purchasedGiftCards[index];
                              return Card(
                                child: ListTile(
                                  leading: Container(
                                    width: 40,
                                    height: 40,
                                    decoration: BoxDecoration(
                                      color: Colors.purple[100],
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: const Icon(
                                      Icons.card_giftcard,
                                      color: Colors.purple,
                                    ),
                                  ),
                                  title: Text('\$${giftCard.amount} - ${giftCard.name}'),
                                  subtitle: Text(
                                    'Code: ${giftCard.code}\nBalance: \$${giftCard.balance}',
                                    style: const TextStyle(fontSize: 12),
                                  ),
                                  trailing: giftCard.isRedeemed
                                      ? const Icon(Icons.check_circle, color: Colors.green)
                                      : const Icon(Icons.pending, color: Colors.orange),
                                  onTap: () => _sendGiftCard(giftCard),
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