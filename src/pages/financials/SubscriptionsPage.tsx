import React, {} from 'react';

const SubscriptionsPage: React.FC = () => {
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Subscriptions</h2>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <p className="text-gray-500">You don't have any active subscriptions yet.</p>
                <button className="mt-4 px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700">
                    Explore Creators
                </button>
            </div>
        </div>
    );
};

export default SubscriptionsPage;
