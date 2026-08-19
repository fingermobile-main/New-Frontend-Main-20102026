import 'package:flutter/material.dart';

class ConferenceRoom extends StatefulWidget {
  final String roomName;
  final String roomDescription;

  const ConferenceRoom({
    Key? key,
    required this.roomName,
    required this.roomDescription,
  }) : super(key: key);

  @override
  _ConferenceRoomState createState() => _ConferenceRoomState();
}

class _ConferenceRoomState extends State<ConferenceRoom> {
  bool _isMuted = false;
  bool _isVideoOff = false;
  bool _isScreenSharing = false;
  bool _isRecording = false;
  int _attendeeCount = 12;
  final List<_Attendee> _attendees = [
    _Attendee(name: 'You', isMuted: false, isVideoOn: true, isPresenter: false),
    _Attendee(name: 'Alex Johnson', isMuted: false, isVideoOn: true, isPresenter: true),
    _Attendee(name: 'Sarah Williams', isMuted: false, isVideoOn: true, isPresenter: false),
    _Attendee(name: 'Michael Chen', isMuted: true, isVideoOn: false, isPresenter: false),
    _Attendee(name: 'Emma Rodriguez', isMuted: false, isVideoOn: true, isPresenter: false),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Top bar with room info
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.grey[900],
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.3),
                    blurRadius: 5,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Icon(Icons.videocam, color: Colors.red, size: 18),
                  SizedBox(width: 8),
                  Text(
                    'LIVE',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(width: 16),
                  Text(
                    widget.roomName,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Spacer(),
                  Text(
                    '$_attendeeCount attendees',
                    style: TextStyle(
                      color: Colors.grey[400],
                    ),
                  ),
                ],
              ),
            ),
            
            // Main video area
            Expanded(
              child: Container(
                color: Colors.black,
                child: _buildVideoGrid(),
              ),
            ),
            
            // Participant list
            Container(
              height: 100,
              padding: EdgeInsets.all(8),
              color: Colors.grey[850],
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _attendees.length,
                itemBuilder: (context, index) {
                  return _buildParticipantTile(_attendees[index], index);
                },
              ),
            ),
            
            // Controls
            Container(
              padding: EdgeInsets.all(12),
              color: Colors.grey[900],
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  // Mute button
                  _buildControlButton(
                    icon: _isMuted ? Icons.mic_off : Icons.mic,
                    color: _isMuted ? Colors.red : Colors.white,
                    onPressed: () {
                      setState(() {
                        _isMuted = !_isMuted;
                      });
                    },
                  ),
                  
                  // Video toggle
                  _buildControlButton(
                    icon: _isVideoOff ? Icons.videocam_off : Icons.videocam,
                    color: _isVideoOff ? Colors.red : Colors.white,
                    onPressed: () {
                      setState(() {
                        _isVideoOff = !_isVideoOff;
                      });
                    },
                  ),
                  
                  // Screen share
                  _buildControlButton(
                    icon: Icons.screen_share,
                    color: _isScreenSharing ? Colors.blue : Colors.white,
                    onPressed: () {
                      setState(() {
                        _isScreenSharing = !_isScreenSharing;
                      });
                    },
                  ),
                  
                  // Participants list
                  _buildControlButton(
                    icon: Icons.people,
                    color: Colors.white,
                    onPressed: () {
                      _showParticipantsList();
                    },
                  ),
                  
                  // Leave call
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: Colors.red,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: Icon(Icons.call_end, color: Colors.white),
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                    ),
                  ),
                  
                  // Chat
                  _buildControlButton(
                    icon: Icons.chat,
                    color: Colors.white,
                    onPressed: () {
                      // Open chat
                    },
                  ),
                  
                  // Record
                  _buildControlButton(
                    icon: _isRecording ? Icons.radio_button_checked : Icons.radio_button_unchecked,
                    color: _isRecording ? Colors.red : Colors.white,
                    onPressed: () {
                      setState(() {
                        _isRecording = !_isRecording;
                      });
                    },
                  ),
                  
                  // More options
                  _buildControlButton(
                    icon: Icons.more_vert,
                    color: Colors.white,
                    onPressed: () {
                      _showMoreOptions();
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildVideoGrid() {
    if (_attendees.length == 1) {
      // Single participant view
      return Center(
        child: Container(
          width: double.infinity,
          height: double.infinity,
          decoration: BoxDecoration(
            color: Colors.grey[800],
            border: Border.all(color: Colors.grey[700]!),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              CircleAvatar(
                radius: 50,
                backgroundColor: Colors.grey[600],
                child: Icon(
                  Icons.person,
                  size: 50,
                  color: Colors.grey[300],
                ),
              ),
              SizedBox(height: 16),
              Text(
                _attendees[0].name,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                ),
              ),
              SizedBox(height: 8),
              Text(
                _attendees[0].isPresenter ? 'Presenter' : 'Participant',
                style: TextStyle(
                  color: Colors.grey[400],
                ),
              ),
            ],
          ),
        ),
      );
    } else if (_attendees.length == 2) {
      // Two participant view
      return Row(
        children: [
          Expanded(
            child: _buildVideoTile(_attendees[0]),
          ),
          Expanded(
            child: _buildVideoTile(_attendees[1]),
          ),
        ],
      );
    } else {
      // Grid view for multiple participants
      final rows = (_attendees.length / 2).ceil();
      final tilesPerRow = _attendees.length <= 2 ? 2 : 2;
      
      return GridView.builder(
        gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: tilesPerRow,
          childAspectRatio: 16 / 9,
        ),
        itemCount: _attendees.length,
        itemBuilder: (context, index) {
          return _buildVideoTile(_attendees[index]);
        },
      );
    }
  }

  Widget _buildVideoTile(_Attendee attendee) {
    return Container(
      margin: EdgeInsets.all(4),
      decoration: BoxDecoration(
        border: Border.all(color: attendee.isPresenter ? Colors.blue : Colors.transparent, width: 2),
      ),
      child: Stack(
        children: [
          Container(
            color: Colors.grey[900],
            child: attendee.isVideoOn
                ? Image.network(
                    'https://via.placeholder.com/640x480/333333/FFFFFF?text=${attendee.name}',
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        color: Colors.grey[800],
                        child: Icon(
                          Icons.person,
                          size: 50,
                          color: Colors.grey[500],
                        ),
                      );
                    },
                  )
                : Container(
                    color: Colors.grey[800],
                    child: Icon(
                      Icons.person,
                      size: 50,
                      color: Colors.grey[500],
                    ),
                  ),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              padding: EdgeInsets.all(8),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withOpacity(0.7),
                  ],
                ),
              ),
              child: Row(
                children: [
                  Text(
                    attendee.name,
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (attendee.isPresenter)
                    Container(
                      margin: EdgeInsets.only(left: 8),
                      padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.blue,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        'Presenter',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                        ),
                      ),
                    ),
                  Spacer(),
                  if (attendee.isMuted)
                    Icon(
                      Icons.mic_off,
                      size: 16,
                      color: Colors.red,
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildParticipantTile(_Attendee attendee, int index) {
    return Container(
      width: 80,
      margin: EdgeInsets.symmetric(horizontal: 4),
      child: Column(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: Colors.grey[800],
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: attendee.isPresenter ? Colors.blue : Colors.transparent,
                width: 2,
              ),
            ),
            child: attendee.isVideoOn
                ? Image.network(
                    'https://via.placeholder.com/640x480/333333/FFFFFF?text=${attendee.name.substring(0, 1).toUpperCase()}',
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) {
                      return Container(
                        color: Colors.grey[700],
                        child: Icon(
                          Icons.person,
                          color: Colors.grey[400],
                        ),
                      );
                    },
                  )
                : Container(
                    color: Colors.grey[700],
                    child: Icon(
                      Icons.person,
                      color: Colors.grey[400],
                    ),
                  ),
          ),
          SizedBox(height: 4),
          Text(
            attendee.name.split(' ').first,
            style: TextStyle(
              fontSize: 10,
              color: Colors.white,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildControlButton({
    required IconData icon,
    required Color color,
    required VoidCallback onPressed,
  }) {
    return Container(
      width: 50,
      height: 50,
      decoration: BoxDecoration(
        color: Colors.grey[800],
        shape: BoxShape.circle,
      ),
      child: IconButton(
        icon: Icon(icon, color: color),
        onPressed: onPressed,
      ),
    );
  }

  void _showParticipantsList() {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        child: Container(
          height: 400,
          child: Column(
            children: [
              Container(
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.vertical(top: Radius.circular(8)),
                ),
                child: Row(
                  children: [
                    Text(
                      'Participants ($_attendeeCount)',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Spacer(),
                    IconButton(
                      icon: Icon(Icons.close),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: ListView.builder(
                  itemCount: _attendees.length,
                  itemBuilder: (context, index) {
                    final attendee = _attendees[index];
                    return ListTile(
                      leading: CircleAvatar(
                        backgroundColor: Colors.grey[300],
                        child: Icon(
                          Icons.person,
                          color: Colors.grey[600],
                        ),
                      ),
                      title: Text(attendee.name),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (attendee.isMuted)
                            Icon(
                              Icons.mic_off,
                              color: Colors.red,
                              size: 18,
                            ),
                          if (attendee.isPresenter)
                            Icon(
                              Icons.star,
                              color: Colors.blue,
                              size: 18,
                            ),
                        ],
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showMoreOptions() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Container(
        padding: EdgeInsets.all(16),
        child: Wrap(
          children: [
            ListTile(
              leading: Icon(Icons.lock),
              title: Text('Lock Meeting'),
              onTap: () {
                Navigator.of(context).pop();
              },
            ),
            ListTile(
              leading: Icon(Icons.exit_to_app),
              title: Text('Leave Meeting'),
              onTap: () {
                Navigator.of(context).pop();
                Navigator.of(context).pop();
              },
            ),
            ListTile(
              leading: Icon(Icons.info),
              title: Text('Meeting Info'),
              onTap: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _Attendee {
  final String name;
  final bool isMuted;
  final bool isVideoOn;
  final bool isPresenter;

  _Attendee({
    required this.name,
    required this.isMuted,
    required this.isVideoOn,
    required this.isPresenter,
  });
}