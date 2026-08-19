import 'package:flutter/material.dart';
import 'package:fingermobile_app/models/member.dart';

class memberCard extends StatelessWidget {
  final member member;
  final VoidCallback? onTap;
  final VoidCallback? onFollow;
  final bool isFollowing;

  const memberCard({
    super.key,
    required this.member,
    this.onTap,
    this.onFollow,
    this.isFollowing = false,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            CircleAvatar(
              radius: 30,
              backgroundImage: member.avatarUrl != null ? NetworkImage(member.avatarUrl!) : null,
              child: member.avatarUrl == null ? Text(member.name.substring(0, 1).toUpperCase()) : null,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    member.name,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  if (member.email != null)
                    Text(
                      member.email!,
                      style: const TextStyle(
                        color: Colors.grey,
                        fontSize: 14,
                      ),
                    ),
                  if (member.location != null)
                    Text(
                      member.location!,
                      style: const TextStyle(
                        color: Colors.grey,
                        fontSize: 14,
                      ),
                    ),
                ],
              ),
            ),
            FilledButton(
              onPressed: onFollow,
              child: Text(isFollowing ? 'Following' : 'Follow'),
            ),
          ],
        ),
      ),
    );
  }
}
