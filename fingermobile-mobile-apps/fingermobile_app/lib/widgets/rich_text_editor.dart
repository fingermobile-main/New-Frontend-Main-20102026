import 'package:flutter/material.dart';

class RichTextEditor extends StatefulWidget {
  final String? initialText;
  final Function(String)? onSave;
  final bool readOnly;

  const RichTextEditor({
    Key? key,
    this.initialText,
    this.onSave,
    this.readOnly = false,
  }) : super(key: key);

  @override
  _RichTextEditorState createState() => _RichTextEditorState();
}

class _RichTextEditorState extends State<RichTextEditor> {
  late TextEditingController _controller;
  bool _isBold = false;
  bool _isItalic = false;
  bool _isUnderline = false;
  bool _isStrikethrough = false;
  TextAlign _textAlign = TextAlign.left;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialText ?? '');
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Toolbar
        Container(
          padding: EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.grey[100],
            border: Border.all(color: Colors.grey[300]!),
            borderRadius: BorderRadius.vertical(top: Radius.circular(8)),
          ),
          child: Wrap(
            spacing: 4,
            children: [
              _buildToolbarButton(
                Icons.format_bold,
                'Bold',
                _isBold,
                () => _toggleStyle(TextDecoration.bold),
              ),
              _buildToolbarButton(
                Icons.format_italic,
                'Italic',
                _isItalic,
                () => _toggleStyle(TextDecoration.italic),
              ),
              _buildToolbarButton(
                Icons.format_underlined,
                'Underline',
                _isUnderline,
                () => _toggleStyle(TextDecoration.underline),
              ),
              _buildToolbarButton(
                Icons.format_strikethrough,
                'Strikethrough',
                _isStrikethrough,
                () => _toggleStyle(TextDecoration.lineThrough),
              ),
              SizedBox(width: 16),
              _buildToolbarButton(
                Icons.format_align_left,
                'Align Left',
                _textAlign == TextAlign.left,
                () => _setTextAlign(TextAlign.left),
              ),
              _buildToolbarButton(
                Icons.format_align_center,
                'Align Center',
                _textAlign == TextAlign.center,
                () => _setTextAlign(TextAlign.center),
              ),
              _buildToolbarButton(
                Icons.format_align_right,
                'Align Right',
                _textAlign == TextAlign.right,
                () => _setTextAlign(TextAlign.right),
              ),
              _buildToolbarButton(
                Icons.format_list_bulleted,
                'Bullet List',
                false,
                () => _insertList(false),
              ),
              _buildToolbarButton(
                Icons.format_list_numbered,
                'Numbered List',
                false,
                () => _insertList(true),
              ),
              _buildToolbarButton(
                Icons.link,
                'Insert Link',
                false,
                () => _insertLink(),
              ),
              _buildToolbarButton(
                Icons.image,
                'Insert Image',
                false,
                () => _insertImage(),
              ),
              _buildToolbarButton(
                Icons.video_call,
                'Insert Video',
                false,
                () => _insertVideo(),
              ),
            ],
          ),
        ),
        
        // Editor
        Expanded(
          child: Container(
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(
                left: BorderSide(color: Colors.grey[300]!),
                right: BorderSide(color: Colors.grey[300]!),
                bottom: BorderSide(color: Colors.grey[300]!),
              ),
            ),
            child: TextField(
              controller: _controller,
              maxLines: null,
              expands: true,
              keyboardType: TextInputType.multiline,
              textInputAction: TextInputAction.newline,
              textAlign: _textAlign,
              decoration: InputDecoration(
                hintText: 'Start writing here...',
                border: InputBorder.none,
              ),
              style: TextStyle(
                fontWeight: _isBold ? FontWeight.bold : FontWeight.normal,
                fontStyle: _isItalic ? FontStyle.italic : FontStyle.normal,
                decoration: _getDecorations(),
              ),
            ),
          ),
        ),
        
        // Action buttons
        Container(
          padding: EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.grey[100],
            border: Border.all(color: Colors.grey[300]!),
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
                  widget.onSave?.call(_controller.text);
                  Navigator.of(context).pop();
                },
                child: Text('Save'),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildToolbarButton(
    IconData icon,
    String tooltip,
    bool isActive,
    VoidCallback onPressed,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: isActive ? Colors.blue[100] : Colors.transparent,
        borderRadius: BorderRadius.circular(4),
      ),
      child: IconButton(
        icon: Icon(icon, size: 18),
        tooltip: tooltip,
        onPressed: onPressed,
        color: isActive ? Colors.blue : Colors.grey[700],
      ),
    );
  }

  void _toggleStyle(TextDecoration decoration) {
    setState(() {
      switch (decoration) {
        case TextDecoration.bold:
          _isBold = !_isBold;
          break;
        case TextDecoration.italic:
          _isItalic = !_isItalic;
          break;
        case TextDecoration.underline:
          _isUnderline = !_isUnderline;
          break;
        case TextDecoration.lineThrough:
          _isStrikethrough = !_isStrikethrough;
          break;
        default:
          break;
      }
    });
  }

  TextDecoration _getDecorations() {
    final decorations = <TextDecoration>[];
    if (_isUnderline) decorations.add(TextDecoration.underline);
    if (_isStrikethrough) decorations.add(TextDecoration.lineThrough);
    return TextDecoration.combine(decorations);
  }

  void _setTextAlign(TextAlign align) {
    setState(() {
      _textAlign = align;
    });
  }

  void _insertList(bool numbered) {
    final currentText = _controller.text;
    final newText = '$currentText\n${numbered ? '1. ' : '• '}';
    _controller.text = newText;
    _controller.selection = TextSelection.fromPosition(
      TextPosition(offset: newText.length),
    );
  }

  void _insertLink() {
    showDialog(
      context: context,
      builder: (context) {
        final linkController = TextEditingController();
        final textController = TextEditingController();
        
        return AlertDialog(
          title: Text('Insert Link'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: textController,
                decoration: InputDecoration(
                  hintText: 'Link text',
                ),
              ),
              SizedBox(height: 16),
              TextField(
                controller: linkController,
                decoration: InputDecoration(
                  hintText: 'URL',
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                final currentText = _controller.text;
                final newText = '$currentText[${textController.text}](${linkController.text})';
                _controller.text = newText;
                _controller.selection = TextSelection.fromPosition(
                  TextPosition(offset: newText.length),
                );
                Navigator.of(context).pop();
              },
              child: Text('Insert'),
            ),
          ],
        );
      },
    );
  }

  void _insertImage() {
    showDialog(
      context: context,
      builder: (context) {
        final urlController = TextEditingController();
        final altController = TextEditingController();
        
        return AlertDialog(
          title: Text('Insert Image'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: urlController,
                decoration: InputDecoration(
                  hintText: 'Image URL',
                ),
              ),
              SizedBox(height: 16),
              TextField(
                controller: altController,
                decoration: InputDecoration(
                  hintText: 'Alternative text',
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                final currentText = _controller.text;
                final newText = '$currentText![${altController.text}](${urlController.text})';
                _controller.text = newText;
                _controller.selection = TextSelection.fromPosition(
                  TextPosition(offset: newText.length),
                );
                Navigator.of(context).pop();
              },
              child: Text('Insert'),
            ),
          ],
        );
      },
    );
  }

  void _insertVideo() {
    showDialog(
      context: context,
      builder: (context) {
        final urlController = TextEditingController();
        
        return AlertDialog(
          title: Text('Insert Video'),
          content: TextField(
            controller: urlController,
            decoration: InputDecoration(
              hintText: 'Video URL',
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                final currentText = _controller.text;
                final newText = '$currentText\n[Video: ${urlController.text}]';
                _controller.text = newText;
                _controller.selection = TextSelection.fromPosition(
                  TextPosition(offset: newText.length),
                );
                Navigator.of(context).pop();
              },
              child: Text('Insert'),
            ),
          ],
        );
      },
    );
  }
}