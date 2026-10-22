import React, { useState, useEffect } from 'react';
import { User as FiUser, Mail as FiMail, Phone as FiPhone, MapPin as FiMapPin, Calendar as FiCalendar, DollarSign as FiDollarSign, Filter as FiFilter, Search as FiSearch, MoreVertical as FiMoreVertical, Edit as FiEdit, Trash2 as FiTrash2, Plus as FiPlus } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

const CustomerManagement: React.FC = () => {
  const { members, loading, showToast } = useAppContext();
  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  const handleAddNewCustomer = () => {
    showToast('Add customer drawer initialized', 'info');
  };

  const handleEditCustomer = (customer: any) => {
    showToast(`Editing customer record: ${customer.name}`, 'info');
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    showToast('Customer record removed', 'success');
  };

  const handleCustomerOptions = (customer: any) => {
    showToast(`Options opened for ${customer.name}`, 'info');
  };

  useEffect(() => {
    // In a real implementation, this would fetch customer data
    // For now, we'll use mock data based on members
    const mockCustomers = [
      {
        id: 'cust-1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1-555-123-4567',
        location: 'New York, USA',
        joinDate: '2026-01-15',
        status: 'active',
        totalSpent: 1250.75,
        lastPurchase: '2026-07-10',
        purchases: 12
      },
      {
        id: 'cust-2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+1-555-987-6543',
        location: 'London, UK',
        joinDate: '2026-02-20',
        status: 'active',
        totalSpent: 890.50,
        lastPurchase: '2026-07-05',
        purchases: 8
      },
      {
        id: 'cust-3',
        name: 'Robert Johnson',
        email: 'robert@example.com',
        phone: '+1-555-456-7890',
        location: 'Sydney, Australia',
        joinDate: '2026-03-10',
        status: 'inactive',
        totalSpent: 450.25,
        lastPurchase: '2026-05-15',
        purchases: 5
      },
      {
        id: 'cust-4',
        name: 'Emily Davis',
        email: 'emily@example.com',
        phone: '+1-555-321-0987',
        location: 'Toronto, Canada',
        joinDate: '2026-04-05',
        status: 'active',
        totalSpent: 2100.00,
        lastPurchase: '2026-07-12',
        purchases: 18
      },
      {
        id: 'cust-5',
        name: 'Michael Wilson',
        email: 'michael@example.com',
        phone: '+1-555-654-3210',
        location: 'Berlin, Germany',
        joinDate: '2026-05-18',
        status: 'suspended',
        totalSpent: 0,
        lastPurchase: null,
        purchases: 0
      },
      {
        id: 'cust-6',
        name: 'Sarah Brown',
        email: 'sarah@example.com',
        phone: '+1-555-789-0123',
        location: 'Tokyo, Japan',
        joinDate: '2026-06-22',
        status: 'active',
        totalSpent: 675.30,
        lastPurchase: '2026-07-08',
        purchases: 7
      },
    ];
    setCustomers(mockCustomers);
    setFilteredCustomers(mockCustomers);
  }, []);

  useEffect(() => {
    let result = customers;

    if (searchTerm) {
      result = result.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter(customer => customer.status === filterStatus);
    }

    setFilteredCustomers(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filterStatus, customers]);

  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'active': return 'bg-green-100 text-green-950 border border-green-400 font-bold';
    case 'inactive': return 'bg-amber-100 text-amber-950 border border-amber-400 font-bold';
    case 'suspended': return 'bg-red-100 text-red-950 border border-red-400 font-bold';
    default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Customer Management</h2>
        <button
          type="button"
          onClick={handleAddNewCustomer}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
        >
          <FiPlus className="mr-2" />
          Add New Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg mr-4">
              <FiUser className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg mr-4">
              <FiUser className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Active Customers</p>
              <p className="text-2xl font-bold text-gray-800">
                {customers.filter(c => c.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 rounded-lg mr-4">
              <FiDollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">
                ${customers.reduce((sum, customer) => sum + customer.totalSpent, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-5 rounded-xl border border-yellow-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500 rounded-lg mr-4">
              <FiDollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Avg. Order Value</p>
              <p className="text-2xl font-bold text-gray-800">
                ${filteredCustomers.length > 0
                  ? (filteredCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0) / filteredCustomers.length).toFixed(2)
                  : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="relative flex-grow">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-700" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold bg-white placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center">
          <FiFilter className="mr-2 text-slate-700" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-bold bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">Join Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">Total Spent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-800 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                      <div className="text-sm text-slate-700">{customer.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{customer.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                  <div className="flex items-center">
                    <FiMapPin className="mr-1 text-slate-700" />
                    {customer.location}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800">
                  <div className="flex items-center">
                    <FiCalendar className="mr-1 text-slate-700" />
                    {customer.joinDate}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  <div className="flex items-center">
                    <FiDollarSign className="mr-1 text-slate-700" />
                    {customer.totalSpent.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      aria-label={`Edit ${customer.name}`}
                      onClick={() => handleEditCustomer(customer)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEdit />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${customer.name}`}
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 />
                    </button>
                    <button
                      type="button"
                      aria-label={`More options for ${customer.name}`}
                      onClick={() => handleCustomerOptions(customer)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <FiMoreVertical />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-700">No customers found for the selected filters</p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing <span className="font-medium">{indexOfFirstCustomer + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(indexOfLastCustomer, filteredCustomers.length)}
            </span>{' '}
            of <span className="font-medium">{filteredCustomers.length}</span> results
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md border ${
                currentPage === 1
                  ? 'bg-gray-100 text-slate-700 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md border ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-slate-700 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Segmentation</h3>
        <p className="text-gray-600 mb-4">
          Segment your customers based on their purchase history, engagement, and demographics to deliver personalized experiences.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-300">
            <h4 className="font-medium text-gray-700 mb-2">High Value</h4>
            <p className="text-sm text-gray-600">Customers who spend $1000+</p>
            <div className="mt-2 text-lg font-bold text-green-600">12</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-300">
            <h4 className="font-medium text-gray-700 mb-2">Repeat Buyers</h4>
            <p className="text-sm text-gray-600">Customers with 5+ purchases</p>
            <div className="mt-2 text-lg font-bold text-blue-600">28</div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-300">
            <h4 className="font-medium text-gray-700 mb-2">New Signups</h4>
            <p className="text-sm text-gray-600">Customers in last 30 days</p>
            <div className="mt-2 text-lg font-bold text-purple-600">42</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
