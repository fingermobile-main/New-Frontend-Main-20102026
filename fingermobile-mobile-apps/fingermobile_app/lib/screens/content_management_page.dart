import 'package:flutter/material.dart';

class ContentManagementPage extends StatefulWidget {
  @override
  _ContentManagementPageState createState() => _ContentManagementPageState();
}

class _ContentManagementPageState extends State<ContentManagementPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Content Management'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Manage Your Content',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 20),
            GridView.count(
              shrinkWrap: true,
              crossAxisCount: 2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
              children: [
                _buildContentOption(
                  icon: Icons.post_add,
                  title: 'Posts',
                  onTap: () {
                    // Navigate to posts management
                  },
                ),
                _buildContentOption(
                  icon: Icons.video_library,
                  title: 'Videos',
                  onTap: () {
                    // Navigate to videos management
                  },
                ),
                _buildContentOption(
                  icon: Icons.image,
                  title: 'Gallery',
                  onTap: () {
                    // Navigate to gallery management
                  },
                ),
                _buildContentOption(
                  icon: Icons.article,
                  title: 'Blogs',
                  onTap: () {
                    // Navigate to blogs management
                  },
                ),
                _buildContentOption(
                  icon: Icons.school,
                  title: 'E-Learning',
                  onTap: () {
                    // Navigate to e-learning management
                  },
                ),
                _buildContentOption(
                  icon: Icons.forum,
                  title: 'Forums',
                  onTap: () {
                    // Navigate to forums management
                  },
                ),
              ],
            ),
            SizedBox(height: 30),
            Text(
              'Content Analytics',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Card(
              elevation: 2,
              child: ListTile(
                leading: Icon(Icons.visibility, color: Colors.blue),
                title: Text('Total Views'),
                trailing: Text('1,245', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
            SizedBox(height: 8),
            Card(
              elevation: 2,
              child: ListTile(
                leading: Icon(Icons.thumb_up, color: Colors.green),
                title: Text('Total Likes'),
                trailing: Text('324', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
            SizedBox(height: 8),
            Card(
              elevation: 2,
              child: ListTile(
                leading: Icon(Icons.comment, color: Colors.orange),
                title: Text('Total Comments'),
                trailing: Text('87', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContentOption({
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        elevation: 2,
        child: Container(
          padding: EdgeInsets.all(20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 48,
                color: Colors.blue,
              ),
              SizedBox(height: 12),
              Text(
                title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}