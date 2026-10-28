import { Link } from 'react-router-dom';
import React, {} from 'react';


const NotFoundPage = () => {
  return (
    <div className="w-full max-w-full overflow-x-hidden text-slate-900 pb-28 md:pb-12 min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-black text-slate-900 mb-2">404 - Page Not Found</h1>
      <p className="text-slate-700 font-medium mb-6">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-sm transition">
        Go back to Home
      </Link>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
        <Link
          to="/"
          aria-label="Home"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">🏠</span>
          <span>Home</span>
        </Link>
        <button
          onClick={() => window.history.back()}
          aria-label="Go Back"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">⬅️</span>
          <span>Back</span>
        </button>
        <button
          onClick={() => window.location.reload()}
          aria-label="Reload Page"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">🔄</span>
          <span>Sync</span>
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to Top"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">⬆️</span>
          <span>Top</span>
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
