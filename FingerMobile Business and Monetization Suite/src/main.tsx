/// <reference lib="dom" />
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './index.css';

// Create root container
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Temporarily comment out performance reporting
// reportWebVitals();