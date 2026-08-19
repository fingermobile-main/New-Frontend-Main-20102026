import 'package:flutter/material.dart';

class FlamingoPage extends StatefulWidget {
  const FlamingoPage({super.key});

  @override
  State<FlamingoPage> createState() => _FlamingoPageState();
}

class _FlamingoPageState extends State<FlamingoPage> {
  bool _isLoading = false;
  String? _errorMessage;
  FlamingoProject? _featuredProject;
  List<FlamingoProject> _projects = [];
  List<FlamingoCategory> _categories = [];
  String _selectedCategory = 'all';
  int _activeTab = 0;

  @override
  void initState() {
    super.initState();
    _loadFlamingoData();
  }

  Future<void> _loadFlamingoData() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock flamingo data
      setState(() {
        _featuredProject = FlamingoProject(
          id: 1,
          title: 'Pink Flamingo Conservation Initiative',
          description: 'Protecting flamingo habitats and promoting biodiversity',
          imageUrl: 'https://via.placeholder.com/600x300/FF69B4/FFFFFF?text=Flamingo+Conservation',
          category: 'conservation',
          progress: 75,
          fundingGoal: 50000,
          fundingRaised: 37500,
          contributors: 1240,
          daysRemaining: 15,
        );

        _categories = [
          FlamingoCategory(id: 'all', name: 'All Projects'),
          FlamingoCategory(id: 'conservation', name: 'Conservation'),
          FlamingoCategory(id: 'research', name: 'Research'),
          FlamingoCategory(id: 'education', name: 'Education'),
          FlamingoCategory(id: 'community', name: 'Community'),
        ];

        _projects = [
          FlamingoProject(
            id: 2,
            title: 'Urban Flamingo Research Study',
            description: 'Studying flamingo behavior in urban environments',
            imageUrl: 'https://via.placeholder.com/300x200/FF1493/FFFFFF?text=Urban+Research',
            category: 'research',
            progress: 45,
            fundingGoal: 25000,
            fundingRaised: 11250,
            contributors: 560,
            daysRemaining: 22,
          ),
          FlamingoProject(
            id: 3,
            title: 'Flamingo Education Program',
            description: 'Educating communities about flamingo conservation',
            imageUrl: 'https://via.placeholder.com/300x200/FF6FFF/000000?text=Education+Program',
            category: 'education',
            progress: 90,
            fundingGoal: 15000,
            fundingRaised: 13500,
            contributors: 890,
            daysRemaining: 5,
          ),
          FlamingoProject(
            id: 4,
            title: 'Coastal Habitat Restoration',
            description: 'Restoring coastal areas for flamingo nesting',
            imageUrl: 'https://via.placeholder.com/300x200/FFB6C1/000000?text=Habitat+Restoration',
            category: 'conservation',
            progress: 30,
            fundingGoal: 75000,
            fundingRaised: 22500,
            contributors: 2100,
            daysRemaining: 45,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load flamingo projects. Please try again.';
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
        title: const Text('Flamingo'),
        backgroundColor: const Color(0xFFFF69B4), // Pink color for flamingo theme
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {
              // Open search
            },
          ),
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () {
              // Open filters
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadFlamingoData,
        child: _isLoading && _featuredProject == null
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _featuredProject == null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadFlamingoData,
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
                          // Welcome Banner
                          Container(
                            height: 150,
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                                colors: [
                                  Color(0xFFFF69B4), // Hot pink
                                  Color(0xFFFFB6C1), // Light pink
                                ],
                              ),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Flamingo Projects',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 28,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  const Text(
                                    'Support conservation efforts and research',
                                    style: TextStyle(
                                      color: Colors.white70,
                                      fontSize: 16,
                                    ),
                                  ),
                                  const SizedBox(height: 16),
                                  ElevatedButton(
                                    onPressed: () {
                                      // Create new project
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.white,
                                      foregroundColor: const Color(0xFFFF69B4),
                                    ),
                                    child: const Text('Start a Project'),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          const SizedBox(height: 32),
                          // Featured Project
                          const Text(
                            'Featured Project',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          if (_featuredProject != null)
                            Card(
                              child: Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Container(
                                      height: 150,
                                      decoration: BoxDecoration(
                                        image: DecorationImage(
                                          image: NetworkImage(_featuredProject!.imageUrl),
                                          fit: BoxFit.cover,
                                        ),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    Text(
                                      _featuredProject!.title,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontSize: 18,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      _featuredProject!.description,
                                      style: const TextStyle(
                                        color: Colors.grey,
                                      ),
                                    ),
                                    const SizedBox(height: 16),
                                    // Progress bar
                                    Row(
                                      children: [
                                        Expanded(
                                          child: LinearProgressIndicator(
                                            value: _featuredProject!.progress / 100,
                                            backgroundColor: Colors.grey.shade300,
                                            valueColor: const AlwaysStoppedAnimation<Color>(
                                              Color(0xFFFF69B4),
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 16),
                                        Text('${_featuredProject!.progress}%'),
                                      ],
                                    ),
                                    const SizedBox(height: 16),
                                    // Funding info
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        _buildFundingInfo(
                                          'Raised',
                                          '\$${_formatNumber(_featuredProject!.fundingRaised)}',
                                          const Color(0xFFFF69B4),
                                        ),
                                        _buildFundingInfo(
                                          'Goal',
                                          '\$${_formatNumber(_featuredProject!.fundingGoal)}',
                                          Colors.grey,
                                        ),
                                        _buildFundingInfo(
                                          'Contributors',
                                          '${_formatNumber(_featuredProject!.contributors)}',
                                          Colors.green,
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 16),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 12,
                                            vertical: 6,
                                          ),
                                          decoration: BoxDecoration(
                                            color: Colors.blue.shade100,
                                            borderRadius: BorderRadius.circular(12),
                                          ),
                                          child: Text(
                                            '${_featuredProject!.daysRemaining} days left',
                                            style: const TextStyle(
                                              color: Colors.blue,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                        ElevatedButton(
                                          onPressed: () {
                                            // Support project
                                          },
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: const Color(0xFFFF69B4),
                                            foregroundColor: Colors.white,
                                          ),
                                          child: const Text('Support'),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          const SizedBox(height: 32),
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
                                    selectedColor: const Color(0xFFFF69B4),
                                    showCheckmark: false,
                                  ),
                                );
                              },
                            ),
                          ),
                          const SizedBox(height: 32),
                          // All Projects
                          const Text(
                            'All Projects',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _projects.length,
                            itemBuilder: (context, index) {
                              var project = _projects[index];
                              return Card(
                                margin: const EdgeInsets.only(bottom: 16),
                                child: Padding(
                                  padding: const EdgeInsets.all(16.0),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        height: 120,
                                        decoration: BoxDecoration(
                                          image: DecorationImage(
                                            image: NetworkImage(project.imageUrl),
                                            fit: BoxFit.cover,
                                          ),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                      ),
                                      const SizedBox(height: 16),
                                      Text(
                                        project.title,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        project.description,
                                        style: const TextStyle(
                                          color: Colors.grey,
                                        ),
                                      ),
                                      const SizedBox(height: 16),
                                      // Progress bar
                                      Row(
                                        children: [
                                          Expanded(
                                            child: LinearProgressIndicator(
                                              value: project.progress / 100,
                                              backgroundColor: Colors.grey.shade300,
                                              valueColor: const AlwaysStoppedAnimation<Color>(
                                                Color(0xFFFF69B4),
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 16),
                                          Text('${project.progress}%'),
                                        ],
                                      ),
                                      const SizedBox(height: 16),
                                      Row(
                                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                        children: [
                                          _buildFundingInfo(
                                            'Raised',
                                            '\$${_formatNumber(project.fundingRaised)}',
                                            const Color(0xFFFF69B4),
                                          ),
                                          _buildFundingInfo(
                                            'Contributors',
                                            '${_formatNumber(project.contributors)}',
                                            Colors.green,
                                          ),
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 12,
                                              vertical: 6,
                                            ),
                                            decoration: BoxDecoration(
                                              color: Colors.blue.shade100,
                                              borderRadius: BorderRadius.circular(12),
                                            ),
                                            child: Text(
                                              '${project.daysRemaining} days',
                                              style: const TextStyle(
                                                color: Colors.blue,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                      const SizedBox(height: 16),
                                      SizedBox(
                                        width: double.infinity,
                                        child: ElevatedButton(
                                          onPressed: () {
                                            // View project details
                                          },
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: const Color(0xFFFF69B4),
                                            foregroundColor: Colors.white,
                                          ),
                                          child: const Text('Learn More'),
                                        ),
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
                  ),
      ),
    );
  }

  Widget _buildFundingInfo(String label, String value, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: Colors.grey,
            fontSize: 12,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: TextStyle(
            color: color,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  String _formatNumber(int number) {
    if (number >= 1000000) {
      return '${(number / 1000000).toStringAsFixed(1)}M';
    } else if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(1)}K';
    } else {
      return number.toString();
    }
  }
}

class FlamingoCategory {
  final String id;
  final String name;

  FlamingoCategory({
    required this.id,
    required this.name,
  });
}

class FlamingoProject {
  final int id;
  final String title;
  final String description;
  final String imageUrl;
  final String category;
  final int progress; // Percentage
  final int fundingGoal;
  final int fundingRaised;
  final int contributors;
  final int daysRemaining;

  FlamingoProject({
    required this.id,
    required this.title,
    required this.description,
    required this.imageUrl,
    required this.category,
    required this.progress,
    required this.fundingGoal,
    required this.fundingRaised,
    required this.contributors,
    required this.daysRemaining,
  });
}