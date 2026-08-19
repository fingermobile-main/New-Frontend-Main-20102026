import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/app_provider.dart';

class ProfileScreen extends StatefulWidget {
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final appProvider = Provider.of<AppProvider>(context, listen: false);
      appProvider.loadCurrentUser();
    });
  }

  @override
  Widget build(BuildContext context) {
    final appProvider = Provider.of<AppProvider>(context);
    
    return Scaffold(
      appBar: AppBar(
        title: Text('Profile'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: () {
              Navigator.pushNamed(context, '/settings');
            },
          ),
        ],
      ),
      body: appProvider.currentUser == null
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  children: [
                    // Profile header
                    Card(
                      elevation: 4,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Padding(
                        padding: EdgeInsets.all(24),
                        child: Column(
                          children: [
                            CircleAvatar(
                              radius: 50,
                              backgroundImage: appProvider.currentUser!['avatar'] != null
                                  ? NetworkImage(appProvider.currentUser!['avatar'])
                                  : null,
                              child: appProvider.currentUser!['avatar'] == null
                                  ? Icon(
                                      Icons.person,
                                      size: 50,
                                      color: Colors.grey[400],
                                    )
                                  : null,
                            ),
                            SizedBox(height: 16),
                            Text(
                              appProvider.currentUser!['username'] ?? 'User',
                              style: TextStyle(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 8),
                            Text(
                              appProvider.currentUser!['email'] ?? '',
                              style: TextStyle(
                                color: Colors.grey[600],
                              ),
                            ),
                            SizedBox(height: 16),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                Column(
                                  children: [
                                    Text(
                                      '${appProvider.currentUser!['posts_count'] ?? 0}',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      'Posts',
                                      style: TextStyle(color: Colors.grey[600]),
                                    ),
                                  ],
                                ),
                                Column(
                                  children: [
                                    Text(
                                      '${appProvider.currentUser!['followers_count'] ?? 0}',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      'Followers',
                                      style: TextStyle(color: Colors.grey[600]),
                                    ),
                                  ],
                                ),
                                Column(
                                  children: [
                                    Text(
                                      '${appProvider.currentUser!['following_count'] ?? 0}',
                                      style: TextStyle(
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      'Following',
                                      style: TextStyle(color: Colors.grey[600]),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ),
                    
                    SizedBox(height: 16),
                    
                    // Profile actions
                    Wrap(
                      spacing: 12,
                      runSpacing: 12,
                      children: [
                        ActionChip(
                          label: Text('Edit Profile'),
                          avatar: Icon(Icons.edit),
                          onPressed: () {
                            Navigator.pushNamed(context, '/edit_profile');
                          },
                        ),
                        ActionChip(
                          label: Text('Privacy'),
                          avatar: Icon(Icons.privacy_tip),
                          onPressed: () {
                            Navigator.pushNamed(context, '/privacy');
                          },
                        ),
                        ActionChip(
                          label: Text('Achievements'),
                          avatar: Icon(Icons.star),
                          onPressed: () {
                            Navigator.pushNamed(context, '/achievements');
                          },
                        ),
                        ActionChip(
                          label: Text('Friends'),
                          avatar: Icon(Icons.people),
                          onPressed: () {
                            Navigator.pushNamed(context, '/friends');
                          },
                        ),
                        ActionChip(
                          label: Text('Monetization'),
                          avatar: Icon(Icons.monetization_on),
                          onPressed: () {
                            Navigator.pushNamed(context, '/monetization');
                          },
                        ),
                        ActionChip(
                          label: Text('Saved Posts'),
                          avatar: Icon(Icons.bookmark),
                          onPressed: () {
                            Navigator.pushNamed(context, '/saved');
                          },
                        ),
                      ],
                    ),
                    
                    SizedBox(height: 24),
                    
                    // Stats section
                    Card(
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'About',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 8),
                            Text(
                              appProvider.currentUser!['bio'] ?? 'No bio available',
                              style: TextStyle(
                                fontSize: 16,
                                color: Colors.grey[700],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    
                    SizedBox(height: 16),
                    
                    // Logout button
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        onPressed: () async {
                          showDialog(
                            context: context,
                            builder: (BuildContext dialogContext) {
                              return AlertDialog(
                                title: Text('Confirm Logout'),
                                content: Text('Are you sure you want to log out?'),
                                actions: [
                                  TextButton(
                                    onPressed: () {
                                      Navigator.of(dialogContext).pop();
                                    },
                                    child: Text('Cancel'),
                                  ),
                                  TextButton(
                                    onPressed: () async {
                                      Navigator.of(dialogContext).pop();
                                      await appProvider.logout();
                                      Navigator.pushReplacementNamed(context, '/');
                                    },
                                    child: Text(
                                      'Logout',
                                      style: TextStyle(color: Colors.red),
                                    ),
                                  ),
                                ],
                              );
                            },
                          );
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                          foregroundColor: Colors.white,
                        ),
                        child: Text('Logout'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}