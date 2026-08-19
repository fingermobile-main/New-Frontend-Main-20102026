import 'package:flutter/material.dart';

class RenderedComponent extends StatefulWidget {
  final Widget? child;
  final String? componentId;
  final String? componentName;
  final Map<String, dynamic>? properties;
  final Function(Map<String, dynamic>?)? onPropertyChanged;
  final bool isInteractive;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final Color? backgroundColor;

  const RenderedComponent({
    Key? key,
    this.child,
    this.componentId,
    this.componentName,
    this.properties,
    this.onPropertyChanged,
    this.isInteractive = true,
    this.padding,
    this.margin,
    this.backgroundColor,
  }) : super(key: key);

  @override
  _RenderedComponentState createState() => _RenderedComponentState();
}

class _RenderedComponentState extends State<RenderedComponent> {
  late Widget _renderedWidget;
  bool _isSelected = false;

  @override
  void initState() {
    super.initState();
    _renderedWidget = _buildWidget();
  }

  @override
  void didUpdateWidget(RenderedComponent oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.properties != widget.properties ||
        oldWidget.child != widget.child) {
      _renderedWidget = _buildWidget();
    }
  }

  Widget _buildWidget() {
    Widget content = widget.child ?? _getDefaultWidget();

    // Apply styling based on properties
    content = Container(
      padding: widget.padding ?? EdgeInsets.all(8),
      margin: widget.margin ?? EdgeInsets.all(4),
      decoration: BoxDecoration(
        color: widget.backgroundColor,
        border: Border.all(
          color: _isSelected ? Colors.blue : Colors.transparent,
          width: _isSelected ? 2 : 0,
        ),
        borderRadius: BorderRadius.circular(4),
      ),
      child: content,
    );

    if (widget.isInteractive) {
      content = GestureDetector(
        onTap: () {
          setState(() {
            _isSelected = !_isSelected;
          });
          // Notify parent about selection
          if (widget.onPropertyChanged != null) {
            widget.onPropertyChanged!({'selected': _isSelected});
          }
        },
        onLongPress: () {
          // Show context menu for editing
          _showContextMenu();
        },
        child: content,
      );
    }

    return content;
  }

  Widget _getDefaultWidget() {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.grey[100],
        border: Border.all(color: Colors.grey[300]!),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.widgets,
            size: 40,
            color: Colors.grey[400],
          ),
          SizedBox(height: 8),
          Text(
            widget.componentName ?? 'Component',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Colors.grey[600],
            ),
          ),
          if (widget.componentId != null) ...[
            SizedBox(height: 4),
            Text(
              'ID: ${widget.componentId}',
              style: TextStyle(
                fontSize: 12,
                color: Colors.grey[500],
              ),
            ),
          ],
        ],
      ),
    );
  }

  void _showContextMenu() {
    final RenderBox renderBox = context.findRenderObject() as RenderBox;
    final position = RelativeRect.fromSize(
      renderBox.localToGlobal(Offset.zero) & renderBox.size,
      renderBox.size,
    );

    showMenu(
      context: context,
      position: position,
      items: [
        PopupMenuItem(
          value: 'edit',
          child: Row(
            children: [
              Icon(Icons.edit, size: 18),
              SizedBox(width: 8),
              Text('Edit Properties'),
            ],
          ),
        ),
        PopupMenuItem(
          value: 'duplicate',
          child: Row(
            children: [
              Icon(Icons.copy, size: 18),
              SizedBox(width: 8),
              Text('Duplicate'),
            ],
          ),
        ),
        PopupMenuItem(
          value: 'delete',
          child: Row(
            children: [
              Icon(Icons.delete, size: 18, color: Colors.red),
              SizedBox(width: 8),
              Text('Delete', style: TextStyle(color: Colors.red)),
            ],
          ),
        ),
      ],
    ).then((value) {
      if (value != null) {
        _handleMenuSelection(value);
      }
    });
  }

  void _handleMenuSelection(String value) {
    switch (value) {
      case 'edit':
        _showPropertiesDialog();
        break;
      case 'duplicate':
        // Notify parent about duplication
        if (widget.onPropertyChanged != null) {
          widget.onPropertyChanged!({'action': 'duplicate'});
        }
        break;
      case 'delete':
        // Notify parent about deletion
        if (widget.onPropertyChanged != null) {
          widget.onPropertyChanged!({'action': 'delete'});
        }
        break;
    }
  }

  void _showPropertiesDialog() {
    if (widget.properties != null) {
      showDialog(
        context: context,
        builder: (context) => _PropertiesDialog(
          properties: widget.properties!,
          onPropertiesChanged: (updatedProps) {
            if (widget.onPropertyChanged != null) {
              widget.onPropertyChanged!(updatedProps);
            }
          },
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedSwitcher(
      duration: Duration(milliseconds: 150),
      child: _renderedWidget,
    );
  }
}

class _PropertiesDialog extends StatefulWidget {
  final Map<String, dynamic> properties;
  final Function(Map<String, dynamic>) onPropertiesChanged;

  const _PropertiesDialog({
    Key? key,
    required this.properties,
    required this.onPropertiesChanged,
  }) : super(key: key);

  @override
  __PropertiesDialogState createState() => __PropertiesDialogState();
}

class __PropertiesDialogState extends State<_PropertiesDialog> {
  late Map<String, dynamic> _localProperties;

  @override
  void initState() {
    super.initState();
    _localProperties = Map.from(widget.properties);
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: Text('Component Properties'),
      content: Container(
        width: 400,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ..._localProperties.entries.map((entry) {
                return _buildPropertyField(entry.key, entry.value);
              }).toList(),
            ],
          ),
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Text('Cancel'),
        ),
        TextButton(
          onPressed: () {
            widget.onPropertiesChanged(_localProperties);
            Navigator.of(context).pop();
          },
          child: Text('Apply'),
        ),
      ],
    );
  }

  Widget _buildPropertyField(String key, dynamic value) {
    if (value is String) {
      return _buildTextField(key, value);
    } else if (value is int) {
      return _buildIntegerField(key, value);
    } else if (value is double) {
      return _buildDoubleField(key, value);
    } else if (value is bool) {
      return _buildBooleanField(key, value);
    } else if (value is Color) {
      return _buildColorField(key, value);
    } else {
      return _buildTextField(key, value.toString());
    }
  }

  Widget _buildTextField(String key, String value) {
    return Padding(
      padding: EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            _formatPropertyName(key),
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Colors.grey[700],
            ),
          ),
          SizedBox(height: 4),
          TextField(
            decoration: InputDecoration(
              border: OutlineInputBorder(),
              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            ),
            controller: TextEditingController(text: value),
            onChanged: (newValue) => _localProperties[key] = newValue,
          ),
        ],
      ),
    );
  }

  Widget _buildIntegerField(String key, int value) {
    return Padding(
      padding: EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            _formatPropertyName(key),
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Colors.grey[700],
            ),
          ),
          SizedBox(height: 4),
          TextField(
            decoration: InputDecoration(
              border: OutlineInputBorder(),
              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            ),
            controller: TextEditingController(text: value.toString()),
            keyboardType: TextInputType.number,
            onChanged: (newValue) {
              int? parsedValue = int.tryParse(newValue);
              if (parsedValue != null) {
                _localProperties[key] = parsedValue;
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildDoubleField(String key, double value) {
    return Padding(
      padding: EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            _formatPropertyName(key),
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Colors.grey[700],
            ),
          ),
          SizedBox(height: 4),
          TextField(
            decoration: InputDecoration(
              border: OutlineInputBorder(),
              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            ),
            controller: TextEditingController(text: value.toString()),
            keyboardType: TextInputType.numberWithOptions(decimal: true),
            onChanged: (newValue) {
              double? parsedValue = double.tryParse(newValue);
              if (parsedValue != null) {
                _localProperties[key] = parsedValue;
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildBooleanField(String key, bool value) {
    return Padding(
      padding: EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            _formatPropertyName(key),
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Colors.grey[700],
            ),
          ),
          Switch(
            value: value,
            onChanged: (newValue) => _localProperties[key] = newValue,
          ),
        ],
      ),
    );
  }

  Widget _buildColorField(String key, Color value) {
    return Padding(
      padding: EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            _formatPropertyName(key),
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Colors.grey[700],
            ),
          ),
          SizedBox(height: 8),
          Container(
            height: 40,
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey[400]!),
              borderRadius: BorderRadius.circular(4),
              color: value,
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                borderRadius: BorderRadius.circular(4),
                onTap: () {
                  // Show color picker
                  _showColorPicker(key, value);
                },
                child: Container(
                  padding: EdgeInsets.symmetric(horizontal: 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '#${value.value.toRadixString(16).padLeft(8, '0').substring(2).toUpperCase()}',
                        style: TextStyle(
                          color: ThemeData.estimateBrightnessForColor(value) == Brightness.dark
                              ? Colors.white
                              : Colors.black,
                        ),
                      ),
                      Icon(
                        Icons.arrow_drop_down,
                        color: ThemeData.estimateBrightnessForColor(value) == Brightness.dark
                            ? Colors.white
                            : Colors.black,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatPropertyName(String name) {
    // Convert camelCase or snake_case to readable format
    return name
        .replaceAllMapped(RegExp(r'([A-Z])'), (match) => ' ${match.group(0)}')
        .replaceAll('_', ' ')
        .trim()
        .split(' ')
        .map((word) => word[0].toUpperCase() + word.substring(1).toLowerCase())
        .join(' ');
  }

  void _showColorPicker(String key, Color currentValue) {
    showDialog(
      context: context,
      builder: (context) {
        Color selectedColor = currentValue;
        return AlertDialog(
          title: Text('Select Color'),
          content: SingleChildScrollView(
            child: ColorPickerGrid(
              onColorSelected: (color) => selectedColor = color,
              initialColor: currentValue,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                _localProperties[key] = selectedColor;
                Navigator.of(context).pop();
              },
              child: Text('OK'),
            ),
          ],
        );
      },
    );
  }
}

class ColorPickerGrid extends StatefulWidget {
  final Function(Color) onColorSelected;
  final Color initialColor;

  const ColorPickerGrid({
    Key? key,
    required this.onColorSelected,
    required this.initialColor,
  }) : super(key: key);

  @override
  _ColorPickerGridState createState() => _ColorPickerGridState();
}

class _ColorPickerGridState extends State<ColorPickerGrid> {
  late Color _selectedColor;

  @override
  void initState() {
    super.initState();
    _selectedColor = widget.initialColor;
  }

  @override
  Widget build(BuildContext context) {
    final colors = [
      Colors.red, Colors.pink, Colors.purple, Colors.deepPurple,
      Colors.indigo, Colors.blue, Colors.lightBlue, Colors.cyan,
      Colors.teal, Colors.green, Colors.lightGreen, Colors.lime,
      Colors.yellow, Colors.amber, Colors.orange, Colors.deepOrange,
      Colors.brown, Colors.grey, Colors.blueGrey, Colors.black,
      Colors.white, Colors.transparent
    ];

    return Wrap(
      children: colors.map((color) {
        return Padding(
          padding: EdgeInsets.all(4),
          child: GestureDetector(
            onTap: () {
              setState(() {
                _selectedColor = color;
              });
              widget.onColorSelected(color);
            },
            child: Container(
              width: 30,
              height: 30,
              decoration: BoxDecoration(
                color: color,
                shape: BoxShape.rectangle,
                border: color == _selectedColor
                    ? Border.all(color: Colors.black, width: 2)
                    : Border.all(color: Colors.grey[300]!),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}