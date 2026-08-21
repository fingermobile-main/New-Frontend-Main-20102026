/**
 * Cross-Platform Configuration for FingerMobile Ecosystem
 * Ensures parity across FingerMobile-main (Web), Mobile (Android/iOS), and Desktop (Apple/Windows)
 */

const platformConfig = {
  // Platform identifiers,
PLATFORMS: {WEB: 'web',
  MOBILE_ANDROID: 'mobile_android',
  MOBILE_IOS: 'mobile_ios',
  DESKTOP_MAC: 'desktop_mac',
  DESKTOP_WINDOWS: 'desktop_windows'
  },

  // Common API endpoints
  API_BASE_URLS: {
    web: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
    mobile_android: process.env.MOBILE_ANDROID_API_URL || 'http://10.0.2.2:3001/api', // Android emulator
    mobile_ios: process.env.MOBILE_IOS_API_URL || 'http://localhost:3001/api',     // iOS simulator uses localhost
    desktop_mac: process.env.DESKTOP_MAC_API_URL || 'http://localhost:3001/api',
    desktop_windows: process.env.DESKTOP_WINDOWS_API_URL || 'http://localhost:3001/api'
  },

  // Feature flags for cross-platform compatibility
FEATURES: {
    // Gems system available on all platforms,
GEMS_ENABLED: true,
    
    // Hallmarks system available on all platforms,
HALLMARKS_ENABLED: true,
    
    // Advanced cognitive load detection (mobile may have limitations),
COGNITIVE_LOAD_DETECTION: {web: true,
  mobile_android: true,
  mobile_ios: true,
  desktop_mac: true,
  desktop_windows: true
    },
    
    // P2P functionality (WebRTC support varies),
P2P_ENABLED: {web: true,
  mobile_android: true,  // Supported via WebRTC in modern browsers,
  mobile_ios: true,      // Supported via WebRTC in Safari 17+,
  desktop_mac: true,
  desktop_windows: true
    },
    
    // Biometric authentication
BIOMETRIC_AUTH: {web: false,           // Limited support
  mobile_android: true, // Fingerprint, face recognition
  mobile_ios: true,     // Touch ID, Face ID
  desktop_mac: true,    // Touch ID, Face ID on compatible devices
  desktop_windows: true // Windows Hello
    },
    
    // Offline capabilities,
OFFLINE_MODE: {web: true,            // Service workers,
  mobile_android: true, // Native caching,
  mobile_ios: true,     // Native caching,
  desktop_mac: true,    // Electron-based caching,
  desktop_windows: true // Electron-based caching
    }
  },

  // Performance thresholds per platform,
PERFORMANCE: {
    // Cognitive load thresholds (different per platform),
COGNITIVE_LOAD_THRESHOLDS: {
  web: {
    low: 30,
    high: 70
  },
  mobile_android: {
    low: 25,
    high: 60
  },  // Mobile users may have lower tolerance
  mobile_ios: {
    low: 25,
    high: 60
  },
  desktop_mac: {
    low: 35,
    high: 75
  },     // Desktop users may multitask more
  desktop_windows: {
    low: 35,
    high: 75
  }
    },
    
    // Animation preferences,
ANIMATION_PREFERENCES: {web: 'auto',              // Respect user's system preference,
  mobile_android: 'reduce', // Often prefer reduced motion,
  mobile_ios: 'reduce',
  desktop_mac: 'auto',
  desktop_windows: 'auto'
    }
  },

  // Notification settings by platform,
NOTIFICATIONS: {
    // Notification timing preferences per platform
    TIMING: {
      web: {
        quietHoursStart: '22:00',
        quietHoursEnd: '07:00',
        maxPerHour: 10
      },
      mobile_android: {
        quietHoursStart: '21:00',
        quietHoursEnd: '06:00',  // Earlier bedtime for mobile
        maxPerHour: 5
      },
      mobile_ios: {
        quietHoursStart: '21:00',
        quietHoursEnd: '06:00',
        maxPerHour: 5
      },
      desktop_mac: {
        quietHoursStart: '23:00',
        quietHoursEnd: '07:00',  // Later bedtime for desktop
        maxPerHour: 8
      },
      desktop_windows: {
        quietHoursStart: '23:00',
        quietHoursEnd: '07:00',
        maxPerHour: 8
      }
    },
    
    // Notification types supported per platform,
SUPPORTED_TYPES: {web: ['push', 'email', 'in_app'],
  mobile_android: ['push', 'local', 'in_app'],
  mobile_ios: ['push', 'local', 'in_app'],
  desktop_mac: ['push', 'email', 'in_app'],
  desktop_windows: ['push', 'email', 'in_app']
    }
  },

  // UI/UX considerations per platform,
UI_UX: {
    // Haptic feedback availability,
HAPTIC_FEEDBACK: {web: false,
  mobile_android: true,
  mobile_ios: true,
  desktop_mac: false,
  desktop_windows: false
    },
    
    // Touch gestures support,
TOUCH_GESTURES: {web: 'limited',         // Mouse/touchpad only,
  mobile_android: 'full', // Touchscreen with gestures,
  mobile_ios: 'full',     // Touchscreen with iOS-specific gestures,
  desktop_mac: 'trackpad', // Trackpad gestures,
  desktop_windows: 'touchscreen' // Touchscreen if available
    }
  },

  // Platform-specific Gems calculation adjustments,
GEMS_CALCULATION: {
    // Adjustment factors for different platforms (to prevent abuse),
PROOF_OF_PLAY_ADJUSTMENT: {web: 1.0,              // Base value,
  mobile_android: 1.0,   // Mobile listening counts the same,
  mobile_ios: 1.0,
  desktop_mac: 0.9,      // Slightly reduced for desktop (background listening),
  desktop_windows: 0.9   // Slightly reduced for desktop
    },
    
    // Thresholds for anti-bot measures
ANTI_BOT_THRESHOLDS: {web: {
  maxGemsPerHour: 50,
  maxConcurrentSessions: 3
      },
mobile_android: {maxGemsPerHour: 30,  // Usually more engaged but shorter sessions
  maxConcurrentSessions: 1
      },
mobile_ios: {maxGemsPerHour: 30,
  maxConcurrentSessions: 1
      },
desktop_mac: {maxGemsPerHour: 40,  // Longer sessions but potentially background
  maxConcurrentSessions: 2

      },
desktop_windows: {maxGemsPerHour: 40,
  maxConcurrentSessions: 2
      }
    }
  },

  // Datasynchronization settings,
SYNC_SETTINGS: {
    // How frequently to sync data per platform,
SYNC_INTERVAL: {web: 30000,            // Every 30 seconds,
  mobile_android: 60000, // Every minute (to preserve battery),
  mobile_ios: 60000,
  desktop_mac: 30000,    // Similar to web,
  desktop_windows: 30000
    },
    
    // What to sync per platform,
SYNC_DATA_TYPES: {web: ['user_profile', 'gems', 'hallmarks', 'preferences', 'activity_log'],
  mobile_android: ['user_profile', 'gems', 'hallmarks', 'preferences', 'offline_cache'],
  mobile_ios: ['user_profile', 'gems', 'hallmarks', 'preferences', 'offline_cache'],
  desktop_mac: ['user_profile', 'gems', 'hallmarks', 'preferences', 'activity_log'],
  desktop_windows: ['user_profile', 'gems', 'hallmarks', 'preferences', 'activity_log']
    }
  }
};

module.exports = platformConfig;