import { Link } from 'react-router-dom';
import React from 'react';
import {
  X as Twitter, Terminal, Users, Camera,
  HelpCircle, Shield, FileText, Mail, Globe
} from 'lucide-react';

const Dancia4TvFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 sm:mt-24 py-12 border-t border-white/10 bg-gray-950/90 backdrop-blur-md rounded-t-[2.5rem] w-full relative z-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-black tracking-tighter text-white flex items-center gap-2">
              <span className="text-red-500">DANCIA-4Tv</span>
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              The ultimate premium streaming experience for FingerMobile Protocol™ members. Quality content, anywhere, anytime.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-slate-300 hover:text-blue-400 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-slate-300 hover:text-pink-400 transition-colors">
                <Camera size={18} />
              </a>
              <Link to="/communities" aria-label="Community" className="text-slate-300 hover:text-blue-400 transition-colors">
                <Users size={18} />
              </Link>
              <Link to="/terminal" aria-label="Terminal" className="text-slate-300 hover:text-white transition-colors">
                <Terminal size={18} />
              </Link>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-white mb-6">Platform</h4>
            <ul className="space-y-3 text-sm text-slate-200 font-medium">
              <li>
                <Link to="/dancia4tv" className="hover:text-blue-300 transition-colors block">
                  Movies & Series
                </Link>
              </li>
              <li>
                <Link to="/livestreaming" className="hover:text-blue-300 transition-colors block">
                  Live Streaming
                </Link>
              </li>
              <li>
                <Link to="/dancia4tv" className="hover:text-blue-300 transition-colors block">
                  Original Content
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-blue-300 transition-colors block">
                  Digital Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-white mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-slate-200 font-medium">
              <li>
                <Link to="/support" className="hover:text-blue-300 transition-colors flex items-center">
                  <HelpCircle size={14} className="mr-2 text-blue-400" /> Help Center
                </Link>
              </li>
              <li>
                <Link to="/communityguidelines" className="hover:text-blue-300 transition-colors flex items-center">
                  <Shield size={14} className="mr-2 text-emerald-400" /> Content Policy
                </Link>
              </li>
              <li>
                <Link to="/contactus" className="hover:text-blue-300 transition-colors flex items-center">
                  <Mail size={14} className="mr-2 text-amber-400" /> Contact Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-300 transition-colors flex items-center">
                  <Globe size={14} className="mr-2 text-indigo-400" /> Global Coverage
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-white mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-200 font-medium">
              <li>
                <Link to="/termsofservice" className="hover:text-blue-300 transition-colors flex items-center">
                  <FileText size={14} className="mr-2 text-blue-400" /> Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/privacypolicy" className="hover:text-blue-300 transition-colors flex items-center">
                  <Shield size={14} className="mr-2 text-emerald-400" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/governance" className="hover:text-blue-300 transition-colors flex items-center">
                  <Shield size={14} className="mr-2 text-purple-400" /> AI Governance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs font-semibold text-slate-300">
            © {currentYear} FingerMobile Protocol™ . All rights reserved. Intellectual Property of Mbah Israel Obinna.
          </p>
          <div className="flex items-center space-x-6">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Protocol v4.2.0</span>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-200 uppercase">System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Dancia4TvFooter;
