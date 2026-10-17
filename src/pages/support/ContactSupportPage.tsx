import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useAppContext } from '../../contexts/AppContext';
import legalComplianceService from '../../services/legalComplianceService';
import {
  LifebuoyIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowRightIcon
} from '../../icons';

const ContactSupportPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    priority: 'medium',
    ticketType: 'support',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await legalComplianceService.createTicket({
        subject: formData.subject,
        description: `Sender: ${formData.name} <${formData.email}>\nCategory: ${formData.category}\n\n${formData.message}`,
        category: formData.category,
        priority: formData.priority,
        ticketType: formData.ticketType,
        email: formData.email
      });

      if (res.success) {
        const ticketRef = res.data?.id || `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
        setCreatedTicketId(ticketRef);
        showToast('Support ticket dispatched successfully!', 'success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          category: 'general',
          priority: 'medium',
          ticketType: 'support',
          message: ''
        });
      } else {
        showToast(res.message || 'Failed to file ticket. Please try again.', 'error');
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Error submitting support ticket.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout pageTitle="Contact Support">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-in fade-in duration-500">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
              <LifebuoyIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Support Ticket Dispatch Desk
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">
                Submit an official ticket directly to our protocol engineering & customer success dispatchers.
              </p>
            </div>
          </div>
        </div>

        {createdTicketId && (
          <div className="mb-8 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 text-emerald-900 dark:text-emerald-200">
            <div className="flex items-start gap-3">
              <CheckCircleIcon className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg">Ticket Dispatched to Priority Queue</h3>
                <p className="text-sm mt-1 text-emerald-800 dark:text-emerald-300">
                  Your ticket reference is <span className="font-mono font-bold bg-white dark:bg-emerald-900 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">{createdTicketId}</span>. A confirmation notification has been queued for dispatch.
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setCreatedTicketId(null)}
                    className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Submit Another Ticket
                  </button>
                  <Link
                    to="/help"
                    className="px-3 py-1.5 bg-white dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-bold rounded-lg border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    Return to Help Center
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Alex Johnson"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@domain.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold"
                    >
                      <option value="general">General Support</option>
                      <option value="billing">FIC Wallet & Billing</option>
                      <option value="technical">Technical Bug / Malfunction</option>
                      <option value="account">Account Access & Enclave</option>
                      <option value="safety">Sentinel & Safety Strike</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold"
                    >
                      <option value="low">Low (General guidance)</option>
                      <option value="medium">Medium (Standard issue)</option>
                      <option value="high">High (Blocked functionality)</option>
                      <option value="urgent">Urgent (Account security risk)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Subject Summary *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Brief description of the issue"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Detailed Explanation *
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Provide full details, steps to reproduce, or transaction reference numbers..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-bold placeholder:text-slate-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 text-sm transition-all disabled:opacity-60 cursor-pointer flex justify-center items-center"
                >
                  {submitting ? 'Transmitting to Live Dispatcher...' : 'Submit Support Ticket'}
                </button>
              </form>
            </div>
          </div>

          {/* SLA & Information Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-blue-600" />
                <span>Service Level Agreements</span>
              </h3>
              <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="font-medium">Avg Response Time:</span>
                  <span className="font-bold text-emerald-600">~2.4 Hours</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="font-medium">Urgent Security Tickets:</span>
                  <span className="font-bold text-blue-600">&lt; 30 Minutes</span>
                </li>
                <li className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="font-medium">Sentinel Moderation:</span>
                  <span className="font-bold text-purple-600">24/7 AI & Human Ops</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-medium">Resolution Guarantee:</span>
                  <span className="font-bold text-slate-900 dark:text-white">100% Tracked</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl p-6 text-xs text-blue-900 dark:text-blue-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                <span>Cryptographic Protection</span>
              </div>
              <p className="leading-relaxed">
                All communications sent to our support desk are encrypted in transit via TLS 1.3 and stored in our audit-logged PostgreSQL relational cluster.
              </p>
              <div className="pt-2 border-t border-blue-200 dark:border-blue-900">
                <Link
                  to="/privacy/data-subject-request"
                  className="font-bold text-blue-700 dark:text-blue-300 hover:underline flex items-center gap-1"
                >
                  <span>Need to file a GDPR/NDPA DSR?</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactSupportPage;
