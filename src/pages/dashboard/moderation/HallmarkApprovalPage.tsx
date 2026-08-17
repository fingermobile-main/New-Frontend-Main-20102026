import React, {} from 'react';
import { useHallmark } from '../../../contexts/HallmarkContext';
import type { HallmarkApplication } from '../../../types';
import AnimatedAvatar from '../../../components/AnimatedAvatar';
import { CheckCircleIcon, XCircleIcon } from '../../../components/icons';

const HallmarkApprovalPage: React.FC = () => {
    const { hallmarkApplications, handleApproveHallmarkApplication, handleRejectHallmarkApplication } = useHallmark();
    
    const pendingApplications = hallmarkApplications.filter((app: HallmarkApplication) => app.status === 'pending');

    const ApplicationCard: React.FC<{ application: HallmarkApplication }> = ({ application }) => (
        <div className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <AnimatedAvatar staticUrl={application.applicant.avatarUrl} altText={application.applicant.name} className="w-12 h-12 rounded-full" />
                    <div>
                        <p className="font-bold">{application.requestedHallmark.name}</p>
                        <p className="text-sm text-gray-500">by {application.applicant.name} (@{application.applicant.membername})</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleRejectHallmarkApplication(application.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                        <XCircleIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => handleApproveHallmarkApplication(application.id)} className="p-2 text-green-500 hover:bg-green-50 rounded-full">
                        <CheckCircleIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
            <div className="text-xs text-gray-600 mt-3 border-t pt-3 space-y-1">
                <p><strong>URL Slug:</strong> {application.requestedHallmark.slug}</p>
                <p><strong>Join Fee:</strong> {application.requestedHallmark.settings.joinFee} FIC</p>
                <p><strong>Member Limit:</strong> {application.requestedHallmark.settings.memberLimit.toLocaleString()}</p>
            </div>
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Hallmark Approval Queue</h1>
            {pendingApplications.length > 0 ? (
                <div className="space-y-4">
                    {pendingApplications.map((app: HallmarkApplication) => (
                        <ApplicationCard key={app.id} application={app} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-12 bg-white rounded-xl shadow-md">
                    <p className="font-semibold">The approval queue is empty.</p>
                </div>
            )}
        </div>
    );
};

export default HallmarkApprovalPage;
