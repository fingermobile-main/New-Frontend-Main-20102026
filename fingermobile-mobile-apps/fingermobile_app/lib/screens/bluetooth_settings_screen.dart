import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:provider/provider.dart';
import '../providers/bluetooth_provider.dart';
import '../services/communication_protocol.dart';

class BluetoothSettingsScreen extends StatefulWidget {
  @override
  _BluetoothSettingsScreenState createState() => _BluetoothSettingsScreenState();
}

class _BluetoothSettingsScreenState extends State<BluetoothSettingsScreen> {
  final TextEditingController _commandController = TextEditingController();
  final TextEditingController _dataController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final bluetoothProvider = Provider.of<BluetoothProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text('Bluetooth Settings'),
        backgroundColor: Theme.of(context).primaryColor,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
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
                  ],
                ),
              ),
            ),
            
            SizedBox(height: 20),
            
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
            
            bluetoothProvider.isScanning
                ? ElevatedButton(
                    onPressed: () => bluetoothProvider.stopScanning(),
                    style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                    child: Text('Stop Scanning', style: TextStyle(color: Colors.white)),
                  )
                : Container(),
            
            SizedBox(height: 20),
            
            Expanded(
              child: bluetoothProvider.scanResults.isEmpty
                  ? Center(
                      child: Text(
                        bluetoothProvider.isScanning
                            ? 'Scanning for devices...'
                            : 'Press "Start Scanning" to find nearby devices',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 16, color: Colors.grey),
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: () async {
                        if (!bluetoothProvider.isScanning) {
                          await bluetoothProvider.startScanning();
                          await Future.delayed(Duration(seconds: 5));
                          await bluetoothProvider.stopScanning();
                        }
                      },
                      child: ListView.builder(
                        itemCount: bluetoothProvider.scanResults.length,
                        itemBuilder: (context, index) {
                          ScanResult result = bluetoothProvider.scanResults[index];
                          
                          return Card(
                            margin: EdgeInsets.only(bottom: 10),
                            child: ListTile(
                              leading: Icon(Icons.bluetooth, color: Colors.blue),
                              title: Text(result.device.name.isNotEmpty 
                                  ? result.device.name 
                                  : result.device.id.toString()),
                              subtitle: Text('RSSI: ${result.rssi} dBm\nMAC: ${result.device.id}'),
                              trailing: bluetoothProvider.isConnecting &&
                                      bluetoothProvider.connectedDevice?.id == result.device.id
                                  ? SizedBox(
                                      width: 20,
                                      height: 20,
                                      child: CircularProgressIndicator(strokeWidth: 2),
                                    )
                                  : bluetoothProvider.connectedDevice?.id == result.device.id
                                      ? Icon(Icons.link, color: Colors.green)
                                      : null,
                              onTap: bluetoothProvider.isConnected
                                  ? null // Disable if already connected to another device
                                  : () async {
                                      bool connected = await bluetoothProvider.connectToDevice(result.device);
                                      
                                      if (connected) {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(content: Text('Connected to ${result.device.name}')),
                                        );
                                      } else {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(content: Text('Failed to connect to ${result.device.name}')),
                                        );
                                      }
                                    },
                            ),
                          );
                        },
                      ),
                    ),
            ),
            
            if (bluetoothProvider.isConnected) ...[
              SizedBox(height: 20),
              
              Card(
                elevation: 4,
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Connected Device',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 10),
                      Text(
                        'Name: ${bluetoothProvider.connectedDevice?.name ?? 'Unknown'}',
                        style: TextStyle(fontSize: 16),
                      ),
                      Text(
                        'ID: ${bluetoothProvider.connectedDevice?.id}',
                        style: TextStyle(fontSize: 16),
                      ),
                      SizedBox(height: 15),
                      ElevatedButton(
                        onPressed: () => bluetoothProvider.disconnectFromDevice(),
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                        child: Text('Disconnect', style: TextStyle(color: Colors.white)),
                      ),
                    ],
                  ),
                ),
              ),
              
              SizedBox(height: 20),
              
              Card(
                elevation: 4,
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Send Command',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 10),
                      TextField(
                        controller: _commandController,
                        decoration: InputDecoration(
                          hintText: 'Enter command to send',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      SizedBox(height: 10),
                      ElevatedButton(
                        onPressed: () {
                          if (_commandController.text.trim().isNotEmpty) {
                            bluetoothProvider.sendCommand(_commandController.text.trim())
                                .then((_) {
                              _commandController.clear();
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Command sent: ${_commandController.text.trim()}')),
                              );
                            }).catchError((error) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Error sending command: $error')),
                              );
                            });
                          }
                        },
                        child: Text('Send Command'),
                      ),
                      SizedBox(height: 10),
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
                    ],
                  ),
                ),
              ),
              
              SizedBox(height: 20),
              
              Card(
                elevation: 4,
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Send Data',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      SizedBox(height: 10),
                      TextField(
                        controller: _dataController,
                        decoration: InputDecoration(
                          hintText: 'Enter data to send',
                          border: OutlineInputBorder(),
                        ),
                      ),
                      SizedBox(height: 10),
                      ElevatedButton(
                        onPressed: () {
                          if (_dataController.text.trim().isNotEmpty) {
                            bluetoothProvider.sendData('raw_data', _dataController.text.trim())
                                .then((_) {
                              _dataController.clear();
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Data sent: ${_dataController.text.trim()}')),
                              );
                            }).catchError((error) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Error sending data: $error')),
                              );
                            });
                          }
                        },
                        child: Text('Send Data'),
                      ),
                    ],
                  ),
                ),
              ),
              
              SizedBox(height: 20),
              
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
                                itemCount: bluetoothProvider.receivedMessages.length,
                                itemBuilder: (context, index) {
                                  // Show the last 10 messages in reverse order
                                  int msgIndex = bluetoothProvider.receivedMessages.length - 1 - index;
                                  if (msgIndex < 0) return Container();
                                  
                                  ParsedMessage message = bluetoothProvider.receivedMessages[msgIndex];
                                  
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
          ],
        ),
      ),
    );
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

  @override
  void dispose() {
    _commandController.dispose();
    _dataController.dispose();
    super.dispose();
  }
}