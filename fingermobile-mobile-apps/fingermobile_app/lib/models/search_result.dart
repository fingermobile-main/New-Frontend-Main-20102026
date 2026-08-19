class SearchResult {
  final String id;
  final String title;
  final String type;
  final String? avatarUrl;
  final String? description;

  SearchResult({
    required this.id,
    required this.title,
    required this.type,
    this.avatarUrl,
    this.description,
  });

  factory SearchResult.fromJson(Map<String, dynamic> json) {
    return SearchResult(
      id: json['id'] as String,
      title: json['title'] as String,
      type: json['type'] as String,
      avatarUrl: json['avatar_url'] as String?,
      description: json['description'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'type': type,
      'avatar_url': avatarUrl,
      'description': description,
    };
  }
}