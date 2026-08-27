import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const CheckoutPage: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<'wallet' | 'card'>('wallet');

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Checkout</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
            <h3 className="text-sm font-bold mb-3">Delivery address</h3>
            <p className="text-gray-300">12 Adetokunbo Str, Lekki, Lagos</p>
            <p className="text-sm text-gray-400">Kemi Afolabi · +234 810 000 0000</p>
            <button className="mt-2 text-sm text-orange-500 font-semibold">Edit</button>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
            <h3 className="text-sm font-bold mb-3">Payment</h3>
            <div className="space-y-2">
              <label className={`flex items-center gap-3 p-3 rounded-xl border ${
                selectedPayment === 'wallet' 
                  ? 'border-orange-500 bg-orange-500/10' 
                  : 'border-gray-700'
              }`}>
                <input 
                  type="radio" 
                  checked={selectedPayment === 'wallet'}
                  onChange={() => setSelectedPayment('wallet')}
                  className="accent-orange-500"
                />
                <span className="text-gray-300">Wallet balance</span>
                <span className="text-xs text-gray-400 ml-auto">₦3.9M</span>
              </label>
              
              <label className={`flex items-center gap-3 p-3 rounded-xl border ${
                selectedPayment === 'card' 
                  ? 'border-orange-500 bg-orange-500/10' 
                  : 'border-gray-700'
              }`}>
                <input 
                  type="radio" 
                  checked={selectedPayment === 'card'}
                  onChange={() => setSelectedPayment('card')}
                  className="accent-orange-500"
                />
                <span className="text-gray-300">Card</span>
                <span className="text-xs text-gray-400 ml-auto">•••• 4821</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4 h-fit">
          <h3 className="text-sm font-bold mb-3">Order summary</h3>
          <div className="space-y-2 text-gray-300">
            <div className="flex justify-between">
              <span className="text-gray-400">Luxe Chair ×1</span>
              <span>₦128,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Pro Kit ×1</span>
              <span>₦89,900</span>
            </div>
            <div className="flex justify-between border-t border-gray-700 pt-2 font-bold">
              <span>Total</span>
              <span className="text-orange-400">₦217,900</span>
            </div>
          </div>
          <button className="mt-4 w-full py-3 rounded-xl bg-orange-500 text-gray-900 font-bold">
            Pay now
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">
            SECURE · 3-DS · escrow
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
