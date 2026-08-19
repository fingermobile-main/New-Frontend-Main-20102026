import 'package:flutter/material.dart';
import 'package:fingermobile_app/services/security_service.dart';
import 'package:fingermobile_app/models/connected_device.dart';

class ConnectedDevicesScreen extends StatefulWidget {
  final String memberId;

  const ConnectedDevicesScreen({Key? key, required this.memberId}) : super(key: key);

  @override
  _ConnectedDevicesScreenState createState() => _ConnectedDevicesScreenState();
}

class _ConnectedDevicesScreenState extends State<ConnectedDevicesScreen> {
  final SecurityService _securityService = SecurityService();
  List<ConnectedDevice> _connectedDevices = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchConnectedDevices();
  }

  Future<void> _fetchConnectedDevices() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await _securityService.fetchConnectedDevices();
      
      if (response.hasError) {
        throw Exception(response.errorMessage);
      }

      setState(() {
        _connectedDevices = response.data ?? [];
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load connected devices: ${e.toString()}';
      });
    }
  }

  Future<void> _disconnectDevice(String deviceId) async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await _securityService.disconnectDevice(deviceId);

      if (response.hasError) {
        throw Exception(response.errorMessage);
      }

      setState(() {
        _connectedDevices.removeWhere((device) => device.id == deviceId);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Device disconnected successfully!')),
      );
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to disconnect device: ${e.toString()}';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Connected Devices'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (_errorMessage != null)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 16.0),
                      child: Text(
                        _errorMessage!,
                        style: const TextStyle(color: Colors.red),
                      ),
                    ),
                  const Text(
                    'Manage devices currently logged into your account.',
                    style: TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 24),
                  Expanded(
                    child: _connectedDevices.isEmpty
                        ? const Center(
                            child: Text('No connected devices found.'),
                          )
                        : ListView.builder(
                            itemCount: _connectedDevices.length,
                            itemBuilder: (context, index) {
                              final device = _connectedDevices[index];
                              return Card(
                                margin: const EdgeInsets.symmetric(vertical: 8.0),
                                child: ListTile(
                                  leading: const Icon(Icons.devices_other),
                                  title: Text(device.deviceName),
                                  subtitle: Text(
                                      'Last Login: ${device.lastLogin} - Location: ${device.location}'),
                                  trailing: IconButton(
                                    icon: const Icon(Icons.logout, color: Colors.red),
                                    onPressed: () => _disconnectDevice(device.id),
                                  ),
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
}