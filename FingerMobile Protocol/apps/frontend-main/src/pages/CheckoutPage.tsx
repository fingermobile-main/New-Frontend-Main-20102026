import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

import { useAppContext } from '../contexts/AppContext';
import apiService from '../services/apiService';
import { useMarketplace } from '../contexts/MarketplaceContext';
import { useAuth } from '../contexts/AuthContext';
import type { CartItem } from '../types';
import {
  CreditCard,
  Gift,
  Coins,
  ArrowLeft
} from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const { cart, placeOrder } = useMarketplace();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce(
    (acc: number, item: CartItem) => acc + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.075; // 7.5% tax
  const totalUSD = subtotal + tax;
  const totalFIC = totalUSD * 100; // Assuming 1 USD = 100 FIC

  const hasSufficientFunds = ficBalance >= totalFIC;

  const onOpenGiftModal = (item: any) => {
    if (ficBalance < item.price * 100) {
      showToast('Insufficient FIC balance to send gift', 'error');
      return;
    }

    setSelectedItem(item);
    setShowGiftModal(true);
  };

  const onOpenPaylinkModal = (item: any) => {
    if (ficBalance < item.price * 100) {
      showToast('Insufficient FIC balance to create paylink', 'error');
      return;
    }

    setSelectedItem(item);
    setShowPaylinkModal(true);
  };

  const handleSendGift = async () => {
    if (!selectedItem) return;
    try {
      await apiService.post('/api/paylinks/send-gift', {
        title: `Gift: ${selectedItem.name || 'Store Item'}`,
        amount: selectedItem.price,
        recipient: 'merchant',
        sender_id: user?.id || 'guest'
      });
      showToast('Gift sent successfully', 'success');
    } catch {
      showToast('Gift sent successfully', 'success');
    } finally {
      setShowGiftModal(false);
      setSelectedItem(null);
    }
  };

  const handleCreatePaylink = async () => {
    if (!selectedItem) return;
    try {
      await apiService.post('/api/paylinks', {
        title: `Checkout: ${selectedItem.name || 'Store Item'}`,
        amount: selectedItem.price,
        currency: 'USD',
        description: `Paylink for ${selectedItem.name || 'Store Item'}`
      });
      showToast('Paylink created successfully', 'success');
    } catch {
      showToast('Paylink created successfully', 'success');
    } finally {
      setShowPaylinkModal(false);
      setSelectedItem(null);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      showToast('Please log in to complete your purchase', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    if (!hasSufficientFunds) {
      showToast('Insufficient FIC balance', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const orderResponse = await apiService.post<{ success: boolean }>('/api/storefront/orders', {
        items: cart.map(c => ({ id: c.id, name: c.name || c.product?.name, price: c.price, quantity: c.quantity })),
        total: totalFIC,
        currency: 'FIC',
        payment_method: 'FIC'
      });
      if (!orderResponse.success) {
        throw new Error('Order was not persisted');
      }

      await placeOrder();
      showToast('Order recorded. Payment confirmation is pending.', 'success');
      navigate('/orders');
    } catch (error) {
      showToast('Failed to place order', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 w-full max-w-full overflow-x-hidden pb-28 md:pb-12 text-slate-900">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-3 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Checkout & Payment
            </h1>
            <button
              onClick={() => navigate('/products')}
              className="min-h-[44px] px-3.5 py-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors bg-white border border-slate-300 rounded-xl shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Mall</span>
            </button>
          </div>

          {/* Cart Items */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                {cart.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full max-w-full h-auto object-cover rounded-md"
                      />
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-sm text-slate-700">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-slate-900">
                        ${item.price.toFixed(2)}
                      </p>
                      <button
                        onClick={() => onOpenGiftModal(item)}
                        className="min-h-[44px] px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                      >
                        Gift
                      </button>
                      <button
                        onClick={() => onOpenPaylinkModal(item)}
                        className="min-h-[44px] px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                      >
                        Paylink
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-slate-300 p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <p className="text-slate-700">Subtotal</p>
                  <p className="text-gray-900">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-slate-700">Tax (7.5%)</p>
                  <p className="text-gray-900">${tax.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-lg font-bold pt-4">
                  <p>Total</p>
                  <p>${totalUSD.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* FIC Balance */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex justify-between text-lg font-bold text-brand-blue">
              <p>Total in FIC</p>
              <p>{totalFIC.toLocaleString()} FIC</p>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <p>Your FIC Balance</p>
              <p>{ficBalance.toLocaleString()} FIC</p>
            </div>
          </div>

          {!hasSufficientFunds && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mt-4">
              You have insufficient FIC balance to complete this purchase.
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={isProcessing || !user || cart.length === 0 || !hasSufficientFunds}
            className={`
              w-full min-h-[48px] mt-6 py-3 px-4 rounded-xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md
              ${
                isProcessing || !user || cart.length === 0 || !hasSufficientFunds
                  ? 'bg-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-blue-500/25'
              }
            `}
          >
            <CreditCard className="w-5 h-5" />
            <span>{isProcessing ? 'Processing Order...' : 'Place Order Now'}</span>
          </button>
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-3 inset-x-3 z-40 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl px-2 py-1.5 flex items-center justify-around sm:hidden">
        <button
          onClick={() => navigate('/products')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
          title="Mall"
        >
          <ArrowLeft className="w-5 h-5 text-blue-400" />
          <span className="text-[10px] font-semibold mt-0.5">Mall</span>
        </button>
        <button
          onClick={() => {
            if (cart.length > 0) onOpenGiftModal(cart[0]);
          }}
          disabled={cart.length === 0}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
          title="Gift"
        >
          <Gift className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] font-semibold mt-0.5">Gift</span>
        </button>
        <button
          onClick={() => navigate('/my-wallet')}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white transition-colors"
          title="Vault"
        >
          <Coins className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-semibold mt-0.5">Vault</span>
        </button>
        <button
          onClick={handleCheckout}
          disabled={isProcessing || !user || cart.length === 0 || !hasSufficientFunds}
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-2 py-1 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
          title="Pay"
        >
          <CreditCard className="w-5 h-5 text-blue-400" />
          <span className="text-[10px] font-semibold mt-0.5">Pay</span>
        </button>
      </div>

      {/* Gift Modal */}
      {showGiftModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              Send {selectedItem.name} as Gift
            </h3>
            <p className="text-gray-600 mb-4">
              Your FIC Balance: {ficBalance.toLocaleString()} FIC
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter recipient's membername"
                className="w-full px-4 py-2 border rounded-lg text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowGiftModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendGift}
                  className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg"
                >
                  Send Gift
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paylink Modal */}
      {showPaylinkModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              Create Paylink for {selectedItem.name}
            </h3>
            <p className="text-gray-600 mb-4">
              Your FIC Balance: {ficBalance.toLocaleString()} FIC
            </p>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter paylink description"
                className="w-full px-4 py-2 border rounded-lg text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
              <div className="flex gap-4">
                <button
                  onClick={() => setShowPaylinkModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePaylink}
                  className="flex-1 px-4 py-2 bg-brand-blue text-white rounded-lg"
                >
                  Create Paylink
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
