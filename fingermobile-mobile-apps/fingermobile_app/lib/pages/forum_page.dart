import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets/page_template.dart';
import 'package:fingermobile_app/widgets/loading_spinner.dart';
import 'package:fingermobile_app/widgets/error_message.dart';
import 'package:fingermobile_app/models/post.dart';
import 'package:fingermobile_app/widgets/post_card.dart';

// Placeholder for the useForumPosts hook equivalent
class ForumPostsData {
  final List<Post> forumPosts;
  final bool loading;
  final String? error;
  final VoidCallback refreshData;

  ForumPostsData({
    required this.forumPosts,
    required this.loading,
    this.error,
    required this.refreshData,
  });
}

// Placeholder for the actual data fetching logic
ForumPostsData useForumPosts() {
  // This will be replaced with actual data fetching logic later
  return ForumPostsData(
    forumPosts: [
      Post(id: '1', content: 'This is the first post!', author: 'member1', timestamp: DateTime.now().subtract(const Duration(hours: 2))),
      Post(id: '2', content: 'Another interesting discussion.', author: 'member2', timestamp: DateTime.now().subtract(const Duration(hours: 1))),
    ],
    loading: false,
    error: null,
    refreshData: () => {},
  );
}

class ForumPage extends StatelessWidget {
  const ForumPage({super.key});

  @override
  Widget build(BuildContext context) {
    final forumPostsData = useForumPosts();

    if (forumPostsData.loading) {
      return PageTemplate(
        title: 'Community Forum',
        child: Center(
          child: LoadingSpinner(),
        ),
      );
    }

    if (forumPostsData.error != null) {
      return PageTemplate(
        title: 'Community Forum',
        child: ErrorMessage(
          message: forumPostsData.error!,
          onRetry: forumPostsData.refreshData,
        ),
      );
    }

    return PageTemplate(
      title: 'Community Forum',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Welcome to the Community Forum',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(color: Colors.white),
                ),
                const SizedBox(height: 8.0),
                Text(
                  'Connect with other members, share ideas, and participate in discussions.',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: Colors.grey[400]),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: forumPostsData.forumPosts.length,
              itemBuilder: (context, index) {
                final post = forumPostsData.forumPosts[index];
                return PostCard(
                  post: post,
                  onTap: () {},
                  onLike: () {},
                  onComment: () {},
                  onShare: () {},
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
