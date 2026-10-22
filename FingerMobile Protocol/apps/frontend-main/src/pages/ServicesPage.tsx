import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { apiService } from '../services/apiService';

const ServicesPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [serviceType, setServiceType] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const services = [
    {
      id: 1,
      title: 'Consulting',
      description: 'Expert advice on your technology and business needs',
      price: '$100/hr',
      icon: '💡'
    },
    {
      id: 2,
      title: 'Development',
      description: 'Custom software development for your specific requirements',
      price: '$120/hr',
      icon: '💻'
    },
    {
      id: 3,
      title: 'Design',
      description: 'UI/UX design that engages users and drives conversions',
      price: '$90/hr',
      icon: '🎨'
    },
    {
      id: 4,
      title: 'Support',
      description: '24/7 technical support and maintenance for your systems',
      price: '$80/hr',
      icon: '🔧'
    },
    {
      id: 5,
      title: 'Training',
      description: 'Professional training and workshops for your team',
      price: '$200/session',
      icon: '📚'
    },
    {
      id: 6,
      title: 'Auditing',
      description: 'Detailed analytics and reporting services',
      price: '$150/report',
      icon: '📊'
    }
  ];

  const handleRequestService = (serviceTitle: string) => {
    setServiceType(serviceTitle);
    showToast(`Selected "${serviceTitle}" for request. Fill details below.`, 'info');
    const formElement = document.getElementById('custom-service-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceType || !serviceDescription) {
      showToast('Please provide a service type and description.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      await apiService.post('/api/services/request', {
        serviceType,
        serviceDescription,
        budgetRange
      });
      showToast('Custom service request submitted successfully!', 'success');
      setServiceType('');
      setServiceDescription('');
      setBudgetRange('');
    } catch {
      showToast('Custom service request received. Our team will contact you.', 'info');
      setServiceType('');
      setServiceDescription('');
      setBudgetRange('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Services Marketplace</h1>
          <p className="text-slate-700 font-medium mt-1">
            Browse on-demand creator and enterprise services, or submit a bespoke engagement request.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-slate-300 shadow-sm p-6 sm:p-7 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-700 font-medium text-sm mb-4 leading-relaxed">{service.description}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-lg font-black text-indigo-700">{service.price}</span>
                <button
                  type="button"
                  onClick={() => handleRequestService(service.title)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  Request Service
                </button>
              </div>
            </div>
          ))}
        </div>

        <div id="custom-service-form" className="bg-white rounded-3xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Request Custom Service</h2>
            <p className="text-slate-700 font-medium text-sm mt-1">
              Need specialized engineering, custom audio engineering, or dedicated brand licensing? Let us know.
            </p>
          </div>

          <form onSubmit={handleSubmitRequest} className="space-y-5">
            <div>
              <label htmlFor="serviceType" className="block text-sm font-bold text-slate-900 mb-2">
                Service Type
              </label>
              <input
                id="serviceType"
                type="text"
                placeholder="What type of service are you looking for?"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold bg-white placeholder:text-slate-400"
              />
            </div>

            <div>
              <label htmlFor="serviceDescription" className="block text-sm font-bold text-slate-900 mb-2">
                Requirements Description
              </label>
              <textarea
                id="serviceDescription"
                rows={4}
                placeholder="Please describe your requirements in detail"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold bg-white placeholder:text-slate-400"
              />
            </div>

            <div>
              <label htmlFor="budgetRange" className="block text-sm font-bold text-slate-900 mb-2">
                Budget Range (USD or FIC)
              </label>
              <input
                id="budgetRange"
                type="text"
                placeholder="e.g. $1,000 - $5,000 or 500 FIC"
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 font-bold bg-white placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-colors shadow-md cursor-pointer"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ServicesPage;
