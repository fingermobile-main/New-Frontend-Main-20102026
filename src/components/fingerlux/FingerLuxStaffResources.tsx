import React, { useState } from 'react';
import type {
  StaffMember,
  BookableResource,
  LocationSite,
  FingerLuxService,
  StaffRole
} from '../../types/fingerLuxScheduling';
import {
  UsersIcon,
  CheckIcon,
  CalendarIcon,
  PlusIcon
} from '../../icons';

interface FingerLuxStaffResourcesProps {
  staff: StaffMember[];
  resources: BookableResource[];
  locations: LocationSite[];
  services: FingerLuxService[];
  onUpdateStaff: (staffMember: StaffMember) => void;
  onAddStaff: (newStaff: Partial<StaffMember>) => void;
  onUpdateResource: (resource: BookableResource) => void;
  onAddResource: (newResource: Partial<BookableResource>) => void;
  onAddLocation: (newLocation: Partial<LocationSite>) => void;
}

export const FingerLuxStaffResources: React.FC<FingerLuxStaffResourcesProps> = ({
  staff,
  resources,
  locations,
  services,
  onUpdateStaff,
  onAddStaff,
  onUpdateResource,
  onAddResource,
  onAddLocation
}) => {
  const [subTab, setSubTab] = useState<'staff' | 'permissions' | 'resources' | 'locations'>('staff');

  // Staff Edit Modal
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // New Resource Modal
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceType, setNewResourceType] = useState<'room' | 'equipment' | 'vehicle'>('room');
  const [newResourceCapacity, setNewResourceCapacity] = useState(6);
  const [newResourceDesc, setNewResourceDesc] = useState('');
  const [newResourceLocationId, setNewResourceLocationId] = useState(locations[0]?.id || 'loc-dubai');

  // New Staff Modal
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('Senior Specialist');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');

  const handleToggleResourceAvailability = (res: BookableResource) => {
    onUpdateResource({
      ...res,
      isAvailable: !res.isAvailable
    });
  };

  const handleSaveNewResource = () => {
    if (!newResourceName.trim()) return;
    onAddResource({
      name: newResourceName,
      type: newResourceType,
      capacity: newResourceCapacity,
      locationId: newResourceLocationId,
      description: newResourceDesc || 'Bookable FingerLux facility',
      isAvailable: true,
      icon: newResourceType === 'room' ? '🏛️' : newResourceType === 'vehicle' ? '🚘' : '🎥'
    });
    setNewResourceName('');
    setNewResourceDesc('');
    setShowAddResourceModal(false);
  };

  const handleSaveNewStaff = () => {
    if (!newStaffName.trim()) return;
    onAddStaff({
      name: newStaffName,
      role: newStaffRole,
      email: newStaffEmail || `${newStaffName.toLowerCase().replace(/\s+/g, '.')}@fingerlux.protocol`,
      phone: newStaffPhone || '+1 800 589 8478',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      assignedServiceIds: services.slice(0, 2).map((s) => s.id),
      locationIds: [locations[0]?.id || 'loc-dubai'],
      workingHours: {
        Monday: { start: '09:00', end: '19:00', isWorking: true },
        Tuesday: { start: '09:00', end: '19:00', isWorking: true },
        Wednesday: { start: '09:00', end: '19:00', isWorking: true },
        Thursday: { start: '09:00', end: '19:00', isWorking: true },
        Friday: { start: '09:00', end: '20:00', isWorking: true },
        Saturday: { start: '10:00', end: '18:00', isWorking: true },
        Sunday: { start: '11:00', end: '16:00', isWorking: false }
      },
      calendarSync: {
        googleCalendar: true,
        outlookCalendar: false,
        appleCalendar: false,
        lastSyncedAt: 'Just added'
      },
      permissions: {
        canViewFinances: false,
        canEditSchedule: true,
        canIssueRefunds: false,
        canManageClients: true
      }
    });
    setNewStaffName('');
    setNewStaffEmail('');
    setShowAddStaffModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Selector Header */}
      <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'staff', label: 'Staff Roster & Working Hours', icon: '👥' },
            { id: 'permissions', label: 'Permissions & Roles', icon: '🔐' },
            { id: 'resources', label: 'Rooms & Equipment Resources', icon: '🏛️' },
            { id: 'locations', label: 'Multi-Location Sites', icon: '📍' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                subTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {subTab === 'staff' && (
          <button
            type="button"
            onClick={() => setShowAddStaffModal(true)}
            className="px-3.5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Specialist</span>
          </button>
        )}

        {subTab === 'resources' && (
          <button
            type="button"
            onClick={() => setShowAddResourceModal(true)}
            className="px-3.5 py-2 bg-gray-900 hover:bg-black text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Resource</span>
          </button>
        )}
      </div>

      {/* --- SUB-TAB 1: STAFF ROSTER & WORKING HOURS --- */}
      {subTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((sm) => {
            const assignedServices = services.filter((s) => sm.assignedServiceIds.includes(s.id));

            return (
              <div
                key={sm.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={sm.avatar}
                      alt={sm.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-gray-200"
                    />
                    <div>
                      <h3 className="text-base font-black text-gray-900">{sm.name}</h3>
                      <span className="text-xs font-bold text-indigo-600 block">{sm.role}</span>
                      <span className="text-[11px] text-gray-400 block truncate">{sm.email}</span>
                    </div>
                  </div>

                  {/* Personal Calendar Sync Badges */}
                  <div className="p-3 bg-gray-50 rounded-2xl space-y-1.5 border border-gray-100">
                    <div className="flex items-center justify-between text-[11px] font-bold text-gray-700">
                      <span>Personal Calendar Sync:</span>
                      <span className="text-gray-400 font-semibold text-[10px]">{sm.calendarSync.lastSyncedAt}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                          sm.calendarSync.googleCalendar
                            ? 'bg-blue-100 text-blue-950 border border-blue-400 font-bold'
                            : 'bg-gray-200 text-gray-500 line-through'
                        }`}
                      >
                        {sm.calendarSync.googleCalendar ? '✓ Google Cal' : 'Google Cal'}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                          sm.calendarSync.outlookCalendar
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-gray-200 text-gray-500 line-through'
                        }`}
                      >
                        {sm.calendarSync.outlookCalendar ? '✓ Outlook' : 'Outlook'}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 ${
                          sm.calendarSync.appleCalendar
                            ? 'bg-purple-100 text-purple-950 border border-purple-400 font-bold'
                            : 'bg-gray-200 text-gray-500 line-through'
                        }`}
                      >
                        {sm.calendarSync.appleCalendar ? '✓ Apple Cal' : 'Apple Cal'}
                      </span>
                    </div>
                  </div>

                  {/* Assigned Services */}
                  <div className="mt-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">
                      Assigned Services ({assignedServices.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {assignedServices.map((as) => (
                        <span
                          key={as.id}
                          className="text-[10px] bg-indigo-50 text-indigo-900 border border-indigo-100 px-2 py-0.5 rounded-md font-semibold truncate max-w-[200px]"
                        >
                          {as.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingStaff(sm)}
                    className="flex-1 py-2 bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 text-gray-800 font-bold text-xs rounded-xl transition cursor-pointer text-center"
                  >
                    Edit Working Hours & Sync
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- SUB-TAB 2: CUSTOM ROLES & PERMISSIONS MATRIX --- */}
      {subTab === 'permissions' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-black text-gray-900">
              Role-Based Access Control & Permissions
            </h3>
            <p className="text-xs text-gray-500">
              Control what team members can view, manage client finances, and handle refunds.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4 text-center">View Finances & POS</th>
                  <th className="py-3 px-4 text-center">Edit Schedule</th>
                  <th className="py-3 px-4 text-center">Issue Refunds</th>
                  <th className="py-3 px-4 text-center">Manage Client VIP Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staff.map((sm) => (
                  <tr key={sm.id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 px-4 font-bold text-gray-900 flex items-center gap-2.5">
                      <img
                        src={sm.avatar}
                        alt={sm.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span>{sm.name}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-indigo-600">{sm.role}</td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={sm.permissions.canViewFinances}
                        onChange={(e) =>
                          onUpdateStaff({
                            ...sm,
                            permissions: { ...sm.permissions, canViewFinances: e.target.checked }
                          })
                        }
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={sm.permissions.canEditSchedule}
                        onChange={(e) =>
                          onUpdateStaff({
                            ...sm,
                            permissions: { ...sm.permissions, canEditSchedule: e.target.checked }
                          })
                        }
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={sm.permissions.canIssueRefunds}
                        onChange={(e) =>
                          onUpdateStaff({
                            ...sm,
                            permissions: { ...sm.permissions, canIssueRefunds: e.target.checked }
                          })
                        }
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={sm.permissions.canManageClients}
                        onChange={(e) =>
                          onUpdateStaff({
                            ...sm,
                            permissions: { ...sm.permissions, canManageClients: e.target.checked }
                          })
                        }
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- SUB-TAB 3: BOOKABLE ROOMS & EQUIPMENT RESOURCES --- */}
      {subTab === 'resources' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => {
            const loc = locations.find((l) => l.id === res.locationId);

            return (
              <div
                key={res.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-3xl">{res.icon}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleResourceAvailability(res)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border cursor-pointer ${
                        res.isAvailable
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-rose-100 text-rose-900 border-rose-300'
                      }`}
                    >
                      {res.isAvailable ? '✓ Available' : '🔒 In Maintenance'}
                    </button>
                  </div>

                  <h3 className="text-base font-black text-gray-900">{res.name}</h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mt-0.5">
                    <span className="uppercase text-[10px] bg-gray-100 px-2 py-0.5 rounded">
                      {res.type}
                    </span>
                    <span>• Capacity: {res.capacity}</span>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed mt-2">{res.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                  <span>📍 {loc?.name || 'Global'}</span>
                  <span className="font-bold text-emerald-600">Zero Conflict Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- SUB-TAB 4: MULTI-LOCATION SITES --- */}
      {subTab === 'locations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map((loc) => {
            const staffCount = staff.filter((s) => s.locationIds.includes(loc.id)).length;
            const servicesCount = services.filter((s) => s.locationId === loc.id || s.delivery === 'online').length;

            return (
              <div
                key={loc.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {loc.badge || 'Global Hub'}
                    </span>
                    <h3 className="text-lg font-black text-gray-900 mt-1">{loc.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{loc.address}</p>
                  </div>
                  <span className="text-2xl">{loc.isVirtual ? '🌐' : '🏙️'}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-2xl">
                  <div>
                    <span className="text-gray-400 font-bold block text-[10px] uppercase">Timezone:</span>
                    <span className="font-semibold text-gray-800">{loc.timezone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-[10px] uppercase">Phone:</span>
                    <span className="font-semibold text-gray-800">{loc.contactPhone}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-[10px] uppercase">Specialists:</span>
                    <span className="font-semibold text-indigo-600">{staffCount} Assigned</span>
                  </div>
                  <div>
                    <span className="text-gray-400 font-bold block text-[10px] uppercase">Services:</span>
                    <span className="font-semibold text-emerald-600">{servicesCount} Active</span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 flex justify-between items-center">
                  <span>Synced with central master ledger</span>
                  <span className="font-bold text-indigo-600">Operational</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- Modal: Edit Staff Working Hours & Calendar Sync --- */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  Edit Availability: {editingStaff.name}
                </h3>
                <span className="text-xs text-indigo-600 font-bold">{editingStaff.role}</span>
              </div>
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Calendar Sync Toggles */}
            <div className="my-4 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-900 block">
                Personal Calendar Integration
              </span>
              <div className="grid grid-cols-3 gap-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingStaff.calendarSync.googleCalendar}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        calendarSync: { ...editingStaff.calendarSync, googleCalendar: e.target.checked }
                      })
                    }
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span>Google Cal</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingStaff.calendarSync.outlookCalendar}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        calendarSync: { ...editingStaff.calendarSync, outlookCalendar: e.target.checked }
                      })
                    }
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span>Outlook</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingStaff.calendarSync.appleCalendar}
                    onChange={(e) =>
                      setEditingStaff({
                        ...editingStaff,
                        calendarSync: { ...editingStaff.calendarSync, appleCalendar: e.target.checked }
                      })
                    }
                    className="w-4 h-4 rounded text-indigo-600"
                  />
                  <span>Apple Cal</span>
                </label>
              </div>
            </div>

            {/* Weekly Schedule Days */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto p-1">
              <span className="text-xs font-black uppercase tracking-wider text-gray-700 block">
                Weekly Operating Hours
              </span>
              {Object.entries(editingStaff.workingHours).map(([day, hours]) => (
                <div
                  key={day}
                  className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl text-xs"
                >
                  <label className="flex items-center gap-2 font-bold text-gray-800 w-28 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hours.isWorking}
                      onChange={(e) =>
                        setEditingStaff({
                          ...editingStaff,
                          workingHours: {
                            ...editingStaff.workingHours,
                            [day]: { ...hours, isWorking: e.target.checked }
                          }
                        })
                      }
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                    <span>{day}</span>
                  </label>

                  {hours.isWorking ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={hours.start}
                        onChange={(e) =>
                          setEditingStaff({
                            ...editingStaff,
                            workingHours: {
                              ...editingStaff.workingHours,
                              [day]: { ...hours, start: e.target.value }
                            }
                          })
                        }
                        className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={hours.end}
                        onChange={(e) =>
                          setEditingStaff({
                            ...editingStaff,
                            workingHours: {
                              ...editingStaff.workingHours,
                              [day]: { ...hours, end: e.target.value }
                            }
                          })
                        }
                        className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-400 font-semibold italic">Off-duty / Rest day</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateStaff(editingStaff);
                  setEditingStaff(null);
                }}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
              >
                Save Availability
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal: Add New Staff Member --- */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900">Add Team Specialist</h3>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 my-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Lord Julian Vance"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Role</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none"
                >
                  <option value="Master Concierge">Master Concierge</option>
                  <option value="Senior Specialist">Senior Specialist</option>
                  <option value="Lead Instructor">Lead Instructor</option>
                  <option value="Front Desk Manager">Front Desk Manager</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="specialist@fingerlux.protocol"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 800 589 8478"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewStaff}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
              >
                Save Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Modal: Add New Bookable Resource --- */}
      {showAddResourceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-gray-100 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900">Add Bookable Resource</h3>
              <button
                type="button"
                onClick={() => setShowAddResourceModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 my-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Resource Name</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Penthouse Salon B, Audio Suite"
                  value={newResourceName}
                  onChange={(e) => setNewResourceName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-slate-300 rounded-xl text-xs font-semibold focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Type</label>
                  <select
                    value={newResourceType}
                    onChange={(e) => setNewResourceType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-gray-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none"
                  >
                    <option value="room">Room / Suite</option>
                    <option value="equipment">Equipment</option>
                    <option value="vehicle">Escort Vehicle</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Capacity</label>
                  <input
                    type="number"
                    value={newResourceCapacity}
                    onChange={(e) => setNewResourceCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Facility Location</label>
                <select
                  value={newResourceLocationId}
                  onChange={(e) => setNewResourceLocationId(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none"
                >
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Features, amenities, specifications..."
                  value={newResourceDesc}
                  onChange={(e) => setNewResourceDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-slate-300 rounded-xl text-xs font-semibold outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowAddResourceModal(false)}
                className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewResource}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
              >
                Save Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
