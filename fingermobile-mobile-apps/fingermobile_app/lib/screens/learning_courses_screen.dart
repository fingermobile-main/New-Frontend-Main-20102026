import 'package:flutter/material.dart';

class LearningCoursesScreen extends StatefulWidget {
  @override
  _LearningCoursesScreenState createState() => _LearningCoursesScreenState();
}

class _LearningCoursesScreenState extends State<LearningCoursesScreen> {
  List<Course> _courses = [];
  List<Course> _recommended = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCourses();
  }

  Future<void> _loadCourses() async {
    try {
      // In a real implementation, this would be an API call
      // For now, we'll use mock data
      await Future.delayed(Duration(seconds: 1)); // Simulate network delay
      
      setState(() {
        _courses = [
          Course(
            id: 1,
            title: 'Flutter Development Masterclass',
            description: 'Learn to build beautiful apps with Flutter and Dart',
            instructor: 'John Smith',
            rating: 4.8,
            totalRatings: 1245,
            progress: 65,
            thumbnail: 'https://via.placeholder.com/300x200',
            category: 'Technology',
            duration: '12 hours',
            lessons: 42,
            level: 'Intermediate',
          ),
          Course(
            id: 2,
            title: 'Advanced UI/UX Design',
            description: 'Master the principles of modern member interface design',
            instructor: 'Sarah Johnson',
            rating: 4.9,
            totalRatings: 876,
            progress: 30,
            thumbnail: 'https://via.placeholder.com/300x200',
            category: 'Design',
            duration: '15 hours',
            lessons: 56,
            level: 'Advanced',
          ),
          Course(
            id: 3,
            title: 'Social Media Marketing',
            description: 'Effective strategies for growing your online presence',
            instructor: 'Michael Brown',
            rating: 4.6,
            totalRatings: 921,
            progress: 0,
            thumbnail: 'https://via.placeholder.com/300x200',
            category: 'Marketing',
            duration: '8 hours',
            lessons: 28,
            level: 'Beginner',
          ),
        ];
        
        _recommended = [
          Course(
            id: 4,
            title: 'Data Science Fundamentals',
            description: 'Introduction to data analysis and visualization',
            instructor: 'Emily Davis',
            rating: 4.7,
            totalRatings: 756,
            progress: 0,
            thumbnail: 'https://via.placeholder.com/300x200',
            category: 'Data Science',
            duration: '10 hours',
            lessons: 35,
            level: 'Beginner',
          ),
          Course(
            id: 5,
            title: 'Photography Masterclass',
            description: 'Learn professional photography techniques',
            instructor: 'David Wilson',
            rating: 4.9,
            totalRatings: 1102,
            progress: 0,
            thumbnail: 'https://via.placeholder.com/300x200',
            category: 'Art',
            duration: '14 hours',
            lessons: 48,
            level: 'Intermediate',
          ),
        ];
        _isLoading = false;
      });
    } catch (e) {
      print('Error loading courses: $e');
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error loading courses')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Learning'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.search),
            onPressed: () {
              // Implement search functionality
            },
          ),
        ],
      ),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadCourses,
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Continue Learning Section
                    if (_courses.where((c) => c.progress > 0).isNotEmpty) ...[
                      Padding(
                        padding: EdgeInsets.all(16),
                        child: Text(
                          'Continue Learning',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Container(
                        height: 200,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: _courses.where((c) => c.progress > 0).length,
                          itemBuilder: (context, index) {
                            final course = _courses.where((c) => c.progress > 0).toList()[index];
                            return _buildCourseCard(course, true);
                          },
                        ),
                      ),
                    ],
                    
                    // Recommended For You Section
                    Padding(
                      padding: EdgeInsets.all(16),
                      child: Text(
                        'Recommended For You',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    ListView.builder(
                      shrinkWrap: true,
                      physics: NeverScrollableScrollPhysics(),
                      itemCount: _recommended.length,
                      itemBuilder: (context, index) {
                        final course = _recommended[index];
                        return _buildCourseCard(course, false);
                      },
                    ),
                    
                    // All Courses Section
                    Padding(
                      padding: EdgeInsets.all(16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'All Courses',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          TextButton(
                            onPressed: () {
                              // Navigate to all courses
                            },
                            child: Text('See All'),
                          ),
                        ],
                      ),
                    ),
                    ListView.builder(
                      shrinkWrap: true,
                      physics: NeverScrollableScrollPhysics(),
                      itemCount: _courses.length,
                      itemBuilder: (context, index) {
                        final course = _courses[index];
                        return _buildCourseCard(course, false);
                      },
                    ),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildCourseCard(Course course, bool isHorizontal) {
    return Card(
      margin: isHorizontal 
          ? EdgeInsets.only(left: 16, right: 8, bottom: 16) 
          : EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Container(
        width: isHorizontal ? 300 : double.infinity,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Course thumbnail
            Container(
              height: 120,
              width: double.infinity,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(4),
                  topRight: Radius.circular(4),
                ),
                image: DecorationImage(
                  image: NetworkImage(course.thumbnail),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            
            // Course info
            Padding(
              padding: EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          course.title,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      if (course.progress > 0)
                        Container(
                          padding: EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: Colors.blue,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            '${course.progress}%',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                            ),
                          ),
                        ),
                    ],
                  ),
                  SizedBox(height: 4),
                  Text(
                    course.description,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.grey[600],
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(
                        Icons.person,
                        size: 14,
                        color: Colors.grey[600],
                      ),
                      SizedBox(width: 4),
                      Text(
                        course.instructor,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                      Spacer(),
                      Icon(
                        Icons.star,
                        size: 14,
                        color: Colors.orange,
                      ),
                      SizedBox(width: 4),
                      Text(
                        '${course.rating}',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                      Text(
                        '(${course.totalRatings})',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  Row(
                    children: [
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: _getCategoryColor(course.category).withOpacity(0.2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          course.category,
                          style: TextStyle(
                            color: _getCategoryColor(course.category),
                            fontSize: 10,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      SizedBox(width: 8),
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.grey[200],
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          course.level,
                          style: TextStyle(
                            color: Colors.grey[700],
                            fontSize: 10,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(
                        Icons.schedule,
                        size: 14,
                        color: Colors.grey[600],
                      ),
                      SizedBox(width: 4),
                      Text(
                        course.duration,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                      SizedBox(width: 16),
                      Icon(
                        Icons.menu_book,
                        size: 14,
                        color: Colors.grey[600],
                      ),
                      SizedBox(width: 4),
                      Text(
                        '${course.lessons} lessons',
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                  if (course.progress > 0) ...[
                    SizedBox(height: 8),
                    LinearProgressIndicator(
                      value: course.progress / 100,
                      backgroundColor: Colors.grey[300],
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Color _getCategoryColor(String category) {
    switch (category) {
      case 'Technology':
        return Colors.blue;
      case 'Design':
        return Colors.green;
      case 'Marketing':
        return Colors.orange;
      case 'Data Science':
        return Colors.purple;
      case 'Art':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}

class Course {
  final int id;
  final String title;
  final String description;
  final String instructor;
  final double rating;
  final int totalRatings;
  final int progress;
  final String thumbnail;
  final String category;
  final String duration;
  final int lessons;
  final String level;

  Course({
    required this.id,
    required this.title,
    required this.description,
    required this.instructor,
    required this.rating,
    required this.totalRatings,
    required this.progress,
    required this.thumbnail,
    required this.category,
    required this.duration,
    required this.lessons,
    required this.level,
  });
}