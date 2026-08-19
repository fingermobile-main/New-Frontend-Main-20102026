import 'package:flutter/material.dart';

class StercsVideoEditorPage extends StatefulWidget {
  const StercsVideoEditorPage({super.key});

  @override
  State<StercsVideoEditorPage> createState() => _StercsVideoEditorPageState();
}

class _StercsVideoEditorPageState extends State<StercsVideoEditorPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<VideoProject> _videoProjects = [];
  List<VideoTemplate> _videoTemplates = [];
  VideoProject? _selectedProject;
  bool _isEditing = false;
  final TextEditingController _projectNameController = TextEditingController();
  final TextEditingController _projectDescriptionController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadVideoProjects();
  }

  Future<void> _loadVideoProjects() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock video templates
      setState(() {
        _videoTemplates = [
          VideoTemplate(
            id: 1,
            name: 'Social Media Reel',
            description: 'Optimized for Instagram, TikTok, and Twitter',
            previewImageUrl: 'https://via.placeholder.com/150x100/4ECDC4/FFFFFF?text=Social+Reel',
            duration: '15-30 sec',
            resolution: '1080x1920',
            aspectRatio: '9:16',
          ),
          VideoTemplate(
            id: 2,
            name: 'YouTube Intro',
            description: 'Professional intro for YouTube channels',
            previewImageUrl: 'https://via.placeholder.com/150x100/FF6B6B/FFFFFF?text=YT+Intro',
            duration: '5-10 sec',
            resolution: '1920x1080',
            aspectRatio: '16:9',
          ),
          VideoTemplate(
            id: 3,
            name: 'Product Showcase',
            description: 'Highlight product features effectively',
            previewImageUrl: 'https://via.placeholder.com/150x100/45B7D1/FFFFFF?text=Product+Showcase',
            duration: '30-60 sec',
            resolution: '1920x1080',
            aspectRatio: '16:9',
          ),
          VideoTemplate(
            id: 4,
            name: 'Tutorial',
            description: 'Step-by-step instructional video',
            previewImageUrl: 'https://via.placeholder.com/150x100/96CEB4/FFFFFF?text=Tutorial',
            duration: '2-5 min',
            resolution: '1920x1080',
            aspectRatio: '16:9',
          ),
        ];

        // Mock video projects
        _videoProjects = [
          VideoProject(
            id: 1,
            name: 'Summer Campaign',
            description: 'Promotional video for summer products',
            thumbnailUrl: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Summer+Campaign',
            lastModified: DateTime.now().subtract(const Duration(hours: 2)),
            duration: '45 sec',
            resolution: '1920x1080',
            status: VideoProjectStatus.draft,
            fileSize: '24.5 MB',
            collaborators: 3,
          ),
          VideoProject(
            id: 2,
            name: 'Product Launch',
            description: 'Announcement video for new product launch',
            thumbnailUrl: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Product+Launch',
            lastModified: DateTime.now().subtract(const Duration(days: 1)),
            duration: '1 min 30 sec',
            resolution: '1920x1080',
            status: VideoProjectStatus.editing,
            fileSize: '48.2 MB',
            collaborators: 5,
          ),
          VideoProject(
            id: 3,
            name: 'Company Culture',
            description: 'Behind the scenes look at our company',
            thumbnailUrl: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Company+Culture',
            lastModified: DateTime.now().subtract(const Duration(days: 3)),
            duration: '2 min 15 sec',
            resolution: '1920x1080',
            status: VideoProjectStatus.published,
            fileSize: '72.8 MB',
            collaborators: 4,
          ),
          VideoProject(
            id: 4,
            name: 'Tutorial Series',
            description: 'How-to guide for using our platform',
            thumbnailUrl: 'https://via.placeholder.com/300x200/96CEB4/FFFFFF?text=Tutorial+Series',
            lastModified: DateTime.now().subtract(const Duration(days: 5)),
            duration: '5 min 42 sec',
            resolution: '1920x1080',
            status: VideoProjectStatus.review,
            fileSize: '125.3 MB',
            collaborators: 2,
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load video projects. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _createNewProject() {
    _projectNameController.clear();
    _projectDescriptionController.clear();
    _selectedProject = null;
    _isEditing = false;
    _showProjectFormDialog();
  }

  void _editProject(VideoProject project) {
    _projectNameController.text = project.name;
    _projectDescriptionController.text = project.description;
    _selectedProject = project;
    _isEditing = true;
    _showProjectFormDialog();
  }

  void _showProjectFormDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: Text(_isEditing ? 'Edit Project' : 'Create New Project'),
              content: SizedBox(
                width: MediaQuery.of(context).size.width * 0.8,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: _projectNameController,
                      decoration: const InputDecoration(
                        labelText: 'Project Name',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: _projectDescriptionController,
                      decoration: const InputDecoration(
                        labelText: 'Description',
                        border: OutlineInputBorder(),
                      ),
                      maxLines: 3,
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Select Template:',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      height: 100,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _videoTemplates.length,
                        itemBuilder: (context, index) {
                          var template = _videoTemplates[index];
                          return Padding(
                            padding: const EdgeInsets.only(right: 8.0),
                            child: GestureDetector(
                              onTap: () {
                                // Select template
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('Template "${template.name}" selected'),
                                    backgroundColor: Colors.blue,
                                  ),
                                );
                              },
                              child: Column(
                                children: [
                                  Container(
                                    width: 80,
                                    height: 60,
                                    decoration: BoxDecoration(
                                      image: DecorationImage(
                                        image: NetworkImage(template.previewImageUrl),
                                        fit: BoxFit.cover,
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    template.name,
                                    style: const TextStyle(fontSize: 12),
                                    textAlign: TextAlign.center,
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
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () {
                    if (_projectNameController.text.isNotEmpty) {
                      if (_isEditing) {
                        // Update existing project
                        setState(() {
                          int index = _videoProjects.indexWhere((p) => p.id == _selectedProject!.id);
                          if (index != -1) {
                            _videoProjects[index] = VideoProject(
                              id: _selectedProject!.id,
                              name: _projectNameController.text,
                              description: _projectDescriptionController.text,
                              thumbnailUrl: _selectedProject!.thumbnailUrl,
                              lastModified: DateTime.now(),
                              duration: _selectedProject!.duration,
                              resolution: _selectedProject!.resolution,
                              status: _selectedProject!.status,
                              fileSize: _selectedProject!.fileSize,
                              collaborators: _selectedProject!.collaborators,
                            );
                          }
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Project updated successfully'),
                            backgroundColor: Colors.green,
                          ),
                        );
                      } else {
                        // Create new project
                        setState(() {
                          _videoProjects.add(VideoProject(
                            id: _videoProjects.length + 1,
                            name: _projectNameController.text,
                            description: _projectDescriptionController.text,
                            thumbnailUrl: 'https://via.placeholder.com/300x200/DDDDDD/FFFFFF?text=New+Project',
                            lastModified: DateTime.now(),
                            duration: '0 sec',
                            resolution: '1920x1080',
                            status: VideoProjectStatus.draft,
                            fileSize: '0 MB',
                            collaborators: 1,
                          ));
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Project created successfully'),
                            backgroundColor: Colors.green,
                          ),
                        );
                      }
                      Navigator.pop(context);
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Please enter a project name'),
                          backgroundColor: Colors.red,
                        ),
                      );
                    }
                  },
                  child: Text(_isEditing ? 'Update' : 'Create'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  void _deleteProject(VideoProject project) {
    setState(() {
      _videoProjects.removeWhere((p) => p.id == project.id);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Deleted project: ${project.name}'),
        backgroundColor: Colors.red,
      ),
    );
  }

  void _openProject(VideoProject project) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Opening project: ${project.name}'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _duplicateProject(VideoProject project) {
    setState(() {
      _videoProjects.add(VideoProject(
        id: _videoProjects.length + 1,
        name: '${project.name} (Copy)',
        description: project.description,
        thumbnailUrl: project.thumbnailUrl,
        lastModified: DateTime.now(),
        duration: project.duration,
        resolution: project.resolution,
        status: project.status,
        fileSize: project.fileSize,
        collaborators: project.collaborators,
      ));
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Duplicated project: ${project.name}'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _exportProject(VideoProject project) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildExportOptionsSheet(project),
    );
  }

  Widget _buildExportOptionsSheet(VideoProject project) {
    List<Map<String, String>> exportOptions = [
      {'format': 'MP4', 'quality': '1080p', 'size': 'High'},
      {'format': 'MOV', 'quality': '4K', 'size': 'Very High'},
      {'format': 'AVI', 'quality': '720p', 'size': 'Medium'},
      {'format': 'MKV', 'quality': '1080p', 'size': 'High'},
    ];

    return Container(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Export Options',
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            'Project: ${project.name}',
            style: const TextStyle(
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Select export format:',
            style: TextStyle(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          SizedBox(
            height: 200,
            child: ListView.builder(
              itemCount: exportOptions.length,
              itemBuilder: (context, index) {
                var option = exportOptions[index];
                return Card(
                  child: ListTile(
                    title: Text('${option['format']} - ${option['quality']}'),
                    subtitle: Text('File Size: ${option['size']}'),
                    trailing: const Icon(Icons.arrow_forward_ios),
                    onTap: () {
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Exporting ${project.name} as ${option['format']}'),
                          backgroundColor: Colors.green,
                        ),
                      );
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('STERCS Video Editor'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadVideoProjects,
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // Open settings
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Opening video editor settings'),
                  backgroundColor: Colors.blue,
                ),
              );
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadVideoProjects,
        child: _isLoading && _videoProjects.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _videoProjects.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadVideoProjects,
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
                        // Stats Summary
                        Card(
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                _buildStatItem('Projects', '${_videoProjects.length}'),
                                _buildStatItem(
                                    'Draft', '${_videoProjects.where((p) => p.status == VideoProjectStatus.draft).length}'),
                                _buildStatItem('Collaborators',
                                    '${_videoProjects.fold(0, (sum, p) => sum + p.collaborators)}'),
                                _buildStatItem('Templates', '${_videoTemplates.length}'),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Projects List
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Video Projects',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            TextButton.icon(
                              onPressed: _createNewProject,
                              icon: const Icon(Icons.add),
                              label: const Text('New Project'),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        Expanded(
                          child: GridView.builder(
                            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              crossAxisSpacing: 16,
                              mainAxisSpacing: 16,
                              childAspectRatio: 0.8,
                            ),
                            itemCount: _videoProjects.length,
                            itemBuilder: (context, index) {
                              var project = _videoProjects[index];
                              return Card(
                                child: InkWell(
                                  onTap: () => _openProject(project),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        height: 100,
                                        decoration: BoxDecoration(
                                          image: DecorationImage(
                                            image: NetworkImage(project.thumbnailUrl),
                                            fit: BoxFit.cover,
                                          ),
                                        ),
                                      ),
                                      Padding(
                                        padding: const EdgeInsets.all(8.0),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              project.name,
                                              style: const TextStyle(
                                                fontWeight: FontWeight.bold,
                                              ),
                                              maxLines: 1,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              project.description,
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: Colors.grey,
                                              ),
                                              maxLines: 2,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            const SizedBox(height: 8),
                                            Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                              children: [
                                                Container(
                                                  padding: const EdgeInsets.symmetric(
                                                      horizontal: 6, vertical: 2),
                                                  decoration: BoxDecoration(
                                                    color: _getStatusColor(project.status),
                                                    borderRadius: BorderRadius.circular(12),
                                                  ),
                                                  child: Text(
                                                    _getStatusText(project.status),
                                                    style: const TextStyle(
                                                      color: Colors.white,
                                                      fontSize: 10,
                                                    ),
                                                  ),
                                                ),
                                                PopupMenuButton<String>(
                                                  icon: const Icon(Icons.more_vert, size: 20),
                                                  onSelected: (String result) {
                                                    switch (result) {
                                                      case 'edit':
                                                        _editProject(project);
                                                        break;
                                                      case 'duplicate':
                                                        _duplicateProject(project);
                                                        break;
                                                      case 'export':
                                                        _exportProject(project);
                                                        break;
                                                      case 'delete':
                                                        _deleteProject(project);
                                                        break;
                                                    }
                                                  },
                                                  itemBuilder: (BuildContext context) =>
                                                      <PopupMenuEntry<String>>[
                                                    const PopupMenuItem<String>(
                                                      value: 'edit',
                                                      child: Text('Edit'),
                                                    ),
                                                    const PopupMenuItem<String>(
                                                      value: 'duplicate',
                                                      child: Text('Duplicate'),
                                                    ),
                                                    const PopupMenuItem<String>(
                                                      value: 'export',
                                                      child: Text('Export'),
                                                    ),
                                                    const PopupMenuItem<String>(
                                                      value: 'delete',
                                                      child: Text('Delete'),
                                                    ),
                                                  ],
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              'Duration: ${project.duration}',
                                              style: const TextStyle(
                                                fontSize: 10,
                                                color: Colors.grey,
                                              ),
                                            ),
                                            Text(
                                              '${project.collaborators} collaborators • ${project.fileSize}',
                                              style: const TextStyle(
                                                fontSize: 10,
                                                color: Colors.grey,
                                              ),
                                            ),
                                            Text(
                                              'Modified: ${_formatRelativeTime(project.lastModified)}',
                                              style: const TextStyle(
                                                fontSize: 10,
                                                color: Colors.grey,
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
      floatingActionButton: FloatingActionButton(
        backgroundColor: Theme.of(context).primaryColor,
        child: const Icon(Icons.add),
        onPressed: _createNewProject,
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.grey,
            fontSize: 12,
          ),
        ),
      ],
    );
  }

  Color _getStatusColor(VideoProjectStatus status) {
    switch (status) {
      case VideoProjectStatus.draft:
        return Colors.grey;
      case VideoProjectStatus.editing:
        return Colors.blue;
      case VideoProjectStatus.review:
        return Colors.orange;
      case VideoProjectStatus.published:
        return Colors.green;
    }
  }

  String _getStatusText(VideoProjectStatus status) {
    switch (status) {
      case VideoProjectStatus.draft:
        return 'Draft';
      case VideoProjectStatus.editing:
        return 'Editing';
      case VideoProjectStatus.review:
        return 'Review';
      case VideoProjectStatus.published:
        return 'Published';
    }
  }

  String _formatRelativeTime(DateTime dateTime) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes} min ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours} hrs ago';
    } else if (difference.inDays < 7) {
      return '${difference.inDays} days ago';
    } else {
      return '${dateTime.month}/${dateTime.day}/${dateTime.year}';
    }
  }
}

enum VideoProjectStatus { draft, editing, review, published }

class VideoProject {
  final int id;
  final String name;
  final String description;
  final String thumbnailUrl;
  final DateTime lastModified;
  final String duration;
  final String resolution;
  final VideoProjectStatus status;
  final String fileSize;
  final int collaborators;

  VideoProject({
    required this.id,
    required this.name,
    required this.description,
    required this.thumbnailUrl,
    required this.lastModified,
    required this.duration,
    required this.resolution,
    required this.status,
    required this.fileSize,
    required this.collaborators,
  });
}

class VideoTemplate {
  final int id;
  final String name;
  final String description;
  final String previewImageUrl;
  final String duration;
  final String resolution;
  final String aspectRatio;

  VideoTemplate({
    required this.id,
    required this.name,
    required this.description,
    required this.previewImageUrl,
    required this.duration,
    required this.resolution,
    required this.aspectRatio,
  });
}