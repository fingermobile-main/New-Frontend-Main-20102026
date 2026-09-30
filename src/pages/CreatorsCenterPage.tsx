import React, { useState, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import apiService from '../services/apiService';
import MainLayout from '../components/layout/MainLayout';
import { CheckCircleIcon, ArrowRightIcon, CameraIcon } from '../icons';
import Webcam from 'react-webcam';

const CreatorsCenterPage: React.FC = () => {
  const { showToast, member: user } = useAppContext();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    legalName: '',
    nationality: '',
    passportNumber: '',
  });
  const [passportImage, setPassportImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const captureSelfie = React.useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setSelfieImage(imageSrc);
    }
  }, [webcamRef]);

  const handleSubmit = async () => {
    if (!formData.legalName || !formData.nationality || !formData.passportNumber || !passportImage || !selfieImage) {
      showToast('Please complete all fields and capture a selfie.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // The backend KYC endpoint expects JSON with userId, fullLegalName, dateOfBirth, biometricFaceData
      // For images, we should send base64 or upload them first and send URLs.
      // Here we assume base64 is sent in the JSON payload

      const payload = {
        userId: user?.id || 'temp-id',
        fullLegalName: formData.legalName,
        dateOfBirth: '2000-01-01', // TODO: Add dateOfBirth to formData
        biometricFaceData: selfieImage, // base64 string
        nationality: formData.nationality,
        idDocumentNumber: formData.passportNumber,
      };

      // We assume apiService automatically handles JSON serialization and auth headers
      await apiService.post('/api/kyc/submit', payload);

      setStep(5);
      showToast('Verification submitted successfully.', 'success');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to submit verification.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Creators Center & Services</h1>
        <p className="text-gray-600 mb-8">Upgrade to a Professional Creator Account to unlock monetization and advanced tools.</p>

        <div className="bg-white rounded-xl shadow-lg p-6">
          {step === 1 && (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Upgrade to Professional Account</h2>
              <p className="text-gray-600 mb-8">Access personalized monetization, Ads services, HallMark Page Boosting, and Live Broadcast features.</p>
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center mx-auto"
              >
                Start Verification <ArrowRightIcon className="h-5 w-5 ml-2" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Real-Name Authentication</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Legal Name</label>
                  <input
                    type="text"
                    name="legalName"
                    value={formData.legalName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="As it appears on your passport"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nationality</label>
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Passport Number</label>
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={() => setStep(3)}
                  disabled={!formData.legalName || !formData.nationality || !formData.passportNumber}
                  className="mt-6 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Submit Identification</h2>
              <p className="text-sm text-gray-600 mb-4">Upload a clear, high-resolution color scan or photo of your International Passport's information page.</p>

              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload a file</span>
                      <input type="file" className="sr-only" accept="image/*" onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setPassportImage(e.target.files[0]);
                        }
                      }} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>

              {passportImage && (
                <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md flex items-center">
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  {passportImage.name} attached.
                </div>
              )}

              <button
                onClick={() => setStep(4)}
                disabled={!passportImage}
                className="mt-6 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                Next Step
              </button>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold mb-6">Facial Verification</h2>
              <p className="text-sm text-gray-600 mb-4">Complete the live biometric scan to match your face to your passport photo.</p>

              {!selfieImage ? (
                <div className="flex flex-col items-center">
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full max-w-md rounded-lg shadow-sm mb-4"
                  />
                  <button
                    onClick={captureSelfie}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex items-center"
                  >
                    <CameraIcon className="h-5 w-5 mr-2" /> Capture Selfie
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <img src={selfieImage} alt="Selfie" className="w-full max-w-md rounded-lg shadow-sm mb-4" />
                  <button
                    onClick={() => setSelfieImage(null)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Retake
                  </button>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!selfieImage || isLoading}
                className="mt-6 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Submit Verification'}
              </button>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-8">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Under Review</h2>
              <p className="text-gray-600 mb-6">Your application for a Professional Creator Account has been submitted. The manual verification timeline takes 1 to 3 Months.</p>
              <button
                onClick={() => window.location.href = '/profile'}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Return to Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CreatorsCenterPage;
