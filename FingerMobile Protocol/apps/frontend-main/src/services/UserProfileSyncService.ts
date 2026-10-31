/*
 * FingerMobile Protocol™ - Sovereign User Profile Synchronization Service
 * Universal Identity, Settings, Master Dashboard & Stercs Sync Engine
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

export interface LoggedInDevice {
  id: string;
  name: string;
  macAddress: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrentDevice?: boolean;
}

export interface InactiveDevice {
  id: string;
  name: string;
  macAddress: string;
  lastActive: string;
  daysInactive: number;
}

export interface PasskeyEntry {
  id: string;
  name: string;
  type: string;
  addedDate: string;
}

export interface LinkedAppEntry {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'authorized' | 'disconnected';
  scope: string;
}

export interface ComprehensiveUserProfile {
  // Identity & Basics
  id?: string;
  name: string;
  username: string;
  headline: string;
  bio?: string;
  gender: string;
  email: string;
  recoveryEmail: string;
  phone: string;
  birthday: string;
  language: string;
  avatar: string;
  coverImage: string;
  location: string;

  // Addresses
  homeAddress: string;
  workAddress: string;
  otherAddresses: string;

  // Protocol PIN & Sovereign Quota
  pinNumber: string;
  pinQuotaRemaining: number;
  pinQuotaMax: number;
  pinLastRotated: string;

  // 2-Step Verification & Passkeys
  twoStepActiveDate: string;
  passkeysCount: number;
  passkeysList: PasskeyEntry[];
  passwordLastChanged: string;
  skipPasswordWhenPossible: boolean;
  authenticatorAppStatus: string;
  authenticatorSecretKey: string;

  // AI & Instruction
  geminiPrompt: string;

  // Recovery Suite
  twoStepPhones: string[];
  recoveryContacts: string[];
  recoveryPhone: string;
  backupCodes: string[];

  // Linked Apps
  linkedApps: LinkedAppEntry[];

  // Security Tips & Health Check
  securityScore: number;
  securityTips: string[];

  // Financial & Sovereign Wallet
  storeCreditBalance?: number;
  ficBalance?: number;

  // Devices & Hardware Blacklist
  loggedInDevices: LoggedInDevice[];
  blockedMacAddresses: string[];
  inactiveDevices: InactiveDevice[];
}

const STORAGE_KEY_COMPREHENSIVE = 'fmp_comprehensive_profile';
const STORAGE_KEY_LEGACY = 'fmp_member_profile';
const STORAGE_KEY_BLOCKED_MACS = 'fmp_blocked_macs';
const STORAGE_KEY_USER = 'user';

export const SUPERADMIN_PROFILE: ComprehensiveUserProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Israel Obinna Mbah',
  username: 'ObinnaMbah',
  headline: 'CEO & CTO, Founder | FingerMobile Protocol™ Sovereign Ecosystem Architect',
  bio: 'Curating luxury African contemporary art & exploring meaningful connections.',
  gender: 'Male',
  email: 'obinnambah@fingermobileprotocol.com',
  recoveryEmail: 'recovery.guardian@fingermobileprotocol.com',
  phone: '+234 801 234 5678',
  birthday: '1992-06-18',
  language: 'English (US)',
  avatar: '/assets/branding/mbah_israel_obinna.jpeg',
  coverImage: '/assets/branding/backgrounds/FingerMobile Login screen Background image.webp',
  location: 'Lagos, Nigeria',

  storeCreditBalance: 450.00,
  ficBalance: 1250.00,

  homeAddress: '14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
  workAddress: 'Sovereign Enclave Alpha, Victoria Island, Lagos, Nigeria',
  otherAddresses: 'Studio Vault 7, London W1F 8GW, United Kingdom',

  pinNumber: '749822',
  pinQuotaRemaining: 48,
  pinQuotaMax: 50,
  pinLastRotated: 'Mar 15, 2026',

  twoStepActiveDate: 'May 14, 2026',
  passkeysCount: 4,
  passkeysList: [
    { id: 'pk-1', name: 'MacBook Pro 16" Touch ID', type: 'Built-in Biometrics', addedDate: 'May 14, 2026' },
    { id: 'pk-2', name: 'iPhone 15 Pro Max Face ID', type: 'Apple Secure Enclave', addedDate: 'May 18, 2026' },
    { id: 'pk-3', name: 'YubiKey 5C NFC Security Key', type: 'FIDO2 Hardware Token', addedDate: 'Jun 02, 2026' },
    { id: 'pk-4', name: 'FingerMobile Sovereign Keycard NFC', type: 'Hardware Enclave', addedDate: 'Jul 21, 2026' },
  ],
  passwordLastChanged: 'Mar 8, 2026',
  skipPasswordWhenPossible: true,
  authenticatorAppStatus: 'Active (Google Authenticator / TOTP)',
  authenticatorSecretKey: 'JBSWY3DPEHPK3PXP',

  geminiPrompt: 'Act as Sovereign Guardian for Israel Obinna Mbah. Enforce Child Safety Policy (SEC-10), flag sensitive media, monitor wallet authorizations, and maintain end-to-end cryptographic integrity.',

  twoStepPhones: ['+234 801 234 5678 (Primary)', '+234 809 111 2233 (Backup)'],
  recoveryContacts: ['Chief O. Adeleke (Guardian Node 01)', 'Engr. K. Amadi (Sovereign Trustee)'],
  recoveryPhone: '+234 703 555 9901',
  backupCodes: ['A94B-8831', 'K72P-9912', 'C41X-5509', 'M88T-1234', 'Z09V-6781', 'Q33L-4490'],

  linkedApps: [
    { id: 'app-1', name: 'Google Workspace', icon: '🌐', status: 'connected', scope: 'SSO & Drive Sync' },
    { id: 'app-2', name: 'Apple ID Secure Key', icon: '🍎', status: 'connected', scope: 'Keychain Passkey' },
    { id: 'app-3', name: 'BeatwaveNG Studio DAW', icon: '🎧', status: 'authorized', scope: 'Lossless Audio Stems' },
    { id: 'app-4', name: 'Dancia-4Tv Broadcast Node', icon: '📺', status: 'authorized', scope: '4K WebRTC Live Feeds' },
    { id: 'app-5', name: 'Telegram Sovereign Bot', icon: '✈️', status: 'connected', scope: 'Emergency 2FA Ping' },
    { id: 'app-6', name: 'MetaMask / FIC Hardware Vault', icon: '🦊', status: 'authorized', scope: 'Sovereign Escrow & FIC' },
  ],

  securityScore: 96,
  securityTips: [
    'You have 2 inactive devices older than 60 days. Review and remove them now to harden session security.',
    'Sovereign 6-Digit PIN has 48 operations remaining before scheduled security rotation.',
    'Backup recovery codes generated 90 days ago. Ensure you possess an offline printed copy.',
  ],

  loggedInDevices: [
    {
      id: 'dev-1',
      name: 'MacBook Pro 16" (Apple M3 Max)',
      macAddress: '3C:22:FB:4A:19:8C',
      ipAddress: '102.89.41.22',
      location: 'Lagos, Nigeria',
      lastActive: 'Active Now (This Device)',
      isCurrentDevice: true,
    },
    {
      id: 'dev-2',
      name: 'iPhone 15 Pro Max',
      macAddress: 'A4:83:E7:62:01:DF',
      ipAddress: '102.89.41.25',
      location: 'Lagos, Nigeria',
      lastActive: '12m ago',
      isCurrentDevice: false,
    },
    {
      id: 'dev-3',
      name: 'iPad Pro 12.9" (M2)',
      macAddress: '70:EE:50:3B:77:21',
      ipAddress: '197.210.55.8',
      location: 'Abuja, Nigeria',
      lastActive: '2h ago',
      isCurrentDevice: false,
    },
  ],

  blockedMacAddresses: [],

  inactiveDevices: [
    {
      id: 'inact-1',
      name: 'Windows 11 Workstation (Chrome)',
      macAddress: 'E8:9C:25:31:88:02',
      lastActive: 'Jan 12, 2026',
      daysInactive: 78,
    },
    {
      id: 'inact-2',
      name: 'Samsung Galaxy S22 Ultra',
      macAddress: '54:E4:3A:7B:10:99',
      lastActive: 'Nov 04, 2025',
      daysInactive: 147,
    },
  ],
};

export const DEFAULT_GUEST_PROFILE: ComprehensiveUserProfile = {
  id: '',
  name: 'Guest Explorer',
  username: 'guest',
  headline: 'Guest Explorer • FingerMobile Protocol',
  bio: 'Exploring sovereign decentralized media, creator monetization & commerce ecosystem.',
  gender: 'Other',
  email: '',
  recoveryEmail: '',
  phone: '',
  birthday: '',
  language: 'English (US)',
  avatar: '/assets/branding/default-avatar.svg',
  coverImage: '/assets/branding/backgrounds/FingerMobile Login screen Background image.webp',
  location: 'Global Decentralized Mesh',

  storeCreditBalance: 0,
  ficBalance: 0,

  homeAddress: '',
  workAddress: '',
  otherAddresses: '',

  pinNumber: '',
  pinQuotaRemaining: 0,
  pinQuotaMax: 50,
  pinLastRotated: '',

  twoStepActiveDate: '',
  passkeysCount: 0,
  passkeysList: [],
  passwordLastChanged: '',
  skipPasswordWhenPossible: false,
  authenticatorAppStatus: 'Not Configured',
  authenticatorSecretKey: '',

  geminiPrompt: '',

  twoStepPhones: [],
  recoveryContacts: [],
  recoveryPhone: '',
  backupCodes: [],

  linkedApps: [],

  securityScore: 0,
  securityTips: [],

  loggedInDevices: [],
  blockedMacAddresses: [],
  inactiveDevices: [],
};

export const DEFAULT_COMPREHENSIVE_PROFILE = DEFAULT_GUEST_PROFILE;

class UserProfileSyncService {
  private listeners: Array<(_profile: ComprehensiveUserProfile) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY_COMPREHENSIVE || e.key === STORAGE_KEY_LEGACY || e.key === STORAGE_KEY_USER) {
          const current = this.getProfile();
          this.notifyListeners(current);
        }
      });
      window.addEventListener('fmp_profile_updated', () => {
        const current = this.getProfile();
        this.notifyListeners(current);
      });
    }
  }

  public isGuest(): boolean {
    if (typeof window === 'undefined') return true;
    const hasUser = Boolean(localStorage.getItem(STORAGE_KEY_USER));
    const hasToken = Boolean(
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('fingermobile_token')
    );
    return !hasUser && !hasToken;
  }

  public clearProfile(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_COMPREHENSIVE);
        localStorage.removeItem(STORAGE_KEY_LEGACY);
        localStorage.removeItem(STORAGE_KEY_BLOCKED_MACS);
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.removeItem('fmp_comprehensive_profile');
        localStorage.removeItem('fmp_member_profile');
      } catch (_e) {
        // ignore
      }
    }
    this.notifyListeners(DEFAULT_GUEST_PROFILE);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fmp_profile_updated'));
    }
  }

  public getProfile(): ComprehensiveUserProfile {
    if (typeof window === 'undefined') return DEFAULT_GUEST_PROFILE;

    try {
      // 1. If not authenticated, always return clean Guest profile
      const storedUser = localStorage.getItem(STORAGE_KEY_USER);
      const token =
        localStorage.getItem('accessToken') ||
        localStorage.getItem('token') ||
        localStorage.getItem('fingermobile_token');

      if (!storedUser && !token) {
        return DEFAULT_GUEST_PROFILE;
      }

      let userData: any = {};
      if (storedUser) {
        try {
          userData = JSON.parse(storedUser);
        } catch (_e) {
          userData = {};
        }
      }

      // Check if user is explicitly the SuperAdmin Founder
      const isSuperAdmin = Boolean(
        userData &&
        (userData.username === 'ObinnaMbah' ||
         userData.username === 'israelobinna' ||
         userData.email === 'fingermobileprotocol@gmail.com' ||
         userData.email === 'obinnambah@fingermobileprotocol.com') &&
        (String(userData.role || '').toLowerCase() === 'superadmin' || String(userData.role || '').toLowerCase() === 'founder')
      );

      const baseProfile: ComprehensiveUserProfile = isSuperAdmin
        ? SUPERADMIN_PROFILE
        : {
          ...DEFAULT_GUEST_PROFILE,
          id: userData.id || 'sovereign_user',
          name:
            userData.name ||
            `${userData.firstName || ''} ${userData.lastName || ''}`.trim() ||
            userData.username ||
            'Sovereign Member',
          username: userData.username || 'member',
          headline:
            userData.headline ||
            userData.bio ||
            `${userData.role || 'Member'} • FingerMobile Protocol`,
          bio: userData.bio || 'Sovereign Member participating in decentralized media, commerce and forums.',
          email: userData.email || '',
          phone: userData.phone || '',
          avatar: userData.avatar || userData.avatarUrl || '/assets/branding/default-avatar.svg',
          coverImage: userData.coverImage || '/assets/branding/backgrounds/FingerMobile Login screen Background image.webp',
          location: userData.location || 'Lagos, Nigeria',
          ficBalance: typeof userData.ficBalance === 'number' ? userData.ficBalance : 1000.0,
          pinNumber: userData.pinNumber || '749822',
          pinQuotaRemaining: userData.pinQuotaRemaining ?? 50,
          pinQuotaMax: 50,
          securityScore: 85,
        };

      const storedComp = localStorage.getItem(STORAGE_KEY_COMPREHENSIVE);
      let compData: Partial<ComprehensiveUserProfile> = {};
      if (storedComp) {
        try {
          compData = JSON.parse(storedComp);
        } catch (_e) {
          compData = {};
        }
      }

      const merged: ComprehensiveUserProfile = {
        ...baseProfile,
        ...compData,
        id: compData.id || userData.id || baseProfile.id || '00000000-0000-0000-0000-000000000001',
        name:
          compData.name ||
          userData.name ||
          userData.displayName ||
          userData.display_name ||
          (userData.firstName
            ? `${userData.firstName} ${userData.lastName || ''}`.trim()
            : '') ||
          baseProfile.name,
        username: compData.username || userData.username || baseProfile.username,
        headline: compData.headline || userData.headline || userData.bio || baseProfile.headline,
        bio: compData.bio || userData.bio || userData.headline || baseProfile.bio,
        avatar: compData.avatar || userData.avatar || userData.avatarUrl || userData.avatar_url || baseProfile.avatar,
        coverImage: compData.coverImage || userData.coverImage || userData.cover_url || userData.coverPhotoUrl || baseProfile.coverImage,
        email: compData.email || userData.email || baseProfile.email,
        phone: compData.phone || userData.phone || baseProfile.phone,
        location: compData.location || userData.location || baseProfile.location,
        pinNumber: compData.pinNumber || userData.pinNumber || userData.sovereign_pin || baseProfile.pinNumber,
      };

      // Load blocked macs if any
      const blockedMacs = localStorage.getItem(STORAGE_KEY_BLOCKED_MACS);
      if (blockedMacs) {
        try {
          merged.blockedMacAddresses = JSON.parse(blockedMacs);
        } catch {
          // ignore
        }
      }

      return merged;
    } catch {
      return DEFAULT_GUEST_PROFILE;
    }
  }

  public updateProfile(updates: Partial<ComprehensiveUserProfile>): ComprehensiveUserProfile {
    const current = this.getProfile();
    const updated: ComprehensiveUserProfile = {
      ...current,
      ...updates,
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_COMPREHENSIVE, JSON.stringify(updated));

        // Sync legacy store for backwards compatibility
        const legacy = {
          name: updated.name,
          username: updated.username,
          headline: updated.headline,
          location: updated.location,
          avatar: updated.avatar,
          coverImage: updated.coverImage,
          pinNumber: updated.pinNumber,
        };
        localStorage.setItem(STORAGE_KEY_LEGACY, JSON.stringify(legacy));

        // Sync auth user in localStorage reliably
        const storedUser = localStorage.getItem(STORAGE_KEY_USER);
        let parsedUser: any = {};
        if (storedUser) {
          try {
            parsedUser = JSON.parse(storedUser);
          } catch {
            parsedUser = {};
          }
        }
        const nameParts = (updated.name || '').split(' ');
        const syncedUser = {
          ...parsedUser,
          id: parsedUser.id || (updated as any).id || '00000000-0000-0000-0000-000000000001',
          name: updated.name,
          displayName: updated.name,
          display_name: updated.name,
          firstName: nameParts[0] || parsedUser.firstName || 'Sovereign',
          lastName: nameParts.slice(1).join(' ') || parsedUser.lastName || 'Member',
          username: updated.username,
          avatar: updated.avatar,
          avatarUrl: updated.avatar,
          avatar_url: updated.avatar,
          bio: updated.headline || updated.bio,
          headline: updated.headline,
          location: updated.location,
          coverImage: updated.coverImage,
          coverUrl: updated.coverImage,
          coverPhotoUrl: updated.coverImage,
          pinNumber: updated.pinNumber
        };
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(syncedUser));

        // Broadcast live custom event across all windows / tabs
        window.dispatchEvent(new CustomEvent('fmp_profile_updated', { detail: updated }));

        // Persist directly to PostgreSQL database via Consolidated Profile Charter API & User Management API
        try {
          const targetId = (updated as any).id || (storedUser ? (JSON.parse(storedUser)?.id) : null) || '00000000-0000-0000-0000-000000000001';
          const token = localStorage.getItem('accessToken') || localStorage.getItem('fingermobile_token') || localStorage.getItem('token');
          const authHeaders = {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          };

          fetch(`http://localhost:5001/api/v1/profiles/${targetId}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({
              name: updated.name,
              headline: updated.headline,
              bio: updated.headline || updated.name,
              location: updated.location,
              avatarUrl: updated.avatar,
              coverPhotoUrl: updated.coverImage,
              username: updated.username
            })
          }).catch(() => {});

          fetch('http://localhost:5001/api/users/profile', {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({
              userId: targetId,
              displayName: updated.name,
              username: updated.username,
              bio: updated.headline,
              headline: updated.headline,
              location: updated.location,
              avatarUrl: updated.avatar,
              coverPhotoUrl: updated.coverImage
            })
          }).catch(() => {});
        } catch {
          // Non-blocking network fallback
        }
      } catch (err) {
        console.warn('LocalStorage error while syncing profile', err);
      }
    }

    this.notifyListeners(updated);
    return updated;
  }

  public killAndBlockMac(macAddress: string, deviceName: string): ComprehensiveUserProfile {
    const profile = this.getProfile();
    const newBlocked = Array.from(new Set([...(profile.blockedMacAddresses || []), macAddress]));
    const remainingDevices = profile.loggedInDevices.filter((d) => d.macAddress !== macAddress);

    localStorage.setItem(STORAGE_KEY_BLOCKED_MACS, JSON.stringify(newBlocked));

    return this.updateProfile({
      blockedMacAddresses: newBlocked,
      loggedInDevices: remainingDevices,
      securityTips: [
        `Blocked hardware MAC [${macAddress}] (${deviceName}). Device permanently terminated from Sovereign Enclave.`,
        ...profile.securityTips,
      ],
    });
  }

  public unblockMac(macAddress: string): ComprehensiveUserProfile {
    const profile = this.getProfile();
    const newBlocked = (profile.blockedMacAddresses || []).filter((m) => m !== macAddress);
    localStorage.setItem(STORAGE_KEY_BLOCKED_MACS, JSON.stringify(newBlocked));
    return this.updateProfile({ blockedMacAddresses: newBlocked });
  }

  public removeInactiveDevice(deviceId: string): ComprehensiveUserProfile {
    const profile = this.getProfile();
    const filtered = profile.inactiveDevices.filter((d) => d.id !== deviceId);
    return this.updateProfile({ inactiveDevices: filtered });
  }

  public removeAllInactiveDevices(): ComprehensiveUserProfile {
    return this.updateProfile({ inactiveDevices: [] });
  }

  public generateNewBackupCodes(): string[] {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    const newCodes: string[] = [];
    for (let i = 0; i < 6; i++) {
      let codePart1 = '';
      let codePart2 = '';
      for (let j = 0; j < 4; j++) codePart1 += chars.charAt(Math.floor(Math.random() * chars.length));
      for (let j = 0; j < 4; j++) codePart2 += chars.charAt(Math.floor(Math.random() * chars.length));
      newCodes.push(`${codePart1}-${codePart2}`);
    }
    this.updateProfile({ backupCodes: newCodes });
    return newCodes;
  }

  public updateProtocolPin(newPin: string): ComprehensiveUserProfile {
    const cleanPin = newPin.replace(/\D/g, '').slice(0, 6);
    return this.updateProfile({
      pinNumber: cleanPin,
      pinQuotaRemaining: 50,
      pinLastRotated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
  }

  public spendStoreCredit(amount: number, _description?: string, _merchant?: string): boolean {
    const profile = this.getProfile();
    const current = profile.storeCreditBalance ?? 450;
    if (amount <= 0 || amount > current) return false;
    this.updateProfile({ storeCreditBalance: Number((current - amount).toFixed(2)) });
    return true;
  }

  public grantStoreCredit(amount: number, _reason?: string): ComprehensiveUserProfile {
    const profile = this.getProfile();
    const current = profile.storeCreditBalance ?? 450;
    return this.updateProfile({ storeCreditBalance: Number((current + Math.max(0, amount)).toFixed(2)) });
  }

  public deleteAccount(): boolean {
    const profile = this.getProfile();
    if (profile.username === 'israel_protocol') {
      return false; // Root SuperAdmin protected
    }
    localStorage.removeItem(STORAGE_KEY_COMPREHENSIVE);
    localStorage.removeItem(STORAGE_KEY_LEGACY);
    localStorage.removeItem(STORAGE_KEY_USER);
    this.notifyListeners({
      ...DEFAULT_COMPREHENSIVE_PROFILE,
      name: 'Guest Member',
      username: 'guest_user',
      email: 'guest@fingermobileprotocol.com'
    });
    return true;
  }

  public subscribe(callback: (_profile: ComprehensiveUserProfile) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners(profile: ComprehensiveUserProfile) {
    this.listeners.forEach((listener) => {
      try {
        listener(profile);
      } catch {
        // ignore
      }
    });
  }
}

export const userProfileSyncService = new UserProfileSyncService();
export default userProfileSyncService;
