import 'package:flutter/material.dart';

class ProductEditorModal extends StatefulWidget {
  final Map<String, dynamic>? productData;
  final Function(Map<String, dynamic>)? onSave;
  final Function? onCancel;

  const ProductEditorModal({
    Key? key,
    this.productData,
    this.onSave,
    this.onCancel,
  }) : super(key: key);

  @override
  _ProductEditorModalState createState() => _ProductEditorModalState();
}

class _ProductEditorModalState extends State<ProductEditorModal> {
  final _formKey = GlobalKey<FormState>();
  
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  late TextEditingController _priceController;
  late TextEditingController _categoryController;
  late TextEditingController _tagsController;
  late TextEditingController _stockController;
  
  String _selectedCondition = 'New';
  String _selectedStatus = 'Draft';
  List<String> _imageUrls = [];
  String _mainImageUrl = '';
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    
    // Initialize controllers with product data if available
    _titleController = TextEditingController(
      text: widget.productData?['title'] ?? '',
    );
    _descriptionController = TextEditingController(
      text: widget.productData?['description'] ?? '',
    );
    _priceController = TextEditingController(
      text: widget.productData?['price']?.toString() ?? '',
    );
    _categoryController = TextEditingController(
      text: widget.productData?['category'] ?? '',
    );
    _tagsController = TextEditingController(
      text: widget.productData?['tags']?.join(', ') ?? '',
    );
    _stockController = TextEditingController(
      text: widget.productData?['stock']?.toString() ?? '0',
    );
    
