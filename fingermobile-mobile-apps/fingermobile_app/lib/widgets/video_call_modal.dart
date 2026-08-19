import 'package:flutter/material.dart';
import 'dart:async'; // Added for Timer

class VideoCallModal extends StatefulWidget {
  const VideoCallModal({Key? key}) : super(key: key);

  @override
  _VideoCallModalState createState() => _VideoCallModalState();
}

class _VideoCallModalState extends State<VideoCallModal> {
  Timer? _timer;
  int _callDuration = 0;
  bool _isMuted = false;
  bool _isVideoOff = false;

  @override
  void initState() {
    super.initState();
    // Start a timer to track call duration
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        _callDuration++;
      });
    });
  }

  @override
  void dispose() {
    _timer?.cancel(); // Cancel the timer when the widget is disposed
    super.dispose();
  }

  String _formatDuration(int seconds) {
    int minutes = (seconds / 60).floor();
    int remainingSeconds = seconds % 60;
    return '${minutes.toString().padLeft(2, '0')}:${remainingSeconds.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      insetPadding: EdgeInsets.zero,
      backgroundColor: Colors.transparent,
      child: Container(
        width: MediaQuery.of(context).size.width,
        height: MediaQuery.of(context).size.height,
        decoration: const BoxDecoration(
          color: Color(0xFF0D1B2A),
        ),
        child: Stack(
          children: [
            // Background image representing the video feed
            Container(
              decoration: const BoxDecoration(
                image: DecorationImage(
                  image: AssetImage('assets/images/profile_placeholder.jpg'), // Placeholder image
                  fit: BoxFit.cover,
                ),
              ),
            ),
            
            // Call info overlay
            Positioned(
              top: 50,
              left: 0,
              right: 0,
              child: Column(
                children: [
                  const CircleAvatar(
                    radius: 40,
                    backgroundImage: AssetImage('assets/images/profile_placeholder.jpg'),
                  ),
                  const SizedBox(height: 10),
                  const Text(
                    'Alex Johnson',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    _formatDuration(_callDuration),
                    style: const TextStyle(
                      color: Colors.white70,
                      fontSize: 16,
                    ),
                  ),
                ],
              ),
            ),
            
            // Controls at the bottom
            Positioned(
              bottom: 40,
              left: 0,
              right: 0,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  // End call button
                  Container(
                    width: 60,
                    height: 60,
                    decoration: const BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.call_end, color: Colors.white),
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                    ),
                  ),
                  
                  // Toggle mute
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: _isMuted ? Colors.white : Colors.black54,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: Icon(
                        _isMuted ? Icons.mic_off : Icons.mic,
                        color: _isMuted ? Colors.red : Colors.white,
                      ),
                      onPressed: () {
                        setState(() {
                          _isMuted = !_isMuted;
                        });
                      },
                    ),
                  ),
                  
                  // Toggle video
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: _isVideoOff ? Colors.white : Colors.black54,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: Icon(
                        _isVideoOff ? Icons.videocam_off : Icons.videocam,
                        color: _isVideoOff ? Colors.red : Colors.white,
                      ),
                      onPressed: () {
                        setState(() {
                          _isVideoOff = !_isVideoOff;
                        });
                      },
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}