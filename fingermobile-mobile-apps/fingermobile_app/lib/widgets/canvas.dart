import 'package:flutter/material.dart';

class Canvas extends StatefulWidget {
  final List<Widget> children;
  final Color backgroundColor;
  final Function(Offset)? onCanvasTap;
  final Function(Offset, Offset)? onCanvasDrag;
  final double width;
  final double height;

  const Canvas({
    Key? key,
    required this.children,
    this.backgroundColor = Colors.white,
    this.onCanvasTap,
    this.onCanvasDrag,
    this.width = double.infinity,
    this.height = double.infinity,
  }) : super(key: key);

  @override
  _CanvasState createState() => _CanvasState();
}

class _CanvasState extends State<Canvas> {
  final List<_CanvasElement> _elements = [];
  Offset _dragStart = Offset.zero;
  Offset _dragEnd = Offset.zero;
  bool _isDragging = false;

  @override
  void initState() {
    super.initState();
    // Initialize with the provided children
    for (int i = 0; i < widget.children.length; i++) {
      _elements.add(_CanvasElement(
        widget: widget.children[i],
        position: Offset(20.0 * i, 20.0 * i),
        id: i.toString(),
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: widget.width,
      height: widget.height,
      color: widget.backgroundColor,
      child: Listener(
        onPointerDown: (PointerDownEvent event) {
          RenderBox box = context.findRenderObject() as RenderBox;
          Offset localPosition = box.globalToLocal(event.position);
          
          // Check if we clicked on an existing element
          for (int i = _elements.length - 1; i >= 0; i--) {
            _CanvasElement element = _elements[i];
            Rect elementRect = Rect.fromLTWH(
              element.position.dx,
              element.position.dy,
              100, // Approximate width
              60, // Approximate height
            );
            
            if (elementRect.contains(localPosition)) {
              // Bring element to front
              setState(() {
                _elements.removeAt(i);
                _elements.add(element);
              });
              _dragStart = localPosition;
              _isDragging = true;
              return;
            }
          }
          
          // If not clicking on an element, handle canvas tap
          if (widget.onCanvasTap != null) {
            widget.onCanvasTap!(localPosition);
          }
        },
        onPointerMove: (PointerMoveEvent event) {
          if (_isDragging) {
            RenderBox box = context.findRenderObject() as RenderBox;
            Offset localPosition = box.globalToLocal(event.position);
            
            setState(() {
              // Move the last element (the one we brought to front)
              if (_elements.isNotEmpty) {
                _CanvasElement lastElement = _elements.last;
                _elements.removeLast();
                _elements.add(_CanvasElement(
                  widget: lastElement.widget,
                  position: Offset(
                    localPosition.dx - (localPosition.dx - _dragStart.dx),
                    localPosition.dy - (localPosition.dy - _dragStart.dy),
                  ),
                  id: lastElement.id,
                ));
              }
            });
            
            _dragStart = localPosition;
          }
        },
        onPointerUp: (PointerUpEvent event) {
          _isDragging = false;
        },
        child: Stack(
          children: [
            // Draw all elements
            for (int i = 0; i < _elements.length; i++)
              Positioned(
                left: _elements[i].position.dx,
                top: _elements[i].position.dy,
                child: DraggableWidget(
                  widget: _elements[i].widget,
                  id: _elements[i].id,
                  onDeleted: () {
                    setState(() {
                      _elements.removeAt(i);
                    });
                  },
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class DraggableWidget extends StatefulWidget {
  final Widget widget;
  final String id;
  final Function()? onDeleted;

  const DraggableWidget({
    Key? key,
    required this.widget,
    required this.id,
    this.onDeleted,
  }) : super(key: key);

  @override
  _DraggableWidgetState createState() => _DraggableWidgetState();
}

class _DraggableWidgetState extends State<DraggableWidget> {
  bool _isSelected = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _isSelected = !_isSelected;
        });
      },
      onLongPress: () {
        _showContextMenu();
      },
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(
            color: _isSelected ? Colors.blue : Colors.transparent,
            width: 2,
          ),
          borderRadius: BorderRadius.circular(4),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              decoration: BoxDecoration(
                color: Colors.grey[200],
                borderRadius: BorderRadius.vertical(top: Radius.circular(4)),
              ),
              padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Widget ${widget.id}',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (_isSelected)
                    IconButton(
                      icon: Icon(Icons.close, size: 16, color: Colors.red),
                      onPressed: () {
                        if (widget.onDeleted != null) {
                          widget.onDeleted!();
                        }
                      },
                    ),
                ],
              ),
            ),
            widget.widget,
          ],
        ),
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
          value: 'bringToFront',
          child: Row(
            children: [
              Icon(Icons.arrow_upward, size: 18),
              SizedBox(width: 8),
              Text('Bring to Front'),
            ],
          ),
        ),
        PopupMenuItem(
          value: 'sendToBack',
          child: Row(
            children: [
              Icon(Icons.arrow_downward, size: 18),
              SizedBox(width: 8),
              Text('Send to Back'),
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
      case 'bringToFront':
        _bringToFront();
        break;
      case 'sendToBack':
        _sendToBack();
        break;
      case 'duplicate':
        _duplicate();
        break;
      case 'delete':
        if (widget.onDeleted != null) {
          widget.onDeleted!();
        }
        break;
    }
  }

  void _bringToFront() {
    // Notify parent to bring this element to front
    // Implementation depends on how parent handles z-index
  }

  void _sendToBack() {
    // Notify parent to send this element to back
    // Implementation depends on how parent handles z-index
  }

  void _duplicate() {
    // Notify parent to duplicate this element
    // Implementation depends on parent's management
  }
}

class _CanvasElement {
  final Widget widget;
  final Offset position;
  final String id;

  _CanvasElement({
    required this.widget,
    required this.position,
    required this.id,
  });
}

// Example usage of the Canvas
class CanvasExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Canvas Example')),
      body: Canvas(
        children: [
          Container(
            width: 100,
            height: 60,
            color: Colors.blue,
            child: Center(
              child: Text(
                'Blue',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
          Container(
            width: 100,
            height: 60,
            color: Colors.green,
            child: Center(
              child: Text(
                'Green',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
          Container(
            width: 100,
            height: 60,
            color: Colors.red,
            child: Center(
              child: Text(
                'Red',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ),
        ],
        backgroundColor: Colors.grey[100]!,
        onCanvasTap: (position) {
          print('Canvas tapped at: $position');
        },
      ),
    );
  }
}

