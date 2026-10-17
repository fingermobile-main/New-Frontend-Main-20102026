import React, { useState } from 'react';
interface MemberSpotlightProps {
  members?: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
    achievements: number;
    contributionScore: number;
    joinDate: string;
  }>;
  maxMembers?: number;
}

const MemberSpotlight: React.FC<MemberSpotlightProps> = ({
  members = [
    {
      id: 'm1',
      name: 'Sarah Johnson',
      role: 'Community Leader',
      avatar: null,
      achievements: 45,
      contributionScore: 9850,
      joinDate: '2025-01-15'
    },
    {
      id: 'm2',
      name: 'Mike Chen',
      role: 'Top Contributor',
      avatar: null,
      achievements: 38,
      contributionScore: 8720,
      joinDate: '2025-03-22'
    },
    {
      id: 'm3',
      name: 'Emma Davis',
      role: 'Rising Star',
      avatar: null,
      achievements: 28,
      contributionScore: 6540,
      joinDate: '2025-06-10'
    }
  ],
  maxMembers = 5
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const spotlightMember = members[currentIndex];

  const nextMember = () => {
    setCurrentIndex((prev) => (prev + 1) % members.length);
  };

  const prevMember = () => {
    setCurrentIndex((prev) => (prev - 1 + members.length) % members.length);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLevelColor = (score: number) => {
    if (score >= 9000) return 'from-yellow-400 to-orange-500 text-white';
    if (score >= 7000) return 'from-purple-400 to-pink-500 text-white';
    if (score >= 5000) return 'from-blue-400 to-cyan-500 text-white';
    return 'from-gray-400 to-gray-500 text-white';
  };

  const getLevelBadge = (score: number) => {
    if (score >= 9000) return '🏆 Diamond';
    if (score >= 7000) return '💎 Platinum';
    if (score >= 5000) return '🥇 Gold';
    if (score >= 3000) return '🥈 Silver';
    return '🥉 Bronze';
  };

  return (
    <div className="bg-white border border-slate-300 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
        <h3 className="font-bold text-white text-xl flex items-center gap-2">
          ⭐ Member Spotlight
        </h3>
        <p className="text-purple-100 text-sm mt-1">Celebrating our outstanding community members</p>
      </div>

      {/* Spotlight Card */}
      <div className="p-6">
        {spotlightMember && (
          <div className="space-y-6">
            {/* Member Profile */}
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${getLevelColor(spotlightMember.contributionScore)} flex items-center justify-center text-4xl font-bold shadow-lg`}>
                {spotlightMember.avatar ? (
                  <img src={spotlightMember.avatar} alt={spotlightMember.name} className="w-full h-full rounded-full object-cover"  />
                ) : (
                  spotlightMember.name.charAt(0)
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-gray-900 mb-1">{spotlightMember.name}</h4>
                <p className="text-purple-600 font-medium mb-2">{spotlightMember.role}</p>

                {/* Level Badge */}
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${getLevelColor(spotlightMember.contributionScore)}`}>
                  {getLevelBadge(spotlightMember.contributionScore)}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-purple-600">{spotlightMember.achievements}</p>
                <p className="text-sm text-gray-600 mt-1">Achievements</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-600">{spotlightMember.contributionScore.toLocaleString()}</p>
                <p className="text-sm text-gray-600 mt-1">Contribution Score</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Member Since</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(spotlightMember.joinDate)}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress to Next Level</span>
                <span className="font-medium text-purple-600">
                  {Math.floor((spotlightMember.contributionScore % 2000) / 20)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 border text-gray-950 border-gray-400 font-black">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                  style={{ width: `${(spotlightMember.contributionScore % 2000) / 20}%` }}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-300">
              <button
                onClick={prevMember}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                ← Previous
              </button>

              <span className="text-sm text-gray-600">
                {currentIndex + 1} of {members.length}
              </span>

              <button
                onClick={nextMember}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-300 px-6 py-3 bg-gray-50">
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
          View All Members →
        </button>
      </div>
    </div>
  );
};

export default MemberSpotlight;
