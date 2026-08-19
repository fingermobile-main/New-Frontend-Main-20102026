import 'package:flutter/material.dart';
import '../services/api_service.dart';

class FeedbackScreen extends StatefulWidget {
  @override
  _FeedbackScreenState createState() => _FeedbackScreenState();
}

class _FeedbackScreenState extends State<FeedbackScreen> {
  final TextEditingController _feedbackController = TextEditingController();
  String _feedbackType = 'suggestion';
  int _rating = 0;
  bool _isSending = false;

  @override
  void dispose() {
    _feedbackController.dispose();
    super.dispose();
  }

  Future<void> _sendFeedback() async {
    if (_feedbackController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please enter your feedback')),
      );
      return;
    }

    if (_rating == 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please provide a rating')),
      );
      return;
    }

    setState(() {
      _isSending = true;
    });

    try {
      final result = await ApiService.post('/feedback', {
        'type': _feedbackType,
        'message': _feedbackController.text.trim(),
        'rating': _rating,
      });

      if (result != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Thank you for your feedback!'),
            backgroundColor: Colors.green,
          ),
        );
        _feedbackController.clear();
        setState(() {
          _rating = 0;
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Failed to send feedback'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      print('Error sending feedback: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error sending feedback: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _isSending = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Send Feedback'),
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: ListView(
          children: [
            Text(
              'Your feedback helps us improve FingerMobile',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
              ),
            ),
            SizedBox(height: 24),
            
            // Feedback type selection
            Text(
              'Type of Feedback',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            SegmentedButton<String>(
              segments: [
                ButtonSegment(
                  value: 'suggestion',
                  label: Text('Suggestion'),
                  icon: Icon(Icons.lightbulb),
                ),
                ButtonSegment(
                  value: 'bug',
                  label: Text('Bug Report'),
                  icon: Icon(Icons.bug_report),
                ),
                ButtonSegment(
                  value: 'compliment',
                  label: Text('Compliment'),
                  icon: Icon(Icons.sentiment_satisfied),
                ),
              ],
              selected: {_feedbackType},
              onSelectionChanged: (Set<String> newSelection) {
                setState(() {
                  _feedbackType = newSelection.first;
                });
              },
            ),
            SizedBox(height: 24),
            
            // Rating section
            Text(
              'Rate your experience',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                for (int i = 1; i <= 5; i++)
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        _rating = i;
                      });
                    },
                    child: Padding(
                      padding: EdgeInsets.symmetric(horizontal: 4),
                      child: Icon(
                        i <= _rating ? Icons.star : Icons.star_border,
                        color: Colors.amber,
                        size: 40,
                      ),
                    ),
                  ),
              ],
            ),
            SizedBox(height: 8),
            Text(
              _rating == 0 
                  ? 'Tap stars to rate' 
                  : 'Rating: $_rating out of 5',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 24),
            
            // Feedback text
            Text(
              'Your Feedback',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            TextField(
              controller: _feedbackController,
              maxLines: 6,
              decoration: InputDecoration(
                hintText: 'Tell us how we can improve...',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                contentPadding: EdgeInsets.all(16),
              ),
            ),
            SizedBox(height: 24),
            
            // Submit button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: _isSending ? null : _sendFeedback,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                ),
                child: _isSending
                    ? CircularProgressIndicator(color: Colors.white)
                    : Text(
                        'Send Feedback',
                        style: TextStyle(fontSize: 16),
                      ),
              ),
            ),
            
            SizedBox(height: 24),
            
            // Contact section
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Need Immediate Help?',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'For urgent issues, please contact our support team directly:',
                    ),
                    SizedBox(height: 8),
                    ListTile(
                      leading: Icon(Icons.email),
                      title: Text('support@fingermobile.com'),
                      onTap: () {
                        // Launch email
                      },
                    ),
                    ListTile(
                      leading: Icon(Icons.chat),
                      title: Text('Live Chat Support'),
                      onTap: () {
                        // Launch chat
                      },
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
}