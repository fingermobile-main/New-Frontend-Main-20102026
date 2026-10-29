import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  VideoCameraIcon,
  MicrophoneIcon,
  XMarkIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ComputerDesktopIcon,
  ChatBubbleLeftEllipsisIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ClipboardDocumentIcon,
  ShareIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon,
  TrashIcon,
  PlayIcon,
  CheckIcon,
  InformationCircleIcon,
  GiftIcon,
  TicketIcon,
  BoltIcon
} from '@heroicons/react/24/outline';
import {
  liveBroadcastService,
  ScheduledBroadcastEvent,
  BroadcastTierKey,
  CANONICAL_TIERS
} from '../../services/liveBroadcastService';

interface WebRtcStudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onStreamStarted?: (streamData: Record<string, unknown>) => void;
  onStreamEnded?: () => void;
  initialTab?: 'broadcast' | 'schedule' | 'events';
  initialStreamId?: string;
  initialGuestMode?: 'OPEN_VIEWER' | 'INTERACTIVE_COHOST' | 'VIP_BACKSTAGE';
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  isTip?: boolean;
}

const WebRtcStudioDrawer: React.FC<WebRtcStudioDrawerProps> = ({
  isOpen,
  onClose,
  onStreamStarted,
  onStreamEnded,
  initialTab = 'broadcast',
  initialStreamId,
  initialGuestMode = 'INTERACTIVE_COHOST'
}) => {
  // Navigation & Sub-views
  const [activeTab, setActiveTab] = useState<'broadcast' | 'schedule' | 'events'>(initialTab);
  const [rightSidebarTab, setRightSidebarTab] = useState<'chat' | 'stage' | 'gifts'>('chat');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Active Studio Capacity Tier (Free 50, Pro 2,000, Master 200,000)
  const [activeTier, setActiveTier] = useState<BroadcastTierKey>(() =>
    liveBroadcastService.getActiveStudioTier()
  );
  const currentTierConfig = CANONICAL_TIERS[activeTier];

  // Broadcast Settings
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tech & Protocol');
  const [resolution, setResolution] = useState('1080p60 (Full HD)');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Stable Studio Session ID & Join Me Live Link Generator
  const [studioSessionId] = useState<string>(
    () => initialStreamId || `live_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`
  );
  const [guestAccessMode, setGuestAccessMode] = useState<'OPEN_VIEWER' | 'INTERACTIVE_COHOST' | 'VIP_BACKSTAGE'>(
    initialGuestMode
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInviteText, setCopiedInviteText] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Hardware Media Stream State
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedVideoDeviceId, setSelectedVideoDeviceId] = useState<string>('');
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializingCamera, setIsInitializingCamera] = useState(false);
  const [isMirror, setIsMirror] = useState(true);

  const [streamId, setStreamId] = useState<string | null>(initialStreamId || null);
  const [streamKey, setStreamKey] = useState<string | null>(null);
  const [ingressUrl, setIngressUrl] = useState<string | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [viewerCount, setViewerCount] = useState(1);

  // Scheduling Form State
  const [schedTitle, setSchedTitle] = useState('');
  const [schedCategory, setSchedCategory] = useState('Tech & Protocol');
  const [schedTier, setSchedTier] = useState<BroadcastTierKey>(activeTier);
  const [schedDateTime, setSchedDateTime] = useState(() => {
    const d = new Date(Date.now() + 3 * 60 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [schedDuration, setSchedDuration] = useState(60);
  const [schedGuestMode, setSchedGuestMode] = useState<'OPEN_VIEWER' | 'INTERACTIVE_COHOST' | 'VIP_BACKSTAGE'>(
    'INTERACTIVE_COHOST'
  );
  const [schedDescription, setSchedDescription] = useState('');
  const [schedCoHosts, setSchedCoHosts] = useState('@israelobinna, @eunicembah');
  const [isScheduling, setIsScheduling] = useState(false);
  const [lastCreatedEvent, setLastCreatedEvent] = useState<ScheduledBroadcastEvent | null>(null);

  // Scheduled Broadcasts List
  const [scheduledEvents, setScheduledEvents] = useState<ScheduledBroadcastEvent[]>([]);

  // Live chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'System', text: 'Welcome to the WebRTC Live Broadcast Studio!' },
    { id: '2', sender: '@emeka_fan', text: 'Stream is looking crisp! 🔥' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const virtualAnimationRef = useRef<number | null>(null);
  const [isVirtualCamera, setIsVirtualCamera] = useState(false);
  const isMicMutedRef = useRef(isMicMuted);
  const isCameraOffRef = useRef(isCameraOff);

  useEffect(() => {
    isMicMutedRef.current = isMicMuted;
  }, [isMicMuted]);

  useEffect(() => {
    isCameraOffRef.current = isCameraOff;
  }, [isCameraOff]);

  // Load scheduled broadcasts from service
  const refreshScheduledEvents = useCallback(() => {
    const list = liveBroadcastService.getScheduledEvents();
    setScheduledEvents(list);
    const currentT = liveBroadcastService.getActiveStudioTier();
    setActiveTier(currentT);
  }, []);

  useEffect(() => {
    if (isOpen) {
      refreshScheduledEvents();
      if (initialTab) {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, initialTab, refreshScheduledEvents]);

  // Set action notice with auto-dismiss
  const showNotice = (type: 'success' | 'error', message: string) => {
    setActionNotice({ type, message });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Callback ref for resilient DOM attachment
  const setVideoRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el;
    if (el) {
      const activeStream = screenStreamRef.current || mediaStreamRef.current;
      if (activeStream && el.srcObject !== activeStream) {
        el.srcObject = activeStream;
        el.muted = true;
        el.play().catch(() => {});
      }
    }
  }, []);

  // Sync active stream to video element on state change
  useEffect(() => {
    if (videoRef.current) {
      const activeStream = screenStream || mediaStream;
      if (activeStream && videoRef.current.srcObject !== activeStream) {
        videoRef.current.srcObject = activeStream;
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [mediaStream, screenStream]);

  // Stop all active tracks and animation timers
  const stopAllTracks = useCallback(() => {
    if (virtualAnimationRef.current) {
      cancelAnimationFrame(virtualAnimationRef.current);
      virtualAnimationRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          /* ignore */
        }
      });
      mediaStreamRef.current = null;
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          /* ignore */
        }
      });
      screenStreamRef.current = null;
    }
    setMediaStream(null);
    setScreenStream(null);
    setIsVirtualCamera(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Studio Virtual HD Test Feed Generator (Canvas WebRTC Stream)
  const createVirtualStudioStream = useCallback((): MediaStream => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');

    let frame = 0;
    const draw = () => {
      if (!ctx) return;
      frame++;

      // Gradient Studio Background
      const grad = ctx.createLinearGradient(0, 0, 1280, 720);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e1b4b');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1280, 720);

      // SMPTE Top Color Bars (70px high)
      const barColors = ['#ffffff', '#ffff00', '#00ffff', '#00ff00', '#ff00ff', '#ff0000', '#0000ff'];
      const barW = 1280 / barColors.length;
      barColors.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.fillRect(i * barW, 0, barW, 70);
      });

      // Animated Center Radar Circle
      const cx = 640;
      const cy = 360;
      const radius = 90 + Math.sin(frame * 0.05) * 15;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#818cf8';
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.restore();

      // Inner glowing core
      ctx.beginPath();
      ctx.arc(cx, cy, 25, 0, Math.PI * 2);
      ctx.fillStyle = '#4f46e5';
      ctx.fill();

      // Header Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 34px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FINGERMOBILE PROTOCOL™ WEBRTC STUDIO', 640, 220);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('VIRTUAL 1080p60 HD BROADCAST FEED ACTIVE', 640, 260);

      // Live Timestamp & Frame Counter
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 26px monospace';
      ctx.fillText(`TIME: ${timeStr} | FRAME: #${frame}`, 640, 520);

      // Audio Spectrum Visualizer simulation bars
      const numBars = 32;
      const spectrumW = 800;
      const startX = (1280 - spectrumW) / 2;
      const barItemW = spectrumW / numBars;
      for (let i = 0; i < numBars; i++) {
        const h = Math.abs(Math.sin((frame + i * 5) * 0.1)) * 60 + 10;
        ctx.fillStyle = i % 2 === 0 ? '#6366f1' : '#ec4899';
        ctx.fillRect(startX + i * barItemW, 680 - h, barItemW - 4, h);
      }

      virtualAnimationRef.current = requestAnimationFrame(draw);
    };

    draw();

    const vStream = canvas.captureStream(30);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        gain.gain.value = 0.0001;
        osc.connect(gain);
        const dest = audioCtx.createMediaStreamDestination();
        gain.connect(dest);
        osc.start();
        const aTrack = dest.stream.getAudioTracks()[0];
        if (aTrack) {
          vStream.addTrack(aTrack);
        }
      }
    } catch {
      /* ignore */
    }

    return vStream;
  }, []);

  // Activate Virtual HD Studio Feed
  const handleActivateVirtualCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    const vStream = createVirtualStudioStream();
    mediaStreamRef.current = vStream;
    setMediaStream(vStream);
    setIsVirtualCamera(true);
    setCameraError(null);
    setIsCameraOff(false);

    if (videoRef.current) {
      videoRef.current.srcObject = vStream;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [createVirtualStudioStream]);

  // Initiate user media camera & mic with graceful tiered fallback
  const initCameraStream = useCallback(
    async (targetVideoId?: string, targetAudioId?: string) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(
          'WebRTC mediaDevices is not supported in this browser environment. You can use the Virtual HD Studio Feed.'
        );
        return;
      }

      setIsInitializingCamera(true);
      setCameraError(null);

      if (virtualAnimationRef.current) {
        cancelAnimationFrame(virtualAnimationRef.current);
        virtualAnimationRef.current = null;
      }
      setIsVirtualCamera(false);

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }

      let stream: MediaStream | null = null;
      let lastError: any = null;

      const hasVideoId = typeof targetVideoId === 'string' && targetVideoId.trim().length > 0;
      const hasAudioId = typeof targetAudioId === 'string' && targetAudioId.trim().length > 0;

      try {
        const videoConstraints: MediaTrackConstraints | boolean = hasVideoId
          ? { deviceId: { exact: targetVideoId } }
          : { width: { ideal: 1280, min: 640 }, height: { ideal: 720, min: 360 } };

        const audioConstraints: MediaTrackConstraints | boolean = hasAudioId
          ? { deviceId: { exact: targetAudioId } }
          : true;

        stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: audioConstraints
        });
      } catch (err1) {
        lastError = err1;
        try {
          const videoConstraints: MediaTrackConstraints | boolean = hasVideoId
            ? { deviceId: { ideal: targetVideoId } }
            : { width: { ideal: 1280 }, height: { ideal: 720 } };

          stream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
            audio: true
          });
        } catch (err2) {
          lastError = err2;
          try {
            const videoConstraints = hasVideoId ? { deviceId: { ideal: targetVideoId } } : true;
            stream = await navigator.mediaDevices.getUserMedia({
              video: videoConstraints,
              audio: false
            });
          } catch (err3) {
            lastError = err3;
            try {
              stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
              });
            } catch (err4) {
              lastError = err4;
            }
          }
        }
      }

      if (stream) {
        mediaStreamRef.current = stream;
        setMediaStream(stream);

        if (videoRef.current && !screenStreamRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }

        stream.getAudioTracks().forEach((t) => {
          t.enabled = !isMicMutedRef.current;
        });
        stream.getVideoTracks().forEach((t) => {
          t.enabled = !isCameraOffRef.current;
        });

        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const vDevs = devices.filter((d) => d.kind === 'videoinput' && d.deviceId);
          const aDevs = devices.filter((d) => d.kind === 'audioinput' && d.deviceId);
          setVideoDevices(vDevs);
          setAudioDevices(aDevs);

          if (!targetVideoId && vDevs.length > 0) {
            setSelectedVideoDeviceId(vDevs[0].deviceId);
          }
          if (!targetAudioId && aDevs.length > 0) {
            setSelectedAudioDeviceId(aDevs[0].deviceId);
          }
        } catch {
          /* ignore */
        }
      } else {
        const errName = lastError?.name || '';
        if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
          setCameraError(
            'Camera or Microphone permission was blocked by the browser. Please allow camera access or click "Use Virtual HD Camera Feed" to test the studio.'
          );
        } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
          setCameraError('No camera device was detected on your system. You can switch to the Virtual HD Camera Feed to broadcast.');
        } else {
          setCameraError(`Camera notice: ${lastError?.message || 'Check camera privacy settings.'} Switch to Virtual HD Camera Feed to continue.`);
        }
      }

      setIsInitializingCamera(false);
    },
    []
  );

  // Screen sharing handler
  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((t) => t.stop());
        screenStreamRef.current = null;
      }
      setScreenStream(null);
      setIsScreenSharing(false);
      if (videoRef.current && mediaStreamRef.current) {
        videoRef.current.srcObject = mediaStreamRef.current;
        videoRef.current.play().catch(() => {});
      }
    } else {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        setCameraError('Screen sharing is not supported by your current browser environment.');
        return;
      }
      try {
        const sStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        screenStreamRef.current = sStream;
        setScreenStream(sStream);
        setIsScreenSharing(true);

        if (videoRef.current) {
          videoRef.current.srcObject = sStream;
          videoRef.current.play().catch(() => {});
        }

        const vTrack = sStream.getVideoTracks()[0];
        if (vTrack) {
          vTrack.onended = () => {
            setIsScreenSharing(false);
            setScreenStream(null);
            screenStreamRef.current = null;
            if (videoRef.current && mediaStreamRef.current) {
              videoRef.current.srcObject = mediaStreamRef.current;
              videoRef.current.play().catch(() => {});
            }
          };
        }
      } catch {
        /* ignore screen sharing cancellation */
      }
    }
  };

  // Toggle Camera
  const handleToggleCamera = () => {
    const nextVal = !isCameraOff;
    setIsCameraOff(nextVal);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = !nextVal;
      });
    }
  };

  // Toggle Microphone
  const handleToggleMic = () => {
    const nextVal = !isMicMuted;
    setIsMicMuted(nextVal);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !nextVal;
      });
    }
  };

  const handleSwitchVideoDevice = (deviceId: string) => {
    setSelectedVideoDeviceId(deviceId);
    initCameraStream(deviceId, selectedAudioDeviceId);
  };

  const handleSwitchAudioDevice = (deviceId: string) => {
    setSelectedAudioDeviceId(deviceId);
    initCameraStream(selectedVideoDeviceId, deviceId);
  };

  useEffect(() => {
    if (isOpen) {
      initCameraStream();
    } else {
      stopAllTracks();
    }

    return () => {
      stopAllTracks();
    };
  }, [isOpen, initCameraStream, stopAllTracks]);

  // Periodic heartbeat while broadcasting
  useEffect(() => {
    if (isBroadcasting && streamId) {
      heartbeatTimerRef.current = setInterval(async () => {
        try {
          const token = localStorage.getItem('fingermobile_token') || localStorage.getItem('token');
          const res = await fetch(`/api/live-stream/${streamId}/heartbeat`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.viewer_count != null) {
              setViewerCount(data.viewer_count);
            }
          }
        } catch {
          /* ignore */
        }
      }, 15000);
    } else if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }

    return () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
      }
    };
  }, [isBroadcasting, streamId]);

  // Current shareable Join Me Live link for the active studio session
  const currentActiveStreamId = streamId || studioSessionId;
  const currentJoinLink = liveBroadcastService.generateJoinLiveLink(currentActiveStreamId, guestAccessMode);

  // Copy link handler
  const handleCopyJoinLink = (linkToCopy?: string) => {
    const target = linkToCopy || currentJoinLink;
    navigator.clipboard.writeText(target).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // Copy formatted invitation text
  const handleCopyInviteMessage = (eventData?: Partial<ScheduledBroadcastEvent>) => {
    const text = liveBroadcastService.generateInviteMessage({
      title: eventData?.title || title || 'Interactive WebRTC Live Broadcast',
      joinLink: eventData?.joinLink || currentJoinLink,
      scheduledStartTime: eventData?.scheduledStartTime,
      category: eventData?.category || category,
      hostName: eventData?.hostName || 'Mr. Mbah Israel Obinna',
      capacityLimit: eventData?.capacityLimit || currentTierConfig.capacityLimit,
      tierKey: eventData?.tierKey || activeTier
    });
    navigator.clipboard.writeText(text).then(() => {
      setCopiedInviteText(true);
      setTimeout(() => setCopiedInviteText(false), 2500);
    });
  };

  // Native Web Share API if supported
  const handleNativeShare = async (shareObj: { title: string; text: string; url: string }) => {
    if (navigator.share) {
      try {
        await navigator.share(shareObj);
      } catch {
        /* ignore */
      }
    } else {
      handleCopyJoinLink(shareObj.url);
    }
  };

  // Upgrade Studio Tier (2,000 or 200,000 Capacity)
  const handlePerformUpgrade = async (targetTier: BroadcastTierKey) => {
    try {
      await liveBroadcastService.upgradeStudioTier(currentActiveStreamId, targetTier, 'FIC');
      setActiveTier(targetTier);
      setSchedTier(targetTier);
      setIsUpgradeModalOpen(false);
      refreshScheduledEvents();
      showNotice(
        'success',
        `🎉 Successfully upgraded to ${CANONICAL_TIERS[targetTier].name} (${CANONICAL_TIERS[targetTier].capacityLimit.toLocaleString()} Capacity)!`
      );
    } catch {
      showNotice('error', 'Upgrade could not be completed. Please check your FIC / Gems balance.');
    }
  };

  // Execute Item Action (Gift, Coupon, Gift Card, Product)
  const handleExecuteLiveItem = async (actionType: 'GIFT' | 'COUPON' | 'GIFT_CARD' | 'PRODUCT_PURCHASE', itemTitle: string, gems = 0) => {
    const result = await liveBroadcastService.executeItemAction(currentActiveStreamId, {
      actionType,
      itemTitle,
      itemValueGems: gems,
      senderId: 'current_user',
      recipientId: 'host_israel'
    });

    if (!result.allowedAction || !result.success) {
      showNotice('error', result.message);
    } else {
      showNotice('success', result.message);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          sender: 'Stage Notification',
          text: `🎁 ${itemTitle} was activated on stage!`,
          isTip: true
        }
      ]);
    }
  };

  // Start Live Broadcast
  const handleStartBroadcast = async () => {
    if (!title.trim()) return;

    try {
      const token = localStorage.getItem('fingermobile_token') || localStorage.getItem('token');
      const res = await fetch('/api/live-stream/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          resolution,
          streamId: currentActiveStreamId,
          tierKey: activeTier
        })
      });

      if (!res.ok) {
        const mockId = currentActiveStreamId;
        setStreamId(mockId);
        setStreamKey(`sk_live_${mockId}`);
        setIngressUrl(`rtmp://live.fingermobileprotocol.com/app/${mockId}`);
        setPlaybackUrl(`https://hls.fingermobileprotocol.com/live/${mockId}/master.m3u8`);
      } else {
        const data = await res.json();
        const sid = data.streamId || data.id || currentActiveStreamId;
        setStreamId(sid);
        setStreamKey(data.streamKey);
        setIngressUrl(data.ingressUrl);
        setPlaybackUrl(data.playbackUrl);
      }

      setIsBroadcasting(true);
      if (onStreamStarted) {
        onStreamStarted({ title, category, streamId: currentActiveStreamId, tierKey: activeTier });
      }
    } catch {
      setIsBroadcasting(true);
      setStreamKey(`sk_live_demo_${Date.now()}`);
    }
  };

  // Stop Live Broadcast
  const handleStopBroadcast = async () => {
    try {
      const token = localStorage.getItem('fingermobile_token') || localStorage.getItem('token');
      if (streamId) {
        await fetch('/api/live-stream/end', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ streamId })
        });
      }
    } catch {
      /* ignore */
    }
    setIsBroadcasting(false);
    setStreamId(null);
    if (onStreamEnded) {
      onStreamEnded();
    }
  };

  // Schedule New Broadcast Handler (Linked to Platform Events & Platform Gems)
  const handleScheduleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedTitle.trim()) return;

    setIsScheduling(true);
    try {
      const parsedCoHosts = schedCoHosts
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const newEvent = await liveBroadcastService.scheduleBroadcast({
        title: schedTitle.trim(),
        description:
          schedDescription.trim() ||
          `FingerMobile Protocol WebRTC live interactive session: ${schedTitle.trim()}`,
        category: schedCategory,
        scheduledStartTime: new Date(schedDateTime).toISOString(),
        durationMinutes: Number(schedDuration) || 60,
        hostName: 'Mr. Mbah Israel Obinna',
        hostHandle: '@israelobinna',
        hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        guestAccessMode: schedGuestMode,
        coHosts: parsedCoHosts,
        tierKey: schedTier
      });

      setLastCreatedEvent(newEvent);
      refreshScheduledEvents();
      showNotice('success', `Live Broadcast "${newEvent.title}" scheduled and linked to Platform Events!`);
    } catch {
      showNotice('error', 'Failed to schedule broadcast. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  };

  // Delete scheduled event
  const handleDeleteScheduled = (id: string) => {
    liveBroadcastService.deleteScheduledEvent(id);
    refreshScheduledEvents();
    if (lastCreatedEvent?.id === id) {
      setLastCreatedEvent(null);
    }
    showNotice('success', 'Scheduled broadcast removed.');
  };

  // Launch a scheduled event into live broadcast
  const handleLaunchScheduledEvent = (event: ScheduledBroadcastEvent) => {
    setTitle(event.title);
    setCategory(event.category);
    setGuestAccessMode(event.guestAccessMode);
    setStreamId(event.id);
    setActiveTier(event.tierKey);
    setActiveTab('broadcast');
    showNotice('success', `Loaded "${event.title}" into Live Studio!`);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'Host (You)',
        text: chatInput.trim()
      }
    ]);
    setChatInput('');
  };

  const handleClose = () => {
    stopAllTracks();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col text-white max-h-[95vh]">
        {/* Toast Action Notice */}
        {actionNotice && (
          <div
            className={`px-4 py-2.5 text-xs font-bold flex items-center justify-between transition-all ${
              actionNotice.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-b border-rose-800'
                : 'bg-emerald-950/90 text-emerald-200 border-b border-emerald-800'
            }`}
          >
            <span>{actionNotice.message}</span>
            <button
              type="button"
              onClick={() => setActionNotice(null)}
              className="text-white hover:opacity-75 text-sm ml-3"
            >
              ✕
            </button>
          </div>
        )}

        {/* Top Header & Navigation Bar */}
        <div className="px-5 py-3.5 border-b border-gray-800 bg-gray-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-600/20 text-red-500 rounded-2xl border border-red-500/30 shadow-inner">
              <VideoCameraIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg tracking-tight">
                  WebRTC Live Broadcast Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {isBroadcasting ? 'ON AIR' : 'READY'}
                </span>
                {/* Active Tier Pill */}
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition flex items-center gap-1 ${
                    activeTier === 'MASTER_200000'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                      : activeTier === 'PRO_2000'
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/30'
                        : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                  }`}
                  title="Click to change or upgrade broadcast capacity tier"
                >
                  <BoltIcon className="w-3 h-3 text-amber-400" />
                  {currentTierConfig.capacityLimit.toLocaleString()} Max ({currentTierConfig.name.split(' ')[0]})
                </button>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Ultra low-latency WebRTC broadcast • Create "Join Me Live" links • Platform Events &amp; Gems
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher Tabs */}
            <div className="flex items-center bg-gray-900 p-1 rounded-2xl border border-gray-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('broadcast')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'broadcast'
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white font-medium'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isBroadcasting ? 'bg-white animate-ping' : 'bg-red-400'}`} />
                Live Studio
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('schedule')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'schedule'
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white font-medium'
                }`}
              >
                <CalendarDaysIcon className="w-4 h-4 text-amber-400" />
                Schedule Live Event
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('events')}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                  activeTab === 'events'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-slate-300 hover:text-white font-medium'
                }`}
              >
                <ClockIcon className="w-4 h-4 text-indigo-400" />
                Events ({scheduledEvents.length})
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsUpgradeModalOpen(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md ml-1"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              Upgrade Tier
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-gray-800 transition-colors ml-1"
              title="Close Studio"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Container with 2-Column Responsive Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* TAB 1: LIVE BROADCAST STUDIO */}
          {activeTab === 'broadcast' && (
            <>
              {/* Left Column: Canvas, Controls & Join Link Engine */}
              <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-800 overflow-y-auto">
                <div>
                  {/* Tier Governance Banner */}
                  <div className="mb-3 px-3.5 py-2 rounded-xl bg-gray-950/90 border border-gray-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-200">Stage Capacity:</span>
                      <span className="px-2 py-0.5 rounded-md bg-gray-800 text-white font-mono font-bold">
                        {currentTierConfig.capacityLimit.toLocaleString()} Max Participants
                      </span>
                      {activeTier === 'FREE' ? (
                        <span className="text-amber-400 text-[11px] hidden sm:inline">
                          ⚠️ Free Tier (20-50 Limit). Gifting &amp; Items Disabled.
                        </span>
                      ) : activeTier === 'PRO_2000' ? (
                        <span className="text-emerald-400 text-[11px] hidden sm:inline">
                          ✅ Pro Tier: Monetized (Limited Gifts &amp; Coupons Allowed)
                        </span>
                      ) : (
                        <span className="text-amber-300 text-[11px] hidden sm:inline">
                          👑 Sovereign Master: Full Monetization, Unlimited Gifts, Cards &amp; Products
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsUpgradeModalOpen(true)}
                      className="text-indigo-400 hover:text-indigo-300 font-bold underline text-[11px]"
                    >
                      {activeTier === 'FREE' ? 'Upgrade to 2k or 200k' : 'Change Tier'}
                    </button>
                  </div>

                  {/* Video Viewport / Preview */}
                  <div className="relative bg-black rounded-2xl aspect-video overflow-hidden border border-gray-800 flex items-center justify-center shadow-2xl">
                    <video
                      ref={setVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover transition-all ${
                        isMirror && !isScreenSharing ? '-scale-x-100' : ''
                      } ${isCameraOff || (cameraError && !isVirtualCamera) ? 'opacity-0' : 'opacity-100'}`}
                    />

                    {/* Camera Off Overlay */}
                    {isCameraOff && !cameraError && (
                      <div className="absolute inset-0 bg-gray-950 flex flex-col items-center justify-center text-center p-6 text-slate-300 font-medium">
                        <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-3">
                          <VideoCameraIcon className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="text-sm font-bold text-gray-300">Camera Feed Paused</p>
                        <p className="text-xs text-slate-300 font-medium mt-1">
                          Your camera is turned off. Click the camera icon below to resume.
                        </p>
                      </div>
                    )}

                    {/* Camera Error / Permission Denied Overlay */}
                    {cameraError && !isVirtualCamera && (
                      <div className="absolute inset-0 bg-gray-950/95 flex flex-col items-center justify-center text-center p-6 text-rose-300">
                        <div className="w-14 h-14 rounded-2xl bg-rose-950/60 border border-rose-800 flex items-center justify-center mb-3 text-rose-400">
                          <ExclamationTriangleIcon className="w-8 h-8" />
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">Camera Initiation Notice</h4>
                        <p className="text-xs text-gray-300 max-w-md mb-4">{cameraError}</p>
                        <div className="flex flex-wrap items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => initCameraStream(selectedVideoDeviceId, selectedAudioDeviceId)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition"
                          >
                            <ArrowPathIcon className="w-4 h-4" />
                            Retry Hardware Camera
                          </button>
                          <button
                            type="button"
                            onClick={handleActivateVirtualCamera}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition"
                          >
                            <VideoCameraIcon className="w-4 h-4" />
                            Use Virtual HD Camera Feed
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Initializing Spinner */}
                    {isInitializingCamera && !cameraError && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-xs">
                        <ArrowPathIcon className="w-8 h-8 animate-spin text-red-500 mb-2" />
                        <span className="text-xs font-semibold">Initiating Device Camera...</span>
                      </div>
                    )}

                    {/* Status Pills */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      {isBroadcasting ? (
                        <span className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                          ON AIR ({viewerCount}/{currentTierConfig.capacityLimit.toLocaleString()} capacity)
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-800/90 backdrop-blur-sm border border-gray-700 text-gray-300 rounded-full text-xs font-mono flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          STUDIO READY
                        </span>
                      )}
                      {isVirtualCamera && (
                        <span className="px-2.5 py-1 bg-purple-600/90 text-white rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-md">
                          🎥 Virtual HD Feed
                        </span>
                      )}
                      {isScreenSharing && (
                        <span className="px-2.5 py-1 bg-indigo-600/90 text-white rounded-full text-[11px] font-semibold flex items-center gap-1">
                          🖥️ Screen Share
                        </span>
                      )}
                    </div>

                    {/* Mirror toggle and quick indicator */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsMirror(!isMirror)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm transition border ${
                          isMirror
                            ? 'bg-gray-800/80 text-white border-gray-600'
                            : 'bg-black/50 text-slate-300 border-gray-800 font-medium'
                        }`}
                        title="Toggle Mirror Camera"
                      >
                        Mirror {isMirror ? 'ON' : 'OFF'}
                      </button>
                    </div>

                    {/* Mic muted overlay badge */}
                    {isMicMuted && (
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-[11px] font-bold flex items-center gap-1.5 backdrop-blur-sm">
                        <MicrophoneIcon className="w-3.5 h-3.5" /> Mic Muted
                      </div>
                    )}
                  </div>

                  {/* "Join Me Live" Link Engine Banner */}
                  <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-r from-red-950/40 via-purple-950/30 to-indigo-950/40 border border-red-500/30 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-red-600/30 text-red-400">
                          <LinkIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white flex items-center gap-2">
                            "Join Me Live" Link Engine
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Capacity: {currentTierConfig.capacityLimit.toLocaleString()}
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-300 font-medium">
                            Share this link so guests and community members can join your live broadcast
                          </p>
                        </div>
                      </div>

                      {/* Guest mode selector */}
                      <div className="flex items-center gap-1 bg-gray-900/90 p-1 rounded-xl border border-gray-700/80 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setGuestAccessMode('INTERACTIVE_COHOST')}
                          className={`px-2 py-1 rounded-lg font-bold transition ${
                            guestAccessMode === 'INTERACTIVE_COHOST'
                              ? 'bg-red-600 text-white shadow'
                              : 'text-slate-300 hover:text-white font-medium'
                          }`}
                          title="Guests can speak and share camera on stage"
                        >
                          🎙️ Co-Host
                        </button>
                        <button
                          type="button"
                          onClick={() => setGuestAccessMode('OPEN_VIEWER')}
                          className={`px-2 py-1 rounded-lg font-bold transition ${
                            guestAccessMode === 'OPEN_VIEWER'
                              ? 'bg-indigo-600 text-white shadow'
                              : 'text-slate-300 hover:text-white font-medium'
                          }`}
                          title="Audience can view HD stream and chat"
                        >
                          👁️ Viewer
                        </button>
                        <button
                          type="button"
                          onClick={() => setGuestAccessMode('VIP_BACKSTAGE')}
                          className={`px-2 py-1 rounded-lg font-bold transition ${
                            guestAccessMode === 'VIP_BACKSTAGE'
                              ? 'bg-amber-600 text-white shadow'
                              : 'text-slate-300 hover:text-white font-medium'
                          }`}
                          title="VIP green room with priority chat & tips"
                        >
                          👑 VIP
                        </button>
                      </div>
                    </div>

                    {/* Link display & quick action buttons */}
                    <div className="mt-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="flex-1 flex items-center bg-gray-950/90 border border-gray-700/80 rounded-xl px-3 py-2 text-xs font-mono text-gray-200 overflow-hidden">
                        <span className="text-red-400 font-bold mr-2 select-none">JOIN LINK:</span>
                        <span className="truncate flex-1 text-gray-300">{currentJoinLink}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyJoinLink(currentJoinLink)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                            copiedLink
                              ? 'bg-emerald-600 text-white'
                              : 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                          }`}
                        >
                          {copiedLink ? (
                            <>
                              <CheckIcon className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <ClipboardDocumentIcon className="w-4 h-4" />
                              Copy Link
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyInviteMessage()}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                            copiedInviteText
                              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                              : 'bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200'
                          }`}
                          title="Copy formatted social invitation card"
                        >
                          {copiedInviteText ? (
                            <>
                              <CheckIcon className="w-4 h-4 text-emerald-400" />
                              Card Copied!
                            </>
                          ) : (
                            <>
                              <ShareIcon className="w-4 h-4" />
                              Invite Card
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleNativeShare({
                              title: title || 'Join Me Live on FingerMobile',
                              text: '🎙️ Join my Live Broadcast on FingerMobile Protocol!',
                              url: currentJoinLink
                            })
                          }
                          className="px-2.5 py-2 rounded-xl text-xs font-bold bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300"
                          title="Share Link"
                        >
                          <ShareIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Hardware Device Selectors */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 mb-1">
                        <VideoCameraIcon className="w-3.5 h-3.5 text-slate-300" /> Camera Source:
                      </label>
                      <select
                        value={isVirtualCamera ? 'virtual' : selectedVideoDeviceId}
                        onChange={(e) => {
                          if (e.target.value === 'virtual') {
                            handleActivateVirtualCamera();
                          } else {
                            handleSwitchVideoDevice(e.target.value);
                          }
                        }}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="virtual">🎨 Virtual 1080p60 Studio Stream</option>
                        {videoDevices.length > 0 ? (
                          videoDevices.map((d, idx) => (
                            <option key={d.deviceId || idx} value={d.deviceId}>
                              {d.label || `Camera ${idx + 1}`}
                            </option>
                          ))
                        ) : (
                          <option value="">Default WebRTC Camera</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1 mb-1">
                        <MicrophoneIcon className="w-3.5 h-3.5 text-slate-300" /> Audio / Mic:
                      </label>
                      <select
                        value={selectedAudioDeviceId}
                        onChange={(e) => handleSwitchAudioDevice(e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                      >
                        {audioDevices.length > 0 ? (
                          audioDevices.map((d, idx) => (
                            <option key={d.deviceId || idx} value={d.deviceId}>
                              {d.label || `Microphone ${idx + 1}`}
                            </option>
                          ))
                        ) : (
                          <option value="">Default WebRTC Audio</option>
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Stream Details Input (When not broadcasting) */}
                  {!isBroadcasting ? (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label htmlFor="studio-broadcast-title-input" className="block text-xs font-semibold text-gray-300 mb-1">
                          Stream Title *
                        </label>
                        <input
                          id="studio-broadcast-title-input"
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. FingerMobile Protocol v2 Deep Dive & Q&A"
                          className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="studio-category-select" className="block text-xs font-semibold text-gray-300 mb-1">
                          Category
                        </label>
                        <select
                          id="studio-category-select"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                        >
                          <option value="Tech & Protocol">Tech &amp; Protocol</option>
                          <option value="Gaming & Esports">Gaming &amp; Esports</option>
                          <option value="Music & Beatwave">Music &amp; Beatwave</option>
                          <option value="Crypto & Web3">Crypto &amp; Web3</option>
                          <option value="Luxury & Curation">Luxury &amp; Curation</option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    /* Ingress Credentials Display */
                    <div className="mt-3 p-3.5 bg-gray-800/60 rounded-xl border border-gray-700 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-green-400 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <CheckCircleIcon className="w-4 h-4" /> Live Broadcast Active
                        </span>
                        <span className="font-mono text-slate-300 font-medium">{streamId}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-1 text-[11px] font-mono text-gray-300">
                        <div className="truncate">
                          <span className="text-slate-300 font-medium">Ingress: </span>
                          {ingressUrl || 'rtmp://live.fingermobileprotocol.com/app/live'}
                        </div>
                        <div className="truncate">
                          <span className="text-slate-300 font-medium">Stream Key: </span>
                          {streamKey || 'sk_live_hidden_for_security'}
                        </div>
                        <div className="truncate">
                          <span className="text-slate-300 font-medium">HLS Playback: </span>
                          {playbackUrl || 'https://hls.fingermobileprotocol.com/live/stream.m3u8'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Hardware Controls & Go Live Button */}
                <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleMic}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        isMicMuted
                          ? 'bg-red-600/20 border-red-500 text-red-400'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white'
                      }`}
                      title={isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
                    >
                      <MicrophoneIcon className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleCamera}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        isCameraOff
                          ? 'bg-red-600/20 border-red-500 text-red-400'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white'
                      }`}
                      title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
                    >
                      <VideoCameraIcon className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleScreenShare}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        isScreenSharing
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-400'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:text-white'
                      }`}
                      title="Toggle Screen Sharing"
                    >
                      <ComputerDesktopIcon className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => initCameraStream(selectedVideoDeviceId, selectedAudioDeviceId)}
                      className="p-2.5 rounded-xl border bg-gray-800 border-gray-700 text-gray-300 hover:text-white transition"
                      title="Refresh Devices"
                    >
                      <ArrowPathIcon className="w-5 h-5" />
                    </button>

                    <select
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      disabled={isBroadcasting}
                      className="hidden sm:block p-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-gray-300"
                    >
                      <option value="1080p60 (Full HD)">1080p60</option>
                      <option value="720p60 (HD)">720p60</option>
                      <option value="4K30 (UHD)">4K30 UHD</option>
                    </select>
                  </div>

                  <div>
                    {!isBroadcasting ? (
                      <button
                        type="button"
                        disabled={!title.trim()}
                        onClick={handleStartBroadcast}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-black text-xs shadow-xl transition-all flex items-center gap-2"
                      >
                        🔴 Start Broadcast
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStopBroadcast}
                        className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold text-xs transition-all"
                      >
                        End Stream
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Audience Chat, Stage Co-Hosts & Platform Gems Gifting */}
              <div className="w-full md:w-80 bg-gray-950 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-3">
                    <div className="flex items-center gap-1 bg-gray-900 p-1 rounded-xl text-[11px] font-semibold w-full">
                      <button
                        type="button"
                        onClick={() => setRightSidebarTab('chat')}
                        className={`flex-1 py-1 rounded-lg transition flex items-center justify-center gap-1 ${
                          rightSidebarTab === 'chat'
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-slate-300 hover:text-white font-medium'
                        }`}
                      >
                        <ChatBubbleLeftEllipsisIcon className="w-3.5 h-3.5" />
                        Chat
                      </button>
                      <button
                        type="button"
                        onClick={() => setRightSidebarTab('stage')}
                        className={`flex-1 py-1 rounded-lg transition flex items-center justify-center gap-1 ${
                          rightSidebarTab === 'stage'
                            ? 'bg-red-600 text-white shadow'
                            : 'text-slate-300 hover:text-white font-medium'
                        }`}
                      >
                        <UserGroupIcon className="w-3.5 h-3.5" />
                        Stage
                      </button>
                      <button
                        type="button"
                        onClick={() => setRightSidebarTab('gifts')}
                        className={`flex-1 py-1 rounded-lg transition flex items-center justify-center gap-1 ${
                          rightSidebarTab === 'gifts'
                            ? 'bg-amber-600 text-white shadow'
                            : 'text-slate-300 hover:text-white font-medium'
                        }`}
                      >
                        <GiftIcon className="w-3.5 h-3.5 text-amber-300" />
                        Gifts/Items
                      </button>
                    </div>
                  </div>

                  {rightSidebarTab === 'chat' && (
                    /* Chat Messages */
                    <div className="space-y-3 overflow-y-auto max-h-[46vh] pr-1">
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className={`text-xs p-2.5 rounded-xl border ${
                            m.isTip
                              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                              : 'bg-gray-900/40 border-gray-800/60 text-gray-300'
                          }`}
                        >
                          <span className="font-bold text-indigo-400">{m.sender}: </span>
                          <span>{m.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {rightSidebarTab === 'stage' && (
                    /* Stage & Guest Access Management */
                    <div className="space-y-3 overflow-y-auto max-h-[46vh] text-xs">
                      <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800">
                        <div className="font-bold text-gray-200 mb-1 flex items-center justify-between">
                          <span>Stage Host</span>
                          <span className="px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 text-[10px]">
                            Host / Producer
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium">Mr. Mbah Israel Obinna (@israelobinna)</p>
                      </div>

                      <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800">
                        <div className="font-bold text-gray-200 mb-1 flex items-center justify-between">
                          <span>Guest Stage Access</span>
                          <span className="text-emerald-400 text-[10px] font-mono">
                            {guestAccessMode}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium mb-2">
                          Guests who open your "Join Me Live" link enter according to this policy.
                        </p>
                        <button
                          type="button"
                          onClick={() => handleCopyJoinLink(currentJoinLink)}
                          className="w-full py-1.5 px-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-[11px] font-bold border border-gray-700 flex items-center justify-center gap-1.5"
                        >
                          <ClipboardDocumentIcon className="w-3.5 h-3.5" />
                          Copy Direct Guest URL
                        </button>
                      </div>

                      <div className="p-3 bg-indigo-950/30 rounded-xl border border-indigo-900/50">
                        <div className="font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                          <SparklesIcon className="w-4 h-4 text-indigo-400" />
                          Stage Capacity Limit
                        </div>
                        <p className="text-[11px] text-slate-300 font-medium">
                          Current Tier: <strong className="text-white">{currentTierConfig.name}</strong> ({currentTierConfig.capacityLimit.toLocaleString()} max).
                        </p>
                      </div>
                    </div>
                  )}

                  {rightSidebarTab === 'gifts' && (
                    /* Platform Gems, Gifts, Coupons & Products Panel */
                    <div className="space-y-3 overflow-y-auto max-h-[46vh] text-xs">
                      {activeTier === 'FREE' ? (
                        /* Free Tier Restrictions Notice */
                        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 space-y-2">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-rose-400">
                            <ExclamationTriangleIcon className="w-4 h-4" />
                            Gifting &amp; Items Locked on Free Tier
                          </div>
                          <p className="text-[11px] text-gray-300 leading-relaxed">
                            Members on Free Tier (limit 20-50 join requests) <strong>cannot send items</strong>, and <strong>cannot receive/send or earn coupons, gift cards, and other items/products</strong>.
                          </p>
                          <button
                            type="button"
                            onClick={() => setIsUpgradeModalOpen(true)}
                            className="w-full py-2 bg-gradient-to-r from-amber-600 to-indigo-600 text-white rounded-lg font-bold text-xs shadow-md mt-2"
                          >
                            Upgrade to Pro (2,000) or Master (200,000)
                          </button>
                        </div>
                      ) : (
                        /* Monetized Tiers: Available Gifts & Actions */
                        <div className="space-y-2.5">
                          <div className="p-2.5 bg-emerald-950/30 rounded-xl border border-emerald-800/60 text-[11px] text-emerald-300">
                            💎 Monetization Enabled: {currentTierConfig.name}
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleExecuteLiveItem('GIFT', 'Afrobeat Rose', 20)}
                              className="p-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-left transition"
                            >
                              <div className="text-lg mb-1">🌹</div>
                              <div className="font-bold text-white text-xs">Afro Rose</div>
                              <div className="text-[10px] text-amber-400">20 Gems</div>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleExecuteLiveItem('GIFT', 'Producer Crown', 500)}
                              className="p-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-left transition"
                            >
                              <div className="text-lg mb-1">👑</div>
                              <div className="font-bold text-white text-xs">Producer Crown</div>
                              <div className="text-[10px] text-amber-400">500 Gems</div>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleExecuteLiveItem('COUPON', 'Beatwave 20% Off Coupon', 0)}
                              className="p-2.5 bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl text-left transition"
                            >
                              <div className="text-lg mb-1">🎟️</div>
                              <div className="font-bold text-white text-xs">Discount Coupon</div>
                              <div className="text-[10px] text-emerald-400">Limited Promo</div>
                            </button>

                            {activeTier === 'MASTER_200000' ? (
                              <button
                                type="button"
                                onClick={() => handleExecuteLiveItem('GIFT_CARD', 'Sovereign Digital Gift Card ($50)', 2500)}
                                className="p-2.5 bg-gray-900 hover:bg-gray-800 border border-amber-500/40 rounded-xl text-left transition"
                              >
                                <div className="text-lg mb-1">💳</div>
                                <div className="font-bold text-amber-300 text-xs">Gift Card</div>
                                <div className="text-[10px] text-amber-400">2,500 Gems</div>
                              </button>
                            ) : (
                              <div className="p-2.5 bg-gray-900/40 border border-dashed border-gray-800 rounded-xl opacity-60 text-left">
                                <div className="text-lg mb-1">💳</div>
                                <div className="font-bold text-slate-300 text-xs">Gift Cards</div>
                                <div className="text-[10px] text-slate-300 font-medium">Master Tier Only</div>
                              </div>
                            )}
                          </div>

                          {activeTier === 'MASTER_200000' && (
                            <button
                              type="button"
                              onClick={() => handleExecuteLiveItem('PRODUCT_PURCHASE', 'Lumina Masterclass VIP Ticket', 5000)}
                              className="w-full py-2 bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 border border-purple-700/60 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                            >
                              <TicketIcon className="w-4 h-4 text-purple-300" />
                              Sell Product / Catalogue Ticket
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Send Chat Form (When chat tab active) */}
                {rightSidebarTab === 'chat' && (
                  <div className="pt-3 border-t border-gray-800">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Send chat message..."
                        className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                      <button aria-label="Send"
                        type="submit"
                        className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                      >
                        <PaperAirplaneIcon className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB 2: SCHEDULE LIVE BROADCAST EVENT (Linked to Platform Events & Platform Gems) */}
          {activeTab === 'schedule' && (
            <div className="flex-1 p-5 sm:p-7 overflow-y-auto flex flex-col md:flex-row gap-6">
              {/* Form Area */}
              <div className="flex-1">
                <div className="mb-5 pb-3 border-b border-gray-800 flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <CalendarDaysIcon className="w-5 h-5 text-amber-400" />
                      Schedule a Live Broadcast (Platform Events)
                    </h3>
                    <p className="text-xs text-slate-300 font-medium">
                      Link your broadcast date and time to Platform Events &amp; Platform Gems with tier capacity governance.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                    Platform Events Sync
                  </span>
                </div>

                <form onSubmit={handleScheduleBroadcast} className="space-y-4 text-xs">
                  {/* Event Title */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">
                      Broadcast Event Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={schedTitle}
                      onChange={(e) => setSchedTitle(e.target.value)}
                      placeholder="e.g. Sovereign WebRTC Protocol Keynote & AMA Session"
                      className="w-full p-3 bg-gray-800/90 border border-gray-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 shadow-inner"
                    />
                  </div>

                  {/* Tier Selection Card Radio Buttons */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center justify-between">
                      <span>Broadcast Studio Capacity &amp; Monetization Tier *</span>
                      <button
                        type="button"
                        onClick={() => setIsUpgradeModalOpen(true)}
                        className="text-amber-400 hover:text-amber-300 text-[11px] underline font-normal"
                      >
                        Compare All Tiers
                      </button>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {/* Free Tier Card */}
                      <button
                        type="button"
                        onClick={() => setSchedTier('FREE')}
                        className={`p-3 rounded-xl border text-left transition ${
                          schedTier === 'FREE'
                            ? 'bg-gray-800 border-red-500 shadow-md ring-1 ring-red-500'
                            : 'bg-gray-900/70 border-gray-800 hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-white text-xs">Free Tier</span>
                          <span className="text-[10px] text-slate-300 font-medium">0 FIC</span>
                        </div>
                        <div className="text-amber-400 font-mono text-[11px] font-bold">20-50 Capacity</div>
                        <p className="text-[10px] text-slate-300 font-medium mt-1">
                          Non-monetized. Cannot send items, cannot receive/earn coupons &amp; gift cards.
                        </p>
                      </button>

                      {/* Pro Tier Card */}
                      <button
                        type="button"
                        onClick={() => setSchedTier('PRO_2000')}
                        className={`p-3 rounded-xl border text-left transition ${
                          schedTier === 'PRO_2000'
                            ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500'
                            : 'bg-gray-900/70 border-gray-800 hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-indigo-300 text-xs">Pro Creator</span>
                          <span className="text-[10px] text-indigo-400 font-mono">250 FIC/mo</span>
                        </div>
                        <div className="text-indigo-400 font-mono text-[11px] font-bold">2,000 Capacity</div>
                        <p className="text-[10px] text-slate-300 font-medium mt-1">
                          Monetized. Members can send &amp; get limited Gifts, coupons &amp; gift cards.
                        </p>
                      </button>

                      {/* Master Tier Card */}
                      <button
                        type="button"
                        onClick={() => setSchedTier('MASTER_200000')}
                        className={`p-3 rounded-xl border text-left transition ${
                          schedTier === 'MASTER_200000'
                            ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500'
                            : 'bg-gray-900/70 border-gray-800 hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-amber-300 text-xs">Sovereign Master</span>
                          <span className="text-[10px] text-amber-400 font-mono">1,200 FIC/mo</span>
                        </div>
                        <div className="text-amber-400 font-mono text-[11px] font-bold">200,000 Capacity</div>
                        <p className="text-[10px] text-slate-300 font-medium mt-1">
                          Monetized. Members can send/get/earn Gifts, coupons, gift cards &amp; products.
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Category & Duration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">
                        Category
                      </label>
                      <select
                        value={schedCategory}
                        onChange={(e) => setSchedCategory(e.target.value)}
                        className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Tech & Protocol">Tech &amp; Protocol</option>
                        <option value="Gaming & Esports">Gaming &amp; Esports</option>
                        <option value="Music & Beatwave">Music &amp; Beatwave</option>
                        <option value="Crypto & Web3">Crypto &amp; Web3</option>
                        <option value="Luxury & Curation">Luxury &amp; Curation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">
                        Estimated Duration
                      </label>
                      <select
                        value={schedDuration}
                        onChange={(e) => setSchedDuration(Number(e.target.value))}
                        className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value={30}>30 Minutes</option>
                        <option value={45}>45 Minutes</option>
                        <option value={60}>60 Minutes (1 Hour)</option>
                        <option value={90}>90 Minutes (1.5 Hours)</option>
                        <option value={120}>120 Minutes (2 Hours)</option>
                      </select>
                    </div>
                  </div>

                  {/* Scheduled Date and Time Picker */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5 flex items-center gap-1.5">
                        <ClockIcon className="w-4 h-4 text-amber-400" />
                        Scheduled Date &amp; Time (Local) *
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={schedDateTime}
                        onChange={(e) => setSchedDateTime(e.target.value)}
                        className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1.5">
                        Guest Stage Access Mode
                      </label>
                      <select
                        value={schedGuestMode}
                        onChange={(e) =>
                          setSchedGuestMode(
                            e.target.value as 'OPEN_VIEWER' | 'INTERACTIVE_COHOST' | 'VIP_BACKSTAGE'
                          )
                        }
                        className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="INTERACTIVE_COHOST">🎙️ Interactive Co-Host (Mic &amp; Cam on Stage)</option>
                        <option value="OPEN_VIEWER">👁️ Open Viewer (HD Stream &amp; Chat)</option>
                        <option value="VIP_BACKSTAGE">👑 VIP Backstage (Priority Stage &amp; Tipping)</option>
                      </select>
                    </div>
                  </div>

                  {/* Co-Hosts / Invited Handles */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">
                      Invited Co-Hosts (User Handles)
                    </label>
                    <input
                      type="text"
                      value={schedCoHosts}
                      onChange={(e) => setSchedCoHosts(e.target.value)}
                      placeholder="@israelobinna, @eunicembah, @superadmin"
                      className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <p className="text-[10px] text-slate-300 font-medium mt-1">Comma-separated usernames to automatically invite</p>
                  </div>

                  {/* Event Agenda / Description */}
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1.5">
                      Event Agenda &amp; Broadcast Details
                    </label>
                    <textarea
                      rows={3}
                      value={schedDescription}
                      onChange={(e) => setSchedDescription(e.target.value)}
                      placeholder="Share what this live broadcast is about, topics to discuss, or special announcements..."
                      className="w-full p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isScheduling || !schedTitle.trim()}
                      className="px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl font-black text-xs shadow-xl transition-all flex items-center gap-2"
                    >
                      {isScheduling ? (
                        <>
                          <ArrowPathIcon className="w-4 h-4 animate-spin" />
                          Scheduling &amp; Linking to Platform Events...
                        </>
                      ) : (
                        <>
                          <CalendarDaysIcon className="w-4 h-4" />
                          Schedule &amp; Generate "Join Me Live" Link
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('events')}
                      className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-bold text-xs transition"
                    >
                      View All Scheduled ({scheduledEvents.length})
                    </button>
                  </div>
                </form>

                {/* Instant Success Banner If Just Created */}
                {lastCreatedEvent && (
                  <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-gray-900 to-indigo-950/60 border border-emerald-500/40 shadow-xl animate-in zoom-in-95">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-emerald-600/30 text-emerald-400 rounded-xl">
                          <CheckCircleIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-sm text-white">Broadcast Event Scheduled &amp; Linked!</h4>
                          <p className="text-xs text-emerald-300">{lastCreatedEvent.title}</p>
                          <p className="text-[11px] text-slate-300 font-medium mt-0.5">
                            🗓️ {new Date(lastCreatedEvent.scheduledStartTime).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                          {lastCreatedEvent.capacityLimit.toLocaleString()} Max Capacity
                        </span>
                        <div className="text-[10px] text-slate-300 font-medium mt-1 font-mono">
                          {lastCreatedEvent.tierKey}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 p-2.5 bg-black/60 rounded-xl border border-gray-800 flex items-center justify-between gap-2 text-xs font-mono text-gray-200">
                      <span className="text-emerald-400 font-bold select-none text-[11px]">JOIN LINK:</span>
                      <span className="truncate flex-1 text-gray-300 text-[11px]">{lastCreatedEvent.joinLink}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyJoinLink(lastCreatedEvent.joinLink)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                      >
                        Copy
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <a
                        href={liveBroadcastService.generateGoogleCalendarUrl(lastCreatedEvent)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold border border-gray-700 flex items-center gap-1.5"
                      >
                        <CalendarIcon className="w-3.5 h-3.5 text-blue-400" />
                        Add to Google Calendar
                      </a>
                      <button
                        type="button"
                        onClick={() => liveBroadcastService.downloadIcsCalendar(lastCreatedEvent)}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold border border-gray-700 flex items-center gap-1.5"
                      >
                        <CalendarDaysIcon className="w-3.5 h-3.5 text-amber-400" />
                        Download .ics Calendar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyInviteMessage(lastCreatedEvent)}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold border border-gray-700 flex items-center gap-1.5"
                      >
                        <ShareIcon className="w-3.5 h-3.5 text-indigo-400" />
                        Copy Social Invite Card
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar: Platform Events & Platform Gems Rules */}
              <div className="w-full md:w-80 bg-gray-950/80 p-5 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
                    <InformationCircleIcon className="w-5 h-5 text-amber-400" />
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-300">
                      Tier Governance &amp; Gems Rules
                    </h4>
                  </div>

                  <div className="space-y-3 text-xs text-slate-300 font-medium leading-relaxed">
                    <div className="p-3 bg-gray-900 rounded-xl border border-gray-800/80">
                      <div className="font-bold text-rose-300 mb-1">
                        🔴 Free Tier (20 - 50 Limit)
                      </div>
                      <p className="text-[11px]">
                        Join requests capped at 50. Members <strong>cannot send items</strong>, cannot receive/send or earn coupons, gift cards, or products.
                      </p>
                    </div>

                    <div className="p-3 bg-gray-900 rounded-xl border border-gray-800/80">
                      <div className="font-bold text-indigo-300 mb-1">
                        ⚡ Pro Tier (2,000 Capacity)
                      </div>
                      <p className="text-[11px]">
                        Get FIC / Monthly Subscription. Monetized. Members can send and receive limited Gifts, coupons, and gift cards.
                      </p>
                    </div>

                    <div className="p-3 bg-gray-900 rounded-xl border border-gray-800/80">
                      <div className="font-bold text-amber-300 mb-1">
                        👑 Sovereign Master (200,000 Capacity)
                      </div>
                      <p className="text-[11px]">
                        Full monetization unlocked. Members can send, get, and earn Gifts, coupons, gift cards, and product catalogue checkout!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-indigo-600 hover:opacity-90 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-2"
                  >
                    <SparklesIcon className="w-4 h-4" />
                    Upgrade Broadcast Capacity
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCHEDULED EVENTS LIST */}
          {activeTab === 'events' && (
            <div className="flex-1 p-5 sm:p-7 overflow-y-auto">
              <div className="mb-5 pb-3 border-b border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-indigo-400" />
                    Scheduled "Join Me Live" Broadcasts
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    Review upcoming live broadcast sessions linked to Platform Events, with attendee capacity &amp; monetization tracking.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('schedule')}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
                >
                  <CalendarDaysIcon className="w-4 h-4" />
                  + Schedule New Broadcast
                </button>
              </div>

              {scheduledEvents.length === 0 ? (
                <div className="p-12 text-center bg-gray-950/60 rounded-3xl border border-dashed border-gray-800 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-600 mb-3">
                    <CalendarDaysIcon className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-300">No Scheduled Broadcasts</h4>
                  <p className="text-xs text-slate-300 font-medium max-w-sm mt-1 mb-4">
                    You haven't scheduled any upcoming live broadcasts yet. Set a date and time to invite co-hosts and audience members.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('schedule')}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    Schedule Broadcast Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scheduledEvents.map((event) => {
                    const eventDate = new Date(event.scheduledStartTime);
                    const isUpcoming = eventDate.getTime() > Date.now();

                    return (
                      <div
                        key={event.id}
                        className="bg-gray-950/90 rounded-2xl border border-gray-800 hover:border-indigo-500/40 p-4 transition-all flex flex-col justify-between shadow-lg"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                {event.category}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                  event.tierKey === 'MASTER_200000'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : event.tierKey === 'PRO_2000'
                                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                      : 'bg-gray-800 text-gray-300'
                                }`}
                              >
                                {event.capacityLimit.toLocaleString()} Max
                              </span>
                            </div>

                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isUpcoming
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-gray-800 text-slate-300 font-medium'
                              }`}
                            >
                              {isUpcoming ? 'Upcoming' : 'Past Date'}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-white mb-1">{event.title}</h4>
                          <p className="text-xs text-slate-300 font-medium line-clamp-2 mb-3">
                            {event.description}
                          </p>

                          <div className="p-3 bg-gray-900/90 rounded-xl border border-gray-800/80 space-y-1.5 text-xs text-gray-300 mb-3">
                            <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                              <CalendarDaysIcon className="w-4 h-4" />
                              {eventDate.toLocaleString([], {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium">
                              <span>Duration: {event.durationMinutes} mins</span>
                              <span>Mode: {event.guestAccessMode}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-300 font-medium">
                                Registered: {event.currentAttendees || 0}/{event.capacityLimit.toLocaleString()}
                              </span>
                              <span
                                className={
                                  event.monetizationEnabled ? 'text-emerald-400 font-bold' : 'text-slate-300 font-medium'
                                }
                              >
                                {event.monetizationEnabled ? 'Monetized • Gifts Active' : 'Free Tier • Non-Monetized'}
                              </span>
                            </div>
                            {event.coHosts && event.coHosts.length > 0 && (
                              <div className="text-[11px] text-indigo-400 truncate">
                                Co-Hosts: {event.coHosts.join(', ')}
                              </div>
                            )}
                          </div>

                          {/* Join Link Bar */}
                          <div className="p-2 bg-black/60 rounded-xl border border-gray-800 flex items-center justify-between gap-2 text-xs font-mono text-gray-200 mb-3">
                            <span className="truncate flex-1 text-slate-300 font-medium text-[11px]">{event.joinLink}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyJoinLink(event.joinLink)}
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-[10px] font-bold shrink-0"
                            >
                              Copy Link
                            </button>
                          </div>
                        </div>

                        {/* Event Card Actions */}
                        <div className="pt-3 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => handleLaunchScheduledEvent(event)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1"
                          >
                            <PlayIcon className="w-3.5 h-3.5" />
                            Launch Studio Now
                          </button>

                          <div className="flex items-center gap-1.5">
                            {event.tierKey === 'FREE' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveTier('FREE');
                                  setIsUpgradeModalOpen(true);
                                }}
                                className="px-2 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold"
                              >
                                Upgrade Capacity
                              </button>
                            )}

                            <a
                              href={liveBroadcastService.generateGoogleCalendarUrl(event)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-blue-400 border border-gray-700 transition"
                              title="Add to Google Calendar"
                            >
                              <CalendarIcon className="w-4 h-4" />
                            </a>

                            <button
                              type="button"
                              onClick={() => liveBroadcastService.downloadIcsCalendar(event)}
                              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-amber-400 border border-gray-700 transition"
                              title="Download .ics Calendar"
                            >
                              <CalendarDaysIcon className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopyInviteMessage(event)}
                              className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-indigo-400 border border-gray-700 transition"
                              title="Copy Social Invitation Card"
                            >
                              <ShareIcon className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteScheduled(event.id)}
                              className="p-1.5 rounded-lg bg-gray-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 border border-gray-700 transition"
                              title="Cancel / Delete Event"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* UPGRADE STUDIO CAPACITY MODAL OVERLAY */}
        {isUpgradeModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in duration-150">
            <div className="bg-gray-900 border border-gray-700 rounded-3xl w-full max-w-4xl p-6 shadow-2xl space-y-5 text-white max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                    <SparklesIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-white">Live Broadcast Studio Capacity &amp; Monetization Tiers</h3>
                    <p className="text-xs text-slate-300 font-medium">
                      Expand join request capacity and unlock platform gifting, coupons, gift cards, and product sales.
                    </p>
                  </div>
                </div>
                <button aria-label="Close"
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(false)}
                  className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-gray-800"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* 3 Tier Comparative Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Free Tier */}
                <div
                  className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    activeTier === 'FREE'
                      ? 'bg-gray-800/80 border-gray-600 ring-2 ring-gray-600'
                      : 'bg-gray-950/80 border-gray-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-sm text-gray-200">Free Tier</span>
                      <span className="px-2 py-0.5 rounded-full bg-gray-800 text-[10px] text-slate-300 font-bold">
                        Default
                      </span>
                    </div>
                    <div className="text-2xl font-black text-white font-mono">0 FIC</div>
                    <div className="text-xs text-slate-300 font-medium mt-0.5">Free Standard Access</div>

                    <div className="mt-4 pt-3 border-t border-gray-800 space-y-2 text-xs text-gray-300">
                      <div className="flex items-center gap-1.5 font-bold text-amber-400">
                        <span>👥 Limit: 20-50 Join Requests</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-rose-300">
                        <span>✕</span>
                        <span>Cannot send items</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-rose-300">
                        <span>✕</span>
                        <span>Cannot receive/send or earn coupons</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-rose-300">
                        <span>✕</span>
                        <span>Gift cards &amp; products disabled</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-slate-300 font-medium">
                        <span>✓</span>
                        <span>Standard WebRTC HD Stream</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-800">
                    {activeTier === 'FREE' ? (
                      <span className="block text-center py-2 bg-gray-800 text-slate-200 rounded-xl font-bold text-xs">
                        Current Active Tier
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePerformUpgrade('FREE')}
                        className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold text-xs transition"
                      >
                        Select Free Tier
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Pro Creator Tier (2,000 Capacity) */}
                <div
                  className={`p-5 rounded-2xl border flex flex-col justify-between relative ${
                    activeTier === 'PRO_2000'
                      ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500'
                      : 'bg-gray-950/80 border-indigo-900/60'
                  }`}
                >
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-indigo-600 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                    Popular
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-sm text-indigo-300">Pro Creator</span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-[10px] text-indigo-300 font-bold">
                        Monetized
                      </span>
                    </div>
                    <div className="text-2xl font-black text-white font-mono">250 FIC <span className="text-xs text-slate-300 font-normal">/mo</span></div>
                    <div className="text-xs text-indigo-300 mt-0.5">or 500 Platform Gems</div>

                    <div className="mt-4 pt-3 border-t border-indigo-900/40 space-y-2 text-xs text-gray-300">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                        <span>👥 2,000 Capacity Limit</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-emerald-300">
                        <span>✓</span>
                        <span>Monetization Enabled</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-emerald-300">
                        <span>✓</span>
                        <span>Send &amp; receive limited Gifts</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-emerald-300">
                        <span>✓</span>
                        <span>Send &amp; get Coupons &amp; Gift Cards</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-indigo-300">
                        <span>✓</span>
                        <span>Interactive Multi-Co-Host Stage</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-indigo-900/40">
                    {activeTier === 'PRO_2000' ? (
                      <span className="block text-center py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs">
                        Current Active Tier
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePerformUpgrade('PRO_2000')}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition shadow-lg"
                      >
                        Upgrade to 2,000 Capacity (250 FIC)
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. Sovereign Master Tier (200,000 Capacity) */}
                <div
                  className={`p-5 rounded-2xl border flex flex-col justify-between relative ${
                    activeTier === 'MASTER_200000'
                      ? 'bg-amber-950/60 border-amber-500 ring-2 ring-amber-500'
                      : 'bg-gray-950/80 border-amber-900/60'
                  }`}
                >
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-[10px] font-black uppercase tracking-wider text-black shadow-md">
                    Ultimate
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-sm text-amber-300">Sovereign Master</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-[10px] text-amber-300 font-bold">
                        Full Access
                      </span>
                    </div>
                    <div className="text-2xl font-black text-white font-mono">1,200 FIC <span className="text-xs text-slate-300 font-normal">/mo</span></div>
                    <div className="text-xs text-amber-300 mt-0.5">or 2,500 Platform Gems</div>

                    <div className="mt-4 pt-3 border-t border-amber-900/40 space-y-2 text-xs text-gray-300">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <span>👥 200,000 Capacity Limit</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-emerald-300">
                        <span>✓</span>
                        <span>Full Live Monetization Unlocked</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-emerald-300">
                        <span>✓</span>
                        <span>Send, get &amp; earn unlimited Gifts</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-emerald-300">
                        <span>✓</span>
                        <span>Coupons, Gift Cards &amp; Rewards</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-amber-300">
                        <span>✓</span>
                        <span>Digital Merchandise &amp; Catalogue Checkout</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-amber-900/40">
                    {activeTier === 'MASTER_200000' ? (
                      <span className="block text-center py-2 bg-amber-600 text-white rounded-xl font-bold text-xs">
                        Current Active Tier
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handlePerformUpgrade('MASTER_200000')}
                        className="w-full py-2 bg-gradient-to-r from-amber-600 to-yellow-500 hover:opacity-90 text-slate-900 font-black rounded-xl text-xs transition shadow-xl"
                      >
                        Upgrade to 200,000 Capacity (1,200 FIC)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebRtcStudioDrawer;
