import 'package:flutter/material.dart';
import 'package:fingermobile_app/services\content_service.dart';
import 'package:fingermobile_app/services\profile_service.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class CreatorDashboard extends StatefulWidget {
  @override
  _CreatorDashboardState createState() => _CreatorDashboardState();
}

class _CreatorDashboardState extends State<CreatorDashboard> {
  late Future<List<ContentItem>> _contentFuture;
  late Future<Member> _profileFuture;

  @override
  void initState() {
    super.initState();
    _contentFuture = ContentService.getRecentContent();
    _profileFuture = ProfileService().getProfile(null);
  }

  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Creator Dashboard',
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome section
            Card(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: FutureBuilder<Member>(
                  future: _profileFuture,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return CircularProgressIndicator();
                    }
                    if (snapshot.hasError) {
                      return Text('Error loading profile');
                    }
                    if (!snapshot.hasData) {
                      return Text('No profile data');
                    }
                    
                    final profile = snapshot.data!;
                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Welcome back, ${profile.name}!',
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'Here\'s what\'s happening with your content today.',
                          style: TextStyle(
                            fontSize: 16,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
            ),
            
            SizedBox(height: 20),
            
            // Stats cards row
            Row(
              children: [
                Expanded(
                  child: _buildStatCard('Posts', '24', Icons.article),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: _buildStatCard('Followers', '1.2K', Icons.people),
                ),
              ],
            ),
            
            SizedBox(height: 16),
            
            Row(
              children: [
                Expanded(
                  child: _buildStatCard('Earnings', '\$245.50', Icons.attach_money),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: _buildStatCard('Views', '12.4K', Icons.visibility),
                ),
              ],
            ),
            
            SizedBox(height: 20),
            
            // Recent content section
            Text(
              'Recent Content',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 10),
            
            FutureBuilder<List<ContentItem>>(
              future: _contentFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Error loading content'));
                }
                if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Center(child: Text('No content available'));
                }
                
                final contentItems = snapshot.data!;
                return ListView.builder(
                  shrinkWrap: true,
                  physics: NeverScrollableScrollPhysics(),
                  itemCount: contentItems.length,
                  itemBuilder: (context, index) {
                    final item = contentItems[index];
                    return Card(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(8),
                                  child: Image.network(
                                    item.imageUrl,
                                    width: 60,
                                    height: 60,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                                SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        item.title,
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                        ),
                                      ),
                                      Text(
                                        item.description,
                                        style: TextStyle(
                                          color: Colors.grey[600],
                                          fontSize: 14,
                                        ),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 12),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  item.type.toUpperCase(),
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.blue,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                Text(
                                  '${item.createdAt.day}/${item.createdAt.month}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey[500],
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: Colors.blue),
                SizedBox(width: 8),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ContentItem class definition for this widget
class ContentItem {
  final String id;
  final String title;
  final String description;
  final String type;
  final String imageUrl;
  final DateTime createdAt;

  ContentItem({
    required this.id,
    required this.title,
    required this.description,
    required this.type,
    required this.imageUrl,
    required this.createdAt,
  });
}