import 'package:flutter/material.dart';

class EditScheduledContentPage extends StatefulWidget {
  final Map<String, dynamic>? scheduledContent;

  const EditScheduledContentPage({this.scheduledContent});

  @override
  _EditScheduledContentPageState createState() => _EditScheduledContentPageState();
}

class _EditScheduledContentPageState extends State<EditScheduledContentPage> {
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _contentController = TextEditingController();
  DateTime? _scheduledDate;
  TimeOfDay? _scheduledTime;

  @override
  void initState() {
    super.initState();
    // Initialize with existing content if available
    if (widget.scheduledContent != null) {
      _titleController.text = widget.scheduledContent!['title'] ?? '';
      _contentController.text = widget.scheduledContent!['content'] ?? '';
      _scheduledDate = widget.scheduledContent!['date'];
      _scheduledTime = widget.scheduledContent!['time'];
    } else {
      // Default to current time
      _scheduledDate = DateTime.now();
      _scheduledTime = TimeOfDay.now();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Edit Scheduled Content'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        actions: [
          TextButton(
            onPressed: () {
              // Update scheduled content
              _updateScheduledContent();
            },
            child: Text(
              'Update',
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
              SizedBox(height: 20),
              Container(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    _deleteScheduledContent();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    foregroundColor: Colors.white,
                    minimumSize: Size(double.infinity, 50),
                  ),
                  child: Text('Delete Scheduled Content'),
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

  void _updateScheduledContent() {
    // In a real implementation, this would update the scheduled content
    // For now, just show a success message
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Content updated successfully!'),
        backgroundColor: Colors.green,
      ),
    );
    
    // Navigate back
    Navigator.pop(context);
  }

  void _deleteScheduledContent() {
    // Show confirmation dialog
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Confirm Deletion'),
          content: Text('Are you sure you want to delete this scheduled content?'),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                // In a real implementation, this would delete the scheduled content
                // For now, just show a success message
                Navigator.pop(context);
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Content deleted successfully!'),
                    backgroundColor: Colors.red,
                  ),
                );
              },
              child: Text('Delete'),
            ),
          ],
        );
      },
    );
  }
}