import React, { useEffect, useRef, useState } from 'react';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ShareIcon,
  SpeakerWaveIcon as VolumeUpIcon,
  SpeakerXMarkIcon as VolumeOffIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ArrowPathIcon,
  FilmIcon,
  PhotoIcon,
  MusicalNoteIcon as MusicNoteIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  ScissorsIcon,
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  QueueListIcon,
  ClockIcon,
  EyeIcon,
  ArrowUpTrayIcon,
  CurrencyDollarIcon,
  BoltIcon
} from '../../components/icons';
import { Tab } from '@headlessui/react';
import { useAppContext } from '../../contexts/AppContext';

interface ProfessionalVideoEditorProps {
  projectId?: string;
}

const ProfessionalVideoEditor: React.FC<ProfessionalVideoEditorProps> = ({ projectId }) => {
  const { showToast } = useAppContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateProgress = () => {
        setCurrentTime(video.currentTime);
      };
      const setVideoDuration = () => {
        setDuration(video.duration);
      };

      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('loadedmetadata', setVideoDuration);

      return () => {
        video.removeEventListener('timeupdate', updateProgress);
        video.removeEventListener('loadedmetadata', setVideoDuration);
      };
    }
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleStop = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('https://fingermobileprotocol.com/share/video-editor-project-link');
    showToast('Share link copied to clipboard!', 'success');
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const timeline = timelineRef.current;
    const video = videoRef.current;
    if (timeline && video) {
      const timelineWidth = timeline.offsetWidth;
      const clickX = e.nativeEvent.offsetX;
      const newTime = (clickX / timelineWidth) * duration;
      video.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handlePlaybackSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSpeed = parseFloat(e.target.value);
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setUploadedFile(file);
      const video = videoRef.current;
      if (video) {
        video.src = URL.createObjectURL(file);
        video.load();
        video.play();
        setIsPlaying(true);
      }
      showToast(`File "${file.name}" uploaded successfully!`, 'success');
    }
  };

  const handleAddToTimeline = () => {
    if (uploadedFile) {
      showToast(`"${uploadedFile.name}" added to timeline! (Simulated)`, 'info');
      // In a real application, you would add the file to a timeline state or editor
    } else {
      showToast('Please upload a file first.', 'warning');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold">Professional Video Editor</h1>
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700">
            <ArrowDownTrayIcon className="w-5 h-5 mr-2" /> Export
          </button>
          <button className="flex items-center px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600" onClick={handleCopy}>
            <ShareIcon className="w-5 h-5 mr-2" /> Share
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Media, Effects, etc. */}
        <div className="w-1/5 bg-gray-800 p-4 overflow-y-auto">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-700 p-1">
              <Tab className={({ selected }: { selected: boolean }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected ? 'bg-white text-gray-900 shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-slate-700'}`
              }>
                Media
              </Tab>
              <Tab className={({ selected }: { selected: boolean }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected ? 'bg-white text-gray-900 shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-slate-700'}`
              }>
                Effects
              </Tab>
              <Tab className={({ selected }: { selected: boolean }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected ? 'bg-white text-gray-900 shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-slate-700'}`
              }>
                Text
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Project Media</h3>
                  <div className="border border-gray-600 rounded-md p-4 text-center">
                    {uploadedFile ? (
                      <div>
                        <p className="text-sm truncate">{uploadedFile.name}</p>
                        <button
                          onClick={handleAddToTimeline}
                          className="mt-2 flex items-center justify-center w-full px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
                        >
                          <PlusIcon className="w-5 h-5 mr-2" /> Add to Timeline
                        </button>
                      </div>
                    ) : (
                      <>
                        <ArrowUpTrayIcon className="w-12 h-12 mx-auto text-slate-500" />
                        <p className="mt-2 text-sm text-gray-400">Drag & drop files or</p>
                        <label htmlFor="file-upload" className="cursor-pointer text-blue-400 hover:text-blue-300">
                          Browse
                          <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} accept="video/*,image/*,audio/*" />
                        </label>
                      </>
                    )}
                  </div>
                  {/* Placeholder for media items */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-700 h-24 rounded-md flex items-center justify-center text-gray-400">Video 1</div>
                    <div className="bg-gray-700 h-24 rounded-md flex items-center justify-center text-gray-400">Image 1</div>
                    <div className="bg-gray-700 h-24 rounded-md flex items-center justify-center text-gray-400">Audio 1</div>
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <h3 className="text-lg font-semibold">Effects (Coming Soon)</h3>
                <p className="text-gray-400">Explore a variety of visual and audio effects to enhance your content.</p>
              </Tab.Panel>
              <Tab.Panel>
                <h3 className="text-lg font-semibold">Text (Coming Soon)</h3>
                <p className="text-gray-400">Add stylish text overlays and titles to your videos.</p>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

        {/* Center Panel - Video Player and Canvas */}
        <div className="flex-1 flex flex-col bg-gray-900">
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="relative w-full h-full bg-black flex items-center justify-center rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={uploadedFile ? URL.createObjectURL(uploadedFile) : 'https://www.w3schools.com/html/mov_bbb.mp4'} // Default video
                className="max-w-full max-h-full"
                onEnded={() => setIsPlaying(false)}
              >
                Your browser does not support the video tag.
              </video>
              {!uploadedFile && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-xl">
                  Upload or select media to start editing
                </div>
              )}
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-col p-4 bg-gray-800">
            <div className="flex items-center space-x-4 mb-4">
              <button onClick={handlePlayPause} className="p-2 rounded-full bg-blue-600 hover:bg-blue-700">
                {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
              </button>
              <button onClick={handleStop} className="p-2 rounded-full bg-gray-600 hover:bg-gray-700">
                <StopIcon className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-2">
                <button onClick={handleMuteToggle} className="p-1 rounded-full hover:bg-gray-700">
                  {isMuted || volume === 0 ? <VolumeOffIcon className="w-5 h-5" /> : <VolumeUpIcon className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <select
                value={playbackSpeed}
                onChange={handlePlaybackSpeedChange}
                className="bg-gray-700 text-white text-sm rounded-md px-2 py-1"
              >
                <option value="0.5">0.5x</option>
                <option value="1">1x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>
            </div>

            {/* Timeline */}
            <div
              ref={timelineRef}
              className="relative w-full h-16 bg-gray-700 rounded-md cursor-pointer"
              onClick={handleTimelineClick} role="button" tabIndex={0}
            >
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 opacity-50 rounded-md"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
              <div
                className="absolute top-0 h-full border-l-2 border-white"
                style={{ left: `${(currentTime / duration) * 100}%` }}
              ></div>
              {/* Placeholder for timeline tracks */}
              <div className="absolute inset-0 flex flex-col justify-around p-2 text-xs text-gray-400">
                <div>Video Track</div>
                <div>Audio Track</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Inspector, Settings, etc. */}
        <div className="w-1/5 bg-gray-800 p-4 overflow-y-auto">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-700 p-1">
              <Tab className={({ selected }: { selected: boolean }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected ? 'bg-white text-gray-900 shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-slate-700'}`
              }>
                Inspector
              </Tab>
              <Tab className={({ selected }: { selected: boolean }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected ? 'bg-white text-gray-900 shadow' : 'text-blue-100 hover:bg-white/[0.12] hover:text-slate-700'}`
              }>
                Settings
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel>
                <h3 className="text-lg font-semibold">Inspector (Coming Soon)</h3>
                <p className="text-gray-400">View and edit properties of selected elements on the timeline.</p>
              </Tab.Panel>
              <Tab.Panel>
                <h3 className="text-lg font-semibold">Project Settings (Coming Soon)</h3>
                <p className="text-gray-400">Configure project-wide settings like resolution, frame rate, etc.</p>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>

      {/* Bottom Panel - Timeline Controls */}
      <div className="p-4 bg-gray-800 shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full bg-gray-600 hover:bg-gray-700">
            <ScissorsIcon className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full bg-gray-600 hover:bg-gray-700">
            <SparklesIcon className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full bg-gray-600 hover:bg-gray-700">
            <AdjustmentsHorizontalIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full bg-gray-600 hover:bg-gray-700">
            <QueueListIcon className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full bg-gray-600 hover:bg-gray-700">
            <ClockIcon className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full bg-gray-600 hover:bg-gray-700">
            <EyeIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalVideoEditor;
