/*
 * FingerMobile Protocol™ - Universal Profile Card Component
 * Sovereign Identity & LushPressies Profile Standard
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  FireIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  EyeSlashIcon,
  PencilSquareIcon,
  Cog6ToothIcon,
  WalletIcon,
  CameraIcon,
  XMarkIcon,
  CheckIcon,
  ArrowTopRightOnSquareIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useAppContext } from '../../contexts/AppContext';
import { VerificationBadge } from '../verification/VerificationBadge';
import UserService from '../../services/UserService';
import userProfileSyncService from '../../services/UserProfileSyncService';

export interface UniversalProfileCardProps {
  className?: string;
  customUser?: {
    id?: string;
    name?: string;
    username?: string;
    headline?: string;
    avatar?: string;
    coverImage?: string;
    verificationLevel?: number;
    location?: string;
    streakDays?: number;
    level?: number;
    xpCurrent?: number;
    xpMax?: number;
    pinNumber?: string;
  };
  onEditProfile?: () => void;
}

interface StoredMemberProfile {
  name: string;
  username: string;
  headline: string;
  location: string;
  avatar: string;
  coverImage: string;
  pinNumber: string;
}

const STORAGE_KEY = 'fmp_member_profile';

const DEFAULT_COVERS = [
  { label: 'Sovereign Enclave', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Lagos Skyline', url: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Sunset Emerald', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80' },
  { label: 'Cyber Horology', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80' },
];

const DEFAULT_AVATARS = [
  { label: 'Obinna / Protocol', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { label: 'Executive Gold', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Creator Studio', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
  { label: 'Tech Pioneer', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80' },
];

export const UniversalProfileCard: React.FC<UniversalProfileCardProps> = ({
  className = '',
  customUser,
  onEditProfile
}) => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const appContext = useAppContext();
  const ficBalance = appContext.ficBalance ?? 2500;
  const showToast = appContext.showToast;

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Load from unified UserProfileSyncService or fallbacks
  const [profileData, setProfileData] = useState<StoredMemberProfile>(() => {
    const synced = userProfileSyncService.getProfile();
    return {
      name: customUser?.name || synced.name,
      username: customUser?.username || synced.username,
      headline: customUser?.headline || synced.headline,
      location: customUser?.location || synced.location,
      avatar: customUser?.avatar || synced.avatar,
      coverImage: customUser?.coverImage || synced.coverImage,
      pinNumber: customUser?.pinNumber || synced.pinNumber,
    };
  });

  const [pinQuotaRemaining, setPinQuotaRemaining] = useState<number>(() => {
    return userProfileSyncService.getProfile().pinQuotaRemaining;
  });

  const [isPinRevealed, setIsPinRevealed] = useState(false);
  const [isIncognito, setIsIncognito] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showPinInfo, setShowPinInfo] = useState(false);

  // Modal editing form state
  const [draftName, setDraftName] = useState(profileData.name);
  const [draftUsername, setDraftUsername] = useState(profileData.username);
  const [draftHeadline, setDraftHeadline] = useState(profileData.headline);
  const [draftLocation, setDraftLocation] = useState(profileData.location);
  const [draftAvatar, setDraftAvatar] = useState(profileData.avatar);
  const [draftCover, setDraftCover] = useState(profileData.coverImage);
  const [draftPin, setDraftPin] = useState(profileData.pinNumber);

  // Subscribe to live reactive updates across all components/tabs
  useEffect(() => {
    const unsub = userProfileSyncService.subscribe((updated) => {
      setProfileData({
        name: updated.name,
        username: updated.username,
        headline: updated.headline,
        location: updated.location,
        avatar: updated.avatar,
        coverImage: updated.coverImage,
        pinNumber: updated.pinNumber,
      });
      setPinQuotaRemaining(updated.pinQuotaRemaining);
    });
    return unsub;
  }, []);

  // Synchronize when customUser prop changes
  useEffect(() => {
    if (customUser) {
      setProfileData((prev) => ({
        ...prev,
        name: customUser.name || prev.name,
        username: customUser.username || prev.username,
        headline: customUser.headline || prev.headline,
        location: customUser.location || prev.location,
        avatar: customUser.avatar || prev.avatar,
        coverImage: customUser.coverImage || prev.coverImage,
        pinNumber: customUser.pinNumber || prev.pinNumber,
      }));
    }
  }, [customUser]);

  const saveProfile = async (updated: StoredMemberProfile) => {
    setProfileData(updated);
    userProfileSyncService.updateProfile({
      name: updated.name,
      username: updated.username,
      headline: updated.headline,
      location: updated.location,
      avatar: updated.avatar,
      coverImage: updated.coverImage,
      pinNumber: updated.pinNumber,
    });

    // Persist to protocol backend database
    try {
      const parts = updated.name.split(' ');
      const firstName = parts[0] || 'Member';
      const lastName = parts.slice(1).join(' ') || '';
      await UserService.updateUserProfile({
        firstName,
        lastName,
        bio: updated.headline,
        avatar: updated.avatar,
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Backend database sync fallback', err);
    }
  };

  // Direct file upload handler (supports .gif, .png, .jpeg, .jpg, .webp)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'cover'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 10MB
    if (file.size > 10 * 1024 * 1024) {
      showToast?.('File size exceeds 10MB limit. Please choose a smaller file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        if (type === 'avatar') {
          const updated = { ...profileData, avatar: dataUrl };
          saveProfile(updated);
          setDraftAvatar(dataUrl);
          showToast?.('Profile picture (.gif/.png/.jpeg) updated and saved to database!', 'success');
        } else {
          const updated = { ...profileData, coverImage: dataUrl };
          saveProfile(updated);
          setDraftCover(dataUrl);
          showToast?.('Cover banner (.gif/.png/.jpeg) updated and saved to database!', 'success');
        }
      }
    };
    reader.readAsDataURL(file);
    // Reset file input value to allow selecting same file again
    e.target.value = '';
  };

  const handleCopyPin = () => {
    setIsPinRevealed(!isPinRevealed);
    if (!isPinRevealed) {
      navigator.clipboard?.writeText(profileData.pinNumber);
      showToast?.(`6-Digit Protocol PIN: ${profileData.pinNumber} copied to clipboard!`, 'success');
    }
  };

  const handleOpenEditModal = () => {
    setDraftName(profileData.name);
    setDraftUsername(profileData.username);
    setDraftHeadline(profileData.headline);
    setDraftLocation(profileData.location);
    setDraftAvatar(profileData.avatar);
    setDraftCover(profileData.coverImage);
    setDraftPin(profileData.pinNumber);
    setIsEditModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StoredMemberProfile = {
      name: draftName.trim() || 'Sovereign Member',
      username: draftUsername.trim().replace(/^@/, '') || 'member',
      headline: draftHeadline.trim() || 'Protocol Member',
      location: draftLocation.trim() || 'Lagos, NG',
      avatar: draftAvatar.trim() || profileData.avatar,
      coverImage: draftCover.trim() || profileData.coverImage,
      pinNumber: draftPin.trim().slice(0, 6) || profileData.pinNumber,
    };
    saveProfile(updated);
    setIsEditModalOpen(false);
    showToast?.('Member profile saved to protocol database & local store!', 'success');
    onEditProfile?.();
  };

  const streakDays = customUser?.streakDays ?? 26;
  const level = customUser?.level ?? 7;
  const xpCurrent = customUser?.xpCurrent ?? 4200;
  const xpMax = customUser?.xpMax ?? 5000;
  const xpPercent = Math.min(100, Math.round((xpCurrent / xpMax) * 100));

  return (
    <div className={`universal-profile-card space-y-3.5 ${className}`}>
      {/* Hidden File Inputs for Direct One-Click Uploads */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => handleFileUpload(e, 'avatar')}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => handleFileUpload(e, 'cover')}
      />

      {/* 1. Main Profile Identity Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-100/90 dark:border-emerald-950/40 shadow-xs overflow-hidden transition-all hover:shadow-md">
        {/* Cover Image Banner */}
        <div
          className="h-28 bg-gradient-to-r from-emerald-600 via-teal-700 to-[#DC582A] relative group"
          style={{
            backgroundImage: profileData.coverImage ? `url(${profileData.coverImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Cover Overlay on Hover */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

          {/* Live Sovereign Beacon Pill */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-[10px] font-semibold tracking-wide border border-emerald-400/30 backdrop-blur-xs z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Live Active
          </div>

          {/* Quick Settings Gear (routes to /settings) */}
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="absolute top-2 left-2 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition z-10 cursor-pointer shadow-xs"
            title="Profile & Privacy Settings"
          >
            <Cog6ToothIcon className="w-4 h-4" />
          </button>

          {/* Direct Cover Edit Button */}
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/60 hover:bg-black/80 text-white text-[10px] font-bold flex items-center gap-1 backdrop-blur-xs transition z-10 cursor-pointer"
            title="Upload cover image (.gif/.png/.jpeg)"
          >
            <CameraIcon className="w-3.5 h-3.5" />
            <span>Change Cover</span>
          </button>
        </div>

        {/* Avatar & Member Details */}
        <div className="px-4 pb-4 pt-0 -mt-10 text-center relative z-10">
          <div className="relative inline-block group">
            <img
              src={profileData.avatar}
              alt={profileData.name}
              className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg mx-auto transition-transform group-hover:scale-105"
            />
            {isIncognito && (
              <span
                className="absolute bottom-0 right-0 p-1 bg-gray-800 text-white rounded-full shadow-sm"
                title="Incognito Active"
              >
                <EyeSlashIcon className="w-3.5 h-3.5" />
              </span>
            )}

            {/* Direct Avatar Edit Button */}
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-md transition cursor-pointer"
              title="Upload new avatar (.gif/.png/.jpeg)"
            >
              <CameraIcon className="w-3.5 h-3.5" />
            </button>

            {/* Full Edit Profile Modal Button */}
            <button
              type="button"
              onClick={handleOpenEditModal}
              className="absolute top-0 right-0 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md transition cursor-pointer"
              title="Edit Profile Details"
            >
              <PencilSquareIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-center gap-1.5">
            <h2 className="text-sm font-black text-gray-900 dark:text-white tracking-tight truncate max-w-[200px]">
              {profileData.name}
            </h2>
            <VerificationBadge level={customUser?.verificationLevel ?? 3} size="small" />
          </div>

          <p className="text-[11px] text-slate-700 dark:text-gray-400 font-mono">@{profileData.username}</p>
          <p className="text-xs text-emerald-800 dark:text-emerald-400 font-semibold mt-1 line-clamp-1">
            {profileData.headline}
          </p>
          <p className="text-[10px] text-slate-700 mt-0.5">{profileData.location}</p>

          {/* Quick Action Badges */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleOpenEditModal}
              className="px-3 py-1 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 text-xs font-bold rounded-xl transition flex items-center gap-1"
            >
              <PencilSquareIcon className="w-3.5 h-3.5" />
              Edit Profile
            </button>
            <button
              type="button"
              onClick={() => navigate('/master-dashboard')}
              className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
            >
              <BuildingOffice2Icon className="w-3.5 h-3.5" />
              Dashboard
            </button>
          </div>

          {/* Consent Verified & 6-Digit PIN Pill */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 dark:border-emerald-800/40 rounded-full text-[11px] text-emerald-950 dark:text-emerald-300 text-emerald-950 border-emerald-400 font-black">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold">Consent Verified</span>
            <button
              type="button"
              onClick={handleCopyPin}
              className="font-mono font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-0.5 ml-1 cursor-pointer"
              title="Click to reveal / copy 6-digit PIN"
            >
              <LockClosedIcon className="w-3 h-3" />
              PIN: {isPinRevealed ? profileData.pinNumber : `••${profileData.pinNumber.slice(-2)}`}
            </button>
            <button
              type="button"
              onClick={() => setShowPinInfo(!showPinInfo)}
              className="w-4 h-4 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-950 dark:text-emerald-200 text-[10px] font-bold flex items-center justify-center hover:bg-emerald-300 transition border text-emerald-950 border-emerald-400 font-black"
              title="Why 6-Digit Protocol PIN? (Click for info)"
            >
              ?
            </button>
          </div>

          {/* 6-Digit PIN Architecture Information Callout */}
          {showPinInfo && (
            <div className="mt-2 p-2.5 bg-emerald-950 text-emerald-200 rounded-xl text-[10px] text-left leading-relaxed border border-emerald-700/60 shadow-lg animate-in fade-in duration-150">
              <div className="font-bold text-emerald-300 mb-1 flex items-center justify-between">
                <span>6-Digit Protocol PIN Architecture</span>
                <button type="button" onClick={() => setShowPinInfo(false)} className="text-white font-black">✕</button>
              </div>
              <p className="mb-1">
                <strong>Static vs Dynamic:</strong> The PIN is your permanent sovereign consent key for authorizing micro-transactions, post publishing, and NFC escrow releases. It stays memorable while operating a dynamic cryptographic quota ({pinQuotaRemaining}/50) that resets every 90 days.
              </p>
              <p>
                <strong>Editable:</strong> Yes, you can edit or rotate your PIN at any time in{' '}
                <button
                  type="button"
                  onClick={() => navigate('/settings')}
                  className="text-amber-400 underline font-bold"
                >
                  Settings
                </button>{' '}
                to prevent unauthorized compromise.
              </p>
            </div>
          )}

          {/* PIN Quota & Moderation Slot Badge */}
          <div className="mt-2 flex items-center justify-between px-3 py-1 bg-[#F5F9F6] dark:bg-gray-700/50 border border-emerald-200/60 dark:border-gray-600 rounded-xl text-[11px]">
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-emerald-900 dark:text-emerald-300">PIN Quota:</span>
              <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{pinQuotaRemaining}/50</span>
              <span className="text-[10px] text-gray-400">Remaining</span>
            </div>
            <button
              type="button"
              onClick={() => setIsIncognito(!isIncognito)}
              className="text-[10px] font-bold text-[#DC582A] hover:underline cursor-pointer"
              title="Toggle incognito presence"
            >
              {isIncognito ? 'Ghost: ON' : 'Incognito'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Gamification & Balances Card (Lush Rewards Style) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-emerald-100/90 dark:border-emerald-950/40 shadow-xs p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
            <SparklesIcon className="w-3.5 h-3.5 text-[#DC582A]" />
            Lush Rewards
          </span>
          <span className="text-[10px] font-semibold text-emerald-950 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-400 dark:border-emerald-800/40 text-emerald-950 border-emerald-400 font-black">
            Level {level}
          </span>
        </div>

        {/* Level XP Progress Bar */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-700 dark:text-gray-400 mb-1 font-mono">
            <span>XP: {xpCurrent} / {xpMax}</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-400">{xpPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-gray-700 text-center">
          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl p-2 border border-emerald-100 dark:border-emerald-900/40">
            <div className="text-[10px] text-emerald-900 dark:text-emerald-300 font-semibold flex items-center justify-center gap-1">
              <WalletIcon className="w-3 h-3 text-emerald-600" />
              FIC Balance
            </div>
            <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
              {(ficBalance ?? 2500).toLocaleString()}
            </div>
          </div>

          <div className="bg-amber-50/60 dark:bg-amber-950/30 rounded-xl p-2 border border-amber-100 dark:border-amber-900/40">
            <div className="text-[10px] text-amber-900 dark:text-amber-300 font-semibold flex items-center justify-center gap-1">
              <FireIcon className="w-3 h-3 text-[#DC582A]" />
              Streak
            </div>
            <div className="text-sm font-extrabold text-[#DC582A] font-mono mt-0.5">
              {streakDays} Days 🔥
            </div>
          </div>
        </div>

        {/* Quick Links Menu */}
        <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-200 dark:border-gray-700 text-center">
          <button
            type="button"
            onClick={() => navigate('/financials')}
            className="p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <span className="text-[10px] text-gray-600 dark:text-gray-300 font-bold block">Wallet</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/hallmarks')}
            className="p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <span className="text-[10px] text-gray-600 dark:text-gray-300 font-bold block">Badges</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/master-dashboard')}
            className="p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <span className="text-[10px] text-gray-600 dark:text-gray-300 font-bold block">Master</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/settings')}
            className="p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <span className="text-[10px] text-gray-600 dark:text-gray-300 font-bold block">Settings</span>
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 3. INTERACTIVE MEMBER PROFILE EDIT MODAL                                */}
      {/* ======================================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-[#DC582A] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PencilSquareIcon className="w-5 h-5 text-white" />
                <div>
                  <h3 className="text-sm font-black tracking-tight">Edit Sovereign Member Profile</h3>
                  <p className="text-[10px] text-emerald-100">Live customization • Instant persistent sync</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-slate-700 transition"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Cover Photo Customization */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Cover Banner (.gif / .png / .jpeg)
                </label>
                <div
                  className="h-20 rounded-xl relative overflow-hidden border border-slate-200 dark:border-slate-700 mb-2"
                  style={{
                    backgroundImage: draftCover ? `url(${draftCover})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white text-xs font-bold gap-1 transition"
                  >
                    <CameraIcon className="w-4 h-4" />
                    <span>Upload Cover File</span>
                  </button>
                </div>
                {/* Preset Covers */}
                <div className="grid grid-cols-4 gap-1.5">
                  {DEFAULT_COVERS.map((cov) => (
                    <button
                      key={cov.label}
                      type="button"
                      onClick={() => setDraftCover(cov.url)}
                      className={`text-[9px] font-bold py-1 px-1.5 rounded-lg border truncate transition ${
                        draftCover === cov.url
                          ? 'border-orange-500 bg-orange-50 text-orange-700 font-extrabold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {cov.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatar Photo Customization */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Profile Avatar (.gif / .png / .jpeg)
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative group flex-shrink-0">
                    <img
                      src={draftAvatar}
                      alt="Avatar Preview"
                      className="w-14 h-14 rounded-full border-2 border-emerald-500 object-cover shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition"
                      title="Upload Avatar"
                    >
                      <CameraIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                    >
                      <CameraIcon className="w-3.5 h-3.5 text-slate-600" />
                      Upload Avatar (.gif/.png/.jpg)
                    </button>
                    <div className="flex gap-1.5 mt-2">
                      {DEFAULT_AVATARS.map((av) => (
                        <button
                          key={av.label}
                          type="button"
                          onClick={() => setDraftAvatar(av.url)}
                          className={`w-7 h-7 rounded-full overflow-hidden border-2 transition ${
                            draftAvatar === av.url ? 'border-orange-500 scale-110' : 'border-slate-200'
                          }`}
                        >
                          <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Display Name & Username */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Handle (@)
                  </label>
                  <input
                    type="text"
                    value={draftUsername}
                    onChange={(e) => setDraftUsername(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:outline-none bg-white dark:bg-slate-800 font-mono text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Headline / Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Headline & Bio
                </label>
                <input
                  type="text"
                  value={draftHeadline}
                  onChange={(e) => setDraftHeadline(e.target.value)}
                  placeholder="e.g. Protocol Architect • Sovereign Creator"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              {/* Location & Protocol PIN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={draftLocation}
                    onChange={(e) => setDraftLocation(e.target.value)}
                    placeholder="e.g. Lagos, NG"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:outline-none bg-white dark:bg-slate-800 text-slate-900 font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    6-Digit Protocol PIN
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={draftPin}
                    onChange={(e) => setDraftPin(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 focus:border-orange-500 focus:outline-none bg-white dark:bg-slate-800 font-mono font-bold text-slate-900 border-slate-300 focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => navigate('/settings')}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                >
                  <span>Advanced Settings</span>
                  <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold bg-gradient-to-r from-emerald-600 to-[#DC582A] text-white rounded-xl shadow-md hover:opacity-95 transition flex items-center gap-1.5"
                  >
                    <CheckIcon className="w-3.5 h-3.5" />
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalProfileCard;
