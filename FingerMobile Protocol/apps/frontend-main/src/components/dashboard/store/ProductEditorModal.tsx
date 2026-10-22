import React, {} from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ProductEditorModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const ProductEditorModal: React.FC<ProductEditorModalProps> = ({ isOpen = false, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Edit Product</h2>
          <button type="button" onClick={onClose} className="text-slate-700 hover:text-gray-600">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input id="productName" type="text" placeholder="Product Name" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500" />
          </div>
          <div>
            <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
            <input id="productPrice" type="number" placeholder="Price" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500 font-mono" />
          </div>
          <div>
            <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea id="productDescription" placeholder="Description" rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-500"></textarea>
          </div>
          <button
            type="submit"
            aria-label="Save product changes"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEditorModal;
