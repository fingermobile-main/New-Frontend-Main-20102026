import { Link} from 'react-router-dom';
import React, { useState } from 'react';


import MainLayout from '../components/layout/MainLayout';

import { useAppContext } from '../contexts/AppContext';  // Using absolute path from src
import { TrashIcon } from '../icons';
import { legalComplianceService } from '../services/legalComplianceService';

const AccountDeletionPage: React.FC = () => {
  const { ficBalance } = useAppContext();
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 p-3 rounded-xl">
              <TrashIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Account Deletion Request
              </h1>
              <p className="text-gray-600 mt-1">
                Permanently delete your FingerMobile account and all associated data
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Account Deletion Request
              </h1>
              <p className="text-gray-600 mb-6">
                Permanently delete your FingerMobile account and all associated
                data.
              </p>

              {!submitSuccess ? (
                <>
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <h3 className="text-lg font-medium text-red-800 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Important Information
                    </h3>
                    <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                      <li>This action is irreversible and cannot be undone</li>
                      <li>
                        All your posts, comments, and personal data will be
                        permanently deleted
                      </li>
                      <li>
                        Your membername may become available for others to use
                      </li>
                      <li>You will be logged out of all devices</li>
                      <li>
                        Some data may be retained for legal or security purposes
                      </li>
                    </ul>
                  </div>

                  {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-800 text-base">
                        {submitError}
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base" />
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base" />
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="reason"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Reason for deletion (optional)
                      </label>
                      <textarea
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base"
                      />
                    </div>

                    <div className="mb-8 flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="confirmDeletion"
                          name="confirmDeletion"
                          type="checkbox"
                          checked={formData.confirmDeletion}
                          onChange={handleChange}
                          required
                          className="focus:ring-red-500 h-5 w-5 text-red-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="confirmDeletion"
                          className="font-medium text-gray-700"
                        >
                          I understand that this action is permanent and cannot be
                          undone
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-3 rounded-lg font-medium text-white text-base ${
                          isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700'
                        }`}
                      >
                        {isSubmitting
                          ? 'Deleting Account...'
                          : 'Permanently Delete Account'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-10">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                    <svg
                      className="h-8 w-8 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">
                    Account Deletion Request Submitted
                  </h3>
                  <p className="mt-4 text-base text-gray-500">
                    Your account deletion request has been received. We will process
                    your request within 30 days. You will receive a confirmation
                    email once your account has been permanently deleted.
                  </p>
                  <div className="mt-8">
                    <Link
                      to="/"
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Return to Home
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <TrashIcon className="h-5 w-5 text-red-600 mr-2" />
                Your FIC Balance
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">{ficBalance.toFixed(2)} FIC</span>
                <button className="text-sm bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1.5 rounded-lg hover:from-red-700 hover:to-orange-700">
                  Add Funds
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Account Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-red-50 hover:to-orange-50 transition-colors flex items-center">
                  <TrashIcon className="h-5 w-5 text-red-600 mr-3" />
                  Deactivate Account
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-red-50 hover:to-orange-50 transition-colors flex items-center">
                  Download Data
                </button>
                <button className="w-full text-left px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-red-50 hover:to-orange-50 transition-colors flex items-center">
                  Change Password
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Account Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Consider deactivation instead</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Export your data first</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2">✓</span>
                  <span>Review privacy settings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AccountDeletionPage;
