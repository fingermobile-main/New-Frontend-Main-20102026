import 'package:flutter/material.dart';

class ContentManagementPage extends StatefulWidget {
  const ContentManagementPage({Key? key}) : super(key: key);

  @override
  State<ContentManagementPage> createState() => _ContentManagementPageState();
}

class _ContentManagementPageState extends State<ContentManagementPage> {
  final List<String> _tabs = ['All', 'Posts', 'Scheduled', 'Drafts', 'Published'];
  String _selectedTab = 'All';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Content Management'),
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
            // Sidebar with content options
            SizedBox(
              width: 250,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Content Options',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      _buildOptionItem(Icons.dashboard, 'Dashboard', false),
                      _buildOptionItem(Icons.post_add, 'Create Post', true),
                      _buildOptionItem(Icons.schedule, 'Scheduled Content', false),
                      _buildOptionItem(Icons.drafts, 'Drafts', false),
                      _buildOptionItem(Icons.publish, 'Published', false),
                      _buildOptionItem(Icons.analytics, 'Analytics', false),
                      
                      const SizedBox(height: 24),
                      
                      const Text(
                        'Content Types',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      
                      _buildContentTypeItem(Icons.article, 'Article', false),
                      _buildContentTypeItem(Icons.video_call, 'Video', false),
                      _buildContentTypeItem(Icons.image, 'Image', false),
                      _buildContentTypeItem(Icons.audiotrack, 'Audio', false),
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
                  // Tab bar for content types
                  Container(
                    height: 48,
                    child: TabBar(
                      tabs: _tabs.map((tab) => Tab(text: tab)).toList(),
                      isScrollable: true,
                    ),
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Content stats
                  Row(
                    children: [
                      _buildStatCard('Total', '1,245', Icons.article, Colors.blue),
                      const SizedBox(width: 16),
                      _buildStatCard('Published', '892', Icons.check_circle, Colors.green),
                      const SizedBox(width: 16),
                      _buildStatCard('Drafts', '128', Icons.drafts, Colors.orange),
                      const SizedBox(width: 16),
                      _buildStatCard('Scheduled', '45', Icons.schedule, Colors.purple),
                    ],
                  ),
                  
                  const SizedBox(height: 16),
                  
                  // Content list
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Your Content',
                                  style: Theme.of(context).textTheme.headlineSmall,
                                ),
                                ElevatedButton.icon(
                                  onPressed: () {
                                    // Create new content
                                  },
                                  icon: const Icon(Icons.add),
                                  label: const Text('Create Content'),
                                ),
                              ],
                            ),
                            const SizedBox(height: 16),
                            
                            // Content table
                            Expanded(
                              child: ListView.builder(
                                itemCount: 8,
                                itemBuilder: (context, index) => _buildContentItem(index),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Create new content
        },
        tooltip: 'Create Content',
        child: const Icon(Icons.add),
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

  Widget _buildContentTypeItem(IconData icon, String title, bool isSelected) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: ListTile(
        leading: Icon(icon),
        title: Text(title),
        trailing: Checkbox(
          value: isSelected,
          onChanged: (value) {
            // Handle selection
          },
        ),
        onTap: () {
          // Handle selection
        },
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(icon, color: color),
                  const SizedBox(width: 8),
                  Text(
                    title,
                    style: Theme.of(context).textTheme.titleSmall,
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                value,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildContentItem(int index) {
    final titles = [
      'How to Master Flutter Development',
      'Top 10 Design Trends in 2025',
      'Understanding AI in Mobile Apps',
      'Building Scalable Backend Systems',
      'Advanced State Management Techniques',
      'Creating Beautiful UI Components',
      'Performance Optimization Tips',
      'Security Best Practices'
    ];
    
    final statuses = ['Published', 'Draft', 'Scheduled', 'Published', 'Draft', 'Scheduled', 'Published', 'Draft'];
    final dates = ['2025-12-25', '2025-12-24', '2025-12-26', '2025-12-23', '2025-12-22', '2025-12-27', '2025-12-21', '2025-12-20'];
    final views = [1245, 0, 245, 5672, 0, 0, 3421, 0];
    final likes = [89, 0, 12, 245, 0, 0, 187, 0];
    
    Color statusColor = statuses[index] == 'Published' 
        ? Colors.green 
        : statuses[index] == 'Draft' 
            ? Colors.orange 
            : Colors.blue;

    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Container(
        padding: const EdgeInsets.all(12.0),
        decoration: BoxDecoration(
          border: Border(
            left: BorderSide(
              color: statusColor,
              width: 4,
            ),
          ),
          borderRadius: BorderRadius.circular(4),
        ),
        child: Row(
          children: [
            Expanded(
              flex: 3,
              child: Row(
                children: [
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: Theme.of(context).colorScheme.surface,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      index % 3 == 0 ? Icons.article : 
                      index % 3 == 1 ? Icons.video_call : Icons.image,
                      color: Theme.of(context).primaryColor,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          titles[index],
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                            fontSize: 16,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        Text(
                          'Created on $dates[index]',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: Text(
                statuses[index],
                style: TextStyle(
                  color: statusColor,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
            Expanded(
              child: Text(
                '${views[index]} views',
                style: TextStyle(
                  color: Colors.grey[600],
                ),
              ),
            ),
            Expanded(
              child: Text(
                '${likes[index]} likes',
                style: TextStyle(
                  color: Colors.grey[600],
                ),
              ),
            ),
            IconButton(
              icon: const Icon(Icons.more_vert),
              onPressed: () {
                // Show content options
              },
            ),
          ],
        ),
      ),
    );
  }
}