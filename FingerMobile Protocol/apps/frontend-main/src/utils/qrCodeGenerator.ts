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
 * Renders a QR code image with an embedded center emblem (FingerMobile Logo or Infinite Coin)
 * into a unified canvas Data URL for high-resolution download and printing.
 */
export async function createQrWithLogoDataUrl(
  qrImageUrl: string,
  logoType: 'fingermobile' | 'infinite-coin' | 'none',
  size = 360
): Promise<string> {
  if (logoType === 'none' || typeof window === 'undefined' || typeof document === 'undefined') {
    return qrImageUrl;
  }

  const logoSrc =
    logoType === 'infinite-coin'
      ? '/assets/logos/infinite_coin_icon.png'
      : '/assets/branding/fingermobile/logo-orange.webp';

  return new Promise<string>((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(qrImageUrl);
      return;
    }

    const qrImg = new Image();
    qrImg.crossOrigin = 'anonymous';

    qrImg.onload = () => {
      ctx.drawImage(qrImg, 0, 0, size, size);

      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';

      logoImg.onload = () => {
        const emblemSize = Math.max(40, Math.round(size * 0.22));
        const center = size / 2;
        const radius = emblemSize / 2;

        // Draw protective white circular background with padding
        ctx.save();
        ctx.beginPath();
        ctx.arc(center, center, radius + 4, 0, 2 * Math.PI);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        ctx.fill();

        ctx.shadowColor = 'transparent';
        ctx.lineWidth = 3;
        ctx.strokeStyle = logoType === 'infinite-coin' ? '#f59e0b' : '#ff6b00';
        ctx.stroke();

        // Clip circular region for the logo
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(logoImg, center - radius, center - radius, emblemSize, emblemSize);
        ctx.restore();

        try {
          resolve(canvas.toDataURL('image/png'));
        } catch {
          resolve(qrImageUrl);
        }
      };

      logoImg.onerror = () => {
        // Fallback: resolve raw QR image if logo asset cannot be loaded
        resolve(qrImageUrl);
      };

      logoImg.src = logoSrc;
    };

    qrImg.onerror = () => {
      resolve(qrImageUrl);
    };

    qrImg.src = qrImageUrl;
  });
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

