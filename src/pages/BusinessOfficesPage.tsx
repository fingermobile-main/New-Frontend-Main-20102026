import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Globe,
  ShieldCheck,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle2,
  Send,
  X
} from 'lucide-react';

export interface CorporateOffice {
  id: string;
  name: string;
  region: string;
  country: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  isHeadquarters?: boolean;
  isVirtual?: boolean;
  hours: string;
  amenities: string[];
  imageUrl: string;
}

const CORPORATE_OFFICES: CorporateOffice[] = [
  {
    id: 'abuja-hq',
    name: 'National Executive Headquarters',
    region: 'Federal Capital Territory',
    country: 'Nigeria',
    address: '#Gilbert Nwanna Crescent, Kubwa',
    city: 'Abuja, F.C.T.',
    phone: '+234 801 234 5678',
    email: 'admin@fingermobile.org',
    isHeadquarters: true,
    isVirtual: false,
    hours: 'Mon - Fri: 8:00 AM - 6:00 PM (WAT)',
    amenities: [
      'Executive Boardroom & Governance Chamber',
      'Protocol Engineering & Data Center',
      'Regulatory Compliance & Legal Department',
      'Security Operations Center (SOC)'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'usa-hq',
    name: 'Global Protocol & International HQ',
    region: 'Texas',
    country: 'United States',
    address: '#7307, Branford Park Ln',
    city: 'Richmond, Texas 77407',
    phone: '+1 (832) 555-0199',
    email: 'usa@fingermobile.org',
    isHeadquarters: true,
    isVirtual: false,
    hours: 'Mon - Fri: 9:00 AM - 5:00 PM (CST)',
    amenities: [
      'Global Protocol Architecture Team',
      'International Investor Relations',
      'Smart Contract & Web3 Security Audits',
      'Cross-Border Settlement Clearing'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'lagos-hub',
    name: 'Commercial, Media & Creator Hub',
    region: 'Lagos State',
    country: 'Nigeria',
    address: '123 Victoria Island Commercial Corridor',
    city: 'Lagos',
    phone: '+234 800 123 4567',
    email: 'lagos@fingermobile.org',
    isHeadquarters: false,
    isVirtual: false,
    hours: '24/7 Creator Operations',
    amenities: [
      'Dancia-4Tv 4K Live Broadcast Studios',
      'BeatwaveNG Acoustic Sound Mixing Booths',
      'PhotoCredits HD High-Speed Upload Terminals',
      'Storefront Logistics & Merchant Fulfillment Hub'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'virtual-node',
    name: 'Decentralized Virtual Meta Terminal',
    region: 'Global Protocol RPC',
    country: 'Metaverse / Cloud',
    address: 'Node #001 (Web3 / Global RPC Cluster)',
    city: 'Decentralized Network',
    phone: 'Protocol VOIP / Discord SIP',
    email: 'protocol@fingermobile.org',
    isHeadquarters: false,
    isVirtual: true,
    hours: '24/7/365 Autonomous Protocol Uptime',
    amenities: [
      'Virtual Reality Conference Auditorium',
      'Automated Escrow & Instant Payout Engine',
      'On-Chain Multi-Signature Vault',
      'Zero-Latency Global CDN Edge Relay'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
  }
];

export const BusinessOfficesPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const [selectedOffice, setSelectedOffice] = useState<CorporateOffice | null>(null);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingPurpose, setBookingPurpose] = useState('Creator Studio Session');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookVisit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingEmail || !bookingDate) {
      showToast('Please fill in all booking fields', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(`Appointment confirmed at ${selectedOffice?.name}! Check your email for pass details.`, 'success');
      setSelectedOffice(null);
      setBookingName('');
      setBookingEmail('');
      setBookingDate('');
    }, 600);
  };

  return (
    <MainLayout pageTitle="Business Offices & Global Locations">
      <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Hero Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30">
                  <Building2 className="w-7 h-7 text-amber-400" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                  Corporate Offices & Network Hubs
                </h1>
              </div>
              <p className="text-sm text-slate-400 max-w-2xl">
                FingerMobile Protocol operates physical governance centers, broadcast studios, and decentralized metaverse terminals spanning Nigeria, the United States, and the global Web3 ecosystem.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="text-slate-400">Vault Balance: </span>
                <span className="font-mono font-bold text-amber-400">{ficBalance.toLocaleString()} FIC</span>
              </div>
            </div>
          </div>

          {/* Leadership Spotlight */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              Corporate Leadership & Governance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                  alt="Mbah Redice Obinna"
                  className="w-16 h-16 rounded-xl object-cover ring-2 ring-amber-400/30"
                />
                <div>
                  <h3 className="font-bold text-base text-white">Mbah Redice Obinna</h3>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">
                    Chief Executive Officer & Chief Technical Officer
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Head of Internal Affairs & Protocol Chief Architect overseeing network engineering and global operations.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-4">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
                  alt="Mrs Eunice Emonena Mbah"
                  className="w-16 h-16 rounded-xl object-cover ring-2 ring-amber-400/30"
                />
                <div>
                  <h3 className="font-bold text-base text-white">Mrs Eunice Emonena Mbah</h3>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">
                    Group Company Secretary
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Corporate Governance & Legal Compliance Director managing stakeholder alignment and entity filings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Offices Grid */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              Office Directory & Physical Facilities
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {CORPORATE_OFFICES.map((office) => (
                <div
                  key={office.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={office.imageUrl}
                      alt={office.name}
                      className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {office.isHeadquarters && (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 shadow-md">
                          HEADQUARTERS
                        </span>
                      )}
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          office.isVirtual
                            ? 'bg-purple-900/80 text-purple-200 border border-purple-700'
                            : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                        }`}
                      >
                        {office.isVirtual ? 'VIRTUAL NODE' : 'PHYSICAL CENTER'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{office.name}</h3>
                      <p className="text-xs text-amber-400 font-semibold mt-0.5">
                        {office.city}, {office.country}
                      </p>

                      <div className="mt-4 space-y-2 text-xs text-slate-300">
                        <p className="flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                          <span>{office.address}, {office.city}</span>
                        </p>
                        <p className="flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <a href={`tel:${office.phone}`} className="hover:text-amber-300 transition-colors">
                            {office.phone}
                          </a>
                        </p>
                        <p className="flex items-center gap-2.5">
                          <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <a href={`mailto:${office.email}`} className="text-blue-400 hover:underline">
                            {office.email}
                          </a>
                        </p>
                        <p className="flex items-center gap-2.5">
                          <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <span>{office.hours}</span>
                        </p>
                      </div>

                      {/* Amenities */}
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Facilities & Services
                        </p>
                        <ul className="space-y-1.5">
                          {office.amenities.map((amenity, i) => (
                            <li key={i} className="text-xs text-slate-300 flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                              <span>{amenity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedOffice(office)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Schedule Visit / Access
                      </button>
                      <a
                        href={`mailto:${office.email}?subject=Inquiry for ${office.name}`}
                        className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Inquire
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Modal */}
          {selectedOffice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
                <button
                  type="button"
                  onClick={() => setSelectedOffice(null)}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-amber-400" />
                  <div>
                    <h3 className="font-bold text-lg text-white">Schedule an Office Visit</h3>
                    <p className="text-xs text-slate-400">{selectedOffice.name}</p>
                  </div>
                </div>

                <form onSubmit={handleBookVisit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={bookingName}
                      onChange={(e) => setBookingName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@company.com"
                      value={bookingEmail}
                      onChange={(e) => setBookingEmail(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Purpose of Visit</label>
                      <select
                        value={bookingPurpose}
                        onChange={(e) => setBookingPurpose(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none"
                      >
                        <option value="Creator Studio Session">Studio Recording</option>
                        <option value="Franchise Consultation">Franchise Meeting</option>
                        <option value="Legal & Verification">Identity Verification</option>
                        <option value="Tour">Facility Tour</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedOffice(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BusinessOfficesPage;
