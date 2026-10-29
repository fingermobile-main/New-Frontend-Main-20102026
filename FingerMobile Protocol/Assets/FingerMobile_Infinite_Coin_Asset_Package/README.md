# FingerMobile Infinite Coin Lion Medallion — Asset Package

## Included files
- `00_original_source.png` — untouched supplied source image.
- `01_master_transparent.png` — optimized lossless transparent PNG master.
- `02_web_transparent.webp` — lossless transparent WebP for web delivery.
- `03_thumbnail_512.png` — 512 px transparent thumbnail.
- `04_preview_dark.jpg` — JPEG preview on a dark background (not transparent).
- `05_ai_ml_labels.json` — descriptive labels, caption, alt text, tags, and dataset notes.
- `06_nft_metadata_TEMPLATE.json` — NFT metadata template with IPFS placeholders.
- `07_manifest.json` — file sizes and SHA-256 checksums.

## AI / machine-learning preparation
Use the master PNG as the canonical visual input. Keep descriptive labels attached to the image as annotations. The labels in this package are human-authored suggestions, not measured classifier confidence. For training, define the task first (classification, detection, OCR, similarity search, etc.), create a consistent annotation schema, and split data by source/artwork identity to avoid near-duplicate leakage.

The tiny curved lettering and perimeter character string may be hard for OCR. If exact text recognition matters, create a separate OCR/reference transcription and verify every character manually. Do not overwrite the original artwork with speculative corrections.

## NFT / Web3 preparation
The JSON file is a template, not a minted token. Replace all `REPLACE_WITH...` placeholders, upload the media and metadata to durable storage such as IPFS or another suitable content-addressed/persistent storage provider, and verify the resulting URIs. Before minting, confirm the rights holder, license, chain/network, wallet, marketplace or smart-contract workflow, fees, and whether the token should be unique or part of an edition. Metadata does not itself prove copyright, ownership, authenticity, or provenance.

## Important
This package does not mint an NFT, register copyright, establish ownership, or provide legal advice. Do not claim that it has been tokenized until an actual on-chain transaction is completed and verified.