    // Initialize dropdown selections
    _selectedCondition = widget.productData?['condition'] ?? 'New';
    _selectedStatus = widget.productData?['status'] ?? 'Draft';
    _imageUrls = List<String>.from(widget.productData?['images'] ?? []);
    _mainImageUrl = widget.productData?['mainImage'] ?? '';
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    _categoryController.dispose();
    _tagsController.dispose();
    _stockController.dispose();
    super.dispose();
  }

  void _saveProduct() {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isSubmitting = true;
      });

      // Simulate API call
      Future.delayed(Duration(seconds: 1)).then((_) {
        final productData = {
          'title': _titleController.text,
          'description': _descriptionController.text,
          'price': double.parse(_priceController.text),
          'category': _categoryController.text,
          'tags': _tagsController.text.split(',').map((tag) => tag.trim()).toList(),
          'stock': int.parse(_stockController.text),
          'condition': _selectedCondition,
          'status': _selectedStatus,
          'mainImage': _mainImageUrl,
          'images': _imageUrls,
        };

        if (widget.onSave != null) {
          widget.onSave!(productData);
        }
        
        setState(() {
          _isSubmitting = false;
        });
      });
    }
  }

  void _addImage() {
    showDialog(
      context: context,
      builder: (context) {
        final controller = TextEditingController();
        return AlertDialog(
          title: Text('Add Image URL'),
          content: TextField(
            controller: controller,
            decoration: InputDecoration(hintText: 'Enter image URL'),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                if (controller.text.isNotEmpty) {
                  setState(() {
                    _imageUrls.add(controller.text);
                    if (_mainImageUrl.isEmpty) {
                      _mainImageUrl = controller.text;
                    }
                  });
                  Navigator.of(context).pop();
                }
              },
              child: Text('Add'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Container(
        padding: EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    widget.productData != null ? 'Edit Product' : 'Add New Product',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.close),
                    onPressed: () {
                      if (widget.onCancel != null) {
                        widget.onCancel!();
                      }
                    },
                  ),
                ],
              ),
              
              SizedBox(height: 16),
              
              // Scrollable content
              Flexible(
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Title
                      TextFormField(
                        controller: _titleController,
                        decoration: InputDecoration(
                          labelText: 'Product Title',
                          border: OutlineInputBorder(),
                          prefixIcon: Icon(Icons.title),
                        ),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter a product title';
                          }
                          if (value.length < 5) {
                            return 'Title must be at least 5 characters';
                          }
                          return null;
                        },
                      ),
                      
                      SizedBox(height: 16),
                      
                      // Description
                      TextFormField(
                        controller: _descriptionController,
                        decoration: InputDecoration(
                          labelText: 'Description',
                          border: OutlineInputBorder(),
                          prefixIcon: Icon(Icons.description),
                        ),
                        maxLines: 4,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Please enter a description';
                          }
                          if (value.length < 10) {
                            return 'Description must be at least 10 characters';
                          }
                          return null;
                        },
                      ),
                      
                      SizedBox(height: 16),
                      
                      // Price and Stock
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _priceController,
                              decoration: InputDecoration(
                                labelText: 'Price (\$)',
                                border: OutlineInputBorder(),
                                prefixIcon: Icon(Icons.attach_money),
                              ),
                              keyboardType: TextInputType.numberWithOptions(decimal: true),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter a price';
                                }
                                final price = double.tryParse(value);
                                if (price == null || price <= 0) {
                                  return 'Please enter a valid price';
                                }
                                return null;
                              },
                            ),
                          ),
                          
                          SizedBox(width: 16),
                          
                          Expanded(
                            child: TextFormField(
                              controller: _stockController,
                              decoration: InputDecoration(
                                labelText: 'Stock Quantity',
                                border: OutlineInputBorder(),
                                prefixIcon: Icon(Icons.inventory),
                              ),
                              keyboardType: TextInputType.number,
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter stock quantity';
                                }
                                final stock = int.tryParse(value);
                                if (stock == null || stock < 0) {
                                  return 'Please enter a valid quantity';
                                }
                                return null;
                              },
                            ),
                          ),
                        ],
                      ),
                      
                      SizedBox(height: 16),
                      
                      // Category and Tags
                      Row(
                        children: [
                          Expanded(
                            child: TextFormField(
                              controller: _categoryController,
                              decoration: InputDecoration(
                                labelText: 'Category',
                                border: OutlineInputBorder(),
                                prefixIcon: Icon(Icons.category),
                              ),
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please enter a category';
                                }
                                return null;
                              },
                            ),
                          ),
                          
                          SizedBox(width: 16),
                          
                          Expanded(
                            child: TextFormField(
                              controller: _tagsController,
                              decoration: InputDecoration(
                                labelText: 'Tags (comma-separated)',
                                border: OutlineInputBorder(),
                                prefixIcon: Icon(Icons.tag),
                              ),
                            ),
                          ),
                        ],
                      ),
                      
                      SizedBox(height: 16),
                      
                      // Condition and Status
                      Row(
                        children: [
                          Expanded(
                            child: Container(
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.grey[300]!),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: DropdownButton<String>(
                                isExpanded: true,
                                value: _selectedCondition,
                                items: ['New', 'Used', 'Refurbished']
                                    .map((condition) => DropdownMenuItem(
                                          value: condition,
                                          child: Padding(
                                            padding: EdgeInsets.symmetric(horizontal: 12),
                                            child: Text(condition),
                                          ),
                                        ))
                                    .toList(),
                                onChanged: (value) {
                                  if (value != null) {
                                    setState(() {
                                      _selectedCondition = value;
                                    });
                                  }
                                },
                              ),
                            ),
                          ),
                          
                          SizedBox(width: 16),
                          
                          Expanded(
                            child: Container(
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.grey[300]!),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: DropdownButton<String>(
                                isExpanded: true,
                                value: _selectedStatus,
                                items: ['Draft', 'Published', 'Archived']
                                    .map((status) => DropdownMenuItem(
                                          value: status,
                                          child: Padding(
                                            padding: EdgeInsets.symmetric(horizontal: 12),
                                            child: Text(status),
                                          ),
                                        ))
                                    .toList(),
                                onChanged: (value) {
                                  if (value != null) {
                                    setState(() {
                                      _selectedStatus = value;
                                    });
                                  }
                                },
                              ),
                            ),
                          ),
                        ],
                      ),
                      
                      SizedBox(height: 16),
                      
                      // Images section
                      Text(
                        'Product Images',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      
                      SizedBox(height: 8),
                      
                      // Add image button
                      ElevatedButton.icon(
                        onPressed: _addImage,
                        icon: Icon(Icons.add_photo_alternate),
                        label: Text('Add Image'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.blue[50],
                          foregroundColor: Colors.blue[700],
                        ),
                      ),
                      
                      SizedBox(height: 8),
                      
                      // Images list
                      if (_imageUrls.isNotEmpty)
                        Container(
                          height: 100,
                          child: ListView.separated(
                            scrollDirection: Axis.horizontal,
                            itemCount: _imageUrls.length,
                            separatorBuilder: (context, index) => SizedBox(width: 8),
                            itemBuilder: (context, index) {
                              return Stack(
                                children: [
                                  Container(
                                    width: 100,
                                    height: 100,
                                    decoration: BoxDecoration(
                                      border: Border.all(color: Colors.grey[300]!),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(8),
                                      child: Image.network(
                                        _imageUrls[index],
                                        fit: BoxFit.cover,
                                        errorBuilder: (context, error, stackTrace) {
                                          return Icon(Icons.image_not_supported, color: Colors.grey[400]);
                                        },
                                      ),
                                    ),
                                  ),
                                  Positioned(
                                    top: -5,
                                    right: -5,
                                    child: Container(
                                      decoration: BoxDecoration(
                                        color: Colors.red,
                                        shape: BoxShape.circle,
                                      ),
                                      child: IconButton(
                                        icon: Icon(Icons.close, size: 16, color: Colors.white),
                                        onPressed: () {
                                          setState(() {
                                            _imageUrls.removeAt(index);
                                            if (_mainImageUrl == _imageUrls[index]) {
                                              _mainImageUrl = _imageUrls.isNotEmpty ? _imageUrls[0] : '';
                                            }
                                          });
                                        },
                                      ),
                                    ),
                                  ),
                                  if (_mainImageUrl == _imageUrls[index])
                                    Positioned(
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                      child: Container(
                                        color: Colors.blue.withOpacity(0.7),
                                        padding: EdgeInsets.symmetric(vertical: 2),
                                        child: Text(
                                          'MAIN',
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 10,
                                            fontWeight: FontWeight.bold,
                                          ),
                                          textAlign: TextAlign.center,
                                        ),
                                      ),
                                    ),
                                ],
                              );
                            },
                          ),
                        ),
                      
                      SizedBox(height: 20),
                      
                      // Action buttons
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () {
                                if (widget.onCancel != null) {
                                  widget.onCancel!();
                                }
                              },
                              style: OutlinedButton.styleFrom(
                                padding: EdgeInsets.symmetric(vertical: 12),
                              ),
                              child: Text('CANCEL'),
                            ),
                          ),
                          SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: _isSubmitting ? null : _saveProduct,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.green,
                                foregroundColor: Colors.white,
                                padding: EdgeInsets.symmetric(vertical: 12),
                              ),
                              child: _isSubmitting
                                  ? Row(
                                      mainAxisAlignment: MainAxisAlignment.center,
                                      children: [
                                        SizedBox(
                                          width: 16,
                                          height: 16,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                            valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                          ),
                                        ),
                                        SizedBox(width: 8),
                                        Text('SAVING...'),
                                      ],
                                    )
                                  : Text('SAVE PRODUCT'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class ProductEditorModalExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Product Editor Modal Example'),
      ),
      body: Center(
        child: ElevatedButton(
          onPressed: () {
            showDialog(
              context: context,
              builder: (context) => ProductEditorModal(
                onSave: (productData) {
                  print('Product saved: ${productData['title']}');
                  Navigator.of(context).pop();
                },
                onCancel: () {
                  Navigator.of(context).pop();
                },
              ),
            );
          },
          child: Text('Show Product Editor'),
        ),
      ),
    );
  }
}