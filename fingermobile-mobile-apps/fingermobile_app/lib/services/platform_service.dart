class PlatformConfig {
  final String id;
  final String name;
  final String baseUrl;
  final String primaryColor;
  final List<String> features;

  PlatformConfig({
    required this.id,
    required this.name,
    required this.baseUrl,
    required this.primaryColor,
    required this.features,
  });
}

class PlatformService {
  static List<PlatformConfig> getAvailablePlatforms() {
    return [
      PlatformConfig(
        id: 'main',
        name: 'FingerMobile Main',
        baseUrl: 'http://localhost:3001/api',  // Local backend for development
        primaryColor: '#2196f3',
        features: ['social_networking', 'content_creation', 'wallet', 'fic_tokens', 'permanence', 'analytics'],
      ),
      PlatformConfig(
        id: 'beatwavedemo',
        name: 'Beatwave Demo',
        baseUrl: 'https://beatwavedemo.fingermobile.com',
        primaryColor: '#9c27b0',
        features: ['music_streaming', 'playlists', 'recommendations'],
      ),
      PlatformConfig(
        id: 'dancia4tv',
        name: 'Dancia 4Tv',
        baseUrl: 'https://dancia4tv.fingermobile.com',
        primaryColor: '#f44336',
        features: ['video_streaming', 'live_tv', 'on_demand'],
      ),
      PlatformConfig(
        id: 'fingerlux',
        name: 'FingerLux',
        baseUrl: 'https://fingerlux.fingermobile.com',
        primaryColor: '#2196f3',
        features: ['premium_content', 'exclusive_media', 'vip_access'],
      ),
      PlatformConfig(
        id: 'fingerwars',
        name: 'FingerWars',
        baseUrl: 'https://fingerwars.fingermobile.com',
        primaryColor: '#ff9800',
        features: ['gaming', 'multiplayer', 'tournaments'],
      ),
      PlatformConfig(
        id: 'lushpressies',
        name: 'Lush Pressies',
        baseUrl: 'https://lushpressies.fingermobile.com',
        primaryColor: '#4caf50',
        features: ['marketplace', 'gifts', 'ecommerce'],
      ),
      PlatformConfig(
        id: 'camus',
        name: 'CAMUS',
        baseUrl: 'https://camus.fingermobile.com',
        primaryColor: '#3f51b5',
        features: ['education', 'courses', 'certifications'],
      ),
      PlatformConfig(
        id: 'elib',
        name: 'E-Library',
        baseUrl: 'https://elib.fingermobile.com',
        primaryColor: '#009688',
        features: ['books', 'documents', 'research'],
      ),
      PlatformConfig(
        id: 'elearning',
        name: 'E-Learning',
        baseUrl: 'https://elearning.fingermobile.com',
        primaryColor: '#00bcd4',
        features: ['courses', 'quizzes', 'progress_tracking'],
      ),
      PlatformConfig(
        id: 'nysc',
        name: 'NYSC',
        baseUrl: 'https://nysc.fingermobile.com',
        primaryColor: '#cddc39',
        features: ['resources', 'information', 'community'],
      ),
    ];
  }

  static PlatformConfig? getPlatformById(String id) {
    final platforms = getAvailablePlatforms();
    try {
      return platforms.firstWhere((platform) => platform.id == id);
    } catch (e) {
      return null;
    }
  }
}