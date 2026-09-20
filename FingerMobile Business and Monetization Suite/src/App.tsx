import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './providers/AppProvider'; // Assuming there's a global provider
import { router } from './app/AppRoutes'; // Import the configured router

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}