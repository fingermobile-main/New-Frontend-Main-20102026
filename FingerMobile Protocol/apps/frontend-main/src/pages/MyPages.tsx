import { useNavigate} from 'react-router-dom';
import React, { useState } from 'react';



import { useEditor } from '../contexts/EditorContext';
import { EyeIcon, PencilIcon, TrashIcon } from '../icons';
import PageHeader from '../components/PageHeader';
import { useAppContext } from '../contexts/AppContext';

const MyPages: React.FC = () => {
  const { publishedPages, handleDeletePage } = useEditor();
  const { ficBalance, showToast } = useAppContext();
  const navigate = useNavigate();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showPaylinkModal, setShowPaylinkModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [giftAmount, setGiftAmount] = useState('');
  const [paylinkAmount, setPaylinkAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendGift = async () => {
    if (!selectedPage) return;
    const amount = parseFloat(giftAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (amount > ficBalance) {
      showToast('Insufficient FIC balance', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      // In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast('Gift sent successfully');
      setGiftAmount('');
      setShowGiftModal(false);
      setSelectedPage(null);
    } catch (error) {
      showToast('Failed to send gift', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreatePaylink = async () => {
    if (!selectedPage) return;
    const amount = parseFloat(paylinkAmount);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid amount', 'error');
      return;
    }

    if (amount > ficBalance) {
      showToast('Insufficient FIC balance', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      // In a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showToast('Paylink created successfully');
      setPaylinkAmount('');
      setShowPaylinkModal(false);
      setSelectedPage(null);
    } catch (error) {
      showToast('Failed to create paylink', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmAndDelete = (pageId: string, pageName: string) => {
    if (
      window.confirm(`Are you sure you want to delete the page "${pageName}"?`)
    ) {
      handleDeletePage(pageId);
      showToast('Page deleted successfully');
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <PageHeader
        title="My Pages"
        description="Manage all the pages you've created."
        actionText="+ Create New Page"
        onAction={() => navigate('/editor')}
      />
      <div className="p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-right">
            <p className="text-lg font-semibold">
              FIC Balance: {ficBalance.toLocaleString()} FIC
            </p>
          </div>
          {publishedPages.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm border">
              <ul className="divide-y divide-gray-200">
                {publishedPages.map((page: any) => (
                  <li key={page.id} className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {page.name}
                        </p>
                        <p className="text-xs text-slate-700">
                          Last updated:{' '}
                          {new Date(page.lastEdited).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href={`/p/${page.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-700 hover:bg-gray-100 rounded-full"
                          title="View Live Page"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => navigate(`/editor/${page.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                          title="Edit Page"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => confirmAndDelete(page.id, page.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          title="Delete Page"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-slate-700 mb-4">
                You haven't published any pages yet.
              </p>
              <button
                onClick={() => navigate('/editor')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Your First Page
              </button>
            </div>
          )}
        </div>
      </div>{' '}
      {/* Gift Modal */}
      {showGiftModal && selectedPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              Send FIC Gift for "{selectedPage.name}"
            </h3>
            <p className="text-gray-600 mb-4">
              Your Balance: {ficBalance.toLocaleString()} FIC
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (FIC)
                </label>
                <input
                  type="number"
                  value={giftAmount}
                  onChange={(e) => setGiftAmount(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowGiftModal(false);
                    setSelectedPage(null);
                    setGiftAmount('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-lg"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendGift}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Send Gift'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Paylink Modal */}
      {showPaylinkModal && selectedPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              Create Paylink for "{selectedPage.name}"
            </h3>
            <p className="text-gray-600 mb-4">
              Your Balance: {ficBalance.toLocaleString()} FIC
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (FIC)
                </label>
                <input
                  type="number"
                  value={paylinkAmount}
                  onChange={(e) => setPaylinkAmount(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-mono"
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>
              <input
                type="text"
                placeholder="Enter paylink description"
                className="w-full px-4 py-2 border rounded-lg text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowPaylinkModal(false);
                    setSelectedPage(null);
                    setPaylinkAmount('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-lg"
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePaylink}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Create Paylink'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPages;
