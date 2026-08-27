import React from 'react';
import { TicketIcon, GiftIcon, BoltIcon } from '@heroicons/react/24/outline';

const CouponsPage: React.FC = () => {
  // Mock data for coupons
  const coupons = [
    {
      id: 1,
      title: '20% off Fashion',
      description: 'Min spend ₦50k · expires in 3d',
      code: 'FMLUX20',
      type: 'special',
      icon: <TicketIcon className="h-7 w-7 text-yellow-500" />
    },
    {
      id: 2,
      title: 'Free shipping',
      description: 'On orders above ₦100k',
      code: 'AUTO',
      type: 'auto',
      icon: <GiftIcon className="h-7 w-7 text-orange-500" />
    },
    {
      id: 3,
      title: 'New user 10%',
      description: 'First purchase bonus',
      code: 'NEW10',
      type: 'standard',
      icon: <BoltIcon className="h-7 w-7 text-yellow-500" />
    }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-[22px] font-bold mb-5">Coupons &amp; offers</h1>
      <div className="space-y-3">
        {coupons.map(coupon => (
          <div 
            key={coupon.id} 
            className={`${
              coupon.type === 'special' 
                ? 'bg-gradient-to-r from-yellow-500/20 to-gray-800 border border-yellow-500/40' 
                : 'bg-gray-800 border border-gray-700'
            } rounded-2xl p-4 flex items-center gap-4`
          }>
            <div className="grid place-items-center w-14 h-14 rounded-xl bg-orange-500/15 text-orange-500">
              {coupon.icon}
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold">{coupon.title}</p>
              <p className="text-[12px] text-gray-400">{coupon.description}</p>
              <p className="text-[12px] mt-1 text-gray-100 border border-dashed border-yellow-500 rounded px-2 py-0.5 inline-block">
                {coupon.code}
              </p>
            </div>
            {coupon.type !== 'special' && (
              <span className="text-[9px] px-2 py-1 rounded bg-gray-700">AUTO</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CouponsPage;