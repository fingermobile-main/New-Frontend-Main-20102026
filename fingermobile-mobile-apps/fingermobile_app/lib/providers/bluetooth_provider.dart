import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import '../services/bluetooth_service.dart';
import '../services/communication_protocol.dart';

class BluetoothProvider extends ChangeNotifier {
  BluetoothService _bluetoothService = BluetoothService.instance;
  
  // State variables
  BluetoothAdapterState _adapterState = BluetoothAdapterState.unknown;
  List<ScanResult> _scanResults = [];
  bool _isScanning = false;
  bool _isConnecting = false;
  String _connectionStatus = 'Not connected';
  List<ParsedMessage> _receivedMessages = [];

  // Getters
  BluetoothAdapterState get adapterState => _adapterState;
  List<ScanResult> get scanResults => _scanResults;
  bool get isScanning => _isScanning;
  bool get isConnecting => _isConnecting;
  String get connectionStatus => _connectionStatus;
  List<ParsedMessage> get receivedMessages => _receivedMessages;
  BluetoothDevice? get connectedDevice => _bluetoothService.connectedDevice;

  // Initialize the provider
  BluetoothProvider() {
    _init();
  }

  Future<void> _init() async {
    await _bluetoothService.initialize();
    
    // Listen to adapter state changes
    _bluetoothService.adapterStateStream.listen(_handleAdapterStateChanged);
    
    // Listen to scan results
    _bluetoothService.scanResultsStream.listen(_handleScanResults);
    
    // Listen to incoming messages
    _bluetoothService.messageStream.listen(_handleIncomingMessage);
    
    // Listen to connection status changes
    _bluetoothService.connectionStatusStream.listen(_handleConnectionStatusChanged);
  }

  void _handleAdapterStateChanged(BluetoothAdapterState state) {
    _adapterState = state;
    notifyListeners();
  }

  void _handleScanResults(List<ScanResult> results) {
    _scanResults = results;
    notifyListeners();
  }

  void _handleIncomingMessage(ParsedMessage message) {
    _receivedMessages.add(message);
    debugPrint('Received message: ${message.command} - ${message.payload}');
    notifyListeners();
  }

  void _handleConnectionStatusChanged(String status) {
    _connectionStatus = status;
    notifyListeners();
  }

  /// Request Bluetooth permissions
  Future<bool> requestPermissions() async {
    return await _bluetoothService.requestPermissions();
  }

  /// Start scanning for devices
  Future<void> startScanning({List<Guid>? withServices}) async {
    _isScanning = true;
    notifyListeners();
    
    try {
      await _bluetoothService.startScanning(withServices: withServices);
    } catch (e) {
      _isScanning = false;
      notifyListeners();
      throw e;
    }
  }

  /// Stop scanning for devices
  Future<void> stopScanning() async {
    await _bluetoothService.stopScanning();
    _isScanning = false;
    notifyListeners();
  }

  /// Connect to a device
  Future<bool> connectToDevice(BluetoothDevice device) async {
    _isConnecting = true;
    _connectionStatus = 'Connecting...';
    notifyListeners();
    
    bool success = await _bluetoothService.connectToDevice(device);
    
    if (success) {
      _connectionStatus = 'Connected';
    } else {
      _connectionStatus = 'Connection failed';
    }
    
    _isConnecting = false;
    notifyListeners();
    
    return success;
  }

  /// Disconnect from the current device
  Future<void> disconnectFromDevice() async {
    await _bluetoothService.disconnectFromDevice();
    _connectionStatus = 'Disconnected';
    notifyListeners();
  }

  /// Send a command to the connected device
  Future<void> sendCommand(String command, [Map<String, dynamic>? params]) async {
    try {
      await _bluetoothService.sendCommand(command, params);
      debugPrint('Command sent: $command');
    } catch (e) {
      debugPrint('Error sending command: $e');
      rethrow;
    }
  }

  /// Send data to the connected device
  Future<void> sendData(String dataType, dynamic data) async {
    try {
      await _bluetoothService.sendData(dataType, data);
      debugPrint('Data sent: $dataType - $data');
    } catch (e) {
      debugPrint('Error sending data: $e');
      rethrow;
    }
  }

  @override
  void dispose() {
    _bluetoothService.dispose();
    super.dispose();
  }
}