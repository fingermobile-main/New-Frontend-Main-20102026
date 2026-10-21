import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { MediaFile } from '../utils/mediaProcessing';
import { mediaApiService } from '../services/api'; // Import the API service
import { voiceLinesService } from '../services/voiceLinesService'; // NEW: Import voice lines service

interface ArtworkData {
  id: number;
  title: string;
  desc: string;
  img: string;
  color: string;
  stage: string;
  ficReward: number;
  isUserContent?: boolean;
  mediaFile?: MediaFile;
  isSystem?: boolean;
}

interface LuminaGallerySceneProps {
  onArtworkClick?: (artwork: ArtworkData) => void;
  userMedia?: MediaFile[];
}

const LuminaGalleryScene: React.FC<LuminaGallerySceneProps> = ({ onArtworkClick, userMedia = [] }) => {
  // State to hold all artworks (both system and fetched from API)
  const [artworks, setArtworks] = useState<ArtworkData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch artworks from API
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const apiArtworks = await mediaApiService.getAllArtworks();
        // Map API data to our ArtworkData interface
        const mappedArtworks: ArtworkData[] = apiArtworks.map((item: any) => ({
          id: typeof item.id === 'string' ? parseInt(item.id, 10) || 0 : item.id,
          title: item.title,
          desc: item.desc,
          img: item.img,
          color: item.color || '#ffffff',
          stage: item.stage,
          ficReward: item.ficReward,
          isUserContent: item.isUserContent,
          isSystem: item.isSystem
        }));
        setArtworks(mappedArtworks);
      } catch (error) {
        console.error('Failed to fetch artworks:', error);
        // Fallback to hardcoded data if API fails
        const fallbackArtworks: ArtworkData[] = [
          {
            id: 1,
            title: "Neon Genesis",
            desc: "A vibrant exploration of digital consciousness emerging from the void. The interplay of electric blues and deep magentas represents the spark of artificial life.",
            img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop",
            color: "#00f2ff",
            stage: "01",
            ficReward: 0.05,
            isSystem: true
          },
          {
            id: 2,
            title: "Silent Geometry",
            desc: "Minimalist structures floating in an infinite white space. This piece questions the rigidity of form in a fluid digital world.",
            img: "https://images.unsplash.com/photo-1506259091721-347f798196d4?q=80&w=1000&auto=format&fit=crop",
            color: "#ffffff",
            stage: "02",
            ficReward: 0.08,
            isSystem: true
          },
          {
            id: 3,
            title: "Crimson Tide",
            desc: "An emotional wave of red and orange, capturing the raw intensity of a digital sunset over a cybernetic ocean.",
            img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop",
            color: "#ff0055",
            stage: "03",
            ficReward: 0.12,
            isSystem: true
          },
          {
            id: 4,
            title: "Aurora Borealis",
            desc: "The natural phenomenon reimagined through code. Swirling particles of light dance in a magnetic field of green and violet.",
            img: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1000&auto=format&fit=crop",
            color: "#00ff88",
            stage: "04",
            ficReward: 0.15,
            isSystem: true
          },
          {
            id: 5,
            title: "Deep Space",
            desc: "A journey into the unknown. Dark matter and distant stars collide in this abstract representation of the cosmos.",
            img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop",
            color: "#8800ff",
            stage: "01",
            ficReward: 0.06,
            isSystem: true
          },
          {
            id: 6,
            title: "Liquid Gold",
            desc: "Fluid dynamics rendered in precious metal. The viscosity of wealth and the flow of time captured in a single frozen moment.",
            img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
            color: "#ffaa00",
            stage: "02",
            ficReward: 0.10,
            isSystem: true
          },
          {
            id: 7,
            title: "Cyber Mist",
            desc: "Fog rolling over a neon cityscape. The anonymity of the crowd versus the individuality of the glowing lights.",
            img: "https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=1000&auto=format&fit=crop",
            color: "#ff00aa",
            stage: "03",
            ficReward: 0.14,
            isSystem: true
          },
          {
            id: 8,
            title: "Abstract Mind",
            desc: "Neural pathways visualized. The chaotic yet organized structure of a brain processing a million thoughts per second.",
            img: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000&auto=format&fit=crop",
            color: "#00aaff",
            stage: "04",
            ficReward: 0.20,
            isSystem: true
          }
        ];
        setArtworks(fallbackArtworks);
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  // NEW: Function to trigger voice line when hovering over artwork
  const triggerHoverVoiceLine = async () => {
    try {
      await voiceLinesService.triggerVoiceLineByCategory('appraisal');
    } catch (error) {
      console.error('Error triggering hover voice line:', error);
    }
  };

  // NEW: Function to trigger voice line when clicking artwork
  const triggerClickVoiceLine = async () => {
    try {
      await voiceLinesService.triggerVoiceLineByCategory('greeting');
    } catch (error) {
      console.error('Error triggering click voice line:', error);
    }
  };

  // Combine API/system artwork with user media
  const combinedGalleryData = useMemo(() => {
    // Add user media as additional artworks
    const userArtworks = userMedia.map((media, index) => ({
      id: 1000 + index, // Unique IDs for user content starting from 1000
      title: media.metadata.fileName,
      desc: `User uploaded content: ${media.metadata.fileName}`,
      img: media.previewUrl, // Use the preview URL
      color: "#FFD700", // Default color for user content
      stage: "U1", // User content stage
      ficReward: 0.05, // Standard reward for user content
      isUserContent: true,
      mediaFile: media
    }));

    // Combine API/system artworks with user uploads
    return [...artworks, ...userArtworks];
  }, [artworks, userMedia]);

  // Refs
  const groupRef = useRef<THREE.Group>(null);
  const frameRefs = useRef<Array<{ mesh: THREE.Group; id: number }>>([]);
  
  // State
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  
  // Textures
  const textures = useTexture(
    combinedGalleryData.map(item => item.img)
  );

  // Calculate positions for frames in a circle
  const framePositions = useMemo(() => {
    const count = combinedGalleryData.length;
    if (count === 0) return []; // Prevent division by zero
    
    const radius = 5.5;
    return combinedGalleryData.map((_, index) => {
      const angle = (index / count) * Math.PI * 2;
      return {
        x: Math.sin(angle) * radius,
        z: Math.cos(angle) * radius,
        angle
      };
    });
  }, [combinedGalleryData]);

  // Animation loop
  useFrame((state) => {
    if (groupRef.current) {
      // Animate frames vertically and with slight rotation
      frameRefs.current.forEach((ref, i) => {
        if (ref.mesh) {
          const time = state.clock.getElapsedTime();
          ref.mesh.position.y = Math.sin(time * 0.5 + i) * 0.08;
          ref.mesh.rotation.z = Math.sin(time * 0.3 + i) * 0.02;
        }
      });
    }
  });

  // Handle click events
  const handleClick = useCallback((id: number) => {
    const artwork = combinedGalleryData.find(item => item.id === id);
    if (artwork && onArtworkClick) {
      onArtworkClick(artwork);
      triggerClickVoiceLine(); // NEW: Trigger voice line when artwork is clicked
    }
  }, [combinedGalleryData, onArtworkClick]);

  // Handle mouse enter for highlighting
  const handlePointerOver = (id: number) => {
    setHoveredId(id);
    document.body.style.cursor = 'pointer';
    triggerHoverVoiceLine(); // NEW: Trigger voice line when hovering over artwork
  };

  // Handle mouse leave
  const handlePointerOut = () => {
    setHoveredId(null);
    document.body.style.cursor = 'default';
  };

  // Don't render anything if loading
  if (loading || combinedGalleryData.length === 0) {
    return null; // The parent component can handle loading state
  }

  return (
    <group ref={groupRef}>
      {/* Frames */}
      {framePositions.map((pos, index) => {
        const artwork = combinedGalleryData[index];
        const texture = textures[index];
        const isHighlighted = hoveredId === artwork.id;
        
        return (
          <group 
            key={artwork.id}
            position={[pos.x, 0, pos.z]}
            ref={(el) => {
              if (el) {
                frameRefs.current[index] = { mesh: el, id: artwork.id };
              }
            }}
          >
            {/* Look at center */}
            <group rotation={[0, Math.PI - pos.angle, 0]}>
              {/* Frame */}
              <mesh
                castShadow
                receiveShadow
                onClick={() => handleClick(artwork.id)}
                onPointerOver={() => handlePointerOver(artwork.id)}
                onPointerOut={handlePointerOut}
              >
                {/* Frame geometry */}
                <boxGeometry args={[2.2, 3.2, 0.15]} />
                <meshStandardMaterial 
                  color={isHighlighted ? "#FFD700" : "#1a1a1a"}
                  roughness={0.1}
                  metalness={0.9}
                  emissive={artwork.color}
                  emissiveIntensity={isHighlighted ? 0.3 : 0.1}
                />
                
                {/* Canvas */}
                <mesh position={[0, 0, 0.08]}>
                  <planeGeometry args={[2.05, 3.05]} />
                  <meshBasicMaterial map={texture} />
                </mesh>
              </mesh>
              
              {/* Backlight */}
              <pointLight 
                position={[0, 0, -0.8]} 
                color={artwork.color} 
                intensity={0.8} 
                distance={5} 
              />
              
              {/* Floating particles around frame - more for user content */}
              <group>
                {Array.from({ length: artwork.isUserContent ? 30 : 20 }).map((_, i) => {
                  const x = (Math.random() - 0.5) * 3;
                  const y = (Math.random() - 0.5) * 4;
                  const z = (Math.random() - 0.5) * 2;
                  
                  return (
                    <mesh key={i} position={[x, y, z]}>
                      <sphereGeometry args={[artwork.isUserContent ? 0.04 : 0.03, 8, 8]} />
                      <meshBasicMaterial 
                        color={artwork.color} 
                        transparent 
                        opacity={artwork.isUserContent ? 0.8 : 0.6} 
                      />
                    </mesh>
                  );
                })}
              </group>
            </group>
          </group>
        );
      })}
      
      {/* Floor */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -2.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial 
          color="#080808" 
          roughness={0.05} 
          metalness={0.8} 
        />
      </mesh>
    </group>
  );
};

export default LuminaGalleryScene;