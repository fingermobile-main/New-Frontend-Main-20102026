/**
 * FingerMobile Protocol - Universal QR Code Service
 * Uses goqr.me API: https://api.qrserver.com/v1/create-qr-code/
 * Supports Tier 1 (Profile/Member) and Tier 2 (Content/Transaction) QR codes
 */

export type QRTier = 'tier1-profile' | 'tier2-content' | 'tier2-transaction' | 'tier2-onboarding';
export type QRSize = '150x150' | '200x200' | '250x250' | '300x300' | '400x400' | '500x500';
export type QRFormat = 'png' | 'svg' | 'eps' | 'pdf';

export interface QRCodeOptions {
  size?: QRSize;
  color?: string;        // hex without #, e.g. '000000'
  bgcolor?: string;      // hex without #, e.g. 'ffffff'
  format?: QRFormat;
  tier?: QRTier;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
}

const BASE_URL = 'https://api.qrserver.com/v1/create-qr-code/';

/**
 * Generate a QR code URL for the given data string.
 * Returns a URL that can be used directly in <img src={...} />
 */
export function generateQRUrl(data: string, options: QRCodeOptions = {}): string {
  const {
    size = '200x200',
    color = '0f172a',
    bgcolor = 'ffffff',
    format = 'png',
    errorCorrectionLevel = 'M',
    margin = 1,
  } = options;

  const params = new URLSearchParams({
    data: data,
    size: size,
    color: color,
    bgcolor: bgcolor,
    format: format,
    ecc: errorCorrectionLevel,
    margin: String(margin),
    qzone: '1',
  });

  return `${BASE_URL}?${params.toString()}`;
}

/**
 * Tier 1 QR: Member Profile QR (points to member profile page)
 * Used for member identification, onboarding scans, and event check-ins
 */
export function generateMemberProfileQR(memberId: string, username: string, options?: QRCodeOptions): string {
  const profileUrl = `${window.location.origin}/profile/${username}?qr=true&mid=${memberId}&tier=1`;
  return generateQRUrl(profileUrl, {
    size: '300x300',
    color: '0f172a',
    bgcolor: 'ffffff',
    errorCorrectionLevel: 'H',
    ...options,
    tier: 'tier1-profile',
  });
}

/**
 * Tier 1 QR: Onboarding QR (for new member registration via scan)
 */
export function generateOnboardingQR(referralCode?: string, options?: QRCodeOptions): string {
  const registerUrl = `${window.location.origin}/register${referralCode ? `?ref=${referralCode}` : ''}`;
  return generateQRUrl(registerUrl, {
    size: '250x250',
    color: '0f172a',
    bgcolor: 'f8fafc',
    errorCorrectionLevel: 'H',
    ...options,
    tier: 'tier2-onboarding',
  });
}

/**
 * Tier 2 QR: Content QR (links to a specific piece of content)
 * Used for posts, videos, audio tracks, articles
 */
export function generateContentQR(contentType: string, contentId: string, options?: QRCodeOptions): string {
  const contentUrl = `${window.location.origin}/${contentType}/${contentId}?qr=true&tier=2`;
  return generateQRUrl(contentUrl, {
    size: '200x200',
    color: '065f46',
    bgcolor: 'ffffff',
    errorCorrectionLevel: 'M',
    ...options,
    tier: 'tier2-content',
  });
}

/**
 * Tier 2 QR: Payment/Transaction QR (encodes Infinite Coin payment request)
 */
export function generatePaymentQR(
  recipientId: string,
  amount?: number,
  memo?: string,
  options?: QRCodeOptions
): string {
  const paymentData = JSON.stringify({
    type: 'fmp-payment',
    recipient: recipientId,
    amount: amount || 0,
    currency: 'INC',
    memo: memo || '',
    timestamp: Date.now(),
  });
  return generateQRUrl(paymentData, {
    size: '300x300',
    color: '92400e',
    bgcolor: 'fffbeb',
    errorCorrectionLevel: 'H',
    ...options,
    tier: 'tier2-transaction',
  });
}

/**
 * Download a QR code image programmatically
 */
export async function downloadQRCode(data: string, filename: string, options?: QRCodeOptions): Promise<void> {
  const url = generateQRUrl(data, { ...options, format: 'png' });
  const response = await fetch(url);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = `${filename}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}

const qrService = {
  generateQRUrl,
  generateMemberProfileQR,
  generateOnboardingQR,
  generateContentQR,
  generatePaymentQR,
  downloadQRCode,
};

export default qrService;
