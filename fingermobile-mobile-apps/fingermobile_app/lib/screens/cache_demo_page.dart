import 'package:flutter/material.dart';
import 'dart:async';

class CacheDemoPage extends StatefulWidget {
  const CacheDemoPage({super.key});

  @override
  State<CacheDemoPage> createState() => _CacheDemoPageState();
}

class _CacheDemoPageState extends State<CacheDemoPage> {
  bool _isLoading = false;
  String? _errorMessage;
  Map<String, dynamic> _cachedData = {};
  int _cacheHits = 0;
  int _cacheMisses = 0;
  int _totalRequests = 0;
  List<CacheEntry> _cacheEntries = [];
  int _cacheSize = 0;
  int _maxCacheSize = 100;

  @override
  void initState() {
    super.initState();
    _initializeCacheDemo();
  }

  Future<void> _initializeCacheDemo() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate cache initialization
      await Future.delayed(const Duration(seconds: 1));
      
      // Initialize with some sample data
      setState(() {
        _cachedData = {
          'member_profile_1': {'name': 'John Doe', 'email': 'john@example.com'},
          'member_profile_2': {'name': 'Jane Smith', 'email': 'jane@example.com'},
          'settings': {'theme': 'dark', 'notifications': true},
        };
        
        _cacheEntries = [
          CacheEntry(key: 'member_profile_1', size: 10, timestamp: DateTime.now()),
          CacheEntry(key: 'member_profile_2', size: 10, timestamp: DateTime.now().subtract(const Duration(minutes: 5))),
          CacheEntry(key: 'settings', size: 5, timestamp: DateTime.now().subtract(const Duration(minutes: 10))),
        ];
        
        _cacheSize = 25;
        _cacheHits = 12;
        _cacheMisses = 3;
        _totalRequests = 15;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to initialize cache demo. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _simulateCacheRequest() async {
    setState(() {
      _isLoading = true;
      _totalRequests++;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(milliseconds: 500));
      
      // Randomly determine if it's a cache hit or miss
      bool isHit = DateTime.now().millisecond % 2 == 0;
      
      setState(() {
        if (isHit) {
          _cacheHits++;
        } else {
          _cacheMisses++;
          
          // Add new entry to cache (simulated)
          String newKey = 'request_${DateTime.now().millisecondsSinceEpoch}';
          _cachedData[newKey] = {
            'data': 'Sample data for request',
            'timestamp': DateTime.now().toIso8601String(),
          };
          
          _cacheEntries.add(
            CacheEntry(
              key: newKey,
              size: 15,
              timestamp: DateTime.now(),
            ),
          );
          
          _cacheSize += 15;
          
          // Remove oldest entry if cache is full
          if (_cacheSize > _maxCacheSize) {
            if (_cacheEntries.isNotEmpty) {
              CacheEntry oldest = _cacheEntries.reduce(
                (a, b) => a.timestamp.isBefore(b.timestamp) ? a : b,
              );
              
              _cacheSize -= oldest.size;
              _cacheEntries.remove(oldest);
              _cachedData.remove(oldest.key);
            }
          }
        }
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Error processing request. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  Future<void> _clearCache() async {
    setState(() {
      _isLoading = true;
    });

    try {
      // Simulate clearing cache
      await Future.delayed(const Duration(milliseconds: 500));
      
      setState(() {
        _cachedData.clear();
        _cacheEntries.clear();
        _cacheSize = 0;
        _cacheHits = 0;
        _cacheMisses = 0;
        _totalRequests = 0;
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Cache cleared successfully'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Error clearing cache'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  double _getCacheHitRate() {
    if (_totalRequests == 0) return 0.0;
    return _cacheHits / _totalRequests;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cache Demo'),
        centerTitle: false,
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _initializeCacheDemo,
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _initializeCacheDemo,
        child: Column(
          children: [
            // Cache Statistics
            Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: Colors.grey.shade50,
                border: Border(bottom: BorderSide(color: Colors.grey.shade300)),
              ),
              child: Column(
                children: [
                  const Text(
                    'Cache Statistics',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildStatCard('Hits', _cacheHits.toString(), Colors.green),
                      _buildStatCard('Misses', _cacheMisses.toString(), Colors.red),
                      _buildStatCard('Total', _totalRequests.toString(), Colors.blue),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      _buildStatCard(
                        'Hit Rate', 
                        '${(_getCacheHitRate() * 100).toStringAsFixed(1)}%', 
                        _getCacheHitRate() > 0.8 ? Colors.green : 
                               _getCacheHitRate() > 0.5 ? Colors.orange : Colors.red
                      ),
                      _buildStatCard('Size', '$_cacheSize KB', Colors.purple),
                      _buildStatCard('Entries', _cacheEntries.length.toString(), Colors.teal),
                    ],
                  ),
                ],
              ),
            ),
            // Cache Controls
            Container(
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  ElevatedButton.icon(
                    onPressed: _simulateCacheRequest,
                    icon: const Icon(Icons.sync),
                    label: const Text('Request'),
                  ),
                  ElevatedButton.icon(
                    onPressed: _clearCache,
                    icon: const Icon(Icons.clear_all),
                    label: const Text('Clear Cache'),
                  ),
                ],
              ),
            ),
            // Cached Entries
            Expanded(
              child: _isLoading && _cacheEntries.isEmpty
                  ? const Center(child: CircularProgressIndicator())
                  : _errorMessage != null && _cacheEntries.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(_errorMessage!),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: _initializeCacheDemo,
                                child: const Text('Retry'),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          itemCount: _cacheEntries.length,
                          itemBuilder: (context, index) {
                            var entry = _cacheEntries[index];
                            return Card(
                              margin: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 4,
                              ),
                              child: ListTile(
                                leading: Container(
                                  width: 40,
                                  height: 40,
                                  decoration: BoxDecoration(
                                    color: Theme.of(context).primaryColor,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    Icons.storage,
                                    color: Colors.white,
                                    size: 20,
                                  ),
                                ),
                                title: Text(entry.key),
                                subtitle: Text(
                                  '${entry.size} KB • ${_formatTimeDifference(entry.timestamp)}',
                                  style: const TextStyle(fontSize: 12),
                                ),
                                trailing: IconButton(
                                  icon: const Icon(Icons.delete),
                                  onPressed: () {
                                    setState(() {
                                      _cacheSize -= entry.size;
                                      _cacheEntries.removeAt(index);
                                      _cachedData.remove(entry.key);
                                    });
                                  },
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

  Widget _buildStatCard(String title, String value, Color color) {
    return Card(
      color: color.withOpacity(0.1),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          children: [
            Text(
              title,
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              value,
              style: TextStyle(
                color: color,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatTimeDifference(DateTime timestamp) {
    final now = DateTime.now();
    final difference = now.difference(timestamp);
    
    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes} min ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours} hr ago';
    } else {
      return '${difference.inDays} days ago';
    }
  }
}

class CacheEntry {
  final String key;
  final int size;
  final DateTime timestamp;

  CacheEntry({
    required this.key,
    required this.size,
    required this.timestamp,
  });
}