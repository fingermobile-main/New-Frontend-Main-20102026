class Post {
  final int id;
  final int memberId;
  final String membername;
  final String? profileImageUrl;
  final String content;
  final List<String>? mediaUrls;
  final String postType;
  final String privacyLevel;
  final DateTime createdAt;
  final int likesCount;
  final int commentsCount;
  final int sharesCount;

  Post({
    required this.id,
    required this.memberId,
    required this.membername,
    this.profileImageUrl,
    required this.content,
    this.mediaUrls,
    this.postType = 'text',
    this.privacyLevel = 'public',
    required this.createdAt,
    this.likesCount = 0,
    this.commentsCount = 0,
    this.sharesCount = 0,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'] ?? 0,
      memberId: json['member_id'] ?? json['memberId'] ?? 0,
      membername: json['membername'] ?? '',
      profileImageUrl: json['profile_image_url'] ?? json['profileImageUrl'],
      content: json['content'] ?? '',
      mediaUrls: (json['media_urls'] ?? json['mediaUrls'] as List<dynamic>?)
          ?.map((url) => url.toString())
          .toList(),
      postType: json['post_type'] ?? json['postType'] ?? 'text',
      privacyLevel: json['privacy_level'] ?? json['privacyLevel'] ?? 'public',
      createdAt: DateTime.tryParse(json['created_at'] ?? json['createdAt'] ?? '') ?? DateTime.now(),
      likesCount: json['likes_count'] ?? json['likesCount'] ?? 0,
      commentsCount: json['comments_count'] ?? json['commentsCount'] ?? 0,
      sharesCount: json['shares_count'] ?? json['sharesCount'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'member_id': memberId,
      'membername': membername,
      'profile_image_url': profileImageUrl,
      'content': content,
      'media_urls': mediaUrls,
      'post_type': postType,
      'privacy_level': privacyLevel,
      'created_at': createdAt.toIso8601String(),
      'likes_count': likesCount,
      'comments_count': commentsCount,
      'shares_count': sharesCount,
    };
  }
}