import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  Building2,
  Users,
  Award,
  FileText,
  Key,
  Lock,
  Search,
  Filter,
  Download,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Layers,
  Cpu,
  Coins,
  DollarSign,
  Briefcase,
  UserCheck,
  UserPlus,
  Compass,
  Scale,
  Workflow,
  Radio,
  Landmark,
  FileCheck2,
  Printer
} from 'lucide-react';
import {
  ExecutiveRole,
  SubOfficeUnit,
  TechnicalDoAItem,
  RaciMatrixRow,
  SodSafeguardRule,
  INITIAL_18_EXECUTIVE_ROLES,
  TECHNICAL_DOA_MATRIX,
  CROSS_FUNCTIONAL_RACI_MATRIX,
  RACI_ROLES_LEGEND,
  SOD_SAFEGUARDS,
  getStoredCorporateRoles,
  saveStoredCorporateRoles
} from '../../constants/corporateGovernanceData';
import { PLATFORM_OWNERSHIP, DEDICATED_TREASURY_RAIL } from '../../constants/platformOwnership';
import { downloadCorporateGovernanceManualPdf } from '../../utils/corporateGovernanceManualPdf';
import api from '../../services/api';

interface CorporateGovernanceConsoleProps {
  onClose?: () => void;
}

export const CorporateGovernanceConsole: React.FC<CorporateGovernanceConsoleProps> = () => {
  const [activeTab, setActiveTab] = useState<'roles' | 'doa' | 'raci' | 'sod' | 'rbac' | 'manual'>('roles');
  const [roles, setRoles] = useState<ExecutiveRole[]>(() => getStoredCorporateRoles());
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>('ROLE-01');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [selectedRoleForEdit, setSelectedRoleForEdit] = useState<ExecutiveRole | null>(null);
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [selectedRoleForSubOffice, setSelectedRoleForSubOffice] = useState<ExecutiveRole | null>(null);
  const [isAddSubOfficeModalOpen, setIsAddSubOfficeModalOpen] = useState(false);
  const [isAssignMemberModalOpen, setIsAssignMemberModalOpen] = useState(false);
  const [selectedRoleForAssignment, setSelectedRoleForAssignment] = useState<ExecutiveRole | null>(null);

  // Form State for Role Edit/Add
  const [formRoleTitle, setFormRoleTitle] = useState('');
  const [formDepartment, setFormDepartment] = useState('');
  const [formDesignatedOfficer, setFormDesignatedOfficer] = useState('');
  const [formClearanceLevel, setFormClearanceLevel] = useState<ExecutiveRole['clearanceLevel']>('Tier 3 (ED / Group Head)');
  const [formMandate, setFormMandate] = useState('');
  const [formResponsibilities, setFormResponsibilities] = useState('');

  // Form State for Sub-office Add
  const [formSubName, setFormSubName] = useState('');
  const [formSubUnitType, setFormSubUnitType] = useState<SubOfficeUnit['unitType']>('Functional Unit');
  const [formSubDuties, setFormSubDuties] = useState('');
  const [formSubTalent, setFormSubTalent] = useState('');
  const [formSubTools, setFormSubTools] = useState('');
  const [formSubCapital, setFormSubCapital] = useState('');

  // DoA Interactive Simulator State
  const [simDoaActionId, setSimDoaActionId] = useState<string>('DOA-01');
  const [simDoaAmountUsd, setSimDoaAmountUsd] = useState<number>(75000);

  // RACI Highlight State
  const [raciHighlightedRole, setRaciHighlightedRole] = useState<string>('ALL');

  // RBAC Member Assignment State
  const [membersList, setMembersList] = useState<any[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [selectedSubOfficeId, setSelectedSubOfficeId] = useState<string>('');
  const [assignedByAdmin, setAssignedByAdmin] = useState<string>('owner_mbah_israel_obinna');
  const [lastAppointmentCredential, setLastAppointmentCredential] = useState<any | null>(null);

  // Sync roles with backend on mount
  useEffect(() => {
    const fetchBackendRoles = async () => {
      try {
        const res = await api.get('/governance/roles');
        if (res.data?.success && Array.isArray(res.data?.data) && res.data.data.length > 0) {
          setRoles(res.data.data);
          saveStoredCorporateRoles(res.data.data);
        }
      } catch (err) {
        // Fallback to local storage or defaults
      }
    };
    fetchBackendRoles();

    // Load members for RBAC bridge from backend
    const fetchMembers = async () => {
      try {
        const res = await api.get('/admin/members');
        const list = res.data?.data || res.data?.members || (Array.isArray(res.data) ? res.data : []);
        if (Array.isArray(list) && list.length > 0) {
          setMembersList(list);
          return;
        }
      } catch {
        // Fallback to local storage or defaults
      }
      try {
        const savedMembers = localStorage.getItem('fingermobile_master_members_db');
        if (savedMembers) {
          setMembersList(JSON.parse(savedMembers));
        }
      } catch {
        // Ignore
      }
    };
    fetchMembers();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const persistRoles = (updatedRoles: ExecutiveRole[]) => {
    setRoles(updatedRoles);
    saveStoredCorporateRoles(updatedRoles);
  };

  // Departments List
  const departments = useMemo(() => {
    const set = new Set(roles.map((r) => r.department));
    return Array.from(set);
  }, [roles]);

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.designatedOfficer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.primaryMandate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.raciCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = departmentFilter === 'all' || r.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [roles, searchQuery, departmentFilter]);

  // Handle Edit Role Open
  const handleOpenEditRole = (role: ExecutiveRole) => {
    setSelectedRoleForEdit(role);
    setFormRoleTitle(role.title);
    setFormDepartment(role.department);
    setFormDesignatedOfficer(role.designatedOfficer);
    setFormClearanceLevel(role.clearanceLevel);
    setFormMandate(role.primaryMandate);
    setFormResponsibilities(role.coreResponsibilities.join('\n'));
    setIsEditRoleModalOpen(true);
  };

  // Save Role Edit
  const handleSaveRoleEdit = async () => {
    if (!selectedRoleForEdit) return;
    const updatedResponsibilities = formResponsibilities
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const updatedRole: ExecutiveRole = {
      ...selectedRoleForEdit,
      title: formRoleTitle,
      department: formDepartment,
      designatedOfficer: formDesignatedOfficer,
      clearanceLevel: formClearanceLevel,
      primaryMandate: formMandate,
      coreResponsibilities: updatedResponsibilities
    };

    const nextRoles = roles.map((r) => (r.id === updatedRole.id ? updatedRole : r));
    persistRoles(nextRoles);
    setIsEditRoleModalOpen(false);
    showToast(`Role ${updatedRole.title} updated successfully.`);

    // Async sync to backend
    try {
      await api.put(`/governance/roles/${updatedRole.id}`, updatedRole);
    } catch {
      // Local copy saved
    }
  };

  // Open Add Role
  const handleOpenAddRole = () => {
    const nextNum = roles.length + 1;
    setFormRoleTitle('');
    setFormDepartment('Executive Management');
    setFormDesignatedOfficer('');
    setFormClearanceLevel('Tier 3 (ED / Group Head)');
    setFormMandate('');
    setFormResponsibilities('');
    setIsAddRoleModalOpen(true);
  };

  // Save Add Role
  const handleSaveAddRole = async () => {
    const nextNum = roles.length + 1;
    const newRole: ExecutiveRole = {
      id: `ROLE-${String(nextNum).padStart(2, '0')}`,
      roleNumber: nextNum,
      raciCode: `R${nextNum}`,
      title: formRoleTitle || `Group Executive Portfolio ${nextNum}`,
      department: formDepartment || 'Executive Directorate',
      designatedOfficer: formDesignatedOfficer || 'Appointed Officer',
      clearanceLevel: formClearanceLevel,
      primaryMandate: formMandate || 'Directs specialized corporate functions under Protocol DoA mandate.',
      coreResponsibilities: formResponsibilities
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0),
      reportingLines: {
        administrativeSupervisor: 'Group Managing Director & CEO (Solid Line)',
        governanceBoardOversight: 'Board Executive Committee (Dotted Line)',
        statutoryFocus: 'Enterprise performance and statutory compliance'
      },
      subOffices: [],
      activePersonnelCount: 1,
      status: 'OPERATIONAL'
    };

    const nextRoles = [...roles, newRole];
    persistRoles(nextRoles);
    setIsAddRoleModalOpen(false);
    showToast(`New Executive Role ${newRole.title} added successfully.`);

    try {
      await api.post('/governance/roles', newRole);
    } catch {
      // Local fallback
    }
  };

  // Open Add Sub-Office
  const handleOpenAddSubOffice = (role: ExecutiveRole) => {
    setSelectedRoleForSubOffice(role);
    setFormSubName('');
    setFormSubUnitType('Functional Unit');
    setFormSubDuties('');
    setFormSubTalent('');
    setFormSubTools('');
    setFormSubCapital('');
    setIsAddSubOfficeModalOpen(true);
  };

  // Save Add Sub-Office
  const handleSaveAddSubOffice = async () => {
    if (!selectedRoleForSubOffice) return;
    const newUnit: SubOfficeUnit = {
      id: `U-${selectedRoleForSubOffice.roleNumber}-${Date.now().toString(36).toUpperCase()}`,
      name: formSubName || 'New Functional Unit',
      unitType: formSubUnitType,
      rolesAndResponsibilities: formSubDuties || 'Executes specialized operational responsibilities.',
      resources: {
        humanTalent: formSubTalent || 'Specialist Staff',
        techTools: formSubTools || 'Enterprise Software Suites',
        capitalBudget: formSubCapital || 'Operational OPEX Reserve'
      }
    };

    const nextRoles = roles.map((r) => {
      if (r.id === selectedRoleForSubOffice.id) {
        return {
          ...r,
          subOffices: [...r.subOffices, newUnit]
        };
      }
      return r;
    });

    persistRoles(nextRoles);
    setIsAddSubOfficeModalOpen(false);
    showToast(`Sub-office ${newUnit.name} added to ${selectedRoleForSubOffice.title}.`);

    try {
      await api.post(`/governance/roles/${selectedRoleForSubOffice.id}/sub-offices`, newUnit);
    } catch {
      // Local fallback
    }
  };

  // Delete Sub-Office
  const handleDeleteSubOffice = async (roleId: string, subId: string) => {
    const nextRoles = roles.map((r) => {
      if (r.id === roleId) {
        return {
          ...r,
          subOffices: r.subOffices.filter((u) => u.id !== subId)
        };
      }
      return r;
    });
    persistRoles(nextRoles);
    showToast('Sub-office unit removed.');
    try {
      await api.delete(`/governance/roles/${roleId}/sub-offices/${subId}`);
    } catch {
      // Local fallback
    }
  };

  // Open Member Assignment Modal
  const handleOpenAssignModal = (role: ExecutiveRole) => {
    setSelectedRoleForAssignment(role);
    setSelectedMemberId(membersList[0]?.id || '');
    setSelectedSubOfficeId(role.subOffices[0]?.id || '');
    setIsAssignMemberModalOpen(true);
  };

  // Save Member Assignment (Strict SuperAdmin / Co-Founder only!)
  const handleSaveMemberAssignment = async () => {
    if (!selectedRoleForAssignment || !selectedMemberId) return;

    const chosenMember = membersList.find((m) => m.id === selectedMemberId);
    const chosenSubOffice = selectedRoleForAssignment.subOffices.find((u) => u.id === selectedSubOfficeId);

    const credential = {
      credentialId: `APPT-${selectedRoleForAssignment.roleNumber}-${Date.now().toString(36).toUpperCase()}`,
      memberId: selectedMemberId,
      memberName: chosenMember?.name || selectedMemberId,
      memberEmail: chosenMember?.email || 'member@fingermobileprotocol.com',
      roleId: selectedRoleForAssignment.id,
      roleNumber: selectedRoleForAssignment.roleNumber,
      roleTitle: selectedRoleForAssignment.title,
      department: selectedRoleForAssignment.department,
      subOfficeId: chosenSubOffice?.id || null,
      subOfficeName: chosenSubOffice?.name || null,
      clearanceLevel: selectedRoleForAssignment.clearanceLevel,
      assignedBy: assignedByAdmin,
      assignedAt: new Date().toISOString(),
      status: 'VERIFIED_ROOT_APPOINTMENT'
    };

    // Update in members localStorage database
    const updatedMembers = membersList.map((m) => {
      if (m.id === selectedMemberId) {
        return {
          ...m,
          role: 'Manager', // Elevated from Guest/User
          corporateRoleNumber: selectedRoleForAssignment.roleNumber,
          corporateRoleTitle: selectedRoleForAssignment.title,
          assignedSubOffice: chosenSubOffice?.name || selectedRoleForAssignment.department,
          clearanceTier: selectedRoleForAssignment.clearanceLevel,
          appointmentCredentialId: credential.credentialId
        };
      }
      return m;
    });

    try {
      localStorage.setItem('fingermobile_master_members_db', JSON.stringify(updatedMembers));
      setMembersList(updatedMembers);
    } catch {
      // LocalStorage
    }

    // Update role's designated officer
    const nextRoles = roles.map((r) => {
      if (r.id === selectedRoleForAssignment.id) {
        return {
          ...r,
          assignedMemberId: selectedMemberId,
          assignedMemberName: chosenMember?.name || selectedMemberId,
          assignedMemberEmail: chosenMember?.email || 'member@fingermobileprotocol.com',
          status: 'ACTIVE_ASSIGNED' as const
        };
      }
      return r;
    });
    persistRoles(nextRoles);

    setLastAppointmentCredential(credential);
    setIsAssignMemberModalOpen(false);
    showToast(`Member ${chosenMember?.name || selectedMemberId} assigned to ${selectedRoleForAssignment.title}!`);

    // Backend sync
    try {
      await api.post('/governance/assign-member', {
        memberId: selectedMemberId,
        roleId: selectedRoleForAssignment.id,
        subOfficeId: chosenSubOffice?.id || null,
        assignedBy: assignedByAdmin,
        memberDetails: {
          name: chosenMember?.name,
          email: chosenMember?.email
        }
      });
      await api.put(`/admin/members/${selectedMemberId}`, {
        role: 'Manager',
        corporateRoleNumber: selectedRoleForAssignment.roleNumber,
        corporateRoleTitle: selectedRoleForAssignment.title,
        assignedSubOffice: chosenSubOffice?.name || selectedRoleForAssignment.department
      });
    } catch {
      // Fallback
    }
  };

  // DoA Simulator Evaluation
  const selectedDoaItem = useMemo(() => {
    return TECHNICAL_DOA_MATRIX.find((d) => d.id === simDoaActionId) || TECHNICAL_DOA_MATRIX[0];
  }, [simDoaActionId]);

  const simulatedApprovalTier = useMemo(() => {
    if (!selectedDoaItem) return 'Tier 1 (Board of Directors)';
    if (selectedDoaItem.requiresBoardResolution) {
      return 'Tier 1 (Board of Directors Formal Resolution Mandatory)';
    }
    if (selectedDoaItem.tier4MaxUsd > 0 && simDoaAmountUsd <= selectedDoaItem.tier4MaxUsd) {
      return 'Tier 4: Sub-Office Head / Functional Unit Lead';
    }
    if (selectedDoaItem.tier3MaxUsd > 0 && simDoaAmountUsd <= selectedDoaItem.tier3MaxUsd) {
      return 'Tier 3: Executive Director / Group Head (Level 18–2)';
    }
    if (selectedDoaItem.tier2MaxUsd > 0 && simDoaAmountUsd <= selectedDoaItem.tier2MaxUsd) {
      return 'Tier 2: Group Executive Committee (GMD/CEO, CFO Mrs. Mbah Eunice Emonena)';
    }
    return 'Tier 1: Full Board of Directors (or delegated Board Sub-Committee)';
  }, [selectedDoaItem, simDoaAmountUsd]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden text-slate-100 mb-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sovereign Header & Platform Seal */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-purple-950 p-6 border-b border-indigo-900/40">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Sovereign Enterprise Governance Operating System
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                18 Portfolios • 54 Units
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <Building2 className="w-6 h-6 text-indigo-400" />
              FingerMobile Corporate Governance & Executive Matrix
            </h2>
            <p className="text-xs text-indigo-200/80 mt-1 max-w-3xl">
              End-to-end administration of the FingerMobile Business Enterprise: 18 Executive Leadership Portfolios,
              Technical Delegated Authority (DoA) Matrix, Cross-Functional RACI Governance, and Role-Based Access Control (RBAC).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => downloadCorporateGovernanceManualPdf(roles, TECHNICAL_DOA_MATRIX, SOD_SAFEGUARDS)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              Download Manual (PDF)
            </button>
            <button
              onClick={handleOpenAddRole}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Executive Role
            </button>
          </div>
        </div>

        {/* Co-Founder & CFO Master Seal Rail */}
        <div className="mt-4 pt-4 border-t border-indigo-900/40 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-indigo-800/40">
            <div className="text-[10px] uppercase font-bold text-indigo-400">Founder & SuperAdmin Root</div>
            <div className="text-white font-semibold flex items-center gap-1.5 mt-0.5">
              <span>👑 {PLATFORM_OWNERSHIP.founder.name}</span>
            </div>
            <div className="text-[10px] text-slate-300 font-medium">Master Control • {PLATFORM_OWNERSHIP.founder.signinEmail}</div>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-purple-800/40">
            <div className="text-[10px] uppercase font-bold text-purple-400">Co-Founder & Chief Financial Officer (CFO)</div>
            <div className="text-white font-semibold flex items-center gap-1.5 mt-0.5">
              <span>⭐ {PLATFORM_OWNERSHIP.coFounder.name}</span>
            </div>
            <div className="text-[10px] text-slate-300 font-medium">Admin-1 • Hardcoded to Root • Master & Stercs Dashboard</div>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-amber-800/40">
            <div className="text-[10px] uppercase font-bold text-amber-400">Dedicated Sovereign Treasury Rail</div>
            <div className="text-white font-semibold flex items-center gap-1.5 mt-0.5">
              <span>🏛️ {DEDICATED_TREASURY_RAIL.bankName}</span>
              <span className="font-mono text-amber-300 font-bold">0514108422</span>
            </div>
            <div className="text-[10px] text-slate-300 font-medium">{DEDICATED_TREASURY_RAIL.licenseStatus}</div>
          </div>
        </div>
      </div>

      {/* Console Tab Navigation */}
      <div className="bg-slate-950/80 border-b border-slate-800 px-6 py-2">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto text-xs">
          {[
            { id: 'roles', label: '18 Executive Leadership Portfolios', icon: Briefcase, count: roles.length },
            { id: 'doa', label: 'Technical DoA Authority Matrix', icon: Scale, count: '19 Actions' },
            { id: 'raci', label: 'Cross-Functional RACI Code', icon: Workflow, count: '13 Roles' },
            { id: 'sod', label: 'Segregation of Duties (SoD) Safeguards', icon: ShieldCheck, count: '4 Rules' },
            { id: 'rbac', label: 'Member Onboarding & Portfolio Bridge', icon: UserCheck, count: 'RBAC' },
            { id: 'manual', label: 'Corporate Governance Manual', icon: FileText, count: 'Manual' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 rounded-lg font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-indigo-800 text-indigo-200' : 'bg-slate-800 text-slate-300 font-medium'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Tab Content */}
      <div className="p-6">
        {/* ========================================================================= */}
        {/* TAB 1: 18 EXECUTIVE LEADERSHIP ROLES & PORTFOLIOS                         */}
        {/* ========================================================================= */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/60 p-4 rounded-lg border border-slate-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search executive roles, officer, keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label className="text-xs text-slate-200 font-bold">Department:</label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Departments ({roles.length})</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Roles Accordion List */}
            <div className="space-y-4">
              {filteredRoles.map((role) => {
                const isExpanded = expandedRoleId === role.id;
                const isCfoRoot = role.roleNumber === 3;

                return (
                  <div
                    key={role.id}
                    className={`bg-slate-950/70 rounded-xl border transition-all overflow-hidden ${
                      isCfoRoot
                        ? 'border-purple-500/50 shadow-purple-950/20 shadow-md'
                        : isExpanded
                        ? 'border-indigo-500/60'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Header Bar */}
                    <div
                      onClick={() => setExpandedRoleId(isExpanded ? null : role.id)}
                      className="p-4 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-3 hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-700/50 flex items-center justify-center font-mono font-bold text-xs text-indigo-300">
                          {role.raciCode}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-sm text-white">
                              Role {role.roleNumber}: {role.title}
                            </h3>
                            {isCfoRoot && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                ⭐ Irrevocable Root Master Seal
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                              {role.clearanceLevel}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                              {role.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-300 font-medium mt-0.5">
                            {role.department} • Designated Lead: <span className="text-indigo-300 font-semibold">{role.designatedOfficer}</span>
                            {role.assignedMemberName && (
                              <span className="text-emerald-400 font-semibold ml-2">
                                (Assigned: {role.assignedMemberName})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-300 font-medium font-mono">
                          {role.subOffices.length} Sub-Units
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Detail Body */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4 text-xs">
                        {/* Mandate & Reporting */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-1">
                              Primary Statutory Mandate
                            </div>
                            <p className="text-slate-300 leading-relaxed">{role.primaryMandate}</p>

                            <div className="mt-3">
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                                Core Responsibilities
                              </div>
                              <ul className="list-disc list-inside space-y-1 text-slate-300">
                                {role.coreResponsibilities.map((resp, idx) => (
                                  <li key={idx}>{resp}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                              Executive Reporting Lines (Dual Governance)
                            </div>
                            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-2">
                              <div>
                                <span className="font-bold text-slate-200">Administrative Supervisor (Solid Line —):</span>
                                <div className="text-white font-medium">{role.reportingLines.administrativeSupervisor}</div>
                              </div>
                              <div>
                                <span className="font-bold text-slate-200">Board Oversight (Dotted Line ---):</span>
                                <div className="text-amber-300 font-medium">{role.reportingLines.governanceBoardOversight}</div>
                              </div>
                              <div>
                                <span className="font-bold text-slate-200">Statutory Supervisory Focus:</span>
                                <div className="text-slate-300">{role.reportingLines.statutoryFocus}</div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                              <button
                                onClick={() => handleOpenEditRole(role)}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold text-xs flex items-center gap-1.5"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                Edit Role
                              </button>
                              <button
                                onClick={() => handleOpenAddSubOffice(role)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-xs flex items-center gap-1.5"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add Sub-Office
                              </button>
                              <button
                                onClick={() => handleOpenAssignModal(role)}
                                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold text-xs flex items-center gap-1.5"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                Assign Member
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Sub-Offices / Functional Units Directory */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                              <Layers className="w-3.5 h-3.5 text-indigo-400" />
                              Sub-Offices, Functional Units & Allocated Resources ({role.subOffices.length})
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                            {role.subOffices.map((sub) => (
                              <div
                                key={sub.id}
                                className="bg-slate-900/90 rounded-lg p-3.5 border border-slate-800 flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-start justify-between gap-2 mb-1.5">
                                    <h4 className="font-bold text-white text-xs">{sub.name}</h4>
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-800 text-indigo-300">
                                      {sub.unitType}
                                    </span>
                                  </div>
                                  <p className="text-slate-300 text-[11px] mb-2 leading-relaxed">
                                    {sub.rolesAndResponsibilities}
                                  </p>

                                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[10px]">
                                    <div>
                                      <span className="font-bold text-slate-200">Human Talent:</span>{' '}
                                      <span className="text-slate-200">{sub.resources.humanTalent}</span>
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-200">Tech Tools:</span>{' '}
                                      <span className="text-indigo-300">{sub.resources.techTools}</span>
                                    </div>
                                    <div>
                                      <span className="font-bold text-slate-200">Capital Allocation:</span>{' '}
                                      <span className="text-amber-300 font-mono">{sub.resources.capitalBudget}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="mt-3 pt-2 border-t border-slate-800/60 flex justify-end">
                                  <button
                                    onClick={() => handleDeleteSubOffice(role.id, sub.id)}
                                    className="text-red-400 hover:text-red-300 text-[10px] font-semibold flex items-center gap-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Remove Unit
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: TECHNICAL DELEGATION OF AUTHORITY (DoA) MATRIX                     */}
        {/* ========================================================================= */}
        {activeTab === 'doa' && (
          <div className="space-y-6">
            {/* Interactive Threshold Calculator */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-5 rounded-xl border border-indigo-800/40 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Delegated Authority Threshold Simulator</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono">
                  Strict Non-Cumulative Tiers
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-4 max-w-2xl">
                Test any transaction action and amount to dynamically resolve the mandatory non-cumulative approval tier.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-200 mb-1">
                    Select Operational Action
                  </label>
                  <select
                    value={simDoaActionId}
                    onChange={(e) => setSimDoaActionId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {TECHNICAL_DOA_MATRIX.map((item) => (
                      <option key={item.id} value={item.id}>
                        [{item.domain}] {item.operationalAction}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-200 mb-1">
                    Transaction Consideration ($ USD)
                  </label>
                  <input
                    type="number"
                    value={simDoaAmountUsd}
                    onChange={(e) => setSimDoaAmountUsd(Number(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                    placeholder="Enter amount..."
                  />
                  <div className="text-[10px] text-slate-300 font-medium mt-1">
                    Approx. ₦{(simDoaAmountUsd * 1300).toLocaleString()} NGN (at benchmark rate)
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-lg border border-indigo-500/40 flex flex-col justify-center">
                  <div className="text-[10px] uppercase font-bold text-indigo-300">Mandated Approval Authority</div>
                  <div className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{simulatedApprovalTier}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* DoA Full Table */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">Delegated Authority Schedule (Non-Cumulative)</h3>
                <span className="text-xs text-slate-300 font-medium">19 Discrete Authority Domains</span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800 text-xs">
                  <thead className="bg-slate-900/80 text-slate-300 font-semibold">
                    <tr>
                      <th className="px-4 py-3 text-left">Domain</th>
                      <th className="px-4 py-3 text-left">Operational Action</th>
                      <th className="px-4 py-3 text-left text-blue-400">Tier 4 (Unit Lead)</th>
                      <th className="px-4 py-3 text-left text-emerald-400">Tier 3 (ED / Group Head)</th>
                      <th className="px-4 py-3 text-left text-purple-400">Tier 2 (ExCo / GMD / CFO)</th>
                      <th className="px-4 py-3 text-left text-amber-400">Tier 1 (Board of Directors)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950 text-slate-300">
                    {TECHNICAL_DOA_MATRIX.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-4 py-2.5 font-bold text-slate-200 whitespace-nowrap">{row.domain}</td>
                        <td className="px-4 py-2.5 font-bold text-white">{row.operationalAction}</td>
                        <td className="px-4 py-2.5 font-mono text-slate-300">{row.tier4UnitLead}</td>
                        <td className="px-4 py-2.5 font-mono text-slate-300">{row.tier3EDGroupHead}</td>
                        <td className="px-4 py-2.5 font-mono text-purple-300 font-semibold">{row.tier2ExCoGmdCfo}</td>
                        <td className="px-4 py-2.5 font-mono text-amber-300 font-semibold">{row.tier1BoardOfDirectors}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CROSS-FUNCTIONAL RACI GOVERNANCE MATRIX                            */}
        {/* ========================================================================= */}
        {activeTab === 'raci' && (
          <div className="space-y-6">
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-sm text-white">Cross-Functional RACI Governance Matrix</h3>
                <p className="text-xs text-slate-300 font-medium">
                  <span className="font-bold text-emerald-400">R:</span> Responsible (executes) •{' '}
                  <span className="font-bold text-amber-400">A:</span> Accountable (final veto/approval) •{' '}
                  <span className="font-bold text-blue-400">C:</span> Consulted •{' '}
                  <span className="font-bold text-slate-200">I:</span> Informed
                </p>
              </div>

              {/* Role filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-200 font-bold">Highlight Role:</span>
                <select
                  value={raciHighlightedRole}
                  onChange={(e) => setRaciHighlightedRole(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="ALL">Show All 13 Roles</option>
                  {RACI_ROLES_LEGEND.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.code} — {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800 text-xs">
                  <thead className="bg-slate-900/90 text-slate-300">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold sticky left-0 bg-slate-900 z-10">
                        Operational Activity
                      </th>
                      {RACI_ROLES_LEGEND.map((l) => (
                        <th
                          key={l.code}
                          className={`px-3 py-3 text-center font-bold whitespace-nowrap ${
                            raciHighlightedRole === l.code ? 'bg-indigo-900/50 text-indigo-300' : ''
                          }`}
                          title={l.label}
                        >
                          {l.code}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950 text-slate-300">
                    {CROSS_FUNCTIONAL_RACI_MATRIX.map((row) => (
                      <tr key={row.activityId} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-4 py-3 font-semibold text-white sticky left-0 bg-slate-950 z-10 whitespace-nowrap">
                          {row.activityName}
                          <div className="text-[10px] text-slate-300 font-medium">{row.domainLabel}</div>
                        </td>
                        {RACI_ROLES_LEGEND.map((l) => {
                          const val = row.assignments[l.code] || '-';
                          const isHighlighted = raciHighlightedRole === l.code;
                          const badgeStyle =
                            val === 'A'
                              ? 'bg-amber-500/20 text-amber-300 font-black border border-amber-500/40'
                              : val === 'A/R'
                              ? 'bg-purple-500/20 text-purple-300 font-black border border-purple-500/40'
                              : val === 'R'
                              ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                              : val === 'C'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-slate-800/40 text-slate-500';

                          return (
                            <td
                              key={l.code}
                              className={`px-3 py-3 text-center font-mono ${
                                isHighlighted ? 'bg-indigo-950/40' : ''
                              }`}
                            >
                              <span className={`inline-block w-7 py-0.5 rounded text-[11px] ${badgeStyle}`}>
                                {val}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SEGREGATION OF DUTIES (SoD) & CONFLICT RESOLUTION                  */}
        {/* ========================================================================= */}
        {activeTab === 'sod' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SOD_SAFEGUARDS.map((sod) => (
                <div
                  key={sod.id}
                  className="bg-slate-950/80 rounded-xl p-5 border border-slate-800 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        Rule #{sod.ruleNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {sod.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white mb-2">{sod.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{sod.ruleStatement}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
                    <div>
                      <span className="font-bold text-slate-200">Enforcement Protocol:</span>
                      <p className="text-slate-300 text-[11px] mt-0.5">{sod.enforcementProtocol}</p>
                    </div>
                    <div>
                      <span className="font-bold text-slate-200">Involved Portfolios:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {sod.involvedRoles.map((r, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-indigo-300"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: MEMBER ONBOARDING & PORTFOLIO BRIDGE                               */}
        {/* ========================================================================= */}
        {activeTab === 'rbac' && (
          <div className="space-y-6">
            {/* Guardrail Notice */}
            <div className="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4 text-xs text-amber-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300 uppercase tracking-wide">
                  Root Master Authorization Rule:
                </span>{' '}
                Once a member is onboarded, their profile credentials and portfolio assignment can be edited{' '}
                <span className="font-bold underline text-white">
                  ONLY by the SuperAdmin Founder (Mr. Mbah Israel Obinna) or Co-Founder (Mrs. Mbah Eunice Emonena)
                </span>
                . Standard users onboard as Guests and cannot escalate their own privileges.
              </div>
            </div>

            {/* Quick Assignment Card */}
            <div className="bg-slate-950/70 p-5 rounded-xl border border-slate-800">
              <h3 className="font-bold text-sm text-white mb-1">Assign Onboarded Member to Corporate Portfolio</h3>
              <p className="text-xs text-slate-300 font-medium mb-4">
                Select an onboarded member, assign an Executive Leadership Role or Sub-Office, and issue an official appointment credential.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Select Onboarded Member</label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- Choose Member ({membersList.length} total) --</option>
                    {membersList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.username}) - {m.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Corporate Portfolio / Role</label>
                  <select
                    value={selectedRoleForAssignment?.id || ''}
                    onChange={(e) => {
                      const found = roles.find((r) => r.id === e.target.value);
                      setSelectedRoleForAssignment(found || null);
                      setSelectedSubOfficeId(found?.subOffices[0]?.id || '');
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">-- Choose Executive Role (18 Roles) --</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        Role {r.roleNumber}: {r.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Sub-Office / Functional Unit</label>
                  <select
                    value={selectedSubOfficeId}
                    onChange={(e) => setSelectedSubOfficeId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    disabled={!selectedRoleForAssignment}
                  >
                    <option value="">-- Primary Executive Role Direct --</option>
                    {selectedRoleForAssignment?.subOffices.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name} ({sub.unitType})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    onClick={handleSaveMemberAssignment}
                    disabled={!selectedMemberId || !selectedRoleForAssignment}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm & Issue Appointment
                  </button>
                </div>
              </div>

              {lastAppointmentCredential && (
                <div className="mt-4 p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-lg text-xs space-y-1">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Appointment Credential Generated & Enforced:
                  </div>
                  <div className="font-mono text-[11px] text-slate-300">
                    Credential ID: <span className="text-emerald-400">{lastAppointmentCredential.credentialId}</span> • Member: {lastAppointmentCredential.memberName} • Portfolio: {lastAppointmentCredential.roleTitle}
                  </div>
                </div>
              )}
            </div>

            {/* Members Directory Table with Assigned Portfolios */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-bold text-sm text-white">Active Members & Corporate Portfolio Assignments</h3>
                <span className="text-xs text-slate-300 font-medium">{membersList.length} Members Registered</span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800 text-xs">
                  <thead className="bg-slate-900/90 text-slate-300">
                    <tr>
                      <th className="px-4 py-3 text-left">Member Name / Username</th>
                      <th className="px-4 py-3 text-left">Email / Contact</th>
                      <th className="px-4 py-3 text-left">RBAC Role</th>
                      <th className="px-4 py-3 text-left text-indigo-300">Assigned Corporate Portfolio</th>
                      <th className="px-4 py-3 text-left">Clearance Tier</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-950 text-slate-300">
                    {membersList.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="px-4 py-3 font-semibold text-white">
                          {m.name}
                          <div className="text-[10px] text-slate-300 font-mono">@{m.username}</div>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300">{m.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            m.role === 'SuperAdmin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            m.role === 'Admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                            m.role === 'Manager' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                            'bg-slate-800 text-slate-300 font-medium'
                          }`}>
                            {m.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {m.corporateRoleTitle ? (
                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/40 text-[11px]">
                              Role {m.corporateRoleNumber}: {m.corporateRoleTitle}
                            </span>
                          ) : (
                            <span className="text-slate-300 font-medium italic text-[11px]">Unassigned (Standard User)</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-300">
                          {m.clearanceTier || 'Tier 4'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedMemberId(m.id);
                              setSelectedRoleForAssignment(roles[0]);
                              setIsAssignMemberModalOpen(true);
                            }}
                            className="text-indigo-400 hover:text-indigo-300 font-semibold"
                          >
                            Assign Portfolio
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: CORPORATE GOVERNANCE MANUAL TEMPLATE & VIEWER                      */}
        {/* ========================================================================= */}
        {activeTab === 'manual' && (
          <div className="space-y-6">
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-2xl max-w-4xl mx-auto space-y-6 text-slate-200">
              {/* Manual Top Actions */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold text-sm text-white">
                    FingerMobile Corporate Governance Manual (Template Edition)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print
                  </button>
                  <button
                    onClick={() => downloadCorporateGovernanceManualPdf(roles, TECHNICAL_DOA_MATRIX, SOD_SAFEGUARDS)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF
                  </button>
                </div>
              </div>

              {/* Title Section */}
              <div className="text-center py-4 border-b border-slate-800 space-y-2">
                <div className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">
                  SOVEREIGN ENTERPRISE CONSTITUTION
                </div>
                <h1 className="text-2xl font-black text-white">
                  FingerMobile Protocol Corporate Governance Manual
                </h1>
                <div className="text-xs text-slate-300 font-medium">
                  Version 1.0 • Formulated October 2026 • Federal Republic of Nigeria & Global Sovereign Network
                </div>
              </div>

              {/* Preamble */}
              <div className="space-y-2 text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-lg border border-slate-800">
                <h3 className="font-bold text-white text-sm">Executive Preamble & Constitutional Foundation</h3>
                <p>
                  This manual establishes the corporate governance architecture, executive mandates, delegated authority schedules,
                  and conflict resolution safeguards across the FingerMobile Business Enterprise. It operationalizes 18 Executive
                  Leadership Portfolios, 54 sub-offices, and multi-tier sovereign resource allocations.
                </p>
                <p>
                  Executive financial oversight and protocol treasury release is irrevocably anchored in the Chief Financial Officer (CFO),
                  Mrs. Mbah Eunice Emonena, with primary fiat banking rail anchored at Alternative Bank (Account: 0514108422).
                </p>
              </div>

              {/* Table of Contents */}
              <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800 text-xs space-y-1.5">
                <h4 className="font-bold text-white mb-2">Table of Contents</h4>
                <div className="text-indigo-300">1. Article I: 18 Executive Leadership Roles, Mandates & Sub-Offices</div>
                <div className="text-indigo-300">2. Article II: Dual-Line Executive Reporting Architecture</div>
                <div className="text-indigo-300">3. Article III: Technical Delegation of Authority (DoA) Matrix</div>
                <div className="text-indigo-300">4. Article IV: Cross-Functional RACI Governance Code</div>
                <div className="text-indigo-300">5. Article V: Segregation of Duties (SoD) & Conflict Resolution Protocols</div>
                <div className="text-indigo-300">6. Article VI: Member RBAC Onboarding, Credentialing & Portfolio Appointment</div>
              </div>

              {/* Article I: 18 Roles Summary */}
              <div className="space-y-4 pt-2">
                <h3 className="font-bold text-base text-white border-b border-slate-800 pb-1">
                  Article I: The 18 Executive Leadership Roles & Allocations
                </h3>
                <div className="space-y-3 text-xs">
                  {roles.map((r) => (
                    <div key={r.id} className="p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                      <div className="font-bold text-white text-xs mb-1">
                        Role {r.roleNumber} [{r.raciCode}]: {r.title}
                      </div>
                      <div className="text-slate-300 font-medium text-[11px] mb-1.5">
                        Officer: {r.designatedOfficer} • Department: {r.department} • Clearance: {r.clearanceLevel}
                      </div>
                      <p className="text-slate-300 text-[11px] mb-2">{r.primaryMandate}</p>
                      <div className="text-[10px] text-indigo-300">
                        Units: {r.subOffices.map((s) => s.name).join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Article V: SoD Safeguards */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="font-bold text-base text-white border-b border-slate-800 pb-1">
                  Article V: Segregation of Duties (SoD) Safeguards
                </h3>
                {SOD_SAFEGUARDS.map((sod) => (
                  <div key={sod.id} className="text-xs space-y-1">
                    <span className="font-bold text-indigo-300">
                      Rule {sod.ruleNumber}: {sod.title}
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{sod.ruleStatement}</p>
                  </div>
                ))}
              </div>

              {/* Executive Sign-off */}
              <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-6 text-xs text-center">
                <div className="border-t border-slate-700 pt-2">
                  <div className="font-bold text-white">{PLATFORM_OWNERSHIP.founder.name}</div>
                  <div className="text-slate-300 font-medium text-[11px]">Founder & Owner — SuperAdmin & Master Control</div>
                  <div className="text-indigo-400 text-[10px] font-mono mt-0.5">ROOT MASTER SEAL VALIDATED</div>
                </div>
                <div className="border-t border-slate-700 pt-2">
                  <div className="font-bold text-white">{PLATFORM_OWNERSHIP.coFounder.name}</div>
                  <div className="text-slate-300 font-medium text-[11px]">Co-Founder — Admin-1 & Chief Financial Officer (CFO)</div>
                  <div className="text-purple-400 text-[10px] font-mono mt-0.5">TREASURY AUTHORITY VALIDATED</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT ROLE MODAL                                                  */}
      {/* ========================================================================= */}
      {isEditRoleModalOpen && selectedRoleForEdit && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-400" />
              Edit Role {selectedRoleForEdit.roleNumber}: {selectedRoleForEdit.title}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-200 font-bold mb-1">Role Title</label>
                <input
                  type="text"
                  value={formRoleTitle}
                  onChange={(e) => setFormRoleTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Department</label>
                <input
                  type="text"
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Designated Officer</label>
                <input
                  type="text"
                  value={formDesignatedOfficer}
                  onChange={(e) => setFormDesignatedOfficer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Clearance Level</label>
                <select
                  value={formClearanceLevel}
                  onChange={(e) => setFormClearanceLevel(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Tier 1 (Board)">Tier 1 (Board of Directors)</option>
                  <option value="Tier 2 (ExCo)">Tier 2 (ExCo / GMD / CFO)</option>
                  <option value="Tier 3 (ED / Group Head)">Tier 3 (ED / Group Head)</option>
                  <option value="Tier 4 (Unit Lead)">Tier 4 (Unit Lead)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Primary Mandate</label>
                <textarea
                  rows={2}
                  value={formMandate}
                  onChange={(e) => setFormMandate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Core Responsibilities (one per line)</label>
                <textarea
                  rows={3}
                  value={formResponsibilities}
                  onChange={(e) => setFormResponsibilities(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsEditRoleModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoleEdit}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD ROLE MODAL                                                   */}
      {/* ========================================================================= */}
      {isAddRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Add New Executive Leadership Role
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-200 font-bold mb-1">Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. Group Head, Artificial Intelligence & Automation"
                  value={formRoleTitle}
                  onChange={(e) => setFormRoleTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Sentient AI Labs"
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Designated Officer</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Jane Doe"
                  value={formDesignatedOfficer}
                  onChange={(e) => setFormDesignatedOfficer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Clearance Level</label>
                <select
                  value={formClearanceLevel}
                  onChange={(e) => setFormClearanceLevel(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Tier 1 (Board)">Tier 1 (Board of Directors)</option>
                  <option value="Tier 2 (ExCo)">Tier 2 (ExCo / GMD / CFO)</option>
                  <option value="Tier 3 (ED / Group Head)">Tier 3 (ED / Group Head)</option>
                  <option value="Tier 4 (Unit Lead)">Tier 4 (Unit Lead)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Primary Mandate</label>
                <textarea
                  rows={2}
                  placeholder="State the core organizational mission..."
                  value={formMandate}
                  onChange={(e) => setFormMandate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Core Responsibilities (one per line)</label>
                <textarea
                  rows={3}
                  placeholder="Enter key operational responsibilities..."
                  value={formResponsibilities}
                  onChange={(e) => setFormResponsibilities(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsAddRoleModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddRole}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg"
              >
                Create Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD SUB-OFFICE MODAL                                             */}
      {/* ========================================================================= */}
      {isAddSubOfficeModalOpen && selectedRoleForSubOffice && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Add Sub-Office to {selectedRoleForSubOffice.title}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-200 font-bold mb-1">Unit Name</label>
                <input
                  type="text"
                  placeholder="e.g. Synthetic Identity Recovery Unit"
                  value={formSubName}
                  onChange={(e) => setFormSubName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Unit Type</label>
                <select
                  value={formSubUnitType}
                  onChange={(e) => setFormSubUnitType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Functional Unit">Functional Unit</option>
                  <option value="Office">Office</option>
                  <option value="Desk">Desk</option>
                  <option value="Lab">Lab</option>
                  <option value="Secretariat">Secretariat</option>
                  <option value="Sub-Office">Sub-Office</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Roles & Responsibilities</label>
                <textarea
                  rows={2}
                  placeholder="Specific duties and daily workflow..."
                  value={formSubDuties}
                  onChange={(e) => setFormSubDuties(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Human Talent Allocation</label>
                <input
                  type="text"
                  placeholder="e.g. Fraud detection specialists, data analysts"
                  value={formSubTalent}
                  onChange={(e) => setFormSubTalent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Technological Tools</label>
                <input
                  type="text"
                  placeholder="e.g. GRC software, biometric matchers"
                  value={formSubTools}
                  onChange={(e) => setFormSubTools(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Capital Budget / Operating Reserve</label>
                <input
                  type="text"
                  placeholder="e.g. $100,000 investigative reserve"
                  value={formSubCapital}
                  onChange={(e) => setFormSubCapital(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsAddSubOfficeModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddSubOffice}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg"
              >
                Add Unit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ASSIGN MEMBER TO ROLE MODAL                                      */}
      {/* ========================================================================= */}
      {isAssignMemberModalOpen && selectedRoleForAssignment && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-purple-400" />
              Assign Member to Role {selectedRoleForAssignment.roleNumber}: {selectedRoleForAssignment.title}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-200 font-bold mb-1">Select Onboarded Member</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose Member --</option>
                  {membersList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.username}) - {m.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Sub-Office / Unit Assignment (Optional)</label>
                <select
                  value={selectedSubOfficeId}
                  onChange={(e) => setSelectedSubOfficeId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Primary Executive Officer --</option>
                  {selectedRoleForAssignment.subOffices.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.unitType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-200 font-bold mb-1">Authorizing Root Executive</label>
                <select
                  value={assignedByAdmin}
                  onChange={(e) => setAssignedByAdmin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-semibold focus:outline-none focus:border-indigo-500"
                >
                  <option value="owner_mbah_israel_obinna">
                    Mr. Mbah Israel Obinna (Founder & Owner — SuperAdmin)
                  </option>
                  <option value="owner_mbah_eunice_emonena">
                    Mrs. Mbah Eunice Emonena (Co-Founder — CFO & Admin-1)
                  </option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsAssignMemberModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMemberAssignment}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg"
              >
                Issue Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CorporateGovernanceConsole;
