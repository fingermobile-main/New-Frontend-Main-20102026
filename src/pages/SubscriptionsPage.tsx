import React from 'react';

const SubscriptionsPage: React.FC = () => {
  // Mock data for subscriptions
  const currentPlan = {
    name: 'Creator Pro',
    status: 'ACTIVE',
    price: '₦4,500',
    period: '/mo',
    stats: [
      { value: '₦2.4M', label: 'earned' },
      { value: '∞', label: 'media' },
      { value: '0%', label: 'fee' }
    ],
    manageButton: 'Manage plan'
  };

  const availablePlans = [
    {
      id: 1,
      name: 'Free',
      price: '₦0',
      features: ['Basic feed', '5GB media'],
      button: 'Current',
      current: true
    },
    {
      id: 2,
      name: 'Pro',
      price: '₦4,500',
      period: '/mo',
      features: ['Unlimited media', 'Monetization'],
      button: 'Upgrade',
      current: false,
      highlight: true
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-[22px] font-bold mb-2">Subscriptions</h1>
      <p className="text-[10px] text-gray-400 mb-6">manage plans · billing cycle</p>
      
      <div className="space-y-3">
        {/* Current Plan */}
        <div className="bg-gray-800 border-2 border-orange-500 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold">{currentPlan.name}</p>
              <p className="text-[9px] text-orange-500">{currentPlan.status}</p>
            </div>
            <p className="text-[20px] font-bold font-sans">{currentPlan.price}<span className="text-[11px] text-gray-400">{currentPlan.period}</span></p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            {currentPlan.stats.map((stat, index) => (
              <div key={index} className="bg-gray-700 rounded-xl p-3">
                <p className="text-[18px] font-bold">{stat.value}</p>
                <p className="text-[8px] text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-2.5 rounded-lg border border-gray-700 text-[12px] font-bold">
            {currentPlan.manageButton}
          </button>
        </div>
        
        {/* Available Plans */}
        <div className="flex gap-3 flex-wrap justify-center">
          {availablePlans.map(plan => (
            <div 
              key={plan.id} 
              className={`bg-gray-800 border border-gray-700 rounded-2xl p-5 flex-1 max-w-xs ${
                plan.highlight ? 'border-yellow-500' : ''
              }`}
            >
              <p className={`text-[13px] font-bold ${plan.highlight ? 'text-yellow-500' : ''}`}>{plan.name}</p>
              <p className="text-[18px] font-bold mt-1">
                {plan.price}{plan.period && <span className="text-[11px] text-gray-400">{plan.period}</span>}
              </p>
              <ul className="text-[12px] text-gray-400 mt-2 space-y-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx}>• {feature}</li>
                ))}
              </ul>
              <button 
                className={`mt-4 w-full py-2 rounded-lg ${
                  plan.current 
                    ? 'border border-gray-700' 
                    : 'bg-orange-500 text-gray-900 font-bold'
                } text-[12px]`}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;