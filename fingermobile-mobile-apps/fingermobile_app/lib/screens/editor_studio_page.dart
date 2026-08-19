import 'package:flutter/material.dart';

class EditorStudioPage extends StatefulWidget {
  const EditorStudioPage({super.key});

  @override
  State<EditorStudioPage> createState() => _EditorStudioPageState();
}

class _EditorStudioPageState extends State<EditorStudioPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Editor Studio'),
        centerTitle: false,
        backgroundColor: Colors.grey[900],
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.save),
            onPressed: () {
              // Save functionality
            },
          ),
          PopupMenuButton(
            icon: const Icon(Icons.more_vert),
            onSelected: (value) {
              if (value == 'export') {
                // Export functionality
              } else if (value == 'share') {
                // Share functionality
              } else if (value == 'settings') {
                // Navigate to editor settings
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'export',
                child: Text('Export'),
              ),
              const PopupMenuItem(
                value: 'share',
                child: Text('Share'),
              ),
              const PopupMenuItem(
                value: 'settings',
                child: Text('Settings'),
              ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          // Toolbar
          Container(
            height: 60,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            color: Colors.grey[100],
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                _buildToolbarButton(Icons.text_fields, 'Text'),
                const SizedBox(width: 8),
                _buildToolbarButton(Icons.image, 'Image'),
                const SizedBox(width: 8),
                _buildToolbarButton(Icons.video_call, 'Video'),
                const SizedBox(width: 8),
                _buildToolbarButton(Icons.audiotrack, 'Audio'),
                const SizedBox(width: 8),
                _buildToolbarButton(Icons.format_align_left, 'Align'),
                const SizedBox(width: 8),
                _buildToolbarButton(Icons.color_lens, 'Color'),
                const SizedBox(width: 8),
                _buildToolbarButton(Icons.format_shapes, 'Shapes'),
              ],
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Main editor area
          Expanded(
            child: Container(
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[50],
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey[300]!),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: double.infinity,
                      height: 150,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.grey[300]!),
                      ),
                      child: const Center(
                        child: Text(
                          'Content Editor Area',
                          style: TextStyle(
                            color: Colors.grey,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Title',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      width: double.infinity,
                      height: 50,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.grey[300]!),
                      ),
                      child: const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 12),
                        child: TextField(
                          decoration: InputDecoration(
                            hintText: 'Enter title here...',
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'Description',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      width: double.infinity,
                      height: 100,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: Colors.grey[300]!),
                      ),
                      child: const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        child: TextField(
                          maxLines: null,
                          expands: true,
                          textAlignVertical: TextAlignVertical.top,
                          decoration: InputDecoration(
                            hintText: 'Enter description here...',
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          
          // Bottom action buttons
          Container(
            height: 60,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            color: Colors.grey[100],
            child: Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      // Preview functionality
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey[300],
                      foregroundColor: Colors.black,
                    ),
                    child: const Text('Preview'),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      // Publish functionality
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                      foregroundColor: Colors.white,
                    ),
                    child: const Text('Publish'),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildToolbarButton(IconData icon, String label) {
    return Container(
      margin: const EdgeInsets.only(right: 8),
      child: OutlinedButton.icon(
        onPressed: () {
          // Handle toolbar button press
        },
        icon: Icon(icon, size: 16),
        label: Text(
          label,
          style: const TextStyle(fontSize: 12),
        ),
        style: OutlinedButton.styleFrom(
          side: BorderSide(color: Colors.grey[400]!),
        ),
      ),
    );
  }
}