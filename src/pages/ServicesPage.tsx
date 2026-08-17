import React, {} from 'react';
import MainLayout from '../components/layout/MainLayout';

const ServicesPage: React.FC = () => {
  const services = [
    {
      id: 1,
      title: 'Content Creation',
      description: 'Professional content creation services for your brand',
      price: '$200/hr',
      icon: '✍️'
    },
    {
      id: 2,
      title: 'Social Media Management',
      description: 'Full-service social media management and strategy',
      price: '$500/month',
      icon: '📱'
    },
    {
      id: 3,
      title: 'Consulting',
      description: 'Expert consulting for social media growth and engagement',
      price: '$300/hr',
      icon: '💡'
    },
    {
      id: 4,
      title: 'Analytics & Reporting',
      description: 'Detailed analytics and reporting services',
      price: '$150/report',
      icon: '📊'
    }
  ];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Services</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start">
                <div className="text-3xl mr-4">{service.icon}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">{service.price}</span>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                      Request Service
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Request Custom Service</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <input
                id="serviceType"
                type="text"
                placeholder="What type of service are you looking for?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div>
              <label htmlFor="serviceDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="serviceDescription"
                rows={4}
                placeholder="Please describe your requirements in detail"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="budgetRange" className="block text-sm font-medium text-gray-700 mb-1">
                Budget Range
              </label>
              <input
                id="budgetRange"
                type="text"
                placeholder="What is your budget range?"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <button className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ServicesPage;
