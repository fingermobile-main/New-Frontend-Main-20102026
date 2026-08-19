import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class BlogsPage extends StatefulWidget {
  const BlogsPage({super.key});

  @override
  State<BlogsPage> createState() => _BlogsPageState();
}

class _BlogsPageState extends State<BlogsPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<BlogPost> _blogPosts = [];
  List<BlogCategory> _categories = [];
  String _selectedCategory = 'All';
  int _currentPage = 1;
  bool _hasMorePosts = true;

  @override
  void initState() {
    super.initState();
    _loadCategories();
    _loadBlogPosts();
  }

  Future<void> _loadCategories() async {
    try {
      // Mock categories data
      setState(() {
        _categories = [
          BlogCategory(id: 'all', name: 'All'),
          BlogCategory(id: 'tech', name: 'Technology'),
          BlogCategory(id: 'music', name: 'Music'),
          BlogCategory(id: 'lifestyle', name: 'Lifestyle'),
          BlogCategory(id: 'tutorials', name: 'Tutorials'),
          BlogCategory(id: 'news', name: 'News'),
        ];
      });
    } catch (e) {
      // Handle error silently for categories
    }
  }

  Future<void> _loadBlogPosts() async {
    if (_currentPage == 1) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });
    }

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock blog posts data
      List<BlogPost> newPosts = [
        BlogPost(
          id: 1,
          title: 'The Future of Music Streaming Platforms',
          excerpt: 'Exploring how AI and machine learning are transforming the way we discover and consume music...',
          author: 'Alex Johnson',
          date: '2023-05-15',
          readTime: '5 min read',
          imageUrl: 'https://via.placeholder.com/600x300/4ECDC4/FFFFFF?text=Music+Tech',
          category: 'Technology',
          likes: 124,
          comments: 24,
        ),
        BlogPost(
          id: 2,
          title: 'How to Create the Perfect Playlist',
          excerpt: 'Tips and tricks for crafting playlists that resonate with your audience and boost engagement...',
          author: 'Sarah Williams',
          date: '2023-05-12',
          readTime: '3 min read',
          imageUrl: 'https://via.placeholder.com/600x300/FF6B6B/FFFFFF?text=Playlist+Tips',
          category: 'Tutorials',
          likes: 89,
          comments: 17,
        ),
        BlogPost(
          id: 3,
          title: 'Beatwave NG: Revolutionizing Audio Experience',
          excerpt: 'An inside look at the new features and improvements in our latest audio platform update...',
          author: 'Michael Chen',
          date: '2023-05-10',
          readTime: '7 min read',
          imageUrl: 'https://via.placeholder.com/600x300/45B7D1/FFFFFF?text=Beatwave+NG',
          category: 'News',
          likes: 215,
          comments: 42,
        ),
        BlogPost(
          id: 4,
          title: 'The Rise of Independent Artists in the Digital Age',
          excerpt: 'How technology is empowering independent musicians to reach global audiences without traditional labels...',
          author: 'Emma Rodriguez',
          date: '2023-05-08',
          readTime: '6 min read',
          imageUrl: 'https://via.placeholder.com/600x300/F9CA24/FFFFFF?text=Indie+Artists',
          category: 'Music',
          likes: 176,
          comments: 31,
        ),
      ];
      
      setState(() {
        if (_currentPage == 1) {
          _blogPosts = newPosts;
        } else {
          _blogPosts.addAll(newPosts);
        }
        
        // Simulate reaching end of posts
        if (_currentPage >= 3) {
          _hasMorePosts = false;
        }
      });
    } catch (e) {
      if (_currentPage == 1) {
        setState(() {
          _errorMessage = 'Failed to load blog posts. Please try again.';
        });
      }
    } finally {
      if (_currentPage == 1) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  Future<void> _refreshBlogPosts() async {
    setState(() {
      _currentPage = 1;
      _hasMorePosts = true;
    });
    await _loadBlogPosts();
  }

  Future<void> _loadMorePosts() async {
    if (!_hasMorePosts || _isLoading) return;
    
    setState(() {
      _currentPage++;
    });
    await _loadBlogPosts();
  }

  void _selectCategory(String categoryId) {
    setState(() {
      _selectedCategory = categoryId;
      _currentPage = 1;
      _hasMorePosts = true;
    });
    _loadBlogPosts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Blogs'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Open search
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Categories
          Container(
            height: 50,
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: _categories.length,
              itemBuilder: (context, index) {
                var category = _categories[index];
                bool isSelected = _selectedCategory.toLowerCase() == category.id;
                
                return Padding(
                  padding: EdgeInsets.only(
                    left: index == 0 ? 16 : 8,
                    right: 8,
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
          // Blog Posts
          Expanded(
            child: RefreshIndicator(
              onRefresh: _refreshBlogPosts,
              child: _isLoading && _blogPosts.isEmpty
                  ? const Center(child: CircularProgressIndicator())
                  : _errorMessage != null && _blogPosts.isEmpty
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(_errorMessage!),
                              const SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: _refreshBlogPosts,
                                child: const Text('Retry'),
                              ),
                            ],
                          ),
                        )
                      : ListView.builder(
                          itemCount: _blogPosts.length + (_hasMorePosts ? 1 : 0),
                          itemBuilder: (context, index) {
                            if (index == _blogPosts.length) {
                              // Loading indicator for pagination
                              return _isLoading
                                  ? const Padding(
                                      padding: EdgeInsets.all(16),
                                      child: Center(child: CircularProgressIndicator()),
                                    )
                                  : const SizedBox.shrink();
                            }
                            
                            var post = _blogPosts[index];
                            return Card(
                              margin: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 8,
                              ),
                              child: InkWell(
                                onTap: () {
                                  // Navigate to blog post detail
                                },
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    ClipRRect(
                                      borderRadius: const BorderRadius.vertical(
                                        top: Radius.circular(4),
                                      ),
                                      child: CachedNetworkImage(
                                        imageUrl: post.imageUrl,
                                        width: double.infinity,
                                        height: 200,
                                        fit: BoxFit.cover,
                                        placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                                        errorWidget: (context, url, error) => Container(
                                          color: Colors.grey[300],
                                          child: const Icon(Icons.image),
                                        ),
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.all(16),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 8,
                                              vertical: 4,
                                            ),
                                            decoration: BoxDecoration(
                                              color: Theme.of(context).primaryColor.withOpacity(0.1),
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: Text(
                                              post.category,
                                              style: TextStyle(
                                                color: Theme.of(context).primaryColor,
                                                fontSize: 12,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            post.title,
                                            style: const TextStyle(
                                              fontSize: 18,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            post.excerpt,
                                            style: const TextStyle(
                                              color: Colors.grey,
                                            ),
                                          ),
                                          const SizedBox(height: 16),
                                          Row(
                                            children: [
                                              const CircleAvatar(
                                                radius: 12,
                                                backgroundColor: Colors.grey,
                                              ),
                                              const SizedBox(width: 8),
                                              Text(
                                                post.author,
                                                style: const TextStyle(
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                              const SizedBox(width: 16),
                                              Text(
                                                post.date,
                                                style: const TextStyle(
                                                  color: Colors.grey,
                                                ),
                                              ),
                                              const Spacer(),
                                              Text(
                                                post.readTime,
                                                style: const TextStyle(
                                                  color: Colors.grey,
                                                ),
                                              ),
                                            ],
                                          ),
                                          const SizedBox(height: 16),
                                          Row(
                                            children: [
                                              IconButton(
                                                icon: const Icon(Icons.thumb_up_outlined),
                                                onPressed: () {
                                                  // Like post
                                                },
                                              ),
                                              Text('${post.likes}'),
                                              const SizedBox(width: 16),
                                              IconButton(
                                                icon: const Icon(Icons.comment_outlined),
                                                onPressed: () {
                                                  // Comment on post
                                                },
                                              ),
                                              Text('${post.comments}'),
                                              const Spacer(),
                                              IconButton(
                                                icon: const Icon(Icons.share),
                                                onPressed: () {
                                                  // Share post
                                                },
                                              ),
                                            ],
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
            ),
          ),
        ],
      ),
    );
  }
}

class BlogCategory {
  final String id;
  final String name;

  BlogCategory({
    required this.id,
    required this.name,
  });
}

class BlogPost {
  final int id;
  final String title;
  final String excerpt;
  final String author;
  final String date;
  final String readTime;
  final String imageUrl;
  final String category;
  final int likes;
  final int comments;

  BlogPost({
    required this.id,
    required this.title,
    required this.excerpt,
    required this.author,
    required this.date,
    required this.readTime,
    required this.imageUrl,
    required this.category,
    required this.likes,
    required this.comments,
  });
}