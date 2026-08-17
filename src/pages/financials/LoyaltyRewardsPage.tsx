import React, {} from 'react';
import { useAppContext } from '../../contexts/AppContext';

const LoyaltyRewardsPage: React.FC = () => {
    // Mock data since loyaltyRewards doesn't exist in context
    const loyaltyRewards: any[] = [
        { id: '1', description: '10% off next purchase', claimed: false },
        { id: '2', description: 'Free shipping', claimed: true }
    ];

    // Mock loyalty tiers
    const loyaltyTiers = [
        {
            name: 'Bronze',
            pointsRequired: 0,
            benefits: [
                'Basic community access',
                'Standard content features',
                'Monthly giveaways entry'
            ],
            current: true
        },
        {
            name: 'Silver',
            pointsRequired: 1000,
            benefits: [
                'Everything in Bronze',
                'Early content access',
                'Priority customer support',
                'Exclusive events access',
                'Ad-free experience'
            ]
        },
        {
            name: 'Gold',
            pointsRequired: 5000,
            benefits: [
                'Everything in Silver',
                'Premium content access',
                'Personalized recommendations',
                'VIP event invitations',
                'Dedicated account manager',
                'Advanced analytics'
            ]
        },
        {
            name: 'Platinum',
            pointsRequired: 10000,
            benefits: [
                'Everything in Gold',
                'Exclusive creator tools',
                'Co-creation opportunities',
                'One-on-one consultations',
                'Custom feature requests',
                'Revenue sharing program'
            ]
        }
    ];
    
    // Mock available rewards
    const availableRewards = [
        { id: '1', name: '100 FIC Bonus', points: 500, type: 'fic' },
        { id: '2', name: 'Exclusive Badge', points: 250, type: 'badge' },
        { id: '3', name: 'Premium Feature Access', points: 1000, type: 'feature' },
        { id: '4', name: '250 FIC Bonus', points: 1250, type: 'fic' },
        { id: '5', name: 'Limited Edition NFT', points: 2000, type: 'nft' },
        { id: '6', name: 'One-on-One Consultation', points: 3000, type: 'service' }
    ];
    
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Loyalty Rewards</h2>
                <p className="mt-1 text-gray-600">Earn points and unlock exclusive benefits</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Your Loyalty Status</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-xl font-bold text-gray-900">Bronze Tier</h4>
                                    <p className="text-gray-600">0/1000 points to Silver</p>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-gray-700">Progress to Silver</span>
                                    <span className="text-sm font-medium text-gray-700">0%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-brand-blue h-2.5 rounded-full" style={{ width: '0%' }}></div>
                                </div>
                            </div>
                            
                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-600">Points Earned</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">0</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-600">Points to Next Tier</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">1000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Claimable Rewards</h3>
                        <div className="space-y-3">
                            {loyaltyRewards.filter((r: any) => !r.claimed).map((reward: any) => (
                                <div key={reward.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{reward.description}</p>
                                        <p className="text-sm text-gray-600">{reward.points} points</p>
                                    </div>
                                    <button className="px-3 py-1 bg-brand-blue text-white text-sm rounded-full hover:bg-blue-700">
                                        Claim
                                    </button>
                                </div>
                            ))}
                            {loyaltyRewards.filter((r: any) => !r.claimed).length === 0 && (
                                <p className="text-gray-500 text-center py-4">No rewards available to claim</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Loyalty Tiers</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {loyaltyTiers.map((tier, index) => (
                        <div 
                            key={tier.name} 
                            className={`p-6 border-r border-b border-gray-200 ${
                                tier.current ? 'bg-blue-50' : ''
                            }`}
                        >
                            <div className="flex items-center">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                                    index === 0 ? 'bg-yellow-100' : 
                                    index === 1 ? 'bg-gray-300' : 
                                    index === 2 ? 'bg-yellow-400' : 'bg-gray-800'
                                }`}>
                                    <span className={`font-bold ${
                                        index === 0 ? 'text-yellow-800' : 
                                        index === 1 ? 'text-gray-700' : 
                                        index === 2 ? 'text-yellow-900' : 'text-white'
                                    }`}>
                                        {tier.name.charAt(0)}
                                    </span>
                                </div>
                                <div className="ml-3">
                                    <h4 className="font-bold text-gray-900">{tier.name}</h4>
                                    <p className="text-sm text-gray-600">{tier.pointsRequired}+ points</p>
                                </div>
                                {tier.current && (
                                    <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-blue text-white">
                                        Current
                                    </span>
                                )}
                            </div>
                            
                            <ul className="mt-4 space-y-2">
                                {tier.benefits.map((benefit, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <svg className="h-5 w-5 text-green-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="ml-2 text-sm text-gray-600">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Available Rewards</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {availableRewards.map((reward) => (
                        <div key={reward.id} className="p-6 border-r border-b border-gray-200">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-blue bg-opacity-10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h4 className="font-medium text-gray-900">{reward.name}</h4>
                                    <p className="text-sm text-gray-600">{reward.points} points</p>
                                </div>
                            </div>
                            <button className="mt-4 w-full px-3 py-1 border border-gray-300 text-sm rounded-md hover:bg-gray-50">
                                Redeem
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoyaltyRewardsPage;
