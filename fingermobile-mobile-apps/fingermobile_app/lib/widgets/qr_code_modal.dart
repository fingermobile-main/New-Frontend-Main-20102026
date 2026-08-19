import 'package:flutter/material.dart';

class QrCodeModal extends StatelessWidget {
  final String data;
  final String title;
  final String description;

  const QrCodeModal({
    Key? key,
    required this.data,
    required this.title,
    required this.description,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        width: 300,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Header
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    title,
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
            
            SizedBox(height: 24),
            
            // QR Code
            Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.2),
                    spreadRadius: 1,
                    blurRadius: 5,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                children: [
                  // Simulated QR code (in a real app, we would use a QR code generator package)
                  Container(
                    width: 200,
                    height: 200,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: Colors.grey[300]!),
                    ),
                    child: _buildQrPattern(),
                  ),
                  
                  SizedBox(height: 16),
                  
                  Text(
                    'Scan this QR code',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            
            SizedBox(height: 20),
            
            // Description
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                description,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[600],
                ),
              ),
            ),
            
            SizedBox(height: 20),
            
            // Copy button
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: OutlinedButton(
                onPressed: () {
                  // In a real app, this would copy the data to clipboard
                  print('Copying data: $data');
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Data copied to clipboard'),
                    ),
                  );
                },
                style: OutlinedButton.styleFrom(
                  side: BorderSide(color: Colors.blue),
                  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
                child: Text(
                  'Copy Code',
                  style: TextStyle(
                    color: Colors.blue,
                  ),
                ),
              ),
            ),
            
            SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildQrPattern() {
    // This is a simulation of a QR code pattern
    // In a real implementation, we would use a QR code generation package
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Colors.black, width: 2),
      ),
      child: CustomPaint(
        painter: QrCodePainter(),
        size: Size.square(180),
      ),
    );
  }
}

class QrCodePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black
      ..style = PaintingStyle.fill;

    // Draw the outer squares in corners
    _drawOuterSquare(canvas, paint, 0, 0, size.width * 0.2);
    _drawOuterSquare(canvas, paint, size.width * 0.8, 0, size.width * 0.2);
    _drawOuterSquare(canvas, paint, 0, size.height * 0.8, size.width * 0.2);

    // Draw inner squares
    _drawInnerSquare(canvas, paint, size.width * 0.05, size.height * 0.05, size.width * 0.1);
    _drawInnerSquare(canvas, paint, size.width * 0.85, size.height * 0.05, size.width * 0.1);
    _drawInnerSquare(canvas, paint, size.width * 0.05, size.height * 0.85, size.width * 0.1);

    // Draw random pattern inside
    final cellSize = size.width / 21;
    for (int i = 0; i < 21; i++) {
      for (int j = 0; j < 21; j++) {
        // Skip the areas where the position markers are
        if ((_isInCorner(i, j, 7) || _isInCorner(i, 20 - j, 7) || _isInCorner(20 - i, j, 7))) {
          continue;
        }

        // Draw some random blocks
        if ((i + j) % 3 == 0) {
          canvas.drawRect(
            Rect.fromLTWH(
              j * cellSize,
              i * cellSize,
              cellSize,
              cellSize,
            ),
            paint,
          );
        }
      }
    }
  }

  bool _isInCorner(int x, int y, int size) {
    return x < size && y < size;
  }

  void _drawOuterSquare(Canvas canvas, Paint paint, double x, double y, double size) {
    // Outer black square
    canvas.drawRect(
      Rect.fromLTWH(x, y, size, size),
      paint,
    );

    // Inner white square
    canvas.drawRect(
      Rect.fromLTWH(x + size * 0.15, y + size * 0.15, size * 0.7, size * 0.7),
      Paint()..color = Colors.white,
    );

    // Inner black square
    canvas.drawRect(
      Rect.fromLTWH(x + size * 0.3, y + size * 0.3, size * 0.4, size * 0.4),
      paint,
    );
  }

  void _drawInnerSquare(Canvas canvas, Paint paint, double x, double y, double size) {
    canvas.drawRect(
      Rect.fromLTWH(x, y, size, size),
      paint,
    );
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}