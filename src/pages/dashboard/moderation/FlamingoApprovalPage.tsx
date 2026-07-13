import React from 'react';

import { useAppContext } from '../../../contexts/AppContext';
import type { FlamingoSubmission } from '../../../types';

const FlamingoApprovalPage: React.FC = () => {
  const { flamingoSubmissions, showToast } = useAppContext();

    const pendingSubmissions = (flamingoSubmissions || []).filter((s) => s.status === 'pending');

    const handleApproveFlamingoContent = (id: string) => {
        // TODO: Implement actual approval logic
        showToast("Flamingo content approved");
        console.info("Approved flamingo submission:", id);
    };

    const SubmissionCard: React.FC<{ item: FlamingoSubmission }> = ({ item }) => (
        <div className="bg-white p-4 rounded-lg border flex gap-4">
            <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 rounded-md object-cover"  />
            <div className="flex-1">
                <p className="font-bold">{item.product.name}</p>
                <p className="text-sm text-gray-500">Submitted by {item.submittedBy.name}</p>
                <p className="text-xs text-gray-400">{item.submissionDate}</p>
            </div>
            <div className="flex flex-col justify-center gap-2">
                <button 
                    onClick={() => handleApproveFlamingoContent(item.id)}
                    className="px-3 py-1 text-sm font-semibold bg-green-100 text-green-800 rounded-full hover:bg-green-200"
                >
                    Approve
                </button>
                <button 
                    // Add deny handler later
                    className="px-3 py-1 text-sm font-semibold bg-red-100 text-red-800 rounded-full hover:bg-red-200"
                >
                    Deny
                </button>
            </div>
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Flamingo Content Approval</h1>
            {pendingSubmissions.length > 0 ? (
                <div className="space-y-4">
                    {pendingSubmissions.map((item) => (
                        <SubmissionCard key={item.id} item={item} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-md">
                    <p className="font-semibold">The approval queue is empty.</p>
                    <p className="text-sm">No new Flamingo content has been submitted.</p>
                </div>
            )}
        </div>
    );
};

export default FlamingoApprovalPage;
