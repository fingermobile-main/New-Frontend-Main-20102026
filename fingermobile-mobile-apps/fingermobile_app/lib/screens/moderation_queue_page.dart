import 'package:flutter/material.dart';

class ModerationQueuePage extends StatefulWidget {
  @override
  _ModerationQueuePageState createState() => _ModerationQueuePageState();
}

class _ModerationQueuePageState extends State<ModerationQueuePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Moderation Queue'),
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: () {
              // Refresh the queue
            },
          ),
        ],
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Moderation Queue',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Items requiring moderation',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 20),
            Container(
              height: 50,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _buildFilterChip('All', true),
                  SizedBox(width: 8),
                  _buildFilterChip('Pending', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Urgent', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Images', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Text', false),
                  SizedBox(width: 8),
                  _buildFilterChip('Videos', false),
                ],
              ),
            ),
            SizedBox(height: 16),
            Container(
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      decoration: InputDecoration(
                        hintText: 'Search moderation queue...',
                        border: InputBorder.none,
                        prefixIcon: Icon(Icons.search),
                      ),
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.sort),
                    onPressed: () {},
                  ),
                ],
              ),
            ),
            SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: 6,
                itemBuilder: (context, index) {
                  bool isUrgent = index < 2;
                  return Card(
                    elevation: 2,
                    color: isUrgent ? Colors.red[50] : null,
                    margin: EdgeInsets.only(bottom: 12),
                    child: ListTile(
                      leading: Container(
                        width: 50,
                        height: 50,
                        decoration: BoxDecoration(
                          color: Colors.grey[200],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          index % 3 == 0 ? Icons.image : 
                          index % 3 == 1 ? Icons.text_fields : Icons.video_library,
                          color: Colors.grey[600],
                        ),
                      ),
                      title: Row(
                        children: [
                          Text('Content $index'),
                          if (isUrgent)
                            Container(
                              margin: EdgeInsets.only(left: 8),
                              padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.red,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                'URGENT',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                ),
                              ),
                            ),
                        ],
                      ),
                      subtitle: Text('Reported • ${index + 1} reports'),
                      trailing: Icon(Icons.arrow_forward_ios, size: 16),
                      onTap: () {
                        // Navigate to moderation details
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected) {
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (bool selected) {},
      selectedColor: Colors.deepPurple,
      checkmarkColor: Colors.white,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : Colors.black,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
          color: isSelected ? Colors.deepPurple : Colors.grey,
        ),
      ),
    );
  }
}