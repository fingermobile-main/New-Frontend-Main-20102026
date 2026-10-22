import React, { useEffect, useState } from 'react';
import { ownitService, OwnitEntry } from '../../services/ownitService';

interface ExpiringWarrantiesListProps {
  userId: string;
  daysThreshold?: number;
}

const ExpiringWarrantiesList: React.FC<ExpiringWarrantiesListProps> = ({
  userId,
  daysThreshold = 30
}) => {
  const [expiringProducts, setExpiringProducts] = useState<OwnitEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExpiringWarranties();
  }, [userId]);

  const loadExpiringWarranties = async () => {
    try {
      setLoading(true);
      const data = await ownitService.getExpiringWarranties(daysThreshold);

      // Filter products expiring within threshold
      const now = new Date();
      const thresholdDate = new Date(now.getTime() + (daysThreshold * 24 * 60 * 60 * 1000));

      const filtered = (data || []).filter(product => {
        if (!product.warranty_end_date) return false;
        const endDate = new Date(product.warranty_end_date);
        return endDate > now && endDate <= thresholdDate;
      });

      setExpiringProducts(filtered);
      setError(null);
    } catch (err) {
      setError('Failed to load expiring warranties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysLeft = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyLevel = (daysLeft: number) => {
    if (daysLeft <= 7) {
      return { level: 'critical', color: 'bg-red-100 border-red-300 text-red-800', icon: '🚨' };
    } else if (daysLeft <= 14) {
      return { level: 'urgent', color: 'bg-orange-100 border-orange-300 text-orange-800', icon: '⚠️' };
    }
    return { level: 'warning', color: 'bg-yellow-100 border-yellow-300 text-yellow-800', icon: '⏰' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadExpiringWarranties}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Expiring Warranties</h2>
          <p className="text-sm text-gray-600 mt-1">
            Products with warranties expiring in the next {daysThreshold} days
          </p>
        </div>
        {expiringProducts.length > 0 && (
          <span className="px-3 py-1 bg-red-100 text-red-950 border border-red-400 font-bold rounded-full text-sm font-semibold font-black">
            {expiringProducts.length} expiring soon
          </span>
        )}
      </div>

      {/* Alert Banner */}
      {expiringProducts.length > 0 && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="font-bold text-red-900 mb-1">Action Required</h3>
              <p className="text-sm text-red-700">
                You have {expiringProducts.length} product{expiringProducts.length !== 1 ? 's' : ''} with warranties expiring soon.
                Consider extending coverage or filing claims before expiration.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Products List */}
      {expiringProducts.length === 0 ? (
        <div className="text-center py-12 bg-green-50 border-2 border-green-200 rounded-lg">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-green-900 mb-2">All Clear!</h3>
          <p className="text-green-700">No warranties expiring in the next {daysThreshold} days.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {expiringProducts.map((product) => {
            const daysLeft = getDaysLeft(product.warranty_end_date!);
            const urgency = getUrgencyLevel(daysLeft);

            return (
              <div
                key={product.id}
                className={`border-l-4 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${urgency.color}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{urgency.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg">{product.product_name}</h3>
                      <p className="text-sm opacity-75 mt-1">
                        {product.brand} • {product.model}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold">{daysLeft}</div>
                    <div className="text-xs uppercase tracking-wide">days left</div>
                  </div>
                </div>

                {/* Warranty Info */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="opacity-75 mb-1">Expires On</p>
                    <p className="font-semibold">{formatDate(product.warranty_end_date!)}</p>
                  </div>
                  <div>
                    <p className="opacity-75 mb-1">Provider</p>
                    <p className="font-semibold">{product.warranty_provider || 'Unknown'}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label={`Extend warranty for ${product.name || 'this product'}`}
                    onClick={() => window.location.assign(`/ownit/${product.id}/warranty/extend`)}
                    className="flex-1 px-4 py-2 bg-white border-2 border-current rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                  >
                    Extend Warranty
                  </button>
                  <button
                    type="button"
                    aria-label={`File a warranty claim for ${product.name || 'this product'}`}
                    onClick={() => window.location.assign(`/ownit/${product.id}/warranty/claim`)}
                    className="flex-1 px-4 py-2 bg-current text-white rounded-lg hover:bg-opacity-90 transition-colors font-medium"
                  >
                    File Claim
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Set up automatic renewal reminders to avoid missing warranty extensions.
        </p>
      </div>
    </div>
  );
};

export default ExpiringWarrantiesList;
