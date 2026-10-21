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
  Gift
} from 'lucide-react';
import { SuperViCharacter, GameObstacle, CollectibleItem, LaneIndex } from '../../types/supervi';
import audioEngine from '../../services/SuperViAudioEngine';
import SuperViAPI from '../../services/SuperViAPIService';
import { useSuperViMultiplayer } from '../../hooks/useSuperViMultiplayer';
import { useAppContext } from '../../contexts/AppContext';

// 6 Canonical SuperVi Heroes
const HEROES: SuperViCharacter[] = [
  {
    id: 'zara_zephyr',
    name: 'Zara the Zephyr',
    identity_label: 'Hausa Guardian of Heritage',
    description: 'Black Hausa heroine in red spandex with white/gold trimmings, opals, and flowing hijab. Commands fiery speed.',
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
        description: 'Levitates above ground and disintegrates all obstacles for 6 seconds.'
      }
    },
    is_unlocked: true
  },
  {
    id: 'tenko_gen',
    name: 'Tenko-Gen',
    identity_label: 'Fulani Wisdom Keeper',
    description: 'Brown Fulani heroine in blue spandex, white/gold trimmings, long braided hair with hijab, and sacred blue beads.',
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
        description: 'Slows down time and highlights optimal lane trajectories.'
      }
    },
    is_unlocked: true
  },
  {
    id: 'king_guardian',
    name: 'King the Guardian',
    identity_label: 'Yoruba Unity Champion',
    description: 'Black Yoruba warrior in emerald green spandex, dreadlocks, and warrior beads. Possesses colossal brute force.',
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
    identity_label: 'Ibo Future Visionary',
    description: 'Ibo stealth visionary in orange spandex with orange and green beads. Can phase shift across physical matter.',
    character_class: 'Future Visionary',
    origin_city: 'Enugu, Nigeria',
    suit_style: 'Orange stealth suit with ceremonial wrist beads',
    orb_color: '#f97316',
    orb_symbols: '𓎛 𓏏 𓊪 (Neb & Transmutation)',
    abilities: {
      passive: ['Mist Camouflage', 'Quicksand Float'],
      active: ['Phase Shift', 'Ghost Run'],
      orb_ability: {
        name: 'Matter Intangibility',
        description: 'Phases through all physical obstacles and hazards effortlessly for 7 seconds.'
      }
    },
    is_unlocked: true
  },
  {
    id: 'bola_brave',
    name: 'Bola the Brave',
    identity_label: 'Ibo Bridge Builder',
    description: 'Ibo heroine in immaculate white spandex with crimson beads. Harnesses raw lightning and hyper-sonic sprinting.',
    character_class: 'Bridge Builder',
    origin_city: 'Onitsha, Nigeria',
    suit_style: 'White lightning suit with red coral beads',
    orb_color: '#f8fafc',
    orb_symbols: '𓄿 𓋴 𓂧 (Djed Pillar & Lightning)',
    abilities: {
      passive: ['Static Surge', 'Extended High Jump'],
      active: ['Lightning Sprint', 'Magnet Field'],
      orb_ability: {
        name: 'Thunderbolt Surge',
        description: 'Electrifies the track, auto-pulling all coins and orbs across all 3 lanes.'
      }
    },
    is_unlocked: true
  },
  {
    id: 'neoma_healer',
    name: 'Neoma the Healer',
    identity_label: 'Ibo Innovation Pioneer',
    description: 'Light-skin Ibo botanist in vibrant leafy-green and fruity spandex, long braids, and pulsating multi-colored healing orbs.',
    character_class: 'Innovation Pioneer',
    origin_city: 'Owerri, Nigeria',
    suit_style: 'Leafy-green botanic suit with beaded crown',
    orb_color: '#a855f7',
    orb_symbols: '𓋴 𓈖 𓃀 (Sa Amulet & Vitality)',
    abilities: {
      passive: ['Life Regeneration', 'Fruit Score Multiplier'],
      active: ['Protective Bubble', 'Flora Bloom'],
      orb_ability: {
        name: 'Sanctuary Bloom',
        description: 'Wraps runner in a regenerative shield that grants an extra life and instant recovery.'
      }
    },
    is_unlocked: true
  }
];

