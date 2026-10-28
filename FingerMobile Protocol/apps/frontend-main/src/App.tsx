import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/AppRoutes';
import { GlobalProviders } from './components/GlobalProviders';
import UniversalSearchModal from './components/common/UniversalSearchModal';
import { VoiceLineReactionOverlay } from './components/shared/VoiceLineReactionOverlay';
import ConsentManager from './components/ConsentManager';

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    const handleOpenSearch = () => setIsSearchOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-universal-search', handleOpenSearch);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-universal-search', handleOpenSearch);
    };
  }, []);

  return (
    <GlobalProviders>
      <div className="App relative min-h-screen">
        <VoiceLineReactionOverlay />
        <UniversalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <ConsentManager />
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </div>
    </GlobalProviders>
  );
}

export default App;