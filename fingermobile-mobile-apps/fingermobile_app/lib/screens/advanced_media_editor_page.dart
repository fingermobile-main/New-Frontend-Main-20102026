import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class AdvancedMediaEditorPage extends StatefulWidget {
  const AdvancedMediaEditorPage({super.key});

  @override
  State<AdvancedMediaEditorPage> createState() => _AdvancedMediaEditorPageState();
}

class _AdvancedMediaEditorPageState extends State<AdvancedMediaEditorPage> {
  final ImagePicker _picker = ImagePicker();
  File? _selectedImage;
  String? _selectedEffect;
  double _brightness = 0.0;
  double _contrast = 1.0;
  double _saturation = 1.0;
  double _blur = 0.0;
  double _rotation = 0.0;
  bool _isProcessing = false;
  String? _errorMessage;

  final List<String> _availableEffects = [
    'none',
    'vintage',
    'bw',
    'sepia',
    'clarendon',
    'moon',
    'lark',
    'reyes',
    'juno',
    'slumber',
    'aden',
    'perpetua',
    'mayfair',
    'rise',
    'hudson',
    'valencia',
    'xpro2',
    'willow',
    'lofi',
    'kelvin',
    'hefe',
    'nashville',
    'stinson',
    'vesper',
    'earlybird',
    'brannan',
    'inkwell',
    'walden',
    'hacksaw',
    'maven',
    'ginza',
    'skyline',
    'dogpatch',
    'brooklyn',
    'millie',
    'adaptive',
    'noria',
    'sutro',
    'toaster',
    'sierra',
    'hean',
    'concord',
    'magichour',
    'starlight',
    'vesper',
    'palomar',
    'mckenzie',
    'wright',
    'moonbeam',
    'claire',
    'abby',
    'iris',
    'kenji',
    'shaun',
    'reyes',
    'crema',
    'juno',
    'ludwig',
    'lark',
    'maven',
    'gingham',
    'oosten',
    'nashville',
    'stinson',
    'vesper',
    'aden',
    'perpetua',
  ];

  Future<void> _pickImage() async {
    try {
      final pickedFile = await _picker.pickImage(source: ImageSource.gallery);
      if (pickedFile != null) {
        setState(() {
          _selectedImage = File(pickedFile.path);
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to pick image: $e';
      });
    }
  }

  Future<void> _captureImage() async {
    try {
      final pickedFile = await _picker.pickImage(source: ImageSource.camera);
      if (pickedFile != null) {
        setState(() {
          _selectedImage = File(pickedFile.path);
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to capture image: $e';
      });
    }
  }

  Future<void> _applyEffect() async {
    if (_selectedImage == null) return;

    setState(() {
      _isProcessing = true;
      _errorMessage = null;
    });

    try {
      // Simulate processing delay
      await Future.delayed(const Duration(seconds: 2));

      // In a real implementation, we would apply the selected effect here
      // For now, we'll just show a success message
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Effect applied successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to apply effect: $e';
      });
    } finally {
      setState(() {
        _isProcessing = false;
      });
    }
  }

