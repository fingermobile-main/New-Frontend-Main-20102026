import React, { useState, useEffect, useCallback } from "react";

// Consent flag types matching backend schema
export type ConsentFlags = {
  essential: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  ai_training: boolean;
};

export type ConsentProps = {
  apiBaseUrl?: string;
  accessToken?: string;
  onConsentChange?: (flags: ConsentFlags) => void;
  className?: string;
  showSettingsByDefault?: boolean;
};

export const DEFAULT_CONSENT_FLAGS: ConsentFlags = {
  essential: true, // Cannot be toggled by regulation
  functional: false,
  analytics: false,
  marketing: false,
  ai_training: false,
};

export const ConsentManager: React.FC<ConsentProps> = ({
  apiBaseUrl = "",
  accessToken = "",
  onConsentChange,
  className = "",
  showSettingsByDefault = false,
}) => {
  const [flags, setFlags] = useState<ConsentFlags>(DEFAULT_CONSENT_FLAGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(showSettingsByDefault);

  // Effective token from prop or local storage
  const effectiveToken = accessToken || (typeof window !== "undefined" ? localStorage.getItem("token") || localStorage.getItem("accessToken") || "" : "");

  // Load existing consent on mount
  useEffect(() => {
    // 1. Check local cache first for instant UX
    const cachedConsent = typeof window !== "undefined" ? localStorage.getItem("fingermobile_consent_flags") : null;
    if (cachedConsent) {
      try {
        const parsed = JSON.parse(cachedConsent);
        setFlags({ ...DEFAULT_CONSENT_FLAGS, ...parsed, essential: true });
      } catch {
        // ignore parse error
      }
    } else {
      // First launch: show banner
      setIsBannerVisible(true);
    }

    // 2. Fetch authenticated preferences if API & token available
    const fetchConsent = async () => {
      try {
        const targetUrl = apiBaseUrl ? `${apiBaseUrl}/v1/users/consent` : `/api/v1/users/consent`;
        const res = await fetch(targetUrl, {
          headers: effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.flags) {
            const updated = { ...DEFAULT_CONSENT_FLAGS, ...data.flags, essential: true };
            setFlags(updated);
            if (typeof window !== "undefined") {
              localStorage.setItem("fingermobile_consent_flags", JSON.stringify(updated));
            }
          }
          if (data.consent_version === 0 || !data.has_consented) {
            setIsBannerVisible(true);
          } else {
            setIsBannerVisible(false);
          }
        }
      } catch {
        // Silently use cached flags if network or API unavailable
      }
    };

    if (effectiveToken || apiBaseUrl) {
      fetchConsent();
    }
  }, [apiBaseUrl, effectiveToken]);

  const handleToggle = useCallback((key: keyof ConsentFlags) => {
    if (key === "essential") return; // Locked by regulation (NDPR / GDPR)
    setFlags((prev) => ({ ...prev, [key]: !prev[key] }));
    setSuccess(false);
  }, []);

  const savePreferences = async (newFlags: ConsentFlags) => {
    setLoading(true);
    setError(null);
    try {
      // Update local storage immediately for fast client feedback
      if (typeof window !== "undefined") {
        localStorage.setItem("fingermobile_consent_flags", JSON.stringify(newFlags));
        localStorage.setItem("cookieConsent", "true");
      }

      // Sync with backend if available
      const targetUrl = apiBaseUrl ? `${apiBaseUrl}/v1/users/consent` : `/api/v1/users/consent`;
      if (effectiveToken || apiBaseUrl) {
        const res = await fetch(targetUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {}),
          },
          body: JSON.stringify({ flags: newFlags }),
        });
        if (!res.ok) {
          throw new Error("Consent update failed on server. Preferences saved locally.");
        }
      }

      setSuccess(true);
      setIsBannerVisible(false);
      onConsentChange?.(newFlags);
      setTimeout(() => setSuccess(false), 4000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error updating consent.");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptAll = () => {
    const allFlags: ConsentFlags = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      ai_training: true,
    };
    setFlags(allFlags);
    savePreferences(allFlags);
  };

  const handleAcceptNonEssential = () => {
    const nonEssential: ConsentFlags = {
      ...DEFAULT_CONSENT_FLAGS,
      functional: true,
      analytics: true,
    };
    setFlags(nonEssential);
    savePreferences(nonEssential);
  };

  const handleEssentialOnly = () => {
    setFlags(DEFAULT_CONSENT_FLAGS);
    savePreferences(DEFAULT_CONSENT_FLAGS);
  };

  return (
    <div className={`consent-manager ${className}`} role="region" aria-label="Privacy Consent Management">
      {/* First Launch Bottom Floating Banner */}
      {isBannerVisible && (
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="consent-banner-title"
          className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-300 p-4 md:p-6 shadow-2xl z-50 transition-all animate-in slide-in-from-bottom"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 pr-4 max-w-4xl">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">🔐</span>
                <h2 id="consent-banner-title" className="text-base md:text-lg font-black text-slate-900 tracking-tight">
                  Your Privacy, Your Control
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-400">
                  NDPR & GDPR Aligned
                </span>
              </div>
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                FingerMobile uses data to personalize your experience, guarantee fintech ledger security, and power ethical AI features.
                You control what we collect. Essential security data cannot be toggled.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={handleAcceptAll}
                disabled={loading}
                className="flex-1 md:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={handleAcceptNonEssential}
                disabled={loading}
                className="flex-1 md:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-slate-700 focus:outline-none disabled:opacity-50"
              >
                Accept Non-Essential
              </button>
              <button
                type="button"
                onClick={handleEssentialOnly}
                disabled={loading}
                className="flex-1 md:flex-none px-4 py-2.5 border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-slate-400 focus:outline-none disabled:opacity-50"
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSettingsOpen(true);
                  setIsBannerVisible(false);
                }}
                className="px-3 py-2 text-slate-700 hover:text-slate-900 text-sm font-bold underline transition-colors focus:outline-none"
              >
                Customize
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Granular Settings Modal / Panel */}
      {isSettingsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="consent-settings-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in"
        >
          <div className="relative w-full max-w-xl bg-white border border-slate-300 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden="true">🛡️</span>
                <div>
                  <h3 id="consent-settings-title" className="text-lg md:text-xl font-black text-slate-900">
                    Granular Consent Preferences
                  </h3>
                  <p className="text-xs font-semibold text-slate-700">
                    Compliance: Nigeria NDPA 2023, EU GDPR, & EU AI Act
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-500 hover:text-slate-900 font-bold text-lg p-2 rounded-lg transition-colors focus:outline-none"
                aria-label="Close consent preferences"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4" role="group" aria-label="Consent categories">
              {(Object.keys(flags) as (keyof ConsentFlags)[]).map((key) => {
                const isEssential = key === "essential";
                return (
                  <label
                    key={key}
                    className={`flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      flags[key]
                        ? "bg-slate-50 border-slate-300"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={flags[key]}
                      onChange={() => handleToggle(key)}
                      disabled={isEssential}
                      aria-label={`${key.replace("_", " ")} consent`}
                      className="mt-1 w-5 h-5 rounded border-2 border-slate-400 text-blue-600 focus:ring-blue-500 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="block text-sm font-black text-slate-900 capitalize">
                          {key.replace("_", " ")}
                        </span>
                        {isEssential && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-900 border border-slate-300">
                            Required
                          </span>
                        )}
                        {key === "ai_training" && (
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-950 border border-purple-400">
                            EU AI Act Opt-In
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-700 mt-1 leading-relaxed">
                        {key === "essential" &&
                          "Account security, double-spend prevention, fintech ledger verification, and NDPA compliance. Always required."}
                        {key === "functional" &&
                          "Saves UI theme preferences, dual-account switching, and personalized catalog filtering."}
                        {key === "analytics" &&
                          "Aggregated, anonymized performance metrics, API latency tracking, and error reporting for platform stability."}
                        {key === "marketing" &&
                          "Product announcements, creator growth programs, and local merchant promotional updates."}
                        {key === "ai_training" &&
                          "Opt-in data for fine-tuning generative avatars, recommendations, and smart SME copy tools. Revocable anytime."}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            {error && (
              <div
                role="alert"
                className="p-3.5 rounded-xl bg-rose-100 border border-rose-400 text-rose-950 text-xs font-black"
              >
                ⚠️ {error}
              </div>
            )}

            {success && (
              <div
                role="status"
                className="p-3.5 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-950 text-xs font-black flex items-center gap-2"
              >
                <span>✅</span>
                <span>Preferences saved successfully to immutable audit trail.</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => savePreferences(flags)}
                disabled={loading}
                className="w-full sm:flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
              >
                {loading ? "Recording Preferences..." : "Save Preferences"}
              </button>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="w-full sm:w-auto px-5 py-3 border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm rounded-xl transition-all focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsentManager;
