import React, { useState } from 'react';
interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems?: any[];
  onUpdateQuantity?: (itemId: string, quantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onCheckout?: () => void;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);

  if (!isOpen) return null;

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleCheckout = async () => {
    try {
      setCheckoutProcessing(true);
      if (onCheckout) {
        await onCheckout();
      }
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      setCheckoutProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose} role="button" tabIndex={0}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🛒 Shopping Cart
              {cartItems.length > 0 && (
                <span className="px-2 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                  {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-4">Add some items to get started!</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {/* Cart Items */}
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg"  />
                      ) : (
                        <span className="text-3xl">📦</span>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.description || ''}</p>
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(item.price)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity && onUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveItem && onRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                {/* Order Summary */}
                <div className="border-t border-gray-200 pt-4 mt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (8%)</span>
                      <span className="font-medium">{formatCurrency(calculateTax())}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                      <span>Total</span>
                      <span className="text-blue-600">{formatCurrency(calculateTotal())}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-3">
              <button
                onClick={handleCheckout}
                disabled={checkoutProcessing}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </span>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
