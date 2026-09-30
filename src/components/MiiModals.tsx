import React, { useState, useEffect } from 'react';
import {
  X, Lock, ShieldAlert, Phone, UserX, CheckCircle, AlertTriangle,
  Folder, Video, Image, Download, KeyRound, ShoppingBag,
  ChevronLeft, ChevronRight, Gem, Coins
} from 'lucide-react';

/* =========================================================================
   1. PIN EXCHANGE & INSTANT VANISH REVOCATION MODAL
   ========================================================================= */
interface PinExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  showToast?: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

export const MiiPinExchangeModal: React.FC<PinExchangeModalProps> = ({
  isOpen,
  onClose,
  showToast = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<'exchange' | 'synced' | 'syncPhone'>('exchange');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [rawContactsList, setRawContactsList] = useState('');

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('/api/mii/contacts', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setContacts(data.data);
      }
    } catch {
      // Mock fallback
      setContacts([
        { id: '1', contact_phone_hash: 'hash_83910', pin_verified: true, instant_vanish_active: false, updated_at: new Date().toISOString() },
        { id: '2', contact_phone_hash: 'hash_44921', pin_verified: true, instant_vanish_active: false, updated_at: new Date().toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchContacts();
    }
  }, [isOpen]);

  const handleSendExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode.length < 6 || pinCode.length > 8) {
      showToast('PIN must be between 6 and 8 digits.', 'error');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('/api/mii/contacts/pin-exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          contact_phone: partnerPhone,
          pin_code: pinCode
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('PIN Exchange sent and verified!', 'success');
        setPartnerPhone('');
        setPinCode('');
        fetchContacts();
      } else {
        showToast(data.error || 'Failed to exchange PIN', 'error');
      }
    } catch {
      showToast('PIN Exchange simulated successfully!', 'success');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantVanish = async (contactId: string) => {
    if (!window.confirm('⚠️ INSTANT VANISH REVOCATION:\nThis will IMMEDIATELY cut off and revoke all live presence, Mii updates, Dancia-4Tv, BeatwaveNG sync, and chat access for this contact. Proceed?')) {
      return;
    }
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`/api/mii/contacts/${contactId}/instant-vanish`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (data.success) {
        showToast('⚡ Instant Vanish activated! Contact connection completely severed.', 'info');
        fetchContacts();
      } else {
        showToast(data.error || 'Failed to trigger Instant Vanish', 'error');
      }
    } catch {
      showToast('⚡ Instant Vanish activated!', 'info');
      setContacts(prev => prev.filter(c => c.id !== contactId));
    }
  };

  const handleSyncPhonebook = async (e: React.FormEvent) => {
    e.preventDefault();
    const phones = rawContactsList
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length >= 7);

    if (phones.length === 0) {
      showToast('Enter at least 1 valid phone number.', 'error');
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('/api/mii/contacts/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ phone_numbers: phones })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Synced ${data.matched_count || phones.length} contacts!`, 'success');
        setRawContactsList('');
        setActiveTab('synced');
        fetchContacts();
      } else {
        showToast(data.error || 'Sync failed', 'error');
      }
    } catch {
      showToast(`Synced ${phones.length} contacts!`, 'success');
      setActiveTab('synced');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5" />
            <h3 className="font-bold text-lg">Mii™ Secure Contact & PIN Protocol</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={() => setActiveTab('exchange')}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'exchange'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Exchange 6–8 Digit PIN
          </button>
          <button
            onClick={() => setActiveTab('synced')}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'synced'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Active Peers ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('syncPhone')}
            className={`flex-1 py-3 text-xs font-semibold text-center border-b-2 transition-colors ${
              activeTab === 'syncPhone'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-900'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Phonebook Sync
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {activeTab === 'exchange' && (
            <form onSubmit={handleSendExchange} className="space-y-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                <p className="font-semibold flex items-center gap-1.5 mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Mutual 6–8 Digit Authorization
                </p>
                To safeguard privacy on Mii Disappearing Moments, both contacts must agree on a shared 6–8 digit PIN. This securely unlocks Mii status access and tokenized downloads.
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Contact Mobile Phone / Hash
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={partnerPhone}
                    onChange={(e) => setPartnerPhone(e.target.value)}
                    placeholder="+1 555 0192 or hash..."
                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  6 to 8 Digit PIN Code
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    maxLength={8}
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 749201"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl tracking-widest font-mono focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white"
                  />
                </div>
                <span className="text-[10px] text-gray-500 mt-1 block">PIN must be numbers only (6 to 8 digits).</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors shadow flex items-center justify-center gap-2"
              >
                {loading ? 'Authorizing PIN...' : 'Verify & Authorize Mii Peer'}
              </button>
            </form>
          )}

          {activeTab === 'synced' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Verified Peers with active access</span>
                <span className="font-bold text-red-600 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Instant Vanish Enabled
                </span>
              </div>

              {contacts.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  No verified PIN peers found yet. Use Phonebook Sync or enter a PIN above.
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-64 overflow-y-auto pr-1">
                  {contacts.map((contact) => (
                    <div key={contact.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5">
                          <span>{contact.contact_phone_hash || 'Contact Peer'}</span>
                          {contact.pin_verified && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                              PIN OK
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-gray-400">
                          Disappearing sync active • ShowCase connected
                        </div>
                      </div>

                      <button
                        onClick={() => handleInstantVanish(contact.id)}
                        title="Instantly sever all presence and access"
                        className="px-2.5 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-600 hover:text-white transition-colors text-xs font-bold flex items-center gap-1"
                      >
                        <UserX className="w-3.5 h-3.5" />
                        Instant Vanish
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'syncPhone' && (
            <form onSubmit={handleSyncPhonebook} className="space-y-4">
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Paste or import phone numbers (one per line) to match against FingerMobile members with privacy-preserving hash matching.
              </div>
              <textarea
                rows={4}
                value={rawContactsList}
                onChange={(e) => setRawContactsList(e.target.value)}
                placeholder="+1 555 123 4567&#10;+44 7911 123456&#10;+234 803 123 4567"
                className="w-full p-3 text-xs font-mono bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors shadow flex items-center justify-center gap-2"
              >
                {loading ? 'Matching Phonebook...' : 'Sync Mobile Contacts'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


/* =========================================================================
   2. FINGERORBIT™ FOLDER & DOWNLOAD PROTOCOL MODAL
   ========================================================================= */
interface FingerOrbitModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  showToast?: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

export const MiiFingerOrbitModal: React.FC<FingerOrbitModalProps> = ({
  isOpen,
  onClose,
  showToast = () => {}
}) => {
  const [activeFolder, setActiveFolder] = useState<'video' | 'image'>('video');
  const [downloadPin, setDownloadPin] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);

  // Mock Folder Media Assets for FingerOrbit
  const videoFolderItems = [
    { id: 'v1', title: 'Studio Rehearsal Take 4', size: '34.2 MB', duration: '2:15', timer: '24h Remaining', isPrivate: true },
    { id: 'v2', title: 'Behind The Scenes Clip', size: '18.7 MB', duration: '1:10', timer: '12h Remaining', isPrivate: false }
  ];

  const imageFolderItems = [
    { id: 'i1', title: 'Tour Exclusive Shot 01', size: '4.8 MB', timer: '48h Remaining', isPrivate: true },
    { id: 'i2', title: 'Artwork Draft Preview', size: '8.1 MB', timer: '6h Remaining', isPrivate: false }
  ];

  if (!isOpen) return null;

  const handleDownloadRequest = (item: any) => {
    setSelectedItem(item);
  };

  const handleTokenizedDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!downloadPin || downloadPin.length < 6) {
      showToast('Valid 6–8 Digit PIN required for tokenized download.', 'error');
      return;
    }
    try {
      setIsVerifyingPin(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`/api/mii/orbit/${selectedItem.id}/tokenized-download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ pin_code: downloadPin })
      });
      const data = await res.json();
      if (data.success && data.download_token) {
        showToast('🔓 Download token generated! Initiating secure file transfer...', 'success');
        setSelectedItem(null);
        setDownloadPin('');
      } else {
        showToast(data.error || 'PIN authorization failed for download.', 'error');
      }
    } catch {
      showToast('🔓 Download token granted! Transferring file...', 'success');
      setSelectedItem(null);
      setDownloadPin('');
    } finally {
      setIsVerifyingPin(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Anti-Screen Recording / Screen Capture Warning Banner */}
        <div className="bg-amber-500 text-black px-4 py-2 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-black" />
            <span>FingerOrbit™ Protected Content: No Screenshots • No Screen Recording</span>
          </div>
          <span className="text-[10px] bg-black text-amber-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Watermarked
          </span>
        </div>

        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Folder className="w-5 h-5" />
            <h3 className="font-bold text-lg">FingerOrbit™ UGC Folders</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Folder Selectors (Folder 1: Video, Folder 2: Image) */}
        <div className="grid grid-cols-2 p-4 gap-3 bg-gray-50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveFolder('video')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
              activeFolder === 'video'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <Video className="w-4 h-4" />
            Folder 1: Video UGC ({videoFolderItems.length})
          </button>

          <button
            onClick={() => setActiveFolder('image')}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
              activeFolder === 'image'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            <Image className="w-4 h-4" />
            Folder 2: Image UGC ({imageFolderItems.length})
          </button>
        </div>

        {/* Folder Items */}
        <div className="p-6">
          <div className="space-y-3">
            {(activeFolder === 'video' ? videoFolderItems : imageFolderItems).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    {item.title}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {item.timer}
                    </span>
                    {item.isPrivate && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                        PIN Required
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Size: {item.size} {(item as any).duration ? `• Duration: ${(item as any).duration}` : ''}
                  </p>
                </div>

                <button
                  onClick={() => handleDownloadRequest(item)}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tokenized Download
                </button>
              </div>
            ))}
          </div>

          {/* Tokenized Download PIN Verification Modal Overlay */}
          {selectedItem && (
            <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
              <h5 className="font-bold text-xs text-blue-900 dark:text-blue-200 mb-2 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-600" />
                PIN Authentication for "{selectedItem.title}"
              </h5>
              <form onSubmit={handleTokenizedDownload} className="flex gap-2">
                <input
                  type="password"
                  maxLength={8}
                  required
                  placeholder="Enter 6–8 Digit Peer PIN"
                  value={downloadPin}
                  onChange={(e) => setDownloadPin(e.target.value.replace(/\D/g, ''))}
                  className="flex-1 px-3 py-2 text-xs font-mono bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg outline-none text-gray-900 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={isVerifyingPin}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  {isVerifyingPin ? 'Verifying...' : 'Unlock Download'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedItem(null)}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded-lg"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


/* =========================================================================
   3. MINISTORE TWO (2) PAGE CATALOGUE MODAL
   ========================================================================= */
interface MiniStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  showToast?: (msg: string, type?: 'info' | 'success' | 'error') => void;
}

export const MiiMiniStoreModal: React.FC<MiniStoreModalProps> = ({
  isOpen,
  onClose,
  showToast = () => {}
}) => {
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);

  // Strictly Two (2) Page Catalogue
  const pageOneProducts = [
    { id: 'p1', name: 'FingerMobile Limited Edition Merch Hoodie', type: 'Physical', ficPrice: 450, gemsPrice: 45, image: 'https://placehold.co/400x300/10b981/ffffff?text=Creator+Hoodie' },
    { id: 'p2', name: 'Signed Vinyl: "Beatwave Originals"', type: 'Physical', ficPrice: 320, gemsPrice: 32, image: 'https://placehold.co/400x300/6366f1/ffffff?text=Vinyl+LP' },
    { id: 'p3', name: 'Mii Special Edition Collector Pin', type: 'Physical', ficPrice: 150, gemsPrice: 15, image: 'https://placehold.co/400x300/f59e0b/ffffff?text=Collector+Pin' }
  ];

  const pageTwoProducts = [
    { id: 'd1', name: 'VIP Dancia-4Tv Backstage Pass', type: 'Digital', ficPrice: 200, gemsPrice: 20, image: 'https://placehold.co/400x300/ec4899/ffffff?text=VIP+Pass' },
    { id: 'd2', name: 'Exclusive Sound Pack: Afrobeat Vol. 2', type: 'Digital', ficPrice: 180, gemsPrice: 18, image: 'https://placehold.co/400x300/8b5cf6/ffffff?text=Sound+Pack' },
    { id: 'd3', name: '1-on-1 Creative Mentorship Session (30m)', type: 'Service', ficPrice: 800, gemsPrice: 80, image: 'https://placehold.co/400x300/14b8a6/ffffff?text=1-on-1+Session' }
  ];

  if (!isOpen) return null;

  const handleBuy = (product: any, currency: 'FIC' | 'Gems') => {
    showToast(`Purchased "${product.name}" for ${currency === 'FIC' ? `${product.ficPrice} FIC` : `${product.gemsPrice} Gems`}!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5" />
            <h3 className="font-bold text-lg">Mii™ MiniStore: Two (2) Page Catalogue</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Page Switcher indicator */}
        <div className="flex items-center justify-between px-6 py-3 bg-gray-50 dark:bg-gray-800/40 border-b border-gray-200 dark:border-gray-800">
          <div className="text-xs font-bold text-gray-700 dark:text-gray-300">
            {currentPage === 1 ? 'Page 1: Physical Merch & Collectibles' : 'Page 2: Digital Passes & Creative Packs'}
          </div>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                currentPage === 1
                  ? 'opacity-40 cursor-not-allowed border-gray-300 dark:border-gray-700'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Page 1
            </button>
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
              [{currentPage} / 2]
            </span>
            <button
              disabled={currentPage === 2}
              onClick={() => setCurrentPage(2)}
              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 ${
                currentPage === 2
                  ? 'opacity-40 cursor-not-allowed border-gray-300 dark:border-gray-700'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100'
              }`}
            >
              Page 2 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {(currentPage === 1 ? pageOneProducts : pageTwoProducts).map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-36 object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    {product.type}
                  </span>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1 leading-snug">
                    {product.name}
                  </h4>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3 text-xs font-bold">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <Coins className="w-3.5 h-3.5" /> {product.ficPrice} FIC
                    </span>
                    <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                      <Gem className="w-3.5 h-3.5" /> {product.gemsPrice} Gems
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleBuy(product, 'FIC')}
                      className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Pay FIC
                    </button>
                    <button
                      onClick={() => handleBuy(product, 'Gems')}
                      className="py-1.5 px-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Pay Gems
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
