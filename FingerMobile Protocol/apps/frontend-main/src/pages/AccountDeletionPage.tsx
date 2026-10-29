import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Trash2, ShieldAlert, Download, Home } from 'lucide-react';

import MainLayout from '../components/layout/MainLayout';
import { useAppContext } from '../contexts/AppContext';
import { TrashIcon } from '../icons';
import { legalComplianceService } from '../services/legalComplianceService';

const AccountDeletionPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    reason: '',
    confirmDeletion: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.confirmDeletion) {
      setSubmitError('Please confirm that you want to delete your account');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await legalComplianceService.requestAccountDeletion(formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form after successful submission
      setFormData({
        email: '',
        password: '',
        reason: '',
        confirmDeletion: false
      });
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(err.response?.data?.error || err.message || 'Failed to submit account deletion request');
    }
  };

  return (
    <MainLayout pageTitle="Account Deletion">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden pb-28 md:pb-12 text-slate-900">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-3 rounded-xl shadow-xs">
              <TrashIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Account Deletion Request
              </h1>
              <p className="text-slate-700 font-medium text-sm sm:text-base mt-1">
                Permanently delete your FingerMobile account and all associated data
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-slate-300">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">
                Account Deletion Request
              </h2>
              <p className="text-slate-700 font-medium mb-6">
                Permanently delete your FingerMobile account and all associated
                data.
              </p>

              {!submitSuccess ? (
                <>
                  <div className="mb-6 p-4 sm:p-5 bg-red-50 border border-red-200 rounded-xl">
                    <h3 className="text-base sm:text-lg font-bold text-red-900 mb-2 flex items-center">
                      <ShieldAlert className="w-5 h-5 mr-2 text-red-600 flex-shrink-0" />
                      Warning: This action is permanent!
                    </h3>
                    <p className="text-xs sm:text-sm text-red-800 font-medium leading-relaxed">
                      Deleting your account will permanently remove all your data,
                      including your profile, posts, connections, and sovereign credentials.
                      Any unspent FIC or in-platform assets may be lost and cannot be recovered.
                    </p>
                  </div>

                  {submitError && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-800 rounded-xl text-sm font-bold">
                      {submitError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 font-bold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-slate-400"
                        placeholder="Enter your registered email"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 font-bold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-slate-400"
                        placeholder="Enter your password to confirm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Reason for Deletion (Optional)
                      </label>
                      <textarea
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 bg-white border border-slate-300 text-slate-900 font-bold rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 placeholder:text-slate-400"
                        placeholder="Tell us why you are leaving"
                      />
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="confirmDeletion"
                          name="confirmDeletion"
                          type="checkbox"
                          checked={formData.confirmDeletion}
                          onChange={handleChange}
                          className="h-5 w-5 text-red-600 focus:ring-red-500 border-slate-300 rounded cursor-pointer"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="confirmDeletion" className="font-bold text-slate-900 cursor-pointer">
                          I understand that this action is irreversible and all my data will be permanently deleted.
                        </label>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting || !formData.confirmDeletion}
                        className="min-h-[44px] w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm"
                      >
                        {isSubmitting ? 'Submitting Request...' : 'Submit Deletion Request'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 text-emerald-800 mb-4 border border-emerald-300">
                    <TrashIcon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    Request Submitted Successfully
                  </h3>
                  <p className="mt-3 text-sm sm:text-base text-slate-700 font-medium max-w-lg mx-auto">
                    Your account deletion request has been received. We will process
                    your request within 30 days. You will receive a confirmation
                    email once your account has been permanently deleted.
                  </p>
                  <div className="mt-8">
                    <Link
                      to="/"
                      className="min-h-[44px] inline-flex items-center px-6 py-3 border border-slate-300 text-sm font-bold rounded-xl shadow-sm text-slate-800 bg-white hover:bg-slate-50 transition-colors"
                    >
                      Return to Home
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-300">
              <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4">Account Actions</h2>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => showToast('Temporary account deactivation requested', 'info')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center border border-slate-200 cursor-pointer min-h-[44px] font-bold text-slate-800 text-sm"
                >
                  <TrashIcon className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                  <span>Deactivate Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('GDPR Data export package prepared for download', 'success')}
                  className="w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center border border-slate-200 cursor-pointer min-h-[44px] font-bold text-slate-800 text-sm"
                >
                  <Download className="w-5 h-5 text-slate-700 mr-3 flex-shrink-0" />
                  <span>Download Data</span>
                </button>
                <Link
                  to="/change-password"
                  className="block w-full text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200 min-h-[44px] font-bold text-slate-800 text-sm leading-normal flex items-center"
                >
                  <span className="ml-1">Change Password</span>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 shadow-xs">
              <h3 className="font-black text-slate-900 mb-2">Account Tips</h3>
              <ul className="space-y-2 text-sm text-slate-800 font-medium">
                <li className="flex items-start">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  <span>Consider deactivation instead</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  <span>Export your data first</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-600 font-black mr-2">✓</span>
                  <span>Review privacy settings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sovereign Mobile Navigation Quick Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 py-2 px-4 md:hidden shadow-lg safe-area-bottom">
        <div className="flex justify-around items-center max-w-md mx-auto">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-red-600 font-bold"
            aria-label="Deletion Form"
          >
            <Trash2 className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Delete</span>
          </button>
          <button
            onClick={() => showToast('GDPR Data export package prepared for download', 'success')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Export Data"
          >
            <Download className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Export</span>
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Settings Page"
          >
            <ShieldAlert className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Security</span>
          </button>
          <button
            onClick={() => navigate('/forum')}
            className="flex flex-col items-center justify-center min-w-[44px] min-h-[44px] text-slate-700 dark:text-slate-300 font-medium"
            aria-label="Back to Forum"
          >
            <Home className="w-5 h-5 mb-1" />
            <span className="text-[10px]">Forum</span>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default AccountDeletionPage;
