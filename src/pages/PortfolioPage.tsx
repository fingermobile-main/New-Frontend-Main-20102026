import { useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';

import { useAppContext } from '../contexts/AppContext';
import PhotoCreditCard from '../components/PhotoCreditCard';
import { Member, PhotoCredit } from '../types';

const PortfolioPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const { photoCreditItems, ficBalance, member } = useAppContext();
  const [profileMember, setProfileMember] = useState<Member | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PhotoCredit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use the current member if memberId matches, or mock data
    if (member && member.id === memberId) {
      setProfileMember(member);
    } else {
      // Mock member data for demonstration
      setProfileMember({
        id: memberId || 'unknown',
        name: 'Portfolio Owner',
        username: 'portfolio_owner',
        role: 'member',
        permissions: [],
        membername: 'portfolio_owner',
        avatarUrl: 'https://placehold.co/200x200',
        animatedAvatarUrl: undefined,
        isVerified: true,
        followerCount: 100,
        handle: 'portfolio_owner',
        email: 'owner@example.com',
        isSubscribed: false,
        loyaltyTier: 'bronze'
      } as Member);
    }

    // Filter photo credits - in a real app, this would be an API call
    const items = photoCreditItems.slice(0, 8) as any as PhotoCredit[];
    setPortfolioItems(items);
    setLoading(false);
  }, [memberId, member, photoCreditItems]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <MainLayout pageTitle="Portfolio">
      <div className="bg-white min-h-screen text-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="sticky top-20 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Portfolio</h3>
                <p className="text-sm text-gray-500 mb-4">View member collections and creative works.</p>
              </div>
            </div>

            {/* Center Content */}
            <div className="lg:col-span-9">
              <div className="w-full">
                {/* Profile Header */}
                {profileMember && (
                  <div className="bg-gradient-to-r from-brand-purple to-brand-blue rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20"></div>
                    <div className="relative z-10 flex items-center">
                      <img
                        src={profileMember.avatarUrl || profileMember.avatar}
                        alt={profileMember.name}
                        className="w-24 h-24 rounded-full border-4 border-white object-cover mr-6"
                      />
                      <div>
                        <h1 className="text-3xl font-bold">{profileMember.name}</h1>
                        <p className="text-white text-opacity-80">@{profileMember.membername || profileMember.handle}</p>
                        <div className="flex items-center mt-2">
                          {profileMember.isVerified && (
                            <span className="inline-flex items-center px-2 py-1 mr-2 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                            </span>
                          )}
                          <span className="text-sm">
                            {portfolioItems.length} photos • {profileMember.followerCount || 0} followers
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Portfolio Grid */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Portfolio</h2>

                  {portfolioItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {portfolioItems.map((item) => (
                        <PhotoCreditCard
                          key={item.id}
                          item={item}
                          onLike={() => {}}
                          onAddComment={() => {}}
                          onOpenGiftModal={() => {}}
                          onOpenPaylinkModal={() => {}}
                          onVote={() => {}}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">No photos in this portfolio yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </MainLayout>
  );
};

export default PortfolioPage;
