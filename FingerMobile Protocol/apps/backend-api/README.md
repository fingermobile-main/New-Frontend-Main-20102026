# Lush Pressies Backend API

The Lush Pressies backend is a robust Node.js API that powers the dating application with advanced matching algorithms, privacy controls, and real-time communication features.

## Features

- **Advanced Matching Algorithms**: Sophisticated matching based on personality, interests, and behavior
- **Privacy Controls**: PIN exchange, private content sharing, and incognito mode
- **EscrowLapidaire Gifting**: Secure gift exchange system
- **Sovereign Member Privacy**: Granular privacy settings and controls
- **Incognito Engine**: Advanced anonymity features
- **Real-time Chat**: WebSocket-based messaging system
- **Geolocation Services**: Find matches nearby with PostGIS integration
- **Gamification**: Points, achievements, and leaderboards
- **Monetization**: Subscription management and in-app purchases
- **Analytics**: Comprehensive user behavior tracking and insights
- **Trend Analysis**: Trending topics, users, and content
- **Personality AI**: Behavioral analysis and compatibility scoring

## Tech Stack

- Node.js with Express
- PostgreSQL with PostGIS for geospatial queries
- Redis for caching and session storage
- Socket.io for real-time communication
- Stripe for payment processing
- JWT for authentication
- BCrypt for password hashing
- Multer for file uploads
- Joi for input validation
- AWS SDK for cloud storage
- Firebase Admin for push notifications

## Installation

1. Clone the repository:
```bash
git clone https://github.com/lush-pressies/backend-api.git
cd backend-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the required environment variables (see `.env.example`).

4. Set up the database:
```bash
# Run the schema creation script
psql -U postgres -d lush_pressies_db -f src/config/schema.sql
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`.

## Scripts

- `npm start`: Starts the production server
- `npm run dev`: Starts the development server with nodemon
- `npm test`: Runs tests
- `npm run seed`: Seeds the database with sample data
- `npm run migrate`: Runs database migrations
- `npm run lint`: Lints the codebase
- `npm run format`: Formats the codebase

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login to the application
- `POST /api/auth/logout` - Logout from the application
- `POST /api/auth/refresh` - Refresh authentication token

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/search` - Search for users
- `GET /api/users/:userId` - Get specific user

### Matching
- `GET /api/match` - Get user's matches
- `DELETE /api/match/:matchedUserId` - Unmatch with a user
- `GET /api/match/stats` - Get match statistics
- `GET /api/match/potential` - Get potential matches

### Chat
- `POST /api/chat/conversations` - Create a new conversation
- `POST /api/chat/messages` - Send a message
- `GET /api/chat/conversations/:conversationId/messages` - Get conversation history
- `GET /api/chat/conversations` - Get user's conversations

### Swiping
- `POST /api/swipe/swipe` - Process a swipe (like or pass)
- `GET /api/swipe/queue` - Get discovery queue
- `GET /api/swipe/stats` - Get user swipe statistics
- `POST /api/swipe/rewind` - Rewind last swipe
- `POST /api/swipe/super-like` - Perform super like

### Verification
- `POST /api/verification` - Submit verification documents
- `GET /api/verification/status` - Get user's verification status
- `POST /api/verification/phone/initiate` - Initiate phone verification
- `POST /api/verification/phone/verify` - Verify phone number with code

### Subscriptions
- `GET /api/subscription/plans` - Get available subscription plans
- `POST /api/subscription` - Subscribe user to a plan
- `GET /api/subscription` - Get user's subscription details
- `DELETE /api/subscription` - Cancel user's subscription

### Monetization
- `GET /api/monetization/products` - Get available products for purchase
- `POST /api/monetization/purchase` - Process a product purchase
- `POST /api/monetization/gift/send` - Send a gift to another user
- `GET /api/monetization/credits` - Get user's credit balance

### Analytics
- `POST /api/analytics/events` - Track a user event
- `GET /api/analytics/user` - Get user analytics
- `GET /api/analytics/app` - Get app analytics overview
- `GET /api/analytics/retention` - Get user retention analytics

### Trends
- `GET /api/trends/topics` - Get trending topics
- `GET /api/trends/users` - Get trending users
- `GET /api/trends/content` - Get trending content
- `GET /api/trends/personalized` - Get personalized trends for a user

### Geolocation
- `POST /api/geo/location` - Update user's location
- `GET /api/geo/nearby` - Get nearby users
- `GET /api/geo/preferences` - Get user's geo preferences
- `POST /api/geo/recommendations` - Get location-based recommendations

### Privacy
- `POST /api/privacy/content/:contentType/:contentId/check-view` - Check if user has permission to view specific content
- `POST /api/privacy/pin/verify` - Verify PIN for content access
- `POST /api/privacy/incognito/activate` - Activate incognito mode
- `GET /api/privacy/dashboard` - Get privacy sovereignty dashboard data

## Environment Variables

- `DB_USER`: PostgreSQL database user
- `DB_HOST`: PostgreSQL database host
- `DB_NAME`: PostgreSQL database name
- `DB_PASSWORD`: PostgreSQL database password
- `DB_PORT`: PostgreSQL database port
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: Expiration time for JWT tokens
- `STRIPE_SECRET_KEY`: Stripe secret key for payments
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `EMAIL_SERVICE_API_KEY`: API key for email service
- `PORT`: Port to run the server on
- `NODE_ENV`: Environment (development/production)
- `FRONTEND_URL`: URL of the frontend application
- `CORS_ORIGIN`: Allowed origins for CORS
- `MAPBOX_ACCESS_TOKEN`: Mapbox access token for geolocation

## Database Schema

The application uses PostgreSQL with PostGIS for geospatial queries. The schema includes tables for users, matches, messages, swipes, verifications, subscriptions, and more. See `src/config/schema.sql` for the full schema.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.