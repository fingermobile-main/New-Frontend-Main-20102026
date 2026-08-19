import 'package:flutter/material.dart';

class StercsThemeDesignerPage extends StatefulWidget {
  const StercsThemeDesignerPage({super.key});

  @override
  State<StercsThemeDesignerPage> createState() => _StercsThemeDesignerPageState();
}

class _StercsThemeDesignerPageState extends State<StercsThemeDesignerPage> {
  bool _isLoading = false;
  String? _errorMessage;
  List<ThemeTemplate> _themeTemplates = [];
  List<ColorPalette> _colorPalettes = [];
  ThemeTemplate? _selectedTemplate;
  ColorPalette? _selectedPalette;
  bool _isEditing = false;
  final TextEditingController _themeNameController = TextEditingController();
  final TextEditingController _themeDescriptionController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadThemeTemplates();
  }

  Future<void> _loadThemeTemplates() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      // Simulate network delay
      await Future.delayed(const Duration(seconds: 1));

      // Mock color palettes
      setState(() {
        _colorPalettes = [
          ColorPalette(
            id: 1,
            name: 'Ocean Breeze',
            primaryColor: Colors.blue.shade700,
            secondaryColor: Colors.cyan.shade500,
            accentColor: Colors.teal.shade300,
            backgroundColor: Colors.blue.shade50,
            textColor: Colors.black87,
          ),
          ColorPalette(
            id: 2,
            name: 'Sunset Glow',
            primaryColor: Colors.orange.shade700,
            secondaryColor: Colors.deepOrange.shade500,
            accentColor: Colors.amber.shade300,
            backgroundColor: Colors.orange.shade50,
            textColor: Colors.black87,
          ),
          ColorPalette(
            id: 3,
            name: 'Forest Harmony',
            primaryColor: Colors.green.shade700,
            secondaryColor: Colors.lightGreen.shade500,
            accentColor: Colors.lime.shade300,
            backgroundColor: Colors.green.shade50,
            textColor: Colors.black87,
          ),
          ColorPalette(
            id: 4,
            name: 'Midnight Elegance',
            primaryColor: Colors.purple.shade700,
            secondaryColor: Colors.deepPurple.shade500,
            accentColor: Colors.pink.shade300,
            backgroundColor: Colors.purple.shade50,
            textColor: Colors.black87,
          ),
          ColorPalette(
            id: 5,
            name: 'Arctic Frost',
            primaryColor: Colors.indigo.shade700,
            secondaryColor: Colors.blue.shade500,
            accentColor: Colors.cyan.shade300,
            backgroundColor: Colors.indigo.shade50,
            textColor: Colors.black87,
          ),
        ];

        // Mock theme templates
        _themeTemplates = [
          ThemeTemplate(
            id: 1,
            name: 'Minimalist',
            description: 'Clean and simple design with ample white space',
            previewImageUrl: 'https://via.placeholder.com/300x200/4ECDC4/FFFFFF?text=Minimalist',
            author: 'Design Studio',
            authorAvatar: 'https://via.placeholder.com/50x50/4ECDC4/FFFFFF?text=DS',
            createdDate: DateTime.now().subtract(const Duration(days: 10)),
            downloads: 1250,
            likes: 89,
            isPremium: false,
            colorPalette: _colorPalettes[0],
          ),
          ThemeTemplate(
            id: 2,
            name: 'Bold & Vibrant',
            description: 'Eye-catching design with vibrant colors and bold typography',
            previewImageUrl: 'https://via.placeholder.com/300x200/FF6B6B/FFFFFF?text=Bold+%26+Vibrant',
            author: 'Creative Minds',
            authorAvatar: 'https://via.placeholder.com/50x50/FF6B6B/FFFFFF?text=CM',
            createdDate: DateTime.now().subtract(const Duration(days: 15)),
            downloads: 2100,
            likes: 156,
            isPremium: true,
            colorPalette: _colorPalettes[1],
          ),
          ThemeTemplate(
            id: 3,
            name: 'Professional',
            description: 'Corporate design suitable for business applications',
            previewImageUrl: 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Professional',
            author: 'Business Design Co',
            authorAvatar: 'https://via.placeholder.com/50x50/45B7D1/FFFFFF?text=BDC',
            createdDate: DateTime.now().subtract(const Duration(days: 5)),
            downloads: 890,
            likes: 67,
            isPremium: false,
            colorPalette: _colorPalettes[2],
          ),
          ThemeTemplate(
            id: 4,
            name: 'Dark Mode',
            description: 'Sleek dark theme for reduced eye strain',
            previewImageUrl: 'https://via.placeholder.com/300x200/2D3436/FFFFFF?text=Dark+Mode',
            author: 'Night Owls',
            authorAvatar: 'https://via.placeholder.com/50x50/2D3436/FFFFFF?text=NO',
            createdDate: DateTime.now().subtract(const Duration(days: 20)),
            downloads: 3200,
            likes: 245,
            isPremium: true,
            colorPalette: _colorPalettes[3],
          ),
          ThemeTemplate(
            id: 5,
            name: 'Vintage',
            description: 'Retro-inspired design with nostalgic elements',
            previewImageUrl: 'https://via.placeholder.com/300x200/FFEAA7/000000?text=Vintage',
            author: 'Retro Revival',
            authorAvatar: 'https://via.placeholder.com/50x50/FFEAA7/000000?text=RR',
            createdDate: DateTime.now().subtract(const Duration(days: 2)),
            downloads: 560,
            likes: 42,
            isPremium: false,
            colorPalette: _colorPalettes[4],
          ),
        ];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load theme templates. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  void _createNewTheme() {
    _themeNameController.clear();
    _themeDescriptionController.clear();
    _selectedTemplate = null;
    _selectedPalette = null;
    _isEditing = false;
    _showThemeFormDialog();
  }

  void _editTheme(ThemeTemplate theme) {
    _themeNameController.text = theme.name;
    _themeDescriptionController.text = theme.description;
    _selectedTemplate = theme;
    _selectedPalette = theme.colorPalette;
    _isEditing = true;
    _showThemeFormDialog();
  }

  void _showThemeFormDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: Text(_isEditing ? 'Edit Theme' : 'Create New Theme'),
              content: SizedBox(
                width: MediaQuery.of(context).size.width * 0.8,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(
                      controller: _themeNameController,
                      decoration: const InputDecoration(
                        labelText: 'Theme Name',
                        border: OutlineInputBorder(),
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: _themeDescriptionController,
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
                        itemCount: _themeTemplates.length,
                        itemBuilder: (context, index) {
                          var template = _themeTemplates[index];
                          bool isSelected = _selectedTemplate?.id == template.id;
                          
                          return Padding(
                            padding: const EdgeInsets.only(right: 8.0),
                            child: GestureDetector(
                              onTap: () {
                                setState(() {
                                  _selectedTemplate = template;
                                });
                              },
                              child: Column(
                                children: [
                                  Container(
                                    width: 80,
                                    height: 60,
                                    decoration: BoxDecoration(
                                      border: isSelected 
                                        ? Border.all(color: Theme.of(context).primaryColor, width: 2)
                                        : null,
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
                    const SizedBox(height: 16),
                    const Text(
                      'Select Color Palette:',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      height: 60,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _colorPalettes.length,
                        itemBuilder: (context, index) {
                          var palette = _colorPalettes[index];
                          bool isSelected = _selectedPalette?.id == palette.id;
                          
                          return Padding(
                            padding: const EdgeInsets.only(right: 8.0),
                            child: GestureDetector(
                              onTap: () {
                                setState(() {
                                  _selectedPalette = palette;
                                });
                              },
                              child: Container(
                                width: 100,
                                decoration: BoxDecoration(
                                  border: isSelected 
                                    ? Border.all(color: Theme.of(context).primaryColor, width: 2)
                                    : null,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Column(
                                  children: [
                                    Expanded(
                                      child: Row(
                                        children: [
                                          Expanded(
                                            child: Container(
                                              decoration: BoxDecoration(
                                                color: palette.primaryColor,
                                                borderRadius: const BorderRadius.only(
                                                  topLeft: Radius.circular(8),
                                                ),
                                              ),
                                            ),
                                          ),
                                          Expanded(
                                            child: Container(
                                              decoration: BoxDecoration(
                                                color: palette.secondaryColor,
                                              ),
                                            ),
                                          ),
                                          Expanded(
                                            child: Container(
                                              decoration: BoxDecoration(
                                                color: palette.accentColor,
                                                borderRadius: const BorderRadius.only(
                                                  topRight: Radius.circular(8),
                                                ),
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Container(
                                      height: 20,
                                      decoration: BoxDecoration(
                                        color: palette.backgroundColor,
                                        borderRadius: const BorderRadius.only(
                                          bottomLeft: Radius.circular(8),
                                          bottomRight: Radius.circular(8),
                                        ),
                                      ),
                                      child: Center(
                                        child: Text(
                                          palette.name,
                                          style: const TextStyle(
                                            fontSize: 10,
                                            color: Colors.black54,
                                          ),
                                          textAlign: TextAlign.center,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
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
                    if (_themeNameController.text.isNotEmpty) {
                      if (_isEditing) {
                        // Update existing theme
                        setState(() {
                          int index = _themeTemplates.indexWhere((t) => t.id == _selectedTemplate!.id);
                          if (index != -1) {
                            _themeTemplates[index] = ThemeTemplate(
                              id: _selectedTemplate!.id,
                              name: _themeNameController.text,
                              description: _themeDescriptionController.text,
                              previewImageUrl: _selectedTemplate!.previewImageUrl,
                              author: _selectedTemplate!.author,
                              authorAvatar: _selectedTemplate!.authorAvatar,
                              createdDate: _selectedTemplate!.createdDate,
                              downloads: _selectedTemplate!.downloads,
                              likes: _selectedTemplate!.likes,
                              isPremium: _selectedTemplate!.isPremium,
                              colorPalette: _selectedPalette ?? _selectedTemplate!.colorPalette,
                            );
                          }
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Theme updated successfully'),
                            backgroundColor: Colors.green,
                          ),
                        );
                      } else {
                        // Create new theme
                        setState(() {
                          _themeTemplates.add(ThemeTemplate(
                            id: _themeTemplates.length + 1,
                            name: _themeNameController.text,
                            description: _themeDescriptionController.text,
                            previewImageUrl: 'https://via.placeholder.com/300x200/DDDDDD/FFFFFF?text=New+Theme',
                            author: 'You',
                            authorAvatar: 'https://via.placeholder.com/50x50/DDDDDD/FFFFFF?text=Y',
                            createdDate: DateTime.now(),
                            downloads: 0,
                            likes: 0,
                            isPremium: false,
                            colorPalette: _selectedPalette ?? _colorPalettes[0],
                          ));
                        });
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Theme created successfully'),
                            backgroundColor: Colors.green,
                          ),
                        );
                      }
                      Navigator.pop(context);
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Please enter a theme name'),
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

  void _deleteTheme(ThemeTemplate theme) {
    setState(() {
      _themeTemplates.removeWhere((t) => t.id == theme.id);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Deleted theme: ${theme.name}'),
        backgroundColor: Colors.red,
      ),
    );
  }

  void _applyTheme(ThemeTemplate theme) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Applied theme: ${theme.name}'),
        backgroundColor: Colors.blue,
      ),
    );
  }

  void _previewTheme(ThemeTemplate theme) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(25.0)),
      ),
      builder: (context) => _buildThemePreviewSheet(theme),
    );
  }

  Widget _buildThemePreviewSheet(ThemeTemplate theme) {
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
                  theme.name,
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
            height: 200,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(theme.previewImageUrl),
                fit: BoxFit.contain,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            theme.description,
            style: const TextStyle(
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 16),
          _buildInfoRow('Author', theme.author),
          _buildInfoRow('Created', _formatDate(theme.createdDate)),
          _buildInfoRow('Downloads', '${theme.downloads}'),
          _buildInfoRow('Likes', '${theme.likes}'),
          const SizedBox(height: 16),
          // Color palette preview
          const Text(
            'Color Palette:',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
          const SizedBox(height: 8),
          Container(
            height: 50,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(8),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: theme.colorPalette.primaryColor,
                      borderRadius: const BorderRadius.only(
                        topLeft: Radius.circular(8),
                        bottomLeft: Radius.circular(8),
                      ),
                    ),
                    child: const Center(
                      child: Text(
                        'Primary',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: theme.colorPalette.secondaryColor,
                    ),
                    child: const Center(
                      child: Text(
                        'Secondary',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: theme.colorPalette.accentColor,
                    ),
                    child: const Center(
                      child: Text(
                        'Accent',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(
                      color: theme.colorPalette.backgroundColor,
                      borderRadius: const BorderRadius.only(
                        topRight: Radius.circular(8),
                        bottomRight: Radius.circular(8),
                      ),
                    ),
                    child: Center(
                      child: Text(
                        'Background',
                        style: TextStyle(
                          color: theme.colorPalette.textColor,
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton.icon(
                onPressed: () => _applyTheme(theme),
                icon: const Icon(Icons.check),
                label: const Text('Apply'),
              ),
              const SizedBox(width: 8),
              TextButton.icon(
                onPressed: () => _editTheme(theme),
                icon: const Icon(Icons.edit),
                label: const Text('Edit'),
              ),
              const SizedBox(width: 8),
              TextButton.icon(
                onPressed: () => _deleteTheme(theme),
                icon: const Icon(Icons.delete),
                label: const Text('Delete'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        children: [
          SizedBox(
            width: 100,
            child: Text(
              '$label:',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Expanded(
            child: Text(value),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('STERCS Theme Designer'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadThemeTemplates,
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () {
              // Open settings
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Opening theme designer settings'),
                  backgroundColor: Colors.blue,
                ),
              );
            },
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadThemeTemplates,
        child: _isLoading && _themeTemplates.isEmpty
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage != null && _themeTemplates.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(_errorMessage!),
                        const SizedBox(height: 16),
                        ElevatedButton(
                          onPressed: _loadThemeTemplates,
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
                                _buildStatItem('Themes', '${_themeTemplates.length}'),
                                _buildStatItem('Premium',
                                    '${_themeTemplates.where((theme) => theme.isPremium).length}'),
                                _buildStatItem('Downloads',
                                    '${_themeTemplates.fold(0, (sum, theme) => sum + theme.downloads)}'),
                                _buildStatItem('Likes',
                                    '${_themeTemplates.fold(0, (sum, theme) => sum + theme.likes)}'),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(height: 24),
                        // Themes List
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Theme Templates',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                            ),
                            TextButton.icon(
                              onPressed: _createNewTheme,
                              icon: const Icon(Icons.add),
                              label: const Text('New Theme'),
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
                            itemCount: _themeTemplates.length,
                            itemBuilder: (context, index) {
                              var theme = _themeTemplates[index];
                              return Card(
                                child: InkWell(
                                  onTap: () => _previewTheme(theme),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(
                                        height: 100,
                                        decoration: BoxDecoration(
                                          image: DecorationImage(
                                            image: NetworkImage(theme.previewImageUrl),
                                            fit: BoxFit.cover,
                                          ),
                                        ),
                                      ),
                                      Padding(
                                        padding: const EdgeInsets.all(8.0),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                              children: [
                                                Expanded(
                                                  child: Text(
                                                    theme.name,
                                                    style: const TextStyle(
                                                      fontWeight: FontWeight.bold,
                                                    ),
                                                    maxLines: 1,
                                                    overflow: TextOverflow.ellipsis,
                                                  ),
                                                ),
                                                if (theme.isPremium)
                                                  Container(
                                                    padding: const EdgeInsets.symmetric(
                                                        horizontal: 6, vertical: 2),
                                                    decoration: BoxDecoration(
                                                      color: Colors.orange,
                                                      borderRadius: BorderRadius.circular(12),
                                                    ),
                                                    child: const Text(
                                                      'Premium',
                                                      style: TextStyle(
                                                        color: Colors.white,
                                                        fontSize: 10,
                                                      ),
                                                    ),
                                                  ),
                                              ],
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              theme.description,
                                              style: const TextStyle(
                                                fontSize: 12,
                                                color: Colors.grey,
                                              ),
                                              maxLines: 2,
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                            const SizedBox(height: 8),
                                            Row(
                                              children: [
                                                CircleAvatar(
                                                  radius: 10,
                                                  backgroundImage: NetworkImage(theme.authorAvatar),
                                                ),
                                                const SizedBox(width: 4),
                                                Text(
                                                  theme.author,
                                                  style: const TextStyle(
                                                    fontSize: 10,
                                                  ),
                                                ),
                                                const Spacer(),
                                                Text(
                                                  _formatRelativeTime(theme.createdDate),
                                                  style: const TextStyle(
                                                    fontSize: 10,
                                                    color: Colors.grey,
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const SizedBox(height: 8),
                                            Row(
                                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                              children: [
                                                Row(
                                                  children: [
                                                    const Icon(
                                                      Icons.download,
                                                      size: 14,
                                                      color: Colors.grey,
                                                    ),
                                                    const SizedBox(width: 2),
                                                    Text(
                                                      '${theme.downloads}',
                                                      style: const TextStyle(
                                                        fontSize: 12,
                                                      ),
                                                    ),
                                                    const SizedBox(width: 8),
                                                    const Icon(
                                                      Icons.thumb_up,
                                                      size: 14,
                                                      color: Colors.grey,
                                                    ),
                                                    const SizedBox(width: 2),
                                                    Text(
                                                      '${theme.likes}',
                                                      style: const TextStyle(
                                                        fontSize: 12,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                PopupMenuButton<String>(
                                                  icon: const Icon(Icons.more_vert, size: 20),
                                                  onSelected: (String result) {
                                                    switch (result) {
                                                      case 'edit':
                                                        _editTheme(theme);
                                                        break;
                                                      case 'apply':
                                                        _applyTheme(theme);
                                                        break;
                                                      case 'delete':
                                                        _deleteTheme(theme);
                                                        break;
                                                    }
                                                  },
                                                  itemBuilder: (BuildContext context) =>
                                                      <PopupMenuEntry<String>>[
                                                    const PopupMenuItem<String>(
                                                      value: 'apply',
                                                      child: Text('Apply'),
                                                    ),
                                                    const PopupMenuItem<String>(
                                                      value: 'edit',
                                                      child: Text('Edit'),
                                                    ),
                                                    const PopupMenuItem<String>(
                                                      value: 'delete',
                                                      child: Text('Delete'),
                                                    ),
                                                  ],
                                                ),
                                              ],
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
        onPressed: _createNewTheme,
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

  String _formatDate(DateTime date) {
    return '${date.month}/${date.day}/${date.year}';
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

class ThemeTemplate {
  final int id;
  final String name;
  final String description;
  final String previewImageUrl;
  final String author;
  final String authorAvatar;
  final DateTime createdDate;
  final int downloads;
  final int likes;
  final bool isPremium;
  final ColorPalette colorPalette;

  ThemeTemplate({
    required this.id,
    required this.name,
    required this.description,
    required this.previewImageUrl,
    required this.author,
    required this.authorAvatar,
    required this.createdDate,
    required this.downloads,
    required this.likes,
    required this.isPremium,
    required this.colorPalette,
  });
}

class ColorPalette {
  final int id;
  final String name;
  final Color primaryColor;
  final Color secondaryColor;
  final Color accentColor;
  final Color backgroundColor;
  final Color textColor;

  ColorPalette({
    required this.id,
    required this.name,
    required this.primaryColor,
    required this.secondaryColor,
    required this.accentColor,
    required this.backgroundColor,
    required this.textColor,
  });
}