import 'package:flutter/material.dart';
import 'package:fingermobile_app/models/member.dart';

class memberProfileWidget extends StatelessWidget {
  final member member;

  const memberProfileWidget({super.key, required this.member});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (member.avatar != null)
              CircleAvatar(
                backgroundImage: NetworkImage(member.avatar!),
                radius: 30,
              )
            else
              const CircleAvatar(
                radius: 30,
                child: Icon(Icons.person),
              ),
            const SizedBox(height: 16),
            Text(
              member.name,
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),
            Text(
              member.email,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: Colors.grey[600],
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              'Member since: ${member.createdAt.toString().split(' ')[0]}',
              style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: Colors.grey[500],
                  ),
            ),
          ],
        ),
      ),
    );
  }
}