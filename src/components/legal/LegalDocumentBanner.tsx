import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { legalComplianceService, LegalDocument } from '../../services/legalComplianceService';
import { ShieldCheckIcon, ClockIcon, DocumentTextIcon } from '../../icons';

interface LegalDocumentBannerProps {
  slug: string;
  defaultTitle: string;
  defaultVersion?: string;
  defaultEffectiveDate?: string;
}

export const LegalDocumentBanner: React.FC<LegalDocumentBannerProps> = ({
  slug,
  defaultTitle,
  defaultVersion = '2.1.0',
  defaultEffectiveDate = 'October 31, 2025'
}) => {
  const [doc, setDoc] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    legalComplianceService.getLegalDocument(slug)
      .then((data) => {
        if (isMounted && data) {
          setDoc(data);
        }
      })
      .catch((err) => {
        console.warn(`Could not load legal document metadata for ${slug}:`, err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const version = doc?.version || defaultVersion;
  const effectiveDate = doc?.effective_date
    ? new Date(doc.effective_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : defaultEffectiveDate;
  const summary = doc?.summary;

  return (
    <div className="mb-6 bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-xl shrink-0 mt-0.5">
            <ShieldCheckIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-bold text-slate-900 dark:text-white text-base">
                {doc?.title || defaultTitle}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-emerald-900/40 dark:text-emerald-300">
                v{version} • Active Protocol Law
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-950 border border-blue-400 font-bold dark:bg-blue-900/40 dark:text-blue-300">
                NDPA 2023 / GDPR
              </span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <ClockIcon className="w-3.5 h-3.5" /> Effective: {effectiveDate}
              </span>
              {doc?.updated_at && (
                <span>• Last Audited: {new Date(doc.updated_at).toLocaleDateString()}</span>
              )}
            </div>
            {summary && (
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 italic">
                {summary}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <DocumentTextIcon className="w-3.5 h-3.5" />
            Print / Save Copy
          </button>
          <Link
            to="/privacy/data-subject-request"
            className="px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors"
          >
            Exercise DSR Rights
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LegalDocumentBanner;
