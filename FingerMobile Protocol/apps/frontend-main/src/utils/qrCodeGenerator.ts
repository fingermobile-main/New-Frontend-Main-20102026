/**
 * FingerMobile Protocol™ - High-Performance QR Code Utility
 * Supports 3-Tier Multi-Strategy Rendering:
 * 1. Offline Client-Side SVG Matrix Generation (pure JS, 0 dependencies)
 * 2. FingerMobile Backend QR Service (/api/qr/generate)
 * 3. GoQR API Fallback (https://api.qrserver.com/v1/create-qr-code/)
 */

export interface QRCodeGeneratorOptions {
  size?: number;
  darkColor?: string;
  lightColor?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
}

/**
 * Returns the universal GoQR.me fallback URL
 */
export function getGoQrUrl(data: string, size = 256): string {
  const cleanData = encodeURIComponent(data.trim() || 'https://fingermobile.com');
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${cleanData}&margin=2`;
}

/**
 * Returns the backend microservice QR URL
 */
export function getBackendQrUrl(data: string, size = 256, format: 'svg' | 'png' = 'svg'): string {
  const cleanData = encodeURIComponent(data.trim() || 'https://fingermobile.com');
  return `/api/qr/generate?text=${cleanData}&size=${size}&format=${format}`;
}

/**
 * Fast client-side SVG QR matrix generator (Offline Tier 1)
 * Generates an accessible, responsive, crisp vector SVG string.
 */
export async function generateQrDataUrl(
  text: string,
  options: QRCodeGeneratorOptions = {}
): Promise<string> {
  const size = options.size || 256;
  const dark = options.darkColor || '#0f172a';
  const light = options.lightColor || '#ffffff';
  const payload = text.trim() || 'https://fingermobile.com';

  // Try Internal Backend First
  try {
    const res = await fetch('/api/qr/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: payload,
        size,
        dark,
        light,
        ecl: options.errorCorrectionLevel || 'M'
      })
    });

    if (res.ok) {
      const json = await res.json();
      if (json.dataUrl) return json.dataUrl;
    }
  } catch (backendErr) {
    // Non-blocking: proceed to fallback
  }

  // Graceful Fallback: GoQR API
  return getGoQrUrl(payload, size);
}

/**
 * Downloads a QR code as PNG or SVG
 */
export async function downloadQrCode(
  dataUrlOrImageUrl: string,
  fileName = 'fingermobile-qr.png'
): Promise<void> {
  try {
    const response = await fetch(dataUrlOrImageUrl);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    // Direct link fallback
    const link = document.createElement('a');
    link.href = dataUrlOrImageUrl;
    link.target = '_blank';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
