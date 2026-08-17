import React, {} from 'react';
import { useAppContext } from '../../../contexts/AppContext';

const DomainsPage: React.FC = () => {
    const { domains, showToast } = useAppContext();

    const primaryDomain = (domains || []).find((d: any) => d.isPrimary);
    const customDomains = (domains || []).filter((d: any) => !d.isPrimary);
    
    const handleAddDomain = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const input = form.elements.namedItem('domainName') as HTMLInputElement;
        if (input && input.value) {
            showToast(`Connecting domain ${input.value}... (simulated)`);
            input.value = '';
        }
    };


    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Domains</h1>
            
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <h2 className="text-xl font-bold mb-4">Primary Domain</h2>
                {primaryDomain ? (
                    <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold">{primaryDomain.name}</p>
                        <span className="text-sm text-green-600 font-semibold">Connected</span>
                    </div>
                ) : (
                    <p className="text-gray-500">No primary domain set.</p>
                )}
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold mb-4">Custom Domains</h2>
                <div className="space-y-3 mb-6">
                    {(customDomains || []).map((domain: any) => (
                        <div key={domain.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                            <p className="font-semibold">{domain.name}</p>
                             <span className={`text-sm font-semibold ${domain.status === 'Connected' ? 'text-green-600' : 'text-yellow-600'}`}>{domain.status}</span>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleAddDomain} className="border-t pt-4">
                     <label htmlFor="domainName" className="block text-sm font-medium text-gray-700 mb-2">Add a new domain</label>
                    <div className="flex gap-2">
                        <input
                            id="domainName"
                            name="domainName"
                            type="text"
                            placeholder="your-domain.com"
                            className="flex-1 p-2 border border-gray-300 rounded-md"
                            required />
                        <button type="submit" className="px-4 py-2 text-sm font-semibold bg-brand-blue text-white rounded-md hover:bg-blue-700">
                            Connect
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DomainsPage;
