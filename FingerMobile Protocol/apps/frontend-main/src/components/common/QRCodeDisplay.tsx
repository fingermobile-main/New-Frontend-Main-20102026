/**
 * FingerMobile Protocol - Universal QR Code Display Component
 * Renders Tier 1 (Profile) and Tier 2 (Content/Payment) QR codes
 * Backward-compatible with legacy props: title, subtitle, showActions, centerLogo
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Check, Download, RefreshCw, QrCode, Share2 } from 'lucide-react';
import { generateQrDataUrl, downloadQrCode, getGoQrUrl } from '../../utils/qrCodeGenerator';
import { downloadQRCode, QRCodeOptions, QRTier, QRLogoType, QRPurpose } from '../../services/qrService';

export interface QRCodeDisplayProps {
  data: string;
  size?: number;
  /** Legacy: displayed as heading above QR */
  title?: string;
  /** Legacy: displayed as sub-text */
  subtitle?: string;
  /** Legacy: show copy + download action buttons */
  showActions?: boolean;
  /** Show brand / token emblem in center (default true) */
  centerLogo?: boolean;
  /** Specific emblem type: 'fingermobile' | 'infinite-coin' | 'auto' | 'none' (default 'auto') */
  centerLogoType?: QRLogoType;
  /** Semantic purpose of QR: 'wallet' | 'payment' | 'transaction' | 'giftcard' | 'profile' | 'onboarding' | 'content' | 'general' | 'security' */
  purpose?: QRPurpose;
  className?: string;
  // ── New tier-aware props ──────────────────────────────────────────────────
  /** Short label beneath the QR image (replaces title for new call-sites) */
  label?: string;
  /** Tier classification — drives badge colour */
  tier?: QRTier;
  /** Show dedicated Download button (new API) */
  showDownload?: boolean;
  /** Show dedicated Share button (new API) */
  showShare?: boolean;
  /** Extra goqr.me options forwarded to the URL builder */
  options?: QRCodeOptions;
}

const tierStyles: Record<QRTier, string> = {
  'tier1-profile':     'border-orange-400 bg-orange-50',
  'tier2-content':     'border-emerald-400 bg-emerald-50',
  'tier2-transaction': 'border-amber-400 bg-amber-50',
  'tier2-onboarding':  'border-indigo-400 bg-indigo-50',
};

