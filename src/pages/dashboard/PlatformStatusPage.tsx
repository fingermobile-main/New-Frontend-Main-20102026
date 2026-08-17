import React, {} from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { MOCK_MODULE_STATUSES, MOCK_COMPLIANCE_STATUSES } from '../../constants';
// FIX: Remove unused ModuleStatus import, keep only what's needed
// ModuleStatus is a string union type, not used directly in this component

const PlatformStatusPage: React.FC = () => {
    // FIX: Remove unused showToast variable
    const {} = useAppContext();

    // FIX: Use specific type instead of any for module items
    interface ModuleItem {
        name?: string;
        module?: string;
        engine?: string;
        status?: string;
        [key: string]: any;
    }

    // FIX: Add type guard to handle both string union types and object structures
    const ModuleStatusCard: React.FC<{ item: ModuleItem }> = ({ item }) => {
        // Guard against string values (like 'error' from ModuleStatus union type)
        if (typeof item === 'string' || !item) {
            return (
                <div className="bg-red-50 p-4 rounded-lg border text-red-600">
                    Error rendering module status
                </div>
            );
        }

        return (
            <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="font-bold text-gray-800">{item.module || item.name || 'Unknown'}</p>
                <p className="text-sm text-gray-500">{item.engine || ''}</p>
                <p className="text-xs font-semibold text-yellow-600 mt-2">{item.status || 'unknown'}</p>
            </div>
        );
    };

    // FIX: Define proper type for compliance items based on actual mock data structure
    interface ComplianceItem {
        policyId?: string;
        memberId?: string;
        accepted?: boolean;
        acceptedAt?: string;
        requiresRenewal?: boolean;
        name?: string;
        status?: string;
        [key: string]: any;
    }

    const ComplianceStatusCard: React.FC<{ item: ComplianceItem }> = ({ item }) => (
        <div className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center">
            <p className="font-bold text-gray-800">{item.name || item.policyId || 'Policy'}</p>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                item.accepted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
                {item.accepted ? 'Accepted' : 'Pending'}
            </span>
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Platform Operations Status</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-4">Module Status</h2>
                    <div className="space-y-4">
                        {MOCK_MODULE_STATUSES.map((item, index) => (
                            <ModuleStatusCard key={index} item={item as ModuleItem} />
                        ))}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">Compliance Status</h2>
                    <div className="space-y-4">
                        {MOCK_COMPLIANCE_STATUSES.map((item, index) => (
                            <ComplianceStatusCard key={index} item={item as ComplianceItem} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformStatusPage;