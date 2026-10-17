/*
 * FingerMobile Protocol™ - Structured 14-Category About Section & Pinned Details
 * Document: Member Users Profile Page Wall Charter Development 15102026.md (Section 5 & 6)
 * Left sidebar: 14 information categories with active highlighting.
 * Right panel: Pinned details architecture, inline editing controls, and visibility settings.
 * Strictly compliant with WCAG AAA contrast hierarchy standards.
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

import React, { useState } from 'react';
import {
  FileText,
  Briefcase,
  GraduationCap,
  Globe,
  MapPin,
  Mail,
  Calendar,
  Lock,
  Edit3,
  Check,
  X,
  Users,
  Award,
  Sparkles,
  ShieldCheck,
  AtSign,
  Compass,
  Gift,
  Heart,
  BookOpen,
  Pin,
  ExternalLink,
  Save
} from 'lucide-react';

export type AboutCategoryKey =
  | 'intro'
  | 'category'
  | 'personal_details'
  | 'links'
  | 'communities'
  | 'offers'
  | 'work'
  | 'education'
  | 'hobbies'
  | 'interests'
  | 'travel'
  | 'contact_info'
  | 'privacy_legal'
  | 'names';

export interface PinnedDetailItem {
  id: string;
  field_type: string;
  display_label: string;
  field_value: string;
  icon_identifier: string;
  display_order: number;
  visibility_setting: 'public' | 'friends' | 'private';
  is_pinned: boolean;
  verification_status: 'verified' | 'unverified';
}

interface StructuredAboutSectionProps {
  isOwner: boolean;
  isFriend: boolean;
  profileData: {
    name: string;
    username: string;
    bio: string;
    location: string;
    website: string;
    workplace?: string;
    category?: string;
    birthday?: string | null;
    contact_email?: string | null;
    pronouns?: string;
  };
  // eslint-disable-next-line no-unused-vars
  onUpdateField?: (fieldKey: string, newValue: any) => void;
}

export const StructuredAboutSection: React.FC<StructuredAboutSectionProps> = ({
  isOwner,
  isFriend,
  profileData,
  onUpdateField
}) => {
  const [activeCategory, setActiveCategory] = useState<AboutCategoryKey>('intro');

  // Pinned Details State (Section 6.2 - 6.3)
  const [pinnedDetails, setPinnedDetails] = useState<PinnedDetailItem[]>([
    {
      id: 'pin-1',
      field_type: 'category',
      display_label: 'Category',
      field_value: profileData.category || 'Creator Level 5 / Sovereign Architect',
      icon_identifier: 'Award',
      display_order: 1,
      visibility_setting: 'public',
      is_pinned: true,
      verification_status: 'verified'
    },
    {
      id: 'pin-2',
      field_type: 'location',
      display_label: 'Location',
      field_value: profileData.location || 'Abuja & Lagos, Nigeria',
      icon_identifier: 'MapPin',
      display_order: 2,
      visibility_setting: 'public',
      is_pinned: true,
      verification_status: 'unverified'
    },
    {
      id: 'pin-3',
      field_type: 'workplace',
      display_label: 'Organization',
      field_value: profileData.workplace || 'GraceLink Business Technologies Limited',
      icon_identifier: 'Briefcase',
      display_order: 3,
      visibility_setting: 'public',
      is_pinned: true,
      verification_status: 'verified'
    },
    {
      id: 'pin-4',
      field_type: 'username',
      display_label: 'Sovereign Handle',
      field_value: `@${profileData.username || 'redice200'}`,
      icon_identifier: 'AtSign',
      display_order: 4,
      visibility_setting: 'public',
      is_pinned: true,
      verification_status: 'verified'
    },
    {
      id: 'pin-5',
      field_type: 'website',
      display_label: 'Official Gateway',
      field_value: profileData.website || 'https://fingermobileprotocol.com',
      icon_identifier: 'Globe',
      display_order: 5,
      visibility_setting: 'public',
      is_pinned: true,
      verification_status: 'verified'
    }
  ]);

  // Inline Editing States
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<Record<string, any>>({});
  const [isEditingPinned, setIsEditingPinned] = useState(false);

  // Categories Definition (14 items as detailed in Section 5.1 & 5.2)
  const categoriesList: {
    key: AboutCategoryKey;
    label: string;
    icon: React.ElementType;
    group: string;
  }[] = [
    { key: 'intro', label: 'Intro', icon: Sparkles, group: 'Identity' },
    { key: 'category', label: 'Category', icon: Award, group: 'Identity' },
    { key: 'names', label: 'Names & Handles', icon: AtSign, group: 'Identity' },
    { key: 'personal_details', label: 'Personal Details', icon: Calendar, group: 'Personal' },
    { key: 'hobbies', label: 'Hobbies', icon: Heart, group: 'Personal' },
    { key: 'interests', label: 'Interests', icon: Compass, group: 'Personal' },
    { key: 'travel', label: 'Travel & Summits', icon: MapPin, group: 'Personal' },
    { key: 'work', label: 'Work & Enterprise', icon: Briefcase, group: 'Professional' },
    { key: 'education', label: 'Education & Honors', icon: GraduationCap, group: 'Professional' },
    { key: 'communities', label: 'Communities & Guilds', icon: Users, group: 'Social' },
    { key: 'links', label: 'Links & Endpoints', icon: Globe, group: 'Social' },
    { key: 'offers', label: 'Offers & Commerce', icon: Gift, group: 'Business' },
    { key: 'contact_info', label: 'Contact Info', icon: Mail, group: 'Communication' },
    { key: 'privacy_legal', label: 'Privacy & Governance', icon: ShieldCheck, group: 'Governance' }
  ];

  const handleStartEdit = (categoryKey: string, initialData: Record<string, any>) => {
    setEditingCategory(categoryKey);
    setEditingValues(initialData);
  };

  const handleSaveEdit = (categoryKey: string) => {
    if (onUpdateField) {
      Object.entries(editingValues).forEach(([k, v]) => {
        onUpdateField(k, v);
      });
    }
    setEditingCategory(null);
  };

  const handleTogglePin = (pinId: string) => {
    setPinnedDetails((prev) =>
      prev.map((item) => (item.id === pinId ? { ...item, is_pinned: !item.is_pinned } : item))
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-sm space-y-6">
      {/* 1. Header & Quick Pinned Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-200 gap-3">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-600" />
            <span>Sovereign Profile Management & About Enclave</span>
          </h3>
          <p className="text-xs font-medium text-slate-700">
            Categorized information architecture with granular privacy masks, verified merits, and pinned credentials.
          </p>
        </div>

        {isOwner && (
          <button
            type="button"
            onClick={() => setIsEditingPinned(!isEditingPinned)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isEditingPinned
                ? 'bg-orange-50 text-orange-950 border-orange-300 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
          >
            <Pin className="w-3.5 h-3.5 text-orange-600" />
            <span>{isEditingPinned ? 'Done Pinning' : 'Edit Pinned Details'}</span>
          </button>
        )}
      </div>

      {/* 2. Pinned Details Block (Section 6.2 & 6.3) */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-300 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
            <Pin className="w-3.5 h-3.5 text-orange-600" />
            <span>Featured Pinned Details</span>
          </span>
          <span className="text-[11px] font-bold text-slate-600">
            {pinnedDetails.filter((p) => p.is_pinned).length} items featured
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {pinnedDetails.map((detail) => {
            if (!detail.is_pinned && !isEditingPinned) return null;

            return (
              <div
                key={detail.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                  detail.is_pinned
                    ? 'bg-white border-slate-300 shadow-xs'
                    : 'bg-slate-100 border-dashed border-slate-300 opacity-60'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="p-2 rounded-lg bg-slate-100 text-slate-800 shrink-0">
                    {detail.field_type === 'category' && <Award className="w-4 h-4 text-amber-600" />}
                    {detail.field_type === 'location' && <MapPin className="w-4 h-4 text-emerald-600" />}
                    {detail.field_type === 'workplace' && <Briefcase className="w-4 h-4 text-sky-600" />}
                    {detail.field_type === 'username' && <AtSign className="w-4 h-4 text-indigo-600" />}
                    {detail.field_type === 'website' && <Globe className="w-4 h-4 text-purple-600" />}
                  </div>
                  <div className="truncate">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      {detail.display_label}
                    </span>
                    <span className="text-xs font-black text-slate-900 truncate block">
                      {detail.field_value}
                    </span>
                  </div>
                </div>

                {isEditingPinned && (
                  <button
                    type="button"
                    onClick={() => handleTogglePin(detail.id)}
                    className={`p-1 rounded-md text-xs font-bold shrink-0 ${
                      detail.is_pinned ? 'text-orange-600 hover:text-red-700' : 'text-slate-700 hover:text-slate-700'
                    }`}
                    title={detail.is_pinned ? 'Unpin this item' : 'Pin this item'}
                  >
                    <Pin className={`w-3.5 h-3.5 ${detail.is_pinned ? 'fill-orange-600' : ''}`} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Two-Column Layout (Sidebar Menu & Content Panel) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pt-2">

        {/* Left Column: 14 Categories Vertical Navigation (4 cols) */}
        <aside className="md:col-span-4 rounded-2xl border border-slate-300 bg-slate-50 p-2 space-y-1">
          <div className="px-3 py-2 text-[11px] font-black uppercase text-slate-500 tracking-wider">
            About Categories
          </div>

          <div className="space-y-0.5">
            {categoriesList.map((cat) => {
              const IconComp = cat.icon;
              const isSelected = activeCategory === cat.key;

              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-800 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                    <span>{cat.label}</span>
                  </div>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Column: Selected Category Content Panel (8 cols) */}
        <main className="md:col-span-8 bg-slate-50/50 rounded-2xl border border-slate-300 p-6 space-y-5">

          {/* ======================================================== */}
          {/* CATEGORY 1: INTRO                                        */}
          {/* ======================================================== */}
          {activeCategory === 'intro' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <h4 className="text-base font-black text-slate-900">Intro & Manifesto</h4>
                </div>
                {isOwner && editingCategory !== 'intro' && (
                  <button
                    type="button"
                    onClick={() => handleStartEdit('intro', { bio: profileData.bio })}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-200 transition-colors flex items-center gap-1 text-xs font-bold"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-700" />
                    <span>Edit Bio</span>
                  </button>
                )}
              </div>

              {editingCategory === 'intro' ? (
                <div className="space-y-3">
                  <textarea
                    rows={4}
                    value={editingValues.bio || ''}
                    onChange={(e) => setEditingValues({ ...editingValues, bio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium text-xs focus:ring-2 focus:ring-slate-900 focus:outline-hidden font-bold placeholder:text-slate-400"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveEdit('intro')}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Bio</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                    {profileData.bio}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span>Audience: <strong>Public to All Network Participants</strong></span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* CATEGORY 2: CATEGORY                                     */}
          {/* ======================================================== */}
          {activeCategory === 'category' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h4 className="text-base font-black text-slate-900">Profile & Creator Category</h4>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Primary Classification</span>
                  <div className="text-sm font-black text-slate-900 mt-0.5">
                    {profileData.category || 'Creator Level 5 / Sovereign Architect'}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Recognized Subcategories</span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {['Decentralized Social Architectures', 'Zero-Knowledge Cryptography', 'Lossless Audio Stems'].map((sub, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CATEGORY 3: NAMES                                        */}
          {/* ======================================================== */}
          {activeCategory === 'names' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <AtSign className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-base font-black text-slate-900">Names & Protocol Aliases</h4>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="font-bold text-slate-600">Display Name:</span>
                  <span className="font-black text-slate-900">{profileData.name}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="font-bold text-slate-600">Sovereign Handle:</span>
                  <span className="font-mono font-black text-slate-900">@{profileData.username}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="font-bold text-slate-600">Charter Alias:</span>
                  <span className="font-mono font-black text-emerald-800">redice200</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CATEGORY 4: PERSONAL DETAILS                             */}
          {/* ======================================================== */}
          {activeCategory === 'personal_details' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-base font-black text-slate-900">Personal Details & Identity</h4>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-bold text-slate-600">Location:</span>
                  <span className="font-black text-slate-900">{profileData.location}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-bold text-slate-600">Birthday:</span>
                  {isOwner || isFriend ? (
                    <span className="font-black text-slate-900">{profileData.birthday || '18 June 1992'}</span>
                  ) : (
                    <span className="text-slate-700 italic flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Hidden from strangers
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-bold text-slate-600">Pronouns:</span>
                  <span className="font-black text-slate-900">{profileData.pronouns || 'he / him'}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="font-bold text-slate-600">Languages:</span>
                  <span className="font-black text-slate-900">English, Igbo, French (Technical)</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CATEGORY 5: WORK & ENTERPRISE                            */}
          {/* ======================================================== */}
          {activeCategory === 'work' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-sky-600" />
                  <h4 className="text-base font-black text-slate-900">Work & Enterprise History</h4>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="text-sm font-black text-slate-900">
                      Chief Technology Officer & Lead Architect
                    </h5>
                    <p className="text-xs font-bold text-emerald-800">
                      {profileData.workplace || 'GraceLink Business Technologies Limited'}
                    </p>
                    <span className="text-[11px] font-medium text-slate-600">2020 - Present • Full-time</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-950 border border-emerald-400">
                    Active
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-700 pt-2 border-t border-slate-100">
                  Architecting decentralized social protocols, high-frequency media streaming pipelines, and sovereign biometric verification modules.
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CATEGORY 6: EDUCATION                                    */}
          {/* ======================================================== */}
          {activeCategory === 'education' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-base font-black text-slate-900">Education & Technical Merits</h4>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <h5 className="text-sm font-black text-slate-900">
                    B.Eng Electronic Engineering & Decentralized Systems
                  </h5>
                  <p className="text-xs font-bold text-slate-700">University of Nigeria, Nsukka</p>
                  <span className="text-[11px] text-slate-500 font-medium">Graduated with High Honors</span>
                </div>
                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Sovereign Protocol Credentials:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-900 border border-sky-300 text-xs font-bold">
                      STERCS™ Certified Security Node #001
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-300 text-xs font-bold">
                      Post-Quantum Encryption Fellow
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CATEGORY 7: COMMUNITIES                                  */}
          {/* ======================================================== */}
          {activeCategory === 'communities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-600" />
                  <h4 className="text-base font-black text-slate-900">Communities & Guild Affiliations</h4>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { name: 'Sovereign Developers Enclave', role: 'Founder & Admin', count: 4200 },
                  { name: 'Beatwave SoundMasters Guild', role: 'Moderator', count: 8900 },
                  { name: 'Lagos Web3 Architecture Council', role: 'Honorary Fellow', count: 1100 }
                ].map((com, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-black text-slate-900">{com.name}</h5>
                      <span className="text-[11px] font-bold text-slate-600">{com.count.toLocaleString()} members</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300">
                      {com.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CATEGORY 8: LINKS                                        */}
          {/* ======================================================== */}
          {activeCategory === 'links' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-600" />
                  <h4 className="text-base font-black text-slate-900">Websites & Protocol Endpoints</h4>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs font-bold">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Official Website:</span>
                  <a href={profileData.website} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline flex items-center gap-1">
                    <span>{profileData.website}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">Decentralized Git:</span>
                  <a href="https://github.com/fingermobile-protocol" target="_blank" rel="noreferrer" className="text-sky-700 hover:underline flex items-center gap-1">
                    <span>github.com/fingermobile-protocol</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CATEGORY 9: OFFERS                                       */}
          {/* ======================================================== */}
          {activeCategory === 'offers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-600" />
                  <h4 className="text-base font-black text-slate-900">Offers & Storefront Services</h4>
                </div>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-black text-slate-900">STERCS™ Zero-Knowledge Security Audit</h5>
                    <p className="text-[11px] font-medium text-slate-600">Cryptographic isolation review for smart contracts and media vaults.</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-950 border border-amber-300 font-mono font-black text-xs">
                    2,500 FIC
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-black text-slate-900">Lossless Multi-Track Stem Mastering</h5>
                    <p className="text-[11px] font-medium text-slate-600">High-resolution 96kHz audio production on BeatwaveNG.</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-950 border border-amber-300 font-mono font-black text-xs">
                    800 FIC
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CATEGORY 10: HOBBIES & INTERESTS                         */}
          {/* ======================================================== */}
          {(activeCategory === 'hobbies' || activeCategory === 'interests') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <h4 className="text-base font-black text-slate-900">
                    {activeCategory === 'hobbies' ? 'Hobbies & Recreation' : 'Research Topics & Interests'}
                  </h4>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <div className="flex flex-wrap gap-2">
                  {(activeCategory === 'hobbies'
                    ? ['Afrofusion Sound Synthesis', 'Chess & Grandmaster Puzzles', 'Cryptographic Cipher Solvers', 'Deep Tech Mentorship']
                    : ['Decentralized Protocols', 'Biometric PIN Vaults', 'Offline Mesh Communications', 'WCAG AAA Interface Design']
                  ).map((item, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-900 border border-slate-300 text-xs font-bold">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CATEGORY 11: TRAVEL                                      */}
          {/* ======================================================== */}
          {activeCategory === 'travel' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-base font-black text-slate-900">Travel & Global Summits</h4>
                </div>
              </div>
              <div className="space-y-2.5">
                {['Devcon Bangkok 2024', 'ETHLagos 2025', 'Africa Internet Summit 2026', 'Singapore Web3 Expo'].map((dest, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{dest}</span>
                    <span className="text-[11px] font-bold text-slate-500">Verified Delegate</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CATEGORY 12: CONTACT INFO                                */}
          {/* ======================================================== */}
          {activeCategory === 'contact_info' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-sky-600" />
                  <h4 className="text-base font-black text-slate-900">Contact & Communication</h4>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="font-bold text-slate-600">Contact Email:</span>
                  {isOwner || isFriend ? (
                    <span className="font-mono font-black text-slate-900">{profileData.contact_email || 'founder@fingermobileprotocol.com'}</span>
                  ) : (
                    <span className="text-slate-700 italic flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Restricted to Verified Friends
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="font-bold text-slate-600">Sovereign Mesh Address:</span>
                  <span className="font-mono text-emerald-800 font-black">finger://node.fingermobileprotocol.com/{profileData.username}</span>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CATEGORY 13: PRIVACY & LEGAL                             */}
          {/* ======================================================== */}
          {activeCategory === 'privacy_legal' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-base font-black text-slate-900">Privacy, Governance & Rights</h4>
                </div>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 text-xs font-medium text-slate-700 leading-relaxed">
                <p>
                  FingerMobile Protocol™ enforces full sovereign data portability. Members retain complete unilateral rights to download their profile archive, revoke PIN Handshake permissions, or initiate immediate cryptographic account erasure (&quot;Right to be Forgotten&quot;).
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-slate-800">
                  <span>Enclave Grade:</span>
                  <span className="text-emerald-800">STERCS™ Sovereign Hardware Node</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default StructuredAboutSection;
