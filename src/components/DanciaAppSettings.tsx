import React, { useState } from 'react';
import {
  X, Folder, RotateCcw, Monitor, Smartphone,
  History, Settings, Eye, Type, Shield, HardDrive,
  Cpu, Languages, Subtitles, Headphones, Sliders as Equalizer,
  Lock, Trash2, Database, Download, Check, Play,
  Bell, Wifi, Volume2, Palette, FileText, AlertTriangle,
  CheckCircle, XCircle, EyeOff, Group, SortAsc, Filter,
  RefreshCw, Clock, HeadphonesIcon, Music, Video, Image,
  Heart
} from 'lucide-react';
import { useAppContext } from "../contexts/AppContext";  // Using absolute path from src
import { ProtocolSettings } from '../types/dancia4tv';
import ParentalControlService from '../services/ParentalControlService';

const DanciaAppSettings: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { settings, updateSettings, showToast } = useAppContext();
  const [activeTab, setActiveTab] = React.useState<'media' | 'video' | 'audio' | 'interface' | 'parental' | 'advanced' | 'filtering' | 'sorting'>('media');
  const [pinInput, setPinInput] = React.useState('');
  const [pinConfirm, setPinConfirm] = React.useState('');
  const [showPinDialog, setShowPinDialog] = React.useState(false);

  const tabs = [
    { id: 'media', label: 'Media Library', icon: <HardDrive size={18} /> },
    { id: 'video', label: 'Video & Playback', icon: <Monitor size={18} /> },
    { id: 'audio', label: 'Audio & Subtitles', icon: <Headphones size={18} /> },
    { id: 'interface', label: 'Interface', icon: <Type size={18} /> },
    { id: 'filtering', label: 'Filtering', icon: <Filter size={18} /> },
    { id: 'sorting', label: 'Sorting', icon: <SortAsc size={18} /> },
    { id: 'parental', label: 'Parental Control', icon: <Shield size={18} /> },
    { id: 'advanced', label: 'Advanced', icon: <Settings size={18} /> }
  ];

  const toggle = (key: keyof ProtocolSettings) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleSelect = (key: keyof ProtocolSettings, value: unknown) => {
    updateSettings({ [key]: value });
  };

  const handleSetPIN = async () => {
    if (pinInput !== pinConfirm) {
      showToast('PINs do not match', 'error');
      return;
    }
    if (pinInput.length < 4 || pinInput.length > 6) {
      showToast('PIN must be 4-6 digits', 'error');
      return;
    }
    try {
      await ParentalControlService.setPIN(pinInput);
      updateSettings({ appLockPin: pinInput });
      showToast('PIN set successfully', 'success');
      setShowPinDialog(false);
      setPinInput('');
      setPinConfirm('');
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  const mediaFolders = ['Internal Memory', 'SD Card 1', 'SD Card 2', 'Network Drive', 'USB Storage', 'Cloud Storage'];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-gray-900 w-full max-w-6xl h-[90vh] rounded-[3rem] border border-white/10 shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-black/40 border-r border-white/5 p-8 flex flex-col">
          <div className="mb-10">
            <h2 className="text-2xl font-black text-white tracking-tighter">APP SETTINGS</h2>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em]">Protocol v2.4.0</p>
          </div>
          <nav className="flex-grow space-y-1 overflow-y-auto max-h-[60vh]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-4 px-6 py-3.5 rounded-2xl font-bold text-xs transition-all uppercase tracking-widest ${
                  activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-grow flex flex-col min-w-0">
          <header className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <h3 className="text-lg font-black text-white uppercase tracking-tight">{activeTab} Settings</h3>
            <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all">
              <X size={20} />
            </button>
          </header>

          <div className="flex-grow p-10 overflow-y-auto custom-scrollbar space-y-10">
            {/* Media Library Tab */}
            {activeTab === 'media' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <section>
                  <label htmlFor="storageLocations" className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-4">Storage Locations</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {mediaFolders.map(loc => (
                      <div key={loc} className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.07] transition-all">
                        <div className="flex items-center space-x-4">
                           <Folder className="text-blue-500" size={20} />
                           <span className="text-sm font-bold text-white">{loc}</span>
                        </div>
                        <input 
                          id={`storage-${loc}`}
                          type="checkbox" 
                          checked={settings.mediaFolders?.includes(loc) || false} 
                          onChange={(e) => {
                            const folders = e.target.checked 
                              ? [...(settings.mediaFolders || []), loc]
                              : (settings.mediaFolders || []).filter(f => f !== loc);
                            handleSelect('mediaFolders', folders);
                          }}
                          className="w-5 h-5 rounded-lg bg-gray-800 border-white/10 text-blue-600 focus:ring-blue-500/50" 
                        />
                      </div>
                    ))}
                  </div>
                </section>
                <div className="flex items-center justify-between group cursor-pointer" onClick={() => toggle('autoRefreshEnabled')} role="button" tabIndex={0}>
                   <div className="flex items-center space-x-4">
                     <RefreshCw className={`w-5 h-5 ${settings.autoRefreshEnabled ? 'text-blue-500' : 'text-gray-500'}`} />
                     <div>
                       <p className="text-sm font-bold text-white uppercase tracking-tight">Auto Refresh/Rescan</p>
                       <p className="text-xs text-gray-400 mt-1">Automatically detect new media on startup</p>
                     </div>
                   </div>
                   <div className={`w-14 h-8 rounded-full p-1 transition-colors ${settings.autoRefreshEnabled ? 'bg-blue-600' : 'bg-gray-800'}`}>
                      <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.autoRefreshEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                   </div>
                </div>
              </div>
            )}

            {/* Video & Playback Tab */}
            {activeTab === 'video' && (
              <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                <section className="space-y-6">
                  <span id="pipModeLabel" className="text-xs font-black text-gray-500 uppercase tracking-widest block">Background PiP Mode</span>
                  <div className="grid grid-cols-3 gap-4" aria-labelledby="pipModeLabel">
                    {[
                      { id: 'background', label: 'Background', icon: <Play size={16} /> },
                      { id: 'foreground', label: 'Foreground', icon: <Monitor size={16} /> },
                      { id: 'disabled', label: 'Disabled', icon: <XCircle size={16} /> }
                    ].map(b => (
                      <button
                        key={b.id}
                        onClick={() => handleSelect('pipBehavior', b.id)}
                        className={`py-4 px-6 rounded-2xl border font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${
                          settings.pipBehavior === b.id ? 'bg-blue-600 border-transparent text-white shadow-xl' : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                        }`}
                      >
                        {b.icon}
                        <span>{b.label}</span>
                      </button>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <span id="hardwareAccelLabel" className="text-xs font-black text-gray-500 uppercase tracking-widest block">Hardware Acceleration</span>
                  <div className="space-y-4" aria-labelledby="hardwareAccelLabel">
                    {[
                      { id: 'disabled', label: 'Disabled', desc: 'Pure Software Decoding', icon: <Cpu size={18} /> },
                      { id: 'enabled', label: 'Enabled', desc: 'Standard Hardware Acceleration', icon: <Monitor size={18} /> },
                      { id: 'acceleration', label: 'Automatic', desc: 'Recommended (Auto-detect)', icon: <CheckCircle size={18} /> },
                      { id: 'full', label: 'Full', desc: 'Maximize Performance', icon: <Wifi size={18} /> }
                    ].map(h => (
                      <div
                        key={h.id}
                        onClick={() => handleSelect('hardwareUse', h.id)} role="button" tabIndex={0}
                        className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl cursor-pointer group hover:bg-white/[0.07] transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          {h.icon}
                          <div>
                            <span className="text-sm font-bold text-white block">{h.label}</span>
                            <span className="text-xs text-gray-500">{h.desc}</span>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${settings.hardwareUse === h.id ? 'border-blue-500 bg-blue-500' : 'border-white/10'}`}>
                          {settings.hardwareUse === h.id && <Check size={14} className="text-white" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="flex items-center justify-between" onClick={() => toggle('savePlaybackHistory')} role="button" tabIndex={0}>
                   <div className="flex items-center space-x-4">
                     <History className={`w-5 h-5 ${settings.savePlaybackHistory ? 'text-blue-500' : 'text-gray-500'}`} />
                     <div>
                       <p className="text-sm font-bold text-white uppercase tracking-tight">Save Playback History</p>
                       <p className="text-xs text-gray-400 mt-1">Keep track of your watched media</p>
                     </div>
                   </div>
                   <div className={`w-14 h-8 rounded-full p-1 transition-colors ${settings.savePlaybackHistory ? 'bg-blue-600' : 'bg-gray-800'}`}>
                      <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.savePlaybackHistory ? 'translate-x-6' : 'translate-x-0'}`} />
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                <section className="space-y-6">
                  <label htmlFor="subtitleOpacity" className="text-xs font-black text-gray-500 uppercase tracking-widest block flex items-center space-x-2">
                    <Volume2 size={16} />
                    <span>Subtitle Opacity</span>
                  </label>
                  <div className="flex items-center space-x-6">
                      <input
                        id="subtitleOpacity"
                        type="range"
                        min="0"
                        max="100"
                        value={settings.subtitleOpacity}
                        onChange={(e) => handleSelect('subtitleOpacity', Number(e.target.value))}
                        className="flex-grow accent-blue-600"
                      />
                      <span className="text-lg font-black text-white w-12">{settings.subtitleOpacity}%</span>
                   </div>
                </section>

                <section className="space-y-6">
                  <label htmlFor="subtitleAppearance" className="text-xs font-black text-gray-500 uppercase tracking-widest block flex items-center space-x-2">
                    <Palette size={16} />
                    <span>Subtitle Appearance</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                      <label htmlFor="subtitleBackgroundColor" className="text-xs font-bold text-gray-400 block mb-3">Background Color</label>
                      <div className="flex space-x-3">
                        {['black', 'white'].map(color => (
                          <button
                            key={color}
                            onClick={() => handleSelect('subtitleBackgroundColor', color)}
                            className={`w-10 h-10 rounded-lg border-2 transition-all ${
                              settings.subtitleBackgroundColor === color 
                                ? 'border-blue-500 scale-110' 
                                : 'border-white/10 hover:border-white/30'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                      <label htmlFor="subtitleOutlineColor" className="text-xs font-bold text-gray-400 block mb-3">Outline Color</label>
                      <div className="flex space-x-3">
                        {['white', 'black', 'yellow', 'red'].map(color => (
                          <button
                            key={color}
                            onClick={() => handleSelect('subtitleOutlineColor', color)}
                            className={`w-10 h-10 rounded-lg border-2 transition-all ${
                              settings.subtitleOutlineColor === color 
                                ? 'border-blue-500 scale-110' 
                                : 'border-white/10 hover:border-white/30'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="flex items-center justify-between" onClick={() => toggle('autoLoadSubtitles')} role="button" tabIndex={0}>
                      <div className="flex items-center space-x-3">
                        <Subtitles className={`w-5 h-5 ${settings.autoLoadSubtitles ? 'text-blue-500' : 'text-gray-500'}`} />
                        <span id="autoLoadSubtitlesLabel" className="text-sm font-bold text-white uppercase tracking-tight">Auto Load Subtitles</span>
                      </div>
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${settings.autoLoadSubtitles ? 'bg-blue-600' : 'bg-gray-800'}`} role="switch" aria-checked={settings.autoLoadSubtitles} aria-labelledby="autoLoadSubtitlesLabel">
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.autoLoadSubtitles ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                   </div>
                   <div className="flex items-center justify-between" onClick={() => toggle('boldSubtitles')} role="button" tabIndex={0}>
                      <div className="flex items-center space-x-3">
                        <Type className={`w-5 h-5 ${settings.boldSubtitles ? 'text-blue-500' : 'text-gray-500'}`} />
                        <span id="boldSubtitlesLabel" className="text-sm font-bold text-white uppercase tracking-tight">Bold Subtitles</span>
                      </div>
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${settings.boldSubtitles ? 'bg-blue-600' : 'bg-gray-800'}`} role="switch" aria-checked={settings.boldSubtitles} aria-labelledby="boldSubtitlesLabel">
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.boldSubtitles ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                   </div>
                   <div className="flex items-center justify-between" onClick={() => toggle('autoColorSubtitles')} role="button" tabIndex={0}>
                      <div className="flex items-center space-x-3">
                        <Palette className={`w-5 h-5 ${settings.autoColorSubtitles ? 'text-blue-500' : 'text-gray-500'}`} />
                        <span id="autoColorSubtitlesLabel" className="text-sm font-bold text-white uppercase tracking-tight">Auto Color Subtitles</span>
                      </div>
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${settings.autoColorSubtitles ? 'bg-blue-600' : 'bg-gray-800'}`} role="switch" aria-checked={settings.autoColorSubtitles} aria-labelledby="autoColorSubtitlesLabel">
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.autoColorSubtitles ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                   </div>
                </div>

                <section className="space-y-6">
                  <label htmlFor="equalizerPreset" className="text-xs font-black text-gray-500 uppercase tracking-widest block flex items-center space-x-2">
                    <Equalizer size={16} />
                    <span>Equalizer Preset</span>
                  </label>
                  <select
                    id="equalizerPreset"
                    value={settings.equalizerPreset}
                    onChange={(e) => handleSelect('equalizerPreset', e.target.value)}
                    className="w-full p-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold focus:border-blue-500 focus:ring-blue-500/20"
                  >
                    <option value="Flat">Flat</option>
                    <option value="Bass Boost">Bass Boost</option>
                    <option value="Treble Boost">Treble Boost</option>
                    <option value="Vocal">Vocal</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Rock">Rock</option>
                    <option value="Pop">Pop</option>
                  </select>
                </section>
              </div>
            )}

            {activeTab === 'interface' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                 <div className="grid grid-cols-1 gap-6">
                   {[
                     { id: 'singleLineTitleEllipsize', label: 'Single Line Title Ellipsis', desc: 'Shorten long titles with (...)', icon: <FileText size={18} /> },
                     { id: 'showHeaders', label: 'Show UI Headers', desc: 'Display navigation and category headers', icon: <Type size={18} /> },
                     { id: 'showMissingMedia', label: 'Show Missing Media', desc: 'Display placeholders for offline files', icon: <Image size={18} /> },
                     { id: 'downloadAlbumThumbnails', label: 'Download Album Thumbnails', desc: 'Auto-download cover art for albums', icon: <Image size={18} /> },
                     { id: 'downloadInfo', label: 'Download Metadata', desc: 'Auto-download track info and details', icon: <FileText size={18} /> },
                     { id: 'downloadSubtitlesLyrics', label: 'Download Subtitles & Lyrics', desc: 'Auto-download lyrics and subtitles', icon: <Subtitles size={18} /> },
                     { id: 'showSeenVideoMarker', label: 'Show Seen Marker', desc: 'Mark videos you have already watched', icon: <Eye size={18} /> },
                     { id: 'showMediumThumbnailsOnClick', label: 'Show Medium Thumbnails', desc: 'Display medium-sized preview images', icon: <Image size={18} /> },
                     { id: 'mediaCoverOnLockScreen', label: 'Media Cover on Lock Screen', desc: 'Show album art on lock screen', icon: <Image size={18} /> },
                     { id: 'seekButtonsOnNotification', label: 'Seek Buttons in Notifications', desc: 'Add forward/backward buttons to lockscreen', icon: <Clock size={18} /> },
                     { id: 'showWatchingOnNewsFeed', label: 'Broadcasting Status', desc: 'Show what I am listening/watching on news feed', icon: <Bell size={18} /> },
                     { id: 'resumePlaybackOnLogin', label: 'Resume Playback on Login', desc: 'Continue where you left off on startup', icon: <Play size={18} /> },
                     { id: 'headsetDetection', label: 'Headset Detection', desc: 'Auto-switch audio output on headset connect', icon: <HeadphonesIcon size={18} /> }
                   ].map(item => (
                      <div key={item.id} className="flex items-center justify-between group cursor-pointer p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/[0.07] transition-all" onClick={() => toggle(item.id as any)} role="button" tabIndex={0}>
                        <div className="flex items-center space-x-4">
                          <div className={`${settings[item.id as keyof ProtocolSettings] ? 'text-blue-500' : 'text-gray-500'}`}>
                            {item.icon}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white uppercase tracking-tight">{item.label}</p>
                            <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                          </div>
                        </div>
                        <div className={`w-14 h-8 rounded-full p-1 transition-colors ${settings[item.id as keyof ProtocolSettings] ? 'bg-blue-600' : 'bg-gray-800'}`}>
                          <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings[item.id as keyof ProtocolSettings] ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                      </div>
                   ))}
                 </div>
              </div>
            )}

            {/* Filtering Tab */}
            {activeTab === 'filtering' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <section>
                  <span id="mediaFiltersLabel" className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-6 flex items-center space-x-2">
                    <Filter size={16} />
                    <span>Media Filters</span>
                  </span>
                  <div className="grid grid-cols-1 gap-6" aria-labelledby="mediaFiltersLabel">
                    <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <Heart className="text-red-500" size={20} />
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">Show Only Favorites</p>
                          <p className="text-xs text-gray-400 mt-1">Display only bookmarked media</p>
                        </div>
                      </div>
                      <div className={`w-14 h-8 rounded-full p-1 transition-colors ${false ? 'bg-blue-600' : 'bg-gray-800'}`}>
                        <div className={`w-6 h-6 bg-white rounded-full transition-transform ${false ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <Video className="text-blue-500" size={20} />
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">Group Videos</p>
                          <p className="text-xs text-gray-400 mt-1">Organize videos by categories</p>
                        </div>
                      </div>
                      <div className={`w-14 h-8 rounded-full p-1 transition-colors ${false ? 'bg-blue-600' : 'bg-gray-800'}`}>
                        <div className={`w-6 h-6 bg-white rounded-full transition-transform ${false ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-2xl">
                      <div className="flex items-center space-x-4">
                        <Music className="text-purple-500" size={20} />
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">Group Audio</p>
                          <p className="text-xs text-gray-400 mt-1">Organize audio by album/artist</p>
                        </div>
                      </div>
                      <div className={`w-14 h-8 rounded-full p-1 transition-colors ${false ? 'bg-blue-600' : 'bg-gray-800'}`}>
                        <div className={`w-6 h-6 bg-white rounded-full transition-transform ${false ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* Sorting Tab */}
            {activeTab === 'sorting' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <section>
                  <span id="sortOrderLabel" className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-6 flex items-center space-x-2">
                    <SortAsc size={16} />
                    <span>Sort Order</span>
                  </span>
                  <div className="grid grid-cols-1 gap-4" aria-labelledby="sortOrderLabel">
                    {[
                      { id: 'name-az', label: 'Track Name: A-Z', icon: <SortAsc size={18} /> },
                      { id: 'name-za', label: 'Track Name: Z-A', icon: <SortAsc size={18} className="rotate-180" /> },
                      { id: 'track-number', label: 'Track Number', icon: <FileText size={18} /> },
                      { id: 'size', label: 'File Size', icon: <HardDrive size={18} /> },
                      { id: 'date-added', label: 'Date Added', icon: <Clock size={18} /> },
                      { id: 'plays', label: 'Play Count', icon: <Play size={18} /> }
                    ].map((sort, idx) => (
                      <button
                        key={sort.id}
                        className={`flex items-center justify-between p-6 bg-white/5 border rounded-2xl transition-all hover:bg-white/[0.07] ${
                          idx === 0 ? 'border-blue-500 bg-blue-500/10' : 'border-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={idx === 0 ? 'text-blue-500' : 'text-gray-500'}>
                            {sort.icon}
                          </div>
                          <span className="text-sm font-bold text-white uppercase tracking-tight">{sort.label}</span>
                        </div>
                        {idx === 0 && <Check size={18} className="text-blue-500" />}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'parental' && (
              <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-[2rem] space-y-4">
                  <div className="flex items-center space-x-3 text-amber-500">
                     <Shield size={24} />
                     <h3 className="text-lg font-black uppercase tracking-tight">AI Guardian Active</h3>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    AI Face Seek scanning is enabled by default to ensure content matches IARC classifications for the active profile.
                  </p>
                </div>

                <div className="flex items-center justify-between" onClick={() => toggle('aiFaceSeekEnabled')} role="button" tabIndex={0}>
                   <div className="flex items-center space-x-4">
                     <Eye className={`w-5 h-5 ${settings.aiFaceSeekEnabled ? 'text-blue-500' : 'text-gray-500'}`} />
                     <div>
                       <p className="text-sm font-bold text-white uppercase tracking-tight">AI Face Seek/Scan</p>
                       <p className="text-xs text-gray-400 mt-1">Deep analysis of video frames for age-restricted content</p>
                     </div>
                   </div>
                   <div className={`w-14 h-8 rounded-full p-1 transition-colors ${settings.aiFaceSeekEnabled ? 'bg-blue-600' : 'bg-gray-800'}`}>
                      <div className={`w-6 h-6 bg-white rounded-full transition-transform ${settings.aiFaceSeekEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                   </div>
                </div>

                <div className="space-y-4">
                  <span id="verificationMethodsLabel" className="text-xs font-black text-gray-500 uppercase tracking-widest block">Verification Methods</span>
                  <div className="grid grid-cols-1 gap-4" aria-labelledby="verificationMethodsLabel">
                    <div className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl" onClick={() => toggle('emailVerificationEnabled')} role="button" tabIndex={0}>
                      <div className="flex items-center space-x-4">
                        <CheckCircle className={settings.emailVerificationEnabled ? 'text-green-500' : 'text-gray-500'} size={20} />
                        <div>
                          <p className="text-sm font-bold text-white">Email Verification</p>
                          <p className="text-xs text-gray-400">Require email confirmation for sensitive actions</p>
                        </div>
                      </div>
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${settings.emailVerificationEnabled ? 'bg-green-600' : 'bg-gray-800'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.emailVerificationEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl" onClick={() => toggle('phoneVerificationEnabled')} role="button" tabIndex={0}>
                      <div className="flex items-center space-x-4">
                        <CheckCircle className={settings.phoneVerificationEnabled ? 'text-green-500' : 'text-gray-500'} size={20} />
                        <div>
                          <p className="text-sm font-bold text-white">Phone Verification</p>
                          <p className="text-xs text-gray-400">Require phone confirmation for sensitive actions</p>
                        </div>
                      </div>
                      <div className={`w-10 h-6 rounded-full p-1 transition-colors ${settings.phoneVerificationEnabled ? 'bg-green-600' : 'bg-gray-800'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.phoneVerificationEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowPinDialog(true)}
                  className="w-full flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl group hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <Lock className="text-blue-500" size={24} />
                    <div className="text-left">
                       <p className="text-md font-bold text-white uppercase tracking-tight">Parental Lock PIN</p>
                       <p className="text-xs text-gray-500">{settings.appLockPin ? 'Change your security PIN' : 'Set your security PIN'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-blue-500 uppercase tracking-widest">{settings.appLockPin ? 'Update' : 'Set'} PIN</span>
                </button>

                {showPinDialog && (
                  <div className="p-8 bg-white/5 border border-white/5 rounded-3xl space-y-6">
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">Set Parental PIN</h4>
                    <label htmlFor="pinInput" className="sr-only">Enter PIN</label>
                    <input
                      id="pinInput"
                      type="password"
                      maxLength={6}
                      value={pinInput}
                      onChange={(e) => setPinInput(e.target.value)}
                      placeholder="Enter PIN (4-6 digits)"
                      className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white font-mono text-lg tracking-widest focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    <label htmlFor="pinConfirm" className="sr-only">Confirm PIN</label>
                    <input
                      id="pinConfirm"
                      type="password"
                      maxLength={6}
                      value={pinConfirm}
                      onChange={(e) => setPinConfirm(e.target.value)}
                      placeholder="Confirm PIN"
                      className="w-full p-4 bg-black/40 border border-white/10 rounded-2xl text-white font-mono text-lg tracking-widest focus:border-blue-500 focus:ring-blue-500/20"
                    />
                    <div className="flex space-x-4">
                      <button
                        onClick={handleSetPIN}
                        className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all"
                      >
                        Save PIN
                      </button>
                      <button
                        onClick={() => { setShowPinDialog(false); setPinInput(''); setPinConfirm(''); }}
                        className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <span id="dataManagementLabel" className="text-xs font-black text-gray-500 uppercase tracking-widest block">Data Management</span>
                  <div aria-labelledby="dataManagementLabel">
                  {[
                    { label: 'Clear Cache', desc: 'Remove temporary files', icon: <Trash2 size={18} />, action: () => { showToast('Cache cleared', 'success'); }, variant: 'default' },
                    { label: 'Wipe Data', desc: 'Delete all app data and settings', icon: <AlertTriangle size={18} />, action: () => { showToast('Data wiped', 'warning'); }, variant: 'danger' },
                    { label: 'Restore Saved Data', desc: 'Import previously exported data', icon: <RotateCcw size={18} />, action: () => { showToast('Data restored', 'success'); }, variant: 'default' },
                    { label: 'Export Data', desc: 'Backup all settings and data', icon: <Database size={18} />, action: () => { showToast('Data exported', 'success'); }, variant: 'success' }
                  ].map(adv => (
                    <button
                      key={adv.label}
                      onClick={adv.action}
                      className={`w-full flex items-center justify-between p-6 rounded-3xl border transition-all ${
                        adv.variant === 'danger' ? 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20' :
                        adv.variant === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500 hover:bg-green-500/20' :
                        'bg-white/5 border-white/5 text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {adv.icon}
                        <div className="text-left">
                          <span className="text-sm font-bold uppercase tracking-widest block">{adv.label}</span>
                          <span className="text-xs text-gray-400">{adv.desc}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="p-8 border-t border-white/5 bg-black/40 text-center">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Intellectual Property of Mbah Israel Obinna</p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DanciaAppSettings;