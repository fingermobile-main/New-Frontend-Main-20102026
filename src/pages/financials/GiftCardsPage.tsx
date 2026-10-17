import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { apiService } from '../../services/apiService';
import type { GiftCard } from '../../types';

const GiftCardsPage: React.FC = () => {
  const { giftCards, openModal, showToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'your-cards' | 'buy' | 'redeem'>('your-cards');
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  const loadGiftCards = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiService.get<any>('/api/giftcards');
      if (res?.data && Array.isArray(res.data)) {
        setCards(res.data.map((c: any) => ({
          id: c.id,
          code: c.code || 'GC-SAMPLE',
          value: Number(c.amount || c.value || 0),
          status: (c.status || 'active').toLowerCase(),
          expiryDate: c.expires_at || c.expiryDate || new Date(Date.now() + 365*86400000).toISOString()
        })));
      } else if (giftCards && giftCards.length > 0) {
        setCards(giftCards);
      }
    } catch (err) {
      console.error('Failed to load gift cards:', err);
      if (giftCards) setCards(giftCards);
    } finally {
      setIsLoading(false);
    }
  }, [giftCards]);

  useEffect(() => {
    loadGiftCards();
  }, [loadGiftCards]);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemCode.trim()) {
      showToast?.('Please enter your gift card code', 'error');
      return;
    }

    setIsRedeeming(true);
    try {
      const res = await apiService.post<any>('/api/giftcards/redeem', {
        code: redeemCode.trim(),
        securityCode: securityCode.trim()
      });

      if (res?.success) {
        showToast?.('Gift card redeemed successfully! Added to your balance.', 'success');
        setRedeemCode('');
        setSecurityCode('');
        await loadGiftCards();
        setActiveTab('your-cards');
      } else {
        showToast?.(res?.message || 'Failed to redeem gift card', 'error');
      }
    } catch (err: any) {
      showToast?.(err?.response?.data?.message || err?.message || 'Error redeeming gift card', 'error');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleBuyCard = async (amount: number) => {
    try {
      const res = await apiService.post<any>('/api/giftcards', {
        amount,
        recipientEmail: 'self@fingermobileprotocol.com',
        message: `${amount} FIC Gift Card`
      });
      if (res?.success) {
        showToast?.(`Successfully purchased ${amount} FIC Gift Card!`, 'success');
        await loadGiftCards();
        setActiveTab('your-cards');
      } else {
        openModal('gift', { amount });
      }
    } catch {
      openModal('gift', { amount });
    }
  };

  const yourGiftCards = cards.length > 0
    ? cards.filter((card) => card.status === 'active' || card.status === 'used' || card.status === 'expired')
    : (giftCards || []).filter((card: GiftCard) => card.status === 'active' || card.status === 'used' || card.status === 'expired');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Gift Cards</h2>
        <p className="mt-1 text-sm font-medium text-slate-700">Buy, send, or redeem gift cards securely</p>
      </div>

      <div className="border-b border-slate-300">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('your-cards')}
            className={`py-4 px-1 border-b-2 font-bold text-sm transition-colors ${
              activeTab === 'your-cards'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Your Gift Cards
          </button>
          <button
            onClick={() => setActiveTab('buy')}
            className={`py-4 px-1 border-b-2 font-bold text-sm transition-colors ${
              activeTab === 'buy'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Buy Gift Cards
          </button>
          <button
            onClick={() => setActiveTab('redeem')}
            className={`py-4 px-1 border-b-2 font-bold text-sm transition-colors ${
              activeTab === 'redeem'
                ? 'border-brand-blue text-brand-blue'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Redeem Gift Card
          </button>
        </nav>
      </div>

      {activeTab === 'your-cards' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900">Your Gift Cards</h3>
            <button
              onClick={() => openModal('gift')}
              className="px-4 py-2 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
            >
              Send Gift Card
            </button>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-slate-700 font-medium">Loading gift cards...</div>
          ) : yourGiftCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {yourGiftCards.map((card: GiftCard) => (
                <div key={card.id} className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
                  <div className="h-32 bg-gradient-to-r from-brand-blue to-purple-600 flex items-center justify-center">
                    <span className="text-white font-black text-3xl tracking-tight">{card.value} FIC</span>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-black text-slate-900">{card.value} FIC</h4>
                        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Gift Card</p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        card.status === 'active'
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-400'
                          : card.status === 'used'
                            ? 'bg-slate-100 text-slate-900 border border-slate-300'
                            : 'bg-rose-100 text-rose-950 border border-rose-400'
                      }`}>
                        {card.status.charAt(0).toUpperCase() + card.status.slice(1)}
                      </span>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Code</p>
                      <p className="font-mono font-bold text-slate-900 select-all mt-0.5">{card.code}</p>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Expires</p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">{new Date(card.expiryDate).toLocaleDateString()}</p>
                    </div>

                    {card.status === 'active' && (
                      <button
                        onClick={() => openModal('giftCardQR', { card })}
                        className="mt-5 w-full px-4 py-2.5 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                      >
                        View QR Code
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-300 rounded-xl shadow-sm p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path>
              </svg>
              <h3 className="mt-3 text-lg font-bold text-slate-900">No gift cards found</h3>
              <p className="mt-1 text-sm font-medium text-slate-700">Get started by purchasing a gift card for yourself or a colleague.</p>
              <div className="mt-6">
                <button
                  onClick={() => setActiveTab('buy')}
                  className="px-5 py-2.5 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                >
                  Buy Gift Card
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'buy' && (
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Buy Gift Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[25, 50, 100, 250].map((amount) => (
              <div key={amount} className="bg-white border border-slate-300 rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-brand-blue to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-black text-xl">{amount}</span>
                </div>
                <h4 className="mt-4 font-black text-slate-900">{amount} FIC</h4>
                <p className="mt-1 text-xs font-semibold text-slate-700 uppercase tracking-wider">Gift Card</p>
                <button
                  onClick={() => handleBuyCard(amount)}
                  className="mt-4 w-full px-4 py-2.5 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                >
                  Buy for {amount} FIC
                </button>
              </div>
            ))}

            <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-slate-400 transition-colors">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <h4 className="mt-4 font-black text-slate-900">Custom Amount</h4>
              <p className="mt-1 text-xs font-semibold text-slate-700 uppercase tracking-wider">Choose your own value</p>
              <button
                onClick={() => openModal('gift')}
                className="mt-4 w-full px-4 py-2.5 border border-slate-300 text-slate-800 font-bold rounded-lg hover:bg-slate-50 shadow-sm transition-colors"
              >
                Select Amount
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'redeem' && (
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Redeem Gift Card</h3>
          <form onSubmit={handleRedeem} className="bg-white border border-slate-300 rounded-xl shadow-sm p-6">
            <div>
              <label htmlFor="gift-card-code" className="block text-sm font-bold text-slate-800">
                Gift Card Code
              </label>
              <div className="mt-1.5">
                <input
                  type="text"
                  id="gift-card-code"
                  value={redeemCode}
                  onChange={(e) => setRedeemCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-slate-900 font-bold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue font-mono placeholder:text-slate-400"
                  placeholder="e.g. GC-XXXXXXXX"
                  required
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="security-code" className="block text-sm font-bold text-slate-800">
                Security Code (Optional)
              </label>
              <div className="mt-1.5">
                <input
                  type="password"
                  id="security-code"
                  value={securityCode}
                  onChange={(e) => setSecurityCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 text-slate-900 font-bold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue placeholder:text-slate-400"
                  placeholder="Enter security code if applicable"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isRedeeming}
              className="mt-6 w-full px-4 py-2.5 bg-brand-blue text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-50 transition-colors"
            >
              {isRedeeming ? 'Redeeming...' : 'Redeem Gift Card'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default GiftCardsPage;
