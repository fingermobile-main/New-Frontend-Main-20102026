import 'package:flutter/material.dart';

class CourseEnrollment extends StatefulWidget {
  final String courseId;
  final String courseTitle;
  final String courseSubtitle;
  final String instructorName;
  final String courseDescription;
  final double price;
  final double rating;
  final int ratingCount;
  final int lessonCount;
  final int durationHours;
  final String level;
  final List<String> tags;
  final List<String> curriculum;

  const CourseEnrollment({
    Key? key,
    required this.courseId,
    required this.courseTitle,
    required this.courseSubtitle,
    required this.instructorName,
    required this.courseDescription,
    required this.price,
    required this.rating,
    required this.ratingCount,
    required this.lessonCount,
    required this.durationHours,
    required this.level,
    required this.tags,
    required this.curriculum,
  }) : super(key: key);

  @override
  _CourseEnrollmentState createState() => _CourseEnrollmentState();
}

class _CourseEnrollmentState extends State<CourseEnrollment> {
  bool _isEnrolled = false;
  bool _isWishlisted = false;
  int _expandedIndex = -1;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            SliverAppBar(
              expandedHeight: 250,
              floating: false,
              pinned: true,
              flexibleSpace: FlexibleSpaceBar(
                background: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.blue[800]!,
                        Colors.blue[600]!,
                      ],
                    ),
                  ),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      Image.network(
                        'https://via.placeholder.com/800x400/333333/FFFFFF?text=${
                          Uri.encodeComponent(widget.courseTitle)
                        }',
                        fit: BoxFit.cover,
                        loadingBuilder: (context, child, loadingProgress) {
                          if (loadingProgress == null) return child;
                          return Center(
                            child: CircularProgressIndicator(
                              value: loadingProgress.expectedTotalBytes != null
                                  ? loadingProgress.cumulativeBytesLoaded /
                                      loadingProgress.expectedTotalBytes!
                                  : null,
                            ),
                          );
                        },
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            color: Colors.grey[800],
                            child: Center(
                              child: Icon(
                                Icons.play_circle_fill,
                                size: 80,
                                color: Colors.white,
                              ),
                            ),
                          );
                        },
                      ),
                      Container(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.bottomCenter,
                            end: Alignment.topCenter,
                            colors: [
                              Colors.black.withOpacity(0.7),
                              Colors.transparent,
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              actions: [
                IconButton(
                  icon: Icon(
                    _isWishlisted ? Icons.bookmark : Icons.bookmark_border,
                    color: Colors.white,
                  ),
                  onPressed: () {
                    setState(() {
                      _isWishlisted = !_isWishlisted;
                    });
                  },
                ),
                IconButton(
                  icon: Icon(
                    Icons.share,
                    color: Colors.white,
                  ),
                  onPressed: () {
                    // Share functionality
                  },
                ),
              ],
            ),
          ];
        },
        body: SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Course title and subtitle
                Text(
                  widget.courseTitle,
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  widget.courseSubtitle,
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                ),
                
                SizedBox(height: 16),
                
                // Instructor and rating
                Row(
                  children: [
                    CircleAvatar(
                      backgroundImage: NetworkImage(
                        'https://via.placeholder.com/150/333333/FFFFFF?text=${widget.instructorName.split(" ").first[0]}',
                      ),
                    ),
                    SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Instructor',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                        Text(
                          widget.instructorName,
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                    Spacer(),
                    Row(
                      children: [
                        Icon(
                          Icons.star,
                          color: Colors.amber,
                          size: 18,
                        ),
                        SizedBox(width: 4),
                        Text(
                          '${widget.rating.toStringAsFixed(1)}',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        SizedBox(width: 4),
                        Text(
                          '($widget.ratingCount)',
                          style: TextStyle(
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                
                SizedBox(height: 24),
                
                // Course stats
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStat('Lessons', '${widget.lessonCount}'),
                    _buildStat('Hours', '${widget.durationHours}h'),
                    _buildStat('Level', widget.level),
                    _buildStat('Students', '12,456'),
                  ],
                ),
                
                SizedBox(height: 24),
                
                // Tags
                Wrap(
                  spacing: 8,
                  children: widget.tags.map((tag) => Chip(
                    label: Text(tag),
                    backgroundColor: Colors.blue[50],
                    labelStyle: TextStyle(
                      color: Colors.blue[700],
                      fontSize: 12,
                    ),
                  )).toList(),
                ),
                
                SizedBox(height: 24),
                
                // Price
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '\$${widget.price.toStringAsFixed(2)}',
                          style: TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Colors.green[700],
                          ),
                        ),
                        Text(
                          'One-time payment',
                          style: TextStyle(
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                    if (!_isEnrolled)
                      ElevatedButton(
                        onPressed: _enrollInCourse,
                        style: ElevatedButton.styleFrom(
                          padding: EdgeInsets.symmetric(
                            horizontal: 24,
                            vertical: 16,
                          ),
                          backgroundColor: Colors.green,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: Text(
                          'Enroll Now',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                          ),
                        ),
                      )
                    else
                      Container(
                        padding: EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: Colors.green[50],
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.green[200]!),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.check_circle,
                              color: Colors.green,
                            ),
                            SizedBox(width: 8),
                            Text(
                              'Enrolled',
                              style: TextStyle(
                                color: Colors.green[700],
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
                
                SizedBox(height: 24),
                
                // Course description
                Text(
                  'About this course',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  widget.courseDescription,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[700],
                    height: 1.5,
                  ),
                ),
                
                SizedBox(height: 24),
                
                // Curriculum section
                Text(
                  'Curriculum',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 12),
                
                ListView.builder(
                  shrinkWrap: true,
                  physics: NeverScrollableScrollPhysics(),
                  itemCount: widget.curriculum.length,
                  itemBuilder: (context, index) {
                    return Card(
                      margin: EdgeInsets.only(bottom: 8),
                      child: ExpansionTile(
                        title: Text(
                          'Section ${index + 1}: ${widget.curriculum[index]}',
                          style: TextStyle(
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        trailing: Text(
                          '${(widget.lessonCount ~/ widget.curriculum.length)} lectures',
                          style: TextStyle(
                            color: Colors.grey[600],
                          ),
                        ),
                        children: [
                          Padding(
                            padding: EdgeInsets.all(16),
                            child: Column(
                              children: List.generate(
                                (widget.lessonCount ~/ widget.curriculum.length),
                                (lessonIndex) => ListTile(
                                  leading: CircleAvatar(
                                    backgroundColor: Colors.grey[100],
                                    child: Text(
                                      '${index + 1}.${lessonIndex + 1}',
                                      style: TextStyle(
                                        fontSize: 10,
                                        color: Colors.grey[700],
                                      ),
                                    ),
                                  ),
                                  title: Text(
                                    'Lesson ${(index * (widget.lessonCount ~/ widget.curriculum.length)) + lessonIndex + 1}',
                                    style: TextStyle(
                                      fontSize: 14,
                                    ),
                                  ),
                                  trailing: Text(
                                    '${(widget.durationHours ~/ widget.lessonCount) + 1} min',
                                    style: TextStyle(
                                      color: Colors.grey[600],
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
                
                SizedBox(height: 24),
                
                // What you'll learn
                Text(
                  'What you\'ll learn',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 12),
                
                Column(
                  children: [
                    _buildLearningItem('Build responsive Flutter applications from scratch'),
                    _buildLearningItem('Master state management techniques'),
                    _buildLearningItem('Implement advanced UI/UX patterns'),
                    _buildLearningItem('Integrate with backend services'),
                    _buildLearningItem('Deploy apps to app stores'),
                  ],
                ),
                
                SizedBox(height: 40),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildStat(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: Colors.grey[600],
          ),
        ),
      ],
    );
  }

  Widget _buildLearningItem(String item) {
    return Padding(
      padding: EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            Icons.check_circle,
            color: Colors.green,
            size: 20,
          ),
          SizedBox(width: 8),
          Expanded(
            child: Text(
              item,
              style: TextStyle(
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _enrollInCourse() {
    setState(() {
      _isEnrolled = true;
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Successfully enrolled in ${widget.courseTitle}'),
        action: SnackBarAction(
          label: 'Continue',
          onPressed: () {
            // Navigate to course content
          },
        ),
      ),
    );
  }
}