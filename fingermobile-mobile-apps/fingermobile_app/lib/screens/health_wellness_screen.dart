import 'package:flutter/material.dart';

class HealthWellnessScreen extends StatefulWidget {
  @override
  _HealthWellnessScreenState createState() => _HealthWellnessScreenState();
}

class _HealthWellnessScreenState extends State<HealthWellnessScreen> {
  // Health metrics
  int _stepsToday = 8432;
  double _distanceToday = 6.2;
  int _caloriesBurned = 420;
  double _heartRate = 72.0;
  double _sleepHours = 7.5;
  int _waterIntake = 6;
  bool _isTracking = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Health & Wellness'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.settings),
            onPressed: () {
              // Navigate to health settings
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Health stats card
            Card(
              margin: EdgeInsets.all(16),
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _buildHealthStat('Steps', '$_stepsToday', Icons.directions_walk, Colors.green),
                        _buildHealthStat('Calories', '$_caloriesBurned', Icons.local_fire_department, Colors.orange),
                      ],
                    ),
                    SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _buildHealthStat('Distance', '${_distanceToday}km', Icons.location_on, Colors.blue),
                        _buildHealthStat('Sleep', '${_sleepHours}h', Icons.bed, Colors.purple),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            
            // Heart rate section
            Card(
              margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.favorite, color: Colors.red),
                        SizedBox(width: 8),
                        Text(
                          'Heart Rate',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          '${_heartRate.toInt()}',
                          style: TextStyle(
                            fontSize: 48,
                            fontWeight: FontWeight.bold,
                            color: Colors.red,
                          ),
                        ),
                        Text(
                          ' BPM',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Resting heart rate',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            
            // Water intake section
            Card(
              margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.local_drink, color: Colors.blue),
                        SizedBox(width: 8),
                        Text(
                          'Water Intake',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 16),
                    Text(
                      'Goal: 8 glasses per day',
                      style: TextStyle(
                        color: Colors.grey[600],
                      ),
                    ),
                    SizedBox(height: 16),
                    LinearProgressIndicator(
                      value: _waterIntake / 8,
                      backgroundColor: Colors.grey[300],
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                    ),
                    SizedBox(height: 8),
                    Text(
                      '$_waterIntake of 8 glasses',
                      style: TextStyle(
                        color: Colors.grey[600],
                      ),
                    ),
                    SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        OutlinedButton.icon(
                          onPressed: () {
                            setState(() {
                              _waterIntake = (_waterIntake + 1).clamp(0, 8);
                            });
                          },
                          icon: Icon(Icons.add),
                          label: Text('Add Glass'),
                        ),
                        ElevatedButton(
                          onPressed: () {
                            setState(() {
                              _waterIntake = 0;
                            });
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.grey[300],
                            foregroundColor: Colors.black,
                          ),
                          child: Text('Reset'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            
            // Health goals section
            Card(
              margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.flag, color: Colors.green),
                        SizedBox(width: 8),
                        Text(
                          'Health Goals',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 16),
                    _buildGoalItem('Walk 10,000 steps', '8,432 of 10,000', 0.84),
                    _buildGoalItem('Burn 500 calories', '420 of 500', 0.84),
                    _buildGoalItem('Drink 8 glasses of water', '$_waterIntake of 8', _waterIntake / 8),
                    _buildGoalItem('Sleep 8 hours', '${_sleepHours.toInt()} of 8', _sleepHours / 8),
                  ],
                ),
              ),
            ),
            
            // Health insights section
            Card(
              margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.insights, color: Colors.purple),
                        SizedBox(width: 8),
                        Text(
                          'Health Insights',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                    SizedBox(height: 16),
                    Text(
                      'Based on your activity, you\'re doing great! Your step count is 23% higher than the average member.',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[700],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHealthStat(String title, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: EdgeInsets.all(12),
        child: Column(
          children: [
            Icon(icon, color: color, size: 30),
            SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              title,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGoalItem(String title, String progress, double percentage) {
    return Padding(
      padding: EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontWeight: FontWeight.w500,
            ),
          ),
          SizedBox(height: 4),
          Row(
            children: [
              Expanded(
                child: LinearProgressIndicator(
                  value: percentage,
                  backgroundColor: Colors.grey[300],
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.green),
                ),
              ),
              SizedBox(width: 8),
              Text(
                progress,
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}