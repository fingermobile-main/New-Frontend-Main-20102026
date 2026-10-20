import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, MapPin, AlertCircle, Check } from 'lucide-react';
import { Collaborator } from '../../../types/roles-permissions';

interface ManageLocationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborator: Collaborator | null;
  onSave: (
    id: string,
    data: { type: 'ALL' | 'SPECIFIC'; locationIds: string[]; locationNames: string[] }
  ) => Promise<void>;
}

const AVAILABLE_LOCATIONS = [
  { id: 'loc_lagos_hq', name: 'Lagos Flagship HQ Hub (Nigeria)' },
  { id: 'loc_abuja_hub', name: 'Abuja Federal Operations (Nigeria)' },
  { id: 'loc_london_hq', name: 'London Tech & FinOps Centre (UK)' },
  { id: 'loc_accra_branch', name: 'Accra West Africa Office (Ghana)' },
  { id: 'loc_nairobi_node', name: 'Nairobi East Africa Hub (Kenya)' },
];

export const ManageLocationsModal: React.FC<ManageLocationsModalProps> = ({
  isOpen,
  onClose,
  collaborator,
  onSave,
}) => {
  const [locationType, setLocationType] = useState<'ALL' | 'SPECIFIC'>(
    collaborator?.locationScope?.type || 'ALL'
  );
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>(
    collaborator?.locationScope?.locationIds || []
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen || !collaborator) return null;

  const handleToggleLocation = (locId: string) => {
    if (selectedLocationIds.includes(locId)) {
      setSelectedLocationIds(selectedLocationIds.filter((id) => id !== locId));
    } else {
      setSelectedLocationIds([...selectedLocationIds, locId]);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const selectedNames = AVAILABLE_LOCATIONS.filter((l) =>
        selectedLocationIds.includes(l.id)
      ).map((l) => l.name);

      await onSave(collaborator.id, {
        type: locationType,
        locationIds: locationType === 'SPECIFIC' ? selectedLocationIds : [],
        locationNames: locationType === 'SPECIFIC' ? selectedNames : [],
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-300 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage locations</h2>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
              Select which locations to assign this site collaborator ({collaborator.name}).{' '}
              <Link to="/admin/pages-permissions" onClick={onClose} className="text-blue-700 hover:underline font-bold">
                Location Policy Guide
              </Link>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-700 hover:text-slate-900 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Alert Banner */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 rounded-xl text-xs text-amber-950 dark:text-amber-200 font-medium flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-700 dark:text-amber-400" />
            <p>
              Location restrictions apply only to site collaborators with Restaurants and Bookings permissions.
              Other permissions have access to all locations.
            </p>
          </div>

          {/* Radio Options */}
          <div className="space-y-3">
            {/* All locations option */}
            <div
              onClick={() => setLocationType('ALL')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                locationType === 'ALL'
                  ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30'
                  : 'border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={locationType === 'ALL'}
                  onChange={() => setLocationType('ALL')}
                  className="w-4 h-4 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    All locations
                  </div>
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    Includes current and future locations.
                  </div>
                </div>
              </div>
            </div>

            {/* Specific locations option */}
            <div
              onClick={() => setLocationType('SPECIFIC')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                locationType === 'SPECIFIC'
                  ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30'
                  : 'border-slate-300 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  checked={locationType === 'SPECIFIC'}
                  onChange={() => setLocationType('SPECIFIC')}
                  className="w-4 h-4 text-slate-900 font-bold border border-slate-300 rounded bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"
                />
                <div>
                  <div className="font-bold text-xs text-slate-900 dark:text-white">
                    Specific locations
                  </div>
                  <div className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                    Assign individual hubs and storefront terminals.
                  </div>
                </div>
              </div>

              {locationType === 'SPECIFIC' && (
                <div className="mt-4 pt-3 border-t border-slate-300 dark:border-slate-700 space-y-2">
                  <div className="text-[11px] font-bold text-slate-900 dark:text-slate-200">
                    Select locations:
                  </div>
                  {AVAILABLE_LOCATIONS.map((loc) => {
                    const isSelected = selectedLocationIds.includes(loc.id);
                    return (
                      <div
                        key={loc.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLocation(loc.id);
                        }}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between cursor-pointer font-medium ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 font-bold'
                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-600" />
                          <span>{loc.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-300 dark:border-slate-800 flex items-center justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};
