import 'package:flutter/material.dart';

class PropertiesPanel extends StatefulWidget {
  final Map<String, dynamic> properties;
  final Function(Map<String, dynamic>)? onPropertiesChanged;

  const PropertiesPanel({
    Key? key,
    required this.properties,
    this.onPropertiesChanged,
  }) : super(key: key);

  @override
  _PropertiesPanelState createState() => _PropertiesPanelState();
}

class _PropertiesPanelState extends State<PropertiesPanel> {
  late Map<String, dynamic> _localProperties;

  @override
  void initState() {
    super.initState();
    _localProperties = Map.from(widget.properties);
  }

  void _updateProperty(String key, dynamic value) {
    setState(() {
      _localProperties[key] = value;
    });
    
    if (widget.onPropertiesChanged != null) {
      widget.onPropertiesChanged!(_localProperties);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 300,
      decoration: BoxDecoration(
        color: Colors.grey[50],
        border: Border(
          left: BorderSide(
            color: Colors.grey[300]!,
            width: 1,
          ),
        ),
      ),
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(Icons.tune, color: Colors.grey[600]),
                  SizedBox(width: 8),
                  Text(
                    'Properties',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey[700],
                    ),
                  ),
                ],
              ),
              SizedBox(height: 16),
              
              ..._localProperties.entries.map((entry) {
                return _buildPropertyField(entry.key, entry.value);
              }).toList(),
            ],
          ),
        ),
      ),
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
    } else if (value is List) {
      return _buildListField(key, value);
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
              hintText: 'Enter $key',
            ),
            controller: TextEditingController(text: value),
            onChanged: (newValue) => _updateProperty(key, newValue),
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
              hintText: 'Enter $key',
            ),
            controller: TextEditingController(text: value.toString()),
            keyboardType: TextInputType.number,
            onChanged: (newValue) {
              if (newValue.isEmpty) return;
              int? parsedValue = int.tryParse(newValue);
              if (parsedValue != null) {
                _updateProperty(key, parsedValue);
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
              hintText: 'Enter $key',
            ),
            controller: TextEditingController(text: value.toString()),
            keyboardType: TextInputType.numberWithOptions(decimal: true),
            onChanged: (newValue) {
              if (newValue.isEmpty) return;
              double? parsedValue = double.tryParse(newValue);
              if (parsedValue != null) {
                _updateProperty(key, parsedValue);
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
            onChanged: (newValue) => _updateProperty(key, newValue),
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

  Widget _buildListField(String key, List<dynamic> value) {
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
            decoration: BoxDecoration(
              border: Border.all(color: Colors.grey[400]!),
              borderRadius: BorderRadius.circular(4),
            ),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                isExpanded: true,
                value: value.isNotEmpty ? value.first.toString() : null,
                hint: Text('Select option'),
                items: value.map((item) {
                  return DropdownMenuItem(
                    value: item.toString(),
                    child: Text(item.toString()),
                  );
                }).toList(),
                onChanged: (newValue) {
                  if (newValue != null) {
                    _updateProperty(key, [newValue]);
                  }
                },
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
                _updateProperty(key, selectedColor);
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