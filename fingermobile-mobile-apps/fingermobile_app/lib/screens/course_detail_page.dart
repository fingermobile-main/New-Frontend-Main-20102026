import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

class CourseDetailPage extends StatefulWidget {
  const CourseDetailPage({super.key});

  @override
  State<CourseDetailPage> createState() => _CourseDetailPageState();
}

class _CourseDetailPageState extends State<CourseDetailPage> {
  bool _isLoading = false;
  String? _errorMessage;
  Course? _course;
  bool _isEnrolled = false;
  int _selectedLessonIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadCourseDetails();
  }

  Future<void> _loadCourseDetails() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock course data
      setState(() {
        _course = Course(
          id: 1,
          title: 'Advanced Flutter Development',
          instructor: 'Alex Johnson',
          description: 'Master advanced Flutter concepts including state management, '
              'custom animations, performance optimization, and publishing apps to stores.',
          duration: '8 weeks',
          lessons: 24,
          level: 'Advanced',
          rating: 4.8,
          students: 12540,
          price: 89.99,
          thumbnailUrl: 'https://via.placeholder.com/600x300/4ECDC4/FFFFFF?text=Flutter+Course',
          categories: ['Mobile Development', 'Flutter', 'Dart'],
          learningOutcomes: [
            'Build complex, responsive Flutter applications',
            'Implement advanced state management solutions',
            'Create custom animations and transitions',
            'Optimize app performance and handle memory efficiently',
            'Publish apps to Google Play and App Store',
          ],
          curriculum: [
            CurriculumSection(
              title: 'Introduction',
              lessons: [
                Lesson(
                  id: 1,
                  title: 'Course Overview',
                  duration: '12:05',
                  isCompleted: true,
                ),
                Lesson(
                  id: 2,
                  title: 'Prerequisites and Setup',
                  duration: '18:42',
                  isCompleted: true,
                ),
              ],
            ),
            CurriculumSection(
              title: 'State Management',
              lessons: [
                Lesson(
                  id: 3,
                  title: 'Provider Pattern Deep Dive',
                  duration: '24:15',
                  isCompleted: false,
                ),
                Lesson(
                  id: 4,
                  title: 'Riverpod vs Provider',
                  duration: '21:30',
                  isCompleted: false,
                ),
                Lesson(
                  id: 5,
                  title: 'Bloc Pattern Implementation',
                  duration: '32:10',
                  isCompleted: false,
                ),
              ],
            ),
            CurriculumSection(
              title: 'Advanced UI Concepts',
              lessons: [
                Lesson(
                  id: 6,
                  title: 'Custom Paint and Animations',
                  duration: '28:45',
                  isCompleted: false,
                ),
                Lesson(
                  id: 7,
                  title: 'Responsive Design Patterns',
                  duration: '22:18',
                  isCompleted: false,
                ),
              ],
            ),
          ],
          instructorBio: 'Alex Johnson is a senior mobile developer with over 10 years of experience '
              'in cross-platform development. He has published over 20 apps on various app stores '
              'and is a frequent speaker at tech conferences.',
          instructorImageUrl: 'https://via.placeholder.com/150',
        );
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load course details. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _enrollInCourse() {
    setState(() {
      _isEnrolled = true;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Successfully enrolled in the course!'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _markLessonAsCompleted(int lessonId) {
    if (_course != null) {
      for (var section in _course!.curriculum) {
        for (var lesson in section.lessons) {
          if (lesson.id == lessonId) {
            setState(() {
              lesson.isCompleted = !lesson.isCompleted;
            });
            return;
          }
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Course Details'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () {
              // Share course
            },
          ),
          IconButton(
            icon: const Icon(Icons.bookmark_border),
            onPressed: () {
              // Save course
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadCourseDetails,
        child: _isLoading && _course == null
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _course == null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadCourseDetails,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : _course == null
                    ? const Center(child: Text('Course not found'))
                    : SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Course Header
                            Stack(
                              children: [
                                CachedNetworkImage(
                                  imageUrl: _course!.thumbnailUrl,
                                  width: double.infinity,
                                  height: 200,
                                  fit: BoxFit.cover,
                                  placeholder: (context, url) => const Center(child: CircularProgressIndicator()),
                                  errorWidget: (context, url, error) => Container(
                                    color: Colors.grey[300],
                                    child: const Icon(Icons.image),
                                  ),
                                ),
                                Container(
                                  height: 200,
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topCenter,
                                      end: Alignment.bottomCenter,
                                      colors: [
                                        Colors.transparent,
                                        Colors.black.withOpacity(0.7),
                                      ],
                                    ),
                                  ),
                                ),
                                Positioned(
                                  bottom: 16,
                                  left: 16,
                                  right: 16,
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        _course!.title,
                                        style: const TextStyle(
                                          fontSize: 24,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        'by ${_course!.instructor}',
                                        style: const TextStyle(
                                          color: Colors.white70,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ),
                            Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Course Info
                                  Row(
                                    children: [
                                      _buildInfoChip(
                                        Icons.star,
                                        '${_course!.rating}',
                                        Colors.amber,
                                      ),
                                      const SizedBox(width: 16),
                                      _buildInfoChip(
                                        Icons.people,
                                        '${_course!.students}',
                                        Colors.blue,
                                      ),
                                      const SizedBox(width: 16),
                                      _buildInfoChip(
                                        Icons.access_time,
                                        _course!.duration,
                                        Colors.green,
                                      ),
                                      const SizedBox(width: 16),
                                      _buildInfoChip(
                                        Icons.school,
                                        _course!.level,
                                        Colors.purple,
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 24),
                                  // Description
                                  const Text(
                                    'Description',
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Text(_course!.description),
                                  const SizedBox(height: 24),
                                  // Learning Outcomes
                                  const Text(
                                    'What you\'ll learn',
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  ListView.builder(
                                    shrinkWrap: true,
                                    physics: const NeverScrollableScrollPhysics(),
                                    itemCount: _course!.learningOutcomes.length,
                                    itemBuilder: (context, index) {
                                      return Padding(
                                        padding: const EdgeInsets.symmetric(vertical: 4.0),
                                        child: Row(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            const Icon(
                                              Icons.check_circle,
                                              color: Colors.green,
                                              size: 20,
                                            ),
                                            const SizedBox(width: 8),
                                            Expanded(
                                              child: Text(_course!.learningOutcomes[index]),
                                            ),
                                          ],
                                        ),
                                      );
                                    },
                                  ),
                                  const SizedBox(height: 24),
                                  // Curriculum
                                  const Text(
                                    'Curriculum',
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  ListView.builder(
                                    shrinkWrap: true,
                                    physics: const NeverScrollableScrollPhysics(),
                                    itemCount: _course!.curriculum.length,
                                    itemBuilder: (context, sectionIndex) {
                                      var section = _course!.curriculum[sectionIndex];
                                      return Card(
                                        margin: const EdgeInsets.only(bottom: 16),
                                        child: ExpansionTile(
                                          title: Text(
                                            section.title,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          children: [
                                            Padding(
                                              padding: const EdgeInsets.symmetric(horizontal: 16),
                                              child: ListView.builder(
                                                shrinkWrap: true,
                                                physics: const NeverScrollableScrollPhysics(),
                                                itemCount: section.lessons.length,
                                                itemBuilder: (context, lessonIndex) {
                                                  var lesson = section.lessons[lessonIndex];
                                                  return ListTile(
                                                    leading: IconButton(
                                                      icon: Icon(
                                                        lesson.isCompleted
                                                            ? Icons.check_circle
                                                            : Icons.play_circle_outline,
                                                        color: lesson.isCompleted
                                                            ? Colors.green
                                                            : Theme.of(context).primaryColor,
                                                      ),
                                                      onPressed: () => _markLessonAsCompleted(lesson.id),
                                                    ),
                                                    title: Text(lesson.title),
                                                    trailing: Text(lesson.duration),
                                                    onTap: () {
                                                      setState(() {
                                                        _selectedLessonIndex = lesson.id;
                                                      });
                                                    },
                                                  );
                                                },
                                              ),
                                            ),
                                          ],
                                        ),
                                      );
                                    },
                                  ),
                                  const SizedBox(height: 24),
                                  // Instructor
                                  const Text(
                                    'Instructor',
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  Card(
                                    child: Padding(
                                      padding: const EdgeInsets.all(16.0),
                                      child: Row(
                                        children: [
                                          CircleAvatar(
                                            backgroundImage: CachedNetworkImageProvider(_course!.instructorImageUrl),
                                            radius: 30,
                                          ),
                                          const SizedBox(width: 16),
                                          Expanded(
                                            child: Column(
                                              crossAxisAlignment: CrossAxisAlignment.start,
                                              children: [
                                                Text(
                                                  _course!.instructor,
                                                  style: const TextStyle(
                                                    fontWeight: FontWeight.bold,
                                                    fontSize: 18,
                                                  ),
                                                ),
                                                const SizedBox(height: 4),
                                                Text(_course!.instructorBio),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
      ),
      bottomSheet: _course != null
          ? Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.3),
                    spreadRadius: 2,
                    blurRadius: 5,
                    offset: const Offset(0, -2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Text(
                    '\$${_course!.price.toStringAsFixed(2)}',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const Spacer(),
                  SizedBox(
                    width: 150,
                    child: ElevatedButton(
                      onPressed: _isEnrolled ? null : _enrollInCourse,
                      style: ElevatedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: Text(
                        _isEnrolled ? 'Enrolled' : 'Enroll Now',
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            )
          : null,
    );
  }

  Widget _buildInfoChip(IconData icon, String text, Color color) {
    return Row(
      children: [
        Icon(icon, size: 16, color: color),
        const SizedBox(width: 4),
        Text(text),
      ],
    );
  }
}

class Course {
  final int id;
  final String title;
  final String instructor;
  final String description;
  final String duration;
  final int lessons;
  final String level;
  final double rating;
  final int students;
  final double price;
  final String thumbnailUrl;
  final List<String> categories;
  final List<String> learningOutcomes;
  final List<CurriculumSection> curriculum;
  final String instructorBio;
  final String instructorImageUrl;

  Course({
    required this.id,
    required this.title,
    required this.instructor,
    required this.description,
    required this.duration,
    required this.lessons,
    required this.level,
    required this.rating,
    required this.students,
    required this.price,
    required this.thumbnailUrl,
    required this.categories,
    required this.learningOutcomes,
    required this.curriculum,
    required this.instructorBio,
    required this.instructorImageUrl,
  });
}

class CurriculumSection {
  final String title;
  final List<Lesson> lessons;

  CurriculumSection({
    required this.title,
    required this.lessons,
  });
}

class Lesson {
  final int id;
  final String title;
  final String duration;
  bool isCompleted;

  Lesson({
    required this.id,
    required this.title,
    required this.duration,
    required this.isCompleted,
  });
}