# FingerMobile Mobile Application

An enterprise-grade social media platform built with Flutter for cross-platform mobile development.

## Overview

The FingerMobile mobile application is a comprehensive social media platform featuring:
- User authentication and profiles
- Content creation and sharing
- Social networking capabilities
- Real-time messaging
- Media gallery and sharing
- Monetization features
- Advanced privacy controls
- Gamification elements

## Prerequisites

- Flutter SDK (3.x or higher)
- Dart SDK (2.17 or higher)
- Android Studio / Xcode for platform-specific builds
- Access to the FingerMobile backend server

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd apps/fingermobile-mobile-apps/fingermobile_app
```

### 2. Install Dependencies

```bash
flutter pub get
```

### 3. Configure Backend Connection

Update the backend URL in `lib/services/api_service.dart`:

```dart
static const String baseUrl = 'http://your-backend-server:5001/api';
```

By default, the app connects to `http://localhost:5001/api`.

### 4. Run the Application

#### For Development:

```bash
# For Android
flutter run

# For iOS
flutter run -d ios
```

#### Building for Production:

```bash
# Build APK for Android
flutter build apk --release

# Build IPA for iOS
flutter build ios --release
```

## Key Features

### Authentication
- Login and registration screens
- Secure token storage
- Auto-login with stored credentials

### Core Functionality
- Profile management
- Content creation and sharing
- Social feeds
- Messaging system
- Notifications
- Media gallery
- Search functionality

### Advanced Features
- Wallet and monetization
- Analytics dashboard
- Groups and events
- Content moderation
- Gamification (achievements, badges)
- Parental controls
- Accessibility settings

## Architecture

The app follows a clean architecture pattern with:

- **UI Layer**: Presentational widgets organized in the `lib/screens` directory
- **Business Logic**: Implemented in providers under `lib/providers`
- **Data Layer**: API services and local storage in `lib/services`
- **Models**: Data models in `lib/models`

## API Integration

The app communicates with the backend via REST APIs located at `/api` endpoint. Key services include:

- Authentication (`/api/auth`)
- User management (`/api/members`)
- Content management (`/api/posts`, `/api/content`)
- Social features (`/api/messages`, `/api/notifications`)
- Media handling (`/api/media`, `/api/uploads`)

## Troubleshooting

### Common Issues

1. **Backend Connection Issues**:
   - Ensure the backend server is running on the configured port
   - Check firewall settings if connecting to remote server
   - Verify the correct API endpoint in `api_service.dart`

2. **Build Issues**:
   - Run `flutter clean` to clear build artifacts
   - Update dependencies with `flutter pub get`
   - Check platform-specific requirements (iOS/Android)

3. **Performance Issues**:
   - Monitor memory usage during media-heavy operations
   - Implement proper image caching strategies
   - Optimize database queries for large datasets

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make changes and commit (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.