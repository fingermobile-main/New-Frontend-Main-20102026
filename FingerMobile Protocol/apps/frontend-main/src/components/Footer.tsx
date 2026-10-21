import { Link} from 'react-router-dom';
import React, {} from 'react';


const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">FingerMobile</h4>
            <ul className="space-y-2 text-gray-300 font-medium">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/brand" className="hover:text-white transition-colors">Brand</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-gray-300 font-medium">
              <li><Link to="/diversity" className="hover:text-white transition-colors">Diversity & Inclusion</Link></li>
              <li><Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link></li>
              <li><Link to="/community" className="hover:text-white transition-colors">Community Standards</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Events</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-gray-300 font-medium">
              <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/security" className="hover:text-white transition-colors">Security</Link></li>
              <li><Link to="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300 font-medium">
              <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/developer" className="hover:text-white transition-colors">Developer API</Link></li>
              <li><Link to="/status" className="hover:text-white transition-colors">Platform Status</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-300 font-medium text-sm">
            © 2026 FingerMobile Protocol. All rights reserved.
          </div>

          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-300 font-medium hover:text-white text-sm transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-300 font-medium hover:text-white text-sm transition-colors">Terms of Service</Link>
            <Link to="/adchoices" className="text-gray-300 font-medium hover:text-white text-sm transition-colors">Ad Choices</Link>
            <Link to="/cookies" className="text-gray-300 font-medium hover:text-white text-sm transition-colors">Cookie Policy</Link>
            <Link to="/accessibility" className="text-gray-300 font-medium hover:text-white text-sm transition-colors">Accessibility</Link>
          </div>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/language" className="text-gray-300 font-medium hover:text-white text-sm flex items-center transition-colors">
              🌐 English
            </Link>
            <Link to="/country" className="text-gray-300 font-medium hover:text-white text-sm flex items-center transition-colors">
              📍 United States
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
