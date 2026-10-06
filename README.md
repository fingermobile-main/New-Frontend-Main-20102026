# Lush Pressies Frontend Application

The Lush Pressies frontend is a modern, responsive dating application built with React and TypeScript. It features a LinkedIn-style 3-column layout, advanced privacy controls, and sophisticated matching algorithms.

## Features

- **LinkedIn-style 3-column layout**: Clean and professional interface
- **Advanced Privacy Controls**: PIN exchange, private content sharing, and incognito mode
- **Escrow Icebreaker Gifting**: Secure gift exchange system
- **Sovereign Member Privacy**: Granular privacy settings and controls
- **Incognito Engine**: Advanced anonymity features
- **Real-time Chat**: With typing indicators and read receipts
- **Swipe Interface**: Intuitive card-based matching
- **Gamification**: Points, achievements, and leaderboards
- **Geolocation Services**: Find matches nearby
- **Video/Audio Calls**: Integrated communication features

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Headless UI for accessible components
- Heroicons for SVG icons
- Socket.io-client for real-time communication
- Recharts for data visualization
- Framer Motion for animations

## Installation

1. Clone the repository:
```bash
git clone https://github.com/lush-pressies/frontend.git
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_SOCKET_URL=http://localhost:3001
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Scripts

- `npm start`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm run eject`: Ejects from Create React App (irreversible)
- `npm run lint`: Lints the codebase
- `npm run format`: Formats the codebase

## Project Structure

```
src/
├── components/           # Reusable UI components
├── pages/               # Page-level components
├── layouts/             # Layout components
├── hooks/               # Custom React hooks
├── contexts/            # React Context providers
├── utils/               # Utility functions
├── services/            # API service functions
├── styles/              # Global styles and CSS modules
└── types/               # TypeScript type definitions
```

## Environment Variables

- `REACT_APP_API_URL`: The URL of the backend API
- `REACT_APP_SOCKET_URL`: The URL of the Socket.io server
- `REACT_APP_MAPBOX_TOKEN`: Mapbox access token for maps

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.