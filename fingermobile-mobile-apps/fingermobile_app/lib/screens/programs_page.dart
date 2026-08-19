import 'package:flutter/material.dart';

class ProgramsPage extends StatefulWidget {
  const ProgramsPage({super.key});

  @override
  State<ProgramsPage> createState() => _ProgramsPageState();
}

class _ProgramsPageState extends State<ProgramsPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<Program> _programs = [];
  List<ProgramCategory> _categories = [];
  String _selectedCategory = 'all';
  ProgramSortOption _sortOption = ProgramSortOption.name;

  @override
  void initState() {
    super.initState();
    _loadPrograms();
  }

  Future<void> _loadPrograms() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock categories
      setState(() {
        _categories = [
          ProgramCategory(id: 'all', name: 'All Programs'),
          ProgramCategory(id: 'education', name: 'Education'),
          ProgramCategory(id: 'health', name: 'Health & Wellness'),
          ProgramCategory(id: 'technology', name: 'Technology'),
          ProgramCategory(id: 'business', name: 'Business'),
          ProgramCategory(id: 'arts', name: 'Arts & Culture'),
        ];

        // Mock programs
        _programs = [
          Program(
            id: 1,
            name: 'Digital Marketing Mastery',
            description: 'Learn advanced digital marketing strategies to grow your business online',
            category: 'business',
            duration: 45, // in days
            level: ProgramLevel.intermediate,
            price: 199.99,
            originalPrice: 299.99,
            currency: 'USD',
            rating: 4.8,
            reviewCount: 245,
            enrolledCount: 1250,
            imageUrl: 'https://via.placeholder.com/400x200/4ECDC4/FFFFFF?text=Marketing',
            instructor: 'Jane Smith',
            instructorBio: '10+ years experience in digital marketing',
            startDate: DateTime.now().add(const Duration(days: 5)),
            endDate: DateTime.now().add(const Duration(days: 50)),
            isFeatured: true,
            isNew: false,
            tags: ['marketing', 'digital', 'business'],
          ),
          Program(
            id: 2,
            name: 'Mobile App Development',
            description: 'Build professional mobile apps using Flutter and Dart',
            category: 'technology',
            duration: 60, // in days
            level: ProgramLevel.advanced,
            price: 249.99,
            originalPrice: 349.99,
            currency: 'USD',
            rating: 4.9,
            reviewCount: 189,
            enrolledCount: 890,
            imageUrl: 'https://via.placeholder.com/400x200/FF6B6B/FFFFFF?text=Mobile+Apps',
            instructor: 'John Doe',
            instructorBio: 'Senior mobile developer with 15+ years experience',
            startDate: DateTime.now().add(const Duration(days: 10)),
            endDate: DateTime.now().add(const Duration(days: 70)),
            isFeatured: true,
            isNew: true,
            tags: ['flutter', 'mobile', 'development'],
          ),
          Program(
            id: 3,
            name: 'Mindfulness & Meditation',
            description: 'Reduce stress and improve focus through mindfulness techniques',
            category: 'health',
            duration: 30, // in days
            level: ProgramLevel.beginner,
            price: 89.99,
            originalPrice: 129.99,
            currency: 'USD',
            rating: 4.6,
            reviewCount: 312,
            enrolledCount: 2100,
            imageUrl: 'https://via.placeholder.com/400x200/45B7D1/FFFFFF?text=Mindfulness',
            instructor: 'Emma Wilson',
            instructorBio: 'Certified mindfulness instructor with 8+ years experience',
            startDate: DateTime.now().add(const Duration(days: 3)),
            endDate: DateTime.now().add(const Duration(days: 33)),
            isFeatured: false,
            isNew: false,
            tags: ['mindfulness', 'meditation', 'wellness'],
          ),
          Program(
            id: 4,
            name: 'Creative Writing Workshop',
            description: 'Unlock your creativity and develop your writing skills',
            category: 'arts',
            duration: 40, // in days
            level: ProgramLevel.beginner,
            price: 129.99,
            originalPrice: 179.99,
            currency: 'USD',
            rating: 4.7,
            reviewCount: 156,
            enrolledCount: 650,
            imageUrl: 'https://via.placeholder.com/400x200/96CEB4/FFFFFF?text=Writing',
            instructor: 'Michael Brown',
            instructorBio: 'Published author and creative writing professor',
            startDate: DateTime.now().add(const Duration(days: 15)),
            endDate: DateTime.now().add(const Duration(days: 55)),
            isFeatured: false,
            isNew: true,
            tags: ['writing', 'creativity', 'literature'],
          ),
          Program(
            id: 5,
            name: 'Financial Planning Basics',
            description: 'Learn how to budget, save, and invest for your future',
            category: 'business',
            duration: 35, // in days
            level: ProgramLevel.beginner,
            price: 99.99,
            originalPrice: 149.99,
            currency: 'USD',
            rating: 4.5,
            reviewCount: 198,
            enrolledCount: 1420,
            imageUrl: 'https://via.placeholder.com/400x200/FFEAA7/000000?text=Finance',
            instructor: 'Sarah Johnson',
            instructorBio: 'Certified financial planner with 12+ years experience',
            startDate: DateTime.now().add(const Duration(days: 7)),
            endDate: DateTime.now().add(const Duration(days: 42)),
            isFeatured: false,
            isNew: false,
            tags: ['finance', 'planning', 'investment'],
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load programs. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _selectCategory(String categoryId) {
    setState(() {
      _selectedCategory = categoryId;
    });
  }

  void _changeSort(ProgramSortOption option) {
    setState(() {
      _sortOption = option;
    });
  }

  void _enrollInProgram(Program program) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Enrolling in ${program.name}'),
        backgroundColor: Theme.of(context).primaryColor,
      ),
    );
  }

  void _viewProgram(Program program) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildProgramDetailsSheet(program),
    );
  }

  Widget _buildProgramDetailsSheet(Program program) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  program.name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            height: 150,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(program.imageUrl),
                fit: BoxFit.cover,
              ),
              borderRadius: BorderRadius.circular(12),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: _getLevelColor(program.level),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  _getLevelText(program.level),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              if (program.isNew)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.green,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Text(
                    'New',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 12,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            program.description,
            style: const TextStyle(
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              const Icon(Icons.person, size: 16, color: Colors.grey),
              const SizedBox(width: 4),
              Text('${program.instructor} - ${program.instructorBio}'),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.calendar_today, size: 16, color: Colors.grey),
              const SizedBox(width: 4),
              Text('${_formatDate(program.startDate)} - ${_formatDate(program.endDate)}'),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.access_time, size: 16, color: Colors.grey),
              const SizedBox(width: 4),
              Text('${program.duration} days'),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.group, size: 16, color: Colors.grey),
              const SizedBox(width: 4),
              Text('${program.enrolledCount} enrolled'),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.star, size: 16, color: Colors.amber),
              const SizedBox(width: 4),
              Text('${program.rating} (${program.reviewCount} reviews)'),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (program.originalPrice > program.price)
                    Text(
                      '\$${program.originalPrice.toStringAsFixed(2)}',
                      style: const TextStyle(
                        decoration: TextDecoration.lineThrough,
                        color: Colors.grey,
                        fontSize: 14,
                      ),
                    ),
                  Text(
                    '\$${program.price.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 20,
                      color: Colors.blue,
                    ),
                  ),
                ],
              ),
              SizedBox(
                width: 150,
                child: ElevatedButton(
                  onPressed: () => _enrollInProgram(program),
                  child: const Text('Enroll Now'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Programs'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Show search
            },
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              // Show filter options
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadPrograms,
        child: _isLoading && _programs.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _programs.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadPrograms,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Categories
                        SizedBox(
                          height: 40,
                          child: ListView.builder(
                            scrollDirection: Axis.horizontal,
                            itemCount: _categories.length,
                            itemBuilder: (context, index) {
                              var category = _categories[index];
                              bool isSelected = _selectedCategory == category.id;

                              return Padding(
                                padding: EdgeInsets.only(
                                  right: 8.0,
                                  left: index == 0 ? 0 : 8.0,
                                ),
                                child: FilterChip(
                                  label: Text(category.name),
                                  selected: isSelected,
                                  onSelected: (selected) {
                                    _selectCategory(category.id);
                                  },
                                  selectedColor: Theme.of(context).primaryColor,
                                  showCheckmark: false,
                                ),
                              );
                            },
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Sort and Results Info
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              '${_programs.length} programs',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            PopupMenuButton<ProgramSortOption>(
                              icon: const Icon(Icons.sort),
                              onSelected: _changeSort,
                              itemBuilder: (BuildContext context) {
                                return [
                                  const PopupMenuItem(
                                    value: ProgramSortOption.name,
                                    child: Text('Name (A-Z)'),
                                  ),
                                  const PopupMenuItem(
                                    value: ProgramSortOption.priceLow,
                                    child: Text('Price (Low to High)'),
                                  ),
                                  const PopupMenuItem(
                                    value: ProgramSortOption.priceHigh,
                                    child: Text('Price (High to Low)'),
                                  ),
                                  const PopupMenuItem(
                                    value: ProgramSortOption.rating,
                                    child: Text('Rating'),
                                  ),
                                  const PopupMenuItem(
                                    value: ProgramSortOption.newest,
                                    child: Text('Newest'),
                                  ),
                                ];
                              },
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        // Programs List
                        Expanded(
                          child: ListView.builder(
                            itemCount: _programs.length,
                            itemBuilder: (context, index) {
                              var program = _programs[index];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 16),
                                child: InkWell(
                                  onTap: () => _viewProgram(program),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Stack(
                                        children: [
                                          Container(
                                            height: 150,
                                            decoration: BoxDecoration(
                                              image: DecorationImage(
                                                image: NetworkImage(program.imageUrl),
                                                fit: BoxFit.cover,
                                              ),
                                            ),
                                          ),
                                          if (program.isFeatured)
                                            Positioned(
                                              top: 8,
                                              left: 8,
                                              child: Container(
                                                padding: const EdgeInsets.symmetric(
                                                    horizontal: 8, vertical: 4),
                                                decoration: BoxDecoration(
                                                  color: Colors.red,
                                                  borderRadius: BorderRadius.circular(12),
                                                ),
                                                child: const Text(
                                                  'Featured',
                                                  style: TextStyle(
                                                    color: Colors.white,
                                                    fontSize: 12,
                                                  ),
                                                ),
                                              ),
                                            ),
                                          if (program.isNew)
                                            Positioned(
                                              top: 8,
                                              right: 8,
                                              child: Container(
                                                padding: const EdgeInsets.symmetric(
                                                    horizontal: 8, vertical: 4),
                                                decoration: BoxDecoration(
                                                  color: Colors.green,
                                                  borderRadius: BorderRadius.circular(12),
                                                ),
                                                child: const Text(
                                                  'New',
                                                  style: TextStyle(
                                                    color: Colors.white,
                                                    fontSize: 12,
                                                  ),
                                                ),
                                              ),
                                            ),
                                        ],
                                      ),
                                      Padding(
                                        padding: const EdgeInsets.all(16.0),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                              children: [
                                                Expanded(
                                                  child: Text(
                                                    program.name,
                                                    style: const TextStyle(
                                                      fontWeight: FontWeight.bold,
                                                      fontSize: 18,
                                                    ),
                                                  ),
                                                ),
                                                Container(
                                                  padding: const EdgeInsets.symmetric(
                                                      horizontal: 12, vertical: 6),
                                                  decoration: BoxDecoration(
                                                    color: _getLevelColor(program.level),
                                                    borderRadius: BorderRadius.circular(12),
                                                  ),
                                                  child: Text(
                                                    _getLevelText(program.level),
                                                    style: const TextStyle(
                                                      color: Colors.white,
                                                      fontSize: 12,
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                            Text(
                                              program.description,
                                              style: const TextStyle(
                                                color: Colors.grey,
                                              ),
                                              maxLines: 2,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            const SizedBox(height: 16),
                                            Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                              children: [
                                                Column(
                                                  crossAxisAlignment: CrossAxisAlignment.start,
                                                  children: [
                                                    Row(
                                                      children: [
                                                        const Icon(
                                                          Icons.star,
                                                          size: 16,
                                                          color: Colors.amber,
                                                        ),
                                                        Text('${program.rating}'),
                                                      ],
                                                    ),
                                                    const SizedBox(height: 4),
                                                    Text(
                                                      '${program.enrolledCount} enrolled',
                                                      style: const TextStyle(
                                                        fontSize: 12,
                                                        color: Colors.grey,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                Column(
                                                  crossAxisAlignment: CrossAxisAlignment.end,
                                                  children: [
                                                    if (program.originalPrice > program.price)
                                                      Text(
                                                        '\$${program.originalPrice.toStringAsFixed(2)}',
                                                        style: const TextStyle(
                                                          decoration: TextDecoration.lineThrough,
                                                          color: Colors.grey,
                                                          fontSize: 12,
                                                        ),
                                                      ),
                                                    Text(
                                                      '\$${program.price.toStringAsFixed(2)}',
                                                      style: const TextStyle(
                                                        fontWeight: FontWeight.bold,
                                                        color: Colors.blue,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 16),
                                            SizedBox(
                                              width: double.infinity,
                                              child: ElevatedButton(
                                                onPressed: () => _enrollInProgram(program),
                                                child: const Text('Enroll Now'),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
      ),
    );
  }

  Color _getLevelColor(ProgramLevel level) {
    switch (level) {
      case ProgramLevel.beginner:
        return Colors.green;
      case ProgramLevel.intermediate:
        return Colors.orange;
      case ProgramLevel.advanced:
        return Colors.red;
    }
  }

  String _getLevelText(ProgramLevel level) {
    switch (level) {
      case ProgramLevel.beginner:
        return 'Beginner';
      case ProgramLevel.intermediate:
        return 'Intermediate';
      case ProgramLevel.advanced:
        return 'Advanced';
    }
  }

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
  }
}

enum ProgramSortOption { name, priceLow, priceHigh, rating, newest }
enum ProgramLevel { beginner, intermediate, advanced }

class ProgramCategory {
  final String id;
  final String name;

  ProgramCategory({
    required this.id,
    required this.name,
  });
}

class Program {
  final int id;
  final String name;
  final String description;
  final String category;
  final int duration; // in days
  final ProgramLevel level;
  final double price;
  final double originalPrice;
  final String currency;
  final double rating;
  final int reviewCount;
  final int enrolledCount;
  final String imageUrl;
  final String instructor;
  final String instructorBio;
  final DateTime startDate;
  final DateTime endDate;
  final bool isFeatured;
  final bool isNew;
  final List<String> tags;

  Program({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    required this.duration,
    required this.level,
    required this.price,
    required this.originalPrice,
    required this.currency,
    required this.rating,
    required this.reviewCount,
    required this.enrolledCount,
    required this.imageUrl,
    required this.instructor,
    required this.instructorBio,
    required this.startDate,
    required this.endDate,
    required this.isFeatured,
    required this.isNew,
    required this.tags,
  });
}