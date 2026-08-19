import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class SentientAIDashboard extends StatefulWidget {
  @override
  _SentientAIDashboardState createState() => _SentientAIDashboardState();
}

class _SentientAIDashboardState extends State<SentientAIDashboard> {
  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Sentient AI',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header section
              Container(
                padding: EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Colors.deepPurple[600]!, Colors.purple[800]!],
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Sentient AI Dashboard',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Advanced AI systems and cognitive analytics',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 16,
                      ),
                    ),
                  ],
                ),
              ),
              
              SizedBox(height: 24),
              
              // Stats grid
              GridView.count(
                crossAxisCount: 4,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                children: [
                  _buildStatCard('AI Models', '12', Icons.auto_awesome, Colors.blue),
                  _buildStatCard('Cognitive Load', '78%', Icons.psychology, Colors.green),
                  _buildStatCard('Processing Power', '84 TFLOPS', Icons.memory, Colors.orange),
                  _buildStatCard('Neural Nets', '24', Icons.network_node, Colors.purple),
                ],
              ),
              
              SizedBox(height: 24),
              
              // Charts section
              Row(
                children: [
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Cognitive Performance',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            Container(
                              height: 200,
                              child: _buildPerformanceChart(),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  SizedBox(width: 16),
                  Expanded(
                    child: Card(
                      child: Padding(
                        padding: EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'AI Workload Distribution',
                              style: TextStyle(
                                fontWeight: FontWeight.w500,
                                fontSize: 16,
                              ),
                            ),
                            SizedBox(height: 12),
                            _buildWorkloadDistribution(),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              
              SizedBox(height: 24),
              
              // AI models
              Text(
                'AI Models',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildModelsList(),
              
              SizedBox(height: 24),
              
              // Cognitive insights
              Text(
                'Cognitive Insights',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildInsightsList(),
              
              SizedBox(height: 24),
              
              // Neural networks
              Text(
                'Neural Networks',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 12),
              _buildNetworksList(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: color),
                SizedBox(width: 8),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPerformanceChart() {
    return Container(
      child: CustomPaint(
        painter: PerformanceChartPainter(),
        size: Size.infinite,
      ),
    );
  }

  Widget _buildWorkloadDistribution() {
    final workload = [
      {'task': 'Natural Language', 'usage': 35, 'color': Colors.blue},
      {'task': 'Image Recognition', 'usage': 25, 'color': Colors.green},
      {'task': 'Predictive Analysis', 'usage': 20, 'color': Colors.orange},
      {'task': 'Behavioral Analysis', 'usage': 20, 'color': Colors.purple},
    ];

    return Column(
      children: workload.map((task) {
        return Padding(
          padding: EdgeInsets.symmetric(vertical: 6),
          child: Row(
            children: [
              Expanded(
                flex: 2,
                child: Text(task['task']!),
              ),
              Expanded(
                child: LinearProgressIndicator(
                  value: task['usage']! / 100,
                  backgroundColor: Colors.grey[300],
                  valueColor: AlwaysStoppedAnimation<Color>(task['color']),
                ),
              ),
              SizedBox(width: 8),
              Text('${task['usage']}%'),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildModelsList() {
    final models = [
      {'name': 'NLP Processor', 'accuracy': '94.2%', 'status': 'Active', 'lastUpdate': '2 hours ago'},
      {'name': 'Vision Analyzer', 'accuracy': '96.7%', 'status': 'Active', 'lastUpdate': '5 hours ago'},
      {'name': 'Behavior Predictor', 'accuracy': '89.3%', 'status': 'Training', 'lastUpdate': '1 day ago'},
      {'name': 'Emotion Recognizer', 'accuracy': '91.8%', 'status': 'Active', 'lastUpdate': '3 hours ago'},
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Model')),
          DataColumn(label: Text('Accuracy')),
          DataColumn(label: Text('Status')),
          DataColumn(label: Text('Last Update')),
          DataColumn(label: Text('Actions')),
        ],
        rows: models.map((model) {
          return DataRow(
            cells: [
              DataCell(Text(model['name']!)),
              DataCell(Text(model['accuracy']!)),
              DataCell(
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: model['status'] == 'Active' 
                        ? Colors.green[100] 
                        : model['status'] == 'Training' 
                            ? Colors.orange[100] 
                            : Colors.red[100],
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    model['status']!,
                    style: TextStyle(
                      color: model['status'] == 'Active' 
                          ? Colors.green[800] 
                          : model['status'] == 'Training' 
                              ? Colors.orange[800] 
                              : Colors.red[800],
                    ),
                  ),
                ),
              ),
              DataCell(Text(model['lastUpdate']!)),
              DataCell(
                PopupMenuButton(
                  icon: Icon(Icons.more_vert),
                  itemBuilder: (context) => [
                    PopupMenuItem(child: Text('View Details'), value: 'view'),
                    PopupMenuItem(child: Text('Retrain'), value: 'retrain'),
                    PopupMenuItem(child: Text('Export'), value: 'export'),
                  ],
                  onSelected: (value) {
                    // Handle menu selection
                  },
                ),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildInsightsList() {
    final insights = [
      {'title': 'User Behavior Pattern', 'description': 'Detected cyclical engagement peaks', 'confidence': '92%'},
      {'title': 'Content Preference', 'description': 'Users prefer video content on weekends', 'confidence': '87%'},
      {'title': 'Retention Prediction', 'description': 'Identified at-risk users with 95% accuracy', 'confidence': '95%'},
      {'title': 'Optimal Timing', 'description': 'Best posting time shifted to 7 PM', 'confidence': '89%'},
    ];

    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: insights.map((insight) {
            return Padding(
              padding: EdgeInsets.symmetric(vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    insight['title']!,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  SizedBox(height: 4),
                  Text(
                    insight['description']!,
                    style: TextStyle(
                      color: Colors.grey[600],
                    ),
                  ),
                  SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(
                        'Confidence: ${insight['confidence']}',
                        style: TextStyle(
                          fontStyle: FontStyle.italic,
                          fontSize: 12,
                          color: Colors.grey[500],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildNetworksList() {
    final networks = [
      {'name': 'Deep Vision Net', 'layers': 124, 'accuracy': '96.7%', 'status': 'Converged'},
      {'name': 'Language Model', 'layers': 89, 'accuracy': '94.2%', 'status': 'Training'},
      {'name': 'Behavior Net', 'layers': 156, 'accuracy': '89.3%', 'status': 'Initializing'},
      {'name': 'Emotion Classifier', 'layers': 67, 'accuracy': '91.8%', 'status': 'Converged'},
    ];

    return Card(
      child: DataTable(
        columns: [
          DataColumn(label: Text('Network')),
          DataColumn(label: Text('Layers')),
          DataColumn(label: Text('Accuracy')),
          DataColumn(label: Text('Status')),
          DataColumn(label: Text('Visualization')),
        ],
        rows: networks.map((network) {
          return DataRow(
            cells: [
              DataCell(Text(network['name']!)),
              DataCell(Text(network['layers'].toString())),
              DataCell(Text(network['accuracy']!)),
              DataCell(
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: network['status'] == 'Converged' 
                        ? Colors.green[100] 
                        : network['status'] == 'Training' 
                            ? Colors.orange[100] 
                            : Colors.blue[100],
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: Text(
                    network['status']!,
                    style: TextStyle(
                      color: network['status'] == 'Converged' 
                          ? Colors.green[800] 
                          : network['status'] == 'Training' 
                              ? Colors.orange[800] 
                              : Colors.blue[800],
                    ),
                  ),
                ),
              ),
              DataCell(
                IconButton(
                  icon: Icon(Icons.visibility, color: Colors.blue),
                  onPressed: () {},
                ),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }
}

class PerformanceChartPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.deepPurple
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;

    final points = <Offset>[];

    // Create sample performance data points
    for (int i = 0; i < 7; i++) {
      final x = (size.width / 6) * i;
      final y = size.height - (i % 3 == 0 ? size.height * 0.7 : i % 3 == 1 ? size.height * 0.5 : size.height * 0.3);
      points.add(Offset(x, y));
    }

    if (points.length > 1) {
      canvas.drawPoints(PointMode.polygon, points, paint);
    }

    // Draw data points
    final circlePaint = Paint()
      ..color = Colors.deepPurple
      ..style = PaintingStyle.fill;

    for (final point in points) {
      canvas.drawCircle(point, 4, circlePaint);
    }
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}