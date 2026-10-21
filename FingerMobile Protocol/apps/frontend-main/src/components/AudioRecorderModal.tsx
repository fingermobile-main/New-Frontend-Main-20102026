import React, { useState } from 'react';
interface AudioRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRecordingComplete?: (audioBlob: Blob, duration: number) => void;
  maxDuration?: number; // in seconds
}

const AudioRecorderModal: React.FC<AudioRecorderModalProps> = ({
  isOpen,
  onClose,
  onRecordingComplete,
  maxDuration = 300 // 5 minutes default
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setAudioChunks(chunks);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setIsPaused(false);
      setDuration(0);

      // Start timer
      const timer = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err: any) {
      setError('Failed to access microphone. Please grant permission.');
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      setIsPaused(false);
    }
  };

  const handleSave = async () => {
    if (audioChunks.length === 0) return;

    try {
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      if (onRecordingComplete) {
        await onRecordingComplete(blob, duration);
      }
      onClose();
    } catch (err) {
      setError('Failed to save recording');
      console.error('Save error:', err);
    }
  };

  const handleRetake = () => {
    setAudioURL(null);
    setAudioChunks([]);
    setDuration(0);
  };

  const getProgressPercentage = () => {
    return (duration / maxDuration) * 100;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose} role="button" tabIndex={0}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="border-b border-slate-300 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              🎙️ Audio Recorder
            </h2>
            <button
              onClick={onClose}
              className="text-slate-700 hover:text-gray-700 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Recording Status */}
            {!audioURL ? (
              <div className="space-y-6">
                {/* Timer Display */}
                <div className="text-center">
                  <div className={`text-6xl font-mono font-bold ${
                    isRecording && !isPaused ? 'text-red-600 animate-pulse' : 'text-gray-900'
                  }`}>
                    {formatTime(duration)}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {isRecording
                      ? isPaused
                        ? 'Paused'
                        : 'Recording...'
                      : 'Ready to record'
                    }
                  </p>

                  {/* Progress Bar */}
                  {isRecording && (
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2 border text-gray-950 border-gray-400 font-black">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            getProgressPercentage() > 80 ? 'bg-red-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${getProgressPercentage()}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-700 mt-1">
                        {Math.round(getProgressPercentage())}% of {formatTime(maxDuration)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Audio Wave Visualization */}
                {isRecording && !isPaused && (
                  <div className="flex items-center justify-center gap-1 h-16">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 bg-red-500 rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 100}%`,
                          animationDelay: `${i * 0.05}s`
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Control Buttons */}
                <div className="flex items-center justify-center gap-4">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-all transform hover:scale-110 shadow-lg"
                    >
                      <span className="text-white text-4xl">●</span>
                    </button>
                  ) : (
                    <>
                      {isPaused ? (
                        <button
                          onClick={resumeRecording}
                          className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center transition-all"
                        >
                          <span className="text-white text-3xl">▶️</span>
                        </button>
                      ) : (
                        <button
                          onClick={pauseRecording}
                          className="w-16 h-16 rounded-full bg-yellow-600 hover:bg-yellow-700 flex items-center justify-center transition-all"
                        >
                          <span className="text-white text-3xl">⏸️</span>
                        </button>
                      )}

                      <button
                        onClick={stopRecording}
                        className="w-16 h-16 rounded-full bg-gray-700 hover:bg-gray-800 flex items-center justify-center transition-all"
                      >
                        <span className="text-white text-3xl">⏹️</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 text-center">
                    💡 Tip: Speak clearly into your microphone. Maximum duration: {formatTime(maxDuration)}
                  </p>
                </div>
              </div>
            ) : (
              /* Playback & Save */
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Recording Complete</h3>
                  <p className="text-sm text-gray-600">Duration: {formatTime(duration)}</p>
                </div>

                {/* Audio Player */}
                {audioURL && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <audio controls src={audioURL} className="w-full" />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleRetake}
                    className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    🔄 Retake
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    💾 Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioRecorderModal;
