import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import {
  Trophy,
  Flame,
  Shield,
  Zap,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Sparkles,
  Users,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Gift,
  Target,
  Rocket,
  Magnet,
  AlertTriangle,
  Heart
} from 'lucide-react';
import {
  SuperViCharacter,
  GameObstacle,
  CollectibleItem,
  LaneIndex,
  GameMode,
  FruitType,
  PostcardAnalytics
} from '../../types/supervi';
import audioEngine from '../../services/SuperViAudioEngine';
import SuperViAPI from '../../services/SuperViAPIService';
import { useSuperViMultiplayer } from '../../hooks/useSuperViMultiplayer';
import { useAppContext } from '../../contexts/AppContext';

// 6 Canonical SuperVi Heroes with rich Afro-futuristic & Egyptian lore
export const HEROES: SuperViCharacter[] = [
  {
    id: 'zara_zephyr',
    name: 'Zara the Zephyr',
    identity_label: 'Black Hausa Female Superhero',
    description: 'Guardian of Heritage from Kano. Wears a crimson suit with gold light trimmings and a flowing knee-length hijab. Commands fiery speed.',
    character_class: 'Guardian of Heritage',
    origin_city: 'Kano, Nigeria',
    suit_style: 'Red spandex with gold trimmings and flowing knee-length hijab',
    orb_color: '#ef4444',
    orb_symbols: '𓊽 𓏤 𓋹 (Ankh & Fire Glyphs)',
    avatar_url: '/images/supervi-banner.png',
    abilities: {
      passive: ['Lava Resistance', 'Enhanced Reflexes'],
      active: ['Fire Dash', 'Fiery Trail'],
      orb_ability: {
        name: 'Flame Levitation',
        description: 'Levitates above ground and incinerates upcoming obstacles for 7 seconds.'
      }
    },
    is_unlocked: true
  },
  {
    id: 'tenko_gen',
    name: 'Tenko-Gen',
    identity_label: 'Brown-skinned Fulani Female Superhero',
    description: 'Wisdom Keeper from Abuja. Wears a royal blue suit with sacred blue beads and a braided veil. Features limb extension and foresight.',
    character_class: 'Wisdom Keeper',
    origin_city: 'Abuja, Nigeria',
    suit_style: 'Blue spandex with sacred blue beads & veil',
    orb_color: '#3b82f6',
    orb_symbols: '𓂀 𓇳 𓎛 (Eye of Horus & Wisdom)',
    abilities: {
      passive: ['Obstacle Pre-cognition', 'Enhanced Slide'],
      active: ['Limb Extension', 'Foresight Slow-Mo'],
      orb_ability: {
        name: 'Horizon Foresight',
        description: 'Slows down time and highlights optimal lane trajectories with double score.'
      }
    },
    is_unlocked: true
  },
  {
    id: 'king_guardian',
    name: 'King the Guardian',
    identity_label: 'Black Yoruba Male Superhero',
    description: 'Unity Champion from Lagos. Heavy emerald green suit with warrior dreadlocks and brass beads. Unstoppable brute force.',
    character_class: 'Unity Champion',
    origin_city: 'Lagos, Nigeria',
    suit_style: 'Green warrior spandex with ancestral dreadlocks',
    orb_color: '#10b981',
    orb_symbols: '𓊪 𓂝 𓅓 (Was Scepter & Strength)',
    abilities: {
      passive: ['Heavy Impact Armor', 'Double Punch'],
      active: ['Wall Break', 'Ground Quake'],
      orb_ability: {
        name: 'Ancestral Aegis',
        description: 'Smashes directly through solid trains, fallen trees, and concrete barricades.'
      }
    },
    is_unlocked: true
  },
  {
    id: 'phantom_shadow',
    name: 'Phantom Shadow',
    identity_label: 'Ibo Female Superhero',
    description: 'Future Visionary from Enugu. Stealth orange suit with ceremonial wrist and waist beads. Can phase-shift across matter.',
    character_class: 'Future Visionary',
    origin_city: 'Enugu, Nigeria',
    suit_style: 'Orange stealth suit with ceremonial beads',
    orb_color: '#f97316',
    orb_symbols: '𓎛 𓏏 𓊪 (Neb & Transmutation)',
    abilities: {
      passive: ['Phase Shifting', 'Invisibility'],
      active: ['Matter Shift', 'Shadow Veil'],
      orb_ability: {
        name: 'Dimensional Phase',
        description: 'Becomes intangible and phases completely through obstacles and hazards.'
      }
    },
    is_unlocked: true
  },
  {
    id: 'bola_brave',
    name: 'Bola the Brave',
    identity_label: 'Ibo Female Bridge Builder',
    description: 'Bridge Builder from Onitsha. Lightning-white speed suit with crimson beads. Unmatched acceleration and electric dash.',
    character_class: 'Bridge Builder',
    origin_city: 'Onitsha, Nigeria',
    suit_style: 'White lightning suit with crimson beads',
    orb_color: '#ffffff',
    orb_symbols: '𓊽 𓂧 𓆓 (Djed Column & Electricity)',
    abilities: {
      passive: ['Electric Dash', 'Passenger Shield'],
      active: ['Lightning Surge', 'Speed Surge'],
      orb_ability: {
        name: 'Thunderbolt Surge',
        description: 'Ultra-fast sprint with protective lightning aura carrying passengers safely.'
      }
    },
    is_unlocked: true
  },
  {
    id: 'neoma_healer',
    name: 'Neoma the Healer',
    identity_label: 'Light-Skin Ibo Female Pioneer',
    description: 'Innovation Pioneer from Owerri. Leafy green and floral suit with rotating beads. Spawns protective bio-sanctuary bubbles.',
    character_class: 'Innovation Pioneer',
    origin_city: 'Owerri, Nigeria',
    suit_style: 'Leafy green/fruity suit with flower crown',
    orb_color: '#a855f7',
    orb_symbols: '𓋹 𓆸 𓆑 (Ankh & Lotus Bloom)',
    abilities: {
      passive: ['Health Regeneration', 'Fruit Multiplier'],
      active: ['Sanctuary Shield', 'Restoration Wave'],
      orb_ability: {
        name: 'Sanctuary Bloom',
        description: 'Spawns protective bio-spheres that absorb fatal hits and doubles fruit rewards.'
      }
    },
    is_unlocked: true
  }
];

