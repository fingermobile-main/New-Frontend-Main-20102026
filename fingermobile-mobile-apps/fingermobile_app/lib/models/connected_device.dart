class ConnectedDevice {
  final String id;
  final String deviceName;
  final String lastLogin;
  final String location;

  ConnectedDevice({
    required this.id,
    required this.deviceName,
    required this.lastLogin,
    required this.location,
  });

  factory ConnectedDevice.fromJson(Map<String, dynamic> json) {
    return ConnectedDevice(
      id: json['id'],
      deviceName: json['deviceName'],
      lastLogin: json['lastLogin'],
      location: json['location'],
    );
  }
}