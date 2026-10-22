import React, { useState } from 'react';
import { AutoReplySettings, BroadcastPost, QuickReplyItem } from './types';
import {
  Bot,
  X,
  Send,
  CheckCircle2,
  Calendar,
  Clock,
  Zap,
  Sparkles,
  PhoneCall,
  Link as LinkIcon,
  HelpCircle,
  FileText
} from 'lucide-react';

interface GemAutoReplyModalProps {
  post: BroadcastPost | null;
  settings: AutoReplySettings;
  isOpen: boolean;
  onClose: () => void;
  onSendAutoReply: (postId: number | string, replyPayload: { type: string; subject?: string; text: string }) => void;
}

type AutoReplyCategory = 'greeting' | 'away' | 'quick' | 'event';

export const GemAutoReplyModal: React.FC<GemAutoReplyModalProps> = ({
  post,
  settings,
  isOpen,
  onClose,
  onSendAutoReply
}) => {
  const [activeCategory, setActiveCategory] = useState<AutoReplyCategory>('event');
  const [selectedSubOption, setSelectedSubOption] = useState<string>('general_inquiry');
  const [customizedText, setCustomizedText] = useState<string>('');
  const [subjectText, setSubjectText] = useState<string>('');
  const [isSending, setIsSending] = useState(false);

  // Variables for substitution
  const recipientName = post?.first_name || post?.username || 'Client';
  const businessName = settings.eventManagement.agencyName || 'FingerMobile Sovereign Guild';
  const phone = settings.eventManagement.emergencyPhone;
  const portfolioLink = settings.eventManagement.portfolioUrl;
  const faqLink = settings.eventManagement.faqPricingUrl;

  const getSubstitutedText = (rawText: string) => {
    return rawText
      .replace(/\[First Name\]/g, recipientName)
      .replace(/\[Business Name\]/g, businessName)
      .replace(/\[Event Agency Name\]/g, businessName)
      .replace(/\[Phone Number\]/g, phone)
      .replace(/\[Name\]/g, settings.eventManagement.emergencyContactName)
      .replace(/\[Link to Portfolio\/Services\]/g, portfolioLink)
      .replace(/\[Link to FAQ \/ Pricing Guide\]/g, faqLink)
      .replace(/\[Booking Link\]/g, settings.eventManagement.bookingCalendarUrl)
      .replace(/\[Email Address\]/g, settings.away.emergencyEmail)
      .replace(/\[X am\]/g, '9:00 AM')
      .replace(/\[X pm\]/g, '6:00 PM')
      .replace(/\[Monday–Saturday\]/g, 'Monday–Saturday')
      .replace(/\[Start Date\]/g, settings.away.holidayStartDate || 'Dec 24')
      .replace(/\[End Date\]/g, settings.away.holidayEndDate || 'Jan 2')
      .replace(/\[Date\]/g, 'Monday')
      .replace(/\[Address\]/g, 'Victoria Island Innovation District, Lagos')
      .replace(/\[Days\]/g, 'Mon–Sat')
      .replace(/\[Opening Time\]/g, '9:00 AM')
      .replace(/\[Closing Time\]/g, '7:00 PM')
      .replace(/\[Time, e\.g\., 9:00 AM tomorrow\]/g, '9:00 AM tomorrow')
      .replace(/\[Link\]/g, portfolioLink);
  };

  // Sync state whenever category or sub-option changes
  React.useEffect(() => {
    if (activeCategory === 'event') {
      if (selectedSubOption === 'general_inquiry') {
        setSubjectText(
          settings.eventManagement.generalInquirySubject.replace(/\[Event Agency Name\]/g, businessName)
        );
        setCustomizedText(getSubstitutedText(settings.eventManagement.generalInquiryText));
      } else if (selectedSubOption === 'after_hours_busy') {
        setSubjectText('Urgent Update: Off-site Broadcast Received');
        setCustomizedText(getSubstitutedText(settings.eventManagement.afterHoursBusyText));
      } else if (selectedSubOption === 'on_site_event') {
        setSubjectText('Event Execution In-Progress Auto-Reply');
        setCustomizedText(getSubstitutedText(settings.eventManagement.onSiteEventDayText));
      }
    } else if (activeCategory === 'greeting') {
      if (selectedSubOption === 'greeting_standard') {
        setSubjectText('Welcome to ' + businessName);
        setCustomizedText(getSubstitutedText(settings.greeting.standardText));
      } else {
        setSubjectText('Service & Booking Inquiry');
        setCustomizedText(getSubstitutedText(settings.greeting.bookingText));
      }
    } else if (activeCategory === 'away') {
      if (selectedSubOption === 'away_after_hours') {
        setSubjectText('After-Hours Auto-Response');
        setCustomizedText(getSubstitutedText(settings.away.afterHoursText));
      } else {
        setSubjectText('Holiday & Out-of-Office Notice');
        setCustomizedText(getSubstitutedText(settings.away.holidayText));
      }
    } else if (activeCategory === 'quick') {
      const found = settings.quickReplies.find((q) => q.id === selectedSubOption) || settings.quickReplies[0];
      if (found) {
        setSubjectText(`Quick Reply: ${found.title}`);
        setCustomizedText(getSubstitutedText(found.content));
      }
    }
  }, [activeCategory, selectedSubOption, post]);

  if (!isOpen || !post) return null;

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      onSendAutoReply(post.id, {
        type: `${activeCategory}:${selectedSubOption}`,
        subject: subjectText,
        text: customizedText
      });
      setIsSending(false);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-2xl text-white my-8 max-h-[90vh] flex flex-col justify-between overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-lg shadow-emerald-600/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <span>Sovereign Auto-Reply Engine</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                    Instant Dispatch
                  </span>
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  Trigger automated responses to broadcast by @{post.username || 'creator'}
                </p>
              </div>
            </div>
            <button type="button" aria-label="Close"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Incoming Broadcast Context Card */}
          <div className="my-4 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-purple-500/30">
              {post.username ? post.username[0].toUpperCase() : 'B'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-white">@{post.username || 'creator'}</span>
                <span className="text-[11px] text-purple-400 font-semibold">{post.channel_name}</span>
              </div>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                "{post.content_text}"
              </p>
            </div>
          </div>

          {/* Category Tabs: Greeting, Away, Quick Replies, Event Management */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                setActiveCategory('event');
                setSelectedSubOption('general_inquiry');
              }}
              className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                activeCategory === 'event'
                  ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md shadow-emerald-900/30 ring-1 ring-emerald-500/40'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold">Event Management</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveCategory('greeting');
                setSelectedSubOption('greeting_standard');
              }}
              className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                activeCategory === 'greeting'
                  ? 'bg-purple-950/70 border-purple-500 text-white shadow-md shadow-purple-900/30 ring-1 ring-purple-500/40'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold">Greeting Message</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveCategory('away');
                setSelectedSubOption('away_after_hours');
              }}
              className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                activeCategory === 'away'
                  ? 'bg-amber-950/70 border-amber-500 text-white shadow-md shadow-amber-900/30 ring-1 ring-amber-500/40'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold">Away Message</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveCategory('quick');
                setSelectedSubOption(settings.quickReplies[0]?.id || 'qr-1');
              }}
              className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                activeCategory === 'quick'
                  ? 'bg-sky-950/70 border-sky-500 text-white shadow-md shadow-sky-900/30 ring-1 ring-sky-500/40'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Zap className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold">Quick Replies</span>
            </button>
          </div>

          {/* Sub-Option Selector Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {activeCategory === 'event' && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedSubOption('general_inquiry')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedSubOption === 'general_inquiry'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  General Inquiry (Email / Form)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubOption('after_hours_busy')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedSubOption === 'after_hours_busy'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  After-Hours / Busy Season (Chat)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubOption('on_site_event')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedSubOption === 'on_site_event'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  On-Site / Event Day
                </button>
              </>
            )}

            {activeCategory === 'greeting' && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedSubOption('greeting_standard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedSubOption === 'greeting_standard'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Standard Welcome (First-Time / 14 Days)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubOption('greeting_booking')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedSubOption === 'greeting_booking'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Service / Booking Focus
                </button>
              </>
            )}

            {activeCategory === 'away' && (
              <>
                <button
                  type="button"
                  onClick={() => setSelectedSubOption('away_after_hours')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedSubOption === 'away_after_hours'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  After-Hours (Working Hours: {settings.away.workingHours})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubOption('away_holiday')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedSubOption === 'away_holiday'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Holiday / Out-of-Office
                </button>
              </>
            )}

            {activeCategory === 'quick' &&
              settings.quickReplies.map((qr) => (
                <button
                  key={qr.id}
                  type="button"
                  onClick={() => setSelectedSubOption(qr.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                    selectedSubOption === qr.id
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <span className="font-mono text-[11px] bg-slate-900/60 px-1 py-0.5 rounded text-sky-300">
                    {qr.shortcut}
                  </span>
                  <span>{qr.title}</span>
                </button>
              ))}
          </div>

          {/* Subject Line (if applicable) */}
          {subjectText && (
            <div className="mb-3">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Subject Line
              </label>
              <input
                type="text"
                value={subjectText}
                onChange={(e) => setSubjectText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>
          )}

          {/* Live Message Body Preview / Editor */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Auto-Reply Message Content</span>
              <span className="text-[11px] text-emerald-400 font-semibold lowercase">
                personalized for @{recipientName}
              </span>
            </label>
            <textarea
              rows={5}
              value={customizedText}
              onChange={(e) => setCustomizedText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 text-xs text-slate-100 placeholder:text-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed font-sans"
            />
          </div>

          {/* Key Elements Checklist Pill Indicators */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 mb-4 text-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-2">
              Auto-Reply Key Elements Standard:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Immediate Confirmation
              </span>
              <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Timeline Expectation
              </span>
              <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <LinkIcon className="w-3.5 h-3.5 text-emerald-400" />
                Self-Service Links
              </span>
              <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                Escalation Hotline
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending || !customizedText.trim()}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSending ? (
              <span className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Transmitting...</span>
              </span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Auto-Reply →</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
