import React, { useState } from 'react';
import type {
  ClientProfile,
  FingerLuxBooking,
  FingerLuxService,
  StaffMember
} from '../../types/fingerLuxScheduling';
import {
  CheckIcon
} from '../../icons';

/* eslint-disable no-unused-vars */
interface FingerLuxAIOpsProps {
  clients: ClientProfile[];
  bookings: FingerLuxBooking[];
  services: FingerLuxService[];
  staff: StaffMember[];
  formatPrice: (amountInFic: number) => string;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}
/* eslint-enable no-unused-vars */

export const FingerLuxAIOps: React.FC<FingerLuxAIOpsProps> = ({
  clients,
  bookings,
  services,
  staff,
  formatPrice,
  showToast
}) => {
  const [activeAITab, setActiveAITab] = useState<'concierge_chat' | 'reminders' | 'clients'>('concierge_chat');

  // AI Chat Messages State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string; actionCard?: any }>>([
    {
      sender: 'ai',
      text: 'Greetings. I am LuxAI, your 24/7 Sovereign Booking & Concierge Agent. I manage appointment bookings, check staff calendars, prevent double-bookings, and coordinate intake forms across Dubai, London, Lagos, and New York. How may I assist you today?',
      time: '10:00 AM'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Reminders Configuration State
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [selectedReminderPreview, setSelectedReminderPreview] = useState<'confirmation' | '24h' | '1h' | 'post'>('24h');

  // Client Details Modal
  const [inspectedClient, setInspectedClient] = useState<ClientProfile | null>(null);

  // Send AI Chat Message
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const userText = userInput;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [...prev, { sender: 'user', text: userText, time: nowTime }]);
    setUserInput('');
    setIsAiThinking(true);

    try {
      await new Promise((r) => setTimeout(r, 900));
      const lower = userText.toLowerCase();

      let reply = '';
      let card: any = null;

      if (lower.includes('elena') || lower.includes('consult')) {
        reply =
          'Dr. Elena Rostova is available tomorrow in Dubai at 11:00 AM and 15:00 PM for the Private Sovereign Concierge Consultation. A 15-minute preparation buffer is reserved. Would you like me to lock this slot?';
        card = {
          serviceName: 'Private Sovereign Concierge & Lifestyle Consultation',
          specialist: 'Dr. Elena Rostova',
          time: 'Tomorrow, 11:00 AM - 12:00 PM',
          price: '1,200 FIC ($1,200)'
        };
      } else if (lower.includes('horology') || lower.includes('marcus')) {
        reply =
          'Marcus Sterling has a slot available at the London Mayfair High Council Suite on Friday at 14:00 PM for the Haute Horology Vault Fitting. Clean room clearance is confirmed.';
        card = {
          serviceName: 'Haute Horology & Master Vault Fitting',
          specialist: 'Marcus Sterling',
          time: 'Friday, 14:00 PM - 15:30 PM',
          price: '2,500 FIC ($2,500)'
        };
      } else if (lower.includes('cancel') || lower.includes('policy')) {
        reply =
          'Per FingerLux policy rules: Free cancellation is guaranteed up to 24 hours prior. Cancellations within 24 hours incur a 50% late fee. No-shows incur 100% of the session rate, automatically billed to the card on file.';
      } else {
        reply = `I have cross-checked our live calendar across all 5 global locations, covering our ${services.length} active service offerings and ${staff.length} protocol specialists. We currently have ${bookings.length} confirmed appointments today, with zero schedule conflicts. I can help you set up automated WhatsApp reminders, check specialist availability, or generate a customized service setup.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actionCard: card
        }
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleDispatchTestReminder = (channel: string) => {
    showToast(`Test ${channel} notification dispatched to client! Delivered via FingerMobile Protocol Gateway.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Header */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'concierge_chat', label: '24/7 AI Booking Concierge', icon: '🤖' },
            { id: 'reminders', label: 'Automated Reminders (WhatsApp/SMS/Email)', icon: '💬' },
            { id: 'clients', label: 'Client VIP Directory & Intake Forms', icon: '👤' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveAITab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                activeAITab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-slate-900">Autonomous Operations 24/7</span>
        </div>
      </div>

      {/* --- SUB-TAB 1: 24/7 AI BOOKING CONCIERGE CHAT SIMULATOR --- */}
      {activeAITab === 'concierge_chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Window */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[600px] overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-indigo-950 font-black flex items-center justify-center text-xl shadow-xs">
                  🤖
                </div>
                <div>
                  <h3 className="text-sm font-black flex items-center gap-2">
                    LuxAI Protocol Concierge
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </h3>
                  <p className="text-[10px] text-indigo-200">
                    Automating bookings, intake verification & availability 24/7
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-indigo-200">
                AI Mode Active
              </span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/60">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-md p-4 rounded-3xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Action Suggestion Card if attached */}
                    {msg.actionCard && (
                      <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-indigo-950 space-y-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 block">
                          Suggested Appointment
                        </span>
                        <div className="font-bold text-xs">{msg.actionCard.serviceName}</div>
                        <div className="text-[11px] text-slate-700 font-semibold">
                          Specialist: {msg.actionCard.specialist} • {msg.actionCard.time}
                        </div>
                        <div className="flex justify-between items-center pt-1.5 border-t border-indigo-200">
                          <span className="font-black text-amber-800">{msg.actionCard.price}</span>
                          <button
                            type="button"
                            onClick={() => showToast('Appointment locked via LuxAI Concierge!', 'success')}
                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer hover:bg-indigo-700"
                          >
                            Confirm Booking
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-600 font-bold mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-xs text-slate-800 font-bold bg-white p-3 rounded-2xl max-w-xs border border-slate-200">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></div>
                  <span>LuxAI is verifying calendar availability...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask LuxAI (e.g. 'What slots are open for Elena?', 'Check cancellation policy')..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-xs"
              >
                Send
              </button>
            </div>
          </div>

          {/* Quick Prompts & AI Automation Capabilities */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Interactive Assistant Prompts
              </h3>
              <div className="space-y-2">
                {[
                  'What times does Dr. Elena have open tomorrow?',
                  'Book a 90-minute Tourbillon Fitting with Marcus',
                  'Explain cancellation and no-show fee rules',
                  'How many sessions are scheduled today?'
                ].map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setUserInput(prompt);
                    }}
                    className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/80 hover:text-indigo-950 border border-slate-200 text-xs font-bold text-slate-800 transition cursor-pointer"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-3xl p-5 border border-indigo-900 shadow-md space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 block">
                ✦ 24/7 Autopilot Capabilities
              </span>
              <ul className="space-y-2 text-xs text-indigo-200/90 font-medium">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Instant availability lookup across 5 locations
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Automated intake question follow-up
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Dynamic reschedule & cancellation fee charging
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span> Omnichannel dispatch via WhatsApp & SMS
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* --- SUB-TAB 2: AUTOMATED REMINDERS (WHATSAPP, SMS, EMAIL) --- */}
      {activeAITab === 'reminders' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Multi-Channel Reminders Settings */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900">Multi-Channel Reminder Dispatcher</h3>
              <p className="text-xs text-slate-700 font-medium">
                Send automated reminders via email, SMS or WhatsApp to keep clients up-to-date and eliminate no-shows.
              </p>
            </div>

            {/* Channels Toggles */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">WhatsApp Business API</div>
                    <div className="text-[10px] text-slate-700 font-semibold">98% Open Rate • Instant Template Delivery</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                  className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Direct SMS Shortcode</div>
                    <div className="text-[10px] text-slate-700 font-semibold">Global Carrier Delivery • 2-Way Confirmation</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={smsEnabled}
                  onChange={(e) => setSmsEnabled(e.target.checked)}
                  className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✉️</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Transactional Email Engine</div>
                    <div className="text-[10px] text-slate-700 font-semibold">Includes .ICS Calendar Invite & Map Pin</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Test Trigger Buttons */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 block">
                Instant Sandbox Dispatch
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleDispatchTestReminder('WhatsApp')}
                  className="py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-400 font-black rounded-xl text-[11px] transition cursor-pointer"
                >
                  Test WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => handleDispatchTestReminder('SMS')}
                  className="py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-400 font-black rounded-xl text-[11px] transition cursor-pointer"
                >
                  Test SMS
                </button>
                <button
                  type="button"
                  onClick={() => handleDispatchTestReminder('Email')}
                  className="py-2 bg-blue-50 hover:bg-blue-100 text-blue-950 border border-blue-400 font-black rounded-xl text-[11px] transition cursor-pointer"
                >
                  Test Email
                </button>
              </div>
            </div>
          </div>

          {/* Right 2 Cols: Live Message Preview */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-black text-slate-900">Trigger Sequence & Template Preview</h3>
              <div className="flex gap-1 bg-slate-100 border border-slate-200 p-1 rounded-xl text-xs">
                {[
                  { id: 'confirmation', label: 'Booking Confirmed' },
                  { id: '24h', label: '24h Reminder' },
                  { id: '1h', label: '1h Arrival' },
                  { id: 'post', label: 'Post-Session' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedReminderPreview(s.id as any)}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      selectedReminderPreview === s.id
                        ? 'bg-white text-indigo-950 shadow-xs border border-slate-200 font-black'
                        : 'text-slate-700 hover:text-slate-900 font-bold'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Render Box */}
            <div className="p-6 rounded-2xl bg-slate-900 text-white font-mono text-xs leading-relaxed space-y-4 border border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold pb-2 border-b border-slate-800">
                <span>CHANNEL: WHATSAPP ENCRYPTED / SMS DISPATCH</span>
                <span>STATUS: AUTOMATED SEQUENCE</span>
              </div>

              {selectedReminderPreview === 'confirmation' && (
                <div>
                  <p className="text-emerald-400 font-bold mb-2">✦ FINGERLUX RESERVATION CONFIRMED</p>
                  <p>Dear Sir Reginald Vance,</p>
                  <p className="mt-1">
                    Your appointment for "Private Sovereign Concierge & Lifestyle Consultation" is confirmed for tomorrow at 10:00 AM at Dubai Marina Sovereign Flagship.
                  </p>
                  <p className="mt-2 text-indigo-300">
                    Specialist: Dr. Elena Rostova • Suite: Penthouse Salon A • Code: FLX-8041
                  </p>
                  <p className="mt-2 text-slate-300">
                    Need to reschedule? Reply RESCHEDULE or manage directly at: fingerlux.protocol/manage/FLX-8041
                  </p>
                </div>
              )}

              {selectedReminderPreview === '24h' && (
                <div>
                  <p className="text-amber-400 font-bold mb-2">⏰ 24-HOUR APPOINTMENT REMINDER</p>
                  <p>Dear Countess Vivian Chen,</p>
                  <p className="mt-1">
                    This is an automated courtesy reminder for your Haute Horology & Master Vault Fitting tomorrow at 14:00 PM at London Mayfair Protocol Club.
                  </p>
                  <p className="mt-2 text-indigo-300">
                    White glove specialist: Marcus Sterling • Chauffeur drop-off: 34 Berkeley Square
                  </p>
                  <p className="mt-2 text-amber-300">
                    Notice: Free cancellation window closes in 2 hours. Reply CONFIRM to verify your arrival.
                  </p>
                </div>
              )}

              {selectedReminderPreview === '1h' && (
                <div>
                  <p className="text-blue-400 font-bold mb-2">🚘 1-HOUR ARRIVAL & ESCORT NOTICE</p>
                  <p>Your session begins in 60 minutes. Your Armored Mercedes-Maybach escort driver is stationed at the terminal.</p>
                  <p className="mt-1 text-indigo-300">Driver: Protocol Escort Unit 04 • Contact: +971 4 800 5899</p>
                  <p className="mt-2 text-slate-300">Penthouse airlock clearance verified. We look forward to receiving you.</p>
                </div>
              )}

              {selectedReminderPreview === 'post' && (
                <div>
                  <p className="text-purple-400 font-bold mb-2">✨ THANK YOU FOR VISITING FINGERLUX</p>
                  <p>We trust your experience with Dr. Elena Rostova was exceptional.</p>
                  <p className="mt-1 text-indigo-300">Your digital receipt and loyalty points credit (1,200 FIC Tier XP) have been applied.</p>
                  <p className="mt-2 text-slate-300">Rate your experience or rebook your next session: fingerlux.protocol/rebook</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- SUB-TAB 3: CLIENT VIP DIRECTORY & INTAKE FORMS --- */}
      {activeAITab === 'clients' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-black text-slate-900">
                Client Management & Member Profiles ({clients.length})
              </h3>
              <p className="text-xs text-slate-700 font-medium">
                Detailed member profiles, intake form history, notes and lifetime spending.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-300"
                    />
                    <div>
                      <h4 className="text-base font-black text-slate-900">{client.name}</h4>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-950 px-2 py-0.5 rounded-full border border-amber-400">
                        {client.vipTier} Tier
                      </span>
                      <span className="text-[11px] text-slate-700 font-semibold block mt-0.5">{client.email}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                    <div>
                      <span className="text-[10px] text-slate-700 font-bold block uppercase">Bookings:</span>
                      <span className="font-black text-slate-900">{client.totalBookings} Completed</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-700 font-bold block uppercase">Lifetime Spend:</span>
                      <span className="font-black text-indigo-700">{formatPrice(client.lifetimeSpend)}</span>
                    </div>
                  </div>

                  {client.notes && (
                    <div className="mt-3 text-xs text-slate-800 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-200">
                      <span className="text-[10px] font-black text-indigo-950 block uppercase">Notes:</span>
                      <span>{client.notes}</span>
                    </div>
                  )}

                  {client.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {client.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md font-bold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setInspectedClient(client)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    View Full Intake Profile & History
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Modal: Client Full Profile & Intake Data --- */}
      {inspectedClient && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-300 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img
                  src={inspectedClient.avatar}
                  alt={inspectedClient.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-300"
                />
                <div>
                  <h3 className="text-base font-black text-slate-900">{inspectedClient.name}</h3>
                  <span className="text-xs text-indigo-700 font-bold">{inspectedClient.vipTier} Member</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectedClient(null)}
                className="text-slate-500 hover:text-slate-800 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 my-4 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-700 font-bold">Email & Phone:</span>
                <span className="font-bold text-slate-900">
                  {inspectedClient.email} • {inspectedClient.phone}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-700 font-bold">Total Reservations:</span>
                <span className="font-black text-slate-900">{inspectedClient.totalBookings} Sessions</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-700 font-bold">Total Lifetime Protocol Spend:</span>
                <span className="font-black text-indigo-700">{formatPrice(inspectedClient.lifetimeSpend)}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                  Intake Preferences & Medical / Dietary Records
                </span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {inspectedClient.notes || 'No specialized dietary restrictions noted. Full clearance.'}
                </p>
                <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                  <CheckIcon className="w-3.5 h-3.5" />
                  <span>Card on File Verified • Pre-authorized for instant check-out</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setInspectedClient(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
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
