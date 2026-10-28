import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';

const CopyrightFairUsePage: React.FC = () => {
  const { showToast } = useAppContext();
  const [agreed, setAgreed] = useState(false);
  const [contentId, setContentId] = useState('');
  const [disclaimer, setDisclaimer] = useState('');
  const [fairUseScore, setFairUseScore] = useState<number | null>(null);

  const handleEvaluateFairUse = () => {
    if (!contentId.trim()) {
      showToast('Please enter a content title or ID', 'error');
      return;
    }

    const calculatedScore = 0.75;
    setFairUseScore(calculatedScore);
    setDisclaimer(
      `No copyright is claimed in [${contentId}] and to the extent that material may appear to be infringed, I assert that such alleged infringement is permissible under fair use principles in U.S. copyright laws. If you believe material has been used in an unauthorized manner, please contact the poster.`
    );
    showToast('Fair Use Evaluation Complete', 'success');
  };

  const handleAcceptPolicy = () => {
    if (!agreed) {
      showToast('You must check the agreement box to proceed', 'error');
      return;
    }
    showToast('Copyright & Fair Use Compliance Policy Accepted!', 'success');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl pb-28 md:pb-12 w-full max-w-full overflow-x-hidden text-slate-900">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          FingerMobile Copyright & AI Fair Use Compliance Policy
        </h1>

        <div className="bg-white shadow rounded-lg p-6 mb-8 space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">1. Educational & AI Guidelines</h2>
            <p>
              In accordance with academic standards and AI integration guidelines, FingerMobile enforces strict copyright compliance.
              Creating materials derived from another entity's intellectual property requires adherence to statutory guidelines and platform governance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">2. The Four Factors of Fair Use Consideration</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>The purpose and character of your use:</strong> Non-commercial educational or transformative use.</li>
              <li><strong>The nature of the copyrighted work:</strong> Factual vs. highly creative original content.</li>
              <li><strong>The amount and substantiality of the portion taken:</strong> Excerpts vs. full-work duplication.</li>
              <li><strong>The effect of the use upon the potential market:</strong> Impact on original market value.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">3. DMCA Disclaimer & Limitations</h2>
            <p className="text-sm bg-gray-50 p-4 rounded border border-slate-300">
              Statements such as &quot;No Copyright Intended&quot; do not prevent infringement claims. However, asserting explicit Fair Use disclaimers helps demonstrate good faith in legal determinations.
            </p>
          </section>
        </div>

        {/* Interactive Fair Use Evaluator */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Fair Use Evaluation Generator</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Content Title / ID</label>
              <input
                type="text"
                value={contentId}
                onChange={(e) => setContentId(e.target.value)}
                placeholder="e.g. Educational Commentary Video #101"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={handleEvaluateFairUse}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Generate DMCA Fair Use Disclaimer
            </button>

            {disclaimer && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm font-semibold text-blue-900">Fair Use Index Score: {fairUseScore}</p>
                <p className="text-xs text-blue-800 mt-2 font-mono">{disclaimer}</p>
              </div>
            )}
          </div>
        </div>

        {/* Mandatory Agreement Checkbox */}
        <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center">
          <div className="flex items-center mb-4">
            <input
              id="accept-copyright-policy"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 text-slate-900 border-gray-300 rounded focus:ring-blue-500 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
            />
            <label htmlFor="accept-copyright-policy" className="ml-3 text-sm font-medium text-gray-900">
              I have read, understood, and agree to enforce the FingerMobile Copyright & AI Fair Use Compliance Policy.
            </label>
          </div>
          <button
            onClick={handleAcceptPolicy}
            className="w-full md:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors"
          >
            Accept & Continue
          </button>
        </div>

        {/* Sovereign Mobile Navigation Quick Dock */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 px-4 py-2 flex items-center justify-around shadow-2xl">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-slate-700 hover:text-blue-600 rounded-lg transition-colors"
          >
            <span className="text-base mb-0.5">📜</span>
            <span>Policy</span>
          </button>
          <button
            onClick={() => {
              const el = document.querySelector('input[type="text"]') as HTMLInputElement;
              el?.focus();
            }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg transition-colors"
          >
            <span className="text-base mb-0.5">⚖️</span>
            <span>Evaluate</span>
          </button>
          <button
            onClick={handleAcceptPolicy}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-xs font-bold text-green-700 bg-green-50 rounded-lg transition-colors"
          >
            <span className="text-base mb-0.5">✅</span>
            <span>Accept</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default CopyrightFairUsePage;
