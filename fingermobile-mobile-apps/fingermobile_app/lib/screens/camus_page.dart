import 'package:flutter/material.dart';

class CamusPage extends StatefulWidget {
  const CamusPage({super.key});

  @override
  State<CamusPage> createState() => _CamusPageState();
}

class _CamusPageState extends State<CamusPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<CamusFeature> _features = [];
  List<CamusResource> _resources = [];
  List<Testimonial> _testimonials = [];
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadCamusContent();
  }

  Future<void> _loadCamusContent() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));
      
      // Mock Camus content
      setState(() {
        _features = [
          CamusFeature(
            title: 'Project Management',
            description: 'Streamline your projects with our intuitive management tools',
            icon: Icons.work,
            color: Colors.blue,
          ),
          CamusFeature(
            title: 'Team Collaboration',
            description: 'Enhance teamwork with real-time collaboration features',
            icon: Icons.groups,
            color: Colors.green,
          ),
          CamusFeature(
            title: 'Task Tracking',
            description: 'Monitor progress and deadlines with advanced tracking',
            icon: Icons.task,
            color: Colors.purple,
          ),
          CamusFeature(
            title: 'Performance Analytics',
            description: 'Gain insights with detailed analytics and reporting',
            icon: Icons.analytics,
            color: Colors.orange,
          ),
        ];
        
        _resources = [
          CamusResource(
            title: 'Getting Started Guide',
            description: 'Learn the basics of Camus in 10 minutes',
            type: ResourceType.guide,
            url: '#',
          ),
          CamusResource(
            title: 'Advanced Workflows',
            description: 'Master complex project workflows',
            type: ResourceType.video,
            url: '#',
          ),
          CamusResource(
            title: 'API Documentation',
            description: 'Integrate Camus with your existing tools',
            type: ResourceType.documentation,
            url: '#',
          ),
          CamusResource(
            title: 'Best Practices',
            description: 'Tips from experienced Camus members',
            type: ResourceType.article,
            url: '#',
          ),
        ];
        
        _testimonials = [
          Testimonial(
            name: 'Alex Johnson',
            role: 'Product Manager',
            company: 'TechCorp',
            quote: 'Camus has transformed how our team manages projects. We\'ve seen a 40% increase in productivity.',
            avatar: 'https://via.placeholder.com/150',
          ),
          Testimonial(
            name: 'Sarah Williams',
            role: 'Team Lead',
            company: 'Innovate Inc',
            quote: 'The collaboration features in Camus have made remote work seamless for our distributed team.',
            avatar: 'https://via.placeholder.com/150',
          ),
          Testimonial(
            name: 'Michael Chen',
            role: 'CTO',
            company: 'StartupXYZ',
            quote: 'Implementing Camus was the best decision we made for our development process.',
            avatar: 'https://via.placeholder.com/150',
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load Camus content. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Camus'),
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
        onRefresh: _loadCamusContent,
        child: _isLoading && _features.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _features.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadCamusContent,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  )
                : SingleChildScrollView(
                    child: Column(
                      children: [
                        // Hero Section
                        Container(
                          padding: const EdgeInsets.all(32.0),
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Theme.of(context).primaryColor,
                                Theme.of(context).primaryColorDark,
                              ],
                              begin: Alignment.topLeft,
                              end: Alignment.bottomRight,
                            ),
                          ),
                          child: Column(
                            children: [
                              const Text(
                                'Camus Project Management',
                                style: TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 16),
                              const Text(
                                'Streamline your workflow and boost productivity with our powerful project management solution',
                                style: TextStyle(
                                  fontSize: 16,
                                  color: Colors.white70,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 32),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  ElevatedButton(
                                    onPressed: () {
                                      // Get started
                                    },
                                    child: const Text('Get Started'),
                                  ),
                                  const SizedBox(width: 16),
                                  OutlinedButton(
                                    onPressed: () {
                                      // Watch demo
                                    },
                                    style: OutlinedButton.styleFrom(
                                      side: const BorderSide(color: Colors.white),
                                    ),
                                    child: const Text(
                                      'Watch Demo',
                                      style: TextStyle(color: Colors.white),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        // Features Section
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Powerful Features',
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 16),
                              GridView.builder(
                                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                  crossAxisCount: 2,
                                  crossAxisSpacing: 16,
                                  mainAxisSpacing: 16,
                                  childAspectRatio: 0.85,
                                ),
                                itemCount: _features.length,
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemBuilder: (context, index) {
                                  var feature = _features[index];
                                  return Card(
                                    child: Padding(
                                      padding: const EdgeInsets.all(16.0),
                                      child: Column(
                                        children: [
                                          Container(
                                            padding: const EdgeInsets.all(12),
                                            decoration: BoxDecoration(
                                              color: feature.color.withOpacity(0.1),
                                              shape: BoxShape.circle,
                                            ),
                                            child: Icon(
                                              feature.icon,
                                              color: feature.color,
                                              size: 32,
                                            ),
                                          ),
                                          const SizedBox(height: 16),
                                          Text(
                                            feature.title,
                                            style: const TextStyle(
                                              fontWeight: FontWeight.bold,
                                            ),
                                            textAlign: TextAlign.center,
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            feature.description,
                                            style: const TextStyle(
                                              fontSize: 12,
                                              color: Colors.grey,
                                            ),
                                            textAlign: TextAlign.center,
                                          ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 32),
                        // Resources Section
                        Container(
                          color: Colors.grey.shade50,
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Learning Resources',
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 16),
                              ListView.builder(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount: _resources.length,
                                itemBuilder: (context, index) {
                                  var resource = _resources[index];
                                  return Card(
                                    margin: const EdgeInsets.only(bottom: 16),
                                    child: ListTile(
                                      leading: Container(
                                        padding: const EdgeInsets.all(8),
                                        decoration: BoxDecoration(
                                          color: _getResourceColor(resource.type),
                                          shape: BoxShape.circle,
                                        ),
                                        child: Icon(
                                          _getResourceIcon(resource.type),
                                          color: Colors.white,
                                        ),
                                      ),
                                      title: Text(resource.title),
                                      subtitle: Text(resource.description),
                                      trailing: const Icon(Icons.arrow_forward_ios),
                                      onTap: () {
                                        // Open resource
                                      },
                                    ),
                                  );
                                },
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 32),
                        // Testimonials Section
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'What Our members Say',
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 16),
                              SizedBox(
                                height: 200,
                                child: PageView.builder(
                                  itemCount: _testimonials.length,
                                  itemBuilder: (context, index) {
                                    var testimonial = _testimonials[index];
                                    return Card(
                                      child: Padding(
                                        padding: const EdgeInsets.all(16.0),
                                        child: Column(
                                          children: [
                                            Row(
                                              children: [
                                                CircleAvatar(
                                                  backgroundImage: NetworkImage(testimonial.avatar),
                                                ),
                                                const SizedBox(width: 16),
                                                Column(
                                                  crossAxisAlignment: CrossAxisAlignment.start,
                                                  children: [
                                                    Text(
                                                      testimonial.name,
                                                      style: const TextStyle(
                                                        fontWeight: FontWeight.bold,
                                                      ),
                                                    ),
                                                    Text(
                                                      '${testimonial.role}, ${testimonial.company}',
                                                      style: const TextStyle(
                                                        fontSize: 12,
                                                        color: Colors.grey,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 16),
                                            Expanded(
                                              child: Text(
                                                testimonial.quote,
                                                style: const TextStyle(
                                                  fontStyle: FontStyle.italic,
                                                ),
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
                      ],
                    ),
                  ),
      ),
    );
  }

  Color _getResourceColor(ResourceType type) {
    switch (type) {
      case ResourceType.guide:
        return Colors.blue;
      case ResourceType.video:
        return Colors.red;
      case ResourceType.documentation:
        return Colors.green;
      case ResourceType.article:
        return Colors.purple;
    }
  }

  IconData _getResourceIcon(ResourceType type) {
    switch (type) {
      case ResourceType.guide:
        return Icons.menu_book;
      case ResourceType.video:
        return Icons.play_circle;
      case ResourceType.documentation:
        return Icons.description;
      case ResourceType.article:
        return Icons.article;
    }
  }
}

enum ResourceType { guide, video, documentation, article }

class CamusFeature {
  final String title;
  final String description;
  final IconData icon;
  final Color color;

  CamusFeature({
    required this.title,
    required this.description,
    required this.icon,
    required this.color,
  });
}

class CamusResource {
  final String title;
  final String description;
  final ResourceType type;
  final String url;

  CamusResource({
    required this.title,
    required this.description,
    required this.type,
    required this.url,
  });
}

class Testimonial {
  final String name;
  final String role;
  final String company;
  final String quote;
  final String avatar;

  Testimonial({
    required this.name,
    required this.role,
    required this.company,
    required this.quote,
    required this.avatar,
  });
}