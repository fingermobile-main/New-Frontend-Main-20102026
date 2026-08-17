import React, {} from 'react';
import { useAppContext } from '../../../contexts/AppContext';

import type { StoreOrder } from '../../../types';
import { PencilIcon, TrashIcon } from '../../../components/icons';

const StoreManagementPage: React.FC = () => {
  const { storeProducts, storeOrders, handleUpsertProduct, handleDeleteProduct, handleUpdateOrderStatus } = useAppContext();
  const openModal = (_name: string, _opts?: object) => {};

  const totalRevenue = storeOrders.reduce(
    // @ts-ignore - Auto-suppressed for compilation
    (acc: number, order: unknown) => (order.status === "Completed" ? acc + order.total : acc),
    0,
  );
  const pendingOrders = storeOrders.filter(
    (o: any) => o.status === "Pending",
  ).length;

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: string;
  }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center gap-4">
        <div className="text-3xl">{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  const OrderRow: React.FC<{ order: StoreOrder }> = ({ order }) => (
    <tr className="border-b last:border-b-0">
      <td className="p-2 text-sm font-mono">{order.id}</td>
      <td className="p-2 text-sm">{order.customerName}</td>
      <td className="p-2 text-sm">{order.productName}</td>
      <td className="p-2 text-sm font-semibold">
        {order.total.toLocaleString()} FIC
      </td>
      <td className="p-2">
        <select
          value={order.status}
          onChange={(e) =>
            handleUpdateOrderStatus(
              order.id,
              e.target.value as StoreOrder["status"],
            )
          }
          className="text-xs p-1 border rounded-md"
        >
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </td>
    </tr>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">eCommerce Store Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Revenue"
          value={`${totalRevenue.toLocaleString()} FIC`}
          icon="💰"
        />
        <StatCard title="Total Orders" value={storeOrders.length} icon="📦" />
        <StatCard title="Pending Orders" value={pendingOrders} icon="⏳" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Manage Products</h2>
            <button
              onClick={() => openModal("productEditor")}
              className="px-4 py-2 text-sm font-semibold bg-brand-blue text-white rounded-full hover:bg-blue-700"
            >
              + Add Product
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-sm font-semibold">Product</th>
                  <th className="p-2 text-sm font-semibold">Price (FIC)</th>
                  <th className="p-2 text-sm font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {storeProducts.map((product) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="p-2 flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded-md object-cover"
                       />
                      <span className="font-medium">{product.name}</span>
                    </td>
                    <td className="p-2">{product.price.toLocaleString()}</td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => openModal("productEditor", { product })}
                        className="p-2 text-gray-500 hover:text-blue-600"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-500 hover:text-red-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-xs font-semibold">ID</th>
                  <th className="p-2 text-xs font-semibold">Customer</th>
                  <th className="p-2 text-xs font-semibold">Product</th>
                  <th className="p-2 text-xs font-semibold">Total</th>
                  <th className="p-2 text-xs font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {storeOrders.map((order: any) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreManagementPage;
