# FingerMobile Mobile Applications

This directory contains the mobile applications for the FingerMobile Protocol platform.

## Overview

The mobile application ecosystem includes:

- **fingermobile_app**: The main Flutter-based mobile application for iOS and Android
- **fingermobile_react_native**: Legacy React Native components (if applicable)
- **temp_flutter_project**: Temporary project directory for testing

## Main Flutter Application

The primary mobile application is built using Flutter for cross-platform compatibility.

### Features

- Complete social media experience
- User authentication and profiles
- Content creation and sharing
- Real-time messaging
- Media management
- Monetization tools
- Advanced privacy controls
- Gamification elements

### Getting Started

1. Navigate to the Flutter app directory:
   ```bash
   cd fingermobile_app
   ```

2. Install dependencies:
   ```bash
   flutter pub get
   ```

3. Run the application:
   ```bash
   flutter run
   ```

### Backend Requirements

The mobile app requires the FingerMobile backend to be running. Ensure the backend server is accessible at the configured URL (default: http://localhost:5001/api).

For backend setup instructions, see the [backend README](../backend/README.md).

## Architecture

The mobile applications follow modern mobile development practices:

- **State Management**: Using Provider pattern
- **API Integration**: Clean separation of API services
- **Security**: Secure token storage and encrypted communications
- **Offline Support**: Local caching where appropriate
- **Media Handling**: Optimized for mobile networks

## Deployment

For production deployment, follow the platform-specific guidelines:

- [Android Deployment Guide](https://flutter.dev/docs/deployment/android)
- [iOS Deployment Guide](https://flutter.dev/docs/deployment/ios)

## Development Guidelines

- Follow Flutter's style guide and best practices
- Use meaningful commit messages
- Write unit and integration tests for new features
- Maintain backward compatibility where possible
- Keep dependencies updated but tested

## Contributing

See the individual application README files for contribution guidelines.