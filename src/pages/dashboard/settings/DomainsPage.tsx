import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import adminOperationsService, { PlatformDomain } from '../../../services/adminOperationsService';

const DomainsPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [domains, setDomains] = useState<PlatformDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [domainInput, setDomainInput] = useState('');

  const fetchDomains = async () => {
    try {
      setLoading(true);
      const data = await adminOperationsService.getDomains();
      setDomains(data);
    } catch (err: any) {
      console.error('Failed to load domains:', err);
      showToast('Failed to fetch platform domains', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const primaryDomain = domains.find((d) => d.is_primary);
  const customDomains = domains.filter((d) => !d.is_primary);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    try {
      setIsSubmitting(true);
      await adminOperationsService.createDomain({
        domain: domainInput.trim().toLowerCase(),
        is_primary: false,
        ssl_status: 'active',
        dns_records: [{ type: 'CNAME', name: '@', value: 'gateway.fingermobile.io' }]
      });
      showToast(`Domain ${domainInput} connected successfully!`, 'success');
      setDomainInput('');
      fetchDomains();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to connect domain', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDomain = async (id: string) => {
    try {
      await adminOperationsService.deleteDomain(id);
      showToast('Domain removed', 'success');
      setDomains(prev => prev.filter(d => d.id !== id));
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to delete domain', 'error');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Domains</h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Primary Domain</h2>
        {primaryDomain ? (
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">{primaryDomain.domain}</p>
              <p className="text-xs text-gray-500 font-mono mt-0.5">SSL: {primaryDomain.ssl_status}</p>
            </div>
            <span className="text-sm text-green-600 font-semibold bg-green-50 px-3 py-1 rounded-full border border-green-200">
              Primary Active
            </span>
          </div>
        ) : (
          <p className="text-gray-500">No primary domain configured.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Custom Domains</h2>
        <div className="space-y-3 mb-6">
          {customDomains.length === 0 ? (
            <p className="text-sm text-gray-500">No custom domains added yet.</p>
          ) : (
            customDomains.map((d) => (
              <div key={d.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">{d.domain}</p>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">SSL: {d.ssl_status}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${
                    d.ssl_status === 'active' ? 'bg-green-100 text-green-950 border border-green-400 font-bold' : 'bg-amber-100 text-amber-950 border border-amber-400 font-bold'
                  }`}>
                    {d.ssl_status}
                  </span>
                  <button
                    onClick={() => handleDeleteDomain(d.id)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleAddDomain} className="border-t pt-4">
          <label htmlFor="domainName" className="block text-sm font-medium text-gray-700 mb-2">Add a new domain</label>
          <div className="flex gap-2">
            <input
              id="domainName"
              name="domainName"
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="subdomain.fingermobile.io"
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600 text-sm"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Connecting...' : 'Connect'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DomainsPage;
