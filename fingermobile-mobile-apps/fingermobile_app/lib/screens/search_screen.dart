import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/member.dart';
import '../providers/app_provider.dart';
import '../services/api_service.dart';

class SearchScreen extends StatefulWidget {
  @override
  _SearchScreenState createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  List<member> _searchResults = [];
  bool _isLoading = false;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _searchController.addListener(_onSearchChanged);
  }

  @override
  void dispose() {
    _searchController.removeListener(_onSearchChanged);
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged() {
    if (_searchController.text != _searchQuery) {
      _searchQuery = _searchController.text;
      if (_searchQuery.length >= 2) {
        _performSearch();
      } else {
        setState(() {
          _searchResults = [];
        });
      }
    }
  }

  Future<void> _performSearch() async {
    if (_searchQuery.length < 2) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final results = await ApiService.get('/search/members?q=$_searchQuery');
      if (results != null && results['members'] != null) {
        setState(() {
          _searchResults = (results['members'] as List)
              .map((memberJson) => member.fromJson(memberJson))
              .toList();
        });
      } else {
        setState(() {
          _searchResults = [];
        });
      }
    } catch (e) {
      print('Search error: $e');
      setState(() {
        _searchResults = [];
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Search failed: $e')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Container(
          width: double.infinity,
          height: 40,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.2),
            borderRadius: BorderRadius.circular(10),
          ),
          child: TextField(
            controller: _searchController,
            style: TextStyle(color: Colors.white),
            decoration: InputDecoration(
              prefixIcon: Icon(Icons.search, color: Colors.white),
              hintText: 'Search members...',
              hintStyle: TextStyle(color: Colors.white70),
              border: InputBorder.none,
            ),
          ),
        ),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _searchResults.isEmpty && _searchQuery.isEmpty
              ? _buildEmptySearchView()
              : _buildSearchResults(),
    );
  }

  Widget _buildEmptySearchView() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.search,
            size: 80,
            color: Colors.grey[400],
          ),
          SizedBox(height: 16),
          Text(
            'Search for people',
            style: TextStyle(
              fontSize: 20,
              color: Colors.grey[600],
            ),
          ),
          SizedBox(height: 8),
          Padding(
            padding: EdgeInsets.symmetric(horizontal: 32),
            child: Text(
              'Find friends, colleagues, and interesting people on FingerMobile',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.grey[500],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchResults() {
    if (_searchResults.isEmpty && _searchQuery.isNotEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.search_off,
              size: 80,
              color: Colors.grey[400],
            ),
            SizedBox(height: 16),
            Text(
              'No results found',
              style: TextStyle(
                fontSize: 20,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 8),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                'Try different keywords',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.grey[500],
                ),
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      itemCount: _searchResults.length,
      itemBuilder: (context, index) {
        final member = _searchResults[index];
        return ListTile(
          leading: CircleAvatar(
            backgroundImage: member.profileImageUrl != null
                ? NetworkImage(member.profileImageUrl!)
                : null,
            child: member.profileImageUrl == null
                ? Icon(Icons.person)
                : null,
          ),
          title: Row(
            children: [
              Text(handlename),
              if (member.isVerified)
                Icon(
                  Icons.verified,
                  color: Colors.blue,
                  size: 16,
                ),
            ],
          ),
          subtitle: Text(
            '${member.firstName ?? ''} ${member.lastName ?? ''}'.trim(),
            style: TextStyle(color: Colors.grey[600]),
          ),
          trailing: IconButton(
            icon: Icon(Icons.message),
            onPressed: () {
              // TODO: Implement messaging
            },
          ),
          onTap: () {
            // Navigate to member profile
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => Consumer<AppProvider>(
                  builder: (context, provider, child) {
                    return Scaffold(
                      appBar: AppBar(
                        title: Text(handlename),
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                      ),
                      body: Center(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            CircleAvatar(
                              radius: 50,
                              backgroundImage: member.profileImageUrl != null
                                  ? NetworkImage(member.profileImageUrl!)
                                  : null,
                              child: member.profileImageUrl == null
                                  ? Icon(Icons.person, size: 50)
                                  : null,
                            ),
                            SizedBox(height: 16),
                            Text(
                              handlename,
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              '${member.firstName ?? ''} ${member.lastName ?? ''}'.trim(),
                              style: TextStyle(
                                color: Colors.grey[600],
                              ),
                            ),
                            if (member.location != null)
                              Text(
                                member.location!,
                                style: TextStyle(
                                  color: Colors.grey[600],
                                ),
                              ),
                            if (member.bio != null)
                              Padding(
                                padding: EdgeInsets.all(16),
                                child: Text(
                                  member.bio!,
                                  textAlign: TextAlign.center,
                                  style: TextStyle(fontSize: 16),
                                ),
                              ),
                            SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: () {
                                // Follow member
                                provider.followmember(member.id);
                              },
                              child: Text('Follow'),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            );
          },
        );
      },
    );
  }
}