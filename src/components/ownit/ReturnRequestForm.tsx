import React, { useState } from 'react';
import { ownitService, OwnitReturn } from '../../services/ownitService';

interface ReturnRequestFormProps {
  userId: string;
  orderId?: string;
  onSuccess?: (returnRequest: OwnitReturn) => void;
  onCancel?: () => void;
}

const returnReasons = [
  { value: 'defective', label: 'Defective/Damaged Product' },
  { value: 'wrong_item', label: 'Wrong Item Received' },
  { value: 'not_as_described', label: 'Not As Described' },
  { value: 'changed_mind', label: 'Changed Mind' },
  { value: 'too_small', label: 'Too Small' },
  { value: 'too_large', label: 'Too Large' },
  { value: 'duplicate_order', label: 'Duplicate Order' },
  { value: 'other', label: 'Other' }
];

const ReturnRequestForm: React.FC<ReturnRequestFormProps> = ({
  userId,
  orderId,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    order_id: orderId || '',
    product_name: '',
    quantity: 1,
    reason: '',
    description: '',
    photos: [] as string[],
    preferred_resolution: 'refund' // refund, exchange, store_credit
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.order_id || !formData.reason || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const returnRequest = await ownitService.createReturn(formData);

      if (onSuccess && returnRequest) {
        onSuccess(returnRequest);
      }
    } catch (err) {
      setError('Failed to submit return request. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-300 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Request Return</h3>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order Number *
          </label>
          <input
            type="text"
            value={formData.order_id}
            onChange={(e) => handleChange('order_id', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
            placeholder="Enter order number"
            required
          />
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            value={formData.product_name}
            onChange={(e) => handleChange('product_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity to Return
          </label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400 font-mono"
          />
        </div>

        {/* Return Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Return Reason *
          </label>
          <select
            value={formData.reason}
            onChange={(e) => handleChange('reason', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-bold border-slate-300 bg-white"
            required
          >
            <option value="">Select return reason</option>
            {returnReasons.map((reason) => (
              <option key={reason.value} value={reason.value}>
                {reason.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-bold border-slate-300 bg-white placeholder:text-slate-400"
            placeholder="Describe the issue in detail..."
            required
          />
        </div>

        {/* Preferred Resolution */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Resolution
          </label>
          <div className="flex gap-3">
            {[
              { value: 'refund', label: '💰 Refund' },
              { value: 'exchange', label: '🔄 Exchange' },
              { value: 'store_credit', label: '🎁 Store Credit' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleChange('preferred_resolution', option.value)}
                className={`flex-1 px-3 py-2 rounded-lg border-2 transition-colors ${
                  formData.preferred_resolution === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photo Upload Placeholder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photos (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <p className="text-sm text-gray-600">Click to upload photos</p>
            <p className="text-xs text-gray-500 mt-1">Max 5 photos showing the issue</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Return Request'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> You'll receive a return number once submitted. Returns are typically processed within 3-5 business days.
        </p>
      </div>
    </div>
  );
};

export default ReturnRequestForm;
