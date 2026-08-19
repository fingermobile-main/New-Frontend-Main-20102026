class DeploymentConfig {
  final String environment;
  final String apiUrl;
  final String version;
  final bool enableDebugging;
  final List<String> features;

  DeploymentConfig({
    required this.environment,
    required this.apiUrl,
    required this.version,
    required this.enableDebugging,
    required this.features,
  });

  factory DeploymentConfig.dev() {
    return DeploymentConfig(
      environment: 'development',
      apiUrl: 'http://localhost:3001/api',  // Use local backend for development
      version: '1.0.0-dev',
      enableDebugging: true,
      features: ['all'],
    );
  }

  factory DeploymentConfig.staging() {
    return DeploymentConfig(
      environment: 'staging',
      apiUrl: 'https://staging-api.fingermobile.com',
      version: '1.0.0-staging',
      enableDebugging: false,
      features: ['all'],
    );
  }

  factory DeploymentConfig.production() {
    return DeploymentConfig(
      environment: 'production',
      apiUrl: 'https://api.fingermobile.com',
      version: '1.0.0',
      enableDebugging: false,
      features: ['all'],
    );
  }
}

class DeploymentService {
  static DeploymentConfig getCurrentConfig() {
    // In a real app, this would be determined by build flavors or environment variables
    // For now, we'll default to production
    const environment = String.fromEnvironment('APP_ENVIRONMENT', defaultValue: 'production');
    
    switch (environment) {
      case 'development':
        return DeploymentConfig.dev();
      case 'staging':
        return DeploymentConfig.staging();
      case 'production':
      default:
        return DeploymentConfig.production();
    }
  }

  // Get app store deployment configuration
  static Map<String, dynamic> getAppStoreConfig() {
    return {
      'android': {
        'packageName': 'com.fingermobile.app',
        'versionCode': 1,
        'versionName': '1.0.0',
        'minSdkVersion': 21,
        'targetSdkVersion': 33,
      },
      'ios': {
        'bundleId': 'com.fingermobile.app',
        'version': '1.0.0',
        'buildNumber': 1,
        'deploymentTarget': '12.0',
      },
    };
  }

  // Validate deployment configuration
  static bool validateDeploymentConfig(DeploymentConfig config) {
    // Check that required fields are not empty
    if (config.environment.isEmpty) return false;
    if (config.apiUrl.isEmpty) return false;
    if (config.version.isEmpty) return false;
    
    // Check that API URL is valid
    if (!config.apiUrl.startsWith('http')) return false;
    
    return true;
  }
}