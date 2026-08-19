import 'dart:convert';
import 'dart:typed_data';

/// Defines the communication protocol for exchanging data with external devices
class CommunicationProtocol {
  // Message types
  static const int MSG_TYPE_COMMAND = 0x01;
  static const int MSG_TYPE_DATA = 0x02;
  static const int MSG_TYPE_RESPONSE = 0x03;
  static const int MSG_TYPE_ERROR = 0xFF;

  /// Encodes a message to be sent over Bluetooth
  static Uint8List encodeMessage(int type, String command, [dynamic payload]) {
    // Create a map representing the message structure
    Map<String, dynamic> message = {
      'type': type,
      'command': command,
      'timestamp': DateTime.now().millisecondsSinceEpoch,
      'payload': payload ?? {},
      'checksum': _calculateChecksum(type, command, payload),
    };

    // Convert to JSON string and then to UTF8 bytes
    String jsonString = jsonEncode(message);
    return Uint8List.fromList(utf8.encode(jsonString));
  }

  /// Calculates a simple checksum for message integrity
  static String _calculateChecksum(int type, String command, dynamic payload) {
    String data = '$type$command${jsonEncode(payload)}';
    int sum = 0;
    for (int i = 0; i < data.length; i++) {
      sum += data.codeUnitAt(i);
    }
    return sum.toRadixString(16);
  }

  /// Validates message integrity using checksum
  static bool _validateChecksum(Map<String, dynamic> message) {
    if (!message.containsKey('checksum')) {
      print('Missing checksum in message');
      return false;
    }

    String expectedChecksum = message['checksum'];
    // Temporarily remove checksum for validation
    dynamic payload = message['payload'];
    String calculatedChecksum = _calculateChecksum(
      message['type'],
      message['command'],
      payload,
    );

    bool isValid = expectedChecksum == calculatedChecksum;
    if (!isValid) {
      print('Checksum mismatch: expected $expectedChecksum, got $calculatedChecksum');
    }
    return isValid;
  }

  /// Decodes a received message from Bluetooth
  static Map<String, dynamic>? decodeMessage(Uint8List data) {
    try {
      // Convert bytes to string and parse as JSON
      String jsonString = utf8.decode(data);
      Map<String, dynamic> message = jsonDecode(jsonString);

      // Validate message structure
      if (!message.containsKey('type') || !message.containsKey('command')) {
        print('Invalid message format: missing type or command');
        return null;
      }

      // Validate checksum
      if (!_validateChecksum(message)) {
        print('Message checksum validation failed');
        return null;
      }

      return message;
    } catch (e) {
      print('Error decoding message: $e');
      return null;
    }
  }

  /// Creates a command message
  static Uint8List createCommandMessage(String command, [Map<String, dynamic>? params]) {
    return encodeMessage(MSG_TYPE_COMMAND, command, params);
  }

  /// Creates a data message
  static Uint8List createDataMessage(String dataType, dynamic data) {
    return encodeMessage(MSG_TYPE_DATA, dataType, data);
  }

  /// Creates a response message
  static Uint8List createResponseMessage(String command, dynamic result) {
    return encodeMessage(MSG_TYPE_RESPONSE, command, result);
  }

  /// Creates an error message
  static Uint8List createErrorMessage(String command, String error) {
    return encodeMessage(MSG_TYPE_ERROR, command, {'error': error});
  }

  /// Parse a received message and extract its components
  static ParsedMessage? parseReceivedData(Uint8List data) {
    Map<String, dynamic>? message = decodeMessage(data);
    
    if (message == null) {
      return null;
    }

    return ParsedMessage(
      type: message['type'],
      command: message['command'],
      timestamp: DateTime.fromMillisecondsSinceEpoch(message['timestamp'] ?? DateTime.now().millisecondsSinceEpoch),
      payload: message['payload'] ?? {},
    );
  }
}

/// Represents a parsed message with its components
class ParsedMessage {
  final int type;
  final String command;
  final DateTime timestamp;
  final dynamic payload;

  ParsedMessage({
    required this.type,
    required this.command,
    required this.timestamp,
    this.payload,
  });

  @override
  String toString() {
    return 'ParsedMessage{type: $type, command: $command, timestamp: $timestamp, payload: $payload}';
  }
}