import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';

import * as THREE from 'three';
import { MediaFile } from '../utils/mediaProcessing';
import { frameShaderMaterial, particleShaderMaterial } from '../utils/shaderEffects';

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
  type: 'image' | 'video';
}

interface AdvancedLuminaSceneProps {
  onArtworkClick?: (artwork: ArtworkData) => void;
  userMedia?: MediaFile[];
}

const AdvancedLuminaScene: React.FC<AdvancedLuminaSceneProps> = ({ onArtworkClick, userMedia = [] }) => {
  // Static Gallery Data - wrapped in useMemo to prevent re-creation on every render
  const baseGalleryData = useMemo<ArtworkData[]>(() => [
    {
      id: 1,
      title: "Neon Genesis",
      desc: "A vibrant exploration of digital consciousness emerging from the void.",
      img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop",
      color: "#00f2ff",
      stage: "01",
      ficReward: 0.05,
      type: 'image'
    },
    {
      id: 2,
      title: "Silent Geometry",
      desc: "Minimalist structures floating in an infinite white space.",
      img: "https://images.unsplash.com/photo-1506259091721-347f798196d4?q=80&w=1000&auto=format&fit=crop",
      color: "#ffffff",
      stage: "02",
      ficReward: 0.08,
      type: 'image'
    },
    {
      id: 3,
      title: "Crimson Tide",
      desc: "An emotional wave of red and orange, capturing the raw intensity of a digital sunset.",
      img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop",
      color: "#ff0055",
      stage: "03",
      ficReward: 0.12,
      type: 'image'
    },
    {
      id: 4,
      title: "Aurora Borealis",
      desc: "The natural phenomenon reimagined through code.",
      img: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1000&auto=format&fit=crop",
      color: "#00ff88",
      stage: "04",
      ficReward: 0.15,
      type: 'image'
    },
    {
      id: 5,
      title: "Deep Space",
      desc: "A journey into the unknown. Dark matter and distant stars collide.",
      img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop",
      color: "#8800ff",
      stage: "01",
      ficReward: 0.06,
      type: 'image'
    },
    {
      id: 6,
      title: "Liquid Gold",
      desc: "Fluid dynamics rendered in precious metal.",
      img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
      color: "#ffaa00",
      stage: "02",
      ficReward: 0.10,
      type: 'image'
    },
    {
      id: 7,
      title: "Cyber Mist",
      desc: "Fog rolling over a neon cityscape.",
      img: "https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=1000&auto=format&fit=crop",
      color: "#ff00aa",
      stage: "03",
      ficReward: 0.14,
      type: 'image'
    },
    {
      id: 8,
      title: "Abstract Mind",
      desc: "Neural pathways visualized.",
      img: "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=1000&auto=format&fit=crop",
      color: "#00aaff",
      stage: "04",
      ficReward: 0.20,
      type: 'image'
    }
  ], []);

  // Combine system artwork with user media
  const combinedGalleryData = useMemo(() => {
    const userArtworks = userMedia.map((media, index) => ({
      id: 100 + index,
      title: media.metadata.fileName,
      desc: `User uploaded content: ${media.metadata.fileName}`,
      img: media.previewUrl,
      color: "#FFD700",
      stage: "U1",
      ficReward: 0.05,
      isUserContent: true,
      mediaFile: media,
      type: media.type as 'image' | 'video'
    }));

    return [...baseGalleryData, ...userArtworks];
  }, [baseGalleryData, userMedia]);

  // Refs
  const groupRef = useRef<THREE.Group>(null);
  
  // State
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  
  // Isolate images for the texture array hook safely
  const imageArtworks = useMemo(() => combinedGalleryData.filter(item => item.type === 'image'), [combinedGalleryData]);
  const imageURLs = useMemo(() => imageArtworks.map(item => item.img), [imageArtworks]);

  // Safely load textures using Drei's useTexture hook
  const loadedTextures = useTexture(imageURLs.length > 0 ? imageURLs : ["https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=10"]);
  const textures = Array.isArray(loadedTextures) ? loadedTextures : [loadedTextures];

  // Video Element Pipeline Optimization 
  const videoElementsMap = useMemo(() => {
    const videoMap = new Map<number, HTMLVideoElement>();
    combinedGalleryData.forEach(item => {
      if (item.type === 'video') {
        const video = document.createElement('video');
        video.src = item.img;
        video.crossOrigin = 'anonymous';
        video.loop = true;
        video.muted = true;
        video.play().catch(err => console.debug("Video autoplay deferred for interaction:", err));
        videoMap.set(item.id, video);
      }
    });
    return videoMap;
  }, [combinedGalleryData]);

  // Generate video textures mapped directly to unique IDs
  const videoTexturesMap = useMemo(() => {
    const textureMap = new Map<number, THREE.VideoTexture>();
    videoElementsMap.forEach((video, id) => {
      textureMap.set(id, new THREE.VideoTexture(video));
    });
    return textureMap;
  }, [videoElementsMap]);

  // Clean up video instances on unmount
  useEffect(() => {
    return () => {
      videoElementsMap.forEach(video => {
        video.pause();
        video.src = '';
        video.load();
      });
    };
  }, [videoElementsMap]);

  // Calculate positions for frames in a circle
  const framePositions = useMemo(() => {
    const count = combinedGalleryData.length;
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
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    groupRef.current.children.forEach((frameGroup, i) => {
      if (frameGroup.userData.isFrameContainer) {
        // Soft floating bounce calculation
        frameGroup.position.y = Math.sin(time * 0.5 + i) * 0.08;

        // Update shaders down the element node tree
        frameGroup.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
            if (child.material.uniforms?.time) {
              child.material.uniforms.time.value = time;
            }
          }
          if (child instanceof THREE.Points && child.material instanceof THREE.ShaderMaterial) {
            if (child.material.uniforms?.time) {
              child.material.uniforms.time.value = time;
            }
          }
        });
      }
    });
  });

  // Handle click events
  const handleClick = useCallback((id: number) => {
    const artwork = combinedGalleryData.find(item => item.id === id);
    if (artwork && onArtworkClick) {
      onArtworkClick(artwork);
    }
  }, [combinedGalleryData, onArtworkClick]);

  // Handle mouse enter for highlighting
  const handlePointerOver = (id: number) => {
    setHoveredId(id);
    document.body.style.cursor = 'pointer';
  };

  // Handle mouse leave
  const handlePointerOut = () => {
    setHoveredId(null);
    document.body.style.cursor = 'default'; // FIXED: Corrected crash property 'closePath'
  };

  return (
    <group ref={groupRef}>
      {framePositions.map((pos, index) => {
        const artwork = combinedGalleryData[index];
        const isHighlighted = hoveredId === artwork.id;
        
        // Match texture safely without breaks 
        let texture: THREE.Texture | undefined;
        if (artwork.type === 'image') {
          const imgIndex = imageArtworks.findIndex(a => a.id === artwork.id);
          texture = textures[imgIndex >= 0 ? imgIndex : 0];
        } else {
          texture = videoTexturesMap.get(artwork.id);
        }
        
        const shaderMaterial = new THREE.ShaderMaterial({
          ...frameShaderMaterial,
          uniforms: {
            ...frameShaderMaterial.uniforms,
            time: { value: 0 },
            color: { value: new THREE.Color(artwork.color) },
            isHighlighted: { value: isHighlighted }
          },
          side: THREE.DoubleSide
        });
        
        return (
          <group 
            key={`frame-${artwork.id}`}
            position={[pos.x, 0, pos.z]}
            userData={{ isFrameContainer: true }}
          >
            <group rotation={[0, Math.PI - pos.angle, 0]}>
              <mesh
                castShadow
                receiveShadow
                onClick={() => handleClick(artwork.id)}
                onPointerOver={() => handlePointerOver(artwork.id)}
                onPointerOut={handlePointerOut}
              >
                <boxGeometry args={[2.2, 3.2, 0.15]} />
                {isHighlighted ? (
                  <meshStandardMaterial 
                    color="#FFD700"
                    roughness={0.1}
                    metalness={0.9}
                    emissive={artwork.color}
                    emissiveIntensity={0.3}
                  />
                ) : (
                  <primitive object={shaderMaterial} attach="material" />
                )}
                
                {/* Canvas Display */}
                {texture && (
                  <mesh position={[0, 0, 0.08]}>
                    <planeGeometry args={[2.05, 3.05]} />
                    <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
                  </mesh>
                )}
              </mesh>
              
              <pointLight 
                position={[0, 0, -0.8]} 
                color={artwork.color} 
                intensity={0.8} 
                distance={5} 
              />
              
              <PointsWithShaders artwork={artwork} />
            </group>
          </group>
        );
      })}
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#080808" roughness={0.05} metalness={0.8} />
      </mesh>
    </group>
  );
};

// Particle Shading Node Child Component
const PointsWithShaders: React.FC<{ artwork: ArtworkData }> = ({ artwork }) => {
  const particleCount = artwork.isUserContent ? 40 : 25;
  
  const [positions, sizes, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const sz = new Float32Array(particleCount);
    const col = new Float32Array(particleCount * 3);
    const baseColor = new THREE.Color(artwork.color);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 3;
      pos[i3 + 1] = (Math.random() - 0.5) * 4;
      pos[i3 + 2] = (Math.random() - 0.5) * 2;
      
      sz[i] = 0.03 + Math.random() * 0.02;
      
      col[i3] = baseColor.r;
      col[i3 + 1] = baseColor.g;
      col[i3 + 2] = baseColor.b;
    }
    return [pos, sz, col];
  }, [particleCount, artwork.color]);
  
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      ...particleShaderMaterial,
      uniforms: {
        ...particleShaderMaterial.uniforms,
        particleColor: { value: new THREE.Color(artwork.color) },
        time: { value: 0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending
    });
  }, [artwork.color]);
  
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-customColor"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  );
};

export default AdvancedLuminaScene;