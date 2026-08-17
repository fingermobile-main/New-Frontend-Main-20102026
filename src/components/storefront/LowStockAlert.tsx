import React, { useEffect, useState } from 'react';
import { storefrontService, InventoryItem } from '../../services/storefrontService';

interface LowStockAlertProps {
  storeId: string;
  onRestock?: (inventoryId: string) => void;
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ storeId, onRestock }) => {
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [restocking, setRestocking] = useState<string | null>(null);

  useEffect(() => {
    loadLowStockItems();
  }, [storeId]);

  const loadLowStockItems = async () => {
    try {
      setLoading(true);
      // Get all products and filter for low stock items manually
      const productsData = await storefrontService.getProducts(storeId);
      const products = Array.isArray(productsData) ? productsData : (productsData as any).products || [];
      
      const lowStockItems: any[] = [];
      for (const product of products) {
        const invData = await storefrontService.getInventory(product.id);
        if (invData && invData.length > 0) {
          invData.forEach((inv: any) => {
            if (inv.quantity < (inv.reorder_point || 10) && inv.quantity > 0) {
              lowStockItems.push({
                ...inv,
                product_name: product.name,
                sku: product.sku
              });
            }
          });
        }
      }
      
      setLowStockItems(lowStockItems);
      setError(null);
    } catch (err) {
      setError('Failed to load low stock alerts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestock = async (item: any) => {
    if (!onRestock) return;
    
    try {
      setRestocking(item.id);
      await onRestock(item.id);
      // Refresh the list after restocking
      await loadLowStockItems();
    } catch (err) {
      console.error('Failed to restock:', err);
    } finally {
      setRestocking(null);
    }
  };

  const getUrgencyLevel = (item: any) => {
    const ratio = item.quantity / item.reorder_point;
    if (ratio === 0) {
      return { level: 'critical', color: 'bg-red-600', icon: '🚨' };
    } else if (ratio < 0.25) {
      return { level: 'urgent', color: 'bg-red-500', icon: '⚠️' };
    } else if (ratio < 0.5) {
      return { level: 'warning', color: 'bg-orange-500', icon: '⚡' };
    }
    return { level: 'low', color: 'bg-yellow-500', icon: '📦' };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
          onClick={loadLowStockItems}
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
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">Low Stock Alerts</h2>
          {lowStockItems.length > 0 && (
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
              {lowStockItems.length} items need attention
            </span>
          )}
        </div>
        <button
          onClick={loadLowStockItems}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🚨</span>
            <p className="text-sm font-medium text-red-700">Out of Stock</p>
          </div>
          <p className="text-3xl font-bold text-red-900">
            {lowStockItems.filter(i => i.quantity === 0).length}
          </p>
        </div>
        
        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">⚡</span>
            <p className="text-sm font-medium text-orange-700">Critically Low</p>
          </div>
          <p className="text-3xl font-bold text-orange-900">
            {lowStockItems.filter(i => i.quantity > 0 && i.quantity < i.reorder_point * 0.25).length}
          </p>
        </div>
        
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">📦</span>
            <p className="text-sm font-medium text-yellow-700">Below Reorder Point</p>
          </div>
          <p className="text-3xl font-bold text-yellow-900">
            {lowStockItems.length}
          </p>
        </div>
      </div>

      {/* Alerts List */}
      {lowStockItems.length === 0 ? (
        <div className="text-center py-12 bg-green-50 border-2 border-green-200 rounded-lg">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-green-900 mb-2">All Stocked Up!</h3>
          <p className="text-green-700">No low stock items. Great job managing inventory!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lowStockItems.map((item) => {
            const urgency = getUrgencyLevel(item);
            const available = item.quantity - (item.reserved_quantity || 0);
            
            return (
              <div
                key={item.id}
                className="bg-white border-l-4 border-red-500 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{urgency.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {item.product_name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">SKU: {item.sku || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <span className={`px-3 py-1 ${urgency.color} text-white rounded-full text-xs font-semibold`}>
                    {urgency.level.toUpperCase()}
                  </span>
                </div>

                {/* Stock Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Current Stock</p>
                    <p className={`text-2xl font-bold ${
                      item.quantity === 0 ? 'text-red-600' : 'text-gray-900'
                    }`}>
                      {item.quantity}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Reserved</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {item.reserved_quantity || 0}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Available</p>
                    <p className={`text-2xl font-bold ${
                      available <= 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {available}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Reorder Point</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {item.reorder_point}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Stock Level</span>
                    <span>{Math.round((item.quantity / item.reorder_point) * 100)}% of reorder point</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        item.quantity === 0 ? 'bg-red-600' :
                        item.quantity < item.reorder_point * 0.25 ? 'bg-red-500' :
                        item.quantity < item.reorder_point * 0.5 ? 'bg-orange-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${Math.min((item.quantity / item.reorder_point) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {onRestock && (
                    <button
                      onClick={() => handleRestock(item)}
                      disabled={restocking === item.id}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                    >
                      {restocking === item.id ? 'Restocking...' : '📦 Restock Now'}
                    </button>
                  )}
                  
                  <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                    View Details
                  </button>
                  
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LowStockAlert;