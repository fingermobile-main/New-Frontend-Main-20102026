import React from 'react';
import { useAppContext } from "../contexts/AppContext";
import MainLayout from '../components/layout/MainLayout';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  GlobeAltIcon, 
  MapPinIcon, 
  UserCircleIcon,
  ArrowRightIcon
} from '../icons';

const ContactUsPage: React.FC = () => {
  const { showToast, ficBalance } = useAppContext();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the form data to your backend
    console.info("Form submitted:", formData);
    showToast("Thank you for your message. We will get back to you soon.", "success");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <MainLayout pageTitle="Contact Us">
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl">
                <EnvelopeIcon className="h-8 w-8 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-900">Contact FingerMobile™©®</h1>
                <p className="text-gray-600">We'd love to hear from you. Get in touch with our team.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
                <div className="px-6 py-8 sm:p-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Get In Touch
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                        <PhoneIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900">
                          Phone
                        </h3>
                        <p className="mt-1 text-sm sm:text-base text-gray-600">
                          +234-808-888-55752
                        </p>
                        <p className="text-sm sm:text-base text-gray-600">
                          +234-818-222-7289
                        </p>
                        <p className="text-sm sm:text-base text-gray-600">
                          +1-281-630-3000
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                        <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900">
                          Email
                        </h3>
                        <p className="mt-1 text-sm sm:text-base text-gray-600">
                          fingerprotocolmobile@gmail.com
                        </p>
                        <p className="text-sm sm:text-base text-gray-600">
                          info@fingermobileprotocol.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                        <GlobeAltIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900">
                          Website
                        </h3>
                        <p className="mt-1 text-sm sm:text-base text-gray-600">
                          <a
                            href="https://fingermobileprotocol.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            https://fingermobileprotocol.com
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                        <MapPinIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-base sm:text-lg font-medium text-gray-900">
                          Office Addresses
                        </h3>
                        <p className="mt-1 text-sm sm:text-base text-gray-600">
                          <strong>Nigeria Office:</strong>
                          <br />
                          FingerMobile Protocol Communication
                          <br />
                          #Gilbert Nwanna Crescent., Kubwa., F.C.T., Abuja,
                          Nigeria.
                        </p>
                        <p className="mt-2 text-sm sm:text-base text-gray-600">
                          <strong>USA Office:</strong>
                          <br />
                          FingerMobile Protocol Communication
                          <br />
                          #7307, Branford Park Ln, Richmond, Texas 77407, USA.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-gray-200">
                    <h3 className="text-base sm:text-lg font-medium text-gray-900">
                      Leadership Team
                    </h3>
                    <ul className="mt-4 space-y-3">
                      <li className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                        <div className="ml-4">
                          <p className="text-sm sm:text-base font-medium text-gray-900">
                            Mbah Redice Obinna
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Chief Executive Officer and Chief Technical Officer,
                            Head of Internal Affairs
                          </p>
                        </div>
                      </li>
                      <li className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                        <div className="ml-4">
                          <p className="text-sm sm:text-base font-medium text-gray-900">
                            Mrs Eunice Emonena Mbah
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Group Company Secretary
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
                <div className="px-6 py-8 sm:p-10">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Send us a message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm sm:text-base font-medium text-gray-700"
                      >
                        Full Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md text-sm sm:text-base" />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm sm:text-base font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md text-sm sm:text-base" />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm sm:text-base font-medium text-gray-700"
                      >
                        Subject
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="subject"
                          id="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md text-sm sm:text-base" />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm sm:text-base font-medium text-gray-700"
                      >
                        Message
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md text-sm sm:text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base sm:text-lg lg:text-xl font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                <h3 className="text-base sm:text-lg font-medium text-blue-900">
                  Our Commitment
                </h3>
                <p className="mt-2 text-sm sm:text-base text-blue-700">
                  We are committed to responding to all inquiries within 24-48
                  hours. FingerMobile™©® values your privacy and will never share
                  your information with third parties without your consent.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-white shadow-xl rounded-lg p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Join Our Community
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Connect with us on social media and stay updated with the latest
              news and developments.
            </p>
            <div className="flex justify-center space-x-6">
              {/* Social media icons would go here */}
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                <UserCircleIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Your current FIC balance</p>
                <p className="font-bold text-lg text-gray-900">{ficBalance.toFixed(2)} FIC</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="mailto:fingerprotocolmobile@gmail.com"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center justify-center"
              >
                Email Support
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </a>
              
              <a 
                href="https://fingermobileprotocol.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                Visit Website
              </a>
            </div>
          </div>

          <div className="mt-8 text-center text-xs sm:text-sm text-gray-500">
            <p>
              Copyright© FingerMobile Protocol 2007 - 2025®™©. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactUsPage;