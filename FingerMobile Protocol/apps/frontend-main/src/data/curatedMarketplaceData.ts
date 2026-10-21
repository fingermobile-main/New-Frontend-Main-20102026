import { FlagshipProduct } from '../pages/MarketplacePage';

export const CURATED_FLAGSHIP_PRODUCTS: FlagshipProduct[] = [
  // --- 1. Hardware & Security (10 items) ---
  {
    id: 'fmp-hw-001',
    name: 'FingerMobile Protocol Sovereign Keycard V3',
    tagline: 'Hardware Cryptographic NFC Key & Identity Vault',
    description: 'The official flagship hardware access card for FingerMobile Protocol. Features military-grade EAL6+ secure element, biometric NFC authentication, and direct cold-storage signing.',
    price: 150.0,
    priceFic: 300.0,
    currency: 'FIC',
    category: 'Hardware & Security',
    sku: 'FMP-KEY-V3-001',
    images: ['https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 250,
    is_flagship: true,
    authenticity_ledger_hash: '0x8f9c1a5b432e189d20c578ab310e74f145610bcde8173429acbf918234125678',
    specifications: {
      Chip: 'Secure Element EAL6+',
      Interface: 'NFC ISO/IEC 14443 & USB-C',
      Material: 'Brushed Aerospace Titanium',
      Warranty: 'Lifetime Protocol Replacement'
    },
    likes: 128,
    dislikes: 3,
    rating: 4.98,
    reviews_count: 45,
    poll_data: {
      question: 'Should this flagship item receive next-gen protocol firmware?',
      options: [
        { id: 1, text: 'Yes, immediate update', votes: 42 },
        { id: 2, text: 'Keep current build', votes: 8 }
      ]
    }
  },
  {
    id: 'fmp-hw-002',
    name: 'Guardian Sentinel Hardware Security Module (HSM)',
    tagline: 'Zero-Knowledge Biometric Vault & Network Validator Enclave',
    description: 'High-assurance cryptographic coprocessor engineered to protect master seed keys and execute multi-sig approvals with quantum-resistant key derivation.',
    price: 850.0,
    priceFic: 1700.0,
    currency: 'FIC',
    category: 'Hardware & Security',
    sku: 'FMP-HSM-SENTINEL-02',
    images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 45,
    is_flagship: true,
    authenticity_ledger_hash: '0x33445566778899aabbccddeeff00112233445566778899aabbccddeeff001122',
    specifications: {
      Architecture: 'Dual Cortex-M33 with TrustZone',
      Certifications: 'FIPS 140-3 Level 4 Compliant',
      Power: 'USB-PD 20W & Internal Supercapacitor',
      Enclosure: 'Tamper-Destructive Resin Block'
    },
    likes: 94,
    dislikes: 1,
    rating: 4.96,
    reviews_count: 28,
    poll_data: {
      question: 'Enable automatic node telemetry sync?',
      options: [
        { id: 1, text: 'Enabled (Automated)', votes: 77 },
        { id: 2, text: 'Airgapped Manual Only', votes: 23 }
      ]
    }
  },
  {
    id: 'fmp-hw-003',
    name: 'Titanium Ledger Cold Vault Seed Plate',
    tagline: 'Indestructible Dual-Plate Cryogenic Mnemonic Backup',
    description: 'Aircraft-grade Grade 5 titanium plates tested to withstand temperatures up to 3,000°F, extreme hydraulic crushing, and corrosive acids for permanent seed preservation.',
    price: 220.0,
    priceFic: 440.0,
    currency: 'FIC',
    category: 'Hardware & Security',
    sku: 'FMP-VAULT-TITANIUM-03',
    images: ['https://images.unsplash.com/photo-1589793907316-f9434d0014a5?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1589793907316-f9434d0014a5?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 180,
    is_flagship: true,
    authenticity_ledger_hash: '0xaa11bb22cc33dd44ee55ff6600112233445566778899aabbccddeeff00112233',
    specifications: {
      MeltingPoint: '3,034°F (1,668°C)',
      Capacity: '24-Word BIP39 Seed Phrase',
      Fasteners: 'Torx Security Screws with Tamper Wire',
      Weight: '380g'
    },
    likes: 82,
    dislikes: 0,
    rating: 4.99,
    reviews_count: 36,
    poll_data: {
      question: 'Preferred stamping mechanism:',
      options: [
        { id: 1, text: 'Center-Punch Indenter', votes: 55 },
        { id: 2, text: 'Rotary Engraving Pen', votes: 45 }
      ]
    }
  },
  {
    id: 'fmp-hw-004',
    name: 'Sovereign AirGap Biometric Signer V2',
    tagline: 'Camera-Based QR Signer with Zero Wireless Radios',
    description: 'Completely disconnected cold signer that eliminates Wi-Fi, Bluetooth, cellular, and NFC interfaces. Signs blockchain payloads exclusively via animated QR codes.',
    price: 390.0,
    priceFic: 780.0,
    currency: 'FIC',
    category: 'Hardware & Security',
    sku: 'FMP-AIRGAP-SIGNER-04',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 65,
    is_flagship: true,
    authenticity_ledger_hash: '0x99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa',
    specifications: {
      Display: '4.0-inch High-Contrast IPS',
      Camera: '5MP OmniVision Ultra-Fast QR Reader',
      Security: 'Self-Destruct PIN Anti-Tamper Mesh',
      Battery: 'Removable 2,000mAh Lithium Cell'
    },
    likes: 110,
    dislikes: 2,
    rating: 4.95,
    reviews_count: 41,
    poll_data: {
      question: 'Include optical privacy filter out-of-the-box?',
      options: [
        { id: 1, text: 'Yes, pre-installed', votes: 88 },
        { id: 2, text: 'Keep clear glass', votes: 12 }
      ]
    }
  },
  {
    id: 'fmp-hw-005',
    name: 'FingerMobile CyberMesh Node Router Pro',
    tagline: 'Decentralized P2P Encrypted Routing Gateway',
    description: 'High-throughput hardware router running the FingerMobile P2P mesh kernel. Routes encrypted VoiceLines and media clashes anonymously across local peer swarms.',
    price: 520.0,
    priceFic: 1040.0,
    currency: 'FIC',
    category: 'Hardware & Security',
    sku: 'FMP-CYBERMESH-ROUTER-05',
    images: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 80,
    is_flagship: true,
    authenticity_ledger_hash: '0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff',
    specifications: {
      Throughput: '10 Gbps WireGuard Hardware Offload',
      RAM: '8GB DDR4 ECC',
      Storage: '128GB NVMe Local State Cache',
      Ports: '4x 2.5G SFP+ & 2x 10G Ethernet'
    },
    likes: 95,
    dislikes: 3,
    rating: 4.91,
    reviews_count: 32,
    poll_data: {
      question: 'Support custom OpenWRT plugin repository?',
      options: [
        { id: 1, text: 'Full OpenWRT Repo', votes: 64 },
        { id: 2, text: 'Curated Protocol Store', votes: 36 }
      ]
    }
  },
  {
    id: 'fmp-hw-006',
    name: 'Quantum-Safe YubiPass Multi-Protocol FOB',
    tagline: 'Hardware FIDO2 WebAuthn Key with Kyber512 PQC',
    description: 'Pocket-sized cryptographic security key featuring post-quantum Kyber lattice cryptography. Protects your FingerMobile Master SuperAdmin login against quantum adversaries.',
    price: 95.0,
    priceFic: 190.0,
    currency: 'FIC',
    category: 'Hardware & Security',
    sku: 'FMP-FOB-KYBER-06',
    images: ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 320,
    is_flagship: true,
    authenticity_ledger_hash: '0x7766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa9988',
    specifications: {
      Standards: 'FIDO2, U2F, OpenPGP, PIV',
      WaterResistance: 'IP68 Submersible up to 3m',
      Interface: 'Dual USB-C & Contactless NFC',
      Dimensions: '45mm x 18mm x 3mm'
    },
    likes: 140,
    dislikes: 1,
    rating: 4.97,
    reviews_count: 52,
    poll_data: {
      question: 'Preferred casing finish:',
      options: [
        { id: 1, text: 'Anodized Stealth Onyx', votes: 72 },
        { id: 2, text: 'Electric Sovereign Orange', votes: 28 }
      ]
    }
  },
  {
    id: 'fmp-hw-007',
    name: 'Faraday Shielded Sovereign Traveler Pouch',
    tagline: 'Military-Grade RF, GPS & EMP Signal Attenuation Case',
    description: 'Double-stitched Faraday pouch manufactured with multi-layer copper and nickel shielding fabrics. Blocks 100% of RF, RFID, cellular, satellite, and EMF signals instantaneously.',
    price: 65.0,
    priceFic: 130.0,
    currency: 'FIC',
    category: 'Hardware & Security',
    sku: 'FMP-FARADAY-POUCH-07',
    images: ['https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 410,
    is_flagship: true,
    authenticity_ledger_hash: '0x4433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa9988776655',
    specifications: {
      Attenuation: '100dB (1MHz to 10GHz)',
      Closure: 'Dual Magnetic Roller Seal',
      Capacity: 'Fits Keycard, Phone, and HSM Module',
      Exterior: 'Waterproof 1000D Ballistic Nylon'
    },
    likes: 88,
    dislikes: 2,
    rating: 4.89,
    reviews_count: 24,
    poll_data: {
      question: 'Add molle attachment loops to exterior?',
      options: [
        { id: 1, text: 'Yes, add molle straps', votes: 61 },
        { id: 2, text: 'Keep minimalist sleek', votes: 39 }
      ]
    }
  },
  {
    id: 'fmp-hw-008',
    name: 'Biometric USB-C FingerVault Drive (1TB)',
    tagline: 'On-Device Hardware Fingerprint Encrypted Solid-State Drive',
    description: 'Hardware-encrypted high-speed solid-state drive with capacitive 360-degree biometric fingerprint sensor. AES-XTS 256-bit encryption runs directly on the storage controller.',
    price: 180.0,
    priceFic: 360.0,
    currency: 'FIC',
    category: 'Hardware & Security',
    sku: 'FMP-FINGERVAULT-1TB-08',
    images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 115,
    is_flagship: true,
    authenticity_ledger_hash: '0x554433221100aabbccddeeff99887766554433221100aabbccddeeff99887766',
    specifications: {
      ReadSpeed: 'Up to 1,050 MB/s',
      WriteSpeed: 'Up to 1,000 MB/s',
      Fingerprints: 'Stores up to 10 administrator prints',
      Chassis: 'Solid milled aircraft aluminum'
    },
    likes: 104,
    dislikes: 1,
    rating: 4.93,
    reviews_count: 37,
    poll_data: {
      question: 'Offer 2TB & 4TB storage variants?',
      options: [
        { id: 1, text: 'Yes, launch 2TB & 4TB', votes: 83 },
        { id: 2, text: '1TB is sufficient', votes: 17 }
      ]
    }
  },
  {
    id: 'fmp-hw-009',
    name: 'Sovereign Tamper-Evident Physical Seal Kit (Pack of 50)',
    tagline: 'Serialized Holographic Void Seals with Blockchain Verification',
    description: 'Industrial holographic security seals engineered for cold storage envelopes, device ports, and server chassis. Leaves an indelible VOID honeycomb footprint if peeled.',
    price: 45.0,
    priceFic: 90.0,
    currency: 'FIC',
    category: 'Hardware & Security',
    sku: 'FMP-SEAL-KIT-09',
    images: ['https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 500,
    is_flagship: true,
    authenticity_ledger_hash: '0x66554433221100aabbccddeeff99887766554433221100aabbccddeeff998877',
    specifications: {
      Adhesive: 'Permanent High-Tack Acrylic',
      Security: 'Unique Sequential Hex Serial Code',
      Verification: 'Scan QR to verify serial on blockchain',
      Quantity: '50 numbered seals per sheet'
    },
    likes: 71,
    dislikes: 0,
    rating: 4.88,
    reviews_count: 19,
    poll_data: {
      question: 'Request custom corporate logo watermark?',
      options: [
        { id: 1, text: 'Standard Protocol Crest', votes: 52 },
        { id: 2, text: 'Custom Enterprise Seal', votes: 48 }
      ]
    }
  },
  {
    id: 'fmp-hw-010',
    name: 'Guardian Node Micro-Server Mini (16GB)',
    tagline: 'Silent Aluminum Fanless Blockchain Verification Server',
    description: 'Compact plug-and-play validator server preloaded with FingerMobile sovereign daemon. Validates transactions, syncs state trees, and operates a 24/7 personal vault node with 8W power draw.',
    price: 640.0,
    priceFic: 1280.0,
    currency: 'FIC',
    category: 'Hardware & Security',
    sku: 'FMP-NODE-SERVER-10',
    images: ['https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 35,
    is_flagship: true,
    authenticity_ledger_hash: '0x887766554433221100aabbccddeeff99887766554433221100aabbccddeeff99',
    specifications: {
      Processor: 'Quad-Core 2.8GHz 64-Bit RISC-V SoC',
      RAM: '16GB LPDDR5 ECC',
      Drive: '1TB Gen4 NVMe Preloaded with Protocol OS',
      Power: 'USB-C PD 15W Max Draw'
    },
    likes: 125,
    dislikes: 2,
    rating: 4.98,
    reviews_count: 34,
    poll_data: {
      question: 'Add automated UPS battery backup module?',
      options: [
        { id: 1, text: 'Yes, integrated battery', votes: 79 },
        { id: 2, text: 'External power only', votes: 21 }
      ]
    }
  },

  // --- 2. Wearables & IoT (10 items) ---
  {
    id: 'fmp-wt-001',
    name: 'FingerMobile Neural Nexus Comm-Badge',
    tagline: 'Wearable Voice & Haptic Protocol Transceiver',
    description: 'Flagship biometric wearable designed for instant push-to-talk VoiceLines, real-time Dancia-4Tv streams, and haptic feedback during BeatwaveNG listening sessions.',
    price: 299.0,
    priceFic: 598.0,
    currency: 'FIC',
    category: 'Wearables & IoT',
    sku: 'FMP-NEXUS-COMM-02',
    images: ['https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 120,
    is_flagship: true,
    authenticity_ledger_hash: '0x41ab9823ce90df7812bc3451098ef1a7234908bcda1248901234acde56781290',
    specifications: {
      Battery: '72 Hours Continuous',
      Connectivity: 'Bluetooth 5.4 + Wi-Fi 6E + Protocol Mesh',
      Mic: 'Beamforming Quad Array',
      Weight: '28 grams'
    },
    likes: 89,
    dislikes: 2,
    rating: 4.92,
    reviews_count: 31,
    poll_data: {
      question: 'Which next feature would you like to see on Comm-Badge?',
      options: [
        { id: 1, text: 'Offline Mesh Relaying', votes: 56 },
        { id: 2, text: 'Haptic Beatwave Metronome', votes: 34 }
      ]
    }
  },
  {
    id: 'fmp-wt-002',
    name: 'Sovereign Pulse Biometric Smart Ring V1',
    tagline: 'Titanium Ceramic NFC Payment & Continuous Health Telemetry',
    description: 'Ultra-thin, hypoallergenic smart ring with embedded biometric NFC contactless payment chip and clinical-grade PPG sensors for heart rate variability, sleep stages, and stress score tracking.',
    price: 240.0,
    priceFic: 480.0,
    currency: 'FIC',
    category: 'Wearables & IoT',
    sku: 'FMP-RING-PULSE-02',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 90,
    is_flagship: true,
    authenticity_ledger_hash: '0x2233445566778899aabbccddeeff00112233445566778899aabbccddeeff0011',
    specifications: {
      Material: 'Medical Grade Zirconia Ceramic & Titanium Core',
      WaterResistance: '10 ATM (100 meters dive rating)',
      BatteryLife: '7 days on single charge',
      Sensors: 'Dual Optical PPG, Skin Temp, Accelerometer'
    },
    likes: 114,
    dislikes: 3,
    rating: 4.94,
    reviews_count: 42,
    poll_data: {
      question: 'Preferred ring finish:',
      options: [
        { id: 1, text: 'Matte Stealth Black', votes: 68 },
        { id: 2, text: 'Brushed Polished Silver', votes: 32 }
      ]
    }
  },
  {
    id: 'fmp-wt-003',
    name: 'Haptic Beatwave Audio Wristband',
    tagline: 'Vibrotactile Sub-Bass Physical Transducer for Music Immersion',
    description: 'Wearable haptic wristband that translates audio frequencies from BeatwaveNG into bone-conduction vibrations. Feel every bass kick and sub-frequency drop physically across your wrist.',
    price: 130.0,
    priceFic: 260.0,
    currency: 'FIC',
    category: 'Wearables & IoT',
    sku: 'FMP-HAPTIC-BAND-03',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 140,
    is_flagship: true,
    authenticity_ledger_hash: '0x77889900aabbccddeeff11223344556677889900aabbccddeeff112233445566',
    specifications: {
      Actuators: 'Dual Linear Resonant Actuators (LRA)',
      FrequencyRange: '10Hz to 250Hz tactile bass response',
      Latency: '<5ms ultra-low latency bluetooth audio sync',
      Battery: '12 hours continuous rhythmic playback'
    },
    likes: 76,
    dislikes: 1,
    rating: 4.88,
    reviews_count: 26,
    poll_data: {
      question: 'Integrate live gaming clash vibrations?',
      options: [
        { id: 1, text: 'Yes, gaming haptics', votes: 81 },
        { id: 2, text: 'Audio only', votes: 19 }
      ]
    }
  },
  {
    id: 'fmp-wt-004',
    name: 'Sovereign Smart Glass HUD Eyewear',
    tagline: 'Micro-OLED Augmented Display with Live Stream Overlay',
    description: 'Lightweight smart eyewear providing a crisp transparent heads-up display. Stream Dancia-4Tv cinema channels, view incoming VoiceLines notifications, and monitor wallet balances hands-free.',
    price: 450.0,
    priceFic: 900.0,
    currency: 'FIC',
    category: 'Wearables & IoT',
    sku: 'FMP-GLASS-HUD-04',
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 50,
    is_flagship: true,
    authenticity_ledger_hash: '0x33221100ffeeddccbbaa99887766554433221100ffeeddccbbaa998877665544',
    specifications: {
      Display: 'Dual Sony 1080p Micro-OLED Waveguide',
      FOV: '38-Degree Field of View equivalent to 100-inch screen',
      Audio: 'Open-Ear Directional Stereo Speakers',
      Weight: '68 grams'
    },
    likes: 135,
    dislikes: 4,
    rating: 4.96,
    reviews_count: 48,
    poll_data: {
      question: 'Offer prescription lens insert program?',
      options: [
        { id: 1, text: 'Yes, prescription frames', votes: 91 },
        { id: 2, text: 'Standard sunglasses only', votes: 9 }
      ]
    }
  },
  {
    id: 'fmp-wt-005',
    name: 'Neural Bio-Sense Earbuds with EEG Sensing',
    tagline: 'Studio Audio Earbuds with Cognitive Focus & State Tracking',
    description: 'Audiophile true-wireless earbuds equipped with electroencephalogram (EEG) electrodes along the ear canal. Measures cognitive focus and automatically adapts sound equalizers.',
    price: 320.0,
    priceFic: 640.0,
    currency: 'FIC',
    category: 'Wearables & IoT',
    sku: 'FMP-EARBUDS-EEG-05',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 85,
    is_flagship: true,
    authenticity_ledger_hash: '0x9900aabbccddeeff11223344556677889900aabbccddeeff1122334455667788',
    specifications: {
      Drivers: '10mm Beryllium Dynamic + Knowles Balanced Armature',
      Codecs: 'LDAC, LHDC, aptX Lossless, AAC',
      EEGChannels: '4-Point In-Canal Silver Electrodes',
      Battery: '8 hours (32 hours with charging case)'
    },
    likes: 92,
    dislikes: 2,
    rating: 4.93,
    reviews_count: 33,
    poll_data: {
      question: 'Integrate binaural focus soundscapes?',
      options: [
        { id: 1, text: 'Yes, pre-loaded tracks', votes: 74 },
        { id: 2, text: 'External music only', votes: 26 }
      ]
    }
  },
  {
    id: 'fmp-wt-006',
    name: 'NFC Identity Signet Ring (Matte Black)',
    tagline: 'Ceramic Dual-Chip Contactless Protocol Key & Digital Business Card',
    description: 'Sleek matte black zirconia ring carrying two independent NFC chips. The top chip broadcasts your verified sovereign profile and the bottom chip handles encrypted door and vault entry.',
    price: 110.0,
    priceFic: 220.0,
    currency: 'FIC',
    category: 'Wearables & IoT',
    sku: 'FMP-SIGNET-NFC-06',
    images: ['https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 210,
    is_flagship: true,
    authenticity_ledger_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    specifications: {
      Chips: '2x NTAG216 High-Capacity Rewritable NFC',
      Frequency: '13.56 MHz ISO 14443A',
      Comfort: 'Comfort-fit curved interior band',
      Sizes: 'US 7 through US 13 available'
    },
    likes: 85,
    dislikes: 1,
    rating: 4.90,
    reviews_count: 27,
    poll_data: {
      question: 'Produce Rose Gold ceramic variation?',
      options: [
        { id: 1, text: 'Yes, produce Rose Gold', votes: 53 },
        { id: 2, text: 'Stick to Black/Silver', votes: 47 }
      ]
    }
  },
  {
    id: 'fmp-wt-007',
    name: 'Guardian Vitality Health & Stress Band',
    tagline: 'Continuous Electro-Dermal Activity & HRV Monitoring Band',
    description: 'Screenless health wristband focused on pure physiological recovery. Transmits encrypted bio-metrics directly to your local vault without sending unencrypted health data to third-party clouds.',
    price: 175.0,
    priceFic: 350.0,
    currency: 'FIC',
    category: 'Wearables & IoT',
    sku: 'FMP-VITALITY-BAND-07',
    images: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 130,
    is_flagship: true,
    authenticity_ledger_hash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    specifications: {
      Sensors: 'Micro-EDA (Stress), Continuous SpO2, Skin Temp',
      Battery: '10 days between charges',
      Storage: '30-day offline biometric logging buffer',
      Strap: 'Recycled ocean polyester elastic loop'
    },
    likes: 99,
    dislikes: 2,
    rating: 4.91,
    reviews_count: 35,
    poll_data: {
      question: 'Allow biometric data sharing with personal trainers?',
      options: [
        { id: 1, text: 'Opt-in encrypted sharing', votes: 65 },
        { id: 2, text: 'Strictly zero-sharing local', votes: 35 }
      ]
    }
  },
  {
    id: 'fmp-wt-008',
    name: 'Sovereign Protocol Smart Lanyard Badge',
    tagline: 'E-Ink Programmable Electronic Event Ticket & ID Credential',
    description: 'Smart conference and VIP access credential with a 2.9-inch sunlight-readable 3-color e-ink screen. Displays dynamic QR codes that refresh every 30 seconds for fraud-proof entry.',
    price: 85.0,
    priceFic: 170.0,
    currency: 'FIC',
    category: 'Wearables & IoT',
    sku: 'FMP-EINK-BADGE-08',
    images: ['https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 280,
    is_flagship: true,
    authenticity_ledger_hash: '0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
    specifications: {
      Screen: '2.9-inch Red/Black/White Electronic Paper Display',
      Battery: 'Up to 6 months per coin cell battery',
      Connectivity: 'Bluetooth 5.0 Low Energy',
      Enclosure: 'Sleek frosted polycarbonate'
    },
    likes: 67,
    dislikes: 0,
    rating: 4.87,
    reviews_count: 22,
    poll_data: {
      question: 'Support custom wallpaper avatars on e-ink?',
      options: [
        { id: 1, text: 'Yes, custom avatar artwork', votes: 84 },
        { id: 2, text: 'Simple text QR code', votes: 16 }
      ]
    }
  },
  {
    id: 'fmp-wt-009',
    name: 'IoT Ambient Beacon Protocol Tracker',
    tagline: 'Ultra-Wideband Asset Locator & Geofence Sensor',
    description: 'Precision physical locator utilizing Ultra-Wideband (UWB) spatial tracking. Pairs directly with the FingerMobile app to pinpoint equipment, luggage, and hardware vaults down to 2 inches.',
    price: 70.0,
    priceFic: 140.0,
    currency: 'FIC',
    category: 'Wearables & IoT',
    sku: 'FMP-UWB-BEACON-09',
    images: ['https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 340,
    is_flagship: true,
    authenticity_ledger_hash: '0x0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20',
    specifications: {
      Precision: 'Within 5 cm utilizing DecaWave UWB transceiver',
      Network: 'Crowdsourced encrypted mesh beacon network',
      Battery: 'User-replaceable CR2032 (over 14 months life)',
      WaterRating: 'IP67 Dust & Water sealed'
    },
    likes: 80,
    dislikes: 1,
    rating: 4.89,
    reviews_count: 25,
    poll_data: {
      question: 'Add adhesive magnet backing?',
      options: [
        { id: 1, text: 'Magnetic backing', votes: 59 },
        { id: 2, text: 'Keyring hole only', votes: 41 }
      ]
    }
  },
  {
    id: 'fmp-wt-010',
    name: 'Biometric Fingerprint Padlock V4',
    tagline: 'IP67 Waterproof Heavy-Duty Keyless Zinc Alloy Vault Lock',
    description: 'Rugged biometric security padlock forged from high-tensile zinc alloy and stainless steel shackle. Unlocks in 0.2 seconds via capacitive fingerprint sensor for travel cases and gear lockers.',
    price: 55.0,
    priceFic: 110.0,
    currency: 'FIC',
    category: 'Wearables & IoT',
    sku: 'FMP-LOCK-BIOMETRIC-10',
    images: ['https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 195,
    is_flagship: true,
    authenticity_ledger_hash: '0x201f1e1d1c1b1a191817161514131211100f0e0d0c0b0a090807060504030201',
    specifications: {
      Sensor: 'Semiconductor 360-degree Biometric Reader',
      Memory: 'Supports 2 Admin + 18 Member Fingerprints',
      Charging: 'USB-C Rechargeable (up to 3,000 unlocks per charge)',
      Shackle: 'Hardened 6mm stainless steel anti-cut bar'
    },
    likes: 102,
    dislikes: 2,
    rating: 4.92,
    reviews_count: 36,
    poll_data: {
      question: 'Include backup emergency mechanical key?',
      options: [
        { id: 1, text: 'Include mechanical backup', votes: 71 },
        { id: 2, text: 'Biometric only (100% keyless)', votes: 29 }
      ]
    }
  },

  // --- 3. Flagship Apparel (10 items) ---
  {
    id: 'fmp-ap-001',
    name: 'Protocol Sovereign Founder Hooded Parka',
    tagline: 'Weatherproof Smart-Fabric Flagship Apparel with Embedded NFC Tag',
    description: 'Crafted from sustainable recycled graphene technical membrane. Embeds an NFC chip linking to your verified FingerMobile profile and Hallmarks score.',
    price: 220.0,
    priceFic: 440.0,
    currency: 'FIC',
    category: 'Flagship Apparel',
    sku: 'FMP-APPAREL-PARKA-01',
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 75,
    is_flagship: true,
    authenticity_ledger_hash: '0x17bfa98234cd01928374650192837465acbde019283746501928374650192837',
    specifications: {
      Fabric: '3-Layer Graphene Membrane',
      Waterproof: '20,000 mm',
      NFC: 'Profile + Hallmarks Token',
      Tailoring: 'Ethically Tailored Milan'
    },
    likes: 64,
    dislikes: 1,
    rating: 4.89,
    reviews_count: 22,
    poll_data: {
      question: 'Vote on the next limited edition colorway:',
      options: [
        { id: 1, text: 'Emerald Obsidian', votes: 48 },
        { id: 2, text: 'Champagne White', votes: 19 }
      ]
    }
  },
  {
    id: 'fmp-ap-002',
    name: 'Cyberpunk Tactical Cargo Utility Pants',
    tagline: 'Modular Ripstop Techwear Trousers with RFID-Shielded Pockets',
    description: 'Engineered utility pants constructed from water-repellent Cordura ripstop. Features 8 modular utility pockets including an RFID-shielded inner compartment for cold keys.',
    price: 140.0,
    priceFic: 280.0,
    currency: 'FIC',
    category: 'Flagship Apparel',
    sku: 'FMP-CARGO-PANTS-02',
    images: ['https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 95,
    is_flagship: true,
    authenticity_ledger_hash: '0x33441122aabb556677889900ccddeeff11223344556677889900aabbccddeeff',
    specifications: {
      Material: 'Cordura 500D Ripstop + 4-Way Stretch Spandex',
      Hardware: 'YKK Aquaguard Zippers & Fidlock Magnetic Buckles',
      Pockets: '8 Ergonomic Pockets with 1 Faradaic Phone Sleeve',
      Fit: 'Tapered athletic silhouette with adjustable ankle cuff'
    },
    likes: 118,
    dislikes: 2,
    rating: 4.95,
    reviews_count: 39,
    poll_data: {
      question: 'Include detachable utility pouch on thigh?',
      options: [
        { id: 1, text: 'Yes, detachable pouch', votes: 76 },
        { id: 2, text: 'Fixed streamlined pocket', votes: 24 }
      ]
    }
  },
  {
    id: 'fmp-ap-003',
    name: 'FingerMobile Heavyweight Oversized Hoodie',
    tagline: '500 GSM French Terry Cotton with Metallic 3D Crest Embroidery',
    description: 'Ultra-luxurious heavyweight hoodie tailored from 100% pre-shrunk organic cotton. Features custom metallic embroidery of the official FingerMobile Sovereign emblem across the chest.',
    price: 95.0,
    priceFic: 190.0,
    currency: 'FIC',
    category: 'Flagship Apparel',
    sku: 'FMP-HOODIE-500GSM-03',
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 160,
    is_flagship: true,
    authenticity_ledger_hash: '0x889900aabbccddeeff11223344556677889900aabbccddeeff11223344556677',
    specifications: {
      Weight: '500 GSM Heavyweight Loopback French Terry',
      Cotton: '100% GOTS Certified Organic Cotton',
      Hood: 'Double-layered structured hood with no drawstrings',
      Colorways: 'Sovereign Pitch Black & Bone Ivory'
    },
    likes: 145,
    dislikes: 1,
    rating: 4.98,
    reviews_count: 53,
    poll_data: {
      question: 'Next hoodie colorway drop:',
      options: [
        { id: 1, text: 'Cyberpunk Neon Orange', votes: 63 },
        { id: 2, text: 'Mineral Slate Heather', votes: 37 }
      ]
    }
  },
  {
    id: 'fmp-ap-004',
    name: 'Sovereign Stealth Waterproof Bomber Jacket',
    tagline: 'Windproof Technical MA-1 Flight Jacket with Laser-Cut Vents',
    description: 'Modernized technical flight bomber featuring waterproof matte DWR coating and magnetic front closures. Lined with breathable metallic thermal mesh to regulate body temperature.',
    price: 185.0,
    priceFic: 370.0,
    currency: 'FIC',
    category: 'Flagship Apparel',
    sku: 'FMP-BOMBER-STEALTH-04',
    images: ['https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 80,
    is_flagship: true,
    authenticity_ledger_hash: '0xbbccddeeff0011223344556677889900aabbccddeeff00112233445566778899',
    specifications: {
      Outer: 'Matte DWR 3-Ply Micro-Ripstop',
      Insulation: 'PrimaLoft Eco 80g Lightweight Fill',
      Zippers: 'Matte Black YKK Water-Resistant Reverse Coils',
      Cuffs: 'Heavy Ribbed Wool Blend Storm Cuffs'
    },
    likes: 91,
    dislikes: 2,
    rating: 4.92,
    reviews_count: 31,
    poll_data: {
      question: 'Include internal shoulder carry harness strap?',
      options: [
        { id: 1, text: 'Yes, add harness straps', votes: 82 },
        { id: 2, text: 'Standard lining only', votes: 18 }
      ]
    }
  },
  {
    id: 'fmp-ap-005',
    name: 'Protocol Minimalist Embroidered Tee (Obsidian)',
    tagline: '280 GSM Luxury Heavy Combed Cotton with High-Density Collar',
    description: 'Premium daily essentials tee crafted with dense, silky combed cotton that retains its boxy drape wash after wash. Finished with a subtle high-density tonal rubber protocol logo at the nape.',
    price: 45.0,
    priceFic: 90.0,
    currency: 'FIC',
    category: 'Flagship Apparel',
    sku: 'FMP-TEE-OBSIDIAN-05',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 260,
    is_flagship: true,
    authenticity_ledger_hash: '0x102030405060708090a0b0c0d0e0f0112233445566778899aabbccddeeff0011',
    specifications: {
      Weight: '280 GSM Long-Staple Combed Cotton',
      Collar: 'Thick 1.25-inch 1x1 ribbed lay-flat collar',
      Fit: 'Modern boxy drop-shoulder cut',
      Treatment: 'Silicon bio-wash for ultra-smooth handfeel'
    },
    likes: 130,
    dislikes: 1,
    rating: 4.96,
    reviews_count: 47,
    poll_data: {
      question: 'Release 3-pack bundle with discounted pricing?',
      options: [
        { id: 1, text: 'Yes, 3-pack bundle', votes: 89 },
        { id: 2, text: 'Single purchases only', votes: 11 }
      ]
    }
  },
  {
    id: 'fmp-ap-006',
    name: 'NFC Smart Crest Streetwear Cap',
    tagline: 'Structured 6-Panel Wool Blend Cap with Embedded NFC Tap Chip',
    description: 'Structured flat-brim cap featuring 3D embroidered protocol emblem. An integrated wash-safe micro-NFC chip inside the brim allows anyone to tap their phone and load your verified profile.',
    price: 50.0,
    priceFic: 100.0,
    currency: 'FIC',
    category: 'Flagship Apparel',
    sku: 'FMP-CAP-NFC-06',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 175,
    is_flagship: true,
    authenticity_ledger_hash: '0xa0b0c0d0e0f0112233445566778899aabbccddeeff00112233445566778899aa',
    specifications: {
      Material: '80% Acrylic / 20% Wool Premium Blend',
      Buckle: 'Matte black metal slide clasp with debossed logo',
      Chip: 'Waterproof NTAG213 embedded in visor',
      Sweatband: 'Moisture-wicking anti-microbial band'
    },
    likes: 84,
    dislikes: 2,
    rating: 4.88,
    reviews_count: 29,
    poll_data: {
      question: 'Offer curved brim dad-hat silhouette?',
      options: [
        { id: 1, text: 'Yes, curved brim version', votes: 67 },
        { id: 2, text: 'Keep flat-brim profile', votes: 33 }
      ]
    }
  },
  {
    id: 'fmp-ap-007',
    name: 'Reflective Night-Rider Cycling Windbreaker',
    tagline: '360-Degree Luminescent Reflective Ultra-Lightweight Shell',
    description: 'High-visibility windbreaker tailored from proprietary micro-glass-bead infused polyester. Appears sleek charcoal gray in daylight and explodes in brilliant bright silver under nighttime flash.',
    price: 125.0,
    priceFic: 250.0,
    currency: 'FIC',
    category: 'Flagship Apparel',
    sku: 'FMP-WINDBREAKER-REFLECT-07',
    images: ['https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 85,
    is_flagship: true,
    authenticity_ledger_hash: '0x1234123412341234123412341234123412341234123412341234123412341234',
    specifications: {
      Fabric: '100% Micro-Prismatic Reflective Coated Ripstop',
      Weight: 'Ultra-lightweight 190 grams packs into pocket',
      Ventilation: 'Underarm laser-cut perforation zones',
      WaterResistance: 'Light rain & windproof treatment'
    },
    likes: 78,
    dislikes: 1,
    rating: 4.90,
    reviews_count: 25,
    poll_data: {
      question: 'Add detachable storm hood?',
      options: [
        { id: 1, text: 'Yes, detachable hood', votes: 58 },
        { id: 2, text: 'Packable collar roll-in', votes: 42 }
      ]
    }
  },
  {
    id: 'fmp-ap-008',
    name: 'Sovereign Cashmere Ribbed Scarf',
    tagline: '100% Mongolian Pure Cashmere Hand-Finished Luxury Scarf',
    description: 'Sustainably combed Grade-A Mongolian cashmere knitted in a plush English rib pattern. Delivers unmatched warmth and featherlight softness with subtle tonal protocol branding.',
    price: 110.0,
    priceFic: 220.0,
    currency: 'FIC',
    category: 'Flagship Apparel',
    sku: 'FMP-SCARF-CASHMERE-08',
    images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 60,
    is_flagship: true,
    authenticity_ledger_hash: '0x5678567856785678567856785678567856785678567856785678567856785678',
    specifications: {
      Fibers: '100% Pure Mongolian Cashmere (15.5 Micron)',
      Dimensions: '180cm x 35cm (70 x 14 inches)',
      Finishing: 'Hand-rolled edges with soft fringed ends',
      Care: 'Dry clean or gentle cold hand wash'
    },
    likes: 62,
    dislikes: 0,
    rating: 4.94,
    reviews_count: 20,
    poll_data: {
      question: 'Include matching cashmere beanie set?',
      options: [
        { id: 1, text: 'Yes, gift set combo', votes: 85 },
        { id: 2, text: 'Standalone scarf only', votes: 15 }
      ]
    }
  },
  {
    id: 'fmp-ap-009',
    name: 'Executive Wool Techwear Blazer',
    tagline: 'Crease-Resistant Super 130s Merino Wool with Passport Pocket',
    description: 'Modern unconstructed tailored blazer designed for international sovereign travelers. Combines traditional Italian suiting wool with covert travel pockets and internal earphone cable routing.',
    price: 260.0,
    priceFic: 520.0,
    currency: 'FIC',
    category: 'Flagship Apparel',
    sku: 'FMP-BLAZER-TECH-09',
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 40,
    is_flagship: true,
    authenticity_ledger_hash: '0x9988998899889988998899889988998899889988998899889988998899889988',
    specifications: {
      Fabric: 'Super 130s Pure Wool with Nano-Tech Water Repellent',
      Lining: 'Half-lined lightweight cupro for breathability',
      Pockets: 'Covert zippered internal passport & keycard slots',
      Lapel: 'Sleek narrow notch lapel with magnetic collar closure'
    },
    likes: 87,
    dislikes: 1,
    rating: 4.96,
    reviews_count: 26,
    poll_data: {
      question: 'Offer bespoke tailor measurement sizing?',
      options: [
        { id: 1, text: 'Yes, custom measurements', votes: 73 },
        { id: 2, text: 'Standard S/M/L/XL sizes', votes: 27 }
      ]
    }
  },
  {
    id: 'fmp-ap-010',
    name: 'FingerMobile Official Commemorative Jersey',
    tagline: 'Breathable Moisture-Wicking Clashes & Tournament Esports Kit',
    description: 'Official athletic tournament jersey worn during the FingerWars seasonal clashes. Engineered with quick-drying performance mesh, high-contrast typography, and official sponsor badges.',
    price: 80.0,
    priceFic: 160.0,
    currency: 'FIC',
    category: 'Flagship Apparel',
    sku: 'FMP-JERSEY-CLASH-10',
    images: ['https://images.unsplash.com/photo-1580087433295-ab2600c1030e?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1580087433295-ab2600c1030e?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 200,
    is_flagship: true,
    authenticity_ledger_hash: '0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff',
    specifications: {
      Fabric: 'Aerodynamic Engineered Aero-Mesh Polyester',
      Collar: 'Ribbed athletic V-neck with stretch collar',
      Sublimation: 'Zero-fade high-definition digital sublimation',
      Weight: 'Featherweight 145 grams'
    },
    likes: 115,
    dislikes: 3,
    rating: 4.91,
    reviews_count: 40,
    poll_data: {
      question: 'Allow custom gamertag print on back?',
      options: [
        { id: 1, text: 'Yes, custom member tag', votes: 93 },
        { id: 2, text: 'Blank back jersey', votes: 7 }
      ]
    }
  },

  // --- 4. Audio Gear (10 items) ---
  {
    id: 'fmp-ag-001',
    name: 'FingerMobile Studio Audiophile Reference Monitors',
    tagline: 'Active Near-Field Studio Speakers for BeatwaveNG Master Quality',
    description: 'Tuned specifically for BeatwaveNG high-resolution audio streaming. Features custom 5-inch Kevlar woofers, 1-inch silk dome tweeters, and onboard DSP matching the 10-band Beatwave equalizer.',
    price: 480.0,
    priceFic: 960.0,
    currency: 'FIC',
    category: 'Audio Gear',
    sku: 'FMP-AUDIO-MON-5X',
    images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 40,
    is_flagship: true,
    authenticity_ledger_hash: '0x8899aabbccddeeff00112233445566778899aabbccddeeff0011223344556677',
    specifications: {
      Frequency: '38Hz - 22kHz',
      Amplifier: '140W Class D Bi-Amp',
      Inputs: 'XLR, Optical & Lossless Wi-Fi',
      DSP: 'BeatwaveNG Preset Match'
    },
    likes: 112,
    dislikes: 4,
    rating: 4.96,
    reviews_count: 38,
    poll_data: {
      question: 'Do you prefer DSP Studio Flat or Amapiano Bass default?',
      options: [
        { id: 1, text: 'Studio Flat Reference', votes: 62 },
        { id: 2, text: 'Amapiano Bass Enhanced', votes: 50 }
      ]
    }
  },
  {
    id: 'fmp-ag-002',
    name: 'Beatwave Master Open-Back Planar Headphones',
    tagline: 'Planar Magnetic Audiophile Studio Headphones with Detachable Cable',
    description: 'Precision open-back planar headphones delivering razor-sharp transient response and expansive soundstage. Custom 100mm planar transducers reproduce sub-bass and high air frequencies flawlessly.',
    price: 550.0,
    priceFic: 1100.0,
    currency: 'FIC',
    category: 'Audio Gear',
    sku: 'FMP-PLANAR-HEADPHONES-02',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 30,
    is_flagship: true,
    authenticity_ledger_hash: '0x1234aabb556677889900ccddeeff11223344556677889900aabbccddeeff1234',
    specifications: {
      Transducer: '100mm Ultra-Thin Planar Magnetic Diaphragm',
      Impedance: '32 Ohms (Easy to drive)',
      FrequencyResponse: '8Hz - 55kHz',
      Earpads: 'Perforated Lambskin & Velour Memory Foam'
    },
    likes: 142,
    dislikes: 1,
    rating: 4.99,
    reviews_count: 51,
    poll_data: {
      question: 'Include balanced 4.4mm Pentaconn cable in box?',
      options: [
        { id: 1, text: 'Yes, include 4.4mm balanced', votes: 89 },
        { id: 2, text: '3.5mm single-ended only', votes: 11 }
      ]
    }
  },
  {
    id: 'fmp-ag-003',
    name: 'Sovereign USB-C Studio Broadcast Microphone',
    tagline: '24-Bit / 192kHz Condenser Microphone with Built-In DSP Limiter',
    description: 'Gold-sputtered large-diaphragm condenser microphone designed for pristine voice clarity on VoiceLines, podcasting, and livestream broadcasts. Includes on-board headphone monitoring with zero latency.',
    price: 160.0,
    priceFic: 320.0,
    currency: 'FIC',
    category: 'Audio Gear',
    sku: 'FMP-MIC-BROADCAST-03',
    images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 95,
    is_flagship: true,
    authenticity_ledger_hash: '0x77881122aabb556677889900ccddeeff11223344556677889900aabbccdd7788',
    specifications: {
      Capsule: '25mm Gold-Vaporized Condenser',
      PolarPattern: 'Cardioid with Tight Off-Axis Rejection',
      SamplingRate: '24-Bit 192kHz Native Studio Resolution',
      Features: 'Capacitive Tap-to-Mute with LED Halo'
    },
    likes: 108,
    dislikes: 2,
    rating: 4.93,
    reviews_count: 36,
    poll_data: {
      question: 'Add onboard analog compressor button?',
      options: [
        { id: 1, text: 'Yes, hardware compressor', votes: 78 },
        { id: 2, text: 'Pure flat preamp only', votes: 22 }
      ]
    }
  },
  {
    id: 'fmp-ag-004',
    name: 'Beatwave Wireless Lossless DAC & Amp',
    tagline: 'Dual ES9038Q2M Sabre DAC with Balanced 4.4mm Output',
    description: 'Pocket audiophile digital-to-analog converter that streams lossless 24-bit 192kHz master streams over LDAC and USB-C. Easily powers demanding high-impedance headphones anywhere.',
    price: 195.0,
    priceFic: 390.0,
    currency: 'FIC',
    category: 'Audio Gear',
    sku: 'FMP-DAC-AMP-04',
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 70,
    is_flagship: true,
    authenticity_ledger_hash: '0x99001122aabb556677889900ccddeeff11223344556677889900aabbccdd9900',
    specifications: {
      DAC: 'Dual ESS Sabre ES9038Q2M in Balanced Array',
      OutputPower: 'Up to 560mW @ 32 Ohms balanced',
      BluetoothCodecs: 'LDAC, aptX Adaptive, AAC, SBC',
      Chassis: 'CNC Milled Aluminum with Glass Display'
    },
    likes: 88,
    dislikes: 1,
    rating: 4.95,
    reviews_count: 30,
    poll_data: {
      question: 'Support MQA hardware decoding?',
      options: [
        { id: 1, text: 'Focus on pure PCM / DSD', votes: 82 },
        { id: 2, text: 'Include MQA decoder', votes: 18 }
      ]
    }
  },
  {
    id: 'fmp-ag-005',
    name: 'Near-Field Desktop Subwoofer (8-inch 200W)',
    tagline: 'Precision Low-Frequency Studio Sub with Foot Switch Bypass',
    description: 'Down-firing 8-inch composite cone studio subwoofer designed to augment near-field monitors down to 24Hz with zero port turbulence. Features wireless bypass pedal to switch quickly between full-range and reference.',
    price: 340.0,
    priceFic: 680.0,
    currency: 'FIC',
    category: 'Audio Gear',
    sku: 'FMP-SUB-8INCH-05',
    images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 35,
    is_flagship: true,
    authenticity_ledger_hash: '0x33449900aabb556677889900ccddeeff11223344556677889900aabbccdd3344',
    specifications: {
      Power: '200W RMS Class D High-Efficiency Amp',
      LowCutoff: '24Hz (-3dB acoustic response)',
      Crossover: 'Variable 50Hz - 130Hz with 24dB/octave slope',
      Phase: 'Continuously variable 0 to 180 degrees'
    },
    likes: 67,
    dislikes: 1,
    rating: 4.91,
    reviews_count: 23,
    poll_data: {
      question: 'Include auto-standby power saving mode?',
      options: [
        { id: 1, text: 'Yes, auto-standby power save', votes: 75 },
        { id: 2, text: 'Always active on', votes: 25 }
      ]
    }
  },
  {
    id: 'fmp-ag-006',
    name: 'FingerMobile In-Ear Audio Monitors (Quad-BA)',
    tagline: 'Custom Tuned 4-Balanced Armature In-Ear Stage & Studio IEMs',
    description: 'Professional multi-driver in-ear monitors equipped with 4 precision balanced armature drivers per ear. Features 3-way passive crossover tuned for detailed vocal separation and tight kick punch.',
    price: 275.0,
    priceFic: 550.0,
    currency: 'FIC',
    category: 'Audio Gear',
    sku: 'FMP-IEM-QUAD-06',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 75,
    is_flagship: true,
    authenticity_ledger_hash: '0x55669900aabb556677889900ccddeeff11223344556677889900aabbccdd5566',
    specifications: {
      Drivers: '4x Knowles Balanced Armatures (1 Low, 2 Mid, 1 High)',
      Sensitivity: '112 dB SPL/mW @ 1kHz',
      NoiseIsolation: 'Up to -26dB passive ambient isolation',
      Cable: '8-core silver-plated copper MMCX braided cable'
    },
    likes: 97,
    dislikes: 2,
    rating: 4.94,
    reviews_count: 34,
    poll_data: {
      question: 'Offer custom mold ear impression service?',
      options: [
        { id: 1, text: 'Yes, custom molds option', votes: 83 },
        { id: 2, text: 'Universal fit silicone tips', votes: 17 }
      ]
    }
  },
  {
    id: 'fmp-ag-007',
    name: 'Professional Broadcast Boom Arm & Shockmount',
    tagline: 'Internal Spring Silence Suspension Arm with Integrated Cable Channel',
    description: 'Heavy-duty broadcast microphone boom arm engineered with fully concealed internal springs and tension friction hinges. Swivels 360 degrees smoothly with zero squeaking on live audio feeds.',
    price: 75.0,
    priceFic: 150.0,
    currency: 'FIC',
    category: 'Audio Gear',
    sku: 'FMP-BOOM-ARM-07',
    images: ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 180,
    is_flagship: true,
    authenticity_ledger_hash: '0x77889900aabb556677889900ccddeeff11223344556677889900aabbccdd7788',
    specifications: {
      Reach: '38 inches (96 cm) horizontal and vertical reach',
      Payload: 'Supports microphones up to 2.2 kg (4.8 lbs)',
      Mounting: 'C-clamp desk mount (up to 60mm) & desk insert',
      CableGuide: 'Clip-on hidden channel for XLR & USB lines'
    },
    likes: 83,
    dislikes: 1,
    rating: 4.88,
    reviews_count: 28,
    poll_data: {
      question: 'Include integrated USB-C extension cable in arm?',
      options: [
        { id: 1, text: 'Yes, pre-routed USB-C', votes: 71 },
        { id: 2, text: 'Route own cables', votes: 29 }
      ]
    }
  },
  {
    id: 'fmp-ag-008',
    name: 'Active Noise-Cancelling Travel Headphones',
    tagline: 'Hybrid Triple-Mic ANC with 45-Hour Battery & Transparency Mode',
    description: 'Over-ear noise-cancelling headphones engineered for long-haul flights and loud open environments. Silences engine hum and chatter up to -38dB while preserving crisp dynamic audio.',
    price: 230.0,
    priceFic: 460.0,
    currency: 'FIC',
    category: 'Audio Gear',
    sku: 'FMP-ANC-TRAVEL-08',
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 90,
    is_flagship: true,
    authenticity_ledger_hash: '0x11229900aabb556677889900ccddeeff11223344556677889900aabbccdd1122',
    specifications: {
      NoiseReduction: 'Hybrid Feedforward & Feedback Active ANC',
      BatteryLife: '45 hours with ANC engaged (60 hours without)',
      FastCharge: '10 min charge yields 5 hours playback',
      Microphones: '4-Mic array with AI environmental noise reduction'
    },
    likes: 105,
    dislikes: 2,
    rating: 4.93,
    reviews_count: 37,
    poll_data: {
      question: 'Which voice assistant integration do you prefer?',
      options: [
        { id: 1, text: 'Guardian AI Assistant', votes: 86 },
        { id: 2, text: 'Phone default assistant', votes: 14 }
      ]
    }
  },
  {
    id: 'fmp-ag-009',
    name: 'Lossless Audio Streamer & Network Bridge',
    tagline: 'Wi-Fi 6E Bit-Perfect Transport for Hi-Fi Receivers & Studio DACs',
    description: 'Dedicated network audio bridge that connects your existing stereo system to the BeatwaveNG cloud. Streams bit-perfect 24-bit 192kHz PCM and DSD256 over optical, coaxial, and USB outputs.',
    price: 310.0,
    priceFic: 620.0,
    currency: 'FIC',
    category: 'Audio Gear',
    sku: 'FMP-STREAMER-BRIDGE-09',
    images: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 50,
    is_flagship: true,
    authenticity_ledger_hash: '0x33445566aabb556677889900ccddeeff11223344556677889900aabbccdd3344',
    specifications: {
      Clock: 'Dual Ultra-Low Phase Noise Femtosecond Oscillators',
      Outputs: 'USB Audio 2.0, SPDIF Optical, Coaxial, I2S HDMI',
      Protocols: 'BeatwaveNG Connect, AirPlay 2, DLNA, Roon Ready',
      PowerSupply: 'Internal ultra-quiet linear toroidal transformer'
    },
    likes: 73,
    dislikes: 0,
    rating: 4.97,
    reviews_count: 24,
    poll_data: {
      question: 'Add front-panel color OLED album art display?',
      options: [
        { id: 1, text: 'Yes, album art display', votes: 80 },
        { id: 2, text: 'Minimalist stealth front', votes: 20 }
      ]
    }
  },
  {
    id: 'fmp-ag-010',
    name: 'Compact DJ Performance Controller & Mixer',
    tagline: '2-Channel Motorized Platter Controller with Hardware Stems Separation',
    description: 'Portable performance controller tailored for Beatwave live clashes and mobile DJs. Features motorized jog wheels with direct-drive vinyl feel and dedicated knobs to isolate vocals, drums, and bass in real time.',
    price: 290.0,
    priceFic: 580.0,
    currency: 'FIC',
    category: 'Audio Gear',
    sku: 'FMP-DJ-CONTROLLER-10',
    images: ['https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80'],
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    stock_quantity: 60,
    is_flagship: true,
    authenticity_ledger_hash: '0x55667788aabb556677889900ccddeeff11223344556677889900aabbccdd5566',
    specifications: {
      JogWheels: 'Motorized 7-inch Aluminum Platters with Acrylic Vinyl Slipmats',
      Pads: '16 RGB Backlit Performance Pads with Polyphonic Aftertouch',
      AudioInterface: 'Built-in 24-Bit 48kHz High-Output Interface with XLR Outs',
      Software: 'Direct BeatwaveNG Clashes Engine Integration'
    },
    likes: 121,
    dislikes: 2,
    rating: 4.95,
    reviews_count: 44,
    poll_data: {
      question: 'Include standalone USB drive playback without laptop?',
      options: [
        { id: 1, text: 'Yes, standalone playback', votes: 87 },
        { id: 2, text: 'Controller mode only', votes: 13 }
      ]
    }
  }
];
