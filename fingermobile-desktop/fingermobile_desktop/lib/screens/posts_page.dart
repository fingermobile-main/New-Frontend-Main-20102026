import 'package:flutter/material.dart';

class PostsPage extends StatefulWidget {
  const PostsPage({Key? key}) : super(key: key);

  @override
  State<PostsPage> createState() => _PostsPageState();
}

class _PostsPageState extends State<PostsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Posts'),
        backgroundColor: Theme.of(context).colorScheme.surface,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              Navigator.pushNamed(context, '/notifications');
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Sidebar with filters and options
            SizedBox(
              width: 250,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Post Options',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      _buildOptionItem(Icons.home, 'Home Feed', true),
                      _buildOptionItem(Icons.explore, 'Explore', false),
                      _buildOptionItem(Icons.bookmark, 'Saved Posts', false),
                      _buildOptionItem(Icons.history, 'Recent Activity', false),
                      
                      const SizedBox(height: 24),
                      
                      const Text(
                        'Post Filters',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      _buildFilterChip('All Posts', true),
                      const SizedBox(height: 8),
                      _buildFilterChip('Following', false),
                      const SizedBox(height: 8),
                      _buildFilterChip('Popular', false),
                      const SizedBox(height: 8),
                      _buildFilterChip('Recent', false),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            
            // Main content area
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Create post card
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Row(
                        children: [
                          const CircleAvatar(
                            backgroundImage: NetworkImage(
                              'https://via.placeholder.com/40',
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: TextField(
                              decoration: const InputDecoration(
                                hintText: 'What\'s on your mind?',
                                border: InputBorder.none,
                              ),
                              onTap: () {
                                // Navigate to create post
                              },
                            ),
                          ),
                          IconButton(
                            icon: const Icon(Icons.image),
                            onPressed: () {
                              // Add image to post
                            },
                          ),
                          IconButton(
                            icon: const Icon(Icons.emoji_emotions),
                            onPressed: () {
                              // Add emoji to post
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Filter tabs
                  Container(
                    height: 40,
                    child: TabBar(
                      tabs: const [
                        Tab(text: 'For You'),
                        Tab(text: 'Following'),
                        Tab(text: 'Trending'),
                      ],
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Posts list
                  Expanded(
                    child: ListView.builder(
                      itemCount: 5,
                      itemBuilder: (context, index) {
                        return _buildPostCard(index);
                      },
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(width: 16),
            
            // Right sidebar with suggestions
            SizedBox(
              width: 300,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Suggested for You',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      ...List.generate(3, (index) => _buildSuggestionItem(index)),
                      
                      const SizedBox(height: 24),
                      
                      const Text(
                        'Trending Topics',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      ...List.generate(4, (index) => _buildTrendingItem(index)),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Create new post
          Navigator.pushNamed(context, '/content');
        },
        tooltip: 'Create Post',
        child: const Icon(Icons.edit),
      ),
    );
  }

  Widget _buildOptionItem(IconData icon, String title, bool isSelected) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: ListTile(
        leading: Icon(icon, color: isSelected ? Theme.of(context).primaryColor : null),
        title: Text(title),
        selected: isSelected,
        selectedColor: Theme.of(context).primaryColor,
        onTap: () {
          // Handle option selection
        },
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected) {
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      selectedColor: Theme.of(context).primaryColor,
      onSelected: (selected) {
        // Handle chip selection
      },
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : Colors.black87,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
          color: isSelected 
              ? Theme.of(context).primaryColor 
              : Colors.grey.shade300,
        ),
      ),
    );
  }

  Widget _buildPostCard(int index) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Post header
            Row(
              children: [
                const CircleAvatar(
                  backgroundImage: NetworkImage(
                    'https://via.placeholder.com/40',
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Member ${index + 1}',
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        '${index + 1} hours ago',
                        style: TextStyle(
                          color: Colors.grey[600],
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.more_vert),
                  onPressed: () {
                    // Show post options
                  },
                ),
              ],
            ),
            
            const SizedBox(height: 12),
            
            // Post content
            Text(
              'This is a sample post content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
              style: const TextStyle(fontSize: 16),
            ),
            
            const SizedBox(height: 16),
            
            // Post image
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(
                'https://via.placeholder.com/600x300',
                fit: BoxFit.cover,
                width: double.infinity,
                height: 200,
              ),
            ),
            
            const SizedBox(height: 16),
            
            // Post actions
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildPostAction(Icons.thumb_up, 'Like', '${(index + 1) * 12}'),
                _buildPostAction(Icons.comment, 'Comment', '${(index + 1) * 3}'),
                _buildPostAction(Icons.share, 'Share', '${index + 1}'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPostAction(IconData icon, String label, String count) {
    return Expanded(
      child: TextButton.icon(
        onPressed: () {},
        icon: Icon(icon),
        label: Text('$count $label'),
        style: TextButton.styleFrom(
          foregroundColor: Colors.grey[700],
        ),
      ),
    );
  }

  Widget _buildSuggestionItem(int index) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        children: [
          CircleAvatar(
            backgroundImage: NetworkImage(
              'https://via.placeholder.com/40',
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Suggested member ${index + 1}',
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                Text(
                  'Suggested for you',
                  style: TextStyle(
                    color: Colors.grey[600],
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          ElevatedButton(
            onPressed: () {},
            child: const Text('Follow'),
          ),
        ],
      ),
    );
  }

  Widget _buildTrendingItem(int index) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: ListTile(
        leading: Container(
          width: 30,
          height: 30,
          decoration: BoxDecoration(
            color: Theme.of(context).primaryColor.withOpacity(0.1),
            borderRadius: BorderRadius.circular(5),
          ),
          child: Icon(
            Icons.trending_up,
            color: Theme.of(context).primaryColor,
            size: 16,
          ),
        ),
        title: Text(
          'Trending Topic ${index + 1}',
          style: const TextStyle(fontSize: 14),
        ),
        subtitle: Text(
          '${(index + 1) * 1000} posts',
          style: TextStyle(
            color: Colors.grey[600],
            fontSize: 12,
          ),
        ),
        onTap: () {},
      ),
    );
  }
}