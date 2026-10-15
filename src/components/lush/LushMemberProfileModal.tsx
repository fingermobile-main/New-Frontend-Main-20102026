/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import {
  XMarkIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  GiftIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  MapPinIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { VerificationBadge } from '../verification/VerificationBadge';
import { ActiveMatchItem } from './LushDiscoverySidebar';

export interface LushMemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: ActiveMatchItem | null;
  onRevokePin: (_memberId: string) => void;
  onOpenChat: (_memberId: string, _memberName?: string) => void;
  onStartVideoCall?: (_memberId: string) => void;
  onSendGift?: (_memberId: string) => void;
}

export const LushMemberProfileModal: React.FC<LushMemberProfileModalProps> = ({
  isOpen,
  onClose,
  member,
  onRevokePin,
  onOpenChat,
  onStartVideoCall,
  onSendGift,
}) => {
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [revoking, setRevoking] = useState(false);

  if (!isOpen || !member) return null;

  const handleConfirmRevoke = () => {
    setRevoking(true);
    setTimeout(() => {
      onRevokePin(member.id);
      setRevoking(false);
      setShowRevokeConfirm(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Cover Banner */}
        <div className="h-32 bg-gradient-to-r from-emerald-700 via-teal-800 to-[#DC582A] relative">
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-black/50 text-white text-[11px] font-bold backdrop-blur-xs border border-white/20 flex items-center gap-1">
              <SparklesIcon className="w-3.5 h-3.5 text-amber-300" />
              {member.compatibilityScore}% Compatibility
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Member Details */}
        <div className="px-6 pb-6 pt-0 -mt-12 overflow-y-auto space-y-5">
          <div className="flex justify-between items-end">
            <div className="relative">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
              />
              {member.isOnline && (
                <span
                  className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"
                  title="Online Now"
                />
              )}
            </div>

            {/* Sovereign PIN Badge */}
            <div className="px-3 py-1 bg-emerald-50 border border-emerald-200/90 rounded-full text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
              <span>6-Digit PIN Exchanged</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900">{member.name}</h2>
              <VerificationBadge level={5} size="medium" />
            </div>
            <p className="text-xs text-gray-500 font-mono">@{member.name.toLowerCase().replace(/\s+/g, '_')}</p>
            <p className="text-xs text-emerald-800 font-semibold mt-1 flex items-center gap-1">
              <MapPinIcon className="w-3.5 h-3.5 text-emerald-600" />
              Victoria Island, Lagos & Virtual
            </p>
          </div>

          {/* Bio / Values Statement */}
          <div className="bg-[#F5F9F6] p-4 rounded-2xl border border-emerald-100/90 space-y-2">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
              <HeartIcon className="w-3.5 h-3.5 text-[#DC582A]" />
              Bio & Lifestyle
            </h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Curator and music enthusiast passionate about high-value culture, gallery exhibitions, and meaningful authentic interactions.
            </p>
          </div>

          {/* Compatibility Highlights */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-300">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Matching Intent</span>
              <p className="font-bold text-emerald-800 mt-0.5">Thoughtful Interactions</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-300">
              <span className="text-[10px] text-gray-400 font-bold uppercase">Lapidaire Score</span>
              <p className="font-bold text-teal-800 mt-0.5">28 / 30 Core Values Aligned</p>
            </div>
          </div>

          {/* Quick Communication Actions */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <button
              onClick={() => {
                onOpenChat(member.id, member.name);
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => {
                onStartVideoCall?.(member.id);
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <VideoCameraIcon className="w-4 h-4" />
              <span>Call</span>
            </button>

            <button
              onClick={() => {
                onSendGift?.(member.id);
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-[#DC582A] hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
            >
              <GiftIcon className="w-4 h-4" />
              <span>Send Gift</span>
            </button>
          </div>

          {/* PIN Revocation & Connection Closing Section */}
          <div className="pt-3 border-t border-gray-200 space-y-3">
            {!showRevokeConfirm ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                <div>
                  <h4 className="font-bold text-amber-900">Change of Mind / Mismatch?</h4>
                  <p className="text-[11px] text-amber-700 mt-0.5">
                    You can revoke your 6-Digit PIN to close this connection at any time.
                  </p>
                </div>
                <button
                  onClick={() => setShowRevokeConfirm(true)}
                  className="px-3 py-1.5 rounded-lg border border-red-300 bg-white hover:bg-red-50 text-red-700 font-bold text-xs transition shrink-0 ml-2 shadow-2xs"
                >
                  Revoke PIN
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs space-y-3 animate-in fade-in">
                <div className="flex items-start gap-2 text-red-900">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Revoke PIN & Close Connection</h4>
                    <p className="text-[11px] text-red-700 mt-1">
                      Are you sure? Once revoked, your mutual connection will close immediately, profile access will be locked, and messaging will cease until a new 6-digit PIN exchange occurs.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => setShowRevokeConfirm(false)}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmRevoke}
                    disabled={revoking}
                    className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition disabled:opacity-40"
                  >
                    {revoking ? 'Revoking...' : 'Yes, Revoke PIN & Close'}
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

export default LushMemberProfileModal;
