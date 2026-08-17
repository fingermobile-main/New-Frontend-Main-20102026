import React, { useState, useEffect } from 'react';

const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = React.useState(false);

  React.useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex justify-between items-center z-50">
      <div className="text-sm">
        We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
      </div>
      <button
        onClick={handleAccept}
        className="bg-brand-blue hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-colors"
      >
        Accept
      </button>
    </div>
  );
};

export default CookieConsentBanner;
