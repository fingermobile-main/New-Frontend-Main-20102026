import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  UserPlus,
  Coins,
  CheckCircle,
  Edit3,
  Lock,
  Unlock,
  Crown,
  ShieldCheck,
  ShieldAlert,
  Key,
  Layers,
  RefreshCw,
  X,
  AlertTriangle,
  UserCheck,
  UserX,
  Cpu,
  Trash2,
  Save,
  CreditCard
} from 'lucide-react';
import api from '../../services/api';
import { INITIAL_18_EXECUTIVE_ROLES } from '../../constants/corporateGovernanceData';

export type PredefinedRole = 'SuperAdmin' | 'Admin' | 'Manager' | 'Editor' | 'Creator Pro' | 'Guest';

export interface PlatformMember {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  role: PredefinedRole;
  status: 'Active' | 'Suspended' | 'Frozen' | 'Pending KYC';
  kycTier: 'Tier 1' | 'Tier 2' | 'Tier 3 (Biometric)';
  biometricVerified: boolean;
  ficBalance: number;
  storeCreditBalance?: number;
  walletAddress: string;
  joinedDate: string;
  lastActive: string;
  isRootSuperAdmin?: boolean;
  department?: string;
  corporateRoleNumber?: number;
  corporateRoleTitle?: string;
  assignedSubOffice?: string;
  clearanceTier?: string;
  appointmentCredentialId?: string;
}

export interface ScreenPermissionMapping {
  id: string;
  category: string;
  screenName: string;
  route: string;
  guestPerm: 'Read & Own UGC' | 'Read Only' | 'Blocked';
  editorPerm: 'Create & Edit Content' | 'Read Only' | 'Blocked';
  managerPerm: 'Approve & Manage' | 'Read & Edit' | 'Read Only' | 'Blocked';
  adminPerm: 'Full Admin Operations' | 'Read & Manage' | 'Blocked';
  superAdminPerm: 'Absolute Root Access';
}

const PREDEFINED_ROLES_SPEC: {
  role: PredefinedRole;
  title: string;
  badgeColor: string;
  description: string;
  accessScope: string;
  defaultForNewMembers?: boolean;
  rootProtected?: boolean;
}[] = [
  {
    role: 'SuperAdmin',
    title: 'SuperAdmin (Root Authority & Master Control)',
    badgeColor: 'bg-amber-500 text-white',
    description: 'Irrevocable master control reserved for Founder Mbah Israel Obinna. Full authority to configure system security, mint FIC, add/remove all users, and manage all platform data.',
    accessScope: 'Absolute full access across all 210+ platform pages, screens, minting policies, and security setups.',
    rootProtected: true
  },
  {
    role: 'Admin',
    title: 'Administrator (Admin-1 & Operational Control)',
    badgeColor: 'bg-purple-600 text-white',
    description: 'Operational leadership held by Co-Founder Mrs. Mbah Eunice Emonena. Manages members, content moderation, billing, and day-to-day configuration. Cannot modify founder root status.',
    accessScope: 'High-level admin access to user management, moderation, KYC verification, and operations consoles.'
  },
  {
    role: 'Manager',
    title: 'Manager (Content & Storefront Approvals)',
    badgeColor: 'bg-blue-600 text-white',
    description: 'Supervises marketplace storefronts, content pipelines, reports, and department activities. Can review, edit, and approve UGC and business reports, but cannot touch security settings.',
    accessScope: 'Access to Storefront reviews, UGC moderation, analytics reports, and creator tools. Blocked from system security and minting.'
  },
  {
    role: 'Editor',
    title: 'Editor (Publishing & Media Curation)',
    badgeColor: 'bg-emerald-600 text-white',
    description: 'Focuses on editorial media, forum curation, publishing tools, and article reviews. Can create, edit, and publish content, but cannot change user roles, security, or financial settings.',
    accessScope: 'Access to editorial studios, blog tools, forum curation, and media manager. Blocked from administrative tools.'
  },
  {
    role: 'Creator Pro',
    title: 'Creator Pro (Verified Merchant & Storefront)',
    badgeColor: 'bg-pink-600 text-white',
    description: 'Verified creator holding dedicated Storefronts, audio stems, digital merchandise, or FingerShorts video channels. Full control over their own storefront and UGC monetization.',
    accessScope: 'Access to My Storefront, Creator Studio, monetization analytics, and fan community hubs.'
  },
  {
    role: 'Guest',
    title: 'Standard User / Guest (Default for New Members)',
    badgeColor: 'bg-slate-700 text-white',
    description: 'Least-Privilege default assigned to EVERY single new member upon SignUp/SignIn. Strictly limited to viewing public content, participating in discussions, and editing/deleting their own UGC only.',
    accessScope: 'Read public feeds/forums/marketplace, write comments/posts, edit/delete OWN UGC only. Blocked from all admin/financial tools.',
    defaultForNewMembers: true
  }
];

