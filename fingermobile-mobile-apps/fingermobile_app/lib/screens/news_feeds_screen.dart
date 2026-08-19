import 'package:flutter/material.dart';

class NewsFeedsScreen extends StatefulWidget {
  @override
  _NewsFeedsScreenState createState() => _NewsFeedsScreenState();
}

class _NewsFeedsScreenState extends State<NewsFeedsScreen> {
  List<NewsArticle> _newsArticles = [];
  List<NewsCategory> _categories = [];
  bool _isLoading = true;
  String _selectedCategory = 'All';
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _loadNewsData();
  }

  Future<void> _loadNewsData() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _categories = [
          NewsCategory(id: 1, name: 'All', icon: Icons.rss_feed),
          NewsCategory(id: 2, name: 'Technology', icon: Icons.computer),
          NewsCategory(id: 3, name: 'Business', icon: Icons.business),
          NewsCategory(id: 4, name: 'Health', icon: Icons.favorite),
          NewsCategory(id: 5, name: 'Entertainment', icon: Icons.movie),
          NewsCategory(id: 6, name: 'Sports', icon: Icons.sports),
          NewsCategory(id: 7, name: 'Science', icon: Icons.science),
        ];
        
        _newsArticles = [
          NewsArticle(
            id: 1,
            title: 'New Technology Trends in 2023',
            summary: 'Exploring the latest technological innovations shaping our future',
            content: 'The technology landscape continues to evolve rapidly. This article explores the latest trends including AI advancements, quantum computing, and sustainable tech solutions...',
            imageUrl: 'https://via.placeholder.com/600x400',
            category: 'Technology',
            author: 'Tech Journalist',
            publishedAt: DateTime.now().subtract(Duration(hours: 2)),
            readTime: 5,
            isBookmarked: false,
            isRead: false,
          ),
          NewsArticle(
            id: 2,
            title: 'Global Markets Show Strong Recovery',
            summary: 'Stock markets worldwide show signs of recovery after recent volatility',
            content: 'Global markets have shown resilience with strong performance across multiple sectors. Analysts predict continued growth in the coming quarters...',
            imageUrl: 'https://via.placeholder.com/600x400',
            category: 'Business',
            author: 'Financial Times',
            publishedAt: DateTime.now().subtract(Duration(hours: 5)),
            readTime: 4,
            isBookmarked: true,
            isRead: true,
          ),
          NewsArticle(
            id: 3,
            title: 'Breakthrough in Medical Research',
            summary: 'Scientists discover new treatment for rare diseases',
            content: 'A team of researchers has announced a significant breakthrough in the treatment of rare genetic disorders. The new therapy shows promising results in clinical trials...',
            imageUrl: 'https://via.placeholder.com/600x400',
            category: 'Health',
            author: 'Medical Journal',
            publishedAt: DateTime.now().subtract(Duration(hours: 8)),
            readTime: 6,
            isBookmarked: false,
            isRead: false,
          ),
          NewsArticle(
            id: 4,
            title: 'New Streaming Service Launches',
            summary: 'Major entertainment company enters the streaming market',
            content: 'The new streaming platform offers exclusive content and innovative features. Industry experts analyze its potential impact on the market...',
            imageUrl: 'https://via.placeholder.com/600x400',
            category: 'Entertainment',
            author: 'Entertainment Weekly',
            publishedAt: DateTime.now().subtract(Duration(hours: 12)),
            readTime: 3,
            isBookmarked: false,
            isRead: true,
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading news data: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading news data')),
      );
    }
  }

  void _toggleBookmark(NewsArticle article) {
    setState(() {
      final index = _newsArticles.indexWhere((a) => a.id == article.id);
      if (index != -1) {
        _newsArticles[index] = NewsArticle(
          id: _newsArticles[index].id,
          title: _newsArticles[index].title,
          summary: _newsArticles[index].summary,
          content: _newsArticles[index].content,
          imageUrl: _newsArticles[index].imageUrl,
          category: _newsArticles[index].category,
          author: _newsArticles[index].author,
          publishedAt: _newsArticles[index].publishedAt,
          readTime: _newsArticles[index].readTime,
          isBookmarked: !_newsArticles[index].isBookmarked,
          isRead: _newsArticles[index].isRead,
        );
      }
    });
  }

  List<NewsArticle> get _filteredArticles {
    if (_selectedCategory == 'All') {
      return _newsArticles;
    }
    return _newsArticles.where((article) => article.category == _selectedCategory).toList();
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
            onChanged: (value) {
              setState(() {
                _searchQuery = value;
              });
            },
            style: TextStyle(color: Colors.white),
            decoration: InputDecoration(
              prefixIcon: Icon(Icons.search, color: Colors.white),
              hintText: 'Search news...',
              hintStyle: TextStyle(color: Colors.white70),
              border: InputBorder.none,
            ),
          ),
        ),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.bookmark),
            onPressed: () {
              // Navigate to bookmarks
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : Column(
              children: [
                // Categories
                Container(
                  height: 60,
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    itemCount: _categories.length,
                    itemBuilder: (context, index) {
                      final category = _categories[index];
                      return Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8),
                        child: GestureDetector(
                          onTap: () {
                            setState(() {
                              _selectedCategory = category.name;
                            });
                          },
                          child: Container(
                            padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: _selectedCategory == category.name ? Colors.blue : Colors.grey[200],
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  category.icon,
                                  color: _selectedCategory == category.name ? Colors.white : Colors.grey[700],
                                  size: 16,
                                ),
                                SizedBox(width: 4),
                                Text(
                                  category.name,
                                  style: TextStyle(
                                    color: _selectedCategory == category.name ? Colors.white : Colors.grey[700],
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                
                // News List
                Expanded(
                  child: RefreshIndicator(
                    onRefresh: _loadNewsData,
                    child: _filteredArticles.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.rss_feed,
                                  size: 80,
                                  color: Colors.grey[400],
                                ),
                                SizedBox(height: 16),
                                Text(
                                  'No articles found',
                                  style: TextStyle(
                                    fontSize: 20,
                                    color: Colors.grey[600],
                                  ),
                                ),
                                SizedBox(height: 8),
                                Padding(
                                  padding: EdgeInsets.symmetric(horizontal: 32),
                                  child: Text(
                                    'Try selecting a different category or check back later',
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      color: Colors.grey[500],
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          )
                        : ListView.builder(
                            itemCount: _filteredArticles.length,
                            itemBuilder: (context, index) {
                              final article = _filteredArticles[index];
                              return _buildNewsItem(article);
                            },
                          ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildNewsItem(NewsArticle article) {
    return Card(
      margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Article image
            Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8),
                image: DecorationImage(
                  image: NetworkImage(article.imageUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            
            SizedBox(height: 12),
            
            // Category and bookmark
            Row(
              children: [
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.blue[100],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    article.category,
                    style: TextStyle(
                      color: Colors.blue[800],
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
                Spacer(),
                IconButton(
                  icon: Icon(
                    article.isBookmarked ? Icons.bookmark : Icons.bookmark_border,
                    color: article.isBookmarked ? Colors.blue : Colors.grey,
                  ),
                  onPressed: () => _toggleBookmark(article),
                ),
              ],
            ),
            
            SizedBox(height: 8),
            
            // Title
            Text(
              article.title,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            
            SizedBox(height: 8),
            
            // Summary
            Text(
              article.summary,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[700],
              ),
            ),
            
            SizedBox(height: 12),
            
            // Author, time, and read time
            Row(
              children: [
                Text(
                  article.author,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
                Text(
                  ' • ',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
                Text(
                  _formatTime(article.publishedAt),
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
                Spacer(),
                Text(
                  '${article.readTime} min read',
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  String _formatTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays}d ago';
    } else {
      return '${dateTime.day}/${dateTime.month}/${dateTime.year}';
    }
  }
}

class NewsCategory {
  final int id;
  final String name;
  final IconData icon;

  NewsCategory({
    required this.id,
    required this.name,
    required this.icon,
  });
}

class NewsArticle {
  final int id;
  final String title;
  final String summary;
  final String content;
  final String imageUrl;
  final String category;
  final String author;
  final DateTime publishedAt;
  final int readTime;
  final bool isBookmarked;
  final bool isRead;

  NewsArticle({
    required this.id,
    required this.title,
    required this.summary,
    required this.content,
    required this.imageUrl,
    required this.category,
    required this.author,
    required this.publishedAt,
    required this.readTime,
    required this.isBookmarked,
    required this.isRead,
  });
}