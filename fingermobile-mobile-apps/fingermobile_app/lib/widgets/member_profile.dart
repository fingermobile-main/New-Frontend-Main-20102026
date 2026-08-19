import 'package:flutter/material.dart';
import '../models/member.dart';

Widget memberProfileWidget({required Member member}) {
  return Card(
    elevation: 4,
    child: Padding(
      padding: EdgeInsets.all(16),
      child: Row(
        children: [
          CircleAvatar(
            radius: 35,
            backgroundImage: member.profileImageUrl != null
                ? NetworkImage(member.profileImageUrl!)
                : null,
            child: member.profileImageUrl == null
                ? Icon(Icons.person, size: 35)
                : null,
            backgroundColor: Colors.grey[300],
          ),
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        member.username ?? 'Unknown User',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    if (member.isVerified == true)
                      Padding(
                        padding: EdgeInsets.only(left: 8),
                        child: Icon(
                          Icons.verified,
                          color: Colors.blue,
                          size: 20,
                        ),
                      ),
                  ],
                ),
                if (member.firstName != null || member.lastName != null)
                  Text(
                    '${member.firstName ?? ''} ${member.lastName ?? ''}'.trim(),
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                if (member.location != null)
                  Row(
                    children: [
                      Icon(
                        Icons.location_on,
                        size: 16,
                        color: Colors.grey,
                      ),
                      SizedBox(width: 4),
                      Text(
                        member.location!,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStatItem(
                      member.postsCount?.toString() ?? '0',
                      'Posts',
                    ),
                    _buildStatItem(
                      member.followersCount?.toString() ?? '0',
                      'Followers',
                    ),
                    _buildStatItem(
                      member.followingCount?.toString() ?? '0',
                      'Following',
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
}

Widget _buildStatItem(String count, String label) {
  return Column(
    children: [
      Text(
        count,
        style: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.bold,
        ),
      ),
      Text(
        label,
        style: TextStyle(
          fontSize: 12,
          color: Colors.grey[600],
        ),
      ),
    ],
  );
}