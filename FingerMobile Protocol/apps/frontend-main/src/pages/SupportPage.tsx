import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';
import {
  LifebuoyIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  UserCircleIcon,
  ArrowRightIcon
} from '../icons';

interface TicketFormData {
  subject: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  ticketType: 'support' | 'bug' | 'feature' | 'complaint';
}

const SupportPage: React.FC = () => {
  const { handleSubmitTicket, showToast, ficBalance } = useAppContext();
  const [formData, setFormData] = useState<TicketFormData>({
    subject: '',
    description: '',
    priority: 'medium',
    category: 'general',
    ticketType: 'support'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real app, this would call the API
      if (handleSubmitTicket) {
        await handleSubmitTicket(formData);
      }
      showToast('Ticket submitted successfully!', 'success');
      setFormData({
        subject: '',
        description: '',
        priority: 'medium',
        category: 'general',
        ticketType: 'support'
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error submitting ticket:', error);
      showToast('Failed to submit ticket. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout pageTitle="Support Center">
      <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white border border-slate-300 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3.5 rounded-2xl shadow-md">
              <LifebuoyIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-black text-slate-900">Support Center</h1>
              <p className="text-slate-700 font-medium mt-1">Get immediate help, track tickets, or speak with FingerMobile technical agents</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-300 p-6 sm:p-8">
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-6">Submit a Support Ticket</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 font-bold border-slate-300 placeholder:text-slate-400"
                        placeholder="Briefly describe your issue" />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 font-bold border-slate-300"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="billing">Billing</option>
                        <option value="technical">Technical Issue</option>
                        <option value="account">Account</option>
                        <option value="feature-request">Feature Request</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="ticketType" className="block text-sm font-medium text-gray-700 mb-1">
                      Ticket Type
                    </label>
                    <select
                      id="ticketType"
                      name="ticketType"
                      value={formData.ticketType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 font-bold border-slate-300"
                    >
                      <option value="support">Support Request</option>
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="complaint">Complaint</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 font-bold border-slate-300"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-900 font-bold border-slate-300 placeholder:text-slate-400"
                      placeholder="Please provide detailed information about your issue..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 sm:p-8 border border-blue-200 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600 mr-2" />
                Quick Help
              </h2>
              <ul className="space-y-3">
                <li>
                  <Link to="/help" className="flex items-center text-blue-700 hover:text-blue-900 font-semibold text-sm">
                    <QuestionMarkCircleIcon className="h-4 w-4 mr-2" />
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact-support" className="flex items-center text-blue-700 hover:text-blue-900 font-semibold text-sm">
                    <QuestionMarkCircleIcon className="h-4 w-4 mr-2" />
                    Live Support Desk
                  </Link>
                </li>
                <li>
                  <Link to="/fic/wallet" className="flex items-center text-blue-700 hover:text-blue-900 font-semibold text-sm">
                    <QuestionMarkCircleIcon className="h-4 w-4 mr-2" />
                    Payment & Vault Issues
                  </Link>
                </li>
                <li>
                  <Link to="/privacy/data-subject-request" className="flex items-center text-blue-700 hover:text-blue-900 font-semibold text-sm">
                    <QuestionMarkCircleIcon className="h-4 w-4 mr-2" />
                    Privacy & Compliance
                  </Link>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 border border-slate-300">
              <h2 className="text-lg font-black text-slate-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Official Support Emails</p>
                  <p className="font-bold text-blue-700 text-sm mt-0.5">info@fingermobileprotocol.com</p>
                  <p className="font-semibold text-slate-700 text-xs mt-0.5">fingermobileprotocol@gmail.com</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">+234-808-888-55752</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Response Time</p>
                  <p className="font-bold text-emerald-700 text-sm mt-0.5">Within 24-48 hours (Priority SLA)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8 border border-slate-300">
          <h2 className="text-xl font-black text-slate-900 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-5">
              <h3 className="font-bold text-slate-900 text-base">How long does it take to respond to tickets?</h3>
              <p className="text-slate-700 font-medium text-sm mt-1.5 leading-relaxed">We typically respond to support tickets within 24-48 hours during business days.</p>
            </div>

            <div className="border-b border-slate-200 pb-5">
              <h3 className="font-bold text-slate-900 text-base">Can I update my ticket after submission?</h3>
              <p className="text-slate-700 font-medium text-sm mt-1.5 leading-relaxed">Yes, you can update your ticket by replying to the confirmation email or contacting support directly.</p>
            </div>

            <div className="border-b border-slate-200 pb-5">
              <h3 className="font-bold text-slate-900 text-base">Where can I find my ticket status?</h3>
              <p className="text-slate-700 font-medium text-sm mt-1.5 leading-relaxed">You can check your ticket status in your account dashboard under the 'My Tickets' section.</p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-base">What information should I include in my support ticket?</h3>
              <p className="text-slate-700 font-medium text-sm mt-1.5 leading-relaxed">Please provide a clear description of the issue, steps to reproduce it, and any relevant screenshots or error messages.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm p-6 border border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <div className="bg-amber-100 p-2.5 rounded-2xl mr-3 border border-amber-300 text-amber-700">
              <UserCircleIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-slate-700 text-xs font-semibold">Your current FIC balance</p>
              <p className="font-black text-xl text-slate-900">{ficBalance.toFixed(2)} FIC</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:info@fingermobileprotocol.com"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:from-blue-700 hover:to-indigo-700 transition-colors flex items-center justify-center shadow-md"
            >
              Email Support
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </a>

            <Link
              to="/faq"
              className="px-5 py-2.5 bg-white border border-slate-300 text-slate-800 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center shadow-sm"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SupportPage;
