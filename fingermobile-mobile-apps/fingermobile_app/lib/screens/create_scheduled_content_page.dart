import 'package:flutter/material.dart';

class CreateScheduledContentPage extends StatefulWidget {
  @override
  _CreateScheduledContentPageState createState() => _CreateScheduledContentPageState();
}

class _CreateScheduledContentPageState extends State<CreateScheduledContentPage> {
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _contentController = TextEditingController();
  DateTime? _scheduledDate;
  TimeOfDay? _scheduledTime;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Create Scheduled Content'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          TextButton(
            onPressed: () {
              // Save scheduled content
              _saveScheduledContent();
            },
            child: Text(
              'Schedule',
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Content Title',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              SizedBox(height: 8),
              TextField(
                controller: _titleController,
                decoration: InputDecoration(
                  hintText: 'Enter title for your content',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                  ),
                ),
              ),
              SizedBox(height: 16),
              Text(
                'Content',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              SizedBox(height: 8),
              Container(
                height: 200,
                child: TextField(
                  controller: _contentController,
                  maxLines: null,
                  expands: true,
                  textAlignVertical: TextAlignVertical.top,
                  decoration: InputDecoration(
                    hintText: 'Write your content here...',
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ),
              SizedBox(height: 16),
              Text(
                'Schedule Date & Time',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              SizedBox(height: 8),
              Card(
                elevation: 1,
                child: ListTile(
                  leading: Icon(Icons.calendar_today, color: Colors.blue),
                  title: Text(_scheduledDate != null
                      ? '${_scheduledDate!.day}/${_scheduledDate!.month}/${_scheduledDate!.year}'
                      : 'Select Date'),
                  subtitle: _scheduledTime != null
                      ? Text('${_scheduledTime!.hour}:${_scheduledTime!.minute.toString().padLeft(2, '0')}')
                      : Text('Select Time'),
                  trailing: Icon(Icons.arrow_forward_ios),
                  onTap: () {
                    _selectScheduleDateTime();
                  },
                ),
              ),
              SizedBox(height: 16),
              Text(
                'Content Type',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              SizedBox(height: 8),
              Wrap(
                spacing: 8.0,
                children: [
                  ChoiceChip(
                    label: Text('Post'),
                    selected: true,
                    onSelected: (selected) {},
                  ),
                  ChoiceChip(
                    label: Text('Image'),
                    selected: false,
                    onSelected: (selected) {},
                  ),
                  ChoiceChip(
                    label: Text('Video'),
                    selected: false,
                    onSelected: (selected) {},
                  ),
                  ChoiceChip(
                    label: Text('Link'),
                    selected: false,
                    onSelected: (selected) {},
                  ),
                ],
              ),
              SizedBox(height: 20),
              ElevatedButton.icon(
                onPressed: () {
                  // Add media
                },
                icon: Icon(Icons.add_photo_alternate),
                label: Text('Add Media'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.grey[200],
                  foregroundColor: Colors.black,
                  minimumSize: Size(double.infinity, 50),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _selectScheduleDateTime() async {
    DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: _scheduledDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime(2030),
    );

    if (pickedDate != null) {
      TimeOfDay? pickedTime = await showTimePicker(
        context: context,
        initialTime: _scheduledTime ?? TimeOfDay.now(),
      );

      if (pickedTime != null) {
        setState(() {
          _scheduledDate = pickedDate;
          _scheduledTime = pickedTime;
        });
      }
    }
  }

  void _saveScheduledContent() {
    // In a real implementation, this would save the scheduled content
    // For now, just show a success message
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Content scheduled successfully!'),
        backgroundColor: Colors.green,
      ),
    );
    
    // Navigate back
    Navigator.pop(context);
  }
}