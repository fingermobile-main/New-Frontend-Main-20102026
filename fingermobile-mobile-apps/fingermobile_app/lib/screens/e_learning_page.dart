import 'package:flutter/material.dart';

class ELearningPage extends StatefulWidget {
  const ELearningPage({super.key});

  @override
  State<ELearningPage> createState() => _ELearningPageState();
}

class _ELearningPageState extends State<ELearningPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<LearningCategory> _categories = [];
  List<LearningCourse> _featuredCourses = [];
  List<LearningCourse> _myCourses = [];
  List<LearningPath> _learningPaths = [];
  String _selectedCategory = 'all';
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadLearningData();
  }

  Future<void> _loadLearningData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock learning data
      setState(() {
        _categories = [
          LearningCategory(id: 'all', name: 'All Courses'),
          LearningCategory(id: 'programming', name: 'Programming'),
          LearningCategory(id: 'design', name: 'Design'),
          LearningCategory(id: 'business', name: 'Business'),
          LearningCategory(id: 'marketing', name: 'Marketing'),
          LearningCategory(id: 'data', name: 'Data Science'),
        ];

        _featuredCourses = [
          LearningCourse(
            id: 1,
            title: 'Advanced Flutter Development',
            instructor: 'Alex Johnson',
            rating: 4.8,
            students: 12540,
            duration: '8 weeks',
            level: 'Advanced',
            price: 89.99,
            thumbnailUrl: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Flutter+Course',
            category: 'programming',
            progress: 0,
          ),
          LearningCourse(
            id: 2,
            title: 'UI/UX Design Principles',
            instructor: 'Sarah Williams',
            rating: 4.7,
            students: 9800,
            duration: '6 weeks',
            level: 'Intermediate',
            price: 79.99,
            thumbnailUrl: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=UI+UX+Design',
            category: 'design',
            progress: 0,
          ),
          LearningCourse(
            id: 3,
            title: 'Data Analysis with Python',
            instructor: 'Mike Chen',
            rating: 4.9,
            students: 15600,
            duration: '10 weeks',
            level: 'Intermediate',
            price: 99.99,
            thumbnailUrl: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Data+Analysis',
            category: 'data',
            progress: 0,
          ),
        ];

        _myCourses = [
          LearningCourse(
            id: 4,
            title: 'Mobile App Development Basics',
            instructor: 'Emma Rodriguez',
            rating: 4.6,
            students: 8700,
            duration: '6 weeks',
            level: 'Beginner',
            price: 0, // Already enrolled
            thumbnailUrl: 'https://via.placeholder.com/300x200/F9CA24/FFFFFF?text=Mobile+Basics',
            category: 'programming',
            progress: 65,
          ),
          LearningCourse(
            id: 5,
            title: 'Digital Marketing Strategy',
            instructor: 'David Kim',
            rating: 4.5,
            students: 11200,
            duration: '5 weeks',
            level: 'Intermediate',
            price: 0, // Already enrolled
            thumbnailUrl: 'https://via.placeholder.com/300x200/6C5CE7/FFFFFF?text=Marketing',
            category: 'marketing',
            progress: 30,
          ),
        ];

        _learningPaths = [
          LearningPath(
            id: 1,
            title: 'Full Stack Developer',
            courses: 12,
            duration: '24 weeks',
            level: 'Beginner to Advanced',
            description: 'Become a proficient full-stack developer',
            thumbnailUrl: 'https://via.placeholder.com/300x200/A29BFE/FFFFFF?text=Full+Stack',
          ),
          LearningPath(
            id: 2,
            title: 'Data Scientist',
            courses: 10,
            duration: '20 weeks',
            level: 'Intermediate',
            description: 'Master data science and analytics',
            thumbnailUrl: 'https://via.placeholder.com/300x200/FD79A8/FFFFFF?text=Data+Science',
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load learning data. Please try again.';
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('E-Learning'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Open search
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadLearningData,
        child: _isLoading && _categories.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _categories.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadLearningData,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : SingleChildScrollView(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Categories
                          const Text(
                            'Categories',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
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
                          const SizedBox(height: 32),
                          // Tab Bar
                          Container(
                            height: 50,
                            decoration: BoxDecoration(
                              color: Colors.grey.shade100,
                              borderRadius: BorderRadius.circular(25),
                            ),
                            child: Row(
                              children: [
                                _buildTab('Featured', 0),
                                _buildTab('My Courses', 1),
                                _buildTab('Paths', 2),
                              ],
                            ),
                          ),
                          const SizedBox(height: 24),
                          // Tab Content
                          if (_activeTab == 0) ...[
                            // Featured Courses
                            const Text(
                              'Featured Courses',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _featuredCourses.length,
                              itemBuilder: (context, index) {
                                var course = _featuredCourses[index];
                                return _buildCourseCard(course);
                              },
                            ),
                          ] else if (_activeTab == 1) ...[
                            // My Courses
                            const Text(
                              'My Courses',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _myCourses.length,
                              itemBuilder: (context, index) {
                                var course = _myCourses[index];
                                return _buildCourseCard(course);
                              },
                            ),
                          ] else ...[
                            // Learning Paths
                            const Text(
                              'Learning Paths',
                              style: TextStyle(
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 16),
                            ListView.builder(
                              shrinkWrap: true,
                              physics: const NeverScrollableScrollPhysics(),
                              itemCount: _learningPaths.length,
                              itemBuilder: (context, index) {
                                var path = _learningPaths[index];
                                return Card(
                                  margin: const EdgeInsets.only(bottom: 16),
                                  child: Padding(
                                    padding: const EdgeInsets.all(16.0),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            Container(
                                              width: 80,
                                              height: 60,
                                              decoration: BoxDecoration(
                                                image: DecorationImage(
                                                  image: NetworkImage(path.thumbnailUrl),
                                                  fit: BoxFit.cover,
                                                ),
                                                borderRadius: BorderRadius.circular(4),
                                              ),
                                            ),
                                            const SizedBox(width: 16),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    path.title,
                                                    style: const TextStyle(
                                                      fontWeight: FontWeight.bold,
                                                      fontSize: 16,
                                                    ),
                                                  ),
                                                  const SizedBox(height: 4),
                                                  Text(
                                                    '${path.courses} courses • ${path.duration}',
                                                    style: const TextStyle(
                                                      color: Colors.grey,
                                                      fontSize: 12,
                                                    ),
                                                  ),
                                                  const SizedBox(height: 4),
                                                  Text(
                                                    path.level,
                                                    style: const TextStyle(
                                                      color: Colors.grey,
                                                      fontSize: 12,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 16),
                                        Text(
                                          path.description,
                                          style: const TextStyle(
                                            color: Colors.grey,
                                          ),
                                        ),
                                        const SizedBox(height: 16),
                                        SizedBox(
                                          width: double.infinity,
                                          child: ElevatedButton(
                                            onPressed: () {
                                              // Enroll in path
                                            },
                                            child: const Text('Explore Path'),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
      ),
    );
  }

  Widget _buildTab(String title, int index) {
    bool isActive = _activeTab == index;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            _activeTab = index;
          });
        },
        child: Container(
          decoration: BoxDecoration(
            color: isActive ? Theme.of(context).primaryColor : Colors.transparent,
            borderRadius: BorderRadius.circular(25),
          ),
          child: Center(
            child: Text(
              title,
              style: TextStyle(
                fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                color: isActive ? Colors.white : Colors.grey,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildCourseCard(LearningCourse course) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 80,
                  height: 60,
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: NetworkImage(course.thumbnailUrl),
                      fit: BoxFit.cover,
                    ),
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        course.title,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        course.instructor,
                        style: const TextStyle(
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Icon(
                            Icons.star,
                            size: 16,
                            color: Colors.amber,
                          ),
                          const SizedBox(width: 4),
                          Text('${course.rating}'),
                          const SizedBox(width: 16),
                          Icon(
                            Icons.people,
                            size: 16,
                            color: Colors.grey,
                          ),
                          const SizedBox(width: 4),
                          Text('${course.students}'),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '${course.duration} • ${course.level}',
                  style: const TextStyle(
                    color: Colors.grey,
                    fontSize: 12,
                  ),
                ),
                if (course.progress > 0)
                  Text(
                    '${course.progress}% complete',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.green,
                    ),
                  )
                else
                  Text(
                    '\$${course.price.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
              ],
            ),
            if (course.progress > 0)
              Padding(
                padding: const EdgeInsets.only(top: 8.0),
                child: LinearProgressIndicator(
                  value: course.progress / 100,
                  backgroundColor: Colors.grey.shade300,
                  valueColor: const AlwaysStoppedAnimation<Color>(Colors.green),
                ),
              ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      // View course details
                    },
                    child: const Text('Details'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      if (course.progress > 0) {
                        // Continue course
                      } else {
                        // Enroll in course
                      }
                    },
                    child: Text(
                      course.progress > 0 ? 'Continue' : 'Enroll',
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class LearningCategory {
  final String id;
  final String name;

  LearningCategory({
    required this.id,
    required this.name,
  });
}

class LearningCourse {
  final int id;
  final String title;
  final String instructor;
  final double rating;
  final int students;
  final String duration;
  final String level;
  final double price;
  final String thumbnailUrl;
  final String category;
  final int progress;

  LearningCourse({
    required this.id,
    required this.title,
    required this.instructor,
    required this.rating,
    required this.students,
    required this.duration,
    required this.level,
    required this.price,
    required this.thumbnailUrl,
    required this.category,
    required this.progress,
  });
}

class LearningPath {
  final int id;
  final String title;
  final int courses;
  final String duration;
  final String level;
  final String description;
  final String thumbnailUrl;

  LearningPath({
    required this.id,
    required this.title,
    required this.courses,
    required this.duration,
    required this.level,
    required this.description,
    required this.thumbnailUrl,
  });
}