import { Link } from 'react-router-dom';
import React, {} from 'react';


const RightSidebar: React.FC = () => {
  return (
    <div className="hidden md:block w-64 flex-shrink-0 bg-white p-4 h-fit">
      {/* Trending Topics */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-fm-gray-900 mb-3">Trending Topics</h2>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-fm-orange hover:underline">#FingerMobile</a>
          </li>
          <li>
            <a href="#" className="text-fm-orange hover:underline">#TechInnovation</a>
          </li>
          <li>
            <a href="#" className="text-fm-orange hover:underline">#Blockchain</a>
          </li>
          <li>
            <a href="#" className="text-fm-orange hover:underline">#SocialMedia</a>
          </li>
          <li>
            <a href="#" className="text-fm-orange hover:underline">#DigitalFuture</a>
          </li>
        </ul>
      </div>

      {/* Who to Follow */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-fm-gray-900 mb-3">Who to Follow</h2>
        <div className="flex items-center justify-between pb-3 border-b border-fm-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-fm-gray-200 flex items-center justify-center text-sm">
              MI
            </div>
            <div>
              <p className="text-sm font-medium text-fm-gray-900">Mbah Israel</p>
              <p className="text-xs text-fm-gray-500">Tech Entrepreneur</p>
            </div>
          </div>
          <button className="text-xs bg-fm-orange text-white px-2 py-1 rounded hover:bg-opacity-90 transition-colors">
            Follow
          </button>
        </div>
        <div className="flex items-center justify-between pb-3 border-b border-fm-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-fm-gray-200 flex items-center justify-center text-sm">
              SM
            </div>
            <div>
              <p className="text-sm font-medium text-fm-gray-900">Sarah Mitchell</p>
              <p className="text-xs text-fm-gray-500">Content Creator</p>
            </div>
          </div>
          <button className="text-xs bg-fm-orange text-white px-2 py-1 rounded hover:bg-opacity-90 transition-colors">
            Follow
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-fm-gray-200 flex items-center justify-center text-sm">
              TJ
            </div>
            <div>
              <p className="text-sm font-medium text-fm-gray-900">Thomas Jackson</p>
              <p className="text-xs text-fm-gray-500">Blockchain Expert</p>
            </div>
          </div>
          <button className="text-xs bg-fm-gray-100 text-fm-gray-700 px-2 py-1 rounded hover:bg-fm-orange hover:text-white transition-colors">
            Follow
          </button>
        </div>
        <Link to="/network/suggestions" className="block mt-3 text-sm text-fm-orange hover:underline">
          See more suggestions
        </Link>
      </div>

      {/* Footer Links */}
      <div className="text-xs text-fm-gray-400 px-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2">
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/help" className="hover:underline">Help</Link>
          <Link to="/privacy" className="hover:underline">Privacy</Link>
          <Link to="/terms" className="hover:underline">Terms</Link>
          <Link to="/language" className="hover:underline">Language</Link>
        </div>
        <p>© 2026 FingerMobile Protocol™</p>
      </div>
    </div>
  );
};

export default RightSidebar;