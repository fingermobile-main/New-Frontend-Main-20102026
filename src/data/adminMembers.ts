// Default administrative members for FingerMobile platform
import { AdminMemberItem } from '../types/adminControl';

export const defaultAdminMemberItems: AdminMemberItem[] = [
  {id: 'owner-1',
    name: 'Obinna Mbah',
    role: 'OWNER',
    permissions: ['all'],
    lastLogin: new Date(),
    isActive: true,
    geoLocation: 'NG'
  },
  {id: 'admin-1',
    name: 'Backup Admin 1',
    role: 'ADMIN',
    permissions: ['modules', 'members', 'content'],
    lastLogin: new Date(),
    isActive: true,
    geoLocation: 'NG'
  },
  {id: 'admin-2',
    name: 'Backup Admin 2',
    role: 'ADMIN',
    permissions: ['modules', 'members', 'content'],
    lastLogin: new Date(),
    isActive: true,
    geoLocation: 'GH'
  },
  {id: 'auditor-1',
    name: 'System Auditor',
    role: 'AUDITOR',
    permissions: ['audit', 'logs'],
    lastLogin: new Date(),
    isActive: true,
    geoLocation: 'UK'
  }
];
