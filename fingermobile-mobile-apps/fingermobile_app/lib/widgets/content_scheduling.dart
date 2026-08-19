import 'package:flutter/material.dart';
import 'package:fingermobile_app/widgets\dashboard_layout.dart';

class ContentScheduling extends StatefulWidget {
  @override
  _ContentSchedulingState createState() => _ContentSchedulingState();
}

class _ContentSchedulingState extends State<ContentScheduling> {
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  DateTime? _scheduledDate;
  TimeOfDay? _scheduledTime;
  String _contentType = 'post';
  String _visibility = 'public';

  @override
  Widget build(BuildContext context) {
    return DashboardLayout(
      title: 'Content Scheduling',
      child: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Schedule New Content',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 20),
                      
                      TextField(
                        controller: _titleController,
                        decoration: InputDecoration(
                          labelText: 'Title',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      SizedBox(height: 16),
                      
                      TextField(
                        controller: _descriptionController,
                        maxLines: 5,
                        decoration: InputDecoration(
                          labelText: 'Description',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      SizedBox(height: 16),
                      
                      // Content Type Selection
                      Text(
                        'Content Type',
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      SizedBox(height: 8),
                      DropdownButtonFormField<String>(
                        initialValue: _contentType,
                        decoration: InputDecoration(
                          border: OutlineInputBorder(),
                        ),
                        items: <String>['post', 'article', 'video', 'image', 'audio']
                            .map<DropdownMenuItem<String>>((String value) {
                          return DropdownMenuItem<String>(
                            value: value,
                            child: Text(value),
                          );
                        }).toList(),
                        onChanged: (String? newValue) {
                          setState(() {
                            _contentType = newValue!;
                          });
                        },
                      ),
                      SizedBox(height: 16),
                      
                      // Visibility Selection
                      Text(
                        'Visibility',
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      SizedBox(height: 8),
                      DropdownButtonFormField<String>(
                        initialValue: _visibility,
                        decoration: InputDecoration(
                          border: OutlineInputBorder(),
                        ),
                        items: <String>['public', 'followers', 'private']
                            .map<DropdownMenuItem<String>>((String value) {
                          return DropdownMenuItem<String>(
                            value: value,
                            child: Text(value),
                          );
                        }).toList(),
                        onChanged: (String? newValue) {
                          setState(() {
                            _visibility = newValue!;
                          });
                        },
                      ),
                      SizedBox(height: 16),
                      
                      // Schedule Date and Time
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton.icon(
                              icon: Icon(Icons.calendar_today),
                              label: Text(_scheduledDate != null
                                  ? 'Date: ${_scheduledDate!.day}/${_scheduledDate!.month}/${_scheduledDate!.year}'
                                  : 'Select Date'),
                              onPressed: () async {
                                DateTime? pickedDate = await showDatePicker(
                                  context: context,
                                  initialDate: DateTime.now(),
                                  firstDate: DateTime.now(),
                                  lastDate: DateTime(2100),
                                );
                                
                                if (pickedDate != null) {
                                  setState(() {
                                    _scheduledDate = pickedDate;
                                  });
                                }
                              },
                            ),
                          ),
                          SizedBox(width: 16),
                          Expanded(
                            child: ElevatedButton.icon(
                              icon: Icon(Icons.access_time),
                              label: Text(_scheduledTime != null
                                  ? 'Time: ${_scheduledTime!.hour}:${_scheduledTime!.minute.toString().padLeft(2, '0')}'
                                  : 'Select Time'),
                              onPressed: () async {
                                TimeOfDay? pickedTime = await showTimePicker(
                                  context: context,
                                  initialTime: TimeOfDay.now(),
                                );
                                
                                if (pickedTime != null) {
                                  setState(() {
                                    _scheduledTime = pickedTime;
                                  });
                                }
                              },
                            ),
                          ),
                        ],
                      ),
                      SizedBox(height: 24),
                      
                      // Media Upload Section
                      Text(
                        'Media Upload',
                        style: TextStyle(
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      SizedBox(height: 8),
                      Container(
                        height: 150,
                        decoration: BoxDecoration(
                          border: Border.all(color: Colors.grey),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.cloud_upload,
                              size: 48,
                              color: Colors.grey[400],
                            ),
                            Text(
                              'Tap to upload media',
                              style: TextStyle(
                                color: Colors.grey[600],
                              ),
                            ),
                          ],
                        ),
                      ),
                      SizedBox(height: 24),
                      
                      // Action Buttons
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () {
                                _clearForm();
                              },
                              child: Text('Clear'),
                            ),
                          ),
                          SizedBox(width: 16),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: _validateAndSubmit,
                              child: Text('Schedule Content'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              
              SizedBox(height: 24),
              
              // Scheduled Content List
              Text(
                'Scheduled Content',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 16),
              
              _buildScheduledContentList(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildScheduledContentList() {
    // For now, just show some sample scheduled content
    final scheduledItems = [
      {'title': 'Weekly Wrap-Up', 'date': '2026-03-05', 'time': '14:30', 'type': 'post'},
      {'title': 'New Product Launch', 'date': '2026-03-08', 'time': '09:00', 'type': 'article'},
      {'title': 'Behind the Scenes', 'date': '2026-03-10', 'time': '18:00', 'type': 'video'},
    ];

    return ListView.builder(
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
      itemCount: scheduledItems.length,
      itemBuilder: (context, index) {
        final item = scheduledItems[index];
        return Card(
          child: ListTile(
            contentPadding: EdgeInsets.all(16.0),
            title: Text(item['title']!),
            subtitle: Text('${item['date']} at ${item['time']} • ${item['type']}'),
            trailing: PopupMenuButton(
              icon: Icon(Icons.more_vert),
              itemBuilder: (context) => [
                PopupMenuItem(
                  child: Text('Edit'),
                  value: 'edit',
                ),
                PopupMenuItem(
                  child: Text('Cancel'),
                  value: 'cancel',
                ),
              ],
              onSelected: (value) {
                if (value == 'edit') {
                  // Handle edit
                } else if (value == 'cancel') {
                  // Handle cancel
                }
              },
            ),
          ),
        );
      },
    );
  }

  void _clearForm() {
    _titleController.clear();
    _descriptionController.clear();
    setState(() {
      _scheduledDate = null;
      _scheduledTime = null;
      _contentType = 'post';
      _visibility = 'public';
    });
  }

  void _validateAndSubmit() {
    if (_titleController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please enter a title')),
      );
      return;
    }

    if (_scheduledDate == null || _scheduledTime == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please select date and time')),
      );
      return;
    }

    // In a real implementation, this would send the data to the backend
    final scheduledDateTime = DateTime(
      _scheduledDate!.year,
      _scheduledDate!.month,
      _scheduledDate!.day,
      _scheduledTime!.hour,
      _scheduledTime!.minute,
    );

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Content scheduled for ${scheduledDateTime.toLocal()}'),
      ),
    );
  }
}