import React from 'react';
import { useAppContext } from '../../contexts/AppContext';

const ReferralsPage: React.FC = () => {
    const { showToast } = useAppContext();
    
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Referrals</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <p className="text-gray-600">Refer friends and earn FIC tokens!</p>
                <button 
                    onClick={() => showToast('Referral link copied!', 'success')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Copy Referral Link
                </button>
            </div>
        </div>
    );
};

export default ReferralsPage;
