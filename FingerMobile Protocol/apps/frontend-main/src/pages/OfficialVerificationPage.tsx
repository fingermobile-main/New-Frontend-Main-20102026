import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import MainLayout from '../components/layout/MainLayout';
import { ShieldCheckIcon, CheckCircleIcon, CreditCardIcon } from '../components/icons';

const OfficialVerificationPage: React.FC = () => {
  const { showToast, user, member } = useAppContext();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    entityType: 'Enterprise/Company',
    businessLegalName: '',
    businessRegistrationNumber: '',
  });

  const [docs, setDocs] = useState({
    businessRegistration: null as File | null,
    trademarkCertificate: null as File | null,
    legalRepId: null as File | null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: keyof typeof docs) => {
    if (e.target.files && e.target.files[0]) {
      setDocs(prev => ({ ...prev, [docType]: e.target.files![0] }));
    }
  };

  const handlePaymentSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = {
        userId: user?.id || member?.id || '1',
        businessLegalName: formData.businessLegalName || 'Enterprise Entity',
        businessRegistrationNumber: formData.businessRegistrationNumber || 'REG-PENDING',
        entityType: formData.entityType,
        documents: {
          businessRegistration: docs.businessRegistration?.name,
          trademarkCertificate: docs.trademarkCertificate?.name,
          legalRepId: docs.legalRepId?.name,
        },
        paymentAmount: '105'
      };

      const res = await (await import('../services/identityService')).identityService.submitOfficialVerification(payload);

      if (res.success) {
        setStep(4);
        showToast('Enterprise verification submitted successfully.', 'success');
      } else {
        showToast((res as any).error || 'Failed to submit verification.', 'error');
      }
    } catch (error: any) {
      showToast(error?.message || 'An error occurred during submission.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center mb-2">
          <ShieldCheckIcon className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Official Verification</h1>
        </div>
        <p className="text-gray-600 mb-8">Pathway C: Verify your business or brand for an Enterprise Account.</p>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold mb-4">Select Entity Type</h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-indigo-50 border-indigo-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">Enterprise / Company</h3>
                      <p className="text-sm text-slate-700">For registered businesses and corporations.</p>
                    </div>
                    <CheckCircleIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Business Legal Name</label>
                  <input
                    type="text"
                    value={formData.businessLegalName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessLegalName: e.target.value }))}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                    placeholder="e.g. Acme Corporation"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Business Registration Number</label>
                  <input
                    type="text"
                    value={formData.businessRegistrationNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessRegistrationNumber: e.target.value }))}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 placeholder:text-slate-400"
                  />
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.businessLegalName || !formData.businessRegistrationNumber}
                  className="mt-6 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Upload Corporate Documentation</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">1. Business Registration / Certificate of Incorporation</h3>
                  <p className="text-xs text-slate-700 mb-2">Upload your local Certificate of Incorporation or Business License. Must include certified translation if not in English.</p>
                  <input type="file" onChange={(e) => handleDocUpload(e, 'businessRegistration')} className="block w-full text-sm text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:text-sm file:font-semibold file:bg-white file:text-slate-900 hover:file:bg-white font-bold border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">2. Trademark Certificate</h3>
                  <p className="text-xs text-slate-700 mb-2">Upload your brand's trademark registration certificate to secure exclusive rights.</p>
                  <input type="file" onChange={(e) => handleDocUpload(e, 'trademarkCertificate')} className="block w-full text-sm text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:text-sm file:font-semibold file:bg-white file:text-slate-900 hover:file:bg-white font-bold border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">3. Legal Representative Identification</h3>
                  <p className="text-xs text-slate-700 mb-2">Provide the passport or local ID of the company's legal representative or authorized manager.</p>
                  <input type="file" onChange={(e) => handleDocUpload(e, 'legalRepId')} className="block w-full text-sm text-slate-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:text-sm file:font-semibold file:bg-white file:text-slate-900 hover:file:bg-white font-bold border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!docs.businessRegistration || !docs.trademarkCertificate || !docs.legalRepId}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Review & Payment</h2>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900">Platform Auditing Fee</h3>
                <p className="text-gray-600 text-sm mt-1">A mandatory, non-refundable annual fee for maintaining corporate status.</p>
                <div className="mt-4 text-3xl font-bold text-gray-900">$105.00 <span className="text-base font-normal text-slate-700">USD</span></div>
              </div>

              <div className="border border-slate-300 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-4">
                  <CreditCardIcon className="h-6 w-6 text-slate-700 mr-2" />
                  <span className="font-medium">International Credit Card</span>
                </div>
                <input type="text" placeholder="Card Number" className="w-full mb-3 px-4 py-2 border rounded-md text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
                <div className="flex space-x-3 mb-3">
                  <input type="text" placeholder="MM/YY" className="w-1/2 px-4 py-2 border rounded-md text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
                  <input type="text" placeholder="CVC" className="w-1/2 px-4 py-2 border rounded-md text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
                </div>
                <input type="text" placeholder="Name on Card" className="w-full px-4 py-2 border rounded-md text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  disabled={isLoading}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Pay $105 & Submit Application'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-8">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Under Review</h2>
              <p className="text-gray-600 mb-6">Your enterprise verification has been submitted successfully. The manual verification process for international businesses typically takes 1 to 4 months.</p>
              <button
                onClick={() => window.location.href = '/settings'}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Return to Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default OfficialVerificationPage;
