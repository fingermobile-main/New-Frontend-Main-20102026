import React, { useEffect, useState } from 'react';
import { storefrontService, InventoryItem, StorefrontProduct } from '../../services/storefrontService';

interface RestockFormProps {
  productId: string;
  inventoryId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const RestockForm: React.FC<RestockFormProps> = ({
  productId,
  inventoryId,
  onSuccess,
  onCancel
}) => {
  const [product, setProduct] = useState<StorefrontProduct | null>(null);
  const [inventory, setInventory] = useState<InventoryItem | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [unitCost, setUnitCost] = useState<number>(0);
  const [warehouseLocation, setWarehouseLocation] = useState<string>('');
  const [supplierId, setSupplierId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [productId, inventoryId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load product details
      const productData = await storefrontService.getProduct(productId);
      setProduct(productData);

      // Load inventory if inventoryId provided, otherwise get first inventory record
      if (inventoryId) {
        const inventories = await storefrontService.getInventory(productId);
        const inv = inventories.find(i => i.id === inventoryId);
        setInventory(inv || null);
        if (inv) {
          setWarehouseLocation(inv.warehouse_location || '');
          setSupplierId(inv.supplier_id || '');
          setUnitCost(inv.unit_cost || 0);
        }
      } else {
        const inventories = await storefrontService.getInventory(productId);
        if (inventories && inventories.length > 0) {
          setInventory(inventories[0]);
          setWarehouseLocation(inventories[0].warehouse_location || '');
          setSupplierId(inventories[0].supplier_id || '');
          setUnitCost(inventories[0].unit_cost || 0);
        }
      }

      setError(null);
    } catch (err) {
      setError('Failed to load product information');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (!inventory) {
      setError('No inventory record found');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);

      // Update inventory with new values
      const updatedInventory = await storefrontService.updateInventory(inventory.id, {
        quantity: inventory.quantity + quantity,
        unit_cost: unitCost || undefined,
        warehouse_location: warehouseLocation || undefined,
        supplier_id: supplierId || undefined,
        lastRestocked: new Date().toISOString()
      });

      // Create inventory log entry
      await storefrontService.restockInventory(inventory.id, quantity, notes);

      setSuccess(`Successfully restocked ${quantity} units`);
      setQuantity(0);
      setNotes('');

      // Refresh inventory data
      await loadData();

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to restock inventory');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotalValue = () => {
    if (!inventory) return 0;
    const newQuantity = inventory.quantity + quantity;
    return newQuantity * (unitCost || 0);
  };

  const commonQuantities = [5, 10, 25, 50, 100];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadData}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-slate-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Restock Inventory</h2>
        {product && (
          <p className="text-sm text-green-100 mt-1">{product.name}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Current Stock Info */}
        {inventory && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-3">Current Inventory Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-blue-700 mb-1">Available</p>
                <p className="text-2xl font-bold text-blue-900">{inventory.available_quantity}</p>
              </div>
              <div>
                <p className="text-blue-700 mb-1">Reserved</p>
                <p className="text-2xl font-bold text-blue-900">{inventory.reserved_quantity}</p>
              </div>
              <div>
                <p className="text-blue-700 mb-1">Reorder Point</p>
                <p className="text-2xl font-bold text-blue-900">{inventory.reorder_point}</p>
              </div>
              <div>
                <p className="text-blue-700 mb-1">Status</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                  inventory.quantity > 10 ? 'bg-green-100 text-green-950 border border-green-400 font-bold' :
                    inventory.quantity > 0 ? 'bg-amber-100 text-amber-950 border border-amber-400 font-bold' :
                      'bg-red-100 text-red-950 border border-red-400 font-bold'
                }`}>
                  {inventory.status ? inventory.status.toUpperCase() : 'UNKNOWN'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <p className="text-green-800 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Restock Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restock Quantity *
          </label>
          <div className="space-y-2">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter quantity"
              required
            />

            {/* Quick Select Buttons */}
            <div className="flex gap-2 flex-wrap">
              {commonQuantities.map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setQuantity(qty)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  +{qty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Unit Cost */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit Cost ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={unitCost}
            onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0.00"
          />
          <p className="text-xs text-gray-500 mt-1">Leave blank to keep current cost</p>
        </div>

        {/* Warehouse Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Warehouse Location
          </label>
          <input
            type="text"
            value={warehouseLocation}
            onChange={(e) => setWarehouseLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., A-12-3"
          />
        </div>

        {/* Supplier ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Supplier ID
          </label>
          <input
            type="text"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Optional supplier reference"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Add any additional notes about this restock..."
          />
        </div>

        {/* Summary */}
        {quantity > 0 && inventory && (
          <div className="bg-gray-50 border border-slate-300 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Restock Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Quantity:</span>
                <span className="font-medium">{inventory.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Adding:</span>
                <span className="font-medium text-green-600">+{quantity}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-1">
                <span className="text-gray-600">New Total:</span>
                <span className="font-bold text-gray-900">{inventory.quantity + quantity}</span>
              </div>
              {unitCost > 0 && (
                <div className="flex justify-between border-t border-gray-200 pt-1">
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-bold text-gray-900">
                    ${calculateTotalValue().toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={submitting || quantity <= 0}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Restocking...
              </span>
            ) : (
              'Confirm Restock'
            )}
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
    </div>
  );
};

export default RestockForm;
