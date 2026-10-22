import React, { useState } from 'react';
interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: string;
  title?: string;
  size?: number;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  data = '',
  title = 'QR Code',
  size = 256
}) => {
  const [downloadFormat, setDownloadFormat] = useState<'png' | 'svg'>('png');

  if (!isOpen) return null;

  // Generate QR code URL (using a public API for demo - replace with proper library in production)
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode.${downloadFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download QR code:', err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data);
      alert('QR code data copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div aria-label="Close modal"
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose} role="button" tabIndex={0}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="border-b border-slate-300 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-slate-700 hover:text-gray-700 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* QR Code Display */}
            <div className="flex justify-center">
              <div className="bg-white p-4 rounded-lg border-2 border-slate-300 shadow-sm">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  width={size}
                  height={size}
                  className="rounded"
                />
              </div>
            </div>

            {/* Data Preview */}
            {data && (
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Encoded Data
                </label>
                <div className="bg-white border border-gray-300 rounded p-3 text-sm break-all max-h-32 overflow-y-auto">
                  {data}
                </div>
              </div>
            )}

            {/* Download Options */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Download Format
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setDownloadFormat('png')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                    downloadFormat === 'png'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-300 hover:border-gray-300'
                  }`}
                >
                  PNG
                </button>
                <button
                  onClick={() => setDownloadFormat('svg')}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
                    downloadFormat === 'svg'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-300 hover:border-gray-300'
                  }`}
                >
                  SVG
                </button>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-300 px-6 py-4 flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span>⬇️</span>
              Download
            </button>

            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <span>📋</span>
              Copy
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
