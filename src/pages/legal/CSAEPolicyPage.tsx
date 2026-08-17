import React, {} from 'react';

import { PolicyIcon } from '../../components/icons';

const CSAEPolicyPage: React.FC = () => {
    return (
        <div className="p-6 lg:p-8 bg-white min-h-full">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <PolicyIcon className="w-10 h-10 text-red-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Child Sexual Abuse and Exploitation (CSAE) Policy</h1>
                        <p className="text-gray-600">Our zero-tolerance policy towards CSAE material.</p>
                    </div>
                </div>

                <div className="prose prose-sm max-w-none text-gray-600 bg-red-50 p-6 rounded-xl border border-red-200">
                    <p><strong>FingerMobile Protocol has a strict zero-tolerance policy for any content involving Child Sexual Abuse and Exploitation (CSAE).</strong></p>
                    <p>This page will detail our comprehensive policy, including:</p>
                    <ul>
                        <li>Our commitment to protecting children online.</li>
                        <li>Definitions of prohibited content.</li>
                        <li>Proactive detection technologies and moderation practices.</li>
                        <li>The process for reporting suspicious content.</li>
                        <li>Our legal obligation and process for reporting all instances of CSAE material to law enforcement authorities, including the National Center for Missing & Exploited Children (NCMEC).</li>
                        <li>Immediate and permanent account termination for members who violate this policy.</li>
                    </ul>
                    <p>We are dedicated to maintaining a safe platform for all members.</p>
                </div>
            </div>
        </div>
    );
};

export default CSAEPolicyPage;

