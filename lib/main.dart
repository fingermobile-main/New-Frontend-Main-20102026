import 'package:flutter/material.dart';
import 'platform_service.dart';

void main() {
  runApp(FingerMobileApp());
}

class FingerMobileApp extends StatelessWidget {
  final PlatformService _platformService = PlatformService();

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FingerMobile Protocol - Main Platform',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: FutureBuilder(
        future: _platformService.initialize(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Scaffold(
              body: Center(child: CircularProgressIndicator()),
            );
          } else {
            return HomePage(platformService: _platformService);
          }
        },
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  final PlatformService platformService;

  const HomePage({Key? key, required this.platformService}) : super(key: key);

  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String receivedData = '';
  final TextEditingController _messageController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('FingerMobile Protocol'),
        backgroundColor: Colors.blue[800],
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Card(
                elevation: 4,
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      Icon(
                        Icons.phone_android,
                        size: 80,
                        color: Colors.blue,
                      ),
                      SizedBox(height: 16),
                      Text(
                        'FingerMobile Protocol',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.blue[800]
                        ),
                      ),
                      SizedBox(height: 8),
                      Text(
                        'A comprehensive social platform ecosystem',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(height: 20),
              
              // Connection status
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Connection Status',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 8),
                      Row(
                        children: [
                          Container(
                            width: 12,
                            height: 12,
                            decoration: BoxDecoration(
                              color: widget.platformService.isConnected ? Colors.green : Colors.red,
                              shape: BoxShape.circle,
                            ),
                          ),
                          SizedBox(width: 8),
                          Text(
                            widget.platformService.isConnected ? 'Connected' : 'Disconnected',
                            style: TextStyle(
                              fontSize: 16,
                              color: widget.platformService.isConnected ? Colors.green : Colors.red,
                            ),
                          ),
                          if (widget.platformService.currentDeviceId.isNotEmpty) ...[
                            SizedBox(width: 16),
                            Text(
                              'Device: ${widget.platformService.currentDeviceId}',
                              style: TextStyle(fontSize: 14),
                            ),
                          ]
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              
              SizedBox(height: 20),
              
              // Messaging section
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Messaging',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 16),
                      TextField(
                        controller: _messageController,
                        decoration: InputDecoration(
                          labelText: 'Enter message',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: _messageController.text.isEmpty ? null : () async {
                                bool result = await widget.platformService.sendfingermobileprotocolData(_messageController.text);
                                if (result) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('Message sent successfully')),
                                  );
                                  _messageController.clear();
                                } else {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('Failed to send message')),
                                  );
                                }
                              },
                              icon: Icon(Icons.send),
                              label: Text('Send Message'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.blue,
                                foregroundColor: Colors.white,
                              ),
                            ),
                          ),
                          SizedBox(width: 12),
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: () async {
                                String data = await widget.platformService.receivefingermobileprotocolData();
                                setState(() {
                                  receivedData = data;
                                });
                              },
                              icon: Icon(Icons.message),
                              label: Text('Receive'),
                            ),
                          ),
                        ],
                      ),
                      if (receivedData.isNotEmpty) ...[
                        SizedBox(height: 16),
                        Container(
                          padding: EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.grey[100],
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Received Message:',
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              SizedBox(height: 8),
                              Text(receivedData),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
              
              SizedBox(height: 20),
              
              // Platform features grid
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Platform Features',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 16),
                      Wrap(
                        spacing: 12,
                        runSpacing: 12,
                        children: [
                          FeatureChip(label: 'Messaging', icon: Icons.message),
                          FeatureChip(label: 'Social', icon: Icons.people),
                          FeatureChip(label: 'E-commerce', icon: Icons.shopping_bag),
                          FeatureChip(label: 'Content', icon: Icons.video_library),
                          FeatureChip(label: 'Wallet', icon: Icons.account_balance_wallet),
                          FeatureChip(label: 'Security', icon: Icons.lock),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          if (widget.platformService.isConnected) {
            await widget.platformService.disconnect();
          } else {
            bool connected = await widget.platformService.connectToDevice('MOBILE_DEVICE');
            if (connected) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Connected to device')),
              );
            }
          }
          setState(() {});
        },
        icon: Icon(widget.platformService.isConnected ? Icons.wifi_off : Icons.wifi),
        label: Text(widget.platformService.isConnected ? 'Disconnect' : 'Connect'),
        backgroundColor: widget.platformService.isConnected ? Colors.red : Colors.blue,
        foregroundColor: Colors.white,
      ),
    );
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }
}

class FeatureChip extends StatelessWidget {
  final String label;
  final IconData icon;

  const FeatureChip({
    Key? key,
    required this.label,
    required this.icon,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InputChip(
      label: Text(label),
      avatar: Icon(icon, size: 16),
      backgroundColor: Colors.blue[50],
      labelStyle: TextStyle(color: Colors.blue[800]),
    );
  }
}