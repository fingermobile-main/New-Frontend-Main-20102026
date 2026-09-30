import React, { useState, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoplay?: boolean;
  controls?: boolean;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title,
  autoplay = false,
  controls = true,
  className = ''
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(autoplay);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {title && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4">
          <h3 className="text-white font-semibold">{title}</h3>
        </div>
      )}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoplay}
        controls={controls}
        className="w-full aspect-video"
        onClick={togglePlay}
      />
      {!controls && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
        >
          <span className="text-white text-6xl">
            {isPlaying ? '⏸' : '▶️'}
          </span>
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
