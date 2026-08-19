import 'package:flutter/material.dart';

class SearchPage extends StatefulWidget {
  @override
  _SearchPageState createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final TextEditingController _searchController = TextEditingController();
  bool _isSearching = false;
  List<String> _recentSearches = [
    'Technology',
    'Design',
    'Flutter Development',
    'Mobile Apps',
    'UI/UX',
  ];
  List<Map<String, dynamic>> _searchResults = [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: _isSearching
            ? TextField(
                controller: _searchController,
                decoration: InputDecoration(
                  hintText: 'Search...',
                  border: InputBorder.none,
                ),
                onSubmitted: _performSearch,
                autofocus: true,
              )
            : Text('Search'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        actions: _isSearching
            ? [
                IconButton(
                  icon: Icon(Icons.clear),
                  onPressed: () {
                    setState(() {
                      _isSearching = false;
                      _searchController.clear();
                    });
                  },
                ),
              ]
            : [
                IconButton(
                  icon: Icon(Icons.search),
                  onPressed: () {
                    setState(() {
                      _isSearching = true;
                    });
                  },
                ),
              ],
      ),
      body: _isSearching ? _buildSearchResults() : _buildSearchHome(),
    );
  }

  Widget _buildSearchHome() {
    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Search',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 8),
          Text(
            'Find content, creators, and topics',
            style: TextStyle(
              fontSize: 16,
              color: Colors.grey[600],
            ),
          ),
          SizedBox(height: 24),
          TextField(
            controller: _searchController,
            decoration: InputDecoration(
              hintText: 'Search...',
              prefixIcon: Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(24),
              ),
              contentPadding: EdgeInsets.symmetric(horizontal: 16),
            ),
            onSubmitted: _performSearch,
            onTap: () {
              setState(() {
                _isSearching = true;
              });
            },
          ),
          SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Recent Searches',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () {
                  setState(() {
                    _recentSearches.clear();
                  });
                },
                child: Text('Clear All'),
              ),
            ],
          ),
          SizedBox(height: 12),
          Expanded(
            child: ListView.builder(
              itemCount: _recentSearches.length,
              itemBuilder: (context, index) {
                return ListTile(
                  leading: Icon(
                    Icons.history,
                    color: Colors.grey,
                  ),
                  title: Text(_recentSearches[index]),
                  onTap: () {
                    _searchController.text = _recentSearches[index];
                    _performSearch(_recentSearches[index]);
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchResults() {
    if (_searchController.text.isEmpty) {
      return Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Search Tips',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            _buildSearchTip('Search for creators by name'),
            SizedBox(height: 8),
            _buildSearchTip('Find content by topic'),
            SizedBox(height: 8),
            _buildSearchTip('Discover trending hashtags'),
          ],
        ),
      );
    }

    return Padding(
      padding: EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Results for "${_searchController.text}"',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
          SizedBox(height: 16),
          Container(
            height: 40,
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                _buildFilterChip('All', true),
                SizedBox(width: 8),
                _buildFilterChip('Posts', false),
                SizedBox(width: 8),
                _buildFilterChip('People', false),
                SizedBox(width: 8),
                _buildFilterChip('Groups', false),
                SizedBox(width: 8),
                _buildFilterChip('Hashtags', false),
              ],
            ),
          ),
          SizedBox(height: 16),
          Expanded(
            child: ListView.builder(
              itemCount: 8,
              itemBuilder: (context, index) {
                return Card(
                  elevation: 1,
                  margin: EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: Colors.purple[100],
                      child: Text('R$index'),
                    ),
                    title: Text('Result $index for ${_searchController.text}'),
                    subtitle: Text('Description of result $index'),
                    trailing: Icon(Icons.arrow_forward_ios, size: 16),
                    onTap: () {
                      // Navigate to result
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchTip(String tip) {
    return Card(
      elevation: 1,
      child: Padding(
        padding: EdgeInsets.all(12),
        child: Row(
          children: [
            Icon(Icons.lightbulb_outline, color: Colors.orange),
            SizedBox(width: 12),
            Expanded(
              child: Text(
                tip,
                style: TextStyle(
                  fontSize: 14,
                ),
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

  void _performSearch(String query) {
    if (query.isNotEmpty) {
      // Add to recent searches if not already there
      if (!_recentSearches.contains(query)) {
        _recentSearches.insert(0, query);
        if (_recentSearches.length > 5) {
          _recentSearches.removeLast();
        }
      }

      // Simulate search results
      _searchResults = List.generate(8, (index) {
        return {
          'title': 'Result $index for $query',
          'description': 'Description of result $index',
        };
      });

      setState(() {
        // Results are already set in the variable
      });
    }
  }
}