import React from 'react';
import {
  Laptop,
  Headphones,
  Speaker,
  Bluetooth,
  CheckCircle2,
  Volume2,
  X,
  Radio,
  Sparkles
} from 'lucide-react';
import { useBeatwaveNG, AudioDevice } from '../../contexts/BeatwaveNGContext';

interface AudioDeviceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioDeviceSelectorModal: React.FC<AudioDeviceSelectorModalProps> = ({
  isOpen,
  onClose
}) => {
  const { audioDevices, activeAudioDevice, setAudioDevice } = useBeatwaveNG();

  if (!isOpen) return null;

  const getDeviceIcon = (type: AudioDevice['type']) => {
    switch (type) {
      case 'system':
        return <Laptop className="w-5 h-5 text-emerald-400" />;
      case 'headphones':
        return <Headphones className="w-5 h-5 text-sky-400" />;
      case 'dac':
        return <Speaker className="w-5 h-5 text-amber-400" />;
      case 'bluetooth':
        return <Bluetooth className="w-5 h-5 text-indigo-400" />;
      case 'cast':
        return <Radio className="w-5 h-5 text-purple-400" />;
      default:
        return <Speaker className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Audio Output Devices</h3>
              <p className="text-xs text-slate-300 font-medium">Select media playback device (System / External / DAC)</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close audio devices modal"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Current Active Device Highlight */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500 text-black font-black">
              {getDeviceIcon(activeAudioDevice.type)}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                Active Audio Output
              </div>
              <div className="text-sm font-bold text-white">{activeAudioDevice.name}</div>
              <div className="text-[11px] text-slate-300">{activeAudioDevice.bitrateSupport}</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-mono font-bold">
            0 ms Latency
          </span>
        </div>

        {/* Devices List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {audioDevices.map((device) => {
            const isSelected = device.id === activeAudioDevice.id;
            return (
              <div
                key={device.id}
                onClick={() => setAudioDevice(device)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-emerald-400 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-500/20' : 'bg-slate-900'}`}>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{device.name}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-semibold">
                        {device.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium">{device.bitrateSupport}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 size={16} />
                      Connected
                    </span>
                  ) : (
                    <button
                      type="button"
                      aria-label={`Route audio to ${device.name}`}
                      onClick={() => setAudioDevice(device)}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                    >
                      Route Audio
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300 font-medium">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-emerald-400" />
            <span>Lossless Bit-Perfect Audio Pipeline</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default AudioDeviceSelectorModal;
