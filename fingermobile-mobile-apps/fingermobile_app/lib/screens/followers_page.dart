import 'package:flutter/material.dart';

class FollowersPage extends StatefulWidget {
  final String type; // 'followers' or 'following'

  FollowersPage({required this.type});

  @override
  _FollowersPageState createState() => _FollowersPageState();
}

class _FollowersPageState extends State<FollowersPage> {
  final List<Map<String, dynamic>> _members = [
    {
      'id': 1,
      'name': 'Alex Johnson',
      'membername': '@alexj',
      'isVerified': true,
      'isFollowing': false,
    },
    {
      'id': 2,
      'name': 'Sarah Williams',
      'membername': '@sarahw',
      'isVerified': false,
      'isFollowing': true,
    },
    {
      'id': 3,
      'name': 'Tech Enthusiast',
      'membername': '@techenthusiast',
      'isVerified': true,
      'isFollowing': false,
    },
    {
      'id': 4,
      'name': 'Design Studio',
      'membername': '@designstudio',
      'isVerified': false,
      'isFollowing': true,
    },
    {
      'id': 5,
      'name': 'Mobile Developer',
      'membername': '@mobdev',
      'isVerified': true,
      'isFollowing': false,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.type == 'followers' ? 'Followers' : 'Following'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.type == 'followers' 
                  ? 'People who follow you' 
                  : 'People you follow',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: _members.length,
                itemBuilder: (context, index) {
                  final member = _members[index];
                  return Card(
                    elevation: 1,
                    margin: EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: Colors.purple[100],
                        child: Text(
                          member['name'].split(' ').map((n) => n[0]).take(2).join(),
                          style: TextStyle(color: Colors.deepPurple),
                        ),
                      ),
                      title: Row(
                        children: [
                          Text(member['name']),
                          if (member['isVerified'])
                            Icon(
                              Icons.verified,
                              color: Colors.blue,
                              size: 16,
                            ),
                        ],
                      ),
                      subtitle: Text(member['membername']),
                      trailing: widget.type == 'followers'
                          ? OutlinedButton(
                              onPressed: () {
                                setState(() {
                                  member['isFollowing'] = !member['isFollowing'];
                                });
                              },
                              style: OutlinedButton.styleFrom(
                                side: BorderSide(
                                  color: member['isFollowing'] 
                                      ? Colors.grey 
                                      : Colors.deepPurple,
                                ),
                                foregroundColor: member['isFollowing'] 
                                    ? Colors.grey 
                                    : Colors.deepPurple,
                              ),
                              child: Text(
                                member['isFollowing'] ? 'Following' : 'Follow',
                              ),
                            )
                          : null,
                      onTap: () {
                        // Navigate to member profile
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}