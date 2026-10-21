import React, { useState } from 'react';
import { AutoReplySettings, QuickReplyItem } from './types';
import {
  Bot,
  Sparkles,
  Clock,
  Zap,
  Calendar,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  Link as LinkIcon,
  PhoneCall,
  Mail,
  AlertCircle,
  HelpCircle,
  FileText,
  Sliders,
  Send,
  Check
} from 'lucide-react';

interface GemAutoReplyManagerProps {
  settings: AutoReplySettings;
  onUpdateSettings: (newSettings: AutoReplySettings) => void;
  onShowToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

type ActiveSection = 'greeting' | 'away' | 'quick' | 'event' | 'simulator';

export const GemAutoReplyManager: React.FC<GemAutoReplyManagerProps> = ({
  settings,
  onUpdateSettings,
  onShowToast
}) => {
  const [activeSection, setActiveSection] = useState<ActiveSection>('event');
  const [currentSettings, setCurrentSettings] = useState<AutoReplySettings>(settings);

  // New Quick Reply Form state
  const [newShortcut, setNewShortcut] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<QuickReplyItem['category']>('pricing');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [isAddingQuickReply, setIsAddingQuickReply] = useState(false);

  // Simulator state
  const [simulatedIncomingMessage, setSimulatedIncomingMessage] = useState('Hi! We want to book your agency for our upcoming event in Lagos.');
  const [simulatedReplyOutput, setSimulatedReplyOutput] = useState<{
    type: string;
    text: string;
    subject?: string;
  } | null>(null);

  const handleSave = () => {
    onUpdateSettings(currentSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('fingermobile_autoreply_settings', JSON.stringify(currentSettings));
    }
    onShowToast('Sovereign Auto-Reply engine configurations saved successfully! 🤖', 'success');
  };

  const handleAddQuickReply = () => {
    if (!newShortcut.trim() || !newContent.trim()) {
      onShowToast('Please provide a shortcut (e.g. /rates) and message content.', 'error');
      return;
    }
    if (currentSettings.quickReplies.length >= 50) {
      onShowToast('Maximum of 50 quick replies allowed.', 'error');
      return;
    }

    const formattedShortcut = newShortcut.startsWith('/') ? newShortcut.trim() : `/${newShortcut.trim()}`;
    const newItem: QuickReplyItem = {
      id: `qr-${Date.now()}`,
      shortcut: formattedShortcut,
      title: newTitle.trim() || formattedShortcut,
      content: newContent.trim(),
      category: newCategory,
      mediaUrl: newMediaUrl.trim() || undefined,
      usageCount: 0
    };

    const updated = {
      ...currentSettings,
      quickReplies: [...currentSettings.quickReplies, newItem]
    };
    setCurrentSettings(updated);
    onUpdateSettings(updated);
    setNewShortcut('');
    setNewTitle('');
    setNewContent('');
    setNewMediaUrl('');
    setIsAddingQuickReply(false);
    onShowToast(`Quick Reply shortcut ${formattedShortcut} added (${updated.quickReplies.length}/50 allowed).`, 'success');
  };

  const handleDeleteQuickReply = (id: string) => {
    const updated = {
      ...currentSettings,
      quickReplies: currentSettings.quickReplies.filter((q) => q.id !== id)
    };
    setCurrentSettings(updated);
    onUpdateSettings(updated);
    onShowToast('Quick reply shortcut removed.', 'info');
  };

  const runSimulation = () => {
    // If incoming message contains 'event' or 'book'
    const lower = simulatedIncomingMessage.toLowerCase();
    if (lower.includes('event') || lower.includes('inquiry')) {
      setSimulatedReplyOutput({
        type: 'Event Management Auto-Reply (General Inquiry)',
        subject: currentSettings.eventManagement.generalInquirySubject.replace(/\[Event Agency Name\]/g, currentSettings.eventManagement.agencyName),
        text: currentSettings.eventManagement.generalInquiryText
          .replace(/\[First Name\]/g, 'Valued Client')
          .replace(/\[Event Agency Name\]/g, currentSettings.eventManagement.agencyName)
          .replace(/\[Link to Portfolio\/Services\]/g, currentSettings.eventManagement.portfolioUrl)
          .replace(/\[Link to FAQ \/ Pricing Guide\]/g, currentSettings.eventManagement.faqPricingUrl)
      });
    } else if (lower.includes('price') || lower.includes('cost') || lower.includes('rates')) {
      const qr = currentSettings.quickReplies.find((q) => q.shortcut === '/pricing') || currentSettings.quickReplies[0];
      setSimulatedReplyOutput({
        type: `Quick Reply Shortcut (${qr.shortcut})`,
        text: qr.content
      });
    } else if (lower.includes('hours') || lower.includes('open') || lower.includes('where')) {
      const qr = currentSettings.quickReplies.find((q) => q.shortcut === '/hours') || currentSettings.quickReplies[0];
      setSimulatedReplyOutput({
        type: `Quick Reply Shortcut (${qr.shortcut})`,
        text: qr.content
      });
    } else {
      setSimulatedReplyOutput({
        type: 'Greeting Message (First-Time Contact)',
        text: currentSettings.greeting.standardText
          .replace(/\[Business Name\]/g, currentSettings.eventManagement.agencyName)
          .replace(/\[Link\]/g, currentSettings.eventManagement.portfolioUrl)
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-900/30 shrink-0">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-300 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Admin Power Tools • Automated Response System
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Sovereign Auto-Replies Engine
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Immediately acknowledge customer inquiries, set response expectations, and guide visitors on what to do next across peer-to-peer broadcasts and digital living rooms.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Configurations
          </button>
        </div>

        {/* Best Practices Banner */}
        <div className="mt-5 pt-5 border-t border-emerald-500/20 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Be Clear & Concise
            </span>
            <p className="text-[11px] text-slate-300">
              Keep the text short so customers read it fast without cognitive strain.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5" /> Set Real Expectations
            </span>
            <p className="text-[11px] text-slate-300">
              State clearly when a human will actually reply (e.g. 24h / 9 AM tomorrow).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 mb-1">
              <LinkIcon className="w-3.5 h-3.5" /> Provide a Next Step
            </span>
            <p className="text-[11px] text-slate-300">
              Include direct links to your portfolio, catalog, pricing, or booking tool.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveSection('event')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSection === 'event'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-300" />
          Event Management Suite
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('greeting')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSection === 'greeting'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-300" />
          Greeting Messages (First Contact)
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('away')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSection === 'away'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-300" />
          Away & Holiday Messages
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('quick')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSection === 'quick'
              ? 'bg-sky-600 text-white shadow-md shadow-sky-900/40'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 text-sky-300" />
          Quick Replies ({currentSettings.quickReplies.length}/50 allowed)
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeSection === 'simulator'
              ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4 text-teal-300" />
          Auto-Reply Simulator
        </button>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: EVENT MANAGEMENT SUITE */}
      {/* ========================================================= */}
      {activeSection === 'event' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Auto-Reply Message for Event Management
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Instantly acknowledge inquiries, set a clear response time, share key details/links, and provide an emergency contact.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-semibold">Enabled</span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSettings({
                      ...currentSettings,
                      eventManagement: {
                        ...currentSettings.eventManagement,
                        enabled: !currentSettings.eventManagement.enabled
                      }
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                    currentSettings.eventManagement.enabled ? 'bg-emerald-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      currentSettings.eventManagement.enabled ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Global Event Agency Variables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Event Agency Name:
                </label>
                <input
                  type="text"
                  value={currentSettings.eventManagement.agencyName}
                  onChange={(e) =>
                    setCurrentSettings({
                      ...currentSettings,
                      eventManagement: {
                        ...currentSettings.eventManagement,
                        agencyName: e.target.value
                      }
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Emergency Contact & Phone Number:
                </label>
                <input
                  type="text"
                  value={currentSettings.eventManagement.emergencyPhone}
                  onChange={(e) =>
                    setCurrentSettings({
                      ...currentSettings,
                      eventManagement: {
                        ...currentSettings.eventManagement,
                        emergencyPhone: e.target.value
                      }
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  Portfolio / Services Link:
                </label>
                <input
                  type="text"
                  value={currentSettings.eventManagement.portfolioUrl}
                  onChange={(e) =>
                    setCurrentSettings({
                      ...currentSettings,
                      eventManagement: {
                        ...currentSettings.eventManagement,
                        portfolioUrl: e.target.value
                      }
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  FAQ / Pricing Guide Link:
                </label>
                <input
                  type="text"
                  value={currentSettings.eventManagement.faqPricingUrl}
                  onChange={(e) =>
                    setCurrentSettings({
                      ...currentSettings,
                      eventManagement: {
                        ...currentSettings.eventManagement,
                        faqPricingUrl: e.target.value
                      }
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            {/* Key Elements Checklist Validator */}
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 block">
                Key Elements Verification Checklist:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Immediate confirmation:</strong> Let the client know their message did not go into a void.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Timeline expectation:</strong> State the exact window when a real human will reply (e.g. 24 hours / 1 business day).</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Self-service links:</strong> Link to brochures, pricing, or calendar booking tools (Calendly).</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Escalation path:</strong> Provide phone number strictly for urgent or day-of emergencies.</span>
                </div>
              </div>
            </div>

            {/* Template 1: General Inquiry Auto-Reply */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  1. General Inquiry Auto-Reply (Email or Form)
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40">
                  Standard Template
                </span>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Subject:</label>
                <input
                  type="text"
                  value={currentSettings.eventManagement.generalInquirySubject}
                  onChange={(e) =>
                    setCurrentSettings({
                      ...currentSettings,
                      eventManagement: {
                        ...currentSettings.eventManagement,
                        generalInquirySubject: e.target.value
                      }
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Body:</label>
                <textarea
                  rows={5}
                  value={currentSettings.eventManagement.generalInquiryText}
                  onChange={(e) =>
                    setCurrentSettings({
                      ...currentSettings,
                      eventManagement: {
                        ...currentSettings.eventManagement,
                        generalInquiryText: e.target.value
                      }
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 font-mono leading-relaxed"
                />
              </div>
            </div>

            {/* Template 2: After-Hours / Busy Season Auto-Reply */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  2. After-Hours / Busy Season Auto-Reply (Text or Chat)
                </span>
                <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/40">
                  Chat & Text Channels
                </span>
              </div>
              <textarea
                rows={3}
                value={currentSettings.eventManagement.afterHoursBusyText}
                onChange={(e) =>
                  setCurrentSettings({
                    ...currentSettings,
                    eventManagement: {
                      ...currentSettings.eventManagement,
                      afterHoursBusyText: e.target.value
                    }
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 font-mono leading-relaxed"
              />
            </div>

            {/* Template 3: On-Site / Event Day Auto-Reply */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-rose-400" />
                  3. On-Site / Event Day Auto-Reply
                </span>
                <span className="text-[10px] text-rose-400 font-semibold px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500/40">
                  Execution Day Escalation
                </span>
              </div>
              <textarea
                rows={3}
                value={currentSettings.eventManagement.onSiteEventDayText}
                onChange={(e) =>
                  setCurrentSettings({
                    ...currentSettings,
                    eventManagement: {
                      ...currentSettings.eventManagement,
                      onSiteEventDayText: e.target.value
                    }
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 font-mono leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: GREETING MESSAGES */}
      {/* ========================================================= */}
      {activeSection === 'greeting' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Greeting Messages (First-Time Contact)
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Automatically sent to customers when they message you for the first time, or after 14 days of no activity.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-semibold">Enabled</span>
              <button
                type="button"
                onClick={() =>
                  setCurrentSettings({
                    ...currentSettings,
                    greeting: {
                      ...currentSettings.greeting,
                      enabled: !currentSettings.greeting.enabled
                    }
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  currentSettings.greeting.enabled ? 'bg-purple-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    currentSettings.greeting.enabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200">
            <strong>Trigger Rule:</strong> Triggered on 1st incoming message or when more than <strong>{currentSettings.greeting.inactivityDays} days</strong> have elapsed with no communication.
          </div>

          {/* Standard Welcome Preset */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input
                  type="radio"
                  name="greeting_preset"
                  checked={currentSettings.greeting.selectedPreset === 'standard'}
                  onChange={() =>
                    setCurrentSettings({
                      ...currentSettings,
                      greeting: {
                        ...currentSettings.greeting,
                        selectedPreset: 'standard'
                      }
                    })
                  }
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span>Preset A: Standard Welcome</span>
              </label>
              <span className="text-[10px] text-purple-400 font-semibold">Recommended</span>
            </div>
            <textarea
              rows={3}
              value={currentSettings.greeting.standardText}
              onChange={(e) =>
                setCurrentSettings({
                  ...currentSettings,
                  greeting: {
                    ...currentSettings.greeting,
                    standardText: e.target.value
                  }
                })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 font-mono"
            />
          </div>

          {/* Service/Booking Focus Preset */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer">
                <input
                  type="radio"
                  name="greeting_preset"
                  checked={currentSettings.greeting.selectedPreset === 'booking'}
                  onChange={() =>
                    setCurrentSettings({
                      ...currentSettings,
                      greeting: {
                        ...currentSettings.greeting,
                        selectedPreset: 'booking'
                      }
                    })
                  }
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span>Preset B: Service / Booking Focus</span>
              </label>
            </div>
            <textarea
              rows={3}
              value={currentSettings.greeting.bookingText}
              onChange={(e) =>
                setCurrentSettings({
                  ...currentSettings,
                  greeting: {
                    ...currentSettings.greeting,
                    bookingText: e.target.value
                  }
                })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 font-mono"
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 3: AWAY MESSAGES */}
      {/* ========================================================= */}
      {activeSection === 'away' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Away Messages (After-Hours or Weekends)
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Automatically sent when you are busy, offline, or outside your set business hours.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-semibold">Enabled</span>
              <button
                type="button"
                onClick={() =>
                  setCurrentSettings({
                    ...currentSettings,
                    away: {
                      ...currentSettings.away,
                      enabled: !currentSettings.away.enabled
                    }
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  currentSettings.away.enabled ? 'bg-amber-600' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    currentSettings.away.enabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Working Hours Window:
              </label>
              <input
                type="text"
                value={currentSettings.away.workingHours}
                onChange={(e) =>
                  setCurrentSettings({
                    ...currentSettings,
                    away: {
                      ...currentSettings.away,
                      workingHours: e.target.value
                    }
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Days Active:
              </label>
              <input
                type="text"
                value={currentSettings.away.daysActive}
                onChange={(e) =>
                  setCurrentSettings({
                    ...currentSettings,
                    away: {
                      ...currentSettings.away,
                      daysActive: e.target.value
                    }
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>
          </div>

          {/* After-Hours Preset */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              1. After-Hours Template:
            </span>
            <textarea
              rows={3}
              value={currentSettings.away.afterHoursText}
              onChange={(e) =>
                setCurrentSettings({
                  ...currentSettings,
                  away: {
                    ...currentSettings.away,
                    afterHoursText: e.target.value
                  }
                })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 font-mono leading-relaxed"
            />
          </div>

          {/* Holiday / Out-of-Office Preset */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              2. Holiday / Out-of-Office Template:
            </span>
            <textarea
              rows={3}
              value={currentSettings.away.holidayText}
              onChange={(e) =>
                setCurrentSettings({
                  ...currentSettings,
                  away: {
                    ...currentSettings.away,
                    holidayText: e.target.value
                  }
                })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 font-mono leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 4: QUICK REPLIES / INSTANT REPLIES */}
      {/* ========================================================= */}
      {activeSection === 'quick' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-sky-400" />
                Quick Replies & Instant Responses
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Pre-saved keyboard shortcuts for answering common questions with text, images, or videos ({currentSettings.quickReplies.length}/50 allowed).
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingQuickReply(!isAddingQuickReply)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingQuickReply ? 'Close Form' : 'Add Quick Reply'}</span>
            </button>
          </div>

          {/* Add New Quick Reply Form */}
          {isAddingQuickReply && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-sky-500/40 space-y-3 animate-fade-in">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Plus className="w-3.5 h-3.5 text-sky-400" />
                New Pre-Saved Keyboard Shortcut
              </h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Shortcut Key (e.g. /rates, /hours):
                  </label>
                  <input
                    type="text"
                    placeholder="/shortcut"
                    value={newShortcut}
                    onChange={(e) => setNewShortcut(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Title / Topic:
                  </label>
                  <input
                    type="text"
                    placeholder="Pricing / Menu Inquiry"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Response Content (Short, Concise with Links):
                </label>
                <textarea
                  rows={3}
                  placeholder="Thanks for asking about our rates! You can view our full price list right here: [Link]"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Optional Media Attachment URL (Image or Video):
                </label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingQuickReply(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddQuickReply}
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer"
                >
                  Save Shortcut
                </button>
              </div>
            </div>
          )}

          {/* Quick Replies List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentSettings.quickReplies.map((qr) => (
              <div
                key={qr.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/40 transition flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-sky-950 text-sky-300 border border-sky-500/40">
                      {qr.shortcut}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuickReply(qr.id)}
                      className="text-slate-300 hover:text-red-400 p-1 transition cursor-pointer"
                      title="Delete shortcut"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h5 className="font-bold text-sm text-white">{qr.title}</h5>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{qr.content}</p>
                </div>

                {qr.mediaUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-800 h-24">
                    <img src={qr.mediaUrl} alt={qr.title} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-300 font-semibold">
                  <span className="capitalize">Category: {qr.category}</span>
                  <span>Used {qr.usageCount} times</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 5: AUTO-REPLY SIMULATOR */}
      {/* ========================================================= */}
      {activeSection === 'simulator' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <div className="pb-3 border-b border-slate-800">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-teal-400" />
              Auto-Reply Execution Simulator
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              Simulate an incoming member broadcast reply or customer inquiry to test which automated response triggers.
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-200 block">
              Simulated Incoming Broadcast Message or Customer Inquiry:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={simulatedIncomingMessage}
                onChange={(e) => setSimulatedIncomingMessage(e.target.value)}
                placeholder="Type sample message, e.g. 'What are your event prices?' or 'When are you open?'"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={runSimulation}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Test Trigger</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
              <span className="font-semibold text-slate-300">Quick Test Prompts:</span>
              <button
                type="button"
                onClick={() => setSimulatedIncomingMessage('We would like to book your agency for a 2026 conference.')}
                className="text-teal-400 hover:underline cursor-pointer"
              >
                "Book event inquiry"
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSimulatedIncomingMessage('What are your rates and pricing?')}
                className="text-teal-400 hover:underline cursor-pointer"
              >
                "What are your rates?"
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSimulatedIncomingMessage('What hours are you open today?')}
                className="text-teal-400 hover:underline cursor-pointer"
              >
                "What hours are you open?"
              </button>
            </div>
          </div>

          {simulatedReplyOutput && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-teal-500/40 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Check className="w-4 h-4 text-teal-400" />
                  Triggered: {simulatedReplyOutput.type}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40">
                  Instant Response Simulated
                </span>
              </div>

              {simulatedReplyOutput.subject && (
                <div className="text-xs text-slate-300 font-semibold">
                  <strong>Subject:</strong> {simulatedReplyOutput.subject}
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 whitespace-pre-wrap leading-relaxed">
                {simulatedReplyOutput.text}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
