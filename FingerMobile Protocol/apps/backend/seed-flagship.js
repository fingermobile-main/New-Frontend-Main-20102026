const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'password',
  database: 'fingermobile_platform_db'
});

const items = [
  {
    name: 'FingerMobile Protocol Sovereign Keycard V3',
    tagline: 'Hardware Cryptographic NFC Key & Identity Vault',
    description: 'The official flagship hardware access card for FingerMobile Protocol. Features military-grade EAL6+ secure element, biometric NFC authentication, and direct cold-storage signing.',
    price: 150.0,
    price_fic: 300.0,
    currency: 'FIC',
    category: 'Hardware & Security',
    sku: 'FMP-KEY-V3-001',
    images: ['https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80'],
    stock_quantity: 250,
    is_flagship: true,
    authenticity_ledger_hash: '0x8f9c1a5b432e189d20c578ab310e74f145610bcde8173429acbf918234125678',
    specifications: { Chip: 'Secure Element EAL6+', Interface: 'NFC ISO/IEC 14443 & USB-C', Material: 'Brushed Aerospace Titanium', Warranty: 'Lifetime Protocol Replacement' },
    likes: 128,
    dislikes: 3,
    rating: 4.98,
    reviews_count: 45,
    poll_data: { question: 'Should this flagship item receive next-gen protocol firmware?', options: [{ id: 1, text: 'Yes, immediate update', votes: 42 }, { id: 2, text: 'Keep current build', votes: 8 }] }
  },
  {
    name: 'Guardian Sentinel Hardware Security Module (HSM)',
    tagline: 'Zero-Knowledge Biometric Vault & Network Validator Enclave',
    description: 'High-assurance cryptographic coprocessor engineered to protect master seed keys and execute multi-sig approvals with quantum-resistant key derivation.',
    price: 850.0,
    price_fic: 1700.0,
    currency: 'FIC',
    category: 'Hardware & Security',
    sku: 'FMP-HSM-SENTINEL-02',
    images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'],
    stock_quantity: 45,
    is_flagship: true,
    authenticity_ledger_hash: '0x33445566778899aabbccddeeff00112233445566778899aabbccddeeff001122',
    specifications: { Architecture: 'Dual Cortex-M33 with TrustZone', Certifications: 'FIPS 140-3 Level 4 Compliant', Power: 'USB-PD 20W & Internal Supercapacitor' },
    likes: 94,
    dislikes: 1,
    rating: 4.96,
    reviews_count: 28,
    poll_data: { question: 'Enable automatic node telemetry sync?', options: [{ id: 1, text: 'Enabled (Automated)', votes: 77 }, { id: 2, text: 'Airgapped Manual Only', votes: 23 }] }
  },
  {
    name: 'Titanium Ledger Cold Vault Seed Plate',
    tagline: 'Indestructible Dual-Plate Cryogenic Mnemonic Backup',
    description: 'Aircraft-grade Grade 5 titanium plates tested to withstand temperatures up to 3,000°F, extreme hydraulic crushing, and corrosive acids for permanent seed preservation.',
    price: 220.0,
    price_fic: 440.0,
    currency: 'FIC',
    category: 'Hardware & Security',
    sku: 'FMP-VAULT-TITANIUM-03',
    images: ['https://images.unsplash.com/photo-1589793907316-f9434d0014a5?auto=format&fit=crop&w=1200&q=80'],
    stock_quantity: 180,
    is_flagship: true,
    authenticity_ledger_hash: '0xaa11bb22cc33dd44ee55ff6600112233445566778899aabbccddeeff00112233',
    specifications: { MeltingPoint: '3034 F', Capacity: '24-Word BIP39 Seed Phrase', Weight: '380g' },
    likes: 82,
    dislikes: 0,
    rating: 4.99,
    reviews_count: 36,
    poll_data: { question: 'Preferred stamping mechanism:', options: [{ id: 1, text: 'Center-Punch Indenter', votes: 55 }, { id: 2, text: 'Rotary Engraving Pen', votes: 45 }] }
  },
  {
    name: 'FingerMobile Protocol Neural Node Server V1',
    tagline: 'Decentralized AI Inference Node & Verification Engine',
    description: 'Self-contained neural processing unit running local quantized LLM inference for FingerMobile Protocol, zero-knowledge verification, and cryptographic indexing.',
    price: 2400.0,
    price_fic: 4800.0,
    currency: 'FIC',
    category: 'Hardware & Security',
    sku: 'FMP-NODE-NEURAL-04',
    images: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80'],
    stock_quantity: 20,
    is_flagship: true,
    authenticity_ledger_hash: '0xbb22cc33dd44ee55ff6600112233445566778899aabbccddeeff0011223344',
    specifications: { NPU: '80 TOPS Dual Accelerator', Memory: '64GB Unified LPDDR5X', Storage: '4TB NVMe PCIe 5.0' },
    likes: 156,
    dislikes: 2,
    rating: 4.97,
    reviews_count: 51,
    poll_data: { question: 'Default local LLM model preset:', options: [{ id: 1, text: 'FingerMobile Sovereign-8B', votes: 68 }, { id: 2, text: 'Gemma 2-9B Quantized', votes: 32 }] }
  },
  {
    name: 'Sovereign Protocol Founders Bomber Jacket',
    tagline: 'Limited Release Waterproof Technical Outerwear',
    description: 'Constructed from triple-layer ballistic nylon with laser-etched FingerMobile Protocol insignias and NFC chip embedded inside the right cuff.',
    price: 280.0,
    price_fic: 560.0,
    currency: 'FIC',
    category: 'Flagship Apparel',
    sku: 'FMP-APP-BOMBER-05',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80'],
    stock_quantity: 75,
    is_flagship: true,
    authenticity_ledger_hash: '0xcc33dd44ee55ff6600112233445566778899aabbccddeeff001122334455',
    specifications: { Fabric: '3-Layer Cordura Ballistic Nylon', NFC: 'NTAG 424 DNA Encrypted Chip', Weather: 'Waterproof 20,000mm rating' },
    likes: 210,
    dislikes: 4,
    rating: 4.95,
    reviews_count: 62,
    poll_data: { question: 'Next colorway release:', options: [{ id: 1, text: 'Cyber Emerald & Black', votes: 85 }, { id: 2, text: 'Deep Stealth Matte Slate', votes: 15 }] }
  },
  {
    name: 'Beatwave Studio Reference Monitors (Pair)',
    tagline: 'Lossless 24-Bit Linear Studio Acoustic Monitors',
    description: 'Precision-tuned active studio monitors designed for audio mastering and immersive BeatwaveNG playback. Featuring custom kevlar woofers and ribbon tweeters.',
    price: 720.0,
    price_fic: 1440.0,
    currency: 'FIC',
    category: 'Audio Gear',
    sku: 'FMP-AUD-MONITOR-06',
    images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80'],
    stock_quantity: 35,
    is_flagship: true,
    authenticity_ledger_hash: '0xdd44ee55ff6600112233445566778899aabbccddeeff00112233445566',
    specifications: { Woofer: '6.5-inch Woven Kevlar', Tweeter: '2-inch Air Motion Ribbon', Amplification: 'Class-D 140W Bi-Amp', Inputs: 'XLR, TRS & Optical' },
    likes: 180,
    dislikes: 3,
    rating: 4.96,
    reviews_count: 48,
    poll_data: { question: 'Include digital DSP room correction mic?', options: [{ id: 1, text: 'Yes, bundled as standard', votes: 91 }, { id: 2, text: 'Optional add-on only', votes: 9 }] }
  }
];

async function run() {
  for (const item of items) {
    await pool.query(`
      INSERT INTO marketplace_products (
        name, tagline, description, price, price_fic, currency, category, sku,
        images, stock_quantity, is_flagship, is_active, status,
        authenticity_ledger_hash, specifications, likes, dislikes, rating,
        reviews_count, poll_data, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, true, 'active', $12, $13, $14, $15, $16, $17, $18, NOW(), NOW())
      ON CONFLICT (sku) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        price_fic = EXCLUDED.price_fic,
        is_flagship = true,
        is_active = true;
    `, [
      item.name, item.tagline, item.description, item.price, item.price_fic, item.currency, item.category, item.sku,
      item.images, item.stock_quantity, item.is_flagship,
      item.authenticity_ledger_hash, JSON.stringify(item.specifications), item.likes, item.dislikes, item.rating,
      item.reviews_count, JSON.stringify(item.poll_data)
    ]);
  }
  console.log('Seeded flagship products successfully!');
  await pool.end();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
