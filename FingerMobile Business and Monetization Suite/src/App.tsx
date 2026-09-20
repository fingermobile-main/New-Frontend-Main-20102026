import { AppProvider } from './providers/AppProvider'; // Assuming there's a global provider
import { router } from './app/AppRoutes'; // Import the configured router
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}

export default App;