const tierBadgeLabels: Record<QRTier, string> = {
  'tier1-profile':     'TIER 1 · MEMBER QR',
  'tier2-content':     'TIER 2 · CONTENT',
  'tier2-transaction': 'TIER 2 · PAYMENT',
  'tier2-onboarding':  'TIER 2 · ONBOARD',
};

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  data,
  size = 200,
  title,
  subtitle,
  showActions = true,
  centerLogo = true,
  centerLogoType = 'auto',
  purpose,
  className = '',
  label,
  tier,
  showDownload,
  showShare,
  options = {},
}) => {
  const [qrSrc, setQrSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Determine effective display flags
  // New API: showDownload / showShare are explicit
  // Legacy API: showActions shows both copy + download together
  const isNewApi = tier !== undefined || label !== undefined || showDownload !== undefined || showShare !== undefined;
  const effectiveShowDownload = isNewApi ? (showDownload ?? true) : showActions;
  const effectiveShowShare    = isNewApi ? (showShare    ?? true) : false;
  const effectiveCopyAction   = isNewApi ? false : showActions;

  // Determine effective center emblem: Infinite Coin (wallets, financial) vs FingerMobile Logo (profiles, content, generic)
  const resolveEffectiveLogoType = useCallback((): 'infinite-coin' | 'fingermobile' | 'none' => {
    if (centerLogo === false || centerLogoType === 'none') {
      return 'none';
    }
    if (centerLogoType === 'infinite-coin') {
      return 'infinite-coin';
    }
    if (centerLogoType === 'fingermobile') {
      return 'fingermobile';
    }

    // Auto-detection based on semantic cues, tier, purpose, or data payload
    const isFinancialOrWallet =
      tier === 'tier2-transaction' ||
      purpose === 'wallet' ||
      purpose === 'payment' ||
      purpose === 'transaction' ||
      purpose === 'giftcard' ||
      options?.tier === 'tier2-transaction' ||
      options?.purpose === 'wallet' ||
      options?.purpose === 'payment' ||
      options?.purpose === 'transaction' ||
      options?.purpose === 'giftcard' ||
      options?.logoType === 'infinite-coin' ||
      /fmp-payment|wallet|0x[a-fA-F0-9]{20,}|GIFT-|giftcard|INC|FIC|paylink|receive|currency.*INC/i.test(data) ||
      /wallet|payment|pay\b|gift|transaction|infinite coin|fic\b|receive|balance|escrow|token|deposit|withdraw/i.test(
        `${title || ''} ${subtitle || ''} ${label || ''}`
      );

    return isFinancialOrWallet ? 'infinite-coin' : 'fingermobile';
  }, [centerLogo, centerLogoType, tier, purpose, options, data, title, subtitle, label]);

  const effectiveLogoType = resolveEffectiveLogoType();
  const emblemSize = Math.max(34, Math.min(52, Math.round(size * 0.22)));

  const loadQr = useCallback(async () => {
    if (!data) {
      setQrSrc('');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const src = await generateQrDataUrl(data, { size });
      setQrSrc(src);
    } catch {
      setQrSrc(getGoQrUrl(data, size));
    } finally {
      setLoading(false);
    }
  }, [data, size]);

  useEffect(() => {
    loadQr();
  }, [loadQr]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback — silent
    }
  };

  const handleDownload = useCallback(async () => {
    const effectiveOptions: QRCodeOptions = {
      ...options,
      tier,
      purpose,
      logoType: effectiveLogoType,
    };

    if (label || tier) {
      // New API — use qrService for clean filename + options
      const filename = label
        ? label.replace(/\s+/g, '-').toLowerCase()
        : `fingermobile-${tier ?? 'qr'}`;
      await downloadQRCode(data, filename, effectiveOptions);
    } else {
      // Legacy path with logo composite
      try {
        const { createQrWithLogoDataUrl, downloadQrCode } = await import('../../utils/qrCodeGenerator');
        const compositeUrl = await createQrWithLogoDataUrl(qrSrc, effectiveLogoType, Math.max(360, size * 2));
        await downloadQrCode(compositeUrl, `fingermobile-qr-${Date.now()}.png`);
      } catch {
        if (!qrSrc) return;
        downloadQrCode(qrSrc, `fingermobile-qr-${Date.now()}.png`);
      }
    }
  }, [data, label, tier, purpose, effectiveLogoType, options, qrSrc, size]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      await navigator.share({ title: label ?? title ?? 'FingerMobile QR Code', url: data });
    } else {
      await navigator.clipboard.writeText(data);
    }
  }, [data, label, title]);

  const containerBorder = tier ? tierStyles[tier] : 'border-slate-300';

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* ── Tier Badge (new API) ─────────────────────────────────────── */}
      {tier && (
        <div
          className={`mb-2 px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest border ${tierStyles[tier]} text-slate-800`}
        >
          {tierBadgeLabels[tier]}
        </div>
      )}

      {/* ── Legacy title ─────────────────────────────────────────────── */}
      {title && !tier && (
        <h4 className="text-sm font-black text-slate-900 mb-1">
          {title}
        </h4>
      )}
      {subtitle && (
        <p className="text-xs text-slate-700 font-medium mb-3 max-w-xs">
          {subtitle}
        </p>
      )}

      {/* ── QR Code Container ─────────────────────────────────────────── */}
      <div
        className={`relative p-3 bg-white rounded-2xl border-2 shadow-md inline-flex items-center justify-center overflow-hidden ${containerBorder}`}
        style={{ minWidth: size + 24, minHeight: size + 24 }}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-700">
            <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-xs font-bold text-slate-800">Generating Secure QR...</span>
          </div>
        ) : qrSrc ? (
          <div className="relative group">
            <img
              src={qrSrc}
              alt={label ? `QR Code for ${label}` : title ? `QR Code — ${title}` : 'QR Code'}
              width={size}
              height={size}
              className="rounded-lg object-contain block select-none"
              style={{ imageRendering: 'pixelated' }}
              onError={() => {
                setQrSrc(getGoQrUrl(data, size));
              }}
            />

            {/* Brand / Token Center Emblem (FingerMobile Logo or Infinite Coin) */}
            {effectiveLogoType !== 'none' && (
              <div
                aria-hidden="true"
                style={{ width: emblemSize, height: emblemSize }}
                className={`absolute inset-0 m-auto rounded-full bg-white shadow-md flex items-center justify-center pointer-events-none p-1 border-2 ${
                  effectiveLogoType === 'infinite-coin'
                    ? 'border-amber-500 ring-2 ring-amber-400/40'
                    : 'border-orange-500 ring-2 ring-orange-400/40'
                }`}
              >
                {effectiveLogoType === 'infinite-coin' ? (
                  <img
                    src="/assets/logos/infinite_coin_icon.png"
                    alt="Infinite Coin Logo"
                    className="w-full h-full object-contain rounded-full select-none"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/logos/infinite_coin_medallion.webp';
                    }}
                  />
                ) : (
                  <img
                    src="/assets/branding/fingermobile/logo-orange.webp"
                    alt="FingerMobile Logo"
                    className="w-full h-full object-contain select-none"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/logos/fingermobile_logo.webp';
                    }}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-slate-600">
            <QrCode className="w-12 h-12 text-slate-400" />
            <span className="text-xs font-bold text-slate-700">No data payload</span>
          </div>
        )}
      </div>

      {/* ── Label (new API) ───────────────────────────────────────────── */}
      {label && (
        <p className="mt-2 text-xs font-bold text-slate-700 text-center max-w-[180px] truncate">
          {label}
        </p>
      )}

      {/* ── Data Preview (legacy, when no tier/label) ─────────────────── */}
      {data && !tier && !label && (
        <p className="mt-2 text-[11px] font-mono font-bold text-slate-800 break-all max-w-[280px] bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
          {data.length > 40 ? `${data.substring(0, 37)}...` : data}
        </p>
      )}

      {/* ── Action Buttons ─────────────────────────────────────────────── */}
      {(effectiveCopyAction || effectiveShowDownload || effectiveShowShare) && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {/* Copy (legacy only) */}
          {effectiveCopyAction && (
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              title="Copy payload to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-700" />
                  <span>Copy Payload</span>
                </>
              )}
            </button>
          )}

          {/* Download */}
          {effectiveShowDownload && (
            <button
              type="button"
              onClick={handleDownload}
              disabled={!qrSrc && !(label || tier)}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs disabled:opacity-50"
              title="Download QR code image"
            >
              <Download className="w-3.5 h-3.5 text-indigo-700" />
              <span>Download</span>
            </button>
          )}

          {/* Share (new API) */}
          {effectiveShowShare && (
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
              title="Share QR code"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QRCodeDisplay;
