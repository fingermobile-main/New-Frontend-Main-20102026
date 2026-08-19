import 'dart:async';
import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'communication_protocol.dart'; // Import the communication protocol

class BluetoothService {
  static final BluetoothService _instance = BluetoothService._internal();
  factory BluetoothService() => _instance;
  BluetoothService._internal();

  // Singleton instance
  static BluetoothService get instance => _instance;

  // Stream controllers for Bluetooth state and device scanning
  StreamController<BluetoothAdapterState>? _adapterStateController;
  StreamController<List<ScanResult>>? _scanResultsController;
  StreamController<ParsedMessage>? _messageStreamController;
  StreamController<String>? _connectionStatusController;

  // Getters for streams
  Stream<BluetoothAdapterState> get adapterStateStream =>
      _adapterStateController!.stream;
  Stream<List<ScanResult>> get scanResultsStream =>
      _scanResultsController!.stream;
  Stream<ParsedMessage> get messageStream =>
      _messageStreamController!.stream;
  Stream<String> get connectionStatusStream =>
      _connectionStatusController!.stream;

  // Current state variables
  BluetoothAdapterState _adapterState = BluetoothAdapterState.unknown;
  List<ScanResult> _scanResults = [];
  BluetoothDevice? _connectedDevice;
  bool _isScanning = false;
  String _connectionStatus = 'Disconnected';

  // Characteristic references for reading/writing
  BluetoothCharacteristic? _txCharacteristic; // Transmit characteristic
  BluetoothCharacteristic? _rxCharacteristic; // Receive characteristic

  /// Initialize the service
  Future<void> initialize() async {
    _adapterStateController = StreamController<BluetoothAdapterState>();
    _scanResultsController = StreamController<List<ScanResult>>();
    _messageStreamController = StreamController<ParsedMessage>.broadcast();
    _connectionStatusController = StreamController<String>.broadcast();

    // Listen to Bluetooth adapter state changes
    FlutterBluePlus.adapterState.listen((state) {
      _adapterState = state;
      _adapterStateController!.add(state);
      _updateConnectionStatus();
    });

    // Start listening to scan results
    FlutterBluePlus.scanResults.listen((results) {
      _scanResults = results;
      _scanResultsController!.add(results);
    });
  }

  /// Update connection status based on adapter state and device connection
  void _updateConnectionStatus() {
    String status = 'Unknown';
    if (_adapterState == BluetoothAdapterState.off) {
      status = 'Bluetooth Off';
    } else if (_adapterState == BluetoothAdapterState.on) {
      if (_connectedDevice?.isConnectedStream.value ?? false) {
        status = 'Connected';
      } else {
        status = 'Ready';
      }
    } else {
      status = _adapterState.toString().split('.').last;
    }
    _connectionStatus = status;
    _connectionStatusController!.add(status);
  }

  /// Request permissions for Bluetooth
  Future<bool> requestPermissions() async {
    // On Android, location permission is required for BLE
    // On iOS, Bluetooth permission is required
    try {
      bool granted = await FlutterBluePlus.requestPermissions;
      return granted;
    } catch (e) {
      print("Permission request failed: $e");
      return false;
    }
  }

  /// Get current adapter state
  BluetoothAdapterState get adapterState => _adapterState;

  /// Start scanning for Bluetooth devices
  Future<void> startScanning({
    List<Guid>? withServices,
    Duration? timeout,
  }) async {
    if (_isScanning) {
      await stopScanning();
    }

    _isScanning = true;
    _updateConnectionStatus();
    
    try {
      await FlutterBluePlus.startScan(
        withServices: withServices,
        timeout: timeout ?? const Duration(seconds: 30),
      );
    } catch (e) {
      print("Failed to start scanning: $e");
      _isScanning = false;
      _updateConnectionStatus();
      rethrow;
    }
  }

  /// Stop scanning for Bluetooth devices
  Future<void> stopScanning() async {
    try {
      await FlutterBluePlus.stopScan();
      _isScanning = false;
      _updateConnectionStatus();
    } catch (e) {
      print("Failed to stop scanning: $e");
    }
  }

  /// Connect to a specific device
  Future<bool> connectToDevice(BluetoothDevice device, {Duration timeout = const Duration(seconds: 10)}) async {
    try {
      _connectedDevice = device;
      _connectionStatus = 'Connecting...';
      _connectionStatusController!.add(_connectionStatus);
      
      // Connect to the device with proper timeout handling
      await device.connect(
        timeout: timeout,
        autoConnect: false,  // Don't auto-reconnect automatically
      );
      
      // Verify connection status
      bool connected = await device.isConnectedStream.firstWhere((connected) => connected, orElse: () => false);
      if (!connected) {
        throw Exception("Connection timed out or failed");
      }
      
      // Discover services
      List<BluetoothService> services = await device.discoverServices();
      
      // Try to find TX and RX characteristics (common in UART-style services)
      for (BluetoothService service in services) {
        for (BluetoothCharacteristic characteristic in service.characteristics) {
          // Common UUIDs for TX/RX characteristics in UART-style services
          if (_isWritableCharacteristic(characteristic)) {
            _txCharacteristic = characteristic;
          }
          
          if (_isReadableCharacteristic(characteristic)) {
            _rxCharacteristic = characteristic;
            
            // Listen for incoming data
            try {
              await characteristic.setNotifyValue(true);
              characteristic.value.listen(_handleIncomingData);
            } catch (e) {
              print("Failed to enable notifications for characteristic: $e");
            }
          }
        }
      }
      
      _connectionStatus = 'Connected';
      _connectionStatusController!.add(_connectionStatus);
      return true;
    } catch (e) {
      print("Failed to connect to device: $e");
      _connectionStatus = 'Connection Failed';
      _connectionStatusController!.add(_connectionStatus);
      return false;
    }
  }

