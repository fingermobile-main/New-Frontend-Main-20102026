import 'dart:io' show Platform;
import 'package:flutter/foundation.dart' show kIsWeb;

class PlatformOptimizationService {
  // Check if the app is running on Android
  static bool isAndroid() {
    if (kIsWeb) return false;
    return Platform.isAndroid;
  }

  // Check if the app is running on iOS
  static bool isIOS() {
    if (kIsWeb) return false;
    return Platform.isIOS;
  }

  // Get platform-specific configurations
  static Map<String, dynamic> getPlatformConfigurations() {
    if (kIsWeb) {
      return {
        'platform': 'web',
        'supportsBiometrics': false,
        'supportsNativeFeatures': false,
      };
    } else if (Platform.isAndroid) {
      return {
        'platform': 'android',
        'supportsBiometrics': true,
        'supportsNativeFeatures': true,
        'navigationBarColor': 'system',
      };
    } else if (Platform.isIOS) {
      return {
        'platform': 'ios',
        'supportsBiometrics': true,
        'supportsNativeFeatures': true,
        'navigationBarColor': 'default',
      };
    } else if (Platform.isWindows) {
      return {
        'platform': 'windows',
        'supportsBiometrics': false,
        'supportsNativeFeatures': false,
      };
    } else if (Platform.isMacOS) {
      return {
        'platform': 'macos',
        'supportsBiometrics': true,
        'supportsNativeFeatures': false,
      };
    } else if (Platform.isLinux) {
      return {
        'platform': 'linux',
        'supportsBiometrics': false,
        'supportsNativeFeatures': false,
      };
    } else {
      return {
        'platform': 'unknown',
        'supportsBiometrics': false,
        'supportsNativeFeatures': false,
      };
    }
  }

  // Apply platform-specific UI optimizations
  static void applyPlatformOptimizations() {
    final config = getPlatformConfigurations();
    
    // For Android, we might want to customize the status bar and navigation bar
    if (config['platform'] == 'android') {
      // TODO: Apply Android-specific optimizations
      // For example, setting status bar color, navigation bar color, etc.
    }
    
    // For iOS, we might want to follow iOS design guidelines
    if (config['platform'] == 'ios') {
      // TODO: Apply iOS-specific optimizations
      // For example, using appropriate UI elements, navigation patterns, etc.
    }
  }

  // Get platform-specific feature availability
  static List<String> getAvailablePlatformFeatures() {
    final config = getPlatformConfigurations();
    final features = <String>[];
    
    if (config['supportsBiometrics'] == true) {
      features.addAll(['fingerprint', 'face_recognition']);
    }
    
    if (config['platform'] == 'android') {
      features.addAll(['notifications', 'widgets', 'quick_actions']);
    }
    
    if (config['platform'] == 'ios') {
      features.addAll(['notifications', 'siri_shortcuts']);
    }
    
    return features;
  }
}