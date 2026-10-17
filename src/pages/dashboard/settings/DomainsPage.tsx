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
      <h1 className="text-2xl font-black text-slate-900 mb-6">Domains</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300 mb-8">
        <h2 className="text-xl font-black text-slate-900 mb-4">Primary Domain</h2>
        {primaryDomain ? (
          <div className="flex justify-between items-center bg-slate-50 border border-slate-300 p-4 rounded-xl">
            <div>
              <p className="font-bold text-slate-900">{primaryDomain.domain}</p>
              <p className="text-xs text-slate-700 font-mono mt-0.5">SSL: {primaryDomain.ssl_status}</p>
            </div>
            <span className="text-sm text-emerald-950 font-black bg-emerald-100 px-3 py-1 rounded-full border border-emerald-400">
              Primary Active
            </span>
          </div>
        ) : (
          <p className="text-slate-700 font-medium">No primary domain configured.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-300">
        <h2 className="text-xl font-black text-slate-900 mb-4">Custom Domains</h2>
        <div className="space-y-3 mb-6">
          {customDomains.length === 0 ? (
            <p className="text-sm text-slate-700 font-medium">No custom domains added yet.</p>
          ) : (
            customDomains.map((d) => (
              <div key={d.id} className="flex justify-between items-center bg-slate-50 border border-slate-300 p-4 rounded-xl">
                <div>
                  <p className="font-bold text-slate-900">{d.domain}</p>
                  <p className="text-xs text-slate-700 font-mono mt-0.5">SSL: {d.ssl_status}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    d.ssl_status === 'active' ? 'bg-emerald-100 text-emerald-950 border border-emerald-400' : 'bg-amber-100 text-emerald-950 border border-emerald-400'
                  }font-black`}>
                    {d.ssl_status}
                  </span>
                  <button
                    onClick={() => handleDeleteDomain(d.id)}
                    className="text-xs text-rose-700 hover:text-rose-900 font-bold px-2.5 py-1 rounded-md hover:bg-rose-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleAddDomain} className="border-t border-slate-300 pt-4">
          <label htmlFor="domainName" className="block text-sm font-bold text-slate-800 mb-2">Add a new domain</label>
          <div className="flex gap-2">
            <input
              id="domainName"
              name="domainName"
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="subdomain.fingermobile.io"
              className="flex-1 p-2.5 border border-slate-300 rounded-lg text-slate-900 font-bold bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 text-sm"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-bold bg-brand-blue text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-sm transition-colors"
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
