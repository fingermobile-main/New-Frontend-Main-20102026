import 'package:flutter/material.dart';

class GemsPage extends StatefulWidget {
  const GemsPage({super.key});

  @override
  State<GemsPage> createState() => _GemsPageState();
}

class _GemsPageState extends State<GemsPage> {
  bool _isLoading = false;
  String? _errorMessage;
  GemsCollection? _featuredCollection;
  List<Gemstone> _gemstones = [];
  List<GemCategory> _categories = [];
  String _selectedCategory = 'all';
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadGemsData();
  }

  Future<void> _loadGemsData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock gems data
      setState(() {
        _featuredCollection = GemsCollection(
          id: 1,
          name: 'Royal Ruby Collection',
          description: 'Exquisite ruby gemstones from the finest mines',
          imageUrl: 'https://via.placeholder.com/600x300/FF0000/FFFFFF?text=Royal+Ruby',
          gemCount: 12,
          value: 25000,
        );

        _categories = [
          GemCategory(id: 'all', name: 'All Gems'),
          GemCategory(id: 'ruby', name: 'Rubies'),
          GemCategory(id: 'sapphire', name: 'Sapphires'),
          GemCategory(id: 'emerald', name: 'Emeralds'),
          GemCategory(id: 'diamond', name: 'Diamonds'),
          GemCategory(id: 'opal', name: 'Opals'),
        ];

        _gemstones = [
          Gemstone(
            id: 1,
            name: 'Star of India',
            type: 'Ruby',
            description: 'Exceptional pigeon blood ruby with excellent clarity',
            carats: 5.2,
            value: 12500,
            imageUrl: 'https://via.placeholder.com/300x200/FF0000/FFFFFF?text=Ruby',
            category: 'ruby',
            rarity: Rarity.legendary,
          ),
          Gemstone(
            id: 2,
            name: 'Blue Belle',
            type: 'Sapphire',
            description: 'Vivid blue sapphire with exceptional brilliance',
            carats: 3.8,
            value: 8900,
            imageUrl: 'https://via.placeholder.com/300x200/0000FF/FFFFFF?text=Sapphire',
            category: 'sapphire',
            rarity: Rarity.rare,
          ),
          Gemstone(
            id: 3,
            name: 'Forest Spirit',
            type: 'Emerald',
            description: 'Deep green emerald with outstanding transparency',
            carats: 4.5,
            value: 11200,
            imageUrl: 'https://via.placeholder.com/300x200/00FF00/000000?text=Emerald',
            category: 'emerald',
            rarity: Rarity.epic,
          ),
          Gemstone(
            id: 4,
            name: 'Eternal Flame',
            type: 'Diamond',
            description: 'Flawless round brilliant cut diamond',
            carats: 2.1,
            value: 15600,
            imageUrl: 'https://via.placeholder.com/300x200/FFFF00/000000?text=Diamond',
            category: 'diamond',
            rarity: Rarity.legendary,
          ),
          Gemstone(
            id: 5,
            name: 'Rainbow Dream',
            type: 'Opal',
            description: 'Play-of-color opal with vibrant flashes',
            carats: 6.7,
            value: 6800,
            imageUrl: 'https://via.placeholder.com/300x200/FF69B4/FFFFFF?text=Opal',
            category: 'opal',
            rarity: Rarity.rare,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load gems. Please try again.';
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
        title: const Text('Gems'),
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
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              // Open filters
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadGemsData,
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
                          onPressed: _loadGemsData,
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
                                    'Precious Gems',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 28,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    'Discover rare and valuable gemstones',
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
                                    child: const Text('View Collections'),
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
                                        _buildCollectionInfo(
                                          Icons.diamond,
                                          '${_featuredCollection!.gemCount} gems',
                                        ),
                                        _buildCollectionInfo(
                                          Icons.attach_money,
                                          '\$${_formatNumber(_featuredCollection!.value)}',
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 16),
                                    SizedBox(
                                      width: double.infinity,
                                      child: ElevatedButton(
                                        onPressed: () {
                                          // View collection
                                        },
                                        child: const Text('Explore Collection'),
                                      ),
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
                          // Gemstones
                          const Text(
                            'Gemstones',
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
                            itemCount: _gemstones.length,
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemBuilder: (context, index) {
                              var gem = _gemstones[index];
                              return Card(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Container(
                                      height: 120,
                                      decoration: BoxDecoration(
                                        image: DecorationImage(
                                          image: NetworkImage(gem.imageUrl),
                                          fit: BoxFit.cover,
                                        ),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.all(8.0),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Row(
                                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text(
                                                gem.name,
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                ),
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                              Container(
                                                padding: const EdgeInsets.symmetric(
                                                  horizontal: 6,
                                                  vertical: 2,
                                                ),
                                                decoration: BoxDecoration(
                                                  color: _getRarityColor(gem.rarity),
                                                  borderRadius: BorderRadius.circular(8),
                                                ),
                                                child: Text(
                                                  _getRarityText(gem.rarity),
                                                  style: const TextStyle(
                                                    color: Colors.white,
                                                    fontSize: 10,
                                                    fontWeight: FontWeight.bold,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            gem.type,
                                            style: const TextStyle(
                                              color: Colors.grey,
                                              fontSize: 12,
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          Row(
                                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                            children: [
                                              _buildGemInfo(
                                                Icons.scale,
                                                '${gem.carats} ct',
                                              ),
                                              _buildGemInfo(
                                                Icons.attach_money,
                                                '\$${_formatNumber(gem.value)}',
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 8),
                                          SizedBox(
                                            width: double.infinity,
                                            child: OutlinedButton(
                                              onPressed: () {
                                                // View details
                                              },
                                              child: const Text('Details'),
                                            ),
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

  Widget _buildCollectionInfo(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey),
        const SizedBox(width: 4),
        Text(
          text,
          style: const TextStyle(
            color: Colors.grey,
          ),
        ),
      ],
    );
  }

  Widget _buildGemInfo(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 14, color: Colors.grey),
        const SizedBox(width: 4),
        Text(
          text,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }

  Color _getRarityColor(Rarity rarity) {
    switch (rarity) {
      case Rarity.common:
        return Colors.grey;
      case Rarity.uncommon:
        return Colors.green;
      case Rarity.rare:
        return Colors.blue;
      case Rarity.epic:
        return Colors.purple;
      case Rarity.legendary:
        return Colors.orange;
    }
  }

  String _getRarityText(Rarity rarity) {
    switch (rarity) {
      case Rarity.common:
        return 'COMMON';
      case Rarity.uncommon:
        return 'UNCOMMON';
      case Rarity.rare:
        return 'RARE';
      case Rarity.epic:
        return 'EPIC';
      case Rarity.legendary:
        return 'LEGENDARY';
    }
  }

  String _formatNumber(int number) {
    if (number >= 1000000) {
      return '${(number / 1000000).toStringAsFixed(1)}M';
    } else if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(1)}K';
    } else {
      return number.toString();
    }
  }
}

enum Rarity { common, uncommon, rare, epic, legendary }

class GemsCollection {
  final int id;
  final String name;
  final String description;
  final String imageUrl;
  final int gemCount;
  final int value;

  GemsCollection({
    required this.id,
    required this.name,
    required this.description,
    required this.imageUrl,
    required this.gemCount,
    required this.value,
  });
}

class GemCategory {
  final String id;
  final String name;

  GemCategory({
    required this.id,
    required this.name,
  });
}

class Gemstone {
  final int id;
  final String name;
  final String type;
  final String description;
  final double carats;
  final int value;
  final String imageUrl;
  final String category;
  final Rarity rarity;

  Gemstone({
    required this.id,
    required this.name,
    required this.type,
    required this.description,
    required this.carats,
    required this.value,
    required this.imageUrl,
    required this.category,
    required this.rarity,
  });
}