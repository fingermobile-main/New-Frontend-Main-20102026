import React, { useState } from 'react';
import { ownitService, OwnitWarrantyClaim } from '../../services/ownitService';

interface WarrantyClaimFormProps {
  userId: string;
  productId: string;
  onSuccess?: (claim: OwnitWarrantyClaim) => void;
  onCancel?: () => void;
}

const issueCategories = [
  { value: 'manufacturing_defect', label: 'Manufacturing Defect' },
  { value: 'wear_and_tear', label: 'Normal Wear and Tear' },
  { value: 'accidental_damage', label: 'Accidental Damage' },
  { value: 'battery_issue', label: 'Battery Issue' },
  { value: 'screen_damage', label: 'Screen Damage' },
  { value: 'water_damage', label: 'Water Damage' },
  { value: 'software_issue', label: 'Software/Malfunction' },
  { value: 'other', label: 'Other' }
];

const WarrantyClaimForm: React.FC<WarrantyClaimFormProps> = ({
  userId,
  productId,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    entry_id: productId,
    issue_category: '' as 'manufacturing_defect' | 'wear_and_tear' | 'accidental_damage' | 'software_issue' | 'battery_issue' | 'other',
    issue_description: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    issue_discovered_date: new Date().toISOString().split('T')[0],
    photos: [] as string[],
    videos: [] as string[],
    diagnostic_reports: [] as string[],
    claim_notes: '',
    purchase_date: '',
    serial_number: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.issue_category || !formData.issue_description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const claim = await ownitService.createWarrantyClaim(formData);
      
      if (onSuccess && claim) {
        onSuccess(claim);
      }
    } catch (err) {
      setError('Failed to submit warranty claim. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">File Warranty Claim</h3>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Issue Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issue Category *
          </label>
          <select
            value={formData.issue_category}
            onChange={(e) => handleChange('issue_category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select issue category</option>
            {issueCategories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Issue Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issue Description *
          </label>
          <textarea
            value={formData.issue_description}
            onChange={(e) => handleChange('issue_description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the issue in detail..."
            required
          />
        </div>

        {/* Purchase Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Date
          </label>
          <input
            type="date"
            value={formData.purchase_date}
            onChange={(e) => handleChange('purchase_date', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Serial Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Serial Number
          </label>
          <input
            type="text"
            value={formData.serial_number}
            onChange={(e) => handleChange('serial_number', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product serial number"
          />
        </div>

        {/* Photo Upload Placeholder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photos (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <p className="text-sm text-gray-600">Click to upload photos</p>
            <p className="text-xs text-gray-500 mt-1">Max 5 photos, 5MB each</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Claim'}
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
          <strong>Note:</strong> You'll receive a claim number once submitted. Our team will review your claim within 2-3 business days.
        </p>
      </div>
    </div>
  );
};

export default WarrantyClaimForm;