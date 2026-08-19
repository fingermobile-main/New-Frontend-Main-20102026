class PageCategory {
  final String id;
  final String name;
  final String icon;
  final List<SubCategory> subCategories;

  PageCategory({
    required this.id,
    required this.name,
    required this.icon,
    required this.subCategories,
  });
}

class SubCategory {
  final String id;
  final String name;
  final String route;
  final String description;

  SubCategory({
    required this.id,
    required this.name,
    required this.route,
    required this.description,
  });
}