import React, {} from 'react';
import { useAppContext } from '../contexts/AppContext';
import { BUSINESS_OFFICES_DATA } from '../constants/dashboardConstants';
import type { BusinessOffice } from '../types/dashboard';
import PageHeader from '../components/PageHeader';
import { BuildingOfficeIcon } from '../icons';
import MainLayout from '../components/layout/MainLayout';

const BusinessOfficesPage: React.FC = () => {
  const { ficBalance } = useAppContext();

  const OfficeCard: React.FC<{ office: BusinessOffice }> = ({ office }) => {
    const contactLink = office.contact
      ? (office.contact.includes('@')
        ? `mailto:${office.contact}`
        : `tel:${office.contact}`)
      : '#';

    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-gray-800">{office.name}</h3>
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${office.isVirtual ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
          >
            {office.isVirtual ? 'Virtual' : 'Physical'}
          </span>
        </div>
        <div className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-600 space-y-2">
          <p>
            <strong>Address:</strong> {office.address}
          </p>
          <p>
            <strong>Contact:</strong>{' '}
            <a href={contactLink} className="text-blue-600 hover:underline">
              {office.contact}
            </a>
          </p>
        </div>
      </div>
    );
  };

  return (
    <MainLayout pageTitle="Business Offices">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <BuildingOfficeIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Business Offices
              </h1>
              <p className="text-gray-600 mt-1">
                Find our virtual and physical office locations
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {BUSINESS_OFFICES_DATA.map((office) => (
                <OfficeCard key={office.id} office={office} />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 text-blue-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-indigo-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Office Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 text-blue-600 mr-3" />
                  Contact Support
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  Schedule Visit
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-colors flex items-center">
                  Virtual Tour
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Office Info</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Global presence</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>24/7 support</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Hybrid approach</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default BusinessOfficesPage;
