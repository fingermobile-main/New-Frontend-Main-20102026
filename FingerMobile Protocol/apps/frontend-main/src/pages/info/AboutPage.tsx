import React, {} from 'react';

const AboutPage = () => {
  return (
    <div className="w-full max-w-full overflow-x-hidden text-slate-900 pb-28 md:pb-12 max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-black text-slate-900">About FingerMobile Protocol</h1>
      <p className="text-slate-700 font-medium leading-relaxed">
        FingerMobile Protocol is an advanced communication platform designed to facilitate seamless
        interactions between various systems and users. Our platform provides a robust infrastructure
        for handling diverse communication needs.
      </p>
      <section className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
        <p className="text-slate-700 font-medium leading-relaxed">
          We aim to simplify complex communication protocols and make them accessible to businesses
          and individuals alike, providing a secure and reliable channel for information exchange.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900">Our Vision</h2>
        <p className="text-slate-700 font-medium leading-relaxed">
          To become the leading platform for protocol-based communications, enabling seamless
          connectivity across different technologies and platforms worldwide.
        </p>
      </section>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2 px-3 flex items-center justify-around gap-1 shadow-lg md:hidden">
        <a
          href="/"
          aria-label="Home"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">🏠</span>
          <span>Home</span>
        </a>
        <a
          href="/legal"
          aria-label="Legal Center"
          className="min-h-[44px] min-w-[44px] px-2 py-1 flex flex-col items-center justify-center text-xs font-semibold text-slate-800 hover:text-blue-600"
        >
          <span className="text-base">⚖️</span>
          <span>Legal</span>
        </a>
        <button
          onClick={() => window.location.reload()}
          aria-label="Reload About"
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

export default AboutPage;
