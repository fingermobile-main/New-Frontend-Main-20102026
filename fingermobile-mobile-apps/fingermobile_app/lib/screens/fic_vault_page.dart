import 'package:flutter/material.dart';

class FICVaultPage extends StatefulWidget {
  const FICVaultPage({super.key});

  @override
  State<FICVaultPage> createState() => _FICVaultPageState();
}

class _FICVaultPageState extends State<FICVaultPage> {
  bool _isLoading = false;
  String? _errorMessage;
  FICVaultData? _vaultData;
  List<FICAsset> _assets = [];
  List<FICCategory> _categories = [];
  String _selectedCategory = 'all';
  SortOption _sortOption = SortOption.value;
  bool _isLocked = true;

  @override
  void initState() {
    super.initState();
    _loadVaultData();
  }

  Future<void> _loadVaultData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock vault data
      setState(() {
        _vaultData = FICVaultData(
          totalBalance: 12540.75,
          availableBalance: 8920.50,
          lockedBalance: 3620.25,
          price: 0.85,
          change24h: 2.5,
        );

        _categories = [
          FICCategory(id: 'all', name: 'All Assets'),
          FICCategory(id: 'crypto', name: 'Cryptocurrencies'),
          FICCategory(id: 'stocks', name: 'Stocks'),
          FICCategory(id: 'bonds', name: 'Bonds'),
          FICCategory(id: 'commodities', name: 'Commodities'),
        ];

        _assets = [
          FICAsset(
            id: 1,
            name: 'Bitcoin',
            symbol: 'BTC',
            amount: 0.5,
            value: 12500.00,
            change24h: 3.2,
            type: AssetType.crypto,
            iconUrl: 'https://via.placeholder.com/40/FF9900/FFFFFF?text=BTC',
          ),
          FICAsset(
            id: 2,
            name: 'Ethereum',
            symbol: 'ETH',
            amount: 5.2,
            value: 1040.00,
            change24h: 1.8,
            type: AssetType.crypto,
            iconUrl: 'https://via.placeholder.com/40/627EEA/FFFFFF?text=ETH',
          ),
          FICAsset(
            id: 3,
            name: 'Apple Inc.',
            symbol: 'AAPL',
            amount: 10,
            value: 1750.00,
            change24h: 0.5,
            type: AssetType.stock,
            iconUrl: 'https://via.placeholder.com/40/000000/FFFFFF?text=AAPL',
          ),
          FICAsset(
            id: 4,
            name: 'Gold (XAU)',
            symbol: 'XAU',
            amount: 2.5,
            value: 4500.00,
            change24h: -0.3,
            type: AssetType.commodity,
            iconUrl: 'https://via.placeholder.com/40/FFD700/000000?text=XAU',
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load vault data. Please try again.';
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

  void _changeSort(SortOption option) {
    setState(() {
      _sortOption = option;
    });
  }

  Future<void> _unlockVault() async {
    // In a real app, this would involve biometric authentication or PIN entry
    setState(() {
      _isLocked = false;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Vault unlocked successfully!'),
        backgroundColor: Colors.green,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('FIC Vault'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.lock_open),
            onPressed: _unlockVault,
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadVaultData,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadVaultData,
        child: _isLoading && _vaultData == null
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _vaultData == null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadVaultData,
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
                          // Vault Balance Card
                          if (_vaultData != null && !_isLocked)
                            Card(
                              color: Theme.of(context).primaryColor,
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text(
                                      'Total Balance',
                                      style: TextStyle(
                                        color: Colors.white70,
                                        fontSize: 16,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      '\$${_vaultData!.totalBalance.toStringAsFixed(2)}',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 32,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Row(
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 8,
                                            vertical: 4,
                                          ),
                                          decoration: BoxDecoration(
                                            color: _vaultData!.change24h >= 0
                                                ? Colors.green
                                                : Colors.red,
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: Row(
                                            children: [
                                              Icon(
                                                _vaultData!.change24h >= 0
                                                    ? Icons.trending_up
                                                    : Icons.trending_down,
                                                size: 16,
                                                color: Colors.white,
                                              ),
                                              const SizedBox(width: 4),
                                              Text(
                                                '${_vaultData!.change24h >= 0 ? '+' : ''}${_vaultData!.change24h.toStringAsFixed(2)}%',
                                                style: const TextStyle(
                                                  color: Colors.white,
                                                  fontSize: 12,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        const SizedBox(width: 16),
                                        Text(
                                          'FIC \$${_vaultData!.price.toStringAsFixed(4)}',
                                          style: const TextStyle(
                                            color: Colors.white70,
                                          ),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 16),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        _buildBalanceItem(
                                          'Available',
                                          '\$${_vaultData!.availableBalance.toStringAsFixed(2)}',
                                          Colors.white70,
                                        ),
                                        _buildBalanceItem(
                                          'Locked',
                                          '\$${_vaultData!.lockedBalance.toStringAsFixed(2)}',
                                          Colors.white70,
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          if (_isLocked)
                            Card(
                              child: Padding(
                                padding: const EdgeInsets.all(32.0),
                                child: Column(
                                  children: [
                                    Icon(
                                      Icons.lock,
                                      size: 64,
                                      color: Colors.grey.shade400,
                                    ),
                                    const SizedBox(height: 16),
                                    const Text(
                                      'Vault Locked',
                                      style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    const Text(
                                      'Unlock your vault to view assets',
                                      style: TextStyle(
                                        color: Colors.grey,
                                      ),
                                    ),
                                    const SizedBox(height: 24),
                                    ElevatedButton(
                                      onPressed: _unlockVault,
                                      child: const Text('Unlock Vault'),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          const SizedBox(height: 24),
                          // Categories
                          const Text(
                            'Asset Categories',
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
                          const SizedBox(height: 24),
                          // Sort Options
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Assets',
                                style: TextStyle(
                                  fontSize: 20,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              PopupMenuButton<SortOption>(
                                icon: const Icon(Icons.sort),
                                onSelected: _changeSort,
                                itemBuilder: (BuildContext context) {
                                  return [
                                    const PopupMenuItem(
                                      value: SortOption.value,
                                      child: Text('Sort by Value'),
                                    ),
                                    const PopupMenuItem(
                                      value: SortOption.name,
                                      child: Text('Sort by Name'),
                                    ),
                                    const PopupMenuItem(
                                      value: SortOption.change,
                                      child: Text('Sort by Change'),
                                    ),
                                  ];
                                },
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          // Assets List
                          if (!_isLocked)
                            ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _assets.length,
                              itemBuilder: (context, index) {
                                var asset = _assets[index];
                                return Card(
                                  margin: const EdgeInsets.only(bottom: 12),
                                  child: Padding(
                                    padding: const EdgeInsets.all(16.0),
                                    child: Row(
                                      children: [
                                        Container(
                                          width: 40,
                                          height: 40,
                                          decoration: BoxDecoration(
                                            image: DecorationImage(
                                              image: NetworkImage(asset.iconUrl),
                                            ),
                                            shape: BoxShape.circle,
                                          ),
                                        ),
                                        const SizedBox(width: 16),
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                asset.name,
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              Text(
                                                asset.symbol,
                                                style: const TextStyle(
                                                  color: Colors.grey,
                                                  fontSize: 12,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.end,
                                          children: [
                                            Text(
                                              '\$${asset.value.toStringAsFixed(2)}',
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                            Text(
                                              '${asset.amount.toStringAsFixed(asset.type == AssetType.crypto ? 4 : 2)} ${asset.symbol}',
                                              style: const TextStyle(
                                                color: Colors.grey,
                                                fontSize: 12,
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(width: 16),
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 8,
                                            vertical: 4,
                                          ),
                                          decoration: BoxDecoration(
                                            color: asset.change24h >= 0
                                                ? Colors.green.shade100
                                                : Colors.red.shade100,
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: Row(
                                            children: [
                                              Icon(
                                                asset.change24h >= 0
                                                    ? Icons.trending_up
                                                    : Icons.trending_down,
                                                size: 16,
                                                color: asset.change24h >= 0
                                                    ? Colors.green
                                                    : Colors.red,
                                              ),
                                              const SizedBox(width: 4),
                                              Text(
                                                '${asset.change24h >= 0 ? '+' : ''}${asset.change24h.toStringAsFixed(2)}%',
                                                style: TextStyle(
                                                  color: asset.change24h >= 0
                                                      ? Colors.green
                                                      : Colors.red,
                                                  fontSize: 12,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                          const SizedBox(height: 32),
                          // Action Buttons
                          if (!_isLocked)
                            Row(
                              children: [
                                Expanded(
                                  child: ElevatedButton(
                                    onPressed: () {
                                      // Buy assets
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.green,
                                    ),
                                    child: const Text('Buy'),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: ElevatedButton(
                                    onPressed: () {
                                      // Sell assets
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.red,
                                    ),
                                    child: const Text('Sell'),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: ElevatedButton(
                                    onPressed: () {
                                      // Transfer assets
                                    },
                                    child: const Text('Transfer'),
                                  ),
                                ),
                              ],
                            ),
                        ],
                      ),
                    ),
                  ),
      ),
    );
  }

  Widget _buildBalanceItem(String label, String value, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            color: color,
            fontSize: 14,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            color: color,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}

enum SortOption { value, name, change }
enum AssetType { crypto, stock, bond, commodity }

class FICVaultData {
  final double totalBalance;
  final double availableBalance;
  final double lockedBalance;
  final double price;
  final double change24h;

  FICVaultData({
    required this.totalBalance,
    required this.availableBalance,
    required this.lockedBalance,
    required this.price,
    required this.change24h,
  });
}

class FICCategory {
  final String id;
  final String name;

  FICCategory({
    required this.id,
    required this.name,
  });
}

class FICAsset {
  final int id;
  final String name;
  final String symbol;
  final double amount;
  final double value;
  final double change24h;
  final AssetType type;
  final String iconUrl;

  FICAsset({
    required this.id,
    required this.name,
    required this.symbol,
    required this.amount,
    required this.value,
    required this.change24h,
    required this.type,
    required this.iconUrl,
  });
}