  /// Helper to determine if a characteristic is writable
  bool _isWritableCharacteristic(BluetoothCharacteristic characteristic) {
    return characteristic.properties.write || 
           characteristic.properties.writeWithoutResponse;
  }

  /// Helper to determine if a characteristic is readable/notifyable
  bool _isReadableCharacteristic(BluetoothCharacteristic characteristic) {
    return characteristic.properties.read || 
           characteristic.properties.notify || 
           characteristic.properties.indicate;
  }

  /// Handle incoming data from the device
  void _handleIncomingData(List<int> data) {
    try {
      Uint8List uint8Data = Uint8List.fromList(data);
      ParsedMessage? message = CommunicationProtocol.parseReceivedData(uint8Data);
      
      if (message != null) {
        _messageStreamController!.add(message);
      } else {
        print("Failed to parse incoming data: ${utf8.decode(data.take(50).toList())}");
      }
    } catch (e) {
      print("Error handling incoming data: $e");
    }
  }

  /// Disconnect from the currently connected device
  Future<void> disconnectFromDevice() async {
    try {
      if (_connectedDevice != null) {
        await _connectedDevice!.disconnect();
        _connectedDevice = null;
      }
      
      _txCharacteristic = null;
      _rxCharacteristic = null;
      _connectionStatus = 'Disconnected';
      _connectionStatusController!.add(_connectionStatus);
    } catch (e) {
      print("Error during disconnection: $e");
    }
  }

  /// Check if we're currently connected to a device
  bool get isConnected => _connectedDevice?.isConnectedStream.value ?? false;

  /// Get the currently connected device
  BluetoothDevice? get connectedDevice => _connectedDevice;

  /// Discover services for the connected device
  Future<List<BluetoothService>> discoverServices() async {
    if (_connectedDevice == null) {
      throw Exception("No device connected");
    }
    
    return await _connectedDevice!.discoverServices();
  }

  /// Send a command using the communication protocol
  Future<void> sendCommand(String command, [Map<String, dynamic>? params]) async {
    if (!isConnected) {
      throw Exception("Not connected to any device");
    }

    try {
      // Create the command message using the protocol
      Uint8List encodedMessage = CommunicationProtocol.createCommandMessage(command, params);
      
      // Send using the appropriate characteristic
      if (_txCharacteristic != null) {
        await writeCharacteristic(_txCharacteristic!, encodedMessage, withResponse: true);
      } else {
        // If we don't have a dedicated TX characteristic, try to find one
        await _findAndSend(encodedMessage);
      }
    } catch (e) {
      print("Error sending command: $e");
      rethrow;
    }
  }

  /// Send raw data using the communication protocol
  Future<void> sendData(String dataType, dynamic data) async {
    if (!isConnected) {
      throw Exception("Not connected to any device");
    }

    try {
      // Create the data message using the protocol
      Uint8List encodedMessage = CommunicationProtocol.createDataMessage(dataType, data);
      
      // Send using the appropriate characteristic
      if (_txCharacteristic != null) {
        await writeCharacteristic(_txCharacteristic!, encodedMessage, withResponse: true);
      } else {
        // If we don't have a dedicated TX characteristic, try to find one
        await _findAndSend(encodedMessage);
      }
    } catch (e) {
      print("Error sending data: $e");
      rethrow;
    }
  }

  /// Find an appropriate characteristic and send data
  Future<void> _findAndSend(Uint8List data) async {
    if (_connectedDevice == null) {
      throw Exception("No device connected");
    }

    try {
      // Find the appropriate service and characteristic to send data
      List<BluetoothService> services = await discoverServices();
      
      // Look for a service that supports data transmission
      for (var service in services) {
        List<BluetoothCharacteristic> characteristics = service.characteristics;
        
        // Find a writable characteristic
        for (var characteristic in characteristics) {
          if (characteristic.properties.write || characteristic.properties.writeWithoutResponse) {
            await writeCharacteristic(characteristic, data, withResponse: true);
            // Cache this characteristic for future use
            _txCharacteristic = characteristic;
            return;
          }
        }
      }
      
      throw Exception("No writable characteristic found");
    } catch (e) {
      print("Error finding and sending: $e");
      rethrow;
    }
  }

  /// Read characteristic value
  Future<List<int>> readCharacteristic(BluetoothCharacteristic characteristic) async {
    try {
      return await characteristic.read();
    } catch (e) {
      print("Error reading characteristic: $e");
      rethrow;
    }
  }

  /// Write characteristic value
  Future<void> writeCharacteristic(
    BluetoothCharacteristic characteristic,
    List<int> value, {
    bool withResponse = false,
  }) async {
    try {
      await characteristic.write(value, withoutResponse: !withResponse);
    } catch (e) {
      print("Error writing characteristic: $e");
      rethrow;
    }
  }

  /// Clean up resources
  Future<void> dispose() async {
    try {
      await stopScanning();
      await disconnectFromDevice();
      
      await _adapterStateController?.close();
      await _scanResultsController?.close();
      await _messageStreamController?.close();
      await _connectionStatusController?.close();
    } catch (e) {
      print("Error disposing Bluetooth service: $e");
    }
  }
}