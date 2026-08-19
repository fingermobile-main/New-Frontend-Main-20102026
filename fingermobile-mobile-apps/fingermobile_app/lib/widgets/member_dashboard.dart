import 'package:flutter/material.dart';
import 'package:fingermobile_app/services\content_service.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class MemberDashboard extends StatefulWidget {
  @override
  _MemberDashboardState createState() => _MemberDashboardState();
}

class _MemberDashboardState extends State<MemberDashboard> {
  late Future<List<ContentItem>> _feedFuture;

  @override
  void initState() {
    super.initState();
    _feedFuture = ContentService.getRecentContent();
  }

  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Member Dashboard',
      child: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Quick stats
            Container(
              height: 120,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _buildQuickStat('Following', '124', Icons.people),
                  _buildQuickStat('Followers', '842', Icons.person),
                  _buildQuickStat('Posts', '36', Icons.article),
                  _buildQuickStat('Likes', '1.2K', Icons.favorite),
                ],
              ),
            ),
            
            SizedBox(height: 20),
            
            // Feed section
            Text(
              'Recent Activity',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 10),
            
            FutureBuilder<List<ContentItem>>(
              future: _feedFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(child: CircularProgressIndicator());
                }
                if (snapshot.hasError) {
                  return Center(child: Text('Error loading activity'));
                }
                if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Center(child: Text('No recent activity'));
                }
                
                final activities = snapshot.data!;
                return ListView.builder(
                  shrinkWrap: true,
                  physics: NeverScrollableScrollPhysics(),
                  itemCount: activities.length,
                  itemBuilder: (context, index) {
                    final activity = activities[index];
                    return Card(
                      child: Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                CircleAvatar(
                                  backgroundImage: NetworkImage(activity.imageUrl),
                                ),
                                SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        activity.title,
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                        ),
                                      ),
                                      Text(
                                        activity.description,
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
                                  activity.type.toUpperCase(),
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.blue,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                                Text(
                                  '${activity.createdAt.day}/${activity.createdAt.month}',
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.grey[500],
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 12),
                            Row(
                              children: [
                                IconButton(
                                  icon: Icon(Icons.favorite_border),
                                  onPressed: () {},
                                ),
                                Text('12'),
                                SizedBox(width: 16),
                                IconButton(
                                  icon: Icon(Icons.comment_outlined),
                                  onPressed: () {},
                                ),
                                Text('5'),
                                SizedBox(width: 16),
                                IconButton(
                                  icon: Icon(Icons.share_outlined),
                                  onPressed: () {},
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

  Widget _buildQuickStat(String title, String value, IconData icon) {
    return Container(
      width: 140,
      margin: EdgeInsets.only(right: 12),
      child: Card(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(icon, color: Colors.green),
                  SizedBox(width: 8),
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
              SizedBox(height: 8),
              Text(
                value,
                style: TextStyle(
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