const PERMISSION_MATRIX: ScreenPermissionMapping[] = [
  {
    id: 'perm-01',
    category: 'Public Browsing',
    screenName: 'Platform Home, About & Discovery',
    route: '/, /about, /discover',
    guestPerm: 'Read Only',
    editorPerm: 'Read Only',
    managerPerm: 'Read Only',
    adminPerm: 'Full Admin Operations',
    superAdminPerm: 'Absolute Root Access'
  },
  {
    id: 'perm-02',
    category: 'Public Browsing',
    screenName: 'Public Marketplace & Storefronts',
    route: '/marketplace, /storefronts',
    guestPerm: 'Read Only',
    editorPerm: 'Read Only',
    managerPerm: 'Read & Edit',
    adminPerm: 'Full Admin Operations',
    superAdminPerm: 'Absolute Root Access'
  },
  {
    id: 'perm-03',
    category: 'Community & UGC',
    screenName: 'Community Forums & Discussions',
    route: '/forum, /community',
    guestPerm: 'Read & Own UGC',
    editorPerm: 'Create & Edit Content',
    managerPerm: 'Approve & Manage',
    adminPerm: 'Full Admin Operations',
    superAdminPerm: 'Absolute Root Access'
  },
  {
    id: 'perm-04',
    category: 'Community & UGC',
    screenName: 'Create UGC Post, Comment, Video',
    route: '/forum/create, /upload',
    guestPerm: 'Read & Own UGC',
    editorPerm: 'Create & Edit Content',
    managerPerm: 'Approve & Manage',
    adminPerm: 'Full Admin Operations',
    superAdminPerm: 'Absolute Root Access'
  },
  {
    id: 'perm-05',
    category: 'Own Content Lifecycle',
    screenName: 'Edit & Delete Own Personal UGC',
    route: '/my-posts, /profile',
    guestPerm: 'Read & Own UGC',
    editorPerm: 'Create & Edit Content',
    managerPerm: 'Approve & Manage',
    adminPerm: 'Full Admin Operations',
    superAdminPerm: 'Absolute Root Access'
  },
  {
    id: 'perm-06',
    category: 'Moderation & Governance',
    screenName: 'Edit / Delete Others UGC (Moderate)',
    route: '/moderationqueue, /contentmoderator',
    guestPerm: 'Blocked',
    editorPerm: 'Create & Edit Content',
    managerPerm: 'Approve & Manage',
    adminPerm: 'Full Admin Operations',
    superAdminPerm: 'Absolute Root Access'
  },
  {
    id: 'perm-07',
    category: 'Creator & Commerce',
    screenName: 'My Storefront & Creator Products',
    route: '/mystorefront, /creatordashboard',
    guestPerm: 'Blocked',
    editorPerm: 'Create & Edit Content',
    managerPerm: 'Approve & Manage',
    adminPerm: 'Full Admin Operations',
    superAdminPerm: 'Absolute Root Access'
  },
  {
    id: 'perm-08',
    category: 'Member Administration',
    screenName: 'User & Members Console (Role Assignment)',
    route: '/members-console, /master-dashboard?tab=members',
    guestPerm: 'Blocked',
    editorPerm: 'Blocked',
    managerPerm: 'Blocked',
    adminPerm: 'Full Admin Operations',
    superAdminPerm: 'Absolute Root Access'
  },
  {
    id: 'perm-09',
    category: 'Operations & Business',
    screenName: 'E-Commerce Console & Order Escrow',
    route: '/master-dashboard?tab=ecommerce',
    guestPerm: 'Blocked',
    editorPerm: 'Blocked',
    managerPerm: 'Approve & Manage',
    adminPerm: 'Full Admin Operations',
    superAdminPerm: 'Absolute Root Access'
  },
  {
    id: 'perm-10',
    category: 'Treasury & Tokenomics',
    screenName: 'Financial Management & FIC Minting',
    route: '/treasury, /fic-minting, /inspectorate',
    guestPerm: 'Blocked',
    editorPerm: 'Blocked',
    managerPerm: 'Blocked',
    adminPerm: 'Blocked',
    superAdminPerm: 'Absolute Root Access'
  },
  {
    id: 'perm-11',
    category: 'Security & Root Access',
    screenName: 'Security Setup, SOC Monitoring & WORM Ledger',
    route: '/securitysetup, /monitoring, /governance/audit',
    guestPerm: 'Blocked',
    editorPerm: 'Blocked',
    managerPerm: 'Blocked',
    adminPerm: 'Full Admin Operations',
    superAdminPerm: 'Absolute Root Access'
  }
];

const DEFAULT_MEMBERS: PlatformMember[] = [
  {
    id: 'mem-001',
    name: 'Mr. Mbah Israel Obinna',
    username: 'obinnambah',
    email: 'fingermobileprotocol@gmail.com',
    phone: '+2348088855752',
    role: 'SuperAdmin',
    status: 'Active',
    kycTier: 'Tier 3 (Biometric)',
    biometricVerified: true,
    ficBalance: 3000000,
    storeCreditBalance: 750000.00,
    walletAddress: '0x71C...OBINNA-ROOT-VAULT',
    joinedDate: '2025-07-09',
    lastActive: 'Just now',
    isRootSuperAdmin: true,
    department: 'Platform Founder & Executive Office'
  },
  {
    id: 'mem-002',
    name: 'Mrs. Mbah Eunice Emonena',
    username: 'eunicembah',
    email: 'eunicembah@gmail.com',
    phone: '+2348033924846',
    role: 'Admin',
    status: 'Active',
    kycTier: 'Tier 3 (Biometric)',
    biometricVerified: true,
    ficBalance: 2000000,
    storeCreditBalance: 500000.00,
    walletAddress: '0x84E...EUNICE-ADMIN-VAULT',
    joinedDate: '2025-07-09',
    lastActive: '5m ago',
    department: 'Co-Founder & Platform Operations'
  },
  {
    id: 'mem-003',
    name: 'Mercy Kulem',
    username: 'mercy_kulem',
    email: 'mercy.kulem@fingermobileprotocol.com',
    phone: '+2348021122334',
    role: 'Manager',
    status: 'Active',
    kycTier: 'Tier 3 (Biometric)',
    biometricVerified: true,
    ficBalance: 1000000,
    storeCreditBalance: 250000.00,
    walletAddress: '0x92A...MERCY-MANAGER',
    joinedDate: '2025-08-14',
    lastActive: '1h ago',
    department: 'Trust, Safety & Governance'
  },
  {
    id: 'mem-004',
    name: 'Alex Johnson Audio Labs',
    username: 'alex_audio',
    email: 'alex.johnson@fingermobileprotocol.com',
    phone: '+2348055566778',
    role: 'Creator Pro',
    status: 'Active',
    kycTier: 'Tier 2',
    biometricVerified: true,
    ficBalance: 45200,
    storeCreditBalance: 11300.00,
    walletAddress: '0x33F...ALEX-STUDIO',
    joinedDate: '2026-01-20',
    lastActive: '12m ago',
    department: 'BeatwaveNG Sound Lab'
  },
  {
    id: 'mem-005',
    name: 'Chidiebere Okafor (New Member)',
    username: 'chidi_guest',
    email: 'chidi.okafor@gmail.com',
    phone: '+2348123456789',
    role: 'Guest',
    status: 'Active',
    kycTier: 'Tier 1',
    biometricVerified: false,
    ficBalance: 150,
    storeCreditBalance: 37.50,
    walletAddress: '0x11B...CHIDI-WALLET',
    joinedDate: '2026-10-13',
    lastActive: 'Just now',
    department: 'Community Member'
  },
  {
    id: 'mem-006',
    name: 'Fatima Al-Mansoor (Editor)',
    username: 'fatima_editor',
    email: 'fatima.editor@fingermobileprotocol.com',
    phone: '+971501234567',
    role: 'Editor',
    status: 'Active',
    kycTier: 'Tier 3 (Biometric)',
    biometricVerified: true,
    ficBalance: 18500,
    storeCreditBalance: 4625.00,
    walletAddress: '0x44E...FATIMA-EDITORIAL',
    joinedDate: '2026-04-12',
    lastActive: '25m ago',
    department: 'Content & Editorial Studio'
  }
];

const MasterMembersConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'directory' | 'roles' | 'matrix' | 'enforcement' | 'lifecycle'>('directory');
  const [members, setMembers] = useState<PlatformMember[]>(() => {
    try {
      const saved = localStorage.getItem('fingermobile_master_members_db');
      return saved ? JSON.parse(saved) : DEFAULT_MEMBERS;
    } catch {
      return DEFAULT_MEMBERS;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals & form state
  const [selectedMember, setSelectedMember] = useState<PlatformMember | null>(null);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isGrantFicModalOpen, setIsGrantFicModalOpen] = useState(false);
  const [ficGrantAmount, setFicGrantAmount] = useState<number>(500);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Member form
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<PredefinedRole>('Guest');

  // Edit Member Account Details Modal State
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<PredefinedRole>('Guest');
  const [editStatus, setEditStatus] = useState<PlatformMember['status']>('Active');
  const [editDepartment, setEditDepartment] = useState('');
  const [editStoreCreditBalance, setEditStoreCreditBalance] = useState<number>(0);
  const [editFicBalance, setEditFicBalance] = useState<number>(0);
  const [editKycTier, setEditKycTier] = useState<PlatformMember['kycTier']>('Tier 1');
  const [editBiometricVerified, setEditBiometricVerified] = useState(false);
  const [editCorporateRoleNumber, setEditCorporateRoleNumber] = useState<number>(0);
  const [editAssignedSubOffice, setEditAssignedSubOffice] = useState<string>('');
  const [editClearanceTier, setEditClearanceTier] = useState<string>('Tier 4 (Unit Lead)');
  const [editAssignedByAdmin, setEditAssignedByAdmin] = useState<string>('owner_mbah_israel_obinna');

  // Delete Member Account Modal State
  const [isDeleteMemberModalOpen, setIsDeleteMemberModalOpen] = useState(false);
  const [isPermanentDelete, setIsPermanentDelete] = useState(true);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Session Enforcement Simulator State
  const [simSelectedRole, setSimSelectedRole] = useState<PredefinedRole>('Guest');
  const [simSelectedScreen, setSimSelectedScreen] = useState<string>('/master-dashboard');
  const [simSelectedAction, setSimSelectedAction] = useState<string>('READ');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const persistMembers = (updated: PlatformMember[]) => {
    setMembers(updated);
    try {
      localStorage.setItem('fingermobile_master_members_db', JSON.stringify(updated));
    } catch {
      // LocalStorage error
    }
  };

  // Sync with backend API
  useEffect(() => {
    const fetchApiUsers = async () => {
      try {
        const res = await api.get('/admin/users');
        const userList = Array.isArray(res.data)
          ? res.data
          : (res.data?.users || res.data?.data || []);

        if (Array.isArray(userList) && userList.length > 0) {
          const apiMapped: PlatformMember[] = userList.map((u: any, idx: number) => ({
            id: `api-user-${u.id || idx}`,
            name: u.name || u.username || 'Platform Member',
            username: u.username || `user_${u.id}`,
            email: u.email || `${u.username}@fingermobileprotocol.com`,
            phone: u.phone || '+2348000000000',
            role: (u.role === 'admin' ? 'Admin' : 'Guest'),
            status: u.is_active === false ? 'Suspended' : 'Active',
            kycTier: 'Tier 1',
            biometricVerified: Boolean(u.biometric_verified),
            ficBalance: Number(u.fic_balance) || 100,
            walletAddress: `0x${u.id || idx}E...WALLET`,
            joinedDate: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : '2026-10-01',
            lastActive: 'Active'
          }));

          const existingEmails = new Set(DEFAULT_MEMBERS.map(m => m.email.toLowerCase()));
          const newApiUsers = apiMapped.filter(m => !existingEmails.has(m.email.toLowerCase()));
          if (newApiUsers.length > 0) {
            persistMembers([...DEFAULT_MEMBERS, ...newApiUsers]);
          }
        }
      } catch {
        // Fallback to rich DEFAULT_MEMBERS
      }
    };
    fetchApiUsers();
  }, []);

  // Filtered members list
  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || m.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [members, searchQuery, roleFilter, statusFilter]);

  // Executive stats
  const totalCount = members.length;
  const activeCount = members.filter(m => m.status === 'Active').length;
  const biometricVerifiedCount = members.filter(m => m.biometricVerified).length;
  const totalFicInCirculation = members.reduce((acc, m) => acc + (m.ficBalance || 0), 0);

  // Change Role Action
  const handleUpdateRole = (newRole: PredefinedRole) => {
    if (!selectedMember) return;
    if (selectedMember.isRootSuperAdmin) {
      showToast('SuperAdmin root authority cannot be modified or revoked.');
      return;
    }
    const updated = members.map(m =>
      m.id === selectedMember.id ? { ...m, role: newRole } : m
    );
    persistMembers(updated);
    showToast(`Role for ${selectedMember.name} updated to ${newRole}`);
    setIsEditRoleModalOpen(false);
  };

  // Instant Offboarding / Access Cut-Off Action
  const handleInstantOffboard = (member: PlatformMember) => {
    if (member.isRootSuperAdmin) {
      showToast('Cannot offboard Root SuperAdmin authority.');
      return;
    }
    const updated = members.map(m =>
      m.id === member.id ? { ...m, role: 'Guest' as PredefinedRole, status: 'Suspended' as const } : m
    );
    persistMembers(updated);
    showToast(`Instant Offboard executed for ${member.name}. Access revoked immediately.`);
  };

  // Toggle Account Freeze
  const handleToggleFreeze = (member: PlatformMember) => {
    if (member.isRootSuperAdmin) {
      showToast('Cannot freeze Root SuperAdmin authority.');
      return;
    }
    const nextStatus = member.status === 'Frozen' ? 'Active' : 'Frozen';
    const updated = members.map(m =>
      m.id === member.id ? { ...m, status: nextStatus as PlatformMember['status'] } : m
    );
    persistMembers(updated);
    showToast(`Account for ${member.name} is now ${nextStatus}`);
  };

  // Grant FIC tokens
  const handleGrantFic = () => {
    if (!selectedMember) return;
    const added = ficGrantAmount || 0;
    const updated = members.map(m =>
      m.id === selectedMember.id ? { ...m, ficBalance: m.ficBalance + added } : m
    );
    persistMembers(updated);
    showToast(`Granted ${added} FIC to ${selectedMember.name}`);
    setIsGrantFicModalOpen(false);
  };

  // Add new member
  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    const newM: PlatformMember = {
      id: `mem-${Date.now()}`,
      name: newMemberName,
      username: newMemberEmail.split('@')[0].toLowerCase(),
      email: newMemberEmail,
      phone: '+2348000000000',
      role: newMemberRole,
      status: 'Active',
      kycTier: 'Tier 1',
      biometricVerified: false,
      ficBalance: 100,
      walletAddress: `0x${Date.now().toString(16).slice(-6)}...GUEST`,
      joinedDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      department: 'Community Member'
    };

    persistMembers([newM, ...members]);
    showToast(`New member ${newMemberName} onboarded as ${newMemberRole}`);
    setIsAddMemberModalOpen(false);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberRole('Guest');
  };

  // Open Edit Member Account Details
  const openEditMemberModal = (member: PlatformMember) => {
    setSelectedMember(member);
    setEditName(member.name);
    setEditUsername(member.username);
    setEditEmail(member.email);
    setEditPhone(member.phone);
    setEditRole(member.role);
    setEditStatus(member.status);
    setEditDepartment(member.department || 'Community Member');
    setEditStoreCreditBalance(member.storeCreditBalance ?? 450);
    setEditFicBalance(member.ficBalance);
    setEditKycTier(member.kycTier);
    setEditBiometricVerified(member.biometricVerified);
    setEditCorporateRoleNumber(member.corporateRoleNumber || 0);
    setEditAssignedSubOffice(member.assignedSubOffice || '');
    setEditClearanceTier(member.clearanceTier || 'Tier 4 (Unit Lead)');
    setEditAssignedByAdmin('owner_mbah_israel_obinna');
    setIsEditMemberModalOpen(true);
  };

  // Save Member Account Details
  const handleSaveMemberDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;

    if (selectedMember.isRootSuperAdmin && editRole !== 'SuperAdmin') {
      showToast('Root SuperAdmin authority cannot be revoked or altered.');
      return;
    }

    const selectedCorporateRole = INITIAL_18_EXECUTIVE_ROLES.find(r => r.roleNumber === editCorporateRoleNumber);
    const appointmentCred = editCorporateRoleNumber > 0
      ? (selectedMember.appointmentCredentialId || `APPT-${editCorporateRoleNumber}-${Date.now().toString(36).toUpperCase()}`)
      : undefined;

    const updatedMember: PlatformMember = {
      ...selectedMember,
      name: editName.trim(),
      username: editUsername.trim().toLowerCase(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      role: editRole,
      status: editStatus,
      department: editDepartment.trim(),
      storeCreditBalance: Math.max(0, Number(editStoreCreditBalance) || 0),
      ficBalance: Math.max(0, Number(editFicBalance) || 0),
      kycTier: editKycTier,
      biometricVerified: editBiometricVerified,
      corporateRoleNumber: editCorporateRoleNumber > 0 ? editCorporateRoleNumber : undefined,
      corporateRoleTitle: selectedCorporateRole?.title,
      assignedSubOffice: editAssignedSubOffice.trim() || undefined,
      clearanceTier: editClearanceTier,
      appointmentCredentialId: appointmentCred
    };

    const updatedList = members.map(m => m.id === selectedMember.id ? updatedMember : m);
    persistMembers(updatedList);
    showToast(`Account details & portfolio for ${updatedMember.name} updated successfully.`);
    setIsEditMemberModalOpen(false);

    try {
      await api.put(`/admin/members/${selectedMember.id}`, {
        name: updatedMember.name,
        username: updatedMember.username,
        email: updatedMember.email,
        phone: updatedMember.phone,
        role: updatedMember.role,
        status: updatedMember.status,
        department: updatedMember.department,
        storeCreditBalance: updatedMember.storeCreditBalance,
        corporateRoleNumber: updatedMember.corporateRoleNumber,
        corporateRoleTitle: updatedMember.corporateRoleTitle,
        assignedSubOffice: updatedMember.assignedSubOffice
      });

      if (editCorporateRoleNumber > 0 && selectedCorporateRole) {
        await api.post('/governance/assign-member', {
          memberId: selectedMember.id,
          roleId: selectedCorporateRole.id,
          assignedBy: editAssignedByAdmin,
          memberDetails: {
            name: updatedMember.name,
            email: updatedMember.email
          }
        });
      }
    } catch {
      // Backend sync fallback
    }
  };

  // Open Delete Member Modal
  const openDeleteMemberModal = (member: PlatformMember) => {
    if (member.isRootSuperAdmin) {
      showToast('Irrevocable Root SuperAdmin founder account cannot be deleted or purged.');
      return;
    }
    setSelectedMember(member);
    setDeleteConfirmText('');
    setIsPermanentDelete(true);
    setIsDeleteMemberModalOpen(true);
  };

  // Confirm Delete Member
  const handleConfirmDeleteMember = async () => {
    if (!selectedMember) return;
    if (selectedMember.isRootSuperAdmin) {
      showToast('Root SuperAdmin founder account is protected.');
      setIsDeleteMemberModalOpen(false);
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/admin/members/${selectedMember.id}?permanent=${isPermanentDelete}`);
    } catch {
      // Fallback
    } finally {
      setIsDeleting(false);
    }

    if (isPermanentDelete) {
      const remaining = members.filter(m => m.id !== selectedMember.id);
      persistMembers(remaining);
      showToast(`Member account ${selectedMember.name} and related records permanently deleted.`);
    } else {
      const deactivated = members.map(m =>
        m.id === selectedMember.id ? { ...m, status: 'Suspended' as const, role: 'Guest' as PredefinedRole } : m
      );
      persistMembers(deactivated);
      showToast(`Member account ${selectedMember.name} deactivated.`);
    }
    setIsDeleteMemberModalOpen(false);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Name', 'Email', 'Role', 'Status', 'Biometric Verified', 'FIC Balance'];
    const rows = members.map(m => [
      m.id,
      `"${m.name}"`,
      m.email,
      m.role,
      m.status,
      m.biometricVerified ? 'YES' : 'NO',
      m.ficBalance
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fingermobile_members_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Member roster exported to CSV successfully.');
  };

  // Enforcement decision calculation
  const enforcementResult = useMemo(() => {
    const isRoot = simSelectedRole === 'SuperAdmin';
    const isGuest = simSelectedRole === 'Guest';
    const isEditor = simSelectedRole === 'Editor';
    const isManager = simSelectedRole === 'Manager';

    if (isRoot) {
      return {
        decision: '200_GRANTED',
        statusText: '200 GRANTED (Absolute Root SuperAdmin Authority)',
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
        reason: 'Mr. Mbah Israel Obinna holds absolute, irrevocable rights to all 210+ platform pages, screens, and minting policies.'
      };
    }

    if (simSelectedScreen === '/treasury' || simSelectedScreen === '/fic-minting') {
      return {
        decision: '403_FORBIDDEN',
        statusText: '403 FORBIDDEN (Strict Sovereign Minting Policy)',
        color: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
        reason: 'Only Founder & Owner Mbah Israel Obinna is authorized to issue and commission FIC minting under the FingerMobile Protocol Act.'
      };
    }

    if (simSelectedScreen.startsWith('/master-dashboard') || simSelectedScreen.startsWith('/members-console') || simSelectedScreen.startsWith('/securitysetup')) {
      if (isGuest || isEditor) {
        return {
          decision: '403_FORBIDDEN',
          statusText: '403 FORBIDDEN (Least Privilege Enforcement)',
          color: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
          reason: `${simSelectedRole} role is strictly prohibited from accessing Platform Administration and Security Consoles.`
        };
      }
      if (isManager && simSelectedScreen.startsWith('/securitysetup')) {
        return {
          decision: '403_FORBIDDEN',
          statusText: '403 FORBIDDEN (Restricted from Security Setup)',
          color: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
          reason: 'Managers are restricted from altering system security, firewalls, and cryptographic settings.'
        };
      }
    }

    if (simSelectedAction === 'DELETE_OTHERS_UGC') {
      if (isGuest || isEditor) {
        return {
          decision: '403_FORBIDDEN',
          statusText: '403 FORBIDDEN (Own UGC Policy Rule)',
          color: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
          reason: `${simSelectedRole} can only create and delete their OWN content. Modifying or deleting other members' UGC is restricted to Managers and Admins.`
        };
      }
    }

    return {
      decision: '200_GRANTED',
      statusText: '200 GRANTED (Permitted Under Assigned Role)',
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
      reason: `Action ${simSelectedAction} on ${simSelectedScreen} is explicitly permitted for ${simSelectedRole} under the Least-Privilege Role Policy.`
    };
  }, [simSelectedRole, simSelectedScreen, simSelectedAction]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-300 dark:border-slate-800 overflow-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 text-white border-b border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Users className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black tracking-tight text-white">
                    User, Members & Sovereign RBAC Permission Console
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500 text-white">
                    [FingerMobile™Protocol]
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  Role Assignment, Page/Screen Permission Mapping, Session Enforcement, Least Privilege & Instant Access Revocation
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1.5 transition shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Onboard Member
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Export Roster
            </button>
            <button
              onClick={() => showToast('Refreshed member database and session security cache')}
              className="p-2 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
            >
              <span title="Refresh member directory">
                <RefreshCw className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>

        {/* 5 Executive Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-200 font-bold">
              <span>Total Platform Members</span>
              <Users className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-lg font-black text-white mt-1">{totalCount.toLocaleString()} Members</div>
            <div className="text-[10px] text-emerald-400 font-semibold">{activeCount} Currently Active</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-200 font-bold">
              <span>Root Authorities</span>
              <Crown className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-black text-amber-400 mt-1">2 Root Accounts</div>
            <div className="text-[10px] text-slate-300 font-medium">Mbah Israel & Eunice</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-200 font-bold">
              <span>Predefined Roles</span>
              <Key className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-lg font-black text-purple-400 mt-1">5 Tiers</div>
            <div className="text-[10px] text-slate-300 font-medium">SuperAdmin &rarr; Guest</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-200 font-bold">
              <span>Biometric KYC Status</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-black text-emerald-400 mt-1">{biometricVerifiedCount} Verified</div>
            <div className="text-[10px] text-slate-300 font-medium">Live-Motion Face Auth</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-[11px] text-slate-200 font-bold">
              <span>Member FIC Holdings</span>
              <Coins className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div className="text-lg font-black text-orange-400 mt-1">{totalFicInCirculation.toLocaleString()} FIC</div>
            <div className="text-[10px] text-slate-300 font-medium">₦{(totalFicInCirculation * 500).toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 overflow-x-auto">
        {[
          { id: 'directory', label: `Member Directory (${filteredMembers.length})`, icon: Users },
          { id: 'roles', label: 'Predefined Roles & Root Access', icon: Key },
          { id: 'matrix', label: 'Screen Permission Matrix', icon: Layers },
          { id: 'enforcement', label: 'Session Enforcement Simulator', icon: Cpu },
          { id: 'lifecycle', label: 'Onboarding & Instant Revocation', icon: UserX },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: MEMBER DIRECTORY */}
      {activeTab === 'directory' && (
        <div className="p-6 space-y-6">
          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-orange-500 font-bold border-slate-300 placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-700" />
                <select
                  value={roleFilter}
                  onChange={e => setRoleFilter(e.target.value)}
                  className="text-xs py-2 px-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 font-medium font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Roles</option>
                  <option value="SuperAdmin">SuperAdmin</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Editor">Editor</option>
                  <option value="Creator Pro">Creator Pro</option>
                  <option value="Guest">Guest (Default)</option>
                </select>
              </div>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-xs py-2 px-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 font-medium font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Frozen">Frozen</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto border border-slate-300 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/70 text-[11px] uppercase font-black tracking-wider text-slate-700 border-b border-slate-300 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Member Identity</th>
                  <th className="py-3 px-4">Predefined Role</th>
                  <th className="py-3 px-4">Corporate Portfolio</th>
                  <th className="py-3 px-4 text-center">Biometric KYC</th>
                  <th className="py-3 px-4 text-right">FIC Balance</th>
                  <th className="py-3 px-4 text-right">Store Credit</th>
                  <th className="py-3 px-4 text-center">Account State</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredMembers.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-800 to-indigo-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {m.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                            {m.name}
                            {m.isRootSuperAdmin && (
                              <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-700 font-mono truncate">{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.role === 'SuperAdmin'
                          ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold dark:bg-amber-950 dark:text-amber-300'
                          : m.role === 'Admin'
                            ? 'bg-purple-100 text-purple-950 border border-purple-400 font-bold dark:bg-purple-950 dark:text-purple-300'
                            : m.role === 'Manager'
                              ? 'bg-blue-100 text-blue-950 border border-blue-400 font-bold dark:bg-blue-950 dark:text-blue-300'
                              : m.role === 'Editor'
                                ? 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-emerald-950 dark:text-emerald-300'
                                : m.role === 'Creator Pro'
                                  ? 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300'
                                  : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {m.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {m.corporateRoleTitle ? (
                        <div className="flex flex-col">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            Role {m.corporateRoleNumber}: {m.corporateRoleTitle}
                          </span>
                          {m.assignedSubOffice && (
                            <span className="text-[9px] text-slate-700 dark:text-slate-300 font-medium mt-0.5 truncate max-w-[200px]">
                              {m.assignedSubOffice}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-700 dark:text-slate-300 italic text-[10px] font-medium">
                          Unassigned (Member)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.biometricVerified
                          ? 'bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-200'
                      } border border-emerald-400 font-black`}>
                        {m.biometricVerified ? <CheckCircle className="w-3 h-3 text-emerald-500" /> : null}
                        {m.biometricVerified ? 'Live Verified' : 'Tier 1 Basic'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-orange-600 dark:text-orange-400">
                      {m.ficBalance.toLocaleString()} FIC
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${(m.storeCreditBalance ?? 450).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-emerald-950 dark:text-emerald-300'
                          : m.status === 'Frozen'
                            ? 'bg-blue-100 text-emerald-950 border border-emerald-400 font-bold dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-rose-100 text-emerald-950 dark:bg-rose-950 dark:text-rose-300'
                      }font-black`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditMemberModal(m)}
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg transition"
                          title="Update Member Account Details & Information"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMember(m);
                            setIsEditRoleModalOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-lg transition"
                          title="Swap Predefined Role"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMember(m);
                            setIsGrantFicModalOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950 rounded-lg transition"
                          title="Grant FIC Tokens"
                        >
                          <Coins className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleFreeze(m)}
                          className={`p-1.5 rounded-lg transition ${
                            m.status === 'Frozen'
                              ? 'text-blue-600 hover:bg-blue-50'
                              : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
                          }`}
                          title={m.status === 'Frozen' ? 'Unfreeze Account' : 'Freeze Account'}
                        >
                          {m.status === 'Frozen' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => handleInstantOffboard(m)}
                          className="p-1.5 text-slate-600 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950 rounded-lg transition"
                          title="Instant Access Revocation / Offboard"
                        >
                          <UserX className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteMemberModal(m)}
                          disabled={m.isRootSuperAdmin}
                          className={`p-1.5 rounded-lg transition ${
                            m.isRootSuperAdmin
                              ? 'text-slate-700 dark:text-slate-700 cursor-not-allowed'
                              : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950'
                          }`}
                          title={m.isRootSuperAdmin ? 'Root SuperAdmin Cannot Be Deleted' : 'Delete Member Account Details & Information'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PREDEFINED ROLES & ROOT ACCESS REGISTRY */}
      {activeTab === 'roles' && (
        <div className="p-6 space-y-6">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-2xl p-4 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <h4 className="font-bold text-amber-900 dark:text-amber-300">
                Hardcoded Root Access Exclusion & Predefined Role Hierarchy
              </h4>
              <p className="text-amber-800 dark:text-amber-400 mt-0.5">
                Founder Mbah Israel Obinna holds hardcoded, immutable root credentials. All other platform members receive role-based access strictly governed by the Principle of Least Privilege.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PREDEFINED_ROLES_SPEC.map(spec => (
              <div
                key={spec.role}
                className="p-5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${spec.badgeColor}`}>
                    {spec.role}
                  </span>
                  {spec.rootProtected && (
                    <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      Root Authority
                    </span>
                  )}
                  {spec.defaultForNewMembers && (
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      Default on SignUp
                    </span>
                  )}
                </div>

                <h4 className="font-black text-sm text-slate-900 dark:text-white">{spec.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">{spec.description}</p>

                <div className="pt-2 border-t border-slate-300 dark:border-slate-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-700">Granted Scope:</div>
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-0.5">{spec.accessScope}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SCREEN PERMISSION MAPPING MATRIX */}
      {activeTab === 'matrix' && (
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Platform Page & Screen Permission Mapping Matrix
              </h3>
              <p className="text-xs text-slate-700">
                Least-privilege mapping across all core public, UGC, commerce, governance, and treasury screens
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-950 dark:bg-blue-950 dark:text-blue-300 border border-blue-400 dark:border-blue-900   font-black">
              Active Policy Matrix V4.2
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-300 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/70 text-[11px] uppercase font-black tracking-wider text-slate-700 border-b border-slate-300 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Screen / Service</th>
                  <th className="py-3 px-4 text-center">Guest (New Member)</th>
                  <th className="py-3 px-4 text-center">Editor</th>
                  <th className="py-3 px-4 text-center">Manager</th>
                  <th className="py-3 px-4 text-center">Admin</th>
                  <th className="py-3 px-4 text-center">SuperAdmin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {PERMISSION_MATRIX.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{row.screenName}</div>
                      <div className="text-[10px] text-slate-700 font-mono">{row.route}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.guestPerm === 'Blocked'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : row.guestPerm === 'Read & Own UGC'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {row.guestPerm}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.editorPerm === 'Blocked'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {row.editorPerm}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.managerPerm === 'Blocked'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}>
                        {row.managerPerm}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.adminPerm === 'Blocked'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      }`}>
                        {row.adminPerm}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        {row.superAdminPerm}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SESSION ENFORCEMENT SIMULATOR */}
      {activeTab === 'enforcement' && (
        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-blue-600 text-white">
                <Cpu className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  Real-Time Session Access & Enforcement Inspector
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                  Simulate live member login sessions to evaluate access decisions against specific Pages, Screens, Services, and Actions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  1. Member Role to Test:
                </label>
                <select
                  value={simSelectedRole}
                  onChange={e => setSimSelectedRole(e.target.value as any)}
                  className="w-full text-xs py-2.5 px-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Guest">Guest / Standard Member (Default)</option>
                  <option value="Editor">Editor (Publishing)</option>
                  <option value="Manager">Manager (Approvals)</option>
                  <option value="Admin">Administrator (Operations)</option>
                  <option value="SuperAdmin">SuperAdmin (Root Authority)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  2. Requested Page / Screen:
                </label>
                <select
                  value={simSelectedScreen}
                  onChange={e => setSimSelectedScreen(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="/master-dashboard">/master-dashboard (Master Console)</option>
                  <option value="/forum">/forum (Community Forum Feed)</option>
                  <option value="/forum/create">/forum/create (Create Forum Post)</option>
                  <option value="/marketplace">/marketplace (Public Marketplace)</option>
                  <option value="/mystorefront">/mystorefront (Creator Storefront)</option>
                  <option value="/members-console">/members-console (User & Members Console)</option>
                  <option value="/treasury">/treasury (Treasury & Minting)</option>
                  <option value="/securitysetup">/securitysetup (Security Setup & 2FA)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  3. Action Attempted:
                </label>
                <select
                  value={simSelectedAction}
                  onChange={e => setSimSelectedAction(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold border-slate-300 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="READ">READ (View Page Content)</option>
                  <option value="WRITE_CREATE_UGC">WRITE_CREATE_UGC (Publish Post / Comment)</option>
                  <option value="EDIT_OWN_UGC">EDIT_OWN_UGC (Modify Own Content)</option>
                  <option value="DELETE_OWN_UGC">DELETE_OWN_UGC (Remove Own Content)</option>
                  <option value="DELETE_OTHERS_UGC">DELETE_OTHERS_UGC (Moderate Other Users)</option>
                  <option value="SYSTEM_CONFIG">SYSTEM_CONFIG (Alter Security / Minting)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Real-time enforcement evaluation card */}
          <div className="p-6 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Evaluation Output
              </span>
              <span className="text-[10px] font-mono text-slate-700">
                Session Token Evaluated: JWT_ENFORCEMENT_V4
              </span>
            </div>

            <div className={`p-4 rounded-xl border font-bold text-sm flex items-center gap-2 ${enforcementResult.color}`}>
              {enforcementResult.decision === '200_GRANTED' ? (
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              )}
              <span>{enforcementResult.statusText}</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-800 text-xs space-y-2">
              <div className="font-bold text-slate-900 dark:text-white">Policy Decision Rationale:</div>
              <p className="text-slate-600 dark:text-slate-300">{enforcementResult.reason}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ONBOARDING & INSTANT OFFBOARDING LIFECYCLE */}
      {activeTab === 'lifecycle' && (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Onboarding Overview */}
            <div className="p-6 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-500" />
                <h4 className="font-black text-sm text-slate-900 dark:text-white">
                  Fast Member & Employee Onboarding
                </h4>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Every new member joins under the default <strong>Guest</strong> tier (Read / Create Own UGC). Upgrading to Editor, Manager, or Creator Pro is executed with a single role swap, instantly provisioning the required screen permissions.
              </p>
              <button
                onClick={() => setIsAddMemberModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Onboard New Member Now
              </button>
            </div>

            {/* Instant Offboarding & Access Cut-Off */}
            <div className="p-6 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="flex items-center gap-2">
                <UserX className="w-5 h-5 text-rose-500" />
                <h4 className="font-black text-sm text-slate-900 dark:text-white">
                  Instant Access Revocation & Offboarding
                </h4>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                When an employee leaves or a creator contract ends, revoking their role cuts off access immediately across all sessions, preventing insider threats and eliminating data leak risks.
              </p>
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs text-rose-700 dark:text-rose-300">
                To execute an instant cut-off, click the <strong>UserX</strong> icon on any member in the Member Directory.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {isEditRoleModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-slate-300 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-300 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">
                    Swap Predefined Role
                  </h3>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    Sovereign RBAC Governance & Screen Permission Assignment
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditRoleModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-700 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 mx-5 mt-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/80 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {selectedMember.name}
                </div>
                <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-medium truncate">
                  {selectedMember.email}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[10px] uppercase font-bold text-slate-800 dark:text-slate-200">Current Role</div>
                <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-extrabold ${
                  PREDEFINED_ROLES_SPEC.find(s => s.role === selectedMember.role)?.badgeColor || 'bg-slate-700 text-white'
                }`}>
                  {selectedMember.role}
                </span>
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-2.5 flex-1 max-h-[55vh]">
              <label className="text-xs font-black tracking-wide text-slate-700 dark:text-slate-200 flex items-center justify-between">
                <span>Select New Predefined Role:</span>
                <span className="text-[10px] font-bold text-slate-700">Instant Enforcement</span>
              </label>

              <div className="grid grid-cols-1 gap-2.5">
                {PREDEFINED_ROLES_SPEC.map(spec => {
                  const isCurrent = selectedMember.role === spec.role;
                  return (
                    <button
                      key={spec.role}
                      type="button"
                      onClick={() => handleUpdateRole(spec.role)}
                      className={`w-full p-3.5 text-left rounded-xl border transition-all flex items-start gap-3 group ${
                        isCurrent
                          ? 'bg-orange-500/10 dark:bg-orange-950/40 border-orange-500 dark:border-orange-500 ring-2 ring-orange-500/30 shadow-xs'
                          : 'bg-white dark:bg-slate-800/90 border-slate-300 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500/70 hover:bg-orange-50/30 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isCurrent ? (
                          <CheckCircle className="w-4 h-4 text-orange-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover:border-orange-400 transition" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            {spec.role}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${spec.badgeColor}`}>
                            {spec.role}
                          </span>
                          {spec.defaultForNewMembers && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                              Default New Member
                            </span>
                          )}
                          {spec.rootProtected && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                              Root Authority
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                          {spec.description}
                        </p>

                        <div className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 mt-1 flex items-center gap-1.5">
                          <span className="font-bold text-slate-600 dark:text-slate-300">Scope:</span>
                          <span className="truncate">{spec.accessScope}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 rounded-b-2xl flex items-center justify-between">
              <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                Click any role to apply immediately.
              </span>
              <button
                type="button"
                onClick={() => setIsEditRoleModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grant FIC Modal */}
      {isGrantFicModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-300 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-300 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">
                    Grant FIC Treasury Tokens
                  </h3>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    Direct Treasury Allotment (Dual-Currency Peg 1 FIC = ₦500 / $0.50)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGrantFicModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-700 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700">
                <div className="text-xs font-black text-slate-900 dark:text-white">
                  Recipient: {selectedMember.name}
                </div>
                <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-medium">
                  {selectedMember.email} &bull; Current Balance: <span className="font-bold text-orange-500">{selectedMember.ficBalance.toLocaleString()} FIC</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                  Amount in FIC:
                </label>
                <input
                  type="number"
                  min="1"
                  value={ficGrantAmount}
                  onChange={e => setFicGrantAmount(parseInt(e.target.value) || 0)}
                  className="w-full mt-1.5 px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-orange-500 focus:outline-hidden placeholder:text-slate-500 font-mono"
                />
                <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-1 font-mono">
                  Valuation: ₦{(ficGrantAmount * 500).toLocaleString()} &bull; ${(ficGrantAmount * 0.5).toLocaleString()} USD
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-300 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGrantFicModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGrantFic}
                  className="px-5 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-xs transition"
                >
                  Confirm Grant
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onboard Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-300 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-300 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">
                    Onboard New Member
                  </h3>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    Add new user with predefined role and least-privilege policy
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddMemberModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-700 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Full Name:</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={e => setNewMemberName(e.target.value)}
                  placeholder="e.g. Samuel Adeyemi"
                  className="w-full mt-1.5 px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden font-bold placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Email Address:</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={e => setNewMemberEmail(e.target.value)}
                  placeholder="e.g. samuel@example.com"
                  className="w-full mt-1.5 px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 focus:outline-hidden font-bold placeholder:text-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Predefined Role:</label>
                <select
                  value={newMemberRole}
                  onChange={e => setNewMemberRole(e.target.value as any)}
                  className="w-full mt-1.5 px-3.5 py-2.5 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
                >
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="Guest">Guest / Standard Member (Recommended Default)</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="Editor">Editor</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="Manager">Manager</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="Creator Pro">Creator Pro</option>
                  <option className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value="Admin">Administrator</option>
                </select>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium mt-1">
                  Default Guest role follows the Least Privilege Security Protocol.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-300 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-xs transition"
                >
                  Onboard Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE MEMBER ACCOUNT DETAILS & INFORMATION MODAL */}
      {isEditMemberModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-300 dark:border-slate-800 shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    Update Member Account Details
                    {selectedMember.isRootSuperAdmin && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                        Root Founder Protected
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    ID: {selectedMember.id} &bull; Joined: {selectedMember.joinedDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditMemberModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-700 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMemberDetails} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="w-full mt-1.5 px-3.5 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Username</label>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={e => setEditUsername(e.target.value)}
                    className="w-full mt-1.5 px-3.5 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    className="w-full mt-1.5 px-3.5 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    className="w-full mt-1.5 px-3.5 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Predefined Role</label>
                  <select
                    value={editRole}
                    disabled={selectedMember.isRootSuperAdmin}
                    onChange={e => setEditRole(e.target.value as PredefinedRole)}
                    className="w-full mt-1.5 px-3.5 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:opacity-60"
                  >
                    <option value="SuperAdmin">SuperAdmin (Root Authority)</option>
                    <option value="Admin">Administrator</option>
                    <option value="Manager">Manager</option>
                    <option value="Editor">Editor</option>
                    <option value="Creator Pro">Creator Pro</option>
                    <option value="Guest">Guest / Standard Member</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Account State / Status</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as PlatformMember['status'])}
                    className="w-full mt-1.5 px-3.5 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Active">Active</option>
                    <option value="Frozen">Frozen</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Pending KYC">Pending KYC</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Department / Organization</label>
                  <input
                    type="text"
                    value={editDepartment}
                    onChange={e => setEditDepartment(e.target.value)}
                    className="w-full mt-1.5 px-3.5 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-200">Biometric KYC Tier</label>
                  <select
                    value={editKycTier}
                    onChange={e => setEditKycTier(e.target.value as PlatformMember['kycTier'])}
                    className="w-full mt-1.5 px-3.5 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Tier 1">Tier 1</option>
                    <option value="Tier 2">Tier 2</option>
                    <option value="Tier 3 (Biometric)">Tier 3 (Biometric)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Store Credit Balance ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editStoreCreditBalance}
                    onChange={e => setEditStoreCreditBalance(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1.5 px-3.5 py-2 text-xs border border-emerald-300 dark:border-emerald-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-emerald-400 font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden border-slate-300 placeholder:text-slate-500"
                  />
                  <p className="text-[10px] text-slate-700 font-medium mt-1">25% split from platform earnings algorithm</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-orange-600 dark:text-orange-400">
                    FIC Token Balance
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editFicBalance}
                    onChange={e => setEditFicBalance(parseInt(e.target.value) || 0)}
                    className="w-full mt-1.5 px-3.5 py-2 text-xs border border-orange-300 dark:border-orange-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-orange-400 font-mono font-bold focus:ring-2 focus:ring-orange-500 focus:outline-hidden border-slate-300 placeholder:text-slate-500"
                  />
                  <p className="text-[10px] text-slate-700 font-medium mt-1">Liquid FIC balance for on-chain/in-app transfer</p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={editBiometricVerified}
                    onChange={e => setEditBiometricVerified(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-emerald-500 font-bold border bg-white focus:ring-2 placeholder:text-slate-500"
                  />
                  <span>Biometric Passkey Verified & Hardware Attested</span>
                </label>
              </div>

              {/* Corporate Governance Executive Portfolio Assignment */}
              <div className="pt-4 mt-2 border-t border-slate-300 dark:border-slate-800 space-y-3">
                <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200">
                  <div className="font-bold flex items-center gap-1.5 text-indigo-900 dark:text-indigo-100 mb-1">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Corporate Governance Executive Portfolio Assignment (RBAC)
                  </div>
                  <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80 leading-relaxed">
                    Once a member is onboarded, their corporate portfolio, sub-office, and executive clearance can be assigned and edited <strong>ONLY by Founder Mr. Mbah Israel Obinna or Co-Founder Mrs. Mbah Eunice Emonena (CFO)</strong>.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Corporate Leadership Portfolio (18 Roles)
                    </label>
                    <select
                      value={editCorporateRoleNumber}
                      onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        setEditCorporateRoleNumber(val);
                        const roleObj = INITIAL_18_EXECUTIVE_ROLES.find(r => r.roleNumber === val);
                        if (roleObj && roleObj.subOffices.length > 0) {
                          setEditAssignedSubOffice(roleObj.subOffices[0].name);
                          setEditClearanceTier(roleObj.clearanceLevel);
                        } else {
                          setEditAssignedSubOffice('');
                        }
                      }}
                      className="w-full mt-1.5 px-3.5 py-2 text-xs border border-indigo-300 dark:border-indigo-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-indigo-200 font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-hidden border-slate-300"
                    >
                      <option value={0}>-- No Corporate Executive Role (Standard User) --</option>
                      {INITIAL_18_EXECUTIVE_ROLES.map(r => (
                        <option key={r.id} value={r.roleNumber}>
                          Role {r.roleNumber}: {r.title} [{r.raciCode}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Sub-Office / Functional Unit
                    </label>
                    <select
                      value={editAssignedSubOffice}
                      onChange={e => setEditAssignedSubOffice(e.target.value)}
                      disabled={editCorporateRoleNumber === 0}
                      className="w-full mt-1.5 px-3.5 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:opacity-50 font-bold"
                    >
                      <option value="">-- Primary Executive Officer Direct --</option>
                      {INITIAL_18_EXECUTIVE_ROLES.find(r => r.roleNumber === editCorporateRoleNumber)?.subOffices.map(sub => (
                        <option key={sub.id} value={sub.name}>
                          {sub.name} ({sub.unitType})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Delegated Authority (DoA) Clearance Tier
                    </label>
                    <select
                      value={editClearanceTier}
                      onChange={e => setEditClearanceTier(e.target.value)}
                      disabled={editCorporateRoleNumber === 0}
                      className="w-full mt-1.5 px-3.5 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden disabled:opacity-50 font-bold"
                    >
                      <option value="Tier 1 (Board)">Tier 1 (Board of Directors)</option>
                      <option value="Tier 2 (ExCo)">Tier 2 (ExCo / GMD / CFO)</option>
                      <option value="Tier 3 (ED / Group Head)">Tier 3 (ED / Group Head)</option>
                      <option value="Tier 4 (Unit Lead)">Tier 4 (Unit Lead)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      Authorizing Platform Root Authority
                    </label>
                    <select
                      value={editAssignedByAdmin}
                      onChange={e => setEditAssignedByAdmin(e.target.value)}
                      className="w-full mt-1.5 px-3.5 py-2 text-xs border border-purple-300 dark:border-purple-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-purple-200 font-bold focus:ring-2 focus:ring-purple-500 focus:outline-hidden border-slate-300"
                    >
                      <option value="owner_mbah_israel_obinna">
                        Mr. Mbah Israel Obinna (Founder & SuperAdmin)
                      </option>
                      <option value="owner_mbah_eunice_emonena">
                        Mrs. Mbah Eunice Emonena (Co-Founder & CFO)
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-300 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditMemberModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Account Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MEMBER ACCOUNT DETAILS & INFORMATION MODAL */}
      {isDeleteMemberModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-rose-200 dark:border-rose-900 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-300 dark:border-slate-800 bg-rose-50 dark:bg-rose-950/40">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">
                    Delete Member Account
                  </h3>
                  <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    Permanent account removal & security revocation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDeleteMemberModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-700 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-xs space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">{selectedMember.name}</div>
                <div className="text-slate-700 dark:text-slate-300 font-medium font-mono">
                  @{selectedMember.username} &bull; {selectedMember.email}
                </div>
                <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                  Store Credit: <span className="font-bold text-emerald-500">${(selectedMember.storeCreditBalance ?? 450).toFixed(2)}</span> &bull; FIC: <span className="font-bold text-orange-500">{selectedMember.ficBalance.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 p-3 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <div>
                  <strong>Warning:</strong> Deleting this member will revoke all screen permissions, wipe active sessions, and remove biometric enclave authorization.
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200">
                  <input
                    type="radio"
                    name="deleteMode"
                    checked={isPermanentDelete}
                    onChange={() => setIsPermanentDelete(true)}
                    className="text-slate-900 focus:ring-rose-500 font-bold border border-slate-300 rounded bg-white focus:ring-2 placeholder:text-slate-500"
                  />
                  <span>Permanent Purge (Delete from Database, Wallets & StoreCredit Ledgers)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200">
                  <input
                    type="radio"
                    name="deleteMode"
                    checked={!isPermanentDelete}
                    onChange={() => setIsPermanentDelete(false)}
                    className="text-slate-900 focus:ring-rose-500 font-bold border border-slate-300 rounded bg-white focus:ring-2 placeholder:text-slate-500"
                  />
                  <span>Soft Deactivation (Suspend Account & Revoke Screen Access)</span>
                </label>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Type <span className="text-rose-600 dark:text-rose-400 font-mono font-black">{selectedMember.username}</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={e => setDeleteConfirmText(e.target.value)}
                  placeholder={selectedMember.username}
                  className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-rose-500 focus:outline-hidden font-bold placeholder:text-slate-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-300 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDeleteMemberModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteConfirmText !== selectedMember.username || isDeleting}
                  onClick={handleConfirmDeleteMember}
                  className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {isDeleting ? 'Deleting...' : isPermanentDelete ? 'Permanently Delete Member' : 'Deactivate Member'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterMembersConsole;
