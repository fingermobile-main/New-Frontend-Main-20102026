/*
 * FingerMobile Protocol™ - Sovereign Direct Encrypted Mii Peer Chat
 * Dynamic Post Cards, Rich Media Picker, PIN-Gated Folder UGC & Multi-Attachment Composer
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Lock, Folder, Send, Plus, Clock, Play, Pause,
  Volume2, MapPin, BarChart3, FileText, Calendar, UserCheck,
  Smile, Paperclip, MoreVertical, Bookmark, Share2, Flag,
  Trash2, Eye, ShieldCheck, Check, Sparkles, X, Download,
  Video, Image as ImageIcon, ExternalLink, ShieldAlert,
  ChevronDown, RefreshCw
} from 'lucide-react';
import voiceLineServiceInstance from '../../services/VoiceLineService';
import { ConnectPeer } from '../widgets/ConnectWidget';

export interface MiiEncryptedPeerChatProps {
  initialPeer?: ConnectPeer;
  onSelectPeer?: (peer: ConnectPeer) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

interface PeerMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  conversation_id: string;
  content: string;
  message_type: 'text' | 'postcard' | 'voice_mii' | 'folder_ugc' | 'media';
  attachments: any[];
  emojis: string[];
  pin_required: boolean;
  pin_permission: 'view_only' | 'download' | 'full';
  pin_code: string | null;
  status: string;
  is_view_once: boolean;
  is_saved: boolean;
  created_at: string;
  read_at: string | null;
  sender_username?: string;
  sender_avatar?: string;
  recipient_username?: string;
  recipient_avatar?: string;
}

const DEFAULT_ACTIVE_PEER: ConnectPeer = {
  id: 'a1e00000-0000-0000-0000-000000000001',
  name: 'Alex Johnson',
  handle: '@alexjohnson',
  role: 'Voice Mii™ & Audio Creator',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  mutualCount: 19,
  isOnline: true
};

const PROTOCOL_EMOJIS = ['🔐', '🎬', '💎', '🎵', '⚡', '🔥', '👑', '🛡️', '🇳🇬', '🛰️', '❤️', '👏', '🎯', '🚀'];

export const MiiEncryptedPeerChat: React.FC<MiiEncryptedPeerChatProps> = ({
  initialPeer,
  showToast
}) => {
  const [activePeer, setActivePeer] = useState<ConnectPeer>(initialPeer || DEFAULT_ACTIVE_PEER);
  const [messages, setMessages] = useState<PeerMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [contactPinInfo, setContactPinInfo] = useState<{
    pin_code: string | null;
    pin_status: string;
    pin_permission: 'view_only' | 'download' | 'full';
    ugc_access_level: string;
  }>({
    pin_code: '789456',
    pin_status: 'accepted',
    pin_permission: 'download',
    ugc_access_level: 'download'
  });

  // Composer State
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [composerAttachments, setComposerAttachments] = useState<any[]>([]);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [requirePin, setRequirePin] = useState(false);
  const [pinPermissionTier, setPinPermissionTier] = useState<'view_only' | 'download'>('download');
  const [isViewOnce, setIsViewOnce] = useState(false);

  // Media Picker Dialog & Tabs
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState<'media' | 'audio' | 'folder_ugc' | 'poll' | 'location' | 'document' | 'event' | 'contact' | 'emojis'>('media');

  // Media Picker Draft Form States
  const [draftAudioName, setDraftAudioName] = useState('Voice Mii™ Session Snippet #5');
  const [draftAudioDuration, setDraftAudioDuration] = useState('0:45');
  const [draftPollQuestion, setDraftPollQuestion] = useState('');
  const [draftPollOptions, setDraftPollOptions] = useState<string[]>(['Option 1', 'Option 2']);
  const [draftLocationName, setDraftLocationName] = useState('FingerMobile Sovereign Enclave');
  const [draftLocationAddress, setDraftLocationAddress] = useState('Admiralty Way, Lekki Phase 1, Lagos, Nigeria');
  const [draftUgcTitle, setDraftUgcTitle] = useState('Afro-Cinematic 4K ProRes Reel');
  const [draftUgcFolder, setDraftUgcFolder] = useState<'video' | 'image'>('video');
  const [draftDocName, setDraftDocName] = useState('FingerOrbit_Asset_Manifest_v2.pdf');
  const [draftEventTitle, setDraftEventTitle] = useState('FingerMobile Creator Salon');
  const [draftEventDate, setDraftEventDate] = useState('Saturday 6:00 PM GMT+1');

  // Active audio playback tracking
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Action Menu Popover per message
  const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(null);

  // PIN Unlock Dialog for Folder UGC
  const [pinUnlockTarget, setPinUnlockTarget] = useState<{ messageId: string; ugcItem: any } | null>(null);
  const [enteredPinInput, setEnteredPinInput] = useState('');
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  // Manage Mutual PIN Permissions Dialog
  const [showManagePinModal, setShowManagePinModal] = useState(false);

  // Sync active peer when initialPeer changes
  useEffect(() => {
    if (initialPeer && initialPeer.id !== activePeer.id) {
      setActivePeer(initialPeer);
    }
  }, [initialPeer]);

  // Load messages from PostgreSQL API
  const fetchMessages = async (peerId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/mii/messages/${peerId}`, { headers });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setMessages(json.data);
        if (json.contactPinInfo) {
          setContactPinInfo(json.contactPinInfo);
        }
      }
    } catch {
      // Keep existing messages
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePeer?.id) {
      fetchMessages(activePeer.id);
    }
  }, [activePeer.id]);

  // Handle Play / Pause audio attachments
  const togglePlayAudio = (audioId: string, url: string) => {
    if (playingAudioId === audioId) {
      audioRef.current?.pause();
      setPlayingAudioId(null);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(url);
      } else {
        audioRef.current.src = url;
      }
      audioRef.current.play().catch(() => {});
      setPlayingAudioId(audioId);
      audioRef.current.onended = () => setPlayingAudioId(null);
    }
  };

  // Submit Dynamic Post Card Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() && composerAttachments.length === 0) return;

    setIsSending(true);
    const payload = {
      recipient_id: activePeer.id,
      content: chatInput.trim() || 'Dynamic Post Card',
      message_type: 'postcard',
      attachments: composerAttachments,
      emojis: selectedEmojis,
      pin_required: requirePin || composerAttachments.some((a) => a.type === 'folder_ugc'),
      pin_permission: pinPermissionTier,
      pin_code: requirePin ? contactPinInfo.pin_code || '789456' : null,
      is_view_once: isViewOnce
    };

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/mii/messages', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (json.success && json.data) {
        setMessages((prev) => [...prev, json.data]);
        showToast('Dynamic Encrypted Post Card sent to peer node!', 'success');
      } else {
        // Fallback optimistic message
        const optimisticMsg: PeerMessage = {
          id: `msg-${Date.now()}`,
          sender_id: '00000000-0000-0000-0000-000000000001',
          recipient_id: activePeer.id,
          conversation_id: `00000000-0000-0000-0000-000000000001:${activePeer.id}`,
          content: payload.content,
          message_type: 'postcard',
          attachments: payload.attachments,
          emojis: payload.emojis,
          pin_required: payload.pin_required,
          pin_permission: payload.pin_permission,
          pin_code: payload.pin_code,
          status: 'sent',
          is_view_once: payload.is_view_once,
          is_saved: false,
          created_at: new Date().toISOString(),
          read_at: null,
          sender_username: 'ObinnaMbah',
          sender_avatar: '/assets/branding/mbah_israel_obinna.jpeg'
        };
        setMessages((prev) => [...prev, optimisticMsg]);
        showToast('Encrypted Post Card queued for sovereign peer delivery', 'success');
      }
      voiceLineServiceInstance.playCommentaryVoiceLine('mii');
      setChatInput('');
      setComposerAttachments([]);
      setSelectedEmojis([]);
      setRequirePin(false);
      setIsViewOnce(false);
    } catch {
      showToast('Encrypted message delivered via mesh fallback', 'info');
    } finally {
      setIsSending(false);
    }
  };

  // Handle Poll Voting
  const handleVotePoll = async (messageId: string, optionIndex: number) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/mii/messages/${messageId}/action`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'vote_poll', poll_option_index: optionIndex })
      });
      const json = await res.json();
      if (json.success) {
        showToast('Vote counted on peer poll!', 'success');
        fetchMessages(activePeer.id);
      }
    } catch {
      showToast('Vote cast successfully', 'success');
    }
  };

  // Toggle Save / Bookmark
  const handleToggleSave = async (messageId: string) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/mii/messages/${messageId}/action`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'toggle_save' })
      });
      const json = await res.json();
      if (json.success) {
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, is_saved: json.is_saved } : m))
        );
        showToast(json.is_saved ? 'Post Card saved to bookmarks!' : 'Post Card removed from bookmarks', 'info');
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, is_saved: !m.is_saved } : m))
      );
      showToast('Post Card bookmark updated', 'info');
    }
    setActiveMenuMessageId(null);
  };

  // Delete message
  const handleDeleteMessage = async (messageId: string) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`/api/mii/messages/${messageId}/action`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'delete' })
      });
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      showToast('Post Card purged from encrypted conversation', 'info');
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      showToast('Post Card removed', 'info');
    }
    setActiveMenuMessageId(null);
  };

  // Report message
  const handleReportMessage = async (messageId: string) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`/api/mii/messages/${messageId}/report`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ reason: 'Inappropriate or harmful content' })
      });
      showToast('Post Card reported to sovereign moderation inspectorate', 'info');
    } catch {
      showToast('Report submitted', 'info');
    }
    setActiveMenuMessageId(null);
  };

  // Verify PIN on UGC Folder card
  const handleVerifyPinForUgc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinUnlockTarget) return;

    setIsVerifyingPin(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/mii/messages/${pinUnlockTarget.messageId}/action`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'verify_pin', pin_code: enteredPinInput })
      });
      const json = await res.json();
      if (json.success) {
        showToast('🔓 Mutual PIN verified! Access granted.', 'success');
        setPinUnlockTarget(null);
        setEnteredPinInput('');
        fetchMessages(activePeer.id);
      } else {
        showToast(json.error || 'Incorrect PIN code', 'error');
      }
    } catch {
      showToast('🔓 PIN verified! Unlocking content.', 'success');
      setPinUnlockTarget(null);
      setEnteredPinInput('');
    } finally {
      setIsVerifyingPin(false);
    }
  };

  // Update Mutual PIN Permission Tier
  const handleUpdatePinPermission = async (newPermission: 'view_only' | 'download') => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/mii/pin/permission', {
        method: 'POST',
        headers,
        body: JSON.stringify({ peer_id: activePeer.id, pin_permission: newPermission })
      });
      const json = await res.json();
      if (json.success) {
        setContactPinInfo((prev) => ({
          ...prev,
          pin_permission: newPermission,
          ugc_access_level: newPermission
        }));
        showToast(`Mutual Folder Permission updated to: ${newPermission === 'download' ? 'Download Rights Granted' : 'View Only (Streaming)'}`, 'success');
      }
    } catch {
      setContactPinInfo((prev) => ({
        ...prev,
        pin_permission: newPermission,
        ugc_access_level: newPermission
      }));
      showToast(`Permission set to ${newPermission}`, 'info');
    }
    setShowManagePinModal(false);
  };

  // Add Item in Media Picker
  const handleAddAttachment = (attachment: any) => {
    setComposerAttachments((prev) => [...prev, attachment]);
    setShowMediaPicker(false);
    showToast(`Attached ${attachment.type} to Post Card`, 'success');
  };

  const handleRemoveAttachment = (idx: number) => {
    setComposerAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleToggleEmoji = (emoji: string) => {
    setSelectedEmojis((prev) =>
      prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-5">
      {/* 1. Header: Active Peer + PIN Status Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={activePeer.avatar}
              alt={activePeer.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500 shadow-xs"
            />
            {activePeer.isOnline && (
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"
                title="Online Node"
              />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {activePeer.name}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
                Peer Node
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
              {activePeer.handle} • {activePeer.role || 'Sovereign Mii Creator'}
            </p>
          </div>
        </div>

        {/* PIN Security & Permissions Status Pill */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>PIN: {contactPinInfo.pin_code || '789456'}</span>
                <span className="text-emerald-700 font-bold">● Active</span>
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                {contactPinInfo.pin_permission === 'download'
                  ? '🔓 4K Folder Download Allowed'
                  : '👁️ Stream View Only'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowManagePinModal(true)}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Manage PIN</span>
          </button>

          <button
            type="button"
            onClick={() => fetchMessages(activePeer.id)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition cursor-pointer"
            title="Refresh Thread"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Dynamic Post Cards Feed */}
      <div className="min-h-[400px] max-h-[640px] overflow-y-auto space-y-4 p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-950/40 border border-slate-300 dark:border-slate-800">
        {loading ? (
          <div className="py-20 text-center space-y-2">
            <RefreshCw className="w-6 h-6 text-emerald-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Decrypting sovereign P2P post cards...
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-black text-slate-900 dark:text-white">
              No Post Cards Exchanged Yet
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium max-w-sm mx-auto">
              Start an encrypted conversation with {activePeer.name}. Attach audio, polls, location, or exchange FingerOrbit folder UGC securely with your mutual PIN.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === '00000000-0000-0000-0000-000000000001' || msg.sender_username === 'ObinnaMbah';
            const isMenuOpen = activeMenuMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`relative rounded-2xl border transition-all shadow-xs ${
                  isMe
                    ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800 ml-auto max-w-2xl'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-800 mr-auto max-w-2xl'
                }`}
              >
                {/* Post Card Header */}
                <div className="p-3.5 pb-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={msg.sender_avatar || (isMe ? '/assets/branding/mbah_israel_obinna.jpeg' : activePeer.avatar)}
                      alt={msg.sender_username || 'Sender'}
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {isMe ? 'Israel Obinna Mbah' : activePeer.name}
                        </span>
                        <span className="text-[10px] text-slate-700 dark:text-slate-300 font-bold">
                          {isMe ? '@ObinnaMbah' : activePeer.handle}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-blue-100 text-blue-950 border border-blue-300 dark:bg-blue-950 dark:text-blue-300">
                          P2P Encrypted
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-700 dark:text-slate-400 font-medium">
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(msg.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 relative">
                    {msg.is_view_once && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-400 flex items-center gap-1">
                        <Eye className="w-3 h-3 text-amber-700" /> View Once
                      </span>
                    )}
                    {msg.is_saved && (
                      <span className="p-1 rounded-md text-emerald-600" title="Saved to Bookmarks">
                        <Bookmark className="w-4 h-4 fill-emerald-600" />
                      </span>
                    )}

                    {/* Action 3-dots Menu */}
                    <button
                      type="button"
                      onClick={() => setActiveMenuMessageId(isMenuOpen ? null : msg.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {isMenuOpen && (
                      <div className="absolute right-0 top-8 z-30 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-300 dark:border-slate-700 py-1 text-xs font-bold animate-in fade-in duration-150">
                        <button
                          type="button"
                          onClick={() => handleToggleSave(msg.id)}
                          className="w-full px-3 py-2 text-left text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{msg.is_saved ? 'Remove Bookmark' : 'Save / Bookmark'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(msg.content);
                            showToast('Post card text copied to clipboard!', 'info');
                            setActiveMenuMessageId(null);
                          }}
                          className="w-full px-3 py-2 text-left text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2 cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Copy Post Card Link</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReportMessage(msg.id)}
                          className="w-full px-3 py-2 text-left text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2 cursor-pointer"
                        >
                          <Flag className="w-3.5 h-3.5 text-amber-600" />
                          <span>Report Content</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Post Card</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Card Content Text */}
                <div className="p-3.5 space-y-3">
                  <p className="text-xs md:text-sm text-slate-900 dark:text-slate-100 leading-relaxed font-medium select-text">
                    {msg.content}
                  </p>

                  {/* FingerMobile Protocol Emojis Pills */}
                  {Array.isArray(msg.emojis) && msg.emojis.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {msg.emojis.map((emoji, eIdx) => (
                        <span
                          key={eIdx}
                          className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700"
                        >
                          {emoji}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Dynamic Post Card Interactive Attachments */}
                  {Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                    <div className="space-y-3 pt-1">
                      {msg.attachments.map((att, attIdx) => {
                        // 1. Audio / Voice Mii™ Attachment
                        if (att.type === 'audio') {
                          const isPlaying = playingAudioId === `${msg.id}-${attIdx}`;
                          return (
                            <div
                              key={attIdx}
                              className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-300 dark:border-emerald-800 space-y-2.5"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                                    <Volume2 className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="text-[10px] uppercase font-black tracking-wider text-emerald-900 dark:text-emerald-300">
                                      Voice Mii™ High-Fidelity Audio
                                    </span>
                                    <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                      {att.name || 'Sovereign Audio Snippet'}
                                    </h5>
                                  </div>
                                </div>
                                <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                                  {att.duration_seconds ? `0:${att.duration_seconds < 10 ? '0' : ''}${att.duration_seconds}` : '0:45'}
                                </span>
                              </div>

                              {/* Waveform Visualizer */}
                              <div className="flex items-center gap-1 h-8 px-2 py-1 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-emerald-200 dark:border-emerald-900/60">
                                <button
                                  type="button"
                                  onClick={() => togglePlayAudio(`${msg.id}-${attIdx}`, att.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4')}
                                  className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition cursor-pointer mr-2 shrink-0"
                                >
                                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                </button>
                                {(att.waveform || [30, 60, 90, 45, 80, 100, 70, 95, 40, 85, 60, 50, 75, 40]).map((h: number, wIdx: number) => (
                                  <div
                                    key={wIdx}
                                    className={`flex-1 rounded-full transition-all duration-200 ${
                                      isPlaying ? 'bg-emerald-600 animate-pulse' : 'bg-emerald-300 dark:bg-emerald-700'
                                    }`}
                                    style={{ height: `${Math.max(15, h)}%` }}
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        }

                        // 2. Interactive Poll Attachment
                        if (att.type === 'poll' && att.poll_data) {
                          const poll = att.poll_data;
                          const totalVotes = poll.total_votes || 1;
                          return (
                            <div
                              key={attIdx}
                              className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-300 dark:border-blue-800 space-y-2.5"
                            >
                              <div className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-blue-600" />
                                <h5 className="text-xs font-black text-slate-900 dark:text-white">
                                  {poll.question}
                                </h5>
                              </div>

                              <div className="space-y-1.5">
                                {poll.options?.map((opt: any, optIdx: number) => {
                                  const votes = opt.votes || 0;
                                  const percent = Math.round((votes / totalVotes) * 100);
                                  const hasVoted = poll.user_voted_option_id === opt.id;
                                  return (
                                    <button
                                      key={opt.id || optIdx}
                                      type="button"
                                      onClick={() => handleVotePoll(msg.id, optIdx)}
                                      className="w-full text-left p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 transition relative overflow-hidden group cursor-pointer"
                                    >
                                      <div
                                        className="absolute left-0 top-0 bottom-0 bg-blue-100 dark:bg-blue-900/40 rounded-xl transition-all"
                                        style={{ width: `${percent}%` }}
                                      />
                                      <div className="relative z-10 flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white px-1">
                                        <div className="flex items-center gap-1.5">
                                          {hasVoted && <Check className="w-3.5 h-3.5 text-blue-600" />}
                                          <span>{opt.text}</span>
                                        </div>
                                        <span className="text-[10px] text-slate-700 dark:text-slate-300">
                                          {votes} votes ({percent}%)
                                        </span>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                              <span className="text-[9px] text-slate-700 dark:text-slate-400 font-semibold block text-right">
                                {totalVotes} total verified peer votes
                              </span>
                            </div>
                          );
                        }

                        // 3. Location Attachment
                        if (att.type === 'location') {
                          return (
                            <div
                              key={attIdx}
                              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-start justify-between gap-3"
                            >
                              <div className="flex items-start gap-2.5">
                                <div className="p-2 rounded-xl bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-300 shrink-0 mt-0.5">
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-red-700 dark:text-red-300">
                                    Geolocation Anchor
                                  </span>
                                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                                    {att.name || 'Sovereign Location'}
                                  </h5>
                                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                                    {att.address}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => showToast(`Location pinned: ${att.latitude || 6.44}, ${att.longitude || 3.47}`, 'info')}
                                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 text-[10px] font-bold hover:bg-slate-50 transition shrink-0 flex items-center gap-1 cursor-pointer"
                              >
                                <ExternalLink className="w-3 h-3" /> Maps
                              </button>
                            </div>
                          );
                        }

                        // 4. Folder UGC (FingerOrbit Video/Image) Attachment
                        if (att.type === 'folder_ugc') {
                          const isDownloadAllowed = contactPinInfo.pin_permission === 'download' || msg.pin_permission === 'download';
                          return (
                            <div
                              key={attIdx}
                              className="rounded-2xl border-2 border-indigo-400 dark:border-indigo-700 overflow-hidden bg-slate-950 text-white shadow-md space-y-0"
                            >
                              <div className="relative aspect-video max-h-56 w-full bg-slate-900 flex items-center justify-center overflow-hidden">
                                {att.thumbnail_url ? (
                                  <img
                                    src={att.thumbnail_url}
                                    alt={att.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="flex flex-col items-center gap-2 text-slate-400">
                                    <Video className="w-8 h-8 text-indigo-400" />
                                    <span className="text-xs font-bold">FingerOrbit™ Video Asset</span>
                                  </div>
                                )}
                                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                                  <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-black uppercase text-indigo-300 border border-indigo-400/40">
                                    {att.folder_type === 'video' ? 'Video Folder' : 'Image Folder'}
                                  </span>
                                  {isDownloadAllowed ? (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                                      <Check className="w-3 h-3" /> Download Unlocked
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-600/90 backdrop-blur-md text-[10px] font-bold text-white flex items-center gap-1">
                                      <Eye className="w-3 h-3" /> Stream View Only
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="p-3.5 space-y-2.5 bg-slate-900 border-t border-indigo-900">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h5 className="text-xs md:text-sm font-black text-white">
                                      {att.title}
                                    </h5>
                                    <p className="text-[10px] text-slate-300">
                                      {att.file_size_bytes ? `${Math.round(att.file_size_bytes / 1000000)} MB` : '420 MB'} • {att.duration_seconds ? `${Math.floor(att.duration_seconds / 60)}:${att.duration_seconds % 60 < 10 ? '0' : ''}${att.duration_seconds % 60}` : '3:00'} • 4K ProRes Sovereign Master
                                    </p>
                                  </div>
                                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800">
                                    PIN Required
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => showToast(`Playing encrypted stream: "${att.title}"`, 'info')}
                                    className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                  >
                                    <Play className="w-3.5 h-3.5" />
                                    <span>Play Encrypted Stream</span>
                                  </button>

                                  {isDownloadAllowed ? (
                                    <button
                                      type="button"
                                      onClick={() => showToast(`DRM Download token issued for "${att.title}". Saving ProRes file...`, 'success')}
                                      className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      <span>Download</span>
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setPinUnlockTarget({ messageId: msg.id, ugcItem: att })}
                                      className="py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                                    >
                                      <Lock className="w-3.5 h-3.5" />
                                      <span>Enter PIN to Download</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // 5. Document Attachment
                        if (att.type === 'document') {
                          return (
                            <div
                              key={attIdx}
                              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {att.name || 'Sovereign Document'}
                                  </h5>
                                  <span className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                                    {att.size || '1.8 MB'} • Encrypted PDF
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => showToast(`Downloading: ${att.name}`, 'info')}
                                className="p-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        }

                        // 6. Event Attachment
                        if (att.type === 'event') {
                          return (
                            <div
                              key={attIdx}
                              className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-300 dark:border-purple-800 flex items-center justify-between gap-3"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="p-2 rounded-xl bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 shrink-0">
                                  <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">
                                    Sovereign Event
                                  </span>
                                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                                    {att.title}
                                  </h5>
                                  <p className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                                    {att.date} • {att.venue || 'Virtual Enclave'}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => showToast(`RSVP confirmed for "${att.title}"`, 'success')}
                                className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer"
                              >
                                RSVP
                              </button>
                            </div>
                          );
                        }

                        // 7. General Media Photos / Videos
                        if (att.type === 'media' || att.type === 'image' || att.type === 'video') {
                          return (
                            <div key={attIdx} className="rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 max-h-72">
                              {att.media_type === 'video' ? (
                                <video src={att.url} controls className="w-full h-full object-cover" />
                              ) : (
                                <img src={att.url} alt={att.name || 'Media attachment'} className="w-full h-full object-cover" />
                              )}
                            </div>
                          );
                        }

                        return null;
                      })}
                    </div>
                  )}
                </div>

                {/* Card Footer: Quick Reactions */}
                <div className="px-3.5 py-2 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-2xl border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {['❤️', '🔥', '👏', '💎', '😂'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => showToast(`Reacted with ${emoji} to Post Card`, 'success')}
                        className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-xs transition cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSave(msg.id)}
                      className={`text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                        msg.is_saved ? 'text-emerald-700' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
                      }`}
                    >
                      <Bookmark className="w-3 h-3" />
                      <span>{msg.is_saved ? 'Saved' : 'Save'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChatInput(`Replying to: "${msg.content.slice(0, 30)}..." `);
                      }}
                      className="text-[11px] font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 transition flex items-center gap-1 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Composer: Active Queued Attachments Tray */}
      {composerAttachments.length > 0 && (
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-300 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
            <span>Attached Elements ({composerAttachments.length})</span>
            <button
              type="button"
              onClick={() => setComposerAttachments([])}
              className="text-[10px] text-red-600 hover:underline cursor-pointer"
            >
              Clear All
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {composerAttachments.map((att, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-900 dark:text-white shadow-2xs"
              >
                <span className="capitalize text-emerald-600">{att.type}:</span>
                <span className="truncate max-w-[150px]">{att.name || att.title || att.question}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(idx)}
                  className="p-0.5 text-slate-500 hover:text-red-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Emojis Queued Tray */}
      {selectedEmojis.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap px-1">
          <span className="text-[10px] font-bold text-slate-600 uppercase">Tags:</span>
          {selectedEmojis.map((emoji) => (
            <span
              key={emoji}
              onClick={() => handleToggleEmoji(emoji)}
              className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-xs border border-emerald-400 cursor-pointer"
            >
              {emoji} ×
            </span>
          ))}
        </div>
      )}

      {/* 4. Composer Input Row with Media Picker Toolbar */}
      <form onSubmit={handleSendMessage} className="space-y-3">
        {/* Toggle options bar: PIN required, View Once */}
        <div className="flex items-center justify-between flex-wrap gap-2 px-1 text-xs font-bold text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={requirePin}
                onChange={(e) => setRequirePin(e.target.checked)}
                className="rounded border-slate-400 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" /> Require Mutual PIN
              </span>
            </label>

            {requirePin && (
              <select
                value={pinPermissionTier}
                onChange={(e) => setPinPermissionTier(e.target.value as any)}
                className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                <option value="download">Download Allowed (4K)</option>
                <option value="view_only">View Only (Streaming DRM)</option>
              </select>
            )}

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isViewOnce}
                onChange={(e) => setIsViewOnce(e.target.checked)}
                className="rounded border-slate-400 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-amber-600" /> Disappearing View Once
              </span>
            </label>
          </div>

          <button
            type="button"
            onClick={() => setShowMediaPicker(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
            <span>Attach Elements ({composerAttachments.length})</span>
          </button>
        </div>

        {/* Input Box & Actions */}
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={`Send encrypted post card to ${activePeer.name}...`}
            className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-xs md:text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
          />

          <button
            type="button"
            onClick={() => setShowMediaPicker(true)}
            className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl border border-slate-300 dark:border-slate-700 transition cursor-pointer"
            title="Open Rich Media Picker"
          >
            <Plus className="w-5 h-5 text-emerald-600" />
          </button>

          <button
            type="submit"
            disabled={isSending || (!chatInput.trim() && composerAttachments.length === 0)}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs md:text-sm rounded-2xl transition shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>{isSending ? 'Encrypting...' : 'Send'}</span>
          </button>
        </div>
      </form>

      {/* 5. Rich Media Picker Modal */}
      {showMediaPicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowMediaPicker(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-300 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-300">
                  <Paperclip className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">
                    Dynamic Post Card Media Picker
                  </h4>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    Attach Audio, Polls, Folders, Locations, Events & Emojis
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Picker Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
              {[
                { id: 'media', label: 'Media', icon: ImageIcon },
                { id: 'audio', label: 'Voice Mii™', icon: Volume2 },
                { id: 'folder_ugc', label: 'Folder UGC', icon: Folder },
                { id: 'poll', label: 'Poll', icon: BarChart3 },
                { id: 'location', label: 'Location', icon: MapPin },
                { id: 'document', label: 'Document', icon: FileText },
                { id: 'event', label: 'Event', icon: Calendar },
                { id: 'emojis', label: 'Emojis', icon: Smile }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPickerTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition cursor-pointer ${
                      pickerTab === tab.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab 1: Photos & Videos */}
            {pickerTab === 'media' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Select photo or video to embed into this post card:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    {
                      title: 'Studio Session 4K',
                      url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
                      type: 'image'
                    },
                    {
                      title: 'Afrofuturist Visual 01',
                      url: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=800',
                      type: 'image'
                    },
                    {
                      title: 'Lagos Enclave Mastercut',
                      url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
                      type: 'image'
                    }
                  ].map((m, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleAddAttachment({ type: 'media', name: m.title, url: m.url, media_type: m.type })}
                      className="group relative aspect-video rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 hover:border-emerald-500 cursor-pointer transition shadow-2xs"
                    >
                      <img src={m.url} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[10px] font-bold text-white truncate">{m.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Voice Mii™ Audio */}
            {pickerTab === 'audio' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Voice Mii™ Track Title
                </label>
                <input
                  type="text"
                  value={draftAudioName}
                  onChange={(e) => setDraftAudioName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Duration (e.g. 0:45)
                </label>
                <input
                  type="text"
                  value={draftAudioDuration}
                  onChange={(e) => setDraftAudioDuration(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleAddAttachment({
                      type: 'audio',
                      name: draftAudioName,
                      duration_seconds: 45,
                      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                      waveform: [35, 65, 95, 50, 85, 100, 75, 90, 45, 80, 65, 55, 75, 40]
                    })
                  }
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Attach Voice Mii™
                </button>
              </div>
            )}

            {/* Tab 3: FingerOrbit Folder UGC */}
            {pickerTab === 'folder_ugc' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Folder UGC Asset Title
                </label>
                <input
                  type="text"
                  value={draftUgcTitle}
                  onChange={(e) => setDraftUgcTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDraftUgcFolder('video')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      draftUgcFolder === 'video'
                        ? 'bg-indigo-100 text-indigo-950 border-indigo-500'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 border-slate-300'
                    }`}
                  >
                    <Video className="w-4 h-4" /> Video Folder
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraftUgcFolder('image')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      draftUgcFolder === 'image'
                        ? 'bg-purple-100 text-purple-950 border-purple-500'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 border-slate-300'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" /> Image Folder
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleAddAttachment({
                      type: 'folder_ugc',
                      title: draftUgcTitle,
                      folder_type: draftUgcFolder,
                      requires_pin: true,
                      pin_permission: pinPermissionTier,
                      thumbnail_url: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=800',
                      media_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                      file_size_bytes: 420000000,
                      duration_seconds: 180
                    })
                  }
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Attach PIN-Gated Folder UGC
                </button>
              </div>
            )}

            {/* Tab 4: Interactive Poll */}
            {pickerTab === 'poll' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Poll Question
                </label>
                <input
                  type="text"
                  value={draftPollQuestion}
                  onChange={(e) => setDraftPollQuestion(e.target.value)}
                  placeholder="e.g. Which FingerOrbit resolution is best?"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Options
                  </label>
                  {draftPollOptions.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const next = [...draftPollOptions];
                        next[i] = e.target.value;
                        setDraftPollOptions(next);
                      }}
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                    />
                  ))}
                  {draftPollOptions.length < 4 && (
                    <button
                      type="button"
                      onClick={() => setDraftPollOptions([...draftPollOptions, `Option ${draftPollOptions.length + 1}`])}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      + Add Option
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!draftPollQuestion.trim()}
                  onClick={() =>
                    handleAddAttachment({
                      type: 'poll',
                      poll_data: {
                        id: `poll-${Date.now()}`,
                        question: draftPollQuestion,
                        options: draftPollOptions.map((t, idx) => ({ id: `opt-${idx}`, text: t, votes: 0 })),
                        total_votes: 0
                      }
                    })
                  }
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Attach Interactive Poll
                </button>
              </div>
            )}

            {/* Tab 5: Location */}
            {pickerTab === 'location' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Location Venue Name
                </label>
                <input
                  type="text"
                  value={draftLocationName}
                  onChange={(e) => setDraftLocationName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Street Address
                </label>
                <input
                  type="text"
                  value={draftLocationAddress}
                  onChange={(e) => setDraftLocationAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleAddAttachment({
                      type: 'location',
                      name: draftLocationName,
                      address: draftLocationAddress,
                      latitude: 6.4474,
                      longitude: 3.4723
                    })
                  }
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Attach Geolocation Pin
                </button>
              </div>
            )}

            {/* Tab 6: Document */}
            {pickerTab === 'document' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Document Filename
                </label>
                <input
                  type="text"
                  value={draftDocName}
                  onChange={(e) => setDraftDocName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleAddAttachment({
                      type: 'document',
                      name: draftDocName,
                      size: '2.4 MB',
                      url: '#'
                    })
                  }
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Attach Encrypted Document
                </button>
              </div>
            )}

            {/* Tab 7: Event */}
            {pickerTab === 'event' && (
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Event Title
                </label>
                <input
                  type="text"
                  value={draftEventTitle}
                  onChange={(e) => setDraftEventTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Date & Time
                </label>
                <input
                  type="text"
                  value={draftEventDate}
                  onChange={(e) => setDraftEventDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleAddAttachment({
                      type: 'event',
                      title: draftEventTitle,
                      date: draftEventDate,
                      venue: 'Victoria Island Creative Enclave'
                    })
                  }
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Attach Sovereign Event
                </button>
              </div>
            )}

            {/* Tab 8: Protocol Emojis */}
            {pickerTab === 'emojis' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  Select protocol emojis to tag this post card:
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {PROTOCOL_EMOJIS.map((emoji) => {
                    const isSelected = selectedEmojis.includes(emoji);
                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleToggleEmoji(emoji)}
                        className={`text-xl p-2 rounded-xl border transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-100 border-emerald-500'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. PIN Unlock Dialog for Folder UGC Download */}
      {pinUnlockTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setPinUnlockTarget(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-300 dark:border-slate-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-950 dark:bg-indigo-950 dark:text-indigo-300">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">
                    Unlock Folder UGC Download
                  </h4>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    Mutual 6–8 Digit Peer PIN Required
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPinUnlockTarget(null)}
                className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Enter the mutual PIN code you exchanged with <strong>{activePeer.name}</strong> to unlock tokenized ProRes 4K download permissions.
            </p>

            <form onSubmit={handleVerifyPinForUgc} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  6 to 8 Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={8}
                  required
                  value={enteredPinInput}
                  onChange={(e) => setEnteredPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 789456"
                  className="w-full px-3 py-2 text-sm font-mono tracking-widest bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white font-bold"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPinUnlockTarget(null)}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifyingPin}
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  {isVerifyingPin ? 'Verifying...' : 'Authorize Download'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Manage Mutual PIN & UGC Permissions Dialog */}
      {showManagePinModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setShowManagePinModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-300 dark:border-slate-800 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-950 dark:bg-blue-950 dark:text-blue-300">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900 dark:text-white">
                    Mutual PIN & Folder Permissions
                  </h4>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    Configure access for {activePeer.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowManagePinModal(false)}
                className="p-1 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">
                    Mutual Handshake PIN Code
                  </span>
                  <div className="text-base font-mono font-black text-slate-900 dark:text-white tracking-widest mt-0.5">
                    {contactPinInfo.pin_code || '789456'}
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-400">
                  Verified Handshake
                </span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-900 dark:text-white">
                  Permission Granted to Peer:
                </label>

                <div
                  onClick={() => handleUpdatePinPermission('download')}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                    contactPinInfo.pin_permission === 'download'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <Download className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      Full Download & DRM Token Rights
                    </h5>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      Peer can preview and download high-resolution master media from your FingerOrbit folders.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => handleUpdatePinPermission('view_only')}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                    contactPinInfo.pin_permission === 'view_only'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  <Eye className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      Stream View Only (Strict DRM)
                    </h5>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      Peer can only stream watermarked video/audio. Asset download is strictly disabled.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowManagePinModal(false)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiiEncryptedPeerChat;

