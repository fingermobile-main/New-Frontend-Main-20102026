import React, { useEffect, useState } from 'react';

// AdminControlDashboard.tsx
// Enhanced administrative control dashboard for FingerMobile platform

import { logError, ErrorType } from '../utils/errorLogger';

import MainLayout from '../components/layout/MainLayout';
import PlatformOwnershipCard from '../components/dashboard/PlatformOwnershipCard';
import adminControlService, {
  AdminActionItem,
  AdminMemberItem,
  AuditLogItem
} from '../services/adminControlService';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import {
  LockClosedIcon,
  UsersIcon as UserGroupIcon,
  ChartBarIcon,
  UserIcon as MemberIcon,
  ClipboardListIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XCircleIcon,
  UserCircleIcon,
  ShieldCheckIcon
} from '../icons';

const AdminControlDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast, ficBalance } = useAppContext();
  const [actions, setActions] = useState<AdminActionItem[]>([]);
  const [members, setMembers] = useState<AdminMemberItem[]>([]);
  const [auditLogs, setAuditLogItems] = useState<AuditLogItem[]>([]);
  const [activeTab, setActiveTab] = useState<'actions' | 'members' | 'audit'>(
    'actions',
  );
  const [pin, setPin] = useState('');
  const [biometricVerified, setBiometricVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [selectedAction, setSelectedAction] = useState<AdminActionItem | null>(
    null,
  );
  const [isExecuting, setIsExecuting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<AdminMemberItem | null>(null);
  const [newMember, setNewMember] = useState<Omit<AdminMemberItem, 'id'>>({
    name: '',
    role: 'ADMIN',
    permissions: [],
    lastLogin: new Date(),
    isActive: true
  });

  useEffect(() => {
    // Load initial data and trigger live backend sync
    adminControlService.loadRealData().then(() => {
      setActions(adminControlService.getActions());
      setMembers(adminControlService.getMembers());
      setAuditLogItems(adminControlService.getAuditLogItems());
    }).catch(() => {
      setActions(adminControlService.getActions());
      setMembers(adminControlService.getMembers());
      setAuditLogItems(adminControlService.getAuditLogItems());
    });

    // Set up interval to refresh data
    const interval = setInterval(() => {
      adminControlService.loadRealData().then(() => {
        setActions(adminControlService.getActions());
        setMembers(adminControlService.getMembers());
        setAuditLogItems(adminControlService.getAuditLogItems());
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleExecuteAction = async () => {
    if (!selectedAction || !user) return;

    if (!pin) {
      logError(new Error('PIN not entered'), ErrorType.UNKNOWN_ERROR);
      showToast('Please enter your PIN', 'error');
      return;
    }

    if (selectedAction.requiresBiometric && !biometricVerified) {
      logError(new Error('Biometric verification required'), ErrorType.UNKNOWN_ERROR);
      showToast('Biometric verification required', 'error');
      return;
    }

    if (selectedAction.requiresOTP && !otp) {
      logError(new Error('OTP not entered'), ErrorType.UNKNOWN_ERROR);
      showToast('Please enter OTP', 'error');
      return;
    }

    setIsExecuting(true);

    try {
      const result = await adminControlService.executeAction(
        selectedAction.id,
        typeof user.id === 'string' ? user.id : String(user.id),
        pin,
        biometricVerified ? 'verified' : undefined,
        otp || undefined,
        'NG', // Default to Nigeria for demo
      );

      if (result.success) {
        showToast(result.message, 'success');

        // If action requires confirmation, start countdown
        if (selectedAction.requiresConfirmation) {
          setCountdown(selectedAction.confirmationWindow);
          const interval = setInterval(() => {
            setCountdown((prev) => {
              if (prev === null || prev <= 1) {
                clearInterval(interval);
                return null;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else {
        showToast(result.message || 'Action failed', 'error');
      }
    } catch (error) {
      logError(error as Error, ErrorType.UNKNOWN_ERROR);
      showToast('An error occurred while executing the action', 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleAddMember = async () => {
    if (!user) return;
    try {
      const result = await adminControlService.addMember(typeof user.id === 'string' ? user.id : String(user.id), {
        ...newMember
      });

      if (result.success) {
        showToast('Member added successfully', 'success');
        setMembers([...members, { ...newMember, id: result.memberId || `member_${Date.now()}` }]);
        setShowAddMemberModal(false);
        setNewMember({
          name: '',
          role: 'ADMIN',
          permissions: [],
          lastLogin: new Date(),
          isActive: true
        });
      } else {
        showToast(result.message || 'Failed to add member', 'error');
      }
    } catch (error) {
      logError(error as Error, ErrorType.UNKNOWN_ERROR);
      showToast('An error occurred while adding the member', 'error');
    }
  };

  const handleUpdateMember = async () => {
    if (!editingMember || !user) return;
    try {
      const result = await adminControlService.updateMember(
        typeof user.id === 'string' ? user.id : String(user.id),
        typeof editingMember.id === 'string' ? editingMember.id : String(editingMember.id),
        editingMember,
      );

      if (result.success) {
        showToast('Member updated successfully', 'success');
        setMembers(
          members.map((m) => (m.id === editingMember.id ? editingMember : m)),
        );
        setShowEditMemberModal(false);
        setEditingMember(null);
      } else {
        showToast(result.message || 'Failed to update member', 'error');
      }
    } catch (error) {
      logError(error as Error, ErrorType.UNKNOWN_ERROR);
      showToast('An error occurred while updating the member', 'error');
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    if (!user) return;
    try {
      const result = await adminControlService.removeMember(typeof user.id === 'string' ? user.id : String(user.id), typeof id === 'string' ? id : String(id));

      if (result.success) {
        showToast('Member deleted successfully', 'success');
        setMembers(members.filter((m) => m.id !== id));
      } else {
        showToast(result.message || 'Failed to delete member', 'error');
      }
    } catch (error) {
      logError(error as Error, ErrorType.UNKNOWN_ERROR);
      showToast('An error occurred while deleting the member', 'error');
    }
  };

  const toggleMemberStatus = async (id: string) => {
    try {
      const memberToToggle = members.find((m) => m.id === id);
      if (!memberToToggle || !user) return;

      const updatedMember = {
        ...memberToToggle,
        isActive: !memberToToggle.isActive
      };
      const result = await adminControlService.updateMember(typeof user.id === 'string' ? user.id : String(user.id), typeof id === 'string' ? id : String(id), updatedMember);

      if (result.success) {
        showToast(
          `Member ${updatedMember.isActive ? 'activated' : 'deactivated'} successfully`,
          'success',
        );
        setMembers(members.map((m) => (m.id === id ? updatedMember : m)));
      } else {
        showToast(
          result.message ||
            `Failed to ${updatedMember.isActive ? 'activate' : 'deactivate'} member`,
          'error',
        );
      }
    } catch (error) {
      logError(error as Error, ErrorType.UNKNOWN_ERROR);
      showToast('An error occurred while updating member status', 'error');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-10">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-3 rounded-xl">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Control Dashboard
              </h1>
              <p className="text-slate-700 font-medium">Securely manage platform operations and user activities</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Security Controls */}
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-slate-200">
              <div className="p-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg mb-6"></div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Security Controls
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="admin-pin" className="block text-sm font-medium text-gray-700 mb-1">
                    Admin PIN
                  </label>
                  <input
                    id="admin-pin"
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-lg px-4 py-2 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                    placeholder="Enter admin PIN"
                  />
                </div>

                <div>
                  <label htmlFor="biometric-check" className="block text-sm font-medium text-gray-700 mb-1">
                    Biometric Verification
                  </label>
                  <div className="flex items-center">
                    <input
                      id="biometric-check"
                      type="checkbox"
                      checked={biometricVerified}
                      onChange={(e) => setBiometricVerified(e.target.checked)}
                      className="h-4 w-4 text-slate-900 focus:ring-indigo-500 border-gray-300 rounded font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Verify biometric identity
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="admin-otp" className="block text-sm font-medium text-gray-700 mb-1">
                    OTP (if required)
                  </label>
                  <input
                    id="admin-otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-lg px-4 py-2 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                    placeholder="Enter OTP"
                  />
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {[
                  {
                    id: 'actions',
                    label: 'Admin Actions',
                    icon: <LockClosedIcon className="w-5 h-5" />
                  },
                  {
                    id: 'members',
                    label: 'Members',
                    icon: <MemberIcon className="w-5 h-5" />
                  },
                  {
                    id: 'audit',
                    label: 'Audit Logs',
                    icon: <ClipboardListIcon className="w-5 h-5" />
                  }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'actions' | 'members' | 'audit')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'actions' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                <div className="px-6 py-5 border-b border-slate-300">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Available Actions
                  </h3>
                  <p className="mt-1 text-sm text-slate-700">
                    Perform administrative actions with proper authorization
                  </p>
                </div>
                <ul className="divide-y divide-gray-200">
                  {actions.map((action) => (
                    <li key={action.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {action.actionWord}
                          </h4>
                          <p className="text-sm text-slate-700 mt-1">
                            {action.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {action.requiresOTP && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-950 border border-amber-400 font-bold font-black">
                                OTP Required
                              </span>
                            )}
                            {action.requiresBiometric && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-950 border border-blue-400 font-bold font-black">
                                Biometric
                              </span>
                            )}
                            {action.requiresConfirmation && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-950 border border-red-400 font-bold font-black">
                                Confirmation
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              setSelectedAction(action);
                            }}
                            disabled={isExecuting}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                          >
                            Select
                          </button>
                        </div>
                      </div>

                      {selectedAction?.id === action.id && (
                        <div className="mt-4 pt-4 border-t border-slate-300">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm text-slate-700">
                                Execute this action?
                              </p>
                              {countdown !== null && (
                                <p className="text-sm font-medium text-red-600">
                                  Confirming in {countdown}s
                                </p>
                              )}
                            </div>
                            <button
                              onClick={handleExecuteAction}
                              disabled={isExecuting}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            >
                              {isExecuting ? 'Executing...' : 'Execute Action'}
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'members' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Manage Members
                  </h3>
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <PlusIcon className="h-5 w-5 mr-1" />
                    Add Member
                  </button>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-md rounded-2xl border border-slate-200">
                  <ul className="divide-y divide-gray-200">
                    {members.map((member) => (
                      <li key={member.id}>
                        <div className="px-6 py-6 sm:px-8 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center text-white font-bold">
                              {member.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">
                                {member.name}
                              </p>
                              <p className="text-sm text-slate-700">
                                {member.role} • Last login:{' '}
                                {member.lastLogin.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                member.isActive
                                  ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                                  : 'bg-red-100 text-green-950 border border-green-400 font-bold'
                              }font-black`}
                            >
                              {member.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <button
                              onClick={() => toggleMemberStatus(member.id)}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                                member.isActive
                                  ? 'bg-red-100 text-red-950 border border-red-400 font-bold hover:bg-red-200'
                                  : 'bg-green-100 text-green-950 border border-green-400 font-bold hover:bg-green-200'
                              }`}
                            >
                              {member.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => {
                                setEditingMember(member);
                                setShowEditMemberModal(true);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMember(member.id)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-md rounded-2xl border border-slate-200">
                <div className="px-6 py-5 border-b border-slate-300">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Audit Logs
                  </h3>
                  <p className="mt-1 text-sm text-slate-700">
                    Track all administrative actions performed
                  </p>
                </div>
                <ul className="divide-y divide-gray-200">
                  {auditLogs.map((log) => (
                    <li key={log.id} className="px-6 py-5 sm:px-8 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {log.actionId}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              log.status === 'success'
                                ? 'bg-green-100 text-green-950 border border-green-400 font-bold'
                                : 'bg-red-100 text-green-950 border border-green-400 font-bold'
                            }font-black`}
                          >
                            {log.status}
                          </span>
                          <span className="text-xs text-slate-700">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-slate-700">
                        <span>Performed by: {log.memberId}</span>
                        <span className="mx-2">•</span>
                        <span>IP: {log.ipAddress}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <UserCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                Admin FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance?.toFixed(2) ?? '0.00'} FIC</span>
                <button className="text-sm bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1.5 rounded-lg hover:from-red-700 hover:to-orange-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-300">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Admin Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-red-50 hover:to-orange-50 transition-colors flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-red-600 mr-3" />
                  Security Checks
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-red-50 hover:to-orange-50 transition-colors flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-red-600 mr-3" />
                  User Management
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-red-50 hover:to-orange-50 transition-colors flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-red-600 mr-3" />
                  System Reports
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-300">
              <h3 className="font-bold text-gray-900 mb-2">Security Notice</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Always verify biometric identity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Use multi-factor authentication</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Monitor audit logs regularly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sovereign Platform Ownership Directive */}
        <div className="mt-8">
          <PlatformOwnershipCard />
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative rounded-2xl bg-white max-w-md w-full shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Add New Member
                </h3>
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="text-slate-700 hover:text-gray-700"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="add-member-name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    id="add-member-name"
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-lg px-4 py-2 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label htmlFor="add-member-role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="add-member-role"
                    value={newMember.role}
                    onChange={(e) =>
                      setNewMember({
                        ...newMember,
                        role: e.target.value as AdminMemberItem['role']
                      })
                    }
                    className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-lg px-4 py-2 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="USER">User</option>
                  </select>
                </div>
              </div>
              <div className="items-center gap-2 mt-6 flex justify-end">
                <button
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditMemberModal && editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative rounded-2xl bg-white max-w-md w-full shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Edit Member
                </h3>
                <button
                  onClick={() => setShowEditMemberModal(false)}
                  className="text-slate-700 hover:text-gray-700"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-member-name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    id="edit-member-name"
                    type="text"
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({
                      ...editingMember,
                      name: e.target.value
                    })
                    }
                    className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-lg px-4 py-2 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label htmlFor="edit-member-role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="edit-member-role"
                    value={editingMember.role}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        role: e.target.value as AdminMemberItem['role']
                      })
                    }
                    className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 rounded-lg px-4 py-2 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="USER">User</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="edit-member-status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-1">
                    <label className="inline-flex items-center">
                      <input
                        id="edit-member-status"
                        type="checkbox"
                        checked={editingMember.isActive}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            isActive: e.target.checked
                          })
                        }
                        className="rounded border-gray-300 text-slate-900 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 font-bold border border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                      />
                      <span className="ml-2">Active</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="items-center gap-2 mt-6 flex justify-end">
                <button
                  onClick={() => setShowEditMemberModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateMember}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700"
                >
                  Update Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default AdminControlDashboard;
