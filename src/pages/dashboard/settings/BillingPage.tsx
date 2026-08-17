import React, {} from 'react';

import { useAppContext } from '../../../contexts/AppContext';
import { useAuth } from 'contexts/AuthContext';
import { CreditCardIcon } from '@heroicons/react/24/solid';

const BillingPage = () => {
    const { billingHistory } = useAppContext();
    const { showToast } = useAppContext();
    const { member } = useAuth();

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Billing & Subscriptions</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-bold mb-4">Current Plan</h2>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-2xl font-bold text-brand-blue">{member?.currentPlan || 'Basic'}</p>
                            <p className="text-sm text-gray-600 mt-1">
                                {member?.isSubscribed 
                                    ? `Renews on ${member.subscriptionExpiryDate ? new Date(member.subscriptionExpiryDate).toLocaleDateString() : 'N/A'}` 
                                    : 'Upgrade for more features.'}
                            </p>
                        </div>
                         <button className="w-full mt-4 py-2 font-semibold bg-brand-blue text-white rounded-lg hover:bg-blue-700">
                            Manage Subscription
                        </button>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                        <div className="flex items-center gap-3">
                            <CreditCardIcon className="w-8 h-8 text-gray-400" />
                            <div>
                                <p className="font-semibold">Visa ending in 4242</p>
                                <p className="text-sm text-gray-500">Expires 12/2026</p>
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 font-semibold bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                            Update Payment Method
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold mb-4">Billing History</h2>
                    <div className="space-y-3">
                        {(billingHistory || []).map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <div>
                                    <p className="font-semibold">{item.description}</p>
                                    <p className="text-sm text-gray-500">{item.date}</p>
                                </div>
                                <p className="font-bold text-gray-800">{item.amount.toLocaleString()} FIC</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
