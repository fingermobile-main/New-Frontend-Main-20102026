import React from 'react';
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { useMarketplace } from '../contexts/MarketplaceContext';
import { useAuth } from '../contexts/AuthContext';
import type { CartItem } from '../types';

const CheckoutPage: React.FC = () => {
  const { ficBalance, showToast } = useAppContext();
  const { cart, placeOrder } = useMarketplace();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showGiftModal, setShowGiftModal] = React.useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<any>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

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
      showToast("Insufficient FIC balance to send gift", "error");
      return;
    }

    setSelectedItem(item);
    setShowGiftModal(true);
  };

  const onOpenPaylinkModal = (item: any) => {
    if (ficBalance < item.price * 100) {
      showToast("Insufficient FIC balance to create paylink", "error");
      return;
    }

    setSelectedItem(item);
    setShowPaylinkModal(true);
  };

  const handleSendGift = () => {
    if (!selectedItem) return;
    showToast("Gift sent successfully");
    setShowGiftModal(false);
    setSelectedItem(null);
  };

  const handleCreatePaylink = () => {
    if (!selectedItem) return;
    showToast("Paylink created successfully");
    setShowPaylinkModal(false);
    setSelectedItem(null);
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      showToast("Please log in to complete your purchase", "error");
      return;
    }

    if (cart.length === 0) {
      showToast("Your cart is empty", "error");
      return;
    }

    if (!hasSufficientFunds) {
      showToast("Insufficient FIC balance", "error");
      return;
    }

    setIsProcessing(true);

    try {
      await placeOrder();
      showToast("Order placed successfully");
      navigate("/orders");
    } catch (error) {
      showToast("Failed to place order", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            Checkout
          </h1>

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
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">
                        ${item.price.toFixed(2)}
                      </p>
                      <button
                        onClick={() => onOpenGiftModal(item)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Gift
                      </button>
                      <button
                        onClick={() => onOpenPaylinkModal(item)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Paylink
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200 p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Subtotal</p>
                  <p className="text-gray-900">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-500">Tax (7.5%)</p>
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
                            w-full mt-6 py-3 px-4 rounded-lg text-white font-medium
                            ${
                              isProcessing || !user || cart.length === 0 || !hasSufficientFunds
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-brand-blue hover:bg-blue-700"
                            }
                        `}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </button>
        </div>
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
                className="w-full px-4 py-2 border rounded-lg" />
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
                className="w-full px-4 py-2 border rounded-lg" />
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