// Spawning Intervals Cycle (per master algorithm): 2-3s, 5-8s, 6-8s, 3-5s, 11-19s
const SPAWN_INTERVALS = [2.5, 6.0, 7.0, 4.0, 15.0];

interface SuperViGameProps {
  memberId?: string;
  onExit?: () => void;
}

export const SuperViGame: React.FC<SuperViGameProps> = ({ memberId, onExit }) => {
  const { ficBalance, showToast } = useAppContext();
  const multiplayer = useSuperViMultiplayer({ memberId: memberId || 'player_me' });

  // Game UI & Life Cycle States
  const [selectedHero, setSelectedHero] = useState<SuperViCharacter>(HEROES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // In-Game Live Metrics
  const [score, setScore] = useState<number>(0);
  const [coins, setCoins] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [highestCombo, setHighestCombo] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [orbCharge, setOrbCharge] = useState<number>(100);
  const [isOrbActive, setIsOrbActive] = useState<boolean>(false);
  const [activeCity, setActiveCity] = useState<string>('Lagos, Nigeria');

  // Daily Challenge Letter Hunt: L - I - O - N
  const [dailyWord, setDailyWord] = useState<string>('LION');
  const [collectedLetters, setCollectedLetters] = useState<Set<string>>(new Set());
  const [questCompleted, setQuestCompleted] = useState<boolean>(false);

  // Active City Tour Selection
  const CITIES = [
    'Lagos, Nigeria',
    'Abuja, Nigeria',
    'Kano, Nigeria',
    'Addis Ababa, Ethiopia',
    'Kingston, Jamaica',
    'Cape Town, South Africa'
  ];

  // Canvas & Three.js Refs
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // 3D Objects
  const playerMeshRef = useRef<THREE.Group | null>(null);
  const orbMeshRef = useRef<THREE.Mesh | null>(null);
  const trackSegmentsRef = useRef<THREE.Group[]>([]);
  const obstaclesRef = useRef<{ mesh: THREE.Group; data: GameObstacle }[]>([]);
  const collectiblesRef = useRef<{ mesh: THREE.Mesh; data: CollectibleItem }[]>([]);

  // Runner Physics State (Lanes: -3, 0, 3)
  const currentLaneRef = useRef<LaneIndex>(1);
  const targetXRef = useRef<number>(0);
  const playerYRef = useRef<number>(0);
  const verticalVelocityRef = useRef<number>(0);
  const isJumpingRef = useRef<boolean>(false);
  const isSlidingRef = useRef<boolean>(false);
  const slideTimerRef = useRef<number>(0);
  const currentSpeedRef = useRef<number>(24.0); // Track speed
  const spawnTimerRef = useRef<number>(0);
  const intervalIndexRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Swipe Gesture Tracking
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Initialize WebGL Three.js Scene
  const initThreeJsScene = useCallback(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clean previous renderer
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    // 1. Scene & Atmosphere (Afro-Futuristic Warm Sunset)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090d16');
    scene.fog = new THREE.FogExp2('#090d16', 0.015);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 300);
    camera.position.set(0, 4.2, 7.5);
    camera.lookAt(0, 1.2, -10);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffa726, 1.8);
    dirLight.position.set(10, 20, 15);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Neon Track Ground Lighting
    const hemiLight = new THREE.HemisphereLight(0xffecd2, 0x1e1b4b, 0.6);
    scene.add(hemiLight);

    // 5. Track Builder (3 Lanes at X: -3, 0, 3)
    const trackGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const segment = createTrackSegment(i * -40);
      trackGroup.add(segment);
      trackSegmentsRef.current.push(segment);
    }
    scene.add(trackGroup);

    // 6. Player Hero & Egyptian Glowing Orb
    const playerGroup = new THREE.Group();
    playerGroup.position.set(0, 0, 0);

    // Stylized Hero Mesh (Afro-futuristic runner body)
    const bodyGeo = new THREE.CapsuleGeometry(0.55, 1.3, 8, 16);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedHero.orb_color),
      roughness: 0.3,
      metalness: 0.7
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 1.2;
    bodyMesh.castShadow = true;
    playerGroup.add(bodyMesh);

    // Hero Head
    const headGeo = new THREE.SphereGeometry(0.38, 16, 16);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x3d2314 });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.y = 2.2;
    playerGroup.add(headMesh);

    // Glowing Egyptian Orb of Glory
    const orbGeo = new THREE.SphereGeometry(0.32, 24, 24);
    const orbMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(selectedHero.orb_color),
      emissive: new THREE.Color(selectedHero.orb_color),
      emissiveIntensity: 1.5,
      roughness: 0.1
    });
    const orbMesh = new THREE.Mesh(orbGeo, orbMat);
    orbMesh.position.set(0.9, 2.0, 0);
    playerGroup.add(orbMesh);
    orbMeshRef.current = orbMesh;

    // Glowing Aura Ring around Orb
    const ringGeo = new THREE.TorusGeometry(0.48, 0.04, 8, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      wireframe: true
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    orbMesh.add(ringMesh);

    scene.add(playerGroup);
    playerMeshRef.current = playerGroup;

    // Handle Window Resize
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

  // Create infinite procedural road tiles
  const createTrackSegment = (zPos: number) => {
    const segment = new THREE.Group();
    segment.position.z = zPos;

    // Road Surface (3 Lanes: width = 12, depth = 40)
    const roadGeo = new THREE.PlaneGeometry(12, 40);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.2
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.receiveShadow = true;
    segment.add(road);

    // Glowing Lane Dividers (at X = -1.5 and +1.5)
    [-1.5, 1.5].forEach((xVal) => {
      const lineGeo = new THREE.PlaneGeometry(0.12, 40);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(xVal, 0.02, 0);
      segment.add(line);
    });

    // Glowing Track Kerbs (Neon Yellow/Amber edge barriers)
    [-5.8, 5.8].forEach((xVal) => {
      const kerbGeo = new THREE.BoxGeometry(0.4, 0.4, 40);
      const kerbMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xd97706,
        emissiveIntensity: 0.4
      });
      const kerb = new THREE.Mesh(kerbGeo, kerbMat);
      kerb.position.set(xVal, 0.2, 0);
      segment.add(kerb);
    });

    // Environmental Savanna / Afro-futuristic Scenery (Pylons & Holograms)
    [-8, 8].forEach((xVal) => {
      const poleGeo = new THREE.CylinderGeometry(0.2, 0.2, 8, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(xVal, 4, 0);
      segment.add(pole);

      // Holographic Egyptian Ankh Crown
      const ankhGeo = new THREE.TorusGeometry(0.6, 0.1, 8, 16);
      const ankhMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        wireframe: true
      });
      const ankh = new THREE.Mesh(ankhGeo, ankhMat);
      ankh.position.set(xVal, 8, 0);
      segment.add(ankh);
    });

    return segment;
  };

  // Spawn Obstacle or Collectible
  const spawnEntity = () => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    const laneChoices: LaneIndex[] = [0, 1, 2];
    const targetLane = laneChoices[Math.floor(Math.random() * laneChoices.length)];
    const laneX = (targetLane - 1) * 3; // -3, 0, or 3
    const spawnZ = -80; // Ahead of player

    const isObstacle = Math.random() < 0.65;

    if (isObstacle) {
      const obstacleTypes: GameObstacle['type'][] = [
        'WILD_ANIMAL',
        'FALLING_TREE',
        'TREE_STUMP',
        'QUICKSAND',
        'URBAN_BARRIER',
        'TRAIN'
      ];
      const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];

      const obsGroup = new THREE.Group();
      obsGroup.position.set(laneX, 0, spawnZ);

      // Shape according to type
      if (type === 'TRAIN') {
        const trainGeo = new THREE.BoxGeometry(2.4, 2.6, 8);
        const trainMat = new THREE.MeshStandardMaterial({
          color: 0xd97706,
          metalness: 0.8,
          roughness: 0.2
        });
        const trainMesh = new THREE.Mesh(trainGeo, trainMat);
        trainMesh.position.y = 1.3;
        obsGroup.add(trainMesh);
      } else if (type === 'FALLING_TREE' || type === 'TREE_STUMP') {
        const logGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.8, 12);
        const logMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
        const logMesh = new THREE.Mesh(logGeo, logMat);
        logMesh.rotation.z = Math.PI / 2;
        logMesh.position.y = 0.5;
        obsGroup.add(logMesh);
      } else if (type === 'WILD_ANIMAL') {
        // Cheetah / Leopard / Wild beast model silhouette
        const beastGeo = new THREE.ConeGeometry(0.7, 1.8, 8);
        const beastMat = new THREE.MeshStandardMaterial({
          color: 0x991b1b,
          emissive: 0x450a0a
        });
        const beastMesh = new THREE.Mesh(beastGeo, beastMat);
        beastMesh.rotation.x = Math.PI / 2;
        beastMesh.position.y = 0.6;
        obsGroup.add(beastMesh);
      } else {
        // Urban Barrier
        const barrierGeo = new THREE.BoxGeometry(2.6, 1.2, 0.4);
        const barrierMat = new THREE.MeshStandardMaterial({
          color: 0xef4444,
          roughness: 0.4
        });
        const barrierMesh = new THREE.Mesh(barrierGeo, barrierMat);
        barrierMesh.position.y = 0.6;
        obsGroup.add(barrierMesh);
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
          width: 2.4,
          height: 1.5,
          isPassed: false,
          cleared: false
        }
      });
    } else {
      // Collectible: Gold Coins, Fruits, or Daily Letters (L-I-O-N)
      const missingLetters = dailyWord
        .split('')
        .filter((char) => !collectedLetters.has(char));
      const shouldSpawnLetter = missingLetters.length > 0 && Math.random() < 0.25;

      if (shouldSpawnLetter) {
        const chosenLetter = missingLetters[Math.floor(Math.random() * missingLetters.length)];
        const letterGeo = new THREE.OctahedronGeometry(0.6);
        const letterMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xf59e0b,
          emissiveIntensity: 0.8
        });
        const letterMesh = new THREE.Mesh(letterGeo, letterMat);
        letterMesh.position.set(laneX, 1.5, spawnZ);
        scene.add(letterMesh);
        collectiblesRef.current.push({
          mesh: letterMesh,
          data: {
            id: `let_${Date.now()}`,
            lane: targetLane,
            type: 'LETTER',
            letter: chosenLetter,
            z: spawnZ,
            collected: false
          }
        });
      } else {
        // Gold Coin or Orb of Glory
        const coinGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
        const coinMat = new THREE.MeshStandardMaterial({
          color: 0xfacc15,
          metalness: 0.9,
          roughness: 0.1
        });
        const coinMesh = new THREE.Mesh(coinGeo, coinMat);
        coinMesh.rotation.x = Math.PI / 2;
        coinMesh.position.set(laneX, 1.2, spawnZ);
        scene.add(coinMesh);
        collectiblesRef.current.push({
          mesh: coinMesh,
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
      audioEngine.triggerHaptic(30);
    } else if (direction === 'RIGHT' && currentLaneRef.current < 2) {
      currentLaneRef.current = (currentLaneRef.current + 1) as LaneIndex;
      audioEngine.playSlide();
      audioEngine.triggerHaptic(30);
    }
    targetXRef.current = (currentLaneRef.current - 1) * 3;
  };

  // Jump Action
  const performJump = (isHighJump: boolean = false) => {
    if (!isPlaying || isPaused || isGameOver || isJumpingRef.current) return;
    isJumpingRef.current = true;
    verticalVelocityRef.current = isHighJump ? 14.0 : 10.0;
    audioEngine.playJump();
    audioEngine.triggerHaptic(50);
  };

  // Slide Action
  const performSlide = () => {
    if (!isPlaying || isPaused || isGameOver) return;
    isSlidingRef.current = true;
    slideTimerRef.current = 0.8;
    audioEngine.playSlide();
    audioEngine.triggerHaptic(40);
  };

  // Trigger Special Hero Orb Ability
  const triggerOrbPower = () => {
    if (orbCharge < 100 || isOrbActive || !isPlaying) return;
    setIsOrbActive(true);
    setOrbCharge(0);
    audioEngine.playVoiceLine('blessings');
    audioEngine.triggerHaptic([100, 50, 100, 50, 100]);
    showToast(`⚡ ${selectedHero.name}'s Orb Activated: ${selectedHero.abilities.orb_ability.name}!`, 'success');

    // Clear all upcoming obstacles
    obstaclesRef.current.forEach((obs) => {
      obs.data.cleared = true;
      if (sceneRef.current) sceneRef.current.remove(obs.mesh);
    });
    obstaclesRef.current = [];

    // Temporary Invincibility & Speed Boost for 7 seconds
    currentSpeedRef.current = 42.0;
    setSpeedMultiplier(1.8);

    setTimeout(() => {
      setIsOrbActive(false);
      currentSpeedRef.current = 24.0;
      setSpeedMultiplier(1.0);
    }, 7000);
  };

  // Start / Restart Game Run
  const handleStartGame = () => {
    setIsPlaying(true);
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    setCoins(0);
    setDistance(0);
    setCombo(0);
    setLives(3);
    setOrbCharge(100);
    setIsOrbActive(false);
    currentLaneRef.current = 1;
    targetXRef.current = 0;
    playerYRef.current = 0;
    currentSpeedRef.current = 24.0;
    spawnTimerRef.current = 0;

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

    // Minimum swipe threshold
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) switchLane('RIGHT');
        else switchLane('LEFT');
      } else {
        if (dy < 0) performJump(dt < 150);
        else performSlide();
      }
    } else if (dt < 250) {
      // Tap detected
      triggerOrbPower();
    }
    touchStartRef.current = null;
  };

  // Main 60 FPS Game Loop
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
        // 1. Smooth Lane Lerp ($X = -3, 0, 3$)
        if (playerMeshRef.current) {
          playerMeshRef.current.position.x += (targetXRef.current - playerMeshRef.current.position.x) * 14 * delta;

          // 2. Vertical Jump & Gravity Physics
          if (isJumpingRef.current) {
            playerYRef.current += verticalVelocityRef.current * delta;
            verticalVelocityRef.current -= 28.0 * delta; // Gravity
            if (playerYRef.current <= 0) {
              playerYRef.current = 0;
              isJumpingRef.current = false;
              verticalVelocityRef.current = 0;
            }
          }

          // 3. Slide Timer Physics
          if (isSlidingRef.current) {
            slideTimerRef.current -= delta;
            playerMeshRef.current.scale.set(1.2, 0.5, 1.2);
            if (slideTimerRef.current <= 0) {
              isSlidingRef.current = false;
              playerMeshRef.current.scale.set(1, 1, 1);
            }
          } else {
            playerMeshRef.current.scale.set(1, 1, 1);
          }

          playerMeshRef.current.position.y = playerYRef.current;

          // 4. Rotating Egyptian Orb Animation
          if (orbMeshRef.current) {
            const time = now * 0.003;
            orbMeshRef.current.position.x = Math.sin(time) * 1.1;
            orbMeshRef.current.position.z = Math.cos(time) * 1.1;
            orbMeshRef.current.rotation.y += 3.0 * delta;
          }
        }

        // 5. Move Infinite Road Segments Toward Camera
        const moveDist = currentSpeedRef.current * delta;
        trackSegmentsRef.current.forEach((segment) => {
          segment.position.z += moveDist;
          if (segment.position.z > 20) {
            segment.position.z -= 6 * 40; // Recycle off-screen tile to back
          }
        });

        // 6. Update Distance, Score & Orb Charge
        setDistance((d) => Math.floor(d + moveDist));
        setScore((s) => s + Math.floor(moveDist * (isOrbActive ? 4 : 1)));
        setOrbCharge((charge) => Math.min(100, charge + delta * 2.5));

        // 7. Procedural Spawner with Algorithm Intervals (2-3s, 5-8s, 6-8s, 3-5s, 11-19s)
        spawnTimerRef.current += delta;
        const currentTargetInterval = SPAWN_INTERVALS[intervalIndexRef.current];
        if (spawnTimerRef.current >= currentTargetInterval) {
          spawnTimerRef.current = 0;
          spawnEntity();
          intervalIndexRef.current = (intervalIndexRef.current + 1) % SPAWN_INTERVALS.length;
        }

        // 8. Move Obstacles & Collision Check
        const playerX = playerMeshRef.current?.position.x || 0;
        const playerY = playerYRef.current;

        for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
          const obs = obstaclesRef.current[i];
          obs.mesh.position.z += moveDist;

          // Collision Check window
          if (Math.abs(obs.mesh.position.z) < 1.4 && !obs.data.cleared && !obs.data.isPassed) {
            const laneDiff = Math.abs(obs.mesh.position.x - playerX);
            if (laneDiff < 1.4) {
              if (isOrbActive) {
                // Disintegrate obstacle on hit with active orb
                obs.data.cleared = true;
                sceneRef.current?.remove(obs.mesh);
                obstaclesRef.current.splice(i, 1);
                audioEngine.playVoiceLine('gbaski');
                continue;
              }

              // Check if cleared by jump or slide
              const canJumpOver = obs.data.type === 'TREE_STUMP' || obs.data.type === 'QUICKSAND';
              const canSlideUnder = obs.data.type === 'URBAN_BARRIER';

              if (canJumpOver && playerY > 1.2) {
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
                // Fatal Collision Hit
                obs.data.cleared = true;
                audioEngine.playObstacleHit();
                audioEngine.triggerHaptic([150, 50, 150]);
                audioEngine.playVoiceLine('wahala');
                setCombo(0);

                setLives((prevLives) => {
                  const nextLives = prevLives - 1;
                  if (nextLives <= 0) {
                    setIsGameOver(true);
                    audioEngine.pauseSoundtrack();
                    showToast('Game Over! Well run, Champion!', 'info');
                    submitFinalScore();
                  }
                  return Math.max(0, nextLives);
                });
              }
            }
          }

          // Despawn passed obstacle
          if (obs.mesh.position.z > 15) {
            sceneRef.current?.remove(obs.mesh);
            obstaclesRef.current.splice(i, 1);
          }
        }

        // 9. Move Collectibles & Pickup Check
        for (let j = collectiblesRef.current.length - 1; j >= 0; j--) {
          const col = collectiblesRef.current[j];
          col.mesh.position.z += moveDist;
          col.mesh.rotation.y += 4 * delta;

          // Magnet Effect when orb active
          if (isOrbActive && col.mesh.position.z < 25 && col.mesh.position.z > -40) {
            col.mesh.position.x += (playerX - col.mesh.position.x) * 8 * delta;
          }

          if (Math.abs(col.mesh.position.z) < 1.6 && !col.data.collected) {
            const laneDiff = Math.abs(col.mesh.position.x - playerX);
            if (laneDiff < 1.4) {
              col.data.collected = true;
              audioEngine.playCollectOrb();
              audioEngine.triggerHaptic(25);

              if (col.data.type === 'LETTER' && col.data.letter) {
                const char = col.data.letter;
                setCollectedLetters((prev) => {
                  const nextSet = new Set(prev);
                  nextSet.add(char);
                  if (nextSet.size === dailyWord.length) {
                    setQuestCompleted(true);
                    audioEngine.playVoiceLine('stunning');
                    showToast('🌟 Daily L-I-O-N Quest Complete! +500 FIC Bonus!', 'success');
                    setScore((s) => s + 5000);
                  }
                  return nextSet;
                });
              } else {
                setCoins((c) => c + 1);
                setScore((s) => s + 50);
              }

              sceneRef.current?.remove(col.mesh);
              collectiblesRef.current.splice(j, 1);
              continue;
            }
          }

          if (col.mesh.position.z > 15) {
            sceneRef.current?.remove(col.mesh);
            collectiblesRef.current.splice(j, 1);
          }
        }
      }

      // Render Scene
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
  }, [isPlaying, isPaused, isGameOver, isOrbActive, dailyWord, collectedLetters, highestCombo]);

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
      // Synchronize with multiplayer hook
      multiplayer.updatePlayerScore(score);
    } catch (_) {
      // Offline fallback
    }
  };

  return (
    <div className="relative w-full h-[85vh] min-h-[620px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-300 select-none flex flex-col">
      {/* 1. TOP STATUS HUD */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent flex items-center justify-between pointer-events-none">
        {/* Left: Score & Distance */}
        <div className="flex items-center gap-4 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur px-4 py-2 rounded-xl border border-slate-300 shadow-md">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Score</span>
            <span className="text-2xl font-black text-slate-900">{score.toLocaleString()}</span>
          </div>

          <div className="bg-white/95 backdrop-blur px-3 py-2 rounded-xl border border-slate-300 shadow-md hidden sm:block">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">Distance</span>
            <span className="text-lg font-bold text-slate-800">{distance}m</span>
          </div>

          <div className="bg-amber-100/95 backdrop-blur px-3 py-2 rounded-xl border border-amber-300 shadow-md flex items-center gap-2">
            <span className="text-xl">🪙</span>
            <div>
              <span className="text-xs font-semibold text-amber-950 uppercase tracking-wider block">Coins</span>
              <span className="text-lg font-black text-amber-950">{coins}</span>
            </div>
          </div>
        </div>

        {/* Center: Daily Letter Quest (L - I - O - N) */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-full border border-slate-700 pointer-events-auto">
          <span className="text-xs font-bold text-amber-400 mr-2 flex items-center gap-1">
            <Gift className="w-3.5 h-3.5" /> DAILY:
          </span>
          {dailyWord.split('').map((char, idx) => {
            const isFound = collectedLetters.has(char);
            return (
              <span
                key={idx}
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-sm border transition-all ${
                  isFound
                    ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg scale-110 animate-pulse'
                    : 'bg-slate-800 text-slate-300 font-bold border-slate-700'
                }`}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Right: Lives, Sound & Pause */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Lives */}
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur px-3 py-2 rounded-xl border border-slate-300 shadow-md">
            {[...Array(3)].map((_, i) => (
              <span key={i} className={`text-lg ${i < lives ? 'opacity-100' : 'opacity-25 grayscale'}`}>
                ❤️
              </span>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const muted = audioEngine.toggleMute();
              setIsMuted(muted);
            }}
            className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 border border-slate-300 shadow transition-transform active:scale-95"
            title="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
          </button>

          {/* Hero Orb Power Button */}
          <button
            onClick={triggerOrbPower}
            disabled={orbCharge < 100 || isOrbActive || !isPlaying}
            className={`px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg border transition-all active:scale-95 ${
              isOrbActive
                ? 'bg-amber-400 text-slate-950 border-amber-200 animate-pulse'
                : orbCharge >= 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-emerald-300 hover:brightness-110'
                : 'bg-slate-800 text-slate-300 font-bold border-slate-700 cursor-not-allowed opacity-60'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{isOrbActive ? 'ORB ACTIVE!' : `${Math.floor(orbCharge)}% ORB`}</span>
          </button>
        </div>
      </div>

      {/* 2. THREE.JS 3D VIEWPORT CANVAS CONTAINER */}
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

      {/* 4. ON-SCREEN TOUCH RUNNER D-PAD (FOR MOBILE/TOUCH SCREENS) */}
      {isPlaying && !isGameOver && (
        <div className="absolute bottom-6 left-0 right-0 z-30 px-6 flex items-center justify-between pointer-events-none sm:hidden">
          {/* Left / Right Buttons */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={() => switchLane('LEFT')}
              className="w-14 h-14 rounded-2xl bg-white/90 text-slate-900 border-2 border-slate-300 shadow-xl flex items-center justify-center font-black active:scale-90 transition-transform"
            >
              <ArrowLeft className="w-7 h-7" />
            </button>
            <button
              onClick={() => switchLane('RIGHT')}
              className="w-14 h-14 rounded-2xl bg-white/90 text-slate-900 border-2 border-slate-300 shadow-xl flex items-center justify-center font-black active:scale-90 transition-transform"
            >
              <ArrowRight className="w-7 h-7" />
            </button>
          </div>

          {/* Jump / Slide Buttons */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <button
              onClick={performSlide}
              className="w-14 h-14 rounded-2xl bg-white/90 text-slate-900 border-2 border-slate-300 shadow-xl flex items-center justify-center font-black active:scale-90 transition-transform"
            >
              <ArrowDown className="w-7 h-7" />
            </button>
            <button
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
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full font-bold text-xs uppercase tracking-widest border border-amber-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Afro-Futuristic 3D–5D Runner
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                SuperVi: Orbs of Glory
              </h2>
              <p className="text-slate-700 text-sm mt-1 max-w-md mx-auto">
                Rise of the Six. Swipe lanes, unleash ancestral orbs, and compete across 16 global cyber cities.
              </p>
            </div>

            {/* 6 Hero Cards Selection Grid */}
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block text-left mb-2">
                Select Your Champion:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {HEROES.map((hero) => {
                  const isSelected = selectedHero.id === hero.id;
                  return (
                    <button
                      key={hero.id}
                      onClick={() => setSelectedHero(hero)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500 shadow-md'
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
                      <span className="text-[11px] font-semibold text-slate-700 block truncate">
                        {hero.character_class}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate mt-0.5">
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
                <div className="mt-2 text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300 inline-block">
                  Special Orb: {selectedHero.abilities.orb_ability.name}
                </div>
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-2">
              <button
                onClick={handleStartGame}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg tracking-wide uppercase shadow-xl border border-emerald-500 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <Play className="w-6 h-6 fill-current" />
                <span>Launch Run Now</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. GAME OVER & SCORE SUBMITTED MODAL */}
      {isGameOver && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-300 shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center mx-auto text-3xl shadow-md">
              🏆
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">Run Finished!</h3>
              <p className="text-xs text-slate-700 mt-1">
                Your performance in {activeCity} has been recorded to the global leaderboard.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-700 block">Final Score</span>
                <span className="text-2xl font-black text-slate-900">{score.toLocaleString()}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-700 block">Distance</span>
                <span className="text-2xl font-black text-slate-900">{distance}m</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-700 block">Coins Earned</span>
                <span className="text-xl font-black text-amber-950">{coins} 🪙</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-700 block">Max Combo</span>
                <span className="text-xl font-black text-red-600">{highestCombo}x 🔥</span>
              </div>
            </div>

            {/* FIC Token Payout Badge */}
            <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl flex items-center justify-between">
              <div className="text-left">
                <span className="text-xs font-bold text-emerald-950 block">FIC Tokens Awarded</span>
                <span className="text-[11px] text-emerald-800">Credited to your protocol wallet</span>
              </div>
              <span className="text-lg font-black text-emerald-950">+{Math.max(5, Math.floor(score / 200))} FIC</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleStartGame}
                className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
              {onExit && (
                <button
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
