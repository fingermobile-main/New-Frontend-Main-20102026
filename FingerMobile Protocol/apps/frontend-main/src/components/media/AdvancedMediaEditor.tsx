import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';  // Using absolute path from src

import './AdvancedMediaEditor.css';

interface MediaFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

interface EditingState {
  filter: string;
  text: string;
  rotation: number;
  scale: number;
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  hue: number;
  sharpen: number;
}

interface VideoState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

interface TrimSettings {
  start: number;
  end: number;
}

const AdvancedMediaEditor: React.FC = () => {
  const { showToast } = useAppContext();
  const [mediaFile, setMediaFile] = React.useState<MediaFile | null>(null);
  const [mediaType, setMediaType] = React.useState<
    'image' | 'video' | 'audio' | null
  >(null);
  const [editingTools, setEditingTools] = React.useState<EditingState>({
    filter: '',
    text: '',
    rotation: 0,
    scale: 100,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hue: 0,
    sharpen: 0
  });
  const [selectedEffect, setSelectedEffect] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [gainMapData, setGainMapData] = React.useState<any | null>(null);
  const [videoState, setVideoState] = React.useState<VideoState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0
  });
  const [trimSettings, setTrimSettings] = React.useState<TrimSettings>({
    start: 0,
    end: 0
  });
  const [layers, setLayers] = React.useState<any[]>([]);
  const [selectedLayer, setSelectedLayer] = React.useState<number | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  React.useEffect(() => {
    if (mediaType === 'video' && videoRef.current) {
      const video = videoRef.current;

      const updateTime = () => {
        setVideoState((prev) => ({
          ...prev,
          currentTime: video.currentTime,
          duration: video.duration || 0
        }));
      };

      video.addEventListener('timeupdate', updateTime);
      video.addEventListener('loadedmetadata', updateTime);

      return () => {
        video.removeEventListener('timeupdate', updateTime);
        video.removeEventListener('loadedmetadata', updateTime);
      };
    }
  }, [mediaType]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newMediaFile: MediaFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: url
      };

      setMediaFile(newMediaFile);

      if (file.type.startsWith('image/')) {
        setMediaType('image');
        setPreviewUrl(url);
      } else if (file.type.startsWith('video/')) {
        setMediaType('video');
        setPreviewUrl(url);
        setTrimSettings({ start: 0, end: 0 });
      } else if (file.type.startsWith('audio/')) {
        setMediaType('audio');
        setPreviewUrl(url);
      }
    }
  };

  const togglePlayback = () => {
    if (mediaType === 'video' && videoRef.current) {
      const video = videoRef.current;
      if (videoState.isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setVideoState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
    } else if (mediaType === 'audio' && audioRef.current) {
      const audio = audioRef.current;
      if (videoState.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setVideoState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
    }
  };

  const handleSeek = (time: number) => {
    if (mediaType === 'video' && videoRef.current) {
      videoRef.current.currentTime = time;
    } else if (mediaType === 'audio' && audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const applyFilter = (filterType: string) => {
    setEditingTools((prev) => ({ ...prev, filter: filterType }));
  };

  const handleRotation = (degrees: number) => {
    setEditingTools((prev) => ({
      ...prev,
      rotation: (prev.rotation + degrees) % 360
    }));
  };

  const handleScale = (scaleValue: number) => {
    setEditingTools((prev) => ({
      ...prev,
      scale: scaleValue
    }));
  };

  const handleAdjustmentChange = (type: keyof EditingState, value: number) => {
    setEditingTools((prev) => ({
      ...prev,
      [type]: value
    }));
  };

  const addText = () => {
    if (editingTools.text.trim()) {
      const newLayer = {
        id: Date.now(),
        type: 'text',
        content: editingTools.text,
        x: 50,
        y: 50,
        fontSize: 24,
        color: '#ffffff'
      };

      setLayers((prev) => [...prev, newLayer]);
      setSelectedLayer(layers.length);
      setEditingTools((prev) => ({ ...prev, text: '' }));
    }
  };

  const trimMedia = async () => {
    if (!mediaFile) return;

    try {
      setIsProcessing(true);
      const response = await fetch('/api/media/trim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filePath: mediaFile.url,
          start: trimSettings.start,
          end: trimSettings.end || videoState.duration
        })
      });

      if (!response.ok) {
        throw new Error('Failed to trim media');
      }

      const result = await response.json();
      showToast(`Media trimmed successfully: ${result.output}`, 'success');
    } catch (e) {
      console.error('Error trimming media:', e);
      showToast('Failed to trim media', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const applyEffect = async (effectType: string) => {
    if (!mediaFile) return;

    try {
      setIsProcessing(true);
      const response = await fetch('/api/media/apply-effect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filePath: mediaFile.url,
          effect: effectType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to apply effect');
      }

      const result = await response.json();
      setSelectedEffect(effectType);
      showToast(
        `${effectType} effect applied successfully: ${result.output}`, 'success'
      );
    } catch (e) {
      console.error('Error applying effect:', e);
      showToast('Failed to apply effect', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const createUltraHdrImage = async () => {
    if (!mediaFile || mediaType !== 'image') return;

    try {
      setIsProcessing(true);
      const response = await fetch('/api/media/create-ultra-hdr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filePath: mediaFile.url,
          quality: 90
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create Ultra HDR image');
      }

      const result = await response.json();
      setGainMapData(result.gainMapData);
      showToast(`Ultra HDR image created successfully: ${result.output}`, 'success');
    } catch (e) {
      console.error('Error creating Ultra HDR image:', e);
      showToast('Failed to create Ultra HDR image', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const convertFormat = async () => {
    if (!mediaFile || !selectedFormat) return;

    try {
      setIsProcessing(true);
      const response = await fetch('/api/media/convert-format', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filePath: mediaFile.url,
          format: selectedFormat
        })
      });

      if (!response.ok) {
        throw new Error('Failed to convert format');
      }

      const result = await response.json();
      showToast(`Media converted successfully: ${result.output}`, 'success');
    } catch (e) {
      console.error('Error converting format:', e);
      showToast('Failed to convert format', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const exportMedia = async () => {
    if (!mediaFile) return;

    try {
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showToast('Media exported successfully!', 'success');
    } catch (e) {
      console.error('Error exporting media:', e);
      showToast('Failed to export media', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetEditor = () => {
    setMediaFile(null);
    setMediaType(null);
    setEditingTools({
      filter: '',
      text: '',
      rotation: 0,
      scale: 100,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      hue: 0,
      sharpen: 0
    });
    setSelectedEffect('');
    setPreviewUrl(null);
    setGainMapData(null);
    setVideoState({
      isPlaying: false,
      currentTime: 0,
      duration: 0
    });
    setTrimSettings({
      start: 0,
      end: 0
    });
    setLayers([]);
    setSelectedLayer(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const [availableFormats] = React.useState<string[]>([
    'mp4',
    'avi',
    'mov',
    'wmv',
    'flv',
    'webm',
    'mkv',
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'tiff',
    'webp',
    'mp3',
    'wav',
    'flac',
    'aac',
    'ogg',
    'wma'
  ]);

  const [selectedFormat, setSelectedFormat] = React.useState('');

  return (
    <div className="advanced-media-editor">
      <div className="editor-header">
        <h2>Advanced Media Editor</h2>
        <p>Edit your photos, videos, and audio with professional tools</p>
      </div>

      {!mediaFile ? (
        <div className="upload-section">
          <div
            className="upload-area"
            onClick={() => fileInputRef.current?.click()} role="button" tabIndex={0}
          >
            <div className="upload-icon">📁</div>
            <p>Click to upload media</p>
            <p className="upload-hint">Supports JPG, PNG, MP4, MOV, MP3, WAV</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />

          <div className="media-type-buttons">
            <button
              className="tool-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              🖼️ Image
            </button>
            <button
              className="tool-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              🎥 Video
            </button>
            <button
              className="tool-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              🎵 Audio
            </button>
          </div>
        </div>
      ) : (
        <div className="editor-container">
          <div className="preview-section">
            <div className="preview-container">
              {mediaType === 'image' && previewUrl && (
                <div className="image-preview-wrapper">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className={`media-preview ${gainMapData ? 'hdr-image' : ''}`}
                    style={{
                      transform: `rotate(${editingTools.rotation}deg) scale(${editingTools.scale / 100})`,
                      filter: `
                        brightness(${editingTools.brightness}%)
                        contrast(${editingTools.contrast}%)
                        saturate(${editingTools.saturation}%)
                        blur(${editingTools.blur}px)
                        hue-rotate(${editingTools.hue}deg)
                      `
                    }}
                  />
                  {layers.map((layer, index) => (
                    <div
                      key={layer.id}
                      className={`layer-overlay ${selectedLayer === index ? 'selected' : ''}`}
                      style={{
                        position: 'absolute',
                        left: `${layer.x}%`,
                        top: `${layer.y}%`,
                        fontSize: `${layer.fontSize}px`,
                        color: layer.color,
                        cursor: 'move'
                      }}
                      onClick={() => setSelectedLayer(index)} role="button" tabIndex={0}
                    >
                      {layer.content}
                    </div>
                  ))}
                </div>
              )}
              {mediaType === 'video' && previewUrl && (
                <div className="video-player">
                  <video
                    ref={videoRef}
                    src={previewUrl}
                    className="media-preview"
                    onPlay={() =>
                      setVideoState((prev) => ({ ...prev, isPlaying: true }))
                    }
                    onPause={() =>
                      setVideoState((prev) => ({ ...prev, isPlaying: false }))
                    }
                  >
                    <track kind="captions" label="English" srcLang="en" />
                  </video>
                  <div className="video-controls">
                    <button className="control-button" onClick={togglePlayback}>
                      {videoState.isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <span className="time-display">
                      {formatTime(videoState.currentTime)} /{' '}
                      {formatTime(videoState.duration)}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max={videoState.duration || 100}
                      value={videoState.currentTime}
                      onChange={(e) => handleSeek(parseFloat(e.target.value))}
                      className="progress-slider"
                    />
                  </div>
                </div>
              )}
              {mediaType === 'audio' && previewUrl && (
                <div className="audio-player">
                  <div className="audio-visualizer">
                    <div className="visualizer-bars">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="bar"
                          style={{ height: `${Math.random() * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <audio
                    ref={audioRef}
                    src={previewUrl}
                    className="media-preview"
                  >
                    <track kind="captions" label="English" srcLang="en" />
                  </audio>
                  <div className="audio-controls">
                    <button className="control-button" onClick={togglePlayback}>
                      {videoState.isPlaying ? '⏸️' : '▶️'}
                    </button>
                    <span className="time-display">
                      {formatTime(videoState.currentTime)} /{' '}
                      {formatTime(videoState.duration)}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max={videoState.duration || 100}
                      value={videoState.currentTime}
                      onChange={(e) => handleSeek(parseFloat(e.target.value))}
                      className="progress-slider"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="media-info">
              <h3>{mediaFile.name}</h3>
              <p>
                {mediaType?.toUpperCase()} •{' '}
                {(mediaFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div className="tools-section">
            <div className="tool-group">
              <h3>Basic Tools</h3>
              <div className="basic-tools">
                <button
                  className="tool-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  📁 New Media
                </button>
                <button className="tool-btn" onClick={resetEditor}>
                  🗑️ Clear
                </button>
              </div>
            </div>

            <div className="tool-group">
              <h3>Filters</h3>
              <div className="filters">
                {[
                  'None',
                  'Grayscale',
                  'Sepia',
                  'Vintage',
                  'Blur',
                  'Invert',
                  'Brightness',
                  'Contrast',
                  'Saturate'
                ].map((filter) => (
                  <button
                    key={filter}
                    className={`tool-btn ${editingTools.filter === filter.toLowerCase() ? 'active' : ''}`}
                    onClick={() => applyFilter(filter.toLowerCase())}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="tool-group">
              <h3>Adjustments</h3>
              <div className="adjustments">
                <div className="adjustment-control">
                  <label>Brightness: {editingTools.brightness}%</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={editingTools.brightness}
                    onChange={(e) =>
                      handleAdjustmentChange(
                        'brightness',
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>
                <div className="adjustment-control">
                  <label>Contrast: {editingTools.contrast}%</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={editingTools.contrast}
                    onChange={(e) =>
                      handleAdjustmentChange(
                        'contrast',
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>
                <div className="adjustment-control">
                  <label>Saturation: {editingTools.saturation}%</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={editingTools.saturation}
                    onChange={(e) =>
                      handleAdjustmentChange(
                        'saturation',
                        parseInt(e.target.value),
                      )
                    }
                  />
                </div>
                <div className="adjustment-control">
                  <label>Blur: {editingTools.blur}px</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={editingTools.blur}
                    onChange={(e) =>
                      handleAdjustmentChange('blur', parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="adjustment-control">
                  <label>Hue: {editingTools.hue}°</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={editingTools.hue}
                    onChange={(e) =>
                      handleAdjustmentChange('hue', parseInt(e.target.value))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="tool-group">
              <h3>Transform</h3>
              <div className="transform-tools">
                <button
                  className="tool-btn"
                  onClick={() => handleRotation(-90)}
                >
                  ↺ Rotate Left
                </button>
                <button className="tool-btn" onClick={() => handleRotation(90)}>
                  ↻ Rotate Right
                </button>
                <div className="scale-control">
                  <label>Scale: {editingTools.scale}%</label>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={editingTools.scale}
                    onChange={(e) => handleScale(parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {mediaType === 'image' && (
              <div className="tool-group">
                <h3>Layers</h3>
                <div className="layers-panel">
                  <div className="text-tools">
                    <input
                      type="text"
                      placeholder="Enter text"
                      value={editingTools.text}
                      onChange={(e) => setEditingTools((prev) => ({
                        ...prev,
                        text: e.target.value
                      }))
                      }
                    />
                    <button className="tool-btn" onClick={addText}>
                      ➕ Add Text
                    </button>
                  </div>
                  <div className="layers-list">
                    {layers.map((layer, index) => (
                      <div
                        key={layer.id}
                        className={`layer-item ${selectedLayer === index ? 'selected' : ''}`}
                        onClick={() => setSelectedLayer(index)} role="button" tabIndex={0}
                      >
                        {layer.type === 'text'
                          ? `Text: ${layer.content}`
                          : `Layer ${index + 1}`}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(mediaType === 'video' || mediaType === 'audio') && (
              <div className="tool-group">
                <h3>Editing</h3>
                <div className="media-editing-tools">
                  <button
                    className="tool-btn"
                    onClick={trimMedia}
                    disabled={isProcessing}
                  >
                    ✂️ Trim {mediaType === 'video' ? 'Video' : 'Audio'}
                  </button>

                  {mediaType === 'video' && (
                    <div className="video-transform-controls">
                      <label>Video Scale: {editingTools.scale}%</label>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={editingTools.scale}
                        onChange={(e) =>
                          setEditingTools((prev) => ({
                            ...prev,
                            scale: parseFloat(e.target.value)
                          }))
                        }
                        className="slider"
                      />
                      <label>Video Rotation: {editingTools.rotation}°</label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={editingTools.rotation}
                        onChange={(e) =>
                          setEditingTools((prev) => ({
                            ...prev,
                            rotation: parseFloat(e.target.value)
                          }))
                        }
                        className="slider"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="tool-group">
              <h3>Special Features</h3>
              <div className="special-tools">
                {mediaType === 'image' && (
                  <button
                    className="tool-btn"
                    onClick={createUltraHdrImage}
                    disabled={isProcessing}
                  >
                    🌈 Create HDR
                  </button>
                )}
                <div className="effect-selection">
                  <select
                    value={selectedEffect}
                    onChange={(e) => setSelectedEffect(e.target.value)}
                    className="effect-dropdown"
                  >
                    <option value="">Select Effect</option>
                    {mediaType === 'image' && (
                      <>
                        <option value="enhance">Enhance</option>
                        <option value="sharpen">Sharpen</option>
                        <option value="vignette">Vignette</option>
                        <option value="oil_painting">Oil Painting</option>
                        <option value="watercolor">Watercolor</option>
                      </>
                    )}
                    {mediaType === 'video' && (
                      <>
                        <option value="slow_motion">Slow Motion</option>
                        <option value="fast_motion">Fast Motion</option>
                        <option value="vintage_video">Vintage Look</option>
                        <option value="black_and_white">Black & White</option>
                        <option value="reverse">Reverse</option>
                      </>
                    )}
                    {mediaType === 'audio' && (
                      <>
                        <option value="echo">Echo</option>
                        <option value="robot_voice">Robot Voice</option>
                        <option value="amplify">Amplify</option>
                        <option value="reverb">Reverb</option>
                        <option value="pitch_shift">Pitch Shift</option>
                      </>
                    )}
                  </select>
                  <button
                    className="tool-btn"
                    onClick={() => applyEffect(selectedEffect)}
                    disabled={isProcessing || !selectedEffect}
                  >
                    ✨ Apply Effect
                  </button>
                </div>

                <div className="format-conversion">
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="format-dropdown"
                  >
                    <option value="">Convert Format</option>
                    {availableFormats.map((format) => (
                      <option key={format} value={format}>
                        {format.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <button
                    className="tool-btn"
                    onClick={convertFormat}
                    disabled={isProcessing || !selectedFormat}
                  >
                    🔄 Convert
                  </button>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn-secondary" onClick={resetEditor}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={exportMedia}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Export'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedMediaEditor;
