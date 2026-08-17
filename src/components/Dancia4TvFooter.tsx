import { Link } from 'react-router-dom';
import React from 'react';
import {
  X as Twitter, Terminal, Users, Camera,
  HelpCircle, Shield, FileText, Mail, Globe
} from 'lucide-react';

const Dancia4TvFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 py-12 border-t border-white/5 bg-black/40 backdrop-blur-sm rounded-t-[3rem]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-tighter text-white">DANCIA-4Tv</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              The ultimate premium streaming experience for FingerMobile Protocol™ members. Quality content, anywhere, anytime.
            </p>
            <div className="flex space-x-4 pt-2">
              <Twitter size={18} className="text-gray-400 hover:text-blue-400 cursor-pointer transition-colors" />
              <Camera size={18} className="text-gray-400 hover:text-pink-400 cursor-pointer transition-colors" />
              <Users size={18} className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" />
              <Terminal size={18} className="text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Movies & Series</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Live Streaming</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Original Content</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Digital Marketplace</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="hover:text-blue-400 cursor-pointer transition-colors flex items-center">
                <HelpCircle size={14} className="mr-2" /> Help Center
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors flex items-center">
                <Shield size={14} className="mr-2" /> Content Policy
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors flex items-center">
                <Mail size={14} className="mr-2" /> Contact Us
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors flex items-center">
                <Globe size={14} className="mr-2" /> Global Coverage
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="hover:text-blue-400 cursor-pointer transition-colors flex items-center">
                <FileText size={14} className="mr-2" /> Terms of Use
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors flex items-center">
                <Shield size={14} className="mr-2" /> Privacy Policy
              </li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors flex items-center">
                <Shield size={14} className="mr-2" /> AI Governance
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs font-medium text-gray-600">
            © {currentYear} FingerMobile Protocol™ . All rights reserved. Intellectual Property of Mbah Israel Obinna.
          </p>
          <div className="flex items-center space-x-6">
            <span className="text-xs font-bold text-blue-500/80 uppercase tracking-widest">Protocol v4.2.0</span>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-gray-500 uppercase">System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Dancia4TvFooter;