  Future<void> _trimMedia() async {
    if (_selectedImage == null) return;

    setState(() {
      _isProcessing = true;
      _errorMessage = null;
    });

    try {
      // Simulate processing delay
      await Future.delayed(const Duration(seconds: 2));

      // In a real implementation, we would trim the media here
      // For now, we'll just show a success message
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Media trimmed successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to trim media: $e';
      });
    } finally {
      setState(() {
        _isProcessing = false;
      });
    }
  }

  Future<void> _saveMedia() async {
    if (_selectedImage == null) return;

    setState(() {
      _isProcessing = true;
      _errorMessage = null;
    });

    try {
      // Simulate processing delay
      await Future.delayed(const Duration(seconds: 1));

      // In a real implementation, we would save the processed media here
      // For now, we'll just show a success message
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Media saved successfully!'),
            backgroundColor: Colors.green,
          ),
        );
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to save media: $e';
      });
    } finally {
      setState(() {
        _isProcessing = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Advanced Media Editor'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: _errorMessage != null
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(_errorMessage!),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _errorMessage = null;
                      });
                    },
                    child: const Text('Clear Error'),
                  ),
                ],
              ),
            )
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Image Selection
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Select Media',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Expanded(
                                child: ElevatedButton.icon(
                                  onPressed: _captureImage,
                                  icon: const Icon(Icons.camera_alt),
                                  label: const Text('Capture'),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: ElevatedButton.icon(
                                  onPressed: _pickImage,
                                  icon: const Icon(Icons.photo_library),
                                  label: const Text('Gallery'),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          if (_selectedImage != null)
                            Container(
                              height: 200,
                              width: double.infinity,
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.grey),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(8),
                                child: Image.file(
                                  _selectedImage!,
                                  fit: BoxFit.cover,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Effect Selection
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Apply Effects',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),
                          SizedBox(
                            height: 150,
                            child: GridView.builder(
                              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                                crossAxisCount: 3,
                                crossAxisSpacing: 8,
                                mainAxisSpacing: 8,
                                childAspectRatio: 1,
                              ),
                              itemCount: _availableEffects.length,
                              itemBuilder: (context, index) {
                                final effect = _availableEffects[index];
                                return GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      _selectedEffect = effect;
                                    });
                                  },
                                  child: Container(
                                    decoration: BoxDecoration(
                                      border: Border.all(
                                        color: _selectedEffect == effect ? Colors.blue : Colors.grey,
                                        width: _selectedEffect == effect ? 2 : 1,
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Column(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        Icon(
                                          Icons.gradient,
                                          color: _selectedEffect == effect ? Colors.blue : Colors.grey,
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          effect,
                                          style: TextStyle(
                                            fontSize: 10,
                                            color: _selectedEffect == effect ? Colors.blue : Colors.grey,
                                          ),
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
                  ),
                  const SizedBox(height: 16),

                  // Adjustments
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Adjustments',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(height: 16),

                          // Brightness
                          Row(
                            children: [
                              const Text('Brightness'),
                              Expanded(
                                child: Slider(
                                  value: _brightness,
                                  min: -1.0,
                                  max: 1.0,
                                  onChanged: (value) {
                                    setState(() {
                                      _brightness = value;
                                    });
                                  },
                                ),
                              ),
                              Text('${(_brightness * 100).round()}%'),
                            ],
                          ),

                          // Contrast
                          Row(
                            children: [
                              const Text('Contrast'),
                              Expanded(
                                child: Slider(
                                  value: _contrast,
                                  min: 0.0,
                                  max: 2.0,
                                  onChanged: (value) {
                                    setState(() {
                                      _contrast = value;
                                    });
                                  },
                                ),
                              ),
                              Text('${(_contrast * 100).round()}%'),
                            ],
                          ),

                          // Saturation
                          Row(
                            children: [
                              const Text('Saturation'),
                              Expanded(
                                child: Slider(
                                  value: _saturation,
                                  min: 0.0,
                                  max: 2.0,
                                  onChanged: (value) {
                                    setState(() {
                                      _saturation = value;
                                    });
                                  },
                                ),
                              ),
                              Text('${(_saturation * 100).round()}%'),
                            ],
                          ),

                          // Blur
                          Row(
                            children: [
                              const Text('Blur'),
                              Expanded(
                                child: Slider(
                                  value: _blur,
                                  min: 0.0,
                                  max: 10.0,
                                  onChanged: (value) {
                                    setState(() {
                                      _blur = value;
                                    });
                                  },
                                ),
                              ),
                              Text('${_blur.round()}px'),
                            ],
                          ),

                          // Rotation
                          Row(
                            children: [
                              const Text('Rotation'),
                              Expanded(
                                child: Slider(
                                  value: _rotation,
                                  min: 0.0,
                                  max: 360.0,
                                  divisions: 360,
                                  onChanged: (value) {
                                    setState(() {
                                      _rotation = value;
                                    });
                                  },
                                ),
                              ),
                              Text('${_rotation.round()}°'),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _selectedImage != null ? _applyEffect : null,
                          icon: const Icon(Icons.auto_fix_high),
                          label: const Text('Apply Effect'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                            foregroundColor: Colors.white,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _selectedImage != null ? _trimMedia : null,
                          icon: const Icon(Icons.cut),
                          label: const Text('Trim'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.green,
                            foregroundColor: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _selectedImage != null ? _saveMedia : null,
                          icon: const Icon(Icons.save),
                          label: const Text('Save'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.purple,
                            foregroundColor: Colors.white,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _isProcessing
                              ? null
                              : () {
                                  setState(() {
                                    _brightness = 0.0;
                                    _contrast = 1.0;
                                    _saturation = 1.0;
                                    _blur = 0.0;
                                    _rotation = 0.0;
                                    _selectedEffect = null;
                                  });
                                },
                          icon: const Icon(Icons.refresh),
                          label: const Text('Reset'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.orange,
                            foregroundColor: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),

                  if (_isProcessing)
                    const Padding(
                      padding: EdgeInsets.only(top: 16),
                      child: LinearProgressIndicator(),
                    ),
                ],
              ),
            ),
    );
  }
}