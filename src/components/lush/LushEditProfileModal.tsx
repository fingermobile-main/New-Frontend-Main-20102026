/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  XMarkIcon,
  CameraIcon,
  SparklesIcon,
  CheckIcon,
  MapPinIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { LushUserProfile } from './LushProfileSidebar';

export interface LushEditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: LushUserProfile;
  onSave: (_updated: Partial<LushUserProfile>) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
];

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200',
];

const MATCHING_INTENTS = [
  'Unique Social Experience',
  'Serious Dating',
  'Long-term Commitment',
  'Empathetic Connection',
  'High-Value Romance',
  'Creative Collaboration',
];

export const LushEditProfileModal: React.FC<LushEditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [name, setName] = useState(user.name);
  const [headline, setHeadline] = useState(user.headline);
  const [bio, setBio] = useState(
    user.bio || 'Curating luxury African contemporary art & exploring meaningful connections.'
  );
  const [location, setLocation] = useState(user.location);
  const [matchingIntent, setMatchingIntent] = useState(user.matchingIntent);
  const [avatar, setAvatar] = useState(user.avatar);
  const [coverImage, setCoverImage] = useState(
    user.coverImage || PRESET_COVERS[0]
  );
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setAvatar(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setCoverImage(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      onSave({
        name,
        headline,
        bio,
        location,
        matchingIntent,
        avatar,
        coverImage,
      });
      setSaving(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-emerald-100/90 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-white to-teal-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-100/70 text-emerald-800 rounded-xl">
              <SparklesIcon className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Edit Lush Pressies Profile
              </h2>
              <p className="text-xs text-gray-500">
                Update your VIP identity, bio, photos, and matching intent
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-slate-700 hover:text-gray-700 transition"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          {/* Cover & Avatar Editor Banner */}
          <div className="space-y-3">
            <label className="block font-bold text-gray-800">
              Cover Banner & Profile Photo
            </label>
            <div
              className="h-28 rounded-2xl relative bg-cover bg-center border border-gray-200 shadow-inner group overflow-hidden"
              style={{ backgroundImage: `url(${coverImage})` }}
            >
              <label
                className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 text-white font-semibold cursor-pointer"
                title="Upload Banner"
              >
                <CameraIcon className="w-5 h-5" />
                <span>Change Banner</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFile}
                  className="hidden"
                />
              </label>

              {/* Avatar position */}
              <div className="absolute bottom-2 left-4">
                <div className="relative group/avatar">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-16 h-16 rounded-full border-3 border-white object-cover shadow-lg"
                  />
                  <label
                    className="absolute inset-0 bg-black/45 rounded-full opacity-0 group-hover/avatar:opacity-100 transition flex items-center justify-center text-white cursor-pointer"
                    title="Change Avatar Photo"
                  >
                    <CameraIcon className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFile}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Quick Avatar selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-700 font-medium">
                Choose preset luxury avatar:
              </span>
              <div className="flex gap-2 items-center overflow-x-auto pb-1">
                {PRESET_AVATARS.map((avUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatar(avUrl)}
                    className={`w-9 h-9 rounded-full border-2 overflow-hidden shrink-0 transition ${
                      avatar === avUrl
                        ? 'border-emerald-600 ring-2 ring-emerald-400'
                        : 'border-transparent hover:opacity-80'
                    }`}
                  >
                    <img
                      src={avUrl}
                      alt="Preset avatar"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Cover Banner selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-700 font-medium">
                Choose preset cover banner:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_COVERS.map((covUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCoverImage(covUrl)}
                    className={`h-11 rounded-lg border-2 overflow-hidden bg-cover bg-center transition ${
                      coverImage === covUrl
                        ? 'border-emerald-600 ring-2 ring-emerald-400'
                        : 'border-transparent hover:opacity-85'
                    }`}
                    style={{ backgroundImage: `url(${covUrl})` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Name & Headline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white text-slate-900 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden transition font-bold border-slate-300 placeholder:text-slate-400"
                placeholder="e.g. Zainab Bello"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                <MapPinIcon className="w-3.5 h-3.5 text-emerald-600" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full bg-white text-slate-900 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden transition font-bold border-slate-300 placeholder:text-slate-400"
                placeholder="e.g. Victoria Island, Lagos"
              />
            </div>
          </div>

          {/* Professional Headline */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">
              Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
              className="w-full bg-white text-slate-900 border border-gray-300 rounded-xl px-3 py-2 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden transition font-bold border-slate-300 placeholder:text-slate-400"
              placeholder="e.g. Contemporary Artist & Gallery Curator"
            />
          </div>

          {/* Bio / Lifestyle Statement */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block font-bold text-gray-800">
                Bio & Lifestyle Statement
              </label>
              <span className="text-[10px] text-slate-700">
                {bio.length} / 300
              </span>
            </div>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 300))}
              rows={3}
              className="w-full bg-white text-slate-900 border border-gray-300 rounded-xl p-3 text-xs focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden transition resize-none font-bold border-slate-300 placeholder:text-slate-400"
              placeholder="Tell other high-value members about your passions, lifestyle, and what brings you joy..."
            />
          </div>

          {/* Matching Intent */}
          <div>
            <label className="block font-bold text-gray-800 mb-1.5">
              Matching Intent
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MATCHING_INTENTS.map((intent) => (
                <button
                  key={intent}
                  type="button"
                  onClick={() => setMatchingIntent(intent)}
                  className={`p-2 rounded-xl text-left font-semibold text-[11px] border transition flex items-center justify-between ${
                    matchingIntent === intent
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                      : 'border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate">{intent}</span>
                  {matchingIntent === intent && (
                    <CheckIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 disabled:opacity-40 transition flex items-center gap-1.5"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LushEditProfileModal;
