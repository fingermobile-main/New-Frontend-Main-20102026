import React, {} from 'react';
import type { Profile } from '../types';

interface PortfolioHeaderProps {
  member: Profile;
  ficBalance: number;
  onOpenGiftModal: () => void;
  onOpenPaylinkModal: () => void;
}

const PortfolioHeader: React.FC<PortfolioHeaderProps> = ({
  member,
  ficBalance,
  onOpenGiftModal,
  onOpenPaylinkModal
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-6">
        <img
          src={member.avatarUrl}
          alt={member.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{member.name}</h1>
          <p className="text-sm text-slate-700">@{member.membername}</p>
          <p className="mt-2 text-gray-600">{member.bio}</p>
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">{ficBalance} FIC</span>
            <button
              onClick={onOpenGiftModal}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-blue rounded-lg hover:bg-blue-600"
            >
              Send Gift
            </button>
            <button
              onClick={onOpenPaylinkModal}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Create Paylink
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioHeader;
