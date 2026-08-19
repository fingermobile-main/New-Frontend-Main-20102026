class Member {
  final int? id;
  final String? username;
  final String? firstName;
  final String? lastName;
  final String? email;
  final String? bio;
  final String? location;
  final String? profileImageUrl;
  final bool? isVerified;
  final int? followersCount;
  final int? followingCount;
  final int? postsCount;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  Member({
    this.id,
    this.username,
    this.firstName,
    this.lastName,
    this.email,
    this.bio,
    this.location,
    this.profileImageUrl,
    this.isVerified,
    this.followersCount,
    this.followingCount,
    this.postsCount,
    this.createdAt,
    this.updatedAt,
  });

  factory Member.fromJson(Map<String, dynamic> json) {
    return Member(
      id: json['id'] as int?,
      username: json['username'] as String?,
      firstName: json['first_name'] as String?,
      lastName: json['last_name'] as String?,
      email: json['email'] as String?,
      bio: json['bio'] as String?,
      location: json['location'] as String?,
      profileImageUrl: json['profile_image_url'] as String?,
      isVerified: json['is_verified'] as bool? ?? false,
      followersCount: json['followers_count'] as int? ?? 0,
      followingCount: json['following_count'] as int? ?? 0,
      postsCount: json['posts_count'] as int? ?? 0,
      createdAt: json['created_at'] != null ? DateTime.tryParse(json['created_at']) : null,
      updatedAt: json['updated_at'] != null ? DateTime.tryParse(json['updated_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'username': username,
      'first_name': firstName,
      'last_name': lastName,
      'email': email,
      'bio': bio,
      'location': location,
      'profile_image_url': profileImageUrl,
      'is_verified': isVerified,
      'followers_count': followersCount,
      'following_count': followingCount,
      'posts_count': postsCount,
      'created_at': createdAt?.toIso8601String(),
      'updated_at': updatedAt?.toIso8601String(),
    };
  }
}