// Spawning Timing Variations (per master design spec: 2-3s, 5-8s, 6-8s, 3-5s, 11-19s)
const SPAWN_INTERVALS = [2.5, 6.0, 7.0, 4.0, 14.0];

interface SuperViGameProps {
  memberId?: string;
  onExit?: () => void;
  onAnalyticsUpdate?: (analytics: PostcardAnalytics) => void;
}

export const SuperViGame: React.FC<SuperViGameProps> = ({ memberId, onExit, onAnalyticsUpdate }) => {
  const { ficBalance, showToast } = useAppContext();
  const multiplayer = useSuperViMultiplayer({ memberId: memberId || 'player_me' });

  // Game UI & Mode Selection
  const [selectedHero, setSelectedHero] = useState<SuperViCharacter>(HEROES[0]);
  const [gameMode, setGameMode] = useState<GameMode>('RUNNER');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Live Gameplay Metrics
  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [feathers, setFeathers] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [highestCombo, setHighestCombo] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [orbCharge, setOrbCharge] = useState<number>(100);
  const [isOrbActive, setIsOrbActive] = useState<boolean>(false);
  const [activeCity, setActiveCity] = useState<string>('Lagos, Nigeria');

  // Chaser Proximity Tracking (0m = caught, 15m = safe, <4m = danger warning)
  const [chaserDistance, setChaserDistance] = useState<number>(14);

  // Active Powerup State (Jetpack, Magnet, Shield, Multiplier, Freeze)
  const [activePowerup, setActivePowerup] = useState<'jetpack' | 'magnet' | 'shield' | 'multiplier' | 'freeze' | null>(null);
  const [powerupTime, setPowerupTime] = useState<number>(0);

  // Daily Challenge Letter Hunt: L - I - O - N
  const [dailyWord] = useState<string>('LION');
  const [collectedLetters, setCollectedLetters] = useState<Set<string>>(new Set());

  // Canvas & Three.js Refs
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // 3D Visual Objects
  const playerMeshRef = useRef<THREE.Group | null>(null);
  const chaserMeshRef = useRef<THREE.Group | null>(null);
  const orbMeshRef = useRef<THREE.Mesh | null>(null);
  const portalRingsRef = useRef<THREE.Group | null>(null);
  const trackSegmentsRef = useRef<THREE.Group[]>([]);
  const obstaclesRef = useRef<{ mesh: THREE.Group; data: GameObstacle }[]>([]);
  const collectiblesRef = useRef<{ mesh: THREE.Mesh | THREE.Group; data: CollectibleItem }[]>([]);

  // Physics & Animation Refs (3 Lanes at X: -3, 0, 3)
  const currentLaneRef = useRef<LaneIndex>(1);
  const targetXRef = useRef<number>(0);
  const playerYRef = useRef<number>(0);
  const verticalVelocityRef = useRef<number>(0);
  const isJumpingRef = useRef<boolean>(false);
  const isSlidingRef = useRef<boolean>(false);
  const slideTimerRef = useRef<number>(0);
  const currentSpeedRef = useRef<number>(24.0);
  const spawnTimerRef = useRef<number>(0);
  const intervalIndexRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const runTimeSecondsRef = useRef<number>(0);
  const chaserDistanceRef = useRef<number>(14);

  // Touch Swipe Gesture Tracking
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Initialize High-End 3D Three.js Scene
  const initThreeJsScene = useCallback(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clean previous renderer
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // 1. Scene & Atmosphere (Afro-Futuristic Cyber Glow)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070b14');
    scene.fog = new THREE.FogExp2('#070b14', 0.012);
    sceneRef.current = scene;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 350);
    camera.position.set(0, 4.4, 7.8);
    camera.lookAt(0, 1.4, -12);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High-Fidelity Antialiasing & Shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.95);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfbbf24, 2.2);
    dirLight.position.set(12, 24, 18);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x1e1b4b, 0.7);
    scene.add(hemiLight);

    // 5. Build Procedural Track (3 Lanes at X: -3, 0, 3)
    const trackGroup = new THREE.Group();
    trackSegmentsRef.current = [];
    for (let i = 0; i < 7; i++) {
      const segment = createTrackSegment(i * -40);
      trackGroup.add(segment);
      trackSegmentsRef.current.push(segment);
    }
    scene.add(trackGroup);

    // 6. Build Stylized 3D Hero Mesh (Matching Selected Guardian)
    const playerGroup = createHeroMesh(selectedHero);
    scene.add(playerGroup);
    playerMeshRef.current = playerGroup;

    // 7. Build 3D AI Chaser Totem Enforcer (Runs behind the player)
    const chaserGroup = createChaserMesh();
    chaserGroup.position.set(0, 0, 7); // Positioned behind player
    scene.add(chaserGroup);
    chaserMeshRef.current = chaserGroup;

    // 8. Build CERN Particle Energy Rings (Active on Speed/Orb Boosts)
    const portalGroup = new THREE.Group();
    for (let r = 0; r < 3; r++) {
      const ringGeo = new THREE.TorusGeometry(3.6 + r * 0.8, 0.08, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: r === 0 ? 0x38bdf8 : r === 1 ? 0xf59e0b : 0x10b981,
        transparent: true,
        opacity: 0.7,
        wireframe: true
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.z = -25 - r * 15;
      portalGroup.add(ring);
    }
    portalGroup.visible = false;
    scene.add(portalGroup);
    portalRingsRef.current = portalGroup;

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedHero]);

  // Create 3D Hero Mesh tailored to African cultural suit identity
  const createHeroMesh = (hero: SuperViCharacter): THREE.Group => {
    const group = new THREE.Group();

    // Torso & Spandex Suit
    const bodyGeo = new THREE.CapsuleGeometry(0.55, 1.35, 10, 20);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(hero.orb_color),
      roughness: 0.25,
      metalness: 0.75
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.3;
    body.castShadow = true;
    group.add(body);

    // Gold/White Light Chestplate & Opal Studs
    const chestGeo = new THREE.BoxGeometry(0.75, 0.6, 0.45);
    const chestMat = new THREE.MeshStandardMaterial({
      color: 0xfff7ed,
      emissive: new THREE.Color(hero.orb_color),
      emissiveIntensity: 0.35,
      metalness: 0.9,
      roughness: 0.1
    });
    const chest = new THREE.Mesh(chestGeo, chestMat);
    chest.position.set(0, 1.45, 0.15);
    group.add(chest);

    // Head
    const headGeo = new THREE.SphereGeometry(0.38, 20, 20);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.6 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.35;
    group.add(head);

    // Cultural Adornments
    if (hero.id === 'zara_zephyr') {
      // Flowing Knee-Length Hijab & Opals
      const hijabGeo = new THREE.ConeGeometry(0.75, 1.8, 16);
      const hijabMat = new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.4
      });
      const hijab = new THREE.Mesh(hijabGeo, hijabMat);
      hijab.position.set(0, 1.7, -0.3);
      hijab.rotation.x = -0.3;
      group.add(hijab);
    } else if (hero.id === 'king_guardian') {
      // Ancestral Dreadlocks
      for (let d = -2; d <= 2; d++) {
        const lockGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.8, 6);
        const lockMat = new THREE.MeshStandardMaterial({ color: 0x18181b });
        const lock = new THREE.Mesh(lockGeo, lockMat);
        lock.position.set(d * 0.12, 2.1, -0.28);
        lock.rotation.x = -0.35;
        group.add(lock);
      }
    } else if (hero.id === 'neoma_healer') {
      // Floral Healing Crown
      const crownGeo = new THREE.TorusGeometry(0.42, 0.08, 8, 24);
      const crownMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669 });
      const crown = new THREE.Mesh(crownGeo, crownMat);
      crown.position.set(0, 2.65, 0);
      crown.rotation.x = Math.PI / 2;
      group.add(crown);
    }

    // Glowing Egyptian Orb of Glory
    const orbGeo = new THREE.SphereGeometry(0.35, 24, 24);
    const orbMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(hero.orb_color),
      emissive: new THREE.Color(hero.orb_color),
      emissiveIntensity: 1.8,
      roughness: 0.1
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    orb.position.set(0.95, 2.2, 0);
    group.add(orb);
    orbMeshRef.current = orb;

    // Glowing Hieroglyphic Ring around Orb
    const ringGeo = new THREE.TorusGeometry(0.55, 0.04, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      wireframe: true
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    orb.add(ring);

    return group;
  };

  // Create 3D AI Chaser / Totem Enforcer Mesh
  const createChaserMesh = (): THREE.Group => {
    const chaser = new THREE.Group();

    // Dark Tribal Obsidian Armor Body
    const bodyGeo = new THREE.CapsuleGeometry(0.7, 1.6, 8, 16);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.3,
      metalness: 0.8
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.4;
    body.castShadow = true;
    chaser.add(body);

    // Glowing Red Eyes
    [-0.2, 0.2].forEach((xEye) => {
      const eyeGeo = new THREE.SphereGeometry(0.1, 12, 12);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(xEye, 2.4, 0.45);
      chaser.add(eye);
    });

    // Horns / Totemic Crest
    [-0.35, 0.35].forEach((xHorn) => {
      const hornGeo = new THREE.ConeGeometry(0.12, 0.7, 8);
      const hornMat = new THREE.MeshStandardMaterial({ color: 0xd97706 });
      const horn = new THREE.Mesh(hornGeo, hornMat);
      horn.position.set(xHorn, 2.9, 0.1);
      horn.rotation.z = xHorn > 0 ? -0.4 : 0.4;
      chaser.add(horn);
    });

    return chaser;
  };

  // Create infinite procedural road tiles with highways, bridges & cyber architecture
  const createTrackSegment = (zPos: number): THREE.Group => {
    const segment = new THREE.Group();
    segment.position.z = zPos;

    // Road Surface (3 Lanes: total width = 12, length = 40)
    const roadGeo = new THREE.PlaneGeometry(12, 40);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.75,
      metalness: 0.35
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.receiveShadow = true;
    segment.add(road);

    // Glowing Cyan Lane Strips (Lanes: -1.5, 1.5)
    [-1.5, 1.5].forEach((xVal) => {
      const lineGeo = new THREE.PlaneGeometry(0.14, 40);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(xVal, 0.02, 0);
      segment.add(line);
    });

    // Neon Yellow Kerbs & Edge Guardrails
    [-5.8, 5.8].forEach((xVal) => {
      const kerbGeo = new THREE.BoxGeometry(0.45, 0.45, 40);
      const kerbMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.5
      });
      const kerb = new THREE.Mesh(kerbGeo, kerbMat);
      kerb.position.set(xVal, 0.22, 0);
      segment.add(kerb);
    });

    // Holographic Skyscrapers & Pylons on Periphery
    [-9, 9].forEach((xVal) => {
      // Tall Cyber Building
      const towerGeo = new THREE.BoxGeometry(4.5, 28, 12);
      const towerMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.2,
        metalness: 0.85
      });
      const tower = new THREE.Mesh(towerGeo, towerMat);
      tower.position.set(xVal > 0 ? xVal + 4 : xVal - 4, 14, 0);
      segment.add(tower);

      // Holographic Egyptian Ankh Beacon
      const ankhGeo = new THREE.TorusGeometry(0.8, 0.12, 8, 20);
      const ankhMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        wireframe: true
      });
      const ankh = new THREE.Mesh(ankhGeo, ankhMat);
      ankh.position.set(xVal, 9.5, 0);
      segment.add(ankh);
    });

    return segment;
  };

  // Spawn Obstacles, Subway Trains, Fruits & Powerups
  const spawnEntity = () => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    const laneChoices: LaneIndex[] = [0, 1, 2];
    const targetLane = laneChoices[Math.floor(Math.random() * laneChoices.length)];
    const laneX = (targetLane - 1) * 3;
    const spawnZ = -95;

    const isObstacle = Math.random() < 0.62;

    if (isObstacle) {
      const obstacleTypes: GameObstacle['type'][] = [
        'TRAIN',
        'URBAN_BARRIER',
        'TUNNEL',
        'WILD_ANIMAL',
        'FALLING_TREE',
        'TREE_STUMP',
        'QUICKSAND'
      ];
      const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

      const obsGroup = new THREE.Group();
      obsGroup.position.set(laneX, 0, spawnZ);

      if (type === 'TRAIN') {
        // High-Speed Train Car (Subway Surfers signature obstacle)
        const trainGeo = new THREE.BoxGeometry(2.5, 3.2, 12);
        const trainMat = new THREE.MeshStandardMaterial({
          color: 0xb45309,
          metalness: 0.85,
          roughness: 0.25
        });
        const trainMesh = new THREE.Mesh(trainGeo, trainMat);
        trainMesh.position.y = 1.6;
        trainMesh.castShadow = true;
        obsGroup.add(trainMesh);

        // Train Lights
        const lightGeo = new THREE.SphereGeometry(0.2, 8, 8);
        const lightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
        [-0.7, 0.7].forEach((lx) => {
          const tLight = new THREE.Mesh(lightGeo, lightMat);
          tLight.position.set(lx, 2.2, 6.05);
          obsGroup.add(tLight);
        });
      } else if (type === 'TUNNEL' || type === 'URBAN_BARRIER') {
        // Low Highway Barrier / Bridge Overhead (Must Slide Under!)
        const barGeo = new THREE.BoxGeometry(2.8, 1.4, 0.6);
        const barMat = new THREE.MeshStandardMaterial({
          color: 0xdc2626,
          roughness: 0.3
        });
        const barMesh = new THREE.Mesh(barGeo, barMat);
        barMesh.position.y = 1.8; // Elevated so slide is required!
        obsGroup.add(barMesh);

        // Hazard stripes
        const stripeGeo = new THREE.PlaneGeometry(2.8, 0.3);
        const stripeMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.position.set(0, 1.8, 0.32);
        obsGroup.add(stripe);
      } else if (type === 'WILD_ANIMAL') {
        // Cyber Cheetah / Leopard Silhouette
        const beastGeo = new THREE.ConeGeometry(0.75, 2.0, 8);
        const beastMat = new THREE.MeshStandardMaterial({
          color: 0x991b1b,
          emissive: 0x7f1d1d
        });
        const beast = new THREE.Mesh(beastGeo, beastMat);
        beast.rotation.x = Math.PI / 2;
        beast.position.y = 0.7;
        obsGroup.add(beast);
      } else {
        // Tree Stump / Log (Must Jump Over!)
        const logGeo = new THREE.CylinderGeometry(0.55, 0.55, 2.8, 12);
        const logMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
        const log = new THREE.Mesh(logGeo, logMat);
        log.rotation.z = Math.PI / 2;
        log.position.y = 0.55;
        obsGroup.add(log);
      }

      scene.add(obsGroup);
      obstaclesRef.current.push({
        mesh: obsGroup,
        data: {
          id: `obs_${Date.now()}_${Math.random()}`,
          lane: targetLane,
          type,
          name: type,
          z: spawnZ,
          width: 2.5,
          height: type === 'TUNNEL' ? 2.5 : 1.6,
          isPassed: false,
          cleared: false
        }
      });
    } else {
      // Collectible: Gold Coins, Powerups, African Fruits or Daily Letters
      const roll = Math.random();

      if (roll < 0.2) {
        // Powerup: Jetpack, Magnet, or Shield
        const pTypes: ('jetpack' | 'magnet' | 'shield')[] = ['jetpack', 'magnet', 'shield'];
        const chosenP = pTypes[Math.floor(Math.random() * pTypes.length)];

        const pGeo = new THREE.OctahedronGeometry(0.65);
        const pMat = new THREE.MeshStandardMaterial({
          color: chosenP === 'jetpack' ? 0x38bdf8 : chosenP === 'magnet' ? 0xec4899 : 0x10b981,
          emissive: chosenP === 'jetpack' ? 0x0284c7 : chosenP === 'magnet' ? 0xdb2777 : 0x059669,
          emissiveIntensity: 0.9
        });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        pMesh.position.set(laneX, 1.4, spawnZ);
        scene.add(pMesh);

        collectiblesRef.current.push({
          mesh: pMesh,
          data: {
            id: `p_${Date.now()}`,
            lane: targetLane,
            type: 'POWERUP',
            powerupType: chosenP,
            z: spawnZ,
            collected: false
          }
        });
      } else if (roll < 0.45) {
        // African Fruit & Strength Effigy (Kolanut, Agbalumo, Sugarcane, Watermelon)
        const fruits: FruitType[] = ['kolanut', 'agbalumo', 'sugarcane', 'watermelon', 'guava', 'feather'];
        const chosenF = fruits[Math.floor(Math.random() * fruits.length)];

        const fGeo = new THREE.DodecahedronGeometry(0.55);
        const fMat = new THREE.MeshStandardMaterial({
          color: chosenF === 'kolanut' ? 0x92400e : chosenF === 'agbalumo' ? 0xf97316 : chosenF === 'watermelon' ? 0x10b981 : 0xfacc15,
          emissive: chosenF === 'agbalumo' ? 0xea580c : 0xca8a04,
          emissiveIntensity: 0.6
        });
        const fMesh = new THREE.Mesh(fGeo, fMat);
        fMesh.position.set(laneX, 1.3, spawnZ);
        scene.add(fMesh);

        collectiblesRef.current.push({
          mesh: fMesh,
          data: {
            id: `fruit_${Date.now()}`,
            lane: targetLane,
            type: 'FRUIT',
            fruitType: chosenF,
            z: spawnZ,
            collected: false
          }
        });
      } else {
        // Gold Coin
        const coinGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.12, 16);
        const coinMat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          metalness: 0.9,
          roughness: 0.15
        });
        const coin = new THREE.Mesh(coinGeo, coinMat);
        coin.rotation.x = Math.PI / 2;
        coin.position.set(laneX, 1.2, spawnZ);
        scene.add(coin);

        collectiblesRef.current.push({
          mesh: coin,
          data: {
            id: `coin_${Date.now()}`,
            lane: targetLane,
            type: 'COIN',
            z: spawnZ,
            collected: false
          }
        });
      }
    }
  };

  // Switch Lane (-3, 0, 3)
  const switchLane = (direction: 'LEFT' | 'RIGHT') => {
    if (!isPlaying || isPaused || isGameOver) return;
    if (direction === 'LEFT' && currentLaneRef.current > 0) {
      currentLaneRef.current = (currentLaneRef.current - 1) as LaneIndex;
      audioEngine.playSlide();
      audioEngine.triggerHaptic('LIGHT');
    } else if (direction === 'RIGHT' && currentLaneRef.current < 2) {
      currentLaneRef.current = (currentLaneRef.current + 1) as LaneIndex;
      audioEngine.playSlide();
      audioEngine.triggerHaptic('LIGHT');
    }
    targetXRef.current = (currentLaneRef.current - 1) * 3;
  };

  // Jump Action
  const performJump = (isHighJump: boolean = false) => {
    if (!isPlaying || isPaused || isGameOver || isJumpingRef.current) return;
    isJumpingRef.current = true;
    verticalVelocityRef.current = isHighJump ? 14.5 : 10.5;
    audioEngine.playJump();
    audioEngine.triggerHaptic('MEDIUM');
  };

  // Slide Action
  const performSlide = () => {
    if (!isPlaying || isPaused || isGameOver) return;
    isSlidingRef.current = true;
    slideTimerRef.current = 0.85;
    audioEngine.playSlide();
    audioEngine.triggerHaptic('MEDIUM');
  };

  // Trigger Special Hero Orb Ability
  const triggerOrbPower = () => {
    if (orbCharge < 100 || isOrbActive || !isPlaying) return;
    setIsOrbActive(true);
    setOrbCharge(0);
    audioEngine.playPortal();
    audioEngine.playVoiceLine('blessings');
    audioEngine.triggerHaptic('COMBO');
    showToast(`⚡ ${selectedHero.name}'s Orb Activated: ${selectedHero.abilities.orb_ability.name}!`, 'success');

    // Show CERN portal vortex rings
    if (portalRingsRef.current) portalRingsRef.current.visible = true;

    // Disintegrate obstacles ahead
    obstaclesRef.current.forEach((obs) => {
      obs.data.cleared = true;
      if (sceneRef.current) sceneRef.current.remove(obs.mesh);
    });
    obstaclesRef.current = [];

    // Temporary Invincibility & Speed Boost for 7 seconds
    currentSpeedRef.current = 42.0;
    setSpeedMultiplier(2.0);

    setTimeout(() => {
      setIsOrbActive(false);
      currentSpeedRef.current = 24.0;
      setSpeedMultiplier(1.0);
      if (portalRingsRef.current) portalRingsRef.current.visible = false;
    }, 7000);
  };

  // Activate In-Game Powerups (Jetpack, Magnet, Shield, Multiplier, Freeze)
  const activatePowerup = (type: 'jetpack' | 'magnet' | 'shield' | 'multiplier' | 'freeze') => {
    setActivePowerup(type);
    setPowerupTime(9.0);

    if (type === 'jetpack') {
      audioEngine.playJetpack();
      audioEngine.playVoiceLine('madt_o');
      showToast('🚀 Golden Jetpack Activated! High Altitude Coin Flight!', 'success');
    } else if (type === 'magnet') {
      audioEngine.playMagnet();
      audioEngine.playVoiceLine('owo_ni_koko');
      showToast('🧲 Calabash Coin Magnet Active! Drawing all treasures!', 'info');
    } else if (type === 'shield') {
      audioEngine.playVoiceLine('awesome');
      showToast('🛡️ Ancestral Shield Equipped! Immune to 1 collision.', 'success');
    } else if (type === 'multiplier') {
      setSpeedMultiplier((m) => m * 2);
      audioEngine.playVoiceLine('great_combo');
      showToast('⚡ 2x Score Multiplier Surge Active!', 'success');
    } else if (type === 'freeze') {
      setChaserDistance((d) => Math.min(15, d + 4));
      audioEngine.playVoiceLine('stunning');
      showToast('❄️ Harmattan Time Freeze! Chaser slowed down!', 'info');
    }
  };

  // Start / Restart Game Run
  const handleStartGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    setCoins(0);
    setFeathers(0);
    setDistance(0);
    setCombo(0);
    setLives(3);
    setOrbCharge(100);
    setIsOrbActive(false);
    setActivePowerup(null);
    setPowerupTime(0);
    setChaserDistance(14);
    chaserDistanceRef.current = 14;
    currentLaneRef.current = 1;
    targetXRef.current = 0;
    playerYRef.current = 0;
    currentSpeedRef.current = 24.0;
    spawnTimerRef.current = 0;
    runTimeSecondsRef.current = 0;

    // Clean previous objects
    if (sceneRef.current) {
      obstaclesRef.current.forEach((o) => sceneRef.current?.remove(o.mesh));
      collectiblesRef.current.forEach((c) => sceneRef.current?.remove(c.mesh));
    }
    obstaclesRef.current = [];
    collectiblesRef.current = [];

    audioEngine.startSoundtrack();
    audioEngine.playVoiceLine('small_combo');
  };

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
        e.preventDefault();
        switchLane('LEFT');
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
        e.preventDefault();
        switchLane('RIGHT');
      } else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        e.preventDefault();
        performJump(false);
      } else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
        e.preventDefault();
        performSlide();
      } else if (e.code === 'Space') {
        e.preventDefault();
        triggerOrbPower();
      } else if (e.key.toLowerCase() === 'p') {
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPaused, isGameOver, orbCharge, isOrbActive]);

  // Touch Swipe Handlers for Mobile & Tablet Players
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;

    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) switchLane('RIGHT');
        else switchLane('LEFT');
      } else {
        if (dy < 0) performJump(dt < 150);
        else performSlide();
      }
    } else if (dt < 250) {
      triggerOrbPower();
    }
    touchStartRef.current = null;
  };

  // Main 60 FPS Three.js Game Loop
  useEffect(() => {
    if (!isPlaying) {
      initThreeJsScene();
      return;
    }

    let isMounted = true;
    lastTimeRef.current = performance.now();

    const animate = (now: number) => {
      if (!isMounted) return;
      const delta = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      if (!isPaused && !isGameOver) {
        runTimeSecondsRef.current += delta;

        // Powerup Countdown timer
        if (activePowerup) {
          setPowerupTime((t) => {
            const nextT = t - delta;
            if (nextT <= 0) {
              setActivePowerup(null);
              return 0;
            }
            return nextT;
          });
        }

        // 1. Smooth Lane Shift Lerp ($X = -3, 0, 3$)
        if (playerMeshRef.current) {
          playerMeshRef.current.position.x += (targetXRef.current - playerMeshRef.current.position.x) * 14 * delta;

          // Banking Tilt on Lane Switch
          const tiltTarget = (targetXRef.current - playerMeshRef.current.position.x) * -0.08;
          playerMeshRef.current.rotation.z += (tiltTarget - playerMeshRef.current.rotation.z) * 10 * delta;

          // 2. Jetpack Altitude or Standard Jump & Gravity Physics
          if (activePowerup === 'jetpack') {
            playerYRef.current = 4.5;
            playerMeshRef.current.position.y = 4.5;
          } else if (isJumpingRef.current) {
            playerYRef.current += verticalVelocityRef.current * delta;
            verticalVelocityRef.current -= 28.0 * delta;
            playerMeshRef.current.rotation.x = Math.sin(now * 0.015) * 0.4;
            if (playerYRef.current <= 0) {
              playerYRef.current = 0;
              isJumpingRef.current = false;
              verticalVelocityRef.current = 0;
              playerMeshRef.current.rotation.x = 0;
            }
            playerMeshRef.current.position.y = playerYRef.current;
          } else {
            playerMeshRef.current.rotation.x = 0;
            playerMeshRef.current.position.y = 0;
          }

          // 3. Slide Scale Physics
          if (isSlidingRef.current && activePowerup !== 'jetpack') {
            slideTimerRef.current -= delta;
            playerMeshRef.current.scale.set(1.2, 0.5, 1.2);
            if (slideTimerRef.current <= 0) {
              isSlidingRef.current = false;
              playerMeshRef.current.scale.set(1, 1, 1);
            }
          } else {
            playerMeshRef.current.scale.set(1, 1, 1);
          }

          // 4. Rotating Egyptian Orb of Glory
          if (orbMeshRef.current) {
            const time = now * 0.0035;
            orbMeshRef.current.position.x = Math.sin(time) * 1.15;
            orbMeshRef.current.position.z = Math.cos(time) * 1.15;
            orbMeshRef.current.rotation.y += 3.5 * delta;
          }
        }

        // 5. Chaser Totem Enforcer Movement & Proximity
        if (chaserMeshRef.current && playerMeshRef.current) {
          // Chaser smoothly trails behind player
          const chaserZ = (playerMeshRef.current.position.z || 0) + chaserDistanceRef.current;
          chaserMeshRef.current.position.z = chaserZ;
          chaserMeshRef.current.position.x += (playerMeshRef.current.position.x - chaserMeshRef.current.position.x) * 6 * delta;

          // Gradually recover chaser distance towards safe 14m if running fast
          if (chaserDistanceRef.current < 14) {
            chaserDistanceRef.current = Math.min(14, chaserDistanceRef.current + delta * 0.8);
            setChaserDistance(Math.round(chaserDistanceRef.current));
          }
        }

        // 6. Move Road Segments (Recycle off-screen tiles)
        const moveDist = currentSpeedRef.current * delta;
        trackSegmentsRef.current.forEach((segment) => {
          segment.position.z += moveDist;
          if (segment.position.z > 20) {
            segment.position.z -= 7 * 40;
          }
        });

        // 7. Update Distance, Score & Analytics
        setDistance((d) => Math.floor(d + moveDist));
        setScore((s) => s + Math.floor(moveDist * (isOrbActive ? 4 : speedMultiplier)));
        setOrbCharge((charge) => Math.min(100, charge + delta * 3.0));

        // 8. Procedural Spawner Cycle (2-3s, 5-8s, 6-8s, 3-5s, 11-19s)
        spawnTimerRef.current += delta;
        const currentTargetInterval = SPAWN_INTERVALS[intervalIndexRef.current];
        if (spawnTimerRef.current >= currentTargetInterval) {
          spawnTimerRef.current = 0;
          spawnEntity();
          intervalIndexRef.current = (intervalIndexRef.current + 1) % SPAWN_INTERVALS.length;
        }

        // 9. Obstacles Movement & Precision Hit Detection
        const playerX = playerMeshRef.current?.position.x || 0;
        const playerY = playerYRef.current;

        for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
          const obs = obstaclesRef.current[i];
          obs.mesh.position.z += moveDist;

          // Collision Check
          if (Math.abs(obs.mesh.position.z) < 1.5 && !obs.data.cleared && !obs.data.isPassed) {
            const laneDiff = Math.abs(obs.mesh.position.x - playerX);
            if (laneDiff < 1.35) {
              if (isOrbActive) {
                // Disintegrate on contact with active orb power
                obs.data.cleared = true;
                sceneRef.current?.remove(obs.mesh);
                obstaclesRef.current.splice(i, 1);
                audioEngine.playVoiceLine('gbaski');
                continue;
              }

              // Check if obstacle cleared by high altitude jetpack
              if (activePowerup === 'jetpack') {
                obs.data.isPassed = true;
                continue;
              }

              // Check if cleared by jump or slide
              const canJumpOver = obs.data.type === 'TREE_STUMP' || obs.data.type === 'QUICKSAND' || obs.data.type === 'FALLING_TREE';
              const canSlideUnder = obs.data.type === 'TUNNEL' || obs.data.type === 'URBAN_BARRIER';

              if (canJumpOver && playerY > 1.1) {
                obs.data.isPassed = true;
                setCombo((c) => {
                  const newC = c + 1;
                  if (newC > highestCombo) setHighestCombo(newC);
                  if (newC === 5) audioEngine.playVoiceLine('small_combo');
                  if (newC === 15) audioEngine.playVoiceLine('great_combo');
                  if (newC === 30) audioEngine.playVoiceLine('colossal_combo');
                  return newC;
                });
              } else if (canSlideUnder && isSlidingRef.current) {
                obs.data.isPassed = true;
                setCombo((c) => c + 1);
              } else {
                // Collision Hit!
                obs.data.cleared = true;

                // Check Shield Absorption
                if (activePowerup === 'shield') {
                  setActivePowerup(null);
                  showToast('🛡️ Shield Absorbed Fatal Impact!', 'info');
                  audioEngine.playObstacleHit();
                  continue;
                }

                // Chaser Surges Closer!
                chaserDistanceRef.current = Math.max(2, chaserDistanceRef.current - 4.5);
                setChaserDistance(Math.round(chaserDistanceRef.current));
                audioEngine.playChaserRoar();
                audioEngine.playVoiceLine('wahala');
                audioEngine.triggerHaptic('HEAVY');
                setCombo(0);

                // Lives depletion
                setLives((prevLives) => {
                  const nextLives = prevLives - 1;
                  if (nextLives <= 0 || chaserDistanceRef.current <= 2) {
                    setIsGameOver(true);
                    audioEngine.pauseSoundtrack();
                    showToast('Game Over! The Totem Enforcer caught up with you!', 'info');
                    submitFinalScore();
                  }
                  return Math.max(0, nextLives);
                });
              }
            }
          }

          // Despawn passed obstacle
          if (obs.mesh.position.z > 16) {
            sceneRef.current?.remove(obs.mesh);
            obstaclesRef.current.splice(i, 1);
          }
        }

        // 10. Collectibles & Magnet Attraction Loop
        for (let j = collectiblesRef.current.length - 1; j >= 0; j--) {
          const col = collectiblesRef.current[j];
          col.mesh.position.z += moveDist;
          col.mesh.rotation.y += 3.8 * delta;

          // Magnet Attraction Effect
          if ((activePowerup === 'magnet' || isOrbActive) && col.mesh.position.z < 28 && col.mesh.position.z > -45) {
            col.mesh.position.x += (playerX - col.mesh.position.x) * 9 * delta;
          }

          if (Math.abs(col.mesh.position.z) < 1.6 && !col.data.collected) {
            const laneDiff = Math.abs(col.mesh.position.x - playerX);
            if (laneDiff < 1.35) {
              col.data.collected = true;

              if (col.data.type === 'POWERUP' && col.data.powerupType) {
                activatePowerup(col.data.powerupType);
              } else if (col.data.type === 'FRUIT') {
                audioEngine.playFruit();
                setScore((s) => s + 250);
                if (col.data.fruitType === 'feather') {
                  setFeathers((f) => f + 1);
                  showToast('🪶 Eagle Feather Collected!', 'success');
                } else if (col.data.fruitType === 'kolanut') {
                  showToast('🌰 Kolanut Blessing! +2x Combo Boost', 'success');
                  setCombo((c) => c + 3);
                } else {
                  showToast(`🍎 SuperVi Fruit Picked: ${col.data.fruitType}!`, 'info');
                }
              } else {
                // Gold Coin
                audioEngine.playCollectOrb();
                audioEngine.triggerHaptic('LIGHT');
                setCoins((c) => c + 1);
                setScore((s) => s + 60);
              }

              sceneRef.current?.remove(col.mesh);
              collectiblesRef.current.splice(j, 1);
              continue;
            }
          }

          if (col.mesh.position.z > 16) {
            sceneRef.current?.remove(col.mesh);
            collectiblesRef.current.splice(j, 1);
          }
        }

        // Emit live analytics to parent Postcard Layout
        if (onAnalyticsUpdate) {
          onAnalyticsUpdate({
            score,
            giftsAcquired: coins + feathers,
            ficEarned: Math.max(5, Math.floor(score / 180)),
            playDurationSeconds: Math.floor(runTimeSecondsRef.current),
            distanceCovered: distance,
            distanceToGoal: Math.max(0, 10000 - distance),
            timeLeftSeconds: Math.max(0, 900 - Math.floor(runTimeSecondsRef.current)),
            permanentBoosts: isOrbActive ? 2 : 1,
            scoreMultiplier: speedMultiplier
          });
        }
      }

      // Render Scene Frame
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      isMounted = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isPaused, isGameOver, isOrbActive, activePowerup, highestCombo, speedMultiplier, distance, score, coins, feathers]);

  // Submit Run Score to Backend
  const submitFinalScore = async () => {
    try {
      await SuperViAPI.submitScore({
        score,
        distance,
        coins_collected: coins,
        character_id: selectedHero.id,
        highest_combo: highestCombo
      });
      multiplayer.updatePlayerScore(score);
    } catch (_) {
      // Graceful offline fallback
    }
  };

  return (
    <div className="relative w-full h-[85vh] min-h-[620px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-300 select-none flex flex-col">
      {/* 1. TOP LIVE STATUS HUD */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-slate-950/95 via-slate-950/60 to-transparent flex items-center justify-between pointer-events-none">
        {/* Left: Score, Distance & Coins */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-xl border border-slate-300 shadow-md">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Score</span>
            <span className="text-2xl font-black text-slate-900">{score.toLocaleString()}</span>
          </div>

          <div className="bg-white/95 backdrop-blur px-3 py-2 rounded-xl border border-slate-300 shadow-md hidden sm:block">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">Distance</span>
            <span className="text-lg font-black text-slate-900">{distance}m</span>
          </div>

          <div className="bg-amber-100/95 backdrop-blur px-3 py-2 rounded-xl border border-amber-300 shadow-md flex items-center gap-2">
            <span className="text-xl">🪙</span>
            <div>
              <span className="text-[10px] font-black text-amber-950 uppercase tracking-wider block">Coins</span>
              <span className="text-lg font-black text-amber-950">{coins}</span>
            </div>
          </div>

          {feathers > 0 && (
            <div className="bg-sky-100/95 backdrop-blur px-3 py-2 rounded-xl border border-sky-300 shadow-md hidden md:flex items-center gap-2">
              <span className="text-xl">🪶</span>
              <div>
                <span className="text-[10px] font-black text-sky-950 uppercase tracking-wider block">Feathers</span>
                <span className="text-lg font-black text-sky-950">{feathers}</span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Chaser Proximity Alert & Active Powerups */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {isPlaying && !isGameOver && (
            <div
              className={`px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md ${
                chaserDistance <= 4
                  ? 'bg-red-600 text-white border-red-300 animate-pulse'
                  : chaserDistance <= 8
                  ? 'bg-amber-500 text-white border-amber-300'
                  : 'bg-emerald-600 text-white border-emerald-300'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Chaser: {chaserDistance}m</span>
            </div>
          )}

          {activePowerup && (
            <div className="bg-amber-400 text-slate-950 px-3 py-1.5 rounded-full border border-yellow-200 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 animate-bounce shadow-md">
              {activePowerup === 'jetpack' && <Rocket className="w-3.5 h-3.5" />}
              {activePowerup === 'magnet' && <Magnet className="w-3.5 h-3.5" />}
              {activePowerup === 'shield' && <Shield className="w-3.5 h-3.5" />}
              <span>{activePowerup}: {Math.ceil(powerupTime)}s</span>
            </div>
          )}
        </div>

        {/* Right: Lives, Sound & Orb Charge Button */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur px-3 py-2 rounded-xl border border-slate-300 shadow-md">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={`text-lg ${i < lives ? 'opacity-100' : 'opacity-25 grayscale'}`}>
                ❤️
              </span>
            ))}
          </div>

          <button
            onClick={() => {
              const muted = audioEngine.toggleMute();
              setIsMuted(muted);
            }}
            aria-label="Toggle Sound"
            className="p-2.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 border border-slate-300 shadow-md active:scale-95 transition-transform"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-slate-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
          </button>

          <button
            onClick={triggerOrbPower}
            disabled={orbCharge < 100 || isOrbActive || !isPlaying}
            aria-label="Activate Orb of Glory Power"
            className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg border transition-all active:scale-95 ${
              isOrbActive
                ? 'bg-amber-400 text-slate-950 border-amber-200 animate-pulse'
                : orbCharge >= 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-300 hover:brightness-110'
                : 'bg-slate-800 text-slate-400 font-bold border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{isOrbActive ? 'ORB ACTIVE!' : `${Math.floor(orbCharge)}% ORB`}</span>
          </button>
        </div>
      </div>

      {/* 2. THREE.JS 3D CANVAS VIEWPORT */}
      <div
        ref={mountRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full cursor-grab active:cursor-grabbing relative"
      />

      {/* 3. IN-GAME COMBO BANNER */}
      {combo >= 5 && isPlaying && !isGameOver && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-bounce">
          <div className="bg-gradient-to-r from-amber-500 to-red-600 text-white font-black px-6 py-1.5 rounded-full shadow-2xl border-2 border-yellow-300 text-sm tracking-widest uppercase flex items-center gap-2">
            <Flame className="w-4 h-4 fill-current text-yellow-200" />
            <span>{combo}X COMBO STREAK!</span>
          </div>
        </div>
      )}

      {/* 4. ON-SCREEN TOUCH RUNNER D-PAD (MOBILE ACCESSIBILITY) */}
      {isPlaying && !isGameOver && (
        <div className="absolute bottom-6 left-0 right-0 z-30 px-6 flex items-center justify-between pointer-events-none sm:hidden">
          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              type="button"
              aria-label="Move Left"
              onClick={() => switchLane('LEFT')}
              className="w-14 h-14 rounded-2xl bg-white/95 text-slate-900 border-2 border-slate-300 shadow-xl flex items-center justify-center font-black active:scale-90 transition-transform"
            >
              <ArrowLeft className="w-7 h-7" />
            </button>
            <button
              type="button"
              aria-label="Move Right"
              onClick={() => switchLane('RIGHT')}
              className="w-14 h-14 rounded-2xl bg-white/95 text-slate-900 border-2 border-slate-300 shadow-xl flex items-center justify-center font-black active:scale-90 transition-transform"
            >
              <ArrowRight className="w-7 h-7" />
            </button>
          </div>

          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              type="button"
              aria-label="Slide Ground"
              onClick={performSlide}
              className="w-14 h-14 rounded-2xl bg-white/95 text-slate-900 border-2 border-slate-300 shadow-xl flex items-center justify-center font-black active:scale-90 transition-transform"
            >
              <ArrowDown className="w-7 h-7" />
            </button>
            <button
              type="button"
              aria-label="Jump Obstacle"
              onClick={() => performJump(false)}
              className="w-14 h-14 rounded-2xl bg-amber-400 text-slate-950 border-2 border-amber-200 shadow-xl flex items-center justify-center font-black active:scale-90 transition-transform"
            >
              <ArrowUp className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}

      {/* 5. START / CHARACTER SELECTION OVERLAY */}
      {!isPlaying && !isGameOver && (
        <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-2xl space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-950 rounded-full font-bold text-xs uppercase tracking-widest border border-amber-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Afro-Futuristic 3D–5D Runner & Chaser
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                SuperVi: Orbs of Glory
              </h2>
              <p className="text-slate-700 text-sm mt-1 max-w-md mx-auto">
                Rise of the Six. Swipe lanes, dodge moving trains, outrun the AI Totem Enforcer, and master ancestral Egyptian orbs.
              </p>
            </div>

            {/* Mode Selector: Runner Mode vs Chaser Mode */}
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setGameMode('RUNNER')}
                className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider border transition-all flex items-center gap-2 ${
                  gameMode === 'RUNNER'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Runner Mode (Escape)</span>
              </button>
              <button
                type="button"
                onClick={() => setGameMode('CHASER')}
                className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider border transition-all flex items-center gap-2 ${
                  gameMode === 'CHASER'
                    ? 'bg-red-600 text-white border-red-500 shadow-md'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                }`}
              >
                <Target className="w-4 h-4 text-yellow-300" />
                <span>Chaser Mode (Hunter)</span>
              </button>
            </div>

            {/* 6 Hero Cards Selection Grid */}
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block text-left mb-2">
                Select Your Champion:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {HEROES.map((hero) => {
                  const isSelected = selectedHero.id === hero.id;
                  return (
                    <button
                      key={hero.id}
                      type="button"
                      onClick={() => setSelectedHero(hero)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500 shadow-md'
                          : 'border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-sm inline-block"
                          style={{ backgroundColor: hero.orb_color }}
                        />
                        <span className="text-xs font-black text-slate-900 truncate">{hero.name}</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 block truncate">
                        {hero.character_class}
                      </span>
                      <span className="text-[10px] text-slate-600 block truncate mt-0.5">
                        {hero.origin_city}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Hero Details Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shadow-md shrink-0"
                style={{ backgroundColor: selectedHero.orb_color }}
              >
                ⚡
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">{selectedHero.name}</h4>
                <p className="text-xs text-slate-700 mt-0.5">{selectedHero.description}</p>
                <div className="mt-2 text-[11px] font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 inline-block">
                  Special Orb: {selectedHero.abilities.orb_ability.name} ({selectedHero.orb_symbols})
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartGame}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg tracking-wide uppercase shadow-xl border border-emerald-500 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>Launch {gameMode === 'RUNNER' ? 'Runner Sprint' : 'Chaser Hunt'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. GAME OVER MODAL */}
      {isGameOver && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-3xl shadow-md">
              🏆
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Run Finished!</h3>
              <p className="text-xs text-slate-700 mt-1">
                Your performance in {activeCity} has been submitted to the global sovereignty leaderboards.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 block">Final Score</span>
                <span className="text-2xl font-black text-slate-900">{score.toLocaleString()}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 block">Distance</span>
                <span className="text-2xl font-black text-slate-900">{distance}m</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 block">Coins</span>
                <span className="text-xl font-black text-amber-950">{coins} 🪙</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 block">Max Combo</span>
                <span className="text-xl font-black text-red-600">{highestCombo}x 🔥</span>
              </div>
            </div>

            {/* FIC Token Award */}
            <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl flex items-center justify-between">
              <div className="text-left">
                <span className="text-xs font-bold text-emerald-950 block">FIC Tokens Awarded</span>
                <span className="text-[11px] text-emerald-800">Credited directly to your protocol wallet</span>
              </div>
              <span className="text-lg font-black text-emerald-950">+{Math.max(5, Math.floor(score / 180))} FIC</span>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleStartGame}
                className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
              {onExit && (
                <button
                  type="button"
                  onClick={onExit}
                  className="px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-300 transition-all"
                >
                  Exit
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperViGame;
