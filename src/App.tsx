import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/AppRoutes';
import { GlobalProviders } from './components/GlobalProviders';
import UniversalSearchModal from './components/common/UniversalSearchModal';
import { VoiceLineReactionOverlay } from './components/shared/VoiceLineReactionOverlay';

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
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-400 bg-zinc-900/90 border border-emerald-500/30 rounded-full shadow-lg backdrop-blur hover:bg-zinc-800 hover:border-emerald-400 transition-all focus:outline-none"
          title="Search Platform Screens & Dashboards (Cmd+K / Ctrl+K)"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Search (Cmd+K)</span>
        </button>
        <RouterProvider router={router} />
      </div>
    </GlobalProviders>
  );
}

export default App;