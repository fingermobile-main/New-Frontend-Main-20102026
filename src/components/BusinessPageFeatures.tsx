import React, { useState } from 'react';
interface MediaCard {
  id: number;
  type: 'image' | 'gif' | 'video';
  url: string;
  caption: string;
}

interface ProductService {
  id: number;
  name: string;
  description?: string;
  price: string;
}

const BusinessPageFeatures: React.FC = () => {
  const [pageName, setPageName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [ctaButton, setCtaButton] = useState('');
  const [visitorTracking, setVisitorTracking] = useState(false);
  const [aiWritingAssistance, setAiWritingAssistance] = useState(false);
  const [autoInviteFollowers, setAutoInviteFollowers] = useState(false);
  const [mediaCards, setMediaCards] = useState<MediaCard[]>([]);
  const [productServices, setProductServices] = useState<ProductService[]>([]);
  const [currentCard, setCurrentCard] = useState<Omit<MediaCard, 'id'>>({ 
    type: 'image', 
    url: '', 
    caption: '' 
  });
  const [currentProduct, setCurrentProduct] = useState<Omit<ProductService, 'id'>>({ 
    name: '', 
    description: '', 
    price: '' 
  });

  const handleAddMediaCard = () => {
    if (currentCard.url.trim() !== '') {
      const newCard: MediaCard = {
        id: Date.now(),
        ...currentCard
      };
      setMediaCards([...mediaCards, newCard]);
      setCurrentCard({ type: 'image', url: '', caption: '' });
    }
  };

  const handleRemoveMediaCard = (id: number) => {
    setMediaCards(mediaCards.filter(card => card.id !== id));
  };

  const handleAddProductService = () => {
    if (currentProduct.name.trim() !== '') {
      const newProduct: ProductService = {
        id: Date.now(),
        ...currentProduct
      };
      setProductServices([...productServices, newProduct]);
      setCurrentProduct({ name: '', description: '', price: '' });
    }
  };

  const handleRemoveProductService = (id: number) => {
    setProductServices(productServices.filter(ps => ps.id !== id));
  };

  const handleToggleVisitorTracking = () => setVisitorTracking(!visitorTracking);
  const handleToggleAiWritingAssistance = () => setAiWritingAssistance(!aiWritingAssistance);
  const handleToggleAutoInviteFollowers = () => setAutoInviteFollowers(!autoInviteFollowers);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Business Page Features</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Page Information</h3>
            
            <div className="mb-4">
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">Business/Channel Name</label>
              <input
                id="businessName"
                type="text"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                placeholder="Enter your business name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
              <textarea
                id="businessDescription"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="Describe your business..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="ctaButton" className="block text-sm font-medium text-gray-700 mb-1">Call-to-Action Button Text</label>
              <input
                id="ctaButton"
                type="text"
                value={ctaButton}
                onChange={(e) => setCtaButton(e.target.value)}
                placeholder="e.g., Contact Us, Shop Now, Book Appointment"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Premium Page Features</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="visitorTracking"
                  checked={visitorTracking}
                  onChange={handleToggleVisitorTracking}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                />
                <div className="ml-3">
                  <label htmlFor="visitorTracking" className="block text-sm font-medium text-gray-700">
                    Visitor Tracking
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    See who visited your page with privacy-compliant tracking
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="aiWritingAssistance"
                  checked={aiWritingAssistance}
                  onChange={handleToggleAiWritingAssistance}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                />
                <div className="ml-3">
                  <label htmlFor="aiWritingAssistance" className="block text-sm font-medium text-gray-700">
                    AI Writing Assistance
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Get AI-powered help for headlines, descriptions, and content optimization
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="autoInviteFollowers"
                  checked={autoInviteFollowers}
                  onChange={handleToggleAutoInviteFollowers}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
                />
                <div className="ml-3">
                  <label htmlFor="autoInviteFollowers" className="block text-sm font-medium text-gray-700">
                    Auto-Invite Engaged Followers
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically invite highly engaged followers to join your page
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Premium Pages:</strong> Upgrade to premium for $10/year to unlock these features
              </p>
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Interactive Media Carousel</h3>
            <p className="text-sm text-gray-600 mb-3">Create swipeable cards (2-10 cards) to showcase your products/services</p>
            
            <div className="mb-4">
              <label htmlFor="cardType" className="block text-sm font-medium text-gray-700 mb-1">Card Type</label>
              <select
                id="cardType"
                value={currentCard.type}
                onChange={(e) => setCurrentCard({...currentCard, type: e.target.value as 'image' | 'gif' | 'video'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="image">Image</option>
                <option value="gif">GIF</option>
                <option value="video">Video</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label htmlFor="mediaUrl" className="block text-sm font-medium text-gray-700 mb-1">Media URL</label>
              <input
                id="mediaUrl"
                type="text"
                value={currentCard.url}
                onChange={(e) => setCurrentCard({...currentCard, url: e.target.value})}
                placeholder="https://example.com/media.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="mediaCaption" className="block text-sm font-medium text-gray-700 mb-1">Caption (Optional)</label>
              <input
                id="mediaCaption"
                type="text"
                value={currentCard.caption}
                onChange={(e) => setCurrentCard({...currentCard, caption: e.target.value})}
                placeholder="Describe this media..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <button
              onClick={handleAddMediaCard}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add Media Card
            </button>
            
            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-700 mb-2">Added Cards ({mediaCards.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {mediaCards.map(card => (
                  <div key={card.id} className="flex items-center justify-between bg-white p-2 rounded border">
                    <div>
                      <span className="font-medium">{card.type.toUpperCase()}:</span>
                      <p className="text-xs text-gray-500 truncate max-w-[70%]">{card.caption || 'No caption'}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveMediaCard(card.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Products & Services</h3>
            
            <div className="mb-4">
              <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product/Service Name</label>
              <input
                id="productName"
                type="text"
                value={currentProduct.name}
                onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                placeholder="e.g., Premium Consultation"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="productDescription"
                value={currentProduct.description}
                onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                placeholder="Describe the product/service..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                id="productPrice"
                type="text"
                value={currentProduct.price}
                onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
                placeholder="e.g., $99, Free, Contact for quote"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            <button
              onClick={handleAddProductService}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add Product/Service
            </button>
            
            <div className="mt-4">
              <h4 className="text-md font-medium text-gray-700 mb-2">Added Items ({productServices.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {productServices.map(item => (
                  <div key={item.id} className="bg-white p-2 rounded border">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.name}</span>
                      <button
                        onClick={() => handleRemoveProductService(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">{item.description}</p>
                    <p className="text-xs font-semibold text-indigo-600">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
          Preview
        </button>
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Save Business Page
        </button>
      </div>
    </div>
  );
};

export default BusinessPageFeatures;