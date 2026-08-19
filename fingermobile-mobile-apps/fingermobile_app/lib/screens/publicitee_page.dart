import 'package:flutter/material.dart';

class PubliciteePage extends StatefulWidget {
  const PubliciteePage({super.key});

  @override
  State<PubliciteePage> createState() => _PubliciteePageState();
}

class _PubliciteePageState extends State<PubliciteePage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<Advertisement> _advertisements = [];
  List<AdCategory> _categories = [];
  String _selectedCategory = 'all';
  AdSortOption _sortOption = AdSortOption.newest;

  @override
  void initState() {
    super.initState();
    _loadAdvertisements();
  }

  Future<void> _loadAdvertisements() async {
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
          AdCategory(id: 'all', name: 'All Ads'),
          AdCategory(id: 'technology', name: 'Technology'),
          AdCategory(id: 'fashion', name: 'Fashion'),
          AdCategory(id: 'food', name: 'Food & Beverage'),
          AdCategory(id: 'travel', name: 'Travel'),
          AdCategory(id: 'health', name: 'Health & Wellness'),
        ];

        // Mock advertisements
        _advertisements = [
          Advertisement(
            id: 1,
            title: 'New Smartphone Launch',
            description: 'Experience the future with our latest smartphone featuring cutting-edge technology',
            imageUrl: 'https://via.placeholder.com/400x200/4ECDC4/FFFFFF?text=Smartphone',
            category: 'technology',
            advertiser: 'TechCorp',
            advertiserLogo: 'https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=TC',
            cost: 500.00,
            currency: 'USD',
            clicks: 1250,
            impressions: 15000,
            ctr: 8.33,
            startDate: DateTime.now().subtract(const Duration(days: 10)),
            endDate: DateTime.now().add(const Duration(days: 20)),
            isActive: true,
            isFeatured: true,
            tags: ['smartphone', 'technology', 'mobile'],
          ),
          Advertisement(
            id: 2,
            title: 'Summer Fashion Sale',
            description: 'Up to 70% off on summer collection. Limited time offer!',
            imageUrl: 'https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=Fashion',
            category: 'fashion',
            advertiser: 'StyleHub',
            advertiserLogo: 'https://via.placeholder.com/50x50/FF6B6B/FFFFFF?text=SH',
            cost: 300.00,
            currency: 'USD',
            clicks: 890,
            impressions: 12000,
            ctr: 7.42,
            startDate: DateTime.now().subtract(const Duration(days: 5)),
            endDate: DateTime.now().add(const Duration(days: 15)),
            isActive: true,
            isFeatured: false,
            tags: ['fashion', 'sale', 'summer'],
          ),
          Advertisement(
            id: 3,
            title: 'Gourmet Restaurant Experience',
            description: 'Indulge in exquisite culinary delights prepared by award-winning chefs',
            imageUrl: 'https://via.placeholder.com/400x200/45B7D1/FFFFFF?text=Restaurant',
            category: 'food',
            advertiser: 'Gourmet Palace',
            advertiserLogo: 'https://via.placeholder.com/50x50/45B7D1/FFFFFF?text=GP',
            cost: 250.00,
            currency: 'USD',
            clicks: 650,
            impressions: 8500,
            ctr: 7.65,
            startDate: DateTime.now().subtract(const Duration(days: 2)),
            endDate: DateTime.now().add(const Duration(days: 28)),
            isActive: true,
            isFeatured: true,
            tags: ['restaurant', 'gourmet', 'fine dining'],
          ),
          Advertisement(
            id: 4,
            title: 'Tropical Vacation Packages',
            description: 'Escape to paradise with our exclusive tropical vacation deals',
            imageUrl: 'https://via.placeholder.com/400x200/96CEB4/FFFFFF?text=Vacation',
            category: 'travel',
            advertiser: 'TravelEase',
            advertiserLogo: 'https://via.placeholder.com/50x50/96CEB4/FFFFFF?text=TE',
            cost: 750.00,
            currency: 'USD',
            clicks: 2100,
            impressions: 25000,
            ctr: 8.40,
            startDate: DateTime.now().subtract(const Duration(days: 15)),
            endDate: DateTime.now().add(const Duration(days: 5)),
            isActive: true,
            isFeatured: false,
            tags: ['vacation', 'travel', 'tropical'],
          ),
          Advertisement(
            id: 5,
            title: 'Fitness & Wellness Program',
            description: 'Transform your health with our comprehensive fitness and wellness program',
            imageUrl: 'https://via.placeholder.com/400x200/FFEAA7/000000?text=Fitness',
            category: 'health',
            advertiser: 'WellnessPro',
            advertiserLogo: 'https://via.placeholder.com/50x50/FFEAA7/000000?text=WP',
            cost: 400.00,
            currency: 'USD',
            clicks: 980,
            impressions: 11000,
            ctr: 8.91,
            startDate: DateTime.now().subtract(const Duration(days: 7)),
            endDate: DateTime.now().add(const Duration(days: 23)),
            isActive: true,
            isFeatured: true,
            tags: ['fitness', 'wellness', 'health'],
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load advertisements. Please try again.';
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

  void _changeSort(AdSortOption option) {
    setState(() {
      _sortOption = option;
    });
  }

  void _createAd() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Create advertisement functionality would open here'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _editAd(Advertisement ad) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Editing ${ad.title}'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _deleteAd(Advertisement ad) {
    setState(() {
      _advertisements.removeWhere((a) => a.id == ad.id);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Deleted ${ad.title}'),
        backgroundColor: Colors.red,
      ),
    );
  }

  void _toggleAdStatus(Advertisement ad) {
    setState(() {
      var index = _advertisements.indexWhere((a) => a.id == ad.id);
      if (index != -1) {
        _advertisements[index] = Advertisement(
          id: ad.id,
          title: ad.title,
          description: ad.description,
          imageUrl: ad.imageUrl,
          category: ad.category,
          advertiser: ad.advertiser,
          advertiserLogo: ad.advertiserLogo,
          cost: ad.cost,
          currency: ad.currency,
          clicks: ad.clicks,
          impressions: ad.impressions,
          ctr: ad.ctr,
          startDate: ad.startDate,
          endDate: ad.endDate,
          isActive: !ad.isActive,
          isFeatured: ad.isFeatured,
          tags: ad.tags,
        );
      }
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${ad.isActive ? 'Paused' : 'Activated'} ${ad.title}'),
        backgroundColor: ad.isActive ? Colors.orange : Colors.green,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Publicitee Ads'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadAdvertisements,
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              // Show filter options
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadAdvertisements,
        child: _isLoading && _advertisements.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _advertisements.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadAdvertisements,
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
                        // Stats Summary
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                _buildStatItem('Total Ads', '${_advertisements.length}'),
                                _buildStatItem(
                                    'Active', '${_advertisements.where((ad) => ad.isActive).length}'),
                                _buildStatItem('Clicks', '${_advertisements.fold(0, (sum, ad) => sum + ad.clicks)}'),
                                _buildStatItem(
                                    'Impressions', '${_advertisements.fold(0, (sum, ad) => sum + ad.impressions)}'),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
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
                              '${_advertisements.length} advertisements',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            PopupMenuButton<AdSortOption>(
                              icon: const Icon(Icons.sort),
                              onSelected: _changeSort,
                              itemBuilder: (BuildContext context) {
                                return [
                                  const PopupMenuItem(
                                    value: AdSortOption.newest,
                                    child: Text('Newest First'),
                                  ),
                                  const PopupMenuItem(
                                    value: AdSortOption.oldest,
                                    child: Text('Oldest First'),
                                  ),
                                  const PopupMenuItem(
                                    value: AdSortOption.costHigh,
                                    child: Text('Cost (High to Low)'),
                                  ),
                                  const PopupMenuItem(
                                    value: AdSortOption.costLow,
                                    child: Text('Cost (Low to High)'),
                                  ),
                                  const PopupMenuItem(
                                    value: AdSortOption.clicks,
                                    child: Text('Clicks'),
                                  ),
                                  const PopupMenuItem(
                                    value: AdSortOption.ctr,
                                    child: Text('CTR'),
                                  ),
                                ];
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // Advertisements List
                        Expanded(
                          child: ListView.builder(
                            itemCount: _advertisements.length,
                            itemBuilder: (context, index) {
                              var ad = _advertisements[index];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Stack(
                                      children: [
                                        Container(
                                          height: 150,
                                          decoration: BoxDecoration(
                                            image: DecorationImage(
                                              image: NetworkImage(ad.imageUrl),
                                              fit: BoxFit.cover,
                                            ),
                                          ),
                                        ),
                                        if (ad.isFeatured)
                                          Positioned(
                                            top: 8,
                                            left: 8,
                                            child: Container(
                                              padding: const EdgeInsets.symmetric(
                                                  horizontal: 8, vertical: 4),
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
                                        Positioned(
                                          top: 8,
                                          right: 8,
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(
                                                horizontal: 8, vertical: 4),
                                            decoration: BoxDecoration(
                                              color: ad.isActive ? Colors.green : Colors.red,
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: Text(
                                              ad.isActive ? 'Active' : 'Paused',
                                              style: const TextStyle(
                                                color: Colors.white,
                                                fontSize: 12,
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.all(16.0),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            children: [
                                              CircleAvatar(
                                                radius: 15,
                                                backgroundImage: NetworkImage(ad.advertiserLogo),
                                              ),
                                              const SizedBox(width: 8),
                                              Text(
                                                ad.advertiser,
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              const Spacer(),
                                              Text(
                                                '${ad.currency} ${ad.cost.toStringAsFixed(2)}',
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.blue,
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            ad.title,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 18,
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            ad.description,
                                            style: const TextStyle(
                                              color: Colors.grey,
                                            ),
                                          ),
                                          const SizedBox(height: 16),
                                          // Metrics
                                          Row(
                                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                                            children: [
                                              Column(
                                                children: [
                                                  const Text(
                                                    'Clicks',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: Colors.grey,
                                                    ),
                                                  ),
                                                  Text(
                                                    '${ad.clicks}',
                                                    style: const TextStyle(
                                                      fontWeight: FontWeight.bold,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                              Column(
                                                children: [
                                                  const Text(
                                                    'Impressions',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: Colors.grey,
                                                    ),
                                                  ),
                                                  Text(
                                                    '${ad.impressions}',
                                                    style: const TextStyle(
                                                      fontWeight: FontWeight.bold,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                              Column(
                                                children: [
                                                  const Text(
                                                    'CTR',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: Colors.grey,
                                                    ),
                                                  ),
                                                  Text(
                                                    '${ad.ctr.toStringAsFixed(2)}%',
                                                    style: const TextStyle(
                                                      fontWeight: FontWeight.bold,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 16),
                                          // Date Range
                                          Row(
                                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                            children: [
                                              Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  const Text(
                                                    'Start Date',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: Colors.grey,
                                                    ),
                                                  ),
                                                  Text(_formatDate(ad.startDate)),
                                                ],
                                              ),
                                              Column(
                                                crossAxisAlignment: CrossAxisAlignment.end,
                                                children: [
                                                  const Text(
                                                    'End Date',
                                                    style: TextStyle(
                                                      fontSize: 12,
                                                      color: Colors.grey,
                                                    ),
                                                  ),
                                                  Text(_formatDate(ad.endDate)),
                                                ],
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 16),
                                          // Actions
                                          Row(
                                            mainAxisAlignment: MainAxisAlignment.end,
                                            children: [
                                              TextButton.icon(
                                                onPressed: () => _toggleAdStatus(ad),
                                                icon: Icon(
                                                  ad.isActive ? Icons.pause : Icons.play_arrow,
                                                  size: 18,
                                                ),
                                                label: Text(ad.isActive ? 'Pause' : 'Activate'),
                                              ),
                                              const SizedBox(width: 8),
                                              TextButton.icon(
                                                onPressed: () => _editAd(ad),
                                                icon: const Icon(Icons.edit, size: 18),
                                                label: const Text('Edit'),
                                              ),
                                              const SizedBox(width: 8),
                                              PopupMenuButton<String>(
                                                icon: const Icon(Icons.more_vert),
                                                onSelected: (value) {
                                                  if (value == 'delete') {
                                                    _deleteAd(ad);
                                                  }
                                                },
                                                itemBuilder: (BuildContext context) {
                                                  return [
                                                    const PopupMenuItem(
                                                      value: 'delete',
                                                      child: Text('Delete'),
                                                    ),
                                                  ];
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
                        ),
                      ],
                    ),
                  ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Theme.of(context).primaryColor,
        child: const Icon(Icons.add),
        onPressed: _createAd,
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

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}

enum AdSortOption { newest, oldest, costHigh, costLow, clicks, ctr }

class AdCategory {
  final String id;
  final String name;

  AdCategory({
    required this.id,
    required this.name,
  });
}

class Advertisement {
  final int id;
  final String title;
  final String description;
  final String imageUrl;
  final String category;
  final String advertiser;
  final String advertiserLogo;
  final double cost;
  final String currency;
  final int clicks;
  final int impressions;
  final double ctr; // Click-through rate
  final DateTime startDate;
  final DateTime endDate;
  final bool isActive;
  final bool isFeatured;
  final List<String> tags;

  Advertisement({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.category,
    required this.advertiser,
    required this.advertiserLogo,
    required this.cost,
    required this.currency,
    required this.clicks,
    required this.impressions,
    required this.ctr,
    required this.startDate,
    required this.endDate,
    required this.isActive,
    required this.isFeatured,
    required this.tags,
  });
}