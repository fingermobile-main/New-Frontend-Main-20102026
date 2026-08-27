import React from 'react';
import { Package, ShoppingBag, Truck } from 'lucide-react';

const ProductsPage: React.FC = () => {
  const products = [
    {
      id: 1,
      name: 'Ring #03',
      price: '₦38,000',
      stock: 14,
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1524758870432-af57e54afa26?w=80&q=50'
    },
    {
      id: 2,
      name: 'Belt #02',
      price: '₦22,000',
      stock: 3,
      status: 'Low',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=50'
    },
    {
      id: 3,
      name: 'Tote #11',
      price: '₦46,000',
      stock: 0,
      status: 'Out',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=80&q=50'
    }
  ];

  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar for merchant navigation */}
      <aside className="col-left hidden md:flex sticky top-16 self-start h-[calc(100vh-64px)] flex-col px-3 py-4 border-r border-gray-700 bg-gray-900">
        <a className="font-bold text-lg mb-5">FingerMarket</a>
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-orange-500/15 text-orange-500 font-semibold">
            <Package className="h-4 w-4" /> Products
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400">
            <ShoppingBag className="h-4 w-4" /> Orders
          </div>
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400">
            <Truck className="h-4 w-4" /> Shipping
          </div>
        </div>
        <div className="mt-auto flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-800 border border-gray-700">
          <img 
            src="https://i.pravatar.cc/40?img=33" 
            className="w-8 h-8 rounded-full" 
            alt="User avatar" 
          />
          <p className="text-xs font-semibold">FingerLux</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="col-center min-h-screen border-r border-gray-700">
        <div className="max-w-[860px] mx-auto px-4 md:px-6 py-6">
          <div className="flex items-center justify-between mb-5">
            <h1 className="text-xl font-bold">Products</h1>
            <button className="px-3 py-2 rounded-lg bg-orange-500 text-gray-900 text-sm font-bold flex items-center gap-1">
              <span className="text-lg">+</span> Add product
            </button>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
                <tr>
                  <th className="px-4 py-2.5 font-medium">PRODUCT</th>
                  <th className="px-4 py-2.5 font-medium">PRICE</th>
                  <th className="px-4 py-2.5 font-medium">STOCK</th>
                  <th className="px-4 py-2.5 font-medium">STATUS</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-gray-700">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          className="w-10 h-10 rounded-lg object-cover" 
                          alt={product.name} 
                        />
                        <p className="font-semibold">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">{product.price}</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className={`px-4 py-3 ${
                      product.status === 'Active' ? 'text-orange-500' :
                      product.status === 'Low' ? 'text-orange-400' : 'text-red-500'
                    }`}>
                      {product.status}
                    </td>
                    <td className="px-4 py-3 text-gray-400">⋯</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductsPage;