import React from 'react';
import { useAppContext } from "../contexts/AppContext";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
}

interface EarningSummary {
  totalEarnings: number;
  pendingEarnings: number;
  totalSales: number;
  activeServices: number;
}

const MemberEarningPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [earningSummary, setEarningSummary] = React.useState<EarningSummary>({ totalEarnings: 0, pendingEarnings: 0, totalSales: 0, activeServices: 0 });
  const [services, setServices] = React.useState<Service[]>([]);
  const [activeTab, setActiveTab] = React.useState<'dashboard' | 'services' | 'analytics' | 'wallet'>('dashboard');

  React.useEffect(() => {
    // Simulate API call to fetch earning data
    const mockSummary: EarningSummary = {
      totalEarnings: 1250.75,
      pendingEarnings: 350.25,
      totalSales: 42,
      activeServices: 3
    };

    setEarningSummary(mockSummary);

    const mockServices: Service[] = [
      { id: '1', title: 'Logo Design', description: 'Professional logo design for your business', price: 50, category: 'Design', rating: 4.8, reviews: 24 },
      { id: '2', title: 'Website Development', description: 'Custom website development with responsive design', price: 200, category: 'Development', rating: 4.9, reviews: 18 },
      { id: '3', title: 'Content Writing', description: 'High-quality content for your blog and website', price: 35, category: 'Writing', rating: 4.7, reviews: 31 }
    ];
    setServices(mockServices);
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className='earning-dashboard'>
            <div className='summary-cards'>
              <div className='card'>
                <h3>Total Earnings</h3>
                <p>${earningSummary.totalEarnings.toFixed(2)}</p>
              </div>
              <div className='card'>
                <h3>Pending Earnings</h3>
                <p>${earningSummary.pendingEarnings.toFixed(2)}</p>
              </div>
              <div className='card'>
                <h3>Total Sales</h3>
                <p>{earningSummary.totalSales}</p>
              </div>
              <div className='card'>
                <h3>Active Services</h3>
                <p>{earningSummary.activeServices}</p>
              </div>
            </div>
          </div>
        );
      case 'services':
        return (
          <div className='services-section'>
            <div className='section-header'>
              <h2>My Services</h2>
              <button 
                className='btn-primary'
                onClick={() => showToast("Service creation coming soon!", "info")}
              >
                Create New Service
              </button>
            </div>
            <div className='services-grid'>
              {services.map(service => (
                <div key={service.id} className='service-card'>
                  <h3>{service.title}</h3>
                  <p className='description'>{service.description}</p>
                  <div className='service-meta'>
                    <span className='price'>${service.price}</span>
                    <span className='category'>{service.category}</span>
                    <div className='rating'>
                      <span>{service.rating} ?</span>
                      <span>({service.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className='service-actions'>
                    <button className='btn-secondary'>Edit</button>
                    <button className='btn-outline'>View Orders</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Coming soon...</div>;
    }
  };

  return (
    <div className='member-earning-page'>
      <h1>My Earnings</h1>
      <div className='earning-tabs'>
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'services' ? 'active' : ''}
          onClick={() => setActiveTab('services')}
        >
          My Services
        </button>
        <button
          className={activeTab === 'analytics' ? 'active' : ''}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={activeTab === 'wallet' ? 'active' : ''}
          onClick={() => setActiveTab('wallet')}
        >
          Wallet
        </button>
      </div>
      <div className='earning-content'>
        {renderTabContent()}
      </div>
    </div>
  );
};
export default MemberEarningPage; 
