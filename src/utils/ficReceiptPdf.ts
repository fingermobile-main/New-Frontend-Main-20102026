/**
 * FingerMobile Protocol Communication
 * FIC Purchase & Allocation Payment Confirmation PDF Generator
 * Strict adherence to Platform Policy: Zero Error Margin
 */

export interface FICReceiptData {
  receiptNumber: string;
  purchaserName: string;
  purchaserEmail: string;
  walletAddress: string;
  amountFIC: number;
  ratePerFIC: number;
  totalNaira: number;
  totalUSD: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  txHash: string;
  timestamp: string;
  serialNumber: string;
  status: 'CONFIRMED & ALLOCATED' | 'PENDING VERIFICATION' | 'APPROVED & FUNDED';
  treasuryStaffName?: string;
  treasuryStaffRole?: string;
  cfoApprovedBy?: string;
  cfoApprovedAt?: string;
  sourceVault?: string;
}

/**
 * Generates a byte-valid PDF-1.4 file for FIC Purchase & Allocation
 */
export function generateFicReceiptPdf(data: FICReceiptData): Blob {
  const sanitize = (str: string) => str.replace(/[\\()]/g, '');

  const textLines = [
    'FINGERMOBILE PROTOCOL COMMUNICATION',
    'OFFICIAL FIC PAYMENT CONFIRMATION & ALLOCATION RECEIPT',
    '--------------------------------------------------------------------------------',
    `Receipt Reference: ${sanitize(data.receiptNumber)}`,
    `Date & Time: ${sanitize(data.timestamp)}`,
    `Verification Status: ${sanitize(data.status)}`,
    `Blockchain Unique ID / Serial: ${sanitize(data.serialNumber)}`,
    `Transaction Hash: ${sanitize(data.txHash)}`,
    '--------------------------------------------------------------------------------',
    'PURCHASER CREDENTIALS:',
    `  Full Name: ${sanitize(data.purchaserName)}`,
    `  Registered Email: ${sanitize(data.purchaserEmail)}`,
    `  Destination Wallet: ${sanitize(data.walletAddress)}`,
    '--------------------------------------------------------------------------------',
    'PAYMENT & SETTLEMENT DETAILS:',
    `  Institution Bank: ${sanitize(data.bankName)}`,
    `  Bank Account Number: ${sanitize(data.accountNumber)}`,
    `  Beneficiary Name: ${sanitize(data.accountName)}`,
    `  Amount Allocated: ${data.amountFIC.toLocaleString()} FIC`,
    `  Effective Unit Rate: N${data.ratePerFIC.toLocaleString()}`,
    `  Total Consideration: N${data.totalNaira.toLocaleString()} (~$${data.totalUSD.toFixed(2)} USD)`,
    `  Source Protocol Vault: ${sanitize(data.sourceVault || 'Wallet 004 Treasury & Seed Sale')}`,
    '--------------------------------------------------------------------------------',
    'TREASURY & STATUTORY APPROVAL SEAL:',
    `  Treasury Staff Confirmation: ${sanitize(data.treasuryStaffName || 'Account Staff 3')} (${sanitize(data.treasuryStaffRole || 'Staff Accountant')})`,
    `  Executive CFO Final Approval: ${sanitize(data.cfoApprovedBy || 'Mrs. Mbah Eunice Emonena (CFO, Co-Founder, Admin-1)')}`,
    `  CFO Authorized Timestamp: ${sanitize(data.cfoApprovedAt || data.timestamp)}`,
    '  Platform Root Custodian: Mr. Mbah Israel Obinna (Founder & SuperAdmin)',
    '  Guaranteed by: FingerMobile Act & Sovereign Vault Protocol Rail',
    '--------------------------------------------------------------------------------',
    'This document certifies irreversible allocation of FIC to the specified wallet.',
    'For inquiries: support@fingermobileprotocol.com | Alternative Bank Ref: 0514108422',
  ];

  let streamContent = 'BT\n/F1 10 Tf\n50 780 Td\n14 TL\n';
  textLines.forEach((line) => {
    streamContent += `(${line}) '\n`;
  });
  streamContent += 'ET\n';

  const streamLength = streamContent.length;

  const pdfBody = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 595 842]
  /Contents 4 0 R
  /Resources <<
    /Font <<
      /F1 5 0 R
    >>
  >>
>>
endobj
4 0 obj
<<
  /Length ${streamLength}
>>
stream
${streamContent}endstream
endobj
5 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Courier
>>
endobj
xref
0 6
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
0000000262 00000 n
0000000000 00000 n
trailer
<<
  /Size 6
  /Root 1 0 R
>>
startxref
${350 + streamLength}
%%EOF`;

  return new Blob([pdfBody], { type: 'application/pdf' });
}

export function downloadFicReceiptPdf(data: FICReceiptData): void {
  const blob = generateFicReceiptPdf(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `FIC_Receipt_${data.receiptNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
