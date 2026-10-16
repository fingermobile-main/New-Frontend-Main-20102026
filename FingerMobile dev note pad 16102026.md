FingerMobile dev note pad 16102026

http://localhost:3000/about
Mrs. Mbah Eunice Emonena
Co-Founder & Chief Financial Officer (CFO)
/Users/user/Documents/FingerMobile Protocol Communication/FingerMobile Protocol/Assets/Eunice Emonena Mbah

2.

Compiled with problems:
×
ERROR in src/components/tribut/TributCreatorUploadModal.tsx:331:51
TS2339: Property 'fileSizeFormatted' does not exist on type 'never'.
    329 |             originalFileName: selectedHardwareFiles[0]?.name || 'web-upload.webp',
    330 |             fileSizeBytes: selectedHardwareFiles[0]?.size || 102400,
  > 331 |             fileSizeFormatted: extractedMetadata?.fileSizeFormatted || '100 KB',
        |                                                   ^^^^^^^^^^^^^^^^^
    332 |             mimeType: selectedHardwareFiles[0]?.type || 'image/webp',
    333 |             deviceType: detectedDevice.type,
    334 |             devicePlatform: detectedDevice.platform

    