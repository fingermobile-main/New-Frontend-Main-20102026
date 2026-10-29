import React, { useState, useEffect, useCallback } from 'react';
import { Copy, Check, Download, RefreshCw, QrCode } from 'lucide-react';
import { generateQrDataUrl, downloadQrCode, getGoQrUrl } from '../../utils/qrCodeGenerator';

export interface QRCodeDisplayProps {
  data: string;
  size?: number;
  title?: string;
  subtitle?: string;
  showActions?: boolean;
  centerLogo?: boolean;
  className?: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  data,
  size = 200,
  title,
  subtitle,
  showActions = true,
  centerLogo = true,
  className = ''
}) => {
  const [qrSrc, setQrSrc] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

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
      // Fallback
    }
  };

  const handleDownload = () => {
    if (!qrSrc) return;
    downloadQrCode(qrSrc, `fingermobile-qr-${Date.now()}.png`);
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {title && (
        <h4 className="text-sm font-black text-slate-900 mb-1">
          {title}
        </h4>
      )}
      {subtitle && (
        <p className="text-xs text-slate-700 font-medium mb-3 max-w-xs">
          {subtitle}
        </p>
      )}

      {/* QR Code Container */}
      <div
        className="relative p-3 bg-white rounded-2xl border-2 border-slate-300 shadow-md inline-flex items-center justify-center overflow-hidden"
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
              alt="Scan QR Code"
              width={size}
              height={size}
              className="rounded-lg object-contain block select-none"
              onError={() => {
                // Fallback to GoQR if image load fails
                setQrSrc(getGoQrUrl(data, size));
              }}
            />

            {/* Optional FingerMobile Brand Emblem in Center */}
            {centerLogo && (
              <div
                aria-hidden="true"
                className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white shadow-md border-2 border-slate-900 flex items-center justify-center pointer-events-none"
              >
                <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center text-white text-[11px] font-black">
                  FM
                </div>
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

      {/* Text Data Display */}
      {data && (
        <p className="mt-2 text-[11px] font-mono font-bold text-slate-800 break-all max-w-[280px] bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
          {data.length > 40 ? `${data.substring(0, 37)}...` : data}
        </p>
      )}

      {/* Action Buttons */}
      {showActions && (
        <div className="mt-3 flex items-center justify-center gap-2">
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

          <button
            type="button"
            onClick={handleDownload}
            disabled={!qrSrc || loading}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs disabled:opacity-50"
            title="Download QR code image"
          >
            <Download className="w-3.5 h-3.5 text-indigo-700" />
            <span>Download</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default QRCodeDisplay;
