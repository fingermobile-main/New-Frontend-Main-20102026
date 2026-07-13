import React from 'react';

import { useAppContext } from '../../../contexts/AppContext';

const GemApprovalPage: React.FC = () => {
  const { gemSubmissions, handleApproveGemContent, showToast } = useAppContext();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Gem Approval Queue</h1>
            <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-md">
                <p className="font-semibold">The approval queue is empty.</p>
                <p className="text-sm">No new Gems have been submitted for approval.</p>
            </div>
        </div>
    );
};

export default GemApprovalPage;

