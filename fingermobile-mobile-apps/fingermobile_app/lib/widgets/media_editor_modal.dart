import 'package:flutter/material.dart';

class MediaEditorModal extends StatefulWidget {
  final String? imageUrl;
  final Function(String)? onSave;

  const MediaEditorModal({
    Key? key,
    this.imageUrl,
    this.onSave,
  }) : super(key: key);

  @override
  _MediaEditorModalState createState() => _MediaEditorModalState();
}

class _MediaEditorModalState extends State<MediaEditorModal> {
  double _brightness = 0.0;
  double _contrast = 1.0;
  double _saturation = 1.0;
  double _rotation = 0.0;
  String _filter = 'none';

  @override
  Widget build(BuildContext context) {
    return Dialog(
      insetPadding: EdgeInsets.all(16),
      child: Container(
        height: MediaQuery.of(context).size.height * 0.8,
        child: Column(
          children: [
            // Modal Header
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.vertical(top: Radius.circular(8)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Media Editor',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.close),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),
            
            // Main Content
            Expanded(
              child: Row(
                children: [
                  // Preview Panel
                  Expanded(
                    flex: 3,
                    child: Container(
                      padding: EdgeInsets.all(16),
                      child: Column(
                        children: [
                          Expanded(
                            child: Container(
                              decoration: BoxDecoration(
                                color: Colors.black,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: widget.imageUrl != null
                                  ? Image.network(
                                      widget.imageUrl!,
                                      fit: BoxFit.contain,
                                    )
                                  : Container(
                                      child: Icon(
                                        Icons.image_not_supported,
                                        size: 64,
                                        color: Colors.grey,
                                      ),
                                    ),
                            ),
                          ),
                          SizedBox(height: 16),
                          Text(
                            'Original Preview',
                            style: TextStyle(
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  
                  // Controls Panel
                  Expanded(
                    flex: 2,
                    child: Container(
                      padding: EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.grey[50],
                      ),
                      child: SingleChildScrollView(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Filters
                            Text(
                              'Filters',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 8),
                            Wrap(
                              spacing: 8,
                              children: [
                                _buildFilterButton('none', 'Normal'),
                                _buildFilterButton('clarendon', 'Clarendon'),
                                _buildFilterButton('moon', 'Moon'),
                                _buildFilterButton('lark', 'Lark'),
                                _buildFilterButton('reyes', 'Reyes'),
                                _buildFilterButton('juno', 'Juno'),
                              ],
                            ),
                            SizedBox(height: 16),
                            
                            // Brightness
                            Text(
                              'Brightness: ${(_brightness * 100).round()}%',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            Slider(
                              value: _brightness,
                              min: -1.0,
                              max: 1.0,
                              onChanged: (value) {
                                setState(() {
                                  _brightness = value;
                                });
                              },
                            ),
                            
                            // Contrast
                            Text(
                              'Contrast: ${(_contrast * 100).round()}%',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            Slider(
                              value: _contrast,
                              min: 0.0,
                              max: 2.0,
                              onChanged: (value) {
                                setState(() {
                                  _contrast = value;
                                });
                              },
                            ),
                            
                            // Saturation
                            Text(
                              'Saturation: ${(_saturation * 100).round()}%',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            Slider(
                              value: _saturation,
                              min: 0.0,
                              max: 2.0,
                              onChanged: (value) {
                                setState(() {
                                  _saturation = value;
                                });
                              },
                            ),
                            
                            // Rotation
                            Text(
                              'Rotation: ${(_rotation * 180 / 3.14).round()}°',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            Slider(
                              value: _rotation,
                              min: 0.0,
                              max: 2 * 3.14,
                              divisions: 4,
                              label: '${(_rotation * 180 / 3.14).round()}°',
                              onChanged: (value) {
                                setState(() {
                                  _rotation = value;
                                });
                              },
                            ),
                            
                            SizedBox(height: 24),
                            
                            // Crop Button
                            ElevatedButton.icon(
                              icon: Icon(Icons.crop),
                              label: Text('Crop Image'),
                              onPressed: () {
                                // Open crop interface
                              },
                              style: ElevatedButton.styleFrom(
                                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              ),
                            ),
                            
                            SizedBox(height: 16),
                            
                            // Text Overlay Button
                            ElevatedButton.icon(
                              icon: Icon(Icons.text_fields),
                              label: Text('Add Text'),
                              onPressed: () {
                                // Open text overlay interface
                              },
                              style: ElevatedButton.styleFrom(
                                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              ),
                            ),
                            
                            SizedBox(height: 16),
                            
                            // Stickers Button
                            ElevatedButton.icon(
                              icon: Icon(Icons.emoji_emotions),
                              label: Text('Add Stickers'),
                              onPressed: () {
                                // Open stickers interface
                              },
                              style: ElevatedButton.styleFrom(
                                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            
            // Action Buttons
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.vertical(bottom: Radius.circular(8)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: Text('Cancel'),
                  ),
                  SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: () {
                      // Save the edited media
                      widget.onSave?.call(widget.imageUrl ?? '');
                      Navigator.of(context).pop();
                    },
                    child: Text('Save Changes'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterButton(String value, String label) {
    return ChoiceChip(
      label: Text(label),
      selected: _filter == value,
      onSelected: (selected) {
        setState(() {
          _filter = selected ? value : 'none';
        });
      },
    );
  }
}