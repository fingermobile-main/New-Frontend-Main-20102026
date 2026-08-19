import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:provider/provider.dart';
import '../providers/bluetooth_provider.dart';

class BluetoothDeviceManager extends StatefulWidget {
  @override
  _BluetoothDeviceManagerState createState() => _BluetoothDeviceManagerState();
}

class _BluetoothDeviceManagerState extends State<BluetoothDeviceManager> {
  final TextEditingController _deviceNameController = TextEditingController();
  final TextEditingController _customCommandController = TextEditingController();
  bool _isDiscoverable = false;
  bool _isAdvertising = false;

  @override
  void dispose() {
    _deviceNameController.dispose();
    _customCommandController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bluetoothProvider = Provider.of<BluetoothProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Bluetooth Device Manager'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Bluetooth Status Card
              Card(
                elevation: 4,
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    children: [
                      Text(
                        'Bluetooth Status',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          Column(
                            children: [
                              Icon(
                                bluetoothProvider.adapterState == BluetoothAdapterState.on
                                    ? Icons.bluetooth_connected
                                    : Icons.bluetooth_disabled,
                                size: 40,
                                color: bluetoothProvider.adapterState == BluetoothAdapterState.on
                                    ? Colors.green
                                    : Colors.red,
                              ),
                              SizedBox(height: 5),
                              Text(
                                'Adapter: ${bluetoothProvider.adapterState.toString().split('.').last.toUpperCase()}',
                                style: TextStyle(fontWeight: FontWeight.w500),
                              ),
                            ],
                          ),
                          Column(
                            children: [
                              Icon(
                                bluetoothProvider.isConnected
                                    ? Icons.link
                                    : Icons.link_off,
                                size: 40,
                                color: bluetoothProvider.isConnected
                                    ? Colors.green
                                    : Colors.grey,
                              ),
                              SizedBox(height: 5),
                              Text(
                                bluetoothProvider.isConnected ? 'Connected' : 'Disconnected',
                                style: TextStyle(fontWeight: FontWeight.w500),
                              ),
                            ],
                          ),
                        ],
                      ),
                      SizedBox(height: 10),
                      Text(
                        'Connection Status: ${bluetoothProvider.connectionStatus}',
                        style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
              ),

              SizedBox(height: 20),

              // Device Discovery Controls
              Card(
                elevation: 4,
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Device Discovery',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 10),
                      ElevatedButton(
                        onPressed: bluetoothProvider.adapterState == BluetoothAdapterState.on
                            ? () async {
                                bool permissionsGranted = await bluetoothProvider.requestPermissions();
                                
                                if (!permissionsGranted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('Permissions required for Bluetooth')),
                                  );
                                  return;
                                }
                                
                                await bluetoothProvider.startScanning();
                              }
                            : null,
                        child: bluetoothProvider.isScanning
                            ? Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  SizedBox(
                                    width: 16,
                                    height: 16,
                                    child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                                  ),
                                  SizedBox(width: 12),
                                  Text('Scanning...'),
                                ],
                              )
                            : Text('Start Scanning'),
                      ),
                      SizedBox(height: 10),
                      if (bluetoothProvider.isScanning)
                        ElevatedButton(
                          onPressed: () => bluetoothProvider.stopScanning(),
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                          child: Text('Stop Scanning', style: TextStyle(color: Colors.white)),
                        ),
                    ],
                  ),
                ),
              ),

              SizedBox(height: 20),

              // Paired Devices List
              Card(
                elevation: 4,
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Paired Devices',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 10),
                      FutureBuilder<List<BluetoothDevice>>(
                        future: _getPairedDevices(),
                        builder: (context, snapshot) {
                          if (snapshot.connectionState == ConnectionState.waiting) {
                            return Center(child: CircularProgressIndicator());
                          }
                          if (snapshot.hasError || !snapshot.hasData) {
                            return Text('No paired devices found');
                          }
                          
                          List<BluetoothDevice> devices = snapshot.data!;
                          if (devices.isEmpty) {
                            return Text('No paired devices found');
                          }
                          
                          return ListView.builder(
                            shrinkWrap: true,
                            physics: NeverScrollableScrollPhysics(),
                            itemCount: devices.length,
                            itemBuilder: (context, index) {
                              BluetoothDevice device = devices[index];
                              bool isConnected = bluetoothProvider.connectedDevice?.id == device.id;
                              
                              return Card(
                                margin: EdgeInsets.only(bottom: 8),
                                child: ListTile(
                                  leading: Icon(Icons.devices_other, color: isConnected ? Colors.green : Colors.grey),
                                  title: Text(device.name.isNotEmpty ? device.name : device.id.toString()),
                                  subtitle: Text('MAC: ${device.id}\nType: ${device.type.toString()}'),
                                  trailing: isConnected
                                      ? Icon(Icons.bluetooth_connected, color: Colors.green)
                                      : null,
                                  onTap: () async {
                                    if (isConnected) {
                                      await bluetoothProvider.disconnectFromDevice();
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(content: Text('Disconnected from ${device.name}')),
                                      );
                                    } else {
                                      bool connected = await bluetoothProvider.connectToDevice(device);
                                      if (connected) {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(content: Text('Connected to ${device.name}')),
                                        );
                                      } else {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(content: Text('Failed to connect to ${device.name}')),
                                        );
                                      }
                                    }
                                  },
                                ),
                              );
                            },
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),

              SizedBox(height: 20),

              // Connected Device Actions
              if (bluetoothProvider.isConnected && bluetoothProvider.connectedDevice != null)
                Card(
                  elevation: 4,
                  child: Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Connected Device Actions',
                          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        SizedBox(height: 10),
                        Text(
                          'Connected to: ${bluetoothProvider.connectedDevice!.name}',
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                        ),
                        SizedBox(height: 10),
                        ElevatedButton(
                          onPressed: () => bluetoothProvider.disconnectFromDevice(),
                          style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                          child: Text('Disconnect', style: TextStyle(color: Colors.white)),
                        ),
                        SizedBox(height: 15),
                        // Quick Commands
                        Text(
                          'Quick Commands:',
                          style: TextStyle(fontWeight: FontWeight.w500),
                        ),
                        Wrap(
                          spacing: 8.0,
                          children: [
                            ActionChip(
                              label: Text('Ping'),
                              onPressed: () => _sendPredefinedCommand(bluetoothProvider, 'ping'),
                            ),
                            ActionChip(
                              label: Text('Status'),
                              onPressed: () => _sendPredefinedCommand(bluetoothProvider, 'status'),
                            ),
                            ActionChip(
                              label: Text('Reset'),
                              onPressed: () => _sendPredefinedCommand(bluetoothProvider, 'reset'),
                            ),
                            ActionChip(
                              label: Text('Calibrate'),
                              onPressed: () => _sendPredefinedCommand(bluetoothProvider, 'calibrate'),
                            ),
                          ],
                        ),
                        SizedBox(height: 15),
                        // Custom Command Input
                        Text(
                          'Custom Command:',
                          style: TextStyle(fontWeight: FontWeight.w500),
                        ),
                        SizedBox(height: 10),
                        TextField(
                          controller: _customCommandController,
                          decoration: InputDecoration(
                            hintText: 'Enter custom command',
                            border: OutlineInputBorder(),
                          ),
                        ),
                        SizedBox(height: 10),
                        ElevatedButton(
                          onPressed: () {
                            if (_customCommandController.text.trim().isNotEmpty) {
                              bluetoothProvider.sendCommand(_customCommandController.text.trim())
                                  .then((_) {
                                _customCommandController.clear();
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Command sent: ${_customCommandController.text.trim()}')),
                                );
                              }).catchError((error) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('Error sending command: $error')),
                                );
                              });
                            }
                          },
                          child: Text('Send Custom Command'),
                        ),
                      ],
                    ),
                  ),
                ),

              SizedBox(height: 20),

              // Recent Messages
              Card(
                elevation: 4,
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'Recent Messages',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          TextButton(
                            onPressed: () {
                              setState(() {
                                bluetoothProvider.receivedMessages.clear();
                              });
                            },
                            child: Text('Clear'),
                          ),
                        ],
                      ),
                      SizedBox(height: 10),
                      Container(
                        height: 150,
                        child: bluetoothProvider.receivedMessages.isEmpty
                            ? Center(
                                child: Text(
                                  'No messages received yet',
                                  style: TextStyle(color: Colors.grey),
                                ),
                              )
                            : ListView.builder(
                                itemCount: bluetoothProvider.receivedMessages.length > 10 
                                    ? 10 
                                    : bluetoothProvider.receivedMessages.length,
                                itemBuilder: (context, index) {
                                  // Show the last 10 messages in reverse order
                                  int msgIndex = bluetoothProvider.receivedMessages.length - 1 - index;
                                  if (msgIndex < 0) return Container();
                                  
                                  var message = bluetoothProvider.receivedMessages[msgIndex];
                                  
                                  return Card(
                                    child: Padding(
                                      padding: EdgeInsets.all(8.0),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            'Type: ${message.type}, Cmd: ${message.command}',
                                            style: TextStyle(fontWeight: FontWeight.w500),
                                          ),
                                          Text(
                                            'Time: ${message.timestamp.toIso8601String()}',
                                            style: TextStyle(fontSize: 12, color: Colors.grey),
                                          ),
                                          if (message.payload != null)
                                            Text(
                                              'Payload: ${message.payload}',
                                              style: TextStyle(fontSize: 12),
                                            ),
                                        ],
                                      ),
                                    ),
                                  );
                                },
                              ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<List<BluetoothDevice>> _getPairedDevices() async {
    try {
      return await FlutterBluePlus.pairedDevices;
    } catch (e) {
      print('Error getting paired devices: $e');
      return [];
    }
  }

  void _sendPredefinedCommand(BluetoothProvider provider, String command) {
    provider.sendCommand(command).then((_) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Sent command: $command')),
      );
    }).catchError((error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error sending command: $error')),
      );
    });
  }
}